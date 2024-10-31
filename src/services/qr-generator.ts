import QRCode from 'qrcode';
import { QRStyleOptions, BatchQRConfig } from '@/lib/types/qr-styles';
import { createCanvas, loadImage } from 'canvas';

export class QRGenerator {
  static async generateQR(
    content: string,
    options: Partial<QRStyleOptions> = {}
  ): Promise<string> {
    const canvas = createCanvas(options.width || 300, options.width || 300);
    const ctx = canvas.getContext('2d');

    // Generate basic QR code
    const qrCodeDataUrl = await QRCode.toDataURL(content, {
      width: options.width || 300,
      margin: options.margin || 4,
      color: {
        dark: options.colorScheme?.foreground || '#000000',
        light: options.colorScheme?.background || '#FFFFFF',
      },
      errorCorrectionLevel: options.errorCorrection || 'M',
    });

    // Load QR code onto canvas
    const qrImage = await loadImage(qrCodeDataUrl);
    ctx.drawImage(qrImage, 0, 0);

    // Apply gradient if specified
    if (options.colorScheme?.gradient) {
      const { gradient } = options.colorScheme;
      const grad = gradient.type === 'linear'
        ? ctx.createLinearGradient(0, 0, options.width || 300, options.width || 300)
        : ctx.createRadialGradient(
            (options.width || 300) / 2,
            (options.width || 300) / 2,
            0,
            (options.width || 300) / 2,
            (options.width || 300) / 2,
            (options.width || 300) / 2
          );

      grad.addColorStop(0, gradient.start);
      grad.addColorStop(1, gradient.end);

      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, options.width || 300, options.width || 300);
    }

    // Add logo if specified
    if (options.logo) {
      try {
        const logoImage = await loadImage(options.logo.image);
        const logoSize = options.logo.size || 50;
        const logoMargin = options.logo.margin || 5;
        const logoX = ((options.width || 300) - logoSize) / 2;
        const logoY = ((options.width || 300) - logoSize) / 2;

        // Add white background for logo
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(
          logoX - logoMargin,
          logoY - logoMargin,
          logoSize + (logoMargin * 2),
          logoSize + (logoMargin * 2)
        );

        // Draw logo
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
      } catch (error) {
        console.error('Error adding logo:', error);
      }
    }

    return canvas.toDataURL();
  }

  static async generateBatch(config: BatchQRConfig): Promise<string[]> {
    const results: string[] = [];

    for (const item of config.items) {
      const qrCode = await this.generateQR(item.content, config.style);
      results.push(qrCode);
    }

    return results;
  }

  static async saveTemplate(templateConfig: any): Promise<void> {
    // Save template to database
    // Implementation depends on your database setup
  }

  static async loadTemplate(templateId: string): Promise<any> {
    // Load template from database
    // Implementation depends on your database setup
  }
}