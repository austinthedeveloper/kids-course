# UX flows and screen specifications

## Navigation

Home → Spaces → Equipment → Course Settings → Generate → Review → Play / Save / Print. Users can jump directly to existing profiles from Home.

## Flow A: first use

1. Welcome screen explains the tool is adult-directed and requires supervision.
2. Pick a space mode: **Unlimited**, **Rectangle** (width × length), **Custom shape**.
3. Custom shape: start with an editable rectangle; add/drag corner handles on a visible grid. Show live dimensions and floor area when valid.
4. Add persistent obstacles: couch, table, shelf, doorway/clear path, freeform no-go polygon. Mark entry and exit if relevant.
5. Save room with descriptive name.
6. Choose equipment from catalog; set count, size, and basic condition/usage limits.
7. Set age band, activity goal, challenge level, approximate duration.
8. Generate; show feasibility summary, numbered course, and setup checklist.
9. Adult reviews physical setup; show warnings before play view.

## Flow B: returning user

Select saved room + existing inventory → choose preferences → generate → accept or tweak → save/play. Minimize repeated configuration.

## Flow C: edit a generated plan

- Tap station → highlight footprint, clearance zone, path, equipment, instructions.
- Move/rotate station → immediately revalidate; show *why* a move fails.
- Lock station → generate alternatives around locked elements.
- Regenerate → retain seed/history and offer a different candidate if possible.
- Reset → discard unsaved edits only after confirmation.

## Editor interaction proposal

- **Geometry:** world-space centimeters; CSS canvas is presentation only.
- **Grid:** 15 cm (~6 in) display/snap default; optional fine movement and numeric edit panel.
- **Shapes:** polygon boundaries; rectangular/round obstacles; optional polygon no-go zones.
- **Handles:** large touch targets for corners, rotation, resizing; pan and zoom independent of dragging shapes.
- **Measurements:** feet/inches default setting for US audience; store centimeters internally.
- **Layers:** boundaries → obstacles → clearances → equipment → routes → selection controls.
- **Controls:** Add corner, Remove corner, Undo, Redo, Zoom, Fit room, Snap, Show clearances.
- **Accessibility:** non-canvas inspector edits dimensions/positions; text list of stations and warnings.

## Empty/error states

| Condition | UI response |
| --- | --- |
| No equipment | Ask to add gear; allow sample/demo catalog |
| Invalid polygon | Explain crossing edges/too small; preserve last valid geometry |
| Item too large | Show footprint/required clearance conflict and alternate equipment |
| No valid course | Suggest fewer stations, new equipment set, or different room |
| Unlimited space | Clearly state physical placement/clearance cannot be verified |
| Missing dimensions | Require estimate or exclude item; never assume it fits |
| Existing saved course uses edited gear | Show affected station and request regeneration/review |

## Copy tone

Adult-facing setup: short verb-first steps. Child-facing activity: playful names and simple movement instructions. Developmental benefits can be described as **practice goals**, not promised outcomes.
