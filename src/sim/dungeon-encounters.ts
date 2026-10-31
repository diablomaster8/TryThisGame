/**
 * Monster packs on the Hollow's floors, and the hand-off to a fight (R0146, DUNG-06). A
 * version-3 floor carries its packs' make-up (`Floor.packs`); the run carries where each
 * pack is and what it is doing (`DungeonRun.packs`). Packs idle near home, notice a Keeper
 * who comes close ("!"), chase at a little under walking pace, and give up past their
 * leash. Bumping into one starts an encounter.
 *
 * Combat belongs to lane C (FIGHT, `src/sim/battle/`). Until it lands, the dungeon asks a
 * small handler interface defined here: `setEncounterHandler` swaps in the real fight,
 * which may answer at once or later through the `encounterDone` command. The default is
 * a seeded auto-resolve stub that weighs the party against the pack. Pure sim: no DOM.
 */
import { bravePower } from './dungeon-gear-effects';
import { GEAR_EFFECTS } from '../config/dungeon-items-r8';
import { friendBrave, friendPower } from './dungeon-friends';
import { packKeyWin } from './dungeon-keys';
import { arenaFor, type HollowArena } from './dungeon-arena';
import { fightFlag, noteFinalBoss } from './dungeon-tiers';
import { noteActTime } from './dungeon-speed';
import { noteStoryScroll } from './dungeon-log';
import { shellPay } from './dungeon-economy';
import { uniqueBeaten } from './dungeon-uniques';
import { secretPackWon } from './dungeon-secret-levels';
import { bossPhases, bossRetry, bossWon, type BossPhase } from './dungeon-boss';
import { bossAnteroom } from './dungeon-secrets';
import { noteFight } from './dungeon-log';
import { lostTo, sneaking, startsAsleep, stepSleepy } from './dungeon-sleepy';
import { DUNGEON, HOLLOW, HOLLOW_R7, KEEPER } from '../config/tuning';
import { BATTLE } from '../config/tuning-battle';
import { actFamilies, FOE_FAMILIES, type ChampionModId } from '../config/dungeon-foes';
import {
  combatantOf,
  createBattle,
  rivalLevel,
  type BattleContext,
  type BattleResult,
} from './battle';
import { cellCentre, cellDist, cellOf, FLOOR, WALL, type Cell, type Floor } from './dungeon';
import { newRoute, nextWaypoint, type NavRoute } from './dungeon-nav';
import { actProgress } from './dungeon-acts';
import { Rng } from './rng';
import { gearStat, rollDrops } from './gear';
import { isCommonSpecies, SPECIES } from './species';
import { levelOf } from './stats';
import type { DungeonPack, DungeonRun, SimEvent, Vec2, World } from './types';

export type PackKind = 'normal' | 'champion' | 'elite' | 'unique' | 'boss';
/** Champion modifiers (R0155, `config/dungeon-foes.ts`); older saves hold none. */
export type ChampionMod = ChampionModId;
export type LootTableId = 'pack-normal' | 'pack-champion' | 'pack-boss';
export type FoeFamilyId = string;

export interface PackMember {
  species: string;
  level: number;
  mods: ChampionMod[];
}

/** A pack's make-up, part of the floor (seeded, never saved). */
export interface EncounterPack {
  id: string;
  cell: Cell;
  /** Index into the floor's rooms, or -1 out in the side caves. */
  room: number;
  family: FoeFamilyId;
  tier: number;
  members: PackMember[];
  kind: PackKind;
  /** Cells. */
  aggroRadius: number;
  leash: number;
  reward: LootTableId;
  /** A treasure room's champion guard (R0158), not part of the floor's kind mix. */
  guard?: boolean;
  /** An Act V Greyling pack (R0157): drawn colour-drained. */
  grey?: true;
  /** A named unique (R0156), by `UNIQUES` id. */
  unique?: string;
}

