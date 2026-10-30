/**
 * Pack density and placement for version-4 floors (R0158, DUNG-18), with champion and elite
 * modifiers rolled on (R0155, DUNG-15). Replaces the version-3 packs on a fresh version-4
 * floor (the boss stays), so a saved version-3 run keeps the packs it was made with.
 *
 * The rhythm: a set number of packs per thousand dry cells, kept ten cells apart and away
 * from the entry and the waypoint, none in the chest nook or a shrine room, and one champion
 * guarding every other treasure room. Most packs are plain; some are champions with one
 * modifier on every member, a few are elites whose leader carries two or three.
 */
import {
  actFamilies,
  CHAMPION_MODS,
  DENSITY,
  type ChampionModId,
  type Difficulty,
} from '../config/dungeon-foes';
import { HOLLOW } from '../config/tuning';
import { cellDist, FLOOR, hashString, type Cell, type Floor } from './dungeon';
import type { EncounterPack, PackKind, PackMember } from './dungeon-encounters';
import { waypointCell } from './dungeon-levels';
import { Rng } from './rng';

const E = HOLLOW.packs;

/** Where a floor sits for its foes' levels: its act (or endless band) and level within it. */
export interface FoeBand {
  act: number;
  level: number;
  boss: boolean;
  difficulty: Difficulty;
}

/** The band for a run depth: act floors pass their own; the endless Hollow counts in fives. */
export function endlessBand(depth: number): FoeBand {
  const per = DENSITY.endlessActLevels;
  return {
    act: Math.min(DENSITY.actBase.length - 1, Math.floor((depth - 1) / per)),
    level: (depth - 1) % per,
    boss: false,
    difficulty: 'cosy',
  };
}

/** Foe level = act base + level in act + difficulty offset (R0158). */
export function foeLevel(b: FoeBand): number {
  // R0179: Brisk and Wild replay the acts far higher; nothing goes past level 99.
  return Math.min(99, DENSITY.actBase[b.act]! + b.level + DENSITY.difficultyOffset[b.difficulty]);
}

/** The one modifier each family always brings as an elite (by a hash of its id). */
export function familyMod(family: string): ChampionModId {
  return CHAMPION_MODS[hashString(family) % CHAMPION_MODS.length]!.id;
}

/** `n` different modifiers, `first` (when given) among them. */
function rollMods(rng: Rng, n: number, first?: ChampionModId): ChampionModId[] {
  const out: ChampionModId[] = first ? [first] : [];
  while (out.length < n) {
    const m = rng.pick(CHAMPION_MODS).id;
    if (!out.includes(m)) out.push(m);
  }
  return out;
}

function inRoom(f: Floor, i: number, c: Cell): boolean {
  const r = f.rooms[i];
  return !!r && c.x >= r.x && c.y >= r.y && c.x < r.x + r.w && c.y < r.y + r.h;
}

