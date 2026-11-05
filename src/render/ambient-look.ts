/**
 * R0547 (SOUL-29) and R0555 (SOUL-38), lane A round 11: how the chase and the jam look,
 * shared by the Pixel and Full 3D views. A Nubbin on a chase runs (the walk clip) with little
 * jumps; one with a butterfly on its head sits proud; a trip is a squashed dizzy tumble. The
 * ambient critters come back as flat draw rows (frame key, spot, size) for either view. A
 * concert turns every member's emote ball into a note. Pure maths, render-side only; reduced
 * motion drops the jumps and the wing flutter keeps a slow beat.
 */
import { inConcert } from '../sim/jam';
import { ballAt, puddlesOf, snowballsOf, snowFigures } from '../sim/weather-play';
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
/** R0561, R0562, R0571 (lane A r11): the group acts' clips and hops, by act name. */
const RUNNING = new Set([
  'tagIt',
  'tagRun',
  'tagKeeper',
  'tagKeeperRun',
  'followLine',
  'hideRun',
  'seekFind',
  'chaseKeeper',
  'runToTree',
]);
const HOPPING: Record<string, number> = {
  copyHop: 0.2,
  puddleStomp: 0.12,
  leafPileJump: 0.3,
  pondParty: 0.14,
  ringDance: 0.16,
  followLine: 0.1,
  snowball: 0.08,
  waveHello: 0.06,
};
const EMOTES: Record<string, EmoteShape> = {
  tagIt: 'exclaim',
  tagKeeper: 'exclaim',
  tagKeeperRun: 'smirk',
  tagGloat: 'smirk',
  seekCount: 'dots',
  sunbathe: 'zz',
  snowball: 'puff',
  snowBuild: 'star',
  puddleStomp: 'star',
  leafPileJump: 'star',
  huddle: 'heart',
  teach: 'star',
  learnWatch: 'dots',
  pondParty: 'star',
  ringDance: 'heart',
  flowerSniff: 'heart',
  copyHop: 'star',
  lookUp: 'exclaim',
  greetGate: 'heart',
  guardKeeper: 'spiky',
  sniffNpc: 'question',
  tugCoat: 'smirk',
  waveHello: 'heart',
};

export function chaseClip(n: Nubbin): 'walk' | 'happy' | 'dizzy' | 'sit' | 'sleep' | 'idle' | null {
  const b = n.behavior;
  if (b.state !== 'perform') return null;
  const id = b.itemId ?? '';
  if (RUNNING.has(id) && id !== 'tagGloat') return 'walk';
  if (id === 'seekCount' || id === 'flowerSniff' || id === 'snowBuild') return 'sit';
  if (id === 'sunbathe') return 'sleep';
  if (id === 'teach') return 'sit';
  if (id === 'huddle' || id === 'learnWatch') return b.target ? 'walk' : 'sit';
  if (id === 'pondParty' || id === 'ringDance') return b.target ? 'walk' : 'happy';
  if (id === 'lookUp' || id === 'guardKeeper') return 'idle';
  if (id === 'greetGate') return b.target ? 'walk' : 'happy';
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
  const hop = HOPPING[b.itemId ?? ''];
  if (hop !== undefined) {
    if (!reduce) look.dy = Math.abs(Math.sin(t / 150)) * hop;
    return look;
  }
  return null;
}

/** A concert's note over every member's head, or null. */
export function jamEmote(n: Nubbin, simMs: number): EmoteShape | null {
  if (inConcert(n, simMs)) return 'note';
  return n.behavior.state === 'perform' ? (EMOTES[n.behavior.itemId ?? ''] ?? null) : null;
}

export interface AmbientDraw {
  kind: AmbientCritter['kind'] | 'snowman' | 'puddle' | 'snowball';
  /** A ground decal, laid flat. */
  flat?: boolean;
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
  for (const d of snowFigures(world))
    rows.push({
      kind: 'snowman',
      frame: 0,
      colour: 0,
      x: d.x,
      y: 0,
      z: d.z,
      size: 0.9,
      opacity: 1,
    });
  // R0562: a snowball mid-lob (the sim's clock, so it steps at the sim rate).
  for (const b of snowballsOf(world)) {
    if (world.timeMs < b.startMs) continue;
    const p = ballAt(b, world.timeMs);
    rows.push({
      kind: 'snowball',
      frame: 0,
      colour: 0,
      x: p.x,
      y: p.y,
      z: p.z,
      size: 0.35,
      opacity: 1,
    });
  }
  for (const d of puddlesOf(world))
    rows.push({
      kind: 'puddle',
      frame: 0,
      colour: 0,
      x: d.x,
      y: 0.03,
      z: d.z,
      size: 1.3,
      opacity: 0.8,
      flat: true,
    });
  return rows;
}
