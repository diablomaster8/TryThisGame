/**
 * The tactics vertical slice (recs FIGHT-65): a 3v3 play-fight in one Hollow "rumble room".
 * The map is a 10×10 crop of a Hollow floor at depth 2+, kept to three terrains (grass,
 * shallow, crystal); the foes are an Old Shadow leader to calm (calmBoss) and two Shadow Pups
 * to tucker out; the party is up to three Nubbins, and with fewer than three the Keeper's Cheer
 * aura (Sun or Moon) joins in. Winning pays Hollow haul Shells and one crystal (an essence).
 * The bout lives in `world.tactics`, so a save mid-battle keeps it. Lane B's Hollow can start
 * one from a marked room with `startRumble` and match the `tacticsEnd` event on `source`/`key`.
 */
import { TACTICS } from '../../../config/tuning-tactics';
import { floorOf, type Floor } from '../../dungeon';
import { Rng } from '../../rng';
import type { NubbinType, SimEvent, World } from '../../types';
import { createTactics, tacticsAct, tacticsForfeit } from './engine';
import { mapFromFloor } from './map';
import { TILE, type GridMap, type TacticsAction } from './types';
import { keeperSeed } from './keeper-unit';
import { partyUnits, unitFromLevels } from './units';
import './ai';
import { GUARDIAN_SOURCE, markStoryBout } from '../story-bouts';
import { grantKeepsake } from '../rewards';

/** The Hollow guardian's keepsake (FIGHT-72), once. */
const GUARDIAN_KEEPSAKE = 'guardian-lantern';

const S = TACTICS.slice;
export const RUMBLE_SOURCE = 'rumble';

/** The slice keeps three terrains: everything else becomes grass (walls stay walls). */
function slimTerrain(m: GridMap): GridMap {
  for (let i = 0; i < m.tiles.length; i++) {
    const t = m.tiles[i]!;
    if (t === TILE.deep) m.tiles[i] = TILE.shallow;
    else if (t === TILE.lantern || t === TILE.tree) m.tiles[i] = TILE.wall;
    else if (t !== TILE.wall && t !== TILE.shallow && t !== TILE.crystal) m.tiles[i] = TILE.grass;
  }
  return m;
}

/** Who fights: the given ids, else the Hollow party, else the first three hatched Nubbins. */
function partyOf(world: World, ids?: readonly string[]): string[] {
  const ok = (id: string) =>
    world.nubbins.some((n) => n.id === id && n.stage !== 'egg' && n.stage !== 'cocoon');
  const want: string[] = ids?.length
    ? [...ids]
    : world.partners.filter((id): id is string => id !== null);
  for (const n of world.nubbins) if (want.length < 3 && !want.includes(n.id)) want.push(n.id);
  return want.filter(ok).slice(0, 3);
}

export interface RumbleOptions {
  /** Put the Keeper's piece on the board (FIGHT-66); on unless false. */
  keeper?: boolean;
  depth?: number;
  seed?: number;
  ids?: readonly string[];
  source?: string;
  key?: string;
  /** The Hollow run's own floor and the rumble room's cell (lane B); else a floor of its own. */
  floor?: Floor;
  near?: { x: number; y: number };
}

