import {
  lazy,
  Suspense,
  useCallback,
  useMemo,
} from 'react'
import type {
  MouseEvent as ReactMouseEvent,
} from 'react'
import {
  Background,
  BackgroundVariant,
  type Edge,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
  useReactFlow,
} from '@xyflow/react'
import { Toaster } from 'react-hot-toast'
import { nodeTypes } from '../nodeTypes'
import TopToolbar from './TopToolbar'
import {
  useCanvasStore,
  type ImageNodeData,
  type PromptNodeData,
} from '../store/canvasStore'
import { useConnection } from '../hooks/useConnection'
import {
  countNodesByType,
  createImageNode,
  createPromptNode,
} from '../lib/node-utils'
import './DragIndicator.css'

const Controls = lazy(() =>
  import('@xyflow/react').then((mod) => ({ default: mod.Controls })),
)

const MiniMap = lazy(() =>
  import('@xyflow/react').then((mod) => ({ default: mod.MiniMap })),
)

const SettingsPanel = lazy(
  () => import('./SettingsPanel'),
)

const NODES_KEY = {
  image: 'imageNode',
  prompt: 'promptNode',
} as const

export const CanvasSurface = () => {
  const nodes = useCanvasStore((state) => state.nodes)
  const edges = useCanvasStore((state) => state.edges)
  const handleNodesChange = useCanvasStore(
    (state) => state.handleNodesChange,
  )
  const handleEdgesChange = useCanvasStore(
    (state) => state.handleEdgesChange,
  )
  const connect = useCanvasStore((state) => state.connect)
  const addNode = useCanvasStore((state) => state.addNode)
  const addNodeWithEdge = useCanvasStore(
    (state) => state.addNodeWithEdge,
  )
  const removeEdge = useCanvasStore((state) => state.removeEdge)
  const resetCanvas = useCanvasStore((state) => state.resetCanvas)
  const { screenToFlowPosition } = useReactFlow()

  const {
    onConnect,
    onConnectEnd,
    onConnectStart,
    dragIndicator,
  } = useConnection({
    nodes: nodes as Node<
      ImageNodeData | PromptNodeData
    >[],
    connect,
    addNodeWithEdge,
  })

  const handleEdgeDoubleClick = useCallback(
    (_: ReactMouseEvent, edge: Edge) => {
      removeEdge(edge.id)
    },
    [removeEdge],
  )

  const getCanvasCenter = useCallback(() => {
    if (typeof window === 'undefined') {
      return { x: 0, y: 0 }
    }

    return screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })
  }, [screenToFlowPosition])

  const handleAddImageNode = useCallback(() => {
    const position = getCanvasCenter()
    const imageCount =
      countNodesByType(
        nodes as Node<ImageNodeData | PromptNodeData>[],
        NODES_KEY.image,
      ) + 1
    addNode(createImageNode(position, imageCount))
  }, [addNode, getCanvasCenter, nodes])

  const handleAddPromptNode = useCallback(() => {
    const position = getCanvasCenter()
    const promptCount =
      countNodesByType(
        nodes as Node<ImageNodeData | PromptNodeData>[],
        NODES_KEY.prompt,
      ) + 1
    addNode(createPromptNode(position, promptCount))
  }, [addNode, getCanvasCenter, nodes])

  const nodeColour = useCallback(
    (node: Node<ImageNodeData | PromptNodeData>) => {
      if (node.type === NODES_KEY.prompt) {
        return 'rgba(129, 140, 248, 0.5)'
      }
      if (node.type === NODES_KEY.image) {
        return 'rgba(56, 189, 248, 0.4)'
      }
      return 'rgba(148, 163, 184, 0.45)'
    },
    [],
  )

  const nodeStrokeColour = useCallback(
    (node: Node<ImageNodeData | PromptNodeData>) => {
      if (node.type === NODES_KEY.prompt) {
        return 'rgba(129, 140, 248, 0.9)'
      }
      if (node.type === NODES_KEY.image) {
        return 'rgba(56, 189, 248, 0.9)'
      }
      return 'rgba(148, 163, 184, 0.8)'
    },
    [],
  )

  const reactFlowProps = useMemo(
    () => ({
      onNodesChange:
        handleNodesChange as OnNodesChange,
      onEdgesChange:
        handleEdgesChange as OnEdgesChange,
    }),
    [handleEdgesChange, handleNodesChange],
  )

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-surface-base">
      <div className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-accent-soft/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-success-soft/30 blur-3xl" />

      <TopToolbar
        onClearCanvas={resetCanvas}
        onAddImageNode={handleAddImageNode}
        onAddPromptNode={handleAddPromptNode}
      />

      {dragIndicator.visible && (
        <div
          className="drag-to-create-indicator"
          style={{
            left: dragIndicator.x + 10,
            top: dragIndicator.y - 30,
          }}
        >
          Drop to add node
        </div>
      )}

      <ReactFlow
        className="h-full w-full"
        nodes={nodes}
        edges={edges}
        {...reactFlowProps}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onEdgeDoubleClick={handleEdgeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        data-testid="react-flow"
        onPaneContextMenu={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
      >
        <Suspense fallback={null}>
          <Controls data-testid="controls" />
        </Suspense>
        <Suspense fallback={null}>
          <MiniMap
            nodeColor={nodeColour}
            nodeStrokeColor={nodeStrokeColour}
            maskColor="rgba(15, 23, 42, 0.55)"
            style={{
              backgroundColor: 'oklch(var(--nc-surface-base) / 0.9)',
              border: '1px solid oklch(var(--nc-border-base))',
            }}
            data-testid="minimap"
          />
        </Suspense>
        <Background
          variant={BackgroundVariant.Dots}
          gap={14}
          size={1.6}
          color="oklch(var(--nc-border-subtle) / 0.65)"
          data-testid="background"
        />
      </ReactFlow>

      <Suspense fallback={null}>
        <SettingsPanel data-testid="settings-panel" />
      </Suspense>

      <a
        href="https://github.com/AUT-Valunex/nano-canvas"
        target="_blank"
        rel="noreferrer"
        className="pointer-events-auto absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-full bg-[oklch(var(--nc-surface-floating)/0.94)] px-3 py-1.5 text-xs font-medium text-[oklch(var(--nc-ink))] shadow-lg ring-1 ring-[oklch(var(--nc-border-subtle)/0.6)] transition hover:bg-[oklch(var(--nc-surface-floating))]"
      >
        <span aria-hidden="true">🔗</span>
        <span>Source &amp; License · AGPLv3</span>
      </a>

      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'oklch(var(--nc-surface-floating) / 0.95)',
            color: 'oklch(var(--nc-text-primary))',
            border: '1px solid oklch(var(--nc-border-subtle) / 0.6)',
            borderRadius: '1rem',
            fontSize: '0.875rem',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
    </div>
  )
}

export default CanvasSurface
