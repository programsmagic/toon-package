# Batch Processor Example

Complete example demonstrating batch file processing using `@programsmagic/toon-cli`.

## Overview

This example shows how to:
- Process multiple files in batch
- Convert files between formats
- Optimize files for LLM interactions
- Audit token usage across files

## Prerequisites

- Node.js 18+ installed
- pnpm installed (or npm/yarn)
- `@programsmagic/toon-cli` installed globally

## Step-by-Step Setup

### Step 1: Install CLI Tool

```bash
npm install -g @programsmagic/toon-cli
# or
pnpm add -g @programsmagic/toon-cli
```

### Step 2: Install Example Dependencies

```bash
cd examples/batch-processor
pnpm install
```

### Step 3: Create Sample Files

Create multiple JSON files:

```bash
# Create sample files
echo '{"users": [{"id": 1, "name": "Alice"}]}' > data1.json
echo '{"users": [{"id": 2, "name": "Bob"}]}' > data2.json
echo '{"users": [{"id": 3, "name": "Charlie"}]}' > data3.json
```

## Usage Examples

### Batch Conversion

Convert all JSON files to TOON format:

```bash
# Convert all JSON files to TOON
toon convert *.json --to toon

# Convert with minimization
toon convert *.json --to toon --minimize

# Convert to specific directory
toon convert *.json --to toon --output-dir ./converted
```

### Batch Optimization

Optimize all files for LLM interactions:

```bash
# Optimize all files
for file in *.json; do
  toon optimize "$file" --model gpt-4
done

# Optimize and save
for file in *.json; do
  toon optimize "$file" --output "${file%.json}.toon"
done
```

### Batch Token Audit

Audit token usage across all files:

```bash
# Audit all files
toon audit *.json --model gpt-4

# Audit with JSON output
toon audit *.json --model gpt-4 --json > audit.json

# Audit and save report
toon audit *.json --model gpt-4 --output audit-report.json
```

## Complete Code Example

### process.js

```javascript
import { convertFile, batchConvert } from '@programsmagic/toon-converter';
import { auditFile } from '@programsmagic/toon-tokenizer';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

// Process all JSON files in directory
const files = readdirSync('.').filter(file => 
  file.endsWith('.json') && statSync(file).isFile()
);

console.log(`Processing ${files.length} files...`);

// Batch convert
const results = await batchConvert(files, {
  from: 'json',
  to: 'toon',
  minimize: true,
});

console.log('Conversion results:');
for (const result of results) {
  console.log(`  ${result.input} -> ${result.output} (${result.tokens} tokens)`);
}

// Batch audit
console.log('\nAudit results:');
for (const file of files) {
  const audit = await auditFile(file, 'gpt-4');
  console.log(`  ${file}: ${audit.tokens} tokens ($${audit.estimatedCost.total})`);
}
```

## Expected Output

```
Processing 3 files...

Conversion results:
  data1.json -> data1.toon (45 tokens)
  data2.json -> data2.toon (45 tokens)
  data3.json -> data3.toon (45 tokens)

Audit results:
  data1.json: 45 tokens ($0.0005)
  data2.json: 45 tokens ($0.0005)
  data3.json: 45 tokens ($0.0005)

Total: 135 tokens ($0.0015)
```

## Advanced Usage

### Parallel Processing

Process files in parallel for faster processing:

```bash
# Using GNU parallel
parallel toon convert {} --to toon ::: *.json

# Using xargs
find . -name "*.json" | xargs -P 4 -I {} toon convert {} --to toon
```

### Filtered Processing

Process only specific files:

```bash
# Process files matching pattern
toon convert data-*.json --to toon

# Process files in subdirectories
find . -name "*.json" -exec toon convert {} --to toon \;
```

## Troubleshooting

### CLI Not Found

**Problem**: Error "toon: command not found".

**Solution**:
- Install CLI globally: `npm install -g @programsmagic/toon-cli`
- Check PATH: Ensure npm global bin is in PATH
- Use npx: `npx @programsmagic/toon-cli convert ...`

### File Processing Errors

**Problem**: Some files fail to process.

**Solution**:
- Check file format: Ensure valid JSON, TOON, CSV, or YAML
- Check file permissions: Ensure read/write access
- Check file size: Large files may take time to process

### Batch Processing Slow

**Problem**: Batch processing is slow.

**Solution**:
- Use parallel processing: Process files in parallel
- Optimize file size: Reduce file size before processing
- Use streaming: Use streaming for large files

## Next Steps

- Try different batch processing strategies
- Experiment with parallel processing
- Integrate batch processing into your workflows
- Check out the [CLI Usage Guide](../../docs/cli-usage.md) for more commands
- Explore the [Token Optimization Guide](../../docs/token-optimization.md) for optimization strategies

