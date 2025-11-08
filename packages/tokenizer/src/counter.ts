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

  // Estimate cost (rough estimates, should be updated with actual pricing)
  let estimatedCost: { input: number; output?: number } | undefined;
  
  if (model.startsWith('gpt-4')) {
    // GPT-4: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
    estimatedCost = {
      input: (tokens / 1000) * 0.03,
      output: (tokens / 1000) * 0.06,
    };
  } else if (model.startsWith('gpt-3.5')) {
    // GPT-3.5: ~$0.0015 per 1K input tokens, ~$0.002 per 1K output tokens
    estimatedCost = {
      input: (tokens / 1000) * 0.0015,
      output: (tokens / 1000) * 0.002,
    };
  } else if (model.startsWith('claude-3-opus')) {
    // Claude 3 Opus: ~$0.015 per 1K input tokens, ~$0.075 per 1K output tokens
    estimatedCost = {
      input: (tokens / 1000) * 0.015,
      output: (tokens / 1000) * 0.075,
    };
  } else if (model.startsWith('claude-3-sonnet')) {
    // Claude 3 Sonnet: ~$0.003 per 1K input tokens, ~$0.015 per 1K output tokens
    estimatedCost = {
      input: (tokens / 1000) * 0.003,
      output: (tokens / 1000) * 0.015,
    };
  } else if (model.startsWith('claude-3-haiku')) {
    // Claude 3 Haiku: ~$0.00025 per 1K input tokens, ~$0.00125 per 1K output tokens
    estimatedCost = {
      input: (tokens / 1000) * 0.00025,
      output: (tokens / 1000) * 0.00125,
    };
  }

  return {
    tokens,
    characters,
    estimatedCost,
    model,
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

