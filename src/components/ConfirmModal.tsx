import {
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText: string
  cancelText: string
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(
    null,
  )

  useEffect(() => {
    if (!isOpen) {
      return
    }

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    const focusable = dialogRef.current?.querySelectorAll<
      HTMLElement
    >(FOCUSABLE_SELECTOR)
    const firstFocusable = focusable && focusable[0]

    firstFocusable?.focus()

    return () => {
      previouslyFocusedElementRef.current?.focus()
    }
  }, [isOpen])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) {
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusable = dialogRef.current?.querySelectorAll<
        HTMLElement
      >(FOCUSABLE_SELECTOR)
      if (!focusable || focusable.length === 0) {
        return
      }

      const focusables = Array.from(focusable)
      const currentIndex = focusables.indexOf(
        document.activeElement as HTMLElement,
      )
      let nextIndex = currentIndex

      if (event.shiftKey) {
        nextIndex = currentIndex <= 0 ? focusables.length - 1 : currentIndex - 1
      } else {
        nextIndex = currentIndex === focusables.length - 1 ? 0 : currentIndex + 1
      }

      focusables[nextIndex]?.focus()
      event.preventDefault()
    },
    [isOpen, onClose],
  )

  useEffect(() => {
    if (!isOpen) {
      return
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        className="pointer-events-auto relative mx-4 w-full max-w-md overflow-hidden rounded-3xl border border-border-subtle/60 bg-surface-base/95 shadow-floating"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-0 bg-accent-soft/10" />
        <div className="relative p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <h2
                id="confirm-modal-title"
                className="text-lg font-semibold text-neutral-100"
              >
                {title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-neutral-100"
              aria-label="Close confirmation dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p
            id="confirm-modal-message"
            className="mb-6 text-sm leading-relaxed text-neutral-300"
          >
            {message}
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border-subtle/70 bg-surface-raised/80 px-4 py-2 text-sm font-semibold text-neutral-200 shadow-none transition-all hover:bg-surface-raised hover:text-neutral-100 hover:shadow-highlight"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-white shadow-highlight transition-all hover:bg-danger-strong"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
