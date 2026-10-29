/**
 * MOVE-56: walking up to a story prop meets its step. The flat stone on the hill (S24) is a
 * better beat walked to than tapped from afar, now that the hill is walkable. A prop with a
 * reach (`STORY_PROP_REACH`) counts as tapped when the Keeper, on its feet, comes within it;
 * once per approach, so standing there does not tap it again and again. It only feeds the
 * side-story runner the same `storyProp` command a tap sends: no story-world state is
 * written here, and the tap stays as the fallback (the sprout band taps).
 */
import { STORY_PROP_REACH } from '../config/tuning-move';
import { noteSideCommand } from './side-stories';
import { visibleStoryProps } from './story-props';
import type { World } from './types';

/** Per world, the props the Keeper is standing within reach of now (transient). */
const inside = new WeakMap<World, Set<string>>();

/** Once per sim step in live play. Cheap when no prop with a reach stands. */
export function stepPropReach(world: World): void {
  const c = world.campaign;
  if (!c || c.chapter === 0 || world.location !== 'grove') return;
  const k = world.keeper;
  let near = inside.get(world);
  for (const p of visibleStoryProps(world)) {
    const reach = STORY_PROP_REACH[p.id];
    if (reach === undefined) continue;
    const within = k.grounded && Math.hypot(p.x - k.pos.x, p.z - k.pos.z) <= reach;
    if (!within) {
      near?.delete(p.id);
      continue;
    }
    if (near?.has(p.id)) continue;
    if (!near) inside.set(world, (near = new Set()));
    near.add(p.id);
    noteSideCommand(world, c, { kind: 'storyProp', prop: p.id });
  }
}
