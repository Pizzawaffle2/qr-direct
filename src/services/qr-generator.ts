// File: src/services/qr-generator.ts
import QRCode from 'qrcode';
import { QRCodeOptions, QRCodeType, QRCodeData } from '@/lib/types/qr-code';

export class QRGenerator {
  static async generateQR(data: QRCodeData, options: QRCodeOptions): Promise<string> {
    try {
      const content = this.formatContent(data);
      
      const qrOptions = {
        errorCorrectionLevel: options.errorCorrectionLevel || 'M',
        margin: options.margin || 4,
        width: options.size || 300,
        color: {
          dark: options.foregroundColor || '#000000',
          light: options.backgroundColor || '#FFFFFF',
        },
      };

      return await QRCode.toDataURL(content, qrOptions);
    } catch (error) {
      console.error('QR generation error:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  private static formatContent(data: QRCodeData): string {
    switch (data.type) {
      case 'url':
        return data.url;
      
      case 'vcard':
        return this.formatVCard(data);
      
      case 'wifi':
        return this.formatWiFi(data);
      
      case 'email':
        return this.formatEmail(data);
      
      case 'phone':
        return this.formatPhone(data);
      
      case 'sms':
        return this.formatSMS(data);
      
      case 'location':
        return this.formatLocation(data);
      
      default:
        throw new Error('Unsupported QR code type');
    }
  }

  private static formatVCard(data: QRCodeData): string {
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${data.firstName} ${data.lastName}`,
      `N:${data.lastName};${data.firstName};;;`,
      data.organization ? `ORG:${data.organization}` : '',
      data.title ? `TITLE:${data.title}` : '',
      data.email ? `EMAIL:${data.email}` : '',
      data.phone ? `TEL:${data.phone}` : '',
      data.website ? `URL:${data.website}` : '',
      data.address ? `ADR:;;${data.address};;;` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n');
  }

  private static formatWiFi(data: QRCodeData): string {
    const { ssid, password, encryption = '', hidden = false } = data;
    return `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden};`;
  }

  private static formatEmail(data: QRCodeData): string {
    const { email, subject = '', body = '' } = data;
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    if (body) params.append('body', body);
    return `mailto:${email}${params.toString() ? '?' + params.toString() : ''}`;
  }

  private static formatPhone(data: QRCodeData): string {
    return `tel:${data.phone}`;
  }

  private static formatSMS(data: QRCodeData): string {
    return `sms:${data.phone}${data.message ? `:${data.message}` : ''}`;
  }

  private static formatLocation(data: QRCodeData): string {
    return `geo:${data.latitude},${data.longitude}`;
  }
}