import { describe, expect, it } from 'vitest';
import { setAnticsLive } from '../../src/sim/antics';
import { likesOf } from '../../src/sim/likes';
import { evolve, hatch, rebirth } from '../../src/sim/lifecycle';
import { leanShares } from '../../src/sim/personality';
import { createWorld, stepWorld } from '../../src/sim/world';
import { PERSONALITIES } from '../../src/sim/types';

// R0573 (SOUL-56), lane A r11: personality echoes across rebirth.
describe('R0573 echoes across rebirth', () => {
  it('a cheerful Nubbin reborn leans cheerful and keeps its favourite fruit', () => {
    const w = createWorld(5, 0);
    const n = w.nubbins[0]!;
    w.nubbins = [n];
    hatch(n, [], 0);
    n.childCare.pets = 12;
    evolve(n, [], w);
    expect(n.personality).toBe('cheerful');
    const fruit = likesOf(n).fruit;
    rebirth(n, []);
    expect(n.personality).toBeNull();
    expect(n.echo).toBe('cheerful');
    hatch(n, [], w.timeMs);
    const s = leanShares(n);
    const top = PERSONALITIES.reduce((a, b) => (s[b] > s[a] ? b : a));
    expect(top).toBe('cheerful');
    expect(likesOf(n).fruit).toBe(fruit);
  });

  it('every non-shy personality echoes toward itself', () => {
    for (const p of PERSONALITIES) {
      if (p === 'shy') continue;
      const w = createWorld(6, 0);
      const n = w.nubbins[0]!;
      hatch(n, [], 0);
      evolve(n, [], w);
      n.personality = p;
      rebirth(n, []);
      hatch(n, [], 0);
      const s = leanShares(n);
      expect(
        PERSONALITIES.reduce((a, b) => (s[b] > s[a] ? b : a)),
        p,
      ).toBe(p);
    }
  });

  it('its first greet is the old life’s quirk', () => {
    setAnticsLive(true);
    const w = createWorld(7, 0);
    const n = w.nubbins[0]!;
    w.nubbins = [n];
    hatch(n, [], 0);
    evolve(n, [], w);
    n.personality = 'cheerful';
    rebirth(n, []);
    hatch(n, [], w.timeMs);
    let twirled = false;
    for (let t = 0; t < 200 && !twirled; t++) {
      w.keeper.pos = { x: n.pos.x + 2, z: n.pos.z };
      n.needs.hunger = 1;
      n.needs.energy = 1;
      stepWorld(w, 100);
      twirled = n.behavior.itemId === 'twirl';
    }
    expect(twirled).toBe(true);
    expect(n.echo).toBeUndefined();
  });
});
