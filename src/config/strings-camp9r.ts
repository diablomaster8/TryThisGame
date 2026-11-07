import { fmt } from './icu';
import { MESSAGES_EN } from './messages-en';
/**
 * Lane C round 9, agent R (re-exported from strings.ts): "Rest until …", the Saves panel's
 * integrity lines and the objective chip's "Go there".
 */

/** R0616 (CAMP-24): the chip's rest button. */
export const REST_TEXT = {
  words: {
    dawn: 'dawn',
    morning: 'morning',
    afternoon: 'the afternoon',
    dusk: 'dusk',
    night: 'nightfall',
    tomorrow: 'tomorrow',
  } as Readonly<Record<string, string>>,
  button: (when: string) => `💤 Rest until ${when}`,
  resting: (when: string) => `Resting until ${when}…`,
  help: 'Time runs fast until then. Your Nubbins eat, sleep and grow as usual.',
} as const;

/** R0659 (CAMP-67): Settings → Saves. */
export const SAVE_INFO_TEXT = {
  heading: 'This save',
  never: 'Not saved yet',
  justNow: 'Saved just now',
  ago: (n: number, unit: string) => fmt(MESSAGES_EN.savedAgo, { n, unit }),
  units: { s: 'second', m: 'minute', h: 'hour', d: 'day' } as Readonly<Record<string, string>>,
  bytes: (n: number) => `${n} bytes`,
  kb: (n: string) => `${n} KB`,
  line: (saved: string, size: string) => `${saved} · ${size}`,
  mirror: (saved: string, size: string) => `Second copy in this browser: ${saved} · ${size}`,
  noMirror: 'No second copy in this browser yet.',
  unreadable: (n: number) => fmt(MESSAGES_EN.unreadableSaves, { n }),
} as const;

/** R0661 (CAMP-69): the objective chip's "Go there". */
export const GO_TEXT = {
  button: '📍',
  label: 'Go there',
} as const;
