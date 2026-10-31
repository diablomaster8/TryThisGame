/**
 * The Gardener's Wheelbarrow (R0177, DUNG-34; lane B round 8), after D2's Horadric Cube. It
 * stands at the act camps' crafting table once the Act II quest is done (or that act's boss is
 * beaten). Up to six things go in (satchel pieces, pouch charms, essences, keys) and "Mix!"
 * checks the recipes in order; the first that matches exactly takes its inputs and gives its
 * result, and the recipe goes in the book. A mix that matches nothing takes nothing: the
 * barrow simply tips everything back out. Pure sim, seeded.
 */
import { CHARM_GRADES, WHEELBARROW, type KeyId, type RecipeId } from '../config/dungeon-items-r8';
import { AFFIXES, RARITIES, type GearSlot } from '../config/dungeon-loot';
import { CRITTER_SPECIES } from './critters';
import { addCharm, charmKey, parseCharm, takeCharm } from './dungeon-charms';
import { mooRecipeReady } from './dungeon-secret-levels';
import { makeSpecial, noteFound, ownedSpecials } from './dungeon-sets';
import { ensureGear, keepGear, rollGear, unequipGear } from './gear';
import type { Rng } from './rng';
import type { BarrowSlot, GearItem, GearState, NubbinType, SimEvent, World } from './types';

export function wheelbarrowOpen(world: World): boolean {
  const a = WHEELBARROW.unlockAct;
  return world.hollow.camp.questsPaid.includes(a) || world.hollow.acts[a]?.bossDefeated === true;
}

export interface MixResult {
  ok: boolean;
  recipe?: RecipeId;
  /** A new or changed piece, a charm key, a critter id, or 'pillow-fort'. */
  out?: string;
}

interface Sorted {
  items: GearItem[];
  charms: string[];
  essences: NubbinType[];
  keys: string[];
}

/** Checks the slots are really there (enough of each, no piece twice) and sorts them. */
function sortSlots(world: World, g: GearState, slots: readonly BarrowSlot[]): Sorted | null {
  if (!slots.length || slots.length > WHEELBARROW.slots) return null;
  const out: Sorted = { items: [], charms: [], essences: [], keys: [] };
  for (const s of slots) {
    if (s.kind === 'item') {
      const it = g.items.find((x) => x.id === s.id);
      if (!it || out.items.includes(it)) return null;
      out.items.push(it);
    } else if (s.kind === 'charm') {
      if (!parseCharm(s.key)) return null;
      out.charms.push(s.key);
    } else if (s.kind === 'essence') out.essences.push(s.type);
    else out.keys.push(s.id);
  }
  const need = (list: string[], have: (k: string) => number) =>
    [...new Set(list)].every((k) => have(k) >= list.filter((x) => x === k).length);
  if (!need(out.charms, (k) => g.charms?.[k] ?? 0)) return null;
  if (!need(out.essences, (k) => world.inventory.essences[k as NubbinType] ?? 0)) return null;
  if (!need(out.keys, (k) => g.keys?.[k] ?? 0)) return null;
  return out;
}

const only = (s: Sorted, kinds: Partial<Record<keyof Sorted, number>>) =>
  (Object.keys(s) as Array<keyof Sorted>).every((k) => s[k].length === (kinds[k] ?? 0));

function dropItem(g: GearState, world: World, it: GearItem): void {
  unequipGear(world, it.id);
  g.items.splice(g.items.indexOf(it), 1);
}

function rerollAffixes(it: GearItem, rng: Rng): void {
  const def = RARITIES.find((r) => r.id === it.rarity)!;
  const n = rng.int(def.affixes[0], def.affixes[1]);
  const pool = [...AFFIXES];
  it.affixes = [];
  for (let i = 0; i < n && pool.length; i++) {
    const a = pool.splice(rng.int(0, pool.length - 1), 1)[0]!;
    it.affixes.push({
      id: a.id,
      value: Math.round((a.value + a.perLevel * (it.level - 1)) * 100) / 100,
    });
  }
}

/** Mixes what is in the barrow. On no match nothing is taken (`ok: false`). */
export function mixWheelbarrow(
  world: World,
  slots: readonly BarrowSlot[],
  rng: Rng,
  events: SimEvent[],
): MixResult {
  const g = ensureGear(world);
  const s = wheelbarrowOpen(world) ? sortSlots(world, g, slots) : null;
  const res = s ? match(world, g, s, rng) : { ok: false };
  if (res.ok && res.recipe) {
    const book = (g.recipes ??= []);
    if (!book.includes(res.recipe)) book.push(res.recipe);
    events.push({
      kind: 'hollowItems',
      what: res.recipe === 'pillow-fort' ? 'fort' : res.recipe === 'moo-meadow' ? 'moo' : 'mix',
      id: res.recipe,
    });
  } else events.push({ kind: 'hollowItems', what: 'noMix', id: '' });
  return res;
}

