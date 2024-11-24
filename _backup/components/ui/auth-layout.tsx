// File: src/components/ui/auth-layout.tsx
'use client';

import { motion } from 'framer-motion';
import { ParticleBackground } from './particle-background';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="animate-gradient-xy absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:radial-gradient(white,transparent_85%)]" />

        {/* Animated Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -left-48 -top-48 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="container relative z-10 mx-auto flex min-h-screen items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="glass-morphism overflow-hidden rounded-3xl"
          >
            {/* Form Header */}
            <div className="relative px-12 pb-8 pt-16 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-1">
                  <div className="h-full w-full rounded-full bg-slate-950 p-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold tracking-tight text-white"
              >
                {title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-lg text-gray-400"
              >
                {subtitle}
              </motion.p>
            </div>

            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
