'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface AdminMetrics {
  total_users: number;
  total_partners: number;
  total_applications: number;
  pending_approvals: number;
  total_templates: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/analytics/dashboard');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const handleTemplateUpload = async () => {
    if (!templateFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', templateFile);

      const response = await fetch('/api/templates/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Template uploaded successfully');
        setTemplateFile(null);
      } else {
        alert('Failed to upload template');
      }
    } catch (error) {
      alert('Error uploading template');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">System management and oversight</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
              <CardDescription>System users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metrics?.total_users || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Partners</CardTitle>
              <CardDescription>Registered partners</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metrics?.total_partners || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>Total applications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metrics?.total_applications || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{metrics?.pending_approvals || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
              <CardDescription>Uploaded templates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metrics?.total_templates || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Template Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Document Templates</CardTitle>
            <CardDescription>Upload Word (.docx) files for quotations, agreements, and certificates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".docx,.doc"
                onChange={(e) => setTemplateFile(e.target.files?.[0] || null)}
                disabled={uploading}
              />
              <Button 
                onClick={handleTemplateUpload} 
                disabled={!templateFile || uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Template'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Management Section */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage system users and their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">User management interface coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
