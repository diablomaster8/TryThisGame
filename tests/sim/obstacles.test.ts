import { BRIDGE_DECK, BRIDGE_YAW } from '../../src/config/tuning-sim';
import { describe, expect, it } from 'vitest';
import { GROVE, SIM } from '../../src/config/tuning';
import { GROVE_COLLIDERS, WILD_PROPS } from '../../src/config/grove-layout';
import type { Collider } from '../../src/config/grove-layout';
import { blocked, contact, obstacles, resolve, softAt } from '../../src/sim/obstacles';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import { placeDecor } from '../../src/sim/decorate';
import { SCENERY } from '../../src/render/scenery';
import type { World } from '../../src/sim/types';

/** Distance from a point to a collider's drawn outline (0 inside). */
function outlineDistance(c: Collider, x: number, z: number): number {
  // Bisect on the walker radius at which `contact` stops reporting an overlap.
  if (contact(c, x, z, 0)) return 0;
  let lo = 0;
  let hi = 20;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (contact(c, x, z, mid)) hi = mid;
    else lo = mid;
  }
  return lo;
}

const SHAPES: Collider[] = [
  { id: 'c', x: 3, z: -2, yaw: 0, shape: { type: 'circle', r: 1.2 }, top: 1, flags: ['solid'] },
  {
    id: 'b',
    x: 3,
    z: -2,
    yaw: 0.7,
    shape: { type: 'box', hw: 2.6, hd: 1.1 },
    top: 1,
    flags: ['solid'],
  },
  {
    id: 's',
    x: 3,
    z: -2,
    yaw: -1.1,
    shape: { type: 'segment', len: 3, r: 0.2 },
    top: 1,
    flags: ['solid'],
  },
];

describe('collider shapes (MOVE-02)', () => {
  for (const c of SHAPES) {
    it(`a Keeper walking at a ${c.shape.type} from 32 directions ends outside it`, () => {
      const world = createWorld(1, 0);
      // Stand the shape in an otherwise empty table by testing `resolve` against it alone.
      for (let i = 0; i < 32; i++) {
        const a = (i / 32) * Math.PI * 2;
        const p = { x: c.x + Math.cos(a) * 6, z: c.z + Math.sin(a) * 6 };
        for (let step = 0; step < 80; step++) {
          p.x -= Math.cos(a) * 0.1;
          p.z -= Math.sin(a) * 0.1;
          const hit = contact(c, p.x, p.z, 0.35);
          if (hit) {
            p.x += hit.nx * hit.depth;
            p.z += hit.nz * hit.depth;
          }
        }
        expect(outlineDistance(c, p.x, p.z)).toBeGreaterThanOrEqual(0.35 - 1e-6);
      }
      expect(world).toBeTruthy();
    });
  }

  it('pushes a point out of a hill along the edge', () => {
    const h = GROVE.hills[0]!;
    const p = { x: h.x + 1, z: h.z };
    // Nubbins keep off the hills; the Keeper climbs them (MOVE-09), held at each cliff by the terrain.
    expect(blocked(p, null, 0.35, 'keeper')).toBe(false);
    expect(blocked(p, null, 0.35, 'nubbin')).toBe(true);
    expect(resolve(p, null, 0.35, 'nubbin')).toBe(true);
    expect(Math.hypot(p.x - h.x, p.z - h.z)).toBeGreaterThanOrEqual(h.r + 0.25 - 1e-9);
    expect(resolve(p, null, 0.35, 'nubbin')).toBe(false);
  });

  it("holds the Keeper off the cottage's back corner (the 3D cottage-corner bug)", () => {
    const world = createWorld(1, 0);
    const c = GROVE.buildings.cottage;
    world.keeper.pos = { x: c.x - 2.5, z: c.z - 1.7 };
    applyCommand(world, { kind: 'moveKeeperTo', pos: { x: -9.5, z: 12.3 } }, []);
    for (let i = 0; i < 50; i++) stepWorld(world, SIM.stepMs);
    const k = world.keeper.pos;
    const inside = Math.abs(k.x - c.x) < 2.6 && Math.abs(k.z - c.z) < 2.0;
    expect(inside).toBe(false);
  });
});

