'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Github, Mail } from 'lucide-react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const error = searchParams?.get('error');

  const handleSignIn = async (provider: string) => {
    try {
      await signIn(provider, {
        callbackUrl,
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400 mb-6">Sign in to continue</p>
        {error && (
          <div className="text-red-400 mb-4">
            {error === 'OAuthAccountNotLinked' 
              ? 'Email already associated with another provider.'
              : 'Error signing in. Please try again.'}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Button
          className="w-full bg-white hover:bg-gray-100 text-gray-900"
          onClick={() => handleSignIn('google')}
        >
          <Mail className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleSignIn('github')}
        >
          <Github className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>
      </div>
    </>
  );
}