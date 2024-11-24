// src/services/qr-service.ts

import QRCode from 'qrcode';
import {QRCodeData, QRStyleOptions } from '@/types/qr';

export default class QRCodeService {
    static async generateDataUrl(data: QRCodeData, style: QRStyleOptions): Promise<string> {
    try {
      const qrData = this.formatQRData(data);

      return await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: style.errorCorrection || 'M',
        width: style.size || 400,
        margin: style.margin || 4,
        color: {
          dark: style.foregroundColor || '#000000',
          light: style.backgroundColor || '#FFFFFF',
        },
      });
    } catch (error) {
      console.error('QR generation error:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  private static formatQRData(data: QRCodeData): string {
    switch (data.type) {
      case 'url':
        return data.url;
      case 'text':
        return data.text;
      case 'email':
        return `mailto:${data.email}${data.subject ? `?subject=${data.subject}` : ''}`;
      case 'phone':
        return `tel:${data.phone}`;
      case 'sms':
        return `sms:${data.phone}${data.message ? `?body=${data.message}` : ''}`;
      case 'wifi':
        return `WIFI:T:${data.networkType};S:${data.ssid};P:${data.password};H:${data.hidden};`;
      case 'location':
        return `geo:${data.latitude},${data.longitude}`;
      default:
        throw new Error('Unsupported QR code type');
    }
  }

  static async download(dataUrl: string, fileName: string = 'qr-code.png') {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
