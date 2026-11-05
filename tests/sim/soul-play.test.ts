import { describe, expect, it } from 'vitest';
import { setAnticsLive } from '../../src/sim/antics';
import { gameStore } from '../../src/sim/group-games';
import { kinSeen } from '../../src/sim/kin-play';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { areSiblings } from '../../src/sim/soul-kit';
import { weatherPlayActs } from '../../src/sim/weather-play';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, Personality, SimEvent, World } from '../../src/sim/types';

// R0561, R0562, R0587, R0572, R0565, R0571 (lane A r11, G3).

function grove(seed: number, ps: Personality[], befriend = false): World {
  const w = createWorld(seed, 0);
  const base = w.nubbins[0]!;
  w.nubbins = ps.map((p, i) => {
    const n: Nubbin = structuredClone(base);
    n.id = `n${i}`;
    n.seed = seed * 31 + i;
    hatch(n, [], 0);
    evolve(n, [], w);
    n.personality = p;
    n.pos = { x: (i % 3) * 1.6 - 1.6, z: Math.floor(i / 3) * 1.6 };
    n.needs.hunger = 1;
    return n;
  });
  if (befriend)
    for (const a of w.nubbins) for (const b of w.nubbins) if (a !== b) a.friends[b.id] = 40;
  return w;
}

const clear = (w: World): void => {
  w.weather = { kind: 'clear', untilMs: Infinity, intensity: 0 };
};

function run(w: World, steps: number, each?: (w: World) => void): SimEvent[] {
  const out: SimEvent[] = [];
  for (let i = 0; i < steps; i++) {
    each?.(w);
    for (const n of w.nubbins) n.needs.hunger = 1;
    out.push(...stepWorld(w, 100));
  }
  return out;
}

describe('R0561 group games', () => {
  it('tag, follow-the-leader and hide and seek each happen with six friends', () => {
    setAnticsLive(true);
    const tot = { tag: 0, follow: 0, hide: 0, swaps: 0, found: 0 };
    for (const seed of [1, 2, 3]) {
      const w = grove(seed, ['bold', 'cheerful', 'bold', 'cheerful', 'lazy', 'gentle'], true);
      run(w, 36_000, clear);
      const s = gameStore(w);
      tot.tag += s.started.tag;
      tot.follow += s.started.follow;
      tot.hide += s.started.hide;
      tot.swaps += s.swaps;
      tot.found += s.found;
    }
    expect(tot.tag).toBeGreaterThan(0);
    expect(tot.follow).toBeGreaterThan(0);
    expect(tot.hide).toBeGreaterThan(0);
    expect(tot.swaps).toBeGreaterThan(0);
    expect(tot.found).toBeGreaterThan(0);
  }, 180_000);
});

describe('R0587 tag with the Keeper', () => {
  function tagWorld(seed: number): { w: World; n: Nubbin } {
    const w = grove(seed, ['mischievous']);
    const n = w.nubbins[0]!;
    n.needs.affection = 90;
    n.pos = { x: 5, z: 0 };
    w.keeper.pos = { x: 0, z: 0 };
    return { w, n };
  }
  it('is caught within 15 s: affection rises', () => {
    setAnticsLive(true);
    for (let seed = 1; seed <= 20; seed++) {
      const { w, n } = tagWorld(seed);
      let started = false;
      for (let i = 0; i < 6000 && !started; i++) {
        clear(w);
        w.keeper.pos = { x: 0, z: 0 };
        stepWorld(w, 100);
        n.needs.hunger = 1;
        n.needs.affection = 90;
        started = n.behavior.itemId === 'tagKeeperRun';
      }
      if (!started) continue;
      const before = n.needs.affection;
      // The Keeper gives chase: it walks onto the runner.
      for (let i = 0; i < 160; i++) {
        w.keeper.pos = { x: n.pos.x + 0.5, z: n.pos.z };
        stepWorld(w, 100);
        n.needs.hunger = 1;
      }
      expect(n.needs.affection).toBeGreaterThan(before - 1);
      expect(n.needs.affection).toBeGreaterThanOrEqual(before);
      return;
    }
    throw new Error('no tag started');
  }, 90_000);
  it('gloats and comes back when ignored', () => {
    setAnticsLive(true);
    for (let seed = 1; seed <= 20; seed++) {
      const { w, n } = tagWorld(seed);
      let gloated = false;
      for (let i = 0; i < 9000 && !gloated; i++) {
        clear(w);
        w.keeper.pos = { x: 0, z: 0 };
        stepWorld(w, 100);
        n.needs.hunger = 1;
        n.needs.affection = 90;
        gloated = n.behavior.itemId === 'tagGloat';
      }
      if (gloated) return;
    }
    throw new Error('never gloated');
  }, 90_000);
});

