// src/types/calendar-themes/theme-utils.ts
import {CalendarTheme } from '../calendar-types';

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

// Theme groups for better organization
export const THEME_CATEGORIES = {
  BASIC: 'basic',
  SEASONAL: 'seasonal',
  HOLIDAY: 'holiday',
} as const;

export type ThemeCategory = (typeof THEME_CATEGORIES)[keyof typeof THEME_CATEGORIES];
