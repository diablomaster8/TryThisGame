import { decorCollider } from '../config/grove-layout';
import { DECOR, GROVE, JUMP_TOYS, STORY_PROPS } from '../config/tuning';
import { colliderReach, contact, obstacles } from './obstacles';
import { riverDistance } from './terrain';
import type { DecorKind, PlaceRefusal, PlacedDecor, SimEvent, Vec2, World } from './types';
import { newId } from './world';

/** Garden decorating: buy pieces in the shop, place them on the grass, pick them up again. */
export const DECOR_KINDS: readonly DecorKind[] = [
  'fence',
  'flowerbed',
  'bench',
  'statue',
  'pathTile',
  'lanternSmall',
  'springShroom',
  'hayBale',
];

/** MOVE-57: the jump toys, whose numbers live in `JUMP_TOYS` rather than `DECOR`. */
export type JumpToyKind = keyof typeof JUMP_TOYS.prices;

export function isJumpToy(kind: DecorKind): kind is JumpToyKind {
  return kind in JUMP_TOYS.prices;
}

export function decorPrice(kind: DecorKind): number {
  return isJumpToy(kind) ? JUMP_TOYS.prices[kind] : DECOR.prices[kind];
}

// MOVE-57: when each spring mushroom last bounced someone (sim ms), for the squash.
const bounced = new WeakMap<World, Map<string, number>>();

/** MOVE-57: a spring mushroom bounces someone off its cap: note it for the squash. */
export function springBounce(
  world: World,
  shroom: PlacedDecor,
  events: SimEvent[],
  nubbinId?: string,
): void {
  let m = bounced.get(world);
  if (!m) bounced.set(world, (m = new Map()));
  m.set(shroom.id, world.timeMs);
  events.push({ kind: 'springBounced', id: shroom.id, ...(nubbinId ? { nubbinId } : {}) });
}

/** MOVE-57: when the mushroom last bounced someone (sim ms), or -Infinity. */
export function springBouncedAt(world: World, id: string): number {
  return bounced.get(world)?.get(id) ?? -Infinity;
}

/** MOVE-57: the placed spring mushroom whose cap the point is on, if any. */
export function springShroomAt(world: World, x: number, z: number): PlacedDecor | null {
  if (world.location !== 'grove') return null;
  const r = JUMP_TOYS.colliders.springShroom.shape.r;
  for (const d of world.placed)
    if (d.kind === 'springShroom' && Math.hypot(d.pos.x - x, d.pos.z - z) <= r) return d;
  return null;
}

export function buyDecor(world: World, kind: DecorKind, events: SimEvent[]): boolean {
  const price = decorPrice(kind);
  const ok = world.inventory.shells >= price;
  if (ok) {
    world.inventory.shells -= price;
    world.inventory.decor[kind] = (world.inventory.decor[kind] ?? 0) + 1;
  }
  events.push({ kind: 'decorBought', decor: kind, ok });
  return ok;
}

export type { PlaceRefusal } from './types';

// How a piece's footprint is sampled for overlaps (units), and the clearances kept.
const SAMPLE = 0.25;
const KEEP = { solid: 0.2, stream: 0.3, spot: 1.0, walker: 0.6, bridge: 2.0 } as const;

/** Points across a piece's footprint: its collider, or a small square for a walk-on tile. */
function footprint(kind: DecorKind, pos: Vec2, yaw: number): Vec2[] {
  const c = decorCollider('ghost', kind, pos.x, pos.z, yaw);
  const s = c?.shape ?? { type: 'box' as const, hw: 0.25, hd: 0.25 };
  const hw = s.type === 'circle' ? s.r : s.type === 'box' ? s.hw : s.len / 2 + s.r;
  const hd = s.type === 'circle' ? s.r : s.type === 'box' ? s.hd : s.r;
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);
  const out: Vec2[] = [];
  const nx = Math.max(1, Math.ceil((hw * 2) / SAMPLE));
  const nz = Math.max(1, Math.ceil((hd * 2) / SAMPLE));
  for (let i = 0; i <= nx; i++)
    for (let j = 0; j <= nz; j++) {
      const lx = -hw + (i / nx) * hw * 2;
      const lz = -hd + (j / nz) * hd * 2;
      if (s.type === 'circle' && lx * lx + lz * lz > s.r * s.r + 1e-9) continue;
      out.push({ x: pos.x + lx * cos + lz * sin, z: pos.z - lx * sin + lz * cos });
    }
  // A small or round piece also keeps its centre and its rim, which the grid can step over.
  out.push({ x: pos.x, z: pos.z });
  if (s.type === 'circle')
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      out.push({ x: pos.x + Math.cos(a) * s.r, z: pos.z + Math.sin(a) * s.r });
    }
  return out;
}

/**
 * Whether a piece fits here (MOVE-05): null when it does, or why not. A piece never goes
 * into the pond or the stream, onto a hill, a house, a rock, a stall or another piece, onto
 * the bridge, a story prop or a visitor's spot, or on top of a Keeper, a Nubbin or an egg
 * spot, so placing never has to push anyone out of the way.
 */
