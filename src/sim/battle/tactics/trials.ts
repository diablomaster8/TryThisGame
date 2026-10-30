import { TRIAL_MAPS, type TrialMap } from '../../../config/battle-maps';
import { HAT_IDS } from '../../shop';
import type { SimEvent, World } from '../../types';

/**
 * The trial map pack (recs FIGHT-97): twelve hand-made puzzle boards in the Vandal Hearts
 * manner. One Nubbin walks the board a tile at a time; every step is a turn.
 *
 * - `B` boulders are pushed one tile; pushed into `~` water, a boulder sinks and makes a bridge.
 * - `1`, `2`, `3` bells must be rung in order: a bell out of turn starts the order again.
 * - `F` is a lit lantern: standing on it takes its flame, which lasts `relay` steps; `L`
 *   lanterns are lit by reaching them with a flame, which renews it.
 * - `X`, the gate, opens once every bell has rung and every lantern is lit.
 *
 * Each map has a par (the fewest steps, proved by a breadth-first solver in the tests).
 * Clearing at par pays a hat once. Moves are checked by replaying them here, so the UI can
 * never claim a clear it did not make.
 */
export type Step = 'n' | 'e' | 's' | 'w';

const DELTA: Readonly<Record<Step, [number, number]>> = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
};
export const STEPS: readonly Step[] = ['n', 'e', 's', 'w'];

export interface TrialState {
  x: number;
  y: number;
  /** Boulder cells and bridged water cells, as "x,y". */
  boulders: string[];
  bridges: string[];
  /** The next bell to ring (1-based); bells > count means all rung. */
  bell: number;
  /** Steps of flame left, and the lanterns lit. */
  flame: number;
  lit: string[];
  steps: number;
  done: boolean;
}

const key = (x: number, y: number): string => `${x},${y}`;

export function trialById(id: string): TrialMap | undefined {
  return TRIAL_MAPS.find((m) => m.id === id);
}

function tile(m: TrialMap, x: number, y: number): string {
  return m.rows[y]?.[x] ?? '#';
}

function find(m: TrialMap, ch: string): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  m.rows.forEach((row, y) => [...row].forEach((c, x) => c === ch && out.push({ x, y })));
  return out;
}

export function bellCount(m: TrialMap): number {
  return ['1', '2', '3'].filter((b) => find(m, b).length > 0).length;
}

export function trialStart(m: TrialMap): TrialState {
  const s = find(m, 'S')[0] ?? { x: 0, y: 0 };
  return {
    x: s.x,
    y: s.y,
    boulders: find(m, 'B').map((c) => key(c.x, c.y)),
    bridges: [],
    bell: 1,
    flame: 0,
    lit: [],
    steps: 0,
    done: false,
  };
}

/** Whether the gate is open: every bell rung, every lantern lit. */
export function gateOpen(m: TrialMap, s: TrialState): boolean {
  return s.bell > bellCount(m) && find(m, 'L').every((c) => s.lit.includes(key(c.x, c.y)));
}

/** Ground a walker or a boulder may stand on (water only once bridged). */
function ground(m: TrialMap, s: TrialState, x: number, y: number): boolean {
  const t = tile(m, x, y);
  if (t === '#') return false;
  if (t === '~') return s.bridges.includes(key(x, y));
  return true;
}

/** One step; null when it can't be taken (a wall, open water, a stuck boulder, a shut gate). */
export function trialStep(m: TrialMap, s: TrialState, d: Step): TrialState | null {
  if (s.done) return null;
  const [dx, dy] = DELTA[d];
  const x = s.x + dx;
  const y = s.y + dy;
  const t = tile(m, x, y);
  let boulders = s.boulders;
  let bridges = s.bridges;
  const here = key(x, y);
  if (boulders.includes(here)) {
    const bx = x + dx;
    const by = y + dy;
    const bt = tile(m, bx, by);
    const bk = key(bx, by);
    if (bt === '#' || boulders.includes(bk) || 'XLF123'.includes(bt)) return null;
    boulders = boulders.filter((b) => b !== here);
    if (bt === '~' && !bridges.includes(bk)) bridges = [...bridges, bk];
    else boulders = [...boulders, bk];
  } else if (!ground(m, s, x, y)) return null;
  if (t === 'X' && !gateOpen(m, s)) return null;
  const next: TrialState = { ...s, x, y, boulders, bridges, steps: s.steps + 1 };
  next.flame = Math.max(0, s.flame - 1);
  if (t === '1' || t === '2' || t === '3') {
    const n = Number(t);
    next.bell = n === s.bell ? s.bell + 1 : s.bell > bellCount(m) ? s.bell : n === 1 ? 2 : 1;
  }
  if (t === 'F') next.flame = m.relay ?? 6;
  if (t === 'L' && s.flame > 0 && !s.lit.includes(here)) {
    next.lit = [...s.lit, here];
    next.flame = m.relay ?? 6;
  }
  if (t === 'X') next.done = true;
  return next;
}

/** Replays a list of steps from the start; the state reached, or null if a step was refused. */
export function trialReplay(m: TrialMap, steps: readonly Step[]): TrialState | null {
  let s: TrialState | null = trialStart(m);
  for (const d of steps) {
    s = s && trialStep(m, s, d);
    if (!s) return null;
  }
  return s;
}

/** A state's identity for the solver (steps left out). */
export function trialKey(s: TrialState): string {
  return [
    s.x,
    s.y,
    [...s.boulders].sort().join(';'),
    [...s.bridges].sort().join(';'),
    s.bell,
    s.flame,
    [...s.lit].sort().join(';'),
    s.done ? 1 : 0,
  ].join('|');
}

export interface TrialRecord {
  best: number;
  par: boolean;
}

export const trialsOf = (world: World): Record<string, TrialRecord> => world.trials ?? {};

/**
 * The trial screen's clear: replayed here, then the best kept; meeting par pays the map's hat
 * once (the hats are the shop's, by map, as the Circuit's first wins are).
 */
export function trialClear(
  world: World,
  id: string,
  steps: readonly Step[],
  events: SimEvent[],
): boolean {
  const m = trialById(id);
  if (!m) return false;
  const s = trialReplay(m, steps);
  if (!s?.done) return false;
  const all = (world.trials ??= {});
  const rec = (all[id] ??= { best: s.steps, par: false });
  rec.best = Math.min(rec.best, s.steps);
  const atPar = s.steps <= m.par;
  const first = atPar && !rec.par;
  if (atPar) rec.par = true;
  if (first) {
    const ix = TRIAL_MAPS.indexOf(m);
    const hat = HAT_IDS[ix % HAT_IDS.length]!;
    if (!world.inventory.hats.includes(hat)) world.inventory.hats.push(hat);
  }
  events.push({ kind: 'trialCleared', id, steps: s.steps, par: atPar, first });
  return true;
}
