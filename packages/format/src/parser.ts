/**
 * TOON format parser (TOON → JSON)
 */
import { ToonDecodeOptions, ToonParseResult, ToonPlusMetadata } from './types.js';
import { unescapeToon } from './utils.js';

/**
 * Parse TOON format to JSON
 */
export async function parseToon(
  toon: string,
  options: ToonDecodeOptions = {}
): Promise<ToonParseResult> {
  const { delimiter = ' ', useLengthMarkers = false, validateIndex = false } = options;

  // Check for TOON+ metadata
  let metadata: ToonPlusMetadata | undefined;
  let content = toon;

  if (toon.startsWith('#toon+')) {
    const lines = toon.split('\n');
    const metadataLine = lines[0];
    const metadataStr = metadataLine.replace('#toon+ ', '');
    try {
      metadata = JSON.parse(metadataStr) as ToonPlusMetadata;
      content = lines.slice(1).join('\n');
    } catch (error) {
      throw new Error(`Failed to parse TOON+ metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Validate index if needed
  if (validateIndex && metadata?.index) {
    const { createHash } = await import('crypto');
    const calculatedHash = createHash('md5').update(content).digest('hex');
    if (calculatedHash !== metadata.index) {
      throw new Error('TOON+ index validation failed: content hash mismatch');
    }
  }

  const data = parseValue(content, delimiter, useLengthMarkers);

  return {
    data,
    metadata,
    version: metadata?.metadata?.version as string | undefined,
  };
}

function parseValue(
  input: string,
  delimiter: string,
  useLengthMarkers: boolean
): unknown {
  input = input.trim();

  if (input === 'null') {
    return null;
  }

  if (input === 'true') {
    return true;
  }

  if (input === 'false') {
    return false;
  }

  // Try to parse as number
  if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(input)) {
    const num = Number(input);
    if (!Number.isNaN(num)) {
      return num;
    }
  }

  // Parse string
  if (input.startsWith('"') && input.endsWith('"')) {
    return unescapeToon(input.slice(1, -1));
  }

  // Unquoted string (if it doesn't match other patterns)
  if (!input.includes(delimiter) && !input.startsWith('[') && !input.startsWith('{')) {
    return input;
  }

  // Parse array
  if (input.startsWith('[') && input.endsWith(']')) {
    const content = input.slice(1, -1).trim();
    if (content === '') {
      return [];
    }

    const items = parseList(content, delimiter, useLengthMarkers);
    return items.map((item) => parseValue(item, delimiter, useLengthMarkers));
  }

  // Parse object
  if (input.startsWith('{') && input.endsWith('}')) {
    const content = input.slice(1, -1).trim();
    if (content === '') {
      return {};
    }

    const pairs = parseList(content, delimiter, useLengthMarkers);
    const obj: Record<string, unknown> = {};

    for (const pair of pairs) {
      const match = pair.match(/^(.+?)(?:\s+|$)(.+)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        const parsedKey = key.startsWith('"') && key.endsWith('"')
          ? unescapeToon(key.slice(1, -1))
          : key;
        obj[parsedKey] = parseValue(value, delimiter, useLengthMarkers);
      }
    }

    return obj;
  }

  // Fallback: return as string
  return input;
}

function parseList(
  content: string,
  delimiter: string,
  useLengthMarkers: boolean
): string[] {
  if (useLengthMarkers) {
    return parseWithLengthMarkers(content, delimiter);
  }

  // Simple delimiter-based parsing
  const items: string[] = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (escapeNext) {
      current += char;
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      current += char;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      current += char;
      continue;
    }

    if (inString) {
      current += char;
      continue;
    }

    if (char === '[' || char === '{') {
      depth++;
      current += char;
      continue;
    }

    if (char === ']' || char === '}') {
      depth--;
      current += char;
      continue;
    }

    if (char === delimiter && depth === 0) {
      if (current.trim()) {
        items.push(current.trim());
      }
      current = '';
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    items.push(current.trim());
  }

  return items;
}

function parseWithLengthMarkers(content: string, delimiter: string): string[] {
  const items: string[] = [];
  let i = 0;

  while (i < content.length) {
    // Find length marker
    let lengthStr = '';
    while (i < content.length && /\d/.test(content[i])) {
      lengthStr += content[i];
      i++;
    }

    if (lengthStr === '') {
      break;
    }

    const length = parseInt(lengthStr, 10);
    
    // Skip delimiter
    if (content[i] === delimiter) {
      i++;
    }

    // Extract item
    const item = content.slice(i, i + length);
    items.push(item);
    i += length;

    // Skip delimiter if present
    if (content[i] === delimiter) {
      i++;
    }
  }

  return items;
}

