// src/types/calendar-themes/seasonal-themes.ts
import {createBaseTheme } from './theme-utils';

export const seasonalThemes = [
  createBaseTheme({
    id: 'spring',
    name: 'Spring Bloom',
    category: 'seasonal',
    description: 'Fresh and vibrant spring colors with floral accents',
    frame: {
      type: 'seasonal',
      borderStyle: 'solid',
      cornerStyle: 'floral',
      svgPattern: 'flower-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#48BB78',
      secondary: '#9AE6B4',
      background: '#F0FFF4',
      text: '#22543D',
      accent: '#FC8181',
      border: '#68D391',
    },
    typography: {
      fontFamily: 'Quicksand, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [3, 4, 5], // March, April, May
  }),

  createBaseTheme({
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    category: 'seasonal',
    description: 'Delicate pink and white with flowing petals',
    frame: {
      type: 'seasonal',
      borderStyle: 'petals',
      cornerStyle: 'branch',
      svgPattern: 'blossom-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#FFB7C5',
      secondary: '#FFF0F5',
      background: '#FFFFFF',
      text: '#2D3748',
      accent: '#FF69B4',
      border: '#FFE4E1',
    },
    typography: {
      fontFamily: 'Noto Sans JP, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [3, 4], // March, April
    printStyles: {
      background: true,
      frameOpacity: 0.85,
      colorAdjustments: {
        saturate: 0.95,
      },
    },
  }),

  createBaseTheme({
    id: 'summer',
    name: 'Summer Breeze',
    category: 'seasonal',
    description: 'Bright and sunny colors with a beach vibe',
    frame: {
      type: 'seasonal',
      borderStyle: 'waves',
      cornerStyle: 'shell',
      svgPattern: 'beach-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#4299E1',
      secondary: '#BEE3F8',
      background: '#EBF8FF',
      text: '#2C5282',
      accent: '#F6AD55',
      border: '#90CDF4',
    },
    typography: {
      fontFamily: 'Montserrat, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [6, 7, 8], // June, July, August
  }),

  createBaseTheme({
    id: 'tropical',
    name: 'Tropical Paradise',
    category: 'seasonal',
    description: 'Vibrant colors with palm leaves and exotic flowers',
    frame: {
      type: 'seasonal',
      borderStyle: 'palmLeaves',
      cornerStyle: 'flower',
      svgPattern: 'tropical-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#2F855A',
      secondary: '#38B2AC',
      background: '#F0FFF4',
      text: '#234E52',
      accent: '#F6AD55',
      border: '#4FD1C5',
    },
    typography: {
      fontFamily: 'Playfair Display, serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [5, 6, 7, 8], // May, June, July, August
    printStyles: {
      background: true,
      frameOpacity: 0.8,
      colorAdjustments: {
        saturate: 1.1,
      },
    },
  }),

  createBaseTheme({
    id: 'autumn',
    name: 'Autumn Leaves',
    category: 'seasonal',
    description: 'Warm fall colors with falling leaf patterns',
    frame: {
      type: 'seasonal',
      borderStyle: 'leaves',
      cornerStyle: 'acorn',
      svgPattern: 'falling-leaves-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#DD6B20',
      secondary: '#FEEBC8',
      background: '#FFFAF0',
      text: '#7B341E',
      accent: '#F6AD55',
      border: '#ED8936',
    },
    typography: {
      fontFamily: 'Merriweather, serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [9, 10, 11], // September, October, November
  }),

  createBaseTheme({
    id: 'harvest',
    name: 'Harvest Season',
    category: 'seasonal',
    description: 'Rich autumn colors with harvest motifs',
    frame: {
      type: 'seasonal',
      borderStyle: 'wheat',
      cornerStyle: 'pumpkin',
      svgPattern: 'harvest-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#C05621',
      secondary: '#FEEBC8',
      background: '#FFF5F5',
      text: '#744210',
      accent: '#ED8936',
      border: '#DD6B20',
    },
    typography: {
      fontFamily: 'Crimson Text, serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [9, 10, 11], // September, October, November
  }),

  createBaseTheme({
    id: 'winter',
    name: 'Winter Frost',
    category: 'seasonal',
    description: 'Cool, crisp colors with snowflake accents',
    frame: {
      type: 'seasonal',
      borderStyle: 'frost',
      cornerStyle: 'snowflake',
      svgPattern: 'frost-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#2B6CB0',
      secondary: '#BEE3F8',
      background: '#EBF8FF',
      text: '#2A4365',
      accent: '#63B3ED',
      border: '#90CDF4',
    },
    typography: {
      fontFamily: 'Open Sans, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [12, 1, 2], // December, January, February
  }),

  createBaseTheme({
    id: 'winter-wonderland',
    name: 'Winter Wonderland',
    category: 'seasonal',
    description: 'Frosty blues and whites with snowflake accents',
    frame: {
      type: 'seasonal',
      borderStyle: 'snowflake',
      cornerStyle: 'icicle',
      svgPattern: 'snow-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#2C5282',
      secondary: '#90CDF4',
      background: '#F7FAFC',
      text: '#2A4365',
      accent: '#4299E1',
      border: '#BEE3F8',
    },
    typography: {
      fontFamily: 'Raleway, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [12, 1, 2], // December, January, February
    printStyles: {
      background: true,
      frameOpacity: 0.9,
      colorAdjustments: {
        saturate: 0.9,
      },
    },
  }),
];
