import { parseToon } from '../parser.js';

describe('parseToon', () => {
  it('should parse simple object', () => {
    const toon = 'user id 123 name Ada';
    const result = parseToon(toon);
    expect(result.data).toEqual({ user: { id: 123, name: 'Ada' } });
  });

  it('should parse array', () => {
    const toon = 'tags [reading gaming]';
    const result = parseToon(toon);
    expect(result.data).toEqual({ tags: ['reading', 'gaming'] });
  });

  it('should parse TOON+ metadata', () => {
    const toon = '#toon+ {"index":"abc123","length":10}\nuser id 123';
    const result = parseToon(toon, { validateIndex: false });
    expect(result.metadata).toBeDefined();
    expect(result.metadata?.index).toBe('abc123');
  });
});

