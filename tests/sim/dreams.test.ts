import { describe, expect, it } from 'vitest';
import { DREAMS } from '../../src/config/tuning-soul-r11b';
import { dreamEveryMs, dreamNow } from '../../src/sim/dreams';
import { hatch } from '../../src/sim/lifecycle';
import { createWorld } from '../../src/sim/world';

/** R0586 (lane A r11): a napping Nubbin shows a dream icon within 30 s. */
describe('nap dreams (R0586)', () => {
  const setup = () => {
    const world = createWorld(7, 0);
    const n = world.nubbins[0]!;
    hatch(n, [], 0);
    n.behavior.state = 'nap';
    n.behavior.sinceMs = 0;
    return { world, n };
  };
  it('shows a bubble within 30 s of falling asleep, and only while napping', () => {
    const { world, n } = setup();
    let seen = false;
    for (let t = 0; t <= 30_000; t += 100) {
      world.timeMs = t;
      if (dreamNow(world, n)) seen = true;
    }
    expect(seen).toBe(true);
    n.behavior.state = 'wander';
    world.timeMs = DREAMS.firstMs + 100;
    expect(dreamNow(world, n)).toBeNull();
  });
  it('lazy and dreamy ones dream twice as often', () => {
    const { n } = setup();
    n.personality = 'cheerful';
    const normal = dreamEveryMs(n);
    n.personality = 'lazy';
    expect(dreamEveryMs(n)).toBe(normal / 2);
    n.personality = 'dreamy';
    expect(dreamEveryMs(n)).toBe(normal / 2);
  });
});
