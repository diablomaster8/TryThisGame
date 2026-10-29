import { describe, expect, it } from 'vitest';
import { SPECIES_LABELS } from '../../src/config/strings';
import { DIGI_EGGS } from '../../src/config/tuning-digi';
import { EGG, LIFECYCLE, SIM } from '../../src/config/tuning';
import { allKeys } from '../../src/sim/collection';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { nextSpecies, SPECIES, speciesByFamily, speciesOf } from '../../src/sim/species';
import { rollEggSpecies, trainerOf, TRAINERS } from '../../src/sim/trainers';
import type { NubbinType } from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

/**
 * The digital line holds every species of the 1997 virtual pets, Versions 1 to 5, and
 * each version follows the pet's chart: two babies, two rookies, seven champions (rookie A
 * reaches slots 1-4 and 7, rookie B slots 3-7, poor care always slot 7) and three
 * ultimates (slots 1, 3, 5 → the first; 2, 4, 6 → the second; 7 → the third).
 */
interface Chart {
  babies: [string, string];
  rookies: [string, string];
  champions: string[]; // slots 1..7
  ultimates: [string, string, string];
}

const id = (ref: string) => SPECIES.find((s) => s.ref === ref)?.id ?? `missing:${ref}`;
const chart = (refs: string[]): Chart => {
  const ids = refs.map(id);
  return {
    babies: [ids[0]!, ids[1]!],
    rookies: [ids[2]!, ids[3]!],
    champions: ids.slice(4, 11),
    ultimates: [ids[11]!, ids[12]!, ids[13]!],
  };
};

const CHARTS: Record<string, string[]> = {
  'Ver.1': [
    ...['Botamon', 'Koromon', 'Agumon', 'Betamon'],
    ...['Greymon', 'Tyrannomon', 'Devimon', 'Meramon', 'Airdramon', 'Seadramon', 'Numemon'],
    ...['MetalGreymon', 'Mamemon', 'Monzaemon'],
  ],
  'Ver.2': [
    ...['Punimon', 'Tsunomon', 'Gabumon', 'Elecmon'],
    ...['Kabuterimon', 'Garurumon', 'Angemon', 'Yukidarumon', 'Birdramon', 'Whamon', 'Vegiemon'],
    ...['SkullGreymon', 'MetalMamemon', 'Vademon'],
  ],
  'Ver.3': [
    ...['Poyomon', 'Tokomon', 'Patamon', 'Kunemon'],
    ...['Unimon', 'Centarumon', 'Ogremon', 'Bakemon', 'Shellmon', 'Drimogemon', 'Scumon'],
    ...['Andromon', 'Giromon', 'Etemon'],
  ],
  'Ver.4': [
    ...['Yuramon', 'Tanemon', 'Biyomon', 'Palmon'],
    ...['Monochromon', 'Leomon', 'Coelamon', 'Kokatorimon', 'Kuwagamon', 'Mojyamon', 'Nanimon'],
    ...['Megadramon', 'Piximon', 'Digitamamon'],
  ],
  'Ver.5': [
    ...['Zurumon', 'Pagumon', 'Gazimon', 'Gizamon'],
    ...['DarkTyrannomon', 'Cyclonemon', 'Devidramon', 'Tuskmon', 'Flymon', 'Deltamon', 'Raremon'],
    ...['MetalTyrannomon', 'Nanomon', 'Extyrannomon'],
  ],
};

const TYPES: NubbinType[] = ['normal', 'swim', 'fly', 'run', 'power'];
const reach = (from: string, happiness = 50) =>
  new Set(TYPES.map((t) => nextSpecies(speciesOf(from), t, 'neutral', happiness)));

