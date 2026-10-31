import { afterEach, describe, expect, it } from 'vitest';
import { actStartDepth } from '../../src/config/dungeon-acts';
import { ACT_QUESTS, HOLLOW_R9C } from '../../src/config/dungeon-r9-c';
import { DUNGEON, SIM } from '../../src/config/tuning';
import { cellCentre, dailySeed, runFloor } from '../../src/sim/dungeon';
import { DAILY_LEVELS, dailyActFloor } from '../../src/sim/dungeon-daily';
import { encounterSpec, setEncounterHandler } from '../../src/sim/dungeon-encounters';
import { friendBrave, friendOf, friendSight, hireBoard } from '../../src/sim/dungeon-friends';
import { moodTarget, stepMoods } from '../../src/sim/dungeon-moods';
import { stepRoundNineC } from '../../src/sim/dungeon-r9-c';
import { actQuestMarks, rescueCell, stepActQuests } from '../../src/sim/dungeon-quests';
import { fetchRadiusOf } from '../../src/sim/dungeon-roles';
import { serviceHere } from '../../src/sim/dungeon-towns';
import { hatch } from '../../src/sim/lifecycle';
import { createEgg } from '../../src/sim/nubbin';
import { claimQuest, refreshQuests, stepQuests } from '../../src/sim/quests';
import { Rng } from '../../src/sim/rng';
import { decodeTodayCode, encodeTodayCode } from '../../src/sim/share';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// Lane B round 9, helper c: personalities underground (R0167), the Hollow's requests (R0165),
// today's act chain and codes (R0185), act quests (R0166) and friends for hire (R0181).

const DAY = Date.UTC(2026, 9, 31, 12);

function world4(seed = 5): World {
  const world = createWorld(seed, DAY);
  const rng = Rng.fromSeed(9);
  while (world.nubbins.length < 4)
    world.nubbins.push(createEgg(`extra-${world.nubbins.length}`, { x: 0, z: 0 }, rng));
  for (const n of world.nubbins) hatch(n, [], 0);
  return world;
}

function send(world: World, cmd: Parameters<typeof applyCommand>[1]): SimEvent[] {
  const out: SimEvent[] = [];
  applyCommand(world, cmd, out);
  return out;
}

function step(world: World, ms: number): SimEvent[] {
  const out: SimEvent[] = [];
  for (let t = 0; t < ms; t += SIM.stepMs) out.push(...stepWorld(world, SIM.stepMs));
  return out;
}

function stairs(world: World, to: 'down' | 'up'): SimEvent[] {
  const out = send(world, { kind: 'dungeonGo', to });
  const run = world.dungeon;
  if (run?.pendingPos) world.keeper.pos = { ...run.pendingPos };
  out.push(...step(world, 200));
  return out;
}

function underground(seed = 8): World {
  const world = world4(seed);
  send(world, { kind: 'enterDungeon', daily: false });
  world.dungeon!.graceUntilMs = 0;
  return world;
}

function partyOf(world: World): Nubbin[] {
  return world.dungeon!.party.map((id) => world.nubbins.find((n) => n.id === id)!);
}

function atService(world: World, kind: string): void {
  const f = runFloor(world)!;
  const s = f.services!.find((x) => x.kind === kind)!;
  world.keeper.pos = cellCentre(f, s.cell);
  expect(serviceHere(world)?.kind).toBe(kind);
}

afterEach(() => setEncounterHandler(null));

