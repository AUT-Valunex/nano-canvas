import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react'
import { isPromptNode } from '../lib/node-utils'

interface BaseNodeData extends Record<string, unknown> {
  label: string
}

export interface ImageNodeData extends BaseNodeData {
  imageUrl?: string
  imageBlob?: Blob
  error?: string
  isProcessing?: boolean
  isLoading?: boolean
}

export interface PromptNodeData extends BaseNodeData {
  prompt?: string
  isProcessing?: boolean
  shouldFocus?: boolean
  isLoading?: boolean
  error?: string
  generatedImageUrl?: string
  generatedImageBlob?: Blob
  model?: string
  outputScale?: 1 | 2 | 3
  usage?: {
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
  }
}

export type CustomNodeData = ImageNodeData | PromptNodeData
type FlowNode = Node
type EdgeState = 'idle' | 'processing'

interface CanvasEdgeData extends Record<string, unknown> {
  state?: EdgeState
}

const isNodeProcessing = (node?: FlowNode): boolean => {
  if (!node) return false
  const data = node.data as CustomNodeData | undefined
  return Boolean(
    data &&
      'isProcessing' in data &&
      (data as PromptNodeData | ImageNodeData).isProcessing,
  )
}

const resolveEdgeState = (edge: Edge, nodes: FlowNode[]): EdgeState => {
  const sourceNode = nodes.find((node) => node.id === edge.source)
  const targetNode = nodes.find((node) => node.id === edge.target)
  return isNodeProcessing(sourceNode) || isNodeProcessing(targetNode)
    ? 'processing'
    : 'idle'
}

const createInitialNodes = (): FlowNode[] => [
  {
    id: 'image-1',
    type: 'imageNode',
    position: { x: 60, y: 140 },
    data: { label: 'Image Input' },
  },
  {
    id: 'prompt-1',
    type: 'promptNode',
    position: { x: 340, y: 140 },
    data: { label: 'Prompt', prompt: '' },
  },
]

const createInitialEdges = (): Edge[] => [
  {
    id: 'edge-image-prompt',
    source: 'image-1',
    target: 'prompt-1',
    type: 'smoothstep',
  },
]

type SmoothEdge = Edge & {
  pathOptions?: {
    borderRadius?: number
    [key: string]: unknown
  }
}

// Normalise edges with consistent styling and state derived from connected nodes.
const enhanceEdge = (edge: Edge, nodes: FlowNode[]): Edge => {
  const data = (edge.data as CanvasEdgeData | undefined) ?? {}
  const state = resolveEdgeState(edge, nodes)

  const nextEdge: Edge = {
    ...edge,
    type: edge.type ?? 'smoothstep',
    animated: false,
    data: {
      ...data,
      state,
    },
    className: `edge-track edge-${state}`,
    style: {
      ...(edge.style ?? {}),
      strokeDasharray: '8 4',
    },
  }

  const nextSmoothEdge = nextEdge as SmoothEdge
  const originalPathOptions = (edge as SmoothEdge).pathOptions ?? {}
  nextSmoothEdge.pathOptions = {
    borderRadius: 72,
    ...originalPathOptions,
  }

  return nextEdge
}

const enhanceEdges = (edges: Edge[], nodes: FlowNode[]): Edge[] =>
  edges.map((edge) => enhanceEdge(edge, nodes))

const withUpdatedNode = (
  nodes: FlowNode[],
  nodeId: string,
  updater: (data: CustomNodeData) => CustomNodeData,
): FlowNode[] =>
  nodes.map((node) => {
    if (node.id !== nodeId) {
      return node
    }

    const nextData = updater(node.data as CustomNodeData)
    return {
      ...node,
      data: nextData,
    }
  })

const initialNodes = createInitialNodes()
const initialEdges = enhanceEdges(createInitialEdges(), initialNodes)

interface CanvasState {
  nodes: FlowNode[]
  edges: Edge[]

  handleNodesChange: (changes: NodeChange[]) => void
  handleEdgesChange: (changes: EdgeChange[]) => void
  connect: (connection: Connection) => void
  addNode: (node: FlowNode) => void
  addEdge: (edge: Edge) => void
  addNodeWithEdge: (node: FlowNode, edge: Edge) => void
  deleteNode: (nodeId: string) => void
  removeEdge: (edgeId: string) => void
  resetCanvas: () => void

