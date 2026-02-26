import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();

    const { data: caseData, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(caseData);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
