import { describe, expect, it } from 'vitest';
import { REGIONS, REGION_ORDER } from '../../src/config/regions';
import { regionLayout, walkableAt } from '../../src/config/region-layout';
import { WOOD_PATH, WOOD_POIS, WOOD_SPEC } from '../../src/config/region-wood';
import { REGION_ORIGIN } from '../../src/config/tuning-r11d1';
import { SIM } from '../../src/config/tuning';
import { WORLD_STREAM } from '../../src/config/tuning-world';
import { regionOf } from '../../src/sim/regions';
import {
  drawnRegion,
  planRegionWalk,
  REGION_SPECS,
  seamlessOffset,
  standsIn,
} from '../../src/sim/region-walk';
import type { RegionDef } from '../../src/config/regions';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

function run(world: World, steps: number, events: SimEvent[] = []): SimEvent[] {
  for (let i = 0; i < steps; i++) events.push(...stepWorld(world, SIM.stepMs));
  return events;
}

/** Walk the Keeper into the Wood from the Grove's north wood. */
function intoWood(world: World): void {
  const events: SimEvent[] = [];
  applyCommand(world, { kind: 'travel', exit: 'grove-wood' }, events);
  expect(world.location).toBe('region:wood');
}

describe('the Wood as a drawn region (WORLD-25)', () => {
  const l = regionLayout(WOOD_SPEC);

  it('opens the whole loop, every clearing and the tunnel lane, and fills the rest with trees', () => {
    for (const p of WOOD_PATH) expect(walkableAt(l, p.x, p.z), `${p.x},${p.z}`).toBe(true);
    for (const p of WOOD_POIS.filter((q) => q.tier !== 'micro'))
      expect(walkableAt(l, p.x + 3, p.z) || walkableAt(l, p.x - 3, p.z), p.id).toBe(true);
    const arrive = REGIONS.grove.exits.find((e) => e.to === 'wood')!.arrive;
    expect(walkableAt(l, arrive.x, arrive.z)).toBe(true);
    expect(walkableAt(l, 0, 54)).toBe(true);
    expect(l.trees.length).toBeGreaterThan(500);
    // Only trunks near open ground are solid (WORLD-25), so collision stays cheap.
    const solid = l.trees.filter((t) => t.solid).length;
    expect(solid).toBeGreaterThan(50);
    expect(solid).toBeLessThan(l.trees.length / 2);
  });

  it('cuts its scenery into the 16 u chunks, every tree in exactly one', () => {
    let n = 0;
    for (const c of l.chunks.values()) {
      n += c.trees.length;
      for (const i of c.trees) {
        const t = l.trees[i]!;
        expect(Math.floor(t.x / WORLD_STREAM.chunk)).toBe(c.cx);
        expect(Math.floor(t.z / WORLD_STREAM.chunk)).toBe(c.cz);
      }
    }
    expect(n).toBe(l.trees.length);
    // The forest margin past the edge is drawn too (12 u), so the grid runs -5..4 each way.
    expect(l.chunks.size).toBe(10 * 10);
  });

  it('plans a tap walk round the trees from the gate to the Wishing Oak', () => {
    const legs = planRegionWalk(l, { x: 0, z: 49 }, { x: -20, z: -30 });
    expect(legs.length).toBeGreaterThan(1);
    for (const p of legs) expect(walkableAt(l, p.x, p.z)).toBe(true);
  });
});

