import { convert } from '../converter.js';

describe('convert', () => {
  it('should convert JSON to TOON', () => {
    const json = JSON.stringify({ user: { id: 123, name: 'Ada' } });
    const result = convert(json, {
      from: 'json',
      to: 'toon',
    });
    expect(result.content).toBeDefined();
    expect(result.detectedFormat).toBe('json');
  });

  it('should auto-detect format', () => {
    const json = JSON.stringify({ user: { id: 123 } });
    const result = convert(json, {
      to: 'toon',
    });
    expect(result.detectedFormat).toBe('json');
  });
});

