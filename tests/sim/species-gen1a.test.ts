import { describe, expect, it } from 'vitest';
import { SPECIES_LABELS } from '../../src/config/strings';
import { EGG, LIFECYCLE, SIM } from '../../src/config/tuning';
import { allKeys } from '../../src/sim/collection';
import { createEgg } from '../../src/sim/nubbin';
import { Rng } from '../../src/sim/rng';
import { nextSpecies, SPECIES, speciesByFamily, speciesOf } from '../../src/sim/species';
import { GEN1A_SPECIES } from '../../src/sim/species-gen1a';
import { rollEggSpecies, TRAINERS } from '../../src/sim/trainers';
import { createWorld, stepWorld } from '../../src/sim/world';

/** National Dex #1–#76, every first-generation form the pocket line A covers. */
const DEX_1_TO_76 = [
  'Bulbasaur',
  'Ivysaur',
  'Venusaur',
  'Charmander',
  'Charmeleon',
  'Charizard',
  'Squirtle',
  'Wartortle',
  'Blastoise',
  'Caterpie',
  'Metapod',
  'Butterfree',
  'Weedle',
  'Kakuna',
  'Beedrill',
  'Pidgey',
  'Pidgeotto',
  'Pidgeot',
  'Rattata',
  'Raticate',
  'Spearow',
  'Fearow',
  'Ekans',
  'Arbok',
  'Pikachu',
  'Raichu',
  'Sandshrew',
  'Sandslash',
  'Nidoran♀',
  'Nidorina',
  'Nidoqueen',
  'Nidoran♂',
  'Nidorino',
  'Nidoking',
  'Clefairy',
  'Clefable',
  'Vulpix',
  'Ninetales',
  'Jigglypuff',
  'Wigglytuff',
  'Zubat',
  'Golbat',
  'Oddish',
  'Gloom',
  'Vileplume',
  'Paras',
  'Parasect',
  'Venonat',
  'Venomoth',
  'Diglett',
  'Dugtrio',
  'Meowth',
  'Persian',
  'Psyduck',
  'Golduck',
  'Mankey',
  'Primeape',
  'Growlithe',
  'Arcanine',
  'Poliwag',
  'Poliwhirl',
  'Poliwrath',
  'Abra',
  'Kadabra',
  'Alakazam',
  'Machop',
  'Machoke',
  'Machamp',
  'Bellsprout',
  'Weepinbell',
  'Victreebel',
  'Tentacool',
  'Tentacruel',
  'Geodude',
  'Graveler',
  'Golem',
];

describe('pocket line A (Dex #1–#76)', () => {
  it('covers every form from #1 to #76 once, with the branch-off forms of its families', () => {
    expect(DEX_1_TO_76).toHaveLength(76);
    const refs = speciesByFamily('pocket').map((s) => s.ref);
    for (const r of DEX_1_TO_76)
      expect(
        refs.filter((x) => x === r),
        r,
      ).toHaveLength(1);
    for (const r of ['Crobat', 'Bellossom', 'Politoed']) expect(refs).toContain(r);
    expect(GEN1A_SPECIES).toHaveLength(73);
  });

  it('ids are unique, labelled and in the shared list; every target exists', () => {
    const ids = SPECIES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of GEN1A_SPECIES) {
      expect(speciesOf(s.id)).toBe(s);
      expect(s.family).toBe('pocket');
      expect(SPECIES_LABELS[s.id], s.id).toBeDefined();
      // In-game names are our own, never the inspiration's.
      expect(SPECIES_LABELS[s.id]!.toLowerCase()).not.toBe(s.ref.toLowerCase());
    }
  });

  it('stages are ordered: babies hatch, grown forms evolve once more, finals stop', () => {
    const targets = new Set<string>();
    for (const s of GEN1A_SPECIES) {
      for (const t of ['normal', 'swim', 'fly', 'run', 'power'] as const)
        for (const band of ['sun', 'moon', 'neutral'] as const) {
          const next = nextSpecies(s, t, band, 50);
          if (next) {
            targets.add(next);
            const n = speciesOf(next);
            expect(n.id, `${s.id} -> ${next}`).toBe(next);
            expect(n.stage, `${s.id} -> ${next}`).not.toBe('baby');
            if (s.stage === 'grown') expect(n.stage).toBe('final');
          }
        }
      if (s.stage === 'final') expect(s.evolve).toBeNull();
      else expect(s.evolve).not.toBeNull();
    }
    // Everything that is not a baby is reachable from one.
    for (const s of GEN1A_SPECIES)
      if (s.stage !== 'baby') expect(targets.has(s.id), s.id).toBe(true);
  });

  it('the weed line blooms by band and the swirl line by type', () => {
    const gloom = speciesOf('droopbud');
    expect(nextSpecies(gloom, 'normal', 'sun', 50)).toBe('sunbloom');
    expect(nextSpecies(gloom, 'normal', 'moon', 50)).toBe('hatbloom');
    expect(nextSpecies(gloom, 'normal', 'neutral', 50)).toBe('hatbloom');
    const whirl = speciesOf('swirlwhirl');
    expect(nextSpecies(whirl, 'power', 'neutral', 50)).toBe('swirlfist');
    expect(nextSpecies(whirl, 'swim', 'neutral', 50)).toBe('swirlcroak');
  });

  it('every new baby hatches from pocket-line eggs', () => {
    const babies = new Set(GEN1A_SPECIES.filter((s) => s.stage === 'baby').map((s) => s.id));
    expect(babies.size).toBe(28);
    const seen = new Set<string>();
    const rng = Rng.fromSeed(7);
    const keepers = TRAINERS.filter((t) => t.id !== 'dusty' && (t.eggs.pocket ?? 0) > 0);
    for (let i = 0; i < 20000 && seen.size < babies.size; i++) {
      const s = rollEggSpecies(keepers[i % keepers.length]!, rng);
      if (babies.has(s)) seen.add(s);
    }
    expect([...babies].filter((b) => !seen.has(b))).toEqual([]);
  });

  it('the collection book lists every new species by id', () => {
    const keys = allKeys();
    for (const s of GEN1A_SPECIES) expect(keys).toContain(s.id);
    expect(keys.some((k) => /^\d+$/.test(k))).toBe(false);
  });

  it('a seed-line egg grows through all three stages in the world', () => {
    const w = createWorld(5, 0);
    const rng = Rng.fromSeed(4);
    w.nubbins = [createEgg('b', { x: 0, z: 0 }, rng, 'plain', 'bulblet')];
    const n = w.nubbins[0]!;
    const run = (ms: number) => {
      for (let i = 0; i < ms / SIM.stepMs; i++) {
        n.needs.hunger = 1;
        stepWorld(w, SIM.stepMs);
      }
    };
    run(EGG.hatchMs + LIFECYCLE.childMs + LIFECYCLE.cocoonMs + 1000);
    expect(n.species).toBe('budback');
    run(LIFECYCLE.secondEvolutionMs + 1000);
    expect(n.species).toBe('bloomback');
  });
});
