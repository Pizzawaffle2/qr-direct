// File: src/lib/store/qr-store.ts
import { create } from 'zustand';
import { QRCodeOptions, QRCodeType } from '../types/qr-code';

interface QRState {
  type: QRCodeType;
  options: QRCodeOptions;
  setType: (type: QRCodeType) => void;
  setOptions: (options: Partial<QRCodeOptions>) => void;
}

export const useQRStore = create<QRState>((set) => ({
  type: 'url',
  options: {
    size: 300,
    margin: 4,
    errorCorrection: 'M',
    primaryColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  setType: (type) => set({ type }),
  setOptions: (options) =>
    set((state) => ({
      options: { ...state.options, ...options },
    })),
}));