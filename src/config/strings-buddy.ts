/** R0741: the Nubbin that learns beside the child. */
export const BUDDY_TEXT = {
  learned: (name: string) => `${name} learned it too!`,
  wearing: (name: string, what: string) => `${name} is wearing a ${what}.`,
  names: { 'edu-abacus': 'tiny abacus', 'edu-paintbrush': 'paintbrush', 'edu-book': 'little book' },
  alt: (name: string) => `${name}, learning beside you`,
} as const;

/** R0741: the keepsakes worn as hats; their names in the roster's hat picker. */
export const BUDDY_HAT_LABELS = {
  'edu-abacus': 'Tiny abacus',
  'edu-paintbrush': 'Painter’s beret',
  'edu-book': 'Little book',
} as const;

/** R0741: what the pointing hand and the finger row say to a screen reader. */
export const BUDDY_A11Y = {
  points: (name: string) => `${name} points at the answer.`,
  counts: (name: string, n: number) => `${name} counts ${n} on its fingers.`,
} as const;
