import type { Result } from './result';

/**
 * Canonical length unit: centimetres. Every stored or computed length is in cm and every
 * field that holds one ends in `Cm`. Feet and inches exist only at UI boundaries.
 */
export type Cm = number;

export type UnitSystem = 'imperial' | 'metric';

export const CM_PER_INCH = 2.54;
export const INCHES_PER_FOOT = 12;

export type NumberParseError = 'EMPTY' | 'NOT_A_NUMBER' | 'NOT_FINITE';
export type LengthParseError = NumberParseError | 'NEGATIVE' | 'NOT_POSITIVE';

const PLAIN_DECIMAL = /^\d+(\.\d+)?$|^\.\d+$/;

/**
 * Parses user-entered text as a non-negative plain decimal.
 *
 * Deliberately strict: an empty field is EMPTY, never 0 (`Number('')` is 0, which would turn
 * an unknown dimension into a zero-sized one). Signs, exponents, hex and separators are rejected.
 */
export function parseDecimal(text: string): Result<number, NumberParseError | 'NEGATIVE'> {
  const trimmed = text.trim();
  if (trimmed === '') return { ok: false, error: 'EMPTY' };
  if (/^-\s*\d/.test(trimmed)) return { ok: false, error: 'NEGATIVE' };
  if (!PLAIN_DECIMAL.test(trimmed)) return { ok: false, error: 'NOT_A_NUMBER' };
  const value = Number(trimmed);
  if (!Number.isFinite(value)) return { ok: false, error: 'NOT_FINITE' };
  return { ok: true, value };
}

/** Parses a length in centimetres that must be greater than zero. */
export function parsePositiveCm(text: string): Result<Cm, LengthParseError> {
  const parsed = parseDecimal(text);
  if (!parsed.ok) return parsed;
  if (parsed.value <= 0) return { ok: false, error: 'NOT_POSITIVE' };
  return parsed;
}

/**
 * Parses a feet + inches pair into centimetres. One field may be left blank when the other is
 * filled in (10 ft and no inches is 10 ft); both blank is EMPTY. The total must be positive.
 */
export function parseFeetInches(
  feetText: string,
  inchesText: string,
): Result<Cm, LengthParseError> {
  const feetBlank = feetText.trim() === '';
  const inchesBlank = inchesText.trim() === '';
  if (feetBlank && inchesBlank) return { ok: false, error: 'EMPTY' };

  let feet = 0;
  let inches = 0;
  if (!feetBlank) {
    const parsed = parseDecimal(feetText);
    if (!parsed.ok) return parsed;
    feet = parsed.value;
  }
  if (!inchesBlank) {
    const parsed = parseDecimal(inchesText);
    if (!parsed.ok) return parsed;
    inches = parsed.value;
  }
  const cm = feetInchesToCm(feet, inches);
  if (!Number.isFinite(cm)) return { ok: false, error: 'NOT_FINITE' };
  if (cm <= 0) return { ok: false, error: 'NOT_POSITIVE' };
  return { ok: true, value: cm };
}

export function inchesToCm(inches: number): Cm {
  return inches * CM_PER_INCH;
}

export function cmToInches(cm: Cm): number {
  return cm / CM_PER_INCH;
}

export function feetInchesToCm(feet: number, inches: number): Cm {
  return inchesToCm(feet * INCHES_PER_FOOT + inches);
}

export interface FeetInches {
  readonly feet: number;
  readonly inches: number;
}

/** Converts for display, rounding to the nearest `inchStep` (default half an inch). */
export function cmToFeetInches(cm: Cm, inchStep = 0.5): FeetInches {
  const totalInches = Math.round(cmToInches(cm) / inchStep) * inchStep;
  const feet = Math.floor(totalInches / INCHES_PER_FOOT);
  const inches = totalInches - feet * INCHES_PER_FOOT;
  return { feet, inches };
}

/** Formats a length for display only. Never parse this back into the model. */
export function formatLength(cm: Cm, system: UnitSystem): string {
  if (system === 'metric') {
    return `${trimNumber(Math.round(cm * 10) / 10)} cm`;
  }
  const { feet, inches } = cmToFeetInches(cm);
  if (feet === 0) return `${trimNumber(inches)} in`;
  return `${feet} ft ${trimNumber(inches)} in`;
}

/** Formats an area given in square centimetres for display. */
export function formatArea(squareCm: number, system: UnitSystem): string {
  if (system === 'metric') {
    return `${trimNumber(Math.round(squareCm / 100) / 100)} m²`;
  }
  const squareFeet = squareCm / (CM_PER_INCH * INCHES_PER_FOOT) ** 2;
  return `${trimNumber(Math.round(squareFeet * 10) / 10)} sq ft`;
}

function trimNumber(value: number): string {
  return String(Number(value.toFixed(2)));
}
