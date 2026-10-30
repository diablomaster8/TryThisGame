import { surfacePace } from '../../src/sim/surface-pace';
import { describe, expect, it } from 'vitest';
import { GROVE, SIM } from '../../src/config/tuning';
import { BRIDGE_DECK, BRIDGE_YAW, JUMP, KEEPER_WADE } from '../../src/config/tuning-sim';
import { placeDecor } from '../../src/sim/decorate';
import { keeperFooting, stepKeeperMotion, updateKeeper } from '../../src/sim/keeper';
import { colliderTopY, obstacles } from '../../src/sim/obstacles';
import { deserialize, serialize } from '../../src/sim/save';
import { deckY, footing, WATER_LEVEL } from '../../src/sim/terrain';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { Command, SimEvent, Vec2, World } from '../../src/sim/types';

// MOVE-10/11/12/13/15: the Keeper's height, the jump, the bridge deck and the stream wade.

const SUB = 1000 / 60;

function bare(gentle = false): World {
  const w = createWorld(1, 0);
  w.nubbins = [];
  w.settings.gentleJumps = gentle;
  return w;
}

/** Put the Keeper at a spot with its feet on the ground there. */
function standAt(w: World, p: Vec2): void {
  w.keeper.pos = { x: p.x, z: p.z };
  w.keeper.y = keeperFooting(w, p.x, p.z).y;
  w.keeper.vy = 0;
  w.keeper.grounded = true;
}

/** Run `n` fine substeps, gathering events. */
function sub(w: World, n: number, events: SimEvent[] = []): SimEvent[] {
  for (let i = 0; i < n; i++) updateKeeper(w, SUB, events);
  return events;
}

const jump = (w: World, down: boolean, ev: SimEvent[] = []): void =>
  applyCommand(w, { kind: 'jump', down }, ev);

/** Substeps until the Keeper is grounded again (bounded). */
function untilLanded(w: World, events: SimEvent[] = []): number {
  let n = 0;
  do {
    sub(w, 1, events);
    n++;
  } while (!w.keeper.grounded && n < 600);
  return n;
}

const jumps = (ev: SimEvent[]): Array<{ air: boolean }> =>
  ev.flatMap((e) => (e.kind === 'keeperJumped' ? [{ air: e.air }] : []));

const START = GROVE.keeperStart;

