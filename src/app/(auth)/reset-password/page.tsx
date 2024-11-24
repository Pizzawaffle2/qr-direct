// File: src/app/(auth)/reset-password/page.tsx
'use client';

import {useState, useEffect } from 'react';
import {useRouter, useSearchParams } from 'next/navigation';
import {useForm } from 'react-hook-form';
import {zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {AuthLayout } from '@/components/ui/auth-layout';
import {Button } from '@/components/ui/button';
import {Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input } from '@/components/ui/input';
import {useToast } from '@/components/ui/use-toast';
import {Loader2, Eye, EyeOff, Lock, ArrowRight } from 'lucide-react';
import {motion, AnimatePresence } from 'framer-motion';
import {PasswordStrength } from '@/components/ui/password-strength';

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof formSchema>;

const passwordRequirements = [
  { label: 'At least 8 characters', regex: /.{8,}/ },
  { label: 'One uppercase letter', regex: /[A-Z]/ },
  { label: 'One lowercase letter', regex: /[a-z]/ },
  { label: 'One number', regex: /[0-9]/ },
  { label: 'One special character', regex: /[^A-Za-z0-9]/ },
];

const AnimatedCheck = () => (
  <motion.svg
    viewBox="0 0 24 24"
    className="h-4 w-4 text-green-500"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      d="M4 12l5 5L20 7"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
    />
  </motion.svg>
);

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const token = searchParams.get('token');

  useEffect(() => {
    setMounted(true);
    if (!token) {
      toast({
        title: 'Error',
        description: 'Invalid reset link. Please request a new password reset.',
        variant: 'destructive',
      });
      router.push('/forgot-password');
    }
  }, [token, toast, router]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (_data) => {
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast({
        title: 'Success',
        description:
          'Your password has been reset successfully. Please log in with your new password.',
      });

      router.push('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const password = form.watch('password');

  if (!mounted) return null;

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Choose a new secure password for your account"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-12">
            <div className="space-y-6">
              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">New Password</FormLabel>
                      <motion.div whileHover={{ scale: 1.01 }}>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              className="h-12 border-white/10 bg-white/5 pl-10 pr-10 text-white transition-all duration-300 placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-0 top-0 h-full px-3 text-gray-400 transition-colors hover:text-white"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                      </motion.div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Password Strength Meter */}
              <AnimatePresence>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PasswordStrength password={password} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Confirm New Password</FormLabel>
                      <motion.div whileHover={{ scale: 1.01 }}>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              className="h-12 border-white/10 bg-white/5 pl-10 pr-10 text-white transition-all duration-300 placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-0 top-0 h-full px-3 text-gray-400 transition-colors hover:text-white"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                      </motion.div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Password Requirements */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <p className="text-sm font-medium text-gray-300">Password Requirements:</p>
                <motion.div
                  className="space-y-2"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {passwordRequirements.map((req, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-2 text-sm"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        show: { opacity: 1, x: 0 },
                      }}
                    >
                      <div className="flex-shrink-0">
                        {req.regex.test(password) ? (
                          <AnimatedCheck />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-gray-500" />
                        )}
                      </div>
                      <span
                        className={req.regex.test(password) ? 'text-green-500' : 'text-gray-500'}
                      >
                        {req.label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full transform bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-300 hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98]"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={false}
                    animate={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-center"
                  >
                    Reset Password
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                )}
              </Button>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </AuthLayout>
  );
}
