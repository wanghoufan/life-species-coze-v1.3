import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase-admin';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const supabase = getAdminClient();
    
    // Generate a random run token
    const runToken = crypto.randomBytes(24).toString('base64url');
    const runTokenHash = crypto.createHash('sha256').update(runToken).digest('hex');
    
    // Create the run
    const { data, error } = await supabase
      .from('test_runs')
      .insert({
        run_token_hash: runTokenHash,
        status: 'in_progress',
        test_version: 'mvp-1.2',
        scorer_version: 'mvp-1.2-calibrated',
      } as any)
      .select('id')
      .single();
    
    if (error) {
      console.error('Failed to create run:', error);
      return NextResponse.json({ error: 'Failed to create run' }, { status: 500 });
    }
    
    return NextResponse.json({
      runId: (data as any).id,
      runToken,
    });
  } catch (e) {
    console.error('Start run error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}