describe.each([
  ['standard', false],
  ['gentle', true],
] as const)('the jump, %s tuning (MOVE-11)', (_name, gentle) => {
  const tune = gentle ? JUMP.kidFloat : JUMP;

  it('a held jump peaks at the tuned height and lands grounded', () => {
    const w = bare(gentle);
    standAt(w, START);
    const y0 = w.keeper.y;
    jump(w, true);
    let apex = y0;
    const ev: SimEvent[] = [];
    untilLanded(w, ev);
    // untilLanded steps past the apex; replay to measure it.
    const w2 = bare(gentle);
    standAt(w2, START);
    jump(w2, true);
    for (let i = 0; i < 120 && (i === 0 || !w2.keeper.grounded); i++) {
      sub(w2, 1);
      apex = Math.max(apex, w2.keeper.y);
    }
    expect(apex - y0).toBeGreaterThan(JUMP.height - 0.08);
    expect(apex - y0).toBeLessThan(JUMP.height + 0.01);
    expect(w.keeper.grounded).toBe(true);
    expect(w.keeper.y).toBeCloseTo(y0, 5);
    expect(ev.some((e) => e.kind === 'keeperLanded')).toBe(true);
  });

  it('a double jump at the apex rises the double height again', () => {
    const w = bare(gentle);
    standAt(w, START);
    jump(w, true);
    do sub(w, 1);
    while (w.keeper.vy > 0);
    const atApex = w.keeper.y;
    jump(w, false);
    const ev: SimEvent[] = [];
    jump(w, true);
    let apex = atApex;
    for (let i = 0; i < 120 && !w.keeper.grounded; i++) {
      sub(w, 1, ev);
      apex = Math.max(apex, w.keeper.y);
    }
    expect(jumps(ev)).toEqual([{ air: true }]);
    expect(apex - atApex).toBeGreaterThan(JUMP.doubleHeight - 0.08);
    expect(apex - atApex).toBeLessThan(JUMP.doubleHeight + 0.01);
  });

  it('letting go early makes a short hop', () => {
    const w = bare(gentle);
    standAt(w, START);
    const y0 = w.keeper.y;
    jump(w, true);
    sub(w, 2);
    jump(w, false);
    let apex = y0;
    for (let i = 0; i < 120 && !w.keeper.grounded; i++) {
      sub(w, 1);
      apex = Math.max(apex, w.keeper.y);
    }
    expect(apex - y0).toBeGreaterThan(0.1);
    expect(apex - y0).toBeLessThan(JUMP.height * 0.55);
  });

  /** Stand on a ledge 0.9 up and step off it: the ground falls away under the feet. */
  function offLedge(): World {
    const w = bare(gentle);
    standAt(w, START);
    w.keeper.y += 0.9;
    sub(w, 1);
    expect(w.keeper.grounded).toBe(false);
    return w;
  }

  it('walking off a 0.9 ledge falls and lands on the ground below', () => {
    const w = offLedge();
    untilLanded(w);
    expect(w.keeper.y).toBeCloseTo(keeperFooting(w, START.x, START.z).y, 5);
  });

  it('coyote time: a jump just after leaving the ledge is a ground jump, a late one is not', () => {
    const early = Math.floor((tune.coyoteMs - 20) / SUB);
    const late = Math.ceil((tune.coyoteMs + 20) / SUB);
    const a = offLedge();
    sub(a, early - 1);
    const evA: SimEvent[] = [];
    jump(a, true);
    sub(a, 1, evA);
    expect(jumps(evA)).toEqual([{ air: false }]);
    const b = offLedge();
    sub(b, late - 1);
    const evB: SimEvent[] = [];
    jump(b, true);
    sub(b, 1, evB);
    // Too late for the ground: the press spends the air jump instead.
    expect(jumps(evB)).toEqual([{ air: true }]);
  });

  it('buffer: a press shortly before landing jumps on touchdown', () => {
    // Jump, double jump, then fall; press at substep `pressAt` of the fall (or never).
    const run = (pressAt: number | null): { ev: SimEvent[]; landedAt: number } => {
      const w = bare(gentle);
      standAt(w, START);
      const ev: SimEvent[] = [];
      jump(w, true);
      sub(w, 4, ev);
      jump(w, false);
      jump(w, true);
      sub(w, 1, ev);
      jump(w, false);
      let landedAt = -1;
      for (let i = 0; i < 200; i++) {
        if (i === pressAt) jump(w, true);
        sub(w, 1, ev);
        if (landedAt < 0 && w.keeper.grounded) landedAt = i;
      }
      return { ev, landedAt };
    };
    const dry = run(null).landedAt;
    expect(dry).toBeGreaterThan(10);
    const before = Math.floor((tune.bufferMs - 30) / SUB);
    const { ev } = run(dry - before);
    // The ground jump, the air jump, then the buffered jump on touchdown.
    expect(jumps(ev)).toEqual([{ air: false }, { air: true }, { air: false }]);
  });
});

