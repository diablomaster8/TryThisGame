/**
 * Phone taps in the Hollow (R0192, DUNG-49). A tap on the ground near a pack, shrine,
 * waypoint stone or bit of loot snaps to that thing, so the Keeper walks right to it:
 * touching a pack starts its encounter, loot is picked up and a shrine or stone is used by
 * standing on it. The radius is generous (1.2 u) for a thumb. Pure: no DOM, no Three.js.
 */
import { DUNGEON_TAP } from '../config/tuning-dungeon-tap';
import { cellCentre, cellDist, cellOf, runFloor } from '../sim/dungeon';
import type { Vec2, World } from '../sim/types';

export type DungeonTapKind = 'pack' | 'shrine' | 'waypoint' | 'loot';

export interface DungeonTap {
  kind: DungeonTapKind;
  id: string;
  pos: Vec2;
}

const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);
const RANK: Record<DungeonTapKind, number> = { pack: 0, shrine: 1, waypoint: 2, loot: 3 };

/** What a ground tap at `at` means underground: the nearest thing within `radius`, packs first. */
export function dungeonTapTarget(
  world: World,
  at: Vec2,
  radius: number = DUNGEON_TAP.radius,
): DungeonTap | null {
  const run = world.dungeon;
  const f = runFloor(world);
  if (!run || !f || world.location !== 'dungeon') return null;
  const found: DungeonTap[] = [];
  for (const p of run.packs ?? [])
    if (p.state !== 'beaten') found.push({ kind: 'pack', id: p.id, pos: p.pos });
  for (const s of f.shrines ?? [])
    if (!(run.shrinesUsed ?? []).includes(s.id))
      found.push({ kind: 'shrine', id: s.id, pos: cellCentre(f, s.cell) });
  if (f.stone) found.push({ kind: 'waypoint', id: 'stone', pos: cellCentre(f, f.stone) });
  for (const l of f.loot)
    if (!run.taken.includes(l.id))
      found.push({ kind: 'loot', id: l.id, pos: cellCentre(f, l.cell) });
  let best: DungeonTap | null = null;
  let bestD = Infinity;
  for (const t of found) {
    const d = dist(t.pos, at);
    if (d > radius) continue;
    if (
      !best ||
      RANK[t.kind] < RANK[best.kind] ||
      (RANK[t.kind] === RANK[best.kind] && d < bestD)
    ) {
      best = t;
      bestD = d;
    }
  }
  return best;
}

/** The nearest pack still about within `cells` of the Keeper (⚔ auto-target), or null. */
export function nearestPack(world: World, cells: number): DungeonTap | null {
  const run = world.dungeon;
  const f = runFloor(world);
  if (!run || !f || run.encounter) return null;
  const k = cellOf(f, world.keeper.pos);
  let best: DungeonTap | null = null;
  let bestD = Infinity;
  for (const p of run.packs ?? []) {
    if (p.state === 'beaten') continue;
    const d = cellDist(k, cellOf(f, p.pos));
    if (d < bestD && d <= cells) {
      bestD = d;
      best = { kind: 'pack', id: p.id, pos: p.pos };
    }
  }
  return best;
}
