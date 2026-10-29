/**
 * Reach and line of fire (recs FIGHT-57). Most moves in `moves.ts` still carry the turn mode's
 * melee default, so `gridOf` gives each a grid profile: bonk moves stay melee, splash and
 * status moves lob in an arc up to three tiles, support moves reach allies within three, and a
 * move's own non-default grid data (Kazoo Blast's ring) wins. Arcs clear anything lower than
 * two levels over the higher end; line shots (`line2`) stop at the first wall. Standing higher
 * adds reach (FIGHT-54), and tall grass hides a unit from reach beyond three tiles (FIGHT-56).
 */
import { TACTICS } from '../../../config/tuning-tactics';
import type { MoveDef } from '../types';
import { reachBonus } from './facing';
import { blocks, heightAt, inside, tileAt } from './map';
import { hiddenFrom } from './terrain';
import type { Cell, GridMap } from './types';

export interface GridProfile {
  range: [number, number];
  aoe: MoveDef['grid']['aoe'];
  heightReach: number;
  /** 'melee' (adjacent), 'arc' (a lob) or 'line' (a straight shot). */
  shot: 'melee' | 'arc' | 'line';
  ct: number;
}

/** Big hits wind up: moves this strong take a charge of this many ticks. */
const CHARGE_AT = 90;
const CHARGE_TICKS = 3;

export function gridOf(m: MoveDef): GridProfile {
  const g = m.grid;
  const custom = g.range[1] > 1 || g.aoe !== 'single';
  const base = custom
    ? { range: [g.range[0], g.range[1]] as [number, number], aoe: g.aoe }
    : m.kind === 'bonk'
      ? { range: [1, 1] as [number, number], aoe: 'single' as const }
      : m.target === 'self' || m.target === 'allAllies'
        ? {
            range: [0, 0] as [number, number],
            aoe: m.target === 'allAllies' ? ('ring1' as const) : ('single' as const),
          }
        : { range: [m.target === 'ally' ? 0 : 1, 3] as [number, number], aoe: 'single' as const };
  const shot: GridProfile['shot'] =
    base.aoe === 'line2' ? 'line' : base.range[1] <= 1 ? 'melee' : 'arc';
  return {
    range: base.range,
    aoe: base.aoe,
    heightReach: g.heightReach,
    shot,
    ct: g.ct ?? (m.power >= CHARGE_AT ? CHARGE_TICKS : 0),
  };
}

export const manhattan = (a: Cell, b: Cell): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

/** The tiles a straight line from `a` to `b` crosses, ends excluded (Bresenham). */
export function lineCells(a: Cell, b: Cell): Cell[] {
  const out: Cell[] = [];
  let x = a.x;
  let y = a.y;
  const dx = Math.abs(b.x - a.x);
  const dy = -Math.abs(b.y - a.y);
  const sx = a.x < b.x ? 1 : -1;
  const sy = a.y < b.y ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    if (x === b.x && y === b.y) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
    if (x === b.x && y === b.y) break;
    out.push({ x, y });
  }
  return out;
}

/**
 * Whether a shot gets from `a` to `b`. An arc clears anything whose top is under
 * max(hA, hB) + 2; a line shot stops at any wall, tree or lantern, or ground higher than both ends.
 */
export function clearShot(m: GridMap, a: Cell, b: Cell, shot: GridProfile['shot']): boolean {
  if (shot === 'melee') return true;
  const ha = heightAt(m, a.x, a.y);
  const hb = heightAt(m, b.x, b.y);
  const top = Math.max(ha, hb);
  for (const c of lineCells(a, b)) {
    const h = heightAt(m, c.x, c.y);
    const wall = blocks(tileAt(m, c.x, c.y));
    if (shot === 'arc' && h >= top + TACTICS.range.arcClear) return false;
    if (shot === 'line' && (wall || h > top)) return false;
  }
  return true;
}

/**
 * Whether a unit at `from` (with Jump `jump`, a Glider or not) can aim `move` at tile `to`:
 * in range after the height bonus, within height reach for melee, a clear shot, and the
 * target not hidden in tall grass.
 */
export function canAim(
  m: GridMap,
  from: Cell,
  to: Cell,
  p: GridProfile,
  jump: number,
  glider: boolean,
): boolean {
  if (!inside(m, to.x, to.y)) return false;
  const d = manhattan(from, to);
  const dh = heightAt(m, from.x, from.y) - heightAt(m, to.x, to.y);
  const max = p.range[1] + (p.shot === 'melee' ? 0 : reachBonus(dh, glider));
  if (d < p.range[0] || d > max) return false;
  if (p.shot === 'melee' && Math.abs(dh) > Math.max(p.heightReach, jump)) return false;
  if (p.shot !== 'melee' && hiddenFrom(m, to.x, to.y, d)) return false;
  return clearShot(m, from, to, p.shot);
}

/** The tiles a move aimed at `to` covers. */
export function aoeTiles(m: GridMap, from: Cell, to: Cell, p: GridProfile): Cell[] {
  const out: Cell[] = [];
  const add = (x: number, y: number) => {
    if (inside(m, x, y)) out.push({ x, y });
  };
  switch (p.aoe) {
    case 'single':
      add(to.x, to.y);
      break;
    case 'cross1':
      add(to.x, to.y);
      add(to.x + 1, to.y);
      add(to.x - 1, to.y);
      add(to.x, to.y + 1);
      add(to.x, to.y - 1);
      break;
    case 'ring1':
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) add(to.x + dx, to.y + dy);
      break;
    case 'line2': {
      const sx = Math.sign(to.x - from.x);
      const sy = sx === 0 ? Math.sign(to.y - from.y) : 0;
      for (let k = 1; k <= 2; k++) {
        const x = from.x + sx * k;
        const y = from.y + sy * k;
        if (!inside(m, x, y) || blocks(tileAt(m, x, y))) break;
        add(x, y);
      }
      break;
    }
  }
  return out;
}
