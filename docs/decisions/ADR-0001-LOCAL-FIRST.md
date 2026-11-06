# ADR-0001: Local-first Angular application

**Status:** Proposed  
**Date:** 2026-11-05

## Context

Most users need a quick, private household tool. Rooms and inventory can be represented as compact structured data. A backend would add cost, complexity and data governance before the primary utility is validated.

## Decision

Use Angular + strict TypeScript. Store initial rooms, equipment and courses locally in IndexedDB using versioned schemas. Build generation and validation as pure TypeScript modules. Do not require accounts, cloud sync, or AI in MVP.

## Consequences

**Pros:** fast local iteration, predictable cost, offline potential, limited data collection, straightforward testability.  
**Cons:** browser/device data can be cleared; no automatic cross-device sync; must build migration and export/import.

## Revisit when

Users need reliable multi-device sync, household sharing, or backups beyond export/import.
