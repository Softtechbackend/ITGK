import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    // Get total applications
    const { data: applications, error: appError } = await supabase
      .from('applications')
      .select('id, status')
      .then(result => result);

    if (appError) throw appError;

    // Get total partners
    const { data: partners, error: partnerError } = await supabase
      .from('partners')
      .select('id')
      .then(result => result);

    if (partnerError) throw partnerError;

    // Get total invoices
    const { data: invoices, error: invoiceError } = await supabase
      .from('invoices')
      .select('amount')
      .then(result => result);

    if (invoiceError) throw invoiceError;

    const stats = {
      totalApplications: applications?.length || 0,
      totalPartners: partners?.length || 0,
      totalRevenue: invoices?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0,
      applicationsByStatus: {
        draft: applications?.filter(a => a.status === 'draft').length || 0,
        submitted: applications?.filter(a => a.status === 'submitted').length || 0,
        approved: applications?.filter(a => a.status === 'approved').length || 0,
        rejected: applications?.filter(a => a.status === 'rejected').length || 0,
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
