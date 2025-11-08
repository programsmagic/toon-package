/**
 * Token audit utilities
 */
import { readFile } from 'fs/promises';
import { ModelName, TokenAuditResult } from './types.js';
import { countTokensInText } from './counter.js';
import { autoDetectFormat } from '@toon/converter/detector.js';
import { encodeToon } from '@toon/format';

/**
 * Audit token usage in a file
 */
export async function auditFile(
  filePath: string,
  model: ModelName = 'gpt-4'
): Promise<TokenAuditResult> {
  const content = await readFile(filePath, 'utf-8');
  const detected = autoDetectFormat(filePath, content);
  const format = detected.format;

  // Count tokens in current format
  const tokens = countTokensInText(content, model);

  // Calculate potential savings with TOON
  let potentialSavings: TokenAuditResult['potentialSavings'] | undefined;

  if (format !== 'toon') {
    try {
      // Parse and convert to TOON
      let data: unknown;
      if (format === 'json') {
        data = JSON.parse(content);
      } else {
        // For other formats, we'd need to parse them first
        // For now, skip potential savings calculation
        data = null;
      }

      if (data !== null) {
        const toonContent = encodeToon(data, { minimize: true });
        const toonTokens = countTokensInText(toonContent, model);
        const savings = tokens.tokens - toonTokens.tokens;
        const percentage = tokens.tokens > 0 ? (savings / tokens.tokens) * 100 : 0;

        if (savings > 0) {
          potentialSavings = {
            format: 'toon',
            tokens: toonTokens.tokens,
            savings,
            percentage: Math.round(percentage * 100) / 100,
          };
        }
      }
    } catch {
      // Failed to calculate potential savings
    }
  }

  return {
    file: filePath,
    tokens: tokens.tokens,
    format,
    potentialSavings,
  };
}

/**
 * Audit multiple files
 */
export async function auditFiles(
  filePaths: string[],
  model: ModelName = 'gpt-4'
): Promise<TokenAuditResult[]> {
  const results = await Promise.all(
    filePaths.map((file) => auditFile(file, model).catch((error) => ({
      file,
      tokens: 0,
      format: 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error',
    })))
  );

  return results.filter((r): r is TokenAuditResult => 'tokens' in r);
}

