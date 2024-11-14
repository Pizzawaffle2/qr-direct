'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Github, Mail } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleProviderSignIn = async (provider: string) => {
    try {
      await signIn(provider, {
        callbackUrl,
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <Card className="w-full bg-slate-900/50 border-slate-800">
      <CardHeader>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">
            Get started with your free account
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full bg-white hover:bg-gray-100 text-gray-900"
          onClick={() => handleProviderSignIn('google')}
        >
          <Mail className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleProviderSignIn('github')}
        >
          <Github className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-slate-900 px-2 text-slate-400">
              By continuing, you agree to our Terms of Service
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-center w-full text-sm text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}