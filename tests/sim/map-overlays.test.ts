import { describe, expect, it } from 'vitest';
import { COLLECTIBLES } from '../../src/config/region-collectibles';
import { WORLD_TRACES } from '../../src/content/world-traces';
import { mapOverlay } from '../../src/sim/map-overlays';
import { questsInArea } from '../../src/sim/quest-areas';
import type { World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

describe('R0122: map overlays', () => {
  it('match questsInArea and world.collected exactly', () => {
    const w = createWorld(3, 0);
    const keeps = COLLECTIBLES.filter((k) => k.region === 'grove');
    w.collected = { [keeps[0]!.id]: 1, [keeps[3]!.id]: 2 };
    const o = mapOverlay(w, 'grove');
    expect(o.quests).toEqual(questsInArea(w, 'grove'));
    expect(o.keepsakes.got).toBe(2);
    expect(o.keepsakes.of).toBe(keeps.length);
    expect(o.keepsakes.spots.map((s) => s.id).sort()).toEqual([keeps[0]!.id, keeps[3]!.id].sort());
    // Nothing unfound is placed.
    expect(o.traces.spots).toEqual([]);
    expect(o.traces.of).toBe(WORLD_TRACES.filter((t) => t.region === 'grove').length);
  });

  it('places a read trace and counts it toward completion', () => {
    const w = createWorld(3, 0);
    const before = mapOverlay(w, 'grove').completion;
    const t = WORLD_TRACES.find((x) => x.region === 'grove' && x.at)!;
    w.campaign = {
      flags: { [`trace:${t.id}`]: true },
      fun: {},
      side: {},
    } as unknown as World['campaign'];
    const o = mapOverlay(w, 'grove');
    expect(o.traces.spots).toEqual([{ id: t.id, ...t.at! }]);
    expect(o.completion).toBeGreaterThan(before);
  });
});
