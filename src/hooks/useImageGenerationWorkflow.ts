import { useCallback } from 'react'
import {
  useCanvasStore,
  PromptNodeData,
  ImageNodeData,
} from '../store/canvasStore'
import { imageGenerationService } from '../services/imageGenerationService'

export function useImageGenerationWorkflow() {
  const setGeneratedImage = useCanvasStore((state) => state.setGeneratedImage)
  const setError = useCanvasStore((state) => state.setError)
  const startProcessing = useCanvasStore((state) => state.startProcessing)
  const stopProcessing = useCanvasStore((state) => state.stopProcessing)
  const updateNodeData = useCanvasStore((state) => state.updateNodeData)

  const processConnectedNodes = useCallback(
    async (promptNodeId: string) => {
      const { nodes, edges } = useCanvasStore.getState()

      const promptNode = nodes.find((node) => node.id === promptNodeId)
      const promptNodeData = promptNode?.data as PromptNodeData | undefined
      const prompt = promptNodeData?.prompt

      if (!prompt || prompt.trim() === '') {
        setError(
          promptNodeId,
          'Please enter a prompt describing the image you want to generate.',
        )
        return
      }

      // Prepare reference images (optional)
      const connectedEdges = edges.filter(
        (edge) => edge.target === promptNodeId,
      )
      const sourceNodeIds = connectedEdges.map((edge) => edge.source)

      const referenceImages = sourceNodeIds
        .map((nodeId) => {
          const sourceNode = nodes.find((node) => node.id === nodeId)

          // Check if it's an ImageNode with uploaded image
          if (sourceNode?.type === 'imageNode') {
            const data = sourceNode.data as ImageNodeData
            if (!data.imageUrl) return null

            const parts = data.imageUrl.split(',')
            if (parts.length !== 2) return null

            const mimeType =
              parts[0].split(':')[1]?.split(';')[0] ?? 'image/jpeg'
            const base64Data = parts[1]

            return { data: base64Data, mimeType }
          }

          // Check if it's a PromptNode with generated image
          if (sourceNode?.type === 'promptNode') {
            const data = sourceNode.data as PromptNodeData
            if (!data.generatedImageUrl) return null

            const parts = data.generatedImageUrl.split(',')
            if (parts.length !== 2) return null

            const mimeType =
              parts[0].split(':')[1]?.split(';')[0] ?? 'image/jpeg'
            const base64Data = parts[1]

            return { data: base64Data, mimeType }
          }

          return null
        })
        .filter(Boolean) as { data: string; mimeType: string }[] | undefined

      startProcessing(promptNodeId)
      updateNodeData(promptNodeId, {
        error: undefined,
      })

      try {
        const response = await imageGenerationService.processRequest({
          prompt: prompt.trim(),
          referenceImages,
        })

        if (response.error) {
          setError(promptNodeId, response.error)
          return
        }

        if (response.generatedImageUrl) {
          setGeneratedImage(
            promptNodeId,
            response.generatedImageUrl,
            response.generatedImageBlob,
            response.model,
            response.usage,
          )
        }
      } catch (error) {
        console.error('Image generation workflow error:', error)
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'
        setError(promptNodeId, errorMessage)
      } finally {
        stopProcessing(promptNodeId)
      }
    },
    [
      setGeneratedImage,
      setError,
      startProcessing,
      stopProcessing,
      updateNodeData,
    ],
  )

  return {
    processConnectedNodes,
  }
}