/** What the dungeon hands the fight: the foes and a 9×7 window of the floor as the board. */
export interface EncounterSpec {
  packId: string;
  members: PackMember[];
  kind: PackKind;
  /** The party's Nubbin ids. */
  party: string[];
  arena: {
    x0: number;
    y0: number;
    w: number;
    h: number;
    /** Row-major cell kinds (0 wall, 1 floor, 2 water); outside the floor is wall. */
    cells: number[];
    /** Row-major heights from the floor's elevation. */
    elevation: number[];
  };
  terrain: string;
  canFlee: boolean;
  seed: number;
  /** The pack's tier (1 up, by depth); the battle core clamps it to its own tiers. */
  tier: number;
  /** R0160: a boss's phases (adds at half puff); the fight side may read them. */
  phases?: BossPhase[];
  /** R0195: the same ground as a tactics board (heights in steps, props, spawn sides). */
  board?: HollowArena;
  /** R0179: the tier's assist flag: gentle (auto-target, free retry), standard or tactics. */
  fight?: 'gentle' | 'standard' | 'tactics';
  /** R0164: each party Nubbin's Brave (its own gear plus the Keeper's); absent when none. */
  brave?: Record<string, number>;
}

/** The `source` the Hollow's bouts carry on the battle core, matched on `battleEnd`. */
export const HOLLOW_BATTLE_SOURCE = 'hollow';

export type EncounterOutcome = 'won' | 'lost' | 'fled';

/**
 * Answers an encounter: an outcome now, or null to answer later with `encounterDone`
 * (an interactive fight). Lane C's battle system registers one of these.
 */
export type EncounterHandler = (
  world: World,
  spec: EncounterSpec,
  rng: Rng,
  events: SimEvent[],
) => EncounterOutcome | null;

const E = HOLLOW.packs;

// ---------------------------------------------------------------- placement

/** Packs for a version-3 floor, away from the entry and from each other. */
export function placePacks(
  f: Floor,
  rng: Rng,
  depth: number,
  count: number,
  act?: number,
): EncounterPack[] {
  const far = (c: Cell) => cellDist(c, f.stairsUp) >= E.minFromEntry;
  const open = (c: Cell) => f.cells[c.y * f.cols + c.x] === FLOOR;
  const spots: Cell[] = (f.layout?.spawns ?? []).filter((c) => open(c) && far(c));
  // Spawn marks first in a seeded order, then any open cell for the rest.
  for (let i = spots.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [spots[i], spots[j]] = [spots[j]!, spots[i]!];
  }
  const anywhere: Cell[] = [];
  for (let y = 0; y < f.rows; y++)
    for (let x = 0; x < f.cols; x++) if (open({ x, y }) && far({ x, y })) anywhere.push({ x, y });
  const roomOf = (c: Cell) =>
    f.rooms.findIndex((r) => c.x >= r.x && c.y >= r.y && c.x < r.x + r.w && c.y < r.y + r.h);
  // An act's field packs are its foe families (R0157); the endless floors keep the babies.
  const fams = act === undefined ? null : actFamilies(act);
  const foes = SPECIES.filter((s) => s.id !== 'chao' && s.stage === 'baby' && isCommonSpecies(s));
  const out: EncounterPack[] = [];
  const taken = (c: Cell) =>
    out.some((p) => cellDist(p.cell, c) < E.spacing) ||
    cellDist(c, f.chest) < 2 ||
    (f.stairsDown !== null && cellDist(c, f.stairsDown) < 2);
  for (let tries = 0; out.length < count && tries < 400; tries++) {
    const c = tries < spots.length ? spots[tries]! : anywhere[rng.int(0, anywhere.length - 1)];
    if (!c || taken(c)) continue;
    const champion = depth >= E.championFrom && rng.chance(E.championChance);
    const tier = 1 + Math.floor((depth - 1) / 3);
    const size = rng.int(E.members[0], E.members[1]);
    const fam = fams ? rng.pick(fams) : null;
    const family = fam ? fam.id : rng.pick(foes).id;
    const look = (): string => (fams ? rng.pick(fams).look : rng.pick(foes).id);
    const members: PackMember[] = [];
    for (let m = 0; m < size; m++)
      members.push({
        // A pack is mostly one family, with the odd stray in it.
        species: m === 0 || rng.chance(0.7) ? (fam ? fam.look : family) : look(),
        level: Math.max(1, depth * 2 + tier - 1 + rng.int(0, 2) + (champion ? 2 : 0)),
        mods: [],
      });
    out.push({
      id: `pack-${out.length}`,
      cell: c,
      room: roomOf(c),
      family,
      tier,
      members,
      kind: champion ? 'champion' : 'normal',
      aggroRadius: E.aggroRadius,
      leash: E.leash,
      reward: champion ? 'pack-champion' : 'pack-normal',
      ...(fam?.grey ? { grey: true as const } : {}),
    });
  }
  return out;
}

