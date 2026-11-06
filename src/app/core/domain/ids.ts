/** Stable identifier for a persisted document or a part of one. Opaque: never parse meaning out of it. */
export type Id = string;

const ID_PATTERN = /^[a-z][a-z0-9]*_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * Creates a new collision-resistant id such as `room_3f2b…`.
 *
 * Not deterministic, so the generator must not call it: generated courses take their ids from
 * the seeded random source instead (ADR-0003).
 */
export function createId(prefix: string): Id {
  if (!/^[a-z][a-z0-9]*$/.test(prefix)) {
    throw new RangeError(`Id prefix must be lowercase alphanumeric, got "${prefix}"`);
  }
  return `${prefix}_${globalThis.crypto.randomUUID()}`;
}

/** True for ids produced by {@link createId}. Fixture and catalog ids may use other readable forms. */
export function isGeneratedId(value: unknown): value is Id {
  return typeof value === 'string' && ID_PATTERN.test(value);
}

/** Minimum bar for any id read from storage or import: a non-empty string without whitespace. */
export function isId(value: unknown): value is Id {
  return typeof value === 'string' && value.length > 0 && !/\s/.test(value);
}
