# Token Optimizer Example

Complete example demonstrating token optimization using `@programsmagic/toon-tokenizer` and `@programsmagic/toon-converter`.

## Overview

This example shows how to:
- Count tokens for different LLM models
- Optimize data formats for token efficiency
- Compare token usage across formats
- Estimate costs for LLM interactions

## Prerequisites

- Node.js 18+ installed
- pnpm installed (or npm/yarn)

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
cd examples/token-optimizer
pnpm install
```

### Step 2: Create Sample Data

Create a file `data.json`:

```json
{
  "users": [
    {"id": 1, "name": "Alice", "email": "alice@example.com", "active": true},
    {"id": 2, "name": "Bob", "email": "bob@example.com", "active": true}
  ]
}
```

### Step 3: Run Optimization

```bash
# Optimize with default model (gpt-4)
node optimize.js data.json

# Optimize with specific model
node optimize.js data.json --model gpt-3.5-turbo

# Optimize and save to file
node optimize.js data.json --output optimized.toon
```

## Complete Code Example

### optimize.js

```javascript
import { selectOptimalFormat, convert } from '@programsmagic/toon-converter';
import { countTokensInData } from '@programsmagic/toon-tokenizer';
import { readFileSync, writeFileSync } from 'fs';

const [inputFile, ...options] = process.argv.slice(2);
const model = options.find(opt => opt.startsWith('--model='))?.split('=')[1] || 'gpt-4';
const outputFile = options.find(opt => opt.startsWith('--output='))?.split('=')[1];

const data = JSON.parse(readFileSync(inputFile, 'utf-8'));

// Select optimal format
const selection = selectOptimalFormat(data);
console.log(`Recommended format: ${selection.best}`);
console.log(`Savings: ${selection.savings[selection.best]}%`);

// Count tokens for each format
const formats = ['json', 'toon', 'csv'];
for (const format of formats) {
  const converted = await convert(JSON.stringify(data), 'json', format);
  const tokens = countTokensInData(converted, model);
  console.log(`${format}: ${tokens.tokens} tokens ($${tokens.estimatedCost.total})`);
}

// Optimize and save
if (outputFile) {
  const optimized = await convert(JSON.stringify(data), 'json', selection.best, {
    minimize: true,
  });
  writeFileSync(outputFile, optimized);
  console.log(`Optimized data saved to ${outputFile}`);
}
```

## Expected Output

```
Recommended format: toon
Savings: 45%

json: 150 tokens ($0.0015)
toon: 82 tokens ($0.0008)
csv: 95 tokens ($0.0010)

Optimized data saved to optimized.toon
```

## Usage Examples

### Basic Optimization

```bash
node optimize.js data.json
```

### Model-Specific Optimization

```bash
# GPT-3.5 Turbo
node optimize.js data.json --model=gpt-3.5-turbo

# Claude 3 Opus
node optimize.js data.json --model=claude-3-opus
```

### Save Optimized Output

```bash
node optimize.js data.json --output=optimized.toon
```

## Troubleshooting

### Token Counting Errors

**Problem**: Error counting tokens.

**Solution**:
- Verify model name: Use supported model names
- Check data format: Ensure valid JSON
- Check model support: Some models may not be supported

### Format Selection Errors

**Problem**: Error selecting optimal format.

**Solution**:
- Check data structure: Ensure data is valid
- Verify format support: Some formats have limitations
- Check error messages: Look for specific error details

### Cost Estimation Errors

**Problem**: Cost estimation fails.

**Solution**:
- Verify model name: Use supported model names
- Check pricing data: Ensure pricing data is available
- Check model support: Some models may not have pricing data

## Next Steps

- Try different data structures and formats
- Experiment with different LLM models
- Compare token usage across formats
- Integrate optimization into your workflows
- Check out the [Token Optimization Guide](../../docs/token-optimization.md) for more strategies
- Explore the [TOON Format Guide](../../docs/toon-format.md) for format details

