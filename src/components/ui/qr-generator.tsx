// File: src/components/qr-code/qr-generator.tsx
'use client';

import QRCode from 'qrcode';
import {QRCodeData } from '@/lib/types/qr-code';
import {QRStyleOptions } from '@/lib/types/qr-styles';

export class QRGenerator {
  static async generateQR(data: QRCodeData, style: QRStyleOptions): Promise<string> {
    try {
      const content = this.formatContent(data);

      const qrOptions = {
        errorCorrectionLevel: style.errorCorrectionLevel || 'M',
        margin: style.margin || 4,
        width: style.size || 300,
        color: {
          dark: style.foregroundColor || '#000000',
          light: style.backgroundColor || '#FFFFFF',
        },
      };

      const qrCodeDataUrl = await QRCode.toDataURL(content, qrOptions);

      if (style.imageUrl) {
        return await this.addLogoToQR(
          qrCodeDataUrl,
          style.imageUrl,
          style.imageSize || 50,
          style.imageMargin || 5
        );
      }

      return qrCodeDataUrl;
    } catch (error) {
      console.error('QR generation error:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  private static async addLogoToQR(
    qrDataUrl: string,
    logoUrl: string,
    logoSize: number,
    margin: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      const qrImage = new Image();
      const logoImage = new Image();

      qrImage.onload = () => {
        // Set canvas size to match QR code
        canvas.width = qrImage.width;
        canvas.height = qrImage.height;

        // Draw QR code
        ctx.drawImage(qrImage, 0, 0);

        // Calculate logo position (center)
        const x = (canvas.width - logoSize) / 2;
        const y = (canvas.height - logoSize) / 2;

        logoImage.onload = () => {
          // Add white background for logo
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x - margin, y - margin, logoSize + margin * 2, logoSize + margin * 2);

          // Draw logo
          ctx.drawImage(logoImage, x, y, logoSize, logoSize);
          resolve(canvas.toDataURL('image/png'));
        };

        logoImage.onerror = () => reject(new Error('Failed to load logo'));
        logoImage.src = logoUrl;
      };

      qrImage.onerror = () => reject(new Error('Failed to load QR code'));
      qrImage.src = qrDataUrl;
    });
  }

  private static formatContent(data: QRCodeData): string {
    switch (data.type) {
      case 'email': {
        const params = new URLSearchParams();
        if (data.subject) params.append('subject', data.subject);
        if (data.body) params.append('body', data.body);
        return `mailto:${data.email}${params.toString() ? '?' + params.toString() : ''}`;
      }

      case 'wifi': {
        const { ssid, password, encryption = 'WPA', hidden = false } = data;
        return `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden};`;
      }

      case 'vcard': {
        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${data.firstName} ${data.lastName}`,
          `N:${data.lastName};${data.firstName};;;`,
          data.organization ? `ORG:${data.organization}` : '',
          data.title ? `TITLE:${data.title}` : '',
          data.email ? `EMAIL:${data.email}` : '',
          data.phone ? `TEL:${data.phone}` : '',
          data.mobile ? `TEL;TYPE=CELL:${data.mobile}` : '',
          data.website ? `URL:${data.website}` : '',
          data.address ? `ADR:;;${data.address};;;` : '',
          data.note ? `NOTE:${data.note}` : '',
          'END:VCARD',
        ]
          .filter(Boolean)
          .join('\n');
      }

      case 'url':
        return data.url;

      case 'phone':
        return `tel:${data.number}`;

      default:
        throw new Error(`Unsupported QR code type: ${data.type}`);
    }
  }
}
