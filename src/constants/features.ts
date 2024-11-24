import {Shield, BarChart, Palette, Globe, Users, Zap } from 'lucide-react';

interface Feature {
  icon: React.ComponentType;
  title: string;
  description: string;
  color: string;
}

export const FEATURES: Feature[] = [
  {
    icon: Shield,
    title: 'Secure & Private',
    description:
      'Enterprise-grade security with end-to-end encryption and privacy protection for all your QR codes and data.',
    color: 'text-emerald-400',
  },
  {
    icon: BarChart,
    title: 'Advanced Analytics',
    description:
      'Track scans, user engagement, and conversion rates with detailed analytics and insights.',
    color: 'text-blue-400',
  },
  {
    icon: Palette,
    title: 'Customization',
    description:
      'Create branded QR codes with custom colors, logos, and designs that match your brand identity.',
    color: 'text-purple-400',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description:
      'Access your QR codes and calendars from anywhere, with support for multiple languages and regions.',
    color: 'text-pink-400',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Work together with your team, share resources, and manage permissions efficiently.',
    color: 'text-yellow-400',
  },
  {
    icon: Zap,
    title: 'AI-Powered',
    description:
      'Leverage AI to generate optimized QR codes and smart calendar suggestions automatically.',
    color: 'text-orange-400',
  },
];
