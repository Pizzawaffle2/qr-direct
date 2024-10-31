export type QRCodeType = 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard';

interface BaseQRCode {
  id: string;
  type: QRCodeType;
  title: string; // Make title required
  created: Date;
  backgroundColor: string;
  foregroundColor: string;
}

export interface URLQRCode extends BaseQRCode {
  type: 'url';
  url: string;
}

export interface TextQRCode extends BaseQRCode {
  type: 'text';
  text: string;
}

export interface EmailQRCode extends BaseQRCode {
  type: 'email';
  email: string;
  subject?: string;
  body?: string;
}

export interface PhoneQRCode extends BaseQRCode {
  type: 'phone';
  phoneNumber: string;
}

export interface WiFiQRCode extends BaseQRCode {
  type: 'wifi';
  ssid: string;
  password?: string;
  encryption: 'WPA' | 'WEP' | 'none';
  hidden?: boolean;
}

export interface VCardQRCode extends BaseQRCode {
  type: 'vcard';
  firstName: string;
  lastName: string;
  organization?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
}

export type QRCodeData = 
  | URLQRCode 
  | TextQRCode 
  | EmailQRCode 
  | PhoneQRCode 
  | WiFiQRCode 
  | VCardQRCode;

export interface QRCodeGenerationOptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}