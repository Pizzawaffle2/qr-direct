// src/services/qr-generator.ts
import QRCodeStyling from 'ngx-qrcode-styling';
import { QRCodeData } from '@/lib/types/qr-code';
import { QRStyle } from '@/lib/types/qr-styles';


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
        return `tel:${data.number}`;
      
      case 'text': // Add support for text type
        return data.content; 

      // Add other cases for SMS, location, etc. as needed
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
      data.title ? `TITLE:${data.title}` : '', // This was missing in the previous response
      data.email ? `EMAIL:${data.email}` : '',
      data.phone ? `TEL:${data.phone}` : '',
      data.mobile ? `TEL:${data.mobile}` : '', // Add mobile phone
      data.website ? `URL:${data.website}` : '',
      data.address ? `ADR:;;${data.address};;;` : '',
      data.note ? `NOTE:${data.note}` : '', // Add note
      'END:VCARD'
    ].filter(Boolean).join('\n');
  }

  private static formatWiFi(data: QRCodeData): string {
    const { ssid, password, encryption, hidden = false } = data;
    return `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden};`;
  }

  private static formatEmail(data: QRCodeData): string {
    const { email, subject = '', body = '' } = data;
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    if (body) params.append('body', body);
    return `mailto:${email}${params.toString() ? '?' + params.toString() : ''}`;
  }
}