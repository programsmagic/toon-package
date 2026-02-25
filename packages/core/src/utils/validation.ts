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

export interface ValidationResult<T = unknown> {
  success: boolean;
  data?: T;
  errors?: Array<{ path: string; message: string }>;
}

/**
 * Validate an agent schema
 */
export function validateAgentSchema(schema: unknown): schema is AgentSchema {
  return safeValidateAgentSchema(schema).success;
}

/**
 * Validate an agent schema and return detailed errors
 */
export function safeValidateAgentSchema(schema: unknown): ValidationResult<AgentSchema> {
  const result = AgentSchemaSchema.safeParse(schema);
  if (result.success) {
    return { success: true, data: result.data as AgentSchema };
  }
  const errors = result.error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
  log.error('Schema validation errors', result.error);
  return { success: false, errors };
}

/**
 * Validate an agent action
 */
export function validateAgentAction(action: unknown): action is AgentAction {
  return safeValidateAgentAction(action).success;
}

/**
 * Validate an agent action and return detailed errors
 */
export function safeValidateAgentAction(action: unknown): ValidationResult<AgentAction> {
  const result = AgentActionSchema.safeParse(action);
  if (result.success) {
    return { success: true, data: result.data as AgentAction };
  }
  return {
    success: false,
    errors: result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  };
}

/**
 * Validate an agent flow
 */
export function validateAgentFlow(flow: unknown): flow is AgentFlow {
  return safeValidateAgentFlow(flow).success;
}

/**
 * Validate an agent flow and return detailed errors
 */
export function safeValidateAgentFlow(flow: unknown): ValidationResult<AgentFlow> {
  const result = AgentFlowSchema.safeParse(flow);
  if (result.success) {
    return { success: true, data: result.data as AgentFlow };
  }
  return {
    success: false,
    errors: result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  };
}

