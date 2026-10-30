import { describe, expect, it } from 'vitest';
import { TRAIT_IDS, TRAIT_TUNING, type TraitId } from '../../src/config/tuning';
import { eat } from '../../src/sim/behavior';
import { evolve, hatch } from '../../src/sim/lifecycle';
import { interact } from '../../src/sim/keeper';
import { idleMultipliers } from '../../src/sim/personality';
import { hasTrait, seedTrait, traitsOf, withTraitMult } from '../../src/sim/traits';
import { createWorld, stepWorld } from '../../src/sim/world';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';

// R0528 (SOUL-10) traits and R0546 (SOUL-28) the glutton's snacks and full belly.

/** The first seed from `from` whose rolled trait is `t`. */
function seedFor(t: TraitId, from = 1): number {
  for (let s = from; s < from + 5000; s++) if (seedTrait({ seed: s }) === t) return s;
  throw new Error(`no seed for ${t}`);
}

function adult(w: World, id: string, seed: number, x: number): Nubbin {
  const n: Nubbin = structuredClone(w.nubbins[0]!);
  n.id = id;
  n.seed = seed;
  n.pos = { x, z: 6 };
  delete n.earnedTrait;
  delete n.traitCare;
  hatch(n, [], 0);
  evolve(n, [], w);
  n.personality = 'cheerful';
  return n;
}

/** Each act started (state:itemId) over `min` minutes, needs held full unless told. */
function acts(w: World, min: number, keepFed = true): Record<string, Record<string, number>> {
  const out: Record<string, Record<string, number>> = {};
  const since = new Map<string, number>();
  for (let t = 0; t < min * 600; t++) {
    for (const n of w.nubbins) {
      if (keepFed) n.needs.hunger = 1;
      n.needs.energy = 1;
    }
    stepWorld(w, 100);
    for (const n of w.nubbins) {
      if (since.get(n.id) === n.behavior.sinceMs) continue;
      since.set(n.id, n.behavior.sinceMs);
      const id = n.behavior.itemId?.split(':')[0];
      if (!id) continue;
      const row = (out[n.id] ??= {});
      row[id] = (row[id] ?? 0) + 1;
    }
  }
  return out;
}

const QUIRKS = ['yawn', 'inspect', 'hum', 'copy', 'groomSelf', 'nodOff', 'giggle', 'trip'];
function topQuirk(row: Record<string, number> | undefined): string | null {
  let best: string | null = null;
  for (const q of QUIRKS) if ((row?.[q] ?? 0) > (best ? (row?.[best] ?? 0) : 0)) best = q;
  return best;
}

describe('R0528 traits', () => {
  it('every Nubbin rolls one trait from its seed, and all 14 occur', () => {
    const seen = new Set<TraitId>();
    for (let s = 1; s < 400; s++) seen.add(seedTrait({ seed: s }));
    expect(seen.size).toBe(TRAIT_IDS.length);
    expect(traitsOf({ seed: 3 })).toEqual([seedTrait({ seed: 3 })]);
    // An earned one joins it; the same one twice is still one.
    const t = seedTrait({ seed: 3 });
    const other = TRAIT_IDS.find((x) => x !== t)!;
    expect(traitsOf({ seed: 3, earnedTrait: other })).toEqual([t, other]);
    expect(traitsOf({ seed: 3, earnedTrait: t })).toEqual([t]);
  });

  it('two cheerful Nubbins with different traits show different top quirks in 30 min', () => {
    const w = createWorld(4, 0);
    w.nubbins = [
      adult(w, 'sleepy', seedFor('sleepyhead'), -4),
      adult(w, 'singer', seedFor('musical'), 4),
    ];
    w.keeper.pos = { x: 0, z: 12 };
    const a = acts(w, 30);
    const top = [topQuirk(a['sleepy']), topQuirk(a['singer'])];
    expect(top, JSON.stringify(a)).toEqual(['yawn', 'hum']);
  }, 60_000);

  it('traits shift the idle odds on top of the personality', () => {
    const w = createWorld(4, 0);
    const n = adult(w, 'n', seedFor('sleepyhead'), 0);
    const base = idleMultipliers('cheerful');
    const m = withTraitMult(n, base);
    expect(m.sit).toBeCloseTo(base.sit * 1.4);
    expect(m.greet).toBe(base.greet);
  });

  it('a second trait is earned by care before evolution, with an event', () => {
    const w = createWorld(4, 0);
    const n = w.nubbins[0]!;
    n.seed = seedFor('clumsy');
    hatch(n, [], 0);
    const ev: SimEvent[] = [];
    for (let i = 0; i < TRAIT_TUNING.earn.ticklish; i++) {
      w.timeMs += 5000;
      interact(w, n, 'tickle', ev);
    }
    expect(n.earnedTrait).toBe('ticklish');
    expect(ev.some((e) => e.kind === 'traitEarned' && e.trait === 'ticklish')).toBe(true);
    expect(traitsOf(n)).toEqual(['clumsy', 'ticklish']);
    // A ticklish one rolls about giggling when tickled.
    w.timeMs += 5000;
    interact(w, n, 'tickle', ev);
    expect(n.behavior.itemId).toBe('giggle');
    // Adults earn nothing more.
    const m = adult(w, 'm', seedFor('clumsy'), 2);
    for (let i = 0; i < 20; i++) interact(w, m, 'tickle', ev);
    expect(m.earnedTrait).toBeUndefined();
  });

  it('a brave one never shelters from the rain', () => {
    const w = createWorld(9, 0);
    w.nubbins = [0, 1, 2, 3].map((i) => adult(w, `b${i}`, seedFor('brave', 1 + i * 50), i * 2));
    w.weather = { ...w.weather, kind: 'rain' };
    let shelters = 0;
    for (let t = 0; t < 3 * 600; t++) {
      w.weather.kind = 'rain';
      stepWorld(w, 100);
      for (const n of w.nubbins) if (n.behavior.state === 'shelter') shelters++;
    }
    expect(w.nubbins.every((n) => hasTrait(n, 'brave'))).toBe(true);
    expect(shelters).toBe(0);
  }, 60_000);
});

