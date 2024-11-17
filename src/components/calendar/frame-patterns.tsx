"use client";

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

// Comprehensive set of frame patterns for different themes and seasons
export const FRAME_PATTERNS = {
  // Holiday Patterns
  christmas: `
    <pattern id="christmas" patternUnits="userSpaceOnUse" width="100" height="100">
      <path d="M20 20c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z" fill="#c41e3a" opacity="0.1"/>
      <path d="M25 25l10-10M35 25l-10-10" stroke="#2C5530" stroke-width="2" opacity="0.1"/>
      <circle cx="30" cy="20" r="3" fill="#c41e3a" opacity="0.2"/>
    </pattern>
    <pattern id="holly-corner" patternUnits="userSpaceOnUse" width="50" height="50">
      <path d="M10 25s5-15 15-15 15 15 15 15-5 15-15 15-15-15-15-15z" fill="#2C5530" opacity="0.15"/>
      <circle cx="25" cy="25" r="3" fill="#c41e3a"/>
    </pattern>
  `,

  // Winter Patterns
  snowflakes: `
    <pattern id="snowflakes" patternUnits="userSpaceOnUse" width="60" height="60">
      <path d="M30 5v20M30 35v20M5 30h20M35 30h20M15 15l30 30M15 45l30-30" 
            stroke="#94A3B8" stroke-width="1" opacity="0.1"/>
      <circle cx="30" cy="30" r="2" fill="#94A3B8" opacity="0.2"/>
    </pattern>
    <pattern id="frost" patternUnits="userSpaceOnUse" width="100" height="100">
      <path d="M0 50c25-25 75-25 100 0c-25 25-75 25-100 0z" stroke="#E2E8F0" stroke-width="1" fill="none"/>
    </pattern>
  `,

  // Spring Patterns
  cherryblossom: `
    <pattern id="cherryblossom" patternUnits="userSpaceOnUse" width="80" height="80">
      <circle cx="40" cy="40" r="3" fill="#FDA4AF"/>
      <path d="M37 40c0-5 6-5 6 0s-6 5-6 0z" fill="#FDA4AF" opacity="0.6"/>
      <path d="M40 37c5 0 5 6 0 6s-5-6 0-6z" fill="#FDA4AF" opacity="0.6"/>
      <path d="M40 43c-5 0-5-6 0-6s5 6 0 6z" fill="#FDA4AF" opacity="0.6"/>
      <path d="M43 40c0 5-6 5-6 0s6-5 6 0z" fill="#FDA4AF" opacity="0.6"/>
    </pattern>
    <pattern id="spring-flowers" patternUnits="userSpaceOnUse" width="60" height="60">
      <circle cx="30" cy="30" r="2" fill="#86EFAC"/>
      <path d="M30 25c5 0 5 10 0 10s-5-10 0-10z" fill="#86EFAC" opacity="0.4"/>
    </pattern>
  `,

  // Summer Patterns
  tropical: `
    <pattern id="palm-leaves" patternUnits="userSpaceOnUse" width="100" height="100">
      <path d="M20 80c20-40 40-40 60 0" stroke="#059669" stroke-width="2" fill="none" opacity="0.1"/>
      <path d="M30 70c15-30 30-30 45 0" stroke="#059669" stroke-width="2" fill="none" opacity="0.1"/>
      <path d="M40 60c10-20 20-20 30 0" stroke="#059669" stroke-width="2" fill="none" opacity="0.1"/>
    </pattern>
    <pattern id="waves" patternUnits="userSpaceOnUse" width="120" height="40">
      <path d="M0 20c30-20 60 20 90-20c30-40 60 0 90 0c30 0 60-40 90 0c30 40 60 0 90-20" 
            stroke="#0EA5E9" stroke-width="1" fill="none" opacity="0.1"/>
    </pattern>
  `,

  // Autumn Patterns
  autumn: `
    <pattern id="falling-leaves" patternUnits="userSpaceOnUse" width="100" height="100">
      <path d="M20 20c0 20 20 20 20 0s-20-20-20 0z" fill="#C2410C" opacity="0.1" transform="rotate(30 30 30)"/>
      <path d="M60 60c0 20 20 20 20 0s-20-20-20 0z" fill="#C2410C" opacity="0.1" transform="rotate(-30 70 70)"/>
      <path d="M20 80c0 20 20 20 20 0s-20-20-20 0z" fill="#EA580C" opacity="0.1" transform="rotate(15 30 90)"/>
    </pattern>
    <pattern id="autumn-corner" patternUnits="userSpaceOnUse" width="200" height="200">
      <path d="M0 0c50 50 150 50 200 0" stroke="#EA580C" stroke-width="2" fill="none" opacity="0.2"/>
      <path d="M0 40c50 50 150 50 200 0" stroke="#C2410C" stroke-width="2" fill="none" opacity="0.1"/>
    </pattern>
  `,

  // Special Event Patterns
  birthday: `
    <pattern id="confetti" patternUnits="userSpaceOnUse" width="100" height="100">
      <rect x="20" y="20" width="4" height="4" fill="#F472B6" transform="rotate(30 22 22)"/>
      <rect x="40" y="60" width="4" height="4" fill="#818CF8" transform="rotate(-15 42 62)"/>
      <rect x="70" y="30" width="4" height="4" fill="#34D399" transform="rotate(45 72 32)"/>
    </pattern>
    <pattern id="balloons" patternUnits="userSpaceOnUse" width="60" height="60">
      <path d="M30 40c-5-15 5-30 0-30s-5 15 0 30z" fill="#F472B6" opacity="0.2"/>
      <path d="M20 35c-5-15 5-30 0-30s-5 15 0 30z" fill="#818CF8" opacity="0.2"/>
      <path d="M40 35c-5-15 5-30 0-30s-5 15 0 30z" fill="#34D399" opacity="0.2"/>
    </pattern>
  `
};

