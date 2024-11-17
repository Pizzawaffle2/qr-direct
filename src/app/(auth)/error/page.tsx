'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const getErrorMessage = (error: string | null) => {
  switch (error) {
    case 'OAuthAccountNotLinked':
      return {
        title: 'Account Already Exists',
        message: 'An account with this email already exists using a different sign-in method. Please sign in using your original method.',
        action: '/login'
      };
    case 'AccessDenied':
      return {
        title: 'Access Denied',
        message: 'You do not have permission to sign in. Please contact support if you think this is a mistake.',
        action: '/login'
      };
    case 'CredentialsSignin':
      return {
        title: 'Invalid Credentials',
        message: 'The email or password you entered is incorrect. Please try again.',
        action: '/login'
      };
    case 'EmailSignin':
      return {
        title: 'Email Sign In Failed',
        message: 'The email sign in link is invalid or has expired. Please try again.',
        action: '/login'
      };
    default:
      return {
        title: 'Authentication Error',
        message: 'An error occurred during authentication. Please try again.',
        action: '/login'
      };
  }
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  const { title, message, action } = getErrorMessage(error);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Authentication Error</h1>
      </div>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>

      <div className="flex flex-col gap-4">
        <Button asChild>
          <Link href={action}>
            Try Again
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}