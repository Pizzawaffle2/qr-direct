'use client';

import {useState } from 'react';
import {signIn } from 'next-auth/react';
import {useSearchParams } from 'next/navigation';
import {Button } from '@/components/ui/button';
import {Input } from '@/components/ui/input';
import {Label } from '@/components/ui/label';
import {Github, Mail, Loader2, ArrowRight } from 'lucide-react';
import {Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Separator } from '@/components/ui/separator';
import Link from 'next/link';
import {motion, AnimatePresence } from 'framer-motion';

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  tap: {
    scale: 0.98,
  },
};

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const error = searchParams?.get('error');

  const [isLoading, setIsLoading] = useState<{
    credentials: boolean;
    google: boolean;
    github: boolean;
  }>({
    credentials: false,
    google: false,
    github: false,
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(error ?? null);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading.credentials) return;

    try {
      setIsLoading((prev) => ({ ...prev, credentials: true }));
      setAuthError(null);

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setAuthError(result.error);
      }
    } catch (error) {
      setAuthError('An unexpected error occurred');
    } finally {
      setIsLoading((prev) => ({ ...prev, credentials: false }));
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    if (isLoading[provider]) return;
    try {
      setIsLoading((prev) => ({ ...prev, [provider]: true }));
      signIn(provider, {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error('Sign in error:&apos;, error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container flex h-screen w-screen flex-col items-center justify-center p-4"
    >
      <Card className="w-full max-w-sm border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-1">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardTitle className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-center text-2xl font-bold text-transparent text-white">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-gray-300/80">
              Sign in to your account to continue
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence mode="wait">
            {authError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: &apos;auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200 backdrop-blur-sm"
              >
                {authError === 'OAuthAccountNotLinked'
                  ? 'Email already associated with another provider.'
                  : authError === 'AccessDenied'
                    ? 'Access denied. Please try again.'
                    : authError === 'CredentialsSignin'
                      ? 'Invalid email or password.'
                      : authError}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleCredentialsLogin}
            className="space-y-4"
          >
            <motion.div variants={formVariants} custom={1} className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading.credentials}
                required
                className="border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:border-white/40 focus:ring-white/40"
              />
            </motion.div>

            <motion.div variants={formVariants} custom={2} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-200">
                  Password
                </Label>
                <Link
                  href="/auth/reset-password"
                  className="text-sm text-indigo-300 transition-colors hover:text-indigo-200"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading.credentials}
                required
                className="border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:border-white/40 focus:ring-white/40"
              />
            </motion.div>

            <motion.div variants={formVariants} custom={3}>
              <motion.button
                type="submit"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full rounded-md bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600"
                disabled={isLoading.credentials || isLoading.google || isLoading.github}
              >
                {isLoading.credentials ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>

          <motion.div variants={formVariants} custom={4} className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-gray-400 backdrop-blur-sm">
                Or continue with
              </span>
            </div>
          </motion.div>

          <motion.div variants={formVariants} custom={5} className="grid gap-2">
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn('google')}
                disabled={isLoading.google || isLoading.credentials}
                className="w-full border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 hover:text-white"
              >
                {isLoading.google ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Google
              </Button>
            </motion.div>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn('github')}
                disabled={isLoading.github || isLoading.credentials}
                className="w-full border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 hover:text-white"
              >
                {isLoading.github ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Github className="mr-2 h-4 w-4" />
                )}
                GitHub
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
        <CardFooter>
          <motion.div
            variants={formVariants}
            custom={6}
            className="w-full text-center text-sm text-gray-400"
          >
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-indigo-300 transition-colors hover:text-indigo-200"
            >
              Create an account
            </Link>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
