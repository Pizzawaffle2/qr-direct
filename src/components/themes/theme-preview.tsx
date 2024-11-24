// src/components/themes/theme-preview.tsx
import {memo } from 'react';
import {CalendarTheme } from '@/types/calendar-types';

export const ThemePreview = memo(({ colors }: { colors: CalendarTheme['colors'] }) => (
  <div className="space-y-4">
    <div className="h-8 rounded" style={{ backgroundColor: colors.primary }} />
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square rounded"
          style={{ backgroundColor: colors.secondary }}
        />
      ))}
    </div>
  </div>
));
ThemePreview.displayName = 'ThemePreview';
