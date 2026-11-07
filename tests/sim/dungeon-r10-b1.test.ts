import { afterEach, describe, expect, it } from 'vitest';
import { ACTS, actStartDepth } from '../../src/config/dungeon-acts';
import { HOLLOW, SIM } from '../../src/config/tuning';
import { HOLLOW_TOUR } from '../../src/config/tuning-more/dungeon-tour-tiles';
import { cellCentre, runFloor } from '../../src/sim/dungeon';
import { actBossDepth } from '../../src/sim/dungeon-acts';
import { autoResolve, setEncounterHandler } from '../../src/sim/dungeon-encounters';
import { generateV3 } from '../../src/sim/dungeon-gen-v3';
import { PIECES } from '../../src/sim/dungeon-pieces';
import { tourOf } from '../../src/sim/dungeon-tour';
import { mouthHere } from '../../src/sim/dungeon-zones';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import { measure } from './dungeon-measure';

// Lane B round 10, helper b1: the Sandglass, Frostbell and Gloom piece sets (R0144), the
// tunable tour bands (R0143) and a whole five-act journey above and below ground (R0145).

const SEEDS = 100;

describe('every act floors from its own pieces (R0144)', () => {
  for (const [act, def] of ACTS.entries()) {
    it(
      `act ${act + 1}, ${def.tileset}: 100 seeds connected, branching, varied`,
      {
        timeout: 120_000,
      },
      () => {
        const own = new Set(PIECES[def.tileset]!.map((p) => p.id));
        expect(own.size).toBeGreaterThanOrEqual(24);
        let inBand = 0;
        for (let s = 1; s <= SEEDS; s++) {
          const li = s % def.levels.length;
          const level = def.levels[li]!;
          const f = generateV3(s * 6_151, actStartDepth(act) + li, {
            level,
            tileset: def.tileset,
            boss: li === def.levels.length - 1,
          });
          const layout = f.layout!;
          expect(layout.tileset).toBe(def.tileset);
          expect(layout.pieces.every((p) => own.has(p.id))).toBe(true);
          expect(measure(f).connected).toBe(true);
          expect(layout.junctions).toBeGreaterThanOrEqual(3);
          expect(layout.pieces.filter((p) => p.role === 'treasure').length).toBeGreaterThanOrEqual(
            2,
          );
          const counts = new Map<string, number>();
          for (const p of layout.pieces) counts.set(p.id, (counts.get(p.id) ?? 0) + 1);
          expect(Math.max(...counts.values())).toBeLessThanOrEqual(HOLLOW.v3.maxRepeats);
          const [lo, hi] = HOLLOW_TOUR.bands[level];
          const t = measure(f).tour;
          if (t >= lo && t <= hi) inBand++;
        }
        expect(inBand / SEEDS).toBeGreaterThanOrEqual(HOLLOW_TOUR.share);
      },
    );
  }
});

describe('tour bands (R0143)', () => {
  it('are tunables, standard being the review’s 750–1,100 u', () => {
    expect(HOLLOW_TOUR.bands.standard).toEqual([750, 1100]);
    expect(HOLLOW_TOUR.bands.small[1]).toBeLessThan(HOLLOW_TOUR.bands.big[0] + 1);
    expect(HOLLOW_TOUR.share).toBeGreaterThanOrEqual(0.95);
  });

  it('the generator’s own tour matches the measured one', () => {
    for (let s = 1; s <= 10; s++) {
      const f = generateV3(s * 31, 2, { level: 'standard', tileset: 'gloom', boss: false });
      // The same walk, the same tie-breaks.
      expect(tourOf(f)).toBe(measure(f).tour);
    }
  });

  it('kid floors are not re-rolled', () => {
    const a = generateV3(9, 1, { level: 'kid', tileset: 'rootways', boss: false });
    const b = generateV3(9, 1, { level: 'kid', tileset: 'rootways', boss: false });
    expect(a.cells).toEqual(b.cells);
  });
});

// ---------------------------------------------------------------- the five-act journey

function keeperWorld(seed = 5): World {
  const world = createWorld(seed, 0);
  for (const n of world.nubbins) hatch(n, [], 0);
  return world;
}

