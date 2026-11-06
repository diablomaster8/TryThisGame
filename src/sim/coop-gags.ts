/**
 * R0364 (FUN-75): the three two-Keeper gags. Both Keepers pet the same Nubbin close together
 * and it spins with double joy; both shake the same tree and three fruit come down at once,
 * with a bonk for whoever stands nearer the trunk; the Keepers bump and each bows, "after
 * you". Transient state only (a WeakMap), so the save is untouched.
 */
import { COOP_GAGS } from '../config/tuning-fun-r11e';
import type { Nubbin, SimEvent, Tree, World } from './types';
import { dropFruit, withRng } from './world';
import { react } from './behavior';

interface Mark {
  who: 1 | 2;
  ms: number;
}
interface State {
  pets: Map<string, Mark>;
  shakes: Map<string, Mark>;
  bowAt: number;
}

const states = new WeakMap<World, State>();
function stateOf(world: World): State {
  let s = states.get(world);
  if (!s) {
    s = { pets: new Map(), shakes: new Map(), bowAt: -Infinity };
    states.set(world, s);
  }
  return s;
}

/** Called after any Keeper pets a Nubbin. A different Keeper's pet within the window spins it. */
export function noteCoopPet(world: World, n: Nubbin, who: 1 | 2, events: SimEvent[]): void {
  if (!world.coop.active || !world.keeper2) return;
  const s = stateOf(world);
  const prev = s.pets.get(n.id);
  if (prev && prev.who !== who && world.timeMs - prev.ms <= COOP_GAGS.petWindowMs) {
    s.pets.delete(n.id);
    react(n, 'love', world.timeMs, events);
    events.push({ kind: 'coopGag', gag: 'spin', nubbinId: n.id, who });
    return;
  }
  s.pets.set(n.id, { who, ms: world.timeMs });
}

/** Called after any Keeper shakes a tree. Both within the window: a fruit avalanche. */
export function noteCoopShake(world: World, tree: Tree, who: 1 | 2, events: SimEvent[]): void {
  const k2 = world.keeper2;
  if (!world.coop.active || !k2) return;
  const s = stateOf(world);
  const prev = s.shakes.get(tree.id);
  if (prev && prev.who !== who && world.timeMs - prev.ms <= COOP_GAGS.shakeWindowMs) {
    s.shakes.delete(tree.id);
    const d1 = Math.hypot(world.keeper.pos.x - tree.pos.x, world.keeper.pos.z - tree.pos.z);
    const d2 = Math.hypot(k2.pos.x - tree.pos.x, k2.pos.z - tree.pos.z);
    withRng(world, (rng) => {
      for (let i = 0; i < COOP_GAGS.avalancheFruit; i++) dropFruit(world, tree, rng, events);
    });
    events.push({ kind: 'coopGag', gag: 'avalanche', treeId: tree.id, who: d1 <= d2 ? 1 : 2 });
    return;
  }
  s.shakes.set(tree.id, { who, ms: world.timeMs });
}

/** Called when the Keepers bump. Both bow, at most once per cooldown. */
export function noteCoopBump(world: World, events: SimEvent[]): void {
  const s = stateOf(world);
  if (world.timeMs - s.bowAt < COOP_GAGS.bowCooldownMs) return;
  s.bowAt = world.timeMs;
  events.push({ kind: 'coopGag', gag: 'bow', who: 1 });
}
