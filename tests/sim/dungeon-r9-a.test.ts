import { describe, expect, it } from 'vitest';
import { ACTS, actStartDepth } from '../../src/config/dungeon-acts';
import { UNIQUES } from '../../src/config/dungeon-foes';
import { ACT_LOOKS, PORTAL_R9, UNIQUE_LOOKS } from '../../src/config/dungeon-r9-a';
import { DUNGEON, SIM } from '../../src/config/tuning';
import { actLookOf, bandFor, bandForFloor, caveSaturation } from '../../src/render/cave-bands';
import {
  footprintMarks,
  footprintPulse,
  guideMarks,
  lightRing,
  portalSpot,
} from '../../src/render/hollow-r9a';
import { speciesArt } from '../../src/render/sprites/species-art';
import { uniqueArtId, uniqueScale } from '../../src/render/sprites/unique-art';
import { actFloor } from '../../src/sim/dungeon-acts';
import { cellOf, runFloor } from '../../src/sim/dungeon';
import { guideOn, guidePath } from '../../src/sim/dungeon-guide';
import { uniqueSpecies } from '../../src/sim/dungeon-uniques';
import { sightRadius } from '../../src/sim/dungeon-sight';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// Lane B round 9, helper a: the Hollow's looks (R0156 uniques, R0150 portal, R0208 prints,
// R0190 act looks and the Keeper's light). The drawing itself is checked in the browser
// (recs-2026-10-27/tools/r9-b-a.cjs); these pin the data and the shared placement rules.

function keeperWorld(seed = 7): World {
  const world = createWorld(seed, 0);
  for (const n of world.nubbins) hatch(n, [], 0);
  return world;
}

function send(world: World, cmd: Parameters<typeof applyCommand>[1]): SimEvent[] {
  const out: SimEvent[] = [];
  applyCommand(world, cmd, out);
  return out;
}

function step(world: World, ms: number): void {
  for (let t = 0; t < ms; t += SIM.stepMs) stepWorld(world, SIM.stepMs);
}

describe('the uniques own looks (R0156)', () => {
  it('every unique has a look: its species recoloured and wearing a hat, built once', () => {
    const seen = new Set<string>();
    for (const u of UNIQUES) {
      const look = UNIQUE_LOOKS[u.id];
      expect(look, u.id).toBeDefined();
      const art = speciesArt(uniqueArtId(u.id));
      expect(art, u.id).toBeDefined();
      // Cached: the same recipe object every time (the sheet and look caches key on it).
      expect(speciesArt(uniqueArtId(u.id))).toBe(art);
      const base = speciesArt(uniqueSpecies(u.id))!;
      expect(art!.plan).toBe(base.plan);
      expect(art!.addons?.some((e) => e.kind === look!.hat)).toBe(true);
      expect(uniqueScale(u.id)).toBeGreaterThan(1);
      seen.add(`${art!.colors.body}:${art!.colors.accent}:${look!.hat}`);
    }
    // No two uniques look alike.
    expect(seen.size).toBe(UNIQUES.length);
    expect(uniqueScale(undefined)).toBe(1);
    expect(speciesArt('unique:nobody')).toBeUndefined();
  });
});

