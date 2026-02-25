/**
 * Model-specific tokenizers
 */
import { encoding_for_model, get_encoding, type Tiktoken } from 'tiktoken';
import { ModelName } from './types.js';

const tokenizerCache = new Map<string, Tiktoken>();

/**
 * Get tokenizer for a specific model (cached)
 */
export function getTokenizer(model: ModelName): Tiktoken {
  const cached = tokenizerCache.get(model);
  if (cached) {
    return cached;
  }

  let tokenizer: Tiktoken;
  try {
    const encodingMap: Partial<Record<ModelName, string>> = {
      'gpt-4': 'cl100k_base',
      'gpt-4-turbo': 'cl100k_base',
      'gpt-4o': 'o200k_base',
      'gpt-4o-mini': 'o200k_base',
      'gpt-3.5-turbo': 'cl100k_base',
      'gpt-3.5-turbo-16k': 'cl100k_base',
    };

    if (model in encodingMap) {
      try {
        tokenizer = encoding_for_model(model as Parameters<typeof encoding_for_model>[0]);
      } catch {
        tokenizer = get_encoding((encodingMap[model] || 'cl100k_base') as Parameters<typeof get_encoding>[0]);
      }
    } else {
      tokenizer = get_encoding('cl100k_base');
    }
  } catch {
    tokenizer = get_encoding('cl100k_base');
  }

  tokenizerCache.set(model, tokenizer);
  return tokenizer;
}

/**
 * Estimate tokens for Claude models (character-based)
 */
export function estimateClaudeTokens(text: string): number {
  return Math.ceil(text.length / 3.5);
}

/**
 * Estimate tokens for Gemini models (character-based)
 */
export function estimateGeminiTokens(text: string): number {
  return Math.ceil(text.length / 3.8);
}

/**
 * Estimate tokens for default/unknown models (character-based)
 */
export function estimateDefaultTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Get token count for a specific model
 */
export function countTokens(text: string, model: ModelName): number {
  if (model.startsWith('claude')) {
    return estimateClaudeTokens(text);
  }

  if (model.startsWith('gemini')) {
    return estimateGeminiTokens(text);
  }

  if (model === 'default') {
    return estimateDefaultTokens(text);
  }

  try {
    const tokenizer = getTokenizer(model);
    return tokenizer.encode(text).length;
  } catch {
    return estimateDefaultTokens(text);
  }
}

