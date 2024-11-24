'use client';

import {motion } from 'framer-motion';
import {Star } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'TechCorp',
    image: '/testimonials/sarah.jpg',
    content:
      "The QR code customization options are amazing. We've seen a 50% increase in engagement since switching to this platform.",
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Small Business Owner',
    company: 'Local Cafe',
    image: '/testimonials/michael.jpg',
    content:
      'Easy to use and the analytics help us track our menu QR code performance. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Event Manager',
    company: 'EventPro',
    image: '/testimonials/emily.jpg',
    content:
      'The dynamic QR codes are perfect for our events. Being able to update content on the fly is a game-changer.',
    rating: 5,
  },
];

export function TestimonialSection() {
  return (
    <div className="py-12">
      <div className="mb-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-3xl font-bold sm:text-4xl"
        >
          Trusted by Thousands of Users
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl text-muted-foreground"
        >
          See what our customers are saying about their experience.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative rounded-lg border bg-card p-6 shadow-lg"
          >
            <div className="mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="inline-block h-5 w-5 text-yellow-400"
                  fill="currentColor"
                />
              ))}
            </div>

            <p className="mb-4 text-sm text-muted-foreground">"{testimonial.content}"</p>

            <div className="flex items-center">
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-4">
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}, {testimonial.company}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 text-center"
      >
        <p className="mb-4 text-sm text-muted-foreground">Trusted by companies worldwide</p>
        <div className="flex flex-wrap justify-center gap-8 opacity-50">
          {/* Add company logos here */}
          <div className="h-8 w-32 rounded bg-muted" />
          <div className="h-8 w-32 rounded bg-muted" />
          <div className="h-8 w-32 rounded bg-muted" />
          <div className="h-8 w-32 rounded bg-muted" />
        </div>
      </motion.div>
    </div>
  );
}
