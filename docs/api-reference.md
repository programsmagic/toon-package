# API Reference

Complete API reference for Toon Agent Bridge packages.

## @programsmagic/toon-core

### parseOpenAPISchema(source: string): Promise<NormalizedSchema>

Parse an OpenAPI 3.0 schema from file or URL.

```typescript
import { parseOpenAPISchema } from '@programsmagic/toon-core';

const schema = await parseOpenAPISchema('./openapi.json');
```

### parseAgentsJsonSchema(source: string): Promise<NormalizedSchema>

Parse an agents.json schema from file or URL.

```typescript
import { parseAgentsJsonSchema } from '@programsmagic/toon-core';

const schema = await parseAgentsJsonSchema('./agents.json');
```

### Types

- `AgentSchema`: Normalized agent schema
- `AgentAction`: Individual action definition
- `AgentFlow`: Flow definition
- `AgentEvent`: Event type
- `EventType`: Event type enum

## @programsmagic/toon-backend-node

### createServer(options: ServerOptions): Promise<Server>

Create a Fastify server from a schema.

```typescript
import { createServer } from '@programsmagic/toon-backend-node';

const server = await createServer({
  port: 3000,
  schemaSource: './schema.json',
  cors: true,
});

await server.start();
```

### ServerOptions

- `port` (number, default: 3000): Server port
- `host` (string, default: '0.0.0.0'): Server host
- `schemaSource` (string, required): Path to schema file
- `auth` (AuthConfig, optional): Authentication configuration
- `cors` (boolean | object, default: true): CORS configuration

### Endpoints

- `GET /health`: Health check
- `GET /schema`: Schema information
- `GET /events`: SSE event stream
- `GET /ws`: WebSocket connection
- `*`: Auto-generated routes from schema

## @programsmagic/toon-backend-python

### create_server(options: ServerOptions): Promise<dict>

Create a FastAPI server from a schema.

```python
from toon_backend import create_server, ServerOptions

options = ServerOptions(
    schema_source="./schema.json",
    port=8000,
    cors=True,
)

server = await create_server(options)
```

### ServerOptions

- `schema_source` (str, required): Path to schema file
- `port` (int, default: 8000): Server port
- `host` (str, default: '0.0.0.0'): Server host
- `cors` (bool, default: True): Enable CORS
- `cors_origins` (list, optional): CORS allowed origins

## @programsmagic/toon-frontend

### AgentVisualizer

Main visualization component.

```tsx
<AgentVisualizer
  url="http://localhost:3000/events"
  protocol="sse"
  autoConnect={true}
/>
```

### useAgentStream

React hook for event streaming.

```tsx
const { events, isConnected, connect, disconnect } = useAgentStream({
  url: 'http://localhost:3000/events',
  protocol: 'sse',
});
```

### EventTimeline

Timeline component for events.

```tsx
<EventTimeline events={events} />
```

### ActionCard

Card component for individual actions.

```tsx
<ActionCard event={event} />
```

### FlowDiagram

Flow visualization component.

```tsx
<FlowDiagram events={events} flows={flows} />
```

## Event Types

All events follow this structure:

```typescript
interface AgentEvent {
  type: EventType;
  id: string;
  timestamp: number;
  // ... event-specific fields
}
```

### EventType Enum

- `TEXT_MESSAGE_CONTENT`
- `TOOL_CALL_START`
- `TOOL_CALL_END`
- `ACTION_START`
- `ACTION_END`
- `FLOW_START`
- `FLOW_END`
- `STATE_UPDATE`
- `ERROR`
- `HEARTBEAT`

