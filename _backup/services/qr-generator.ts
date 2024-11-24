// src/services/qr-generator.ts

import QRCode from 'qrcode';
import { QRCodeData, QRStyleOptions } from '@/lib/types/qr-code';

export class QRGenerator {
  static async generatePreview(data: Partial<QRCodeData>, style: QRStyleOptions): Promise<Buffer> {
    try {
      const qrData = this.formatQRData(data);
      const options = this.getQROptions(style);

      // Generate QR code as buffer
      const buffer = await QRCode.toBuffer(qrData, {
        ...options,
        type: 'png',
        width: style.size || 400,
        margin: style.margin || 4,
        color: {
          dark: style.darkColor || '#000000',
          light: style.lightColor || '#FFFFFF',
        },
        errorCorrectionLevel: style.errorCorrection || 'M',
      });

      return buffer;
    } catch (error) {
      console.error('QR generation error:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  private static formatQRData(data: Partial<QRCodeData>): string {
    switch (data.type) {
      case 'url':
        return data.url || '';
      case 'text':
        return data.text || '';
      case 'email':
        return `mailto:${data.email}${data.subject ? `?subject=${data.subject}` : ''}`;
      case 'phone':
        return `tel:${data.phone}`;
      case 'sms':
        return `sms:${data.phone}${data.message ? `?body=${data.message}` : ''}`;
      case 'wifi':
        return `WIFI:T:${data.networkType};S:${data.ssid};P:${data.password};H:${data.hidden ? 'true' : 'false'};`;
      case 'location':
        return `geo:${data.latitude},${data.longitude}`;
      default:
        return '';
    }
  }

  private static getQROptions(style: QRStyleOptions) {
    return {
      width: style.size || 400,
      margin: style.margin || 4,
      color: {
        dark: style.darkColor || '#000000',
        light: style.lightColor || '#FFFFFF',
      },
      errorCorrectionLevel: style.errorCorrection || 'M',
    };
  }
}
