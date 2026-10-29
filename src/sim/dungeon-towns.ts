/**
 * Act camps (R0152, DUNG-12): each act's safe hub, read from the authored map in
 * `config/dungeon-zones.ts`. A camp is an ordinary Hollow `Floor` (`zone: 'town'`) with no
 * packs, strays, traps or shrines, so nothing can start a fight there. Its services stand on
 * open cells: the stash chest (the floor's chest, always shown open), the vendor, the
 * crafting table, the gamble stall, the hire board and the quest-giver, plus the waypoint
 * stone, the road home (stairs up) and the gate to the fields (stairs down).
 *
 * Working now: the stash (Shells kept safe from strays), the vendor (fruit and Homing
 * Acorns), the quest-giver (a one-time reward per act once its boss is beaten). Crafting,
 * gambling and hiring wait for their systems (DUNG-33, -34, -38); their keepers say so.
 *
 * Pure sim: no DOM.
 */
import { ACTS, actStartDepth } from '../config/dungeon-acts';
import { SERVICE_GLYPH, TOWN_CAST, TOWN_MAP, type ServiceKind } from '../config/dungeon-zones';
import { DUNGEON, HOLLOW, HOLLOW_ZONES } from '../config/tuning';
import {
  cellCentre,
  FLOOR,
  runFloor,
  WALL,
  WATER,
  type Cell,
  type Floor,
  type Service,
} from './dungeon';
import { buyAcorns } from './dungeon-travel';
import type { SimEvent, World } from './types';

const cache = new Map<number, Floor>();

/** Act `act`'s camp, built once from the map. */
export function townFloor(act: number): Floor {
  const hit = cache.get(act);
  if (hit) return hit;
  const rows = TOWN_MAP.length;
  const cols = TOWN_MAP[0]!.length;
  const cells = new Uint8Array(cols * rows);
  const at: Record<string, Cell> = {};
  const services: Service[] = [];
  const torches: Cell[] = [];
  const cast = TOWN_CAST[ACTS[act]!.id];
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const ch = TOWN_MAP[y]![x]!;
      cells[y * cols + x] = ch === '#' ? WALL : ch === '~' ? WATER : FLOOR;
      const kind = SERVICE_GLYPH[ch];
      if (kind) services.push({ kind, cell: { x, y }, keeper: kind === 'stash' ? '' : cast[kind] });
      else if (ch === 'T') torches.push({ x, y });
      else if (ch !== '#' && ch !== '.' && ch !== '~') at[ch] = { x, y };
    }
  const stash = services.find((s) => s.kind === 'stash')!.cell;
  const f: Floor = {
    cols,
    rows,
    cells,
    rooms: [{ x: 2, y: 2, w: cols - 4, h: rows - 4, kind: 'great' }],
    stairsUp: at.P!,
    stairsDown: at.G!,
    chest: stash,
    torches,
    crystals: [],
    loot: [],
    strayStarts: [],
    wildSpots: [],
    light: 1,
    version: HOLLOW.genVersion,
    greatRoom: 0,
    elevation: new Float32Array(cols * rows),
    landmark: null,
    vistas: [],
    crossings: [],
    nook: null,
    special: 'none',
    zone: 'town',
    services,
    stone: at.W!,
    act,
  };
  cache.set(act, f);
  return f;
}

/** The camp service the Keeper stands at, if any. */
export function serviceHere(world: World): Service | null {
  const f = runFloor(world);
  if (!f?.services || world.dungeon?.encounter) return null;
  const k = world.keeper.pos;
  let best: Service | null = null;
  let bestD: number = HOLLOW_ZONES.reach + DUNGEON.cell * 0.5;
  for (const s of f.services) {
    const p = cellCentre(f, s.cell);
    const d = Math.hypot(k.x - p.x, k.z - p.z);
    if (d < bestD) {
      bestD = d;
      best = s;
    }
  }
  return best;
}

function at(world: World, kind: ServiceKind): boolean {
  return serviceHere(world)?.kind === kind;
}

/** Shells into the stash (`amount` > 0) or back out (< 0), at the stash chest. */
export function useStash(world: World, amount: number, events: SimEvent[]): boolean {
  if (!at(world, 'stash') || !Number.isFinite(amount) || amount === 0) return false;
  const camp = world.hollow.camp;
  const n = Math.round(
    amount > 0
      ? Math.min(amount, world.inventory.shells, HOLLOW_ZONES.stash.maxShells - camp.shells)
      : -Math.min(-amount, camp.shells),
  );
  if (n === 0) return false;
  world.inventory.shells -= n;
  camp.shells += n;
  events.push({ kind: 'stashMoved', amount: n });
  return true;
}

/** The vendor: fruit for strays, or a bundle of Homing Acorns (the cave-mouth price). */
export function townBuy(world: World, item: 'fruit' | 'acorns', events: SimEvent[]): boolean {
  if (!at(world, 'vendor')) return false;
  if (item === 'acorns') {
    const before = world.hollow.acorns;
    buyAcorns(world, events);
    return world.hollow.acorns > before;
  }
  const price = HOLLOW_ZONES.vendor.fruitPrice;
  if (world.inventory.shells < price) return false;
  world.inventory.shells -= price;
  world.inventory.fruit += 1;
  events.push({ kind: 'townBought', item });
  return true;
}

/** The quest-giver: once the act's boss is beaten, a one-time reward. */
export function townQuest(world: World, events: SimEvent[]): number {
  const run = world.dungeon;
  if (!run || run.act === undefined || !at(world, 'quest')) return 0;
  const act = run.act;
  const camp = world.hollow.camp;
  if (!world.hollow.acts[act]?.bossDefeated || camp.questsPaid.includes(act)) return 0;
  const shells = HOLLOW_ZONES.questReward[act] ?? HOLLOW_ZONES.questReward[0];
  camp.questsPaid.push(act);
  world.inventory.shells += shells;
  run.haul.shells += shells;
  events.push({ kind: 'townQuestPaid', act, shells });
  return shells;
}

/** The run depth a camp, field or side cave counts as: the act's top level. */
export function zoneDepth(act: number): number {
  return actStartDepth(act);
}