describe('digital line, Versions 1 to 5', () => {
  it('has every species once, all labelled, with unique ids', () => {
    const digi = speciesByFamily('digi');
    expect(digi).toHaveLength(70);
    const refs = Object.values(CHARTS).flat();
    expect(new Set(refs).size).toBe(70);
    for (const r of refs)
      expect(
        digi.some((s) => s.ref === r),
        r,
      ).toBe(true);
    const ids = SPECIES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of digi) expect(SPECIES_LABELS[s.id], s.id).toBeDefined();
  });

  for (const [version, refs] of Object.entries(CHARTS)) {
    it(`${version} follows the pet's chart`, () => {
      const c = chart(refs);
      const [b1, b2] = c.babies;
      const [ra, rb] = c.rookies;
      const slot = (n: number) => c.champions[n - 1]!;
      expect(speciesOf(b1).stage).toBe('baby');
      expect(reach(b1)).toEqual(new Set([b2]));
      expect(reach(b2)).toEqual(new Set([ra, rb]));
      expect(nextSpecies(speciesOf(b2), 'normal', 'neutral', 50)).toBe(ra);
      expect(reach(ra)).toEqual(new Set([1, 2, 3, 4].map(slot)));
      expect(reach(rb)).toEqual(new Set([3, 4, 5, 6].map(slot)));
      expect(reach(ra, -10)).toEqual(new Set([slot(7)]));
      expect(reach(rb, -10)).toEqual(new Set([slot(7)]));
      // A balanced Nubbin gets rookie A's first champion.
      expect(nextSpecies(speciesOf(ra), 'normal', 'neutral', 50)).toBe(slot(1));
      const [u1, u2, u3] = c.ultimates;
      for (const n of [1, 3, 5]) expect(reach(slot(n)), slot(n)).toEqual(new Set([u1]));
      for (const n of [2, 4, 6]) expect(reach(slot(n)), slot(n)).toEqual(new Set([u2]));
      expect(reach(slot(7))).toEqual(new Set([u3]));
      for (const u of c.ultimates) {
        expect(speciesOf(u).stage).toBe('final');
        expect(speciesOf(u).evolve).toBeNull();
      }
    });
  }

  it('digital eggs hold each version first hatchling, Ver.1 the most often', () => {
    const rng = Rng.fromSeed(9);
    const counts: Record<string, number> = {};
    const byte = trainerOf('byte');
    const digiOnly = { ...byte, eggs: { chao: 0, pocket: 0, digi: 1 } };
    for (let i = 0; i < 4000; i++) {
      const s = rollEggSpecies(digiOnly, rng);
      counts[s] = (counts[s] ?? 0) + 1;
    }
    expect(Object.keys(counts).sort()).toEqual(Object.keys(DIGI_EGGS).sort());
    const ver1 = counts['fuzzlet']! / 4000;
    expect(ver1).toBeGreaterThan(0.33);
    expect(ver1).toBeLessThan(0.47);
    for (const k of ['jellop', 'driftlet', 'fluffseed', 'oozlet'])
      expect(counts[k]!).toBeGreaterThan(400);
    // The digital-line Keepers are the ones that lean on these eggs.
    for (const t of TRAINERS.filter((t) => t.id === 'pixel' || t.id === 'byte'))
      expect(t.eggs.digi).toBeGreaterThan(t.eggs.chao + t.eggs.pocket);
  });

  it('a Ver.4 egg runs the whole line in the world', () => {
    const w = createWorld(8, 0);
    const rng = Rng.fromSeed(2);
    w.nubbins = [createEgg('d', { x: 0, z: 0 }, rng, 'plain', 'fluffseed')];
    const n = w.nubbins[0]!;
    n.typeLean.fly = 100;
    const run = (ms: number) => {
      for (let i = 0; i < ms / SIM.stepMs; i++) {
        n.needs.hunger = 1;
        n.needs.happiness = 60;
        stepWorld(w, SIM.stepMs);
      }
    };
    run(EGG.hatchMs + LIFECYCLE.babyGrowthMs + 1000);
    expect(n.species).toBe('budling');
    run(LIFECYCLE.childMs + LIFECYCLE.cocoonMs);
    expect(n.species).toBe('pinkbeak');
    n.typeLean.run += 300;
    run(LIFECYCLE.secondEvolutionMs + 1000);
    expect(n.species).toBe('manefist');
    run(LIFECYCLE.thirdEvolutionMs - LIFECYCLE.secondEvolutionMs + 1000);
    expect(n.species).toBe('pipsprite');
  });

  it('the collection book lists every species by id', () => {
    const keys = allKeys();
    for (const s of SPECIES) if (s.id !== 'chao') expect(keys, s.id).toContain(s.id);
    expect(keys.some((k) => /^\d+$/.test(k))).toBe(false);
    // LOOK-55 added second evolutions, colours, looks, parts and hats after these.
    const forms = keys.filter((k) => !k.includes(':') || /^chao:[a-z]+(:[a-z]+)?$/.test(k));
    expect(forms).toHaveLength(1 + 15 + 3 + SPECIES.length - 1);
  });
});
