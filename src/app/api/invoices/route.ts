import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { applicationId, quotationId, amount, dueDate } = data;

    const issuedDate = new Date().toISOString();
    const dueDateObj = new Date(dueDate).toISOString();

    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        application_id: applicationId,
        quotation_id: quotationId,
        amount,
        status: 'draft',
        issued_date: issuedDate,
        due_date: dueDateObj,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create invoice' },
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
        .from('invoices')
        .select('*')
        .eq('application_id', applicationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return NextResponse.json(data || null);
    }

    const { data, error } = await supabase
      .from('invoices')
      .select('*');

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}
