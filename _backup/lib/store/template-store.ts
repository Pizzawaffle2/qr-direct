import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TemplateConfig } from '@/lib/types/qr-styles'

interface TemplateStore {
  recentTemplates: TemplateConfig[]
  favoriteTemplates: string[]
  addRecentTemplate: (template: TemplateConfig) => void
  toggleFavorite: (templateId: string) => void
  clearRecentTemplates: () => void
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set) => ({
      recentTemplates: [],
      favoriteTemplates: [],
      addRecentTemplate: (template) =>
        set((state) => ({
          recentTemplates: [template, ...state.recentTemplates.slice(0, 9)],
        })),
      toggleFavorite: (templateId) =>
        set((state) => ({
          favoriteTemplates: state.favoriteTemplates.includes(templateId)
            ? state.favoriteTemplates.filter((id) => id !== templateId)
            : [...state.favoriteTemplates, templateId],
        })),
      clearRecentTemplates: () =>
        set({ recentTemplates: [] }),
    }),
    {
      name: 'qr-templates',
    }
  )
)