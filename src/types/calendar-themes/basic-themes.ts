// src/types/calendar-themes/basic-themes.ts
import {createBaseTheme } from './theme-utils';

export const basicThemes = [
  createBaseTheme({
    id: 'default',
    name: 'Default',
    category: 'basic',
    description: 'A basic calendar theme with default settings.',
  }),

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
    options: {
      showLunarPhases: true,
      showHolidays: true,
      showWeather: true,
      showNotes: true,
    },
  }),

  createBaseTheme({
    id: 'minimalist',
    name: 'Minimalist',
    category: 'basic',
    description: 'Clean and simple design with minimal distractions',
    frame: {
      type: 'basic',
      borderStyle: 'none',
      printOptimized: true,
    },
    colors: {
      primary: '#2D3748',
      secondary: '#EDF2F7',
      background: '#FFFFFF',
      text: '#1A202C',
      accent: '#4A5568',
      border: '#E2E8F0',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      headerSize: 'base',
      dateSize: 'base',
    },
  }),

  createBaseTheme({
    id: 'dark-mode',
    name: 'Dark Mode',
    category: 'basic',
    description: 'Easy on the eyes with dark background',
    frame: {
      type: 'basic',
      borderStyle: 'solid',
      printOptimized: true,
    },
    colors: {
      primary: '#81E6D9',
      secondary: '#2D3748',
      background: '#1A202C',
      text: '#E2E8F0',
      accent: '#4FD1C5',
      border: '#2D3748',
    },
    typography: {
      fontFamily: 'system-ui, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
  }),

  createBaseTheme({
    id: 'professional',
    name: 'Professional',
    category: 'basic',
    description: 'Sophisticated design for business environments',
    frame: {
      type: 'basic',
      borderStyle: 'solid',
      printOptimized: true,
    },
    colors: {
      primary: '#2C5282',
      secondary: '#EBF8FF',
      background: '#FFFFFF',
      text: '#2A4365',
      accent: '#3182CE',
      border: '#BEE3F8',
    },
    typography: {
      fontFamily: 'Georgia, serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
  }),

  createBaseTheme({
    id: 'classic',
    name: 'Classic',
    category: 'basic',
    description: 'Traditional calendar design with a timeless feel',
    frame: {
      type: 'basic',
      borderStyle: 'double',
      printOptimized: true,
    },
    colors: {
      primary: '#742A2A',
      secondary: '#FFFAF0',
      background: '#FFF5F5',
      text: '#2D3748',
      accent: '#C53030',
      border: '#9B2C2C',
    },
    typography: {
      fontFamily: 'Times New Roman, serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
  }),

  createBaseTheme({
    id: 'monochrome',
    name: 'Monochrome',
    category: 'basic',
    description: 'Clean black and white design',
    frame: {
      type: 'basic',
      borderStyle: 'solid',
      printOptimized: true,
    },
    colors: {
      primary: '#000000',
      secondary: '#F7FAFC',
      background: '#FFFFFF',
      text: '#1A202C',
      accent: '#4A5568',
      border: '#CBD5E0',
    },
    typography: {
      fontFamily: 'Courier New, monospace',
      headerSize: 'base',
      dateSize: 'base',
    },
  }),

  createBaseTheme({
    id: 'geometric',
    name: 'Geometric',
    category: 'basic',
    description: 'Modern design with geometric elements',
    frame: {
      type: 'basic',
      borderStyle: 'solid',
      printOptimized: true,
      svgPattern: 'geometric-pattern',
    },
    colors: {
      primary: '#805AD5',
      secondary: '#FAF5FF',
      background: '#FFFFFF',
      text: '#44337A',
      accent: '#6B46C1',
      border: '#D6BCFA',
    },
    typography: {
      fontFamily: 'Futura, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
  }),

  createBaseTheme({
    id: 'minimal-contrast',
    name: 'High Contrast',
    category: 'basic',
    description: 'Maximum readability with high contrast colors',
    frame: {
      type: 'basic',
      borderStyle: 'solid',
      printOptimized: true,
    },
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      background: '#FFFFFF',
      text: '#000000',
      accent: '#FF0000',
      border: '#000000',
    },
    typography: {
      fontFamily: 'Arial, sans-serif',
      headerSize: 'lg',
      dateSize: 'lg',
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: false,
    },
  }),

  createBaseTheme({
    id: 'pastel',
    name: 'Pastel',
    category: 'basic',
    description: 'Soft, soothing pastel colors',
    frame: {
      type: 'basic',
      borderStyle: 'solid',
      printOptimized: true,
    },
    colors: {
      primary: '#9F7AEA',
      secondary: '#F3E8FF',
      background: '#FAF5FF',
      text: '#553C9A',
      accent: '#B794F4',
      border: '#E9D8FD',
    },
    typography: {
      fontFamily: 'Quicksand, sans-serif',
      headerSize: 'base',
      dateSize: 'base',
    },
  }),
];
