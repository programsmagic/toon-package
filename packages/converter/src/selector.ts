/**
 * Smart format selection algorithm
 */
import { SupportedFormat } from './types.js';
import { isCsvEligible } from './csv-detector.js';

export interface FormatSelectionResult {
  recommended: SupportedFormat;
  alternatives: Array<{
    format: SupportedFormat;
    score: number;
    reason: string;
  }>;
}

/**
 * Select optimal format for data structure
 */
export function selectOptimalFormat(data: unknown): FormatSelectionResult {
  const scores: Array<{ format: SupportedFormat; score: number; reason: string }> = [];

  // Check CSV eligibility
  const csvCheck = isCsvEligible(data);
  if (csvCheck.eligible) {
    scores.push({
      format: 'csv',
      score: csvCheck.confidence * 0.9, // Slight penalty for CSV
      reason: csvCheck.reason || 'CSV-eligible structure',
    });
  }

  // TOON is good for tabular data and nested structures
  if (csvCheck.eligible || (typeof data === 'object' && data !== null)) {
    scores.push({
      format: 'toon',
      score: 0.85,
      reason: 'TOON format provides token efficiency for structured data',
    });
  }

  // JSON is always an option (fallback)
  scores.push({
    format: 'json',
    score: 0.7,
    reason: 'JSON is universally compatible',
  });

  // YAML is good for configuration-like data
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    const keys = Object.keys(data);
    if (keys.length < 20) {
      // Small objects are good for YAML
      scores.push({
        format: 'yaml',
        score: 0.75,
        reason: 'YAML is good for configuration-like data',
      });
    }
  }

  // Sort by score
  scores.sort((a, b) => b.score - a.score);

  return {
    recommended: scores[0].format,
    alternatives: scores.slice(1),
  };
}

/**
 * Compare formats for a given data structure
 */
export function compareFormats(data: unknown): {
  json: { size: number; estimatedTokens?: number };
  toon: { size: number; estimatedTokens?: number };
  csv?: { size: number; estimatedTokens?: number };
  yaml?: { size: number; estimatedTokens?: number };
} {
  const jsonStr = JSON.stringify(data);
  const jsonSize = jsonStr.length;

  // Estimate TOON size (typically 30-60% smaller)
  const toonSize = Math.floor(jsonSize * 0.5); // Conservative estimate

  const result: {
    json: { size: number; estimatedTokens?: number };
    toon: { size: number; estimatedTokens?: number };
    csv?: { size: number; estimatedTokens?: number };
    yaml?: { size: number; estimatedTokens?: number };
  } = {
    json: { size: jsonSize, estimatedTokens: Math.ceil(jsonSize / 4) },
    toon: { size: toonSize, estimatedTokens: Math.ceil(toonSize / 4) },
  };

  // Check CSV eligibility
  const csvCheck = isCsvEligible(data);
  if (csvCheck.eligible) {
    // CSV is typically similar to TOON in size
    result.csv = {
      size: toonSize,
      estimatedTokens: Math.ceil(toonSize / 4),
    };
  }

  // YAML is typically larger than JSON
  const yamlSize = Math.floor(jsonSize * 1.2);
  result.yaml = {
    size: yamlSize,
    estimatedTokens: Math.ceil(yamlSize / 4),
  };

  return result;
}

