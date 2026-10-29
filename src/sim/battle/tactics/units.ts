/**
 * Building tactics units (recs FIGHT-52, FIGHT-55): from a Nubbin (its combatant, Move and
 * Jump from its levels, its job and its friendships), from a rival species at a level, or
 * from raw levels for tests and story battles.
 */
import type { StatKey, World, Nubbin, NubbinType, AlignmentBand } from '../../types';
import {
  combatantOf,
  combatLevels,
  deriveStats,
  fromStats,
  rivalMoves,
  speciesType,
} from '../derive';
import { battleOf } from '../moves-sources';
import type { Combatant, SideIx } from '../types';
import type { UnitSeed } from './engine';
import { jobFor, jobMoveJump, jobOfNubbin, jobOfSpecies, layerOf } from './jobs';
import { canSwim, moveJump } from './path';
import type { Cell, JobId } from './types';

function seedOf(
  c: Combatant,
  levels: Readonly<Record<StatKey, number>>,
  job: { job: JobId; layer: UnitSeed['layer']; extraSlot: boolean },
): UnitSeed {
  const mj = moveJump(levels, c.traits);
  const bonus = jobMoveJump(job.job);
  return {
    c,
    job: job.job,
    layer: job.layer,
    move: mj.move + bonus.move,
    jump: mj.jump + bonus.jump,
    swimmer: canSwim(c.type, levels.swim),
    extraSlot: job.extraSlot,
  };
}

/** A Nubbin on the Keeper's side. */
export function unitFromNubbin(n: Nubbin, world: World): UnitSeed {
  const c = combatantOf(n, world);
  const job = jobOfNubbin(n);
  const seed = seedOf(c, combatLevels(n, world), job);
  if (job.extraSlot) {
    const extra = battleOf(n).known.find((id) => !c.moves.includes(id));
    if (extra) seed.bonus = extra;
  }
  if (n.friends) seed.friends = { ...n.friends };
  return seed;
}

/** A unit from levels: every stat at `level` unless `levels` says otherwise. */
export function unitFromLevels(o: {
  id: string;
  side: SideIx;
  species: string;
  level: number;
  levels?: Partial<Record<StatKey, number>>;
  type?: NubbinType;
  band?: AlignmentBand;
  moves?: string[];
  child?: boolean;
  job?: JobId;
  at?: Cell;
  name?: string;
}): UnitSeed {
  const L = {
    swim: o.level,
    fly: o.level,
    run: o.level,
    power: o.level,
    stamina: o.level,
    ...o.levels,
  };
  const sp = jobOfSpecies(o.species);
  const type = o.type ?? speciesType(o.species);
  const c = fromStats(
    {
      id: o.id,
      side: o.side,
      nubbinId: o.side === 0 ? o.id : null,
      name: o.name ?? null,
      foeName: o.side === 1 ? 0 : -1,
      species: o.species,
    },
    deriveStats(L),
    { type, band: o.band ?? 'neutral', moves: o.moves ?? rivalMoves(o.species) },
  );
  const job =
    o.job ?? (o.type ? jobFor({ child: o.child ?? false, type, eternal: false }) : sp.job);
  const seed = seedOf(c, L, { job, layer: layerOf(o.band ?? 'neutral'), extraSlot: sp.extraSlot });
  if (o.at) seed.at = o.at;
  return seed;
}
