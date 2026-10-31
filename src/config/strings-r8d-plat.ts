/** Player-facing text for the platform items of lane D, round 8. Imported directly. */

/** R0496 (TECH-55): a new build is waiting. */
export const UPDATE_NOTICE_TEXT = {
  chip: 'A new Grove is ready: tap to refresh (your game is saved)',
  saving: 'Saving, then refreshing…',
  unsaved: "Couldn't save just now, so the Grove stays as it is. Try again in a moment.",
  later: 'Later',
} as const;

/** R0520 (TECH-80): a story world whose script this device has not downloaded yet. */
export const OFFLINE_ENTRY_TEXT = {
  needs: 'Needs the internet once',
  why: 'This world downloads the first time you open it. Open it once online and it stays on this device.',
} as const;
