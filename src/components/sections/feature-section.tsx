import { QrCode, Calendar, BarChart3, Shield } from 'lucide-react';

const features = [
  {
    icon: QrCode,
    title: 'Advanced QR Codes',
    description: 'Create dynamic QR codes with custom designs, tracking, and analytics.',
  },
  {
    icon: Calendar,
    title: 'Custom Calendars',
    description: 'Generate professional calendars with your branding and events.',
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'Track scans, engagement, and user behavior in real-time.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security with encrypted data and access controls.',
  },
];

export function FeatureSection() {
  return (
    <div className="space-y-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Everything You Need
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Powerful features to help you manage your QR codes and calendars effectively
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-6 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
          >
            <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}