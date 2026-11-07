/** Lane D round 16, d1: the snow slide's spray and swish (R0118, WORLD-51). */

export const SLIDE_FX = {
  /** A puff of snow off the Keeper's feet this often while sliding. */
  sprayMs: 70,
  /** Flakes per puff (reduced motion keeps its own small count in the 3D bursts). */
  count: 3,
  /** Snow colour for the 3D dust quads. */
  colour: '#f4f8ff',
  /** The swish at the start of a slide: noise band (Hz), length and loudness. */
  swish: { band: [1800, 5200] as [number, number], dur: 0.32, gain: 0.16 },
  /** No second swish within this many ms of the last one. */
  swishGapMs: 900,
} as const;