describe('personality underground (R0167)', () => {
  it('a Shy Nubbin tucks in behind the Keeper while a pack gives chase', () => {
    const world = underground();
    const run = world.dungeon!;
    const n = partyOf(world)[0]!;
    n.personality = 'shy';
    expect(moodTarget(world, run, n, [])).toBeNull();
    const k = world.keeper.pos;
    run.packs = [
      { id: 'p1', pos: { x: k.x + 3, z: k.z }, state: 'chase', target: null, noticedMs: 0 },
    ];
    const events: SimEvent[] = [];
    const t = moodTarget(world, run, n, events);
    expect(t).not.toBe('hold');
    expect((t as { x: number }).x).toBeLessThan(k.x);
    expect(events.some((e) => e.kind === 'hollowR9' && e.what === 'hide')).toBe(true);
  });

  it('a Mischievous Nubbin borrows one Shell back from a stray, once a level', () => {
    const world = underground();
    const run = world.dungeon!;
    const n = partyOf(world)[0]!;
    n.personality = 'mischievous';
    run.strays = [
      {
        id: 's1',
        pos: { x: n.pos.x + 0.4, z: n.pos.z },
        target: null,
        cooldownMs: 0,
        carrying: 3,
      },
    ];
    const shells = world.inventory.shells;
    const events: SimEvent[] = [];
    expect(moodTarget(world, run, n, events)).toBe('hold');
    expect(world.inventory.shells).toBe(shells + 1);
    expect(run.strays[0]!.carrying).toBe(2);
    expect(n.behavior.reaction).toBe('happy');
    world.timeMs += 5000;
    expect(moodTarget(world, run, n, [])).toBeNull();
    expect(world.inventory.shells).toBe(shells + 1);
  });

  it('a Cheerful Nubbin hops on a find', () => {
    const world = underground();
    const run = world.dungeon!;
    const n = partyOf(world)[0]!;
    n.personality = 'cheerful';
    n.behavior.state = 'sit';
    const out: SimEvent[] = [];
    const found: SimEvent = {
      kind: 'dungeonFound',
      loot: 'shells',
      amount: 1,
      param: null,
      by: null,
    };
    stepMoods(world, run, [n], 100, [found], out);
    expect(n.behavior.state).toBe('react');
    expect(n.behavior.reaction).toBe('happy');
    expect(out.some((e) => e.kind === 'hollowR9' && e.what === 'hop')).toBe(true);
    expect(moodTarget(world, run, n, [])).toBe('hold');
  });

  it('a Lazy Nubbin dozes when the Keeper stands still, and a full doze rests the party', () => {
    const world = underground();
    const run = world.dungeon!;
    const party = partyOf(world);
    const lazy = party[0]!;
    lazy.personality = 'lazy';
    lazy.behavior.state = 'sit';
    for (const n of party) n.needs.energy = 0.5;
    const out: SimEvent[] = [];
    for (let t = 0; t <= HOLLOW_R9C.moods.napAfterMs + 200; t += 100) {
      world.timeMs += 100;
      stepMoods(world, run, party, 100, [], out);
    }
    expect(lazy.behavior.state).toBe('nap');
    for (let t = 0; t <= HOLLOW_R9C.moods.napRestMs + 200; t += 100) {
      world.timeMs += 100;
      stepMoods(world, run, party, 100, [], out);
    }
    expect(lazy.behavior.state).toBe('wander');
    expect(out.some((e) => e.kind === 'hollowR9' && e.what === 'napRest')).toBe(true);
    for (const n of party) expect(n.needs.energy).toBeGreaterThan(0.6);
    // Once a level.
    const before = out.length;
    for (let t = 0; t <= 10_000; t += 100) {
      world.timeMs += 100;
      stepMoods(world, run, party, 100, [], out);
    }
    expect(out.slice(before).some((e) => e.kind === 'hollowR9' && e.what === 'nap')).toBe(false);
  });

  it('Shy follows close and Lazy trails behind (behaviour only, never stats)', () => {
    const world = underground();
    const [a, b] = partyOf(world) as [Nubbin, Nubbin];
    const stats = JSON.stringify(a.stats);
    a.personality = 'shy';
    b.personality = 'lazy';
    step(world, 3000);
    expect(JSON.stringify(a.stats)).toBe(stats);
  });
});

