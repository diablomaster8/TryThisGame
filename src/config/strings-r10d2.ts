/**
 * Lane D, round 10 (helper d2): player-facing words for the keyboard care path and the other
 * accessibility pieces of this round. Imported directly where used.
 */

/** TECH-72: the canvas's label once care keys work, and what the live region says after one. */
export const KB_CARE_TEXT = {
  canvas:
    'The Grove. Tab picks the nearest Nubbin, Enter opens its sheet, P pets, F feeds, Space lifts or puts down.',
  noFruit: 'No fruit. Shake a tree for some.',
  egg: 'Eggs cannot eat yet.',
  full: (name: string) => `${name} is full.`,
  lifted: (name: string) => `Holding ${name}. Arrows walk, Space puts down, X shakes.`,
  putDown: (name: string) => `Put ${name} down.`,
  petted: (name: string) => `You pet ${name}.`,
  fed: (name: string) => `Feeding ${name}.`,
} as const;
