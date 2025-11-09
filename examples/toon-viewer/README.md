# TOON Viewer Example

Complete standalone TOON format viewer application with drag & drop, real-time conversion, and token counting.

## Overview

This example demonstrates a full-featured viewer application that:
- Supports drag & drop file uploads
- Converts between JSON, TOON, CSV, and YAML in real-time
- Counts tokens for different LLM models
- Provides LLM-grade mode for easy prompt copying
- Shows split-pane comparison view

## Prerequisites

- Node.js 18+ installed
- pnpm installed (or npm/yarn)

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
cd examples/toon-viewer
pnpm install
```

### Step 2: Start Development Server

```bash
pnpm dev
```

The app will start on `http://localhost:5173` (or another port if 5173 is in use).

### Step 3: Open in Browser

Open `http://localhost:5173` in your browser.

## Features

- **Drag & Drop**: Drag files directly into the viewer
- **Real-time Conversion**: Instant format conversion as you type
- **Token Counting**: Live token count updates for different models
- **LLM-Grade Mode**: Copy as fenced code block for LLM prompts
- **Split-Pane Viewer**: Side-by-side format comparison
- **Syntax Highlighting**: Code syntax highlighting for all formats
- **Format Validation**: Real-time format validation with error highlighting

## Complete Code Example

### App.tsx

```tsx
import { FormatViewer } from '@programsmagic/toon-viewer';
import '@programsmagic/toon-viewer/styles';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>TOON Format Viewer</h1>
      <FormatViewer
        initialContent='{"users": [{"id": 1, "name": "Alice"}]}'
        initialFormat="json"
        showTokenCounter={true}
        showFormatSelector={true}
        llmMode={true}
        model="gpt-4"
        onContentChange={(content, format) => {
          console.log('Content changed:', content, format);
        }}
      />
    </div>
  );
}

export default App;
```

## Usage

### Drag & Drop Files

1. Drag a JSON, TOON, CSV, or YAML file into the viewer
2. The file will be automatically loaded and displayed
3. You can then convert to other formats

### Real-time Conversion

1. Type or paste content in the left pane
2. Select target format from the dropdown
3. View converted content in the right pane
4. Token count updates automatically

### LLM-Grade Mode

1. Enable LLM-grade mode toggle
2. Click "Copy" button
3. Content is copied as fenced code block: `\`\`\`toon\ncontent\n\`\`\``

### Token Counting

1. Select LLM model from dropdown (gpt-4, gpt-3.5-turbo, claude-3-opus, etc.)
2. Token count updates automatically
3. View estimated cost for the selected model

## Expected Output

When you load a JSON file:

```
Input (JSON):
{
  "users": [
    {"id": 1, "name": "Alice"},
    {"id": 2, "name": "Bob"}
  ]
}

Output (TOON):
users [
  id 1 name Alice
  id 2 name Bob
]

Tokens: 45 (gpt-4)
Estimated Cost: $0.0005
```

## Troubleshooting

### File Not Loading

**Problem**: File doesn't load when dragged.

**Solution**:
- Check file format: Ensure JSON, TOON, CSV, or YAML
- Check file size: Large files may take time to load
- Check browser console: Look for error messages

### Conversion Errors

**Problem**: Format conversion fails.

**Solution**:
- Check input format: Ensure valid format
- Check data structure: Some formats have limitations
- Check error messages: Look for specific error details

### Token Counting Errors

**Problem**: Token counting fails.

**Solution**:
- Verify model name: Use supported model names
- Check data format: Ensure valid format
- Check browser console: Look for error messages

## Next Steps

- Try different file formats and data structures
- Experiment with different LLM models
- Integrate viewer into your applications
- Check out the [Viewer UI Guide](../../docs/viewer-guide.md) for more details
- Explore the [TOON Format Guide](../../docs/toon-format.md) for format details

