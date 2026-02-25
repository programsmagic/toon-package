import { FastifyInstance, FastifyRequest } from 'fastify';
import { AgentEvent, EventType } from '@programsmagic/toon-core';
import { EventEmitter } from '../event-emitter.js';

/**
 * Register SSE streaming route
 */
export function registerStreamRoute(fastify: FastifyInstance, eventEmitter: EventEmitter): void {
  fastify.get('/events', async (request: FastifyRequest, reply) => {
    // Set SSE headers
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.setHeader('X-Accel-Buffering', 'no');

    // Send initial connection event
    reply.raw.write(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`);

    // Set up event listener
    const handler = (event: AgentEvent) => {
      try {
        reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
      } catch {
        Object.values(EventType).forEach((eventType) => {
          eventEmitter.off(eventType, handler);
        });
        return;
      }
    };

    // Listen to all event types
    Object.values(EventType).forEach((eventType) => {
      eventEmitter.on(eventType, handler);
    });

    // Send heartbeat every 30 seconds
    const heartbeatInterval = setInterval(() => {
      try {
        eventEmitter.emit({
          type: EventType.HEARTBEAT,
          timestamp: Date.now(),
          id: `heartbeat_${Date.now()}`,
        });
      } catch (error) {
        clearInterval(heartbeatInterval);
      }
    }, 30000);

    // Clean up on disconnect
    request.raw.on('close', () => {
      clearInterval(heartbeatInterval);
      Object.values(EventType).forEach((eventType) => {
        eventEmitter.off(eventType, handler);
      });
    });
  });
}

