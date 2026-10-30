/**
 * LOOK-44: each favourite pocket species plays its own iconic idle beat every 8–15 s, so it
 * reads by its motion as well as its shape: a sparking cheek, a flaring tail, a held head,
 * a blank stare, a sung note (notes only, never words), a sleeper that never wakes, a spin,
 * a bounce, a ghost's float, a magnet's hover, a mole popping in and out, a flex, a jab, a
 * kick, a bird's glide and a fish's loop. Both renderers read `signatureAt` while the
 * creature idles: Pixel takes the clip, offset, squash, flip and particle; 3D takes the pose
 * and the offset. Render-only, timed by the wall clock and seeded by the Nubbin's id.
 */

import type { ParticleKind } from './sprites/particles-art';
import type { PoseName } from '../samples/species';

export type Signature =
  | 'cheekSpark'
  | 'tailFlame'
  | 'headHold'
  | 'blankStare'
  | 'singNotes'
  | 'sleepAlways'
  | 'spin'
  | 'bounce'
  | 'float'
  | 'hover'
  | 'drill'
  | 'flex'
  | 'shadowBox'
  | 'kick'
  | 'glide'
  | 'swimLoop';

/** Species id → its signature (the inspirations are in `sim/species.ts`). */
export const SIGNATURES: Readonly<Record<string, Signature>> = {
  zapling: 'cheekSpark',
  zapkin: 'cheekSpark',
  zapmaw: 'cheekSpark',
  cinderkit: 'tailFlame',
  cinderclaw: 'tailFlame',
  cinderwing: 'tailFlame',
  muddleduck: 'headHold',
  bluebill: 'headHold',
  dawdlet: 'blankStare',
  dawdleshell: 'blankStare',
  puffbud: 'singNotes',
  puffle: 'singNotes',
  pufflow: 'singNotes',
  snoozelump: 'sleepAlways',
  spinmaster: 'spin',
  copyblob: 'bounce',
  spooklet: 'float',
  spookhand: 'float',
  spookgrin: 'float',
  clinkbolt: 'hover',
  clinktrio: 'hover',
  burrowbud: 'drill',
  burrowtrio: 'drill',
  flexling: 'flex',
  flexbrute: 'flex',
  flexchamp: 'flex',
  jabmaster: 'shadowBox',
  kickmaster: 'kick',
  peeplet: 'glide',
  peepwing: 'glide',
  galeplume: 'glide',
  scrapwing: 'glide',
  spearbeak: 'glide',
  duskflit: 'glide',
  duskgape: 'glide',
  silkfin: 'swimLoop',
  hornfin: 'swimLoop',
  flopfish: 'swimLoop',
  snoutling: 'swimLoop',
  snoutspine: 'swimLoop',
};

/** How long one beat plays, and the gap range between beats. */
export const SIGNATURE_TIMING = { playMs: 1800, gapMs: [8000, 15000] } as const;

/** One moment of a signature beat. */
export interface SignatureFrame {
  sig: Signature;
  /** Pixel clip to show instead of idle (the sheet's stock clips), and its frame. */
  clip: string;
  frame: number;
  /** 3D pose to play instead of idle. */
  pose3d: PoseName;
  /** Lift off the ground, world units (negative sinks: the drill). */
  dy: number;
  /** Squash at draw time: width and height scale. */
  sw: number;
  sh: number;
  /** Mirror the frame now (the spin, the jab). */
  flip: boolean;
  /** A particle to throw this frame, if any, and where on the body (0 feet … 1 head top). */
  burst?: ParticleKind;
  burstAt?: number;
}

function hash(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619) >>> 0;
  return h;
}

/**
 * The signature frame for a Nubbin of `species` at wall time `nowMs`, or null between
 * beats (or for a species without one). `reduced` (prefers-reduced-motion) keeps the poses
 * and particles but drops the offsets, spins and squash.
 */
export function signatureAt(
  id: string,
  species: string,
  nowMs: number,
  reduced = false,
): SignatureFrame | null {
  const sig = SIGNATURES[species];
  if (!sig) return null;
  const h = hash(id);
  const [lo, hi] = SIGNATURE_TIMING.gapMs;
  const period = lo + (h % (hi - lo)) + SIGNATURE_TIMING.playMs;
  const t = (nowMs + (h % period)) % period;
  if (t >= SIGNATURE_TIMING.playMs) return null;
  const p = t / SIGNATURE_TIMING.playMs;
  const tick = Math.floor(t / 120);
  const f: SignatureFrame = recipe(sig, p, t, tick);
  return reduced ? { ...f, dy: 0, sw: 1, sh: 1, flip: false } : f;
}