describe('the shared layout (MOVE-01, MOVE-03)', () => {
  const near = (x: number, z: number, list: readonly { x: number; z: number }[]): boolean =>
    list.some((c) => Math.hypot(c.x - x, c.z - z) < 0.3);

  it('every drawn solid in the pixel scenery has a collider at its spot', () => {
    for (const s of SCENERY) {
      if (s.kind === 'caveMouth') continue; // its lips stand either side, the mouth is open
      const ok = near(s.x, s.z, GROVE_COLLIDERS);
      expect(ok, `${s.kind} at ${s.x},${s.z}`).toBe(true);
    }
  });

  it('every collider is something drawn (the layout, GROVE or the stalls)', () => {
    const drawn = [
      ...SCENERY,
      ...GROVE.hills,
      ...GROVE.rocks,
      { x: -12.4 + 0.2, z: -13.6 - 1.9 },
      { x: -12.4 + 0.2, z: -13.6 + 1.9 },
      { x: -12, z: 17.5 },
      { x: -9.5, z: 18.5 },
      { x: -14.5, z: 18.8 },
      { x: -4, z: 4 },
      { x: 4, z: -3 },
      { x: 9, z: 7 },
      { x: -8, z: -6 },
      // Hill 1's waterfall face (R0011), on the cascade's line down the hill.
      ...(() => {
        const h = GROVE.hills[1]!;
        const f = GROVE.river.inflow[0]!;
        const len = Math.hypot(f.x - h.x, f.z - h.z);
        const mid = (h.r * 0.2 + h.r + 0.3) / 2;
        return [{ x: h.x + ((f.x - h.x) / len) * mid, z: h.z + ((f.z - h.z) / len) * mid }];
      })(),
      // The bridge rails (R0002), either side of the deck.
      ...[-1, 1].map((side) => ({
        x: GROVE.bridge.x + side * BRIDGE_DECK.railOffset * Math.cos(BRIDGE_YAW),
        z: GROVE.bridge.z - side * BRIDGE_DECK.railOffset * Math.sin(BRIDGE_YAW),
      })),
    ];
    // A sliver join (MOVE-34) bridges two drawn things and is not drawn itself.
    for (const c of GROVE_COLLIDERS)
      if (!c.id.startsWith('join-')) expect(near(c.x, c.z, drawn), c.id).toBe(true);
    expect(WILD_PROPS.length).toBeGreaterThan(50);
  });

  it('stalls collide only once the village has grown to them', () => {
    const world = createWorld(1, 0);
    const spot = { x: -12, z: 17.5 };
    expect(blocked(spot, world)).toBe(false);
    world.town.prosperity = 1e9;
    expect(blocked(spot, world)).toBe(true);
  });

  it('a bush slows the Keeper instead of stopping it, and Nubbins pass', () => {
    const world = createWorld(1, 0);
    const bush = { x: -11, z: 1 };
    expect(softAt(bush, world)).not.toBeNull();
    expect(blocked(bush, world, 0.3, 'nubbin')).toBe(false);
    expect(blocked(bush, world, 0.3, 'keeper')).toBe(false);
  });

  it('wild trunks stop the Keeper but not a Nubbin', () => {
    const world = createWorld(1, 0);
    const trunk = { x: -30, z: -30 };
    expect(blocked(trunk, world, 0.3, 'keeper')).toBe(true);
    expect(blocked(trunk, world, 0.3, 'nubbin')).toBe(false);
  });
});

/** A closed 4×4 fence pen centred on (cx, cz), placed through the shop's own rules. */
function pen(world: World, cx: number, cz: number): void {
  world.inventory.decor.fence = 16;
  for (const o of [-1.5, -0.5, 0.5, 1.5]) {
    for (const side of [-2, 2]) {
      expect(placeDecor(world, 'fence', { x: cx + o, z: cz + side }, [], 0)).toBe(true);
      expect(placeDecor(world, 'fence', { x: cx + side, z: cz + o }, [], Math.PI / 2)).toBe(true);
    }
  }
}

describe('placed decor collides by kind (MOVE-04)', () => {
  it('keeps a Nubbin inside a fence pen for 10 sim minutes', () => {
    const world = createWorld(5, 0);
    const [cx, cz] = [-26, 0];
    pen(world, cx, cz);
    const n = world.nubbins[0]!;
    world.nubbins = [n];
    n.stage = 'child';
    n.pos = { x: cx, z: cz };
    for (let i = 0; i < 6000; i++) {
      stepWorld(world, SIM.stepMs);
      if (world.nubbins[0] !== n) break;
      expect(Math.abs(n.pos.x - cx) < 2 && Math.abs(n.pos.z - cz) < 2, `step ${i}`).toBe(true);
    }
  });

  it('a spry Nubbin (Run 20) hops the fence, the Keeper does not walk through', () => {
    const world = createWorld(5, 0);
    pen(world, -26, 0);
    const rail = { x: -26, z: -2 };
    expect(blocked(rail, world, 0.3, 'nubbin')).toBe(true);
    expect(blocked(rail, world, 0.3, 'hopper')).toBe(false);
    world.keeper.pos = { x: -26, z: -6 };
    applyCommand(world, { kind: 'keeperInput', input: { x: 0, z: 1 } }, []);
    for (let i = 0; i < 60; i++) stepWorld(world, SIM.stepMs);
    expect(world.keeper.pos.z).toBeLessThan(-2);
  });

  it('a turned fence collides along its turn', () => {
    const world = createWorld(5, 0);
    world.inventory.decor.fence = 1;
    expect(placeDecor(world, 'fence', { x: -24, z: -10 }, [], Math.PI / 2)).toBe(true);
    expect(blocked({ x: -24, z: -10.45 }, world, 0)).toBe(true);
    expect(blocked({ x: -24.45, z: -10 }, world, 0)).toBe(false);
  });

  it('path tiles stay walkable', () => {
    const world = createWorld(5, 0);
    world.inventory.decor.pathTile = 1;
    expect(placeDecor(world, 'pathTile', { x: -24, z: -10 }, [])).toBe(true);
    expect(obstacles(world).length).toBe(obstacles(createWorld(5, 0)).length);
  });
});
