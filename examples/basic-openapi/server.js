import { createServer } from '@programsmagic/toon-backend-node';

const server = await createServer({
  port: 3000,
  host: '0.0.0.0',
  schemaSource: './openapi.json',
  cors: true,
});

await server.start();

