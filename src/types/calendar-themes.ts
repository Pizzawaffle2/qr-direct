export type ThemeCategory = 'basic' | 'seasonal' | 'holiday';

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

export interface CalendarTheme {
  id: string;
  name: string;
  category: ThemeCategory;
  description: string;
  frame: ThemeFrame;
  colors: ThemeColors;
  firstDayOfWeek: number;
  showWeekNumbers: boolean;
  monthsPerRow: number;
  typography: {
    fontFamily: string;
    headerSize: string;
    dateSize: string;
  };
  options: {
    showLunarPhases: boolean;
    showHolidays: boolean;
    showWeather: boolean;
    showNotes: boolean;
  };
  availableMonths?: number[];
  printStyles?: {
    background: boolean;
    frameOpacity: number;
    colorAdjustments: {
      saturate: number;
      darken?: number;
    };
  };
}

export const CALENDAR_THEMES: CalendarTheme[] = [
  {
    id: 'default',
    name: 'Default',
    category: 'basic',
    description: 'A basic calendar theme with default settings.',
    frame: {
      type: 'none',
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
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 1,
    typography: {
      fontFamily: 'Arial, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    options: {
      showLunarPhases: false,
      showHolidays: false,
      showWeather: false,
      showNotes: false,
    },
  },
  {
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
    firstDayOfWeek: 1,
    showWeekNumbers: true,
    monthsPerRow: 2,
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
  },
  {
    id: 'autumn-leaves',
    name: 'Autumn Leaves',
    category: 'seasonal',
    description: 'A seasonal theme with autumn colors.',
    frame: {
      type: 'seasonal',
      borderStyle: 'solid',
      printOptimized: true,
    },
    colors: {
      primary: '#FF7043',
      secondary: '#FFCCBC',
      background: '#FFF3E0',
      text: '#BF360C',
      accent: '#D84315',
      border: '#FFAB91',
    },
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 1,
    typography: {
      fontFamily: 'Georgia, serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true,
    },
    availableMonths: [9, 10, 11],
  },
  {
    id: 'thanksgiving',
    name: 'Thanksgiving',
    category: 'holiday',
    description: 'A festive theme for Thanksgiving.',
    frame: {
      type: 'decorative',
      borderStyle: 'solid',
      printOptimized: true,
    },
    colors: {
      primary: '#D2691E',
      secondary: '#FFD700',
      background: '#FFF8DC',
      text: '#8B4513',
      accent: '#FF4500',
      border: '#DEB887',
    },
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 1,
    typography: {
      fontFamily: 'Times New Roman, serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true,
    },
    availableMonths: [10, 11], // October and November
  },
  {
    id: 'halloween',
    name: 'Halloween',
    category: 'holiday',
    description: 'A spooky theme for Halloween.',
    frame: {
      type: 'decorative',
      borderStyle: 'solid',
      printOptimized: true,
    },
    colors: {
      primary: '#FF8C00',
      secondary: '#8B0000',
      background: '#000000',
      text: '#FFFFFF',
      accent: '#FF4500',
      border: '#8B0000',
    },
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 1,
    typography: {
      fontFamily: 'Creepster, cursive',
      headerSize: 'lg',
      dateSize: 'base',
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true,
    },
    availableMonths: [9, 10], // September and October
  },
  {
    id: '4th-of-july',
    name: '4th of July',
    category: 'holiday',
    description: 'A patriotic theme for the 4th of July.',
    frame: {
      type: 'decorative',
      borderStyle: 'solid',
      printOptimized: true,
    },
    colors: {
      primary: '#B22234',
      secondary: '#648bf4',
      background: '#38acd8',
      text: '#b4cdd6',
      accent: '#FF0000',
      border: '#B22234',
    },
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 1,
    typography: {
      fontFamily: 'Arial, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true,
    },
    availableMonths: [7], // July
  },
  {
    id: 'valentines',
    name: 'Valentine\'s Day',
    category: 'holiday',
    description: 'A romantic theme for Valentine\'s Day.',
    frame: {
      type: 'decorative',
      borderStyle: 'solid',
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
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 1,
    typography: {
      fontFamily: 'Courier New, monospace',
      headerSize: 'lg',
      dateSize: 'base',
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true,
    },
    availableMonths: [1, 2], // January and February
  },
  {
    id: 'st-patricks',
    name: 'St. Patrick\'s Day',
    category: 'holiday',
    description: 'A festive theme for St. Patrick\'s Day.',
    frame: {
      type: 'decorative',
      borderStyle: 'solid',
      printOptimized: true,
    },
    colors: {
      primary: '#008000',
      secondary: '#ADFF2F',
      background: '#F0FFF0',
      text: '#006400',
      accent: '#32CD32',
      border: '#008000',
    },
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 1,
    typography: {
      fontFamily: 'Arial, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true,
    },
    availableMonths: [2, 3], // February and March
  },
  {
    id: 'new-year',
    name: 'New Year',
    category: 'holiday',
    description: 'A festive theme for New Year.',
    frame: {
      type: 'decorative',
      borderStyle: 'solid',
      printOptimized: true,
    },
    colors: {
      primary: '#FFD700',
      secondary: '#FFFFFF',
      background: '#000000',
      text: '#FFFFFF',
      accent: '#FF4500',
      border: '#FFD700',
    },
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 1,
    typography: {
      fontFamily: 'Arial, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true,
    },
    availableMonths: [12, 1], // December and January
  },
  {
    id: 'easter',
    name: 'Easter',
    category: 'holiday',
    description: 'A festive theme for Easter.',
    frame: {
      type: 'decorative',
      borderStyle: 'solid',
      printOptimized: true,
    },
    colors: {
      primary: '#FF69B4',
      secondary: '#FFD700',
      background: '#FFFFFF',
      text: '#000000',
      accent: '#FF4500',
      border: '#FF69B4',
    },
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 1,
    typography: {
      fontFamily: 'Arial, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true,
    },
    availableMonths: [3, 4], // March and April
  },
  {
    id: 'summer',
    name: 'Summer',
    category: 'seasonal',
    description: 'A bright and sunny theme for summer.',
    frame: {
      type: 'seasonal',
      borderStyle: 'solid',
      printOptimized: true,
    },
    colors: {
      primary: '#FFD700',
      secondary: '#FF8C00',
      background: '#FFFACD',
      text: '#FF4500',
      accent: '#FF6347',
      border: '#FFD700',
    },
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 1,
    typography: {
      fontFamily: 'Arial, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true,
    },
    availableMonths: [6, 7, 8], // June, July, and August
  },
  {
    id: 'spring',
    name: 'Spring',
    category: 'seasonal',
    description: 'A fresh and vibrant theme for spring.',
    frame: {
      type: 'seasonal',
      borderStyle: 'solid',
      printOptimized: true,
    },
    colors: {
      primary: '#00FF7F',
      secondary: '#ADFF2F',
      background: '#F0FFF0',
      text: '#006400',
      accent: '#32CD32',
      border: '#00FF7F',
    },
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 1,
    typography: {
      fontFamily: 'Arial, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true,
    },
    availableMonths: [3, 4, 5], // March, April, and May
  },
  {
    id: 'winter',
    name: 'Winter',
    category: 'seasonal',
    description: 'A cool and crisp theme for winter.',
    frame: {
      type: 'seasonal',
      borderStyle: 'solid',
      printOptimized: true,
    },
    colors: {
      primary: '#00BFFF',
      secondary: '#ADD8E6',
      background: '#F0F8FF',
      text: '#00008B',
      accent: '#1E90FF',
      border: '#00BFFF',
    },
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 1,
    typography: {
      fontFamily: 'Arial, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true,
    },
    availableMonths: [12, 1, 2], // December, January, and February
  },
  {
    id: 'fall',
    name: 'Fall',
    category: 'seasonal',
    description: 'A warm and cozy theme for fall.',
    frame: {
      type: 'seasonal',
      borderStyle: 'solid',
      printOptimized: true,
    },
    colors: {
      primary: '#FF8C00',
      secondary: '#FFD700',
      background: '#FFF8DC',
      text: '#8B4513',
      accent: '#FF4500',
      border: '#DEB887',
    },
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 1,
    typography: {
      fontFamily: 'Arial, sans-serif',
      headerSize: 'lg',
      dateSize: 'base',
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true,
    },
    availableMonths: [9, 10, 11], // September, October, and November
  },
  {
    id: 'christmas',
    name: 'Christmas',
    category: 'holiday',
    description: 'Traditional Christmas colors with holly frame',
    colors: {
      primary: '#c41e3a', // Christmas red
      secondary: '#1a472a', // Forest green
      background: '#FFFFFF',
      text: '#2C3E50',
      accent: '#FFD700', // Gold
      border: '#2C5530'
    },
    frame: {
      type: 'seasonal',
      borderStyle: 'holly',
      cornerStyle: 'ornament',
      svgPattern: 'holly-pattern',
      printOptimized: true
    },
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 3,
    typography: {
      fontFamily: '',
      headerSize: '',
      dateSize: ''
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true
    },
    availableMonths: [11, 0], // December and January
    printStyles: {
      background: true,
      frameOpacity: 0.8,
      colorAdjustments: {
        darken: 0.1,
        saturate: 1.2
      }
    }
  },

  {
    id: 'winterWonderland',
    name: 'Winter Wonderland',
    category: 'seasonal',
    description: 'Frosty blues and whites with snowflake accents',
    colors: {
      primary: '#2C5282',
      secondary: '#90CDF4',
      background: '#F7FAFC',
      text: '#2A4365',
      accent: '#4299E1',
      border: '#BEE3F8'
    },
    frame: {
      type: 'seasonal',
      borderStyle: 'snowflake',
      cornerStyle: 'icicle',
      svgPattern: 'snow-pattern',
      printOptimized: true
    },
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 3,
    typography: {
      fontFamily: '',
      headerSize: '',
      dateSize: ''
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true
    },
    availableMonths: [11, 0, 1], // December, January, February
    printStyles: {
      background: true,
      frameOpacity: 0.9,
      colorAdjustments: {
        saturate: 0.9
      }
    }
  },

  {
    id: 'cherryBlossom',
    name: 'Cherry Blossom',
    category: 'seasonal',
    description: 'Delicate pink and white with flowing petals',
    colors: {
      primary: '#FFB7C5',
      secondary: '#FFF0F5',
      background: '#FFFFFF',
      text: '#2D3748',
      accent: '#FF69B4',
      border: '#FFE4E1'
    },
    frame: {
      type: 'seasonal',
      borderStyle: 'petals',
      cornerStyle: 'branch',
      svgPattern: 'blossom-pattern',
      printOptimized: true
    },
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 3,
    typography: {
      fontFamily: '',
      headerSize: '',
      dateSize: ''
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true
    },
    availableMonths: [2, 3, 4], // March, April, May
    printStyles: {
      background: true,
      frameOpacity: 0.85,
      colorAdjustments: {
        saturate: 0.95
      }
    }
  },

  {
    id: 'tropical',
    name: 'Tropical Paradise',
    category: 'seasonal',
    description: 'Vibrant colors with palm leaves and exotic flowers',
    colors: {
      primary: '#2F855A',
      secondary: '#38B2AC',
      background: '#F0FFF4',
      text: '#234E52',
      accent: '#F6AD55',
      border: '#4FD1C5'
    },
    frame: {
      type: 'seasonal',
      borderStyle: 'palmLeaves',
      cornerStyle: 'flower',
      svgPattern: 'tropical-pattern',
      printOptimized: true
    },
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 3,
    typography: {
      fontFamily: '',
      headerSize: '',
      dateSize: ''
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true
    },
    availableMonths: [5, 6, 7], // June, July, August
    printStyles: {
      background: true,
      frameOpacity: 0.8,
      colorAdjustments: {
        saturate: 1.1
      }
    }
  },

  {
    id: 'pumpkinlatte',
    name: 'Pumpkin Latte',
    category: 'seasonal',
    description: 'Warm fall colors with falling leaf pattern',
    colors: {
      primary: '#C05621',
      secondary: '#DD6B20',
      background: '#FFFAF0',
      text: '#2D3748',
      accent: '#F6AD55',
      border: '#ED8936'
    },
    frame: {
      type: 'seasonal',
      borderStyle: 'leaves',
      cornerStyle: 'acorn',
      svgPattern: 'falling-leaves-pattern',
      printOptimized: true
    },
    firstDayOfWeek: 0,
    showWeekNumbers: false,
    monthsPerRow: 3,
    typography: {
      fontFamily: '',
      headerSize: '',
      dateSize: ''
    },
    options: {
      showLunarPhases: false,
      showHolidays: true,
      showWeather: false,
      showNotes: true
    },
    availableMonths: [8, 9, 10], // September, October, November
    printStyles: {
      background: true,
      frameOpacity: 0.85,
      colorAdjustments: {
        saturate: 1.05
      }
    }
  }
];

export const getThemesForMonth = (month: number): CalendarTheme[] => {
  return CALENDAR_THEMES.filter(theme => 
    !theme.availableMonths || theme.availableMonths.includes(month)
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
      `
    }
  };
};