describe('act looks and the Keeper light (R0190)', () => {
  it('each act floor wears its own look; the endless Hollow keeps the depth bands', () => {
    const bgs = new Set<string>();
    ACTS.forEach((act, i) => {
      const f = actFloor(3, i, actStartDepth(i), 4);
      expect(f.act).toBe(i);
      const look = actLookOf(f)!;
      expect(look).toBe(ACT_LOOKS[act.tileset]);
      const band = bandForFloor(f, actStartDepth(i));
      expect(band.rock).toBe(look.rock);
      expect(band.torch).toBe(look.torch);
      // Stable: the same band object for the same act and depth band.
      expect(bandForFloor(f, actStartDepth(i))).toBe(band);
      bgs.add(band.background);
    });
    expect(bgs.size).toBe(ACTS.length);
    expect(bandForFloor({}, 7)).toBe(bandFor(7));
    expect(actLookOf({ zone: 'town', act: 1 })).toBeNull();
  });

  it('the Gloom colours back in as its packs are warmed, 0.2 to 1', () => {
    const gloom = ACTS.findIndex((a) => a.id === 'gloom');
    const f = { act: gloom };
    const packs = [{ state: 'idle' }, { state: 'idle' }, { state: 'idle' }, { state: 'idle' }];
    expect(caveSaturation(f, packs)).toBeCloseTo(0.2);
    packs[0]!.state = packs[1]!.state = 'beaten';
    expect(caveSaturation(f, packs)).toBeCloseTo(0.6);
    for (const p of packs) p.state = 'beaten';
    expect(caveSaturation(f, packs)).toBe(1);
    expect(
      caveSaturation(
        { act: 0 },
        packs.map(() => ({ state: 'idle' })),
      ),
    ).toBe(1);
  });

  it('the light ring sits at the sight radius in the act lamp colour', () => {
    const world = keeperWorld();
    send(world, { kind: 'enterAct', act: 1 });
    // Act II is shut until Act I's boss is beaten; Act I then.
    if (!world.dungeon) send(world, { kind: 'enterAct', act: 0 });
    const f = runFloor(world)!;
    const ring = lightRing(f, world.dungeon)!;
    expect(ring.r).toBeCloseTo((sightRadius(world.dungeon) + 0.5) * DUNGEON.cell);
    expect(ring.colour).toBe(actLookOf(f)!.lamp);
  });
});

describe('the guide on the cave floor (R0208)', () => {
  it('is on by default in kid mode, and the Keeper can still switch it off', () => {
    const world = keeperWorld();
    expect(guideOn(world)).toBe(false);
    world.settings.bouts = 'gentle';
    expect(guideOn(world)).toBe(true);
    send(world, { kind: 'hollowGuide', on: false });
    expect(guideOn(world)).toBe(false);
    send(world, { kind: 'hollowGuide', on: true });
    world.settings.bouts = 'play';
    expect(guideOn(world)).toBe(true);
  });

  it('prints lie on the path, left and right in turn, and point along it', () => {
    const world = keeperWorld();
    send(world, { kind: 'enterAct', act: 0 });
    world.dungeon!.graceUntilMs = 0;
    expect(guideMarks(world)).toEqual([]);
    send(world, { kind: 'hollowGuide', on: true });
    const f = runFloor(world)!;
    const path = guidePath(world)!;
    const marks = footprintMarks(f, path);
    expect(marks.length).toBeGreaterThan(0);
    expect(guideMarks(world)).toEqual(marks);
    marks.forEach((m, i) => {
      expect(m.side).toBe(i % 2 === 0 ? -1 : 1);
      const c = cellOf(f, m);
      expect(path.cells).toContain(c.y * f.cols + c.x);
    });
    // Static under reduced motion; a gentle breath otherwise.
    expect(footprintPulse(3, 1234, true)).toBe(1);
    const p = footprintPulse(3, 1234, false);
    expect(p).toBeGreaterThan(0.6);
    expect(p).toBeLessThanOrEqual(1);
  });
});

describe('the acorn portal (R0150)', () => {
  it('stands by the return spot while open, and is gone once stepped back through', () => {
    const world = keeperWorld();
    send(world, { kind: 'enterAct', act: 0 });
    expect(portalSpot(world)).toBeNull();
    send(world, { kind: 'useAcorn' });
    expect(world.location).toBe('grove');
    const spot = portalSpot(world)!;
    const k = world.hollow.portal!.run.returnKeeper;
    expect(spot.x).toBeCloseTo(k.x + PORTAL_R9.offset.x);
    expect(spot.z).toBeCloseTo(k.z + PORTAL_R9.offset.z);
    step(world, 500);
    expect(send(world, { kind: 'portalReturn' })).toContainEqual({ kind: 'portalReturned' });
    expect(portalSpot(world)).toBeNull();
  });
});
