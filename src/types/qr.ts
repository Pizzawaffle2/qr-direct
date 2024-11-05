// src/types/qr.ts

export type QRCodeType = 
  | 'url' 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'sms' 
  | 'wifi' 
  | 'vcard' 
  | 'location'

// Base QR Code data interface
interface BaseQRCodeData {
  type: QRCodeType
  title?: string
}

// URL QR Code
interface URLQRCodeData extends BaseQRCodeData {
  type: 'url'
  url: string
}

// Text QR Code
interface TextQRCodeData extends BaseQRCodeData {
  type: 'text'
  text: string
}

// Email QR Code
interface EmailQRCodeData extends BaseQRCodeData {
  type: 'email'
  email: string
  subject?: string
  body?: string
}

// Phone QR Code
interface PhoneQRCodeData extends BaseQRCodeData {
  type: 'phone'
  phone: string
}

// SMS QR Code
interface SMSQRCodeData extends BaseQRCodeData {
  type: 'sms'
  phone: string
  message?: string
}

// WiFi QR Code
interface WiFiQRCodeData extends BaseQRCodeData {
  type: 'wifi'
  ssid: string
  password?: string
  networkType: 'WEP' | 'WPA' | 'nopass'
  hidden: boolean
}

// vCard QR Code
interface VCardQRCodeData extends BaseQRCodeData {
  type: 'vcard'
  firstName: string
  lastName?: string
  organization?: string
  title?: string
  email?: string
  phone?: string
  website?: string
  address?: string
}

// Location QR Code
interface LocationQRCodeData extends BaseQRCodeData {
  type: 'location'
  latitude: number
  longitude: number
  name?: string
}

// Union type of all QR code data types
export type QRCodeData = 
  | URLQRCodeData
  | TextQRCodeData
  | EmailQRCodeData
  | PhoneQRCodeData
  | SMSQRCodeData
  | WiFiQRCodeData
  | VCardQRCodeData
  | LocationQRCodeData

// Style options for QR code generation
export interface QRStyleOptions {
  size?: number
  margin?: number
  backgroundColor?: string
  foregroundColor?: string
  errorCorrection?: 'L' | 'M' | 'Q' | 'H'
  logo?: string
  gradient?: {
    from: string
    to: string
  }
}

// QR code metadata for storage
export interface QRCodeMetadata {
  id: string
  userId: string
  title: string
  type: QRCodeType
  data: QRCodeData
  style: QRStyleOptions
  scans: number
  created: Date
  updated: Date
}

// Analytics data
export interface QRCodeAnalytics {
  scans: number
  uniqueScans: number
  locations: {
    country: string
    count: number
  }[]
  devices: {
    type: string
    count: number
  }[]
  browsers: {
    name: string
    count: number
  }[]
  timeRanges: {
    date: string
    count: number
  }[]
}

// Template interface
export interface QRCodeTemplate {
  id: string
  name: string
  description?: string
  style: QRStyleOptions
  previewData: QRCodeData
  isPublic: boolean
  userId: string
  created: Date
  updated: Date
}

// History item interface
export interface QRCodeHistoryItem {
  id: string
  url: string
  title: string
  type: QRCodeType
  created: Date
}

// Export constants
export const QR_CODE_SIZES = {
  min: 100,
  max: 2000,
  default: 400,
} as const

export const QR_CODE_MARGINS = {
  min: 0,
  max: 10,
  default: 4,
} as const

export const ERROR_CORRECTION_LEVELS = {
  L: { value: 'L', label: 'Low (7%)', description: 'Best for clean environments' },
  M: { value: 'M', label: 'Medium (15%)', description: 'Balanced protection' },
  Q: { value: 'Q', label: 'High (25%)', description: 'For minor damage resistance' },
  H: { value: 'H', label: 'Highest (30%)', description: 'Best damage resistance' },
} as const

export const QR_CODE_TYPES = {
  url: {
    name: 'URL',
    description: 'Create QR code for website links',
    icon: 'Link'
  },
  text: {
    name: 'Text',
    description: 'Create QR code for plain text',
    icon: 'Type'
  },
  email: {
    name: 'Email',
    description: 'Create QR code for email address',
    icon: 'Mail'
  },
  phone: {
    name: 'Phone',
    description: 'Create QR code for phone numbers',
    icon: 'Phone'
  },
  sms: {
    name: 'SMS',
    description: 'Create QR code for text messages',
    icon: 'MessageSquare'
  },
  wifi: {
    name: 'WiFi',
    description: 'Create QR code for WiFi networks',
    icon: 'Wifi'
  },
  vcard: {
    name: 'vCard',
    description: 'Create QR code for contact information',
    icon: 'Contact'
  },
  location: {
    name: 'Location',
    description: 'Create QR code for geographic locations',
    icon: 'MapPin'
  },
} as const