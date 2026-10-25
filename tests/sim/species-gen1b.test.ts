import { describe, expect, it } from 'vitest';
import { SPECIES_LABELS } from '../../src/config/strings';
import { GEN1B_EGGS } from '../../src/config/tuning-pkb';
import { allKeys } from '../../src/sim/collection';
import { Rng } from '../../src/sim/rng';
import { deserialize, serialize } from '../../src/sim/save';
import {
  canonicalSpecies,
  isCommonSpecies,
  nextSpecies,
  SPECIES,
  speciesOf,
} from '../../src/sim/species';
import { GEN1B_SPECIES } from '../../src/sim/species-gen1b';
import { rollEggSpecies, trainerOf } from '../../src/sim/trainers';
import { createWorld } from '../../src/sim/world';
import { createEgg } from '../../src/sim/nubbin';

/** National Dex #77 to #151, by inspiration: the ones this file must cover or reuse. */
const GEN1_SECOND_HALF = [
  'Ponyta', 'Rapidash', 'Slowpoke', 'Slowbro', 'Magnemite', 'Magneton', "Farfetch'd", 'Doduo',
  'Dodrio', 'Seel', 'Dewgong', 'Grimer', 'Muk', 'Shellder', 'Cloyster', 'Gastly', 'Haunter',
  'Gengar', 'Onix', 'Drowzee', 'Hypno', 'Krabby', 'Kingler', 'Voltorb', 'Electrode',
  'Exeggcute', 'Exeggutor', 'Cubone', 'Marowak', 'Hitmonlee', 'Hitmonchan', 'Lickitung',
  'Koffing', 'Weezing', 'Rhyhorn', 'Rhydon', 'Chansey', 'Tangela', 'Kangaskhan', 'Horsea',
  'Seadra', 'Goldeen', 'Seaking', 'Staryu', 'Starmie', 'Mr. Mime', 'Scyther', 'Jynx',
  'Electabuzz', 'Magmar', 'Pinsir', 'Tauros', 'Magikarp', 'Gyarados', 'Lapras', 'Ditto', 'Eevee',
  'Vaporeon', 'Jolteon', 'Flareon', 'Porygon', 'Omanyte', 'Omastar', 'Kabuto', 'Kabutops',
  'Aerodactyl', 'Snorlax', 'Articuno', 'Zapdos', 'Moltres', 'Dratini', 'Dragonair', 'Dragonite',
  'Mewtwo', 'Mew',
]; // prettier-ignore

