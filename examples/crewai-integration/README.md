# CrewAI Integration Example

This example shows how to integrate Toon Agent Bridge with CrewAI.

## Overview

CrewAI is a framework for orchestrating role-playing, autonomous AI agents. This integration allows you to:

1. Export CrewAI crews as agents.json
2. Stream crew execution events
3. Visualize agent collaboration in real-time

## Setup

```bash
cd examples/crewai-integration
pip install -r requirements.txt
python server.py
```

## Integration Pattern

```python
from crewai import Crew, Agent, Task
from toon_backend import create_server, EventEmitter
from toon_backend.event_emitter import EventType, AgentEvent

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

# Convert CrewAI to agents.json format
# (Implementation details depend on CrewAI API)
```

## Frontend

Use the React components to visualize crew execution:

```tsx
<AgentVisualizer
  url="http://localhost:8000/events"
  protocol="websocket"
  showTimeline={true}
  showFlowDiagram={true}
/>
```

