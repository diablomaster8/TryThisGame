import { CRITTER_SPECIES } from '../critters';
import { EGG_COLORS } from '../nubbin';
import { hashSeed, Rng } from '../rng';
import { SPECIES, isCommonSpecies, type Family, type Species, type SpeciesStage } from '../species';
import type { AlignmentBand, NubbinType, PartSlot, World } from '../types';
import { circuitTeam } from './circuit';
import type { BattleContext } from './types';

/**
 * Who a rival is (recs FIGHT-90): a real species with a form, critter parts, an egg colour
 * and an alignment band, so the dojo's rivals stop being one red Chao. Each context draws
 * from its own pool: tiered species for the dojo and party bouts, the digital line for Logged
 * In, the trainer's team for the Circuit, the floor's wild spots for the Hollow. Picks use
 * their own seeded generator (the save's seed and the context), never the bout's dice, so a
 * rival is the same every time its bout is offered and replays are unchanged.
 */
export interface FoeLook {
  species: string;
  /** A Chao rival above tier 1 shows an adult form. */
  form?: { band: AlignmentBand; type: NubbinType };
  parts: Record<PartSlot, string | null>;
  eggColor: string;
  band: AlignmentBand;
}

const BANDS: readonly AlignmentBand[] = ['neutral', 'sun', 'moon'];
const TYPES: readonly NubbinType[] = ['swim', 'fly', 'run', 'power', 'normal'];

/** The stages a tier draws from: babies first, then grown and champion, then finals. */
const TIER_STAGES: readonly (readonly SpeciesStage[])[] = [
  ['baby'],
  ['grown', 'champion'],
  ['final'],
];

function stagesFor(tier: number): readonly SpeciesStage[] {
  return TIER_STAGES[Math.max(0, Math.min(TIER_STAGES.length - 1, tier - 1))]!;
}

/** Common species of `stages` (and `family`, when given); never empty. */
function poolOf(stages: readonly SpeciesStage[], family?: Family): Species[] {
  const list = SPECIES.filter(
    (s) => stages.includes(s.stage) && isCommonSpecies(s) && (!family || s.family === family),
  );
  return list.length ? list : SPECIES.filter((s) => s.id === 'chao');
}

/** A look for `species`: parts and form grow with the tier. */
function dress(rng: Rng, species: string, tier: number): FoeLook {
  const parts: FoeLook['parts'] = { ears: null, tail: null, arms: null, back: null };
  for (let i = 0; i < Math.max(0, tier - 1); i++) {
    const c = rng.pick(CRITTER_SPECIES);
    const slot = rng.pick(c.parts);
    parts[slot] = `${c.id}-${slot}`;
  }
  const band = tier <= 1 ? 'neutral' : rng.pick(BANDS);
  const eggColor = rng.pick(EGG_COLORS);
  const look: FoeLook = { species, parts, eggColor, band };
  if (species === 'chao' && tier > 1) look.form = { band, type: rng.pick(TYPES) };
  return look;
}

function rngFor(world: World, key: string): Rng {
  return Rng.fromSeed(hashSeed(`${world.seed}:foe:${key}`) % 2147483647);
}

/** `count` species from `pool`, different from each other while the pool lasts. */
function pickSpecies(rng: Rng, pool: Species[], count: number): string[] {
  const left = [...pool];
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    if (left.length === 0) left.push(...pool);
    const s = left.splice(rng.int(0, left.length - 1), 1)[0]!;
    out.push(s.id);
  }
  return out;
}

/**
 * The rivals' looks for a bout in `context`, `count` of them (one for the dojo). An encounter
 * keeps the species its caller named and only gets parts and colours here.
 */
export function foeLooks(world: World, context: BattleContext, count = 1): FoeLook[] {
  const tier = context.tier;
  const n = Math.max(1, count);
  switch (context.kind) {
    case 'circuit': {
      const rng = rngFor(world, `circuit:${context.trainer}:${context.champion ? 'c' : ''}`);
      return circuitTeam(world, context.trainer, !!context.champion).map((sp) =>
        dress(rng, sp, tier),
      );
    }
    case 'story': {
      // Logged In: the digital line, a stage further on per tier.
      const rng = rngFor(world, `story:${context.storyline}:${tier}`);
      const stages =
        tier <= 1 ? ['grown' as const] : tier === 2 ? ['champion' as const] : ['final' as const];
      return pickSpecies(rng, poolOf(stages, 'digi'), n).map((sp) => dress(rng, sp, tier));
    }
    case 'encounter': {
      const rng = rngFor(world, `encounter:${context.source}:${context.key}`);
      return context.foes.map((f) => dress(rng, f.species, tier));
    }
    default: {
      // The dojo (both kinds) and party bouts: one pool per tier, so each tier looks new.
      const rng = rngFor(world, `${context.kind === 'karate' ? 'dojo' : context.kind}:${tier}`);
      return pickSpecies(rng, poolOf(stagesFor(tier)), n).map((sp) => dress(rng, sp, tier));
    }
  }
}

/**
 * A Hollow floor's rival: one of the species living on that floor (its wild spots), so a
 * stray fight matches the habitat. Falls back to the tier pool on a floor with none.
 */
export function hollowFoeLook(
  world: World,
  floor: { wildSpots: readonly { species: string }[] },
  depth: number,
  ix = 0,
): FoeLook {
  const rng = rngFor(world, `hollow:${depth}:${ix}`);
  const tier = Math.max(1, Math.min(3, 1 + Math.floor((depth - 1) / 3)));
  const local = floor.wildSpots.map((w) => w.species);
  const species = local.length
    ? local[rng.int(0, local.length - 1)]!
    : pickSpecies(rng, poolOf(stagesFor(tier)), 1)[0]!;
  return dress(rng, species, tier);
}

/**
 * Today's sparring partner at the dojo (optional, recs FIGHT-74): who drops by on a given
 * real day, from the day key (`sim/daily.ts` `dayKey`). A free daily refresh: nothing is
 * stored, nothing is owed and missing a day costs nothing.
 */
export function sparringPartner(world: World, day: string, belt = world.karate.belt): FoeLook {
  const tier = Math.max(1, Math.min(3, belt + 1));
  const rng = rngFor(world, `spar:${day}`);
  return dress(rng, pickSpecies(rng, poolOf(stagesFor(tier)), 1)[0]!, tier);
}