describe('vertical state (MOVE-10)', () => {
  it('a bench (top 0.44) blocks a walk, and can be jumped onto and stood on', () => {
    const w = bare();
    const at = { x: -4, z: 9 };
    w.inventory.decor.bench = 1;
    expect(placeDecor(w, 'bench', at, [], 0)).toBe(true);
    const bench = obstacles(w).find((c) => c.id.startsWith('decor') && c.top === 0.44)!;
    expect(bench).toBeDefined();
    const top = colliderTopY(bench);
    // Walking in stops at the bench's edge.
    standAt(w, { x: bench.x, z: bench.z - 1 });
    w.keeper.input = { x: 0, z: 1 };
    sub(w, 60);
    expect(w.keeper.pos.z).toBeLessThan(bench.z - 0.3);
    expect(w.keeper.y).toBeLessThan(top - 0.3);
    // Jump, steer over the seat, let go of the stick and land on it. It carries on a
    // little as it slows (MOVE-20), so it lets go a step short of the middle.
    jump(w, true);
    for (let i = 0; i < 60 && w.keeper.pos.z < bench.z - 0.25; i++) sub(w, 1);
    w.keeper.input = { x: 0, z: 0 };
    untilLanded(w);
    expect(w.keeper.y).toBeCloseTo(top, 3);
    sub(w, 60);
    expect(w.keeper.y).toBeCloseTo(top, 3);
    expect(w.keeper.grounded).toBe(true);
  });

  it('a fence stops a walk and is jumped over (the Keeper half of MOVE-04)', () => {
    const w = bare();
    w.inventory.decor.fence = 1;
    expect(placeDecor(w, 'fence', { x: -4, z: 9 }, [], 0)).toBe(true);
    const fence = obstacles(w).find((c) => c.top === 0.6 && c.flags.includes('hop'))!;
    standAt(w, { x: fence.x, z: fence.z - 1.2 });
    w.keeper.input = { x: 0, z: 1 };
    sub(w, 60);
    expect(w.keeper.pos.z).toBeLessThan(fence.z);
    standAt(w, { x: fence.x, z: fence.z - 1.2 });
    w.keeper.running = true;
    jump(w, true);
    sub(w, 60);
    expect(w.keeper.pos.z).toBeGreaterThan(fence.z + 0.4);
  });

  it('a carried Nubbin rules out the jump: the button shakes instead', () => {
    const w = createWorld(1, 0);
    const n = w.nubbins[0]!;
    w.keeper.carrying = n.id;
    n.behavior.state = 'carried';
    standAt(w, w.keeper.pos);
    const ev: SimEvent[] = [];
    jump(w, true, ev);
    sub(w, 3, ev);
    expect(jumps(ev)).toEqual([]);
    expect(ev.some((e) => e.kind === 'eggShaken' || e.kind === 'reaction')).toBe(true);
  });

  it('a v6 save migrates with the feet on the ground', () => {
    const w = bare();
    const file = JSON.parse(serialize(w, 0)) as {
      version: number;
      world: { keeper: Record<string, unknown> };
    };
    file.version = 6;
    for (const f of ['y', 'vy', 'grounded', 'airJumps', 'coyoteMs', 'bufferMs', 'jumpHeld'])
      delete file.world.keeper[f];
    const back = deserialize(JSON.stringify(file)).world;
    expect(back.keeper.y).toBeCloseTo(footing(back.keeper.pos.x, back.keeper.pos.z).y, 5);
    expect(back.keeper.grounded).toBe(true);
    expect(back.keeper.vy).toBe(0);
  });
});

describe('fine Keeper substeps (MOVE-15)', () => {
  const log: Array<[number, Command]> = [
    [0, { kind: 'keeperInput', input: { x: 1, z: 0 } }],
    [3, { kind: 'jump', down: true }],
    [5, { kind: 'jump', down: false }],
    [9, { kind: 'keeperInput', input: { x: 0, z: -1 } }],
    [14, { kind: 'jump', down: true }],
    [20, { kind: 'keeperInput', input: { x: 0, z: 0 } }],
  ];

  /** Replay a command log on sim steps with `fine` substeps between them, as game.ts does. */
  function replay(fine: number): { x: number; z: number; y: number } {
    const w = bare();
    for (let step = 0; step < 30; step++) {
      for (const [at, cmd] of log) if (at === step) applyCommand(w, cmd, []);
      for (let i = 0; i < fine; i++) stepKeeperMotion(w, []);
      stepWorld(w, SIM.stepMs);
    }
    return { x: w.keeper.pos.x, z: w.keeper.pos.z, y: w.keeper.y };
  }

  it('the same command log gives the same positions, however the substeps were split', () => {
    const a = replay(0);
    expect(replay(0)).toEqual(a);
    expect(replay(3)).toEqual(a);
    expect(replay(6)).toEqual(a);
  });

  it('a jump shows within one substep, never more than a sim step ahead', () => {
    const w = bare();
    standAt(w, START);
    const y0 = w.keeper.y;
    jump(w, true);
    expect(stepKeeperMotion(w, [])).toBe(true);
    expect(w.keeper.y).toBeGreaterThan(y0);
    for (let i = 1; i < 6; i++) expect(stepKeeperMotion(w, [])).toBe(true);
    expect(stepKeeperMotion(w, [])).toBe(false);
  });
});

