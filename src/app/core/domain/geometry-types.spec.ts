import { degreesToRadians, normalizeDegrees } from './geometry-types';

describe('angles', () => {
  it.each([
    [0, 0],
    [360, 0],
    [-90, 270],
    [450, 90],
    [-360, 0],
  ])('normalizes %d to %d', (input, expected) => {
    expect(normalizeDegrees(input)).toBe(expected);
    expect(Object.is(normalizeDegrees(input), -0)).toBe(false);
  });

  it('converts to radians', () => {
    expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 12);
  });
});
