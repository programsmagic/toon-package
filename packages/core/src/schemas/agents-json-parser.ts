import { readFile } from 'fs/promises';
import { normalizeAgentsJsonSchema, NormalizedSchema } from './normalizer.js';

/**
 * Parse agents.json schema from file or URL
 */
export async function parseAgentsJsonSchema(source: string): Promise<NormalizedSchema> {
  try {
    let agentsJson: Record<string, unknown>;

    // Check if it's a URL
    if (source.startsWith('http://') || source.startsWith('https://')) {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to fetch agents.json: ${response.statusText}`);
      }
      agentsJson = (await response.json()) as Record<string, unknown>;
    } else {
      // Read from file
      const content = await readFile(source, 'utf-8');
      agentsJson = JSON.parse(content) as Record<string, unknown>;
    }

    // Normalize to AgentSchema
    return normalizeAgentsJsonSchema(agentsJson, source);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse agents.json schema: ${error.message}`);
    }
    throw new Error('Failed to parse agents.json schema: Unknown error');
  }
}

/**
 * Parse agents.json schema from JSON object
 */
export function parseAgentsJsonSchemaFromObject(
  agentsJson: Record<string, unknown>,
  sourcePath = 'inline'
): NormalizedSchema {
  try {
    return normalizeAgentsJsonSchema(agentsJson, sourcePath);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse agents.json schema: ${error.message}`);
    }
    throw new Error('Failed to parse agents.json schema: Unknown error');
  }
}

