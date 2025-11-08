/**
 * Format comparison utilities
 */
import { compareFormats } from './selector.js';
import { SupportedFormat } from './types.js';

export interface FormatComparisonResult {
  best: SupportedFormat;
  savings: {
    format: SupportedFormat;
    sizeReduction: number;
    tokenReduction?: number;
  }[];
  details: ReturnType<typeof compareFormats>;
}

/**
 * Compare all formats for a given data structure
 */
export function compareAllFormats(data: unknown): FormatComparisonResult {
  const comparison = compareFormats(data);
  const savings: Array<{ format: SupportedFormat; sizeReduction: number; tokenReduction?: number }> = [];

  const jsonSize = comparison.json.size;
  const jsonTokens = comparison.json.estimatedTokens || 0;

  // Calculate savings for each format
  if (comparison.toon) {
    const sizeReduction = Math.round(((jsonSize - comparison.toon.size) / jsonSize) * 100);
    const tokenReduction = jsonTokens > 0
      ? Math.round(((jsonTokens - (comparison.toon.estimatedTokens || 0)) / jsonTokens) * 100)
      : undefined;
    savings.push({
      format: 'toon',
      sizeReduction,
      tokenReduction,
    });
  }

  if (comparison.csv) {
    const sizeReduction = Math.round(((jsonSize - comparison.csv.size) / jsonSize) * 100);
    const tokenReduction = jsonTokens > 0
      ? Math.round(((jsonTokens - (comparison.csv.estimatedTokens || 0)) / jsonTokens) * 100)
      : undefined;
    savings.push({
      format: 'csv',
      sizeReduction,
      tokenReduction,
    });
  }

  if (comparison.yaml) {
    const sizeReduction = Math.round(((jsonSize - comparison.yaml.size) / jsonSize) * 100);
    const tokenReduction = jsonTokens > 0
      ? Math.round(((jsonTokens - (comparison.yaml.estimatedTokens || 0)) / jsonTokens) * 100)
      : undefined;
    savings.push({
      format: 'yaml',
      sizeReduction,
      tokenReduction,
    });
  }

  // Sort by size reduction
  savings.sort((a, b) => b.sizeReduction - a.sizeReduction);

  return {
    best: savings[0]?.format || 'json',
    savings,
    details: comparison,
  };
}

