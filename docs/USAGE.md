# Nano Canvas - AI Vision Workflow

## How to Use

### 1. Setup API Key

1. Click the settings button (⚙️) in the top toolbar
2. Enter your Google AI API key (get one from: https://makersuite.google.com/app/apikey)
3. Save the settings

### 2. Create Your Workflow

1. **Click on empty canvas space** to open the node selection modal
2. **Add an Image Node** - Click "Image Node" to create an image upload node
3. **Upload an image** - Click or drag an image into the image node
4. **Add a Prompt Node** - Click "Prompt Node" or drag from the image node's bottom handle
5. **Add more prompt nodes** if you want separate generations

### 3. Connect the Nodes

1. **Connect Image → Prompt**: Drag from the bottom handle of the image node to the top handle of the prompt node

### 4. Run the Workflow

1. **Enter your prompt** in the prompt node (e.g., "Describe this image in detail")
2. **Click Submit** or press **Cmd/Ctrl+Enter**
3. Wait for the AI to process and show results

## Workflow Pattern

```
[Image Node] → [Prompt Node]
     ↓              ↓
  Upload         Enter text
```

## Features

- **Image Upload**: Click, drag & drop, or paste images
- **Real-time Processing**: See AI responses in seconds
- **Multiple Images**: Connect multiple image nodes to one prompt
- **Download Results**: Save generated images or copy text responses

## Troubleshooting

- **Infinite modal loop**: Fixed ✅
- **Images not showing**: Check browser console for upload errors
- **Submit not working**:
  - Ensure API key is configured
  - Check that nodes are properly connected
  - Verify prompt text is not empty

## Developer Quickstart

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
```

The open-source bundle does not include analytics. If you add deployment-specific telemetry, document it for your users and update `NOTICE.md`.
