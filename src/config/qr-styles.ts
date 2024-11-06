// src/config/qr-styles.ts

export const QR_STYLE_PRESETS = {
    classic: {
      dotStyle: 'square',
      size: 300,
      margin: 4,
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      errorCorrection: 'M',
    },
    modern: {
      dotStyle: 'rounded',
      size: 300,
      margin: 4,
      gradientType: 'linear',
      gradientColors: {
        start: '#4F46E5',
        end: '#9333EA',
        direction: 45,
      },
      backgroundColor: '#FFFFFF',
      errorCorrection: 'M',
    },
    minimal: {
      dotStyle: 'dots',
      size: 300,
      margin: 4,
      foregroundColor: '#374151',
      backgroundColor: '#F3F4F6',
      errorCorrection: 'M',
    },
    branded: {
      dotStyle: 'classy',
      size: 300,
      margin: 4,
      foregroundColor: '#2563EB',
      backgroundColor: '#FFFFFF',
      errorCorrection: 'H',
      logoSize: 20,
      logoPadding: 2,
      logoBackgroundColor: '#FFFFFF',
    },
  } as const
  
  export const QR_DOT_STYLES = {
    square: 'Square',
    dots: 'Dots',
    rounded: 'Rounded',
    classy: 'Classy',
    sharp: 'Sharp',
  } as const
  
  export const QR_CORNER_STYLES = {
    square: 'Square',
    rounded: 'Rounded',
    dots: 'Dots',
  } as const
  
  export const QR_ERROR_LEVELS = {
    L: { value: 'L', label: 'Low (7%)', description: 'Best for clean environments' },
    M: { value: 'M', label: 'Medium (15%)', description: 'Balanced protection' },
    Q: { value: 'Q', label: 'High (25%)', description: 'For minor damage resistance' },
    H: { value: 'H', label: 'Highest (30%)', description: 'Best damage resistance' },
  } as const