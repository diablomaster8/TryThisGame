/**
 * Each pet action's own beat (FUN-09, R0298), shared by both renderers. The sim still answers
 * every action with one of its few reactions (happy, love, confused); this layer, keyed off the
 * `interacted` event, plays a short distinct body over it: a tickle wiggles (a second within 5 s
 * brings three hiccup hops), a hug squishes, a groom fluffs up, praise puffs the chest out under
 * a sparkle, a high five plays out by personality (a slap, a miss, a paw pulled away), and a tuck
 * in when not tired sits up wide-eyed. Render-only: it reads events and never writes the sim.
 */
import type { Interaction, Nubbin, Personality } from '../sim/types';
import { SOUL_BURST_MS, soulLookKind, soulPose, type SoulLookKind } from './soul-looks';

export type PetBeatKind =
  | 'giggle'
  | 'hiccup'
  | 'squish'
  | 'fluff'
  | 'puff'
  | 'slap'
  | 'miss'
  | 'tease'
  | 'wideAwake'
  // R0536: a favourite fruit (a cheek-puffed hop) and a disliked one (tongue out, a shudder).
  | 'yum'
  | 'bleh'
  // R0551: a pet by personality (a bounce, a blush, a wiggle, a melt) and a landing after a
  // throw (a wheee, a teary sit, a cheeky tongue, a flop that stays down).
  | 'bounce'
  | 'blush'
  | 'wiggle'
  | 'melt'
  | 'wheee'
  | 'teary'
  | 'tongue'
  | 'flop';

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
  yum: 1000,
  bleh: 1100,
  bounce: 900,
  blush: 1200,
  wiggle: 1100,
  melt: 1400,
  wheee: 1300,
  teary: 1600,
  tongue: 1100,
  flop: 3000,
};

/** A second tickle inside this window brings the hiccups. */
const HICCUP_WINDOW_MS = 5000;

/** What a beat does to the drawn body this frame. */
export interface PetBeatPose {
  /** A pet beat, or one of the lane A r8 idle looks (render/soul-looks.ts). */
  kind: PetBeatKind | SoulLookKind;
  /** The Pixel clip (and frame, when fixed) to show, or null to keep the sim's. */
  clip: string | null;
  frame: number | null;
  /** The matching 3D pose. */
  pose3d:
    | 'happy'
    | 'love'
    | 'surprised'
    | 'dizzy'
    | 'sit'
    | 'sad'
    | 'eat'
    | 'sleep'
    | 'idle'
    | 'walk'
    | null;
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
    case 'yum': {
      // Cheeks puffed (wide), then a little hop of delight.
      const hop = t > 0.4 ? Math.max(0, Math.sin(((t - 0.4) / 0.6) * Math.PI * 2)) : 0;
      out.clip = t < 0.4 ? 'eat' : 'love';
      out.pose3d = t < 0.4 ? 'eat' : 'love';
      out.sw = t < 0.4 ? 1.08 : 1;
      out.dy = hop * 0.1;
      break;
    }
    case 'bounce': {
      // Two happy bounces under the hand.
      const hop = Math.abs(Math.sin(t * Math.PI * 2));
      out.clip = 'happy';
      out.pose3d = 'happy';
      out.dy = 0.1 * hop;
      out.sh = 1 + 0.05 * hop;
      break;
    }
    case 'blush':
      // Shrinks into itself and turns a little away, all blush.
      out.clip = 'love';
      out.frame = 0;
      out.pose3d = 'love';
      out.sw = 0.92;
      out.sh = 0.9;
      out.dx = -0.04 * Math.sin(t * Math.PI);
      break;
    case 'wiggle':
      // Wriggles out from under the hand, then leans back in for more.
      out.clip = t < 0.6 ? 'surprised' : 'happy';
      out.frame = 0;
      out.pose3d = t < 0.6 ? 'surprised' : 'happy';
      out.dx = t < 0.6 ? 0.1 * Math.sin((t / 0.6) * Math.PI) + wave(8) * 0.02 : 0;
      break;
    case 'melt':
      // Goes flat as a pancake with bliss.
      out.clip = 'sit';
      out.frame = 0;
      out.pose3d = 'sit';
      {
        const s = Math.sin(Math.min(1, t * 3) * Math.PI * 0.5) * (t > 0.8 ? fade / 0.2 : 1);
        out.sh = 1 - 0.25 * s;
        out.sw = 1 + 0.18 * s;
      }
      break;
    case 'wheee':
      // Lands giddy: a spin of dizzy, then a happy hop.
      out.clip = t < 0.55 ? 'dizzy' : 'happy';
      out.frame = 0;
      out.pose3d = t < 0.55 ? 'dizzy' : 'happy';
      out.dy = t > 0.55 ? 0.08 * Math.sin(((t - 0.55) / 0.45) * Math.PI) : 0;
      break;
    case 'teary':
      // Sits down sad, shoulders hunched.
      out.clip = 'sad';
      out.frame = 0;
      out.pose3d = 'sad';
      out.sh = 0.94;
      break;
    case 'tongue':
      // Dizzy for a moment, then a cheeky grin and a hop away.
      out.clip = t < 0.4 ? 'dizzy' : 'happy';
      out.frame = 0;
      out.pose3d = t < 0.4 ? 'dizzy' : 'happy';
      out.dx = t > 0.4 ? -0.06 * Math.sin(((t - 0.4) / 0.6) * Math.PI) : 0;
      break;
    case 'flop':
      // Just lies there where it landed for a good long while.
      out.clip = 'sleep';
      out.pose3d = 'sleep';
      out.sh = 0.8;
      out.sw = 1.12;
      break;
    case 'bleh':
      // Tongue out and a full-body shudder.
      out.clip = 'sad';
      out.frame = 0;
      out.pose3d = 'sad';
      out.dx = wave(7) * 0.035 * fade;
      out.sh = 1 - 0.05 * Math.sin(t * Math.PI);
      break;
  }
  return out;
}

