import { createServer } from '@toon/backend-node';

const server = await createServer({
  port: 3000,
  schemaSource: './schema.json',
  cors: true,
});

// TOON streaming endpoint available at:
// GET /stream/toon?file=data.json&format=json&model=gpt-4

// Format conversion endpoint:
// POST /convert
// Body: { content: "...", from: "json", to: "toon" }

// Optimization endpoint:
// POST /optimize
// Body: { content: "...", model: "gpt-4" }

// Token counting endpoint:
// POST /tokens
// Body: { content: "...", model: "gpt-4" }

await server.start();

