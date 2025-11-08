import { FastifyInstance } from 'fastify';
import { convert } from '@toon/converter';
import { SupportedFormat } from '@toon/converter';

interface ConvertRequest {
  Body: {
    content: string;
    from?: SupportedFormat;
    to: SupportedFormat;
    options?: {
      csv?: { header?: boolean; delimiter?: string };
      toon?: { minimize?: boolean; toonPlus?: boolean };
      yaml?: { indent?: number; lineWidth?: number };
    };
  };
}

/**
 * Register format conversion route
 */
export function registerFormatConvertRoute(fastify: FastifyInstance): void {
  fastify.post<ConvertRequest>('/convert', async (request, reply) => {
    try {
      const { content, from, to, options } = request.body;

      if (!content) {
        return reply.code(400).send({ error: 'Content is required' });
      }

      if (!to) {
        return reply.code(400).send({ error: 'Target format (to) is required' });
      }

      const result = await convert(content, {
        from,
        to,
        ...options,
      });

      return reply.send({
        content: result.content,
        detectedFormat: result.detectedFormat,
        metadata: result.metadata,
      });
    } catch (error) {
      return reply.code(500).send({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}

