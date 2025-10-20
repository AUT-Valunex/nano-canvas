import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Essential browser API mocks for test environment only
// These are NOT app features - just testing infrastructure
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

globalThis.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Canvas context for image handling tests
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({
    drawImage: () => {},
    getImageData: () => ({ data: new Uint8ClampedArray(4) }),
    putImageData: () => {},
    createImageData: () => ({ data: new Uint8ClampedArray(4) }),
    setTransform: () => {},
    drawFocusIfNeeded: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
  }),
})

// File handling APIs
global.URL.createObjectURL = () => 'mocked-url'
global.URL.revokeObjectURL = () => {}

class FileMock extends Blob {
  readonly name: string
  readonly lastModified: number
  readonly webkitRelativePath = ''

  constructor(bits: BlobPart[], name: string, options: FilePropertyBag = {}) {
    super(bits, options)
    this.name = name
    this.lastModified = options.lastModified ?? Date.now()
  }
}

class FileListMock implements FileList {
  [index: number]: File
  length = 0
  item(): File | null {
    return null
  }
  [Symbol.iterator](): IterableIterator<File> {
    return [][Symbol.iterator]() as IterableIterator<File>
  }
}

class DataTransferItemListMock implements DataTransferItemList {
  [index: number]: DataTransferItem
  length = 0
  add(): DataTransferItem | null {
    return null
  }
  clear(): void {}
  remove(): void {}
  item(): DataTransferItem | null {
    return null
  }
  [Symbol.iterator](): IterableIterator<DataTransferItem> {
    return [][Symbol.iterator]() as IterableIterator<DataTransferItem>
  }
}

class DataTransferMock implements DataTransfer {
  dropEffect: DataTransfer['dropEffect'] = 'none'
  effectAllowed: DataTransfer['effectAllowed'] = 'all'
  files: FileList = new FileListMock()
  items: DataTransferItemList = new DataTransferItemListMock()
  types: readonly string[] = []

  clearData(): void {}
  getData(): string {
    return ''
  }
  setData(): void {}
  setDragImage(): void {}
}

class DragEventMock extends Event {
  readonly dataTransfer: DataTransfer

  constructor(type: string, eventInitDict?: DragEventInit) {
    super(type, eventInitDict)
    this.dataTransfer = eventInitDict?.dataTransfer ?? new DataTransferMock()
  }
}

type ClipboardItemInitMap = Record<string, Blob | Promise<Blob>>
class ClipboardItemMock implements ClipboardItem {
  readonly types: readonly string[]
  #items: ClipboardItemInitMap
  readonly presentationStyle: 'unspecified' | 'attachment' | 'inline'

  constructor(items: ClipboardItemInitMap, _name: string, options?: ClipboardItemOptions) {
    this.#items = items
    this.types = Object.keys(items)
    this.presentationStyle = options?.presentationStyle ?? 'unspecified'
  }

  async getType(type: string): Promise<Blob> {
    const value = this.#items[type]
    if (!value) {
      throw new DOMException('Requested clipboard item type not found', 'NotFoundError')
    }
    return value instanceof Blob ? value : await value
  }
}

class ClipboardEventMock extends Event {
  readonly clipboardData: DataTransfer

  constructor(type: string, eventInitDict?: ClipboardEventInit) {
    super(type, eventInitDict)
    this.clipboardData = (eventInitDict?.clipboardData as DataTransfer | undefined) ?? new DataTransferMock()
  }
}

global.File = FileMock as unknown as typeof File
global.DataTransfer = DataTransferMock as unknown as {
  prototype: DataTransfer
  new (): DataTransfer
}
global.DragEvent = DragEventMock as unknown as typeof DragEvent
global.ClipboardEvent = ClipboardEventMock as unknown as typeof ClipboardEvent
;(global as typeof globalThis & { ClipboardItem: typeof ClipboardItemMock }).ClipboardItem =
  ClipboardItemMock
