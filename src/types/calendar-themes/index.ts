// src/types/calendar-themes/index.ts
import {CalendarTheme } from '../calendar-types';
import {basicThemes } from './basic-themes';
import {seasonalThemes } from './seasonal-themes';
import {holidayThemes } from './holiday-themes';
import {THEME_CATEGORIES } from './theme-utils';

export const CALENDAR_THEMES: CalendarTheme[] = [
  ...basicThemes,
  ...seasonalThemes,
  ...holidayThemes,
];

// Helper functions for theme filtering
export const getThemesByCategory = (category: keyof typeof THEME_CATEGORIES) =>
  CALENDAR_THEMES.filter((theme) => theme.category === THEME_CATEGORIES[category]);

export const getAvailableThemesForMonth = (month: number) =>
  CALENDAR_THEMES.filter(
    (theme) => !theme.availableMonths || theme.availableMonths.includes(month)
  );

// Re-export everything needed
export * from './theme-utils';
export { basicThemes, seasonalThemes, holidayThemes };
