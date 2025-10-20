import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  // API Settings
  apiKey: string
  baseUrl: string
  model: string

  // UI Settings
  showSettings: boolean
  theme: 'light' | 'dark' | 'system'

  // Actions
  setApiKey: (apiKey: string) => void
  setBaseUrl: (baseUrl: string) => void
  setModel: (model: string) => void
  toggleSettings: () => void
  setShowSettings: (show: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  clearSettings: () => void

  // Validation
  isConfigured: () => boolean
}

export const AVAILABLE_MODELS = {
  'nano-banana': {
    id: 'gemini-2.5-flash-image',
    name: 'Nano Banana',
    description: 'Google AI vision model with image generation',
    provider: 'google',
    baseUrl: 'https://generativelanguage.googleapis.com',
    maxTokens: 4096,
  },
} as const

export type ModelProvider = keyof typeof AVAILABLE_MODELS

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Default values
      apiKey: '',
      baseUrl: 'https://generativelanguage.googleapis.com',
      model: 'gemini-2.5-flash-image',
      showSettings: false,
      theme: 'system',

      // Actions
      setApiKey: (apiKey: string) => set({ apiKey }),
      setBaseUrl: (baseUrl: string) => set({ baseUrl }),
      setModel: (model: string) => set({ model }),
      toggleSettings: () =>
        set((state) => ({ showSettings: !state.showSettings })),
      setShowSettings: (show: boolean) => set({ showSettings: show }),
      setTheme: (theme: 'light' | 'dark' | 'system') => set({ theme }),
      clearSettings: () =>
        set({
          apiKey: '',
          baseUrl: 'https://generativelanguage.googleapis.com',
          model: 'gemini-2.5-flash-image',
          theme: 'system',
        }),

      // Validation function instead of computed property
      isConfigured: () => {
        const state = get()
        return state.apiKey.trim() !== '' && state.baseUrl.trim() !== ''
      },
    }),
    {
      name: 'canvas-vision-settings',
      partialize: (state) => ({
        apiKey: state.apiKey,
        baseUrl: state.baseUrl,
        model: state.model,
        theme: state.theme,
      }),
    },
  ),
)
