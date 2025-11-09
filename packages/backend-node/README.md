# @programsmagic/toon-backend-node

Node.js/TypeScript backend adapter for Toon Agent Bridge with Fastify, SSE, and WebSocket support.

## Installation

```bash
npm install @programsmagic/toon-backend-node
# or
pnpm add @programsmagic/toon-backend-node
# or
yarn add @programsmagic/toon-backend-node
```

## Quick Start

```typescript
import { createServer } from '@programsmagic/toon-backend-node';

const server = await createServer({
  port: 3000,
  schemaSource: './openapi.json',
  cors: true,
});

await server.start();
```

## CLI Usage

```bash
npx @programsmagic/toon-backend-node --schema ./openapi.json --port 3000
```

Or install globally:

```bash
npm install -g @programsmagic/toon-backend-node
toon-bridge --schema ./openapi.json --port 3000
```

## API

### createServer(options)

Create a Fastify server from a schema.

**Options:**
- `port` (number, default: 3000): Server port
- `host` (string, default: '0.0.0.0'): Server host
- `schemaSource` (string, required): Path to OpenAPI or agents.json file
- `cors` (boolean | object, default: true): CORS configuration
- `auth` (AuthConfig, optional): Authentication configuration

**Returns:** Server instance with `fastify`, `schema`, `eventEmitter`, and `start()` method

## Endpoints

- `GET /health` - Health check
- `GET /schema` - Schema information
- `GET /events` - SSE event stream
- `GET /ws` - WebSocket connection
- `*` - Auto-generated routes from schema

## Examples

See the [examples directory](https://github.com/programsmagic/toon-package/tree/main/examples) for complete examples.

## Documentation

See the [full documentation](https://programsmagic.github.io/toon-package/docs/getting-started).

## License

MIT

