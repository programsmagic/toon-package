# TOON Converter Example

Complete example demonstrating format conversion using `@programsmagic/toon-converter`.

## Overview

This example shows how to:
- Convert between JSON, TOON, CSV, and YAML formats
- Use format conversion in your applications
- Optimize data for LLM interactions

## Prerequisites

- Node.js 18+ installed
- pnpm installed (or npm/yarn)

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
cd examples/toon-converter
pnpm install
```

### Step 2: Create Sample Data

Create a file `input.json`:

```json
{
  "users": [
    {"id": 1, "name": "Alice", "email": "alice@example.com"},
    {"id": 2, "name": "Bob", "email": "bob@example.com"}
  ]
}
```

### Step 3: Run Conversion

```bash
# Convert JSON to TOON
node convert.js input.json output.toon

# Convert with minimization
node convert.js input.json output.toon --minimize

# Convert to CSV
node convert.js input.json output.csv --to csv

# Convert to YAML
node convert.js input.json output.yaml --to yaml
```

## Complete Code Example

### convert.js

```javascript
import { convertFile } from '@programsmagic/toon-converter';
import { readFileSync, writeFileSync } from 'fs';

const [inputFile, outputFile, ...options] = process.argv.slice(2);
const minimize = options.includes('--minimize');
const toFormat = options.find(opt => opt.startsWith('--to='))?.split('=')[1] || 'toon';

const input = readFileSync(inputFile, 'utf-8');
const output = await convertFile(inputFile, outputFile, {
  from: 'json',
  to: toFormat,
  minimize,
});

console.log(`Converted ${inputFile} to ${outputFile}`);
console.log(`Format: ${toFormat}`);
console.log(`Minimized: ${minimize}`);
```

## Expected Output

### JSON Input

```json
{
  "users": [
    {"id": 1, "name": "Alice"},
    {"id": 2, "name": "Bob"}
  ]
}
```

### TOON Output

```
users [
  id 1 name Alice
  id 2 name Bob
]
```

### TOON Output (Minimized)

```
users [id 1 name Alice id 2 name Bob]
```

### CSV Output

```csv
id,name
1,Alice
2,Bob
```

## Usage Examples

### Basic Conversion

```bash
node convert.js input.json output.toon
```

### Minimized Conversion

```bash
node convert.js input.json output.toon --minimize
```

### Format Selection

```bash
# Convert to CSV
node convert.js input.json output.csv --to=csv

# Convert to YAML
node convert.js input.json output.yaml --to=yaml
```

## Troubleshooting

### File Not Found

**Problem**: Error "File not found".

**Solution**:
- Check file path: Use absolute or relative paths
- Verify file exists: `ls input.json`
- Check file permissions: Ensure read access

### Invalid Format

**Problem**: Error "Invalid format".

**Solution**:
- Verify input format: Ensure valid JSON, TOON, CSV, or YAML
- Check format options: Use `--to=json`, `--to=toon`, `--to=csv`, or `--to=yaml`

### Conversion Errors

**Problem**: Conversion fails.

**Solution**:
- Check data structure: Ensure data matches format requirements
- Verify format compatibility: Some formats have limitations
- Check error messages: Look for specific error details

## Next Steps

- Try converting different data structures
- Experiment with minimization for LLM optimization
- Integrate format conversion into your workflows
- Check out the [TOON Format Guide](../../docs/toon-format.md) for format details
- Explore the [CLI Usage Guide](../../docs/cli-usage.md) for command-line usage

