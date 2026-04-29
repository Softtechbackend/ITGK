'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/users/profile');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          router.push('/dashboard');
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">PM SURYAGHAR</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push('/auth/login')}>
              Login
            </Button>
            <Button onClick={() => router.push('/auth/register')}>Register</Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-16">
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Rooftop Solar Installation Made Easy</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join PM SURYAGHAR scheme and manage your solar installation applications efficiently
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => router.push('/auth/register')}>
              Register as Partner
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/auth/login')}>
              Sign In
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Easy Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Simple 4-step registration process to get started as a partner
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Digital Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate quotations, agreements, and invoices in PDF format
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referral Network</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Expand your network and earn through referrals
              </CardDescription>
            </CardContent>
          </Card>
        </section>

        <section className="bg-primary/10 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of partners managing solar installations through our platform
          </p>
          <Button size="lg" onClick={() => router.push('/auth/register')}>
            Start Your Journey Today
          </Button>
        </section>
      </main>
    </div>
  );
}
