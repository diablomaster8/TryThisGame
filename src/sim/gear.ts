/**
 * Hollow loot and gear (R0163, R0164; DUNG-23, DUNG-24). Packs roll a drop table when they are
 * beaten; gear rolls a rarity (magic find pushes the odds up, with diminishing returns for the
 * rarest tiers), a base for one of the slots, and affixes scaled by item level. The Keeper
 * wears five slots and each Nubbin three; `gearStat` sums what is worn, and the Hollow reads it
 * for pickup reach, sight, Shells per pickup and magic find. Pure sim, seeded.
 */
import {
  AFFIXES,
  BASES,
  KEEPER_SLOTS,
  LOOT,
  LOOT_TABLES,
  NUBBIN_SLOTS,
  RARITIES,
  type DropEntry,
  type GearSlot,
  type GearStat,
  type RarityId,
} from '../config/dungeon-loot';
import { STASH } from '../config/dungeon-items-r8';
import { CRITTER_SPECIES } from './critters';
import { itemExtraStat, rollCharmDrop, rollSockets } from './dungeon-charms';
import { makeSpecial, noteFound, setBonus } from './dungeon-sets';
import { notePickup } from './dungeon-log';
import { fancyMul } from './dungeon-tiers';
import type { Rng } from './rng';
import type { GearItem, GearState, NubbinType, SimEvent, World } from './types';

export function ensureGear(world: World): GearState {
  return (world.gear ??= { items: [], keeper: {}, nubbins: {}, next: 1 });
}

/** The rarest tiers feel magic find through a knee: MF × knee / (MF + knee). */
export function effectiveMf(mf: number, rare: boolean): number {
  if (!rare || mf <= 0) return Math.max(0, mf);
  return (mf * LOOT.mfKnee) / (mf + LOOT.mfKnee);
}

/**
 * A gear rarity: the table's rates, with every tier above plain scaled up by magic find, and
 * Fancy or better by `fancyMul` too (R0179: a Brisk or Wild run).
 */
export function rollRarity(rng: Rng, mf = 0, fancyMul = 1): RarityId {
  const tiers = RARITIES.filter((r) => r.rate > 0);
  const up = tiers.slice(1).map((r) => {
    const rare = r.id === 'legendary' || r.id === 'set';
    const tier = rare || r.id === 'fancy' ? fancyMul : 1;
    return { id: r.id, rate: r.rate * tier * (1 + effectiveMf(mf, rare) / 100) };
  });
  const plain = Math.max(0, 1 - up.reduce((a, r) => a + r.rate, 0));
  let roll = rng.next() * (plain + up.reduce((a, r) => a + r.rate, 0));
  if ((roll -= plain) < 0) return 'plain';
  for (const r of up) if ((roll -= r.rate) < 0) return r.id;
  return up[up.length - 1]!.id;
}

const value = (v: number, per: number, level: number) =>
  Math.round((v + per * (level - 1)) * 100) / 100;

/** A new piece of gear at `level`; `rarity` fixes the tier (a charm, a boss's set piece). */
export function rollGear(
  world: World,
  rng: Rng,
  level: number,
  mf = 0,
  rarity?: RarityId,
  slot?: GearSlot,
): GearItem {
  const g = ensureGear(world);
  const tier = rarity ?? rollRarity(rng, mf, fancyMul(world.dungeon?.difficulty));
  const def = RARITIES.find((r) => r.id === tier)!;
  const bases = slot
    ? BASES.filter((b) => b.slot === slot)
    : tier === 'charm'
      ? BASES.filter((b) => b.slot === 'charm')
      : BASES;
  const base = rng.pick(bases);
  const n = rng.int(def.affixes[0], def.affixes[1]);
  const pool = [...AFFIXES];
  const affixes: GearItem['affixes'] = [];
  for (let i = 0; i < n && pool.length; i++) {
    const a = pool.splice(rng.int(0, pool.length - 1), 1)[0]!;
    affixes.push({ id: a.id, value: value(a.value, a.perLevel, level) });
  }
  const item: GearItem = {
    id: `g${g.next++}`,
    base: base.id,
    slot: base.slot,
    rarity: tier,
    level: Math.max(1, Math.round(level)),
    affixes,
  };
  // Lane B round 8: sockets (R0173) and named sets and uniques (R0172), each from a stream
  // seeded by the save and the piece, so the roll above is untouched.
  const sockets = rollSockets(item, String(world.seed));
  if (sockets > 0) item.sockets = sockets;
  makeSpecial(item, String(world.seed));
  noteFound(world, item);
  return item;
}

/**
 * Puts a piece in the satchel; past `LOOT.carry` the oldest unworn plain piece (else the
 * oldest unworn one) moves to the stash, so a find is never lost (R0174, lane B round 6).
 */
export function keepGear(world: World, item: GearItem): void {
  const g = ensureGear(world);
  g.items.push(item);
  if (g.items.length <= LOOT.carry) return;
  const worn = new Set(wornIds(g));
  let i = g.items.findIndex((x) => x.rarity === 'plain' && !worn.has(x.id));
  if (i < 0) i = g.items.findIndex((x) => !worn.has(x.id));
  if (i >= 0) depositStash(world, g.items.splice(i, 1)[0]!);
}

