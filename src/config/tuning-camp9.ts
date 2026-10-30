/**
 * Lane C round 9, agent Q (re-exported from tuning.ts): scene priorities, line rewards,
 * offer windows and the caper cadence of the Open quest flow.
 */

/**
 * R0597 (CAMP-04): who plays first from the one scene queue. Lower goes first; a chain already
 * playing (the head's owner) always finishes before another owner starts.
 */
export const SCENE_PRIO = {
  /** A spine chapter scene, a trigger (`t-*`), an ending or an expansion scene. */
  spine: 0,
  /** A questline's scene handed to the spine's queue. */
  line: 1,
  /** A side-story step, or anything not named below. */
  side: 2,
  /** A fun quest (caper). */
  caper: 3,
} as const;

/**
 * R0639 / R0600 (CAMP-47, CAMP-07): what each questline leaves when it ends beside Hazel's Grove,
 * once per line (walking it again gives nothing more). `grove` is the Grove change the renderers
 * read from the keepsakes (`grove-*`).
 */
export const LINE_REWARD: Readonly<
  Record<string, { shells: number; keepsake: string; grove: string; home: string }>
> = {
  hundred: { shells: 200, keepsake: 'line-hundred', grove: 'grove-fold-habitat', home: 'fold' },
  logged: { shells: 200, keepsake: 'line-logged', grove: 'grove-server-glow', home: 'server' },
  beetle: { shells: 200, keepsake: 'line-beetle', grove: 'grove-beetle-shrine', home: 'road' },
  dawn: { shells: 150, keepsake: 'line-dawn', grove: 'grove-sundial', home: 'grove' },
  dusk: { shells: 150, keepsake: 'line-dusk', grove: 'grove-sundial', home: 'grove' },
};

/**
 * R0652 (CAMP-60): offers that come with a window. `dawn` / `dusk`: until the next story dawn or
 * dusk; a number: that many game minutes (the sim clock, so the debug time-scale applies). An
 * expired `lapse` story is let go for good; an expired `free` one may be offered next window.
 */
export const OFFER_WINDOWS: Record<string, 'dawn' | 'dusk' | number> = {
  // S12's hive hums at dusk after chapter 6 opens: the offer lasts the night.
  s12: 'dawn',
};

/**
 * R0637 (CAMP-45): the caper cadence for pull, not push, in the Open flow.
 */
export const QUEST_CADENCE = {
  /** Offers made per area entry. */
  offerPerEntry: 1,
  /** An area that just made an offer makes no other for this long (re-entry is no spam). */
  areaOfferCooldownMs: 90_000,
  /** Capers (fun quests) accepted and under way at once; none is offered past it. */
  capersActiveMax: 3,
} as const;
