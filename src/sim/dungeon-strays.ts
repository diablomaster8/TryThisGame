/**
 * Strays as a small chase rather than a tax (R0162, DUNG-22). A stray that snatches Shells
 * drops them one by one as it flees, so running after it gets them back; it snatches at most
 * twice on a floor, never in the arrival grace or a fight, and a party Nubbin can chase one
 * off for a little energy. Once seen, a stray shows on the automap. Feeding one a fruit still
 * recruits it (`feedStray` in dungeon.ts).
 */
import { DUNGEON, HOLLOW } from '../config/tuning';
import { createBattle, type BattleContext } from './battle';
import { cellOf, isExplored, type Floor } from './dungeon';
import { HOLLOW_BATTLE_SOURCE } from './dungeon-encounters';
import type { DungeonRun, DungeonStray, SimEvent, World } from './types';
import { HOLLOW_R6 } from '../config/tuning-dungeon';
import { Rng } from './rng';
import { HAT_IDS } from './shop';

const S = HOLLOW.strays;

/** Whether this stray may snatch now (outside the grace, under its cap, not shooed). */
export function maySnatch(s: DungeonStray, settling: boolean): boolean {
  return !settling && !s.shooed && (s.snatches ?? 0) < S.maxSnatches;
}

/** The snatch itself: the Shells go with the stray, to be dropped as it runs. */
export function snatch(world: World, run: DungeonRun, s: DungeonStray, events: SimEvent[]): void {
  const shells = Math.min(world.inventory.shells, DUNGEON.straySnatch);
  world.inventory.shells -= shells;
  run.haul.shells = Math.max(0, run.haul.shells - shells);
  s.cooldownMs = DUNGEON.strayCooldownMs;
  s.snatches = (s.snatches ?? 0) + 1;
  s.carrying = (s.carrying ?? 0) + shells;
  events.push({ kind: 'strayStartled', shells });
}

/**
 * One step of a stray's trail and sightings: a fleeing stray drops a Shell every
 * `dropEveryMs`, and one within sight of the Keeper (on an explored cell) is marked seen.
 */
export function stepStray(
  world: World,
  run: DungeonRun,
  f: Floor,
  s: DungeonStray,
  dtMs: number,
): void {
  const c = cellOf(f, s.pos);
  if (!s.seen && isExplored(run, f, c.x, c.y)) {
    const k = world.keeper.pos;
    if (Math.hypot(s.pos.x - k.x, s.pos.z - k.z) <= S.seeRadius) s.seen = true;
  }
  if (!s.carrying) return;
  const t = (dropClock.get(s) ?? 0) + dtMs;
  // One Shell every `dropEveryMs`; a stray about to stop fleeing drops the rest.
  const all = s.cooldownMs <= S.dropEveryMs;
  if (t < S.dropEveryMs && !all) {
    dropClock.set(s, t);
    return;
  }
  dropClock.set(s, 0);
  const trail = (run.shellTrail ??= []);
  for (let n = all ? s.carrying : 1; n > 0; n--) {
    s.carrying -= 1;
    trail.push({ id: `${s.id}-${s.snatches ?? 0}-${s.carrying}`, x: s.pos.x, z: s.pos.z });
  }
}

// Time since a fleeing stray last dropped a Shell; runtime only (a reload restarts it).
const dropClock = new WeakMap<DungeonStray, number>();

/** The Keeper walks over dropped Shells and picks them up. */
export function pickTrail(world: World, run: DungeonRun, events: SimEvent[]): void {
  const trail = run.shellTrail;
  if (!trail?.length) return;
  const k = world.keeper.pos;
  for (let i = trail.length - 1; i >= 0; i--) {
    const t = trail[i]!;
    if (Math.hypot(t.x - k.x, t.z - k.z) > DUNGEON.pickupRadius) continue;
    trail.splice(i, 1);
    world.inventory.shells += 1;
    run.haul.shells += 1;
    events.push({ kind: 'trailShell' });
  }
}

/**
 * Shoo a stray: the liveliest party Nubbin with the energy for it chases the stray away.
 * It flees and never snatches again on this floor. False when no Nubbin can.
 */
export function shooStray(world: World, run: DungeonRun, id: string, events: SimEvent[]): boolean {
  const s = run.strays.find((x) => x.id === id);
  if (!s || s.shooed) return false;
  const chaser = run.party
    .map((pid) => world.nubbins.find((n) => n.id === pid))
    .filter((n) => !!n && n.stage !== 'egg' && n.stage !== 'cocoon')
    .filter((n) => n!.needs.energy >= S.shooEnergy)
    .sort((a, b) => b!.needs.energy - a!.needs.energy)[0];
  if (!chaser) return false;
  chaser.needs.energy -= S.shooEnergy;
  s.shooed = true;
  s.cooldownMs = DUNGEON.strayCooldownMs;
  s.target = null;
  events.push({ kind: 'strayShooed', by: chaser.id });
  return true;
}

// ---------------------------------------------------------------- the stray's choice (R0281)

const C = HOLLOW.strayChoice;

/**
 * A stray that bumps the Keeper asks first: it holds still for `askMs` while the bar offers
 * Calm it (a befriend-only bout) or a snack (`feedStray`). Ignored, it snatches as before.
 * Returns true while this stray is asking (the caller keeps it still).
 */
