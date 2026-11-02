import { LIFECYCLE, RADIANT } from '../config/tuning';
import { lifetimeHappiness } from './needs';
import { SPECIES, speciesOf, type Species } from './species';
import { levelOf } from './stats';
import type { Nubbin } from './types';
import { STAT_KEYS } from './types';

/**
 * Lane F r11 (EVO): where a Nubbin stands on its line's ladder, for the stats sheet's stage
 * row and the tests, and the rule for the top stage (Chaos-tier for the Chao line, Radiant for
 * the pocket line). The digital line tops out at its Ultimate. Pure and DOM-free, and it
 * reads only species data, so the renderers can use it without loading the world.
 *
 * Ladders, egg counted: Chao egg → child → first form → second form → Chaos-tier (5), or the
 * Eternal at the top; pocket egg → each species of the line → Radiant (4 or 5; a single
 * species shows a juvenile look for the child hour); digital egg → baby I → baby II → rookie
 * → champion → ultimate (6).
 */
export type StageKey =
  'egg' | 'hatchling' | 'young' | 'grown' | 'prime' | 'peak' | 'radiant' | 'eternal';

export interface StageInfo {
  /** 1-based place on the ladder. */
  index: number;
  /** Stages on this Nubbin's ladder, the top one included. */
  total: number;
  key: StageKey;
}

const BY_INDEX: readonly StageKey[] = ['egg', 'hatchling', 'young', 'grown', 'prime', 'peak'];

/** Every species another evolves into, mapped to the first one that does. */
const PARENT = new Map<string, string>();
for (const s of SPECIES) for (const to of targetsOf(s)) if (!PARENT.has(to)) PARENT.set(to, s.id);

/** The species a rule can lead to. */
export function targetsOf(s: Species): string[] {
  const r = s.evolve;
  if (!r) return [];
  if (r.kind === 'fixed') return [r.to];
  if (r.kind === 'byBand') return [...new Set([r.sun, r.moon, r.neutral])];
  const out = [...Object.values(r.map), r.fallback, ...(r.poor ? [r.poor] : [])];
  return [...new Set(out.filter((x): x is string => !!x))];
}

/** How many forms come before this species on its line. */
export function ancestorsOf(id: string): number {
  let n = 0;
  for (let at = PARENT.get(id); at && n < 8; at = PARENT.get(at)) n++;
  return n;
}

/** The first species of a species' line. */
export function lineRoot(id: string): string {
  let at = speciesOf(id).id;
  for (let i = 0; i < 8; i++) {
    const up = PARENT.get(at);
    if (!up) break;
    at = up;
  }
  return at;
}

/** The longest run of forms still ahead of this species. */
export function formsAhead(id: string): number {
  const kids = targetsOf(speciesOf(id));
  return kids.length ? 1 + Math.max(...kids.map(formsAhead)) : 0;
}

/** A pocket species with no line at all: it shows a juvenile look for the child hour. */
export function isSinglePocket(id: string): boolean {
  const s = speciesOf(id);
  return s.family === 'pocket' && !s.evolve && !PARENT.has(s.id);
}

/** Whether a line has a top stage beyond its last species (Chao and pocket do; digital does not). */
export const hasTopStage = (id: string): boolean => speciesOf(id).family !== 'digi';

/** Where a Nubbin stands on its ladder. */
export function stageInfo(
  n: Pick<Nubbin, 'stage' | 'species' | 'form' | 'eternal' | 'cocoonKind'>,
): StageInfo {
  const s = speciesOf(n.species);
  const adult =
    !!n.form && n.stage !== 'egg' && !(n.stage === 'cocoon' && n.cocoonKind === 'evolve');
  if (s.family === 'chao') {
    const total = 5;
    if (n.stage === 'egg') return { index: 1, total, key: 'egg' };
    if (!adult) return { index: 2, total, key: 'hatchling' };
    if (n.eternal) return { index: total, total, key: 'eternal' };
    if (n.form?.radiant) return { index: total, total, key: 'radiant' };
    return n.form?.second ? { index: 4, total, key: 'grown' } : { index: 3, total, key: 'young' };
  }
  const single = isSinglePocket(s.id);
  const top = hasTopStage(s.id) ? 1 : 0;
  const before = ancestorsOf(s.id) + (single ? 1 : 0);
  const total = 1 + before + 1 + formsAhead(s.id) + top;
  if (n.stage === 'egg') return { index: 1, total, key: 'egg' };
  if (single && !adult) return { index: 2, total, key: 'hatchling' };
  if (n.form?.radiant) return { index: total, total, key: 'radiant' };
  const index = 2 + before;
  return { index, total, key: BY_INDEX[Math.min(index, BY_INDEX.length) - 1]! };
}

/**
 * The top stage's rule: late in adult life (from `LIFECYCLE.thirdEvolutionMs`), on a line
 * that has one, at its last species, with good care (lifetime happiness and affection) and one
 * trained stat. Never for an Eternal, who already stands at the top.
 */
export function canAscend(n: Nubbin): boolean {
  if (n.stage !== 'adult' || !n.form || n.form.radiant || n.eternal) return false;
  if (n.stageMs < LIFECYCLE.thirdEvolutionMs) return false;
  const s = speciesOf(n.species);
  if (!hasTopStage(s.id) || s.evolve) return false;
  if (n.form.second === null) return false;
  if (lifetimeHappiness(n) < RADIANT.minLifetimeHappiness) return false;
  if (n.needs.affection < RADIANT.minAffection) return false;
  return STAT_KEYS.some((k) => levelOf(n.stats[k].points) >= RADIANT.minStatLevel);
}
