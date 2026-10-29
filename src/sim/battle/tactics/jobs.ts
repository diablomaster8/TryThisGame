/**
 * Jobs (recs FIGHT-55): a unit's battlefield role, derived from what it already is and never
 * chosen. Children are Tumblers; an adult takes its winning type's job (Puddler, Glider,
 * Dasher, Bonker, Helper); an Eternal (the Chaos forms) is a Lantern Keeper. Sun and Moon
 * forms add a Sunny or Moony layer. Pocket and digital species map by their species type and
 * stage, and a champion or final species gets one extra move slot on the grid. The names and
 * icons live in `config/strings-tactics.ts`.
 */
import { TACTICS } from '../../../config/tuning-tactics';
import { speciesOf, type SpeciesStage } from '../../species';
import type { AlignmentBand, Nubbin, NubbinType } from '../../types';
import { typeOf } from '../derive';
import type { JobId, JobLayer } from './types';

const J = TACTICS.jobs;

export const JOB_OF_TYPE: Readonly<Record<NubbinType, JobId>> = {
  swim: 'puddler',
  fly: 'glider',
  run: 'dasher',
  power: 'bonker',
  normal: 'helper',
};

export const JOB_IDS: readonly JobId[] = [
  'tumbler',
  'puddler',
  'glider',
  'dasher',
  'bonker',
  'helper',
  'lanternKeeper',
];

/** The job for a grown-or-not unit of a type; Eternals are Lantern Keepers. */
export function jobFor(p: { child: boolean; type: NubbinType; eternal: boolean }): JobId {
  if (p.eternal) return 'lanternKeeper';
  return p.child ? 'tumbler' : JOB_OF_TYPE[p.type];
}

export function layerOf(band: AlignmentBand): JobLayer {
  return band === 'sun' ? 'sunny' : band === 'moon' ? 'moony' : null;
}

/** Champion and final species carry one more move on the grid. */
export const extraSlotFor = (stage: SpeciesStage): boolean =>
  stage === 'champion' || stage === 'final';

/** A Nubbin's job: Tumbler as a child or a baby species, else its type's job. */
export function jobOfNubbin(n: Nubbin): { job: JobId; layer: JobLayer; extraSlot: boolean } {
  const sp = speciesOf(n.species);
  const child = n.stage !== 'adult' || (sp.family !== 'chao' && sp.stage === 'baby');
  return {
    job: jobFor({ child, type: typeOf(n), eternal: n.eternal !== null }),
    layer: n.eternal ? null : layerOf(n.form?.band ?? 'neutral'),
    extraSlot: sp.family !== 'chao' && extraSlotFor(sp.stage),
  };
}

/** A rival's job from its species alone. */
export function jobOfSpecies(id: string): { job: JobId; layer: JobLayer; extraSlot: boolean } {
  const sp = speciesOf(id);
  return {
    job: jobFor({ child: sp.stage === 'baby', type: sp.type, eternal: false }),
    layer: null,
    extraSlot: extraSlotFor(sp.stage),
  };
}

/** Extra Move and Jump a job gives. */
export function jobMoveJump(job: JobId): { move: number; jump: number } {
  return {
    move: job === 'dasher' ? J.dasherMove : 0,
    jump: job === 'glider' ? J.gliderJump : 0,
  };
}

/** A heal's factor: Sunny ×1.25, and the Sun Keeper's aura. */
export function healMult(layer: JobLayer, aura: 'sun' | 'moon' | null): number {
  return (layer === 'sunny' ? J.sunnyHeal : 1) * (aura === 'sun' ? J.keeperAura : 1);
}

/** A status chance's factor: Moony ×1.15, and the Moon Keeper's aura. */
export function statusMult(layer: JobLayer, aura: 'sun' | 'moon' | null): number {
  return (layer === 'moony' ? J.moonyStatus : 1) * (aura === 'moon' ? J.keeperAura : 1);
}

/** Damage taken by a Bonker: its Guard is 20% higher. */
export function guardMult(job: JobId): number {
  return job === 'bonker' ? 1 / J.bonkerGuard : 1;
}
