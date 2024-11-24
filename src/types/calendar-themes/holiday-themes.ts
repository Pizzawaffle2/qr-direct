// src/types/calendar-themes/holiday-themes.ts
import {createBaseTheme } from './theme-utils';

export const holidayThemes = [
  // Western/Christian Holidays
  createBaseTheme({
    id: 'christmas',
    name: 'Christmas',
    category: 'holiday',
    description: 'Traditional Christmas colors with holly and ornaments',
    frame: {
      type: 'decorative',
      borderStyle: 'holly',
      cornerStyle: 'ornament',
      svgPattern: 'holly-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#C41E3A',
      secondary: '#1A472A',
      background: '#FFFFFF',
      text: '#2C3E50',
      accent: '#FFD700',
      border: '#2C5530',
    },
    typography: {
      fontFamily: 'Playfair Display, serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [11, 12], // December
    printStyles: {
      background: true,
      frameOpacity: 0.8,
      colorAdjustments: { darken: 0.1, saturate: 1.2 },
    },
  }),

  createBaseTheme({
    id: 'lunar-new-year',
    name: 'Lunar New Year',
    category: 'holiday',
    description: 'Festive red and gold with traditional patterns',
    frame: {
      type: 'decorative',
      borderStyle: 'lantern',
      cornerStyle: 'cloud',
      svgPattern: 'lucky-cloud-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#CF1322',
      secondary: '#FAAD14',
      background: '#FFF1F0',
      text: '#000000',
      accent: '#FFD700',
      border: '#FF4D4F',
    },
    typography: {
      fontFamily: 'Noto Sans SC, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [1, 2], // Varies by lunar calendar
  }),

  createBaseTheme({
    id: 'diwali',
    name: 'Diwali',
    category: 'holiday',
    description: 'Vibrant colors with rangoli patterns and diyas',
    frame: {
      type: 'decorative',
      borderStyle: 'rangoli',
      cornerStyle: 'diya',
      svgPattern: 'rangoli-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#FF3D00',
      secondary: '#FFD700',
      background: '#FFF3E0',
      text: '#3E2723',
      accent: '#FF9800',
      border: '#FB8C00',
    },
    typography: {
      fontFamily: 'Poppins, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [10, 11], // Varies by lunar calendar
  }),

  createBaseTheme({
    id: 'ramadan',
    name: 'Ramadan',
    category: 'holiday',
    description: 'Elegant Islamic patterns with crescent moon motifs',
    frame: {
      type: 'decorative',
      borderStyle: 'geometric',
      cornerStyle: 'crescent',
      svgPattern: 'islamic-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#076678',
      secondary: '#83A598',
      background: '#FBF1C7',
      text: '#3C3836',
      accent: '#D79921',
      border: '#458588',
    },
    typography: {
      fontFamily: 'Amiri, serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [3, 4], // Varies by lunar calendar
  }),

  createBaseTheme({
    id: 'hanukkah',
    name: 'Hanukkah',
    category: 'holiday',
    description: 'Traditional blue and silver with Star of David patterns',
    frame: {
      type: 'decorative',
      borderStyle: 'menorah',
      cornerStyle: 'star',
      svgPattern: 'star-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#0047AB',
      secondary: '#87CEEB',
      background: '#FFFFFF',
      text: '#1A1A1A',
      accent: '#C0C0C0',
      border: '#4682B4',
    },
    typography: {
      fontFamily: 'Frank Ruhl Libre, serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [11, 12], // Varies by lunar calendar
  }),

  createBaseTheme({
    id: 'valentines',
    name: "Valentine's Day",
    category: 'holiday',
    description: 'Romantic pinks and reds with heart motifs',
    frame: {
      type: 'decorative',
      borderStyle: 'hearts',
      cornerStyle: 'cupid',
      svgPattern: 'heart-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#FF69B4',
      secondary: '#FFC0CB',
      background: '#FFF0F5',
      text: '#FF1493',
      accent: '#FFB6C1',
      border: '#FF69B4',
    },
    typography: {
      fontFamily: 'Dancing Script, cursive',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [1, 2], // February
  }),

  createBaseTheme({
    id: 'halloween',
    name: 'Halloween',
    category: 'holiday',
    description: 'Spooky orange and black with haunted motifs',
    frame: {
      type: 'decorative',
      borderStyle: 'spooky',
      cornerStyle: 'pumpkin',
      svgPattern: 'halloween-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#FF6B00',
      secondary: '#571D00',
      background: '#000000',
      text: '#FFFFFF',
      accent: '#9B4800',
      border: '#FF6B00',
    },
    typography: {
      fontFamily: 'Creepster, cursive',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [9, 10], // October
  }),

  createBaseTheme({
    id: 'carnival',
    name: 'Carnival',
    category: 'holiday',
    description: 'Vibrant colors for Mardi Gras and Carnival celebrations',
    frame: {
      type: 'decorative',
      borderStyle: 'masks',
      cornerStyle: 'fleurDeLis',
      svgPattern: 'carnival-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#673AB7',
      secondary: '#FFD700',
      background: '#FFFFFF',
      text: '#4A148C',
      accent: '#00C853',
      border: '#9C27B0',
    },
    typography: {
      fontFamily: 'Abril Fatface, cursive',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [1, 2], // Varies
  }),

  createBaseTheme({
    id: 'dia-de-muertos',
    name: 'Día de los Muertos',
    category: 'holiday',
    description: 'Colorful celebration of Day of the Dead',
    frame: {
      type: 'decorative',
      borderStyle: 'marigold',
      cornerStyle: 'skull',
      svgPattern: 'calavera-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#FF4081',
      secondary: '#FFD700',
      background: '#000000',
      text: '#FFFFFF',
      accent: '#00BCD4',
      border: '#FF4081',
    },
    typography: {
      fontFamily: 'Lobster, cursive',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [10], // November 1-2
  }),
  // Continuing in holiday-themes.ts

  createBaseTheme({
    id: 'eid-al-fitr',
    name: 'Eid al-Fitr',
    category: 'holiday',
    description: 'Elegant celebration of Eid with Islamic geometric patterns',
    frame: {
      type: 'decorative',
      borderStyle: 'arabesque',
      cornerStyle: 'crescentStar',
      svgPattern: 'geometric-islamic',
      printOptimized: true,
    },
    colors: {
      primary: '#00838F',
      secondary: '#B2EBF2',
      background: '#E0F7FA',
      text: '#006064',
      accent: '#FFD700',
      border: '#0097A7',
    },
    typography: {
      fontFamily: 'Noto Kufi Arabic, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [4, 5], // Varies by lunar calendar
  }),

  createBaseTheme({
    id: 'eid-al-adha',
    name: 'Eid al-Adha',
    category: 'holiday',
    description: 'Rich patterns celebrating the festival of sacrifice',
    frame: {
      type: 'decorative',
      borderStyle: 'arabesque',
      cornerStyle: 'dome',
      svgPattern: 'mosaic-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#5D4037',
      secondary: '#D7CCC8',
      background: '#EFEBE9',
      text: '#3E2723',
      accent: '#8D6E63',
      border: '#795548',
    },
    typography: {
      fontFamily: 'Noto Naskh Arabic, serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [6, 7], // Varies by lunar calendar
  }),

  createBaseTheme({
    id: 'holi',
    name: 'Holi',
    category: 'holiday',
    description: 'Vibrant colors celebrating the festival of colors',
    frame: {
      type: 'decorative',
      borderStyle: 'colorSplash',
      cornerStyle: 'mandala',
      svgPattern: 'holi-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#FF4081',
      secondary: '#29B6F6',
      background: '#FFFFFF',
      text: '#311B92',
      accent: '#FFEB3B',
      border: '#E91E63',
    },
    typography: {
      fontFamily: 'Mukta, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [2, 3], // Usually March
  }),

  createBaseTheme({
    id: 'passover',
    name: 'Passover',
    category: 'holiday',
    description: 'Traditional design with Seder and Star of David motifs',
    frame: {
      type: 'decorative',
      borderStyle: 'vine',
      cornerStyle: 'starOfDavid',
      svgPattern: 'seder-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#1565C0',
      secondary: '#BBDEFB',
      background: '#FFFFFF',
      text: '#0D47A1',
      accent: '#2196F3',
      border: '#1976D2',
    },
    typography: {
      fontFamily: 'David Libre, serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [3, 4], // Varies by lunar calendar
  }),

  createBaseTheme({
    id: 'nowruz',
    name: 'Nowruz',
    category: 'holiday',
    description: 'Persian New Year with traditional motifs',
    frame: {
      type: 'decorative',
      borderStyle: 'persianFloral',
      cornerStyle: 'tulip',
      svgPattern: 'nowruz-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#00BFA5',
      secondary: '#B2DFDB',
      background: '#E0F2F1',
      text: '#004D40',
      accent: '#FFD700',
      border: '#00897B',
    },
    typography: {
      fontFamily: 'Vazirmatn, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [2, 3], // March 21
  }),

  createBaseTheme({
    id: 'mid-autumn',
    name: 'Mid-Autumn Festival',
    category: 'holiday',
    description: 'Elegant moon festival design with lantern motifs',
    frame: {
      type: 'decorative',
      borderStyle: 'lanterns',
      cornerStyle: 'fullMoon',
      svgPattern: 'mooncake-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#B71C1C',
      secondary: '#FFE082',
      background: '#FFF3E0',
      text: '#3E2723',
      accent: '#FFC107',
      border: '#D32F2F',
    },
    typography: {
      fontFamily: 'Ma Shan Zheng, cursive',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [8, 9], // Varies by lunar calendar
  }),

  createBaseTheme({
    id: 'songkran',
    name: 'Songkran',
    category: 'holiday',
    description: 'Thai New Year water festival theme',
    frame: {
      type: 'decorative',
      borderStyle: 'water',
      cornerStyle: 'lotus',
      svgPattern: 'thai-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#1A237E',
      secondary: '#C5CAE9',
      background: '#E8EAF6',
      text: '#0D47A1',
      accent: '#00BCD4',
      border: '#3F51B5',
    },
    typography: {
      fontFamily: 'Prompt, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [3, 4], // April 13-15
  }),

  createBaseTheme({
    id: 'dragon-boat',
    name: 'Dragon Boat Festival',
    category: 'holiday',
    description: 'Dynamic theme with dragon boat and zongzi motifs',
    frame: {
      type: 'decorative',
      borderStyle: 'waves',
      cornerStyle: 'dragon',
      svgPattern: 'dragon-boat-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#00796B',
      secondary: '#B2DFDB',
      background: '#E0F2F1',
      text: '#004D40',
      accent: '#FFC107',
      border: '#00897B',
    },
    typography: {
      fontFamily: 'ZCOOL XiaoWei, serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [5, 6], // Varies by lunar calendar
  }),

  createBaseTheme({
    id: 'vesak',
    name: 'Vesak',
    category: 'holiday',
    description: 'Buddhist celebration with lotus and dharma wheel motifs',
    frame: {
      type: 'decorative',
      borderStyle: 'lotus',
      cornerStyle: 'dharmaWheel',
      svgPattern: 'bodhi-pattern',
      printOptimized: true,
    },
    colors: {
      primary: '#9C27B0',
      secondary: '#E1BEE7',
      background: '#F3E5F5',
      text: '#4A148C',
      accent: '#FFC107',
      border: '#7B1FA2',
    },
    typography: {
      fontFamily: 'Noto Sans Sinhala, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    availableMonths: [4, 5], // Varies by lunar calendar
  }),
];
