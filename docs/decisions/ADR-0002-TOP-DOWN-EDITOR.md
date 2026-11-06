# ADR-0002: Structured 2D top-down editor

**Status:** Proposed  
**Date:** 2026-11-05

## Context

Homes frequently have irregular, concave room boundaries and furniture. Freehand interpretation, photos or a 3D engine are too ambiguous/complex for v1 and complicate spatial validation.

## Decision

Use a 2D polygon boundary with draggable corners, snapped grid, numeric measurements, editable obstacle footprints, and a world-space centimeter geometry model. Use Konva.js for canvas interactions if a prototype confirms mobile and Angular integration. The canvas is a **view**, not the geometry source of truth.

## Consequences

**Pros:** teachable interactions, transparent dimensions, algorithm-friendly geometry and reliable saved layout.  
**Cons:** some manual measurement and drawing effort; users may need help with unusual room shapes.

## Prototype findings (SP-001, 2026-11-05)

**Status stays Proposed until the real-device check below is done.** The spike is at `/spaces`.

- **Versions:** Konva 10.9 builds and runs with Angular 22.2 as a lazy-loaded route (about 56 kB compressed on that route only).
- **Direct Konva, no wrapper:** `ng2-konva` supports Angular 22, but the editor needs imperative control during drags, so the prototype uses Konva directly from one component.
- **Canvas as a view holds up:** geometry stays in world centimetres in signals; Konva only draws and reports pointers. Screen and world conversion and every edit decision are pure, unit-tested functions in `core/geometry`, which is the part to keep.
- **Rejecting a bad drag works:** the handle is pulled back to the last valid geometry on each move, with the reason shown as text.
- **Touch handling:** the stage sets `touch-action: none`, one finger pans or drags, and a second finger cancels any drag and restores the shape, so a pinch cannot move a corner.

**Checked automatically:** drag, snap, reject, rotate, zoom and fit, in Playwright on desktop Chrome and a Pixel 7 emulation. These use mouse events.

**Not checked yet:** real fingers. Pinch-zoom, pan versus drag, and handle comfort need trying on one real phone and one real tablet before this ADR is accepted. An emulator cannot judge this.

## Revisit when

Room-entry usability tests show a significant obstacle or photo drafting can accurately feed the exact same polygon model.
