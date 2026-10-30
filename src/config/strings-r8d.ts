/**
 * Lane D, round 8: the player-facing words for the stats sheet's tabs, the shake meter, the
 * keys hint's way back and the desktop top-bar labels. Re-exported from `strings.ts`.
 */

/** TECH-17: the egg-ready status lives in the primary button itself. */
export const HATCH_BUTTON_TEXT = {
  putDownToHatch: 'Put down to hatch ▼',
} as const;

/** TECH-60: the More menu's way back to the desktop keys hint (the "?" key does the same). */
export const KEYS_HINT_TEXT = {
  menu: '⌨ Show the keys hint (?)',
} as const;

/** TECH-61: the word under the sound toggle in the desktop top bar. */
export const TOPBAR_TEXT = {
  sound: 'Sound',
} as const;

/** TECH-07: the stats sheet's tabs and its plain care face row. */
export const SHEET_TABS_TEXT = {
  tabs: { care: 'Care', inside: 'Inside', grow: 'Grow' },
  tabsLabel: 'Sheet sections',
  morePlays: 'More ways to play ▾',
  fewerPlays: 'Fewer ways to play ▴',
  /** "🍎 Hunger: 🙂" — the icon and word go with every face, never the face alone. */
  faces: { good: '😊', ok: '😐', low: '😟' },
  faceWords: { good: 'fine', ok: 'so-so', low: 'low' },
  needs: { hunger: '🍎 Hunger', energy: '⚡ Energy', happiness: '☺ Mood' },
  hatchRing: (pct: number) => `${pct}% of the way to hatching`,
} as const;

/** TECH-16: the shake meter over the field while a held egg is shaken. */
export const SHAKE_METER_TEXT = {
  /** "Shake! ●●○○": filled dots for the swings so far, out of the swings a shake needs. */
  meter: (done: number, of: number) => {
    const n = Math.max(0, Math.min(of, Math.floor(done)));
    return `Shake! ${'●'.repeat(n)}${'○'.repeat(of - n)}`;
  },
  aria: (done: number, of: number) => `Shake progress: ${Math.min(done, of)} of ${of}`,
} as const;
