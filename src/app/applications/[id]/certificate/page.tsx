'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CertificatePage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;

  const [formData, setFormData] = useState({
    completion_date: '',
    inspected_by: '',
    system_performance: '',
    issues_rectified: '',
    customer_signature_date: '',
    remarks: '',
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
          form_type: 'certificate',
          form_data: formData,
        }),
      });

      if (response.ok) {
        router.push(`/applications/${applicationId}`);
      } else {
        setError('Failed to save certificate');
      }
    } catch (err) {
      setError('Error saving certificate');
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
          document_type: 'certificate',
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'work-completion-certificate.pdf';
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
            <CardTitle>Work Completion Certificate</CardTitle>
            <CardDescription>Document work completion for application {applicationId}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

              <div>
                <label className="block text-sm font-medium mb-2">Completion Date</label>
                <Input
                  type="date"
                  name="completion_date"
                  value={formData.completion_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Inspected By</label>
                <Input
                  name="inspected_by"
                  value={formData.inspected_by}
                  onChange={handleChange}
                  placeholder="Inspector name and ID"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">System Performance</label>
                <textarea
                  name="system_performance"
                  value={formData.system_performance}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md"
                  rows={3}
                  placeholder="Details about system performance and testing"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Issues Rectified</label>
                <textarea
                  name="issues_rectified"
                  value={formData.issues_rectified}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md"
                  rows={3}
                  placeholder="Any issues found and rectified"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Customer Signature Date</label>
                <Input
                  type="date"
                  name="customer_signature_date"
                  value={formData.customer_signature_date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Certificate'}
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
