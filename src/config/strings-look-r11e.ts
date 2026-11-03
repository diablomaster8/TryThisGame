/** Player-facing names for lane E's round-11 wearables (`cosmetics-r11e.ts`). */
export const FACE_WEAR_LABELS = {
  sunglasses: 'Sunglasses',
  'heart-glasses': 'Heart glasses',
  whiskers: 'Painted whiskers',
} as const;

/** The Roster's per-slot wear pickers (R0400). */
export const WEAR_SLOT_TEXT = {
  hat: 'Hat',
  face: 'Face',
  neck: 'Neck',
  back: 'Back',
  body: 'Body',
  none: 'Nothing',
  forSlot: (name: string, slot: string): string => `${slot} for ${name}`,
} as const;

/** The five body costumes (R0413). */
export const COSTUME_LABELS = {
  'costume-bee': 'Bee costume',
  'costume-frog': 'Frog costume',
  'costume-ghost': 'Ghost sheet',
  'costume-dino': 'Dino onesie',
  'costume-knight': 'Knight outfit',
} as const;

/** The race headbands (R0437): one per course, in the course's colour. */
export const RACE_BAND_LABELS = {
  'race-band-meadow': 'Meadow Dash headband',
  'race-band-cliffs': 'Cliff Climb headband',
  'race-band-lagoon': 'Lagoon Loop headband',
} as const;
