import type { EvolutionRule, Species, SpeciesStage } from './species';
import type { NubbinType } from './types';

/**
 * The digital line, Versions 2 to 5 of the original 1997 virtual pets (Ver.1 lives in
 * species.ts). Each version has the same shape as Ver.1, and the Grove maps the pet's
 * care-mistake branching onto its own rules the same way Ver.1 does:
 *
 * - hatchling → baby: fixed, a few minutes after hatching;
 * - baby → rookie: the winning type picks one of two rookies (rookie B on two types);
 * - rookie → champion: the second evolution's type picks one of five champions; poor care
 *   (negative lifetime happiness, the pet's "many care mistakes") always gives the
 *   version's slot-7 champion; a balanced Nubbin gets the rookie's first champion;
 * - champion → ultimate: fixed. Champions in slots 1, 3 and 5 reach the first ultimate,
 *   slots 2, 4 and 6 the second, and slot 7 the third, as in the Ver.1 chart.
 *
 * Rookie A reaches champion slots 1, 2, 3, 4 and 7; rookie B slots 3, 4, 5, 6 and 7.
 * `ref` records the inspiration for the artist and is never shown.
 */
const D = (
  id: string,
  ref: string,
  stage: SpeciesStage,
  type: NubbinType,
  evolve: EvolutionRule | null = null,
): Species => ({ id, family: 'digi', ref, stage, type, evolve });

