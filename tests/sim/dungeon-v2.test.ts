import { describe, expect, it } from 'vitest';
import { DUNGEON, HOLLOW, SIM } from '../../src/config/tuning';
import {
  cellAt,
  cellCentre,
  cellOf,
  elevationAt,
  exploredMask,
  exploredRooms,
  FLOOR,
  floorOf,
  floorSize,
  isExplored,
  LANDMARK_KINDS,
  runFloor,
  WALL,
  WATER,
  type Cell,
  type Floor,
} from '../../src/sim/dungeon';
import { generateV2 } from '../../src/sim/dungeon-gen';
import { hatch } from '../../src/sim/lifecycle';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

const SEEDS = Array.from({ length: 24 }, (_, i) => 101 + i * 7919);
const DEPTHS = [1, 3, 6, 10, DUNGEON.maxDepth];

// Generated once for the whole file (the floor cache only keeps a dozen).
let all: Array<{ f: Floor; seed: number; depth: number }> | null = null;
function each(fn: (f: Floor, seed: number, depth: number) => void): void {
  all ??= SEEDS.flatMap((seed) =>
    DEPTHS.map((depth) => ({ f: floorOf(seed, depth, 2), seed, depth })),
  );
  for (const { f, seed, depth } of all) fn(f, seed, depth);
}

function reaches(f: Floor): Set<string> {
  const seen = new Set<string>();
  const stack = [f.stairsUp];
  while (stack.length) {
    const c = stack.pop()!;
    const key = `${c.x},${c.y}`;
    if (seen.has(key) || cellAt(f, c.x, c.y) === WALL) continue;
    seen.add(key);
    stack.push(
      { x: c.x + 1, y: c.y },
      { x: c.x - 1, y: c.y },
      { x: c.x, y: c.y + 1 },
      { x: c.x, y: c.y - 1 },
    );
  }
  return seen;
}

const inside = (r: { x: number; y: number; w: number; h: number }, c: Cell) =>
  c.x >= r.x && c.y >= r.y && c.x < r.x + r.w && c.y < r.y + r.h;

function hatchedWorld(seed = 3) {
  const world = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) hatch(n, events, 0);
  return world;
}

function step(world: ReturnType<typeof createWorld>, ms: number): SimEvent[] {
  const out: SimEvent[] = [];
  for (let t = 0; t < ms; t += SIM.stepMs) out.push(...stepWorld(world, SIM.stepMs));
  return out;
}

describe('floor generator versions', () => {
  it('keeps version 1 floors exactly as they were before version 2', () => {
    // A hash of 120 version-1 floors taken from the generator before version 2 existed.
    let h = 2166136261;
    const mix = (s: string) => {
      for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
    };
    for (const seed of [1, 2, 3, 11, 12345, 987654321]) {
      for (let d = 1; d <= 20; d++) {
        const f = floorOf(seed, d, 1);
        expect(f.version).toBe(1);
        const old = {
          cols: f.cols,
          rows: f.rows,
          cells: Array.from(f.cells),
          rooms: f.rooms.map(({ x, y, w, h: rh }) => ({ x, y, w, h: rh })),
          stairsUp: f.stairsUp,
          stairsDown: f.stairsDown,
          chest: f.chest,
          torches: f.torches,
          crystals: f.crystals,
          loot: f.loot,
          strayStarts: f.strayStarts,
          wildSpots: f.wildSpots,
          light: f.light,
        };
        mix(JSON.stringify(old));
      }
    }
    expect(h >>> 0).toBe(1632269052);
    // Version 1 carries none of the new dressing.
    const v1 = floorOf(5, 3, 1);
    expect(v1.greatRoom).toBe(-1);
    expect(v1.landmark).toBeNull();
    expect(v1.nook).toBeNull();
    expect(v1.vistas).toEqual([]);
    expect(v1.crossings).toEqual([]);
    expect(v1.special).toBe('none');
    expect(v1.elevation.every((e) => e === 0)).toBe(true);
  });

  it('makes new floors with the current generator, the same every time for a seed', () => {
    // New floors come from version 3 now (R0143); version 2 stays deterministic for saved runs.
    expect(HOLLOW.genVersion).toBe(3);
    expect(floorOf(77, 2)).toBe(floorOf(77, 2, 3));
    for (const seed of SEEDS.slice(0, 8)) {
      for (const d of [1, 7]) {
        const a = generateV2(seed, d);
        const b = generateV2(seed, d);
        expect({ ...a, cells: Array.from(a.cells), elevation: Array.from(a.elevation) }).toEqual({
          ...b,
          cells: Array.from(b.cells),
          elevation: Array.from(b.elevation),
        });
      }
    }
    expect(Array.from(generateV2(1, 1).cells)).not.toEqual(Array.from(generateV2(2, 1).cells));
  });

  it('grows from 48×34 to at most 72×48', () => {
    expect(floorSize(1, 2)).toEqual({ cols: 48, rows: 34 });
    expect(floorSize(DUNGEON.maxDepth, 2)).toEqual({ cols: 72, rows: 48 });
    expect(floorSize(1, 1)).toEqual({ cols: 34, rows: 24 });
    expect(floorOf(9, 1, 2).cols).toBe(48);
  });
});

