# @toon/frontend

React components for agent visualization with animated toon styling.

## Installation

```bash
npm install @toon/frontend
# or
pnpm add @toon/frontend
# or
yarn add @toon/frontend
```

## Quick Start

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

## Components

### AgentVisualizer

Main visualization component for agent events.

```tsx
<AgentVisualizer
  url="http://localhost:3000/events"
  protocol="sse"
  autoConnect={true}
  showTimeline={true}
  showFlowDiagram={false}
/>
```

### useAgentStream Hook

React hook for connecting to agent event streams.

```tsx
import { useAgentStream } from '@toon/frontend';

function MyComponent() {
  const { events, isConnected, connect, disconnect } = useAgentStream({
    url: 'http://localhost:3000/events',
    protocol: 'sse',
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

### EventTimeline

Component for displaying a timeline of events.

```tsx
import { EventTimeline } from '@toon/frontend';

<EventTimeline events={events} maxEvents={100} />
```

### ActionCard

Component for displaying individual action events.

```tsx
import { ActionCard } from '@toon/frontend';

<ActionCard event={event} index={0} />
```

### FlowDiagram

Component for visualizing agent flows.

```tsx
import { FlowDiagram } from '@toon/frontend';

<FlowDiagram events={events} flows={flows} />
```

## Styling

Import the default "toon" theme:

```tsx
import '@toon/frontend/styles';
```

Or customize CSS variables:

```css
:root {
  --toon-primary: #your-color;
  --toon-secondary: #your-color;
  /* ... */
}
```

## Examples

See the [examples directory](https://github.com/yourusername/toon-package/tree/main/examples) for complete examples.

## Documentation

See the [full documentation](https://yourusername.github.io/toon-package/docs/frontend-components).

## License

MIT

