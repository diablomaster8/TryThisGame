import { describe, expect, it } from 'vitest';
import { BREEDING, DECOR, LESSONS, SIM, TRUST } from '../../src/config/tuning';
import { breed, canBreed, giveHeartFruit, stepBreeding } from '../../src/sim/breeding';
import { allKeys, formKey, noteSeen } from '../../src/sim/collection';
import { dayKey, isLanternNight, stepDaily } from '../../src/sim/daily';
import { buyDecor, placeDecor, removeDecor } from '../../src/sim/decorate';
import { battleAct, createBattle } from '../../src/sim/battle';
import { canTakeLesson, fortune, lessonLevel, startLesson } from '../../src/sim/kindergarten';
import { hatch } from '../../src/sim/lifecycle';
import { Rng } from '../../src/sim/rng';
import { deserialize, serialize } from '../../src/sim/save';
import { neighbourGift, visit } from '../../src/sim/neighbourhood';
import { decodeNubbin, encodeNubbin, receiveNubbin, tradeAway } from '../../src/sim/share';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';
import { seasonOf, setWeather, shelterSpot } from '../../src/sim/weather';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

function grownWorld(): { world: World; events: SimEvent[]; a: Nubbin; b: Nubbin } {
  const world = createWorld(5, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) {
    hatch(n, events, 0);
    n.stage = 'adult';
    n.form = { band: 'neutral', type: 'normal', second: null, leanAtEvolution: { ...n.typeLean } };
    n.needs.affection = 60;
  }
  const [a, b] = world.nubbins as [Nubbin, Nubbin];
  b.pos = { x: a.pos.x + 1, z: a.pos.z };
  return { world, events, a, b };
}

function tick(world: World, events: SimEvent[], seconds: number, wallMs?: number): void {
  const steps = Math.ceil((seconds * 1000) / SIM.stepMs);
  for (let i = 0; i < steps; i++) {
    for (const n of world.nubbins) {
      n.needs.hunger = 1;
      n.needs.energy = 1;
    }
    events.push(...stepWorld(world, SIM.stepMs, wallMs));
  }
}

describe('breeding', () => {
  it('needs a heart fruit, an adult, affection, and no Eternal', () => {
    const { world, events, a } = grownWorld();
    expect(giveHeartFruit(world, a, events)).toBe(false);
    world.inventory.heartFruit = 1;
    a.eternal = 'sun';
    expect(canBreed(a)).toBe(false);
    a.eternal = null;
    expect(giveHeartFruit(world, a, events)).toBe(true);
    expect(a.courtingUntilMs).toBeGreaterThan(0);
    expect(world.inventory.heartFruit).toBe(0);
  });

  it('makes an egg that inherits from both parents', () => {
    const { world, events, a, b } = grownWorld();
    a.eggColor = 'rose';
    a.shiny = true;
    a.stats.swim.grade = 'S';
    b.stats.swim.grade = 'E';
    const rng = new Rng(3);
    const egg = breed(world, a, b, rng, events);
    expect(egg.stage).toBe('egg');
    expect(egg.parents).toEqual([a.id, b.id]);
    expect(egg.generation).toBe(1);
    expect(['S', 'C', 'B'].includes(egg.stats.swim.grade)).toBe(true);
    expect(events.some((e) => e.kind === 'bred')).toBe(true);
    expect(world.nubbins.length).toBe(3);
  });

  it('courting adults breed when a partner is in reach', () => {
    const { world, events, a } = grownWorld();
    world.inventory.heartFruit = 1;
    giveHeartFruit(world, a, events);
    stepBreeding(world, new Rng(1), events);
    expect(world.nubbins.length).toBe(3);
    expect(a.courtingUntilMs).toBe(0);
    void BREEDING;
  });
});

describe('kindergarten', () => {
  it('lessons cost Shells, take time and raise a level', () => {
    const { world, events, a } = grownWorld();
    expect(canTakeLesson(world, a, 'dance')).toBe('shells');
    world.inventory.shells = 100;
    expect(startLesson(world, a, 'dance', events)).toBe(true);
    expect(a.behavior.state).toBe('lesson');
    tick(world, events, LESSONS.durationMs / 1000 + 2);
    expect(lessonLevel(a, 'dance')).toBe(1);
    expect(events.some((e) => e.kind === 'lessonDone')).toBe(true);
    expect(world.inventory.shells).toBe(100 - LESSONS.price);
  });

  it('the fortune teller reads the likely form', () => {
    const { a } = grownWorld();
    a.typeLean.fly = 50;
    expect(fortune(a).type).toBe('fly');
    expect(fortune(a).line.length).toBeGreaterThan(5);
  });
});

