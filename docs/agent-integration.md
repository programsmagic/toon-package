# Agent Integration Guide

Complete guide to integrating TOON format with agent frameworks.

## LangGraph Integration

```python
from langgraph.graph import StateGraph
from toon_backend import create_server
from toon_backend.event_emitter import EventType, AgentEvent

# Create your LangGraph workflow
workflow = StateGraph(...)

# Create event emitter
event_emitter = EventEmitter()

# Hook into LangGraph callbacks
def on_state_change(state):
    event_emitter.emit(AgentEvent(
        event_type=EventType.STATE_UPDATE,
        event_id=f"state_{time.time()}",
        timestamp=int(time.time() * 1000),
        state=state
    ))
```

## CrewAI Integration

```python
from crewai import Crew, Agent, Task
from toon_backend import create_server, EventEmitter

# Create your CrewAI crew
crew = Crew(
    agents=[...],
    tasks=[...],
)

# Create event emitter
event_emitter = EventEmitter()

# Hook into CrewAI callbacks
def on_task_start(task):
    event_emitter.emit(AgentEvent(
        event_type=EventType.ACTION_START,
        event_id=f"task_{task.id}",
        timestamp=int(time.time() * 1000),
        actionName=task.description,
        endpoint="/tasks",
        method="POST"
    ))
```

## CopilotKit Integration

```typescript
import { useCopilotAction } from '@copilotkit/react-core';
import { encodeToon } from '@toon/format';

useCopilotAction({
  name: 'processData',
  description: 'Process data in TOON format',
  handler: async ({ data }) => {
    const toon = encodeToon(data, { minimize: true });
    // Use TOON format for LLM
  },
});
```

## Frontend Integration

```tsx
import { FormatViewer, StreamViewer } from '@toon/frontend';
import '@toon/viewer/styles';

function App() {
  return (
    <>
      <FormatViewer
        initialContent={data}
        showTokenCounter={true}
        llmMode={true}
      />
      <StreamViewer
        url="http://localhost:3000/stream/toon?file=data.json"
        protocol="sse"
      />
    </>
  );
}
```

## Backend Integration

```typescript
import { createServer } from '@toon/backend-node';

const server = await createServer({
  port: 3000,
  schemaSource: './schema.json',
  cors: true,
});

// TOON streaming endpoint available at:
// GET /stream/toon?file=data.json&format=json&model=gpt-4

// Format conversion endpoint:
// POST /convert
// Body: { content: "...", from: "json", to: "toon" }

// Optimization endpoint:
// POST /optimize
// Body: { content: "...", model: "gpt-4" }

// Token counting endpoint:
// POST /tokens
// Body: { content: "...", model: "gpt-4" }

await server.start();
```

## Best Practices

1. **Use TOON for agent data**: Reduce token usage by 30-60%
2. **Stream large datasets**: Use streaming endpoints for large files
3. **Monitor token usage**: Track tokens and costs
4. **Optimize before sending**: Always optimize data before LLM calls
5. **Use format selection**: Let the system choose optimal format

## License

MIT

