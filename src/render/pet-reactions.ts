/**
 * Each pet action's own beat (FUN-09, R0298), shared by both renderers. The sim still answers
 * every action with one of its few reactions (happy, love, confused); this layer, keyed off the
 * `interacted` event, plays a short distinct body over it: a tickle wiggles (a second within 5 s
 * brings three hiccup hops), a hug squishes, a groom fluffs up, praise puffs the chest out under
 * a sparkle, a high five plays out by personality (a slap, a miss, a paw pulled away), and a tuck
 * in when not tired sits up wide-eyed. Render-only: it reads events and never writes the sim.
 */
import type { Interaction, Nubbin, Personality } from '../sim/types';

export type PetBeatKind =
  'giggle' | 'hiccup' | 'squish' | 'fluff' | 'puff' | 'slap' | 'miss' | 'tease' | 'wideAwake';

/** How long each beat plays, in ms. */
export const PET_BEAT_MS: Record<PetBeatKind, number> = {
  giggle: 900,
  hiccup: 1500,
  squish: 600,
  fluff: 1100,
  puff: 1000,
  slap: 700,
  miss: 1100,
  tease: 900,
  wideAwake: 1200,
};

/** A second tickle inside this window brings the hiccups. */
const HICCUP_WINDOW_MS = 5000;

/** What a beat does to the drawn body this frame. */
export interface PetBeatPose {
  kind: PetBeatKind;
  /** The Pixel clip (and frame, when fixed) to show, or null to keep the sim's. */
  clip: string | null;
  frame: number | null;
  /** The matching 3D pose. */
  pose3d: 'happy' | 'love' | 'surprised' | 'dizzy' | 'sit' | null;
  /** Width and height scale, and offsets along the screen (x) and up (y), in body heights. */
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  /** 0..1 through the beat. */
  t: number;
}

/** Which beat an action plays, given the Nubbin and whether it is a repeat tickle. */
export function beatFor(
  action: Interaction,
  personality: Personality | null,
  energy: number,
  repeatTickle: boolean,
): PetBeatKind {
  switch (action) {
    case 'tickle':
      return repeatTickle ? 'hiccup' : 'giggle';
    case 'hug':
      return 'squish';
    case 'groom':
      return 'fluff';
    case 'praise':
      return 'puff';
    case 'highFive':
      return personality === 'shy' ? 'miss' : personality === 'mischievous' ? 'tease' : 'slap';
    case 'tuckIn':
      return energy < 0.6 ? 'squish' : 'wideAwake';
  }
}

/** The body for a beat `t` (0..1) of the way through. */
export function beatPose(kind: PetBeatKind, t: number): PetBeatPose {
  const out: PetBeatPose = {
    kind,
    clip: null,
    frame: null,
    pose3d: null,
    sw: 1,
    sh: 1,
    dx: 0,
    dy: 0,
    t,
  };
  const wave = (hz: number) => Math.sin(t * Math.PI * 2 * hz);
  const fade = 1 - t;
  switch (kind) {
    case 'giggle':
      // A quick side-to-side shake, eyes squeezed happy.
      out.clip = 'happy';
      out.pose3d = 'happy';
      out.dx = wave(6) * 0.04 * fade;
      out.sw = 1 + Math.abs(wave(6)) * 0.04 * fade;
      break;
    case 'hiccup': {
      // Three little hops with a surprised face at the top of each.
      const hop = Math.max(0, Math.sin(t * Math.PI * 3));
      out.clip = hop > 0.5 ? 'surprised' : 'happy';
      out.frame = 0;
      out.pose3d = hop > 0.5 ? 'surprised' : 'happy';
      out.dy = hop * 0.12;
      out.sh = 1 + hop * 0.06;
      out.sw = 1 - hop * 0.04;
      break;
    }
    case 'squish': {
      // Squeezed down to 0.85 tall for the first 150 ms, then let go with a little bounce.
      const s = t < 0.25 ? Math.sin((t / 0.25) * Math.PI) : 0;
      out.clip = 'love';
      out.pose3d = 'love';
      out.sh = 1 - 0.15 * s;
      out.sw = 1 + 0.1 * s;
      break;
    }
    case 'fluff': {
      // Puffed up round for a beat, then a smug settle (eyes happy, chin up).
      const p = t < 0.4 ? Math.sin((t / 0.4) * Math.PI * 0.5) : 1 - (t - 0.4) / 0.6;
      out.clip = t < 0.4 ? 'surprised' : 'love';
      out.frame = 0;
      out.pose3d = t < 0.4 ? 'surprised' : 'love';
      out.sw = 1 + 0.12 * p;
      out.sh = 1 + 0.05 * p;
      break;
    }
    case 'puff':
      // Chest out and up on the toes.
      out.clip = 'happy';
      out.frame = 0;
      out.pose3d = 'happy';
      out.sw = 1 + 0.08 * Math.sin(Math.min(1, t * 3) * Math.PI * 0.5) * fade;
      out.dy = 0.04 * Math.sin(Math.min(1, t * 3) * Math.PI * 0.5) * fade;
      break;
    case 'slap':
      out.clip = 'happy';
      out.pose3d = 'happy';
      out.dy = t < 0.3 ? (t / 0.3) * 0.06 : 0.06 * (1 - (t - 0.3) / 0.7);
      break;
    case 'miss':
      // Reaches, misses, bonks its own head and looks at its paw.
      out.clip = t < 0.35 ? 'happy' : 'dizzy';
      out.frame = 0;
      out.pose3d = t < 0.35 ? 'happy' : 'dizzy';
      out.dx = t < 0.35 ? (t / 0.35) * 0.06 : 0.06;
      out.sh = t > 0.35 && t < 0.5 ? 0.92 : 1;
      break;
    case 'tease':
      // Paw up, then snatched back with a hop away.
      out.clip = t < 0.5 ? 'happy' : 'surprised';
      out.frame = 0;
      out.pose3d = t < 0.5 ? 'happy' : 'surprised';
      out.dx = t < 0.5 ? 0 : -0.1 * Math.sin(((t - 0.5) / 0.5) * Math.PI);
      out.dy = t < 0.5 ? 0 : 0.05 * Math.sin(((t - 0.5) / 0.5) * Math.PI);
      break;
    case 'wideAwake':
      // Sits up straight, eyes wide: not sleepy at all.
      out.clip = 'surprised';
      out.frame = 0;
      out.pose3d = 'surprised';
      out.sh = 1.06;
      out.sw = 0.97;
      break;
  }
  return out;
}

