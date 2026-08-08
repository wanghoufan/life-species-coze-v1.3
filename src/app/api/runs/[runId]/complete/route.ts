import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase-admin';
import crypto from 'crypto';

let scorer: any = null;
async function getScorer() {
  if (!scorer) {
    scorer = await import('@/../life_species_calibrated_scorer_v1.mjs');
  }
  return scorer;
}

function generateShareCode(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let code = '';
  const bytes = crypto.randomBytes(10);
  for (let i = 0; i < 10; i++) {
    code += chars[bytes[i] % 62];
  }
  return code;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const { runId } = await params;
    const supabase = getAdminClient();
    const { runToken, answers } = await request.json();
    
    if (!runToken || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Missing runToken or answers' }, { status: 400 });
    }
    
    // Verify the run exists
    const { data: runRaw, error: runError } = await supabase
      .from('test_runs')
      .select('id, run_token_hash, status')
      .eq('id', runId)
      .single();
    
    if (runError || !runRaw) {
      return NextResponse.json({ error: 'Run not found' }, { status: 404 });
    }
    
    const run = runRaw as any;
    
    // Verify run token
    const tokenHash = crypto.createHash('sha256').update(runToken).digest('hex');
    if (run.run_token_hash !== tokenHash) {
      return NextResponse.json({ error: 'Invalid run token' }, { status: 403 });
    }
    
    // Idempotent: if already completed, return existing result
    if (run.status === 'completed') {
      const { data: existingSnapshot } = await supabase
        .from('result_snapshot')
        .select('*')
        .eq('run_id', runId)
        .single();
      
      if (existingSnapshot) {
        const snap = existingSnapshot as any;
        const snapData = snap.snapshot as any;
        const { data: speciesContent } = await supabase
          .from('species_content')
          .select('*')
          .in('species_key', [
            snapData.mainSpeciesKey,
            ...(snapData.secondarySpeciesKeys || []),
          ]);
        
        const normalizeTags = (raw: any): string[] => {
          if (Array.isArray(raw)) return raw;
          if (typeof raw === 'string' && raw.trim().length > 0) {
            return raw.split(/[、,，]/).map((t: string) => t.trim()).filter(Boolean);
          }
          return [];
        };
        const scList = (speciesContent as any[]) || [];
        const normalizeSpecies = (s: any) => ({
          ...s,
          summon_tags: normalizeTags(s.summon_tags),
          food_tags: normalizeTags(s.food_tags),
        });

        return NextResponse.json({
          runId,
          shareCode: snap.share_code,
          mainSpecies: normalizeSpecies(scList.find((s: any) => s.species_key === snapData.mainSpeciesKey)) || null,
          secondarySpecies: scList
            .filter((s: any) => (snapData.secondarySpeciesKeys || []).includes(s.species_key))
            .map(normalizeSpecies),
          status: 'already_completed',
        });
      }
    }
    
    // Run the scorer
    const { score, validateAnswers } = await getScorer();
    
    // Validate answers
    const validation = validateAnswers(answers);
    if (!validation.valid) {
      return NextResponse.json({ error: 'Invalid answers', details: validation.errors }, { status: 400 });
    }
    
    // Score the answers
    const result = score(answers);
    
    // Generate share code
    let shareCode = generateShareCode();
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await supabase
        .from('result_snapshot')
        .select('id')
        .eq('share_code', shareCode)
        .maybeSingle();
      if (!existing) break;
      shareCode = generateShareCode();
    }
    
    // Save answers
    const answersData = answers.map((a: any) => ({
      run_id: runId,
      question_number: a.q,
      selected_options: a.options,
    }));
    
    await supabase.from('test_answers').insert(answersData as any);
    
    // Save dimension scores
    if (result.dims) {
      const dimScoresData = Object.entries(result.dims as Record<string, number>).map(([key, value]) => ({
        run_id: runId,
        dimension_key: key,
        score: value,
      }));
      await supabase.from('dimension_scores').insert(dimScoresData as any);
    }
    
    // Create result snapshot
    const snapshot = {
      run_id: runId,
      share_code: shareCode,
      snapshot: {
        schemaVersion: 'result-snapshot-1',
        testVersion: 'mvp-1.2',
        scorerVersion: 'mvp-1.2-calibrated',
        mainSpeciesKey: result.mainSpeciesKey,
        secondarySpeciesKeys: result.secondarySpeciesKeys,
        completedAt: new Date().toISOString(),
      },
    };
    
    const { error: snapshotError } = await supabase
      .from('result_snapshot')
      .insert(snapshot as any);
    
    if (snapshotError) {
      console.error('Failed to save snapshot:', snapshotError);
      return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
    }
    
    // Mark run as completed
    await (supabase
      .from('test_runs') as any)
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        main_species_key: result.mainSpeciesKey,
        secondary_species_keys: result.secondarySpeciesKeys,
        share_code: shareCode,
      })
      .eq('id', runId);
    
    // Get species content for response
    const { data: speciesContent } = await supabase
      .from('species_content')
      .select('*')
      .in('species_key', [
        result.mainSpeciesKey,
        ...result.secondarySpeciesKeys,
      ]);
    
    const speciesList = (speciesContent as any[]) || [];

    const normalizeTags = (raw: any): string[] => {
      if (Array.isArray(raw)) return raw;
      if (typeof raw === 'string' && raw.trim().length > 0) {
        return raw.split(/[、,，]/).map((t: string) => t.trim()).filter(Boolean);
      }
      return [];
    };
    const normalizeSpecies = (s: any) => ({
      ...s,
      summon_tags: normalizeTags(s.summon_tags),
      food_tags: normalizeTags(s.food_tags),
    });

    return NextResponse.json({
      runId,
      shareCode,
      mainSpeciesKey: result.mainSpeciesKey,
      secondarySpeciesKeys: result.secondarySpeciesKeys,
      dimensionScores: result.dimensionScores,
      mainSpecies: normalizeSpecies(speciesList.find((s: any) => s.species_key === result.mainSpeciesKey)) || null,
      secondarySpecies: speciesList
        .filter((s: any) => result.secondarySpeciesKeys.includes(s.species_key))
        .map(normalizeSpecies),
      status: 'completed',
    });
  } catch (e) {
    console.error('Complete run error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}