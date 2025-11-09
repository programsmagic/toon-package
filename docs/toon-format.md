# TOON Format Guide

Complete guide to the TOON (Token-Oriented Object Notation) format.

## What is TOON?

TOON is a compact, human-readable serialization format designed to transmit structured data to Large Language Models (LLMs) with significantly reduced token usage. By eliminating redundant JSON syntax and optimizing data representation, TOON can reduce token usage by 30-60%.

## Basic Syntax

### Objects

**JSON:**
```json
{
  "user": {
    "id": 123,
    "name": "Ada"
  }
}
```

**TOON:**
```
user id 123 name Ada
```

### Arrays

**JSON:**
```json
{
  "tags": ["reading", "gaming", "coding"]
}
```

**TOON:**
```
tags [reading gaming coding]
```

### Nested Structures

**JSON:**
```json
{
  "users": [
    {"id": 1, "name": "Alice"},
    {"id": 2, "name": "Bob"}
  ]
}
```

**TOON:**
```
users [
  id 1 name Alice
  id 2 name Bob
]
```

## TOON+ Extensions

### Structural Index

Add a structural index header for validation:

```toon
#toon+ {"index":"abc123","length":42}
user id 123 name Ada
```

### Metadata

Include metadata in the header:

```toon
#toon+ {"metadata":{"version":"1.0","encoded":"2025-01-01T00:00:00Z"}}
user id 123 name Ada
```

### Comments

Add field-level comments:

```toon
#toon+ {"comments":{"id":"User identifier","name":"User name"}}
user id 123 name Ada
```

## Ultra-Minimization Mode

Strip all whitespace for pure model use:

```typescript
import { encodeToon } from '@programsmagic/toon-format';

const toon = encodeToon(data, { minimize: true });
// Output: user id 123 name Ada tags [reading gaming]
```

## Usage Examples

### Encoding

```typescript
import { encodeToon } from '@programsmagic/toon-format';

const data = {
  user: {
    id: 123,
    name: 'Ada',
    tags: ['reading', 'gaming'],
    active: true
  }
};

const toon = encodeToon(data);
console.log(toon);
```

### Parsing

```typescript
import { parseToon } from '@programsmagic/toon-format';

const toon = `user id 123 name Ada tags [reading gaming] active true`;
const result = parseToon(toon);
console.log(result.data);
```

## Best Practices

1. Use TOON for tabular data (arrays of objects)
2. Use JSON for deeply nested, non-uniform data
3. Enable minimization for LLM prompts
4. Use TOON+ extensions for validation and metadata
5. Validate structural index in production

## Token Savings

TOON typically provides:
- **30-60% token reduction** vs JSON
- **Lower API costs** for LLM interactions
- **Faster processing** with smaller payloads

## License

MIT

