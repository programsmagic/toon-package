import { FastifyInstance } from 'fastify';
import { countTokensInText, countTokensInData, ModelName } from '@programsmagic/toon-tokenizer';

interface TokensRequest {
  Body: {
    content?: string;
    data?: unknown;
    model?: ModelName;
  };
}

/**
 * Register token counting route
 */
export function registerTokensRoute(fastify: FastifyInstance): void {
  fastify.post<TokensRequest>('/tokens', async (request, reply) => {
    try {
      const { content, data, model = 'gpt-4' } = request.body;

      if (!content && !data) {
        return reply.code(400).send({ error: 'Content or data is required' });
      }

      let result;
      if (content) {
        result = countTokensInText(content, model);
      } else if (data) {
        result = countTokensInData(data, model);
      } else {
        return reply.code(400).send({ error: 'Content or data is required' });
      }

      return reply.send(result);
    } catch (error) {
      return reply.code(500).send({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}

