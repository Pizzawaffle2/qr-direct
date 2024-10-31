// File: src/hooks/use-qr-code.ts
import { useState } from 'react';
import { QRCodeService } from '@/services/qr-service';

export function useQRCode() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async (data: any) => {
    try {
      setIsGenerating(true);
      return await QRCodeService.generateQRCode(data);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateQRCode,
    isGenerating,
  };
}