/** Starts a rumble; false when nobody can fight or a tactics bout is already on. */
export function startRumble(world: World, events: SimEvent[], o: RumbleOptions = {}): boolean {
  if (world.tactics && !world.tactics.result) return false;
  const ids = partyOf(world, o.ids);
  if (!ids.length) return false;
  const depth = Math.max(2, o.depth ?? 2);
  const seed = o.seed ?? (world.battleRuns ?? 0) * 7919 + depth * 101 + 13;
  const rng = new Rng(seed);
  const floor = o.floor ?? floorOf(seed, depth);
  const room = floor.rooms[floor.greatRoom >= 0 ? floor.greatRoom : 0];
  const near =
    o.near ?? (room ? { x: room.x + room.w / 2, y: room.y + room.h / 2 } : { x: 0, y: 0 });
  const map = slimTerrain(mapFromFloor(floor, near, rng, S.size));
  // Merged partners stand as one tall unit (FIGHT-57).
  const allies = partyUnits(world, ids);
  // The Keeper walks the board beside its Nubbins (FIGHT-66) unless a caller leaves it out.
  const withKeeper = o.keeper !== false;
  const avg = Math.round(allies.reduce((s, u) => s + u.c.level, 0) / allies.length);
  const level = Math.max(1, Math.min(S.level + depth * 2, avg));
  const foe = (i: number, species: string, type: NubbinType, lv: number) =>
    unitFromLevels({ id: `foe-${i}`, side: 1, species, level: lv, type });
  const leader = foe(0, 'spinmaster', 'normal', level + 1);
  leader.c.calm = 0;
  leader.c.moves = ['wobble', 'lullaby', 'raspberry'];
  leader.phases = [{ atHpPct: 50, moveset: ['pounce', 'wobble', 'raspberry'], line: 0 }];
  const pups = [foe(1, 'zapkin', 'run', level - 1), foe(2, 'scrapper', 'power', level - 1)];
  const key = o.key ?? `rumble-${depth}`;
  const aura = ids.length < 3 ? world.keeper.alignment : null;
  world.battleRuns = (world.battleRuns ?? 0) + 1;
  world.tactics = createTactics({
    seed,
    map,
    allies: withKeeper ? [...allies, keeperSeed()] : allies,
    foes: [leader, ...pups],
    context: {
      kind: 'encounter',
      tier: Math.min(3, depth - 1),
      ids,
      source: o.source ?? RUMBLE_SOURCE,
      key,
      foes: [
        { species: 'spinmaster', level: level + 1, wild: true },
        { species: 'zapkin', level: level - 1 },
        { species: 'scrapper', level: level - 1 },
      ],
    },
    objective: { kind: 'calmBoss', target: 'foe-0' },
    ai: [null, depth <= 2 ? 'sprout' : 'keeper'],
    aura,
  });
  events.push({ kind: 'tacticsStart', source: o.source ?? RUMBLE_SOURCE, key });
  settleRumble(world, events);
  return true;
}

/** Plays one player action in the live rumble. */
export function rumbleAct(world: World, a: TacticsAction, events: SimEvent[]): boolean {
  const s = world.tactics;
  if (!s || s.result) return false;
  const ok = tacticsAct(s, a);
  settleRumble(world, events);
  return ok;
}

export function rumbleForfeit(world: World, events: SimEvent[]): void {
  if (!world.tactics) return;
  tacticsForfeit(world.tactics);
  settleRumble(world, events);
}

/** Closes a finished rumble's screen state. */
export function rumbleClose(world: World): void {
  if (world.tactics?.result) delete world.tactics;
}

/** Pays a finished rumble once: Shells by depth and one crystal (an essence of a seeded type). */
function settleRumble(world: World, events: SimEvent[]): void {
  const s = world.tactics;
  if (!s?.result || s.settled) return;
  s.settled = true;
  const won = s.result.winner === 0;
  const ctx = s.context;
  const tier = ctx.tier;
  const shells = won ? S.shells * tier : 0;
  const types: NubbinType[] = ['swim', 'fly', 'run', 'power', 'normal'];
  const essence = won ? types[new Rng(s.seed + 1).int(0, types.length - 1)]! : null;
  if (won) {
    world.inventory.shells += shells;
    world.inventory.essences[essence!] = (world.inventory.essences[essence!] ?? 0) + 1;
  }
  // Story battles and the Hollow guardian (FIGHT-82, FIGHT-72) remember their wins.
  if (ctx.kind === 'encounter') {
    markStoryBout(world, ctx.source, ctx.key, won);
    if (won && ctx.source === GUARDIAN_SOURCE) grantKeepsake(world, GUARDIAN_KEEPSAKE);
  }
  events.push({
    kind: 'tacticsEnd',
    source: ctx.kind === 'encounter' ? ctx.source : RUMBLE_SOURCE,
    key: ctx.kind === 'encounter' ? ctx.key : '',
    winner: s.result.winner,
    reason: s.result.reason,
    shells,
    essence,
  });
}
