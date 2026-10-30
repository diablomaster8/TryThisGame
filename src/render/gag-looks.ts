/**
 * FUN-04 (sprite side): how each personality's comic idle gag looks in both renderers. The
 * sim state that picks a gag (`idleGag`, seeded, in `sim/behavior.ts`) is lane A's; this
 * table is what the renderers draw for it: the Pixel clip and its timing, the 3D pose, and
 * the emote ball. Every clip is drawn by the Chao sheet (`render/sprites/chao.ts`): the stock
 * clips plus `peek`, `wave` and `clap` added for the gags. A child plays the same gag
 * "wobbly": the renderers slow it by `GAG_WOBBLE` and drop its emote to a question mark.
 */

import type { EmoteShape } from './sprites/emote';
import type { PoseName } from '../samples/species';

export type GagPersonality = 'cheerful' | 'shy' | 'mischievous' | 'lazy';

export type GagId =
  | 'spinDizzy'
  | 'waveBird'
  | 'hum'
  | 'clap'
  | 'hide'
  | 'peek'
  | 'hugTail'
  | 'flowerEat'
  | 'sneakBoo'
  | 'fruitSit'
  | 'ballPush'
  | 'shadowHat'
  | 'standNap'
  | 'roll'
  | 'mouthOpen'
  | 'streamFloat';

export interface GagLook {
  personality: GagPersonality;
  /** The Pixel clip; the frames come from the sheet under `${clip}:<angle>:<i>`. */
  clip: string;
  frames: number;
  ms: number;
  /** The 3D pose. */
  pose3d: PoseName;
  emote: EmoteShape;
  /** A particle the gag throws up now and then (notes for a hum), if any. */
  burst?: 'notes' | 'dust' | 'splash';
}

export const GAG_LOOKS: Record<GagId, GagLook> = {
  spinDizzy: {
    personality: 'cheerful',
    clip: 'tumble',
    frames: 4,
    ms: 90,
    pose3d: 'dizzy',
    emote: 'spiral',
  },
  waveBird: {
    personality: 'cheerful',
    clip: 'wave',
    frames: 2,
    ms: 220,
    pose3d: 'happy',
    emote: 'heart',
  },
  hum: {
    personality: 'cheerful',
    clip: 'happy',
    frames: 2,
    ms: 400,
    pose3d: 'happy',
    emote: 'ball',
    burst: 'notes',
  },
  clap: {
    personality: 'cheerful',
    clip: 'clap',
    frames: 2,
    ms: 140,
    pose3d: 'happy',
    emote: 'star',
  },
  hide: { personality: 'shy', clip: 'peek', frames: 1, ms: 1000, pose3d: 'sit', emote: 'none' },
  peek: {
    personality: 'shy',
    clip: 'peek',
    frames: 2,
    ms: 700,
    pose3d: 'surprised',
    emote: 'exclaim',
  },
  hugTail: { personality: 'shy', clip: 'love', frames: 2, ms: 260, pose3d: 'love', emote: 'heart' },
  flowerEat: {
    personality: 'shy',
    clip: 'eat',
    frames: 3,
    ms: 170,
    pose3d: 'eat',
    emote: 'question',
  },
  sneakBoo: {
    personality: 'mischievous',
    clip: 'surprised',
    frames: 1,
    ms: 600,
    pose3d: 'surprised',
    emote: 'exclaim',
  },
  fruitSit: {
    personality: 'mischievous',
    clip: 'sit',
    frames: 2,
    ms: 600,
    pose3d: 'sit',
    emote: 'star',
  },
  ballPush: {
    personality: 'mischievous',
    clip: 'walk',
    frames: 6,
    ms: 80,
    pose3d: 'walk',
    emote: 'exclaim',
  },
  shadowHat: {
    personality: 'mischievous',
    clip: 'idle',
    frames: 8,
    ms: 150,
    pose3d: 'idle',
    emote: 'question',
  },
  standNap: {
    personality: 'lazy',
    clip: 'sleep',
    frames: 2,
    ms: 800,
    pose3d: 'sleep',
    emote: 'zz',
  },
  roll: {
    personality: 'lazy',
    clip: 'tumble',
    frames: 4,
    ms: 140,
    pose3d: 'tumble',
    emote: 'none',
  },
  mouthOpen: {
    personality: 'lazy',
    clip: 'eat',
    frames: 1,
    ms: 1000,
    pose3d: 'eat',
    emote: 'ball',
  },
  streamFloat: {
    personality: 'lazy',
    clip: 'swim',
    frames: 2,
    ms: 500,
    pose3d: 'swim',
    emote: 'zz',
    burst: 'splash',
  },
};

/** A child's wobbly gag plays this much slower (FUN-04: "the personality forming"). */
export const GAG_WOBBLE = 1.6;

/** The look of a gag, slowed and unsure for a child. */
export function gagLook(id: GagId, child: boolean): GagLook {
  const g = GAG_LOOKS[id];
  return child ? { ...g, ms: g.ms * GAG_WOBBLE, emote: 'question' } : g;
}
