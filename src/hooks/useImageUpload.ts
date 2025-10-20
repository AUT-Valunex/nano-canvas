import { useCallback } from 'react'
import type {
  ChangeEvent,
  ClipboardEvent as ReactClipboardEvent,
  DragEvent as ReactDragEvent,
} from 'react'

export interface UseImageUploadProps {
  onImageUpload: (imageUrl: string, imageBlob?: Blob) => void
  accept?: string
  maxSizeMB?: number
}

export const useImageUpload = ({
  onImageUpload,
  accept = 'image/*',
  maxSizeMB = 10,
}: UseImageUploadProps) => {
  const validateImage = useCallback(
    (file: File): boolean => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        console.error('File must be an image')
        return false
      }

      // Check file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024
      if (file.size > maxSizeBytes) {
        console.error(`File size must be less than ${maxSizeMB}MB`)
        return false
      }

      return true
    },
    [maxSizeMB],
  )

  const processFile = useCallback(
    (file: File) => {
      if (!validateImage(file)) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        onImageUpload(imageUrl, file)
      }
      reader.readAsDataURL(file)
    },
    [validateImage, onImageUpload],
  )

  // File input handling
  const handleFileSelect = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        processFile(file)
      }
      // Reset input value to allow selecting the same file again
      event.target.value = ''
    },
    [processFile],
  )

  // Drag and drop handling
  const handleDrop = useCallback(
    (event: ReactDragEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const file = event.dataTransfer.files[0]
      if (file) {
        processFile(file)
      }
    },
    [processFile],
  )

  const handleDragOver = useCallback((event: ReactDragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  // Paste handling
  const handlePaste = useCallback(
    (event: ClipboardEvent | ReactClipboardEvent<Element>) => {
      const items = event.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            processFile(file)
            break
          }
        }
      }
    },
    [processFile],
  )

  return {
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handlePaste,
    accept,
  }
}
