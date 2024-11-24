// src/app/(auth)/login/layout.tsx
'use client';

import {ParticlesBg } from '@/components/ui/particles-bg';
import {motion } from 'framer-motion';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col justify-center bg-gradient-to-b from-gray-900 via-indigo-900/20 to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <ParticlesBg />
        <div className="animate-pulse-slow absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />
      </div>

      {/* Animated Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -left-10 top-1/4 h-72 w-72 rounded-full bg-purple-500/10 mix-blend-multiply blur-3xl filter" />
        <div className="animate-blob animation-delay-2000 absolute -right-10 top-1/3 h-72 w-72 rounded-full bg-indigo-500/10 mix-blend-multiply blur-3xl filter" />
        <div className="animate-blob animation-delay-4000 absolute -bottom-10 left-1/2 h-72 w-72 rounded-full bg-blue-500/10 mix-blend-multiply blur-3xl filter" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-center text-4xl font-bold text-transparent text-white">
            Welcome to QR Direct!
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