  // Node creation helpers
  createConnectedTextNode: (
    sourceNodeId: string,
    position: { x: number; y: number },
  ) => void
  createConnectedImageTextNode: (
    sourceNodeId: string,
    position: { x: number; y: number },
  ) => void

  updateNodeData: (nodeId: string, data: Partial<CustomNodeData>) => void
  uploadImageToNode: (
    nodeId: string,
    imageUrl: string,
    imageBlob?: Blob,
  ) => void
  updatePrompt: (nodeId: string, prompt: string, shouldFocus?: boolean) => void
  startProcessing: (nodeId: string) => void
  stopProcessing: (nodeId: string) => void
  setGeneratedImage: (
    nodeId: string,
    imageUrl: string,
    imageBlob?: Blob,
    model?: string,
    usage?: PromptNodeData['usage'],
  ) => void
  setError: (nodeId: string, error: string) => void
  clearResult: (nodeId: string) => void
  updateOutputScale: (nodeId: string, scale: 1 | 2 | 3) => void
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      nodes: initialNodes,
      edges: initialEdges,

      handleNodesChange: (changes) =>
        set((state) => ({
          nodes: applyNodeChanges(changes, state.nodes),
        })),

      handleEdgesChange: (changes) =>
        set((state) => ({
          edges: enhanceEdges(
            applyEdgeChanges(changes, state.edges),
            state.nodes,
          ),
        })),

      connect: (connection) =>
        set((state) => ({
          edges: enhanceEdges(addEdge(connection, state.edges), state.nodes),
        })),

      addNode: (node) =>
        set((state) => ({
          nodes: [...state.nodes, node],
        })),

      addEdge: (edge) =>
        set((state) => ({
          edges: enhanceEdges([...state.edges, edge], state.nodes),
        })),

      addNodeWithEdge: (node, edge) =>
        set((state) => {
          const nextNodes = [...state.nodes, node]
          return {
            nodes: nextNodes,
            edges: enhanceEdges([...state.edges, edge], nextNodes),
          }
        }),

