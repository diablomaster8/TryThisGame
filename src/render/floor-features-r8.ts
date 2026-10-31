/**
 * Lane B round 8, "floors", in the pixel Hollow: what to draw for secret walls, puzzles and
 * kid mode's hint arrow, as a list of marks drawn with the dungeon sheet's existing frames
 * (`world-view.ts` `drawCave` draws them). Reads sim state only.
 */
import { cellCentre, type Floor } from '../sim/dungeon';
import { blocksNow, hintFor, layoutOf, platesDown, torchesLit } from '../sim/dungeon-puzzles';
import { sealOpen } from '../sim/dungeon-secrets';
import type { DungeonRun } from '../sim/types';

export interface FloorMark {
  /** A dungeon-sheet frame key. */
  key: 'crystal' | 'sconce' | 'loot-stone';
  x: number;
  z: number;
  y: number;
  mode: 'flat' | 'billboard';
  /** Size in cells (flat marks), or a scale on the frame (billboards); 0 keeps the frame's. */
  size: number;
  tint: number;
}

export function floorMarks(run: DungeonRun, f: Floor, nowMs: number, still: boolean): FloorMark[] {
  const out: FloorMark[] = [];
  const at = (c: { x: number; y: number }) => cellCentre(f, c);
  for (const s of f.seals ?? []) {
    // A faint glint on the floor before a secret wall still shut.
    if (s.kind === 'secret' && !sealOpen(run, s)) {
      const p = at(s.front);
      out.push({ key: 'crystal', ...p, y: 0.015, mode: 'flat', size: 0.35, tint: 0.7 });
    }
    const pz = s.puzzle;
    if (!pz || s.kind !== 'puzzle') continue;
    const down = platesDown(run, s.id);
    pz.plates?.forEach((c, i) => {
      const p = at(c);
      out.push({
        key: 'crystal',
        ...p,
        y: 0.02,
        mode: 'flat',
        size: 0.8,
        tint: down.includes(i) ? 1.5 : 0.8,
      });
    });
    const lit = pz.order?.slice(0, torchesLit(run, s)) ?? [];
    pz.torches?.forEach((c, i) => {
      const p = at(c);
      out.push({
        key: 'sconce',
        ...p,
        y: 0,
        mode: 'billboard',
        size: 0,
        tint: lit.includes(i) ? 1.4 : 0.55,
      });
    });
    if (pz.layout !== undefined) {
      for (const t of layoutOf(pz.layout).targets) {
        const p = at(pz.grid[t]!);
        out.push({ key: 'crystal', ...p, y: 0.02, mode: 'flat', size: 0.9, tint: 1.2 });
      }
      for (const g of blocksNow(run, s)) {
        const p = at(pz.grid[g]!);
        out.push({ key: 'loot-stone', ...p, y: 0, mode: 'billboard', size: 2.4, tint: 0.9 });
      }
    }
  }
  const h = hintFor(run);
  if (h) {
    const p = at(h);
    const bob = still ? 0 : 0.1 * Math.sin(nowMs / 200);
    out.push({ key: 'crystal', ...p, y: 0.9 + bob, mode: 'billboard', size: 0, tint: 1.6 });
  }
  return out;
}
