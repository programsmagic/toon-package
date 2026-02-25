/**
 * Token counting implementation
 */
import { ModelName, TokenCountResult } from './types.js';
import { countTokens } from './models.js';

/**
 * Count tokens in text
 */
export function countTokensInText(
  text: string,
  model: ModelName = 'gpt-4'
): TokenCountResult {
  const tokens = countTokens(text, model);
  const characters = text.length;

  const estimatedCost = estimateCost(tokens, model);

  return {
    tokens,
    characters,
    estimatedCost,
    model,
  };
}

const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-4o': { input: 0.0025, output: 0.01 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  'gpt-3.5-turbo-16k': { input: 0.0005, output: 0.0015 },
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'claude-3-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125 },
  'claude-3.5-sonnet': { input: 0.003, output: 0.015 },
  'claude-3.5-haiku': { input: 0.0008, output: 0.004 },
  'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
  'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
  'gemini-2.0-flash': { input: 0.0001, output: 0.0004 },
};

function estimateCost(
  tokens: number,
  model: ModelName
): { input: number; output?: number } | undefined {
  const pricing = MODEL_PRICING[model];
  if (!pricing) {
    return undefined;
  }
  return {
    input: (tokens / 1000) * pricing.input,
    output: (tokens / 1000) * pricing.output,
  };
}

/**
 * Count tokens in JSON data
 */
export function countTokensInData(
  data: unknown,
  model: ModelName = 'gpt-4'
): TokenCountResult {
  const text = JSON.stringify(data);
  return countTokensInText(text, model);
}