describe('version 2 floors', () => {
  it('stay connected, with stairs, chest, loot, strays and wild creatures on dry floor', () => {
    each((f) => {
      const reach = reaches(f);
      let open = 0;
      for (let i = 0; i < f.cells.length; i++) if (f.cells[i] !== WALL) open++;
      expect(reach.size).toBe(open);
      const dry = (c: Cell) => expect(cellAt(f, c.x, c.y)).toBe(FLOOR);
      dry(f.stairsUp);
      dry(f.chest);
      if (f.stairsDown) dry(f.stairsDown);
      for (const l of f.loot) dry(l.cell);
      for (const s of f.strayStarts) dry(s);
      for (const w of f.wildSpots) dry(w.cell);
      for (const t of f.torches) dry(t);
    });
    expect(floorOf(5, DUNGEON.maxDepth, 2).stairsDown).toBeNull();
  });

  it('have one great chamber, 2–4 medium rooms and small side rooms (item 4)', () => {
    each((f) => {
      const great = f.rooms.filter((r) => r.kind === 'great');
      expect(great.length).toBe(1);
      expect(f.rooms[f.greatRoom]).toBe(great[0]);
      const g = great[0]!;
      expect(g.w).toBeGreaterThanOrEqual(DUNGEON.layout.great.w[0]);
      expect(g.w).toBeLessThanOrEqual(DUNGEON.layout.great.w[1]);
      expect(g.h).toBeGreaterThanOrEqual(DUNGEON.layout.great.h[0]);
      const mediums = f.rooms.filter((r) => r.kind === 'medium').length;
      expect(mediums).toBeGreaterThanOrEqual(2);
      expect(mediums).toBeLessThanOrEqual(4);
      expect(f.rooms.some((r) => r.kind === 'small')).toBe(true);
      // The great chamber really is open: most of its ellipse is walkable.
      let open = 0;
      for (let y = g.y; y < g.y + g.h; y++)
        for (let x = g.x; x < g.x + g.w; x++) if (cellAt(f, x, y) !== WALL) open++;
      expect(open).toBeGreaterThan(g.w * g.h * 0.5);
    });
  });

  it('put a landmark in the great chamber with the way down in view of it (item 18 data)', () => {
    each((f) => {
      const lm = f.landmark!;
      expect(LANDMARK_KINDS).toContain(lm.kind);
      expect(inside(f.rooms[f.greatRoom]!, lm.cell)).toBe(true);
      expect(cellAt(f, lm.cell.x, lm.cell.y)).not.toBe(WALL);
      if (lm.kind === 'waterfallPool') expect(cellAt(f, lm.cell.x, lm.cell.y)).toBe(WATER);
      if (f.stairsDown) expect(inside(f.rooms[f.greatRoom]!, f.stairsDown)).toBe(true);
      for (const l of f.loot)
        expect(Math.hypot(l.cell.x - lm.cell.x, l.cell.y - lm.cell.y)).toBeGreaterThan(lm.radius);
    });
  });

  it('have terraces, ledges of one step and a lower pool basin (item 19)', () => {
    const E = DUNGEON.elev;
    let basins = 0;
    let terraces = 0;
    // Counted, not asserted per cell: tens of thousands of expects are slow.
    let outOfRange = 0;
    let cliffs = 0;
    let offGrid = 0;
    each((f) => {
      expect(f.elevation.length).toBe(f.cells.length);
      let sunk = false;
      for (let y = 0; y < f.rows; y++) {
        for (let x = 0; x < f.cols; x++) {
          const i = y * f.cols + x;
          const e = f.elevation[i]!;
          const c = f.cells[i];
          if (c === FLOOR) {
            if (e < -E.basinDepth || e > E.max) outOfRange++;
            if (e < 0) sunk = true;
            if (e >= E.step) terraces++;
            for (const [dx, dy] of [
              [1, 0],
              [0, 1],
            ] as const) {
              if (cellAt(f, x + dx, y + dy) !== FLOOR) continue;
              const d = Math.abs(e - f.elevation[(y + dy) * f.cols + x + dx]!);
              if (d > E.step) cliffs++;
            }
          } else if (c === WATER) {
            // Water sits below the ground it lies in.
            const ground = e + E.waterSink;
            if (Math.abs(Math.round(ground / E.step) * E.step - ground) > 1e-5) offGrid++;
          }
        }
      }
      if (sunk) basins++;
      // Level ground at the stairs and the chest: actors arrive flat.
      expect(f.elevation[f.stairsUp.y * f.cols + f.stairsUp.x]).toBe(0);
      expect(f.elevation[f.chest.y * f.cols + f.chest.x]).toBe(0);
      expect(elevationAt(f, cellCentre(f, f.stairsUp))).toBeCloseTo(0);
    });
    expect({ outOfRange, cliffs, offGrid }).toEqual({ outOfRange: 0, cliffs: 0, offGrid: 0 });
    expect(basins).toBeGreaterThan(SEEDS.length * DEPTHS.length * 0.9);
    expect(terraces).toBeGreaterThan(0);
  });

  it('blend elevation smoothly between cells for actors to walk on', () => {
    const f = floorOf(SEEDS[0]!, 3, 2);
    // Walk every pair of dry floor neighbours: halfway sits between the two.
    for (let y = 0; y < f.rows; y++) {
      for (let x = 0; x + 1 < f.cols; x++) {
        if (cellAt(f, x, y) !== FLOOR || cellAt(f, x + 1, y) !== FLOOR) continue;
        const a = cellCentre(f, { x, y });
        const b = cellCentre(f, { x: x + 1, y });
        const mid = elevationAt(f, { x: (a.x + b.x) / 2, z: a.z });
        const ea = f.elevation[y * f.cols + x]!;
        const eb = f.elevation[y * f.cols + x + 1]!;
        expect(mid).toBeGreaterThanOrEqual(Math.min(ea, eb) - 1e-6);
        expect(mid).toBeLessThanOrEqual(Math.max(ea, eb) + 1e-6);
      }
    }
  });

  it('open vistas through the outer wall onto the chasm (item 31)', () => {
    const steps = { n: [0, -1], e: [1, 0], s: [0, 1], w: [-1, 0] } as const;
    each((f) => {
      expect(f.vistas.length).toBeGreaterThanOrEqual(1);
      expect(f.vistas.length).toBeLessThanOrEqual(DUNGEON.vista.count[1]);
      for (const v of f.vistas) {
        expect(v.width).toBeGreaterThanOrEqual(1);
        expect(v.width).toBeLessThanOrEqual(DUNGEON.vista.maxWidth);
        expect(v.depth).toBeLessThanOrEqual(DUNGEON.vista.maxDepth);
        const along = v.dir === 'n' || v.dir === 's' ? [1, 0] : [0, 1];
        const [dx, dy] = steps[v.dir];
        for (let i = 0; i < v.width; i++) {
          const c = { x: v.cell.x + along[0]! * i, y: v.cell.y + along[1]! * i };
          expect(cellAt(f, c.x, c.y)).toBe(FLOOR);
          // Wall all the way to the grid edge, and the edge within `depth` cells.
          for (let k = 1; k <= v.depth; k++)
            expect(cellAt(f, c.x + dx * k, c.y + dy * k)).toBe(WALL);
          const x = c.x + dx * (v.depth + 1);
          const y = c.y + dy * (v.depth + 1);
          expect(x < 0 || y < 0 || x >= f.cols || y >= f.rows).toBe(true);
        }
        if (v.dir === 'n')
          expect(f.torches.some((t) => t.x === v.cell.x && t.y === v.cell.y)).toBe(false);
      }
    });
  });

  it('lay bridges and stepping stones over straight water runs (item 32)', () => {
    let total = 0;
    each((f) => {
      for (const c of f.crossings) {
        total++;
        expect(cellAt(f, c.from.x, c.from.y)).toBe(FLOOR);
        expect(cellAt(f, c.to.x, c.to.y)).toBe(FLOOR);
        expect(c.cells.length).toBeGreaterThanOrEqual(DUNGEON.crossing.minLen);
        expect(c.kind).toBe(c.cells.length >= DUNGEON.crossing.bridgeFrom ? 'bridge' : 'stones');
        const dx = Math.sign(c.to.x - c.from.x);
        const dy = Math.sign(c.to.y - c.from.y);
        expect(Math.abs(dx) + Math.abs(dy)).toBe(1);
        c.cells.forEach((w, i) => {
          expect(cellAt(f, w.x, w.y)).toBe(WATER);
          expect(w).toEqual({ x: c.from.x + dx * (i + 1), y: c.from.y + dy * (i + 1) });
        });
      }
      expect(f.crossings.length).toBeLessThanOrEqual(DUNGEON.crossing.max);
    });
    expect(total).toBeGreaterThan(SEEDS.length * DEPTHS.length);
  });

  it('give the chest a cosy nook in a small room, all on dry floor (item 33)', () => {
    each((f) => {
      const nook = f.nook!;
      const room = f.rooms[nook.room]!;
      expect(room.kind).toBe('small');
      expect(inside(room, f.chest)).toBe(true);
      expect(nook.lanterns.length).toBe(2);
      expect(nook.rug.length).toBeGreaterThan(0);
      for (const c of [...nook.rug, ...nook.lanterns, ...(nook.tent ? [nook.tent] : [])]) {
        expect(cellAt(f, c.x, c.y)).toBe(FLOOR);
        expect(f.loot.some((l) => l.cell.x === c.x && l.cell.y === c.y)).toBe(false);
      }
    });
  });

  it('make rare special floors, never near the top (item 41)', () => {
    const count = { none: 0, crystal: 0, flooded: 0, glowworm: 0 };
    const crystals = { none: [0, 0], crystal: [0, 0] };
    for (let seed = 1; seed <= 240; seed++) {
      const f = generateV2(seed, 8);
      count[f.special]++;
      if (f.special === 'none' || f.special === 'crystal') {
        crystals[f.special][0]! += f.crystals.length;
        crystals[f.special][1]! += 1;
      }
      if (f.special === 'crystal') expect(f.landmark!.kind).toBe('crystalTree');
      if (f.special === 'flooded') expect(f.landmark!.kind).toBe('waterfallPool');
      if (f.special === 'glowworm') expect(f.light).toBeGreaterThan(floorOf(seed, 8, 1).light);
    }
    for (const seed of SEEDS) expect(floorOf(seed, 1, 2).special).toBe('none');
    expect(count.none).toBeGreaterThan(180);
    expect(count.crystal).toBeGreaterThan(0);
    expect(count.flooded).toBeGreaterThan(0);
    expect(count.glowworm).toBeGreaterThan(0);
    // A crystal floor carries far more crystals than a plain one.
    const avg = (k: 'none' | 'crystal') => crystals[k][0]! / crystals[k][1]!;
    expect(avg('crystal')).toBeGreaterThan(avg('none') * 2);
  });
});

