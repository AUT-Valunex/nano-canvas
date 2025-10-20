# Google Gemini API Usage Guide

This guide covers image generation capabilities using Google's Gemini API, which powers Nano Canvas's visual AI features.

## Overview

Gemini can generate and process images conversationally. You can prompt Gemini with text, images, or a combination of both allowing you to create, edit, and iterate on visuals with unprecedented control:

- **Text-to-Image**: Generate high-quality images from simple or complex text descriptions.
- **Image + Text-to-Image (Editing)**: Provide an image and use text prompts to add, remove, or modify elements, change the style, or adjust the color grading.
- **Multi-Image to Image (Composition & Style Transfer)**: Use multiple input images to compose a new scene or transfer the style from one image to another.
- **Iterative Refinement**: Engage in a conversation to progressively refine your image over multiple turns, making small adjustments until it's perfect.
- **High-Fidelity Text Rendering**: Accurately generate images that contain legible and well-placed text, ideal for logos, diagrams, and posters.

> **Note**: All generated images include a SynthID watermark.

## Image Generation (Text-to-Image)

The following code demonstrates how to generate an image based on a descriptive prompt.

```python
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

client = genai.Client()

prompt = (
    "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"
)

response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[prompt],
)

for part in response.candidates[0].content.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = Image.open(BytesIO(part.inline_data.data))
        image.save("generated_image.png")
```

## Image Editing (Text-and-Image-to-Image)

> **Reminder**: Make sure you have the necessary rights to any images you upload. Don't generate content that infringes on others' rights. Your use of this generative AI service is subject to Google's Prohibited Use Policy.

The following example demonstrates uploading images for editing:

```python
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

client = genai.Client()

prompt = (
    "Create a picture of my cat eating a nano-banana in a "
    "fancy restaurant under the Gemini constellation",
)

image = Image.open("/path/to/cat_image.png")

response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[prompt, image],
)

for part in response.candidates[0].content.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = Image.open(BytesIO(part.inline_data.data))
        image.save("generated_image.png")
```

## Other Image Generation Modes

Gemini supports additional image interaction modes based on prompt structure and context:

### Text to Image(s) and Text (Interleaved)
Outputs images with related text.
- **Example prompt**: "Generate an illustrated recipe for a paella."

### Image(s) and Text to Image(s) and Text (Interleaved)
Uses input images and text to create new related images and text.
- **Example prompt**: (With an image of a furnished room) "What other color sofas would work in my space? Can you update the image?"

### Multi-Turn Image Editing (Chat)
Keep generating and editing images conversationally.
- **Example prompts**:
  1. [Upload an image of a blue car]
  2. "Turn this car into a convertible."
  3. "Now change the color to yellow."

## Prompting Guide and Strategies

**Fundamental Principle**: Describe the scene, don't just list keywords. The model's core strength is its deep language understanding. A narrative, descriptive paragraph will almost always produce a better, more coherent image than a list of disconnected words.

### 1. Photorealistic Scenes

For realistic images, use photography terms. Mention camera angles, lens types, lighting, and fine details.

**Template**:
```
A photorealistic [shot type] of [subject], [action or expression], set in
[environment]. The scene is illuminated by [lighting description], creating
a [mood] atmosphere. Captured with a [camera/lens details], emphasizing
[key textures and details]. The image should be in a [aspect ratio] format.
```

### 2. Stylized Illustrations & Stickers

To create stickers, icons, or assets, be explicit about the style and request a transparent background.

**Template**:
```
A [style] sticker of a [subject], featuring [key characteristics] and a
[color palette]. The design should have [line style] and [shading style].
The background must be transparent.
```

### 3. Accurate Text in Images

Gemini excels at rendering text. Be clear about the text, the font style (descriptively), and the overall design.

**Template**:
```
Create a [image type] for [brand/concept] with the text "[text to render]"
in a [font style]. The design should be [style description], with a
[color scheme].
```

### 4. Product Mockups & Commercial Photography

Perfect for creating clean, professional product shots for e-commerce, advertising, or branding.

**Template**:
```
A high-resolution, studio-lit product photograph of a [product description]
on a [background surface/description]. The lighting is a [lighting setup,
e.g., three-point softbox setup] to [lighting purpose]. The camera angle is
a [angle type] to showcase [specific feature]. Ultra-realistic, with sharp
focus on [key detail]. [Aspect ratio].
```

### 5. Minimalist & Negative Space Design

Excellent for creating backgrounds for websites, presentations, or marketing materials where text will be overlaid.

**Template**:
```
A minimalist composition featuring a single [subject] positioned in the
[bottom-right/top-left/etc.] of the frame. The background is a vast, empty
[color] canvas, creating significant negative space. Soft, subtle lighting.
[Aspect ratio].
```

### 6. Sequential Art (Comic Panel / Storyboard)

Builds on character consistency and scene description to create panels for visual storytelling.

**Template**:
```
A single comic book panel in a [art style] style. In the foreground,
[character description and action]. In the background, [setting details].
The panel has a [dialogue/caption box] with the text "[Text]". The lighting
creates a [mood] mood. [Aspect ratio].
```

## Image Editing Prompts

### 1. Adding and Removing Elements

Provide an image and describe your change. The model will match the original image's style, lighting, and perspective.

**Template**:
```
Using the provided image of [subject], please [add/remove/modify] [element]
to/from the scene. Ensure the change is [description of how the change should
integrate].
```

### 2. Inpainting (Semantic Masking)

Conversationally define a "mask" to edit a specific part of an image while leaving the rest untouched.

**Template**:
```
Using the provided image, change only the [specific element] to [new
element/description]. Keep everything else in the image exactly the same,
preserving the original style, lighting, and composition.
```

