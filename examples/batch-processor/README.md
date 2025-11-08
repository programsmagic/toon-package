# Batch Processor Example

Batch file processing example using @toon/cli.

## Setup

```bash
cd examples/batch-processor
pnpm install
```

## Usage

```bash
# Process multiple files
toon convert *.json --to toon

# Optimize all files
for file in *.json; do
  toon optimize "$file"
done

# Audit all files
toon audit *.json --model gpt-4
```

