# Roadmap, sequencing and risks

## Release sequence

| Stage | Outcome | Key dependency |
| --- | --- | --- |
| Foundations (M0) | Running app and domain contracts | None |
| Describe reality (M1–M2) | Inventory + irregular room editor | Geometry conventions |
| Solve layout (M3) | Verified feasible course or reasons for failure | Reviewed templates + clearances |
| Use it at home (M4) | Instructions, editing, locking, saved courses | Validated generation |
| Beta/release (M5) | Reliable, accessible practical MVP | Household testing |
| Improve (M6+) | Less rearrangement, themes, intelligent assistance | User evidence |

## MVP / next / later

**MVP:** manual grid room editor, inventory, curated activities, deterministic generator, no-solution explanations, adult review, saved courses and print view.

**Next:** setup reuse optimization, alternate course candidates, room zone labels, undo/redo, equipment kits, improved visual guides.

**Later:** optional creative AI themes, camera-assisted room draft with mandatory correction, cross-device sync, group play, richer activity library, activity ratings. Reassess privacy for any cloud feature.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| A feasible geometry layout isn't physically safe | Conservative hard restrictions; adult review; never claim certified safety |
| Polygon/collision edge cases | Pure geometry tests, property tests and deliberately tricky fixtures |
| Generator can't find solutions in narrow spaces | Clear failure explanations; bounded search improvements; fewer-station fallback |
| Room drawing too complicated on phone | Start rectangle and drag handles, numeric inspector, tablet testing |
| Equipment measurements are guesses | Visible estimates; require dimensions; show confidence/limitations |
| Too many templates before safety review | Small approved catalog; versioned reviews |
| AI cost or hallucinated instructions | No AI in MVP; optional themes only after deterministic validation |
| Local data lost or browser storage cleared | Export/import, warn about local-only storage, consider later opt-in sync |

## Decision triggers

- Consider smarter solver only if bounded greedy search fails representative household fixtures.
- Consider photo mapping only if manual room entry is a demonstrated obstacle.
- Consider backend/cloud only if multi-device sync becomes a common need.
- Consider AI only after basic activity text and course quality meet user goals.

## Product discovery experiments

1. Observe an adult trace a real irregular room without instructions.
2. Measure the time from saved room to physical course setup.
3. Ask whether generated course fits without moving furniture.
4. Check whether regenerate-with-locked-items reduces work.
5. Validate actual equipment dimensions and activity instructions with supervised play observations.

## Open questions register

- [ ] Define initial list of actual household equipment, dimensions, and counts.
- [ ] Select a conservative approved activity template set and obtain appropriate review.
- [ ] Determine supported age bands and readiness prompts.
- [ ] Confirm minimum route/circulation clearance policy.
- [ ] Decide whether MVP must work entirely offline after first load.
- [ ] Decide if print/export is required for first alpha or final MVP only.
