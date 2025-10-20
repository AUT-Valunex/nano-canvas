import ImageNode from './components/ImageNode'
import PromptNode from './components/PromptNode'
import type { ImageNodeData, PromptNodeData } from './store/canvasStore'

export const nodeTypes = {
  imageNode: ImageNode,
  promptNode: PromptNode,
}

export type { ImageNodeData, PromptNodeData }
