import { describe, expect, it } from 'vitest';
import { DUNGEON, HOLLOW } from '../../src/config/tuning';
import {
  cellCentre,
  exploredMask,
  floorOfRun,
  isWalkable,
  revealAround,
} from '../../src/sim/dungeon';
import {
  actorShown,
  FOG_HIDDEN,
  FOG_REMEMBERED,
  FOG_VISIBLE,
  fogBytes,
  fogState,
  inSight,
  lootShown,
  sightRadius,
} from '../../src/sim/dungeon-sight';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

/** Fog of war (R0153): the pure rules both renderers and the automap read. */

const LEVELS = HOLLOW.fog;
const byte = (v: number) => Math.round(v * 255);

function enter() {
  const world = createWorld(7, 0);
  const events: SimEvent[] = [];
  applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
  const run = world.dungeon!;
  return { world, run, f: floorOfRun(run) };
}

describe('the in-sight rule', () => {
  it('is the explore disc: the sight radius matches it while the bonuses are 0', () => {
    expect(sightRadius()).toBe(DUNGEON.explore.radius);
    const kc = { x: 10, y: 10 };
    expect(inSight(kc, 10, 10, 4)).toBe(true);
    expect(inSight(kc, 14, 10, 4)).toBe(true);
    expect(inSight(kc, 13, 13, 4)).toBe(false);
  });

  it('classifies hidden, remembered and visible cells', () => {
    const mask = new Uint8Array([0, 1, 1, 1]);
    const kc = { x: 0, y: 0 };
    expect(fogState(mask, 4, 1, kc, 1, 0, 0)).toBe(FOG_HIDDEN);
    expect(fogState(mask, 4, 1, kc, 1, 1, 0)).toBe(FOG_VISIBLE);
    expect(fogState(mask, 4, 1, kc, 1, 3, 0)).toBe(FOG_REMEMBERED);
    expect(fogState(mask, 4, 1, kc, 1, -1, 0)).toBe(FOG_HIDDEN);
  });
});

describe('the fog texture bytes', () => {
  it('on a fresh floor only the cells round the stairs up are lit', () => {
    const { run, f } = enter();
    const mask = exploredMask(run, f);
    const bytes = fogBytes(mask, f.cols, f.rows, f.stairsUp, sightRadius(), LEVELS);
    const r = sightRadius();
    for (let y = 0; y < f.rows; y++)
      for (let x = 0; x < f.cols; x++) {
        const b = bytes[y * f.cols + x];
        const near = inSight(f.stairsUp, x, y, r);
        expect(b).toBe(near ? byte(LEVELS.visible) : byte(LEVELS.hidden));
      }
  });

  it('after a walk, seen cells match the mask: lit in sight, dimmed behind, dark elsewhere', () => {
    const { world, run, f } = enter();
    // Walk east along open ground as far as it goes (at most 12 cells), revealing as the sim does.
    let c = { ...f.stairsUp };
    for (let k = 0; k < 12 && isWalkable(f, c.x + 1, c.y); k++) {
      c = { x: c.x + 1, y: c.y };
      revealAround(run, f, c);
    }
    world.keeper.pos = cellCentre(f, c);
    const mask = exploredMask(run, f);
    const out = new Uint8Array(f.cols * f.rows);
    const bytes = fogBytes(mask, f.cols, f.rows, c, sightRadius(), LEVELS, out);
    expect(bytes).toBe(out);
    let remembered = 0;
    for (let i = 0; i < bytes.length; i++) {
      const x = i % f.cols;
      const y = Math.floor(i / f.cols);
      const want = !mask[i]
        ? byte(LEVELS.hidden)
        : inSight(c, x, y, sightRadius())
          ? byte(LEVELS.visible)
          : byte(LEVELS.remembered);
      expect(bytes[i]).toBe(want);
      if (want === byte(LEVELS.remembered)) remembered++;
    }
    // The walk moved the Keeper, so some of the start is now only remembered.
    if (c.x !== f.stairsUp.x) expect(remembered).toBeGreaterThan(0);
    // Actors draw only in sight; finds once their cell is seen.
    expect(actorShown(run, f, world.keeper.pos, world.keeper.pos)).toBe(true);
    const far = f.loot.find((l) => !mask[l.cell.y * f.cols + l.cell.x]);
    if (far) {
      expect(lootShown(run, f, far.cell)).toBe(false);
      expect(actorShown(run, f, world.keeper.pos, cellCentre(f, far.cell))).toBe(false);
    }
  });
});
