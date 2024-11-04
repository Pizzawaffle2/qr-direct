// File: src/services/qr-service.ts
import QRCode from 'qrcode';

interface QRStyleOptions {
  backgroundColor: string;
  foregroundColor: string;
  margin: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  pattern?: string;
  cornerSquareStyle?: string;
  cornerDotStyle?: string;
}

type QRDataType = 'url' | 'email' | 'phone' | 'wifi' | 'vcard';

export class QRCodeService {
  private static formatVCard(data: any): string {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${data.lastName || ''};${data.firstName || ''};;;`,
      `FN:${[data.firstName, data.lastName].filter(Boolean).join(' ')}`,
      data.organization ? `ORG:${data.organization}` : '',
      data.phone ? `TEL;TYPE=WORK:${data.phone}` : '',
      data.mobile ? `TEL;TYPE=CELL:${data.mobile}` : '',
      data.email ? `EMAIL:${data.email}` : '',
      data.website ? `URL:${data.website}` : '',
      data.address ? `ADR:;;${data.address};;;` : '',
      data.note ? `NOTE:${data.note}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n');

    return vcard;
  }

  private static formatWiFi(data: any): string {
    const { ssid, password, encryption, hidden } = data;
    return `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden ? 'true' : 'false'};;`;
  }

  private static formatEmail(data: any): string {
    const { email, subject, body } = data;
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    if (body) params.append('body', body);
    
    return `mailto:${email}${params.toString() ? '?' + params.toString() : ''}`;
  }

  private static formatPhone(data: any): string {
    const { phone, phoneType } = data;
    return `tel:${phone}`;
  }

  static async generateQRCode(data: any): Promise<string> {
    try {
      const qrOptions = {
        errorCorrectionLevel: data.errorCorrectionLevel || 'M',
        margin: data.margin || 4,
        color: {
          dark: data.foregroundColor || '#000000',
          light: data.backgroundColor || '#FFFFFF',
        },
        width: 1024, // High resolution for better quality
      };

      let content = '';
      switch (data.type) {
        case 'url':
          content = data.url;
          break;
        case 'email':
          content = this.formatEmail(data);
          break;
        case 'phone':
          content = this.formatPhone(data);
          break;
        case 'wifi':
          content = this.formatWiFi(data);
          break;
        case 'vcard':
          content = this.formatVCard(data);
          break;
        default:
          throw new Error('Unsupported QR code type');
      }

      const qrCodeDataURL = await QRCode.toDataURL(content, qrOptions);
      return qrCodeDataURL;
    } catch (error) {
      console.error('QR generation error:', error);
      throw new Error('Failed to generate QR code');
    }
  }
}