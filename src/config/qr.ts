// src/config/qr.ts
export const QR_CONFIG = {
  defaultSize: 400,
  minSize: 100,
  maxSize: 2000,
  defaultMargin: 4,
  defaultErrorCorrection: 'M',
  types: {
    url: {
      name: 'URL',
      icon: 'Link',
    },
    text: {
      name: 'Text',
      icon: 'Type',
    },
    email: {
      name: 'Email',
      icon: 'Mail',
    },
    phone: {
      name: 'Phone',
      icon: 'Phone',
    },
    sms: {
      name: 'SMS',
      icon: 'MessageSquare',
    },
    wifi: {
      name: 'WiFi',
      icon: 'Wifi',
    },
    location: {
      name: 'Location',
      icon: 'MapPin',
    },
    vcard: {
      name: 'vCard',
      icon: 'Contact',
    },
  },
  errorCorrectionLevels: [
    { value: 'L', label: 'Low (7%)', description: 'Best for clean environments' },
    { value: 'M', label: 'Medium (15%)', description: 'Balanced protection' },
    { value: 'Q', label: 'High (25%)', description: 'For minor damage resistance' },
    { value: 'H', label: 'Highest (30%)', description: 'Best damage resistance' },
  ],
} as const;
