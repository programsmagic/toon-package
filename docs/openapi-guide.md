# OpenAPI Guide

Toon Agent Bridge supports OpenAPI 3.0 schemas, automatically converting them into agent-ready workflows.

## Supported Features

- All HTTP methods (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
- Path parameters
- Query parameters
- Request bodies
- Response schemas
- Tags and descriptions
- Multiple servers

## Example

### OpenAPI Schema

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "My API",
    "version": "1.0.0"
  },
  "paths": {
    "/users": {
      "get": {
        "operationId": "getUsers",
        "summary": "Get all users",
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    }
  }
}
```

### Using the Schema

```typescript
import { createServer } from '@programsmagic/toon-backend-node';

const server = await createServer({
  schemaSource: './openapi.json',
  port: 3000,
});

await server.start();
```

The server will automatically:
- Create REST endpoints for all paths
- Stream events for all API calls
- Provide SSE and WebSocket connections

## Event Streaming

All API calls are automatically streamed as events:

```typescript
// Action start event
{
  type: "ACTION_START",
  actionId: "getUsers_1234567890",
  actionName: "Get all users",
  endpoint: "/users",
  method: "GET"
}

// Action end event
{
  type: "ACTION_END",
  actionId: "getUsers_1234567890",
  response: {...},
  statusCode: 200,
  success: true
}
```

## Frontend Integration

```tsx
<AgentVisualizer
  url="http://localhost:3000/events"
  protocol="sse"
/>
```

## Advanced Configuration

### Custom Base URL

If your OpenAPI schema includes servers, the base URL will be used automatically:

```json
{
  "servers": [
    {
      "url": "https://api.example.com"
    }
  ]
}
```

### Authentication

```typescript
const server = await createServer({
  schemaSource: './openapi.json',
  auth: {
    type: 'api-key',
    apiKeyHeader: 'x-api-key',
    apiKeyValue: 'your-api-key',
  },
});
```

