// src/components/calendar/theme-selector.tsx
'use client';

import {useState } from 'react';
import {Card, CardContent } from '@/components/ui/card';
import {Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {basicThemes } from '@/types/calendar-themes/basic-themes';
import {holidayThemes } from '@/types/calendar-themes/holiday-themes';
import {seasonalThemes } from '@/types/calendar-themes/seasonal-themes';
import {CalendarTheme } from '@/types/calendar-types';

const allThemes = [...basicThemes, ...holidayThemes, ...seasonalThemes];

interface ThemeSelectorProps {
  currentTheme: string;
  currentMonth: number;
  onThemeSelect: (theme: CalendarTheme) => void;
}

export function ThemeSelector({ currentTheme, currentMonth, onThemeSelect }: ThemeSelectorProps) {
  const [category, setCategory] = useState<string>('all');

  // Filter themes based on category and month availability
  const availableThemes = allThemes.filter((theme) => {
    const matchesCategory = category === 'all' || theme.category === category;
    const availableInMonth = !theme.availableMonths || theme.availableMonths.includes(currentMonth);
    return matchesCategory && availableInMonth;
  });

  return (
    <div className="space-y-4">
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="seasonal">Seasonal</SelectItem>
            <SelectItem value="holiday">Holiday</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-4">
        {availableThemes.map((theme) => (
          <Card
            key={theme.id}
            className={`cursor-pointer transition-all ${
              theme.id === currentTheme
                ? 'ring-2 ring-primary'
                : 'hover:ring-2 hover:ring-primary/50'
            }`}
            onClick={() => onThemeSelect(theme)}
          >
            <div
              className="aspect-video p-4"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
              }}
            >
              {/* Theme Preview */}
              <div className="space-y-2">
                <div className="h-4 rounded" style={{ backgroundColor: theme.colors.primary }} />
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <CardContent className="border-t p-3">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">{theme.name}</h3>
                <p className="text-xs text-muted-foreground">{theme.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {availableThemes.length === 0 && (
        <div className="p-4 text-center">
          <p className="text-muted-foreground">
            No themes available for the selected category and month.
          </p>
        </div>
      )}
    </div>
  );
}
