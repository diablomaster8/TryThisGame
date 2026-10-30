import { describe, expect, it } from 'vitest';
import { foeLooks, hollowFoeLook, sparringPartner } from '../../src/sim/battle/foes';
import { circuitTeam } from '../../src/sim/battle/circuit';
import { recordKarate } from '../../src/sim/battle/rewards';
import { hatch } from '../../src/sim/lifecycle';
import { SPECIES } from '../../src/sim/species';
import type { World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/** Round 5 (recs FIGHT-90): rivals are real species, drawn from each context's own pool. */
function one(seed = 5): World {
  const w = createWorld(seed, 0);
  hatch(w.nubbins[0]!, [], 0);
  w.karate.belt = 3;
  return w;
}
const familyOf = (id: string) => SPECIES.find((s) => s.id === id)?.family;

describe('rival foes as species (recs FIGHT-90)', () => {
  it('the three dojo tiers show three different species, the same each time', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const w = one(seed);
      const ids = [w.nubbins[0]!.id];
      const looks = [1, 2, 3].map((tier) => foeLooks(w, { kind: 'dojo', tier, ids })[0]!);
      expect(new Set(looks.map((l) => l.species)).size).toBe(3);
      expect(foeLooks(w, { kind: 'dojo', tier: 2, ids })).toEqual([looks[1]]);
      // The timed dojo shares the turn dojo's rivals.
      expect(foeLooks(w, { kind: 'karate', tier: 3, nubbinId: ids[0]! })).toEqual([looks[2]]);
    }
  });

  it('a look has parts, an egg colour and a band; higher tiers wear more parts', () => {
    const w = one();
    const ids = [w.nubbins[0]!.id];
    const t1 = foeLooks(w, { kind: 'party', tier: 1, ids }, 2);
    const t3 = foeLooks(w, { kind: 'party', tier: 3, ids }, 2);
    expect(t1).toHaveLength(2);
    for (const l of [...t1, ...t3]) {
      expect(l.eggColor).toBeTruthy();
      expect(['sun', 'moon', 'neutral']).toContain(l.band);
    }
    expect(t1.every((l) => Object.values(l.parts).every((p) => p === null))).toBe(true);
    expect(t3.some((l) => Object.values(l.parts).some((p) => p !== null))).toBe(true);
  });

  it('Logged In draws the digital line; the Circuit its trainer team', () => {
    const w = one();
    const ids = [w.nubbins[0]!.id];
    const logged = foeLooks(w, { kind: 'story', storyline: 'logged', tier: 2, ids }, 3);
    expect(logged.every((l) => familyOf(l.species) === 'digi')).toBe(true);
    const ctx = { kind: 'circuit' as const, trainer: 'fern', tier: 1, ids };
    expect(foeLooks(w, ctx).map((l) => l.species)).toEqual(circuitTeam(w, 'fern'));
  });

  it("the Hollow's rival lives on that floor", () => {
    const w = one();
    const floor = { wildSpots: [{ species: 'droplet' }, { species: 'skyfang' }] };
    for (let i = 0; i < 6; i++)
      expect(['droplet', 'skyfang']).toContain(hollowFoeLook(w, floor, 4, i).species);
    expect(hollowFoeLook(w, { wildSpots: [] }, 1).species).toBeTruthy();
  });

  it('a beaten rival recruit has that species', () => {
    const w = one();
    const id = w.nubbins[0]!.id;
    const look = foeLooks(w, { kind: 'dojo', tier: 2, ids: [id] })[0]!;
    recordKarate(w, id, true, 2, { name: 'Tusk', species: look.species }, []);
    expect(w.town.recruits.at(-1)).toMatchObject({ name: 'Tusk', species: look.species });
    expect(look.species).not.toBe('chao');
  });

  it("today's sparring partner changes with the day and is fixed within it", () => {
    const w = one();
    const days = Array.from({ length: 12 }, (_, i) => '2026-11-' + String(i + 1).padStart(2, '0'));
    const looks = days.map((d) => sparringPartner(w, d).species);
    expect(new Set(looks).size).toBeGreaterThan(1);
    expect(sparringPartner(w, days[0]!)).toEqual(sparringPartner(w, days[0]!));
  });
});
