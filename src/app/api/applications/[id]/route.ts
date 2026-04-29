import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { application: data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Server error: ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const body = await request.json();
    const { status, personal_info, property_details, business_info } = body;

    const { data, error } = await supabase
      .from('applications')
      .update({
        status,
        personal_info: personal_info || undefined,
        property_details: property_details || undefined,
        business_info: business_info || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, application: data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Server error: ${error}` },
      { status: 500 }
    );
  }
}
