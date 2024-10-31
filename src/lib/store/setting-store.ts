import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  defaultBackgroundColor: string
  defaultForegroundColor: string
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  autoDownload: boolean
  historyLimit: number
  updateSettings: (settings: Partial<SettingsState>) => void
  resetSettings: () => void
}

const defaultSettings = {
  defaultBackgroundColor: '#FFFFFF',
  defaultForegroundColor: '#000000',
  errorCorrectionLevel: 'M' as const,
  autoDownload: false,
  historyLimit: 50,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateSettings: (newSettings) => set((state) => ({
        ...state,
        ...newSettings,
      })),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'qr-settings',
    }
  )
)