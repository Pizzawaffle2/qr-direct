
// src/components/calendar/constants.ts
import { ThemeOptionType, FrameOptionType, FontOptionType, ThemeOption, FrameOption, FontOption } from './types' // Ensure this file exists and is correctly referenced

export const THEME_OPTIONS: ThemeOptionType[] = [
  {
    label: 'Default',
    value: 'default',
    description: 'Clean and professional look',
    colors: {
      primary: '#3B82F6',
      secondary: '#60A5FA',
      background: '#FFFFFF',
      text: '#1F2937'
    }
  },
  {
    label: 'Holiday',
    value: 'holiday',
    description: 'Festive and celebratory theme',
    colors: {
      primary: '#EF4444',
      secondary: '#F87171',
      background: '#FEF2F2',
      text: '#7F1D1D'
    }
  },
  {
    label: 'Minimal',
    value: 'minimal',
    description: 'Simple and elegant design',
    colors: {
      primary: '#111827',
      secondary: '#374151',
      background: '#F9FAFB',
      text: '#111827'
    }
  },
  {
    label: 'Dark',
    value: 'dark',
    description: 'Modern dark mode appearance',
    colors: {
      primary: '#6B7280',
      secondary: '#9CA3AF',
      background: '#1F2937',
      text: '#F9FAFB'
    }
  },
  {
    label: 'Light',
    value: 'light',
    description: 'Bright and airy feel',
    colors: {
      primary: '#D1D5DB',
      secondary: '#E5E7EB',
      background: '#FFFFFF',
      text: '#111827'
    }
  }
] as const

export const FRAME_OPTIONS: FrameOptionType[] = [
  {
    label: 'None',
    value: 'none',
    description: 'No frame border',
    borderStyle: 'none'
  },
  {
    label: 'Spring',
    value: 'spring',
    description: 'Floral and fresh design',
    borderStyle: 'double',
    cornerStyle: 'rounded'
  },
  {
    label: 'Summer',
    value: 'summer',
    description: 'Bright and vibrant border',
    borderStyle: 'solid',
    cornerStyle: 'sharp'
  },
  {
    label: 'Autumn',
    value: 'autumn',
    description: 'Warm and rustic frame',
    borderStyle: 'dashed',
    cornerStyle: 'beveled'
  },
  {
    label: 'Winter',
    value: 'winter',
    description: 'Cool and crisp design',
    borderStyle: 'solid',
    cornerStyle: 'snowflake'
  }
] as const

export const FONT_OPTIONS: FontOptionType[] = [
  {
    label: 'Arial',
    value: 'arial',
    description: 'Clean sans-serif font',
    fontFamily: 'Arial, sans-serif',
    fontWeight: [400, 700]
  },
  {
    label: 'Serif',
    value: 'serif',
    description: 'Traditional serif font',
    fontFamily: 'Georgia, serif',
    fontWeight: [400, 600]
  },
  {
    label: 'Monospace',
    value: 'monospace',
    description: 'Fixed-width font',
    fontFamily: 'Courier New, monospace',
    fontWeight: [400]
  },
  {
    label: 'Inter',
    value: 'inter',
    description: 'Modern sans-serif font',
    fontFamily: 'Inter, sans-serif',
    fontWeight: [400, 500, 600, 700]
  },
  {
    label: 'Roboto',
    value: 'roboto',
    description: 'Google\'s signature font',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: [300, 400, 500, 700]
  }
] as const

// Utility functions
export const getThemeColors = (theme: ThemeOption) => {
  const themeOption = THEME_OPTIONS.find(t => t.value === theme)
  return themeOption?.colors || THEME_OPTIONS[0].colors
}

export const getFrameStyle = (frame: FrameOption) => {
  const frameOption = FRAME_OPTIONS.find(f => f.value === frame)
  return {
    borderStyle: frameOption?.borderStyle || 'none',
    cornerStyle: frameOption?.cornerStyle
  }
}

export const getFontStyle = (font: FontOption) => {
  const fontOption = FONT_OPTIONS.find(f => f.value === font)
  return {
    fontFamily: fontOption?.fontFamily || 'Arial, sans-serif',
    fontWeight: fontOption?.fontWeight?.[0] || 400
  }
}

// Validation functions
export const isValidTheme = (theme: string): theme is ThemeOption => {
  return THEME_OPTIONS.some(t => t.value === theme)
}

export const isValidFrame = (frame: string): frame is FrameOption => {
  return FRAME_OPTIONS.some(f => f.value === frame)
}

export const isValidFont = (font: string): font is FontOption => {
  return FONT_OPTIONS.some(f => f.value === font)
}

// Default settings
export const DEFAULT_SETTINGS = {
  theme: THEME_OPTIONS[0].value,
  frame: FRAME_OPTIONS[0].value,
  font: FONT_OPTIONS[0].value
} as const

// CSS class mappings
export const THEME_CLASSES = {
  default: 'theme-default',
  holiday: 'theme-holiday',
  minimal: 'theme-minimal',
  dark: 'theme-dark',
  light: 'theme-light'
} as const

export const FRAME_CLASSES = {
  none: '',
  spring: 'frame-spring',
  summer: 'frame-summer',
  autumn: 'frame-autumn',
  winter: 'frame-winter'
} as const

export const FONT_CLASSES = {
  arial: 'font-arial',
  serif: 'font-serif',
  monospace: 'font-mono',
  inter: 'font-inter',
  roboto: 'font-roboto'
} as const

// Usage example:
// import { useCallback } from 'react'
// import { cn } from '@/lib/utils'
