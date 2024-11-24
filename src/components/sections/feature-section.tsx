'use client';

import {motion } from 'framer-motion';
import {Paintbrush,
  BarChart2,
  Zap,
  Smartphone,
  Shield,
  QrCode,
  Download,
  Share2,
  Palette,
} from 'lucide-react';

const features = [
  {
    icon: Paintbrush,
    title: 'Custom Design',
    description: 'Create unique QR codes with custom colors, patterns, and frames',
  },
  {
    icon: BarChart2,
    title: 'Analytics',
    description: 'Track scans, locations, and engagement in real-time',
  },
  {
    icon: Zap,
    title: 'Dynamic Content',
    description: 'Update QR code content anytime without reprinting',
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Perfect scanning experience on all devices',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security and 99.9% uptime',
  },
  {
    icon: Download,
    title: 'Easy Export',
    description: 'Download in multiple formats including SVG and PNG',
  },
  {
    icon: Share2,
    title: 'Team Sharing',
    description: 'Collaborate with team members and share assets',
  },
  {
    icon: Palette,
    title: 'Templates',
    description: 'Choose from professionally designed templates',
  },
];

export function FeatureSection() {
  return (
    <div className="py-12">
      <div className="mb-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-3xl font-bold sm:text-4xl"
        >
          Everything You Need to Create
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Professional QR Codes
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl text-muted-foreground"
        >
          All the tools and features you need to create, manage, and track your QR codes in one
          place.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative rounded-lg border bg-card p-6 shadow-lg transition-shadow hover:shadow-xl"
          >
            <feature.icon className="mb-4 h-12 w-12 text-blue-500" />
            <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
