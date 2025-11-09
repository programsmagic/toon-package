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

## Complete Integration Example

### server.py

```python
from crewai import Crew, Agent, Task
from toon_backend import create_server, EventEmitter
from toon_backend.event_emitter import EventType, AgentEvent
import time

# Create your CrewAI crew
crew = Crew(
    agents=[
        Agent(
            role='Researcher',
            goal='Research topics',
            backstory='You are a researcher...'
        ),
        Agent(
            role='Writer',
            goal='Write content',
            backstory='You are a writer...'
        )
    ],
    tasks=[
        Task(
            description='Research topic X',
            agent=crew.agents[0]
        ),
        Task(
            description='Write article about X',
            agent=crew.agents[1]
        )
    ]
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

def on_task_complete(task, result):
    event_emitter.emit(AgentEvent(
        event_type=EventType.ACTION_END,
        event_id=f"task_{task.id}",
        timestamp=int(time.time() * 1000),
        response=result,
        success=True
    ))

# Convert CrewAI to agents.json format
# (Implementation details depend on CrewAI API)

# Create server
server = await create_server({
    'schema_source': './agents.json',
    'port': 8000,
    'cors': True,
})

await server.start()
```

## Frontend Integration

Use the React components to visualize crew execution:

```tsx
import { AgentVisualizer } from '@programsmagic/toon-frontend';
import '@programsmagic/toon-frontend/styles';

function App() {
  return (
    <AgentVisualizer
      url="http://localhost:8000/events"
      protocol="websocket"
      showTimeline={true}
      showFlowDiagram={true}
    />
  );
}
```

## Expected Output

When CrewAI tasks execute, you'll see events like:

```json
{
  "type": "ACTION_START",
  "id": "task_1234567890",
  "timestamp": 1234567890,
  "actionName": "Research topic X",
  "endpoint": "/tasks",
  "method": "POST"
}
```

## Troubleshooting

### Tasks Not Executing

**Problem**: Tasks not appearing in frontend.

**Solution**:
- Check event emitter: Ensure events are being emitted
- Verify server is running: `curl http://localhost:8000/health`
- Check WebSocket endpoint: Verify WebSocket connection

### Integration Errors

**Problem**: Integration with CrewAI fails.

**Solution**:
- Check CrewAI version: Ensure compatible version
- Verify callbacks: Ensure callbacks are properly registered
- Check error messages: Look for specific error details

## Next Steps

- Explore CrewAI agents and tasks
- Integrate with your own CrewAI applications
- Check out the [Agent Integration Guide](../../docs/agent-integration.md) for more details
- Explore the [Frontend Components Guide](../../docs/frontend-components.md) for visualization options

