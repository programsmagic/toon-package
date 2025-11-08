/**
 * Model-specific tokenizers
 */
import { encoding_for_model, get_encoding, type Tiktoken } from 'tiktoken';
import { ModelName } from './types.js';

/**
 * Get tokenizer for a specific model
 */
export function getTokenizer(model: ModelName): Tiktoken {
  try {
    // Try to get model-specific encoding
    const modelMap: Record<string, string> = {
      'gpt-4': 'cl100k_base',
      'gpt-4-turbo': 'cl100k_base',
      'gpt-3.5-turbo': 'cl100k_base',
      'gpt-3.5-turbo-16k': 'cl100k_base',
    };

    if (model in modelMap) {
      return encoding_for_model(model as any);
    }

    // Fallback to cl100k_base (GPT-4 encoding)
    return get_encoding('cl100k_base');
  } catch {
    // Ultimate fallback
    return get_encoding('cl100k_base');
  }
}

/**
 * Estimate tokens for Claude models (character-based)
 */
export function estimateClaudeTokens(text: string): number {
  // Claude uses approximately 3.5 characters per token
  return Math.ceil(text.length / 3.5);
}

/**
 * Estimate tokens for default/unknown models (character-based)
 */
export function estimateDefaultTokens(text: string): number {
  // Default estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Get token count for a specific model
 */
export function countTokens(text: string, model: ModelName): number {
  if (model.startsWith('claude')) {
    return estimateClaudeTokens(text);
  }

  if (model === 'default') {
    return estimateDefaultTokens(text);
  }

  try {
    const tokenizer = getTokenizer(model);
    return tokenizer.encode(text).length;
  } catch {
    // Fallback to default estimation
    return estimateDefaultTokens(text);
  }
}

