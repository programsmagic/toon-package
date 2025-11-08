# Viewer UI Guide

Complete guide to using the TOON format viewer components.

## Installation

```bash
npm install @toon/viewer
```

## Basic Usage

```tsx
import { FormatViewer } from '@toon/viewer';
import '@toon/viewer/styles';

function App() {
  return (
    <FormatViewer
      initialContent='{"user": {"id": 123, "name": "Ada"}}'
      initialFormat="json"
      showTokenCounter={true}
      llmMode={true}
    />
  );
}
```

## Components

### FormatViewer

Main split-pane viewer component.

**Props:**
- `initialContent` (string): Initial content
- `initialFormat` (SupportedFormat): Initial format
- `showTokenCounter` (boolean): Show token counter
- `showFormatSelector` (boolean): Show format selector
- `llmMode` (boolean): LLM-grade mode (copy as fenced block)
- `model` (string): Model for token counting
- `onContentChange` (function): Content change callback

### FileDropZone

Drag & drop file upload component.

**Props:**
- `onFileLoad` (function): File load callback
- `acceptedFormats` (string[]): Accepted file formats

### TokenCounter

Token count display component.

**Props:**
- `tokens` (number): Token count
- `model` (string): Model name
- `estimatedCost` (object): Estimated cost
- `label` (string): Label text

## Features

- **Split-pane viewer**: Side-by-side format comparison
- **Real-time conversion**: Instant format conversion
- **Token counting**: Live token count updates
- **Drag & drop**: Easy file upload
- **Syntax highlighting**: Code syntax highlighting
- **Copy button**: Copy with prompt wrapper

## LLM-Grade Mode

Enable LLM-grade mode for optimized prompt copying:

```tsx
<FormatViewer
  llmMode={true}
  // Copies as: ```toon\ncontent\n```
/>
```

## License

MIT

