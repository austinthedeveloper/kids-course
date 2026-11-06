# ADR-0005: Local persistence and runtime validation

**Status:** Proposed, awaiting owner review (EN-007, [#18](https://github.com/austinthedeveloper/kids-course/issues/18)). Nothing is implemented yet; EN-011 builds on this once accepted.  
**Date:** 2026-11-05

## Context

ADR-0001 commits to local-first storage in IndexedDB with versioned schemas. Before building the repository (EN-011) three details need deciding: how IndexedDB is accessed, how stored documents are validated at runtime, and how old documents are migrated. Household data lives only in the browser, so a bad update or a corrupt record must not cost someone their saved rooms.

## Decision

1. **Access: the `idb` library behind a `StorageRepository` interface.** It is a very small promise wrapper over native IndexedDB. Feature and domain code depend only on the interface, and an in-memory implementation serves unit tests. Native IndexedDB's event-based API would otherwise need the same wrapper written by hand.
2. **Runtime validation: the hand-written validators in `core/validation`, no schema library.** They already exist (EN-004), and the rules that matter most, such as simple polygons and missing dimensions, go beyond what a shape schema expresses. They return typed, located reasons and drop unknown fields.
3. **Migration: one pure function per version step, run on load.** Each document stores `schemaVersion`. A document from an older version runs through each step in order and is then validated. Each step is tested with fixtures and kept for as long as that version may exist in someone's browser.
4. **Bad data is isolated, never discarded.** A record that fails to migrate or validate is kept as is in a quarantine store and reported to the user; other records still load. A document from a newer app version is left untouched and reported, rather than guessed at.
5. **`localStorage` holds tiny preferences only,** such as the unit system. Nothing a person would miss.
6. **No identifying child information is stored,** and no cloud, backend or analytics is added.

## Consequences

**Pros:** small dependency footprint; one validation path for editor, storage and import; a corrupt record cannot take the rest down; easy to test.  
**Cons:** one new runtime dependency (`idb`); validators and migrations are hand-maintained; a quarantine store needs a small recovery UI or at least an export path.

## Alternatives considered

- **Raw IndexedDB:** no dependency, but more code to own and easy to get wrong around transactions.
- **Dexie:** richer querying than this app needs, and larger.
- **A schema library (such as Zod):** convenient for shapes, but the geometry rules would still be custom, leaving two validation styles.

## Open for the owner

Accept, or change any of the above. Separately, ADR-0001 and ADR-0003 still read *Proposed*, and EN-007 asks for those to be accepted or revised too. The offline decision (Q-05, [#19](https://github.com/austinthedeveloper/kids-course/issues/19)) does not affect this ADR.

## Revisit when

Multi-device sync is needed (see ADR-0001), or storage limits become a real problem.
