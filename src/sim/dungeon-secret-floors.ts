/**
 * The floors of the Hollow's two secret levels (lane B round 9, helper b). Both are one-floor
 * zones of an act run (`DungeonRun.zone` 'moo' or 'fort'), swapped in by `goToZone` like a
 * side cave, so the renderers load them as any other level: no seal patches, no rebuilds
 * beyond the normal floor load.
 *
 * - The Moo Meadow (R0189, DUNG-46): a small sunny field from the outdoor generator
 *   (`fieldFloor` with a `FieldShape`), wearing `zone: 'field'` so both renderers give it the
 *   open sky. Friendly field folk to scan, herds of the polite Moo Crew, and the Cow Queen.
 * - The Pillow Fort (R0183, DUNG-40): one small cave of the act's tileset (`zone: 'side'`)
 *   with the Pillow Trio, three pillow uniques in one pack, at its far end.
 *
 * Neither has a way down: the stairs up lead back to the camp. Pure sim, seeded.
 */
import { ACTS, actStartDepth } from '../config/dungeon-acts';
import { SECRETS } from '../config/dungeon-r9-b';
import { HOLLOW } from '../config/tuning';
import { cellDist, FLOOR, hashString, WALL, type Cell, type Floor } from './dungeon';
import type { EncounterPack, PackMember } from './dungeon-encounters';
import { generateV3 } from './dungeon-gen-v3';
import { fieldFloor } from './dungeon-outdoor';
import { Rng } from './rng';

const cache = new Map<string, Floor>();

function remember(key: string, f: Floor): Floor {
  if (cache.size > 4) cache.delete(cache.keys().next().value!);
  cache.set(key, f);
  return f;
}

const roomOf = (f: Floor, c: Cell): number =>
  f.rooms.findIndex((r) => c.x >= r.x && c.y >= r.y && c.x < r.x + r.w && c.y < r.y + r.h);

/** Open cells reachable on foot from the stairs up, in walking order (nearest first). */
function walkOrder(f: Floor): Cell[] {
  const seen = new Uint8Array(f.cols * f.rows);
  const out: Cell[] = [f.stairsUp];
  seen[f.stairsUp.y * f.cols + f.stairsUp.x] = 1;
  for (let i = 0; i < out.length; i++) {
    const c = out[i]!;
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
      out.push({ x, y });
    }
  }
  return out.filter((c) => f.cells[c.y * f.cols + c.x] === FLOOR);
}

/** The level a secret's foes stand at: as a boss of the last act's top depth would. */
function foeLevel(): { level: number; tier: number; depth: number } {
  const depth = actStartDepth(SECRETS.moo.act);
  return {
    depth,
    tier: 1 + SECRETS.moo.act,
    level: depth * 2 + HOLLOW.packs.bossLevels + SECRETS.fort.levelOver,
  };
}

/** The Moo Meadow for a run's seed (the act only names the camp it was opened from). */
export function mooFloor(seed: number, act: number): Floor {
  const key = `moo:${seed}:${act}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const base = fieldFloor(seed, SECRETS.moo.act, {
    name: 'moo',
    sunny: true,
    ...SECRETS.moo.field,
  });
  const rng = Rng.fromSeed((seed ^ hashString('moo-meadow')) >>> 0);
  const M = SECRETS.moo;
  const { level, tier } = foeLevel();
  // The friendly folk keep the generator's spots and take farm looks.
  const wildSpots = base.wildSpots.map((w, i) => ({
    ...w,
    species: M.friends[(i + rng.int(0, M.friends.length - 1)) % M.friends.length]!,
  }));
  const open = walkOrder(base).filter(
    (c) =>
      cellDist(c, base.stairsUp) >= 12 &&
      cellDist(c, base.chest) >= 3 &&
      wildSpots.every((w) => cellDist(w.cell, c) >= 3),
  );
  const packs: EncounterPack[] = [];
  // The Cow Queen holds court at the far end, herds graze between.
  const far = open[open.length - 1];
  if (far) {
    const members: PackMember[] = [
      { species: M.cow, level: level + 3, mods: ['bossy'] },
      { species: M.cow, level: level - 2, mods: [] },
      { species: M.cow, level: level - 2, mods: [] },
    ];
    packs.push({
      id: 'pack-unique-cow-queen',
      cell: far,
      room: roomOf(base, far),
      family: 'moo-crew',
      tier,
      members,
      kind: 'unique',
      aggroRadius: HOLLOW.packs.aggroRadius,
      leash: HOLLOW.packs.leash,
      reward: 'pack-champion',
      unique: 'cow-queen',
    });
  }
  const herds = rng.int(M.herds[0], M.herds[1]);
  for (let t = 0; packs.length < herds + 1 && t < 200 && open.length; t++) {
    const c = open[rng.int(0, open.length - 1)]!;
    if (packs.some((p) => cellDist(p.cell, c) < 10)) continue;
    const size = rng.int(M.herdSize[0], M.herdSize[1]);
    const members: PackMember[] = [];
    for (let m = 0; m < size; m++)
      members.push({ species: M.cow, level: Math.max(1, level - 4 + rng.int(0, 2)), mods: [] });
    packs.push({
      id: `pack-${packs.length}`,
      cell: c,
      room: roomOf(base, c),
      family: 'moo-crew',
      tier,
      members,
      kind: 'normal',
      aggroRadius: HOLLOW.packs.aggroRadius,
      leash: HOLLOW.packs.leash,
      reward: 'pack-normal',
    });
  }
  return remember(key, {
    ...base,
    wildSpots,
    packs,
    shrines: [],
    mouths: [],
    // The field's gate end is just more meadow: the way out is back up the portal.
    stairsDown: null,
    act,
  });
}

/** The Pillow Fort for a run's seed: a small cave of the camp's act, the trio at its end. */
export function fortFloor(seed: number, act: number): Floor {
  const key = `fort:${seed}:${act}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const { level, tier, depth } = foeLevel();
  const g = generateV3((seed ^ hashString(`pillow-fort:${act}`)) >>> 0, depth, {
    level: 'small',
    tileset: ACTS[act]!.tileset,
    boss: false,
  });
  const base: Floor = { ...g, stairsDown: null, zone: 'side', act };
  const order = walkOrder(base).filter((c) => cellDist(c, base.chest) >= 2);
  const at = order[order.length - 1] ?? base.stairsUp;
  const [lead, ...rest] = SECRETS.fort.trio;
  const mods: PackMember['mods'][] = [['bouncy'], ['sparkly'], ['sticky']];
  const trio: EncounterPack = {
    id: 'pack-unique-pillow-trio',
    cell: at,
    room: roomOf(base, at),
    family: 'pillow-trio',
    tier,
    members: [lead!, ...rest].map((species, i) => ({
      species,
      level,
      mods: [...mods[i]!],
    })),
    kind: 'unique',
    aggroRadius: HOLLOW.packs.bossAggro,
    leash: HOLLOW.packs.bossLeash,
    reward: 'pack-champion',
    unique: 'pillow-trio',
  };
  // Three pillows at once and nothing else: the fort's other packs stay home.
  return remember(key, { ...base, packs: [trio], traps: [], shrines: [] });
}
