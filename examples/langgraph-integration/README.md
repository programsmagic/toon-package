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

## Frontend

Use the React components to visualize LangGraph execution:

```tsx
<AgentVisualizer
  url="http://localhost:8000/events"
  protocol="sse"
  showTimeline={true}
/>
```