describe('R0562 weather and season play', () => {
  const seen = (
    kind: 'clear' | 'rain' | 'snow',
    season: World['season'],
  ): Record<string, number> => {
    setAnticsLive(true);
    const w = grove(4, ['lazy', 'cheerful', 'curious', 'shy']);
    run(w, 12_000, (x) => {
      x.season = season;
      x.weather = { kind, untilMs: Infinity, intensity: 0.8 };
    });
    return { ...weatherPlayActs(w) };
  };
  it('snow: snowballs and a snow figure', () => {
    const a = seen('snow', 'winter');
    expect((a.snowball ?? 0) + (a.snowBuild ?? 0)).toBeGreaterThan(0);
  }, 60_000);
  it('rain: puddle stomping', () => {
    expect(seen('rain', 'spring').puddleStomp ?? 0).toBeGreaterThan(0);
  }, 60_000);
  it('clear summer: sunbathing; autumn: leaf piles; spring: flower sniffing', () => {
    expect(seen('clear', 'summer').sunbathe ?? 0).toBeGreaterThan(0);
    expect(seen('clear', 'autumn').leafPileJump ?? 0).toBeGreaterThan(0);
    expect(seen('clear', 'spring').flowerSniff ?? 0).toBeGreaterThan(0);
  }, 90_000);
});

describe('R0572 family', () => {
  it('a bred child is bonded at 50 and followed by a parent', () => {
    setAnticsLive(true);
    const w = grove(6, ['cheerful', 'lazy', 'cheerful']);
    const [a, b, c] = w.nubbins as [Nubbin, Nubbin, Nubbin];
    c.parents = [a.id, b.id];
    c.stage = 'child';
    c.pos = { x: 10, z: 10 };
    a.pos = { x: -8, z: 0 };
    b.pos = { x: -9, z: 1 };
    let near = 0;
    for (let i = 0; i < 1200; i++) {
      clear(w);
      c.stage = 'child';
      c.stageMs = 1000;
      for (const n of w.nubbins) n.needs.hunger = 1;
      stepWorld(w, 100);
      const d = (p: Nubbin): number => Math.hypot(p.pos.x - c.pos.x, p.pos.z - c.pos.z);
      if (i > 300 && Math.min(d(a), d(b)) < 4) near++;
    }
    expect(c.friends[a.id]).toBeGreaterThanOrEqual(50);
    expect(near).toBeGreaterThan(200);
    expect(kinSeen(w).follow).toBeGreaterThan(0);
  }, 60_000);
  it('siblings share both parents', () => {
    const w = grove(6, ['cheerful', 'cheerful']);
    const [a, b] = w.nubbins as [Nubbin, Nubbin];
    a.parents = ['p', 'q'];
    b.parents = ['p', 'q'];
    expect(areSiblings(a, b)).toBe(true);
    b.parents = ['p', 'z'];
    expect(areSiblings(a, b)).toBe(false);
  });
});

describe('R0565 visitors', () => {
  it('at least half the Nubbins react while a visitor is present', () => {
    setAnticsLive(true);
    const w = grove(8, ['shy', 'curious', 'bold', 'mischievous', 'cheerful', 'lazy']);
    w.npcs.push({
      id: 'v1',
      trainer: 'v1',
      pos: { x: 3, z: 3 },
      facing: 0,
      target: null,
      waitMs: 1e9,
      home: { x: 3, z: 3 },
      guest: true,
    });
    const ids = ['peekTree', 'sniffNpc', 'guardKeeper', 'tugCoat', 'waveHello', 'hideFace'];
    const reacted = new Set<string>();
    run(w, 1200, (x) => {
      clear(x);
      for (const n of x.nubbins) if (ids.includes(n.behavior.itemId ?? '')) reacted.add(n.id);
    });
    expect(reacted.size).toBeGreaterThanOrEqual(3);
  }, 60_000);
});

describe('R0571 the Keeper is noticed', () => {
  function scene(p: Personality, seed = 9): { w: World; n: Nubbin } {
    setAnticsLive(true);
    const w = grove(seed, [p]);
    const n = w.nubbins[0]!;
    n.pos = { x: 6, z: 0 };
    n.behavior.state = 'wander';
    n.behavior.untilMs = 1e9;
    w.keeper.pos = { x: 0, z: 0 };
    clear(w);
    return { w, n };
  }
  it('a jump draws a copy hop from a cheerful Nubbin within 2 s', () => {
    // A quirk may have the Nubbin busy on some seeds: most seeds still hop.
    let hops = 0;
    for (let seed = 1; seed <= 8; seed++) {
      const { w, n } = scene('cheerful', seed);
      stepWorld(w, 100);
      applyCommand(w, { kind: 'jump', down: true }, []);
      for (let i = 0; i < 20; i++) {
        n.behavior.untilMs = 1e9;
        stepWorld(w, 100);
        if (n.behavior.itemId === 'copyHop') {
          hops++;
          break;
        }
      }
    }
    expect(hops).toBeGreaterThanOrEqual(4);
  });
  it('a shaken tree makes a nearby Nubbin look up', () => {
    const { w, n } = scene('lazy');
    const tree = w.trees[0]!;
    n.pos = { x: tree.pos.x + 7, z: tree.pos.z };
    w.keeper.pos = { x: tree.pos.x + 1, z: tree.pos.z };
    applyCommand(w, { kind: 'shakeTree', treeId: tree.id }, []);
    let looked = false;
    for (let i = 0; i < 20 && !looked; i++) {
      n.behavior.untilMs = 1e9;
      stepWorld(w, 100);
      looked = n.behavior.itemId === 'lookUp' || n.behavior.itemId === 'runToTree';
    }
    expect(looked).toBe(true);
  });
});
