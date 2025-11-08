/**
 * TOON format utilities
 */
import { createHash } from 'crypto';

/**
 * Calculate MD5 hash of content
 */
export function calculateHash(content: string): string {
  return createHash('md5').update(content).digest('hex');
}

/**
 * Escape special characters in TOON format
 */
export function escapeToon(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/"/g, '\\"');
}

/**
 * Unescape special characters in TOON format
 */
export function unescapeToon(value: string): string {
  return value
    .replace(/\\"/g, '"')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r')
    .replace(/\\n/g, '\n')
    .replace(/\\\\/g, '\\');
}

/**
 * Check if value needs quoting
 */
export function needsQuoting(value: string): boolean {
  return (
    value.includes(' ') ||
    value.includes('\n') ||
    value.includes('\r') ||
    value.includes('\t') ||
    value.includes('"') ||
    value.includes('\\') ||
    value === '' ||
    /^[0-9]/.test(value) ||
    value === 'true' ||
    value === 'false' ||
    value === 'null'
  );
}

/**
 * Format number for TOON (preserve type)
 */
export function formatNumber(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toString();
}

/**
 * Format boolean for TOON
 */
export function formatBoolean(value: boolean): string {
  return value ? 'true' : 'false';
}

/**
 * Format null for TOON
 */
export function formatNull(): string {
  return 'null';
}

