import {HeroSection } from '@/components/sections/hero-section';
import {FeatureSection } from '@/components/sections/feature-section';
import {PricingSection } from '@/components/sections/pricing-section';
import {TestimonialSection } from '@/components/sections/testimonial-section';
import {CTASection } from '@/components/sections/cta-section';

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 pb-32 pt-20">
        <div className="container mx-auto px-4">
          <HeroSection />
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-slate-900 py-24">
        <div className="container mx-auto px-4">
          <FeatureSection />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-24">
        <div className="container mx-auto px-4">
          <PricingSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-slate-950 to-indigo-950 py-24">
        <div className="container mx-auto px-4">
          <CTASection />
        </div>
      </section>
    </main>
  );
}
