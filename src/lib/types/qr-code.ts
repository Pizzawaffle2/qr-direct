// src/lib/types/qr-code.ts

export type QRCodeType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'location';

export interface QRCodeData {
  type: QRCodeType;
  // URL
  url?: string;
  // Text
  text?: string;
  // Email
  email?: string;
  subject?: string;
  // Phone
  phone?: string;
  // SMS
  message?: string;
  // WiFi
  ssid?: string;
  password?: string;
  networkType?: 'WEP' | 'WPA' | 'nopass';
  hidden?: boolean;
  // Location
  latitude?: number;
  longitude?: number;
}

export interface QRStyleOptions {
  size?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
}

export type QRCodeRecord = {
  id: string;

  url: string;

  title: string;

  created: string;
};
