# Agents.json Event Example

This example demonstrates how to use Toon Agent Bridge with an agents.json schema for developer events and AI agent competitions.

## Prerequisites

- Node.js 18+ installed
- pnpm installed (or npm/yarn)

## Setup

1. Install dependencies:

```bash
cd examples/agents-json-event
pnpm install
```

2. Start the server:

```bash
pnpm start
```

The server will start on `http://localhost:3000`.

## Features

This example includes:

- **Agent Registration**: Register agents for competitions
- **Task Submission**: Submit task results from agents
- **Flow-based Orchestration**: Define workflows with flows
- **Real-time Event Streaming**: Watch events stream in real-time

## API Endpoints

- `POST /agents` - Register a new agent
- `GET /agents` - Get all registered agents
- `POST /tasks` - Submit a task result
- `GET /events` - SSE event stream
- `GET /ws` - WebSocket connection
- `GET /health` - Health check
- `GET /schema` - Schema information

## Testing the API

### Register an Agent

```bash
curl -X POST http://localhost:3000/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Agent",
    "team": "Team Alpha",
    "capabilities": ["nlp", "vision"]
  }'
```

### Get All Agents

```bash
curl http://localhost:3000/agents
```

### Submit a Task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent-123",
    "taskId": "task-456",
    "result": {
      "score": 95,
      "completed": true
    }
  }'
```

## Frontend Integration

Use the React components to visualize agent workflows:

```tsx
import { AgentVisualizer } from '@toon/frontend';
import '@toon/frontend/styles';

const flows = [
  {
    id: "agentRegistrationFlow",
    name: "Agent Registration Flow",
    steps: [
      { actionId: "registerAgent" },
      { actionId: "validateAgent" }
    ]
  }
];

function App() {
  return (
    <AgentVisualizer
      url="http://localhost:3000/events"
      protocol="sse"
      showFlowDiagram={true}
      flows={flows}
    />
  );
}
```

## Understanding Flows

The `agents.json` file defines flows that orchestrate multiple actions:

```json
{
  "flows": [
    {
      "id": "agentRegistrationFlow",
      "name": "Agent Registration Flow",
      "steps": [
        {
          "actionId": "registerAgent",
          "onSuccess": ["validateAgent"],
          "onError": ["notifyError"]
        }
      ]
    }
  ]
}
```

This allows agents to chain actions together automatically.

## Next Steps

- Modify the `agents.json` file to add more actions and flows
- Explore the flow visualization in the frontend
- Check out the [LangGraph integration example](../langgraph-integration/README.md) for AI framework integration
