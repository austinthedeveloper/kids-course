## What and why

<!-- Lead with the backlog ID. Example: US-005: reject self-intersecting polygon edits. -->

Closes #

## Checks

- [ ] Acceptance criteria in the linked issue are met and ticked there
- [ ] Unit/integration tests added or updated; no test skipped or focused
- [ ] Manual UI check done on a phone-sized and a tablet/desktop viewport (if UI changed)
- [ ] Error and empty states covered
- [ ] Docs, requirements or ADRs updated if behaviour or a technical decision changed

## Safety (delete if not applicable)

- [ ] Hard rules in `docs/product/SAFETY.md` are unchanged, or the change is explained above and hazard fixtures were re-run
- [ ] A named fixture covers any new geometry edge case
- [ ] Every course mutation still triggers independent validation
- [ ] No unknown dimension or clearance is inferred or treated as zero
- [ ] No copy describes a plan as safe or certified
- [ ] No AI or cloud dependency added without an accepted ADR
