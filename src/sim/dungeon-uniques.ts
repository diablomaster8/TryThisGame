/**
 * The named uniques (R0156, DUNG-16): each act level may hold one or two of `UNIQUES`, a
 * pack of kind 'unique' with its fixed modifiers on the leader, a few minions, and its name
 * on the ★ plate. It stands in a treasure room (taking the champion guard's place) or, on a
 * level without one, on the open cell farthest from the stairs up that is not taken. The
 * first win over each pays a one-time bonus (`world.hollow.uniquesBeaten`); later wins are
 * ordinary. A "New paths" reroll draws new floors, so the uniques stand somewhere new.
 *
 * Pure sim: no DOM.
 */
import { UNIQUES, type UniqueDef } from '../config/dungeon-foes';
import { HOLLOW } from '../config/tuning';
import { cellDist, FLOOR, hashString, WALL, type Cell, type Floor } from './dungeon';
import type { EncounterPack, PackMember } from './dungeon-encounters';
import { foeLevel, type FoeBand } from './dungeon-density';
import { isCommonSpecies, SPECIES } from './species';
import type { DungeonRun, SimEvent, World } from './types';

/** The uniques that live on act `act`'s level `level` (1-based). */
export function uniquesFor(act: number, level: number): UniqueDef[] {
  return UNIQUES.filter((u) => u.act === act && u.level === level);
}

/** The unique's look: a foe species picked from its id, the same in every seed. */
export function uniqueSpecies(id: string): string {
  const foes = SPECIES.filter((s) => s.id !== 'chao' && s.stage === 'baby' && isCommonSpecies(s));
  return foes[hashString(id) % foes.length]!.id;
}

/** Cells reachable from the stairs up (wading and jumping allowed, as the floor intends). */
function walkable(f: Floor): Uint8Array {
  const seen = new Uint8Array(f.cols * f.rows);
  const q: Cell[] = [f.stairsUp];
  seen[f.stairsUp.y * f.cols + f.stairsUp.x] = 1;
  for (let i = 0; i < q.length; i++) {
    const c = q[i]!;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const x = c.x + dx;
      const y = c.y + dy;
      if (x < 0 || y < 0 || x >= f.cols || y >= f.rows) continue;
      const k = y * f.cols + x;
      if (seen[k] || f.cells[k] === WALL) continue;
      seen[k] = 1;
      q.push({ x, y });
    }
  }
  return seen;
}

/** Puts act `act` level `level`'s uniques onto a fresh version-4 floor (mutates `f.packs`). */
export function placeUniques(f: Floor, act: number, level: number, band: FoeBand): void {
  const defs = uniquesFor(act, level);
  if (defs.length === 0) return;
  const packs = f.packs ?? [];
  const seen = walkable(f);
  const busy = (c: Cell) =>
    cellDist(c, f.stairsUp) < 8 ||
    cellDist(c, f.chest) < 2 ||
    (f.stairsDown !== null && cellDist(c, f.stairsDown) < 3) ||
    (f.shrines ?? []).some((s) => cellDist(s.cell, c) < 2) ||
    (f.traps ?? []).some((t) => cellDist(t.cell, c) < 1);
  const ok = (c: Cell) =>
    f.cells[c.y * f.cols + c.x] === FLOOR && seen[c.y * f.cols + c.x] === 1 && !busy(c);
  // Treasure guards first (their places), then the farthest open cells, kept apart.
  const guards = packs.filter((p) => p.guard && ok(p.cell));
  const far: Cell[] = [];
  for (let y = 0; y < f.rows; y++)
    for (let x = 0; x < f.cols; x++) if (ok({ x, y })) far.push({ x, y });
  far.sort((a, b) => cellDist(b, f.stairsUp) - cellDist(a, f.stairsUp));
  const placed: EncounterPack[] = [];
  for (const u of defs) {
    const guard = guards.shift();
    const cell =
      guard?.cell ?? far.find((c) => placed.every((p) => cellDist(p.cell, c) >= 10)) ?? far[0];
    if (!cell) continue;
    const species = uniqueSpecies(u.id);
    const lvl = foeLevel(band) + 3;
    const members: PackMember[] = [{ species, level: lvl, mods: [...u.mods] }];
    for (let m = 0; m < u.minions; m++) members.push({ species, level: lvl - 2, mods: [] });
    const pack: EncounterPack = {
      id: `pack-unique-${u.id}`,
      cell,
      room: f.rooms.findIndex(
        (r) => cell.x >= r.x && cell.y >= r.y && cell.x < r.x + r.w && cell.y < r.y + r.h,
      ),
      family: species,
      tier: 1 + act,
      members,
      kind: 'unique',
      aggroRadius: HOLLOW.packs.aggroRadius,
      leash: HOLLOW.packs.leash,
      reward: 'pack-champion',
      unique: u.id,
    };
    placed.push(pack);
    if (guard) packs.splice(packs.indexOf(guard), 1);
  }
  // Nothing else crowds a unique: packs within reach of one go.
  f.packs = [
    ...packs.filter((p) => p.kind === 'boss' || placed.every((u) => cellDist(u.cell, p.cell) >= 6)),
    ...placed,
  ];
}

/** A win over a unique: its first ever pays the bonus. Returns the bonus paid (0 after). */
export function uniqueBeaten(
  world: World,
  run: DungeonRun,
  pack: EncounterPack,
  events: SimEvent[],
): number {
  const id = pack.unique;
  if (!id) return 0;
  const done = world.hollow.uniquesBeaten;
  const first = !done.includes(id);
  const bonus = first ? (UNIQUES.find((u) => u.id === id)?.bonus ?? 0) : 0;
  if (first) done.push(id);
  world.inventory.shells += bonus;
  run.haul.shells += bonus;
  events.push({ kind: 'uniqueBeaten', id, bonus });
  return bonus;
}