/**
 * An act's boss (R0145): one big foe on the boss room's spot that guards the way on, never
 * fled from, and with a long leash. Its own look and phased fight come with DUNG-20.
 */
export function bossPack(f: Floor, rng: Rng, depth: number, at: Cell): EncounterPack {
  const foes = SPECIES.filter((s) => s.id !== 'chao' && s.stage === 'baby' && isCommonSpecies(s));
  return {
    id: 'pack-boss',
    cell: at,
    room: f.rooms.findIndex(
      (r) => at.x >= r.x && at.y >= r.y && at.x < r.x + r.w && at.y < r.y + r.h,
    ),
    family: 'boss',
    tier: 1 + Math.floor((depth - 1) / 3),
    members: [{ species: rng.pick(foes).id, level: depth * 2 + E.bossLevels, mods: [] }],
    kind: 'boss',
    aggroRadius: E.bossAggro,
    leash: E.bossLeash,
    reward: 'pack-boss',
  };
}

/** The run's live packs for a floor, all at home and idle. */
export function freshPacks(f: Floor): DungeonPack[] {
  return (f.packs ?? []).map((p) => ({
    id: p.id,
    pos: cellCentre(f, p.cell),
    state: 'idle',
    target: null,
    noticedMs: -1,
    // R0203: some normal packs doze; seeded by the floor's shape and the pack's spot.
    ...(startsAsleep(`${f.cols}x${f.rows}:${p.cell.x},${p.cell.y}`, p.id, p.kind)
      ? { asleep: true as const }
      : {}),
  }));
}

// ---------------------------------------------------------------- the fight hand-off

function partyPower(world: World, run: DungeonRun): number {
  let power = 0;
  for (const id of run.party) {
    const n = world.nubbins.find((x) => x.id === id);
    if (!n) continue;
    const s = n.stats;
    const sum =
      levelOf(s.power.points) +
      levelOf(s.stamina.points) +
      levelOf(s.run.points) +
      levelOf(s.swim.points) +
      levelOf(s.fly.points);
    power += E.memberBase + sum / 5;
  }
  // The Keeper counts for one small Nubbin; R0181 (round 9): a hired friend for another.
  return (
    power +
    E.memberBase * (1 + friendPower(world)) +
    bravePower(world, run.party) +
    friendBrave(world) * GEAR_EFFECTS.bravePower
  );
}

/** The stub until FIGHT lands: the party's weight against the pack's, then a seeded roll. */
export const autoResolve: EncounterHandler = (world, spec, rng) => {
  const run = world.dungeon;
  if (!run) return 'fled';
  const party = partyPower(world, run);
  const foes = spec.members.reduce((a, m) => a + E.memberBase + m.level, 0);
  const p = Math.min(E.winMax, Math.max(E.winMin, party / (party + foes) + E.winBias));
  return rng.chance(p) ? 'won' : 'lost';
};

/** What a finished Hollow bout means for the floor. A boss can't be fled, so giving up loses. */
export function boutOutcome(result: BattleResult, canFlee: boolean): EncounterOutcome {
  // A hug or a befriending (lane C, round 3) ends with the party on top too: the pack goes home.
  if (result.winner === 0 || result.reason === 'hug' || result.reason === 'friends') return 'won';
  if (result.winner === 1 && result.reason !== 'forfeit') return 'lost';
  // A forfeit, or a draw at the round limit: everyone backs off.
  return canFlee ? 'fled' : 'lost';
}

