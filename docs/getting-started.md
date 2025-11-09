# Getting Started

Welcome to Toon Agent Bridge! This guide will help you get started with converting your OpenAPI or agents.json schemas into agent-ready workflows.

## Installation

### Node.js/TypeScript

```bash
npm install @programsmagic/toon-core @programsmagic/toon-backend-node @programsmagic/toon-frontend
# or
pnpm add @programsmagic/toon-core @programsmagic/toon-backend-node @programsmagic/toon-frontend
```

### Python

```bash
pip install toon-backend-python
```

## Quick Start

### 1. Create a Server from OpenAPI Schema

```typescript
import { createServer } from '@programsmagic/toon-backend-node';

const server = await createServer({
  port: 3000,
  schemaSource: './openapi.json',
  cors: true,
});

await server.start();
```

### 2. Use React Components for Visualization

```tsx
import { AgentVisualizer } from '@programsmagic/toon-frontend';
import '@programsmagic/toon-frontend/styles';

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

## Common Use Cases

### Use Case 1: Quick API to Agent Bridge

Convert your existing OpenAPI schema into an agent-ready API:

```typescript
import { createServer } from '@programsmagic/toon-backend-node';

const server = await createServer({
  port: 3000,
  schemaSource: './openapi.json',
  cors: true,
});

await server.start();
console.log('Server running at http://localhost:3000');
```

### Use Case 2: Real-time Agent Visualization

Visualize agent events in real-time with React:

```tsx
import { AgentVisualizer } from '@programsmagic/toon-frontend';
import '@programsmagic/toon-frontend/styles';

function App() {
  return (
    <AgentVisualizer
      url="http://localhost:3000/events"
      protocol="sse"
      autoConnect={true}
      showTimeline={true}
      showFlowDiagram={true}
    />
  );
}
```

### Use Case 3: Token Optimization for LLMs

Optimize your data for LLM interactions:

```typescript
import { encodeToon } from '@programsmagic/toon-format';
import { countTokensInData } from '@programsmagic/toon-tokenizer';

const data = { users: [...] };
const toon = encodeToon(data, { minimize: true });
const tokens = countTokensInData(toon, 'gpt-4');
console.log(`Token count: ${tokens.tokens}`);
console.log(`Estimated cost: $${tokens.estimatedCost.total}`);
```

### Use Case 4: Format Conversion

Convert between JSON, TOON, CSV, and YAML:

```typescript
import { convert } from '@programsmagic/toon-converter';

const json = '{"user": {"id": 123, "name": "Ada"}}';
const toon = await convert(json, 'json', 'toon');
console.log(toon); // user id 123 name Ada
```

## Troubleshooting

### Server Won't Start

**Problem**: Server fails to start with port already in use error.

**Solution**: 
- Change the port: `port: 3001`
- Or kill the process using the port: `lsof -ti:3000 | xargs kill`

### Schema Not Found

**Problem**: Error "Schema file not found".

**Solution**:
- Use absolute path: `schemaSource: path.join(__dirname, './schema.json')`
- Or relative path from project root: `schemaSource: './schemas/openapi.json'`

### CORS Errors

**Problem**: CORS errors in browser console.

**Solution**:
- Enable CORS: `cors: true`
- Or configure specific origins: `cors: { origin: ['http://localhost:3000'] }`

### Events Not Streaming

**Problem**: Events not appearing in frontend.

**Solution**:
- Check server is running: `curl http://localhost:3000/health`
- Check SSE endpoint: `curl http://localhost:3000/events`
- Verify protocol: Use `protocol="sse"` or `protocol="websocket"`

## FAQ

### Q: What's the difference between OpenAPI and agents.json?

**A**: OpenAPI is a standard API specification format. agents.json is an extension that adds agent-specific features like flows and links. You can use either format with Toon Agent Bridge.

### Q: Can I use this with existing APIs?

**A**: Yes! Point to your existing OpenAPI schema and Toon Agent Bridge will automatically create agent-ready endpoints with event streaming.

### Q: Do I need to modify my existing API code?

**A**: No! Toon Agent Bridge works as a bridge layer. Your existing API code remains unchanged.

### Q: What LLM models are supported for token counting?

**A**: We support GPT-3.5, GPT-4, Claude 3, and more. See the [Token Optimization Guide](./token-optimization.md) for the full list.

### Q: Can I use this in production?

**A**: Yes! All packages are production-ready with proper error handling, TypeScript types, and comprehensive testing.

### Q: How do I contribute?

**A**: See our [Contributing Guide](../CONTRIBUTING.md) for details on how to contribute.

## Next Steps

- [OpenAPI Guide](./openapi-guide.md) - Learn how to use OpenAPI schemas
- [agents.json Guide](./agents-json-guide.md) - Learn about agents.json format
- [Frontend Components](./frontend-components.md) - Explore React components
- [Developer Events](./developer-events.md) - Set up agent events in 5 minutes
- [TOON Format Guide](./toon-format.md) - Learn about TOON format for token optimization
- [Token Optimization Guide](./token-optimization.md) - Optimize your data for LLMs

