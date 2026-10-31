/**
 * Party roles underground (R0167, DUNG-27): each party Nubbin gets one of Fetch, Fight,
 * Light, Scout or Swim, picked from its best stat and its personality, and the Keeper may
 * change it with a tap at the cave mouth (`world.hollow.roles`). The roles work through the
 * hooks the Hollow already has:
 * - Fetch: a wider fetch radius (4 u + Run level / 10).
 * - Fight: walks at the front of the party, so it leads the bouts.
 * - Light: the explored mask opens 2 cells wider round the Keeper.
 * - Scout: calls out an idle pack with a "!" before it notices the party.
 * - Swim: the only one who fetches loot on an island (dry ground the Keeper cannot walk to).
 * A Lazy Nubbin only fetches close by, whatever its role.
 *
 * Pure sim: no DOM.
 */
import { PARTY_R8 } from '../config/dungeon-party-r8';
import { DUNGEON } from '../config/tuning';
import { cellOf, FLOOR, type Floor } from './dungeon';
import { friendFetch } from './dungeon-friends';
import { levelOf } from './stats';
import type { DungeonRun, HollowRole, Nubbin, SimEvent, StatKey, World } from './types';

export const ROLES: readonly HollowRole[] = ['fetch', 'fight', 'light', 'scout', 'swim'];

const STATS: readonly StatKey[] = ['swim', 'fly', 'run', 'power', 'stamina'];

/** The role a Nubbin takes on its own: its best stat, with Mischievous ones scouting. */
export function autoRole(n: Nubbin): HollowRole {
  if (n.personality === 'mischievous') return 'scout';
  const best = STATS.reduce((a, b) =>
    levelOf(n.stats[b].points) > levelOf(n.stats[a].points) ? b : a,
  );
  switch (best) {
    case 'swim':
      return 'swim';
    case 'fly':
      return 'light';
    case 'power':
      return 'fight';
    case 'run':
      return levelOf(n.stats.run.points) >= PARTY_R8.roles.scout.minRun ? 'scout' : 'fetch';
    default:
      return 'fetch';
  }
}

/** The role in play: the Keeper's pick if there is one, else the automatic one. */
export function roleOf(world: World, n: Nubbin): HollowRole {
  return world.hollow.roles?.[n.id] ?? autoRole(n);
}

/** Sets (or, with null, clears) a hand-picked role. */
export function setHollowRole(world: World, id: string, role: HollowRole | null): void {
  if (!world.nubbins.some((n) => n.id === id)) return;
  if (role !== null && !ROLES.includes(role)) return;
  const roles = (world.hollow.roles ??= {});
  if (role === null) delete roles[id];
  else roles[id] = role;
}

/** How many may come: 3, and 4 once Act II's boss has fallen. */
export function hollowPartySize(world: World): number {
  const S = PARTY_R8.size;
  return world.hollow.acts[S.bigAfterAct]?.bossDefeated ? S.big : S.base;
}

function partyNubbins(world: World, run: DungeonRun): Nubbin[] {
  return run.party
    .map((id) => world.nubbins.find((n) => n.id === id))
    .filter((n): n is Nubbin => !!n);
}

function hasRole(world: World, run: DungeonRun, role: HollowRole): boolean {
  return partyNubbins(world, run).some((n) => roleOf(world, n) === role);
}

/** Light: extra explore radius in cells. */
export function lightBonus(world: World, run: DungeonRun): number {
  return hasRole(world, run, 'light') ? PARTY_R8.roles.light.explore : 0;
}

/** How far (u) this Nubbin goes for loot. */
export function fetchRadiusOf(world: World, n: Nubbin): number {
  if (n.personality === 'lazy') return Math.min(DUNGEON.fetchRadius, PARTY_R8.roles.lazyFetch);
  // R0181 (round 9): a friend with the fetch aura sends everyone a little further.
  const aura = friendFetch(world);
  if (roleOf(world, n) !== 'fetch') return DUNGEON.fetchRadius + aura;
  const F = PARTY_R8.roles.fetch;
  return DUNGEON.fetchRadius + aura + Math.min(F.maxExtra, levelOf(n.stats.run.points) / F.runPer);
}

// ---------------------------------------------------------------- islands (Swim)

const regions = new WeakMap<Floor, Int32Array>();

/** Dry ground split into pieces joined by dry ground (4-neighbour); -1 for everything else. */
export function dryRegions(f: Floor): Int32Array {
  const hit = regions.get(f);
  if (hit) return hit;
  const out = new Int32Array(f.cells.length).fill(-1);
  const queue = new Int32Array(f.cells.length);
  let label = 0;
  for (let i = 0; i < f.cells.length; i++) {
    if (f.cells[i] !== FLOOR || out[i] !== -1) continue;
    let head = 0;
    let tail = 0;
    queue[tail++] = i;
    out[i] = label;
    while (head < tail) {
      const c = queue[head++]!;
      const x = c % f.cols;
      const y = (c - x) / f.cols;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= f.cols || ny >= f.rows) continue;
        const j = ny * f.cols + nx;
        if (f.cells[j] !== FLOOR || out[j] !== -1) continue;
        out[j] = label;
        queue[tail++] = j;
      }
    }
    label++;
  }
  regions.set(f, out);
  return out;
}

/** Loot on dry ground the Keeper's own ground does not reach: an island. */
export function onIsland(world: World, f: Floor, cell: { x: number; y: number }): boolean {
  const r = dryRegions(f);
  const k = cellOf(f, world.keeper.pos);
  const mine = r[k.y * f.cols + k.x] ?? -1;
  const there = r[cell.y * f.cols + cell.x] ?? -1;
  return mine !== -1 && there !== -1 && mine !== there;
}

/** Whether this Nubbin may go for loot on `cell`: islands are for Swim Nubbins only. */
export function mayFetch(world: World, f: Floor, n: Nubbin, cell: { x: number; y: number }) {
  return roleOf(world, n) === 'swim' || !onIsland(world, f, cell);
}

// ---------------------------------------------------------------- Fight and Scout

/** Fight Nubbins first, so they lead the walk and the bouts; the rest keep their order. */
export function leadFirst(world: World, party: readonly string[]): string[] {
  const fight = (id: string) => {
    const n = world.nubbins.find((x) => x.id === id);
    return n && roleOf(world, n) === 'fight' ? 0 : 1;
  };
  return [...party].sort((a, b) => fight(a) - fight(b));
}

/** Scout: an idle pack within reach gets a "!" (once), before it notices the party. */
export function stepScout(world: World, run: DungeonRun, events: SimEvent[]): void {
  if (!run.packs?.length) return;
  const scout = partyNubbins(world, run).find((n) => roleOf(world, n) === 'scout');
  if (!scout) return;
  const reach = PARTY_R8.roles.scout.noticeCells * DUNGEON.cell;
  const k = world.keeper.pos;
  for (const p of run.packs) {
    if (p.state !== 'idle' || p.asleep) continue;
    if (run.scouted?.includes(p.id)) continue;
    if (Math.hypot(p.pos.x - k.x, p.pos.z - k.z) > reach) continue;
    (run.scouted ??= []).push(p.id);
    events.push({ kind: 'scoutSpotted', packId: p.id, nubbinId: scout.id });
  }
}
