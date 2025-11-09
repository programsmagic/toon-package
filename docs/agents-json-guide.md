# agents.json Guide

agents.json is an extension of OpenAPI that adds agent-specific features like flows and links.

## Format

```json
{
  "version": "1.0.0",
  "name": "My Agent API",
  "description": "API for agent interactions",
  "baseUrl": "http://localhost:3000",
  "actions": [
    {
      "id": "action1",
      "name": "Action Name",
      "description": "Action description",
      "endpoint": "/action",
      "method": "POST",
      "parameters": [
        {
          "name": "param1",
          "type": "string",
          "required": true
        }
      ]
    }
  ],
  "flows": [
    {
      "id": "flow1",
      "name": "Flow Name",
      "description": "Flow description",
      "steps": [
        {
          "actionId": "action1",
          "onSuccess": ["action2"],
          "onError": ["errorHandler"]
        }
      ],
      "triggers": ["event.triggered"]
    }
  ],
  "links": [
    {
      "from": "action1",
      "to": "action2",
      "relation": "creates",
      "description": "Action1 creates resources for Action2"
    }
  ]
}
```

## Actions

Actions define individual API endpoints that agents can call.

### Required Fields

- `id`: Unique identifier
- `name`: Human-readable name
- `endpoint`: API endpoint path
- `method`: HTTP method

### Optional Fields

- `description`: Action description
- `parameters`: Array of parameters
- `requestBody`: Request body schema
- `responses`: Response schemas
- `tags`: Tags for categorization

## Flows

Flows define sequences of actions that can be executed together.

### Flow Steps

Each step in a flow can specify:
- `actionId`: The action to execute
- `condition`: Optional condition for execution
- `onSuccess`: Actions to execute on success
- `onError`: Actions to execute on error
- `parameters`: Parameters to pass to the action

### Triggers

Flows can be triggered by events:
- `triggers`: Array of event names that trigger the flow

## Links

Links define relationships between actions:
- `from`: Source action ID
- `to`: Target action ID
- `relation`: Type of relationship
- `description`: Link description

## Usage

```typescript
import { createServer } from '@programsmagic/toon-backend-node';

const server = await createServer({
  schemaSource: './agents.json',
  port: 3000,
});

await server.start();
```

## Flow Visualization

Use the FlowDiagram component to visualize flows:

```tsx
<AgentVisualizer
  url="http://localhost:3000/events"
  showFlowDiagram={true}
  flows={flows}
/>
```

## Best Practices

1. Use descriptive action IDs and names
2. Document all parameters and request bodies
3. Define clear flow steps with error handling
4. Use links to show action relationships
5. Host agents.json at `/.well-known/agents.json` for discoverability

