# LangGraph Integration Example

This example shows how to integrate Toon Agent Bridge with LangGraph.

## Overview

LangGraph is a library for building stateful, multi-actor applications with LLMs. This integration allows you to:

1. Export LangGraph workflows as agents.json
2. Stream LangGraph state changes as events
3. Visualize LangGraph execution in real-time

## Setup

```bash
cd examples/langgraph-integration
pip install -r requirements.txt
python server.py
```

## Integration Pattern

```python
from langgraph.graph import StateGraph
from toon_backend import create_server, EventEmitter
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

# Convert LangGraph to agents.json format
# (Implementation details depend on LangGraph API)
```

## Complete Integration Example

### server.py

```python
from langgraph.graph import StateGraph
from toon_backend import create_server, EventEmitter
from toon_backend.event_emitter import EventType, AgentEvent
import time

# Create your LangGraph workflow
workflow = StateGraph(...)

# Create event emitter
event_emitter = EventEmitter()

# Hook into LangGraph callbacks
def on_state_change(state):
    event_emitter.emit(AgentEvent(
        event_type=EventType.STATE_UPDATE,
        event_id=f"state_{int(time.time() * 1000)}",
        timestamp=int(time.time() * 1000),
        state=state
    ))

# Convert LangGraph to agents.json format
# (Implementation details depend on LangGraph API)

# Create server
server = await create_server({
    'schema_source': './agents.json',
    'port': 8000,
    'cors': True,
})

await server.start()
```

## Frontend Integration

Use the React components to visualize LangGraph execution:

```tsx
import { AgentVisualizer } from '@programsmagic/toon-frontend';
import '@programsmagic/toon-frontend/styles';

function App() {
  return (
    <AgentVisualizer
      url="http://localhost:8000/events"
      protocol="sse"
      showTimeline={true}
      showFlowDiagram={true}
    />
  );
}
```

## Expected Output

When LangGraph state changes, you'll see events like:

```json
{
  "type": "STATE_UPDATE",
  "id": "state_1234567890",
  "timestamp": 1234567890,
  "state": {
    "nodes": [...],
    "edges": [...]
  }
}
```

## Troubleshooting

### State Not Updating

**Problem**: State changes not appearing in frontend.

**Solution**:
- Check event emitter: Ensure events are being emitted
- Verify server is running: `curl http://localhost:8000/health`
- Check SSE endpoint: `curl http://localhost:8000/events`

### Integration Errors

**Problem**: Integration with LangGraph fails.

**Solution**:
- Check LangGraph version: Ensure compatible version
- Verify callbacks: Ensure callbacks are properly registered
- Check error messages: Look for specific error details

## Next Steps

- Explore LangGraph workflows and state management
- Integrate with your own LangGraph applications
- Check out the [Agent Integration Guide](../../docs/agent-integration.md) for more details
- Explore the [Frontend Components Guide](../../docs/frontend-components.md) for visualization options

