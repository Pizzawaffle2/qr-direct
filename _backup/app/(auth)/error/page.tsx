'use client';

import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: { [key: string]: { title: string; description: string } } = {
    Configuration: {
      title: 'Server Configuration Error',
      description: 'There is a problem with the server configuration. Please try again later.',
    },
    AccessDenied: {
      title: 'Access Denied',
      description:
        'You do not have permission to sign in. Please contact support if you believe this is a mistake.',
    },
    Verification: {
      title: 'Verification Failed',
      description:
        'The verification code has expired or has already been used. Please request a new verification code.',
    },
    CredentialsSignin: {
      title: 'Invalid Credentials',
      description: 'The email or password you entered is incorrect. Please try again.',
    },
    Default: {
      title: 'Authentication Error',
      description: 'An error occurred during authentication. Please try again.',
    },
  };

  const { title, description } = errorMessages[error || 'Default'];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="animate-gradient-xy absolute inset-0 bg-gradient-to-tr from-red-500/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:radial-gradient(white,transparent_85%)]" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-screen items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="relative overflow-hidden border-slate-800/50 bg-slate-900/50">
            <div className="px-12 pb-8 pt-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-red-500 to-purple-500 p-1">
                  <div className="h-full w-full rounded-full bg-slate-950 p-2">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-purple-500">
                      <AlertCircle className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="space-y-2 text-center">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-red-500"
                >
                  {title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-gray-400"
                >
                  {description}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 space-y-4"
              >
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                >
                  <Link href="/login">Try Again</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-white/10 bg-white/5 hover:bg-white/10"
                >
                  <Link href="/">Return Home</Link>
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
