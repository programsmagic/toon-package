import { FastifyInstance } from 'fastify';
import { convert, selectOptimalFormat } from '@programsmagic/toon-converter';
import { countTokensInData, ModelName } from '@programsmagic/toon-tokenizer';

interface OptimizeRequest {
  Body: {
    content: string;
    from?: string;
    model?: ModelName;
  };
}

/**
 * Register format optimization route
 */
export function registerOptimizeRoute(fastify: FastifyInstance): void {
  fastify.post<OptimizeRequest>('/optimize', async (request, reply) => {
    try {
      const { content, from, model = 'gpt-4' } = request.body;

      if (!content) {
        return reply.code(400).send({ error: 'Content is required' });
      }

      // Parse data
      let data: unknown;
      try {
        data = from === 'json' ? JSON.parse(content) : JSON.parse(content);
      } catch {
        return reply.code(400).send({ error: 'Invalid JSON content' });
      }

      // Select optimal format
      const selection = selectOptimalFormat(data);

      // Convert to optimal format
      const result = await convert(content, {
        from: from as any,
        to: selection.recommended,
      });

      // Calculate token savings
      const originalTokens = countTokensInData(data, model);
      const optimizedData = JSON.parse(result.content);
      const optimizedTokens = countTokensInData(optimizedData, model);
      const savings = originalTokens.tokens - optimizedTokens.tokens;
      const percentage = originalTokens.tokens > 0
        ? (savings / originalTokens.tokens) * 100
        : 0;

      return reply.send({
        recommended: selection.recommended,
        alternatives: selection.alternatives,
        content: result.content,
        savings: {
          tokens: savings,
          percentage: Math.round(percentage * 100) / 100,
        },
        original: {
          tokens: originalTokens.tokens,
          cost: originalTokens.estimatedCost,
        },
        optimized: {
          tokens: optimizedTokens.tokens,
          cost: optimizedTokens.estimatedCost,
        },
      });
    } catch (error) {
      return reply.code(500).send({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}

