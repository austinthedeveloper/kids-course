# Product brief

## Vision

Make it easy for parents and caregivers to create varied, age-appropriate, imaginative indoor/outdoor movement courses that actually fit their space and belongings.

## Core insight / differentiator

The product is a **spatial planner**, not merely a list of exercise ideas: it understands irregular room boundaries, furniture/no-go zones, gear footprints, clearance needs, and transit paths. It should optimize the use of a real room while prioritizing safety and ease of setup.

## Audience

- **Primary:** caregiver planning a supervised home course for a young child.
- **Secondary, later:** homeschool groups, small childcare groups, pediatric movement professionals (not an MVP clinical tool).
- **User of instructions:** the adult first; child-friendly illustrations/text support play.

## Jobs to be done

1. Given my L-shaped room and fixed couch, show what can fit.
2. Given my existing toys and cushions, avoid recommending unavailable gear.
3. Given limited time, generate a new course quickly.
4. Given a preferred setup, change activities while minimizing rearrangement.
5. Given a child age/ability, avoid inappropriate challenges and explain each station clearly.

## Success measures (targets to validate, not promises)

- A new user can save their first approximate room and equipment inventory without a tutorial.
- A returning user can generate a candidate course with previously saved inputs in a few interactions.
- Every generated station has an instruction, required equipment, movement order, and clearances.
- Zero known safety-rule violations in automated acceptance fixtures.
- The generator explains when a requested course cannot fit instead of faking a solution.

## MVP assumptions

- Single household; one device; no login or cloud sync.
- One child/age band per course; adult supervision assumed.
- 2D floors, not 3D reconstruction or elevation models.
- Approximate dimensions entered by the adult; app cannot measure a room.
- Small curated catalog of low-risk equipment and activities.
- Offline-capable after loading if technically feasible; no paid AI calls.

## Out of scope for MVP

- Camera or AI room scanning; image recognition; automatic furniture detection.
- Multi-child scheduling, accounts, marketplace, social sharing, community plans.
- Health/therapy prescriptions or individualized medical recommendations.
- Custom physical equipment design or claims of safety certification.
- Dynamic body tracking, AR/VR, real-time sensors.

## Open product questions

- Which equipment does the initial household own, in what sizes and quantities? (Q-01, [#20](https://github.com/austinthedeveloper/kids-course/issues/20))
- What is the child's age/ability range to prioritize during usability tests? (Q-03, [#22](https://github.com/austinthedeveloper/kids-course/issues/22))
- Are setup instructions primarily read on a phone or shown on a larger screen? (Q-08, [#58](https://github.com/austinthedeveloper/kids-course/issues/58))
- Is course flow one-direction only at launch, or should loops be allowed? (Q-07, [#42](https://github.com/austinthedeveloper/kids-course/issues/42))
- Do we need a printer-friendly black-and-white mode at MVP? (Q-06, [#57](https://github.com/austinthedeveloper/kids-course/issues/57))

Answer each in its linked issue; do not block Milestone 0 on them.
