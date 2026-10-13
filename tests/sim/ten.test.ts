import { describe, expect, it } from 'vitest';
import { GYM, PARTNERS, SCANS, SIM, SLIPS, TANK, TOWN } from '../../src/config/tuning';
import { dayCount, isNightHour } from '../../src/sim/curfew';
import { beforeRebirth } from '../../src/sim/inheritance';
import { hatch, rebirth } from '../../src/sim/lifecycle';
import { createEgg } from '../../src/sim/nubbin';
import { canMerge, mergedLevels } from '../../src/sim/partners';
import { Rng } from '../../src/sim/rng';
import { deserialize, serialize } from '../../src/sim/save';
import { canConvert } from '../../src/sim/scans';
import { canBuySkill, SKILL_LIST } from '../../src/sim/skills';
import { lifespanMs } from '../../src/sim/slips';
import { createTank, steer, stepTank } from '../../src/sim/tank';
import { teamBoard, weekKey } from '../../src/sim/teams';
import { addRecruit, townUnlocks } from '../../src/sim/town';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

function adultWorld() {
  const world = createWorld(5, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) {
    hatch(n, events, 0);
    n.stage = 'adult';
    n.form = { band: 'neutral', type: 'normal', second: null, leanAtEvolution: { ...n.typeLean } };
    n.needs.affection = 80;
  }
  return { world, events };
}

describe('the village square', () => {
  it('recruits raise prosperity and open services in order', () => {
    const world = createWorld(1, 0);
    const events: SimEvent[] = [];
    for (let i = 0; i < 4; i++) addRecruit(world, `R${i}`, 'puffbud', events);
    expect(world.town.prosperity).toBe(4 * TOWN.perRecruit);
    expect(townUnlocks(world).stall).toBe(true);
    expect(townUnlocks(world).gym).toBe(true);
    expect(townUnlocks(world).attendant).toBe(false);
    expect(
      events.filter((e) => e.kind === 'townGrew').map((e) => (e as { unlock: string }).unlock),
    ).toEqual(['stall', 'gym']);
    // The same creature does not count twice.
    expect(addRecruit(world, 'R0', 'puffbud', events)).toBe(false);
  });

  it('a settled wild visitor and a won race both recruit', () => {
    const { world, events } = adultWorld();
    const n = world.nubbins[0]!;
    events.length = 0;
    applyCommand(
      world,
      {
        kind: 'raceResult',
        nubbinId: n.id,
        course: 'meadow',
        tier: 1,
        placement: 1,
        shells: 10,
        hat: null,
        rival: { name: 'Lark', species: 'chao' },
      },
      events,
    );
    expect(world.town.recruits.map((r) => r.name)).toContain('Lark');
    expect(events.some((e) => e.kind === 'raceWon')).toBe(true);
  });
});

describe('care slips', () => {
  it('logs a slip after a need is ignored, trims the span, and a clean childhood is well raised', () => {
    const world = createWorld(1, 0);
    const n = world.nubbins[0]!;
    hatch(n, [], 0);
    n.needs.hunger = 0.05;
    const events: SimEvent[] = [];
    const steps = Math.ceil(SLIPS.afterMs / SIM.stepMs) + 2;
    for (let i = 0; i < steps; i++) {
      n.needs.hunger = 0.05;
      n.needs.energy = 1;
      events.push(...stepWorld(world, SIM.stepMs));
    }
    expect(events.some((e) => e.kind === 'slip')).toBe(true);
    expect(n.slipCount).toBe(1);
    expect(lifespanMs(n)).toBeLessThan(lifespanMs({ ...n, slipCount: 0 }));
    const { of } = dayCount(n);
    expect(of).toBeGreaterThan(0);
  });
});

describe('the gym', () => {
  it('turns hits into points, more when rested and fed, and costs energy', () => {
    const { world } = adultWorld();
    const n = world.nubbins[0]!;
    n.needs.hunger = 1;
    n.needs.energy = 1;
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'trainResult', nubbinId: n.id, stat: 'run', hits: 10 }, events);
    const rested = events.find((e) => e.kind === 'trained') as { points: number; rested: boolean };
    expect(rested.rested).toBe(true);
    expect(rested.points).toBe(Math.round(10 * GYM.pointsPerHit * GYM.restedBonus));
    expect(n.needs.energy).toBeCloseTo(1 - GYM.energyCost);
  });
});

describe('partners and the merge', () => {
  it('needs two bonded adult partners and a twine, then boosts both for a minute', () => {
    const { world, events } = adultWorld();
    const [a, b] = world.nubbins as [
      (typeof world.nubbins)[number],
      (typeof world.nubbins)[number],
    ];
    applyCommand(world, { kind: 'setPartner', slot: 0, nubbinId: a.id }, events);
    applyCommand(world, { kind: 'setPartner', slot: 1, nubbinId: b.id }, events);
    expect(canMerge(world)).toBe('twine');
    world.inventory.shells = 500;
    applyCommand(world, { kind: 'buy', item: 'twine' }, events);
    expect(world.inventory.twine).toBe(1);
    applyCommand(world, { kind: 'merge' }, events);
    expect(world.merge).not.toBeNull();
    const levels = mergedLevels(world, a)!;
    expect(levels.run).toBeGreaterThanOrEqual(PARTNERS.mergeLevelBonus);
    for (let i = 0; i < Math.ceil(PARTNERS.mergeMs / SIM.stepMs) + 2; i++)
      stepWorld(world, SIM.stepMs);
    expect(world.merge).toBeNull();
    expect(events.some((e) => e.kind === 'merged')).toBe(true);
  });
});

