# Requirements and acceptance criteria

Priority: **P0** required for MVP; **P1** first polish; **P2** future.

## Functional

| ID | Priority | Requirement | Acceptance test |
| --- | --- | --- | --- |
| R-01 | P0 | Create/save/rename/delete room profiles | Saved room opens with unchanged geometry and obstacles after reload |
| R-02 | P0 | Choose unlimited, rectangular, or polygonal space | All three modes can produce a valid space; unlimited mode states no spatial validation |
| R-03 | P0 | Edit polygon vertices with snapping | Drag/add/remove corners; reject self-intersection and degenerate polygons |
| R-04 | P0 | Place/resize/rotate fixed obstacles and no-go zones | Objects persist; editor shows blocked regions |
| R-05 | P0 | Maintain inventory with dimensions/quantities | Generator cannot use more gear than owned |
| R-06 | P0 | Select child age band, goal, challenge, duration | Inputs persist for current generation and influence candidate templates |
| R-07 | P0 | Produce layout from compatible templates | Stations entirely within bounds, clear obstacles, and honor safety rules |
| R-08 | P0 | Show numbered path and station instructions | Instructions match generated template and selected equipment |
| R-09 | P0 | Move/rotate and lock placed stations | Invalid move is visibly rejected; locked stations remain unchanged in regeneration |
| R-10 | P0 | Show useful no-solution result | States limiting constraints and suggests removing items, freeing space, or fewer stations |
| R-11 | P0 | Save/reopen generated course | Layout, settings, instruction version, and locks preserved after reload |
| R-12 | P0 | Printable/accessible setup view | Parent can use numbered textual plan even if diagram is unavailable |
| R-13 | P0 | Explicit adult review and safety warnings | No course presented as validated for real-world safety |
| R-14 | P1 | Minimize movement from a previous setup | Regeneration prefers previously placed/locked positions when feasible |
| R-15 | P1 | Undo/redo editor actions | Basic room and layout edits support undo/redo |
| R-16 | P2 | Theme/story generation | Themes may change language, never bypass activity/safety restrictions |

## Nonfunctional

- **Data privacy:** local-first; no child name, birth date, images, or location required. Document deletion/export behavior.
- **Determinism:** same inputs + generator version + seed yield the same layout.
- **Performance:** responsive room editing on common phones/tablets and desktop; benchmark generation using representative fixtures before setting hard latency thresholds.
- **Accessibility:** keyboard-operable core flows; semantic labels, contrast, non-color-only invalid states, readable text independent of canvas.
- **Resilience:** validate persisted documents on load; handle corrupted/old versions without losing all data.
- **Security:** treat imported/user-entered labels as untrusted; avoid HTML injection; restrict any future server APIs.
- **Reliability:** never silently overlap equipment or route through walls/obstacles.

## Safety acceptance gates

Every candidate must pass [SAFETY.md](SAFETY.md) and [GENERATOR.md](../architecture/GENERATOR.md) validation. Failing any hard rule means **not generated**. Unknown dimensions, clearance, or unsupported equipment requires a clear review gate or omission; never treat unknown values as zero.

## Definition of MVP done

All P0 requirements pass automated tests where applicable, core flows pass manual mobile/tablet review, documented geometry edge cases pass, backup/export or a clearly communicated local-data limitation exists, and all known critical safety defects are resolved.
