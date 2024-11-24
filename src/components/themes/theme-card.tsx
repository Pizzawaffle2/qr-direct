// src/components/themes/theme-card.tsx
import {memo } from 'react';
import {Card, CardContent } from '@/components/ui/card';
import {Badge } from '@/components/ui/badge';
import {ThemePreview } from './theme-preview';
import {CalendarTheme } from '@/types/calendar-types';

interface ThemeCardProps {
  theme: CalendarTheme;
  isAvailable: boolean;
  onSelect?: (theme: CalendarTheme) => void;
}

export const ThemeCard = memo(({ theme, isAvailable, onSelect }: ThemeCardProps) => {
  return (
    <Card
      className={`overflow-hidden transition-shadow ${onSelect ? 'cursor-pointer hover:shadow-lg' : ''} `}
      onClick={() => onSelect?.(theme)}
    >
      <div
        className="h-48 p-6"
        style={{
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <ThemePreview colors={theme.colors} />
      </div>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">{theme.name}</h3>
            <p className="text-sm text-muted-foreground">{theme.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{theme.category}</Badge>
            {!isAvailable && (
              <Badge variant="secondary">
                Available in{' '}
                {theme.availableMonths
                  ?.map((m) => new Date(0, m).toLocaleString('default', { month: 'short' }))
                  .join(&apos;, &apos;)}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
ThemeCard.displayName = 'ThemeCard';
