import { describe, expect, it } from 'vitest';
import { performLook } from '../../src/render/perform-look';
import { LESSON_VARIANTS } from '../../src/sim/lesson-variants';
import { hatch } from '../../src/sim/lifecycle';
import { createWorld } from '../../src/sim/world';

/** R0585 (lane A r11): reduced motion shows no rotation in any class, props still drawn. */
describe('class performances under reduced motion (R0585)', () => {
  it('never turns the body, and keeps every prop', () => {
    const world = createWorld(7, 0);
    const n = world.nubbins[0]!;
    hatch(n, [], 0);
    n.lessons = {};
    for (const v of LESSON_VARIANTS) {
      n.lessons[v.id] = 1;
      n.lessons[v.family] = 3;
      n.lessons.show = LESSON_VARIANTS.indexOf(v) + 1;
      n.behavior.state = 'perform';
      n.behavior.itemId = v.family;
      n.behavior.sinceMs = 0;
      for (const t of [0, 137, 500, 911, 1500]) {
        const look = performLook(n, t, true)!;
        expect(look.turn, `${v.id} at ${t}`).toBe(0);
        if (v.prop) expect(look.prop, v.id).toBe(v.prop);
      }
    }
  });
});
