import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareCode: string }> }
) {
  try {
    const { shareCode } = await params;
    const supabase = getAdminClient();
    
    // Get the result snapshot
    const { data: snapshot, error: snapshotError } = await supabase
      .from('result_snapshot')
      .select('*')
      .eq('share_code', shareCode)
      .single();
    
    if (snapshotError || !snapshot) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }
    
    const snap = snapshot as any;
    const data = snap.snapshot as any;
    const mainSpeciesKey = data.mainSpeciesKey;
    const secondarySpeciesKeys = data.secondarySpeciesKeys;
    
    // Get species content
    const { data: speciesContent } = await supabase
      .from('species_content')
      .select('*')
      .in('species_key', [mainSpeciesKey, ...secondarySpeciesKeys]);
    
    // Get dimension scores
    const { data: dimScores } = await supabase
      .from('dimension_scores')
      .select('dimension_key, score')
      .eq('run_id', snap.run_id);
    
    // Get run info
    const { data: run } = await supabase
      .from('test_runs')
      .select('test_version, scorer_version, completed_at')
      .eq('id', snap.run_id)
      .single();
    
    const runData = run as any;
    
    return NextResponse.json({
      shareCode,
      testVersion: runData?.test_version || data.testVersion,
      scorerVersion: runData?.scorer_version || data.scorerVersion,
      completedAt: runData?.completed_at || data.completedAt,
      mainSpecies: (speciesContent as any[])?.find((s: any) => s.species_key === mainSpeciesKey) || null,
      secondarySpecies: (speciesContent as any[])?.filter((s: any) => secondarySpeciesKeys.includes(s.species_key)) || [],
      dimensionScores: (dimScores as any[]) || [],
    });
  } catch (e) {
    console.error('Get result error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}