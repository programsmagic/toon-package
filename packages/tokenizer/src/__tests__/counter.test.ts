import { countTokensInText } from '../counter.js';

describe('countTokensInText', () => {
  it('should count tokens in text', () => {
    const result = countTokensInText('Hello, world!', 'gpt-4');
    expect(result.tokens).toBeGreaterThan(0);
    expect(result.characters).toBe(13);
    expect(result.model).toBe('gpt-4');
  });

  it('should estimate cost', () => {
    const result = countTokensInText('Hello, world!', 'gpt-4');
    expect(result.estimatedCost).toBeDefined();
    expect(result.estimatedCost?.input).toBeGreaterThan(0);
  });
});

