import {
  type Footprint,
  type Validated,
  invalid,
  isFiniteNumber,
  isRecord,
  issue,
  valid,
} from '../domain';

/**
 * A missing dimension is reported as missing. It is never defaulted, because an unknown size
 * treated as zero would make gear appear to fit anywhere (docs/product/SAFETY.md).
 */
function dimension(input: Record<string, unknown>, field: string, path: string) {
  const value = input[field];
  const at = `${path}${path ? '.' : ''}${field}`;
  if (value === undefined || value === null) {
    return issue('MISSING_DIMENSION', `${field} is required; it cannot be assumed.`, at);
  }
  if (!isFiniteNumber(value)) return issue('INVALID_DIMENSION', `${field} must be a number.`, at);
  if (value <= 0) return issue('INVALID_DIMENSION', `${field} must be greater than zero.`, at);
  return null;
}

export function validateFootprint(input: unknown, path = ''): Validated<Footprint> {
  if (!isRecord(input)) return invalid([issue('NOT_A_FOOTPRINT', 'Expected a footprint.', path)]);

  if (input['kind'] === 'rect') {
    const problems = [dimension(input, 'widthCm', path), dimension(input, 'depthCm', path)].filter(
      (problem) => problem !== null,
    );
    if (problems.length > 0) return invalid(problems);
    return valid({
      kind: 'rect',
      widthCm: input['widthCm'] as number,
      depthCm: input['depthCm'] as number,
    });
  }

  if (input['kind'] === 'circle') {
    const problem = dimension(input, 'diameterCm', path);
    if (problem) return invalid([problem]);
    return valid({ kind: 'circle', diameterCm: input['diameterCm'] as number });
  }

  return invalid([issue('UNKNOWN_FOOTPRINT_KIND', 'Footprint must be a rect or a circle.', path)]);
}
