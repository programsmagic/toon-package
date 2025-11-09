# @programsmagic/toon-converter

Multi-format converter (JSON/TOON/CSV/YAML) with smart format selection and auto-detection.

## Installation

```bash
npm install @programsmagic/toon-converter
# or
pnpm add @programsmagic/toon-converter
# or
yarn add @programsmagic/toon-converter
```

## Usage

### Convert Between Formats

```typescript
import { convert } from '@programsmagic/toon-converter';

const json = JSON.stringify({ user: { id: 123, name: 'Ada' } });

const result = convert(json, {
  from: 'json',
  to: 'toon',
});

console.log(result.content);
console.log(result.metadata.tokenSavings); // Token savings percentage
```

### Auto-Detect Format

```typescript
import { convertFile } from '@programsmagic/toon-converter';

const result = convertFile(content, 'data.json', {
  to: 'toon',
  // from is auto-detected from filename and content
});
```

### Smart Format Selection

```typescript
import { selectOptimalFormat } from '@programsmagic/toon-converter';

const data = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
const selection = selectOptimalFormat(data);

console.log(selection.recommended); // 'csv' or 'toon'
```

### Batch Conversion

```typescript
import { batchConvert } from '@programsmagic/toon-converter';

const result = await batchConvert(
  [
    { input: 'data1.json' },
    { input: 'data2.json', output: 'data2.toon' },
  ],
  { to: 'toon' }
);

console.log(result.summary);
```

## API Reference

### `convert(content, options)`

Convert between formats.

### `convertFile(content, filename, options)`

Convert with auto-detection from filename.

### `autoDetectFormat(filename?, content?)`

Auto-detect format from filename and content.

### `selectOptimalFormat(data)`

Select optimal format for data structure.

### `compareAllFormats(data)`

Compare all formats and show savings.

## License

MIT

