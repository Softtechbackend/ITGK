'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AgreementPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;

  const [formData, setFormData] = useState({
    agreement_date: '',
    payment_terms: '',
    maintenance_period: '',
    termination_clause: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/applications/' + applicationId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_type: 'agreement',
          form_data: formData,
        }),
      });

      if (response.ok) {
        router.push(`/applications/${applicationId}`);
      } else {
        setError('Failed to save agreement');
      }
    } catch (err) {
      setError('Error saving agreement');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const response = await fetch('/api/documents/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: applicationId,
          document_type: 'agreement',
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'agreement.pdf';
        a.click();
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Agreement</CardTitle>
            <CardDescription>Create a vendor agreement for application {applicationId}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

              <div>
                <label className="block text-sm font-medium mb-2">Agreement Date</label>
                <Input
                  type="date"
                  name="agreement_date"
                  value={formData.agreement_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Terms</label>
                <textarea
                  name="payment_terms"
                  value={formData.payment_terms}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md"
                  rows={3}
                  placeholder="e.g., 50% upfront, 50% on completion"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Maintenance Period</label>
                <Input
                  name="maintenance_period"
                  value={formData.maintenance_period}
                  onChange={handleChange}
                  placeholder="e.g., 5 years"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Termination Clause</label>
                <textarea
                  name="termination_clause"
                  value={formData.termination_clause}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Agreement'}
                </Button>
                <Button type="button" variant="outline" onClick={handleGeneratePDF}>
                  Generate PDF
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
