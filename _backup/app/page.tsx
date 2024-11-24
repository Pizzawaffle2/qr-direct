// File: src/app/page.tsx
'use client';

import { QRCodeTabs } from '@/components/qr-code-tabs';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useHistoryStore } from '@/lib/store/history-store';
import { format } from 'date-fns';
import Link from 'next/link';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { motion } from 'framer-motion';
import { FileText, Share2, Database, ArrowRight, Download, History } from 'lucide-react';
import { ParticleBackground } from '@/components/ui/particle-background';

const features = [
  {
    icon: FileText,
    title: 'Multiple QR Types',
    description: 'Create QR codes for URLs, WiFi, vCards, and more',
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share your QR codes instantly across any platform',
  },
  {
    icon: Database,
    title: 'Template System',
    description: 'Save and reuse your favorite QR code styles',
  },
];

const stats = [
  { label: 'QR Codes Generated', value: '1M+' },
  { label: 'Active Users', value: '50K+' },
  { label: 'Templates Created', value: '10K+' },
];

export default function Home() {
  const { data: session } = useSession();
  const { history } = useHistoryStore();

  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <ParticleBackground />

        <div className="container mx-auto px-4 py-24">
          {/* Hero Section */}
          <Parallax translateY={[-20, 20]}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mb-20 max-w-4xl text-center"
            >
              <h1 className="mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
                Create Stunning QR Codes
              </h1>
              <p className="mb-8 text-xl text-gray-300">
                Generate, customize, and manage QR codes that perfectly match your brand
              </p>
              {!session ? (
                <div className="flex justify-center gap-4">
                  <Button size="lg" asChild>
                    <Link href="/register">
                      Get Started <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              ) : null}
            </motion.div>
          </Parallax>

          {/* QR Code Generator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-20"
          >
            <div className="glass-morphism rounded-3xl p-8">
              <QRCodeTabs />
            </div>
          </motion.div>

          {/* Features */}
          <div className="mb-20 grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="glass-morphism rounded-2xl p-6"
              >
                <feature.icon className="mb-4 h-12 w-12 text-blue-400" />
                <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="mb-20 grid gap-8 md:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-morphism rounded-2xl p-6 text-center"
              >
                <div className="mb-2 text-3xl font-bold text-blue-400">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Recent QR Codes */}
          {session && history.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-morphism rounded-3xl p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Recent QR Codes</h2>
                <Button variant="outline" asChild>
                  <Link href="/history">
                    <History className="mr-2 h-4 w-4" />
                    View All
                  </Link>
                </Button>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {history.slice(0, 3).map((item) => (
                  <div key={item.id} className="rounded-xl bg-white/5 p-4">
                    <img src={item.url} alt={item.title} className="mb-4 w-full" />
                    <h3 className="mb-2 font-medium text-white">{item.title}</h3>
                    <p className="mb-4 text-sm text-gray-400">
                      Created {format(new Date(item.created), 'PPp')}
                    </p>
                    <Button size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ParallaxProvider>
  );
}
