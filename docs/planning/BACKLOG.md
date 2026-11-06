# Backlog and user stories

Use stable IDs in issues and PRs. P0 = MVP, P1 = after MVP/core polish, P2 = future.

| Story | Priority | Milestone | User value / acceptance |
| --- | --- | --- | --- |
| US-001 | P0 | M0 | As a maintainer, run app/tests locally and in CI |
| US-002 | P0 | M1 | As a parent, add available gear with quantities and measured sizes |
| US-003 | P0 | M1 | As a parent, see activity restrictions for my gear |
| US-004 | P0 | M2 | As a parent, enter a rectangular space quickly |
| US-005 | P0 | M2 | As a parent, model an L-shaped space by dragging corners |
| US-006 | P0 | M2 | As a parent, mark furniture and blocked areas |
| US-007 | P0 | M2 | As a parent, reuse named room profiles |
| US-008 | P0 | M3 | As a parent, get only compatible activities from owned gear |
| US-009 | P0 | M3 | As a parent, receive layouts that respect walls and clearance |
| US-010 | P0 | M3 | As a parent, receive a clear explanation when nothing fits |
| US-011 | P0 | M3 | As a maintainer, replay a layout from seed and versions |
| US-012 | P0 | M4 | As a parent, see station numbering and directions |
| US-013 | P0 | M4 | As a parent, move/rotate/lock a station and see conflicts |
| US-014 | P0 | M4 | As a parent, save a modified course for later |
| US-015 | P0 | M4 | As a parent, follow a printable/textual setup guide |
| US-016 | P0 | M4 | As a caregiver, review hazards before starting |
| US-017 | P1 | M6 | As a parent, regenerate without rearranging locked gear |
| US-018 | P1 | M6 | As a parent, explore 2–3 alternative arrangements |
| US-019 | P1 | M6 | As a parent, undo/redo accidental editing |
| US-020 | P2 | M8 | As a parent, apply a dinosaur/pirate/space theme to instructions |
| US-021 | P2 | M8 | As a parent, use a photo as a draft but confirm geometry manually |

## First sprint candidate

1. US-001 app/test scaffolding.
2. Types and validators for `Point`, `Polygon`, `Room`, `Obstacle`, and inventory.
3. Two fixture rooms, including one concave L-shape with a fixed couch.
4. Small proof of concept: display/edit polygon corner in Konva; convert screen ↔ world coordinates.
5. Decide persistence strategy and document ADR.

## Suggested issue template

```md
### User story
As a [role], I want [action], so that [benefit].

### Acceptance criteria
- [ ] Observable behavior 1
- [ ] Observable behavior 2
- [ ] Error state covered

### Test cases
- Normal input:
- Edge case:
- Accessibility/touch:

### Dependencies
- Story IDs / ADRs:
```

## Definition of ready

Behavior is testable; measurements, constraints, and failure states are defined; any content/safety approval needed is identified.

## Definition of done

Implementation + unit/integration tests + manual UI check + error feedback + updated documentation where behavior changed.
