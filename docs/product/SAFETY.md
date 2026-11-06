# Safety principles and constraints

> **Not professional safety certification or medical advice.** App suggestions are planning aids. An adult must inspect the environment, equipment, child readiness, and setup and supervise play throughout. No software-only model can guarantee a safe course.

## Design policy

1. **Prefer floor-level movements** with conservative clearance.
2. **No elevated jumps or climbing from furniture**, suspended loads, improvised platforms, unstable stacking, or risky balancing at height.
3. **Do not route under/through ropes, loops, cords, or anchored lines** that could entangle or cause strangulation. Rope activities in early catalog may use a flat, unsecured floor line only, if appropriate and supervised.
4. **No sharp edges, slippery floors, unsecured furniture, nearby stairs/fireplaces/glass, or blocked exits.** Make hazards markable as exclusion zones.
5. **No hardcoded inference about a child's abilities from age alone.** Age bands filter a reviewed template catalog; adult selects readiness and can skip activities.
6. **Manufacturers' intended use and limits override generic plans.** Reject unsupported configurations.
7. **Equipment stability/condition are not software-verifiable.** Require an explicit adult check before play.
8. **Required clearance is part of the footprint.** Do not optimize it away.

## Hard automatic rules (MVP)

- No station footprint/clearance intersects walls, obstacles, or no-go zones.
- Station placement must not overlap other station clearance regions except for explicitly designed compatible transitions.
- Entry/exit and route corridors remain unobstructed; no route traverses walls/blocked regions.
- All required equipment exists in inventory with sufficient quantity and known dimensions.
- Template age band and equipment usage metadata must match selected settings.
- Templates with unreviewed risk profiles are never eligible.
- Reject unsafe activity/equipment combinations even if geometrically feasible.

## Soft scoring rules

Favor low changeover time, short safe transitions, age-appropriate variety, stable surfaces, minimal congestion, and routes that avoid crossing. Soft scores **cannot** override hard rules.

## Adult pre-play checklist

- Inspect surface for slipping/tripping hazards; clear breakable objects.
- Verify every item is stable, undamaged, appropriate for intended use, and firmly positioned.
- Verify manufacturer instructions, age limits, and adult supervision requirements.
- Check free space around stations and unobstructed access/egress.
- Confirm activities are suitable for this particular child today; stop if uncomfortable, fatigued, or distressed.
- Supervise continuously and adjust activities as needed.

## Operational safety

- Maintain a versioned, reviewed activity catalog with explicit author/reviewer and rationale for each template.
- Any geometry-rule change requires regression testing of hazard fixtures.
- Provide clear rejection reasons; do not let an AI model override hard safety constraints.
- Never assert *safe*, *certified*, or *risk-free*; use *passes the app's layout checks* instead.

## Open decisions before content expansion

Obtain informed review of exact clearance values, equipment types, age bands, and risk thresholds. Use conservative defaults as placeholders only in tests; do not claim empirically validated distances without evidence.
