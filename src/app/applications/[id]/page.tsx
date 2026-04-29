'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ApplicationData {
  id: string;
  applicant_name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  roof_type: string;
  roof_area: string;
  location: string;
  current_electricity: string;
  monthly_consumption: string;
  created_at: string;
}

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;

  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/applications/${applicationId}`);
        if (response.ok) {
          const data = await response.json();
          setApplication(data.application);
        }
      } catch (error) {
        console.error('Error fetching application:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!application) {
    return <div className="flex items-center justify-center min-h-screen">Application not found</div>;
  }

  const forms = [
    { type: 'quotation', label: 'Quotation', route: `/applications/${applicationId}/quotation` },
    { type: 'agreement', label: 'Vendor Agreement', route: `/applications/${applicationId}/agreement` },
    { type: 'certificate', label: 'Work Completion', route: `/applications/${applicationId}/certificate` },
    { type: 'invoice', label: 'Invoice', route: `/applications/${applicationId}/invoice` },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          ← Back
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{application.applicant_name}</CardTitle>
                <CardDescription>{application.email}</CardDescription>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {application.status}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p>{application.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p>{application.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p>{application.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <p>{application.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Roof Type</label>
                <p>{application.roof_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Roof Area</label>
                <p>{application.roof_area} sqft</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Electricity</label>
                <p>{application.current_electricity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Monthly Consumption</label>
                <p>{application.monthly_consumption} kWh</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents & Forms</CardTitle>
            <CardDescription>Generate or update documents for this application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {forms.map(form => (
                <Button
                  key={form.type}
                  onClick={() => router.push(form.route)}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center"
                >
                  <span className="font-semibold">{form.label}</span>
                  <span className="text-xs text-muted-foreground">Create or Edit</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
