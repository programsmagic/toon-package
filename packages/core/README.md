# @programsmagic/toon-core

Core types, schema parsers, and normalization logic for Toon Agent Bridge.

## Installation

```bash
npm install @programsmagic/toon-core
# or
pnpm add @programsmagic/toon-core
# or
yarn add @programsmagic/toon-core
```

## Usage

### Parse OpenAPI Schema

```typescript
import { parseOpenAPISchema } from '@programsmagic/toon-core';

const schema = await parseOpenAPISchema('./openapi.json');
console.log(schema.schema.actions);
```

### Parse agents.json Schema

```typescript
import { parseAgentsJsonSchema } from '@programsmagic/toon-core';

const schema = await parseAgentsJsonSchema('./agents.json');
console.log(schema.schema.actions);
console.log(schema.schema.flows);
```

### Use Types

```typescript
import { AgentSchema, AgentAction, AgentEvent, EventType } from '@programsmagic/toon-core';

const action: AgentAction = {
  id: 'myAction',
  name: 'My Action',
  endpoint: '/action',
  method: 'POST',
  parameters: [],
};

const event: AgentEvent = {
  type: EventType.ACTION_START,
  id: 'event1',
  timestamp: Date.now(),
  actionId: 'action1',
  actionName: 'My Action',
  endpoint: '/action',
  method: 'POST',
};
```

## API Reference

See the [full API documentation](https://programsmagic.github.io/toon-package/docs/api-reference#tooncore).

## License

MIT

