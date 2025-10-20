import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import {
  useCanvasStore,
  type PromptNodeData,
} from '../store/canvasStore'

describe('canvasStore', () => {
  beforeEach(() => {
    act(() => {
      useCanvasStore.getState().resetCanvas()
    })
  })

  it('initialises with default nodes and edges', () => {
    const state = useCanvasStore.getState()
    expect(state.nodes).toHaveLength(2)
    expect(state.edges).toHaveLength(1)
  })

  it('updates a prompt node with generated image data', () => {
    const promptNode = useCanvasStore
      .getState()
      .nodes.find((node) => node.type === 'promptNode')
    expect(promptNode).toBeDefined()

    const blob = new Blob(['test'], { type: 'image/png' })

    act(() => {
      useCanvasStore
        .getState()
        .setGeneratedImage(promptNode!.id, 'data:image/png;base64,abc', blob, 'model-id', {
          promptTokens: 12,
          completionTokens: 34,
          totalTokens: 46,
        })
    })

    const updatedNode = useCanvasStore
      .getState()
      .nodes.find((node) => node.id === promptNode!.id)
    const data = updatedNode?.data as PromptNodeData | undefined
    expect(data?.generatedImageUrl).toBe('data:image/png;base64,abc')
    expect(data?.generatedImageBlob).toBe(blob)
    expect(data?.model).toBe('model-id')
  })

  it('clears generated result and resets output scale', () => {
    const promptNode = useCanvasStore
      .getState()
      .nodes.find((node) => node.type === 'promptNode')
    expect(promptNode).toBeDefined()

    act(() => {
      useCanvasStore
        .getState()
        .setGeneratedImage(promptNode!.id, 'data:image/png;base64,abc', undefined, 'model-id', undefined)
      useCanvasStore.getState().clearResult(promptNode!.id)
    })

    const cleared = useCanvasStore
      .getState()
      .nodes.find((node) => node.id === promptNode!.id)
    const data = cleared?.data as PromptNodeData | undefined
    expect(data?.generatedImageUrl).toBeUndefined()
    expect(data?.outputScale).toBe(1)
  })

  it('updates output scale for prompt nodes only', () => {
    const promptNode = useCanvasStore
      .getState()
      .nodes.find((node) => node.type === 'promptNode')
    expect(promptNode).toBeDefined()

    act(() => {
      useCanvasStore.getState().updateOutputScale(promptNode!.id, 3)
    })

    const updated = useCanvasStore
      .getState()
      .nodes.find((node) => node.id === promptNode!.id)
    const data = updated?.data as PromptNodeData | undefined
    expect(data?.outputScale).toBe(3)
  })
})
