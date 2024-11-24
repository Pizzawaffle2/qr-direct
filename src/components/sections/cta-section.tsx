'use client';

import {Button } from '@/components/ui/button';
import {motion } from 'framer-motion';
import {ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

const benefits = ['No credit card required', '14-day free trial', 'Cancel anytime', '24/7 support'];

export function CTASection() {
  return (
    <div className="relative py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-gradient-radial absolute inset-0 from-blue-500/20 via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            Start Creating Amazing
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              QR Codes Today
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Join thousands of satisfied users who are already using our platform to create stunning
            QR codes and track their performance.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" asChild>
              <Link href="/signup" className="gap-2">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              View Live Demo
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Optional: Add a "Scroll to Top" button */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute bottom-4 right-4 rounded-full bg-primary/10 p-2 transition-colors hover:bg-primary/20"
      >
        <ArrowRight className="h-5 w-5 rotate-[-90deg]" />
      </motion.button>
    </div>
  );
}
