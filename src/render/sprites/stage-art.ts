import { RADIANT } from '../../config/tuning';
import type { CreatureSpec } from './creature';
import { ex, type Extra } from './creature-extras';
import { C } from './palette';
import { isSinglePocket } from '../../sim/growth-stage';

/**
 * Lane F r11 (EVO): the two stage looks derived from a species recipe, so both renderers
 * draw them from one place (the Pixel sheet and the 3D `art:` look each build them once):
 * - `radiant:<id>`, the pocket line's top stage: the final form grown, crowned with a gold
 *   crystal crown, gem studs on the body and gold accents (3D adds a glowing rim).
 * - `juv:<id>`, the child hour of a pocket species with no line of its own: a chibi of it
 *   (round body, big cute eyes, stub limbs, small wings, shorter).
 */
export const RADIANT_ART_PREFIX = 'radiant:';
export const JUVENILE_ART_PREFIX = 'juv:';

const cache = new Map<string, CreatureSpec | undefined>();

/** The parts a juvenile keeps: the small face and head pieces read; big back pieces do not. */
const JUVENILE_DROPS = new Set<Extra['kind']>([
  'cannons',
  'lances',
  'fourArms',
  'batWings2',
  'angelWings',
  'butterflyWings',
  'plates',
  'rocks',
  'mane',
  'tubes',
]);

function radiant(s: CreatureSpec): CreatureSpec {
  const addons = (s.addons ?? []).filter((a) => a.kind !== 'crown' && a.kind !== 'gems');
  return {
    ...s,
    size: s.size * RADIANT.pocketScale,
    colors: { ...s.colors, accent2: C.sunYellow },
    addons: [...addons, ex('crown', C.sunYellow, C.white), ex('gems', C.sunYellow, C.white)],
  };
}

function juvenile(s: CreatureSpec): CreatureSpec {
  const upright = s.plan === 'biped' || s.plan === 'tall';
  return {
    ...s,
    plan: upright ? 'round' : s.plan,
    size: Math.max(0.6, s.size * RADIANT.juvenileScale),
    eyes: s.eyes === 'stalk' || s.eyes === 'closed' ? s.eyes : 'cute',
    arms: s.arms === 'none' || s.arms === 'tentacles' ? s.arms : 'stub',
    legs: s.legs === 'none' ? 'none' : 'stub',
    wings: s.wings === 'none' ? 'none' : 'small',
    ...(s.girth ? { girth: Math.min(s.girth, 1.1) } : {}),
    marks: s.marks.includes('cheeks') ? s.marks : [...s.marks, 'cheeks'],
    addons: (s.addons ?? []).filter((a) => !JUVENILE_DROPS.has(a.kind)),
  };
}

/**
 * The recipe for a stage art id (`radiant:<id>`, `juv:<id>`), built on `base` (the species
 * art lookup, passed in so this file does not import the species tables back).
 */
export function stageArt(
  artId: string,
  base: (species: string) => CreatureSpec | undefined,
): CreatureSpec | undefined {
  if (cache.has(artId)) return cache.get(artId);
  let out: CreatureSpec | undefined;
  if (artId.startsWith(RADIANT_ART_PREFIX)) {
    const from = base(artId.slice(RADIANT_ART_PREFIX.length));
    out = from && radiant(from);
  } else if (artId.startsWith(JUVENILE_ART_PREFIX)) {
    const from = base(artId.slice(JUVENILE_ART_PREFIX.length));
    out = from && juvenile(from);
  }
  cache.set(artId, out);
  return out;
}

/** Whether an art id is a stage look. */
export const isStageArt = (artId: string): boolean =>
  artId.startsWith(RADIANT_ART_PREFIX) || artId.startsWith(JUVENILE_ART_PREFIX);

/**
 * The art id a pocket or digital Nubbin draws with: its species, its Radiant look at the top
 * stage, or a single's juvenile look before its first evolution.
 */
export function nubbinArtId(n: {
  species: string;
  stage: string;
  form: { radiant?: true } | null;
}): string {
  if (n.form?.radiant) return `${RADIANT_ART_PREFIX}${n.species}`;
  if (isSinglePocket(n.species) && (n.stage === 'child' || n.stage === 'cocoon') && !n.form)
    return `${JUVENILE_ART_PREFIX}${n.species}`;
  return n.species;
}
