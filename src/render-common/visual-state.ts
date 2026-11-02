/**
 * TECH-13: what a Nubbin is doing, in words both renderers share. Pixel names it by sprite
 * clip (`clipFor`, render/world-view.ts) and Full 3D by rig pose (`poseFor`,
 * render3d/actors.ts); each name maps to one `VisualState` here, and
 * `tests/render/parity.test.ts` asks both for the same seeded Nubbins and fails when the two
 * disagree outside the listed gaps (docs/renderer-parity.md). Pure data: no DOM, no three.
 */
export const VISUAL_STATES = [
  'idle',
  'walk',
  'flap',
  'swim',
  'sleep',
  'eat',
  'sit',
  'sad',
  'cry',
  'happy',
  'love',
  'dizzy',
  'surprised',
  'tumble',
  'held',
] as const;
export type VisualState = (typeof VISUAL_STATES)[number];

/** Pixel clip names (including the three swim strokes and the held clip) to their state. */
const CLIP_STATE: Record<string, VisualState> = {
  idle: 'idle',
  walk: 'walk',
  flap: 'flap',
  paddle: 'swim',
  swim: 'swim',
  crawl: 'swim',
  sleep: 'sleep',
  eat: 'eat',
  sit: 'sit',
  sad: 'sad',
  cry: 'cry',
  happy: 'happy',
  love: 'love',
  dizzy: 'dizzy',
  surprised: 'surprised',
  tumble: 'tumble',
  held: 'held',
};

/** 3D pose names. `pet` is the held and petted body; the Keeper-only poses have no state. */
const POSE_STATE: Record<string, VisualState | null> = {
  idle: 'idle',
  walk: 'walk',
  flap: 'flap',
  swim: 'swim',
  sleep: 'sleep',
  eat: 'eat',
  sit: 'sit',
  sad: 'sad',
  cry: 'cry',
  happy: 'happy',
  love: 'love',
  dizzy: 'dizzy',
  surprised: 'surprised',
  tumble: 'tumble',
  pet: 'held',
  carry: null,
  throw: null,
  kneel: null,
  itemGet: null,
};

export function visualStateOfClip(clip: string): VisualState | null {
  return CLIP_STATE[clip] ?? null;
}

export function visualStateOfPose(pose: string): VisualState | null {
  return POSE_STATE[pose] ?? null;
}
