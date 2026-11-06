/** Index of named fixtures and what each exists to prove (docs/planning/TEST_STRATEGY.md). */
export const FIXTURE_CATALOG: readonly { readonly name: string; readonly proves: string }[] = [
  { name: 'room-rectangle-open', proves: 'A normal course can be generated.' },
  { name: 'room-l-narrow-couch', proves: 'A concave room with fixed furniture is representable.' },
  { name: 'room-self-intersecting', proves: 'A crossed boundary is rejected before generation.' },
  { name: 'room-hallway-blocked', proves: 'A blocked passage is never routed through.' },
  { name: 'room-no-space', proves: 'Too little floor gives an honest no-solution result.' },
  { name: 'room-touching-edge', proves: 'Contact with a wall counts as a collision.' },
  { name: 'room-concave-notch', proves: 'Nothing crosses a re-entrant wall.' },
  { name: 'room-nested-obstacles', proves: 'Overlapping and nested obstacles are all respected.' },
  { name: 'gear-duplicate-stones', proves: 'Quantities are tracked, not assumed.' },
  { name: 'gear-floor-mat', proves: 'A measured item validates as is.' },
  { name: 'gear-unknown-size', proves: 'An unknown size cannot silently be placed.' },
];
