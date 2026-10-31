/** Lane C round 10, agent A (re-exported through tuning-camp10.ts). */

/**
 * R0605 (CAMP-13), R0640 (CAMP-48): the questline regions reached from the Grove. Each opens
 * at a spine chapter (the spine alone until chapter 3, then one region at a time); an entrance
 * offers "Go to …" while the Keeper stands within `entranceR` of it.
 */
export const STORY_REGION_TUNING = {
  /** Hazel's chapter at which each region opens (R0640: Fold 3, server 5, Hollow after 8). */
  opensAt: { fold: 3, server: 5, sun: 6, moon: 6, hollow: 8 } as Readonly<Record<string, number>>,
  /** World units from an entrance within which its Go-to chip shows. */
  entranceR: 2.6,
  /** The fade either side of a region change, in ms (a cut under reduced motion). */
  fadeMs: 260,
} as const;
