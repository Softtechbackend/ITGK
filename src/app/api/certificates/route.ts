import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { applicationId, completedDate, notes, certifiedBy } = data;

    const { data: certificate, error } = await supabase
      .from('work_completion_certificates')
      .insert({
        application_id: applicationId,
        completed_date: completedDate,
        certified_by_id: certifiedBy,
        status: 'draft',
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(certificate);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create certificate' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');

    if (applicationId) {
      const { data, error } = await supabase
        .from('work_completion_certificates')
        .select('*')
        .eq('application_id', applicationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return NextResponse.json(data || null);
    }

    const { data, error } = await supabase
      .from('work_completion_certificates')
      .select('*');

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}
