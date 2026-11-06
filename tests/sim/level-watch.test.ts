import { describe, expect, it } from 'vitest';
import { stepLevelWatch } from '../../src/sim/level-watch';
import { createWorld } from '../../src/sim/world';
import type { SimEvent } from '../../src/sim/types';

describe('level watch (R0450)', () => {
  it('announces a new level once, and stays quiet on the first look and while offline', () => {
    const w = createWorld(1, 0);
    const n = w.nubbins[0]!;
    n.stage = 'child';
    const events: SimEvent[] = [];
    stepLevelWatch(w, events, false);
    expect(events).toEqual([]);
    n.stats.swim.points += 100;
    stepLevelWatch(w, events, false);
    expect(events).toEqual([
      { kind: 'levelUp', nubbinId: n.id, stat: 'swim', level: expect.any(Number) },
    ]);
    stepLevelWatch(w, events, false);
    expect(events.length).toBe(1);
    n.stats.run.points += 100;
    stepLevelWatch(w, events, true);
    expect(events.length).toBe(1);
  });
});
