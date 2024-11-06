 // src/config/qr-style-presets.ts

import { QRStyleOptions } from "@/types/qr"

export interface QRStylePreset {
  id: string
  name: string
  description: string
  category: 'basic' | 'modern' | 'branded' | 'artistic' | 'professional'
  style: QRStyleOptions
  preview?: string // URL for preview image
  isPro?: boolean
}

export const QR_STYLE_PRESETS: QRStylePreset[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional black and white QR code',
    category: 'basic',
    style: {
      dotStyle: 'square',
      size: 300,
      margin: 4,
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      errorCorrection: 'M',
    }
  },
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Sleek gradient design',
    category: 'modern',
    style: {
      dotStyle: 'rounded',
      size: 300,
      margin: 4,
      gradientType: 'linear',
      gradientColors: {
        start: '#2563EB',
        end: '#7C3AED',
        direction: 45,
      },
      backgroundColor: '#FFFFFF',
      errorCorrection: 'M',
    },
    isPro: true
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional design with logo space',
    category: 'professional',
    style: {
      dotStyle: 'classy',
      size: 400,
      margin: 6,
      foregroundColor: '#1E293B',
      backgroundColor: '#F8FAFC',
      errorCorrection: 'H',
      logoSize: 25,
      logoPadding: 4,
      logoBackgroundColor: '#FFFFFF',
    },
    isPro: true
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design',
    category: 'basic',
    style: {
      dotStyle: 'dots',
      size: 300,
      margin: 4,
      foregroundColor: '#374151',
      backgroundColor: '#F3F4F6',
      errorCorrection: 'M',
    }
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Vibrant neon gradient effect',
    category: 'artistic',
    style: {
      dotStyle: 'rounded',
      size: 300,
      margin: 4,
      gradientType: 'linear',
      gradientColors: {
        start: '#FF0080',
        end: '#7928CA',
        direction: 30,
      },
      backgroundColor: '#000000',
      errorCorrection: 'Q',
    },
    isPro: true
  },
  // Add more presets...
]