/**
 * Real-time token estimation
 */
import { ModelName, TokenCountResult } from './types.js';
import { countTokensInText } from './counter.js';

/**
 * Debounced token estimation for real-time updates
 */
export function createTokenEstimator(
  model: ModelName = 'gpt-4',
  debounceMs: number = 300
): (text: string) => Promise<TokenCountResult> {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastText = '';
  let lastResult: TokenCountResult | null = null;

  return (text: string): Promise<TokenCountResult> => {
    return new Promise((resolve) => {
      // Return cached result if text hasn't changed
      if (text === lastText && lastResult) {
        resolve(lastResult);
        return;
      }

      // Clear previous timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout
      timeoutId = setTimeout(() => {
        const result = countTokensInText(text, model);
        lastText = text;
        lastResult = result;
        resolve(result);
      }, debounceMs);
    });
  };
}

/**
 * Estimate tokens synchronously (for immediate feedback)
 */
export function estimateTokensSync(
  text: string,
  model: ModelName = 'gpt-4'
): TokenCountResult {
  return countTokensInText(text, model);
}

