import { describe, expect, it } from 'vitest';
import { GROVE, LIFECYCLE, SIM } from '../../src/config/tuning';
import { canFuse } from '../../src/sim/fusion';
import { freeSpot } from '../../src/sim/keeper';
import { lifetimeHappiness } from '../../src/sim/needs';
import { blocked } from '../../src/sim/obstacles';
import { catchUp, coarseStep } from '../../src/sim/offline';
import { deserialize, serialize } from '../../src/sim/save';
import { encodeNubbin, decodeNubbin, isStoryNubbin, receiveNubbin } from '../../src/sim/share';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import { campaignWorld, moss } from './campaign-driver';

/** Review 2026-10-24, sim fixes (2026-10-25). */

function solo(seed = 7): { w: World; n: Nubbin } {
  const w = createWorld(seed, 0);
  w.nubbins = [w.nubbins[0]!];
  return { w, n: w.nubbins[0]! };
}

function run(w: World, ms: number): SimEvent[] {
  const out: SimEvent[] = [];
  for (let i = 0; i < Math.ceil(ms / SIM.stepMs); i++) out.push(...stepWorld(w, SIM.stepMs));
  return out;
}

const inPond = (p: { x: number; z: number }): boolean =>
  Math.hypot(p.x - GROVE.pond.x, p.z - GROVE.pond.z) < GROVE.pond.r;

describe('a Nubbin waiting for the Keeper is frozen (item 1)', () => {
  function waiting(): { w: World; n: Nubbin } {
    const { w, n } = solo(31);
    n.stage = 'adult';
    n.form = {
      band: 'neutral',
      type: 'normal',
      second: 'normal',
      leanAtEvolution: { ...n.typeLean },
    };
    n.needs.affection = 5;
    n.happinessSum = 10 * 3600;
    n.happinessSamples = 3600;
    n.stageMs = LIFECYCLE.adultMs - 1000;
    w.settings.offlineAging.mode = 'indefinite';
    w.settings.offlineAging.allowOfflineDepartures = false;
    return { w, n };
  }

  for (const gap of [7 * 86_400_000 + 50_000, 120_000, 59_900]) {
    it(`gap ${gap} ms: no departure, no samples while waiting`, () => {
      const { w, n } = waiting();
      const report = catchUp(w, gap, 0);
      expect(n.awaitingKeeper).toBe(true);
      expect(report.events.some((e) => e.kind === 'departed')).toBe(false);
      expect(w.nubbins).toHaveLength(1);
      expect(n.stage).toBe('adult');
      // The average stays where it was when it froze, however long the wait.
      const avg = lifetimeHappiness(n);
      n.needs.happiness = 100;
      coarseStep(w, 60_000, []);
      expect(lifetimeHappiness(n)).toBe(avg);
    });
  }

  it('live play does not sample a waiting Nubbin either', () => {
    const { w, n } = waiting();
    catchUp(w, 120_000, 0);
    w.endOfLife = { held: true, nextMs: 0 };
    const samples = n.happinessSamples;
    run(w, 5000);
    expect(n.happinessSamples).toBe(samples);
  });
});

describe('story Nubbins stay (item 5)', () => {
  it('isStoryNubbin names Moss and nobody else', () => {
    const { world } = campaignWorld();
    const m = moss(world)!;
    expect(isStoryNubbin(world, m.id)).toBe(true);
    const other = world.nubbins.find((n) => n.id !== m.id)!;
    expect(isStoryNubbin(world, other.id)).toBe(false);
  });

  it('a share code of this Grove’s own Moss is not taken in as a second Moss', () => {
    const { world } = campaignWorld();
    const m = moss(world)!;
    const code = decodeNubbin(encodeNubbin(m))!;
    const events: SimEvent[] = [];
    world.plots = 5;
    expect(receiveNubbin(world, code, events)).toBe(false);
    expect(world.nubbins.filter((n) => n.name === 'Moss')).toHaveLength(1);
  });

  it('a story Nubbin is never fused away', () => {
    const { world } = campaignWorld();
    const m = moss(world)!;
    const other = world.nubbins.find((n) => n.id !== m.id)!;
    m.eternal = null;
    expect(canFuse(world, other.id, m.id)).toBe('story');
  });
});