/**
 * The real fight (lane C's battle core): starts a turn bout with the pack as foes, seeded from
 * the encounter, and answers later through the `battleEnd` hook (`hollowBattleEnded`). Asked
 * again every step while the fight is on, so it starts a bout only once. With nobody able to
 * fight (an empty or unhatched party) it falls back to the auto-resolve stub.
 */
export const battleHandler: EncounterHandler = (world, spec, rng, events) => {
  const enc = world.dungeon?.encounter;
  if (!enc) return null;
  const live = world.battle;
  if (enc.bout !== undefined) {
    const mine =
      live &&
      live.context.kind === 'encounter' &&
      live.context.source === HOLLOW_BATTLE_SOURCE &&
      live.context.key === spec.packId &&
      (world.battleRuns ?? 0) === enc.bout;
    if (mine) return live.result ? boutOutcome(live.result, spec.canFlee) : null;
    // The bout went missing (another fight replaced it): settle the old way.
  } else {
    const tier = Math.max(1, Math.min(BATTLE.rivals.tierFloor.length, spec.tier));
    // No foe outclasses a dojo rival of the same tier (lane C's `rivalLevel`): pack levels grow
    // with depth, a fresh party's do not, and 2 on 2 at act I lost 35 of 39 on the round-2 core.
    const party = spec.party.flatMap((id) => {
      const n = world.nubbins.find((x) => x.id === id);
      return n ? [combatantOf(n, world)] : [];
    });
    const cap = rivalLevel(party, tier) + E.boutLevelOver;
    const context: BattleContext = {
      kind: 'encounter',
      tier,
      ids: [...spec.party],
      source: HOLLOW_BATTLE_SOURCE,
      key: spec.packId,
      // The rest of a bigger pack hangs back: the battle core gives an outnumbered fresh party
      // no chance (3 on 2 lost 27 of 27).
      foes: spec.members
        .slice(0, Math.max(1, spec.party.length + E.boutExtraFoes))
        // Hollow foes are wildlife: they can be befriended (lane C, FIGHT-21). R0155: the core
        // plays each foe's champion modifiers (`battle/hollow-mods.ts`).
        .map((m) => ({
          species: m.species,
          level: Math.min(m.level, cap),
          wild: true,
          ...(m.mods.length ? { mods: [...m.mods] } : {}),
        })),
      // R0164: Brave gear adds to each Nubbin's hits.
      ...(spec.brave ? { brave: { ...spec.brave } } : {}),
    };
    const bout = createBattle(world, context, spec.seed);
    if (bout) {
      world.battleRuns = (world.battleRuns ?? 0) + 1;
      world.battle = bout;
      enc.bout = world.battleRuns;
      events.push({ kind: 'battleStart', context: 'encounter' });
      return null;
    }
  }
  return autoResolve(world, spec, rng, events);
};

let handler: EncounterHandler = battleHandler;

/** Swap a test handler in, or back to the real fight (null). */
export function setEncounterHandler(h: EncounterHandler | null): void {
  handler = h ?? battleHandler;
}

export function encounterSpec(
  world: World,
  f: Floor,
  pack: EncounterPack,
  at: Cell,
): EncounterSpec {
  const run = world.dungeon!;
  const w = 9;
  const h = 7;
  const x0 = at.x - 4;
  const y0 = at.y - 3;
  const cells: number[] = [];
  const elevation: number[] = [];
  for (let y = y0; y < y0 + h; y++)
    for (let x = x0; x < x0 + w; x++) {
      const inside = x >= 0 && y >= 0 && x < f.cols && y < f.rows;
      cells.push(inside ? f.cells[y * f.cols + x]! : WALL);
      elevation.push(inside ? f.elevation[y * f.cols + x]! : 0);
    }
  return {
    packId: pack.id,
    members: pack.members.map((m) => ({ ...m, mods: [...m.mods] })),
    kind: pack.kind,
    party: [...run.party],
    arena: { x0, y0, w, h, cells, elevation },
    board: arenaFor(f, at),
    terrain: f.layout?.tileset ?? 'rootways',
    canFlee: pack.kind !== 'boss',
    // The boss's id has no number; it must still get its own seed.
    seed: (run.seed * 31 + run.depth * 7919 + (Number(pack.id.slice(5)) || 97) * 101) >>> 0,
    tier: pack.tier,
    ...(pack.kind === 'boss' ? { phases: bossPhases(run.act) } : {}),
    // R0179: the run's tier, as FIGHT's assist flag.
    fight: fightFlag(run.difficulty),
    ...braveOf(world, run.party),
  };
}

