/**
 * Charms in sockets (R0173, DUNG-30; lane B round 8): a simplified take on D2's runes and gems.
 * Eight charm kinds in three grades ride loose in the charm pouch (`gear.charms`, keyed
 * `type:grade`) and click into the sockets of Plain and Shiny pieces. A charm in a Keeper piece
 * gives a Keeper stat, in a Nubbin piece a Nubbin one; the exact order of a Charm Chain in a
 * piece of the chain's slot with exactly that many sockets makes a named piece with a bonus.
 * Taking charms out is free and sends them back to the pouch. The uniques' fixed stats are read
 * here too, so `gearStat` has one place for everything an item adds beyond its base and affixes.
 * Pure sim, seeded: socket counts and charm drops use streams derived from their own seeds, so
 * the main drop rolls are untouched.
 */
import {
  CHAINS,
  CHARM_GRADES,
  CHARM_TYPES,
  CHARMS,
  SOCKETS,
  UNIQUE_ITEMS,
  type CharmType,
} from '../config/dungeon-items-r8';
import { KEEPER_SLOTS, type GearStat } from '../config/dungeon-loot';
import { Rng } from './rng';
import type { GearItem, GearState, SimEvent, World } from './types';

export function charmKey(type: CharmType, grade: number): string {
  return `${type}:${grade}`;
}

export function parseCharm(key: string): { type: CharmType; grade: number } | null {
  const [type, g] = key.split(':');
  const grade = Number(g);
  if (!CHARM_TYPES.includes(type as CharmType) || !(grade >= 1 && grade <= CHARM_GRADES))
    return null;
  return { type: type as CharmType, grade };
}

function pouch(g: GearState): Record<string, number> {
  return (g.charms ??= {});
}

export function addCharm(g: GearState, key: string, n = 1): void {
  const p = pouch(g);
  p[key] = (p[key] ?? 0) + n;
}

/** Takes `n` of a charm from the pouch; false (and nothing taken) when there are too few. */
export function takeCharm(g: GearState, key: string, n = 1): boolean {
  const p = pouch(g);
  if ((p[key] ?? 0) < n) return false;
  p[key]! -= n;
  if (p[key] === 0) delete p[key];
  return true;
}

/** Sockets for a new piece: 0-3 on Plain and Shiny, from a stream seeded by the piece. */
export function rollSockets(item: GearItem, seed: string): number {
  if (item.rarity !== 'plain' && item.rarity !== 'shiny') return 0;
  const rng = Rng.fromSeed(`${seed}:${item.id}:sockets`);
  const w = SOCKETS.weights;
  let roll = rng.next() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < w.length; i++) if ((roll -= w[i]!) < 0) return i;
  return 0;
}

/**
 * A charm drop beside a pack's table pick: its own chance per table, a stream derived from the
 * drop roll's state (not advancing it), and a mostly-chipped grade.
 */
export function rollCharmDrop(
  world: World,
  dropRng: Rng,
  tableId: string,
  events: SimEvent[],
): string | null {
  const chance = SOCKETS.dropChance[tableId] ?? 0;
  if (chance <= 0) return null;
  const rng = new Rng((dropRng.state ^ 0x5bd1e995) >>> 0);
  if (!rng.chance(chance)) return null;
  const type = rng.pick(CHARM_TYPES);
  const w = SOCKETS.gradeWeights;
  let roll = rng.next() * w.reduce((a, b) => a + b, 0);
  let grade = 1;
  for (let i = 0; i < w.length; i++)
    if ((roll -= w[i]!) < 0) {
      grade = i + 1;
      break;
    }
  const key = charmKey(type, grade);
  addCharm((world.gear ??= { items: [], keeper: {}, nubbins: {}, next: 1 }), key);
  events.push({ kind: 'hollowItems', what: 'charm', id: key });
  return key;
}

/** The chain the piece's charms spell, if they fill its sockets in a chain's exact order. */
export function chainFor(item: GearItem): string | undefined {
  const got = (item.socketed ?? []).map((k) => parseCharm(k)?.type);
  if (!got.length || got.length !== (item.sockets ?? 0)) return undefined;
  return CHAINS.find(
    (c) =>
      c.slot === item.slot &&
      c.order.length === got.length &&
      c.order.every((t, i) => t === got[i]),
  )?.id;
}

/** Puts a pouch charm into the next free socket; a finished chain names the piece. */
export function socketCharm(
  world: World,
  itemId: string,
  key: string,
  events: SimEvent[] = [],
): boolean {
  const g = world.gear;
  const item = g?.items.find((x) => x.id === itemId);
  if (!g || !item || !parseCharm(key)) return false;
  const used = item.socketed?.length ?? 0;
  if (used >= (item.sockets ?? 0) || !takeCharm(g, key)) return false;
  (item.socketed ??= []).push(key);
  const chain = chainFor(item);
  if (chain) {
    item.chain = chain;
    events.push({ kind: 'hollowItems', what: 'chain', id: chain });
  }
  return true;
}

/** Takes every charm out (free, cosy): back to the pouch, and any chain comes undone. */
export function unsocketCharms(world: World, itemId: string): boolean {
  const g = world.gear;
  const item = g?.items.find((x) => x.id === itemId) ?? g?.stash?.find((x) => x.id === itemId);
  if (!g || !item?.socketed?.length) return false;
  for (const k of item.socketed) addCharm(g, k);
  delete item.socketed;
  delete item.chain;
  return true;
}

/**
 * What a worn piece adds to `stat` beyond its base and affixes: its charms (by wearer: the
 * Keeper's slots read the Keeper side), its chain's bonus, and a unique's fixed stats.
 */
export function itemExtraStat(item: GearItem, stat: GearStat): number {
  let sum = 0;
  const keeperPiece = (KEEPER_SLOTS as readonly string[]).includes(item.slot);
  for (const k of item.socketed ?? []) {
    const c = parseCharm(k);
    if (!c) continue;
    const eff = keeperPiece ? CHARMS[c.type].keeper : CHARMS[c.type].nubbin;
    if (eff.stat === stat) sum += eff.value * c.grade;
  }
  if (item.chain)
    for (const b of CHAINS.find((c) => c.id === item.chain)?.bonus ?? [])
      if (b.stat === stat) sum += b.value;
  if (item.unique)
    for (const s of UNIQUE_ITEMS.find((u) => u.id === item.unique)?.stats ?? [])
      if (s.stat === stat) sum += s.value;
  return sum;
}