function match(world: World, g: GearState, s: Sorted, rng: Rng): MixResult {
  const charms = s.charms.map((k) => parseCharm(k)!);
  // 3 charms of one kind and grade → 1 of the next grade.
  if (only(s, { charms: 3 }) && new Set(s.charms).size === 1 && charms[0]!.grade < CHARM_GRADES) {
    takeCharm(g, s.charms[0]!, 3);
    const up = charmKey(charms[0]!.type, charms[0]!.grade + 1);
    addCharm(g, up);
    return { ok: true, recipe: 'charm-up', out: up };
  }
  // 3 Shiny pieces of one slot → 1 Fancy piece of that slot.
  if (
    only(s, { items: 3 }) &&
    s.items.every((x) => x.rarity === 'shiny' && x.slot === s.items[0]!.slot)
  ) {
    const level = Math.max(...s.items.map((x) => x.level));
    const slot = s.items[0]!.slot as GearSlot;
    s.items.forEach((x) => dropItem(g, world, x));
    const made = rollGear(world, rng, level, 0, 'fancy', slot);
    keepGear(world, made);
    return { ok: true, recipe: 'shiny-to-fancy', out: made.id };
  }
  // 1 Fancy piece + 1 perfect charm → new affixes.
  if (
    only(s, { items: 1, charms: 1 }) &&
    s.items[0]!.rarity === 'fancy' &&
    charms[0]!.grade === CHARM_GRADES
  ) {
    takeCharm(g, s.charms[0]!);
    rerollAffixes(s.items[0]!, rng);
    return { ok: true, recipe: 'reroll', out: s.items[0]!.id };
  }
  // 1 Plain piece + 3 Acorns → 1 more socket (up to three).
  if (
    only(s, { items: 1, charms: 3 }) &&
    s.items[0]!.rarity === 'plain' &&
    (s.items[0]!.sockets ?? 0) < 3 &&
    charms.every((c) => c.type === 'acorn')
  ) {
    s.charms.forEach((k) => takeCharm(g, k));
    const it = s.items[0]!;
    it.sockets = (it.sockets ?? 0) + 1;
    return { ok: true, recipe: 'add-socket', out: it.id };
  }
  // 6 essences of one type → 1 critter of that type.
  if (only(s, { essences: 6 }) && new Set(s.essences).size === 1) {
    const type = s.essences[0]!;
    const pool = CRITTER_SPECIES.filter((c) => c.type === type);
    if (pool.length) {
      world.inventory.essences[type] = (world.inventory.essences[type] ?? 0) - 6;
      const c = rng.pick(pool).id;
      world.inventory.critters[c] = (world.inventory.critters[c] ?? 0) + 1;
      return { ok: true, recipe: 'essence-critter', out: c };
    }
  }
  // 1 set piece + 3 perfect charms → a set piece not owned.
  if (
    only(s, { items: 1, charms: 3 }) &&
    s.items[0]!.setPiece &&
    charms.every((c) => c.grade === CHARM_GRADES)
  ) {
    const owned = ownedSpecials(g);
    const old = s.items[0]!;
    const made = rollGear(world, rng, old.level, 0, 'set');
    if (made.setPiece && owned.includes(made.setPiece))
      makeSpecial(made, `${world.seed}:barrow`, owned);
    if (made.setPiece && !owned.includes(made.setPiece)) {
      s.charms.forEach((k) => takeCharm(g, k));
      dropItem(g, world, old);
      noteFound(world, made, 'barrow');
      keepGear(world, made);
      return { ok: true, recipe: 'set-swap', out: made.id };
    }
    g.next -= 1; // every set piece is owned: the roll is undone and the mix tips back out
  }
  // The three keys → the Pillow Fort.
  const want: KeyId[] = ['giggles', 'yawns', 'brrr'];
  if (only(s, { keys: 3 }) && want.every((k) => s.keys.includes(k))) {
    for (const k of want) g.keys![k] = (g.keys![k] ?? 0) - 1;
    g.pillowFort = 'open';
    return { ok: true, recipe: 'pillow-fort', out: 'pillow-fort' };
  }
  // Lane B r9 (R0189): Gran's Teaspoon + a milk bell → the Moo Meadow's portal, once a trip.
  if (
    only(s, { keys: 2 }) &&
    s.keys.includes('teaspoon') &&
    s.keys.includes('bell') &&
    mooRecipeReady(world)
  ) {
    g.keys!.teaspoon = (g.keys!.teaspoon ?? 0) - 1;
    g.keys!.bell = (g.keys!.bell ?? 0) - 1;
    g.mooMeadow = 'open';
    return { ok: true, recipe: 'moo-meadow', out: 'moo-meadow' };
  }
  return { ok: false };
}