/** Packs for a fresh version-4 floor; mutates `f.packs`. */
export function densityPacks(f: Floor, seed: number, depth: number, band: FoeBand): void {
  const rng = new Rng((seed ^ 0x9ac4_5e11 ^ (depth * 0x2f1d)) >>> 0);
  const boss = (f.packs ?? []).filter((p) => p.kind === 'boss');
  // The act's own foe families (R0157); one pick each, so the seeded order is unchanged.
  const fams = actFamilies(band.act);
  const wp = waypointCell(f);
  const dry: Cell[] = [];
  for (let y = 0; y < f.rows; y++)
    for (let x = 0; x < f.cols; x++) if (f.cells[y * f.cols + x] === FLOOR) dry.push({ x, y });
  // Rooms nothing may stand in: the chest nook and any room with a shrine socket.
  const quiet = new Set<number>();
  if (f.nook) quiet.add(f.nook.room);
  for (const s of [...(f.layout?.shrines ?? []), ...(f.shrines ?? []).map((x) => x.cell)])
    f.rooms.forEach((_, i) => {
      if (inRoom(f, i, s)) quiet.add(i);
    });
  const roomOf = (c: Cell) => f.rooms.findIndex((_, i) => inRoom(f, i, c));
  const out: EncounterPack[] = [];
  const ok = (c: Cell, spacing: number) =>
    f.cells[c.y * f.cols + c.x] === FLOOR &&
    cellDist(c, f.stairsUp) >= DENSITY.fromEntry &&
    cellDist(c, wp) >= DENSITY.fromWaypoint &&
    cellDist(c, f.chest) >= 2 &&
    (!f.stairsDown || cellDist(c, f.stairsDown) >= 2) &&
    !quiet.has(roomOf(c)) &&
    ![...out, ...boss].some((p) => cellDist(p.cell, c) < spacing);
  const make = (c: Cell, kind: PackKind): EncounterPack => {
    const fam = rng.pick(fams);
    const family = fam.id;
    const [lo, hi] = DENSITY.size[band.difficulty];
    const size = rng.int(lo, hi);
    const wild = band.difficulty === 'wild' ? DENSITY.mods.wildBonus : 0;
    const packMods =
      kind === 'champion' ? rollMods(rng, DENSITY.mods.champion + wild) : ([] as ChampionModId[]);
    const leaderMods =
      kind === 'elite'
        ? rollMods(
            rng,
            rng.int(DENSITY.mods.elite[0], DENSITY.mods.elite[1]) + wild,
            familyMod(family),
          )
        : packMods;
    const level = foeLevel(band) + (kind === 'normal' ? 0 : 2);
    const members: PackMember[] = [];
    for (let m = 0; m < size; m++)
      members.push({
        species: m === 0 || rng.chance(0.7) ? fam.look : rng.pick(fams).look,
        level: Math.max(1, level + rng.int(0, 1)),
        // A champion pack shares its modifier; an elite's leader carries the set.
        mods: m === 0 ? [...leaderMods] : kind === 'elite' ? [familyMod(family)] : [...packMods],
      });
    return {
      id: `pack-${out.length}`,
      cell: c,
      room: roomOf(c),
      family,
      tier: 1 + band.act,
      members,
      kind,
      aggroRadius: E.aggroRadius,
      leash: E.leash,
      reward: kind === 'normal' ? 'pack-normal' : 'pack-champion',
      ...(fam.grey ? { grey: true as const } : {}),
    };
  };

  // Treasure rooms (not the nook) each get a champion guard near their middle.
  const pieces = f.layout?.pieces ?? [];
  pieces.forEach((p, i) => {
    if (p.role !== 'treasure' || quiet.has(i)) return;
    const r = f.rooms[i]!;
    const mid = { x: r.x + Math.floor(r.w / 2), y: r.y + Math.floor(r.h / 2) };
    const spot = dry
      .filter((c) => inRoom(f, i, c) && ok(c, DENSITY.spacing / 2))
      .sort((a, b) => cellDist(a, mid) - cellDist(b, mid))[0];
    if (spot) out.push({ ...make(spot, 'champion'), guard: true });
  });

  // The rest by density, on the pieces' spawn marks first, then anywhere dry.
  const per = band.boss ? DENSITY.perThousand.boss : DENSITY.perThousand.dungeon;
  const want = out.length + Math.max(1, Math.round((dry.length / 1000) * per));
  const marks = (f.layout?.spawns ?? []).slice();
  for (let i = marks.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [marks[i], marks[j]] = [marks[j]!, marks[i]!];
  }
  for (let t = 0; out.length < want && t < DENSITY.tries; t++) {
    const c = t < marks.length ? marks[t]! : dry[rng.int(0, dry.length - 1)]!;
    if (!ok(c, DENSITY.spacing)) continue;
    const roll = rng.next();
    const kind: PackKind =
      roll < DENSITY.mix.elite
        ? 'elite'
        : roll < DENSITY.mix.elite + DENSITY.mix.champion
          ? 'champion'
          : 'normal';
    out.push(make(c, kind));
  }
  f.packs = [...out, ...boss];
}
