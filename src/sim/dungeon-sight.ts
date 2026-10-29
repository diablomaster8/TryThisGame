import { DUNGEON, HOLLOW } from '../config/tuning';
import type { Cell, Floor } from './dungeon';
import { cellOf, exploredMask, isExplored } from './dungeon';
import { shrineSight } from './dungeon-shrines';
import type { DungeonRun, Vec2 } from './types';

/**
 * Fog of war for the Hollow Below (R0153), as pure reads of the sim's explored mask so
 * both renderers and the automap agree on what the Keeper can see. A cell is hidden until
 * the mask has it, remembered once it has, and in sight while it is also within the sight
 * radius of the Keeper's cell. The sight radius is the explore radius, so whatever is in
 * sight has always been seen; the bonus slots (outdoor zones, the Light role) are later work.
 */

export const FOG_HIDDEN = 0;
export const FOG_REMEMBERED = 1;
export const FOG_VISIBLE = 2;
export type FogState = typeof FOG_HIDDEN | typeof FOG_REMEMBERED | typeof FOG_VISIBLE;

/** The sight radius in cells; a Glowy shrine (R0159) widens it for a while. */
export function sightRadius(run: DungeonRun | null = null): number {
  const b = HOLLOW.fog.sightBonus;
  return DUNGEON.explore.radius + b.outdoor + b.light + shrineSight(run);
}

/** The "in sight" rule: within `r` cells of the Keeper's cell, on the same disc the mask uses. */
export function inSight(kc: Cell, x: number, y: number, r: number): boolean {
  const dx = x - kc.x;
  const dy = y - kc.y;
  return dx * dx + dy * dy <= r * r;
}

/** One cell's fog state; off-floor cells are hidden. */
export function fogState(
  mask: Uint8Array,
  cols: number,
  rows: number,
  kc: Cell,
  r: number,
  x: number,
  y: number,
): FogState {
  if (x < 0 || y < 0 || x >= cols || y >= rows) return FOG_HIDDEN;
  if (mask[y * cols + x] !== 1) return FOG_HIDDEN;
  return inSight(kc, x, y, r) ? FOG_VISIBLE : FOG_REMEMBERED;
}

/**
 * The brightness of every cell as one byte (row-major like `Floor.cells`), for a texture or
 * an overlay: `levels` are 0..1 for hidden, remembered and in sight. Writes into `out` when
 * it is the right size, so a renderer can refill one buffer every time the Keeper moves.
 */
export function fogBytes(
  mask: Uint8Array,
  cols: number,
  rows: number,
  kc: Cell,
  r: number,
  levels: { hidden: number; remembered: number; visible: number },
  out?: Uint8Array,
): Uint8Array {
  const n = cols * rows;
  const buf = out && out.length === n ? out : new Uint8Array(n);
  const byte = (v: number) => Math.round(Math.max(0, Math.min(1, v)) * 255);
  const hid = byte(levels.hidden);
  const rem = byte(levels.remembered);
  const vis = byte(levels.visible);
  for (let i = 0; i < n; i++) buf[i] = mask[i] === 1 ? rem : hid;
  const rc = Math.ceil(r);
  for (let y = Math.max(0, kc.y - rc); y <= Math.min(rows - 1, kc.y + rc); y++)
    for (let x = Math.max(0, kc.x - rc); x <= Math.min(cols - 1, kc.x + rc); x++) {
      const i = y * cols + x;
      if (mask[i] === 1 && inSight(kc, x, y, r)) buf[i] = vis;
    }
  return buf;
}

/** The fog state at a world position on the run's floor, seen from the Keeper's position. */
export function fogAt(run: DungeonRun, f: Floor, keeper: Vec2, p: Vec2): FogState {
  const c = cellOf(f, p);
  return fogState(
    exploredMask(run, f),
    f.cols,
    f.rows,
    cellOf(f, keeper),
    sightRadius(run),
    c.x,
    c.y,
  );
}

/** Live actors (strays, packs, wild ones) draw only in sight; loot and props once seen. */
export function actorShown(run: DungeonRun, f: Floor, keeper: Vec2, p: Vec2): boolean {
  return fogAt(run, f, keeper, p) === FOG_VISIBLE;
}

export function lootShown(run: DungeonRun, f: Floor, c: Cell): boolean {
  return isExplored(run, f, c.x, c.y);
}
