# @toon/cli

Command-line tool for format conversion and token optimization.

## Installation

```bash
npm install -g @toon/cli
# or
pnpm add -g @toon/cli
# or
yarn global add @toon/cli
```

## Usage

### Convert Between Formats

```bash
toon convert input.json output.toon
toon convert input.json --to csv
toon convert input.json --from json --to toon --minimize
```

### Optimize for LLM

```bash
toon optimize data.json
toon optimize data.json --model gpt-4 --output optimized.toon
```

### Token Audit

```bash
toon audit data.json
toon audit *.json --model gpt-4
toon audit data.json --json
```

### Compare Formats

```bash
toon compare data.json
toon compare data.json --model claude-3-opus
```

### Stream Conversion

```bash
toon stream large-file.json --to toon --output large-file.toon
```

## Commands

- `convert` - Convert between formats
- `optimize` - Optimize file for LLM
- `audit` - Token audit report
- `compare` - Compare formats
- `stream` - Stream conversion (for large files)

## License

MIT