// Corner decorations for different themes
export const CORNER_DECORATIONS = {
  christmas: {
    topLeft: `
      <path d="M0 0c20 20 60 20 80 0" stroke="#2C5530" stroke-width="3" fill="none"/>
      <circle cx="40" cy="10" r="4" fill="#c41e3a"/>
      <path d="M35 15c0-10 10-10 10 0s-10 10-10 0z" fill="#2C5530"/>
    `,
    topRight: `
      <path d="M0 0c20 20 60 20 80 0" stroke="#2C5530" stroke-width="3" fill="none" transform="scale(-1, 1) translate(-80, 0)"/>
      <circle cx="40" cy="10" r="4" fill="#c41e3a"/>
      <path d="M35 15c0-10 10-10 10 0s-10 10-10 0z" fill="#2C5530"/>
    `,
    // ... similar for bottomLeft and bottomRight
  },
  autumn: {
    topLeft: `
      <g transform="translate(10, 10)">
        <path d="M0 0c0 20 20 20 20 0s-20-20-20 0z" fill="#C2410C" opacity="0.2" transform="rotate(30)"/>
        <path d="M10 10c0 20 20 20 20 0s-20-20-20 0z" fill="#EA580C" opacity="0.2" transform="rotate(-15)"/>
      </g>
    `,
    topRight: `
      <g transform="translate(70, 10) scale(-1, 1)">
        <path d="M0 0c0 20 20 20 20 0s-20-20-20 0z" fill="#C2410C" opacity="0.2" transform="rotate(30)"/>
        <path d="M10 10c0 20 20 20 20 0s-20-20-20 0z" fill="#EA580C" opacity="0.2" transform="rotate(-15)"/>
      </g>
    `,
  },
  // ... other themes
};

// Animated decorations for special dates
export const DATE_DECORATIONS = {
  holiday: `
    <g class="holiday-decoration">
      <circle cx="50%" cy="0" r="3" fill="currentColor" opacity="0.3">
        <animate attributeName="cy" values="0;5;0" dur="2s" repeatCount="indefinite"/>
      </circle>
    </g>
  `,
  birthday: `
    <g class="birthday-decoration">
      <path d="M-5 0l5-5 5 5" stroke="currentColor" fill="none">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.5s" repeatCount="indefinite"/>
      </path>
    </g>
  `,
  // ... other special date decorations
};

interface ThemeFrameProps {
  type: keyof typeof FRAME_PATTERNS;
  cornerStyle?: keyof typeof CORNER_DECORATIONS;
  color: string;
  opacity?: number;
  className?: string;
  children: React.ReactNode;
}

export function ThemeFrame({
  type,
  cornerStyle,
  color,
  opacity = 0.1,
  className,
  children
}: ThemeFrameProps) {
  const pattern = useMemo(() => FRAME_PATTERNS[type], [type]);
  const corners = useMemo(() => cornerStyle ? CORNER_DECORATIONS[cornerStyle] : null, [cornerStyle]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs dangerouslySetInnerHTML={{ __html: pattern }} />
        <rect width="100%" height="100%" fill={`url(#${type})`} className={cn(`opacity-${Math.round(opacity * 100)}`)} />
      </svg>

      {corners && (
        <>
          <svg className="absolute top-0 left-0 w-20 h-20" viewBox="0 0 80 80">
            <g dangerouslySetInnerHTML={{ __html: corners.topLeft }} />
          </svg>
          <svg className="absolute top-0 right-0 w-20 h-20" viewBox="0 0 80 80">
            <g dangerouslySetInnerHTML={{ __html: corners.topRight }} />
          </svg>
          {/* ... bottom corners ... */}
        </>
      )}

      {children}
    </div>
  );
}