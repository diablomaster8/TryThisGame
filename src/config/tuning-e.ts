import type { SceneStage } from './story';

/**
 * Tunables for campaign-graphics package e ("people and lanterns"), re-exported from
 * tuning.ts: lantern light levels and the vigil's blue bead (H3), hand lanterns (H4), the
 * Hush's ring and colossus (M11), and the staging this package supplies for the scenes it
 * dresses (merged under the authored stages by `resolveStage`).
 */

/** The four posts, in the order the Grove's props number them. */
export const LANTERN_IDS = ['lantern-1', 'lantern-2', 'lantern-3', 'lantern-4'] as const;

export const LANTERN_E = {
  /** Glass emissive in 3D: steady, the flicker's range, the dimmer steady form, the bead. */
  glassLit: 2.4,
  glassFlicker: { min: 1.3, max: 2.7, hz: 7 },
  glassSteadyDim: 1.5,
  glassLow: 0.9,
  glassWarm: '#ffb347',
  glassCold: '#6fb4ff',
  /** The halo card over a post's lamp head: world size and opacity. */
  haloSize: 2.2,
  haloOpacity: 0.2,
  /** The additive card in 3D carries more (it adds light, it does not cover). */
  haloOpacity3d: 0.6,
  haloLowSize: 1.1,
  /** Pixel: the flicker's tint swing and its still, dimmer form under reduced motion. */
  pixelFlicker: { min: 0.8, max: 1.2, hz: 7 },
  pixelSteadyDim: 0.9,
  /** Pixel: how far toward the camera a post's overlay and halo sit, to win the depth tie. */
  overlayLift: 0.03,
} as const;

export const HAND_LANTERN = {
  /** Where the hand sits, in world units from the figure's feet: out to the side, hip high. */
  side: 0.44,
  forward: 0.1,
  height: 0.5,
  /** Hanging lantern: box size and glow card size (3D). */
  box: 0.15,
  glowSize: 0.9,
  glowOpacity: 0.5,
  emissive: 2.2,
  /** Pixel: the sway between its two frames. */
  frameMs: 650,
  /** Pixel: billboard size of the 32 px overlay (the same as a Keeper frame). */
  pixelSize: 2,
  /** How many carriers the 3D pool prepares (the vigil has four). */
  poolSize: 8,
} as const;

/**
 * M11, the Hush: the lamps go out in a ring driven outward from where it stands, then (in
 * the closing scene) come back in the same order. Scenes are named here because the
 * storyline's own stages carry no `lights`.
 */
export const HUSH = {
  origin: { x: 0, z: -22 },
  /** Units per second the ring travels (a scene is a few lines long, so quickly). */
  speed: 9,
  /** Seconds before the ring starts. */
  delay: 0.6,
  out: ['h-c9-open', 'h-c9-mountain', 'h-c9-lamp-lit', 'h-c9-lamp-left'] as readonly string[],
  back: ['h-c9-close'] as readonly string[],
  /** The colossus: a soft, grey, fog-shaped card at the edge of the fog. */
  colossus: { width: 18, height: 26, y: 9, opacity: 0.6, fadeIn: 4 },
} as const;

const ALL_LIT = {
  'lantern-1': 'lit',
  'lantern-2': 'lit',
  'lantern-3': 'lit',
  'lantern-4': 'lit',
} as const;

const HAZEL_UP = { who: 'hazel', mark: 'hill-path', face: 'you', carry: 'lantern' } as const;
const MOSS_SITS = { who: 'moss', mark: 'flat-stone', pose: 'sit' } as const;

/**
 * Staging for the scenes this package dresses (H3, H4, M6). `resolveStage` lets a script's
 * own stage, and `config/scene-stages.ts`, win over these, field by field.
 */
export const E_STAGES: Readonly<Record<string, SceneStage>> = {
  // Lantern Night: the four posts catch by name; the long-grass one only flickers.
  'c4-close': { lights: { ...ALL_LIT, 'lantern-4': 'flicker' } },
  // Moss sits: "carefully, like something that has decided to".
  'c4-open': { cast: [MOSS_SITS] },
  'c11-moss-here': { cast: [MOSS_SITS] },
  'c11-moss-kept': { cast: [MOSS_SITS] },
  'c12-walk-moss': { cast: [{ ...MOSS_SITS, mark: 'hill-path' }, HAZEL_UP] },
  // The vigil: four lanterns, and people round the posts holding lanterns of their own.
  'c10-vigil': {
    lights: ALL_LIT,
    cast: [
      { who: 'fern', mark: 'wall-lantern', carry: 'lantern' },
      { who: 'sparks', mark: 'stream-lantern', carry: 'lantern' },
      { who: 'clover', mark: 'pond-lantern', carry: 'lantern' },
      { who: 'nova', mark: 'grass-lantern', carry: 'lantern' },
    ],
  },
  // Hazel goes up the hill with her lantern.
  'c12-walk-you': { cast: [HAZEL_UP] },
  'c12-walk-sable': { cast: [HAZEL_UP] },
  'c12-walk-corvin': { cast: [HAZEL_UP] },
  'c12-walk-alone': { cast: [HAZEL_UP] },
};