/** Each party Nubbin's Brave (its own gear plus the Keeper's), or nothing when none has any. */
function braveOf(world: World, party: string[]): { brave?: Record<string, number> } {
  // R0181 (round 9): a hired friend cheers every party Nubbin on.
  const keeper = gearStat(world, 'brave') + friendBrave(world);
  const brave: Record<string, number> = {};
  for (const id of party) {
    const b = keeper + gearStat(world, 'brave', id);
    if (b > 0) brave[id] = b;
  }
  return Object.keys(brave).length ? { brave } : {};
}

/** Ask the handler; an answer now finishes the encounter, null leaves it waiting. */
function askHandler(world: World, f: Floor, rng: Rng, events: SimEvent[]): void {
  const run = world.dungeon!;
  const enc = run.encounter;
  const pack = enc && f.packs?.find((p) => p.id === enc.packId);
  if (!enc || !pack) {
    delete run.encounter;
    return;
  }
  const spec = encounterSpec(world, f, pack, cellOf(f, world.keeper.pos));
  const outcome = handler(world, spec, rng, events);
  if (outcome) finishEncounter(world, f, outcome, events);
}

export function startEncounter(
  world: World,
  f: Floor,
  pack: DungeonPack,
  rng: Rng,
  events: SimEvent[],
): void {
  const run = world.dungeon!;
  // R0196: remember where everyone stood, so a win or a flight puts them back.
  const party: Record<string, Vec2> = {};
  for (const id of run.party) {
    const n = world.nubbins.find((x) => x.id === id);
    if (n) party[id] = { x: n.pos.x, z: n.pos.z };
  }
  run.encounter = {
    packId: pack.id,
    at: { keeper: { x: world.keeper.pos.x, z: world.keeper.pos.z }, party },
  };
  world.keeper.moveTarget = null;
  world.keeper.intent = null;
  pack.target = null;
  events.push({ kind: 'encounterStarted', packId: pack.id });
  askHandler(world, f, rng, events);
}

/**
 * The fight is over. A win: the pack poofs into sparkles and runs home, and its reward
 * rolls. A loss: the party gets the giggles and sits down; everyone is back at the floor's
 * stairs up with everything they carried, and the pack goes home. A flight: the pack goes
 * home and the Keeper gets a moment's grace.
 */
