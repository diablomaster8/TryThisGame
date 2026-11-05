import { describe, expect, it } from 'vitest';
import { setAnticsLive } from '../../src/sim/antics';
import { hatch, evolve } from '../../src/sim/lifecycle';
import { kinSeen } from '../../src/sim/kin-play';
import { canHum } from '../../src/sim/hum';
import { noteFondness } from '../../src/sim/keeper-fondness';
import { TOY_PAIR } from '../../src/config/tuning-soul-r11a';
import { isPairToy, isSocialToy, playersOn, rockTilt, stepToyPairs } from '../../src/sim/toy-pair';
import { favouredToy } from '../../src/sim/toy-soul';
import { buyToy, placeToy } from '../../src/sim/craft';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import { TOYS } from '../../src/config/tuning';
import type { Nubbin, Personality, SimEvent, ToyKind, World } from '../../src/sim/types';

// Lane A round 12: R0574 (four more toys), R0589 (hum), R0568 (favourite Keeper follows),
// R0571 (expedition greeting and run-past).

function grove(seed: number, ps: Personality[]): World {
  setAnticsLive(true);
  const w = createWorld(seed, 0);
  const base = w.nubbins[0]!;
  w.nubbins = ps.map((p, i) => {
    const n: Nubbin = structuredClone(base);
    n.id = `n${i}`;
    n.seed = seed * 31 + i;
    hatch(n, [], 0);
    evolve(n, [], w);
    n.personality = p;
    n.pos = { x: 6 + i, z: 0 };
    n.needs.hunger = 1;
    n.needs.energy = 1;
    n.behavior.state = 'wander';
    n.behavior.untilMs = 1e9;
    return n;
  });
  w.keeper.pos = { x: 0, z: 0 };
  w.weather = { kind: 'clear', untilMs: Infinity, intensity: 0 };
  return w;
}

function hold(w: World): void {
  for (const n of w.nubbins) {
    n.needs.hunger = 1;
    n.needs.energy = 1;
    if (n.behavior.state === 'wander') n.behavior.untilMs = 1e9;
  }
}

describe('R0574 rope, duck, kite and crayon box', () => {
  const NEW: ToyKind[] = ['skippingRope', 'rubberDuck', 'kite', 'crayonBox'];
  it('are in the shop and can be placed', () => {
    for (const k of NEW) {
      expect(TOYS.prices[k]).toBeGreaterThan(0);
      const w = grove(1, ['cheerful']);
      w.inventory.shells = 1000;
      const ev: SimEvent[] = [];
      expect(buyToy(w, k, ev)).toBe(true);
      expect(placeToy(w, k, { x: 2, z: 2 }, ev)).toBe(true);
    }
    expect(isPairToy('skippingRope')).toBe(true);
    expect(isSocialToy('rubberDuck') && isSocialToy('kite') && isSocialToy('crayonBox')).toBe(true);
  });

  it('the rope pairs two Nubbins at its ends and turns; the duck pairs without pinning', () => {
    for (const kind of ['skippingRope', 'rubberDuck'] as const) {
      const w = grove(2, ['cheerful', 'cheerful']);
      w.inventory.shells = 1000;
      buyToy(w, kind, []);
      placeToy(w, kind, { x: 2, z: 2 }, []);
      const toy = w.items.find((i) => i.kind === 'toy')!;
      for (const n of w.nubbins) {
        n.behavior.state = 'play';
        n.behavior.itemId = toy.id;
        n.behavior.target = null;
        n.pos = { x: toy.pos.x, z: toy.pos.z };
      }
      for (let i = 0; i < 50; i++) stepToyPairs(w, 100);
      const [a, b] = w.nubbins as [Nubbin, Nubbin];
      expect(playersOn(w, toy).length).toBe(2);
      expect(toy.players).toBe(2);
      expect(a.friends?.[b.id]).toBeGreaterThan(0);
      if (kind === 'skippingRope') {
        expect(Math.abs(a.pos.x - b.pos.x)).toBeGreaterThan(0.8);
        expect(Math.max(...[0, 300, 600, 900].map((t) => rockTilt(toy, t)))).toBeGreaterThan(0.5);
      } else expect(a.pos.x).toBe(b.pos.x);
    }
  });

  it('a friend on a social toy draws another; swimmers love the duck, fliers the kite', () => {
    const w = grove(3, ['cheerful', 'cheerful']);
    w.inventory.shells = 1000;
    buyToy(w, 'kite', []);
    placeToy(w, 'kite', { x: 6, z: 2 }, []);
    const toy = w.items.find((i) => i.kind === 'toy')!;
    const [a, b] = w.nubbins as [Nubbin, Nubbin];
    a.form = { ...a.form!, type: 'normal' };
    const base = favouredToy(w, a, 0)!.keen;
    a.form = { ...a.form!, type: 'fly' };
    expect(favouredToy(w, a, 0)!.keen).toBeCloseTo(base * TOY_PAIR.typeBoost, 5);
    b.behavior.state = 'play';
    b.behavior.itemId = toy.id;
    b.behavior.target = null;
    expect(favouredToy(w, a, 0)!.keen).toBeGreaterThan(base * TOY_PAIR.typeBoost);
  });
});