describe('the explored mask (item 40)', () => {
  it('starts round the stairs, grows as the Keeper walks, saves, and resets a floor down', () => {
    const world = hatchedWorld(21);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
    const run = world.dungeon!;
    const f = runFloor(world)!;
    expect(f.version).toBe(HOLLOW.genVersion);
    expect(isExplored(run, f, f.stairsUp.x, f.stairsUp.y)).toBe(true);
    expect(isExplored(run, f, f.chest.x, f.chest.y)).toBe(false);
    const seenAtStart = exploredMask(run, f).reduce((a, b) => a + b, 0);
    expect(exploredRooms(run, f)[0]).toBe(true);
    // Walk to the chest's room.
    world.keeper.pos = { ...cellCentre(f, f.chest) };
    step(world, 200);
    expect(isExplored(run, f, f.chest.x, f.chest.y)).toBe(true);
    expect(exploredMask(run, f).reduce((a, b) => a + b, 0)).toBeGreaterThan(seenAtStart);
    expect(exploredRooms(run, f)[f.nook!.room]).toBe(true);
    // It survives a save.
    const back = deserialize(serialize(world, 0)).world;
    expect(back.dungeon!.explored).toBe(run.explored);
    expect(isExplored(back.dungeon!, runFloor(back)!, f.chest.x, f.chest.y)).toBe(true);
    // A new floor starts unexplored but for its own stairs.
    applyCommand(world, { kind: 'dungeonGo', to: 'down' }, events);
    world.keeper.pos = { ...cellCentre(f, f.stairsDown!) };
    step(world, 200);
    expect(run.depth).toBe(2);
    const f2 = runFloor(world)!;
    expect(isExplored(run, f2, f2.stairsUp.x, f2.stairsUp.y)).toBe(true);
    expect(exploredMask(run, f2).reduce((a, b) => a + b, 0)).toBeLessThan(
      Math.PI * (DUNGEON.explore.radius + 1) ** 2 + 1,
    );
  });
});

