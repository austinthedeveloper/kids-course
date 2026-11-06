import { createId, isGeneratedId, isId } from './ids';

describe('ids', () => {
  it('creates unique prefixed ids', () => {
    const a = createId('room');
    expect(a.startsWith('room_')).toBe(true);
    expect(isGeneratedId(a)).toBe(true);
    expect(createId('room')).not.toBe(a);
  });

  it('rejects an unusable prefix', () => {
    expect(() => createId('Bad Prefix')).toThrow(RangeError);
  });

  it('accepts readable ids but not blank or non-string ones', () => {
    expect(isId('obstacle-couch')).toBe(true);
    expect(isGeneratedId('obstacle-couch')).toBe(false);
    for (const bad of ['', 'has space', 7, null, undefined]) {
      expect(isId(bad)).toBe(false);
    }
  });
});
