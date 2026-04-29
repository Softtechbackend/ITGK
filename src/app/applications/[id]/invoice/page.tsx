'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function InvoicePage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;

  const [formData, setFormData] = useState({
    invoice_date: '',
    due_date: '',
    gst_number: '',
    invoice_number: '',
    payment_method: '',
    bank_details: '',
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
          form_type: 'invoice',
          form_data: formData,
        }),
      });

      if (response.ok) {
        router.push(`/applications/${applicationId}`);
      } else {
        setError('Failed to save invoice');
      }
    } catch (err) {
      setError('Error saving invoice');
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
          document_type: 'invoice',
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoice.pdf';
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
            <CardTitle>Invoice</CardTitle>
            <CardDescription>Generate invoice for application {applicationId}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

              <div>
                <label className="block text-sm font-medium mb-2">Invoice Date</label>
                <Input
                  type="date"
                  name="invoice_date"
                  value={formData.invoice_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <Input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Invoice Number</label>
                <Input
                  name="invoice_number"
                  value={formData.invoice_number}
                  onChange={handleChange}
                  placeholder="e.g., INV-2024-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">GST Number</label>
                <Input
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleChange}
                  placeholder="Your GST number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <Input
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  placeholder="e.g., Bank Transfer, Cheque"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bank Details</label>
                <textarea
                  name="bank_details"
                  value={formData.bank_details}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md"
                  rows={3}
                  placeholder="Bank name, account number, IFSC code"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Invoice'}
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
