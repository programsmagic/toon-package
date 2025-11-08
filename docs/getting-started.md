# Getting Started

Welcome to Toon Agent Bridge! This guide will help you get started with converting your OpenAPI or agents.json schemas into agent-ready workflows.

## Installation

### Node.js/TypeScript

```bash
npm install @toon/core @toon/backend-node @toon/frontend
# or
pnpm add @toon/core @toon/backend-node @toon/frontend
```

### Python

```bash
pip install toon-backend-python
```

## Quick Start

### 1. Create a Server from OpenAPI Schema

```typescript
import { createServer } from '@toon/backend-node';

const server = await createServer({
  port: 3000,
  schemaSource: './openapi.json',
  cors: true,
});

await server.start();
```

### 2. Use React Components for Visualization

```tsx
import { AgentVisualizer } from '@toon/frontend';
import '@toon/frontend/styles';

function App() {
  return (
    <AgentVisualizer
      url="http://localhost:3000/events"
      protocol="sse"
      autoConnect={true}
    />
  );
}
```

### 3. Python Backend

```python
from toon_backend import create_server, ServerOptions

options = ServerOptions(
    schema_source="./schema.json",
    port=8000,
    cors=True,
)

server = await create_server(options)
# Use with uvicorn or your ASGI server
```

## Next Steps

- [OpenAPI Guide](./openapi-guide.md) - Learn how to use OpenAPI schemas
- [agents.json Guide](./agents-json-guide.md) - Learn about agents.json format
- [Frontend Components](./frontend-components.md) - Explore React components
- [Developer Events](./developer-events.md) - Set up agent events in 5 minutes

