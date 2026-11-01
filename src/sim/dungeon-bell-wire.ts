/**
 * Bell Wire chains (R0179, DUNG-36): Wild's extra trap. A chain is a few bell traps strung
 * along a straight stretch of passage on one wire. Springing any bell on it rings them all,
 * and each ringing bell calls the nearest pack still about (so a chain can bring several).
 * Like every Hollow trap it is telegraphed (raised tiles, and a wire drawn between them) and
 * never takes anything. Placed only on Wild floors, after the other traps, from its own seeded
 * stream, so Cosy and Brisk floors are unchanged.
 */
import { R10B4 } from '../config/tuning-r10b4';
import { cellAt, cellCentre, cellDist, FLOOR, type Cell, type Floor } from './dungeon';
import { propBlocked } from './dungeon-props';
import { Rng } from './rng';
import type { Trap } from './dungeon-traps';

const B = R10B4.bellWire;

/** Adds Bell Wire chains to a Wild floor's traps. Mutates `f.traps`. */
export function wireBells(f: Floor, seed: number, depth: number): void {
  const rng = Rng.fromSeed(`${seed}:${depth}:bell-wire`);
  const traps: Trap[] = (f.traps ??= []);
  const want = rng.int(B.chains[0], B.chains[1]);
  const span = (B.bells - 1) * B.gap;
  const busy = [
    f.stairsUp,
    f.chest,
    ...(f.stairsDown ? [f.stairsDown] : []),
    ...f.loot.map((l) => l.cell),
    ...(f.shrines ?? []).map((s) => s.cell),
    ...(f.landmark ? [f.landmark.cell] : []),
  ];
  let chains = 0;
  for (let t = 0; chains < want && t < B.tries; t++) {
    const across = rng.chance(0.5);
    const [dx, dy] = across ? [1, 0] : [0, 1];
    const x0 = rng.int(1, f.cols - 2 - span * dx);
    const y0 = rng.int(1, f.rows - 2 - span * dy);
    const run: Cell[] = [];
    for (let k = 0; k <= span; k++) run.push({ x: x0 + dx * k, y: y0 + dy * k });
    // A dry stretch with dry ground before and after it, clear of everything else.
    const ends = [
      { x: x0 - dx, y: y0 - dy },
      { x: x0 + dx * (span + 1), y: y0 + dy * (span + 1) },
    ];
    if (![...run, ...ends].every((c) => cellAt(f, c.x, c.y) === FLOOR)) continue;
    if (run.some((c) => busy.some((b) => cellDist(b, c) < 3))) continue;
    if (run.some((c) => traps.some((o) => cellDist(o.cell, c) < 3))) continue;
    if (run.some((c) => propBlocked(cellCentre(f, c), f, 0.5))) continue;
    for (let b = 0; b < B.bells; b++)
      traps.push({
        id: `wire-${chains}-${b}`,
        cell: run[b * B.gap]!,
        kind: 'bell',
        wire: chains,
      });
    chains++;
  }
}

/** The traps on the same wire as `trap` (itself included), or just `trap`. */
export function wireOf(f: Floor, trap: Trap): Trap[] {
  if (trap.wire === undefined) return [trap];
  return (f.traps ?? []).filter((t) => t.wire === trap.wire);
}
