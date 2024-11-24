import {create } from 'zustand';
import {persist } from 'zustand/middleware';
import {QRCodeData } from '@/lib/types/qr-code';

interface HistoryState {
  history: QRCodeData[];
  addToHistory: (qrCode: QRCodeData) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      addToHistory: (qrCode) =>
        set((state) => ({
          history: [qrCode, ...state.history].slice(0, 50), // Keep last 50 items
        })),
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'qr-history',
    }
  )
);