interface Beat {
  kind: PetBeatKind;
  startMs: number;
}

/** Which particles a beat sends off as it starts (the renderers map these to their own). */
export const PET_BEAT_BURST: Partial<Record<PetBeatKind, 'heart' | 'dust' | 'sparkle' | 'note'>> = {
  squish: 'heart',
  fluff: 'dust',
  puff: 'sparkle',
  hiccup: 'note',
  giggle: 'note',
  slap: 'sparkle',
};

/** Per-Nubbin beats for one renderer (each keeps its own, on its own clock). */
export class PetBeats {
  private readonly beats = new Map<string, Beat>();
  private readonly lastTickle = new Map<string, number>();
  private readonly pending = new Map<string, { action: Interaction; atMs: number }>();

  /** An `interacted` event landed; the beat starts when the Nubbin is next drawn. */
  queue(id: string, action: Interaction, ok: boolean, nowMs: number): void {
    if (ok) this.pending.set(id, { action, atMs: nowMs });
  }

  /**
   * The beat a Nubbin is playing now, or null, starting a queued one first. `fresh` is true on
   * the frame a beat starts, for its particles.
   */
  frame(n: Nubbin, nowMs: number): (PetBeatPose & { fresh: boolean }) | null {
    const p = this.pending.get(n.id);
    let fresh = false;
    if (p) {
      this.pending.delete(n.id);
      this.start(n, p.action, true, p.atMs);
      fresh = true;
    }
    const pose = this.pose(n.id, nowMs);
    return pose ? { ...pose, fresh } : null;
  }

  /** Start an action's beat at once. Returns the beat started. */
  start(n: Nubbin, action: Interaction, ok: boolean, nowMs: number): PetBeatKind | null {
    if (!ok) return null;
    const last = this.lastTickle.get(n.id);
    const repeat = action === 'tickle' && last !== undefined && nowMs - last < HICCUP_WINDOW_MS;
    if (action === 'tickle') this.lastTickle.set(n.id, repeat ? -Infinity : nowMs);
    const kind = beatFor(action, n.personality, n.needs.energy, repeat);
    this.beats.set(n.id, { kind, startMs: nowMs });
    return kind;
  }

  /** The beat a Nubbin is playing now, or null. */
  pose(id: string, nowMs: number): PetBeatPose | null {
    const b = this.beats.get(id);
    if (!b) return null;
    const t = (nowMs - b.startMs) / PET_BEAT_MS[b.kind];
    if (t >= 1 || t < 0) {
      this.beats.delete(id);
      return null;
    }
    return beatPose(b.kind, t);
  }
}

const toastTickles = new Map<string, number>();

/**
 * The toast's beat for a pet action: the same rule the renderers play (a second tickle within
 * 5 s is the hiccups; a tuck-in when not tired is wide awake). `nowMs` is sim time.
 */
export function toastBeat(n: Nubbin, action: Interaction, nowMs: number): string {
  if (action === 'tickle') {
    const last = toastTickles.get(n.id);
    const repeat = last !== undefined && nowMs - last < HICCUP_WINDOW_MS;
    toastTickles.set(n.id, repeat ? -Infinity : nowMs);
    return repeat ? 'hiccup' : 'tickle';
  }
  if (action === 'tuckIn' && n.behavior.state !== 'nap') return 'wideAwake';
  return action;
}
