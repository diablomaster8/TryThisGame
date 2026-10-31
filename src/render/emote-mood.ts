/**
 * R0548 (SOUL-30), lane A round 10: the emote ball's mood in its motion and the new shapes'
 * rules, shared by both renderers so Pixel and 3D show the same ball. A happy ball bobs fast
 * and a little higher; a sad one bobs slowly and droops toward the head. Reduced motion keeps
 * the droop (it is a pose, not a movement) and the ordinary bob speed. Render-only.
 */
import { EMOTE_MOOD } from '../config/tuning';
import { likesOf } from '../sim/likes';
import { moodOf } from '../sim/needs';
import { hashSeed } from '../sim/rng';
import { speciesOf } from '../sim/species';
import type { Nubbin } from '../sim/types';
import type { EmoteShape } from './sprites/emote';

export interface EmoteMotion {
  /** Frame flip period (ms): the ball's bob. */
  flipMs: number;
  /** Lift (world units, Pixel's 2-unit Nubbin): negative droops toward the head. */
  dy: number;
}

const motion: EmoteMotion = { flipMs: 400, dy: 0 };

export function emoteMotion(n: Nubbin, nowMs: number, reduce: boolean): EmoteMotion {
  const M = EMOTE_MOOD;
  const mood = moodOf(n);
  const sad = mood === 'sad' || mood === 'hungry' || n.behavior.state === 'cry';
  motion.flipMs = reduce
    ? M.flipMs.content
    : sad
      ? M.flipMs.sad
      : mood === 'happy'
        ? M.flipMs.happy
        : M.flipMs.content;
  motion.dy = sad
    ? -M.droop
    : mood === 'happy' && !reduce
      ? Math.abs(Math.sin((nowMs / M.flipMs.happy) * Math.PI)) * M.hop
      : 0;
  return motion;
}

/**
 * The pocket and digital families' tiny content sign (an ear-flick spark, a blinking pixel),
 * shown for a moment in each cycle at a phase of its own, or null between times. The Chao line
 * keeps its ball.
 */
export function familySign(n: Nubbin, simMs: number): EmoteShape | null {
  const fam = speciesOf(n.species).family;
  if (fam === 'chao') return null;
  const M = EMOTE_MOOD;
  const phase = hashSeed(`sign:${n.id}`) % M.familyCycleMs;
  if ((simMs + phase) % M.familyCycleMs >= M.familySignMs) return null;
  return fam === 'pocket' ? 'pspark' : 'dblink';
}

/**
 * The moods and acts the new shapes speak for, ahead of the plain mood ball: a deep sleep, a
 * cry's droop, a wary step back's sweat, a play's sparkle (the favourite toy), a lesson's
 * thinking dots, a bored lazy sit, a grumpy mood's puff, a sheltering cloud, a walk to fruit.
 */
export function moodShape(
  n: Nubbin,
  world?: { items: readonly { id: string; toy?: string }[] },
): EmoteShape | null {
  const b = n.behavior;
  switch (b.state) {
    case 'nap':
      return n.needs.energy < 0.3 ? 'zzbig' : 'zz';
    case 'cry':
      return 'droop';
    case 'avoid':
      return 'drop';
    case 'lesson':
      return 'dots';
    case 'shelter':
      return 'cloud';
    case 'findFood':
      return moodOf(n) === 'hungry' ? null : 'fruit';
    case 'play': {
      const toy = world?.items.find((i) => i.id === b.itemId);
      return toy && (toy.toy ?? 'ball') === likesOf(n).toy ? 'sparkle' : null;
    }
    case 'sit':
      if (n.moody === 'grumpy') return 'puff';
      if (n.personality === 'lazy' && moodOf(n) === 'content') return 'dots';
      return null;
    default:
      return null;
  }
}
