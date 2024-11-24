'use client';

import {Button } from '@/components/ui/button';
import {motion, AnimatePresence } from 'framer-motion';
import {ArrowRight, QrCode, Sparkles, Paintbrush, Activity, Zap } from 'lucide-react';
import Link from 'next/link';
import {useState, useEffect } from 'react';
import {cn } from '@/lib/utils';

interface DemoStyle {
  name: string;
  style: {
    background: string;
    icon: string;
  };
}

const demoStyles: DemoStyle[] = [
  {
    name: 'Modern',
    style: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      icon: 'bg-black rounded-xl shadow-lg',
    },
  },
  {
    name: 'Business',
    style: {
      background: 'linear-gradient(135deg, #1e293b, #334155)',
      icon: 'bg-blue-500 rounded-lg shadow-lg',
    },
  },
  {
    name: 'Creative',
    style: {
      background: 'linear-gradient(135deg, #f97316, #f43f5e)',
      icon: 'bg-yellow-400 rounded-full shadow-lg',
    },
  },
];

interface FeatureHighlight {
  icon: typeof Paintbrush;
  color: string;
  title: string;
  description: string;
}

const features: FeatureHighlight[] = [
  {
    icon: Paintbrush,
    color: 'from-blue-500 to-purple-500',
    title: 'Custom Design',
    description: 'Choose colors, patterns, and frames',
  },
  {
    icon: Activity,
    color: 'from-green-500 to-emerald-500',
    title: 'Track Analytics',
    description: 'Monitor scans and engagement',
  },
  {
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    title: 'Dynamic Content',
    description: 'Update content anytime',
  },
];

export function HeroSection() {
  const [activeStyle, setActiveStyle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStyle((prev) => (prev + 1) % demoStyles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-gradient-radial absolute inset-0 from-blue-500/20 via-transparent to-transparent" />
      </div>

      <div className="flex flex-col items-center space-y-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center rounded-full border bg-background/50 px-3 py-1 text-sm backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Discover the Next Generation of QR Codes
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Create Dynamic{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              QR Codes
            </span>{' '}
            <br />
            That Stand Out
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Transform your digital presence with custom QR codes that combine style and
            functionality. Easy to create, easy to track, impossible to ignore.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Button asChild size="lg" className="gap-2">
            <Link href="/dashboard/qr-codes/new">
              Create QR Code <QrCode className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="gap-2">
            <Link href="/dashboard">
              Go to the Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Enhanced Preview/Demo Area */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="relative mt-8 w-full max-w-5xl"
        >
          <div className="rounded-xl border bg-card/50 p-8 shadow-xl backdrop-blur-sm">
            {/* Style Selector */}
            <div className="mb-6 flex justify-center gap-4">
              {demoStyles.map((style, index) => (
                <Button
                  key={style.name}
                  variant={activeStyle === index ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveStyle(index)}
                  className="relative"
                >
                  {style.name}
                  {activeStyle === index && (
                    <motion.div
                      layoutId="activeStyle"
                      className="absolute inset-0 rounded-md bg-primary opacity-10"
                    />
                  )}
                </Button>
              ))}
            </div>

            {/* Interactive Preview */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* QR Code Preview */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStyle}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="aspect-square overflow-hidden rounded-lg shadow-2xl"
                  style={{ background: demoStyles[activeStyle].style.background }}
                >
                  <div className="flex h-full w-full items-center justify-center p-8">
                    <div
                      className={cn(
                        'flex h-full w-full items-center justify-center',
                        demoStyles[activeStyle].style.icon
                      )}
                    >
                      <QrCode className="h-full w-full p-6" />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Features Preview */}
              <div className="flex flex-col justify-center space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-4"
                >
                  {features.map((feature, index) => (
                    <div key={feature.title} className="flex items-center gap-2">
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br',
                          feature.color
                        )}
                      >
                        <feature.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Button className="mt-4" size="lg" asChild>
                    <Link href="/dashboard/qr-codes/new">
                      Try It Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -right-8 -top-8 h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 opacity-20 blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -bottom-8 -left-8 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500 opacity-20 blur-xl"
          />
        </motion.div>
      </div>
    </div>
  );
}
