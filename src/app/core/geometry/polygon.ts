import {
  type Cm,
  type Point,
  type Polygon,
  type Validated,
  type ValidationIssue,
  invalid,
  isFiniteNumber,
  isRecord,
  issue,
  valid,
} from '../domain';
import {
  GEOMETRY_EPSILON_CM,
  cross,
  dot,
  orientation,
  pointsCoincide,
  polygonArea,
  segmentsIntersect,
} from './primitives';

export type PolygonIssueCode =
  | 'NOT_A_POLYGON'
  | 'TOO_FEW_VERTICES'
  | 'NON_FINITE_COORDINATE'
  | 'DUPLICATE_ADJACENT_VERTEX'
  | 'OVERLAPPING_EDGES'
  | 'SELF_INTERSECTION'
  | 'ZERO_AREA';

/** Smallest area, in cm², that still counts as a real shape. */
export const MIN_POLYGON_AREA_CM2 = 1e-6;

/**
 * Validates an outline read from the editor, storage or an import.
 *
 * A valid polygon has at least three finite vertices, no repeated neighbouring vertex, no edge
 * that crosses, touches or overlaps another, and a non-zero area. A vertex lying on a straight
 * wall (collinear with its neighbours) is allowed, because adding a corner starts that way.
 */
export function validatePolygon(input: unknown, path = ''): Validated<Polygon> {
  if (!isRecord(input) || !Array.isArray(input['vertices'])) {
    return invalid([issue('NOT_A_POLYGON', 'Expected an outline with a list of corners.', path)]);
  }
  const raw: readonly unknown[] = input['vertices'];
  const at = (index: number) => `${path}${path ? '.' : ''}vertices[${index}]`;

  if (raw.length < 3) {
    return invalid([
      issue(
        'TOO_FEW_VERTICES',
        `A shape needs at least 3 corners; this one has ${raw.length}.`,
        path,
      ),
    ]);
  }

  const issues: ValidationIssue[] = [];
  const vertices: Point[] = [];
  raw.forEach((candidate, index) => {
    if (isRecord(candidate) && isFiniteNumber(candidate['x']) && isFiniteNumber(candidate['y'])) {
      vertices.push({ x: candidate['x'], y: candidate['y'] });
    } else {
      issues.push(
        issue(
          'NON_FINITE_COORDINATE',
          `Corner ${index + 1} does not have a usable position.`,
          at(index),
        ),
      );
    }
  });
  if (issues.length > 0) return invalid(issues);

  const count = vertices.length;
  const vertex = (index: number): Point => vertices[((index % count) + count) % count]!;

  for (let i = 0; i < count; i += 1) {
    if (pointsCoincide(vertex(i), vertex(i + 1))) {
      issues.push(
        issue(
          'DUPLICATE_ADJACENT_VERTEX',
          `Corners ${i + 1} and ${((i + 1) % count) + 1} are in the same place.`,
          at(i),
        ),
      );
    }
  }
  if (issues.length > 0) return invalid(issues);

  // Neighbouring edges always share a corner; they are only a problem when the outline folds
  // straight back over itself (a wall drawn on top of the previous wall).
  for (let i = 0; i < count; i += 1) {
    const previous = vertex(i - 1);
    const corner = vertex(i);
    const next = vertex(i + 1);
    if (orientation(previous, corner, next) === 0 && dot(corner, previous, next) > 0) {
      issues.push(
        issue(
          'OVERLAPPING_EDGES',
          `The walls meeting at corner ${i + 1} lie on top of each other.`,
          at(i),
        ),
      );
    }
  }

  for (let i = 0; i < count; i += 1) {
    for (let j = i + 1; j < count; j += 1) {
      const adjacent = j === i + 1 || (i === 0 && j === count - 1);
      if (adjacent) continue;
      const a1 = vertex(i);
      const a2 = vertex(i + 1);
      const b1 = vertex(j);
      const b2 = vertex(j + 1);
      if (!segmentsIntersect(a1, a2, b1, b2)) continue;
      const collinear =
        Math.abs(cross(a1, a2, b1)) <= GEOMETRY_EPSILON_CM &&
        Math.abs(cross(a1, a2, b2)) <= GEOMETRY_EPSILON_CM;
      issues.push(
        collinear
          ? issue(
              'OVERLAPPING_EDGES',
              `Walls ${i + 1} and ${j + 1} lie on top of each other.`,
              at(i),
            )
          : issue(
              'SELF_INTERSECTION',
              `Walls ${i + 1} and ${j + 1} cross or touch each other.`,
              at(i),
            ),
      );
    }
  }
  if (issues.length > 0) return invalid(issues);

  if (polygonArea(vertices) <= MIN_POLYGON_AREA_CM2) {
    return invalid([issue('ZERO_AREA', 'The shape has no floor area.', path)]);
  }

  return valid({ vertices });
}

/** Axis-aligned rectangle with its top-left corner at the origin, vertices clockwise on screen. */
export function rectangleToPolygon(widthCm: Cm, lengthCm: Cm): Polygon {
  if (!(Number.isFinite(widthCm) && Number.isFinite(lengthCm) && widthCm > 0 && lengthCm > 0)) {
    throw new RangeError('Rectangle width and length must be finite and greater than zero.');
  }
  return {
    vertices: [
      { x: 0, y: 0 },
      { x: widthCm, y: 0 },
      { x: widthCm, y: lengthCm },
      { x: 0, y: lengthCm },
    ],
  };
}

/** True when the polygon is exactly four corners forming a rectangle aligned with the axes. */
export function isAxisAlignedRectangle(polygon: Polygon): boolean {
  if (polygon.vertices.length !== 4) return false;
  const xs = new Set<number>();
  const ys = new Set<number>();
  for (const point of polygon.vertices) {
    xs.add(point.x);
    ys.add(point.y);
  }
  if (xs.size !== 2 || ys.size !== 2) return false;
  // Two x values and two y values with four distinct corners that alternate along an axis.
  return polygon.vertices.every((point, index) => {
    const next = polygon.vertices[(index + 1) % 4]!;
    return (point.x === next.x) !== (point.y === next.y);
  });
}
