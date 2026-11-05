/**
 * TECH-13: what a Nubbin is doing, in words both renderers share. Pixel names it by sprite
 * clip (`clipFor`, render/world-view.ts) and Full 3D by rig pose (`poseFor`,
 * render3d/actors.ts); each name maps to one `VisualState` here, and
 * `tests/render/parity.test.ts` asks both for the same seeded Nubbins and fails when the two
 * disagree outside the listed gaps (docs/renderer-parity.md). Pure: no DOM, no three.
 *
 * R0455 (r12-d3): `visualStateFor` is the one rule from a Nubbin's behaviour to its state; Full
 * 3D's `poseFor` is that state's pose (`poseOfState`), and Pixel names the petted state too.
 */
import type { PoseName } from '../samples/species';
import { performClip } from '../render/perform-look';
import { moodOf } from '../sim/needs';
import { flaps } from '../sim/stats';
import type { Nubbin } from '../sim/types';

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
  /** Being petted: 3D leans into the hand; Pixel draws it with its happy frames. */
  'petted',
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
  // R0239: the battle verbs share the state of the 3D pose the battle view maps them onto.
  windup: 'happy',
  bonk: 'happy',
  splash: 'flap',
  hit: 'sad',
  dodge: 'surprised',
  cheer: 'happy',
  tuckered: 'sleep',
  wave: 'happy',
  petted: 'petted',
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

/** R0455: the rig pose that draws each state in Full 3D (held and petted share the lean-in). */
const STATE_POSE: Record<VisualState, PoseName> = {
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
  held: 'pet',
  petted: 'pet',
};

export function poseOfState(s: VisualState): PoseName {
  return STATE_POSE[s];
}

/**
 * R0455 (TECH-13, r12-d3): sim behaviour and handling as a `VisualState`, by the pixel view's
 * rule (`clipFor`): crying and a low or hungry mood at rest are sad, the reactions get their
 * own body, a thrown body tumbles, a flyer flaps as it moves and a swimmer strokes. `moving`
 * is whether it is on its way somewhere; `petted` is the Keeper's hand on it right now.
 */
export function visualStateFor(n: Nubbin, moving: boolean, petted: boolean): VisualState {
  if (petted) return 'petted';
  const walk = (): VisualState => (moving ? (flaps(n) ? 'flap' : 'walk') : 'idle');
  switch (n.behavior.state) {
    case 'held':
    case 'carried':
      return 'held';
    case 'pet':
      return 'petted';
    case 'nap':
      return 'sleep';
    // R0534: sheltering walks to its tree, then huddles (a sit, eyes open), never asleep.
    case 'shelter':
      return moving ? walk() : 'sit';
    case 'eat':
      return 'eat';
    // LOOK-20: the Chao sit, legs out; a low or hungry sitter is sad.
    case 'sit': {
      if (moving) return walk();
      const mood = moodOf(n);
      return mood === 'sad' || mood === 'hungry' ? 'sad' : 'sit';
    }
    case 'perform': {
      // R0525 (lane A r10): a lesson performed sits to draw, sings, dances or plays.
      const pc = performClip(n);
      if (pc) return pc;
      // R0539: a visit to a friend's flower is a quiet sit (walking there is a walk).
      if (n.behavior.itemId === 'visitFlower') return moving ? 'walk' : 'sit';
      return 'happy';
    }
    case 'play':
    case 'greet':
    case 'court':
    case 'fetch':
      return 'happy';
    // LOOK-21: crying sits, rubs its eyes in turn and wails.
    case 'cry':
      return moving ? walk() : 'cry';
    case 'swim':
      return 'swim';
    case 'thrown':
      return 'tumble';
    case 'react':
      switch (n.behavior.reaction) {
        case 'love':
          return 'love';
        case 'happy':
          return 'happy';
        case 'dizzy':
          return 'dizzy';
        case 'surprised':
          return 'surprised';
        case 'sad':
          return 'sad';
        default:
          return walk();
      }
    case 'wander':
    case 'findFood':
    case 'avoid':
      return walk();
    default: {
      if (moving) return walk();
      const mood = moodOf(n);
      return mood === 'sad' || mood === 'hungry' ? 'sad' : 'idle';
    }
  }
}
