import { encodeToon } from '../encoder.js';

describe('encodeToon', () => {
  it('should encode simple object', () => {
    const data = { user: { id: 123, name: 'Ada' } };
    const toon = encodeToon(data);
    expect(toon).toContain('user');
    expect(toon).toContain('id 123');
    expect(toon).toContain('name Ada');
  });

  it('should encode array', () => {
    const data = { tags: ['reading', 'gaming'] };
    const toon = encodeToon(data);
    expect(toon).toContain('tags');
    expect(toon).toContain('reading');
    expect(toon).toContain('gaming');
  });

  it('should minimize output', () => {
    const data = { user: { id: 123, name: 'Ada' } };
    const toon = encodeToon(data, { minimize: true });
    expect(toon).not.toContain('\n');
  });

  it('should include TOON+ metadata', () => {
    const data = { user: { id: 123 } };
    const toon = encodeToon(data, { toonPlus: true, includeIndex: true });
    expect(toon).toContain('#toon+');
  });
});

