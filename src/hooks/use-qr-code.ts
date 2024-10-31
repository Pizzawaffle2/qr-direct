// File: src/hooks/use-qr-code.ts
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useQRCode() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQRCode = async (data: any, type: string) => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, type }),
      });

      if (!response.ok) throw new Error('Failed to generate QR code');

      const result = await response.json();
      return result.url;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate QR code',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateQRCode, isGenerating };
}