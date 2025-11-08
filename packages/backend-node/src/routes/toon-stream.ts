import { FastifyInstance, FastifyRequest } from 'fastify';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { encodeToon } from '@toon/format';
import { parseToon } from '@toon/format';
import { convert } from '@toon/converter';
import { countTokensInText } from '@toon/tokenizer';
import { EventEmitter } from '../event-emitter.js';
import { EventType } from '@toon/core';

/**
 * Register TOON format streaming route
 */
export function registerToonStreamRoute(fastify: FastifyInstance, eventEmitter: EventEmitter): void {
  fastify.get('/stream/toon', async (request: FastifyRequest, reply) => {
    const { file, format = 'json', model = 'gpt-4' } = request.query as {
      file?: string;
      format?: string;
      model?: string;
    };

    if (!file) {
      return reply.code(400).send({ error: 'File parameter required' });
    }

    if (!existsSync(file)) {
      return reply.code(404).send({ error: 'File not found' });
    }

    // Set SSE headers
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.setHeader('X-Accel-Buffering', 'no');

    try {
      const content = await readFile(file, 'utf-8');
      
      // Convert to TOON if needed
      let toonContent: string;
      if (format === 'toon') {
        toonContent = content;
      } else {
        const result = await convert(content, {
          from: format as any,
          to: 'toon',
          toon: { minimize: true },
        });
        toonContent = result.content;
      }

      // Stream TOON content row-by-row (for arrays)
      const lines = toonContent.split('\n');
      let rowIndex = 0;

      // Send initial event
      reply.raw.write(`data: ${JSON.stringify({ type: 'start', totalRows: lines.length })}\n\n`);

      // Stream rows
      for (const line of lines) {
        if (line.trim()) {
          const rowEvent = {
            type: 'row',
            index: rowIndex,
            content: line,
            tokens: countTokensInText(line, model as any).tokens,
          };
          reply.raw.write(`data: ${JSON.stringify(rowEvent)}\n\n`);
          rowIndex++;
        }
      }

      // Send completion event
      reply.raw.write(`data: ${JSON.stringify({ type: 'complete', totalRows: rowIndex })}\n\n`);
    } catch (error) {
      reply.raw.write(
        `data: ${JSON.stringify({ type: 'error', error: error instanceof Error ? error.message : 'Unknown error' })}\n\n`
      );
    }
  });
}

