# Toon Agent Bridge

Universal bridge for converting OpenAPI 3.0 and agents.json schemas into agent-ready workflows with SSE/WebSocket event streaming and React visualization components. Plus TOON format support for LLM token efficiency with rich viewer/converter UI.

[![NPM Version](https://img.shields.io/npm/v/@programsmagic/toon-core)](https://www.npmjs.com/package/@programsmagic/toon-core)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Documentation](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://programsmagic.github.io/toon-package)

## Features

### Agent Bridge
- 🔄 **Zero-Config Agent Integration**: Point to your OpenAPI or agents.json file and go live
- 📡 **Real-time Event Streaming**: SSE and WebSocket support for live agent state updates
- 🎨 **Animated Visualizations**: Ready-made React components for interactive agent visualization
- 🔌 **Framework Compatible**: Works with LangGraph, CrewAI, CopilotKit, and more
- 🌐 **Multi-Language**: Node.js/TypeScript and Python backends available

### TOON Format Support
- 🎯 **TOON Format**: Token-efficient format for LLMs (30-60% token reduction)
- 🔄 **Multi-Format Converter**: JSON, TOON, CSV, YAML with smart format selection
- 📊 **Rich Viewer UI**: Split-pane viewer with real-time conversion and token counting
- 🧮 **Token Optimization**: Advanced token counting and optimization for all major LLMs
- 🚀 **CLI Tool**: Command-line format conversion and token optimization
- 📦 **Modular Packages**: Clean, modular packages for maximum flexibility

## Installation

### Node.js/TypeScript

```bash
npm install @programsmagic/toon-core @programsmagic/toon-backend-node @programsmagic/toon-frontend
# or
pnpm add @programsmagic/toon-core @programsmagic/toon-backend-node @programsmagic/toon-frontend
# or
yarn add @programsmagic/toon-core @programsmagic/toon-backend-node @programsmagic/toon-frontend
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

## Packages

### Agent Bridge Packages
- **[@programsmagic/toon-core](./packages/core)** - Core types, schema parsers, and normalization logic
- **[@programsmagic/toon-backend-node](./packages/backend-node)** - Node.js/TypeScript backend adapter
- **[@programsmagic/toon-backend-python](./packages/backend-python)** - Python backend adapter
- **[@programsmagic/toon-frontend](./packages/frontend)** - React components for agent visualization

### TOON Format Packages
- **[@programsmagic/toon-format](./packages/format)** - TOON format parser/encoder with TOON+ extensions
- **[@programsmagic/toon-converter](./packages/converter)** - Multi-format converter (JSON/TOON/CSV/YAML)
- **[@programsmagic/toon-tokenizer](./packages/tokenizer)** - Token counting and estimation utilities
- **[@programsmagic/toon-viewer](./packages/viewer)** - Rich React viewer component with split-pane UI
- **[@programsmagic/toon-cli](./packages/cli)** - Command-line tool for format conversion and optimization

## Examples

Check out the [examples directory](./examples) for complete working examples:

### Agent Bridge Examples
- [Basic OpenAPI Example](./examples/basic-openapi) - Simple OpenAPI to agent demo
- [Agents.json Event Example](./examples/agents-json-event) - Developer event workflow demo
- [LangGraph Integration](./examples/langgraph-integration) - LangGraph compatibility example
- [CrewAI Integration](./examples/crewai-integration) - CrewAI compatibility example

### TOON Format Examples
- [TOON Viewer](./examples/toon-viewer) - Standalone viewer app
- [TOON Converter](./examples/toon-converter) - Format conversion demo
- [Token Optimizer](./examples/token-optimizer) - Token optimization demo
- [Agent Streaming](./examples/agent-streaming) - Agent streaming with TOON format
- [Batch Processor](./examples/batch-processor) - Batch file processing example

## Documentation

### Agent Bridge
- [Getting Started](./docs/getting-started.md)
- [OpenAPI Guide](./docs/openapi-guide.md)
- [agents.json Guide](./docs/agents-json-guide.md)
- [Frontend Components](./docs/frontend-components.md)
- [Developer Events](./docs/developer-events.md) - Set up agent events in 5 minutes
- [API Reference](./docs/api-reference.md)

### TOON Format
- [TOON Format Guide](./docs/toon-format.md) - Complete TOON format specification
- [Viewer UI Guide](./docs/viewer-guide.md) - Using the format viewer components
- [Token Optimization Guide](./docs/token-optimization.md) - Token counting and optimization
- [CLI Usage](./docs/cli-usage.md) - Command-line tool usage
- [Agent Integration](./docs/agent-integration.md) - Integrating with agent frameworks

**Full documentation**: [https://programsmagic.github.io/toon-package](https://programsmagic.github.io/toon-package)

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development mode
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- [GitHub Repository](https://github.com/programsmagic/toon-package)
- [NPM Packages](https://www.npmjs.com/~programsmagic?tab=packages)
- [Documentation](https://programsmagic.github.io/toon-package)
- [Issues](https://github.com/programsmagic/toon-package/issues)