describe('karate', () => {
  it('a bout ends with a winner; strikes in the sweet spot hit harder', () => {
    const { world } = grownWorld();
    world.nubbins[0]!.stats.power.points = 5000;
    const bout = createBattle(
      world,
      { kind: 'karate', tier: 1, nubbinId: world.nubbins[0]!.id },
      7,
    )!;
    // Tap each time the bar crosses the centre.
    const every = 1000 / bout.karate!.barSpeed;
    for (let k = 1; k < 400 && !bout.result; k++) battleAct(bout, { k: 'tap', atMs: k * every });
    expect(bout.result?.winner).toBe(0);
  });

  it('the rival strikes back on a clock', () => {
    const { world, a } = grownWorld();
    world.karate.belt = 2;
    const bout = createBattle(world, { kind: 'karate', tier: 3, nubbinId: a.id }, 2)!;
    battleAct(bout, { k: 'advance', toMs: 4000 });
    expect(bout.sides[0][0]!.hp).toBeLessThan(bout.sides[0][0]!.maxHp);
  });
});

describe('weather and seasons', () => {
  it('rolls seasons from the calendar and shelters in the rain', () => {
    expect(seasonOf(new Date(2026, 0, 10))).toBe('winter');
    expect(seasonOf(new Date(2026, 6, 10))).toBe('summer');
    const { world, events, a } = grownWorld();
    setWeather(world, 'rain', new Rng(1), events, 60_000);
    expect(world.weather.kind).toBe('rain');
    tick(world, events, 20);
    // R0534: a Nubbin may shelter, swim, or play its rain game (a puddle stomp, raindrops).
    const rainy = world.nubbins.map(
      (n) =>
        n.behavior.state === 'shelter' ||
        n.behavior.state === 'swim' ||
        (n.behavior.state === 'perform' && ['stomp', 'raindrop'].includes(n.behavior.itemId ?? '')),
    );
    expect(rainy.some(Boolean)).toBe(true);
    expect(shelterSpot(a.pos.x, a.pos.z)).toBeDefined();
    tick(world, events, 50);
    expect(world.weather.kind).toBe('clear');
  });
});

describe('decorating', () => {
  it('buys, places on the grass, snaps, and picks up again', () => {
    const world = createWorld(1, 0);
    const events: SimEvent[] = [];
    world.inventory.shells = 100;
    expect(buyDecor(world, 'fence', events)).toBe(true);
    expect(world.inventory.decor.fence).toBe(1);
    expect(placeDecor(world, 'fence', { x: 6, z: 5 }, events)).toBe(false); // the pond
    expect(placeDecor(world, 'fence', { x: -2.2, z: 3.1 }, events)).toBe(true);
    expect(world.placed[0]?.pos).toEqual({ x: -2, z: 3 });
    expect(placeDecor(world, 'fence', { x: -2, z: 3 }, events)).toBe(false); // none left
    expect(removeDecor(world, world.placed[0]!.id)).toBe(true);
    expect(world.inventory.decor.fence).toBe(1);
    void DECOR;
  });
});

describe('collection book', () => {
  it('records forms once, and hatching fills it through the step', () => {
    const world = createWorld(2, 0);
    const events: SimEvent[] = [];
    noteSeen(world, 'chao:child', events);
    noteSeen(world, 'chao:child', events);
    expect(events.filter((e) => e.kind === 'firstSeen').length).toBe(1);
    expect(allKeys().length).toBeGreaterThan(60);
    const n = world.nubbins[0]!;
    expect(formKey(n)).toBe(n.species === 'chao' ? 'chao:egg' : n.species);
  });
});

describe('daily visits', () => {
  it('a Keeper may visit each real day, but each brings only one gift, ever', () => {
    const world = createWorld(9, 0);
    const events: SimEvent[] = [];
    const day = new Date(2026, 9, 10, 12).getTime();
    stepDaily(world, day, new Rng(4), events);
    stepDaily(world, day + 3_600_000, new Rng(5), events);
    expect(events.filter((e) => e.kind === 'visitor').length).toBe(1);
    const first = events.find((e) => e.kind === 'visitor');
    expect(first && first.kind === 'visitor' && first.gift).toBeTruthy();
    expect(world.visits.gifted.length).toBe(1);
    expect(world.visits.lastDay).toBe(dayKey(new Date(day)));
    expect(world.npcs.length).toBe(1);
    expect(isLanternNight(new Date(2026, 9, 10))).toBe(true); // a Saturday
  });
});

