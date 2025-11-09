# Frontend Components

Toon Agent Bridge provides React components for visualizing agent state and events.

## Installation

```bash
npm install @programsmagic/toon-frontend
```

## AgentVisualizer

The main component for visualizing agent events.

### Basic Usage

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

### Props

- `url` (string, required): URL for SSE or WebSocket connection
- `protocol` ('sse' | 'websocket', default: 'sse'): Connection protocol
- `autoConnect` (boolean, default: true): Automatically connect on mount
- `showTimeline` (boolean, default: true): Show event timeline
- `showFlowDiagram` (boolean, default: false): Show flow diagram
- `flows` (array, optional): Flow definitions for diagram
- `onEvent` (function, optional): Callback for each event
- `onError` (function, optional): Error callback
- `onConnect` (function, optional): Connection callback
- `onDisconnect` (function, optional): Disconnection callback

## useAgentStream Hook

Custom hook for connecting to agent event streams.

```tsx
import { useAgentStream } from '@programsmagic/toon-frontend';

function MyComponent() {
  const { events, isConnected, connect, disconnect } = useAgentStream({
    url: 'http://localhost:3000/events',
    protocol: 'sse',
    onEvent: (event) => {
      console.log('Event received:', event);
    },
  });

  return (
    <div>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
      <div>Events: {events.length}</div>
    </div>
  );
}
```

## EventTimeline

Component for displaying a timeline of events.

```tsx
import { EventTimeline } from '@programsmagic/toon-frontend';

<EventTimeline
  events={events}
  onEventClick={(event) => console.log(event)}
  maxEvents={100}
/>
```

## ActionCard

Component for displaying individual action events.

```tsx
import { ActionCard } from '@programsmagic/toon-frontend';

<ActionCard
  event={event}
  index={0}
  onClick={(event) => console.log(event)}
/>
```

## FlowDiagram

Component for visualizing agent flows.

```tsx
import { FlowDiagram } from '@programsmagic/toon-frontend';

const flows = [
  {
    id: 'flow1',
    name: 'My Flow',
    steps: [
      { actionId: 'action1' },
      { actionId: 'action2' },
    ],
  },
];

<FlowDiagram events={events} flows={flows} />
```

## Styling

The package includes a default "toon" theme with animated, colorful styling. Import it:

```tsx
import '@programsmagic/toon-frontend/styles';
```

### Customization

You can override CSS variables:

```css
:root {
  --toon-primary: #your-color;
  --toon-secondary: #your-color;
  --toon-bg: #your-color;
  /* ... */
}
```

## Event Types

Events follow the CopilotKit AG-UI protocol:

- `TEXT_MESSAGE_CONTENT`: Text messages
- `TOOL_CALL_START`: Tool call started
- `TOOL_CALL_END`: Tool call completed
- `ACTION_START`: Action started
- `ACTION_END`: Action completed
- `FLOW_START`: Flow started
- `FLOW_END`: Flow completed
- `STATE_UPDATE`: State updated
- `ERROR`: Error occurred
- `HEARTBEAT`: Keep-alive heartbeat

