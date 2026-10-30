/**
 * The big comedic charged moves (recs FIGHT-67): grid-only moves that wind up for 10 to 30
 * CT ticks and land on whatever stands on their tiles when the charge comes due, so foes who
 * see the dashed outline can step away. Each job (and the Sunny and Moony layers) brings one,
 * on top of its slots. They live here rather than in the turn mode's move list because the
 * turn mode has no tiles to aim at (`gridOnly`). Shapes beyond the shared aoe kinds: a
 * four-tile line, and three scattered tiles round the target picked from the bout's seed (so
 * the outline shows them before they land, and a replay lands them in the same place).
 */
import { hashSeed } from '../../rng';
import type { MoveDef } from '../types';
import { blocks, inside, tileAt } from './map';
import type { Cell, GridMap, JobId, JobLayer } from './types';

export interface ChargedMove extends MoveDef {
  gridOnly: true;
  /** A shape the shared aoe kinds don't have. */
  shape?: 'line4' | 'scatter3';
  /** The user lands on the target tile when it resolves (if the tile is free). */
  land?: true;
}

const base = {
  align: 'none',
  acc: 0.95,
  priority: 0,
  anim: 'charge',
  source: 'lesson',
  gridOnly: true,
} as const;

export const CHARGED_MOVES: readonly ChargedMove[] = [
  {
    ...base,
    id: 'mega-belly-flop',
    type: 'power',
    kind: 'bonk',
    power: 95,
    puff: 3,
    target: 'foe',
    grid: { range: [1, 3], aoe: 'ring1', heightReach: 3, ct: 20 },
    land: true,
  },
  {
    ...base,
    id: 'kazoo-symphony',
    type: 'normal',
    kind: 'splash',
    power: 70,
    puff: 3,
    target: 'foe',
    grid: { range: [1, 4], aoe: 'line2', heightReach: 1, ct: 15 },
    shape: 'line4',
  },
  {
    ...base,
    id: 'nap-bomb',
    type: 'swim',
    kind: 'status',
    power: 0,
    puff: 3,
    target: 'foe',
    status: { id: 'drowsy', chance: 0.6 },
    grid: { range: [2, 4], aoe: 'cross1', heightReach: 2, ct: 20 },
  },
  {
    ...base,
    id: 'snowball-barrage',
    type: 'fly',
    kind: 'splash',
    power: 60,
    puff: 3,
    target: 'foe',
    grid: { range: [2, 5], aoe: 'single', heightReach: 3, ct: 25 },
    shape: 'scatter3',
  },
  {
    ...base,
    id: 'zoomie-stampede',
    type: 'run',
    kind: 'bonk',
    power: 80,
    puff: 3,
    target: 'foe',
    grid: { range: [1, 4], aoe: 'line2', heightReach: 1, ct: 10 },
    shape: 'line4',
  },
  {
    ...base,
    id: 'tumble-pile',
    type: 'normal',
    kind: 'bonk',
    power: 75,
    puff: 2,
    target: 'foe',
    grid: { range: [1, 2], aoe: 'cross1', heightReach: 2, ct: 15 },
    land: true,
  },
  {
    ...base,
    id: 'sunbeam-hug',
    type: 'normal',
    align: 'sun',
    kind: 'support',
    power: 0,
    puff: 3,
    heal: 0.35,
    target: 'ally',
    grid: { range: [0, 3], aoe: 'ring1', heightReach: 3, ct: 15 },
  },
  {
    ...base,
    id: 'moon-hush',
    type: 'normal',
    align: 'moon',
    kind: 'status',
    power: 0,
    puff: 3,
    target: 'foe',
    status: { id: 'dizzy', chance: 0.7 },
    grid: { range: [1, 4], aoe: 'ring1', heightReach: 2, ct: 30 },
  },
];

const BY_ID = new Map(CHARGED_MOVES.map((m) => [m.id, m]));

export const chargedById = (id: string): ChargedMove | undefined => BY_ID.get(id);

/** The charged move a job brings to the grid (Lantern Keepers have their aura instead). */
export const JOB_CHARGE: Readonly<Record<JobId, string | null>> = {
  tumbler: 'tumble-pile',
  puddler: 'nap-bomb',
  glider: 'snowball-barrage',
  dasher: 'zoomie-stampede',
  bonker: 'mega-belly-flop',
  helper: 'kazoo-symphony',
  lanternKeeper: null,
};

/** The Sunny and Moony layers' own charged move. */
export const LAYER_CHARGE: Readonly<Record<'sunny' | 'moony', string>> = {
  sunny: 'sunbeam-hug',
  moony: 'moon-hush',
};

export function chargedFor(job: JobId, layer: JobLayer): string[] {
  const out: string[] = [];
  const j = JOB_CHARGE[job];
  if (j) out.push(j);
  if (layer) out.push(LAYER_CHARGE[layer]);
  return out;
}

/**
 * The tiles a shaped charged move covers, or null for the shared aoe kinds. `seed` keeps
 * the scatter the same between the outline and the landing.
 */
export function shapedTiles(
  m: GridMap,
  from: Cell,
  to: Cell,
  def: MoveDef,
  seed: number,
): Cell[] | null {
  const shape = (def as Partial<ChargedMove>).shape;
  if (!shape) return null;
  const out: Cell[] = [];
  if (shape === 'line4') {
    const sx = Math.sign(to.x - from.x);
    const sy = sx === 0 ? Math.sign(to.y - from.y) : 0;
    for (let k = 1; k <= 4; k++) {
      const x = from.x + sx * k;
      const y = from.y + sy * k;
      if (!inside(m, x, y) || blocks(tileAt(m, x, y))) break;
      out.push({ x, y });
    }
    return out;
  }
  // scatter3: the target and two more within two tiles, from a hash (never the bout's dice).
  out.push({ x: to.x, y: to.y });
  const near: Cell[] = [];
  for (let dy = -2; dy <= 2; dy++)
    for (let dx = -2; dx <= 2; dx++) {
      const x = to.x + dx;
      const y = to.y + dy;
      if ((dx || dy) && Math.abs(dx) + Math.abs(dy) <= 2 && inside(m, x, y)) near.push({ x, y });
    }
  let h = hashSeed(`${seed}:${def.id}:${to.x},${to.y}`);
  for (let i = 0; i < 2 && near.length; i++) {
    h = (Math.imul(h ^ (h >>> 15), 2246822507) + 0x9e3779b9) >>> 0;
    out.push(near.splice(h % near.length, 1)[0]!);
  }
  return out;
}
