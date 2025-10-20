import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import type {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import {
  Copy,
  Minus,
  Plus,
  RefreshCcw,
  Trash2,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import {
  useCanvasStore,
  type PromptNodeData,
} from '../store/canvasStore'
import { useImageGenerationWorkflow } from '../hooks/useImageGenerationWorkflow'

const PROMPT_PLACEHOLDER =
  'Describe the image you want to generate...'
const OUTPUT_SCALE_MIN = 1
const OUTPUT_SCALE_MAX = 3

const scaleToSize = (scale: number) => {
  switch (scale) {
    case 3:
      return { width: 420, height: 360 }
    case 2:
      return { width: 360, height: 270 }
    default:
      return { width: 300, height: 180 }
  }
}

export default function PromptNode({ id, data }: NodeProps) {
  const nodeId = String(id)
  const nodeData = data as PromptNodeData
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const updatePrompt = useCanvasStore((state) => state.updatePrompt)
  const updateNodeData = useCanvasStore(
    (state) => state.updateNodeData,
  )
  const clearResult = useCanvasStore((state) => state.clearResult)
  const deleteNode = useCanvasStore((state) => state.deleteNode)
  const updateOutputScale = useCanvasStore(
    (state) => state.updateOutputScale,
  )
  const { processConnectedNodes } = useImageGenerationWorkflow()

  const promptValue = nodeData.prompt ?? ''
  const outputScale = nodeData.outputScale ?? OUTPUT_SCALE_MIN
  const hasGeneratedImage = Boolean(nodeData.generatedImageUrl)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) {
      return
    }

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [promptValue])

  useEffect(() => {
    if (!nodeData.shouldFocus || !textareaRef.current) {
      return
    }

    textareaRef.current.focus()
    updateNodeData(nodeId, { shouldFocus: false })
  }, [nodeData.shouldFocus, nodeId, updateNodeData])

  const handlePromptChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      updatePrompt(nodeId, event.target.value, false)
    },
    [nodeId, updatePrompt],
  )

  const runVisionWorkflow = useCallback(async () => {
    if (!promptValue.trim() || nodeData.isProcessing) {
      return
    }
    await processConnectedNodes(nodeId)
  }, [nodeData.isProcessing, nodeId, processConnectedNodes, promptValue])

  const handleRegenerate = useCallback(async () => {
    if (nodeData.isProcessing) {
      return
    }
    await processConnectedNodes(nodeId)
  }, [nodeData.isProcessing, nodeId, processConnectedNodes])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        void runVisionWorkflow()
      }
    },
    [runVisionWorkflow],
  )

  const handleReset = useCallback(() => {
    clearResult(nodeId)
  }, [clearResult, nodeId])

  const adjustOutputScale = useCallback(
    (direction: 'increase' | 'decrease') => {
      const nextScale =
        direction === 'increase'
          ? Math.min(outputScale + 1, OUTPUT_SCALE_MAX)
          : Math.max(outputScale - 1, OUTPUT_SCALE_MIN)

      if (nextScale !== outputScale) {
        updateOutputScale(nodeId, nextScale as 1 | 2 | 3)
      }
    },
    [nodeId, outputScale, updateOutputScale],
  )

  const handleCopyPrompt = useCallback(() => {
    const textToCopy = promptValue.trim()
    if (!textToCopy) {
      return
    }

    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard
    ) {
      void navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          toast.success('Prompt copied to clipboard')
        })
        .catch(() => {
          toast.error('Could not copy prompt')
        })
    }
  }, [promptValue])

  const handleDelete = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      deleteNode(nodeId)
    },
    [deleteNode, nodeId],
  )

  const handleDownload = useCallback(async () => {
    if (!nodeData.generatedImageUrl) {
      return
    }

    try {
      const link = document.createElement('a')
      link.download = `nano-canvas-${Date.now()}.png`

      if (nodeData.generatedImageBlob) {
        const url = URL.createObjectURL(nodeData.generatedImageBlob)
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        return
      }

      link.href = nodeData.generatedImageUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      toast.error('Unable to download image right now.')
      console.error('Failed to download image:', error)
    }
  }, [nodeData.generatedImageBlob, nodeData.generatedImageUrl])

  const imageSize = useMemo(
    () => scaleToSize(outputScale),
    [outputScale],
  )

  const disableActions = nodeData.isProcessing
  const canSubmit = promptValue.trim().length > 0 && !disableActions

  return (
    <div className="group relative min-w-[200px] rounded-2xl border border-border-subtle/60 bg-surface-floating/80 px-5 py-4 shadow-sunken">
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-500/80 opacity-0 transition-opacity hover:bg-neutral-500 hover:opacity-100 group-hover:opacity-100 border-none"
        title="Delete node"
      >
        <Trash2 className="h-2.5 w-2.5 text-surface-floating" />
      </button>

      <Handle type="target" position={Position.Left} />

      {!hasGeneratedImage && (
        <button
          type="button"
          className={`absolute -right-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full shadow-highlight ring-2 ring-warning/45 transition-all hover:scale-110 active:scale-95 border-none ${
            canSubmit
              ? 'bg-warning hover:bg-warning/80'
              : 'bg-warning/60 cursor-not-allowed opacity-65'
          }`}
          onClick={canSubmit ? runVisionWorkflow : undefined}
          title={
            canSubmit
              ? 'Send prompt'
              : 'Add prompt text to generate an image'
          }
          disabled={!canSubmit}
        >
          <svg
            className="h-3 w-3 rotate-90 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      )}

      {hasGeneratedImage ? (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id={`${nodeId}-output`}
          />

          <div className="space-y-4 transition-all">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyPrompt}
                disabled={!promptValue.trim() || disableActions}
                className="flex items-center gap-1 rounded-xl border border-border-subtle/60 bg-surface-base/80 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition-all hover:text-neutral-100 hover:shadow-highlight disabled:cursor-not-allowed disabled:text-neutral-500 disabled:opacity-60"
                title="Copy prompt"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => adjustOutputScale('decrease')}
                  disabled={
                    outputScale <= OUTPUT_SCALE_MIN || disableActions
                  }
                  className="flex items-center justify-center rounded-xl border border-border-subtle/60 bg-surface-base/80 p-1.5 text-neutral-300 transition-all hover:text-neutral-100 hover:shadow-highlight disabled:cursor-not-allowed disabled:text-neutral-500 disabled:opacity-60"
                  title="Decrease size"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => adjustOutputScale('increase')}
                  disabled={
                    outputScale >= OUTPUT_SCALE_MAX || disableActions
                  }
                  className="flex items-center justify-center rounded-xl border border-border-subtle/60 bg-surface-base/80 p-1.5 text-neutral-300 transition-all hover:text-neutral-100 hover:shadow-highlight disabled:cursor-not-allowed disabled:text-neutral-500 disabled:opacity-60"
                  title="Increase size"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="relative group">
              {nodeData.generatedImageUrl && (
                <img
                  src={nodeData.generatedImageUrl}
                  alt="Generated output"
                  className="rounded-2xl border border-border-subtle/30 object-cover"
                  style={{
                    display: 'block',
                    margin: '0 auto',
                    height: `${imageSize.height}px`,
                    width: `${imageSize.width}px`,
                  }}
                />
              )}
              {nodeData.isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-neutral-900/60 text-xs text-neutral-100">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                  <span>Updating image…</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleRegenerate}
                disabled={disableActions}
                className="flex items-center justify-center gap-1 rounded-xl border border-border-subtle/60 bg-surface-base/80 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition-all hover:text-neutral-100 hover:shadow-highlight disabled:cursor-not-allowed disabled:text-neutral-500 disabled:opacity-60"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Regenerate
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-center rounded-xl border border-danger/40 bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger transition-all hover:bg-danger/20 hover:text-danger-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                Clear
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center rounded-xl border border-accent/60 bg-accent/20 px-3 py-1.5 text-xs font-semibold text-accent transition-all hover:bg-accent/30 hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                Download
              </button>
            </div>

            {nodeData.error && (
              <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-xs text-danger">
                {nodeData.error}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <textarea
            ref={textareaRef}
            value={promptValue}
            onChange={handlePromptChange}
            onKeyDown={handleKeyDown}
            placeholder={PROMPT_PLACEHOLDER}
            className="w-full min-h-[60px] max-h-[240px] resize-none bg-transparent px-0 py-2 text-sm leading-relaxed text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
          />

          <div className="mt-4 space-y-3">
            {nodeData.isLoading && (
              <div className="flex items-center gap-3 rounded-xl border border-border-subtle/40 bg-surface-base/70 px-4 py-3 text-sm text-neutral-200">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft/40">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-100">
                    Generating image…
                  </p>
                  <p className="text-xs text-neutral-400">
                    We are composing light, color, and depth. Hang tight.
                  </p>
                </div>
              </div>
            )}

            {nodeData.error && (
              <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-xs text-danger">
                {nodeData.error}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
