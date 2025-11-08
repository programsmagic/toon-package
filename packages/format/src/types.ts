/**
 * TOON format types
 */

export interface ToonEncodeOptions {
  /**
   * Ultra-minimization mode: strip all whitespace for pure model use
   */
  minimize?: boolean;
  /**
   * Include TOON+ extensions (structural index, metadata, comments)
   */
  toonPlus?: boolean;
  /**
   * Include structural index header (MD5/length hints)
   */
  includeIndex?: boolean;
  /**
   * Include metadata
   */
  includeMetadata?: boolean;
  /**
   * Include field-level comments/annotations
   */
  includeComments?: boolean;
  /**
   * Custom delimiter (default: space)
   */
  delimiter?: string;
  /**
   * Use length markers instead of delimiters
   */
  useLengthMarkers?: boolean;
}

export interface ToonDecodeOptions {
  /**
   * Expected delimiter (auto-detect if not provided)
   */
  delimiter?: string;
  /**
   * Use length markers instead of delimiters
   */
  useLengthMarkers?: boolean;
  /**
   * Validate structural index if present
   */
  validateIndex?: boolean;
}

export interface ToonPlusMetadata {
  /**
   * Structural index (MD5 hash of content)
   */
  index?: string;
  /**
   * Content length
   */
  length?: number;
  /**
   * Field-level comments/annotations
   */
  comments?: Record<string, string>;
  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;
}

export interface ToonParseResult {
  /**
   * Parsed JSON data
   */
  data: unknown;
  /**
   * TOON+ metadata if present
   */
  metadata?: ToonPlusMetadata;
  /**
   * Format version
   */
  version?: string;
}

