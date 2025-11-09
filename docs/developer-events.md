# Developer Events - 5 Minute Setup

Set up a complete agent event system in 5 minutes using Toon Agent Bridge.

## Step 1: Create agents.json

Create a file `agents.json`:

```json
{
  "version": "1.0.0",
  "name": "Developer Event API",
  "baseUrl": "http://localhost:3000",
  "actions": [
    {
      "id": "registerAgent",
      "name": "Register Agent",
      "endpoint": "/agents",
      "method": "POST",
      "parameters": [
        {
          "name": "name",
          "type": "string",
          "required": true
        }
      ]
    },
    {
      "id": "getAgents",
      "name": "Get All Agents",
      "endpoint": "/agents",
      "method": "GET"
    }
  ]
}
```

## Step 2: Start the Server

### Node.js

```bash
npm install @programsmagic/toon-backend-node
npx toon-bridge --schema ./agents.json --port 3000
```

### Python

```bash
pip install toon-backend-python
toon-bridge --schema ./agents.json --port 8000
```

## Step 3: Add Frontend Visualization

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

## Step 4: Test It

1. Open your frontend app
2. Make API calls to your endpoints
3. Watch events stream in real-time!

## Advanced: Add Flows

Add workflow definitions to your agents.json:

```json
{
  "flows": [
    {
      "id": "registrationFlow",
      "name": "Agent Registration",
      "steps": [
        {
          "actionId": "registerAgent",
          "onSuccess": ["validateAgent"]
        }
      ]
    }
  ]
}
```

Then visualize flows:

```tsx
<AgentVisualizer
  url="http://localhost:3000/events"
  showFlowDiagram={true}
  flows={flows}
/>
```

## Tips

- Host agents.json at `/.well-known/agents.json` for discoverability
- Use descriptive action names and descriptions
- Define clear flows for complex workflows
- Use the event timeline to debug agent interactions

## Next Steps

- [OpenAPI Guide](./openapi-guide.md)
- [agents.json Guide](./agents-json-guide.md)
- [Frontend Components](./frontend-components.md)

