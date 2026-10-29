/**
 * Lane A (FUN) numbers: comic timing and the little touches. Re-exported from `tuning.ts`.
 */

/** R0295: how long a Keeper's line stays up, and how far above the feet it floats. */
export const BARK_BUBBLE = { ms: 3200, lift: 2.3 } as const;

/**
 * R0300 (FUN-11): a shaken tree's fruit lands on the head of a Nubbin standing under it
 * (within `reach` of the trunk), at most once per Nubbin every `cooldownMs`. A hungry
 * Nubbin eats it on the spot; a full one looks up at the tree, outraged.
 */
export const FRUIT_BONK = { reach: 2.0, cooldownMs: 30_000, eatMs: 4000 } as const;

/**
 * R0302 (FUN-13): the typewriter's comic timing. Pauses (ms) after a sentence end, an
 * ellipsis or a trailing dash, and a comma, when a space or the line's end follows. Blips:
 * one tick every `blipEvery` characters in the speaker's voice (Hz, wave, length ms);
 * speakers not listed use `default`, and the narrator and Hazel's letters are silent.
 */
export const TYPE_TIMING = {
  pauses: { stop: 120, trail: 260, comma: 60 },
  blipEvery: 2,
} as const;

export type BlipVoice = { hz: number; wave: OscillatorType; ms: number };

export const VOICES: Record<string, BlipVoice | null> = {
  default: { hz: 520, wave: 'triangle', ms: 28 },
  narrator: null,
  hazel: null,
  sparks: { hz: 880, wave: 'triangle', ms: 18 },
  moss: { hz: 180, wave: 'sine', ms: 46 },
  byte: { hz: 600, wave: 'square', ms: 20 },
  marina: { hz: 470, wave: 'sine', ms: 30 },
  fern: { hz: 420, wave: 'triangle', ms: 30 },
  clover: { hz: 640, wave: 'sine', ms: 30 },
  pixel: { hz: 760, wave: 'square', ms: 16 },
  luna: { hz: 330, wave: 'sine', ms: 40 },
  ember: { hz: 300, wave: 'sawtooth', ms: 22 },
  dusty: { hz: 260, wave: 'triangle', ms: 36 },
  nova: { hz: 560, wave: 'triangle', ms: 26 },
};

/**
 * R0306 (FUN-17): no fun quest before this chapter's closing scene has played, so the Grove's
 * own voice lands before the first joke from another register. After it, `FUN.offerGapMs`.
 */
export const FUN_FIRST_OFFER = { afterChapter: 2 } as const;

/**
 * R0307 (FUN-18): while every Nubbin in the save is younger than `earlyMs`, a need about to
 * become a slip is announced `leadMs` before it is logged, so a new Keeper learns what helps.
 */
export const SLIP_WARN = { leadMs: 60_000, earlyMs: 15 * 60_000 } as const;

/**
 * R0313 (FUN-24): Fern's stone, a running gag: the stone from the letter sits by the signpost
 * with a face, and Fern adds one a chapter (the cairn has as many stones as the chapter
 * number, up to 12). `pick` is the tap radius.
 */
export const FERN_STONE = { id: 'fern-stone', x: 3.1, z: 21.2, maxStones: 12, pick: 0.6 } as const;

/**
 * R0314 (FUN-25): Byte's stopwatches, a running gag on the race results card: `start` from
 * chapter `fromChapter`, one more every `racesPer` races entered, `cap` at most.
 */
export const BYTE_WATCHES = { fromChapter: 5, start: 4, racesPer: 3, cap: 12 } as const;
