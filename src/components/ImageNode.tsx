import { useRef, useState, useCallback } from 'react'
import type {
  ClipboardEvent as ReactClipboardEvent,
  DragEvent as ReactDragEvent,
  MouseEvent as ReactMouseEvent,
} from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useImageUpload } from '../hooks/useImageUpload'
import {
  useCanvasStore,
  type ImageNodeData,
} from '../store/canvasStore'
import { cn } from '../lib/utils'

const ERROR_MESSAGE =
  'We could not load this image. Try uploading a different file.'

export default function ImageNode({ id, data }: NodeProps) {
  const nodeData = data as ImageNodeData
  const nodeId = String(id)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadImageToNode = useCanvasStore(
    (state) => state.uploadImageToNode,
  )
  const deleteNode = useCanvasStore((state) => state.deleteNode)
  const setError = useCanvasStore((state) => state.setError)

  const { handleFileSelect, handleDrop, handleDragOver, handlePaste, accept } =
    useImageUpload({
      onImageUpload: (imageUrl, imageBlob) => {
        uploadImageToNode(nodeId, imageUrl, imageBlob)
      },
    })

  const handleNodeDrop = useCallback(
    (event: ReactDragEvent<HTMLDivElement>) => {
      setIsDragging(false)
      handleDrop(event)
    },
    [handleDrop],
  )

  const handleNodePaste = useCallback(
    (event: ReactClipboardEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      handlePaste(event)
    },
    [handlePaste],
  )

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleDelete = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      deleteNode(nodeId)
    },
    [deleteNode, nodeId],
  )

  const handleImageError = useCallback(() => {
    setError(nodeId, ERROR_MESSAGE)
    toast.error(ERROR_MESSAGE)
  }, [nodeId, setError])

  const renderPlaceholder = () => (
    <div
      className={cn(
        'relative flex h-[150px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border-subtle/40 text-neutral-400 transition-all',
        isDragging &&
          'border-accent bg-accent-soft/30 text-accent-strong shadow-highlight',
      )}
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-500/80 opacity-0 transition-opacity hover:bg-neutral-500 hover:opacity-100 group-hover:opacity-100 border-none"
        title="Delete node"
      >
        <Trash2 className="h-2.5 w-2.5 text-surface-floating" />
      </button>
      <Handle type="source" position={Position.Right} />
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <span className="px-4 text-center text-sm font-medium">
        Click or drop an image here
      </span>
      <span className="text-xs uppercase tracking-wide text-neutral-300">
        Paste also works
      </span>
    </div>
  )

  const renderImage = () => (
    <div className="relative inline-block">
      <img
        src={nodeData.imageUrl}
        alt="Uploaded"
        className="max-h-[180px] w-auto rounded-2xl object-cover"
        style={{ maxHeight: '180px', maxWidth: '400px' }}
        onError={handleImageError}
      />
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-500/80 opacity-0 transition-opacity hover:bg-neutral-500 hover:opacity-100 group-hover:opacity-100 border-none"
        title="Delete node"
      >
        <Trash2 className="h-2.5 w-2.5 text-surface-floating" />
      </button>
      <div className="absolute top-1/2 -right-1 -translate-y-1/2 transform">
        <Handle type="source" position={Position.Right} />
      </div>
      {nodeData.error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-neutral-950/70 px-4 text-center text-xs text-danger">
          <span className="font-semibold">Image unavailable</span>
          <span className="text-[11px] text-neutral-300">
            {nodeData.error}
          </span>
        </div>
      )}
    </div>
  )

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        className={cn(
          'group relative min-w-[260px] transition-all',
          'cursor-pointer',
          isDragging ? 'ring-2 ring-accent shadow-floating' : '',
        )}
        onClick={handleClick}
        onDrop={handleNodeDrop}
        onDragOver={handleDragOver}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragEnd={() => setIsDragging(false)}
        onPaste={handleNodePaste}
      >
        {nodeData.imageUrl ? renderImage() : renderPlaceholder()}
      </div>
    </>
  )
}