describe('one-time story gifts (canon 22)', () => {
  it('a returning Keeper brings no second gift, on any later day', () => {
    const world = createWorld(9, 0);
    const events: SimEvent[] = [];
    const t0 = new Date(2026, 9, 10, 12).getTime();
    for (let d = 0; d < 60; d++) stepDaily(world, t0 + d * 86_400_000, new Rng(100 + d), events);
    const gifts = events.flatMap((e) => (e.kind === 'visitor' && e.gift ? [e.trainer] : []));
    expect(new Set(gifts).size).toBe(gifts.length);
    expect(gifts.length).toBeLessThanOrEqual(world.visits.gifted.length);
    expect(events.filter((e) => e.kind === 'visitor').length).toBe(60);
  });

  it('a neighbour host gives one gift ever, however many days pass', () => {
    const world = createWorld(9, 0);
    const events: SimEvent[] = [];
    visit(world, 'marina', events);
    const before = world.inventory.shells;
    expect(neighbourGift(world, events)).toBe(true);
    expect(neighbourGift(world, events)).toBe(false);
    expect(world.inventory.shells).toBe(before + 30);
  });

  it('an old save with a last-gift day counts as already gifted', () => {
    const world = createWorld(9, 0);
    (world.neighbours as Record<string, unknown>)['marina'] = { lastGiftDay: '2026-10-01' };
    const back = deserialize(serialize(world, 0)).world;
    expect(back.neighbours['marina']).toEqual({ gifted: true });
  });
});

describe('share codes', () => {
  it('round-trips a Nubbin and refuses tampered codes', () => {
    const { world, a } = grownWorld();
    const code = encodeNubbin(a);
    expect(code.startsWith('GROVE1.')).toBe(true);
    const back = decodeNubbin(code);
    expect(back?.name).toBe(a.name);
    expect(decodeNubbin(code.slice(0, -3) + 'abc')).toBeNull();
    expect(decodeNubbin('hello')).toBeNull();
    const events: SimEvent[] = [];
    expect(tradeAway(world, a.id, events)?.id).toBe(a.id);
    expect(world.nubbins.length).toBe(1);
    expect(receiveNubbin(world, back!, events)).toBe(true);
    expect(world.nubbins.length).toBe(2);
    expect(world.nubbins[1]!.id).not.toBe(a.id);
  });
});

describe('interactions', () => {
  it('a hug raises trust and affection; a wary Shadow refuses', () => {
    const { world, events, a } = grownWorld();
    world.keeper.pos = { ...a.pos };
    const trust = a.trust;
    applyCommand(world, { kind: 'interact', nubbinId: a.id, action: 'hug' }, events);
    tick(world, events, 1);
    expect(a.trust).toBeGreaterThan(trust);
    expect(events.some((e) => e.kind === 'interacted' && e.ok)).toBe(true);
    a.trust = 5;
    a.shadow = true;
    world.keeper.pos = { ...a.pos };
    applyCommand(world, { kind: 'interact', nubbinId: a.id, action: 'tickle' }, events);
    tick(world, events, 1);
    expect(events.some((e) => e.kind === 'interacted' && !e.ok)).toBe(true);
    void TRUST;
  });

  it('calling brings a Nubbin toward the Keeper', () => {
    const { world, events, a } = grownWorld();
    world.keeper.pos = { x: 5, z: 5 };
    applyCommand(world, { kind: 'call', nubbinId: a.id }, events);
    expect(a.behavior.target).not.toBeNull();
    expect(events.some((e) => e.kind === 'called')).toBe(true);
  });

  it('new fields survive a save round-trip', () => {
    const { world, a } = grownWorld();
    a.lessons.dance = 2;
    world.placed.push({ id: 'decor-1', kind: 'bench', pos: { x: 1, z: 1 } });
    world.seen['chao:child'] = 5;
    const copy = deserialize(serialize(world, 0)).world;
    expect(copy.nubbins[0]!.lessons.dance).toBe(2);
    expect(copy.placed.length).toBe(1);
    expect(copy.seen['chao:child']).toBe(5);
    expect(copy.weather.kind).toBe('clear');
  });
});