export function finishEncounter(
  world: World,
  f: Floor,
  outcome: EncounterOutcome,
  events: SimEvent[],
  boutShells = 0,
): void {
  const run = world.dungeon;
  if (!run?.encounter) return;
  const packId = run.encounter.packId;
  const at = run.encounter.at;
  delete run.encounter;
  // R0196: back where everyone stood (a loss sends them to the stairs below instead).
  if (at && outcome !== 'lost') {
    world.keeper.pos = { ...at.keeper };
    for (const id of run.party) {
      const n = world.nubbins.find((x) => x.id === id);
      const p = at.party[id];
      if (n && p) n.pos = { ...p };
    }
  }
  const pack = run.packs?.find((p) => p.id === packId);
  const spec = f.packs?.find((p) => p.id === packId);
  if (!pack || !spec) return;
  noteFight(world, run, outcome === 'lost');
  if (outcome === 'won') {
    pack.state = 'beaten';
    pack.target = null;
    // The battle core already paid its prize; the pack's reward tops it up, never doubles it.
    const shells = Math.max(
      boutShells,
      // R0178: the act's payout scale.
      shellPay(
        run,
        (E.rewardShells + spec.tier * E.rewardPerTier + run.depth * 2) *
          (spec.kind === 'normal' ? 1 : 2),
      ),
    );
    world.inventory.shells += shells - boutShells;
    run.haul.shells += shells;
    events.push({ kind: 'packBeaten', packId, x: pack.pos.x, z: pack.pos.z, shells });
    // R0196: the next pack gives the Keeper a breath before it notices.
    run.graceUntilMs = Math.max(run.graceUntilMs ?? 0, world.timeMs + R7.afterFightMs);
    // R0163: the pack's drop table, seeded by the run, the level and the pack.
    const drops = Rng.fromSeed(`${run.seed}:${run.depth}:${run.act ?? -1}:${packId}:drops`);
    rollDrops(world, drops, spec.reward, spec.members[0]?.level ?? run.depth, events);
    // Lane B r9: the secret levels' prizes and the meadow's keepsakes (R0189, R0183).
    secretPackWon(world, run, spec, drops, events);
    if (spec.unique) uniqueBeaten(world, run, spec, events);
    if (spec.kind === 'boss' && run.act !== undefined) {
      actProgress(world, run.act).bossDefeated = true;
      events.push({ kind: 'bossBeaten', act: run.act });
      // R0179: the last act's boss opens the next tier.
      noteFinalBoss(world, run.act, events);
      // R0187: a speed run's time for the act.
      noteActTime(world, run, events);
      // R0207: the act's "Story so far" scroll, once.
      noteStoryScroll(world, run.act, events);
      // R0160: the big chest, the celebration and the next act's waypoint (first time only).
      bossWon(world, run, spec.members[0]?.level ?? run.depth, drops, events);
    }
    // R0183: the key set, on Brisk or Wild.
    packKeyWin(world, run, spec, drops, events);
    return;
  }
  pack.state = 'home';
  pack.target = cellCentre(f, spec.cell);
  if (outcome === 'lost') {
    // R0180, R0160: a warm loss (rested party, "Sneak past?" after a few), a full rest for a boss.
    lostTo(world, run, packId, events);
    if (spec.kind === 'boss') bossRetry(world, run);
    const k = world.keeper;
    // R0160: a lost boss fight retries from the arena's anteroom.
    const at = cellCentre(f, (spec.kind === 'boss' && bossAnteroom(f)) || f.stairsUp);
    k.pos = { x: at.x, z: at.z };
    k.moveTarget = null;
    k.intent = null;
    run.party.forEach((id, i) => {
      const n = world.nubbins.find((x) => x.id === id);
      if (n) n.pos = { x: at.x + 0.8 * (i ? -1 : 1), z: at.z + 0.6 };
    });
    run.graceUntilMs = world.timeMs + HOLLOW.arrivalGraceMs;
    events.push({ kind: 'partyGiggles', packId });
  } else {
    run.graceUntilMs = world.timeMs + E.fleeGraceMs;
    events.push({ kind: 'packFled', packId });
  }
}

// ---------------------------------------------------------------- moving about

const routes = new WeakMap<DungeonPack, NavRoute>();

const R7 = HOLLOW_R7.aggro;

/** R0200: a party with a Shy Nubbin in it is noticed from a cell closer. */
function shyParty(world: World, run: DungeonRun): boolean {
  return run.party.some((id) => world.nubbins.find((n) => n.id === id)?.personality === 'shy');
}

/** R0200: Swim-type foe families may chase through water; the rest go round. */
export function swimFamily(id: FoeFamilyId): boolean {
  return FOE_FAMILIES.find((d) => d.id === id)?.type === 'swim';
}

function walk(
  f: Floor,
  pack: DungeonPack,
  target: Vec2,
  speed: number,
  dt: number,
  wet = false,
): boolean {
  let route = routes.get(pack);
  if (!route) {
    route = newRoute();
    routes.set(pack, route);
  }
  const wp = nextWaypoint(route, f, pack.pos, target, wet, 0.3) ?? pack.pos;
  const dx = wp.x - pack.pos.x;
  const dz = wp.z - pack.pos.z;
  const d = Math.hypot(dx, dz);
  const step = speed * dt;
  if (d <= step) {
    pack.pos.x = wp.x;
    pack.pos.z = wp.z;
  } else {
    pack.pos.x += (dx / d) * step;
    pack.pos.z += (dz / d) * step;
  }
  return Math.hypot(target.x - pack.pos.x, target.z - pack.pos.z) < 0.15 || d < 1e-6;
}