export function stepStrayAsk(
  world: World,
  run: DungeonRun,
  s: DungeonStray,
  touching: boolean,
  dtMs: number,
  events: SimEvent[],
): boolean {
  const ask = run.strayAsk;
  if (ask && ask.id === s.id) {
    ask.leftMs -= dtMs;
    if (ask.leftMs > 0) return true;
    delete run.strayAsk;
    if (world.inventory.shells > 0) snatch(world, run, s, events);
    return false;
  }
  if (!touching || ask) return false;
  run.strayAsk = { id: s.id, leftMs: C.askMs };
  events.push({ kind: 'strayAsk', id: s.id });
  return true;
}

/**
 * Who can calm a stray: the party's hatched Nubbins, else (a party left at home, or all eggs)
 * any hatched Nubbin, as lane C's rumble slice picks. Empty when nobody can.
 */
export function calmers(world: World, run: DungeonRun): string[] {
  const ok = (id: string) => {
    const n = world.nubbins.find((x) => x.id === id);
    return !!n && n.stage !== 'egg' && n.stage !== 'cocoon';
  };
  const party = run.party.filter(ok);
  return party.length ? party : world.nubbins.map((n) => n.id).filter(ok);
}

/** Calm it: a singles, befriend-only bout against the stray (lane C's turn core). */
export function calmStray(world: World, id: string, events: SimEvent[]): boolean {
  const run = world.dungeon;
  const s = run?.strays.find((x) => x.id === id);
  if (!run || !s || run.strayBout || run.encounter || (world.battle && !world.battle.result))
    return false;
  const ids = calmers(world, run);
  if (!ids.length) return false;
  const context: BattleContext = {
    kind: 'encounter',
    tier: Math.max(1, Math.min(3, Math.ceil(run.depth / 3))),
    ids: ids.slice(0, 1),
    source: HOLLOW_BATTLE_SOURCE,
    key: `stray:${id}`,
    singles: true,
    foes: [{ species: 'chao', level: C.level + run.depth * C.perDepth, shadow: true }],
  };
  const bout = createBattle(world, context, (run.seed ^ Math.imul(run.depth + 7, 977)) >>> 0);
  if (!bout) return false;
  world.battleRuns = (world.battleRuns ?? 0) + 1;
  world.battle = bout;
  delete run.strayAsk;
  run.strayBout = {
    id,
    bout: world.battleRuns,
    shells: Math.min(world.inventory.shells, DUNGEON.straySnatch),
  };
  world.keeper.moveTarget = null;
  world.keeper.intent = null;
  events.push({ kind: 'battleStart', context: 'encounter' });
  return true;
}

/**
 * The calm bout's end (`battleEnd` among `fresh`): a calmed stray goes home and pays back
 * `payback` times what it would have taken; otherwise it snatches as it would have.
 */
export function strayBoutEnded(world: World, fresh: SimEvent[], events: SimEvent[]): void {
  const run = world.dungeon;
  const bout = run?.strayBout;
  if (!run || !bout) return;
  for (const e of fresh) {
    if (e.kind !== 'battleEnd' || e.source !== HOLLOW_BATTLE_SOURCE || e.key !== `stray:${bout.id}`)
      continue;
    delete run.strayBout;
    const s = run.strays.find((x) => x.id === bout.id);
    const ok = e.winner === 0 || e.reason === 'hug' || e.reason === 'friends';
    if (ok) {
      const shells = Math.round(Math.max(1, bout.shells) * C.payback);
      world.inventory.shells += shells;
      run.haul.shells += shells;
      run.strays = run.strays.filter((x) => x.id !== bout.id);
      events.push({ kind: 'strayCalmed', ok: true, shells });
      kingHat(world, s, events);
    } else {
      if (s && world.inventory.shells > 0) snatch(world, run, s, events);
      events.push({ kind: 'strayCalmed', ok: false, shells: 0 });
    }
    return;
  }
}

/**
 * True while the calm bout is on. One that ended without passing through a command (a timed
 * turn) is booked here from its result; one that went missing lets the floor move again.
 */
export function strayBoutLive(world: World, run: DungeonRun, events: SimEvent[]): boolean {
  const b = run.strayBout;
  if (!b) return false;
  const live = world.battle;
  const mine = !!live && (world.battleRuns ?? 0) === b.bout;
  if (mine && !live.result) return true;
  if (mine && live.result) {
    const r = live.result;
    const key = `stray:${b.id}`;
    strayBoutEnded(
      world,
      [
        {
          kind: 'battleEnd',
          context: 'encounter',
          source: HOLLOW_BATTLE_SOURCE,
          key,
          winner: r.winner,
          reason: r.reason,
          shells: 0,
        },
      ],
      events,
    );
  }
  delete run.strayBout;
  return false;
}

/**
 * R0326: one stray in `HOLLOW_R6.strayKingOneIn` is a Stray King, seeded by the run, the level
 * and the stray (never the roster). Calming or feeding it leaves a hat the Keeper lacks.
 */
export function isStrayKing(seed: number, depth: number, id: string): boolean {
  return Rng.fromSeed(`${seed}:${depth}:${id}:king`).int(1, HOLLOW_R6.strayKingOneIn) === 1;
}

export function kingHat(world: World, s: DungeonStray | undefined, events: SimEvent[]): void {
  if (!s?.king) return;
  const hats = HAT_IDS.filter((h) => !world.inventory.hats.includes(h));
  if (!hats.length) return;
  const hat = Rng.fromSeed(`${s.id}:${world.dungeon?.seed ?? 0}:crown`).pick(hats);
  world.inventory.hats.push(hat);
  events.push({ kind: 'strayKing', hat });
}