interface Beat {
  kind: PetBeatKind;
  startMs: number;
}

/** Which particles a beat sends off as it starts (the renderers map these to their own). */
export const PET_BEAT_BURST: Partial<
  Record<PetBeatKind | SoulLookKind, 'heart' | 'dust' | 'sparkle' | 'note'>
> = {
  yum: 'heart',
  stomp: 'dust',
  raindrop: 'sparkle',
  fireflies: 'sparkle',
  harrumph: 'dust',
  trip: 'dust',
  sneeze: 'sparkle',
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
  /** R0536: a taste beat waiting for the Nubbin's next frame. */
  private readonly pendingKind = new Map<
    string,
    { kind: PetBeatKind | ((n: Nubbin) => PetBeatKind); atMs: number }
  >();
  /** Lane A r8: when each Nubbin's idle look began (render clock) and its last burst. */
  private readonly looks = new Map<string, { key: string; at: number; bucket: number }>();
  /** Reduced motion: the looks keep their frames and drop their shakes. */
  calm = false;

  /** R0536: a favourite or disliked fruit was eaten; its beat plays from the next frame. */
  queueKind(id: string, kind: PetBeatKind | ((n: Nubbin) => PetBeatKind), nowMs: number): void {
    this.pendingKind.set(id, { kind, atMs: nowMs });
  }

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
    const pk = this.pendingKind.get(n.id);
    if (pk) {
      this.pendingKind.delete(n.id);
      const kind = typeof pk.kind === 'function' ? pk.kind(n) : pk.kind;
      this.beats.set(n.id, { kind, startMs: pk.atMs });
      fresh = true;
    }
    const pose = this.pose(n.id, nowMs);
    return pose ? { ...pose, fresh } : this.look(n, nowMs);
  }

  /** Lane A r8: the idle look the sim's act calls for (render/soul-looks.ts), or null. */
  private look(n: Nubbin, nowMs: number): (PetBeatPose & { fresh: boolean }) | null {
    const kind = soulLookKind(n);
    if (!kind) {
      this.looks.delete(n.id);
      return null;
    }
    const b = n.behavior;
    const key = `:`;
    let l = this.looks.get(n.id);
    if (!l || l.key !== key) {
      l = { key, at: nowMs, bucket: -1 };
      this.looks.set(n.id, l);
    }
    const ms = nowMs - l.at;
    const span = Number.isFinite(b.untilMs - b.sinceMs) ? Math.max(1, b.untilMs - b.sinceMs) : 1;
    const t = Math.min(1, Math.max(0, ms / span));
    const every = SOUL_BURST_MS[kind];
    const bucket = every ? Math.floor(ms / every) : 0;
    const fresh = !!every && !this.calm && bucket !== l.bucket;
    l.bucket = bucket;
    return { ...soulPose(kind, ms, t, this.calm), fresh };
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

/** R0551: how a pet lands, by personality (no personality yet: the cheerful bounce). */
export function petBeatFor(n: Nubbin): PetBeatKind {
  switch (n.personality) {
    case 'shy':
      return 'blush';
    case 'mischievous':
      return 'wiggle';
    case 'lazy':
      return 'melt';
    default:
      return 'bounce';
  }
}

/** R0551: how a thrown Nubbin takes its landing, by personality. */
export function landBeatFor(n: Nubbin): PetBeatKind {
  switch (n.personality) {
    case 'shy':
      return 'teary';
    case 'mischievous':
      return 'tongue';
    case 'lazy':
      return 'flop';
    default:
      return 'wheee';
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