describe("the Hollow's requests (R0165)", () => {
  function collect(world: World, rng: Rng): string[] {
    const seen: string[] = [];
    for (let i = 0; i < 12; i++) {
      refreshQuests(world, rng, []);
      for (const q of world.quests)
        if (!q.claimed && !q.template.startsWith('hollowB') && !q.template.startsWith('hollowS')) {
          q.claimed = true;
          seen.push(q.template);
        }
    }
    return [...seen, ...world.quests.filter((q) => !q.claimed).map((q) => q.template)];
  }

  it('wait for a first trip down, then come once and never return', () => {
    const world = world4();
    const rng = Rng.fromSeed(3);
    world.quests = [];
    const before = collect(world, rng);
    expect(before.filter((t) => t.startsWith('hollowB') || t.startsWith('hollowS'))).toEqual([]);
    world.hollow.runs = 1;
    collect(world, rng);
    const mine = world.quests.filter((q) =>
      ['hollowBoss', 'hollowSecret', 'hollowSet'].includes(q.template),
    );
    expect(mine.map((q) => q.template).sort()).toEqual(['hollowBoss', 'hollowSecret', 'hollowSet']);
    const boss = mine.find((q) => q.template === 'hollowBoss')!;
    stepQuests(world, undefined, rng, []);
    expect(boss.progress).toBe(0);
    world.hollow.acts[0] = { bossDefeated: true, deepest: 3 };
    const ev: SimEvent[] = [];
    stepQuests(world, undefined, rng, ev);
    expect(boss.progress).toBe(1);
    expect(ev.some((e) => e.kind === 'questDone' && e.id === boss.id)).toBe(true);
    const shells = world.inventory.shells;
    expect(claimQuest(world, boss.id, rng, [])).toBe(true);
    expect(world.inventory.shells).toBeGreaterThan(shells);
    expect(claimQuest(world, boss.id, rng, [])).toBe(false);
    collect(world, rng);
    expect(world.quests.filter((q) => q.template === 'hollowBoss')).toHaveLength(1);
    // A secret found for good counts.
    const secret = mine.find((q) => q.template === 'hollowSecret')!;
    world.hollow.secrets = ['rootways.1:s1'];
    stepQuests(world, undefined, rng, []);
    expect(secret.progress).toBe(1);
  });

  it('a secret room found underground is remembered for the Journal', () => {
    const world = underground();
    // The hook runs inside stepDungeon with the step's events; a wiggle alone does not count.
    const ev: SimEvent[] = [
      { kind: 'hollowSecret', id: 'sec-1', how: 'bump' },
      { kind: 'hollowSecret', id: 'sec-2', how: 'wiggle' },
    ];
    stepRoundNineC(world, world.dungeon!, runFloor(world)!, SIM.stepMs, ev);
    stepRoundNineC(world, world.dungeon!, runFloor(world)!, SIM.stepMs, ev);
    expect(world.hollow.secrets).toEqual(['deep.1:sec-1']);
  });
});

describe("today's act chain and share codes (R0185)", () => {
  it('two worlds on the same day get the same five act-styled floors, packs and loot', () => {
    const a = world4(1);
    const b = world4(77);
    b.nubbins.pop();
    send(a, { kind: 'enterDungeon', daily: true });
    send(b, { kind: 'enterDungeon', daily: true });
    const ra = a.dungeon!;
    const rb = b.dungeon!;
    expect(ra.dailyAct).toBeDefined();
    expect(ra.seed).toBe(rb.seed);
    expect(ra.dailyAct).toBe(rb.dailyAct);
    for (let d = 1; d <= DAILY_LEVELS; d++) {
      const fa = dailyActFloor(ra.seed, ra.dailyAct!, d, ra.genVersion);
      const fb = dailyActFloor(rb.seed, rb.dailyAct!, d, rb.genVersion);
      expect(Array.from(fa.cells)).toEqual(Array.from(fb.cells));
      expect(fa.loot).toEqual(fb.loot);
      expect(fa.packs?.map((p) => p.members)).toEqual(fb.packs?.map((p) => p.members));
    }
    expect(a.dungeon!.seed).toBe(dailySeed(DAY).seed);
  });

  it('the chain is five levels with a boss at the bottom guarding the way home', () => {
    const world = world4(3);
    setEncounterHandler(() => 'fled');
    send(world, { kind: 'enterDungeon', daily: true });
    for (let i = 1; i < DAILY_LEVELS; i++) {
      world.dungeon!.graceUntilMs = Number.MAX_SAFE_INTEGER;
      stairs(world, 'down');
    }
    const run = world.dungeon!;
    expect(run.depth).toBe(DAILY_LEVELS);
    const f = runFloor(world)!;
    expect(f.packs?.some((p) => p.kind === 'boss')).toBe(true);
    run.graceUntilMs = Number.MAX_SAFE_INTEGER;
    const guard = stairs(world, 'down');
    expect(guard.some((e) => e.kind === 'bossGuard')).toBe(true);
    expect(world.dungeon).not.toBeNull();
    world.dungeon!.packs!.find((p) => p.id === 'pack-boss')!.state = 'beaten';
    stairs(world, 'down');
    expect(world.location).toBe('grove');
  });

  it('share codes round-trip and refuse a wrong or tampered code', () => {
    const t = { day: '2026-10-31', deepest: 5, bestMs: 372_000, finds: 41 };
    const code = encodeTodayCode(t)!;
    expect(code.length).toBeLessThan(24);
    expect(decodeTodayCode(code)).toEqual(t);
    expect(decodeTodayCode(code.toLowerCase())).toEqual(t);
    expect(decodeTodayCode(code.replace('-5-', '-9-'))).toBeNull();
    expect(decodeTodayCode('nonsense')).toBeNull();
    expect(decodeTodayCode('H2' + code.slice(2))).toBeNull();
  });
});

