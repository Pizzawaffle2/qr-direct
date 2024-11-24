'use client';

import {CalendarTheme } from '@/types/calendar-themes';

interface FrameProps {
  theme: CalendarTheme;
  children: React.ReactNode;
}

const FRAME_PATTERNS = {
  holly: `
    <pattern id="holly" patternUnits="userSpaceOnUse" width="50" height="50">
      <path d="M..." fill="currentColor" opacity="0.1"/>
    </pattern>
  `,
  snowflake: `
    <pattern id="snowflake" patternUnits="userSpaceOnUse" width="50" height="50">
      <path d="M..." fill="currentColor" opacity="0.1"/>
    </pattern>
  `,
  // Add more patterns for each theme...
};

export function ThemeFrame({ theme, children }: FrameProps) {
  if (theme.frame.type === 'none') {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ opacity: 0.1 }}>
        <defs>{FRAME_PATTERNS[theme.frame.borderStyle as keyof typeof FRAME_PATTERNS]}</defs>
        <rect width="100%" height="100%" fill={`url(#${theme.frame.borderStyle})`} />
      </svg>

      {/* Corner Decorations */}
      {theme.frame.cornerStyle && (
        <>
          <div className="absolute -left-2 -top-2" />
          <div className="absolute -right-2 -top-2" />
          <div className="absolute -bottom-2 -left-2" />
          <div className="absolute -bottom-2 -right-2" />
        </>
      )}

      {/* Main Content */}
      <div className="relative">{children}</div>
    </div>
  );
}

export function ApplyTheme({
  theme,
  children,
}: {
  theme: CalendarTheme;
  children: React.ReactNode;
}) {
  return (
    <div
      className="transition-colors duration-200"
      style={
        {
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          borderColor: theme.colors.border,
          '--theme-primary': theme.colors.primary,
          '--theme-secondary': theme.colors.secondary,
          '--theme-accent': theme.colors.accent,
        } as React.CSSProperties
      }
    >
      <ThemeFrame theme={theme}>{children}</ThemeFrame>
    </div>
  );
}
