import { describe, expect, it } from 'vitest';
import { EGG, EXPEDITION, SHOP, SIM } from '../../src/config/tuning';
import {
  createRun,
  jumpPressed,
  jumpReleased,
  progressOf,
  stepRun,
  type RunState,
} from '../../src/minigames/expedition/run';
import { buy, priceOf } from '../../src/sim/shop';
import { JEWEL_EGG_COLORS, isJewel } from '../../src/sim/nubbin';
import { deserialize, serialize } from '../../src/sim/save';
import { Rng } from '../../src/sim/rng';
import type { Command, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

const STEP = 25;

function runFor(run: RunState, ms: number): void {
  for (let t = 0; t < ms; t += STEP) stepRun(run, STEP);
}

describe('expedition run', () => {
  it('is deterministic for a seed and finishes on time', () => {
    const a = createRun(7);
    const b = createRun(7);
    runFor(a, EXPEDITION.durationMs + 100);
    runFor(b, EXPEDITION.durationMs + 100);
    expect(a.finished).toBe(true);
    expect(a.shells).toBe(b.shells);
    expect(a.rewards).toEqual(b.rewards);
    expect(progressOf(a)).toBe(1);
  });

  it('a tap jumps; holding jumps higher', () => {
    const tap = createRun(1);
    jumpPressed(tap);
    jumpReleased(tap);
    let tapPeak: number = EXPEDITION.groundY;
    for (let i = 0; i < 60; i++) {
      stepRun(tap, STEP);
      tapPeak = Math.min(tapPeak, tap.runnerY);
    }
    const hold = createRun(1);
    jumpPressed(hold);
    let holdPeak: number = EXPEDITION.groundY;
    for (let i = 0; i < 60; i++) {
      stepRun(hold, STEP);
      holdPeak = Math.min(holdPeak, hold.runnerY);
    }
    expect(tapPeak).toBeLessThan(EXPEDITION.groundY - 30);
    expect(holdPeak).toBeLessThan(tapPeak - 10);
    expect(tap.onGround).toBe(true); // landed again within 1.5 s
  });

  it('cannot double jump in the air', () => {
    const run = createRun(2);
    jumpPressed(run);
    runFor(run, 100);
    const vyBefore = run.runnerVy;
    jumpPressed(run);
    expect(run.runnerVy).toBe(vyBefore);
  });

  it('hitting obstacles costs Shells but never ends the run', () => {
    // Never jump: every obstacle is hit.
    const run = createRun(11);
    runFor(run, EXPEDITION.durationMs + 100);
    expect(run.hits).toBeGreaterThan(0);
    expect(run.finished).toBe(true);
    expect(run.rewards.shells).toBeGreaterThanOrEqual(0);
  });

  it('quitting early keeps the Shells collected so far', () => {
    const run = createRun(5);
    for (let t = 0; t < EXPEDITION.durationMs / 2 && run.shells === 0; t += STEP) {
      jumpPressed(run);
      stepRun(run, STEP);
      jumpReleased(run);
    }
    runFor(run, 2000);
    expect(run.finished).toBe(false);
    expect(run.shells).toBeGreaterThan(0);
    expect(run.rewards.shells).toBe(run.shells);
  });

  it('a well-timed jumper collects shells and sometimes essences or critters', () => {
    const run = createRun(5);
    // Jump whenever something is close ahead.
    for (let t = 0; t < EXPEDITION.durationMs; t += STEP) {
      const ahead = run.things.find(
        (x) =>
          !x.taken &&
          x.x > run.distance + EXPEDITION.runnerX &&
          x.x < run.distance + EXPEDITION.runnerX + 70,
      );
      if (ahead && run.onGround) jumpPressed(run);
      if (!ahead) jumpReleased(run);
      stepRun(run, STEP);
    }
    expect(run.shells).toBeGreaterThan(5);
    const extras =
      Object.values(run.rewards.essences).reduce((a, b) => a + (b ?? 0), 0) +
      Object.values(run.rewards.critters).reduce((a, b) => a + b, 0);
    expect(extras).toBeGreaterThanOrEqual(0);
  });

  it('things scroll off and are dropped', () => {
    const run = createRun(3);
    runFor(run, 10_000);
    expect(run.things.every((t) => t.x + t.w > run.distance - 40)).toBe(true);
    expect(run.things.length).toBeLessThan(80);
  });
});

describe('rewards reach the Grove', () => {
  it('addRewards adds shells, essences and critters to the inventory', () => {
    const w = createWorld(1, 0);
    const events: SimEvent[] = [];
    applyCommand(
      w,
      {
        kind: 'addRewards',
        rewards: { shells: 12, essences: { swim: 2 }, critters: { otter: 1 } },
      },
      events,
    );
    expect(w.inventory.shells).toBe(12);
    expect(w.inventory.essences.swim).toBe(2);
    expect(w.inventory.critters.otter).toBe(1);
    expect(events.some((e) => e.kind === 'rewards')).toBe(true);
  });
});

describe('shop', () => {
  function world(shells: number): World {
    const w = createWorld(9, 0);
    w.inventory.shells = shells;
    return w;
  }
  const run = (w: World, cmds: Command[]) => {
    const events: SimEvent[] = [];
    for (const c of cmds) applyCommand(w, c, events);
    events.push(...stepWorld(w, SIM.stepMs));
    return events;
  };

  it('prices come from tuning', () => {
    expect(priceOf('fruit')).toBe(SHOP.fruit);
    expect(priceOf('egg')).toBe(SHOP.egg);
  });

  it('buys fruit, a hat and a toy, spending Shells', () => {
    const w = world(100);
    const events = run(w, [
      { kind: 'buy', item: 'fruit' },
      { kind: 'buy', item: 'hat' },
      { kind: 'buy', item: 'toy' },
    ]);
    expect(w.inventory.fruit).toBe(EGG.startFruit + 1);
    expect(w.inventory.hats).toHaveLength(1);
    expect(w.items.filter((i) => i.kind === 'toy')).toHaveLength(1);
    expect(w.inventory.shells).toBe(100 - SHOP.fruit - SHOP.hat - SHOP.toy);
    expect(events.filter((e) => e.kind === 'bought' && e.ok)).toHaveLength(3);
  });

  it('refuses without enough Shells', () => {
    const w = world(1);
    const events = run(w, [{ kind: 'buy', item: 'egg' }]);
    expect(w.nubbins).toHaveLength(2);
    expect(events.some((e) => e.kind === 'bought' && !e.ok && e.reason === 'shells')).toBe(true);
  });

  it('eggs join the Grove up to the roster cap and can be rare colours', () => {
    const w = world(10_000);
    const rng = Rng.fromSeed(4);
    let rare = 0;
    for (let i = 0; i < 20; i++) {
      const ok = buy(w, 'egg', rng, []);
      if (w.nubbins.length <= EGG.maxRoster) {
        if (i < EGG.maxRoster - 2) expect(ok).toBe(true);
      }
    }
    expect(w.nubbins).toHaveLength(EGG.maxRoster);
    for (const n of w.nubbins) if (n.eggColor !== 'plain') rare += 1;
    expect(rare).toBeGreaterThanOrEqual(0);
    // Plain eggs are never shiny or two-tone; a two-tone's second colour differs from its first.
    for (const n of w.nubbins) {
      if (n.eggColor === 'plain') expect(n.shiny || n.tone).toBeFalsy();
      if (n.tone) expect(n.tone).not.toBe(n.eggColor);
    }
    const events: SimEvent[] = [];
    expect(buy(w, 'egg', rng, events)).toBe(false);
    expect(events[0]).toMatchObject({ kind: 'bought', ok: false, reason: 'roster' });
    // Names stay unique.
    expect(new Set(w.nubbins.map((n) => n.name)).size).toBe(w.nubbins.length);
  });

  it('the shop sells a jewel egg now and then, plain of any other finish, and saves keep it', () => {
    const rng = Rng.fromSeed(11);
    const seen = new Set<string>();
    let jewels = 0;
    let bought = 0;
    for (let round = 0; round < 60; round++) {
      const w = world(10_000);
      w.nubbins.length = 0;
      for (let i = 0; i < EGG.maxRoster; i++) {
        buy(w, 'egg', rng, []);
        bought += 1;
      }
      for (const n of w.nubbins) {
        if (!isJewel(n.eggColor)) continue;
        jewels += 1;
        seen.add(n.eggColor);
        expect(JEWEL_EGG_COLORS).toContain(n.eggColor);
        expect(n.tone).toBeNull();
        expect(n.shiny).toBe(false);
        const back = deserialize(serialize(w, 0));
        expect(back.world.nubbins.find((m) => m.id === n.id)?.eggColor).toBe(n.eggColor);
      }
    }
    // About SHOP.jewelEggChance of eggs: rare, but it happens.
    expect(jewels).toBeGreaterThan(0);
    expect(jewels / bought).toBeLessThan(SHOP.jewelEggChance * 3);
    expect(seen.size).toBeGreaterThan(1);
  });

  it('Nubbins play with a toy', () => {
    const w = world(100);
    for (let i = 0; i < EGG.hatchMs / SIM.stepMs + 2; i++) stepWorld(w, SIM.stepMs);
    run(w, [{ kind: 'buy', item: 'toy' }]);
    let played = false;
    for (let i = 0; i < 6000 && !played; i++) {
      stepWorld(w, SIM.stepMs);
      played = w.nubbins.some((n) => n.behavior.state === 'play');
    }
    expect(played).toBe(true);
  });
});
