import { FastifyInstance } from 'fastify';
import websocket from '@fastify/websocket';
import { AgentEvent, EventType } from '@programsmagic/toon-core';
import { EventEmitter } from '../event-emitter.js';
import type { SocketStream } from '@fastify/websocket';

/**
 * Register WebSocket route
 */
export async function registerWebSocketRoute(
  fastify: FastifyInstance,
  eventEmitter: EventEmitter
): Promise<void> {
  await fastify.register(websocket);

  fastify.get('/ws', { websocket: true }, (connection: SocketStream) => {
    // Send connection confirmation
    connection.socket.send(
      JSON.stringify({
        type: 'connected',
        timestamp: Date.now(),
      })
    );

    // Set up event listener
    const handler = (event: AgentEvent) => {
      try {
        if (connection.socket.readyState === 1) { // WebSocket.OPEN
          connection.socket.send(JSON.stringify(event));
        }
      } catch (error) {
        // Client disconnected
        eventEmitter.off(EventType.HEARTBEAT, handler);
      }
    };

    // Listen to all event types
    Object.values(EventType).forEach((eventType) => {
      eventEmitter.on(eventType, handler);
    });

    // Handle incoming messages from client
    connection.socket.on('message', (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        // Handle client messages (e.g., subscribe/unsubscribe to specific events)
        if (data.type === 'subscribe') {
          // Subscribe to specific event types
          // Implementation can be extended
        }
      } catch (error) {
        // Invalid message format
      }
    });

    // Clean up on disconnect
    connection.socket.on('close', () => {
      Object.values(EventType).forEach((eventType) => {
        eventEmitter.off(eventType, handler);
      });
    });
  });
}