describe('R0589 the hum', () => {
  it('a content idler near the Keeper hums within a few minutes, a far one never', () => {
    const w = grove(5, ['cheerful', 'cheerful']);
    const [near, far] = w.nubbins as [Nubbin, Nubbin];
    near.pos = { x: 2, z: 0 };
    far.pos = { x: 40, z: 0 };
    near.needs.happiness = 60;
    far.needs.happiness = 60;
    expect(canHum(w, near)).toBe(true);
    expect(canHum(w, far)).toBe(false);
    const hums = new Map<string, number>();
    for (let i = 0; i < 6000; i++) {
      hold(w);
      near.needs.happiness = 60;
      far.needs.happiness = 60;
      if (near.behavior.state === 'wander') near.pos = { x: 2, z: 0 };
      for (const e of stepWorld(w, 100))
        if (e.kind === 'hum') hums.set(e.nubbinId, (hums.get(e.nubbinId) ?? 0) + 1);
    }
    expect(hums.get(near.id) ?? 0).toBeGreaterThan(0);
    expect(hums.get(far.id) ?? 0).toBe(0);
  });
});

describe('R0568 the favourite Keeper', () => {
  it('a Nubbin that favours the Keeper on duty trots over to stand beside it', () => {
    let trips = 0;
    for (let seed = 1; seed <= 6; seed++) {
      const w = grove(seed, ['cheerful']);
      const n = w.nubbins[0]!;
      for (let i = 0; i < 8; i++) noteFondness(n, w.keeper.alignment);
      n.pos = { x: 6, z: 0 };
      for (let i = 0; i < 1200; i++) {
        hold(w);
        if (n.behavior.state === 'wander') n.pos = { x: 6, z: 0 };
        stepWorld(w, 100);
        if (n.behavior.itemId === 'fondFollow') {
          trips++;
          break;
        }
      }
    }
    expect(trips).toBeGreaterThanOrEqual(4);
  });

  it('switching to the favourite makes it run over and greet', () => {
    let ranCount = 0;
    let lovedCount = 0;
    for (let seed = 1; seed <= 6; seed++) {
      const w = grove(seed, ['cheerful']);
      const n = w.nubbins[0]!;
      w.keeper.alignment = 'moon';
      for (let i = 0; i < 8; i++) noteFondness(n, 'sun');
      for (let i = 0; i < 40; i++) {
        hold(w);
        n.pos = { x: 12, z: 0 };
        stepWorld(w, 100);
      }
      n.behavior.state = 'wander';
      n.behavior.target = null;
      n.pos = { x: 12, z: 0 };
      w.keeper.alignment = 'sun';
      let ran = false;
      let loved = false;
      for (let i = 0; i < 250; i++) {
        hold(w);
        const ev = stepWorld(w, 100);
        ran ||= n.behavior.itemId === 'fondFollow';
        loved ||= ev.some((e) => e.kind === 'reaction' && e.reaction === 'love');
      }
      if (ran) ranCount++;
      if (loved) lovedCount++;
    }
    expect(ranCount).toBeGreaterThanOrEqual(4);
    expect(lovedCount).toBeGreaterThanOrEqual(3);
  });
});

describe('R0571 expedition greeting and run-past', () => {
  it('without a campaign, coming home sends a fond Nubbin to the gate', () => {
    const w = grove(9, ['cheerful']);
    w.campaign = null;
    const n = w.nubbins[0]!;
    n.needs.affection = 80;
    stepWorld(w, 100);
    applyCommand(
      w,
      { kind: 'addRewards', rewards: { shells: 10, essences: {}, critters: {} } },
      [],
    );
    let greeted = false;
    for (let i = 0; i < 20 && !greeted; i++) {
      hold(w);
      stepWorld(w, 100);
      greeted = n.behavior.itemId === 'greetGate';
    }
    expect(greeted).toBe(true);
    expect(kinSeen(w).greetGate).toBeGreaterThan(0);
  });

  it('an unfond Nubbin stays put', () => {
    const w = grove(9, ['cheerful']);
    const n = w.nubbins[0]!;
    n.needs.affection = 10;
    stepWorld(w, 100);
    applyCommand(
      w,
      { kind: 'addRewards', rewards: { shells: 10, essences: {}, critters: {} } },
      [],
    );
    for (let i = 0; i < 20; i++) {
      hold(w);
      stepWorld(w, 100);
    }
    expect(n.behavior.itemId).not.toBe('greetGate');
  });

  it('running past makes a shy one flinch and a mischievous one give chase', () => {
    for (const [p, act] of [
      ['shy', 'flinch'],
      ['mischievous', 'chaseKeeper'],
    ] as const) {
      const w = grove(11, [p]);
      const n = w.nubbins[0]!;
      n.pos = { x: 1.5, z: 1 };
      let seen = false;
      w.keeper.pos = { x: -3, z: 0 };
      for (let i = 0; i < 20 && !seen; i++) {
        hold(w);
        w.keeper.running = true;
        w.keeper.pos = { x: w.keeper.pos.x + 0.5, z: 0 };
        stepWorld(w, 100);
        seen = n.behavior.itemId === act;
      }
      expect(seen, p).toBe(true);
    }
  });
});