      deleteNode: (nodeId) =>
        set((state) => {
          const nextNodes = state.nodes.filter((node) => node.id !== nodeId)
          const nextEdges = state.edges.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId,
          )
          return {
            nodes: nextNodes,
            edges: enhanceEdges(nextEdges, nextNodes),
          }
        }),

      removeEdge: (edgeId) =>
        set((state) => {
          const nextEdges = state.edges.filter((edge) => edge.id !== edgeId)
          return {
            edges: enhanceEdges(nextEdges, state.nodes),
          }
        }),

      resetCanvas: () =>
        set(() => {
          const nodes = createInitialNodes()
          return {
            nodes,
            edges: enhanceEdges(createInitialEdges(), nodes),
          }
        }),

      // Node creation helpers
      createConnectedTextNode: (sourceNodeId, position) => {
        const nodeCount = get().nodes.length + 1
        const textNode: FlowNode = {
          id: `prompt-${nodeCount}`,
          type: 'promptNode',
          position,
          data: {
            label: 'Text Prompt',
            prompt: '',
            shouldFocus: true, // Auto-focus new text nodes
          },
        }

        const edge: Edge = {
          id: `edge-${sourceNodeId}-prompt-${nodeCount}`,
          source: sourceNodeId,
          target: `prompt-${nodeCount}`,
          type: 'smoothstep',
        }

        get().addNodeWithEdge(textNode, edge)
      },

      createConnectedImageTextNode: (sourceNodeId, position) => {
        const nodeCount = get().nodes.length + 1
        const imageNode: FlowNode = {
          id: `image-${nodeCount}`,
          type: 'imageNode',
          position: { x: position.x - 150, y: position.y - 50 },
          data: { label: 'Image Input' },
        }

        const textNode: FlowNode = {
          id: `prompt-${nodeCount}`,
          type: 'promptNode',
          position: { x: position.x + 150, y: position.y - 50 },
          data: {
            label: 'Text Prompt',
            prompt: '',
            shouldFocus: true,
          },
        }

        const edge1: Edge = {
          id: `edge-${sourceNodeId}-image-${nodeCount}`,
          source: sourceNodeId,
          target: `image-${nodeCount}`,
          type: 'smoothstep',
        }

        const edge2: Edge = {
          id: `edge-image-${nodeCount}-prompt-${nodeCount}`,
          source: `image-${nodeCount}`,
          target: `prompt-${nodeCount}`,
          type: 'smoothstep',
        }

        // Add both nodes and edges
        set((state) => {
          const nextNodes = [...state.nodes, imageNode, textNode]
          const nextEdges = enhanceEdges(
            [...state.edges, edge1, edge2],
            nextNodes,
          )
          return {
            nodes: nextNodes,
            edges: nextEdges,
          }
        })
      },

      updateNodeData: (nodeId, data) =>
        set((state) => ({
          nodes: withUpdatedNode(state.nodes, nodeId, (current) => ({
            ...current,
            ...data,
          })),
        })),

      uploadImageToNode: (nodeId, imageUrl, imageBlob) =>
        set((state) => {
          const nextNodes = withUpdatedNode(state.nodes, nodeId, (current) => ({
            ...current,
            imageUrl,
            imageBlob,
            error: undefined,
            isProcessing: false,
            isLoading: false,
          }))

          return {
            nodes: nextNodes,
            edges: enhanceEdges(state.edges, nextNodes),
          }
        }),

      updatePrompt: (nodeId, prompt, shouldFocus) =>
        set((state) => ({
          nodes: withUpdatedNode(state.nodes, nodeId, (current) => ({
            ...current,
            prompt,
            shouldFocus,
            error: undefined,
          })),
        })),

      startProcessing: (nodeId) =>
        set((state) => {
          const nextNodes = withUpdatedNode(state.nodes, nodeId, (current) => ({
            ...current,
            isProcessing: true,
            isLoading: true,
            error: undefined,
          }))

          return {
            nodes: nextNodes,
            edges: enhanceEdges(state.edges, nextNodes),
          }
        }),

      stopProcessing: (nodeId) =>
        set((state) => {
          const nextNodes = withUpdatedNode(state.nodes, nodeId, (current) => ({
            ...current,
            isProcessing: false,
            isLoading: false,
          }))

          return {
            nodes: nextNodes,
            edges: enhanceEdges(state.edges, nextNodes),
          }
        }),

      setGeneratedImage: (nodeId, imageUrl, imageBlob, model, usage) =>
        set((state) => {
          const nextNodes = state.nodes.map((node) => {
            if (node.id !== nodeId || !isPromptNode(node)) {
              return node
            }

            const data = node.data as PromptNodeData
            return {
              ...node,
              data: {
                ...data,
                generatedImageUrl: imageUrl,
                generatedImageBlob: imageBlob,
                model,
                usage,
                outputScale: data.outputScale ?? 1,
                isLoading: false,
                isProcessing: false,
                error: undefined,
              },
            }
          })

          return {
            nodes: nextNodes,
            edges: enhanceEdges(state.edges, nextNodes),
          }
        }),

      setError: (nodeId, error) =>
        set((state) => {
          const nextNodes = withUpdatedNode(state.nodes, nodeId, (current) => ({
            ...current,
            error,
            isLoading: false,
            isProcessing: false,
          }))

          return {
            nodes: nextNodes,
            edges: enhanceEdges(state.edges, nextNodes),
          }
        }),

      clearResult: (nodeId) =>
        set((state) => {
          const nextNodes = state.nodes.map((node) => {
            if (node.id !== nodeId || !isPromptNode(node)) {
              return node
            }

            return {
              ...node,
              data: {
                ...(node.data as PromptNodeData),
                generatedImageUrl: undefined,
                generatedImageBlob: undefined,
                model: undefined,
                usage: undefined,
                error: undefined,
                isLoading: false,
                isProcessing: false,
                outputScale: 1,
              },
            }
          })

          return {
            nodes: nextNodes,
            edges: enhanceEdges(state.edges, nextNodes),
          }
        }),

      updateOutputScale: (nodeId, scale) =>
        set((state) => {
          const nextNodes = state.nodes.map((node) => {
            if (node.id !== nodeId || !isPromptNode(node)) {
              return node
            }

            return {
              ...node,
              data: {
                ...(node.data as PromptNodeData),
                outputScale: scale,
              },
            }
          })

          return {
            nodes: nextNodes,
            edges: enhanceEdges(state.edges, nextNodes),
          }
        }),
    }),
    {
      name: 'nano-canvas-storage',
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
      }),
    },
  ),
)