const base = (sig: Signature): SignatureFrame => ({
  sig,
  clip: 'idle',
  frame: 0,
  pose3d: 'idle',
  dy: 0,
  sw: 1,
  sh: 1,
  flip: false,
});

function recipe(sig: Signature, p: number, t: number, tick: number): SignatureFrame {
  const f = base(sig);
  const hump = Math.sin(p * Math.PI);
  const every = (n: number) => tick % n === 0 && t % 120 < 40;
  switch (sig) {
    case 'cheekSpark':
      return {
        ...f,
        clip: 'happy',
        frame: tick % 2,
        pose3d: 'happy',
        ...(every(2) ? { burst: 'sparkle', burstAt: 0.7 } : {}),
      };
    case 'tailFlame':
      return { ...f, sh: 1 + 0.04 * hump, ...(every(1) ? { burst: 'ember', burstAt: 0.3 } : {}) };
    case 'headHold':
      return { ...f, clip: 'dizzy', pose3d: 'dizzy', sw: 1 + 0.03 * Math.sin(t / 90) };
    case 'blankStare':
      // Frozen on the open-eyed frame, then a slow tilt: nothing behind the eyes.
      return { ...f, frame: 0, pose3d: 'surprised', sw: 1 - 0.02 * hump };
    case 'singNotes':
      return {
        ...f,
        clip: 'happy',
        frame: Math.floor(t / 400) % 2,
        pose3d: 'happy',
        ...(every(4) ? { burst: 'note', burstAt: 1 } : {}),
      };
    case 'sleepAlways':
      return {
        ...f,
        clip: 'sleep',
        frame: Math.floor(t / 800) % 2,
        pose3d: 'sleep',
        sh: 1 - 0.04 * hump,
      };
    case 'spin':
      return {
        ...f,
        clip: 'tumble',
        frame: tick % 4,
        pose3d: 'tumble',
        flip: tick % 2 === 1,
        ...(every(3) ? { burst: 'dust', burstAt: 0 } : {}),
      };
    case 'bounce': {
      const b = Math.abs(Math.sin(p * Math.PI * 3));
      return {
        ...f,
        clip: 'happy',
        frame: b > 0.5 ? 1 : 0,
        pose3d: 'happy',
        dy: 0.35 * b,
        sw: 1 + 0.12 * (1 - b),
        sh: 1 - 0.12 * (1 - b),
      };
    }
    case 'float':
      return { ...f, clip: 'happy', pose3d: 'happy', dy: 0.25 * hump + 0.08 * Math.sin(t / 200) };
    case 'hover':
      return {
        ...f,
        dy: 0.2 * hump + 0.03 * Math.sin(t / 40),
        ...(every(3) ? { burst: 'sparkle', burstAt: 0.5 } : {}),
      };
    case 'drill': {
      // Down into the ground and back up: squashed to a mound, then popping out.
      const down = Math.min(1, Math.sin(p * Math.PI) * 1.6);
      return {
        ...f,
        clip: 'surprised',
        pose3d: 'surprised',
        dy: -0.35 * down,
        sh: 1 - 0.55 * down,
        ...(every(2) ? { burst: 'dust', burstAt: 0 } : {}),
      };
    }
    case 'flex':
      return {
        ...f,
        clip: 'happy',
        frame: 1,
        pose3d: 'happy',
        sw: 1 + 0.08 * hump,
        sh: 1 - 0.03 * hump,
      };
    case 'shadowBox':
      return {
        ...f,
        clip: 'walk',
        frame: tick % 6,
        pose3d: 'happy',
        flip: Math.floor(t / 240) % 2 === 1,
      };
    case 'kick':
      return {
        ...f,
        clip: 'tumble',
        frame: Math.min(3, Math.floor(p * 6)),
        pose3d: 'surprised',
        dy: 0.15 * hump,
        ...(every(5) ? { burst: 'dust', burstAt: 0 } : {}),
      };
    case 'glide':
      return { ...f, clip: 'flap', frame: tick % 2, pose3d: 'flap', dy: 0.3 * hump };
    case 'swimLoop':
      return {
        ...f,
        clip: 'swim',
        frame: Math.floor(t / 320) % 2,
        pose3d: 'swim',
        dy: 0.1 * Math.sin(p * Math.PI * 2),
        flip: p > 0.5,
      };
  }
}
