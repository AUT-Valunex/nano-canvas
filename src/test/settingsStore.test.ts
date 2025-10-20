import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from '../store/settingsStore'

describe('settingsStore', () => {
  beforeEach(() => {
    useSettingsStore.getState().clearSettings()
  })

  it('updates API credentials', () => {
    useSettingsStore.getState().setApiKey('test-key')
    useSettingsStore.getState().setBaseUrl('https://example.com')
    useSettingsStore.getState().setModel('model-id')

    const state = useSettingsStore.getState()
    expect(state.apiKey).toBe('test-key')
    expect(state.baseUrl).toBe('https://example.com')
    expect(state.model).toBe('model-id')
  })

  it('detects when configuration is complete', () => {
    const store = useSettingsStore.getState()
    expect(store.isConfigured()).toBe(false)

    store.setApiKey('key')
    store.setBaseUrl('https://example.com')

    expect(useSettingsStore.getState().isConfigured()).toBe(true)
  })

  it('resets to defaults', () => {
    const store = useSettingsStore.getState()
    store.setApiKey('key')
    store.setBaseUrl('https://example.com')
    store.setModel('custom-model')

    store.clearSettings()

    const next = useSettingsStore.getState()
    expect(next.apiKey).toBe('')
    expect(next.baseUrl).toBe('https://generativelanguage.googleapis.com')
    expect(next.model).toBe('gemini-2.5-flash-image')
  })
})
