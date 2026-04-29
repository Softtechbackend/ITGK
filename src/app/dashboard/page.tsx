'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/profile');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>New Application</CardTitle>
              <CardDescription>Register for Solar Installation</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/applications/register')} className="w-full">
                Register Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
              <CardDescription>View your applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/applications')} className="w-full">
                View All
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Referrals</CardTitle>
              <CardDescription>Track your referrals</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/referrals')} className="w-full">
                View Referrals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
