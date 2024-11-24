// src/types/calendar-themes/themes.ts
import {CalendarTheme, createBaseTheme } from '../calendar-types';

export const CALENDAR_THEMES: CalendarTheme[] = [
  createBaseTheme({
    id: 'modern',
    name: 'Modern',
    category: 'basic',
    description: 'A modern calendar theme with sleek design.',
    frame: {
      type: 'basic',
      borderStyle: 'dashed',
      printOptimized: true,
    },
    colors: {
      primary: '#1E88E5',
      secondary: '#E3F2FD',
      background: '#FFFFFF',
      text: '#212121',
      accent: '#FF4081',
      border: '#BDBDBD',
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
  }),

  createBaseTheme({
    id: 'classic',
    name: 'Classic',
    category: 'basic',
    description: 'Traditional calendar design',
    colors: {
      primary: '#2c5282',
      secondary: '#bee3f8',
      background: '#ffffff',
      text: '#1a365d',
      accent: '#3182ce',
      border: '#4299e1',
    },
    frame: {
      type: 'basic',
      borderStyle: 'solid',
      printOptimized: true,
    },
    typography: {
      fontFamily: 'Georgia, serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
  }),
];
