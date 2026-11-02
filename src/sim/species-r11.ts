import type { EvolutionRule, Species, SpeciesStage } from './species';
import type { NubbinType } from './types';

/**
 * Round 11: eight second-stage evolutions that sit on top of existing pocket lines. Each
 * is the `final` of its line; the species that used to end the line (or, for the singles,
 * stood alone) now points here. In-game names are our own (`config/strings-r11.ts`); `ref`
 * is the inspiration, for the artist only.
 */
const P = (
  id: string,
  ref: string,
  stage: SpeciesStage,
  type: NubbinType,
  evolve: EvolutionRule | null = null,
): Species => ({ id, family: 'pocket', ref, stage, type, evolve });

export const R11_SPECIES: readonly Species[] = [
  P('shellhalo', 'Togekiss', 'final', 'fly'),
  P('stormbrute', 'Electivire', 'final', 'power'),
  P('blazecannon', 'Magmortar', 'final', 'power'),
  P('snoutking', 'Kingdra', 'final', 'swim'),
  P('ironwyrm', 'Steelix', 'final', 'power'),
  P('shearwing', 'Scizor', 'final', 'run'),
  P('eggheart', 'Blissey', 'final', 'normal'),
  P('prismbird', 'Porygon2', 'final', 'normal'),
];
