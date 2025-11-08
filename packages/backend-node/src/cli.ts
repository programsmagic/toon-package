#!/usr/bin/env node

import { createServer } from './server.js';
import { parseArgs } from 'util';

const args = parseArgs({
  options: {
    port: { type: 'string', short: 'p', default: '3000' },
    host: { type: 'string', short: 'h', default: '0.0.0.0' },
    schema: { type: 'string', short: 's', default: './schema.json' },
    cors: { type: 'boolean', short: 'c', default: true },
    help: { type: 'boolean', short: '?' },
  },
  allowPositionals: true,
});

if (args.values.help) {
  console.log(`
Usage: toon-bridge [options] [schema-file]

Options:
  -p, --port <port>     Port to listen on (default: 3000)
  -h, --host <host>     Host to bind to (default: 0.0.0.0)
  -s, --schema <file>   Path to schema file (default: ./schema.json)
  -c, --cors            Enable CORS (default: true)
  -?, --help            Show this help message

Examples:
  toon-bridge -p 8080 ./openapi.json
  toon-bridge --schema https://api.example.com/openapi.json
`);
  process.exit(0);
}

const schemaSource = args.positionals[0] || args.values.schema || './schema.json';

createServer({
  port: parseInt(args.values.port || '3000', 10),
  host: args.values.host || '0.0.0.0',
  schemaSource,
  cors: args.values.cors !== false,
})
  .then((server) => server.start())
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

