import { Image, Settings, Trash2, Type } from 'lucide-react'
import { useState } from 'react'
import { useSettingsStore } from '../store/settingsStore'
import { cn } from '../lib/utils'
import ConfirmModal from './ConfirmModal'

interface TopToolbarProps {
  onClearCanvas: () => void
  onAddImageNode: () => void
  onAddPromptNode: () => void
}

export default function TopToolbar({
  onClearCanvas,
  onAddImageNode,
  onAddPromptNode,
}: TopToolbarProps) {
  const { setShowSettings, isConfigured } = useSettingsStore()
  const configured = isConfigured()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleClearClick = () => {
    setShowClearConfirm(true)
  }

  const handleClearConfirm = () => {
    setShowClearConfirm(false)
    onClearCanvas()
  }

  return (
    <>
      {/* Main Header */}
      <div className="pointer-events-none absolute inset-x-0 top-4 z-20 flex justify-center px-4 sm:top-6 sm:px-6">
        <div className="pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-3 sm:gap-5 rounded-2xl border border-border-subtle/50 bg-surface-floating/95 px-3 py-2 sm:px-5 sm:py-3 shadow-floating backdrop-blur-sm" data-testid="top-toolbar">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <svg
              className="h-6 w-6 sm:h-8 sm:w-8 text-accent"
              viewBox="0 0 692.93 995.41"
              fill="currentColor"
            >
              <rect x="97.23" y="688.3" width="498.48" height="60.19" />
              <rect x="310.2" width="75.62" height="55.56" />
              <rect x="319.46" y="777.81" width="55.56" height="188.28" />
              <polygon points="581.79 995.41 526.23 995.41 434.58 777.81 490.14 777.81 581.79 995.41" />
              <polygon points="112.69 995.41 168.25 995.41 259.89 777.81 204.34 777.81 112.69 995.41" />
              <path d="M692.93,55.56H0v604.96h259.89v-177.78l-77.45-77.45v-61.05c-23.18-5.86-40.33-26.85-40.33-51.85,0-29.54,23.94-53.48,53.48-53.48s53.48,23.94,53.48,53.48c0,23.97-15.78,44.26-37.51,51.05v49.79l48.34,48.34,29.11,29.11v189.83h41.31l.83-426.98c-22.06-6.59-38.15-27.03-38.15-51.24,0-29.54,23.94-53.48,53.48-53.48s53.48,23.94,53.48,53.48c0,24.77-16.85,45.6-39.7,51.68l-.83,366.38,41.29-41.29v-163.83l29.11-29.1,38.43-38.43,18.93-18.93v-32.52c-24.67-4.75-43.31-26.44-43.31-52.5,0-29.54,23.94-53.48,53.48-53.48s53.48,23.94,53.48,53.48c0,22.86-14.35,42.37-34.54,50.02v47.21l-29.11,29.11v-.16l-18.93,18.93-38.43,38.42v163.83l-70.4,70.4v18.99h333.52V55.56Z" />
              <polygon points="487.17 349.95 487.17 350.1 516.29 320.99 516.29 320.83 497.35 339.77 487.17 349.95" />
              <circle
                cx="497.35"
                cy="223.76"
                r="27.77"
                transform="translate(-29.42 82.56) rotate(-9.22)"
              />
              <path d="M373.51,182.3c0-15.34-12.43-27.77-27.77-27.77s-27.77,12.43-27.77,27.77c0,10.4,5.72,19.45,14.18,24.2h27.16c8.46-4.76,14.18-13.81,14.18-24.2Z" />
              <path d="M345.75,210.07c4.94,0,9.56-1.3,13.58-3.56h-27.16c4.02,2.26,8.64,3.56,13.58,3.56Z" />
              <path d="M223.35,292.4c0-15.34-12.43-27.77-27.77-27.77s-27.77,12.43-27.77,27.77c0,10.81,6.19,20.16,15.21,24.74h25.11c9.02-4.59,15.21-13.93,15.21-24.74Z" />
              <path d="M195.58,320.16c4.52,0,8.78-1.1,12.55-3.02h-25.11c3.77,1.92,8.03,3.02,12.55,3.02Z" />
            </svg>
            <div>
              <h1 className="font-display text-sm sm:text-base font-semibold leading-tight text-neutral-100">
                Nano Canvas
              </h1>
              <p className="hidden sm:block text-xs font-medium text-neutral-400">
                Layered depth for AI image exploration
              </p>
            </div>
          </div>

          {/* Status and Settings - Always visible */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Status Indicator */}
            <div
              className={cn(
                'flex items-center gap-1.5 sm:gap-2 rounded-xl border px-2 py-1.5 sm:px-3 text-xs sm:text-sm font-medium shadow-raised',
                configured
                  ? 'border-success/20 bg-success-soft/35 text-success'
                  : 'border-warning/20 bg-warning-soft/40 text-warning',
              )}
              role="status"
              aria-live="polite"
            >
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  configured ? 'bg-success' : 'bg-warning',
              )}
              />
              <span className="hidden sm:inline">
                {configured ? 'Connected' : 'Setup required'}
              </span>
              <span className="sr-only">
                {configured
                  ? 'API connection configured'
                  : 'API configuration required'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 max-sm:hidden">
              <div className="flex items-center gap-1 rounded-2xl border border-border-subtle/50 bg-surface-base/80 p-1 shadow-raised backdrop-blur">
                <button
                  onClick={onAddImageNode}
                  className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-neutral-400 transition-all hover:text-neutral-100 hover:shadow-highlight"
                  title="Add image node"
                  aria-label="Add image node"
                  data-testid="add-image-node"
                >
                  <Image className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={onAddPromptNode}
                  className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-neutral-400 transition-all hover:text-neutral-100 hover:shadow-highlight"
                  title="Add prompt node"
                  aria-label="Add prompt node"
                  data-testid="add-prompt-node"
                >
                  <Type className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 rounded-2xl border border-border-subtle/50 bg-surface-base/80 p-1 shadow-raised backdrop-blur">
                <button
                  onClick={handleClearClick}
                  className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-neutral-400 transition-all hover:text-neutral-100 hover:shadow-highlight"
                  title="Clear canvas"
                  aria-label="Clear canvas"
                  data-testid="clear-canvas"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className={cn(
                    'flex h-8 sm:h-9 items-center justify-center rounded-xl px-2 sm:px-3 text-xs sm:text-sm font-semibold transition-all hover-lift',
                    configured
                      ? 'bg-surface-floating text-neutral-100 shadow-highlight'
                      : 'bg-warning text-neutral-950 shadow-highlight hover:bg-warning-soft',
                  )}
                  title={configured ? 'Open settings' : 'Setup API key'}
                  aria-label={configured ? 'Open settings' : 'Set up API key'}
                >
                  <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {!configured && (
                    <span className="hidden sm:inline ml-1.5 text-xs uppercase tracking-wide">
                      Setup
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Clear and Settings Buttons - Mobile Only */}
            <div className="flex items-center gap-1 sm:gap-2 sm:hidden">
              <div className="flex items-center gap-1 sm:gap-2 rounded-2xl border border-border-subtle/50 bg-surface-base/80 p-1 shadow-raised backdrop-blur">
                <button
                  onClick={handleClearClick}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 transition-all hover:text-neutral-100 hover:shadow-highlight"
                  title="Clear canvas"
                  aria-label="Clear canvas"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className={cn(
                    'flex h-8 items-center justify-center rounded-xl px-2 text-xs font-semibold transition-all hover-lift',
                    configured
                      ? 'bg-surface-floating text-neutral-100 shadow-highlight'
                      : 'bg-warning text-neutral-950 shadow-highlight hover:bg-warning-soft',
                  )}
                  title={configured ? 'Open settings' : 'Setup API key'}
                  aria-label={configured ? 'Open settings' : 'Set up API key'}
                >
                  <Settings className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Element Buttons - Separate row for small screens */}
      <div className="pointer-events-none absolute left-1/2 top-20 z-20 flex -translate-x-1/2 justify-center px-4 max-sm:top-16">
        <div className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-border-subtle/50 bg-surface-floating/95 p-1 shadow-floating backdrop-blur-sm sm:hidden">
          <button
            onClick={onAddImageNode}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 transition-all hover:text-neutral-100 hover:shadow-highlight"
            title="Add image node"
            aria-label="Add image node"
          >
            <Image className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onAddPromptNode}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 transition-all hover:text-neutral-100 hover:shadow-highlight"
            title="Add prompt node"
            aria-label="Add prompt node"
          >
            <Type className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal - rendered outside the toolbar container */}
      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearConfirm}
        title="Clear Canvas"
        message="Are you sure you want to clear the entire canvas? This will remove all nodes and connections, and this action cannot be undone."
        confirmText="Clear Canvas"
        cancelText="Cancel"
      />
    </>
  )
}
