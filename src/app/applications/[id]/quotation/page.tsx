'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function QuotationPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;

  const [formData, setFormData] = useState({
    system_capacity_kw: '',
    estimated_cost: '',
    installation_timeline: '',
    warranty_period: '',
    equipment_details: '',
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
          form_type: 'quotation',
          form_data: formData,
        }),
      });

      if (response.ok) {
        router.push(`/applications/${applicationId}`);
      } else {
        setError('Failed to save quotation');
      }
    } catch (err) {
      setError('Error saving quotation');
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
          document_type: 'quotation',
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotation.pdf';
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
            <CardTitle>Quotation</CardTitle>
            <CardDescription>Create a quotation for application {applicationId}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

              <div>
                <label className="block text-sm font-medium mb-2">System Capacity (kW)</label>
                <Input
                  type="number"
                  name="system_capacity_kw"
                  value={formData.system_capacity_kw}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estimated Cost</label>
                <Input
                  type="number"
                  name="estimated_cost"
                  value={formData.estimated_cost}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Installation Timeline</label>
                <Input
                  name="installation_timeline"
                  value={formData.installation_timeline}
                  onChange={handleChange}
                  placeholder="e.g., 4-6 weeks"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Warranty Period</label>
                <Input
                  name="warranty_period"
                  value={formData.warranty_period}
                  onChange={handleChange}
                  placeholder="e.g., 5 years"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Equipment Details</label>
                <textarea
                  name="equipment_details"
                  value={formData.equipment_details}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Quotation'}
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
