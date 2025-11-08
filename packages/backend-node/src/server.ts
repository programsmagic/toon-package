import Fastify from 'fastify';
import cors from '@fastify/cors';
import { loadSchema } from './adapters/schema-loader.js';
import { registerActionRoutes } from './routes/actions.js';
import { registerStreamRoute } from './routes/stream.js';
import { registerWebSocketRoute } from './routes/websocket.js';
import { EventEmitter } from './event-emitter.js';
import { createAuthMiddleware, AuthConfig } from './middleware/auth.js';

export interface ServerOptions {
  port?: number;
  host?: string;
  schemaSource: string;
  auth?: AuthConfig;
  cors?: boolean | { origin: string | string[] };
}

/**
 * Create and configure Fastify server
 */
export async function createServer(options: ServerOptions) {
  const fastify = Fastify({
    logger: true,
  });

  // Register CORS if enabled
  if (options.cors) {
    await fastify.register(cors, {
      origin: options.cors === true ? true : options.cors.origin,
    });
  }

  // Load schema
  const normalizedSchema = await loadSchema(options.schemaSource);
  const schema = normalizedSchema.schema;

  // Create event emitter
  const eventEmitter = new EventEmitter();

  // Register auth middleware if configured
  if (options.auth && options.auth.type !== 'none') {
    const authMiddleware = createAuthMiddleware(options.auth);
    fastify.addHook('onRequest', authMiddleware);
  }

  // Register routes
  registerActionRoutes(fastify, schema, eventEmitter);
  registerStreamRoute(fastify, eventEmitter);
  await registerWebSocketRoute(fastify, eventEmitter);
  
  // Register TOON format routes
  const { registerToonStreamRoute } = await import('./routes/toon-stream.js');
  const { registerFormatConvertRoute } = await import('./routes/format-convert.js');
  const { registerOptimizeRoute } = await import('./routes/optimize.js');
  const { registerTokensRoute } = await import('./routes/tokens.js');
  
  registerToonStreamRoute(fastify, eventEmitter);
  registerFormatConvertRoute(fastify);
  registerOptimizeRoute(fastify);
  registerTokensRoute(fastify);

  // Health check endpoint
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      schema: {
        name: schema.name,
        version: schema.version,
        actions: schema.actions.length,
        flows: schema.flows?.length || 0,
      },
    };
  });

  // Schema info endpoint
  fastify.get('/schema', async () => {
    return {
      ...schema,
      source: normalizedSchema.source,
    };
  });

  return {
    fastify,
    schema,
    eventEmitter,
    start: async () => {
      try {
        await fastify.listen({
          port: options.port || 3000,
          host: options.host || '0.0.0.0',
        });
        console.log(`Server listening on http://${options.host || '0.0.0.0'}:${options.port || 3000}`);
      } catch (error) {
        fastify.log.error(error);
        process.exit(1);
      }
    },
  };
}

