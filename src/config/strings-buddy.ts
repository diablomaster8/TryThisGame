/** R0741: the Nubbin that learns beside the child. */
export const BUDDY_TEXT = {
  learned: (name: string) => `${name} learned it too!`,
  wearing: (name: string, what: string) => `${name} is wearing a ${what}.`,
  names: { 'edu-abacus': 'tiny abacus', 'edu-paintbrush': 'paintbrush', 'edu-book': 'little book' },
  alt: (name: string) => `${name}, learning beside you`,
} as const;
