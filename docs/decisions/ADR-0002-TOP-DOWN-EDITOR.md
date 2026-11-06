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

## Revisit when

Room-entry usability tests show a significant obstacle or photo drafting can accurately feed the exact same polygon model.
