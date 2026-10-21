import { EGG } from '../config/tuning';
import type { Nubbin, NubbinForm, SimEvent, World } from './types';

/**
 * SL4's (Dawn & Dusk) degeneration: a grown Nubbin reverts to an egg, keeping its name, stats, grades
 * and rebirths but losing its form and its age, the way the mystery describes it. What
 * it was is stashed in `genes.degenerated` so the story can put it back once the cause
 * is found, provided the egg has not hatched again in the meantime.
 */
interface Stash {
  stage: Nubbin['stage'];
  stageMs: number;
  ageMs: number;
  species: string;
  form: NubbinForm | null;
}

export function isDegenerated(n: Nubbin): boolean {
  return n.genes.degenerated !== undefined;
}

/**
 * The oldest grown Nubbin, the one the mystery takes first. Eternals never age, so the
 * mystery passes them by (an Eternal egg or child would break the Eternal rules).
 */
export function degenerationTarget(world: World): Nubbin | undefined {
  return world.nubbins
    .filter((n) => (n.stage === 'adult' || n.stage === 'child') && !n.eternal)
    .sort((a, b) => b.ageMs - a.ageMs)[0];
}

export function degenerate(world: World, n: Nubbin, events: SimEvent[]): boolean {
  if (n.stage === 'egg' || n.stage === 'cocoon' || n.eternal || isDegenerated(n)) return false;
  const stash: Stash = {
    stage: n.stage,
    stageMs: n.stageMs,
    ageMs: n.ageMs,
    species: n.species,
    form: n.form,
  };
  n.genes.degenerated = stash;
  // An adult already had this life's grade upgrade; growing up again must not give another.
  if (n.form) n.genes.evolvedThisLife = true;
  n.stage = 'egg';
  n.stageMs = 0;
  n.ageMs = 0;
  n.cocoonKind = null;
  n.hatchRemainingMs = EGG.hatchMs;
  n.form = null;
  n.species = n.lineage;
  n.behavior.state = 'sit';
  if (world.keeper.carrying === n.id) world.keeper.carrying = null;
  events.push({ kind: 'degenerated', nubbinId: n.id, name: n.name });
  return true;
}

/** Put a degenerated Nubbin back as it was, if it is still the egg it became. */
export function restore(n: Nubbin, events: SimEvent[]): boolean {
  const stash = n.genes.degenerated as Stash | undefined;
  if (!stash) return false;
  delete n.genes.degenerated;
  if (n.stage !== 'egg') return false;
  n.stage = stash.stage;
  n.stageMs = stash.stageMs;
  n.ageMs = stash.ageMs;
  n.species = stash.species;
  n.form = stash.form;
  n.hatchRemainingMs = 0;
  n.behavior.state = 'wander';
  events.push({ kind: 'restored', nubbinId: n.id, name: n.name });
  return true;
}

/** True once this life has had its evolution (and its grade upgrade), even if it reverted. */
export function evolvedThisLife(n: Nubbin): boolean {
  return n.genes.evolvedThisLife === true;
}

/** Every degenerated Nubbin in the roster. */
export function degenerated(world: World): Nubbin[] {
  return world.nubbins.filter(isDegenerated);
}
