# ADR-0003: Rules-based course generator before AI

**Status:** Proposed  
**Date:** 2026-11-05

## Context

A text model cannot reliably enforce geometric intersections, inventory counts, clearance, or equipment safety. Repeated calls also introduce unnecessary ongoing cost.

## Decision

Use a deterministic, seeded, bounded placement/search pipeline with independent hard-constraint validation and a versioned, reviewed activity catalog. Scoring may optimize variety/setup effort **only among valid candidates**. Optional AI can later supply themed language from validated templates but may not create new unreviewed movement instructions or override safety constraints.

## Consequences

**Pros:** repeatable, testable, explainable, inexpensive.  
**Cons:** requires manual activity template authoring; complex packing optimization may need iteration.

## Revisit when

The core validated generator works and user testing identifies clear creative benefits that justify optional AI.