### 3. Style Transfer

Provide an image and ask the model to recreate its content in a different artistic style.

**Template**:
```
Transform the provided photograph of [subject] into the artistic style of
[artist/art style]. Preserve the original composition but render it with
[description of stylistic elements].
```

### 4. Advanced Composition: Combining Multiple Images

Provide multiple images as context to create a new, composite scene.

**Template**:
```
Create a new image by combining the elements from the provided images. Take
the [element from image 1] and place it with/on the [element from image 2].
The final image should be a [description of the final scene].
```

### 5. High-Fidelity Detail Preservation

To ensure critical details (like a face or logo) are preserved during an edit, describe them in great detail.

**Template**:
```
Using the provided images, place [element from image 2] onto [element from
image 1]. Ensure that the features of [element from image 1] remain
completely unchanged. The added element should [description of how the
element should integrate].
```

## Best Practices

### Be Hyper-Specific
The more detail you provide, the more control you have. Instead of "fantasy armor," describe it: "ornate elven plate armor, etched with silver leaf patterns, with a high collar and pauldrons shaped like falcon wings."

### Provide Context and Intent
Explain the purpose of the image. For example, "Create a logo for a high-end, minimalist skincare brand" will yield better results than just "Create a logo."

### Iterate and Refine
Don't expect a perfect image on the first try. Use the conversational nature of the model to make small changes:
- "That's great, but can you make the lighting a bit warmer?"
- "Keep everything the same, but change the character's expression to be more serious."

### Use Step-by-Step Instructions
For complex scenes with many elements, break your prompt into steps:
1. "First, create a background of a serene, misty forest at dawn."
2. "Then, in the foreground, add a moss-covered ancient stone altar."
3. "Finally, place a single, glowing sword on top of the altar."

### Use "Semantic Negative Prompts"
Instead of saying "no cars," describe the desired scene positively: "an empty, deserted street with no signs of traffic."

### Control the Camera
Use photographic and cinematic language to control the composition. Terms like `wide-angle shot`, `macro shot`, `low-angle perspective`.

## Limitations

- For best performance, use the following languages: EN, es-MX, ja-JP, zh-CN, hi-IN.
- Image generation does not support audio or video inputs.
- The model won't always follow the exact number of image outputs that the user explicitly asks for.
- The model works best with up to 3 images as an input.
- When generating text for an image, Gemini works best if you first generate the text and then ask for an image with the text.
- Uploading images of children is not currently supported in EEA, CH, and UK.
- All generated images include a SynthID watermark.

## Optional Configurations

### Output Types

The model defaults to returning text and image responses (`response_modalities=['Text', 'Image']`). You can configure the response to return only images:

```python
response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[prompt],
    config=types.GenerateContentConfig(
        response_modalities=['Image']
    )
)
```

### Aspect Ratios

The model defaults to matching the output image size to that of your input image, or otherwise generates 1:1 squares. You can control the aspect ratio:

```python
response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[prompt],
    config=types.GenerateContentConfig(
        image_config=types.ImageConfig(
            aspect_ratio="16:9",
        )
    )
)
```

**Available aspect ratios**:

| Aspect Ratio | Resolution | Tokens |
|--------------|------------|--------|
| 1:1 | 1024x1024 | 1290 |
| 2:3 | 832x1248 | 1290 |
| 3:2 | 1248x832 | 1290 |
| 3:4 | 864x1184 | 1290 |
| 4:3 | 1184x864 | 1290 |
| 4:5 | 896x1152 | 1290 |
| 5:4 | 1152x896 | 1290 |
| 9:16 | 768x1344 | 1290 |
| 16:9 | 1344x768 | 1290 |
| 21:9 | 1536x672 | 1290 |

## When to Use Imagen

In addition to using Gemini's built-in image generation capabilities, you can also access Imagen, Google's specialized image generation model, through the Gemini API.

| Attribute | Imagen | Gemini Native Image |
|-----------|--------|---------------------|
| **Strengths** | Most capable image generation model to date. Recommended for photorealistic images, sharper clarity, improved spelling and typography. | Default recommendation. Unparalleled flexibility, contextual understanding, and simple, mask-free editing. Uniquely capable of multi-turn conversational editing. |
| **Availability** | Generally available | Preview (Production usage allowed) |
| **Latency** | Low. Optimized for near-real-time performance. | Higher. More computation is required for its advanced capabilities. |
| **Cost** | Cost-effective for specialized tasks. $0.02/image to $0.12/image | Token-based pricing. $30 per 1 million tokens for image output (image output tokenized at 1290 tokens per image flat, up to 1024x1024px) |

### Recommended Tasks

**Use Imagen when**:
- Image quality, photorealism, artistic detail, or specific styles (e.g., impressionism, anime) are top priorities.
- Infusing branding, style, or generating logos and product designs.
- Generating advanced spelling or typography.

**Use Gemini Native Image when**:
- Interleaved text and image generation to seamlessly blend text and images.
- Combining creative elements from multiple images with a single prompt.
- Making highly specific edits to images, modifying individual elements with simple language commands, and iteratively working on an image.
- Applying a specific design or texture from one image to another while preserving the original subject's form and details.

> **Recommendation**: Imagen 4 should be your go-to model starting to generate images with Imagen. Choose Imagen 4 Ultra for advanced use-cases or when you need the best image quality (note that it can only generate one image at a time).

## Additional Resources

- [Google AI Studio](https://makersuite.google.com/app/apikey) - Get your API key
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Veo Guide](https://ai.google.dev/docs) - Learn how to generate videos with the Gemini API

---

*This guide is based on Google's official Gemini API documentation and is provided for reference purposes.*
