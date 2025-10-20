import type { Edge, Node } from '@xyflow/react'
import type {
  ImageNodeData,
  PromptNodeData,
} from '../store/canvasStore'

type CanvasNode = Node<ImageNodeData | PromptNodeData>

const generateId = (prefix: 'image' | 'prompt') => {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`
  return `${prefix}-${random}`
}

const withDefaultPosition = (
  position: { x: number; y: number },
): { x: number; y: number } => ({
  x: Number.isFinite(position.x) ? position.x : 0,
  y: Number.isFinite(position.y) ? position.y : 0,
})

export const createPromptNode = (
  position: { x: number; y: number },
  index: number,
  overrides: Partial<PromptNodeData> = {},
): Node<PromptNodeData> => ({
  id: generateId('prompt'),
  type: 'promptNode',
  position: withDefaultPosition(position),
  data: {
    label: overrides.label ?? `Prompt ${index}`,
    prompt: '',
    shouldFocus: true,
    ...overrides,
  },
})

export const createImageNode = (
  position: { x: number; y: number },
  index: number,
  overrides: Partial<ImageNodeData> = {},
): Node<ImageNodeData> => ({
  id: generateId('image'),
  type: 'imageNode',
  position: withDefaultPosition(position),
  data: {
    label: overrides.label ?? `Image ${index}`,
    ...overrides,
  },
})

export const isPromptNode = (
  node: Node | null | undefined,
): node is Node<PromptNodeData> => node?.type === 'promptNode'

export const isImageNode = (
  node: Node | null | undefined,
): node is Node<ImageNodeData> => node?.type === 'imageNode'

export const createSmoothEdge = (params: {
  source: string
  target: string
  id?: string
  data?: Edge['data']
}): Edge => ({
  id:
    params.id ??
    `${params.source}-${params.target}-${Date.now().toString(36)}`,
  source: params.source,
  target: params.target,
  type: 'smoothstep',
  data: params.data,
})

export const countNodesByType = (nodes: CanvasNode[], type: string) =>
  nodes.filter((node) => node.type === type).length
