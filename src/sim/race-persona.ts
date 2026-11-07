/**
 * R0583 (SOUL-66), lane A round 11: personality in the race and expedition presentation
 * only. At the start line a cheerful racer waves to the crowd, a shy one hides behind its
 * hands, a mischievous one sticks its tongue out at the rivals and a lazy one yawns; in the
 * rest pause the lazy one lies flat; a cheer gets a small voice in the racer's own manner.
 * The player's personality rides on its `Racer`; a rival's is a hash of its id (no rng is
 * drawn, so a seed gives the same field and the same finishing times whatever the
 * personality). Nothing here is read by `stepRace`, `staminaPool` or any result.
 */
import { RACE_COUNT, RACE_VOICE } from '../config/strings-soul-r11h';
import { RACE_PERSONA } from '../config/tuning-more/soul-old-souls';
import { h01 } from './soul-kit';
import type { Racer, RaceState } from './race';
import type { Personality } from './types';

export type StartKind = 'wave' | 'hide' | 'tongue' | 'yawn';

const BASE: readonly Personality[] = ['cheerful', 'shy', 'mischievous', 'lazy'];

/** The racer's personality: the player's own, or a rival's from its id. */
export function racerPersonality(r: Pick<Racer, 'id' | 'isPlayer' | 'personality'>): Personality {
  if (r.isPlayer && r.personality) return r.personality;
  return BASE[Math.floor(h01(`racer:${r.id}`) * BASE.length) % BASE.length]!;
}

/** The start-line pose for a personality (null for the quieter kinds). */
export function startKind(p: Personality): StartKind | null {
  switch (p) {
    case 'cheerful':
      return 'wave';
    case 'shy':
      return 'hide';
    case 'mischievous':
      return 'tongue';
    case 'lazy':
      return 'yawn';
    default:
      return null;
  }
}

export interface StartLook {
  kind: StartKind;
  /** Offsets in view pixels. */
  dx: number;
  dy: number;
  /** A small emote over the head. */
  glyph: string;
}

const GLYPH: Record<StartKind, string> = { wave: '👋', hide: '🙈', tongue: '😛', yawn: '🥱' };

/** The pose at `timeMs` into the race, or null once the start line is over. */
export function startLook(
  p: Personality,
  timeMs: number,
  reduce: boolean,
  windowMs: number = RACE_PERSONA.startLineMs,
): StartLook | null {
  const kind = startKind(p);
  if (!kind || timeMs < 0 || timeMs >= windowMs) return null;
  const k = timeMs / windowMs;
  const wave = Math.sin(k * Math.PI);
  if (reduce) return { kind, dx: 0, dy: 0, glyph: GLYPH[kind] };
  switch (kind) {
    case 'wave':
      return { kind, dx: 0, dy: -Math.abs(Math.sin(k * Math.PI * 3)) * 3, glyph: GLYPH[kind] };
    case 'hide':
      return { kind, dx: -wave * 2, dy: wave * 2, glyph: GLYPH[kind] };
    case 'tongue':
      return { kind, dx: wave * 2, dy: 0, glyph: GLYPH[kind] };
    case 'yawn':
      return { kind, dx: 0, dy: wave * 3, glyph: GLYPH[kind] };
  }
}

/** The lazy racer lies flat in the rest pause. */
export const liesFlat = (p: Personality): boolean => p === 'lazy';

/** The little voice a cheer draws from this personality. */
export function cheerVoice(p: Personality): string {
  const k = startKind(p);
  return RACE_VOICE[k ?? 'wave'];
}

/**
 * The clock the start-line poses read: it runs through the pre-race hold (`countdownMs`) and
 * on into the race, so a pose plays in full before the first step of movement.
 */
export function lineClock(
  race: Pick<RaceState, 'timeMs' | 'countdownMs' | 'countdownTotalMs'>,
): number {
  const total = race.countdownTotalMs ?? 0;
  const left = race.countdownMs ?? 0;
  return left > 0 ? total - left : total + race.timeMs;
}

/** What the count says now ('3', '2', '1', 'Go!' for a moment after the gun) or null. */
export function countLabel(
  race: Pick<RaceState, 'timeMs' | 'countdownMs' | 'countdownTotalMs'>,
): string | null {
  const left = race.countdownMs ?? 0;
  if (left > 0) {
    const per = (race.countdownTotalMs ?? 3000) / 3;
    const n = Math.min(3, Math.max(1, Math.ceil(left / per))) as 1 | 2 | 3;
    return RACE_COUNT[n];
  }
  return (race.countdownTotalMs ?? 0) > 0 && race.timeMs < 700 ? RACE_COUNT.go : null;
}

/** Whether the field is still held at the line. */
export const inCountdown = (race: Pick<RaceState, 'countdownMs'>): boolean =>
  (race.countdownMs ?? 0) > 0;

/**
 * The sprite clip each start-line kind plays when the racer's sheet has real frames for it
 * (the Chao-faithful sheets do: `wave`, `peek`, `tease`, `yawn`, drawn for the side view).
 * Sheets without them fall back to the offset and emote of `startLook`.
 */
export const START_CLIP: Record<StartKind, { clip: string; frames: number; ms: number }> = {
  wave: { clip: 'wave', frames: 2, ms: 240 },
  hide: { clip: 'peek', frames: 2, ms: 420 },
  tongue: { clip: 'tease', frames: 2, ms: 300 },
  yawn: { clip: 'yawn', frames: 2, ms: 700 },
};

/** The frame of a start clip at `timeMs`; reduced motion holds frame 0 (or the peak, for a yawn). */
export function startFrameIndex(kind: StartKind, timeMs: number, reduce: boolean): number {
  const c = START_CLIP[kind];
  if (reduce) return kind === 'yawn' ? 0 : 1 % c.frames;
  return Math.floor(Math.max(0, timeMs) / c.ms) % c.frames;
}
