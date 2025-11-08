import { FastifyRequest, FastifyReply } from 'fastify';

export interface AuthConfig {
  type: 'none' | 'api-key' | 'bearer' | 'basic';
  apiKeyHeader?: string;
  apiKeyValue?: string;
  bearerToken?: string;
  username?: string;
  password?: string;
}

/**
 * Create authentication middleware
 */
export function createAuthMiddleware(config: AuthConfig) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (config.type === 'none') {
      return;
    }

    if (config.type === 'api-key') {
      const apiKey = request.headers[config.apiKeyHeader || 'x-api-key'] as string;
      if (!apiKey || apiKey !== config.apiKeyValue) {
        return reply.code(401).send({ error: 'Unauthorized: Invalid API key' });
      }
    }

    if (config.type === 'bearer') {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({ error: 'Unauthorized: Missing or invalid Bearer token' });
      }
      const token = authHeader.substring(7);
      if (config.bearerToken && token !== config.bearerToken) {
        return reply.code(401).send({ error: 'Unauthorized: Invalid Bearer token' });
      }
    }

    if (config.type === 'basic') {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return reply.code(401).send({ error: 'Unauthorized: Missing or invalid Basic auth' });
      }
      // Basic auth validation would go here
    }
  };
}