describe('act quests (R0166)', () => {
  it('has two quests per act, each taken once at the camp and paid once', () => {
    for (let act = 0; act < 5; act++)
      expect(ACT_QUESTS.filter((q) => q.act === act)).toHaveLength(2);
    const world = world4();
    setEncounterHandler(() => 'fled');
    send(world, { kind: 'enterTown', act: 0 });
    // Not at the quest-giver: nothing taken.
    send(world, { kind: 'hollowR9', what: 'quest', id: 'teaspoon' });
    atService(world, 'quest');
    const ev = send(world, { kind: 'hollowR9', what: 'quest', id: 'teaspoon' });
    expect(world.hollow.actQuests?.teaspoon).toBe('active');
    expect(ev.some((e) => e.kind === 'hollowR9' && e.what === 'questTaken')).toBe(true);
    // Another act's quest is not on this board.
    send(world, { kind: 'hollowR9', what: 'quest', id: 'shears' });
    expect(world.hollow.actQuests?.shears).toBeUndefined();
    send(world, { kind: 'hollowR9', what: 'quest', id: 'sneezes' });
    // Down to level 2 of the Rootways.
    stairs(world, 'down');
    stairs(world, 'down');
    world.dungeon!.graceUntilMs = Number.MAX_SAFE_INTEGER;
    stairs(world, 'down');
    const run = world.dungeon!;
    expect(run.depth - actStartDepth(0) + 1).toBe(2);
    const f = runFloor(world)!;
    expect(actQuestMarks(world, run, f)).toContainEqual(f.chest);
    const shells = world.inventory.shells;
    run.chestOpen = true;
    const out: SimEvent[] = [];
    stepActQuests(world, run, f, out);
    stepActQuests(world, run, f, out);
    expect(world.hollow.actQuests?.teaspoon).toBe('done');
    expect(world.inventory.shells).toBe(shells + 25);
    expect(out.filter((e) => e.kind === 'hollowR9' && e.what === 'questDone')).toHaveLength(1);
    expect(actQuestMarks(world, run, f)).toEqual([]);
  });

  it('clear, rescue and unique goals', () => {
    const world = world4();
    send(world, { kind: 'enterTown', act: 0 });
    world.hollow.actQuests = { sneezes: 'active' };
    stairs(world, 'down');
    world.dungeon!.graceUntilMs = Number.MAX_SAFE_INTEGER;
    setEncounterHandler(() => 'fled');
    stairs(world, 'down');
    const run = world.dungeon!;
    const f = runFloor(world)!;
    expect(run.depth).toBe(actStartDepth(0));
    const out: SimEvent[] = [];
    if (run.packs?.length) {
      expect(actQuestMarks(world, run, f).length).toBe(run.packs.length);
      stepActQuests(world, run, f, out);
      expect(world.hollow.actQuests!.sneezes).toBe('active');
      for (const p of run.packs) p.state = 'beaten';
    }
    stepActQuests(world, run, f, out);
    expect(world.hollow.actQuests!.sneezes).toBe(run.packs?.length ? 'done' : 'active');
    // The lost one waits on dry ground the Keeper can walk to.
    const c = rescueCell(f);
    expect(f.cells[c.y * f.cols + c.x]).toBe(1);
  });
});

