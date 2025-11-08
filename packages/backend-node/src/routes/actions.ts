import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AgentSchema, AgentAction, EventType } from '@toon/core';
import { EventEmitter } from '../event-emitter.js';

interface ActionRequest {
  Params: {
    actionId: string;
  };
  Body?: unknown;
  Querystring?: Record<string, unknown>;
}

/**
 * Register action routes from agent schema
 */
export function registerActionRoutes(
  fastify: FastifyInstance,
  schema: AgentSchema,
  eventEmitter: EventEmitter
): void {
  for (const action of schema.actions) {
    const routeHandler = createActionHandler(action, eventEmitter, schema.baseUrl);

    // Register route based on method
    switch (action.method) {
      case 'GET':
        fastify.get(action.endpoint, routeHandler);
        break;
      case 'POST':
        fastify.post(action.endpoint, routeHandler);
        break;
      case 'PUT':
        fastify.put(action.endpoint, routeHandler);
        break;
      case 'DELETE':
        fastify.delete(action.endpoint, routeHandler);
        break;
      case 'PATCH':
        fastify.patch(action.endpoint, routeHandler);
        break;
      case 'HEAD':
        fastify.head(action.endpoint, routeHandler);
        break;
      case 'OPTIONS':
        fastify.options(action.endpoint, routeHandler);
        break;
    }
  }
}

function createActionHandler(
  action: AgentAction,
  eventEmitter: EventEmitter,
  baseUrl?: string
) {
  return async (request: FastifyRequest<ActionRequest>, reply: FastifyReply) => {
    const actionId = `${action.id}_${Date.now()}`;
    const startTime = Date.now();

    // Emit action start event
    eventEmitter.emit({
      type: EventType.ACTION_START,
      timestamp: Date.now(),
      id: actionId,
      actionId,
      actionName: action.name,
      endpoint: action.endpoint,
      method: action.method,
      parameters: {
        ...(request.query as Record<string, unknown>),
        ...(request.params as Record<string, unknown>),
        ...(request.body as Record<string, unknown>),
      },
    });

    try {
      // Build full URL if baseUrl is provided
      const fullUrl = baseUrl ? `${baseUrl}${action.endpoint}` : action.endpoint;

      // In a real implementation, this would make an actual HTTP request
      // For now, we'll simulate it
      const response = await executeAction(action, request, fullUrl);

      const duration = Date.now() - startTime;

      // Emit action end event
      eventEmitter.emit({
        type: EventType.ACTION_END,
        timestamp: Date.now(),
        id: `${actionId}_end`,
        actionId,
        response,
        statusCode: 200,
        success: true,
        duration,
      });

      return reply.send(response);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Emit error event
      eventEmitter.emit({
        type: EventType.ACTION_END,
        timestamp: Date.now(),
        id: `${actionId}_end`,
        actionId,
        success: false,
        error: errorMessage,
        duration,
      });

      return reply.code(500).send({ error: errorMessage });
    }
  };
}

async function executeAction(
  action: AgentAction,
  request: FastifyRequest<ActionRequest>,
  fullUrl: string
): Promise<unknown> {
  // In a real implementation, this would:
  // 1. Build the request URL with query parameters
  // 2. Make an HTTP request to the actual backend
  // 3. Return the response

  // For now, return a mock response
  return {
    action: action.id,
    endpoint: action.endpoint,
    method: action.method,
    parameters: {
      ...(request.query as Record<string, unknown>),
      ...(request.params as Record<string, unknown>),
      ...(request.body as Record<string, unknown>),
    },
    message: 'This is a mock response. In production, this would call the actual backend.',
  };
}