export const DIGI2_SPECIES: readonly Species[] = [
  // ---- Ver.2 ----
  D('jellop', 'Punimon', 'baby', 'normal', { kind: 'fixed', to: 'hornpuff' }),
  D('hornpuff', 'Tsunomon', 'baby', 'normal', {
    kind: 'byType',
    map: { run: 'voltkit', fly: 'voltkit' },
    fallback: 'peltpup',
  }),
  D('peltpup', 'Gabumon', 'grown', 'power', {
    kind: 'byType',
    map: { power: 'thunderbug', run: 'frostwolf', fly: 'haloknight', swim: 'snowlump' },
    fallback: 'thunderbug',
    poor: 'sproutgrump',
  }),
  D('voltkit', 'Elecmon', 'grown', 'run', {
    kind: 'byType',
    map: { fly: 'cinderhawk', swim: 'tidehulk', run: 'haloknight', power: 'snowlump' },
    fallback: 'tidehulk',
    poor: 'sproutgrump',
  }),
  D('thunderbug', 'Kabuterimon', 'champion', 'power', { kind: 'fixed', to: 'bonesaur' }),
  D('frostwolf', 'Garurumon', 'champion', 'run', { kind: 'fixed', to: 'boltbean' }),
  D('haloknight', 'Angemon', 'champion', 'fly', { kind: 'fixed', to: 'bonesaur' }),
  D('snowlump', 'Yukidarumon', 'champion', 'swim', { kind: 'fixed', to: 'boltbean' }),
  D('cinderhawk', 'Birdramon', 'champion', 'fly', { kind: 'fixed', to: 'bonesaur' }),
  D('tidehulk', 'Whamon', 'champion', 'swim', { kind: 'fixed', to: 'boltbean' }),
  D('sproutgrump', 'Vegiemon', 'champion', 'normal', { kind: 'fixed', to: 'starbrain' }),
  D('bonesaur', 'SkullGreymon', 'final', 'power'),
  D('boltbean', 'MetalMamemon', 'final', 'normal'),
  D('starbrain', 'Vademon', 'final', 'normal'),

  // ---- Ver.3 ----
  D('driftlet', 'Poyomon', 'baby', 'normal', { kind: 'fixed', to: 'nibbit' }),
  D('nibbit', 'Tokomon', 'baby', 'normal', {
    kind: 'byType',
    map: { run: 'zapgrub', swim: 'zapgrub' },
    fallback: 'flapkit',
  }),
  D('flapkit', 'Patamon', 'grown', 'fly', {
    kind: 'byType',
    map: { fly: 'skysteed', run: 'hoofguard', power: 'grumbrute', swim: 'sheetling' },
    fallback: 'skysteed',
    poor: 'muckblob',
  }),
  D('zapgrub', 'Kunemon', 'grown', 'run', {
    kind: 'byType',
    map: { power: 'grumbrute', fly: 'sheetling', swim: 'conchback', run: 'drillmole' },
    fallback: 'drillmole',
    poor: 'muckblob',
  }),
  D('skysteed', 'Unimon', 'champion', 'fly', { kind: 'fixed', to: 'gearknight' }),
  D('hoofguard', 'Centarumon', 'champion', 'run', { kind: 'fixed', to: 'whirlbot' }),
  D('grumbrute', 'Ogremon', 'champion', 'power', { kind: 'fixed', to: 'gearknight' }),
  D('sheetling', 'Bakemon', 'champion', 'fly', { kind: 'fixed', to: 'whirlbot' }),
  D('conchback', 'Shellmon', 'champion', 'swim', { kind: 'fixed', to: 'gearknight' }),
  D('drillmole', 'Drimogemon', 'champion', 'run', { kind: 'fixed', to: 'whirlbot' }),
  D('muckblob', 'Scumon', 'champion', 'normal', { kind: 'fixed', to: 'groovape' }),
  D('gearknight', 'Andromon', 'final', 'power'),
  D('whirlbot', 'Giromon', 'final', 'fly'),
  D('groovape', 'Etemon', 'final', 'normal'),

  // ---- Ver.4 ----
  D('fluffseed', 'Yuramon', 'baby', 'normal', { kind: 'fixed', to: 'budling' }),
  D('budling', 'Tanemon', 'baby', 'normal', {
    kind: 'byType',
    map: { power: 'petalpal', swim: 'petalpal' },
    fallback: 'pinkbeak',
  }),
  D('pinkbeak', 'Biyomon', 'grown', 'fly', {
    kind: 'byType',
    map: { power: 'frillhorn', run: 'manefist', swim: 'rockfin', fly: 'bigcluck' },
    fallback: 'frillhorn',
    poor: 'grumpball',
  }),
  D('petalpal', 'Palmon', 'grown', 'power', {
    kind: 'byType',
    map: { swim: 'rockfin', run: 'bigcluck', fly: 'snapjaw', power: 'frostfur' },
    fallback: 'frostfur',
    poor: 'grumpball',
  }),
  D('frillhorn', 'Monochromon', 'champion', 'power', { kind: 'fixed', to: 'clawdrake' }),
  D('manefist', 'Leomon', 'champion', 'run', { kind: 'fixed', to: 'pipsprite' }),
  D('rockfin', 'Coelamon', 'champion', 'swim', { kind: 'fixed', to: 'clawdrake' }),
  D('bigcluck', 'Kokatorimon', 'champion', 'fly', { kind: 'fixed', to: 'pipsprite' }),
  D('snapjaw', 'Kuwagamon', 'champion', 'fly', { kind: 'fixed', to: 'clawdrake' }),
  D('frostfur', 'Mojyamon', 'champion', 'power', { kind: 'fixed', to: 'pipsprite' }),
  D('grumpball', 'Nanimon', 'champion', 'normal', { kind: 'fixed', to: 'eggwalker' }),
  D('clawdrake', 'Megadramon', 'final', 'fly'),
  D('pipsprite', 'Piximon', 'final', 'fly'),
  D('eggwalker', 'Digitamamon', 'final', 'normal'),

  // ---- Ver.5 ----
  D('oozlet', 'Zurumon', 'baby', 'normal', { kind: 'fixed', to: 'smudgit' }),
  D('smudgit', 'Pagumon', 'baby', 'normal', {
    kind: 'byType',
    map: { swim: 'spinefin', fly: 'spinefin' },
    fallback: 'dustbun',
  }),
  D('dustbun', 'Gazimon', 'grown', 'run', {
    kind: 'byType',
    map: { power: 'dusksaur', run: 'cyclobrute', fly: 'gloomdrake', swim: 'tusksaur' },
    fallback: 'dusksaur',
    poor: 'gloopmound',
  }),
  D('spinefin', 'Gizamon', 'grown', 'swim', {
    kind: 'byType',
    map: { fly: 'buzzwing', swim: 'trihead', run: 'gloomdrake', power: 'tusksaur' },
    fallback: 'trihead',
    poor: 'gloopmound',
  }),
  D('dusksaur', 'DarkTyrannomon', 'champion', 'power', { kind: 'fixed', to: 'steelsaur' }),
  D('cyclobrute', 'Cyclonemon', 'champion', 'run', { kind: 'fixed', to: 'tinkerbot' }),
  D('gloomdrake', 'Devidramon', 'champion', 'fly', { kind: 'fixed', to: 'steelsaur' }),
  D('tusksaur', 'Tuskmon', 'champion', 'power', { kind: 'fixed', to: 'tinkerbot' }),
  D('buzzwing', 'Flymon', 'champion', 'fly', { kind: 'fixed', to: 'steelsaur' }),
  D('trihead', 'Deltamon', 'champion', 'power', { kind: 'fixed', to: 'tinkerbot' }),
  D('gloopmound', 'Raremon', 'champion', 'normal', { kind: 'fixed', to: 'kingsaur' }),
  D('steelsaur', 'MetalTyrannomon', 'final', 'power'),
  D('tinkerbot', 'Nanomon', 'final', 'normal'),
  D('kingsaur', 'Extyrannomon', 'final', 'power'),
];