describe('first-generation pocket line, #77 to #151', () => {
  it('covers every one of them exactly once, in the pocket family', () => {
    expect(GEN1_SECOND_HALF).toHaveLength(75);
    const pocket = SPECIES.filter((s) => s.family === 'pocket');
    for (const ref of GEN1_SECOND_HALF) {
      expect(pocket.filter((s) => s.ref === ref).length, ref).toBe(1);
    }
    expect(GEN1B_SPECIES).toHaveLength(65);
  });

  it('ids are unique, labelled with an original name, and every target exists', () => {
    const ids = SPECIES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of GEN1B_SPECIES) {
      expect(s.id).toMatch(/^[a-z][a-z-]*$/);
      const label = SPECIES_LABELS[s.id];
      expect(label, s.id).toBeDefined();
      expect(label!.toLowerCase()).not.toBe(s.ref.toLowerCase());
      expect(speciesOf(s.id).id).toBe(s.id);
    }
  });

  it('two-stage lines grow at evolution, three-stage lines at the second evolution', () => {
    for (const s of GEN1B_SPECIES) {
      if (s.stage === 'grown') expect(s.evolve, s.id).not.toBeNull();
      if (s.stage === 'final') expect(s.evolve, s.id).toBeNull();
      if (s.evolve?.kind === 'fixed') {
        const next = speciesOf(s.evolve.to);
        expect(next.id).toBe(s.evolve.to);
        expect(['grown', 'final']).toContain(next.stage);
      }
    }
    expect(nextSpecies(speciesOf('spooklet'), 'fly', 'neutral', 50)).toBe('spookhand');
    expect(nextSpecies(speciesOf('spookhand'), 'fly', 'neutral', 50)).toBe('spookgrin');
    expect(nextSpecies(speciesOf('wyrmlet'), 'swim', 'neutral', 50)).toBe('ribbonwyrm');
    expect(nextSpecies(speciesOf('ribbonwyrm'), 'fly', 'neutral', 50)).toBe('hugwyrm');
    expect(nextSpecies(speciesOf('snoozelump'), 'power', 'neutral', 50)).toBeNull();
  });

  it('the fluff kit takes its form from the winning type', () => {
    const kit = speciesOf('fluffkit');
    expect(nextSpecies(kit, 'swim', 'neutral', 50)).toBe('tidefox');
    expect(nextSpecies(kit, 'run', 'neutral', 50)).toBe('sparkfox');
    expect(nextSpecies(kit, 'fly', 'neutral', 50)).toBe('sparkfox');
    expect(nextSpecies(kit, 'power', 'neutral', 50)).toBe('flarefox');
    expect(nextSpecies(kit, 'normal', 'sun', -20)).toBe('flarefox');
  });

  it('Aerodactyl is single stage, and the old grown id reads as it', () => {
    expect(speciesOf('skyfang').evolve).toBeNull();
    expect(SPECIES.some((s) => s.id === 'skyfang-grown')).toBe(false);
    expect(canonicalSpecies('skyfang-grown')).toBe('skyfang');
    expect(speciesOf('skyfang-grown').id).toBe('skyfang');
  });

  it('an old save holding the grown Aerodactyl loads as the single-stage one', () => {
    const w = createWorld(5, 0);
    const n = createEgg('a', { x: 0, z: 0 }, Rng.fromSeed(3), 'plain', 'skyfang');
    n.species = 'skyfang-grown';
    n.lineage = 'skyfang';
    w.nubbins = [n];
    w.seen = { 'skyfang-grown': 1234 };
    const back = deserialize(serialize(w, 0)).world;
    expect(back.nubbins[0]!.species).toBe('skyfang');
    expect(back.nubbins[0]!.lineage).toBe('skyfang');
    expect(back.seen).toEqual({ skyfang: 1234 });
  });

  it('legendaries and the rare four hatch only seldom and never turn up wild', () => {
    const rare = GEN1B_SPECIES.filter((s) => !isCommonSpecies(s)).map((s) => s.ref);
    expect(rare.sort()).toEqual(
      [
        'Articuno',
        'Ditto',
        'Dratini',
        'Lapras',
        'Mew',
        'Mewtwo',
        'Moltres',
        'Snorlax',
        'Zapdos',
      ].sort(),
    );
    expect(GEN1B_EGGS.legendary).toBeLessThan(GEN1B_EGGS.rare);
    expect(GEN1B_EGGS.rare).toBeLessThan(1);
    // Sparks: six parts pocket in eight. Legendaries must stay well under one egg in a hundred.
    const rng = Rng.fromSeed(77);
    const sparks = trainerOf('sparks');
    let legend = 0;
    let pocket = 0;
    const N = 20000;
    for (let i = 0; i < N; i++) {
      const id = rollEggSpecies(sparks, rng);
      const s = speciesOf(id);
      if (s.family === 'pocket') pocket++;
      if ((s.eggWeight ?? 1) <= GEN1B_EGGS.legendary) legend++;
    }
    expect(pocket).toBeGreaterThan(N * 0.6);
    expect(legend / N).toBeLessThan(0.01);
  });

  it('the collection book lists every species id', () => {
    const keys = allKeys();
    for (const s of GEN1B_SPECIES) expect(keys, s.id).toContain(s.id);
    expect(keys).toContain('zapling');
    expect(keys.some((k) => /^\d+$/.test(k))).toBe(false);
    expect(keys.length).toBe(19 + SPECIES.length - 1);
  });
});
