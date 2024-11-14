'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export function HeroSection() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative z-10 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/10 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-4 py-28 sm:px-6 lg:px-8">
        <motion.div variants={fadeIn} className="text-center">
          {/* New Feature Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 inline-flex"
          >
            <Badge
              variant="outline"
              className="rounded-full px-4 py-1 text-sm border-blue-500/20 bg-blue-500/10 text-blue-400"
            >
              <Zap className="mr-2 h-4 w-4" />
              New: AI-powered QR code templates
            </Badge>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="mb-8 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            variants={fadeIn}
          >
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Create Professional
            </span>
            <span className="mt-2 block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              QR Codes and Calendars
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mx-auto mb-12 max-w-2xl text-lg text-gray-400 sm:text-xl"
            variants={fadeIn}
          >
            Generate beautiful, trackable QR codes and customized printable calendars.
            Trusted by over 50,000 businesses worldwide.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            variants={fadeIn}
          >
            {status === 'authenticated' ? (
              <Button
                size="lg"
                className="min-w-[200px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                asChild
              >
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  className="min-w-[200px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  asChild
                >
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="min-w-[200px] backdrop-blur-sm hover:bg-white/10"
                  asChild
                >
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={fadeIn}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-400"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Enterprise-grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative shapes */}
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </motion.div>
  );
}