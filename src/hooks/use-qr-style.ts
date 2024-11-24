// File: src/hooks/use-qr-style.ts
import {useState } from 'react';
import {QRStyle, defaultStyleValues } from '@/lib/types/qr-styles';

export function useQRStyle(initialStyle?: Partial<QRStyle>) {
  const [style, setStyle] = useState<QRStyle>({
    ...defaultStyleValues,
    ...initialStyle,
  });

  const updateStyle = (newStyle: Partial<QRStyle>) => {
    setStyle((current) => ({
      ...current,
      ...newStyle,
    }));
  };

  return {
    style,
    updateStyle,
  };
}
