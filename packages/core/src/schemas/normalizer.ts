import { AgentSchema, AgentAction, AgentFlow, AgentLink } from '../types/agent-schema.js';
import { validateAgentSchema } from '../utils/validation.js';

/**
 * Normalize different schema formats into unified AgentSchema
 */

export interface NormalizedSchema {
  schema: AgentSchema;
  source: {
    type: 'openapi' | 'agents-json';
    path: string;
    version?: string;
  };
}

/**
 * Normalize a parsed OpenAPI schema into AgentSchema
 */
export function normalizeOpenAPISchema(
  openApiDoc: Record<string, unknown>,
  sourcePath: string
): NormalizedSchema {
  const actions: AgentAction[] = [];
  const paths = (openApiDoc.paths as Record<string, unknown>) || {};

  // Extract base URL
  const servers = (openApiDoc.servers as Array<{ url: string }>) || [];
  const baseUrl = servers[0]?.url || '';

  // Process each path
  for (const [path, methods] of Object.entries(paths)) {
    const pathMethods = methods as Record<string, unknown>;
    const pathParameters = (pathMethods.parameters as Array<Record<string, unknown>>) || [];

    for (const [method, operation] of Object.entries(pathMethods)) {
      if (!['get', 'post', 'put', 'delete', 'patch', 'head', 'options'].includes(method)) {
        continue;
      }

      const op = operation as Record<string, unknown>;
      const operationId = (op.operationId as string) || `${method}_${path.replace(/\//g, '_')}`;
      const summary = (op.summary as string) || '';
      const description = (op.description as string) || '';
      const tags = (op.tags as string[]) || [];

      // Extract parameters
      const parameters: AgentAction['parameters'] = [];
      const opParameters = (op.parameters as Array<Record<string, unknown>>) || [];
      const allParameters = [...pathParameters, ...opParameters];

      for (const param of allParameters) {
        const paramSchema = (param.schema as Record<string, unknown>) || {};
        parameters.push({
          name: (param.name as string) || '',
          type: (paramSchema.type as string) || 'string',
          description: (param.description as string),
          required: (param.required as boolean) || false,
          schema: paramSchema,
          example: param.example,
        });
      }

      // Extract request body
      let requestBody: AgentAction['requestBody'] | undefined;
      if (op.requestBody) {
        const rb = op.requestBody as Record<string, unknown>;
        const content = (rb.content as Record<string, unknown>) || {};
        const firstContentType = Object.keys(content)[0] || 'application/json';
        const contentSchema = content[firstContentType] as Record<string, unknown>;
        requestBody = {
          contentType: firstContentType,
          schema: (contentSchema.schema as Record<string, unknown>) || {},
        };
      }

      // Extract responses
      const responses: AgentAction['responses'] = {};
      if (op.responses) {
        const opResponses = op.responses as Record<string, unknown>;
        for (const [statusCode, response] of Object.entries(opResponses)) {
          const resp = response as Record<string, unknown>;
          responses[statusCode] = {
            description: resp.description as string,
            schema: (resp.content?.['application/json']?.schema as Record<string, unknown>) || {},
          };
        }
      }

      actions.push({
        id: operationId,
        name: summary || operationId,
        description,
        endpoint: path,
        method: method.toUpperCase() as AgentAction['method'],
        parameters,
        requestBody,
        responses,
        tags,
        summary,
      });
    }
  }

  const schema: AgentSchema = {
    version: (openApiDoc.openapi as string) || '3.0.0',
    name: (openApiDoc.info?.title as string) || 'API',
    description: (openApiDoc.info?.description as string),
    baseUrl,
    actions,
    metadata: {
      openapi: openApiDoc.openapi,
      info: openApiDoc.info,
    },
  };

  if (!validateAgentSchema(schema)) {
    throw new Error('Failed to validate normalized OpenAPI schema');
  }

  return {
    schema,
    source: {
      type: 'openapi',
      path: sourcePath,
      version: schema.version,
    },
  };
}

/**
 * Normalize an agents.json schema into AgentSchema
 */
export function normalizeAgentsJsonSchema(
  agentsJson: Record<string, unknown>,
  sourcePath: string
): NormalizedSchema {
  const actions: AgentAction[] = [];
  const flows: AgentFlow[] = [];
  const links: AgentLink[] = [];

  // Extract actions (from OpenAPI paths if present, or from actions array)
  if (agentsJson.openapi) {
    // If it has OpenAPI embedded, use that
    const openApiNormalized = normalizeOpenAPISchema(agentsJson, sourcePath);
    return {
      ...openApiNormalized,
      source: {
        type: 'agents-json',
        path: sourcePath,
      },
    };
  }

  // Extract from agents.json specific format
  const agentsJsonActions = (agentsJson.actions as Array<Record<string, unknown>>) || [];
  for (const action of agentsJsonActions) {
    actions.push({
      id: (action.id as string) || '',
      name: (action.name as string) || '',
      description: (action.description as string),
      endpoint: (action.endpoint as string) || '',
      method: ((action.method as string)?.toUpperCase() || 'GET') as AgentAction['method'],
      parameters: ((action.parameters as Array<Record<string, unknown>>) || []).map((p) => ({
        name: (p.name as string) || '',
        type: (p.type as string) || 'string',
        description: (p.description as string),
        required: (p.required as boolean) || false,
        schema: (p.schema as Record<string, unknown>) || {},
        example: p.example,
        default: p.default,
      })),
      requestBody: action.requestBody
        ? {
            contentType: ((action.requestBody as Record<string, unknown>).contentType as string) || 'application/json',
            schema: ((action.requestBody as Record<string, unknown>).schema as Record<string, unknown>) || {},
          }
        : undefined,
      tags: (action.tags as string[]) || [],
      summary: (action.summary as string),
    });
  }

  // Extract flows
  const agentsJsonFlows = (agentsJson.flows as Array<Record<string, unknown>>) || [];
  for (const flow of agentsJsonFlows) {
    flows.push({
      id: (flow.id as string) || '',
      name: (flow.name as string) || '',
      description: (flow.description as string),
      steps: ((flow.steps as Array<Record<string, unknown>>) || []).map((step) => ({
        actionId: (step.actionId as string) || '',
        condition: (step.condition as string),
        onSuccess: (step.onSuccess as string[]) || [],
        onError: (step.onError as string[]) || [],
        parameters: (step.parameters as Record<string, unknown>) || {},
      })),
      triggers: (flow.triggers as string[]) || [],
    });
  }

  // Extract links
  const agentsJsonLinks = (agentsJson.links as Array<Record<string, unknown>>) || [];
  for (const link of agentsJsonLinks) {
    links.push({
      from: (link.from as string) || '',
      to: (link.to as string) || '',
      relation: (link.relation as string) || '',
      description: (link.description as string),
    });
  }

  const schema: AgentSchema = {
    version: (agentsJson.version as string) || '1.0.0',
    name: (agentsJson.name as string) || 'Agent API',
    description: (agentsJson.description as string),
    baseUrl: (agentsJson.baseUrl as string),
    actions,
    flows: flows.length > 0 ? flows : undefined,
    links: links.length > 0 ? links : undefined,
    metadata: agentsJson,
  };

  if (!validateAgentSchema(schema)) {
    throw new Error('Failed to validate normalized agents.json schema');
  }

  return {
    schema,
    source: {
      type: 'agents-json',
      path: sourcePath,
      version: schema.version,
    },
  };
}

