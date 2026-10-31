/**
 * Named sets and uniques (R0172, DUNG-29; lane B round 8). A Set-tier roll becomes one of the
 * six sets' pieces, and a Legendary roll is one of the twenty uniques half the time; both come
 * from the ordinary rarity roll, so every piece drops on Cosy too. Set bonuses count the pieces
 * worn by the Keeper and the Nubbins together (a household's set): the Keeper's stats get every
 * active bonus, and a Nubbin's stats get the bonuses of sets it wears a piece of. The collection
 * log (`gear.found`) keeps where each piece first turned up. Pure sim, seeded from the piece.
 */
import { ACTS } from '../config/dungeon-acts';
import { SET_PIECES, SETS, UNIQUE_ITEMS, UNIQUE_SHARE } from '../config/dungeon-items-r8';
import type { GearStat } from '../config/dungeon-loot';
import { Rng } from './rng';
import type { GearItem, GearState, World } from './types';

/** Every set piece and unique id, for the log's count. */
export function collectibleIds(): string[] {
  return [...SET_PIECES.map((p) => p.id), ...UNIQUE_ITEMS.map((u) => u.id)];
}

/** Where a find happened, as a short code the log words (`act:depth`, `grove`, `barrow`). */
export function findSource(world: World): string {
  const run = world.dungeon;
  if (run && world.location === 'dungeon')
    return run.act !== undefined ? `${run.act}:${run.depth}` : `d:${run.depth}`;
  return 'grove';
}

export function noteFound(world: World, item: GearItem, source = findSource(world)): void {
  const id = item.setPiece ?? item.unique;
  if (!id || !world.gear) return;
  const found = (world.gear.found ??= {});
  found[id] ??= source;
}

/**
 * Turns a fresh Set or Legendary piece into a named one: a set piece (always, for Set) or a
 * unique (`UNIQUE_SHARE` of Legendaries). `exclude` keeps owned pieces out (the wheelbarrow).
 */
export function makeSpecial(item: GearItem, seed: string, exclude: string[] = []): GearItem {
  const rng = Rng.fromSeed(`${seed}:${item.id}:special`);
  if (item.rarity === 'set') {
    const pool = SET_PIECES.filter((p) => !exclude.includes(p.id));
    if (!pool.length) return item;
    const p = rng.pick(pool);
    item.setPiece = p.id;
    item.slot = p.slot;
    item.base = p.slot;
    item.affixes = [];
  } else if (item.rarity === 'legendary' && rng.chance(UNIQUE_SHARE)) {
    const u = rng.pick(UNIQUE_ITEMS);
    item.unique = u.id;
    item.slot = u.slot;
    item.base = u.slot;
    item.affixes = [];
  }
  return item;
}

function wornItems(g: GearState, nubbinId?: string): GearItem[] {
  const wear = nubbinId === undefined ? g.keeper : g.nubbins[nubbinId];
  return Object.values(wear ?? {})
    .map((id) => g.items.find((x) => x.id === id))
    .filter((x): x is GearItem => !!x);
}

/** Pieces of each set worn by anyone in the household. */
export function setCounts(world: World): Record<string, number> {
  const g = world.gear;
  const out: Record<string, number> = {};
  if (!g) return out;
  const all = [...wornItems(g), ...Object.keys(g.nubbins).flatMap((id) => wornItems(g, id))];
  const seen = new Set<string>();
  for (const it of all) {
    const piece = SET_PIECES.find((p) => p.id === it.setPiece);
    if (!piece || seen.has(piece.id)) continue;
    seen.add(piece.id);
    out[piece.set] = (out[piece.set] ?? 0) + 1;
  }
  return out;
}

/** The set bonuses `stat` gets: all active ones for the Keeper, a Nubbin's own sets for it. */
export function setBonus(world: World, stat: GearStat, nubbinId?: string): number {
  const g = world.gear;
  if (!g) return 0;
  const counts = setCounts(world);
  const mine =
    nubbinId === undefined
      ? null
      : new Set(
          wornItems(g, nubbinId)
            .map((it) => SET_PIECES.find((p) => p.id === it.setPiece)?.set)
            .filter(Boolean),
        );
  let sum = 0;
  for (const set of SETS) {
    const n = counts[set.id] ?? 0;
    if (!n || (mine && !mine.has(set.id))) continue;
    for (const b of set.bonuses) if (n >= b.at && b.stat === stat) sum += b.value;
  }
  return sum;
}

/** Ids owned now (satchel, stash): the wheelbarrow's set swap never gives one of these. */
export function ownedSpecials(g: GearState): string[] {
  return [...g.items, ...(g.stash ?? [])]
    .map((x) => x.setPiece ?? x.unique)
    .filter((x): x is string => !!x);
}

/** The log's line for a source code. */
export function sourceParts(
  code: string,
): { act: string | null; depth: number } | 'grove' | 'barrow' {
  if (code === 'grove' || code === 'barrow') return code;
  const [a, d] = code.split(':');
  return { act: a === 'd' ? null : (ACTS[Number(a)]?.id ?? null), depth: Number(d) || 0 };
}
