/** A single reason a value was rejected. `path` locates it inside the document. */
export interface ValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly path: string;
}

/** Outcome of validating untrusted input. Invalid input is expected, so it is returned, not thrown. */
export type Validated<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly issues: readonly ValidationIssue[] };

export type Result<T, E> =
  { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E };

export const valid = <T>(value: T): Validated<T> => ({ ok: true, value });

export const invalid = (issues: readonly ValidationIssue[]): Validated<never> => ({
  ok: false,
  issues,
});

export const issue = (code: string, message: string, path = ''): ValidationIssue => ({
  code,
  message,
  path,
});

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** A real, finite number. NaN, Infinity, numeric strings, null and undefined are all rejected. */
export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);
