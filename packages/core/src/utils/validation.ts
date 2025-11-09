import { z } from 'zod';
import { AgentSchema, AgentAction, AgentFlow } from '../types/agent-schema.js';
import { log } from './logger.js';

/**
 * Zod schemas for runtime validation
 */

export const AgentParameterSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
  required: z.boolean(),
  schema: z.record(z.unknown()).optional(),
  example: z.unknown().optional(),
  default: z.unknown().optional(),
});

export const AgentActionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  endpoint: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']),
  parameters: z.array(AgentParameterSchema),
  requestBody: z
    .object({
      contentType: z.string(),
      schema: z.record(z.unknown()),
    })
    .optional(),
  responses: z
    .record(
      z.object({
        description: z.string().optional(),
        schema: z.record(z.unknown()).optional(),
      })
    )
    .optional(),
  tags: z.array(z.string()).optional(),
  summary: z.string().optional(),
});

export const AgentFlowStepSchema = z.object({
  actionId: z.string(),
  condition: z.string().optional(),
  onSuccess: z.array(z.string()).optional(),
  onError: z.array(z.string()).optional(),
  parameters: z.record(z.unknown()).optional(),
});

export const AgentFlowSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  steps: z.array(AgentFlowStepSchema),
  triggers: z.array(z.string()).optional(),
});

export const AgentLinkSchema = z.object({
  from: z.string(),
  to: z.string(),
  relation: z.string(),
  description: z.string().optional(),
});

export const AgentSchemaSchema = z.object({
  version: z.string(),
  name: z.string(),
  description: z.string().optional(),
  baseUrl: z.string().url().optional(),
  actions: z.array(AgentActionSchema),
  flows: z.array(AgentFlowSchema).optional(),
  links: z.array(AgentLinkSchema).optional(),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Validate an agent schema
 */
export function validateAgentSchema(schema: unknown): schema is AgentSchema {
  try {
    AgentSchemaSchema.parse(schema);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      log.error('Schema validation errors', error);
    }
    return false;
  }
}

/**
 * Validate an agent action
 */
export function validateAgentAction(action: unknown): action is AgentAction {
  try {
    AgentActionSchema.parse(action);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate an agent flow
 */
export function validateAgentFlow(flow: unknown): flow is AgentFlow {
  try {
    AgentFlowSchema.parse(flow);
    return true;
  } catch {
    return false;
  }
}

