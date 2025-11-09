# @programsmagic/toon-viewer

Rich React viewer component with split-pane UI for multi-format viewing and conversion.

## Installation

```bash
npm install @programsmagic/toon-viewer
# or
pnpm add @programsmagic/toon-viewer
# or
yarn add @programsmagic/toon-viewer
```

## Usage

```tsx
import { FormatViewer } from '@programsmagic/toon-viewer';
import '@programsmagic/toon-viewer/styles';

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

## Features

- Split-pane viewer (side-by-side format comparison)
- Real-time format conversion
- Token count display (live updates)
- Drag & drop file support
- Syntax highlighting
- Copy as fenced block (LLM-grade mode)
- Format validation with error highlighting

## Components

### FormatViewer

Main split-pane viewer component.

### FileDropZone

Drag & drop file upload component.

### TokenCounter

Token count display component.

### FormatSelector

Format selection dropdown.

### CopyButton

Copy button with prompt wrapper.

## License

MIT