/** R0174: the stash's tab count: four, and one more per act boss's first win. */
export function stashTabCount(world: World): number {
  return Math.min(STASH.maxTabs, STASH.tabs + (world.hollow.bossChests?.length ?? 0));
}

/**
 * R0174: puts a piece in the stash, in the first tab with room (else the last tab, past its
 * size, so a piece is never lost).
 */
export function depositStash(world: World, item: GearItem): void {
  const stash = (ensureGear(world).stash ??= []);
  const tabs = stashTabCount(world);
  const used = new Array<number>(tabs).fill(0);
  for (const x of stash) used[Math.min(tabs - 1, x.tab ?? 0)]! += 1;
  const free = used.findIndex((n) => n < STASH.perTab);
  const tab = free < 0 ? tabs - 1 : free;
  if (tab > 0) item.tab = tab;
  else delete item.tab;
  stash.push(item);
}

/** A gear find: into the run's sack while underground (R0175), else into the satchel. */
export function stowGear(world: World, item: GearItem): void {
  const run = world.dungeon;
  if (run && world.location === 'dungeon') {
    (run.sack ??= []).push(item);
    notePickup(world, item.rarity);
  } else keepGear(world, item);
}

function wornIds(g: GearState): string[] {
  return [...Object.values(g.keeper), ...Object.values(g.nubbins).flatMap((s) => Object.values(s))];
}

/**
 * One roll of a drop table (`EncounterPack.reward`): gear and charms go to the satchel, the
 * rest straight to the inventory. Returns what dropped, for the toast.
 */
export function rollDrops(
  world: World,
  rng: Rng,
  tableId: string,
  level: number,
  events: SimEvent[],
): DropEntry[] {
  const table = LOOT_TABLES[tableId];
  if (!table) return [];
  const mf = gearStat(world, 'mf');
  const out: DropEntry[] = [];
  const total = table.noDrop + table.entries.reduce((a, e) => a + e.weight, 0);
  for (let p = 0; p < table.picks; p++) {
    let roll = rng.next() * total;
    if ((roll -= table.noDrop) < 0) continue;
    const e = table.entries.find((x) => (roll -= x.weight) < 0) ?? table.entries[0]!;
    out.push(e.item);
    if (e.item === 'gear' || e.item === 'charm') {
      const item = rollGear(world, rng, level, mf, e.item === 'charm' ? 'charm' : undefined);
      stowGear(world, item);
      events.push({ kind: 'gearFound', item });
    } else if (e.item === 'shells') {
      world.inventory.shells += 5 + level;
    } else if (e.item === 'essence') {
      const t = rng.pick(['swim', 'fly', 'run', 'power', 'normal'] as NubbinType[]);
      world.inventory.essences[t] = (world.inventory.essences[t] ?? 0) + 1;
    } else if (e.item === 'critter') {
      const c = rng.pick(CRITTER_SPECIES).id;
      world.inventory.critters[c] = (world.inventory.critters[c] ?? 0) + 1;
    }
  }
  // R0173: a socket charm now and then, beside the table's pick (its own stream).
  rollCharmDrop(world, rng, tableId, events);
  return out;
}

/**
 * Wear `itemId` (on the Keeper, or on Nubbin `nubbinId`): it takes its slot, whatever wore
 * it before goes back to the satchel. False when the slot does not fit the wearer.
 */
export function equipGear(world: World, itemId: string, nubbinId: string | null): boolean {
  const g = ensureGear(world);
  const item = g.items.find((x) => x.id === itemId);
  if (!item) return false;
  const slots = nubbinId ? NUBBIN_SLOTS : KEEPER_SLOTS;
  if (!(slots as readonly string[]).includes(item.slot)) return false;
  if (nubbinId && !world.nubbins.some((n) => n.id === nubbinId)) return false;
  unequipGear(world, itemId);
  const wear = nubbinId ? (g.nubbins[nubbinId] ??= {}) : g.keeper;
  wear[item.slot] = itemId;
  return true;
}

/** Takes a piece off whoever wears it. */
export function unequipGear(world: World, itemId: string): void {
  const g = ensureGear(world);
  for (const wear of [g.keeper, ...Object.values(g.nubbins)])
    for (const [slot, id] of Object.entries(wear)) if (id === itemId) delete wear[slot];
}

/** What the Keeper's worn gear (or a Nubbin's, with `nubbinId`) adds to `stat`. */
export function gearStat(world: World, stat: GearStat, nubbinId?: string): number {
  const g = world.gear;
  if (!g) return 0;
  const wear = nubbinId ? g.nubbins[nubbinId] : g.keeper;
  if (!wear) return 0;
  let sum = 0;
  for (const id of Object.values(wear)) {
    const item = g.items.find((x) => x.id === id);
    if (!item) continue;
    const base = BASES.find((b) => b.id === item.base);
    if (base?.stat === stat) sum += value(base.value, base.perLevel, item.level);
    for (const a of item.affixes)
      if (AFFIXES.find((d) => d.id === a.id)?.stat === stat) sum += a.value;
    // Lane B round 8: charms, chains and uniques (R0173, R0172).
    sum += itemExtraStat(item, stat);
  }
  // R0172: set bonuses, counted across the household.
  return sum + setBonus(world, stat, nubbinId);
}
