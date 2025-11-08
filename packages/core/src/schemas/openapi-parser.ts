import SwaggerParser from '@apidevtools/swagger-parser';
import { normalizeOpenAPISchema, NormalizedSchema } from './normalizer.js';

/**
 * Parse OpenAPI 3.0 schema from file or URL
 */
export async function parseOpenAPISchema(source: string): Promise<NormalizedSchema> {
  try {
    // Validate and dereference the OpenAPI document
    const api = await SwaggerParser.validate(source, {
      validate: {
        spec: true,
      },
    });

    // Dereference all $ref pointers
    const dereferenced = await SwaggerParser.dereference(api);

    // Normalize to AgentSchema
    return normalizeOpenAPISchema(dereferenced as Record<string, unknown>, source);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse OpenAPI schema: ${error.message}`);
    }
    throw new Error('Failed to parse OpenAPI schema: Unknown error');
  }
}

/**
 * Parse OpenAPI schema from JSON object
 */
export function parseOpenAPISchemaFromObject(
  openApiDoc: Record<string, unknown>,
  sourcePath = 'inline'
): NormalizedSchema {
  try {
    return normalizeOpenAPISchema(openApiDoc, sourcePath);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse OpenAPI schema: ${error.message}`);
    }
    throw new Error('Failed to parse OpenAPI schema: Unknown error');
  }
}