describe('the bridge deck (MOVE-12)', () => {
  const c = Math.cos(BRIDGE_YAW);
  const s = Math.sin(BRIDGE_YAW);
  /** A point in the bridge's own frame: lx across, lz along. */
  const at = (lx: number, lz: number): Vec2 => ({
    x: GROVE.bridge.x + lx * c + lz * s,
    z: GROVE.bridge.z - lx * s + lz * c,
  });

  it('walking across keeps the feet on the planks, within 0.05 u', () => {
    const w = bare();
    standAt(w, at(0, -BRIDGE_DECK.hd - 0.6));
    const dir = at(0, 1);
    w.keeper.input = { x: dir.x - GROVE.bridge.x, z: dir.z - GROVE.bridge.z };
    let onDeck = 0;
    for (let i = 0; i < 120; i++) {
      sub(w, 1);
      const d = deckY(w.keeper.pos.x, w.keeper.pos.z);
      if (d === null) continue;
      onDeck++;
      expect(Math.abs(w.keeper.y - d)).toBeLessThan(0.05);
    }
    expect(onDeck).toBeGreaterThan(20);
    // It came out on the far bank, dry.
    expect(deckY(w.keeper.pos.x, w.keeper.pos.z)).toBeNull();
    expect(keeperFooting(w, w.keeper.pos.x, w.keeper.pos.z).on).toBe('land');
  });

  it('a rail stops a sideways step off the deck', () => {
    for (const side of [-1, 1]) {
      const w = bare();
      standAt(w, at(0, 0));
      const out = at(side, 0);
      w.keeper.input = { x: out.x - GROVE.bridge.x, z: out.z - GROVE.bridge.z };
      sub(w, 90);
      expect(deckY(w.keeper.pos.x, w.keeper.pos.z)).not.toBeNull();
      expect(w.keeper.y).toBeGreaterThan(WATER_LEVEL);
    }
  });
});

describe('the stream (MOVE-13)', () => {
  // A stretch of the outflow well away from the bridge, crossed square to its line.
  const a = GROVE.river.outflow[1]!;
  const b = GROVE.river.outflow[2]!;
  const len = Math.hypot(b.x - a.x, b.z - a.z);
  const across = { x: (b.z - a.z) / len, z: -(b.x - a.x) / len };
  const mid = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
  const from = (d: number): Vec2 => ({ x: mid.x + across.x * d, z: mid.z + across.z * d });

  it('a wading Keeper stands in the water, sunk to the bed, at 0.55× speed', () => {
    const w = bare();
    standAt(w, mid);
    const f = keeperFooting(w, mid.x, mid.z);
    expect(f.on).toBe('water');
    expect(w.keeper.y).toBeLessThan(WATER_LEVEL);
    expect(f.sink).toBeLessThanOrEqual(KEEPER_WADE.maxSink + 1e-9);
    // Along the stream, so it stays in the water.
    const along = { x: (b.x - a.x) / len, z: (b.z - a.z) / len };
    // Up to speed first (MOVE-20), then measured.
    w.keeper.input = along;
    sub(w, 12);
    const p0 = { ...w.keeper.pos };
    sub(w, 6);
    const wet = Math.hypot(w.keeper.pos.x - p0.x, w.keeper.pos.z - p0.z);
    const d = bare();
    standAt(d, START);
    d.keeper.input = along;
    sub(d, 12);
    const q0 = { ...d.keeper.pos };
    sub(d, 6);
    const dry = Math.hypot(d.keeper.pos.x - q0.x, d.keeper.pos.z - q0.z);
    // R0119: the dry run may be on a path, a little quicker than grass; compare at grass pace.
    const pace = surfacePace(d, q0.x, q0.z);
    expect(surfacePace(d, d.keeper.pos.x, d.keeper.pos.z)).toBe(pace);
    expect((wet / dry) * pace).toBeCloseTo(KEEPER_WADE.speed, 2);
  });

  it('R0001: on the stream centre line the wade is knee-deep, not ankle-deep', () => {
    const w = bare();
    const f = keeperFooting(w, mid.x, mid.z);
    expect(f.sink).toBeGreaterThan(KEEPER_WADE.maxSink * 0.8);
  });

  it('a running jump from one bank lands on the other, never touching the water', () => {
    const w = bare();
    // The near bank's edge: the last dry spot before the water.
    let d = -3;
    while (keeperFooting(w, from(d + 0.05).x, from(d + 0.05).z).on === 'land') d += 0.05;
    standAt(w, from(d));
    w.keeper.running = true;
    w.keeper.input = across;
    jump(w, true);
    let wetLanding = false;
    const ev: SimEvent[] = [];
    for (let i = 0; i < 60; i++) {
      sub(w, 1, ev);
      if (w.keeper.grounded && keeperFooting(w, w.keeper.pos.x, w.keeper.pos.z).on === 'water')
        wetLanding = true;
      if (ev.some((e) => e.kind === 'keeperLanded')) break;
    }
    expect(wetLanding).toBe(false);
    expect(keeperFooting(w, w.keeper.pos.x, w.keeper.pos.z).on).toBe('land');
    // And it is across: on the far side of the centre line.
    const side = (w.keeper.pos.x - mid.x) * across.x + (w.keeper.pos.z - mid.z) * across.z;
    expect(side).toBeGreaterThan(0);
  });
});