describe('friends for hire (R0181)', () => {
  it('hire at the camp board for Shells; the friend follows, helps, and leaves with the trip', () => {
    const world = world4();
    world.inventory.shells = 100;
    send(world, { kind: 'enterTown', act: 0 });
    const board = hireBoard(0);
    expect(board.length).toBe(HOLLOW_R9C.friends.perBoard);
    // Not at the board: no hire.
    send(world, { kind: 'hollowR9', what: 'hire', id: board[0]! });
    expect(friendOf(world)).toBeNull();
    atService(world, 'hire');
    send(world, { kind: 'hollowR9', what: 'hire', id: 'nobody' });
    expect(friendOf(world)).toBeNull();
    const ev = send(world, { kind: 'hollowR9', what: 'hire', id: board[0]! });
    expect(friendOf(world)?.trainer).toBe(board[0]);
    expect(world.inventory.shells).toBe(100 - HOLLOW_R9C.friends.cost);
    expect(ev.some((e) => e.kind === 'hollowR9' && e.what === 'hired')).toBe(true);
    // Only one at a time.
    send(world, { kind: 'hollowR9', what: 'hire', id: board[1]! });
    expect(friendOf(world)?.trainer).toBe(board[0]);
    // Walks after the Keeper.
    const fr = world.dungeon!.friend!;
    const f = runFloor(world)!;
    const far = { x: world.keeper.pos.x, z: world.keeper.pos.z };
    fr.pos = { x: far.x, z: far.z };
    const stone = cellCentre(f, f.stairsDown!);
    world.keeper.pos = { ...stone };
    const d0 = Math.hypot(fr.pos.x - stone.x, fr.pos.z - stone.z);
    step(world, 1500);
    const d1 = Math.hypot(fr.pos.x - world.keeper.pos.x, fr.pos.z - world.keeper.pos.z);
    expect(d1).toBeLessThan(d0);
    // Into the act: the friend comes too and cheers each fight.
    stairs(world, 'down');
    world.dungeon!.graceUntilMs = Number.MAX_SAFE_INTEGER;
    setEncounterHandler(() => 'fled');
    stairs(world, 'down');
    expect(friendOf(world)).not.toBeNull();
    const lf = runFloor(world)!;
    const pack = lf.packs?.[0];
    if (pack) {
      const spec = encounterSpec(world, lf, pack, pack.cell);
      for (const id of spec.party)
        expect(spec.brave?.[id] ?? 0).toBeGreaterThanOrEqual(friendBrave(world));
    }
    send(world, { kind: 'leaveDungeon' });
    expect(world.location).toBe('grove');
    expect(friendOf(world)).toBeNull();
  });

  it('auras: sight, fetch and a heal once a level', () => {
    const world = underground();
    const run = world.dungeon!;
    const n = partyOf(world)[0]!;
    n.personality = 'cheerful';
    const base = fetchRadiusOf(world, n);
    run.friend = { trainer: 'pixel', pos: { ...world.keeper.pos }, facing: 0 };
    expect(friendSight(world)).toBe(HOLLOW_R9C.friends.sight);
    run.friend = { trainer: 'marina', pos: { ...world.keeper.pos }, facing: 0 };
    expect(fetchRadiusOf(world, n)).toBe(base + HOLLOW_R9C.friends.fetch);
    run.friend = { trainer: 'luna', pos: { ...world.keeper.pos }, facing: 0 };
    for (const m of partyOf(world)) m.needs.energy = 0.3;
    const ev = step(world, 300);
    expect(ev.filter((e) => e.kind === 'hollowR9' && e.what === 'friendHeal')).toHaveLength(1);
    expect(partyOf(world)[0]!.needs.energy).toBeGreaterThan(0.5);
    expect(DUNGEON.followDistance).toBeGreaterThan(0);
  });
});
