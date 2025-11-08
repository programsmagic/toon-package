# @toon/tokenizer

Token counting and estimation utilities for multiple LLM models.

## Installation

```bash
npm install @toon/tokenizer
# or
pnpm add @toon/tokenizer
# or
yarn add @toon/tokenizer
```

## Usage

### Count Tokens

```typescript
import { countTokensInText } from '@toon/tokenizer';

const result = countTokensInText('Hello, world!', 'gpt-4');
console.log(result.tokens); // Token count
console.log(result.estimatedCost); // Estimated cost
```

### Real-time Estimation

```typescript
import { createTokenEstimator } from '@toon/tokenizer';

const estimator = createTokenEstimator('gpt-4', 300);
const result = await estimator('Your text here');
```

### Per-Field Analysis

```typescript
import { analyzeTokensPerField } from '@toon/tokenizer';

const data = { user: { id: 123, name: 'Ada' } };
const analysis = analyzeTokensPerField(data, 'gpt-4');
console.log(analysis.topFields); // Top N most expensive fields
```

### Audit Files

```typescript
import { auditFile } from '@toon/tokenizer';

const result = await auditFile('data.json', 'gpt-4');
console.log(result.potentialSavings); // Potential savings with TOON
```

## Supported Models

- GPT-4, GPT-4 Turbo
- GPT-3.5 Turbo
- Claude 3 (Opus, Sonnet, Haiku)
- Claude 2, Claude Instant
- Default (character-based estimation)

## API Reference

### `countTokensInText(text, model?)`

Count tokens in text string.

### `countTokensInData(data, model?)`

Count tokens in JSON data structure.

### `createTokenEstimator(model?, debounceMs?)`

Create debounced token estimator for real-time updates.

### `analyzeTokensPerField(data, model?, topN?)`

Analyze tokens per field in data structure.

### `auditFile(filePath, model?)`

Audit token usage in a file.

## License

MIT