describe('the curfew', () => {
  it('knows the night hours', () => {
    expect(isNightHour(23)).toBe(true);
    expect(isNightHour(3)).toBe(true);
    expect(isNightHour(12)).toBe(false);
  });
});

describe('rebirth memories', () => {
  it('keeps what was chosen and writes the family line', () => {
    const rng = Rng.fromSeed(2);
    const n = createEgg('n', { x: 0, z: 0 }, rng);
    hatch(n, [], 0);
    n.stage = 'adult';
    n.form = { band: 'sun', type: 'swim', second: null, leanAtEvolution: { ...n.typeLean } };
    n.parts.ears = 'rabbit-ears';
    n.memory = 'part';
    rebirth(n, []);
    expect(n.parts.ears).toBe('rabbit-ears');
    expect(n.ancestry).toEqual(['sun swim']);
    n.memory = 'grade';
    const before = n.stats.swim.grade;
    n.stats.swim.points = 1000;
    const keep = beforeRebirth(n);
    expect(keep.keepParts).toBe(false);
    expect(n.stats.swim.grade).not.toBe(before);
    n.ancestry.push('x');
    beforeRebirth(n);
    expect(n.heirloom).toBe(true);
  });
});

describe('the skill tree', () => {
  it('has 24 nodes in four branches, gated by points and prerequisites', () => {
    expect(SKILL_LIST).toHaveLength(24);
    for (const b of ['care', 'garden', 'games', 'story']) {
      expect(SKILL_LIST.filter((s) => s.branch === b)).toHaveLength(6);
    }
    const world = createWorld(1, 0);
    const events: SimEvent[] = [];
    expect(canBuySkill(world, 'warmHands')).toBe('points');
    world.skillPoints = 2;
    expect(canBuySkill(world, 'gentlePet')).toBe('locked');
    applyCommand(world, { kind: 'buySkill', id: 'warmHands' }, events);
    expect(world.skills.warmHands).toBe(true);
    expect(world.skillPoints).toBe(1);
    expect(canBuySkill(world, 'gentlePet')).toBeNull();
  });
});

describe('scan and convert', () => {
  it('fills from arrivals and converts into an egg', () => {
    const world = createWorld(1, 0);
    const events: SimEvent[] = [];
    world.scans.puffbud = SCANS.full - 1;
    expect(canConvert(world, 'puffbud')).toBe('scan');
    world.scans.puffbud = SCANS.full;
    const before = world.nubbins.length;
    applyCommand(world, { kind: 'convertScan', species: 'puffbud' }, events);
    expect(world.nubbins.length).toBe(before + 1);
    expect(world.nubbins[before]!.species).toBe('puffbud');
    expect(events.some((e) => e.kind === 'converted')).toBe(true);
  });
});

describe('guard teams', () => {
  it('joins a team, gets a weekly mission and a seeded board', () => {
    const world = createWorld(1, 0);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'joinTeam', team: 'dusk' }, events);
    const wall = Date.UTC(2026, 9, 13);
    stepWorld(world, SIM.stepMs, wall);
    expect(world.team?.mission).not.toBeNull();
    expect(world.team?.week).toBe(weekKey(wall));
    const board = teamBoard(world, wall);
    expect(board).toHaveLength(5);
    expect(board.some((r) => r.you)).toBe(true);
    expect(teamBoard(world, wall)).toEqual(board);
  });
});

describe('the Beetle Run', () => {
  it('is seeded, steers between lanes, collects cargo and reaches the door', () => {
    const a = createTank(9);
    const b = createTank(9);
    expect(a.entities).toEqual(b.entities);
    steer(a, 1);
    expect(a.lane).toBe(2);
    steer(a, 1);
    expect(a.lane).toBe(2);
    let guard = 0;
    while (!a.finished && guard++ < 10_000) {
      // Dodge: move away from the next hazard in our lane.
      const next = a.entities.find(
        (e) => !e.taken && e.at > a.distance && e.at - a.distance < 3 && e.lane === a.lane,
      );
      if (next && (next.kind === 'spore' || next.kind === 'rock' || next.kind === 'acid'))
        steer(a, a.lane === 0 ? 1 : -1);
      stepTank(a, 50);
    }
    expect(a.finished).toBe(true);
    expect(a.cargoCount).toBeLessThanOrEqual(TANK.cargo);
    const world = createWorld(1, 0);
    const events: SimEvent[] = [];
    applyCommand(
      world,
      {
        kind: 'tankResult',
        shells: a.cargo.shells,
        wood: a.cargo.wood,
        stone: a.cargo.stone,
        won: a.won,
      },
      events,
    );
    expect(world.tank.runs).toBe(1);
    expect(events.some((e) => e.kind === 'tankDone')).toBe(true);
  });
});

describe('saves', () => {
  it('round-trips the new fields and defaults old saves', () => {
    const { world, events } = adultWorld();
    applyCommand(world, { kind: 'joinTeam', team: 'dawn' }, events);
    world.skillPoints = 3;
    world.scans.zapling = 40;
    addRecruit(world, 'Moss', 'chao', events);
    const back = deserialize(serialize(world, 0)).world;
    expect(back.team?.id).toBe('dawn');
    expect(back.skillPoints).toBe(3);
    expect(back.scans.zapling).toBe(40);
    expect(back.town.recruits).toHaveLength(1);
    const old = createWorld(1, 0) as unknown as Record<string, unknown>;
    for (const k of ['town', 'partners', 'merge', 'skillPoints', 'skills', 'scans', 'team', 'tank'])
      delete old[k];
    const fixed = deserialize(serialize(old as never, 0)).world;
    expect(fixed.town.prosperity).toBe(0);
    expect(fixed.partners).toEqual([null, null]);
    expect(fixed.nubbins[0]!.memory).toBe('lesson');
  });
});
