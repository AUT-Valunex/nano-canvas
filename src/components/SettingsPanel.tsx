import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  X,
  Key,
  Globe,
  Brain,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Trash2,
  ChevronDown,
} from 'lucide-react'
import { useSettingsStore, AVAILABLE_MODELS } from '../store/settingsStore'
import { cn } from '../lib/utils'

export default function SettingsPanel() {
  const {
    apiKey,
    baseUrl,
    model,
    showSettings,
    setShowSettings,
    setApiKey,
    setBaseUrl,
    setModel,
    clearSettings,
  } = useSettingsStore()

  const [showApiKey, setShowApiKey] = useState(false)
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [tempApiKey, setTempApiKey] = useState(apiKey)
  const [tempBaseUrl, setTempBaseUrl] = useState(baseUrl)
  const [tempModel, setTempModel] = useState(model)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [apiKeyError, setApiKeyError] = useState<string | null>(null)
  const [baseUrlError, setBaseUrlError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const apiKeyInputId = 'settings-api-key'
  const baseUrlInputId = 'settings-base-url'

  const isConfigured = useSettingsStore((state) => state.isConfigured())

  // Sync temp values with store values when they change
  useEffect(() => {
    setTempApiKey(apiKey)
    setTempBaseUrl(baseUrl)
    setTempModel(model)
  }, [apiKey, baseUrl, model])

  const selectedModel = useMemo(
    () =>
      Object.values(AVAILABLE_MODELS).find(
        (item) => item.id === tempModel,
      ),
    [tempModel],
  )

  const validateApiKey = useCallback((value: string) => {
    if (!value.trim()) {
      return 'API key is required.'
    }
    const normalized = value.trim()
    if (!/^AIza[0-9A-Za-z-_]{30,}$/.test(normalized)) {
      return 'Google AI API keys usually start with "AIza" – double-check the value.'
    }

    return null
  }, [])

  const validateBaseUrl = useCallback((value: string) => {
    if (!value.trim()) {
      return 'Base URL cannot be empty.'
    }
    try {
      const url = new URL(value)
      if (url.protocol !== 'https:') {
        return 'Use an https:// URL for secure requests.'
      }
      return null
    } catch (error) {
      return 'Enter a valid URL such as https://generativelanguage.googleapis.com'
    }
  }, [])

  useEffect(() => {
    setApiKeyError(validateApiKey(tempApiKey))
  }, [tempApiKey, validateApiKey])

  useEffect(() => {
    setBaseUrlError(validateBaseUrl(tempBaseUrl))
  }, [tempBaseUrl, validateBaseUrl])

  const handleSave = useCallback(() => {
    const keyError = validateApiKey(tempApiKey)
    const urlError = validateBaseUrl(tempBaseUrl)

    setApiKeyError(keyError)
    setBaseUrlError(urlError)

    if (keyError || urlError) {
      return
    }

    setApiKey(tempApiKey.trim())
    setBaseUrl(tempBaseUrl.trim())
    setModel(tempModel)
    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
      setShowSettings(false)
    }, 1000)
  }, [
    setApiKey,
    setBaseUrl,
    setModel,
    setShowSettings,
    tempApiKey,
    tempBaseUrl,
    tempModel,
    validateApiKey,
    validateBaseUrl,
  ])

  const defaultModelId = useMemo(
    () => AVAILABLE_MODELS['nano-banana'].id,
    [],
  )

  const handleClear = useCallback(() => {
    clearSettings()
    setTempApiKey('')
    setTempBaseUrl('https://generativelanguage.googleapis.com')
    setTempModel(defaultModelId)
    setApiKeyError('API key is required.')
    setBaseUrlError(null)
  }, [clearSettings, defaultModelId])

  const handleApiKeyChange = useCallback((value: string) => {
    setTempApiKey(value)
  }, [])

  const handleOverlayClick = useCallback(() => {
    setShowSettings(false)
  }, [setShowSettings])

  useEffect(() => {
    if (!showSettings) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSettings(false)
      }
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<
          HTMLElement
        >(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusable.length) {
          return
        }

        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const active = document.activeElement as HTMLElement | null

        if (event.shiftKey && active === first) {
          last.focus()
          event.preventDefault()
        } else if (!event.shiftKey && active === last) {
          first.focus()
          event.preventDefault()
        }
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowModelDropdown(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setShowSettings, showSettings])

  const saveDisabled = Boolean(apiKeyError || baseUrlError) && !saveSuccess

  useEffect(() => {
    if (!showSettings || !dialogRef.current) {
      return
    }

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'input, button, textarea, select, [tabindex]:not([tabindex="-1"])',
    )
    focusable[0]?.focus()
  }, [showSettings])

  if (!showSettings) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border-subtle/60 bg-surface-base/95 shadow-floating pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="absolute inset-0 bg-accent-soft/10" />
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-border-subtle/40 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-base/80 shadow-highlight ring-1 ring-inset ring-border-subtle/40">
                <Key className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2
                  id="settings-title"
                  className="font-display text-lg font-semibold text-neutral-100"
                >
                  Canvas Settings
                </h2>
                <p className="text-xs text-neutral-400">
                  Configure your API workflow
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-base/60 text-neutral-400 transition-all hover:text-neutral-100 hover:shadow-highlight"
              aria-label="Close settings"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6 px-6 py-6">
            {/* Status */}
            <div
              className={cn(
                'flex items-start gap-3 rounded-2xl border px-4 py-4 shadow-none',
                isConfigured
                  ? 'border-success/25 bg-success-soft/25 text-success'
                  : 'border-warning/25 bg-warning-soft/35 text-warning',
              )}
            >
              {isConfigured ? (
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-success text-surface-floating shadow-highlight">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-success">
                      API configured
                    </p>
                    <p className="text-xs text-success/80">
                      You are ready to generate with Nano Banana models.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-warning text-neutral-950 shadow-highlight">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-warning">
                      Unlock high quality generation
                    </p>
                    <p className="text-xs text-warning/85">
                      Add your Google AI Studio key for premium model access.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <label
                htmlFor={apiKeyInputId}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400"
              >
                <Key className="h-3.5 w-3.5 text-accent" />
                Google AI API key
              </label>
              <div className="relative">
                <input
                  id={apiKeyInputId}
                  type={showApiKey ? 'text' : 'password'}
                  value={tempApiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="AIza..."
                  className="w-full rounded-2xl border border-border-subtle/70 bg-surface-base/80 px-4 py-3 text-sm text-neutral-100 shadow-sunken transition-colors placeholder:text-neutral-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-ring/45"
                  aria-invalid={Boolean(apiKeyError)}
                  aria-describedby="api-key-help"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-surface-raised/80 text-neutral-400 shadow-raised transition-all hover:text-neutral-100"
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {apiKeyError ? (
                <p className="text-xs text-danger" role="alert">
                  {apiKeyError}
                </p>
              ) : null}
              <p id="api-key-help" className="text-xs text-neutral-400">
                Get your API key from{' '}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            {/* Base URL */}
            <div className="space-y-2">
              <label
                htmlFor={baseUrlInputId}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400"
              >
                <Globe className="h-3.5 w-3.5 text-accent" />
                Base URL
              </label>
              <input
                id={baseUrlInputId}
                type="text"
                value={tempBaseUrl}
                onChange={(e) => setTempBaseUrl(e.target.value)}
                className="w-full rounded-2xl border border-border-subtle/70 bg-surface-base/80 px-4 py-3 text-sm text-neutral-100 shadow-sunken focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-ring/45"
                aria-invalid={Boolean(baseUrlError)}
                aria-describedby="base-url-help"
              />
              {baseUrlError ? (
                <p className="text-xs text-danger" role="alert">
                  {baseUrlError}
                </p>
              ) : null}
              <p id="base-url-help" className="text-xs text-neutral-400">
                Override the Google AI endpoint if you proxy requests.
              </p>
            </div>

            {/* Model Selector */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                <Brain className="h-3.5 w-3.5 text-accent" />
                AI Model
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="flex w-full items-center justify-between rounded-2xl border border-border-subtle/70 bg-surface-base/80 px-4 py-3 text-sm text-neutral-100 shadow-sunken transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-ring/45"
                  aria-haspopup="listbox"
                  aria-expanded={showModelDropdown}
                >
                  <span className="font-semibold">
                    {selectedModel?.name ?? 'Select Model'}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      showModelDropdown && 'rotate-180',
                    )}
                  />
                </button>

                {showModelDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-10 mt-2 w-full rounded-2xl border border-border-subtle/60 bg-surface-floating/95 shadow-floating backdrop-blur-sm"
                    role="listbox"
                    aria-label="Model selection"
                  >
                    <div className="max-h-60 overflow-y-auto p-2">
                      {Object.values(AVAILABLE_MODELS).map((modelOption) => (
                        <button
                          key={modelOption.id}
                          type="button"
                          onClick={() => {
                            setTempModel(modelOption.id)
                            setShowModelDropdown(false)
                          }}
                          className={cn(
                            'w-full rounded-xl px-3 py-2 text-left text-sm transition-colors',
                            modelOption.id === tempModel
                              ? 'bg-accent text-surface-floating'
                              : 'text-neutral-100 hover:bg-surface-base/80',
                          )}
                          role="option"
                          aria-selected={modelOption.id === tempModel}
                        >
                          <div className="font-semibold">
                            {modelOption.name}
                          </div>
                          <div className="text-xs opacity-80">
                            {modelOption.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Data Storage Info */}
            <div className="rounded-2xl border border-border-subtle/50 bg-surface-base/60 p-4 shadow-none">
              <p className="text-xs text-neutral-400">
                Your API key is stored securely on-device and never transmitted.
              </p>
            </div>

            {/* Clear Data Button */}
            <button
              onClick={handleClear}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-danger/25 bg-danger-soft/30 px-4 py-3 text-sm font-semibold text-danger shadow-none transition-all hover:bg-danger-soft/45"
              title="Clear all stored settings"
            >
              <Trash2 className="h-4 w-4" />
              Clear stored credentials
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-border-subtle/40 bg-surface-base/50 px-6 py-4 backdrop-blur">
            <button
              onClick={() => setShowSettings(false)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-400 transition-all hover:text-neutral-100 hover:shadow-highlight"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saveSuccess || saveDisabled}
              className={cn(
                'flex items-center gap-2 rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-surface-floating shadow-highlight transition-all hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70',
                saveSuccess && 'bg-success',
              )}
            >
              {saveSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>Save settings</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