describe('the Keeper never stays stuck in the pond (item 6)', () => {
  it('a Keeper saved at (4.68, 6.77) walks out with the keys', () => {
    const { w } = solo();
    w.keeper.pos = { x: 4.68, z: 6.77 };
    const w2 = deserialize(serialize(w, 0)).world;
    expect(w2.keeper.pos.x).toBeCloseTo(4.68);
    run(w2, 200);
    expect(inPond(w2.keeper.pos)).toBe(false);
    const events: SimEvent[] = [];
    applyCommand(w2, { kind: 'keeperInput', input: { x: -1, z: 0 } }, events);
    const before = { ...w2.keeper.pos };
    run(w2, 1000);
    expect(w2.keeper.pos.x).toBeLessThan(before.x - 1);
  });

  it('a tap-move and a care walk both work from there', () => {
    const { w, n } = solo();
    n.stage = 'child';
    w.keeper.pos = { x: 4.68, z: 6.77 };
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'moveKeeperTo', pos: { x: -4, z: -4 } }, events);
    run(w, 8000);
    expect(Math.hypot(w.keeper.pos.x + 4, w.keeper.pos.z + 4)).toBeLessThan(0.5);
    w.keeper.pos = { x: 4.68, z: 6.77 };
    n.pos = { x: -6, z: 2 };
    w.inventory.fruit = 3;
    applyCommand(w, { kind: 'feed', nubbinId: n.id }, events);
    run(w, 10_000);
    expect(w.inventory.fruit).toBe(2);
  });

  it('the crack between the well and the shore does not trap the Keeper', () => {
    const { w } = solo();
    // The well landmark's fast-travel spot sits inside the well's footing, by the shore.
    applyCommand(w, { kind: 'teleport', pos: { x: 3, z: 10 } }, []);
    w.keeper.pos = { x: 3, z: 10 };
    run(w, 300);
    expect(blocked(w.keeper.pos, w, 0.3)).toBe(false);
    expect(inPond(w.keeper.pos)).toBe(false);
  });

  it('freeSpot returns a standable point next to any blocker', () => {
    const { w } = solo();
    for (const h of GROVE.hills) {
      const p = freeSpot(w, { x: h.x, z: h.z }, false);
      expect(blocked(p, w, 0.3)).toBe(false);
    }
    const p = freeSpot(w, { x: GROVE.pond.x, z: GROVE.pond.z }, false);
    expect(inPond(p)).toBe(false);
  });
});

describe('care out of range (item 7)', () => {
  it('a far Nubbin is walked to and petted', () => {
    const { w, n } = solo();
    n.stage = 'child';
    n.pos = { x: -20, z: 15 };
    const happy = n.needs.happiness;
    applyCommand(w, { kind: 'interact', nubbinId: n.id, action: 'tickle' }, []);
    const events = run(w, 20_000);
    expect(events.some((e) => e.kind === 'interacted' && e.nubbinId === n.id)).toBe(true);
    expect(n.needs.happiness).not.toBe(happy);
  });

  function behindHill(hillIndex: number): { reached: boolean; gaveUp: boolean; w: World } {
    const { w, n } = solo();
    n.stage = 'child';
    const hill = GROVE.hills[hillIndex]!;
    // The Keeper and the Nubbin on opposite sides of a hill, exactly in line.
    w.keeper.pos = { x: hill.x - hill.r - 1, z: hill.z };
    n.pos = { x: hill.x + hill.r + 1, z: hill.z };
    applyCommand(w, { kind: 'pet', nubbinId: n.id }, []);
    const events = run(w, 30_000);
    return {
      w,
      reached: events.some((e) => e.kind === 'reaction' && e.nubbinId === n.id),
      gaveUp: events.some((e) => e.kind === 'cantReach' && e.targetId === n.id),
    };
  }

  it('the Keeper walks round a hill to a Nubbin behind it', () => {
    expect(behindHill(0).reached).toBe(true);
  });

  it('every care walk ends: it arrives, or gives up with a cantReach event', () => {
    for (let i = 0; i < GROVE.hills.length; i++) {
      const r = behindHill(i);
      expect(r.reached || r.gaveUp).toBe(true);
      expect(r.w.keeper.intent).toBeNull();
    }
  });
});
