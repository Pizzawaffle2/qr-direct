'use client';

import {useState } from 'react';
import {Button } from '@/components/ui/button';
import {Input } from '@/components/ui/input';
import {Alert, AlertDescription } from '@/components/ui/alert';
import {Mail } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
      console.error('Failed to reset password:&apos;, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Reset Password</h1>
        <p className="mt-2 text-gray-400">
          Enter your email address and we&apos;ll send you a link to reset your password
        </p>
      </div>

      {status === 'success&apos; ? (
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            If an account exists with {email}, you will receive a password reset link shortly.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-white/10 bg-white/5"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? &apos;Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      )}

      <div className="text-center">
        <Button variant="link" asChild>
          <Link href="/login">Back to Login</Link>
        </Button>
      </div>
    </div>
  );
}
