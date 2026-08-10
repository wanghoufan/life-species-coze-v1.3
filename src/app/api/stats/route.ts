import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const supabase = getAdminClient();

    // Get total completed count
    const { count: total, error: totalError } = await supabase
      .from('test_runs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    if (totalError) {
      return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
    }

    // Get distribution by main_species_key
    const { data: distribution, error: distError } = await supabase
      .from('test_runs')
      .select('main_species_key', { count: 'exact' })
      .eq('status', 'completed')
      .not('main_species_key', 'is', null);

    if (distError) {
      return NextResponse.json({ error: 'Failed to get distribution' }, { status: 500 });
    }

    // Count by species key
    const countMap: Record<string, number> = {};
    (distribution as any[]).forEach((r) => {
      const key = r.main_species_key;
      countMap[key] = (countMap[key] || 0) + 1;
    });

    // Get species content for all matched keys
    const keys = Object.keys(countMap);
    if (keys.length === 0) {
      return NextResponse.json({
        total: 0,
        species: [],
      });
    }

    const { data: speciesContent } = await supabase
      .from('species_content')
      .select('species_key, name, image_url, family, display_order')
      .in('species_key', keys);

    const speciesMap = new Map<string, any>();
    (speciesContent as any[] || []).forEach((s) => {
      speciesMap.set(s.species_key, s);
    });

    // Build response
    const species = keys
      .map((key) => {
        const info = speciesMap.get(key) || {};
        return {
          speciesKey: key,
          name: info.name || key,
          imageUrl: info.image_url || '',
          family: info.family || '',
          displayOrder: info.display_order || 99,
          count: countMap[key],
          percentage: total ? Math.round((countMap[key] / total) * 100) : 0,
        };
      })
      .sort((a, b) => b.count - a.count || a.displayOrder - b.displayOrder);

    return NextResponse.json({
      total,
      species,
    });
  } catch (e) {
    console.error('Stats error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}