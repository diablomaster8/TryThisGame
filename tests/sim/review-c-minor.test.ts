/**
 * Review C (2026-10-18), minor bugs in the sim: the catch-up cap and chunks, catch-up
 * hatching with Warm hands, the live backlog cap on the clock, and the race result checks.
 */
import { describe, expect, it } from 'vitest';
import { EDU_READER_GAMES, EDU_READER_RHYMES, EDU_READER_WORDS } from '../../src/config/edu';
import { SIM } from '../../src/config/tuning';
import { makeRound } from '../../src/minigames/edu/games';
import { misspellings } from '../../src/minigames/edu/reader-games';
import { createEdu, enabledGames } from '../../src/sim/edu';
import { Rng } from '../../src/sim/rng';
import { Clock } from '../../src/sim/clock';
import { allowedSpan, catchUp, catchUpInChunks, coarseStep } from '../../src/sim/offline';
import { prizeFor, raceSeedFor } from '../../src/sim/race';
import { deserialize, serialize } from '../../src/sim/save';
import type { Command, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

describe('catch-up limits (item 13)', () => {
  const base = { capHours: 8, allowOfflineDepartures: false };
  it('never simulates more than 30 days, whatever the mode', () => {
    expect(SIM.maxAwayMs).toBe(30 * DAY);
    expect(allowedSpan(56 * 365 * DAY, { ...base, mode: 'indefinite' })).toBe(30 * DAY);
    expect(allowedSpan(10 * DAY, { ...base, mode: 'indefinite' })).toBe(10 * DAY);
    expect(allowedSpan(40 * DAY, { ...base, mode: 'capped', capHours: 720 })).toBe(30 * DAY);
  });

  it('treats a gap that is not a number as no gap', () => {
    expect(allowedSpan(Number.NaN, { ...base, mode: 'indefinite' })).toBe(0);
  });

  it('reads a save with no timestamp as 0, which the game takes as no gap', () => {
    const w = createWorld(3, 0);
    const data = JSON.parse(serialize(w, 1234)) as Record<string, unknown>;
    delete data.savedAtWallMs;
    expect(deserialize(JSON.stringify(data)).savedAtWallMs).toBe(0);
  });
});

describe('catch-up in chunks (item 12)', () => {
  it('yields between chunks and ends where the one-shot catch-up ends', () => {
    const a = createWorld(21, 0);
    const b = createWorld(21, 0);
    a.settings.offlineAging.mode = 'indefinite';
    b.settings.offlineAging.mode = 'indefinite';
    const one = catchUp(a, 2 * DAY + 4321, 50);
    const run = catchUpInChunks(b, 2 * DAY + 4321, 50, 500);
    const fractions: number[] = [];
    let next = run.next();
    while (!next.done) {
      fractions.push(next.value);
      next = run.next();
    }
    expect(fractions.length).toBe(Math.floor((2 * DAY) / SIM.coarseStepMs / 500));
    expect(fractions.every((f, i) => f > 0 && f < 1 && (i === 0 || f > fractions[i - 1]!))).toBe(
      true,
    );
    expect(next.value).toEqual(one);
    expect(serialize(b, 0)).toBe(serialize(a, 0));
  });
});

describe('catch-up hatching (item 28)', () => {
  it('uses the Warm hands hatch speed like live play', () => {
    const plain = createWorld(5, 0);
    const warm = createWorld(5, 0);
    warm.skills.warmHands = true;
    const events: SimEvent[] = [];
    coarseStep(plain, SIM.coarseStepMs, events);
    coarseStep(warm, SIM.coarseStepMs, events);
    const egg = (w: World) => w.nubbins.find((n) => n.stage === 'egg')!;
    const start = egg(createWorld(5, 0)).hatchRemainingMs;
    expect(start - egg(plain).hatchRemainingMs).toBe(SIM.coarseStepMs);
    expect(start - egg(warm).hatchRemainingMs).toBeCloseTo(SIM.coarseStepMs * 1.1, 6);
  });
});

describe('live backlog (item 14)', () => {
  it('keeps at most the cap waiting, as fine steps, and drops the rest', () => {
    const clock = new Clock();
    clock.setTimeScale(1000);
    const steps = clock.advance(5000);
    expect(steps).toBe(SIM.maxStepsPerFrame);
    clock.capBacklog(SIM.maxLiveBacklogMs);
    // Nothing is taken as coarse time: what is left runs as fine steps on later frames.
    const later = clock.advance(0, Number.MAX_SAFE_INTEGER);
    expect(later * SIM.stepMs).toBe(SIM.maxLiveBacklogMs);
  });
});

describe('race results (item 28)', () => {
  const result = (over: Partial<Extract<Command, { kind: 'raceResult' }>>): Command => ({
    kind: 'raceResult',
    nubbinId: 'n1',
    course: 'meadow',
    tier: 1,
    placement: 1,
    shells: prizeFor(1, 1),
    hat: null,
    ...over,
  });

  it('refuses a tier that is not open yet and an unknown course', () => {
    const w = createWorld(1, 0);
    const events: SimEvent[] = [];
    applyCommand(w, result({ tier: 3, shells: prizeFor(1, 3) }), events);
    applyCommand(w, result({ course: 'nowhere' }), events);
    expect(w.races).toEqual({});
    expect(w.inventory.shells).toBe(createWorld(1, 0).inventory.shells);
    expect(w.raceRuns).toBe(0);
  });

  it('pays no more than the placement earns and never adds a hat twice', () => {
    const w = createWorld(1, 0);
    const before = w.inventory.shells;
    const events: SimEvent[] = [];
    applyCommand(w, result({ shells: 99999, hat: 'crown' }), events);
    applyCommand(w, result({ hat: 'crown' }), events);
    applyCommand(w, result({ tier: 2, placement: 4, shells: 50, hat: 'bow' }), events);
    expect(w.inventory.hats.filter((h) => h === 'crown')).toHaveLength(1);
    expect(w.inventory.hats).not.toContain('bow');
    expect(w.inventory.shells - before).toBe(2 * prizeFor(1, 1));
    expect(w.races.meadow).toBe(1);
  });

  it('takes the race seed from the world and keeps it until a result is recorded', () => {
    const w = createWorld(77, 0);
    const first = raceSeedFor(w, 'meadow', 1);
    expect(raceSeedFor(w, 'meadow', 1)).toBe(first);
    expect(raceSeedFor(createWorld(78, 0), 'meadow', 1)).not.toBe(first);
    applyCommand(w, result({ placement: 5, shells: 0 }), []);
    expect(w.raceRuns).toBe(1);
    expect(raceSeedFor(w, 'meadow', 1)).not.toBe(first);
  });
});

describe('Learning Grove reader band (item 18)', () => {
  it('offers readers only the three reader games', () => {
    const w = createWorld(9, 0);
    w.edu = createEdu(6, 'reader');
    expect(enabledGames(w)).toEqual([...EDU_READER_GAMES]);
    w.edu.games.colours = true;
    expect(enabledGames(w)).not.toContain('colours');
    w.edu.band = 'sprout';
    expect(enabledGames(w)).toContain('colours');
  });

  it('builds reader rounds with one right answer and distinct options', () => {
    const rng = new Rng(4242);
    for (const game of EDU_READER_GAMES) {
      for (let i = 0; i < 200; i++) {
        const r = makeRound(game, 6, rng, undefined, 'reader');
        expect(r.game).toBe(game);
        expect(r.answer).toBeGreaterThanOrEqual(0);
        expect(r.answer).toBeLessThan(r.options.length);
        expect(r.options.length).toBeGreaterThanOrEqual(3);
        const keys = r.options.map((o) => JSON.stringify(o));
        expect(new Set(keys).size).toBe(keys.length);
      }
    }
  });

  it('spells every reader word with at least three wrong spellings', () => {
    for (const w of EDU_READER_WORDS) {
      const wrong = misspellings(w.word);
      expect(wrong.length, w.word).toBeGreaterThanOrEqual(3);
      expect(wrong).not.toContain(w.word);
    }
  });

  it('keeps rhyme families apart', () => {
    const all = EDU_READER_RHYMES.flat();
    expect(new Set(all).size).toBe(all.length);
  });
});