/** One step of every pack on the floor; `settling` is the arrival grace. */
export function stepPacks(
  world: World,
  f: Floor,
  dtMs: number,
  rng: Rng,
  events: SimEvent[],
  settling: boolean,
): void {
  const run = world.dungeon;
  if (!run || !f.packs?.length) return;
  run.packs ??= freshPacks(f);
  // A fight in progress holds the floor still; the stub answers a saved one at once.
  if (run.encounter) {
    askHandler(world, f, rng, events);
    return;
  }
  const dt = dtMs / 1000;
  const k = world.keeper;
  for (const pack of run.packs) {
    if (pack.state === 'beaten') continue;
    const spec = f.packs.find((p) => p.id === pack.id);
    if (!spec) continue;
    const home = cellCentre(f, spec.cell);
    const toKeeper = Math.hypot(k.pos.x - pack.pos.x, k.pos.z - pack.pos.z);
    // R0203, R0180: a sleepy pack snores until woken; a sneaked-past pack looks away.
    if (stepSleepy(world, run, pack, toKeeper, rng, events) || sneaking(world, run, pack)) {
      if (pack.state === 'chase') pack.state = 'home';
      if (pack.state === 'home' && walk(f, pack, home, E.wanderSpeed * 1.5, dt)) {
        pack.state = 'idle';
        pack.target = null;
      }
      continue;
    }
    const fromHome = Math.hypot(home.x - pack.pos.x, home.z - pack.pos.z);
    // R0200: a pack that just gave up looks away for a moment; a Shy friend keeps the party small.
    const ignoring = pack.gaveUpMs !== undefined && world.timeMs - pack.gaveUpMs < R7.ignoreMs;
    const aggro =
      spec.aggroRadius - (spec.kind !== 'boss' && shyParty(world, run) ? R7.shyLess : 0);
    if (pack.state === 'idle' && !settling && !ignoring && toKeeper <= aggro * DUNGEON.cell) {
      pack.state = 'chase';
      pack.noticedMs = world.timeMs;
      events.push({ kind: 'packNoticed', packId: pack.id });
    }
    if (pack.state === 'chase') {
      const chased = world.timeMs - pack.noticedMs - E.noticeMs;
      const tired = spec.kind !== 'boss' && chased > R7.chaseMaxMs;
      if (settling || fromHome > spec.leash * DUNGEON.cell || tired) {
        pack.state = 'home';
        if (!settling) pack.gaveUpMs = world.timeMs;
      } else {
        // A beat of surprise ("!") before the chase. Only swimmers follow through water.
        if (world.timeMs - pack.noticedMs >= E.noticeMs)
          walk(f, pack, k.pos, KEEPER.speed * E.chaseSpeed, dt, swimFamily(spec.family));
        pack.target = { x: k.pos.x, z: k.pos.z };
        if (toKeeper < E.contact) {
          startEncounter(world, f, pack, rng, events);
          return;
        }
        continue;
      }
    }
    if (pack.state === 'home') {
      pack.target = home;
      if (walk(f, pack, home, E.wanderSpeed * 1.5, dt)) {
        pack.state = 'idle';
        pack.target = null;
      }
      continue;
    }
    // Idle: amble about within a few cells of home.
    if (!pack.target || walk(f, pack, pack.target, E.wanderSpeed, dt)) {
      const c = spec.cell;
      const r = E.wander;
      for (let t = 0; t < 6; t++) {
        const x = c.x + rng.int(-r, r);
        const y = c.y + rng.int(-r, r);
        if (f.cells[y * f.cols + x] === FLOOR) {
          pack.target = cellCentre(f, { x, y });
          break;
        }
      }
    }
  }
}
