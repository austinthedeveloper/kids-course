import {
  OBSTACLE_TYPES,
  ROOM_MODES,
  SCHEMA_VERSION,
  type Obstacle,
  type ObstacleType,
  type Polygon,
  type Room,
  type RoomMode,
  type Validated,
  type ValidationIssue,
  invalid,
  isId,
  isRecord,
  issue,
  valid,
} from '../domain';
import { isAxisAlignedRectangle, validatePolygon } from '../geometry';

const isNonBlank = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export function validateObstacle(input: unknown, path = ''): Validated<Obstacle> {
  if (!isRecord(input)) return invalid([issue('NOT_AN_OBSTACLE', 'Expected an obstacle.', path)]);
  const at = (field: string) => `${path}${path ? '.' : ''}${field}`;
  const issues: ValidationIssue[] = [];

  if (!isId(input['id'])) issues.push(issue('INVALID_ID', 'Obstacle id is missing.', at('id')));
  if (!isNonBlank(input['label'])) {
    issues.push(issue('INVALID_LABEL', 'Obstacle needs a label.', at('label')));
  }
  if (!OBSTACLE_TYPES.includes(input['type'] as ObstacleType)) {
    issues.push(
      issue('INVALID_OBSTACLE_TYPE', 'Type must be furniture, hazard or keep-clear.', at('type')),
    );
  }

  const shape = validatePolygon(input['shape'], at('shape'));
  if (!shape.ok) issues.push(...shape.issues);

  if (issues.length > 0 || !shape.ok) return invalid(issues);

  return valid({
    id: input['id'] as string,
    label: input['label'] as string,
    type: input['type'] as ObstacleType,
    shape: shape.value,
  });
}

/**
 * Validates a room document from the editor, storage or an import.
 *
 * A document written by a newer app version is rejected rather than guessed at. Older versions
 * are the migration runner's job (EN-011) and must be migrated before they reach this function.
 */
export function validateRoom(input: unknown, path = ''): Validated<Room> {
  if (!isRecord(input)) return invalid([issue('NOT_A_ROOM', 'Expected a room.', path)]);
  const at = (field: string) => `${path}${path ? '.' : ''}${field}`;
  const issues: ValidationIssue[] = [];

  if (!isId(input['id'])) issues.push(issue('INVALID_ID', 'Room id is missing.', at('id')));
  if (!isNonBlank(input['name'])) {
    issues.push(issue('INVALID_NAME', 'Room needs a name.', at('name')));
  }
  if (input['schemaVersion'] !== SCHEMA_VERSION) {
    issues.push(
      issue(
        'UNSUPPORTED_SCHEMA_VERSION',
        `Expected schema version ${SCHEMA_VERSION}.`,
        at('schemaVersion'),
      ),
    );
  }

  const mode = input['mode'] as RoomMode;
  const knownMode = ROOM_MODES.includes(mode);
  if (!knownMode) {
    issues.push(
      issue('INVALID_ROOM_MODE', 'Mode must be unlimited, rectangle or polygon.', at('mode')),
    );
  }

  let boundary: Polygon | undefined;
  if (knownMode && mode === 'unlimited') {
    if (input['boundary'] !== undefined) {
      issues.push(
        issue('UNEXPECTED_BOUNDARY', 'An unlimited room has no boundary.', at('boundary')),
      );
    }
  } else if (knownMode) {
    if (input['boundary'] === undefined) {
      issues.push(issue('MISSING_BOUNDARY', 'This room needs a boundary.', at('boundary')));
    } else {
      const result = validatePolygon(input['boundary'], at('boundary'));
      if (result.ok) {
        boundary = result.value;
        if (mode === 'rectangle' && !isAxisAlignedRectangle(boundary)) {
          issues.push(
            issue(
              'NOT_A_RECTANGLE',
              'A rectangular room needs four square corners.',
              at('boundary'),
            ),
          );
        }
      } else {
        issues.push(...result.issues);
      }
    }
  }

  const obstacles: Obstacle[] = [];
  if (!Array.isArray(input['obstacles'])) {
    issues.push(issue('INVALID_OBSTACLES', 'Obstacles must be a list.', at('obstacles')));
  } else {
    (input['obstacles'] as readonly unknown[]).forEach((candidate, index) => {
      const result = validateObstacle(candidate, `${at('obstacles')}[${index}]`);
      if (result.ok) obstacles.push(result.value);
      else issues.push(...result.issues);
    });
  }

  if (issues.length > 0) return invalid(issues);

  return valid({
    id: input['id'] as string,
    name: input['name'] as string,
    mode,
    obstacles,
    schemaVersion: SCHEMA_VERSION,
    ...(boundary ? { boundary } : {}),
  });
}
