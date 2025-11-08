# Basic OpenAPI Example

This example demonstrates how to use Toon Agent Bridge with a simple OpenAPI 3.0 schema.

## Prerequisites

- Node.js 18+ installed
- pnpm installed (or npm/yarn)

## Setup

1. Install dependencies:

```bash
cd examples/basic-openapi
pnpm install
```

2. Start the server:

```bash
pnpm start
```

The server will start on `http://localhost:3000`.

## Endpoints

Once the server is running, you can access:

- `GET /users` - Get all users
- `POST /users` - Create a new user
- `GET /users/{id}` - Get user by ID
- `GET /events` - SSE event stream
- `GET /ws` - WebSocket connection
- `GET /health` - Health check
- `GET /schema` - Schema information

## Testing the API

### Using curl

```bash
# Get all users
curl http://localhost:3000/users

# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Get user by ID
curl http://localhost:3000/users/1
```

### Using the Event Stream

Open `http://localhost:3000/events` in your browser or use curl:

```bash
curl http://localhost:3000/events
```

You'll see events streamed in real-time as you make API calls.

## Frontend Integration

You can use the React components from `@toon/frontend` to visualize the agent events:

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

## Next Steps

- Try modifying the `openapi.json` file to add more endpoints
- Explore the event stream to see how events are structured
- Check out the [agents.json example](../agents-json-event/README.md) for more advanced features
