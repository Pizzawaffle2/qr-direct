// src/components/layout.tsx
'use client';

import {ReactNode } from 'react';
import {ParticleBackground } from '@/components/ui/particle-background';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative">
      <ParticleBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
