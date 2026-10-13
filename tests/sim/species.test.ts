import { describe, expect, it } from 'vitest';
import { SPECIES_LABELS } from '../../src/config/strings';
import { EGG, LIFECYCLE, SIM } from '../../src/config/tuning';
import { createEgg } from '../../src/sim/nubbin';
import { rebirth } from '../../src/sim/lifecycle';
import { Rng } from '../../src/sim/rng';
import { nextSpecies, SPECIES, speciesByFamily, speciesOf } from '../../src/sim/species';
import { createWorld, stepWorld } from '../../src/sim/world';

describe('species data', () => {
  it('every evolution target exists and every species has a label', () => {
    const ids = new Set(SPECIES.map((s) => s.id));
    for (const s of SPECIES) {
      expect(SPECIES_LABELS[s.id], s.id).toBeDefined();
      const rule = s.evolve;
      if (!rule) continue;
      const targets =
        rule.kind === 'fixed'
          ? [rule.to]
          : rule.kind === 'byType'
            ? [...Object.values(rule.map), rule.fallback, ...(rule.poor ? [rule.poor] : [])]
            : [rule.sun, rule.moon, rule.neutral];
      for (const t of targets) expect(ids.has(t), `${s.id} -> ${t}`).toBe(true);
    }
  });

  it('covers the baby and fossil lines of the first three generations and the 1997 line', () => {
    const pocket = speciesByFamily('pocket');
    const refs = new Set(pocket.map((s) => s.ref));
    for (const r of [
      'Pichu',
      'Cleffa',
      'Igglybuff',
      'Togepi',
      'Tyrogue',
      'Smoochum',
      'Elekid',
      'Magby',
      'Azurill',
      'Wynaut',
      'Omanyte',
      'Kabuto',
      'Aerodactyl',
      'Lileep',
      'Anorith',
    ]) {
      expect(refs.has(r), r).toBe(true);
    }
    expect(speciesByFamily('pocket', 'baby')).toHaveLength(15);
    const digi = speciesByFamily('digi');
    expect(digi).toHaveLength(14);
    expect(new Set(digi.map((s) => s.ref))).toContain('MetalGreymon');
  });

  it('every baby reaches a final form within four steps', () => {
    for (const baby of SPECIES.filter((s) => s.stage === 'baby')) {
      let s = baby;
      let steps = 0;
      while (s.evolve && steps < 5) {
        const next = nextSpecies(s, s.type, 'neutral', 50);
        expect(next).not.toBeNull();
        s = speciesOf(next!);
        steps += 1;
      }
      expect(s.evolve === null || s.id === 'chao', baby.id).toBe(true);
      expect(steps).toBeLessThanOrEqual(4);
    }
  });

  it('the digital line runs hatchling → baby → grown → champion → final in the world', () => {
    const w = createWorld(8, 0);
    const rng = Rng.fromSeed(2);
    w.nubbins = [createEgg('d', { x: 0, z: 0 }, rng, 'plain', 'fuzzlet')];
    const n = w.nubbins[0]!;
    n.typeLean.power = 100;
    const events: ReturnType<typeof stepWorld> = [];
    const run = (ms: number) => {
      for (let i = 0; i < ms / SIM.stepMs; i++) {
        n.needs.hunger = 1;
        n.needs.happiness = 60;
        events.push(...stepWorld(w, SIM.stepMs));
      }
    };
    run(EGG.hatchMs + LIFECYCLE.babyGrowthMs + 1000);
    expect(n.species).toBe('chompet');
    run(LIFECYCLE.childMs + LIFECYCLE.cocoonMs);
    expect(n.species).toBe('dinolet');
    n.typeLean.power += 100;
    run(LIFECYCLE.secondEvolutionMs + 1000);
    expect(n.species).toBe('hornsaur');
    run(LIFECYCLE.thirdEvolutionMs - LIFECYCLE.secondEvolutionMs + 1000);
    expect(n.species).toBe('ironsaur');
    expect(events.filter((e) => e.kind === 'speciesGrew')).toHaveLength(2);
  });

  it('branches by type and by poor care', () => {
    const scrapper = speciesOf('scrapper');
    expect(nextSpecies(scrapper, 'run', 'neutral', 50)).toBe('kickmaster');
    expect(nextSpecies(scrapper, 'power', 'neutral', 50)).toBe('jabmaster');
    expect(nextSpecies(scrapper, 'normal', 'neutral', 50)).toBe('spinmaster');
    const dino = speciesOf('dinolet');
    expect(nextSpecies(dino, 'power', 'neutral', 50)).toBe('hornsaur');
    expect(nextSpecies(dino, 'power', 'neutral', -5)).toBe('slugbert');
    expect(speciesOf('nope').id).toBe('chao');
  });
});

describe('species in the world', () => {
  it('a mouse-line egg grows through all three stages and rebirth returns to the baby', () => {
    const w = createWorld(3, 0);
    const rng = Rng.fromSeed(1);
    w.nubbins = [createEgg('m', { x: 0, z: 0 }, rng, 'plain', 'zapling')];
    const n = w.nubbins[0]!;
    n.typeLean.run = 100;
    const run = (ms: number) => {
      for (let i = 0; i < ms / SIM.stepMs; i++) {
        n.needs.hunger = 1;
        stepWorld(w, SIM.stepMs);
      }
    };
    run(EGG.hatchMs + LIFECYCLE.childMs + LIFECYCLE.cocoonMs + 1000);
    expect(n.stage).toBe('adult');
    expect(n.species).toBe('zapkin');
    n.typeLean.run += 100;
    run(LIFECYCLE.secondEvolutionMs + 1000);
    expect(n.species).toBe('zapmaw');
    rebirth(n, []);
    expect(n.species).toBe('zapling');
    expect(n.lineage).toBe('zapling');
  });

  it('the Chao line keeps its species', () => {
    const w = createWorld(4, 0);
    const n = w.nubbins[0]!;
    for (
      let i = 0;
      i < (EGG.hatchMs + LIFECYCLE.childMs + LIFECYCLE.cocoonMs) / SIM.stepMs + 5;
      i++
    ) {
      n.needs.hunger = 1;
      stepWorld(w, SIM.stepMs);
    }
    expect(n.stage).toBe('adult');
    expect(n.species).toBe('chao');
  });
});
