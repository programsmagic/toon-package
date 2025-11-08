/**
 * Normalized agent schema types
 * Unified representation of OpenAPI and agents.json schemas
 */

export interface AgentParameter {
  name: string;
  type: string;
  description?: string;
  required: boolean;
  schema?: Record<string, unknown>;
  example?: unknown;
  default?: unknown;
}

export interface AgentAction {
  id: string;
  name: string;
  description?: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  parameters: AgentParameter[];
  requestBody?: {
    contentType: string;
    schema: Record<string, unknown>;
  };
  responses?: Record<string, {
    description?: string;
    schema?: Record<string, unknown>;
  }>;
  tags?: string[];
  summary?: string;
}

export interface AgentFlow {
  id: string;
  name: string;
  description?: string;
  steps: AgentFlowStep[];
  triggers?: string[];
}

export interface AgentFlowStep {
  actionId: string;
  condition?: string;
  onSuccess?: string[];
  onError?: string[];
  parameters?: Record<string, unknown>;
}

export interface AgentLink {
  from: string;
  to: string;
  relation: string;
  description?: string;
}

export interface AgentSchema {
  version: string;
  name: string;
  description?: string;
  baseUrl?: string;
  actions: AgentAction[];
  flows?: AgentFlow[];
  links?: AgentLink[];
  metadata?: Record<string, unknown>;
}

/**
 * Schema source information
 */
export interface SchemaSource {
  type: 'openapi' | 'agents-json';
  path: string;
  version?: string;
}

