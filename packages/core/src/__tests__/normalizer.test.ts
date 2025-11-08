import { normalizeOpenAPISchema, normalizeAgentsJsonSchema } from '../schemas/normalizer.js';
import { validateAgentSchema } from '../utils/validation.js';

describe('normalizer', () => {
  describe('normalizeOpenAPISchema', () => {
    it('should normalize a simple OpenAPI schema', () => {
      const openApiDoc = {
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          version: '1.0.0',
        },
        paths: {
          '/users': {
            get: {
              operationId: 'getUsers',
              summary: 'Get users',
              responses: {
                '200': {
                  description: 'Success',
                },
              },
            },
          },
        },
      };

      const result = normalizeOpenAPISchema(openApiDoc, 'test.json');
      expect(validateAgentSchema(result.schema)).toBe(true);
      expect(result.schema.actions).toHaveLength(1);
      expect(result.schema.actions[0].id).toBe('getUsers');
    });
  });

  describe('normalizeAgentsJsonSchema', () => {
    it('should normalize a simple agents.json schema', () => {
      const agentsJson = {
        version: '1.0.0',
        name: 'Test API',
        actions: [
          {
            id: 'action1',
            name: 'Action 1',
            endpoint: '/action',
            method: 'GET',
            parameters: [],
          },
        ],
      };

      const result = normalizeAgentsJsonSchema(agentsJson, 'test.json');
      expect(validateAgentSchema(result.schema)).toBe(true);
      expect(result.schema.actions).toHaveLength(1);
      expect(result.schema.actions[0].id).toBe('action1');
    });
  });
});

