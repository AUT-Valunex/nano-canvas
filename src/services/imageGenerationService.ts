import { GoogleGenAI } from '@google/genai'
import toast from 'react-hot-toast'
import {
  AVAILABLE_MODELS,
  useSettingsStore,
} from '../store/settingsStore'

export interface ImageGenerationRequest {
  prompt: string
  referenceImages?: Array<{
    data: string
    mimeType: string
  }>
}

export interface ImageGenerationResponse {
  generatedImageUrl?: string
  generatedImageBlob?: Blob
  error?: string
  model?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface ModelConfig {
  provider: string
  modelId: string
  baseUrl: string
  apiKey: string
  maxTokens?: number
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const approxPromptTokens = (prompt: string): number => {
  const cleaned = prompt.trim()
  if (!cleaned) {
    return 0
  }
  const characters = cleaned.length
  return Math.max(1, Math.ceil(characters / 4))
}

class ImageGenerationService {
  private getModelConfig(): ModelConfig | null {
    const { apiKey, baseUrl, model } = useSettingsStore.getState()
    if (!isNonEmptyString(model)) {
      return null
    }

    const modelRecord = Object.values(AVAILABLE_MODELS).find(
      (entry) => entry.id === model,
    )

    return {
      provider: modelRecord?.provider ?? 'google',
      modelId: model,
      baseUrl: baseUrl || modelRecord?.baseUrl || '',
      apiKey: apiKey ?? '',
      maxTokens: modelRecord?.maxTokens ?? 4096,
    }
  }

  private ensurePromptProvided(
    request: ImageGenerationRequest,
  ): ImageGenerationResponse | null {
    if (!isNonEmptyString(request.prompt)) {
      return {
        error:
          'Please describe the image you want to create before generating.',
      }
    }
    return null
  }

  private ensureCredentials(
    config: ModelConfig | null,
  ): ImageGenerationResponse | null {
    if (!config) {
      return {
        error:
          'Select a model in settings before generating an image.',
      }
    }

    if (!isNonEmptyString(config.apiKey)) {
      return {
        error:
          'API key required. Add your Google AI API key in the settings panel.',
        model: config.modelId,
      }
    }

    if (!isNonEmptyString(config.baseUrl)) {
      return {
        error:
          'Base URL missing. Please confirm your Google AI endpoint in settings.',
        model: config.modelId,
      }
    }

    return null
  }

  private async dataUrlToBlob(dataUrl: string): Promise<Blob> {
    const response = await fetch(dataUrl)
    if (!response.ok) {
      throw new Error('Unable to download generated image data.')
    }
    return response.blob()
  }

  async processRequest(
    request: ImageGenerationRequest,
  ): Promise<ImageGenerationResponse> {
    const promptValidation = this.ensurePromptProvided(request)
    if (promptValidation) {
      return promptValidation
    }

    const config = this.getModelConfig()
    const credentialValidation = this.ensureCredentials(config)
    if (credentialValidation) {
      return credentialValidation
    }

    if (!config) {
      return {
        error:
          'Unable to load model configuration. Please reopen settings and try again.',
      }
    }

    try {
      if (config.provider !== 'google') {
        return {
          error:
            'Only Google AI models are supported right now. Select Nano Banana in settings.',
          model: config.modelId,
        }
      }

      return await this.generateWithGoogleAI(request, config)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred.'
      return {
        error: `Image generation failed: ${message}`,
        model: config.modelId,
      }
    }
  }

  private buildGooglePromptParts(
    request: ImageGenerationRequest,
  ) {
    const parts: Array<
      { text: string } | { inlineData: { mimeType: string; data: string } }
    > = [{ text: request.prompt }]

    if (request.referenceImages?.length) {
      for (const image of request.referenceImages) {
        if (isNonEmptyString(image.data) && isNonEmptyString(image.mimeType)) {
          parts.push({
            inlineData: { mimeType: image.mimeType, data: image.data },
          })
        }
      }
    }

    return parts
  }

  private async generateWithGoogleAI(
    request: ImageGenerationRequest,
    config: ModelConfig,
  ): Promise<ImageGenerationResponse> {
    const client = new GoogleGenAI({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || undefined,
    })

    const contents = this.buildGooglePromptParts(request)

    try {
      const response = await client.models.generateContent({
        model: config.modelId,
        contents,
        config: {
          responseModalities: ['Image'],
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      })

      const candidate = response.candidates?.[0]
      const parts = candidate?.content?.parts ?? []
      const imagePart = parts.find(
        (part): part is { inlineData: { data: string; mimeType: string } } =>
          Boolean((part as { inlineData?: unknown }).inlineData),
      )

      if (!imagePart?.inlineData?.data) {
        throw new Error('No image returned from the model.')
      }

      const imageData = imagePart.inlineData.data
      const mimeType = imagePart.inlineData.mimeType || 'image/png'
      const imageUrl = `data:${mimeType};base64,${imageData}`
      const blob = await this.dataUrlToBlob(imageUrl)

      toast.success('Image generated successfully!', {
        duration: 3000,
      })

      const promptTokens = approxPromptTokens(request.prompt)
      const completionTokens = approxPromptTokens(imageData) // approximate for parity
      const usage = {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      }

      return {
        generatedImageUrl: imageUrl,
        generatedImageBlob: blob,
        model: config.modelId,
        usage,
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred.'

      if (message.includes('quota') || message.includes('429')) {
        toast.error(
          'API quota exceeded. Check your Google AI Studio usage.',
          {
            duration: 5000,
          },
        )
        return {
          error:
            'API quota exceeded. Review your Google AI Studio usage and billing.',
          model: config.modelId,
        }
      }

      if (message.toLowerCase().includes('api key')) {
        toast.error('Invalid API key. Please verify your settings.', {
          duration: 5000,
        })
        return {
          error:
            'Invalid API key. Update your Google AI API key in settings and try again.',
          model: config.modelId,
        }
      }

      if (message.toLowerCase().includes('fetch')) {
        toast.error('Network error while contacting Google AI.', {
          duration: 5000,
        })
        return {
          error:
            'We could not reach Google AI. Check your network connection and try again.',
          model: config.modelId,
        }
      }

      return {
        error: `Image generation failed: ${message}`,
        model: config.modelId,
      }
    }
  }

  async generateImageFromPrompt(
    prompt: string,
    referenceImages?: Array<{ data: string; mimeType: string }>,
  ): Promise<ImageGenerationResponse> {
    return this.processRequest({
      prompt,
      referenceImages,
    })
  }
}

export const imageGenerationService = new ImageGenerationService()
