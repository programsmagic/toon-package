/**
 * Format converter types
 */

export type SupportedFormat = 'json' | 'toon' | 'csv' | 'yaml' | 'yml';

export interface FormatDetectionResult {
  format: SupportedFormat;
  confidence: number;
  reason?: string;
}

export interface ConversionOptions {
  /**
   * Source format (auto-detect if not provided)
   */
  from?: SupportedFormat;
  /**
   * Target format
   */
  to: SupportedFormat;
  /**
   * CSV options
   */
  csv?: {
    header?: boolean;
    delimiter?: string;
  };
  /**
   * TOON options
   */
  toon?: {
    minimize?: boolean;
    toonPlus?: boolean;
  };
  /**
   * YAML options
   */
  yaml?: {
    indent?: number;
    lineWidth?: number;
  };
}

export interface ConversionResult {
  /**
   * Converted content
   */
  content: string;
  /**
   * Detected source format
   */
  detectedFormat?: SupportedFormat;
  /**
   * Conversion metadata
   */
  metadata?: {
    size: number;
    tokenSavings?: number;
    formatComparison?: FormatComparison;
  };
}

export interface FormatComparison {
  json: {
    size: number;
    tokens?: number;
  };
  toon: {
    size: number;
    tokens?: number;
  };
  csv?: {
    size: number;
    tokens?: number;
  };
  yaml?: {
    size: number;
    tokens?: number;
  };
}

export interface BatchConversionResult {
  /**
   * Successful conversions
   */
  success: Array<{
    file: string;
    result: ConversionResult;
  }>;
  /**
   * Failed conversions
   */
  errors: Array<{
    file: string;
    error: string;
  }>;
  /**
   * Summary statistics
   */
  summary: {
    total: number;
    successful: number;
    failed: number;
    totalTokenSavings?: number;
  };
}

