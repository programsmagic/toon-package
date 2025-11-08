/**
 * Per-field token analysis
 */
import { ModelName, TokenAnalysisResult, PerFieldTokenAnalysis } from './types.js';
import { countTokensInData } from './counter.js';
import { countTokens } from './models.js';

/**
 * Analyze tokens per field in data structure
 */
export function analyzeTokensPerField(
  data: unknown,
  model: ModelName = 'gpt-4',
  topN: number = 10
): TokenAnalysisResult {
  const total = countTokensInData(data, model);
  const fields: PerFieldTokenAnalysis[] = [];

  // Traverse data structure and count tokens per field
  function traverse(obj: unknown, path: string = '', depth: number = 0): void {
    if (depth > 10) {
      // Limit depth to prevent infinite recursion
      return;
    }

    if (obj === null || obj === undefined) {
      const value = String(obj);
      const tokens = countTokens(value, model);
      fields.push({
        path: path || 'root',
        tokens,
        percentage: (tokens / total.tokens) * 100,
        value: value.substring(0, 50),
      });
      return;
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      const value = String(obj);
      const tokens = countTokens(value, model);
      fields.push({
        path: path || 'root',
        tokens,
        percentage: (tokens / total.tokens) * 100,
        value: value.substring(0, 50),
      });
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        traverse(item, path ? `${path}[${index}]` : `[${index}]`, depth + 1);
      });
      return;
    }

    if (typeof obj === 'object') {
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = path ? `${path}.${key}` : key;
        traverse(value, newPath, depth + 1);
      });
    }
  }

  traverse(data);

  // Sort by token count (descending)
  fields.sort((a, b) => b.tokens - a.tokens);

  // Get top N fields
  const topFields = fields.slice(0, topN);

  return {
    total,
    fields,
    topFields,
  };
}

