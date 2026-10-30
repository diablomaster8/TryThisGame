/** Player-facing text for the TECH items (lane D, round 7). Re-exported from `strings.ts`. */

/** TECH-01: the objective chip for a new hatchling's first fruit. */
export const FIRST_FEED_TEXT = {
  goal: (name: string) => `🍎 ${name} is hungry: give it a fruit`,
  hint: 'Tap your Nubbin, then Feed',
} as const;

/** TECH-03: the one-time backup offer. */
export const BACKUP_OFFER_TEXT = {
  line: 'A week of Grove! Save a backup file, in case this browser forgets.',
  save: 'Save a backup file',
  later: 'Not now',
} as const;

/** TECH-15: the Vibration setting. */
export const HAPTICS_TEXT = {
  label: 'Vibration',
  help: 'A little buzz when you pet, hatch, throw and more.',
} as const;

/** TECH-17: the stats sheet's grow handle. */
export const SHEET_TEXT = { grow: 'Make the sheet taller or shorter' } as const;

/** TECH-33 and TECH-56: the bug report and the storage line in Settings > Saves. */
export const BUG_TEXT = {
  copy: 'Copy bug report',
  copied: 'Bug report copied. Paste it wherever you report the bug.',
  saved: 'Bug report saved as a file.',
  storage: (kb: number, ofMb: number | null) =>
    ofMb === null ? `Storage used: ${kb} kB` : `Storage used: ${kb} kB of about ${ofMb} MB`,
} as const;

/** TECH-27: the text-size setting. */
export const TEXT_SIZE_TEXT = {
  label: 'Text size',
  sizes: { small: 'Small', normal: 'Normal', large: 'Large', larger: 'Larger' },
} as const;
