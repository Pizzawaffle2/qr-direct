// src/lib/qr-presets.ts

import {QRStyleOptions } from '@/types/qr';

interface QRStylePreset {
  id: string;
  name: string;
  description: string;
  style: QRStyleOptions;
  isPro?: boolean;
}

export const QR_STYLE_PRESETS: QRStylePreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean and simple design',
    style: {
      size: 300,
      margin: 4,
      errorCorrection: 'M',
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      dotStyle: 'square',
      cornerStyle: 'square',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Sleek and modern look',
    style: {
      size: 300,
      margin: 4,
      errorCorrection: 'M',
      foregroundColor: '#1a1a1a',
      backgroundColor: '#ffffff',
      dotStyle: 'dots',
      cornerStyle: 'dots',
      gradientType: 'linear',
      gradientColors: {
        start: '#3b82f6',
        end: '#8b5cf6',
        direction: 45,
      },
    },
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Simple and elegant',
    style: {
      size: 300,
      margin: 4,
      errorCorrection: 'M',
      foregroundColor: '#374151',
      backgroundColor: '#f3f4f6',
      dotStyle: 'rounded',
      cornerStyle: 'rounded',
    },
  },
  {
    id: 'branded',
    name: 'Branded',
    description: 'Perfect for business',
    style: {
      size: 300,
      margin: 4,
      errorCorrection: 'H',
      foregroundColor: '#2563eb',
      backgroundColor: '#ffffff',
      dotStyle: 'classy',
      cornerStyle: 'square',
      frame: true,
      frameColor: '#2563eb',
      frameStyle: 'modern',
    },
    isPro: true,
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Colorful gradient style',
    style: {
      size: 300,
      margin: 4,
      errorCorrection: 'Q',
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      dotStyle: 'rounded',
      cornerStyle: 'dots',
      gradientType: 'radial',
      gradientColors: {
        start: '#ec4899',
        end: '#8b5cf6',
      },
    },
    isPro: true,
  },
  {
    id: 'sharp',
    name: 'Sharp',
    description: 'Bold and distinctive',
    style: {
      size: 300,
      margin: 4,
      errorCorrection: 'M',
      foregroundColor: '#111827',
      backgroundColor: '#ffffff',
      dotStyle: 'sharp',
      cornerStyle: 'square',
      frame: true,
      frameStyle: 'basic',
      frameColor: '#111827',
    },
  },
];

export function getPresetById(id: string): QRStylePreset | undefined {
  return QR_STYLE_PRESETS.find((preset) => preset.id === id);
}

export function getDefaultPreset(): QRStylePreset {
  return QR_STYLE_PRESETS[0];
}

export function getProPresets(): QRStylePreset[] {
  return QR_STYLE_PRESETS.filter((preset) => preset.isPro);
}

export function getFreePresets(): QRStylePreset[] {
  return QR_STYLE_PRESETS.filter((preset) => !preset.isPro);
}