describe('walking between the Grove and the Wood (WORLD-39)', () => {
  it('walks into the tree tunnel, travels at the iris, and walks back out', () => {
    const world = createWorld(3, 0);
    world.keeper.pos = { x: -31, z: -40 };
    run(world, 2);
    world.keeper.input = { x: 0, z: -1 };
    const events = run(world, 40);
    world.keeper.input = { x: 0, z: 0 };
    expect(events.some((e) => e.kind === 'exitReached' && e.exit === 'grove-wood')).toBe(true);
    intoWood(world);
    expect(regionOf(world.location)).toBe('wood');
    expect(drawnRegion(world)).toBe('wood');
    expect(world.keeper.pos).toEqual({ x: 0, z: 49 });
    // Arriving on the far side never bounces straight back.
    expect(run(world, 5).some((e) => e.kind === 'exitReached')).toBe(false);
    // South down the lane to the tunnel's mouth.
    world.keeper.input = { x: 0, z: 1 };
    const back = run(world, 40);
    world.keeper.input = { x: 0, z: 0 };
    expect(back.some((e) => e.kind === 'exitReached' && e.exit === 'wood-trail')).toBe(true);
    applyCommand(world, { kind: 'travel', exit: 'wood-trail' }, []);
    expect(world.location).toBe('grove');
    expect(world.keeper.pos).toEqual({ x: -31, z: -43 });
  });

  it('keeps the Keeper on open ground in the Wood, sliding along the trees', () => {
    const world = createWorld(5, 0);
    intoWood(world);
    const l = regionLayout(WOOD_SPEC);
    for (const dir of [
      { x: 1, z: 0 },
      { x: -1, z: -0.3 },
      { x: 0.2, z: -1 },
    ]) {
      world.keeper.input = dir;
      for (let i = 0; i < 80; i++) {
        stepWorld(world, SIM.stepMs);
        expect(standsIn(l, world.keeper.pos.x, world.keeper.pos.z, 0.15)).toBe(true);
      }
    }
  });

  it('a tap walk in the Wood arrives', () => {
    const world = createWorld(6, 0);
    intoWood(world);
    world.keeper.moveTarget = { x: -6, z: 28 };
    run(world, 200);
    expect(world.keeper.moveTarget).toBeNull();
    expect(Math.hypot(world.keeper.pos.x + 6, world.keeper.pos.z - 28)).toBeLessThan(0.5);
  });

  it('a trip to the Wood and back leaves the Grove’s Nubbins as if the Keeper stayed', () => {
    const stay = createWorld(7, 0);
    const go = createWorld(7, 0);
    run(stay, 300);
    run(go, 300);
    intoWood(go);
    applyCommand(go, { kind: 'travel', exit: 'wood-trail' }, []);
    stay.keeper.pos = { ...go.keeper.pos };
    stay.keeper.facing = go.keeper.facing;
    run(stay, 600);
    run(go, 600);
    expect(JSON.stringify(go.nubbins)).toBe(JSON.stringify(stay.nubbins));
  });

  it('a carried Nubbin is set down at the border and stays home', () => {
    const world = createWorld(8, 0);
    run(world, 2400);
    const n = world.nubbins.find((m) => m.stage !== 'egg');
    if (!n) return;
    world.keeper.carrying = n.id;
    n.behavior.state = 'carried';
    intoWood(world);
    expect(world.keeper.carrying).toBeNull();
  });

  it('a save in the Wood loads in the Wood', () => {
    const world = createWorld(9, 0);
    intoWood(world);
    const back = deserialize(serialize(world, 0)).world;
    expect(back.location).toBe('region:wood');
    expect(back.keeper.pos).toEqual(world.keeper.pos);
  });
});

describe('coordinates (WORLD-56)', () => {
  it('keeps every region local and centred, inside ±80', () => {
    const m = REGION_ORIGIN.maxLocal;
    for (const id of REGION_ORDER) {
      const r = REGIONS[id];
      expect(r.size.w / 2, id).toBeLessThanOrEqual(m);
      expect(r.size.h / 2, id).toBeLessThanOrEqual(m);
      for (const e of r.exits) {
        expect(Math.abs(e.rect.x) <= m && Math.abs(e.rect.z) <= m, e.id).toBe(true);
      }
    }
  });

  it('re-bases a seamless crossing so each side keeps its footing within a step', () => {
    for (const id of REGION_ORDER) {
      for (const e of REGIONS[id].exits.filter((x) => x.kind === 'seamless')) {
        const back = REGIONS[e.to].exits.find((b) => b.to === id && b.kind === 'seamless');
        if (!back) continue;
        const a = seamlessOffset(e);
        const b = seamlessOffset(back);
        // There and back again lands within a few units (each arrival sits just inside).
        expect(Math.hypot(a.x + b.x, a.z + b.z), e.id).toBeLessThan(8);
      }
    }
  });
});

describe('a seamless border between drawn regions (WORLD-39, 56)', () => {
  it('crosses on foot without an iris and re-bases the Keeper into the neighbour', () => {
    // A stand-in shore: the engine only needs a spec and a built flag to draw and walk it.
    const shore = REGIONS.shore as RegionDef & { built: boolean };
    const was = shore.built;
    shore.built = true;
    REGION_SPECS.shore = {
      id: 'shore',
      size: shore.size,
      seed: 7,
      path: [
        { x: -68, z: 0 },
        { x: 60, z: 0 },
      ],
      loop: false,
      pois: [],
    };
    try {
      const world = createWorld(11, 0);
      const exit = REGIONS.grove.exits.find((e) => e.id === 'grove-marsh')!;
      world.keeper.pos = { x: 12, z: 41 };
      run(world, 2);
      world.keeper.input = { x: 0, z: 1 };
      const events = run(world, 30);
      world.keeper.input = { x: 0, z: 0 };
      // No iris: the step itself crossed, and the Keeper keeps its footing in shore coordinates.
      expect(events.some((e) => e.kind === 'exitReached')).toBe(false);
      expect(world.location).toBe('region:shore');
      const off = seamlessOffset(exit);
      expect(Math.abs(world.keeper.pos.x - (12 + off.x))).toBeLessThan(1);
      expect(Math.abs(world.keeper.pos.x)).toBeLessThanOrEqual(REGION_ORIGIN.maxLocal);
      expect(Math.abs(world.keeper.pos.z)).toBeLessThanOrEqual(REGION_ORIGIN.maxLocal);
    } finally {
      shore.built = was;
      delete REGION_SPECS.shore;
    }
  });
});
