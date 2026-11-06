import fc from 'fast-check';
import {
  cmToFeetInches,
  feetInchesToCm,
  formatArea,
  formatLength,
  parseDecimal,
  parseFeetInches,
  parsePositiveCm,
} from './units';

describe('parseDecimal', () => {
  it('never turns blank input into zero', () => {
    expect(parseDecimal('')).toEqual({ ok: false, error: 'EMPTY' });
    expect(parseDecimal('   ')).toEqual({ ok: false, error: 'EMPTY' });
  });

  it.each(['abc', '1e3', '0x10', '1,5', '1.2.3', 'Infinity', 'NaN', '+5', '5 ft'])(
    'rejects %s',
    (text) => {
      expect(parseDecimal(text)).toEqual({ ok: false, error: 'NOT_A_NUMBER' });
    },
  );

  it('reports negatives distinctly', () => {
    expect(parseDecimal('-5')).toEqual({ ok: false, error: 'NEGATIVE' });
  });

  it('accepts plain decimals', () => {
    expect(parseDecimal(' 12.5 ')).toEqual({ ok: true, value: 12.5 });
    expect(parseDecimal('.5')).toEqual({ ok: true, value: 0.5 });
  });

  it('rejects overflow', () => {
    expect(parseDecimal('9'.repeat(400))).toEqual({ ok: false, error: 'NOT_FINITE' });
  });
});

describe('parsePositiveCm', () => {
  it('rejects zero', () => {
    expect(parsePositiveCm('0')).toEqual({ ok: false, error: 'NOT_POSITIVE' });
  });
});

describe('parseFeetInches', () => {
  it('needs at least one field', () => {
    expect(parseFeetInches('', ' ')).toEqual({ ok: false, error: 'EMPTY' });
  });

  it('allows one blank field', () => {
    expect(parseFeetInches('10', '')).toEqual({ ok: true, value: 304.8 });
    expect(parseFeetInches('', '6')).toEqual({ ok: true, value: 15.24 });
  });

  it('rejects a zero total and bad parts', () => {
    expect(parseFeetInches('0', '0')).toEqual({ ok: false, error: 'NOT_POSITIVE' });
    expect(parseFeetInches('ten', '6')).toEqual({ ok: false, error: 'NOT_A_NUMBER' });
    expect(parseFeetInches('10', '-1')).toEqual({ ok: false, error: 'NEGATIVE' });
  });
});

describe('length conversion', () => {
  it('converts 10 ft 6 in to 320.04 cm and back', () => {
    const cm = feetInchesToCm(10, 6);
    expect(cm).toBeCloseTo(320.04, 10);
    expect(cmToFeetInches(cm)).toEqual({ feet: 10, inches: 6 });
    expect(formatLength(cm, 'imperial')).toBe('10 ft 6 in');
  });

  it('carries rounding up into the next foot instead of showing 12 in', () => {
    expect(cmToFeetInches(feetInchesToCm(0, 11.9))).toEqual({ feet: 1, inches: 0 });
  });

  it('round-trips any half-inch length through feet and inches', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 20_000 }), (halfInches) => {
        const inches = halfInches / 2;
        const shown = cmToFeetInches(feetInchesToCm(0, inches));
        expect(shown.inches).toBeGreaterThanOrEqual(0);
        expect(shown.inches).toBeLessThan(12);
        expect(shown.feet * 12 + shown.inches).toBe(inches);
      }),
    );
  });

  it('formats for display', () => {
    expect(formatLength(320.04, 'metric')).toBe('320 cm');
    expect(formatLength(15.24, 'imperial')).toBe('6 in');
    expect(formatArea(120_000, 'metric')).toBe('12 m²');
    expect(formatArea(120_000, 'imperial')).toBe('129.2 sq ft');
  });
});
