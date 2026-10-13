import { describe, expect, it } from 'vitest';
import { TRAINER_LABELS } from '../../src/config/strings';
import { Rng } from '../../src/sim/rng';
import { speciesOf } from '../../src/sim/species';
import { rollEggSpecies, TRAINERS, trainerOf } from '../../src/sim/trainers';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

describe('trainers', () => {
  it('has ten, five per side, each with a label', () => {
    expect(TRAINERS).toHaveLength(10);
    expect(TRAINERS.filter((t) => t.band === 'sun')).toHaveLength(5);
    expect(TRAINERS.filter((t) => t.band === 'moon')).toHaveLength(5);
    for (const t of TRAINERS) expect(TRAINER_LABELS[t.id], t.id).toBeDefined();
    expect(new Set(TRAINERS.map((t) => t.id)).size).toBe(10);
  });

  it('egg results follow the trainer', () => {
    const count = (id: string, n = 300) => {
      const rng = Rng.fromSeed(7);
      const out: Record<string, number> = {};
      for (let i = 0; i < n; i++) {
        const fam = speciesOf(rollEggSpecies(trainerOf(id), rng)).family;
        out[fam] = (out[fam] ?? 0) + 1;
      }
      return out;
    };
    expect(count('fern').chao ?? 0).toBeGreaterThan(180);
    expect(count('pixel').digi ?? 0).toBeGreaterThan(180);
    expect(count('marina').pocket ?? 0).toBeGreaterThan(180);
    expect(count('dusty').chao ?? 0).toBe(0);
  });

  it('the fossil hunter only hatches fossil lines, and favourites are weighted', () => {
    const rng = Rng.fromSeed(3);
    const fossils = new Set(['spiralshell', 'domeshell', 'skyfang', 'lilystalk', 'clawnymph']);
    let swimmers = 0;
    for (let i = 0; i < 200; i++) {
      const s = rollEggSpecies(trainerOf('dusty'), rng);
      if (speciesOf(s).family === 'pocket') {
        expect(fossils.has(s), s).toBe(true);
        if (speciesOf(s).type === 'swim') swimmers += 1;
      }
    }
    expect(swimmers).toBeGreaterThan(100);
  });

  it('digital-line eggs always start at the first baby', () => {
    const rng = Rng.fromSeed(5);
    for (let i = 0; i < 50; i++) {
      const s = rollEggSpecies(trainerOf('byte'), rng);
      if (speciesOf(s).family === 'digi') expect(s).toBe('fuzzlet');
    }
  });

  it('choosing a trainer sets the Keeper side and shapes new eggs', () => {
    const w = createWorld(11, 0);
    expect(w.trainer).toBe('fern');
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'setTrainer', id: 'byte' }, events);
    expect(w.trainer).toBe('byte');
    expect(w.keeper.alignment).toBe('moon');
    applyCommand(w, { kind: 'switchKeeper', alignment: 'sun' }, events);
    expect(w.keeper.alignment).toBe('sun');
    expect(trainerOf(w.trainer).band).toBe('sun');
    expect(trainerOf('nope').id).toBe('fern');
  });
});
