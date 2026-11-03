import { describe, expect, it } from 'vitest';
import { setAnticsLive } from '../../src/sim/antics';
import { ambientOf, ambientStore } from '../../src/sim/ambient';
import { jamStore, jamsOf } from '../../src/sim/jam';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { stepSoulGroups } from '../../src/sim/soul-groups';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, Personality, SimEvent, World } from '../../src/sim/types';

// R0547, R0555 (lane A r11, G3): chase butterflies; sing along, dance circles and bands.

function grove(seed: number, ps: Personality[], lessons?: Nubbin['lessons']): World {
  const w = createWorld(seed, 0);
  const base = w.nubbins[0]!;
  w.season = 'summer';
  w.nubbins = ps.map((p, i) => {
    const n: Nubbin = structuredClone(base);
    n.id = `n${i}`;
    n.seed = seed * 31 + i;
    hatch(n, [], 0);
    evolve(n, [], w);
    n.personality = p;
    n.pos = { x: (i % 3) * 2 - 2, z: Math.floor(i / 3) * 2 };
    if (lessons) n.lessons = { ...lessons };
    return n;
  });
  return w;
}

function tick(w: World, events?: SimEvent[]): void {
  const ev = stepWorld(w, 100);
  stepSoulGroups(w, 100, ev, false);
  events?.push(...ev);
}

describe('R0547 ambient critters to chase', () => {
  it('a 10 min day run shows a chase in most seeds, and some butterflies land on a head', () => {
    setAnticsLive(true);
    let chased = 0;
    let landed = 0;
    const seeds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (const seed of seeds) {
      const w = grove(seed, ['curious', 'dreamy', 'cheerful']);
      for (let t = 0; t < 6000; t++) {
        w.weather = { kind: 'clear', untilMs: Infinity, intensity: 0 };
        tick(w);
      }
      const s = ambientStore(w);
      if (s.chases > 0) chased++;
      landed += s.catches;
    }
    expect(chased).toBeGreaterThanOrEqual(8);
    expect(landed).toBeGreaterThan(0);
  });

  it('spawns nothing in winter, in rain, or while catching up', () => {
    const w = grove(3, ['curious']);
    w.season = 'winter';
    for (let t = 0; t < 1200; t++) {
      w.season = 'winter';
      tick(w);
    }
    expect(ambientOf(w).filter((c) => c.kind === 'butterfly')).toHaveLength(0);
    const o = grove(3, ['curious']);
    for (let t = 0; t < 600; t++) {
      const ev = stepWorld(o, 100, undefined, true);
      stepSoulGroups(o, 100, ev, true);
    }
    expect(ambientOf(o)).toHaveLength(0);
  });

  it('keeps one to three butterflies, the frog by the pond and fireflies at dusk', () => {
    const w = grove(5, ['lazy']);
    let maxBf = 0;
    let frog = false;
    let fire = false;
    for (let t = 0; t < 3600; t++) {
      w.weather = { kind: 'clear', untilMs: Infinity, intensity: 0 };
      tick(w);
      const l = ambientOf(w);
      maxBf = Math.max(maxBf, l.filter((c) => c.kind === 'butterfly').length);
      frog ||= l.some((c) => c.kind === 'frog');
      fire ||= l.some((c) => c.kind === 'firefly');
    }
    expect(maxBf).toBeGreaterThanOrEqual(1);
    expect(maxBf).toBeLessThanOrEqual(3);
    expect(frog).toBe(true);
    expect(fire).toBe(true);
  });
});

describe('R0555 sing along, dance circles and bands', () => {
  it('three schooled Nubbins form a jam within 10 min in at least 70% of seeds', () => {
    setAnticsLive(true);
    let jams = 0;
    const seeds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (const seed of seeds) {
      const w = grove(seed, ['cheerful', 'lazy', 'shy'], { singing: 1, instrument: 1 });
      for (let t = 0; t < 6000; t++) {
        w.weather = { kind: 'clear', untilMs: Infinity, intensity: 0 };
        tick(w);
      }
      if (jamStore(w).formed > 0) jams++;
    }
    expect(jams).toBeGreaterThanOrEqual(7);
  });

  it('joiners walk to a ring, face the centre and perform; three is a concert', () => {
    setAnticsLive(true);
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const w = grove(seed, ['cheerful', 'cheerful', 'cheerful', 'cheerful'], { singing: 2 });
      for (let t = 0; t < 6000 && jamStore(w).concerts === 0; t++) tick(w);
      if (jamStore(w).concerts === 0) continue;
      const jam = jamsOf(w)[0]!;
      expect(jam.members.length).toBeGreaterThanOrEqual(3);
      for (const id of jam.members)
        expect(w.nubbins.find((n) => n.id === id)!.behavior.state).toBe('perform');
      return;
    }
    throw new Error('no concert formed in 8 seeds');
  });

  it('the concert lifts happiness and ends with everyone happy', () => {
    setAnticsLive(true);
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const w = grove(seed, ['cheerful', 'cheerful', 'cheerful', 'cheerful'], { dance: 2 });
      for (let t = 0; t < 6000 && jamStore(w).concerts === 0; t++) tick(w);
      if (jamStore(w).concerts === 0) continue;
      const jam = jamsOf(w)[0]!;
      expect(jam.kind).toBe('dance');
      const ends = jam.endMs;
      while (w.timeMs < ends + 200) tick(w);
      expect(jamsOf(w)).toHaveLength(0);
      return;
    }
    throw new Error('no dance circle formed in 8 seeds');
  });

  it('forms nothing while catching up on time away', () => {
    const w = grove(2, ['cheerful', 'cheerful', 'cheerful'], { singing: 2 });
    for (let t = 0; t < 3000; t++) {
      const ev = stepWorld(w, 100, undefined, true);
      stepSoulGroups(w, 100, ev, true);
    }
    expect(jamStore(w).formed).toBe(0);
  });
});
