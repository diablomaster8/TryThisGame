/**
 * R0127 (WORLD-61): the world teaches its rules once, in the world. Each mechanic has a safe,
 * obvious spot in the Grove (`WORLD_HINTS` in config/tuning-r9d4.ts); the first time the Keeper
 * walks there while the mechanic applies, one narrator line shows with an icon, and
 * `world.hintsSeen` (an optional save field) remembers it so it never repeats. Two hints never
 * land within `gapMs` of each other: the later one simply waits for the next pass. Only live
 * play moves the Keeper, so catch-up never shows one.
 *
 * R0111 (WORLD-28): the Grove's secret rides the same walk. With the Grove's Old Key picked up,
 * reaching the nook at the falls' foot finds it once (`world.secrets`): a statue for the
 * garden and a few Shells. Without the key the nook only shows its keyhole, once.
 */
import { WORLD_HINTS, SECRETS, type HintId } from '../config/tuning-r9d4';
import { regionOf } from './regions';
import { examineTrace } from './regions-trace';
import { keeperPerks } from './perks';
import { rideRefusal } from './ride';
import type { SimEvent, World } from './types';

/** The clue's world trace (content/world-traces.ts), counted on the map when it shows. */
export const CLUE_TRACE = 'grove-falls-moss';

/** Whether a hint's mechanic applies to this Keeper now (no point teaching a glide without wings). */
function applies(world: World, id: HintId): boolean {
  if (id === 'glide') return keeperPerks(world).glide;
  if (id === 'ride')
    return world.nubbins.some((n) => {
      const why = rideRefusal(world, n);
      return why === null || why === 'bond' || why === 'stat' || why === 'tired';
    });
  // The clue only matters while the secret is still to find.
  if (id === 'clue') return !world.secrets?.[regionOf(world.location)];
  return true;
}

/** Whether the Grove's Old Key has been picked up. */
export function hasKey(world: Pick<World, 'collected'>, region: string): boolean {
  return world.collected?.[`${region}:key:1`] !== undefined;
}

function lastHintMs(seen: Record<string, number>): number {
  let last = -Infinity;
  for (const v of Object.values(seen)) last = Math.max(last, v);
  return last;
}

/** Show a hint once; false (and nothing kept) while another one is too recent. */
function show(world: World, id: string, events: SimEvent[]): boolean {
  const seen = (world.hintsSeen ??= {});
  if (seen[id] !== undefined) return false;
  if (world.timeMs - lastHintMs(seen) < WORLD_HINTS.gapMs) return false;
  seen[id] = world.timeMs;
  events.push({ kind: 'worldHint', id });
  return true;
}

/** Where the Keeper stood at the last look, per world: a still Keeper learns nothing new. */
const lastAt = new WeakMap<World, { x: number; z: number }>();

export function stepWorldHints(world: World, events: SimEvent[]): void {
  if (world.location !== 'grove' || world.campaign?.queue.length) return;
  const k = world.keeper.pos;
  const at = lastAt.get(world);
  if (at && at.x === k.x && at.z === k.z) return;
  lastAt.set(world, { x: k.x, z: k.z });
  const region = regionOf(world.location);
  const seen = world.hintsSeen ?? {};
  for (const h of WORLD_HINTS.spots) {
    if (h.region !== region || seen[h.id] !== undefined) continue;
    if (Math.hypot(h.x - k.x, h.z - k.z) > WORLD_HINTS.radius) continue;
    if (!applies(world, h.id)) continue;
    if (show(world, h.id, events) && h.id === 'clue') examineTrace(world, CLUE_TRACE);
    break;
  }
  stepSecret(world, region, events);
}

/** R0111: the region's secret, found once with its Old Key. */
function stepSecret(world: World, region: ReturnType<typeof regionOf>, events: SimEvent[]): void {
  const s = SECRETS.spots[region];
  if (!s || world.secrets?.[region] !== undefined) return;
  const k = world.keeper.pos;
  if (Math.hypot(s.x - k.x, s.z - k.z) > SECRETS.radius) return;
  if (!hasKey(world, region)) {
    show(world, 'nook', events);
    return;
  }
  (world.secrets ??= {})[region] = world.timeMs;
  const d = s.reward.decor;
  world.inventory.decor[d] = (world.inventory.decor[d] ?? 0) + 1;
  world.inventory.shells += s.reward.shells;
  events.push({ kind: 'secretFound', region });
}

/** R0111: the nook twinkles while its key is held and the secret is unfound (render reads it). */
export function secretGlint(world: World): { x: number; z: number } | null {
  if (world.location !== 'grove') return null;
  const region = regionOf(world.location);
  const s = SECRETS.spots[region];
  if (!s || world.secrets?.[region] !== undefined || !hasKey(world, region)) return null;
  const k = world.keeper.pos;
  return Math.hypot(s.x - k.x, s.z - k.z) <= SECRETS.glintRadius ? { x: s.x, z: s.z } : null;
}
