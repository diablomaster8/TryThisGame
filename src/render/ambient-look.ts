/**
 * R0547 (SOUL-29) and R0555 (SOUL-38), lane A round 11: how the chase and the jam look,
 * shared by the Pixel and Full 3D views. A Nubbin on a chase runs (the walk clip) with little
 * jumps; one with a butterfly on its head sits proud; a trip is a squashed dizzy tumble. The
 * ambient critters come back as flat draw rows (frame key, spot, size) for either view. A
 * concert turns every member's emote ball into a note. Pure maths, render-side only; reduced
 * motion drops the jumps and the wing flutter keeps a slow beat.
 */
import { inConcert } from '../sim/jam';
import { ambientOf, type AmbientCritter } from '../sim/ambient';
import type { Nubbin, World } from '../sim/types';
import type { PerformLook } from './perform-look';
import type { EmoteShape } from './sprites/emote';

const look: PerformLook = {
  lesson: 'dance',
  level: 1,
  clip: 'happy',
  prop: null,
  sw: 1,
  sh: 1,
  dx: 0,
  dy: 0,
  turn: 0,
  propDx: 0,
  propDy: 0,
  notes: false,
};

/** The clip a chaser plays, or null when this Nubbin is not on a chase. */
export function chaseClip(n: Nubbin): 'walk' | 'happy' | 'dizzy' | null {
  const b = n.behavior;
  if (b.state !== 'perform') return null;
  if (b.itemId === 'chaseFlutter') return b.target ? 'walk' : 'happy';
  if (b.itemId === 'catchFlutter') return 'happy';
  if (b.itemId === 'chaseTrip') return 'dizzy';
  return null;
}

/** Hops while chasing, a proud bounce on a catch, a squash on a trip. Reused: read at once. */
export function chaseLook(n: Nubbin, simMs: number, reduce: boolean): PerformLook | null {
  const b = n.behavior;
  if (b.state !== 'perform') return null;
  const t = simMs - b.sinceMs;
  look.sw = 1;
  look.sh = 1;
  look.dx = 0;
  look.dy = 0;
  look.turn = 0;
  if (b.itemId === 'chaseFlutter') {
    if (!reduce) look.dy = Math.abs(Math.sin(t / 130)) * 0.22;
    return look;
  }
  if (b.itemId === 'catchFlutter') {
    if (!reduce) look.dy = Math.abs(Math.sin(t / 220)) * 0.08;
    return look;
  }
  if (b.itemId === 'chaseTrip') {
    look.sh = 0.8;
    look.sw = 1.15;
    return look;
  }
  return null;
}

/** A concert's note over every member's head, or null. */
export function jamEmote(n: Nubbin, simMs: number): EmoteShape | null {
  return inConcert(n, simMs) ? 'note' : null;
}

export interface AmbientDraw {
  kind: AmbientCritter['kind'];
  frame: number;
  colour: number;
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
}

const rows: AmbientDraw[] = [];

const colourOf = (id: string): number => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h) % 3;
};

/** One row per critter to draw now. The array is reused: read it before the next call. */
export function ambientDraws(world: World, nowMs: number, reduce: boolean): readonly AmbientDraw[] {
  rows.length = 0;
  for (const c of ambientOf(world)) {
    const beat = reduce ? 520 : c.kind === 'dragonfly' ? 60 : c.kind === 'butterfly' ? 110 : 400;
    let frame = Math.floor(nowMs / beat) % 2;
    if (c.kind === 'frog') frame = c.y > 0.05 ? 1 : 0;
    if (c.kind === 'firefly') frame = Math.floor(nowMs / 700 + c.heading * 3) % 3 === 0 ? 0 : 1;
    // A butterfly on a head holds still with its wings open.
    if (c.landedOn) frame = 0;
    rows.push({
      kind: c.kind,
      frame,
      colour: colourOf(c.id),
      x: c.pos.x,
      y: c.y,
      z: c.pos.z,
      size: c.kind === 'frog' ? 0.55 : c.kind === 'firefly' ? 0.45 : 0.5,
      opacity:
        c.until - world.timeMs < 1500 && !c.landedOn
          ? Math.max(0, (c.until - world.timeMs) / 1500)
          : 1,
    });
  }
  return rows;
}
