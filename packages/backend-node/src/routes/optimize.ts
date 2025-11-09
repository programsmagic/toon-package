import { FastifyInstance } from 'fastify';
import { convert, selectOptimalFormat, type SupportedFormat } from '@programsmagic/toon-converter';
import { countTokensInData, type ModelName } from '@programsmagic/toon-tokenizer';

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
        data = JSON.parse(content);
      } catch (parseError) {
        return reply.code(400).send({ 
          error: 'Invalid JSON content',
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
        });
      }

      // Select optimal format
      const selection = selectOptimalFormat(data);

      // Convert to optimal format
      const result = await convert(content, {
        from: (from || 'json') as SupportedFormat,
        to: selection.recommended,
      });

      // Calculate token savings
      const originalTokens = countTokensInData(data, model);
      let optimizedData: unknown;
      try {
        optimizedData = JSON.parse(result.content);
      } catch (parseError) {
        return reply.code(500).send({
          error: 'Failed to parse optimized content',
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
        });
      }
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error && process.env.NODE_ENV !== 'production' 
        ? error.stack 
        : undefined;
      
      return reply.code(500).send({
        error: errorMessage,
        ...(errorStack && { stack: errorStack }),
      });
    }
  });
}

