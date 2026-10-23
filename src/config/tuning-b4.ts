/**
 * Tunables for campaign-graphics-4 package b4 (re-exported from tuning.ts): the people
 * (K4 Fern's story look, K8 portrait faces, K38 Hazel's ages), the tale grade (K11), the
 * speaker's contact ring and rim (K14) and the separate campaigns' departures (K37).
 */
export const CG4_B4 = {
  /** K38: body scale (before the sprite's own shrink) for Hazel's two story looks. */
  hazel: {
    /** Hazel from chapter 11 on: smaller than you remember. */
    oldFromChapter: 11,
    oldScale: 0.84,
    /** A static stoop, as a share of height lost; package a1's pose reads `NpcLook.stoop`. */
    oldStoop: 0.05,
    youngScale: 0.74,
    /** The stick: height as a share of the figure, and how far out at the hand's side. */
    stick: { height: 0.62, side: 0.34, lean: 0.12 },
  },
  /** K11: the tale grade. `css` is the CAMPAIGN_LOOK entry (3D, and any pixel without post). */
  tale: {
    css: {
      tint: '#e8b878',
      tintAlpha: 0.42,
      sat: 0.3,
      shadow: '#2a1a0a',
      shadowAlpha: 0.62,
      core: 0.26,
      accent: '#e8c890',
    },
    /** Pixel post: how far toward warm sepia, the vignette strength, the ease-in time (s). */
    post: { sepia: 0.62, vignette: 0.55, easeS: 0.7 },
  },
  /** K14: the speaker's contact ring (3D) and brighter outline step. */
  ring: {
    inner: 0.3,
    outer: 0.44,
    lift: 0.035,
    color: '#eef0e2',
    /** The speaker's outline, a step brighter than the toon's near-black. */
    outline: '#8a82a6',
    opacity: 0.5,
    /** Scan the scene for the speaker's rig at most this often (s). */
    scanS: 0.4,
    /** Rig groups this near the speaker's feet (m) count as the speaker. */
    radius: 0.55,
  },
  /** K37: the departure's soft cocoon and the flower that follows. */
  departure: {
    cocoonOpacity: 0.9,
    /** The share of the scene's lines the cocoon takes to fade (the last line brings the flower). */
    fadeBy: 0.85,
    flowerGrowS: 2.2,
    pixelCocoonW: 1.6,
  },
} as const;
