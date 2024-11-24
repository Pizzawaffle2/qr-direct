'use client';

import {useState } from 'react';
import {signIn } from 'next-auth/react';
import {Button } from '@/components/ui/button';
import {Input } from '@/components/ui/input';
import {Label } from '@/components/ui/label';
import {Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import {Github, Mail, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {useSearchParams, useRouter } from 'next/navigation';
import {useToast } from '@/components/ui/use-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [isLoading, setIsLoading] = useState<{
    credentials: boolean;
    google: boolean;
    github: boolean;
  }>({
    credentials: false,
    google: false,
    github: false,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading.credentials) return;

    try {
      setIsLoading((prev) => ({ ...prev, credentials: true }));

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      // Sign in after successful registration
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, credentials: false }));
    }
  };

  const handleProviderSignIn = async (provider: 'google' | 'github') => {
    if (isLoading[provider]) return;

    try {
      setIsLoading((prev) => ({ ...prev, [provider]: true }));
      await signIn(provider, {
        callbackUrl,
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className="w-full max-w-lg">
      {/* Back Button Header */}
      <div className="mb-4 flex items-center">
        <Button
          variant="ghost"
          className="text-slate-400 hover:text-white"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      <Card className="w-full border-slate-800 bg-slate-900/50">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="mt-2 text-gray-400">Get started with your free account</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                disabled={isLoading.credentials}
                required
                className="border-slate-700 bg-slate-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                disabled={isLoading.credentials}
                required
                className="border-slate-700 bg-slate-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                disabled={isLoading.credentials}
                required
                className="border-slate-700 bg-slate-800"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading.credentials || isLoading.google || isLoading.github}
            >
              {isLoading.credentials ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-900 px-2 text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full bg-white text-gray-900 hover:bg-gray-100"
              onClick={() => handleProviderSignIn('google')}
              disabled={isLoading.google || isLoading.credentials}
            >
              {isLoading.google ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleProviderSignIn('github')}
              disabled={isLoading.github || isLoading.credentials}
            >
              {isLoading.github ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Github className="mr-2 h-4 w-4" />
              )}
              Continue with GitHub
            </Button>
          </div>

          <div className="text-center text-xs text-slate-400">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-blue-400 hover:text-blue-300">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </Link>
          </div>
        </CardContent>
        <CardFooter>
          <p className="w-full text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
