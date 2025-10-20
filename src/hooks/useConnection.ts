import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  type Connection,
  type Edge,
  type Node,
  type OnConnect,
  type OnConnectEnd,
  type OnConnectStart,
  useReactFlow,
} from '@xyflow/react'
import {
  countNodesByType,
  createPromptNode,
  createSmoothEdge,
  isImageNode,
  isPromptNode,
} from '../lib/node-utils'
import type {
  ImageNodeData,
  PromptNodeData,
} from '../store/canvasStore'

type ConnectionStart = {
  nodeId: string
  handleType: 'source' | 'target'
} | null

type DragIndicatorState = {
  x: number
  y: number
  visible: boolean
}

const DRAG_INDICATOR_DEFAULT: DragIndicatorState = {
  x: 0,
  y: 0,
  visible: false,
}

const getClientPoint = (event: MouseEvent | TouchEvent) => {
  if ('clientX' in event) {
    return { x: event.clientX, y: event.clientY }
  }

  const touch = event.touches[0] ?? event.changedTouches[0]
  if (!touch) {
    return null
  }

  return { x: touch.clientX, y: touch.clientY }
}

type UseConnectionOptions = {
  nodes: Node<ImageNodeData | PromptNodeData>[]
  connect: (connection: Connection) => void
  addNodeWithEdge: (node: Node, edge: Edge) => void
}

export const useConnection = ({
  nodes,
  connect,
  addNodeWithEdge,
}: UseConnectionOptions) => {
  const { screenToFlowPosition } = useReactFlow()
  const [connectionStart, setConnectionStart] =
    useState<ConnectionStart>(null)
  const [dragIndicator, setDragIndicator] =
    useState<DragIndicatorState>(DRAG_INDICATOR_DEFAULT)

  const connectionCompletedRef = useRef(false)
  const connectionStartRef = useRef<ConnectionStart>(null)
  const nodesRef = useRef(nodes)

  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  const resetConnectionState = useCallback(() => {
    setConnectionStart(null)
    setDragIndicator(DRAG_INDICATOR_DEFAULT)
    connectionStartRef.current = null
    connectionCompletedRef.current = false
  }, [])

  const safeConnect = useCallback<OnConnect>(
    (params) => {
      connect(params)
      connectionCompletedRef.current = true
    },
    [connect],
  )

  const finalizeConnection = useCallback(
    (point: { x: number; y: number } | null) => {
      const activeConnection = connectionStartRef.current
      if (!activeConnection) {
        return
      }

      if (!point || connectionCompletedRef.current) {
        resetConnectionState()
        return
      }

      const currentNodes = nodesRef.current
      const sourceNode = currentNodes.find(
        (node) => node.id === activeConnection.nodeId,
      )

      if (!sourceNode) {
        resetConnectionState()
        return
      }

      const sourceData = sourceNode.data as
        | PromptNodeData
        | ImageNodeData
        | undefined

      const canSpawnPrompt =
        isImageNode(sourceNode) ||
        (isPromptNode(sourceNode) &&
          Boolean((sourceData as PromptNodeData)?.generatedImageUrl))

      if (!canSpawnPrompt) {
        resetConnectionState()
        return
      }

      const promptCount = countNodesByType(currentNodes, 'promptNode') + 1
      const flowPosition = screenToFlowPosition({
        x: point.x,
        y: point.y,
      })

      const newNode = createPromptNode(
        {
          x: flowPosition.x,
          y: flowPosition.y - 60,
        },
        promptCount,
      )

      const newEdge = createSmoothEdge({
        source: activeConnection.nodeId,
        target: newNode.id,
      })

      addNodeWithEdge(newNode, newEdge)
      resetConnectionState()
    },
    [addNodeWithEdge, resetConnectionState, screenToFlowPosition],
  )

  const handleConnectStart = useCallback<OnConnectStart>(
    (event, { nodeId, handleType }) => {
      if (handleType !== 'source' || !nodeId) {
        return
      }

      const point = getClientPoint(event)
      if (!point) {
        return
      }

      const sourceNode = nodesRef.current.find(
        (node) => node.id === nodeId,
      )

      if (!sourceNode) {
        return
      }

      if (!isImageNode(sourceNode) && !isPromptNode(sourceNode)) {
        return
      }

      if (
        isPromptNode(sourceNode) &&
        !(sourceNode.data as PromptNodeData | undefined)?.generatedImageUrl
      ) {
        return
      }

      const connectionInfo = { nodeId, handleType }
      setConnectionStart(connectionInfo)
      setDragIndicator({ x: point.x, y: point.y, visible: true })
      connectionCompletedRef.current = false
      connectionStartRef.current = connectionInfo
    },
    [],
  )

  const handleConnectEnd = useCallback<OnConnectEnd>(
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      const point = getClientPoint(event)
      finalizeConnection(point ?? null)
    },
    [finalizeConnection],
  )

  useEffect(() => {
    connectionStartRef.current = connectionStart
  }, [connectionStart])

  useEffect(() => {
    if (!connectionStart) {
      return
    }

    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      if (!connectionStartRef.current) {
        return
      }
      const point = getClientPoint(event)
      if (!point) {
        return
      }
      setDragIndicator({ x: point.x, y: point.y, visible: true })
    }

    const handlePointerUp = (event: MouseEvent | TouchEvent) => {
      if (connectionStartRef.current) {
        const point = getClientPoint(event)
        finalizeConnection(point ?? null)
      } else {
        setDragIndicator(DRAG_INDICATOR_DEFAULT)
      }
    }

    document.addEventListener('mousemove', handlePointerMove)
    document.addEventListener('touchmove', handlePointerMove)
    document.addEventListener('mouseup', handlePointerUp)
    document.addEventListener('touchend', handlePointerUp)

    return () => {
      document.removeEventListener('mousemove', handlePointerMove)
      document.removeEventListener('touchmove', handlePointerMove)
      document.removeEventListener('mouseup', handlePointerUp)
      document.removeEventListener('touchend', handlePointerUp)
    }
  }, [connectionStart, finalizeConnection])

  return useMemo(
    () => ({
      onConnect: safeConnect,
      onConnectStart: handleConnectStart,
      onConnectEnd: handleConnectEnd,
      dragIndicator,
    }),
    [dragIndicator, handleConnectEnd, handleConnectStart, safeConnect],
  )
}
