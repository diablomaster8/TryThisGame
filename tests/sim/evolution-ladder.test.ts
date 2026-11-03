import { describe, expect, it } from 'vitest';
import { LIFECYCLE } from '../../src/config/tuning';
import { stageInfo, type StageKey } from '../../src/sim/growth-stage';
import { catchUp } from '../../src/sim/offline';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { speciesOf } from '../../src/sim/species';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

const MIN = 60_000;
const HOUR = 60 * MIN;

type Care = 'good' | 'poor';

/** A lone Nubbin of `species`, fresh from the egg, one stat trained to level 15. */
function solo(species: string, seed = 5): { w: World; n: Nubbin } {
  const w = createWorld(seed, 0);
  const old = w.nubbins[0]!;
  const n = createEgg(old.id, { ...old.pos }, Rng.fromSeed(seed), 'plain', species);
  n.hatchRemainingMs = 0;
  w.nubbins = [n];
  return { w, n };
}

function tend(n: Nubbin, care: Care): void {
  n.needs.hunger = 1;
  n.needs.energy = 1;
  n.needs.happiness = care === 'good' ? 90 : 10;
  n.needs.affection = care === 'good' ? 90 : 5;
  n.stats.power.points = 1500;
}

interface Trace {
  keys: StageKey[];
  indices: number[];
  species: string[];
  events: SimEvent[];
  total: number;
  w: World;
  n: Nubbin;
}

/** Live 1-minute steps under scripted care until `untilMs` of the Nubbin's own life. */
function live(species: string, care: Care, untilMs: number, seed = 5): Trace {
  const { w, n } = solo(species, seed);
  const keys: StageKey[] = [];
  const indices: number[] = [];
  const speciesSeq: string[] = [];
  const events: SimEvent[] = [];
  for (let t = 0; t < untilMs; t += MIN) {
    tend(n, care);
    events.push(...stepWorld(w, MIN));
    const info = stageInfo(n);
    if (keys[keys.length - 1] !== info.key) {
      keys.push(info.key);
      indices.push(info.index);
    }
    if (speciesSeq[speciesSeq.length - 1] !== n.species) speciesSeq.push(n.species);
  }
  return { keys, indices, species: speciesSeq, events, total: stageInfo(n).total, w, n };
}

const TOP_MS = LIFECYCLE.childMs + LIFECYCLE.cocoonMs + LIFECYCLE.thirdEvolutionMs + 30 * MIN;

describe('evolution ladders under good care', () => {
  it('Chao reaches exactly 5 stages and ends radiant', () => {
    const t = live('chao', 'good', TOP_MS);
    expect(t.total).toBe(5);
    expect(t.keys).toEqual(['hatchling', 'young', 'grown', 'radiant']);
    expect(t.n.form?.radiant).toBe(true);
    expect(t.indices).toEqual([2, 3, 4, 5]);
    expect(t.events.some((e) => e.kind === 'ascended')).toBe(true);
  });

  it('a multi-species pocket line climbs in order and ends radiant', () => {
    const t = live('zapling', 'good', TOP_MS);
    expect(t.total).toBeGreaterThanOrEqual(4);
    expect(t.species.length).toBeGreaterThanOrEqual(3);
    expect(t.keys[t.keys.length - 1]).toBe('radiant');
    expect(t.indices).toEqual([...t.indices].sort((a, b) => a - b));
    expect(new Set(t.indices).size).toBe(t.indices.length);
    expect(t.indices[t.indices.length - 1]).toBe(t.total);
  });

  it('shellbit reaches at least 4 stages and ends radiant', () => {
    const t = live('shellbit', 'good', TOP_MS);
    expect(t.total).toBeGreaterThanOrEqual(4);
    expect(t.keys[t.keys.length - 1]).toBe('radiant');
    expect(t.indices[t.indices.length - 1]).toBe(t.total);
  });

  it('a single-species pocket shows hatchling as a child, totals 4 and ends radiant', () => {
    const t = live('skyfang', 'good', TOP_MS);
    expect(speciesOf('skyfang').evolve).toBeNull();
    expect(t.keys[0]).toBe('hatchling');
    expect(t.total).toBe(4);
    expect(t.keys[t.keys.length - 1]).toBe('radiant');
    expect(t.n.form?.radiant).toBe(true);
  });

  it('a digital line has 6 stages, tops out at peak and never goes radiant', () => {
    const t = live('fuzzlet', 'good', TOP_MS);
    expect(t.total).toBe(6);
    expect(t.keys[t.keys.length - 1]).toBe('peak');
    expect(t.keys).not.toContain('radiant');
    expect(t.n.form?.radiant).toBeFalsy();
    expect(t.events.some((e) => e.kind === 'ascended')).toBe(false);
  });

  it('every family reaches at least 4 stages', () => {
    for (const id of ['chao', 'zapling', 'shellbit', 'skyfang', 'fuzzlet']) {
      const { n } = solo(id);
      expect(stageInfo(n).total).toBeGreaterThanOrEqual(4);
    }
  });
});

describe('who does not ascend', () => {
  it('poor care (low affection) never ascends', () => {
    for (const id of ['chao', 'zapling', 'skyfang']) {
      const t = live(id, 'poor', TOP_MS);
      expect(t.n.form?.radiant).toBeFalsy();
      expect(t.events.some((e) => e.kind === 'ascended')).toBe(false);
    }
  });

  it('an Eternal never gets radiant', () => {
    const { w, n } = solo('chao');
    n.stage = 'adult';
    n.form = { band: 'sun', type: 'normal', second: 'normal', leanAtEvolution: n.typeLean };
    n.eternal = 'sun';
    n.stageMs = LIFECYCLE.thirdEvolutionMs + HOUR;
    for (let i = 0; i < 30; i++) {
      tend(n, 'good');
      stepWorld(w, MIN);
    }
    expect(n.form?.radiant).toBeFalsy();
    expect(stageInfo(n).key).toBe('eternal');
  });
});

describe('determinism', () => {
  it('same seed and script give identical stages, species and rngState', () => {
    const a = live('zapling', 'good', TOP_MS, 9);
    const b = live('zapling', 'good', TOP_MS, 9);
    expect(b.species).toEqual(a.species);
    expect(b.keys).toEqual(a.keys);
    expect(b.indices).toEqual(a.indices);
    expect(b.w.rngState).toBe(a.w.rngState);
  });
});

describe('away report', () => {
  it('a long catch-up from a just-evolved Chao reports secondEvolved and ascended', () => {
    const { w, n } = solo('chao');
    for (let t = 0; t < LIFECYCLE.childMs + 5 * MIN && n.stage !== 'adult'; t += MIN) {
      tend(n, 'good');
      stepWorld(w, MIN);
    }
    for (let i = 0; i < 3 && n.stage !== 'adult'; i++) stepWorld(w, MIN);
    expect(n.stage).toBe('adult');
    expect(n.form?.second).toBeNull();
    w.settings.offlineAging.mode = 'indefinite';
    w.settings.offlineAging.allowOfflineDepartures = false;
    tend(n, 'good');
    // The care bar reads lifetime samples, so keep the sums high before leaving.
    n.happinessSum = 90 * Math.max(1, n.happinessSamples);
    const report = catchUp(w, 20 * HOUR, 0);
    const kinds = report.events.map((e) => e.kind);
    expect(kinds).toContain('secondEvolved');
    expect(kinds).toContain('ascended');
    expect(kinds.indexOf('secondEvolved')).toBeLessThan(kinds.indexOf('ascended'));
  });
});
