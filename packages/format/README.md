# @toon/format

TOON format parser/encoder with TOON+ extensions for LLM token efficiency.

## Installation

```bash
npm install @toon/format
# or
pnpm add @toon/format
# or
yarn add @toon/format
```

## Usage

### Encode JSON to TOON

```typescript
import { encodeToon } from '@toon/format';

const json = {
  user: {
    id: 123,
    name: 'Ada',
    tags: ['reading', 'gaming'],
    active: true
  }
};

const toon = encodeToon(json);
console.log(toon);
```

### Parse TOON to JSON

```typescript
import { parseToon } from '@toon/format';

const toon = `user id 123 name Ada tags [reading gaming] active true`;

const result = parseToon(toon);
console.log(result.data);
```

### TOON+ Extensions

```typescript
import { encodeToon } from '@toon/format';

const toon = encodeToon(json, {
  toonPlus: true,
  includeIndex: true,
  includeMetadata: true,
  includeComments: true
});
```

### Ultra-Minimization Mode

```typescript
const toon = encodeToon(json, {
  minimize: true // Strip all whitespace for pure model use
});
```

## API Reference

### `encodeToon(data, options?)`

Encode JSON to TOON format.

**Options:**
- `minimize` (boolean): Strip all whitespace
- `toonPlus` (boolean): Include TOON+ extensions
- `includeIndex` (boolean): Include structural index
- `includeMetadata` (boolean): Include metadata
- `includeComments` (boolean): Include field comments
- `delimiter` (string): Custom delimiter (default: space)
- `useLengthMarkers` (boolean): Use length markers instead of delimiters

### `parseToon(toon, options?)`

Parse TOON format to JSON.

**Options:**
- `delimiter` (string): Expected delimiter
- `useLengthMarkers` (boolean): Use length markers
- `validateIndex` (boolean): Validate structural index

## License

MIT

