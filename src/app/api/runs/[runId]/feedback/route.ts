import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase-admin';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const { runId } = await params;
    const supabase = getAdminClient();
    const { rating } = await request.json();
    
    if (!rating || ![1, 2, 3, 4].includes(rating)) {
      return NextResponse.json({ error: 'Rating must be 1-4 (完全不像/有一点/挺像/太准了)' }, { status: 400 });
    }
    
    // Check if run exists
    const { data: run } = await supabase
      .from('test_runs')
      .select('id')
      .eq('id', runId)
      .single();
    
    if (!run) {
      return NextResponse.json({ error: 'Run not found' }, { status: 404 });
    }
    
    // Upsert feedback
    const { error } = await supabase
      .from('feedback')
      .upsert({
        run_id: runId,
        feedback_value: rating,
      } as any, { onConflict: 'run_id' });
    
    if (error) {
      console.error('Failed to save feedback:', error);
      return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Feedback error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}