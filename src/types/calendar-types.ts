// src/types/calendar-types.ts

// Basic types and enums
export type ThemeCategory = 'basic' | 'seasonal' | 'holiday';

export type LunarPhase = {
  date: Date;
  phase: 'new' | 'first-quarter' | 'full' | 'last-quarter';
};

export type CalendarSettings = {
  title: string;
  type: 'personal' | 'business' | 'holiday' | 'seasonal';
  year: number;
  firstDayOfWeek: 0 | 1;
  showWeekNumbers: boolean;
  months: number[];
  theme: {
    headerColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
  options: {
    showHolidays: boolean;
    showLunarPhases: boolean;
    showWeather: boolean;
    showNotes: boolean;
  };
};

// Interface for theme and style options
interface ThemeBase {
  title: string;
  type: 'personal' | 'business' | 'holiday' | 'seasonal';
  year: number;
  firstDayOfWeek: 0 | 1; // 0 for Sunday, 1 for Monday
  showWeekNumbers: boolean;
  months: number[]; // Array of months to include (1-12)
  monthsPerRow: number[];
  themeStyle: string;
  options: {
    showHolidays: boolean;
    showLunarPhases: boolean;
    showWeather: boolean;
    showNotes: boolean;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type?: 'holiday' | 'event' | 'reminder';
  color?: string;
  description?: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
  border: string;
}

export interface ThemeFrame {
  type: 'none' | 'basic' | 'seasonal' | 'decorative';
  borderStyle: string;
  cornerStyle?: string;
  svgPattern?: string;
  printOptimized: boolean;
}

export interface CalendarTheme extends ThemeBase {
  id?: string;
  name?: string;
  category?: ThemeCategory;
  description?: string;
  colors: ThemeColors;
  frame: ThemeFrame;
  typography: {
    fontFamily: string;
    headerSize: 'sm' | 'base' | 'lg';
    dateSize: 'sm' | 'base' | 'lg';
  };
  availableMonths?: number[];
  printStyles?: {
    background?: boolean;
    frameOpacity?: number;
    colorAdjustments?: {
      darken?: number;
      saturate?: number;
    };
  };
}

export const themeToSettings = (theme: CalendarTheme): CalendarSettings => ({
  title: theme.title,
  type: theme.type,
  year: theme.year,
  firstDayOfWeek: theme.firstDayOfWeek,
  showWeekNumbers: theme.showWeekNumbers,
  months: theme.months,
  theme: {
    headerColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
    textColor: theme.colors.text,
    accentColor: theme.colors.accent,
  },
  options: theme.options,
});

export const settingsToTheme = (settings: CalendarSettings): CalendarTheme => ({
  title: settings.title,
  type: settings.type,
  year: settings.year,
  firstDayOfWeek: settings.firstDayOfWeek,
  showWeekNumbers: settings.showWeekNumbers,
  months: settings.months,
  monthsPerRow: [3],
  themeStyle: 'default',
  frame: {
    type: 'basic',
    borderStyle: 'solid',
    printOptimized: true,
  },
  colors: {
    primary: settings.theme.headerColor,
    secondary: settings.theme.backgroundColor,
    background: settings.theme.backgroundColor,
    text: settings.theme.textColor,
    accent: settings.theme.accentColor,
    border: settings.theme.headerColor,
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    headerSize: 'base',
    dateSize: 'base',
  },
  options: settings.options,
});

export const defaultCalendarStyle: CalendarSettings = {
  title: 'Default Calendar',
  type: 'personal',
  year: new Date().getFullYear(),
  firstDayOfWeek: 0,
  showWeekNumbers: false,
  months: [],
  theme: {
    headerColor: '#000000',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#000000',
  },
  options: {
    showHolidays: false,
    showLunarPhases: false,
    showWeather: false,
    showNotes: false,
  },
};

export const createBaseTheme = (overrides: Partial<CalendarTheme>): CalendarTheme => ({
  title: overrides.name || 'Default',
  type: 'personal',
  year: new Date().getFullYear(),
  firstDayOfWeek: 0,
  showWeekNumbers: false,
  months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  monthsPerRow: [3],
  themeStyle: 'default',
  options: {
    showLunarPhases: false,
    showHolidays: true,
    showWeather: false,
    showNotes: true,
  },
  frame: {
    type: 'basic',
    borderStyle: 'solid',
    printOptimized: true,
  },
  colors: {
    primary: '#000000',
    secondary: '#FFFFFF',
    background: '#F0F0F0',
    text: '#000000',
    accent: '#FF0000',
    border: '#CCCCCC',
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    headerSize: 'base',
    dateSize: 'base',
  },
  ...overrides,
});

import {CALENDAR_THEMES } from './calendar-themes/index';

export const getThemesForMonth = (month: number): CalendarTheme[] => {
  return CALENDAR_THEMES.filter(
    (theme: CalendarTheme) => !theme.availableMonths || theme.availableMonths.includes(month)
  );
};

export const getOptimizedPrintStyles = (theme: CalendarTheme) => {
  return {
    '@media print': {
      backgroundColor: theme.printStyles?.background ? theme.colors.background : 'transparent',
      borderColor: theme.colors.border,
      color: theme.colors.text,
      opacity: theme.printStyles?.frameOpacity || 1,
      filter: `
          saturate(${theme.printStyles?.colorAdjustments?.saturate || 1})
          brightness(${1 - (theme.printStyles?.colorAdjustments?.darken || 0)})
        `,
    },
  };
};
