# Token Optimization Guide

Complete guide to token optimization with TOON format.

## Why Optimize Tokens?

- **Lower API costs**: Fewer tokens = lower costs
- **Faster processing**: Smaller payloads = faster responses
- **Better performance**: More context in same token budget

## Token Counting

### Count Tokens in Text

```typescript
import { countTokensInText } from '@toon/tokenizer';

const result = countTokensInText('Hello, world!', 'gpt-4');
console.log(result.tokens);
console.log(result.estimatedCost);
```

### Count Tokens in Data

```typescript
import { countTokensInData } from '@toon/tokenizer';

const data = { user: { id: 123, name: 'Ada' } };
const result = countTokensInData(data, 'gpt-4');
console.log(result.tokens);
```

## Format Comparison

### Compare Formats

```typescript
import { compareAllFormats } from '@toon/converter';

const data = { users: [...] };
const comparison = compareAllFormats(data);

console.log(comparison.best); // Recommended format
console.log(comparison.savings); // Savings by format
```

## Optimization Strategies

### 1. Use TOON for Tabular Data

Arrays of objects are perfect for TOON:

```typescript
const data = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];
// TOON: 30-60% token reduction
```

### 2. Minimize Format

Use ultra-minimization for LLM prompts:

```typescript
const toon = encodeToon(data, { minimize: true });
// Strips all whitespace
```

### 3. Select Optimal Format

Let the system choose the best format:

```typescript
import { selectOptimalFormat } from '@toon/converter';

const selection = selectOptimalFormat(data);
// Returns recommended format with alternatives
```

## Per-Field Analysis

Analyze which fields consume the most tokens:

```typescript
import { analyzeTokensPerField } from '@toon/tokenizer';

const analysis = analyzeTokensPerField(data, 'gpt-4');
console.log(analysis.topFields); // Top N most expensive fields
```

## Best Practices

1. **Use TOON for arrays**: Arrays of objects save 30-60% tokens
2. **Minimize for prompts**: Strip whitespace for LLM use
3. **Compare formats**: Always compare before choosing
4. **Analyze fields**: Identify expensive fields
5. **Monitor costs**: Track token usage and costs

## License

MIT

