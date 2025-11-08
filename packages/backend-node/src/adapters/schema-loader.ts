import {
  parseOpenAPISchema,
  parseAgentsJsonSchema,
  NormalizedSchema,
} from '@toon/core';

/**
 * Load and parse schema from file or URL
 */
export async function loadSchema(source: string): Promise<NormalizedSchema> {
  // Try to detect schema type from file extension or content
  if (source.endsWith('.json')) {
    // Try agents.json first, then OpenAPI
    try {
      return await parseAgentsJsonSchema(source);
    } catch {
      // Fall back to OpenAPI
      return await parseOpenAPISchema(source);
    }
  } else if (source.endsWith('.yaml') || source.endsWith('.yml')) {
    // OpenAPI YAML
    return await parseOpenAPISchema(source);
  } else if (source.startsWith('http://') || source.startsWith('https://')) {
    // URL - try to detect from content
    try {
      return await parseAgentsJsonSchema(source);
    } catch {
      return await parseOpenAPISchema(source);
    }
  } else {
    // Default to OpenAPI
    return await parseOpenAPISchema(source);
  }
}

