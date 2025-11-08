import { validateAgentSchema, validateAgentAction } from '../utils/validation.js';

describe('validation', () => {
  describe('validateAgentSchema', () => {
    it('should validate a valid schema', () => {
      const schema = {
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

      expect(validateAgentSchema(schema)).toBe(true);
    });

    it('should reject an invalid schema', () => {
      const schema = {
        version: '1.0.0',
        // Missing name
        actions: [],
      };

      expect(validateAgentSchema(schema)).toBe(false);
    });
  });

  describe('validateAgentAction', () => {
    it('should validate a valid action', () => {
      const action = {
        id: 'action1',
        name: 'Action 1',
        endpoint: '/action',
        method: 'GET',
        parameters: [],
      };

      expect(validateAgentAction(action)).toBe(true);
    });

    it('should reject an invalid action', () => {
      const action = {
        id: 'action1',
        // Missing required fields
      };

      expect(validateAgentAction(action)).toBe(false);
    });
  });
});

