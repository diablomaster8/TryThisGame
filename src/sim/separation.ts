/**
 * Soft body separation in the home Grove (MOVE-17): the Keeper, the visiting Keepers and
 * the free Nubbins are circles, and after everyone has moved each overlapping pair is eased
 * apart. The Keeper gives way least, nobody is ever stopped dead, and anyone carried, held,
 * thrown, swimming or held on a story mark is left alone. It runs every sim step, so it
 * allocates nothing and skips far pairs at once.
 */
import { BODIES, JUMP } from '../config/tuning-sim';
import { runFloor } from './dungeon';
import { nubbinWalker, resolve } from './obstacles';
import { ledgeY } from './terrain';
import type { Nubbin, Vec2, World } from './types';

function radius(n: Nubbin): number {
  return n.stage === 'adult' ? BODIES.adult : BODIES.child;
}

function free(n: Nubbin): boolean {
  if (n.stage === 'egg' || n.stage === 'cocoon') return false;
  const s = n.behavior.state;
  return s !== 'held' && s !== 'carried' && s !== 'thrown' && s !== 'swim';
}

// Scratch for the pair push, so the hot loop makes no objects.
let pushA = 0;
let pushB = 0;

/**
 * Ease a and b apart by their overlap, `shareA` of it to a, each move capped at `cap`.
 * Returns whether they overlapped; the moves are left in pushA / pushB along (ux, uz).
 */
function apart(a: Vec2, ra: number, b: Vec2, rb: number, shareA: number, cap: number): boolean {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const reach = ra + rb;
  if (dx > reach || dx < -reach || dz > reach || dz < -reach) return false;
  const d2 = dx * dx + dz * dz;
  if (d2 >= reach * reach) return false;
  const d = Math.sqrt(d2);
  // Exactly on top of each other: part along x, the same way every time.
  const ux = d > 1e-6 ? dx / d : 1;
  const uz = d > 1e-6 ? dz / d : 0;
  const overlap = reach - d;
  pushA = Math.min(cap, overlap * shareA);
  pushB = Math.min(cap, overlap * (1 - shareA));
  a.x -= ux * pushA;
  a.z -= uz * pushA;
  b.x += ux * pushB;
  b.z += uz * pushB;
  return true;
}

/** One separation pass over everyone standing in the Grove, after this step's moves. */
export function separateBodies(world: World, dtMs: number): void {
  if (world.location !== 'grove' || runFloor(world)) return;
  // A story scene holds its cast on their marks.
  if ((world.campaign?.queue.length ?? 0) > 0) return;
  const cap = (BODIES.maxPush * dtMs) / 1000;
  const k = world.keeper;
  // A jumping Keeper passes over heads; a carrying one is a single body with its load.
  const keeper = k.grounded;
  const kx = k.pos.x;
  const kz = k.pos.z;
  const ns = world.nubbins;
  for (let i = 0; i < ns.length; i++) {
    const a = ns[i]!;
    if (!free(a) || a.id === k.carrying) continue;
    const ra = radius(a);
    let moved = false;
    if (keeper && apart(k.pos, BODIES.keeper, a.pos, ra, BODIES.keeperShare, cap)) moved = true;
    for (let j = i + 1; j < ns.length; j++) {
      const b = ns[j]!;
      if (!free(b) || b.id === k.carrying) continue;
      if (apart(a.pos, ra, b.pos, radius(b), 0.5, cap)) {
        moved = true;
        resolve(b.pos, world, 0.3, nubbinWalker(b));
      }
    }
    for (const npc of world.npcs) if (apart(npc.pos, BODIES.npc, a.pos, ra, 0.5, cap)) moved = true;
    if (moved) resolve(a.pos, world, 0.3, nubbinWalker(a));
  }
  if (keeper)
    for (const npc of world.npcs)
      apart(k.pos, BODIES.keeper, npc.pos, BODIES.npc, BODIES.keeperShare, cap);
  if (k.pos.x !== kx || k.pos.z !== kz) {
    // Never shoved up a terrace cliff or into a wall.
    if (ledgeY(k.pos.x, k.pos.z) > Math.max(k.y, ledgeY(kx, kz)) + JUMP.stepUp) {
      k.pos.x = kx;
      k.pos.z = kz;
    } else resolve(k.pos, world, 0.35, 'keeper', k.y);
  }
}
