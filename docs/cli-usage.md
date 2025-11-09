# CLI Usage Guide

Complete guide to using the TOON CLI tool.

## Installation

```bash
npm install -g @programsmagic/toon-cli
```

## Commands

### Convert

Convert between formats:

```bash
toon convert input.json output.toon
toon convert input.json --to csv
toon convert input.json --from json --to toon --minimize
```

### Optimize

Optimize file for LLM:

```bash
toon optimize data.json
toon optimize data.json --model gpt-4 --output optimized.toon
```

### Audit

Token audit report:

```bash
toon audit data.json
toon audit *.json --model gpt-4
toon audit data.json --json
```

### Compare

Compare formats:

```bash
toon compare data.json
toon compare data.json --model claude-3-opus
```

### Stream

Stream conversion (for large files):

```bash
toon stream large-file.json --to toon --output large-file.toon
```

## Options

- `--from <format>`: Source format (auto-detect if not provided)
- `--to <format>`: Target format (default: toon)
- `--minimize`: Minimize output (for TOON format)
- `--model <model>`: Model for token counting (default: gpt-4)
- `--output <path>`: Output file path
- `--json`: Output as JSON

## Examples

### Batch Conversion

```bash
# Convert all JSON files to TOON
toon convert *.json --to toon

# Optimize all files
for file in *.json; do
  toon optimize "$file"
done
```

### Token Audit

```bash
# Audit all files
toon audit *.json --model gpt-4

# Get JSON output
toon audit data.json --json > audit.json
```

## License

MIT

