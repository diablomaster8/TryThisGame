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
