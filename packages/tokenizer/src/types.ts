/**
 * Tokenizer types
 */

export type ModelName =
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-16k'
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3-haiku'
  | 'claude-3.5-sonnet'
  | 'claude-3.5-haiku'
  | 'claude-2'
  | 'claude-instant'
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash'
  | 'gemini-2.0-flash'
  | 'default';

export interface TokenCountResult {
  /**
   * Total token count
   */
  tokens: number;
  /**
   * Character count
   */
  characters: number;
  /**
   * Estimated cost (if model pricing available)
   */
  estimatedCost?: {
    input: number;
    output?: number;
  };
  /**
   * Model used for counting
   */
  model: ModelName;
}

export interface PerFieldTokenAnalysis {
  /**
   * Field path
   */
  path: string;
  /**
   * Token count for this field
   */
  tokens: number;
  /**
   * Percentage of total tokens
   */
  percentage: number;
  /**
   * Field value (truncated if long)
   */
  value: string;
}

export interface TokenAnalysisResult {
  /**
   * Total token count
   */
  total: TokenCountResult;
  /**
   * Per-field breakdown
   */
  fields: PerFieldTokenAnalysis[];
  /**
   * Top N most expensive fields
   */
  topFields: PerFieldTokenAnalysis[];
}

export interface TokenAuditResult {
  /**
   * File path
   */
  file: string;
  /**
   * Token count
   */
  tokens: number;
  /**
   * Format used
   */
  format: string;
  /**
   * Potential savings if converted to TOON
   */
  potentialSavings?: {
    format: string;
    tokens: number;
    savings: number;
    percentage: number;
  };
}

