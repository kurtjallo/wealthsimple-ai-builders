import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = supabase
      .from('cases')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by status if provided
    if (status) {
      // Support comma-separated status values for grouping
      const statuses = status.split(',').map(s => s.trim());
      if (statuses.length === 1) {
        query = query.eq('status', statuses[0]);
      } else {
        query = query.in('status', statuses);
      }
    }

    const { data: cases, error, count } = await query;

    if (error) {
      console.error('Error fetching cases:', error);
      return NextResponse.json(
        { error: 'Failed to fetch cases' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      cases: cases || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Cases API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
