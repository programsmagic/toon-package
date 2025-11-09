# Agent Streaming Example

Complete example demonstrating agent streaming with TOON format using `@programsmagic/toon-backend-node` and `@programsmagic/toon-frontend`.

## Overview

This example shows how to:
- Stream agent events in TOON format
- Convert data formats in real-time
- Count tokens for LLM optimization
- Visualize streaming data in the frontend

## Prerequisites

- Node.js 18+ installed
- pnpm installed (or npm/yarn)

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
cd examples/agent-streaming
pnpm install
```

### Step 2: Start the Server

```bash
pnpm start
```

The server will start on `http://localhost:3000`.

### Step 3: Test the Streaming Endpoint

```bash
# Stream TOON format
curl "http://localhost:3000/stream/toon?file=data.json&format=json&model=gpt-4"

# Stream with format conversion
curl "http://localhost:3000/stream/toon?file=data.json&from=json&to=toon"
```

## Features

- **TOON Format Streaming**: Stream data in TOON format for LLM optimization
- **Real-time Event Streaming**: Watch events stream in real-time via SSE
- **Token Counting**: Count tokens for different LLM models
- **Format Conversion API**: Convert between JSON, TOON, CSV, and YAML

## API Endpoints

- `GET /stream/toon?file=data.json` - Stream data in TOON format
- `GET /events` - SSE event stream
- `POST /convert` - Convert between formats
- `POST /tokens` - Count tokens for data
- `POST /optimize` - Optimize data for LLM

## Complete Code Example

### Backend (server.js)

```javascript
import { createServer } from '@programsmagic/toon-backend-node';

const server = await createServer({
  port: 3000,
  schemaSource: './schema.json',
  cors: true,
});

await server.start();
console.log('Server running at http://localhost:3000');
```

### Frontend (App.tsx)

```tsx
import { StreamViewer } from '@programsmagic/toon-frontend';
import '@programsmagic/toon-frontend/styles';

function App() {
  return (
    <StreamViewer
      url="http://localhost:3000/stream/toon?file=data.json"
      protocol="sse"
      showTokenCounter={true}
      model="gpt-4"
    />
  );
}
```

## Expected Output

When you access the streaming endpoint, you'll see:

```
data: {"type":"STREAM_START","timestamp":1234567890}
data: {"type":"TOKEN_COUNT","tokens":150,"model":"gpt-4"}
data: {"type":"FORMAT_CONVERTED","from":"json","to":"toon"}
data: {"type":"STREAM_END","timestamp":1234567891}
```

## Troubleshooting

### Streaming Not Working

**Problem**: No data streaming from endpoint.

**Solution**:
- Check server is running: `curl http://localhost:3000/health`
- Verify file exists: `ls data.json`
- Check file format: Ensure file is valid JSON

### Token Counting Errors

**Problem**: Token counting fails.

**Solution**:
- Verify model name: Use `gpt-4`, `gpt-3.5-turbo`, `claude-3-opus`, etc.
- Check data format: Ensure data is valid JSON

### Format Conversion Errors

**Problem**: Format conversion fails.

**Solution**:
- Verify source format: Use `json`, `toon`, `csv`, or `yaml`
- Check data structure: Ensure data matches format requirements

## Next Steps

- Try different data formats (JSON, TOON, CSV, YAML)
- Experiment with different LLM models for token counting
- Integrate with your own agent workflows
- Check out the [TOON Format Guide](../../docs/toon-format.md) for more details
- Explore the [Token Optimization Guide](../../docs/token-optimization.md) for optimization strategies

