# Google Gemini API Image Generation Guide

## Key Issues with Current Implementation

1. **Wrong API Structure**: You're using a custom REST API approach instead of the official Gemini JavaScript SDK
2. **Incorrect Model Names**: Should be using `gemini-2.5-flash-image` not custom names
3. **Wrong Request Format**: Needs to use the official `@google/genai` SDK format

## Correct Implementation Approach

### 1. Install Required Package

```bash
npm install @google/genai
```

### 2. Proper Image Input Format

Images must be sent as an array of content parts with the correct structure:

```javascript
const prompt = [
  {
    text: 'Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation',
  },
  {
    inlineData: {
      mimeType: 'image/png',
      data: base64Image,
    },
  },
]
```

### 3. Multiple Images Support

For multiple reference images (up to 3 recommended):

```javascript
const prompt = [
  {
    inlineData: {
      mimeType: 'image/png',
      data: base64Image1,
    },
  },
  {
    inlineData: {
      mimeType: 'image/png',
      data: base64Image2,
    },
  },
  {
    text: 'Combine elements from both images to create a new composition',
  },
]
```

### 4. Proper API Call Structure

```javascript
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: 'YOUR_API_KEY' })

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash-image',
  contents: prompt,
  config: {
    responseModalities: ['Image'], // Only return images
    imageConfig: {
      aspectRatio: '1:1', // Square images by default
    },
  },
})
```

### 5. Handling Response

Response contains both text and image data:

```javascript
for (const part of response.candidates[0].content.parts) {
  if (part.text) {
    console.log(part.text)
  } else if (part.inlineData) {
    const imageData = part.inlineData.data
    const buffer = Buffer.from(imageData, 'base64')
    // Process the generated image
  }
}
```

## Critical Missing Features in Current Implementation

1. **No official SDK usage**: Must use `@google/genai` package
2. **Wrong content structure**: Images must be in `inlineData` format
3. **Missing response modalities config**: Should specify `['Image']` for image-only responses
4. **Incorrect model naming**: Use `gemini-2.5-flash-image`
5. **No aspect ratio control**: Should support different aspect ratios
6. **Token-based pricing**: Images cost 1290 tokens each

## Image Generation Modes

### Text-to-Image

```javascript
const prompt = 'A photorealistic portrait of an elderly Japanese ceramicist...'
```

### Image-to-Image (with reference)

```javascript
const prompt = [
  { inlineData: { mimeType: 'image/png', data: base64Image } },
  { text: 'Transform this image into a van Gogh style painting' },
]
```

### Multi-Image Composition

```javascript
const prompt = [
  { inlineData: { mimeType: 'image/png', data: base64Image1 } },
  { inlineData: { mimeType: 'image/png', data: base64Image2 } },
  { text: 'Combine elements from both images' },
]
```

## Required Changes for Your Implementation

1. Install `@google/genai` package
2. Update API calls to use official SDK
3. Fix image input format to use `inlineData`
4. Use correct model names
5. Add proper response handling for both text and images
6. Add configuration options for aspect ratios
7. Update token counting logic (1290 tokens per image)
