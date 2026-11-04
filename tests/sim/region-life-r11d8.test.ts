import { describe, expect, it } from 'vitest';
import { walkableAt, regionLayout } from '../../src/config/region-layout';
import { WOOD_POIS, WOOD_SPEC } from '../../src/config/region-wood';
import {
  CRITTER_RULES,
  REGION_CRITTERS,
  REGION_GATES,
  GATE_LEVEL,
} from '../../src/config/region-wild';
import { SIM } from '../../src/config/tuning';
import { WHERE_MAP } from '../../src/content/where-map';
import { setPartner } from '../../src/sim/partners';
import { hatch } from '../../src/sim/lifecycle';
import { liveCritters, spotSpecies } from '../../src/sim/region-critters';
import { closedGates, gateIsOpen } from '../../src/sim/region-gates';
import { companions } from '../../src/sim/region-companion';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

function run(world: World, steps: number, events: SimEvent[] = []): SimEvent[] {
  for (let i = 0; i < steps; i++) events.push(...stepWorld(world, SIM.stepMs));
  return events;
}

function withPartner(personality: 'cheerful' | 'shy' | 'mischievous' | 'lazy'): World {
  const w = createWorld(41, 0);
  const n = w.nubbins[0]!;
  hatch(n, [], w.timeMs);
  n.personality = personality;
  setPartner(w, 0, n.id);
  return w;
}

function intoWood(w: World): SimEvent[] {
  const ev: SimEvent[] = [];
  applyCommand(w, { kind: 'travel', exit: 'grove-wood' }, ev);
  return ev;
}

describe('critters with homes (R0120)', () => {
  it('each spot holds only its region table species, never more than six live', () => {
    const t = REGION_CRITTERS.wood!;
    for (let seed = 1; seed < 40; seed++)
      for (const s of t.spots)
        for (let takes = 0; takes < 6; takes++)
          expect(t.species).toContain(spotSpecies(seed, 'wood', s, takes));
    const w = createWorld(3, 0);
    intoWood(w);
    expect(w.location).toBe('region:wood');
    expect(liveCritters(w).length).toBeLessThanOrEqual(CRITTER_RULES.maxLive);
    expect(liveCritters(w).length).toBeGreaterThan(0);
  });

  it('taking one fills the pack, empties the spot, and it returns after 20 minutes of play', () => {
    const w = createWorld(3, 0);
    intoWood(w);
    const spot = liveCritters(w)[0]!;
    w.keeper.pos = { x: spot.x, z: spot.z };
    const ev = run(w, 2);
    expect(ev.some((e) => e.kind === 'regionCritter')).toBe(true);
    expect(w.inventory.critters[spot.species]).toBeGreaterThanOrEqual(1);
    expect(liveCritters(w).some((c) => c.id === spot.id)).toBe(false);
    w.timeMs += CRITTER_RULES.respawnMs + 1000;
    expect(liveCritters(w).some((c) => c.id === spot.id)).toBe(true);
  });

  it('every spot stands on walkable ground', () => {
    const l = regionLayout(WOOD_SPEC);
    for (const s of REGION_CRITTERS.wood!.spots) expect(walkableAt(l, s.x, s.z), s.id).toBe(true);
  });
});

describe('partners on trips (R0121)', () => {
  it('follows into the Wood, reacts by personality, and leans once per region', () => {
    const lines = new Set<string>();
    for (const p of ['cheerful', 'shy', 'mischievous', 'lazy'] as const) {
      const w = withPartner(p);
      const lean0 = w.nubbins[0]!.typeLean.power;
      const ev = intoWood(w);
      const react = ev.find((e) => e.kind === 'companionReacts');
      expect(react && react.kind === 'companionReacts' && react.first).toBe(true);
      expect(w.nubbins[0]!.typeLean.power).toBeCloseTo(lean0 + 0.5, 5);
      lines.add(`${p}:${w.nubbins[0]!.behavior.state}`);
      // Walk the Keeper: the partner keeps up.
      w.keeper.moveTarget = { x: w.keeper.pos.x + 6, z: w.keeper.pos.z };
      run(w, 120);
      const n = companions(w)[0]!;
      expect(Math.hypot(n.pos.x - w.keeper.pos.x, n.pos.z - w.keeper.pos.z)).toBeLessThan(4);
    }
    // Four personalities, a reaction each (shy and lazy sit, cheerful and mischievous play).
    expect(lines.size).toBe(4);
  });

  it('adds the lean on the first visit only', () => {
    const w = withPartner('cheerful');
    intoWood(w);
    const after = w.nubbins[0]!.typeLean.power;
    applyCommand(w, { kind: 'travel', exit: 'wood-grove' }, []);
    intoWood(w);
    expect(w.nubbins[0]!.typeLean.power).toBeCloseTo(after, 5);
  });
});

describe('stat gates (R0110)', () => {
  it('the Wood boulder holds until a partner with Power 25 stands by it', () => {
    const w = withPartner('cheerful');
    intoWood(w);
    const g = REGION_GATES.wood![0]!;
    expect(closedGates(w).map((x) => x.id)).toContain(g.id);
    // The Keeper cannot walk into the boulder.
    w.keeper.pos = { x: g.x + 0.2, z: g.z };
    run(w, 2);
    expect(Math.hypot(w.keeper.pos.x - g.x, w.keeper.pos.z - g.z)).toBeGreaterThanOrEqual(g.r);
    // A weak partner does nothing.
    w.nubbins[0]!.pos = { x: g.x + 2, z: g.z };
    w.keeper.pos = { x: g.x + 2.4, z: g.z };
    run(w, 60);
    expect(gateIsOpen(w, 'wood', g.id)).toBe(false);
    // A strong one opens it, once, and the reward lands once.
    w.nubbins[0]!.stats.power.points = GATE_LEVEL * 100;
    const shells = w.inventory.shells;
    const ev = run(w, 60);
    expect(gateIsOpen(w, 'wood', g.id)).toBe(true);
    expect(ev.filter((e) => e.kind === 'gateOpened')).toHaveLength(1);
    expect(w.inventory.shells).toBe(shells + g.reward.shells!);
    run(w, 60);
    expect(w.inventory.shells).toBe(shells + g.reward.shells!);
  });

  it('never gates a story or quest place: no quest area or required POI sits behind one', () => {
    const l = regionLayout(WOOD_SPEC);
    for (const g of REGION_GATES.wood!) {
      expect(walkableAt(l, g.x, g.z), 'boulder on the spur').toBe(true);
      expect(walkableAt(l, g.behind.x, g.behind.z), 'glade open').toBe(true);
      for (const p of WOOD_POIS) {
        if (p.id === 'hidden-glade') continue;
        expect(Math.hypot(p.x - g.behind.x, p.z - g.behind.z), p.id).toBeGreaterThan(g.behind.r);
      }
      for (const a of Object.values(WHERE_MAP)
        .filter((q) => q.region === 'wood' && q.poi)
        .map((q) => q.poi!)) {
        const p = WOOD_POIS.find((q) => q.id === a);
        if (p)
          expect(Math.hypot(p.x - g.behind.x, p.z - g.behind.z), a).toBeGreaterThan(g.behind.r);
      }
    }
  });
});
