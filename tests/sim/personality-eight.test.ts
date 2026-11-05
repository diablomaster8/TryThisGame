import { describe, expect, it } from 'vitest';
import { NEEDS } from '../../src/config/tuning';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { interact } from '../../src/sim/keeper';
import { basePersonality, decidePersonality, noteCare } from '../../src/sim/personality';
import { quirkAct, SIGNATURE_QUIRKS } from '../../src/sim/quirks';
import { setAnticsLive } from '../../src/sim/antics';
import { applyCommand, createWorld, dropFruit, stepWorld, withRng } from '../../src/sim/world';
import { PERSONALITIES, type Nubbin, type Personality, type World } from '../../src/sim/types';

// R0529 (SOUL-11): eight personalities, each reached by its own scripted care pattern, each
// with its own top quirk.
function oneChild(seed = 7): { w: World; n: Nubbin } {
  const w = createWorld(seed, 0);
  const n = w.nubbins[0]!;
  w.nubbins = [n];
  hatch(n, [], 0);
  return { w, n };
}

/** Steps a little past the pet cooldown so the next touch counts. */
const pause = (w: World): void => {
  for (let t = 0; t < NEEDS.petCooldownMs + 200; t += 100) stepWorld(w, 100);
};

const touches = (w: World, n: Nubbin, action: 'hug' | 'praise' | 'highFive', times: number) => {
  for (let i = 0; i < times; i++) {
    interact(w, n, action, []);
    pause(w);
  }
};

const patterns: Record<Personality, (w: World, n: Nubbin) => void> = {
  cheerful: (_w, n) => {
    for (let i = 0; i < 10; i++) noteCare(n, 'pets');
  },
  shy: () => {},
  mischievous: (_w, n) => {
    for (let i = 0; i < 6; i++) noteCare(n, 'throws');
  },
  lazy: (_w, n) => {
    for (let i = 0; i < 6; i++) noteCare(n, 'feeds');
  },
  curious: (w, n) => {
    const sp = 'penguin';
    w.inventory.critters[sp] = 10;
    for (let i = 0; i < 6; i++)
      applyCommand(w, { kind: 'giveCritter', nubbinId: n.id, species: sp }, []);
  },
  gentle: (w, n) => {
    touches(w, n, 'hug', 3);
    touches(w, n, 'praise', 3);
  },
  bold: (w, n) => {
    touches(w, n, 'highFive', 4);
    for (let i = 0; i < 2; i++)
      applyCommand(
        w,
        { kind: 'addRewards', rewards: { shells: 1, essences: {}, critters: {} } },
        [],
      );
  },
  dreamy: (w, n) => {
    // The Keeper stands still in the Grove; the child comes and sits by them, and stays.
    w.keeper.pos = { x: n.pos.x + 1, z: n.pos.z };
    for (let t = 0; t < 6 * 60_000; t += 100) {
      n.needs.hunger = 1;
      n.needs.energy = 1;
      stepWorld(w, 100, 1_000_000 + t);
    }
  },
};

describe('R0529 eight personalities', () => {
  it('the list has eight, and each maps onto one of the first four', () => {
    expect(PERSONALITIES).toHaveLength(8);
    for (const p of PERSONALITIES)
      expect(['cheerful', 'shy', 'mischievous', 'lazy']).toContain(basePersonality(p));
  });

  for (const p of PERSONALITIES)
    it(`a scripted care pattern reaches ${p}`, () => {
      const { w, n } = oneChild();
      patterns[p](w, n);
      expect(decidePersonality(n.childCare)).toBe(p);
      evolve(n, [], w);
      expect(n.personality).toBe(p);
    }, 60_000);

  it('each personality has a distinct top quirk, and the second four play theirs', () => {
    const tops = PERSONALITIES.map((p) => SIGNATURE_QUIRKS[p][0]);
    expect(new Set(tops).size).toBe(8);
    setAnticsLive(true);
    for (const p of ['curious', 'gentle', 'bold', 'dreamy'] as const) {
      const w = createWorld(3, 0);
      for (const o of w.nubbins) hatch(o, [], 0);
      const n = w.nubbins[0]!;
      evolve(n, [], w);
      n.personality = p;
      // A sad friend near, for the gentle pat, and a fruit about to offer.
      withRng(w, (rng) => dropFruit(w, w.trees[0]!, rng, []));
      const f = w.nubbins[1];
      if (f) {
        f.pos = { x: n.pos.x + 2, z: n.pos.z };
        f.needs.happiness = -60;
      }
      const seen: Record<string, number> = {};
      for (let s = 0; s < 4000; s++) {
        const act = quirkAct(n, w, s * 1000);
        if (!act?.itemId) continue;
        const id = act.itemId.split(':')[0]!;
        seen[id] = (seen[id] ?? 0) + 1;
      }
      const top = Object.entries(seen).sort((a, b) => b[1] - a[1])[0]?.[0];
      expect(top).toBe(SIGNATURE_QUIRKS[p][0]);
      for (const q of SIGNATURE_QUIRKS[p]) expect(seen[q] ?? 0).toBeGreaterThan(0);
    }
  });
});
