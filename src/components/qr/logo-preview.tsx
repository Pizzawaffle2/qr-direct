// src/components/qr/logo-preview.tsx

'use client';

import {useState, useEffect } from 'react';
import {Card } from '@/components/ui/card';
import {Label } from '@/components/ui/label';
import {Switch } from '@/components/ui/switch';
import {motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {QrCode, Grid } from 'lucide-react';

interface LogoPreviewProps {
  value: {
    logo?: string;
    logoSize?: number;
    logoPadding?: number;
    logoBackgroundColor?: string;
    logoPosition?: {
      x: number;
      y: number;
    };
    logoRotation?: number;
    logoOpacity?: number;
    logoEffects?: {
      blur?: number;
      brightness?: number;
      contrast?: number;
      grayscale?: boolean;
      invert?: boolean;
      sepia?: boolean;
    };
    logoShape?: 'square' | 'circle' | 'rounded';
    logoBorder?: {
      width?: number;
      color?: string;
      style?: 'solid' | 'dashed' | 'dotted';
    };
    logoShadow?: {
      enabled: boolean;
      x?: number;
      y?: number;
      blur?: number;
      color?: string;
    };
  };
  showGrid?: boolean;
}

export function LogoPreview({ value, showGrid = false }: LogoPreviewProps) {
  const [showGuides, setShowGuides] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);

  const getLogoStyle = () => {
    const effects = value.logoEffects || {};
    const filters = [];

    if (effects.blur) filters.push(`blur(${effects.blur}px)`);
    if (effects.brightness) filters.push(`brightness(${effects.brightness}%)`);
    if (effects.contrast) filters.push(`contrast(${effects.contrast}%)`);
    if (effects.grayscale) filters.push('grayscale(1)');
    if (effects.invert) filters.push('invert(1)');
    if (effects.sepia) filters.push('sepia(1)');

    const baseStyle = {
      filter: filters.join(' '),
      transform: `
        translate(-50%, -50%) 
        rotate(${value.logoRotation || 0}deg) 
        scale(${previewScale})
      `,
      opacity: value.logoOpacity || 1,
      borderRadius:
        value.logoShape === 'circle' ? '50%' : value.logoShape === 'rounded' ? '12px' : '0',
      border: value.logoBorder?.width
        ? `${value.logoBorder.width}px ${value.logoBorder.style || 'solid'} ${value.logoBorder.color || '#000'}`
        : undefined,
      boxShadow: value.logoShadow?.enabled
        ? `${value.logoShadow.x || 0}px ${value.logoShadow.y || 0}px ${value.logoShadow.blur || 0}px ${value.logoShadow.color || 'rgba(0,0,0,0.5)'}`
        : undefined,
      backgroundColor: value.logoBackgroundColor || 'transparent',
      padding: `${value.logoPadding || 0}px`,
      position: 'absolute' as const,
      width: `${value.logoSize || 20}%`,
      height: `${value.logoSize || 20}%`,
      top: `${value.logoPosition?.y || 50}%`,
      left: `${value.logoPosition?.x || 50}%`,
      transition: 'all 0.2s ease-out',
    };

    return baseStyle;
  };

  const GridOverlay = () => (
    <div className="pointer-events-none absolute inset-0">
      <div className="grid h-full w-full grid-cols-4 grid-rows-4">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="border border-primary/20"
            style={{
              backgroundColor:
                i === 5 || i === 6 || i === 9 || i === 10
                  ? 'rgba(var(--primary-rgb), 0.1)'
                  : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Label>Live Preview</Label>
        <div className="flex items-center gap-2">
          <Label className="text-sm">Show Grid</Label>
          <Switch checked={showGuides} onCheckedChange={setShowGuides} />
        </div>
      </div>

      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        {/* Background Grid */}
        {showGuides && <GridOverlay />}

        {/* Center Indicator */}
        {showGuides && (
          <>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="w-full border-t border-dashed border-primary/30" />
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-full border-l border-dashed border-primary/30" />
            </div>
          </>
        )}

        {/* Logo */}
        <AnimatePresence mode="wait">
          {value.logo ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={getLogoStyle()}
            >
              <div className="relative h-full w-full">
                <Image
                  src={value.logo}
                  alt="Logo preview"
                  fill
                  className="object-contain"
                  onLoadingComplete={() => setPreviewScale(1)}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <QrCode className="h-12 w-12 text-gray-400" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Position Indicators */}
        {showGuides && value.logo && (
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              className="absolute h-1 w-1 bg-primary"
              style={{
                top: `${value.logoPosition?.y || 50}%`,
                left: `${value.logoPosition?.x || 50}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>
        )}
      </div>

      {/* Info Overlay */}
      {value.logo && showGuides && (
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>
            Position: {value.logoPosition?.x || 50}% x {value.logoPosition?.y || 50}%
          </p>
          <p>Size: {value.logoSize || 20}%</p>
          <p>Rotation: {value.logoRotation || 0}°</p>
        </div>
      )}
    </Card>
  );
}
