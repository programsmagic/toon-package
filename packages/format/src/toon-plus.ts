/**
 * TOON+ extensions (structural index, metadata, comments)
 */
import { ToonPlusMetadata } from './types.js';
import { calculateHash } from './utils.js';

/**
 * Create TOON+ metadata
 */
export function createToonPlusMetadata(
  content: string,
  options: {
    includeIndex?: boolean;
    includeMetadata?: boolean;
    includeComments?: boolean;
    customMetadata?: Record<string, unknown>;
    comments?: Record<string, string>;
  } = {}
): ToonPlusMetadata {
  const {
    includeIndex = true,
    includeMetadata = true,
    includeComments = false,
    customMetadata = {},
    comments = {},
  } = options;

  const metadata: ToonPlusMetadata = {};

  if (includeIndex) {
    metadata.index = calculateHash(content);
    metadata.length = content.length;
  }

  if (includeMetadata) {
    metadata.metadata = {
      encoded: new Date().toISOString(),
      version: '1.0',
      ...customMetadata,
    };
  }

  if (includeComments && Object.keys(comments).length > 0) {
    metadata.comments = comments;
  }

  return metadata;
}

/**
 * Validate TOON+ metadata
 */
export function validateToonPlusMetadata(
  content: string,
  metadata: ToonPlusMetadata
): boolean {
  if (metadata.index) {
    const calculatedHash = calculateHash(content);
    if (calculatedHash !== metadata.index) {
      return false;
    }
  }

  if (metadata.length !== undefined && metadata.length !== content.length) {
    return false;
  }

  return true;
}

/**
 * Extract TOON+ metadata from TOON string
 */
export function extractToonPlusMetadata(toon: string): {
  metadata?: ToonPlusMetadata;
  content: string;
} {
  if (!toon.startsWith('#toon+')) {
    return { content: toon };
  }

  const lines = toon.split('\n');
  const metadataLine = lines[0];
  const metadataStr = metadataLine.replace('#toon+ ', '');
  const content = lines.slice(1).join('\n');

  try {
    const metadata = JSON.parse(metadataStr) as ToonPlusMetadata;
    return { metadata, content };
  } catch {
    return { content: toon };
  }
}