export function placeRefusal(
  world: World,
  kind: DecorKind,
  pos: Vec2,
  yaw = 0,
): PlaceRefusal | null {
  const pond = GROVE.pond;
  const half = GROVE.size / 2 - 0.5;
  const pts = footprint(kind, pos, yaw);
  const span = Math.max(0, ...pts.map((p) => Math.hypot(p.x - pos.x, p.z - pos.z)));
  // The stream test is the dear one: only near the stream is every point measured.
  const nearStream = riverDistance(pos.x, pos.z) < GROVE.river.width / 2 + KEEP.stream + span;
  for (const p of pts) {
    if (Math.abs(p.x) > half || Math.abs(p.z) > half) return 'edge';
    if (Math.hypot(p.x - pond.x, p.z - pond.z) < pond.r + 0.6) return 'water';
    if (nearStream && riverDistance(p.x, p.z) < GROVE.river.width / 2 + KEEP.stream) return 'water';
  }
  for (const c of obstacles(world)) {
    // Far colliders are skipped by their reach before the footprint is sampled.
    if (Math.hypot(c.x - pos.x, c.z - pos.z) > colliderReach(c) + span + KEEP.solid) continue;
    // Fences join end to end into one run, so a fence may touch another fence.
    if (kind === 'fence' && fenceAt(world, c.id, pos, yaw)) continue;
    for (const p of pts) if (contact(c, p.x, p.z, KEEP.solid)) return 'solid';
  }
  const br = GROVE.bridge;
  const spots: Vec2[] = [
    ...GROVE.eggSpots,
    ...STORY_PROPS,
    ...world.npcs.map((n) => n.home),
  ].filter((s) => Math.hypot(s.x - pos.x, s.z - pos.z) < span + KEEP.spot);
  const nearBridge = Math.hypot(br.x - pos.x, br.z - pos.z) < span + KEEP.bridge;
  for (const p of pts) {
    if (nearBridge && Math.hypot(p.x - br.x, p.z - br.z) < KEEP.bridge) return 'path';
    if (spots.some((s) => Math.hypot(p.x - s.x, p.z - s.z) < KEEP.spot)) return 'spot';
  }
  const walkers: Vec2[] = [world.keeper.pos, ...world.nubbins.map((n) => n.pos)].filter(
    (w) => Math.hypot(w.x - pos.x, w.z - pos.z) < span + KEEP.walker,
  );
  if (world.keeper2) walkers.push(world.keeper2.pos);
  for (const p of pts)
    if (walkers.some((w) => Math.hypot(p.x - w.x, p.z - w.z) < KEEP.walker)) return 'someone';
  // Walk-on tiles may sit side by side; anything else keeps a little room from the next.
  if (!decorCollider('ghost', kind, pos.x, pos.z, yaw))
    return world.placed.some(
      (d) => d.kind === 'pathTile' && Math.hypot(d.pos.x - pos.x, d.pos.z - pos.z) < 0.45,
    )
      ? 'solid'
      : null;
  return null;
}

/**
 * Whether collider `id` is a placed fence another fence may join: any fence but one already
 * standing on this very spot and turn.
 */
function fenceAt(world: World, id: string, pos: Vec2, yaw: number): boolean {
  const d = world.placed.find((p) => p.id === id);
  if (d?.kind !== 'fence') return false;
  const same = d.pos.x === pos.x && d.pos.z === pos.z;
  const turn = Math.abs(Math.sin((d.yaw ?? 0) - yaw)) < 1e-6;
  return !(same && turn);
}

export function canPlaceAt(world: World, kind: DecorKind, pos: Vec2, yaw = 0): boolean {
  return placeRefusal(world, kind, pos, yaw) === null;
}

export function placeDecor(
  world: World,
  kind: DecorKind,
  pos: Vec2,
  events: SimEvent[],
  yaw = 0,
): boolean {
  if ((world.inventory.decor[kind] ?? 0) <= 0) return false;
  if (world.placed.length >= DECOR.maxPlaced) return false;
  // Snap to half units so fences and tiles line up; the check runs on the snapped spot.
  const at = { x: Math.round(pos.x * 2) / 2, z: Math.round(pos.z * 2) / 2 };
  const turn = snapYaw(yaw);
  const refused = placeRefusal(world, kind, at, turn);
  if (refused) {
    events.push({ kind: 'decorRefused', decor: kind, reason: refused });
    return false;
  }
  world.inventory.decor[kind] = (world.inventory.decor[kind] ?? 0) - 1;
  const id = newId(world, 'decor');
  world.placed.push({ id, kind, pos: at, ...(turn !== 0 ? { yaw: turn } : {}) });
  events.push({ kind: 'decorPlaced', id, decor: kind });
  return true;
}

/** Pieces turn in eighths, so a fence run can go straight or diagonal and still meet up. */
export function snapYaw(yaw: number): number {
  const step = Math.PI / 4;
  const t = (((Math.round(yaw / step) % 8) + 8) % 8) * step;
  return t === 0 ? 0 : t;
}

export function removeDecor(world: World, id: string): boolean {
  const d = world.placed.find((p) => p.id === id);
  if (!d) return false;
  world.placed = world.placed.filter((p) => p.id !== id);
  world.inventory.decor[d.kind] = (world.inventory.decor[d.kind] ?? 0) + 1;
  return true;
}