function step(world: World, ms: number): SimEvent[] {
  const out: SimEvent[] = [];
  for (let t = 0; t < ms; t += SIM.stepMs) out.push(...stepWorld(world, SIM.stepMs));
  return out;
}

function send(world: World, cmd: Parameters<typeof applyCommand>[1]): SimEvent[] {
  const out: SimEvent[] = [];
  applyCommand(world, cmd, out);
  return out;
}

function stairs(world: World, to: 'down' | 'up'): SimEvent[] {
  const out = send(world, { kind: 'dungeonGo', to });
  const run = world.dungeon;
  if (run?.pendingPos) world.keeper.pos = { ...run.pendingPos };
  out.push(...step(world, 200));
  return out;
}

describe('five acts, D2-shaped (R0145)', () => {
  afterEach(() => setEncounterHandler(null));

  it(
    'each act: camp → fields → a side cave → the act dungeon → its boss → the next camp',
    {
      timeout: 120_000,
    },
    () => {
      setEncounterHandler(autoResolve);
      const world = keeperWorld();
      for (let act = 0; act < ACTS.length; act++) {
        const def = ACTS[act]!;
        // Into the act's camp: Act I from the Grove, later acts by the waypoint the boss above
        // opened.
        if (act === 0) send(world, { kind: 'enterTown', act: 0 });
        else {
          expect(world.hollow.waypoints).toContain(`${def.id}.town`);
          send(world, { kind: 'waypointTravel', id: `${def.id}.town` });
        }
        const run = world.dungeon!;
        expect(run.act).toBe(act);
        expect(run.zone).toBe('town');
        // Down onto the act's fields: two or three cave mouths.
        stairs(world, 'down');
        expect(run.zone).toBe('field');
        const field = runFloor(world)!;
        expect(field.mouths!.length).toBeGreaterThanOrEqual(2);
        expect(field.mouths!.length).toBeLessThanOrEqual(3);
        // Into a side cave of the act's own pieces, and back out at its mouth.
        const m = field.mouths![act % field.mouths!.length]!;
        world.keeper.pos = cellCentre(field, m);
        expect(mouthHere(world)).not.toBeNull();
        send(world, { kind: 'enterMouth' });
        expect(run.zone).toBe('side');
        const side = runFloor(world)!;
        const own = new Set(PIECES[def.tileset]!.map((p) => p.id));
        expect(side.layout!.pieces.every((p) => own.has(p.id))).toBe(true);
        expect(side.stairsDown).toBeNull();
        stairs(world, 'up');
        expect(run.zone).toBe('field');
        // Through the act gate and down the act dungeon to the boss.
        stairs(world, 'down');
        expect(run.zone).toBeUndefined();
        expect(run.depth).toBe(actStartDepth(act));
        while (run.depth < actBossDepth(act)) {
          expect(runFloor(world)!.layout!.pieces.every((p) => own.has(p.id))).toBe(true);
          run.graceUntilMs = 0;
          run.packs = [];
          stairs(world, 'down');
        }
        run.packs = run.packs!.filter((p) => p.id === 'pack-boss');
        expect(run.packs.length).toBe(1);
        let won = false;
        let fell = false;
        for (let tries = 0; tries < 40 && !won; tries++) {
          run.graceUntilMs = 0;
          const boss = run.packs[0]!;
          if (fell) boss.pos = { x: world.keeper.pos.x - 0.3, z: world.keeper.pos.z };
          else world.keeper.pos = { x: boss.pos.x + 0.3, z: boss.pos.z };
          const ev = step(world, 1500);
          fell = ev.some((e) => e.kind === 'hollowFell');
          won = ev.some((e) => e.kind === 'bossBeaten');
        }
        expect(won).toBe(true);
        expect(world.hollow.acts[act]!.bossDefeated).toBe(true);
        // The way on leads home with the haul; the next act's camp stone is awake.
        stairs(world, 'down');
        expect(world.location).toBe('grove');
        if (act + 1 < ACTS.length)
          expect(world.hollow.waypoints).toContain(`${ACTS[act + 1]!.id}.town`);
      }
      expect(world.hollow.acts.every((a) => a.bossDefeated)).toBe(true);
    },
  );
});