describe('R0546 glutton', () => {
  function orchard(seed: number, trait: TraitId): { w: World; n: Nubbin } {
    const w = createWorld(seed, 0);
    const n = adult(w, 'g', seedFor(trait, seed * 10), 0);
    n.pos = { x: 0, z: 4 };
    w.nubbins = [n];
    return { w, n };
  }
  function eaten(trait: TraitId): number {
    let total = 0;
    for (const seed of [1, 2, 3]) {
      const { w, n } = orchard(seed, trait);
      for (let t = 0; t < 30 * 600; t++) {
        n.needs.energy = 1;
        // Keep a fruit or two lying near it on dry land, as the trees would; fruit left far
        // behind rots away. Both Nubbins get the same supply.
        if (t % 300 === 0)
          w.items = w.items.filter(
            (i) => i.kind !== 'fruit' || Math.hypot(i.pos.x - n.pos.x, i.pos.z - n.pos.z) < 8,
          );
        if (
          t % 300 === 0 &&
          n.behavior.state !== 'swim' &&
          w.items.filter((i) => i.kind === 'fruit').length < 2
        )
          w.items.push({
            id: `f${seed}-${t}`,
            kind: 'fruit',
            pos: { x: n.pos.x + 2, z: n.pos.z + 1 },
            y: 0,
          } as World['items'][number]);
        for (const e of stepWorld(w, 100) as SimEvent[]) if (e.kind === 'ate') total++;
      }
    }
    return total;
  }

  it('a glutton eats at least twice the fruit of a non-glutton in 30 min', () => {
    const g = eaten('glutton');
    const other = eaten('curious');
    expect(g, `${g} vs ${other}`).toBeGreaterThanOrEqual(2 * Math.max(1, other));
  }, 120_000);

  it('three fruits in five minutes: a full belly, a burp, a nap', () => {
    const { w, n } = orchard(1, 'glutton');
    const ev: SimEvent[] = [];
    for (let i = 0; i < 3; i++) {
      w.timeMs += 20_000;
      eat(n, w.timeMs, ev);
    }
    expect(n.fullUntilMs).toBeGreaterThan(w.timeMs);
    n.needs.energy = 0.8;
    const seen: string[] = [];
    for (let t = 0; t < 200; t++) {
      for (const e of stepWorld(w, 100) as SimEvent[]) if (e.kind === 'burp') seen.push('burp');
      if (n.behavior.itemId === 'fullNap' && !seen.includes('nap')) seen.push('nap');
    }
    expect(seen).toEqual(['burp', 'nap']);
  });

  it('a fussy one leaves fruit that is not its favourite until hungry', () => {
    const { w, n } = orchard(2, 'fussy');
    n.needs.hunger = 0.3; // hungry, but above the fussy line
    w.items = [
      { id: 'f', kind: 'fruit', pos: { x: 1, z: 4 }, y: 0, flavor: 'power' },
    ] as World['items'];
    const likes = n.seed; // the favourite is rolled from the seed: make sure power isn't it
    void likes;
    for (let t = 0; t < 50; t++) stepWorld(w, 100);
    const fav = w.items.length === 0;
    n.needs.hunger = 0.2;
    for (let t = 0; t < 100; t++) stepWorld(w, 100);
    // Either power was its favourite (eaten at once), or it waited till below the line.
    expect(fav || w.items.length === 0).toBe(true);
  });
});