describe('saves from before version 2', () => {
  it('keep the old floor they were on, and the next floor down is the current version', () => {
    const world = hatchedWorld(31);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
    // Write the save as the old build did: no genVersion, no explored mask, on a v1 floor.
    const data = JSON.parse(serialize(world, 0)) as {
      world: { dungeon: Record<string, unknown>; keeper: { pos: { x: number; z: number } } };
    };
    delete data.world.dungeon.genVersion;
    delete data.world.dungeon.explored;
    const seed = data.world.dungeon.seed as number;
    const old = floorOf(seed, 1, 1);
    data.world.keeper.pos = { ...cellCentre(old, old.stairsUp) };
    const back = deserialize(JSON.stringify(data)).world;
    const run = back.dungeon!;
    expect(run.genVersion).toBe(1);
    expect(run.explored).toBe('');
    const f = runFloor(back)!;
    expect(f).toBe(old);
    expect({ cols: f.cols, rows: f.rows }).toEqual({ cols: 34, rows: 24 });
    // The Keeper stands where the old floor says, and still walks it.
    expect(cellOf(f, back.keeper.pos)).toEqual(old.stairsUp);
    stepWorld(back, SIM.stepMs);
    expect(isExplored(run, f, old.stairsUp.x, old.stairsUp.y)).toBe(true);
    // Down the old floor's stairs: the new floor is made by the new generator.
    applyCommand(back, { kind: 'dungeonGo', to: 'down' }, events);
    back.keeper.pos = { ...cellCentre(f, f.stairsDown!) };
    step(back, 200);
    expect(run.depth).toBe(2);
    expect(run.genVersion).toBe(HOLLOW.genVersion);
    expect(runFloor(back)).toBe(floorOf(seed, 2, HOLLOW.genVersion));
  });
});
