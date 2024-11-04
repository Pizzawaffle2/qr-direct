// File: src/services/preview-generator.ts
import QRCode from 'qrcode';
import type { QRStyle } from '@/lib/types/qr-styles';

interface GeneratePreviewOptions {
  style: QRStyle;
  size?: number;
}

export class PreviewGenerator {
  private static SAMPLE_TEXT = 'https://example.com';
  private static DEFAULT_SIZE = 300;

  static async generatePreview({ style, size = PreviewGenerator.DEFAULT_SIZE }: GeneratePreviewOptions): Promise<string> {
    try {
      const qrOptions = {
        errorCorrectionLevel: style.errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H',
        margin: style.margin,
        width: size,
        color: {
          dark: style.foregroundColor,
          light: style.backgroundColor,
        },
      };

      // Generate QR code as data URL
      return await QRCode.toDataURL(PreviewGenerator.SAMPLE_TEXT, qrOptions);
    } catch (error) {
      console.error('Failed to generate preview:', error);
      throw new Error('Failed to generate preview');
    }
  }
}
