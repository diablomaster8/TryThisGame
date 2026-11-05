/** Lane A round 11, helper G5: old souls, sprout-band behaviour, season moods, race poses. */

/** R0590 (SOUL-73): what Nubbins do for the season and for the town's festival. */
export const SEASON_MOODS = {
  /** Chance per second that a free idle Nubbin starts the season's thing (before liveliness). */
  perSecond: 0.01,
  /** Winter: two huddle together, side by side. */
  huddleMs: 12_000,
  huddleGap: 0.7,
  /** Summer: up to this many gather on the pond's rim for a splash party. */
  pondPartyMs: 10_000,
  pondPartyMax: 3,
  pondPartyReach: 14,
  /** Festival days: cheerful Nubbins dance in a ring. */
  ringMs: 12_000,
  ringMin: 2,
  ringMax: 6,
  ringRadius: 1.7,
  /** A festival day is the first third of every period, once the town's festival stands. */
  festivalPeriodMs: 12 * 60_000,
  festivalDayShare: 0.34,
} as const;

/** R0592 (SOUL-75): Eternals and Moss, the old souls. */
export const OLD_SOUL_TEACH = {
  /** Wander speed for an Eternal. */
  gait: 0.55,
  /** A child within this range of an idle Eternal may come and sit to learn. */
  teachRadius: 9,
  /** Chance per second, for a free idle child in range. */
  teachPerSecond: 0.05,
  teachMs: 14_000,
  /** The Eternal's own teach act. */
  teachActMs: 14_000,
} as const;

/** R0583 (SOUL-66): personality in the race and expedition presentation (never in the sums). */
export const RACE_PERSONA = {
  /** The start-line pose plays for this long from the gun. */
  startLineMs: 2_400,
  /** R0583 (round 12): the hold before the gun, so the poses play before anyone moves. */
  countdownMs: 2_400,
  /** A cheered racer's voice bubble lasts this long. */
  voiceMs: 1_100,
  /** The expedition's runner does its pose for this long at the start. */
  expeditionStartMs: 1_800,
} as const;
