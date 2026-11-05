/**
 * R0554 (SOUL-37), lane A round 11: the kindergarten's class list as a family of variants
 * (six instruments, three dances, three songs, three drawings, stretching and bowing). The
 * four original lessons keep their level (0..3) and their clips; a variant is bought once
 * per Nubbin and stored in `Nubbin.lessons` under its id (value = the order learned), so the
 * save needs no new field. A Nubbin shows off its two favourite variants (ranked by a hash of
 * its own seed, so the choice is stable and never uses the rng). `lessons.show` remembers the
 * variant chosen for the current performance (index + 1) for the renderers and the sound.
 * Pure rules: no DOM, no Three.js.
 */
import { VARIANT_LESSONS } from '../config/tuning-soul-r11b';
import { hashSeed } from './rng';
import type { LessonId, Nubbin } from './types';

export type VariantProp =
  'crayon' | 'bell' | 'drum' | 'trumpet' | 'maracas' | 'tambourine' | 'flute' | 'pompom';

export interface LessonVariant {
  id: string;
  /** The original lesson whose clip and level this builds on. */
  family: LessonId;
  /** Its menu group. */
  group: 'instrument' | 'dance' | 'song' | 'drawing' | 'exercise' | 'manners';
  /** The held prop, when it has one (matches `PerformProp`). */
  prop: VariantProp | null;
  /** A drawing's doodle kind (index into the doodle sheet), else -1. */
  doodle: number;
}

const v = (
  id: string,
  family: LessonId,
  group: LessonVariant['group'],
  prop: VariantProp | null,
  doodle = -1,
): LessonVariant => ({ id, family, group, prop, doodle });

export const LESSON_VARIANTS: readonly LessonVariant[] = [
  v('instrument:bell', 'instrument', 'instrument', 'bell'),
  v('instrument:drum', 'instrument', 'instrument', 'drum'),
  v('instrument:trumpet', 'instrument', 'instrument', 'trumpet'),
  v('instrument:maracas', 'instrument', 'instrument', 'maracas'),
  v('instrument:tambourine', 'instrument', 'instrument', 'tambourine'),
  v('instrument:flute', 'instrument', 'instrument', 'flute'),
  v('dance:twist', 'dance', 'dance', null),
  v('dance:ra-ra', 'dance', 'dance', 'pompom'),
  v('dance:shake', 'dance', 'dance', null),
  v('song:lullaby', 'singing', 'song', null),
  v('song:march', 'singing', 'song', null),
  v('song:silly', 'singing', 'song', null),
  v('drawing:sun', 'drawing', 'drawing', 'crayon', 0),
  v('drawing:keeper', 'drawing', 'drawing', 'crayon', 1),
  v('drawing:friend', 'drawing', 'drawing', 'crayon', 3),
  v('exercise:stretch', 'dance', 'exercise', null),
  v('manners:bow', 'dance', 'manners', null),
];

export function variantById(id: string | null | undefined): LessonVariant | undefined {
  return id ? LESSON_VARIANTS.find((x) => x.id === id) : undefined;
}

export const isVariantId = (id: string | null | undefined): boolean => !!variantById(id);

export function knowsVariant(n: Pick<Nubbin, 'lessons'>, id: string): boolean {
  return (n.lessons?.[id] ?? 0) > 0;
}

export function knownVariants(n: Pick<Nubbin, 'lessons'>): LessonVariant[] {
  return LESSON_VARIANTS.filter((x) => knowsVariant(n, x.id));
}

/** The favourites it shows off: its two best, ranked by a hash of its own seed. */
export function repertoire(n: Pick<Nubbin, 'lessons' | 'seed'>): LessonVariant[] {
  return knownVariants(n)
    .map((x) => ({ x, s: hashSeed(`fav:${n.seed}:${x.id}`) }))
    .sort((a, b) => b.s - a.s || (a.x.id < b.x.id ? -1 : 1))
    .slice(0, VARIANT_LESSONS.repertoire)
    .map((e) => e.x);
}

/** Pick which favourite this performance is (a hash of the time, never the rng). */
export function pickShow(n: Nubbin, nowMs: number): LessonVariant | null {
  const rep = repertoire(n);
  if (rep.length === 0) return null;
  const pick = rep[hashSeed(`show:${n.seed}:${nowMs}`) % rep.length]!;
  n.lessons ??= {};
  n.lessons.show = LESSON_VARIANTS.indexOf(pick) + 1;
  return pick;
}

/** The variant being shown now, or undefined (stale picks from another lesson are ignored). */
export function shownVariant(n: Pick<Nubbin, 'lessons' | 'behavior'>): LessonVariant | undefined {
  const i = n.lessons?.show ?? 0;
  const x = i > 0 ? LESSON_VARIANTS[i - 1] : undefined;
  if (!x || n.behavior.itemId !== x.family) return undefined;
  return x;
}
