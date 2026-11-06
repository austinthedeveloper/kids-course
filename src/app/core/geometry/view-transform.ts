import type { Point } from '../domain';
import type { BoundingBox } from './primitives';

/**
 * Maps world centimetres to screen pixels: `screen = world * scale + offset`.
 *
 * This is presentation state only. Geometry is stored and validated in world space; pixels are
 * never persisted (ADR-0002).
 */
export interface ViewTransform {
  /** Pixels per centimetre. Always finite and greater than zero. */
  readonly scale: number;
  readonly offsetX: number;
  readonly offsetY: number;
}

export interface ScreenPoint {
  readonly x: number;
  readonly y: number;
}

export interface ScaleLimits {
  readonly min: number;
  readonly max: number;
}

/** 0.2 px/cm shows a 30 m span on a phone; 8 px/cm makes one grid cell 120 px wide. */
export const DEFAULT_SCALE_LIMITS: ScaleLimits = { min: 0.2, max: 8 };

export const IDENTITY_VIEW: ViewTransform = { scale: 1, offsetX: 0, offsetY: 0 };

export function worldToScreen(view: ViewTransform, world: Point): ScreenPoint {
  return { x: world.x * view.scale + view.offsetX, y: world.y * view.scale + view.offsetY };
}

export function screenToWorld(view: ViewTransform, screen: ScreenPoint): Point {
  return { x: (screen.x - view.offsetX) / view.scale, y: (screen.y - view.offsetY) / view.scale };
}

export function panBy(view: ViewTransform, deltaX: number, deltaY: number): ViewTransform {
  return { ...view, offsetX: view.offsetX + deltaX, offsetY: view.offsetY + deltaY };
}

export function clampScale(scale: number, limits: ScaleLimits = DEFAULT_SCALE_LIMITS): number {
  return Math.min(limits.max, Math.max(limits.min, scale));
}

/** Zooms by `factor` while keeping the world point under `anchor` fixed on screen. */
export function zoomAt(
  view: ViewTransform,
  anchor: ScreenPoint,
  factor: number,
  limits: ScaleLimits = DEFAULT_SCALE_LIMITS,
): ViewTransform {
  if (!(factor > 0) || !Number.isFinite(factor)) return view;
  const scale = clampScale(view.scale * factor, limits);
  const world = screenToWorld(view, anchor);
  return {
    scale,
    offsetX: anchor.x - world.x * scale,
    offsetY: anchor.y - world.y * scale,
  };
}

/** Centres `box` in a viewport of the given pixel size, leaving `paddingPx` free on every side. */
export function fitToView(
  box: BoundingBox,
  viewport: { readonly width: number; readonly height: number },
  paddingPx = 24,
  limits: ScaleLimits = DEFAULT_SCALE_LIMITS,
): ViewTransform {
  const boxWidth = Math.max(box.maxX - box.minX, 1);
  const boxHeight = Math.max(box.maxY - box.minY, 1);
  const availableWidth = Math.max(viewport.width - paddingPx * 2, 1);
  const availableHeight = Math.max(viewport.height - paddingPx * 2, 1);
  const scale = clampScale(
    Math.min(availableWidth / boxWidth, availableHeight / boxHeight),
    limits,
  );
  return {
    scale,
    offsetX: (viewport.width - boxWidth * scale) / 2 - box.minX * scale,
    offsetY: (viewport.height - boxHeight * scale) / 2 - box.minY * scale,
  };
}
