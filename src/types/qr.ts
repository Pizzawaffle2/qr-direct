// src/types/qr.ts

import {LucideIcon } from 'lucide-react';

export type QRCodeType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard' | 'location';

// Base QR Code data interface
export interface BaseQRCodeData {
  type: QRCodeType;
}
export interface QRCodeAnalytics {

  id: string;

  scans: number;

  uniqueScans: number;

  locations: string[];

  devices: string[];

  browsers: string[];

  timeRanges: string[];

  created: Date;

  updated: Date;

}

export const ERROR_CORRECTION_LEVELS = {
  L: { label: 'Low', description: '7% error recovery' },

  M: { label: 'Medium', description: '15% error recovery' },

  Q: { label: 'Quartile', description: '25% error recovery' },

  H: { label: 'High', description: '30% error recovery' },
} as const;

// URL QR Code
export interface URLQRCodeData extends BaseQRCodeData {
  type: 'url';
  url: string;
}

// Text QR Code
export interface TextQRCodeData extends BaseQRCodeData {
  type: 'text';
  text: string;
}

// Email QR Code
export interface EmailQRCodeData extends BaseQRCodeData {
  type: 'email';
  email: string;
  subject?: string;
  body?: string;
}

// Phone QR Code
export interface PhoneQRCodeData extends BaseQRCodeData {
  type: 'phone';
  phone: string;
}

// SMS QR Code
export interface SMSQRCodeData extends BaseQRCodeData {
  type: 'sms';
  phone: string;
  message?: string;
}

// WiFi QR Code
export interface WiFiQRCodeData extends BaseQRCodeData {
  type: 'wifi';
  ssid: string;
  password?: string;
  networkType: 'WEP' | 'WPA' | 'nopass';
  hidden: boolean;
}

// vCard QR Code
export interface VCardQRCodeData extends BaseQRCodeData {
  type: 'vcard';
  firstName: string;
  lastName?: string;
  organization?: string;
  title?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
}

// Location QR Code
export interface LocationQRCodeData extends BaseQRCodeData {
  type: 'location';
  latitude: number;
  longitude: number;
  name?: string;
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
  | LocationQRCodeData;

// Style Options
export interface QRStyleOptions {
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  animated?: boolean;
  animationType?: 'fade' | 'slide' | 'bounce';
  animationDuration?: number;
  size: number;
  margin: number;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  foregroundColor: string;
  backgroundColor: string;
  dotStyle?: 'square' | 'dots' | 'rounded' | 'classy' | 'sharp';
  cornerStyle?: 'square' | 'dots' | 'rounded';
  frame?: boolean;
  frameStyle?: 'basic' | 'modern' | 'vintage';
  frameColor?: string;
  frameText?: string;
  frameTextColor?: string;
  frameSize?: number;
  gradientType?: 'linear' | 'radial';
  gradientColors?: {
    start: string;
    end: string;
    direction?: number;
  };
  logo?: string;
  logoSize?: number;
  logoPadding?: number;
  logoBackgroundColor?: string;
  logoOpacity?: number;
}

// QR Type Info
export interface QRTypeInfo {
  name: string;
  description: string;
  icon: LucideIcon;
}

export type QRTypes = {
  [K in QRCodeType]: QRTypeInfo;
};
