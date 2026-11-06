import { describe, expect, it } from 'vitest';
import { EXPEDITION, SIM } from '../../src/config/tuning';
import { createRun, jumpPressed, jumpReleased, stepRun } from '../../src/minigames/expedition/run';
import { createFunRun, funRunTip } from '../../src/sim/fun-run';
import { createEgg } from '../../src/sim/nubbin';
import { cheer, cheerReady, stepRace } from '../../src/sim/race';
import { Rng } from '../../src/sim/rng';
import { STAT_KEYS, type Nubbin, type SimEvent } from '../../src/sim/types';
import { enterDungeon } from '../../src/sim/dungeon';
import { glowBlocks, glowPuzzle, glowSticker } from '../../src/sim/dungeon-glow';
import { GLOW_CAVE } from '../../src/config/tuning-kids';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

function nubbin(id: string, name: string, level: number): Nubbin {
  const n = createEgg(id, { x: 0, z: 0 }, Rng.fromSeed(3));
  n.stage = 'child';
  n.name = name;
  for (const k of STAT_KEYS) n.stats[k].points = level * 100;
  return n;
}

/** R0689: Shell Dash, the sprout Expedition. */
describe('Shell Dash (R0689)', () => {
  it('lasts 30 s, takes no Shells on a bump, and counts aloud in fives', () => {
    const run = createRun(9, true);
    expect(run.durationMs).toBe(EXPEDITION.kid.durationMs);
    const calls: number[] = [];
    let last = 0;
    let bumps = 0;
    // A child who taps now and then, often enough to collect and bump.
    for (let t = 0; t < 40_000 && !run.finished; t += 25) {
      if (run.onGround && Math.floor(t / 25) % 12 === 0) jumpPressed(run);
      jumpReleased(run);
      stepRun(run, 25);
      calls.push(...run.calls.splice(0));
      expect(run.shells).toBeGreaterThanOrEqual(last);
      last = run.shells;
      if (run.lastEvent?.kind === 'hit') bumps = run.hits;
    }
    expect(run.finished).toBe(true);
    expect(run.timeMs).toBeGreaterThanOrEqual(30_000);
    expect(run.timeMs).toBeLessThan(30_100);
    expect(bumps).toBeGreaterThan(0);
    expect(calls.length).toBeGreaterThanOrEqual(3);
    expect(calls.slice(0, 3)).toEqual([5, 10, 15]);
    expect(run.fun.mostDropped).toBe(0);
  });

  it('a jump is one height whether or not it is held, and the normal run is unchanged', () => {
    const tap = createRun(1, true);
    const hold = createRun(1, true);
    jumpPressed(tap);
    jumpPressed(hold);
    let peakTap = Infinity;
    let peakHold = Infinity;
    for (let i = 0; i < 40; i++) {
      jumpReleased(tap);
      stepRun(tap, 25);
      stepRun(hold, 25);
      peakTap = Math.min(peakTap, tap.runnerY);
      peakHold = Math.min(peakHold, hold.runnerY);
    }
    expect(peakHold).toBeCloseTo(peakTap, 5);
    expect(createRun(1).durationMs).toBe(EXPEDITION.durationMs);
    expect(createRun(1).kid).toBe(false);
  });
});

/** R0688: Fun Run, the friendly race. */
describe('Fun Run (R0688)', () => {
  it('has three rivals (own Nubbins first, then Fern’s), a short swim, run and fly course', () => {
    const world = createWorld(1, 0);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'eduStart', age: 4 }, events);
    const runner = nubbin('a', 'Nono', 20);
    world.nubbins = [runner, nubbin('b', 'Pim', 10)];
    const race = createFunRun(world, runner, 5);
    expect(race.friendly).toBe(true);
    expect(race.course.sections.map((s) => s.kind)).toEqual(['swim', 'run', 'fly']);
    expect(race.racers).toHaveLength(4);
    expect(race.racers.map((r) => r.name).slice(1)).toEqual(['Pim', 'Fern’s Moss', 'Fern’s Dot']);
    expect(funRunTip(race)).toMatch(/Nono faster/);
  });

  it('finishes without prizes or tier unlocks and pays a ribbon', () => {
    const world = createWorld(1, 0);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'eduStart', age: 4 }, events);
    const runner = nubbin('a', 'Nono', 20);
    world.nubbins = [runner];
    const race = createFunRun(world, runner, 5);
    const shells = world.inventory.shells;
    const runs = world.raceRuns;
    while (!race.finished) {
      if (cheerReady(race)) cheer(race);
      stepRace(race, SIM.stepMs);
    }
    expect(race.racers.every((r) => r.finishedAtMs !== null)).toBe(true);
    applyCommand(world, { kind: 'funRunDone', nubbinId: runner.id }, events);
    expect(world.edu!.ribbons).toBe(1);
    expect(world.races).toEqual({});
    expect(world.raceRuns).toBe(runs);
    expect(world.inventory.shells).toBe(shells);
  });
});

/** R0690: the sprout's Glow Cave. */
describe('Glow Cave (R0690)', () => {
  function sproutWorld() {
    const world = createWorld(4, 0);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'eduStart', age: 4 }, events);
    const n = nubbin('a', 'Nono', 10);
    world.nubbins = [n];
    world.inventory.shells = 40;
    const ok = enterDungeon(world, false, Rng.fromSeed(7), events);
    return { world, events, ok };
  }

  it('is a glow run with a puzzle on every floor, at most 3 floors, never taking Shells', () => {
    const { world, events, ok } = sproutWorld();
    expect(ok).toBe(true);
    const run = world.dungeon!;
    expect(run.glow).toBe(true);
    const kinds = new Set<string>();
    for (let depth = 1; depth <= GLOW_CAVE.floors; depth++) {
      kinds.add(glowPuzzle(run.seed, depth).kind);
      expect(glowPuzzle(run.seed, depth)).toEqual(glowPuzzle(run.seed, depth));
    }
    expect(kinds).toEqual(new Set(['gems', 'door']));
    // The way down waits for the puzzle; a wrong floor's report is ignored.
    expect(glowBlocks(run, 'down')).toBe(true);
    applyCommand(world, { kind: 'glowSolve', depth: 2 }, events);
    expect(glowBlocks(run, 'down')).toBe(true);
    applyCommand(world, { kind: 'glowSolve', depth: 1 }, events);
    expect(glowBlocks(run, 'down')).toBe(false);
    // The last floor has no way further down, and its chest waits for its own puzzle.
    run.depth = GLOW_CAVE.floors;
    expect(glowBlocks(run, 'chest')).toBe(true);
    applyCommand(world, { kind: 'glowSolve', depth: GLOW_CAVE.floors }, events);
    expect(glowBlocks(run, 'down')).toBe(true);
    expect(glowBlocks(run, 'chest')).toBe(false);
  });

  it('shy strays never snatch, whatever the Keeper carries, and the chest gives a sticker', () => {
    const { world, events } = sproutWorld();
    const shells = world.inventory.shells;
    for (let i = 0; i < 3000 && world.dungeon; i++) events.push(...stepWorld(world, 100));
    expect(world.inventory.shells).toBeGreaterThanOrEqual(shells);
    const run = world.dungeon;
    if (run) {
      glowSticker(world, run, events);
      expect(world.edu!.caveStickers).toBe(1);
    }
  });
});
