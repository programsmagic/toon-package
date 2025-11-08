/**
 * TOON format encoder (JSON → TOON)
 */
import { ToonEncodeOptions, ToonPlusMetadata } from './types.js';
import {
  escapeToon,
  needsQuoting,
  formatNumber,
  formatBoolean,
  formatNull,
  calculateHash,
} from './utils.js';

/**
 * Encode JSON to TOON format
 */
export function encodeToon(
  data: unknown,
  options: ToonEncodeOptions = {}
): string {
  const {
    minimize = false,
    toonPlus = false,
    includeIndex = false,
    includeMetadata = false,
    includeComments = false,
    delimiter = ' ',
    useLengthMarkers = false,
  } = options;

  let toon = encodeValue(data, 0, minimize, delimiter, useLengthMarkers);

  // Add TOON+ extensions if requested
  if (toonPlus || includeIndex || includeMetadata || includeComments) {
    const metadata: ToonPlusMetadata = {};
    if (includeIndex) {
      metadata.index = calculateHash(toon);
      metadata.length = toon.length;
    }
    if (includeMetadata) {
      metadata.metadata = {
        encoded: new Date().toISOString(),
        version: '1.0',
      };
    }
    if (includeComments) {
      metadata.comments = {};
    }

    // Prepend metadata as comment
    const metadataStr = JSON.stringify(metadata);
    toon = `#toon+ ${metadataStr}\n${toon}`;
  }

  return toon;
}

function encodeValue(
  value: unknown,
  depth: number,
  minimize: boolean,
  delimiter: string,
  useLengthMarkers: boolean
): string {
  const indent = minimize ? '' : '  '.repeat(depth);
  const newline = minimize ? '' : '\n';

  if (value === null) {
    return formatNull();
  }

  if (typeof value === 'boolean') {
    return formatBoolean(value);
  }

  if (typeof value === 'number') {
    return formatNumber(value);
  }

  if (typeof value === 'string') {
    if (needsQuoting(value)) {
      return `"${escapeToon(value)}"`;
    }
    return value;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }

    const items = value.map((item) => {
      const encoded = encodeValue(item, depth + 1, minimize, delimiter, useLengthMarkers);
      if (useLengthMarkers) {
        return `${encoded.length}${delimiter}${encoded}`;
      }
      return encoded;
    });

    if (minimize) {
      return `[${items.join(delimiter)}]`;
    }

    return `[\n${indent}  ${items.join(`\n${indent}  `)}\n${indent}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return '{}';
    }

    const pairs = entries.map(([key, val]) => {
      const encodedKey = needsQuoting(key) ? `"${escapeToon(key)}"` : key;
      const encodedValue = encodeValue(val, depth + 1, minimize, delimiter, useLengthMarkers);
      
      if (useLengthMarkers) {
        const pair = `${encodedKey}${delimiter}${encodedValue}`;
        return `${pair.length}${delimiter}${pair}`;
      }

      if (minimize) {
        return `${encodedKey}${delimiter}${encodedValue}`;
      }

      return `${encodedKey}${delimiter}${encodedValue}`;
    });

    if (minimize) {
      return `{${pairs.join(delimiter)}}`;
    }

    return `{\n${indent}  ${pairs.join(`\n${indent}  `)}\n${indent}}`;
  }

  throw new Error(`Unsupported value type: ${typeof value}`);
}

