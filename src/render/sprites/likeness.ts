/**
 * LOOK-68 (R0436): one likeness reference sheet per species, as data. An artist or agent
 * tuning a species checks against this instead of memory: three silhouette words, 2-4 key
 * colours, the parts that make it itself, and the body plan. Derived from the art spec so it
 * can never drift from the drawing, with hand-written overrides for the species whose
 * likeness needs more than the spec says. Never shown in game.
 */
import { speciesArt } from './species-art';
import { color } from './palette';
import type { CreatureSpec } from './creature';
import { chaoLikeness } from './likeness-chao';

export interface Likeness {
  /** Three words: the shape a viewer should read at a glance. */
  silhouette: [string, string, string];
  /** 2 to 4 hex colours, the body first. */
  keyColours: string[];
  /** The parts a viewer looks for before they accept it. */
  mustHave: string[];
  /** The body plan the drawer builds it from. */
  plan: string;
}

/** Hand-written overrides, over the derived sheet, for the likenesses that matter most. */
export const LIKENESS_OVERRIDES: Record<string, Partial<Likeness>> = {
  snoozelump: {
    silhouette: ['huge', 'round', 'sitting'],
    keyColours: ['#2e5c6e', '#f0e6c8'],
    mustHave: ['cream face mask', 'cream belly', 'small pointed ears', 'closed eyes'],
  },
  frostplume: {
    silhouette: ['bird', 'long-tailed', 'wide-winged'],
    mustHave: ['ribbon tail', 'beak', 'wide wings', 'thin legs'],
  },
  boltplume: {
    silhouette: ['bird', 'spiky', 'wide-winged'],
    mustHave: ['jagged feathers', 'beak', 'wide wings', 'thin legs'],
  },
  blazeplume: {
    silhouette: ['bird', 'flaming', 'wide-winged'],
    mustHave: ['flame wings', 'flame tail', 'beak', 'thin legs'],
  },
  psyclone: {
    silhouette: ['tall', 'thin', 'tailed'],
    mustHave: ['thick tail', 'neck tube', 'flat head with two horns', 'three fingers'],
  },
  cinderwing: {
    silhouette: ['winged', 'long-necked', 'upright'],
    mustHave: ['swept horns', 'teal inner wings', 'flame tail tip', 'snout'],
  },
  blazehound: {
    silhouette: ['four-legged', 'maned', 'striped'],
    mustHave: ['black stripes', 'cream mane', 'cream chest and tail', 'muzzle'],
  },
  gengar: {
    silhouette: ['squat', 'wide', 'grinning'],
    mustHave: ['wide grin', 'red eyes', 'back spikes'],
  },
};

const hex = (i: number): string => color(i);

function silhouetteOf(s: CreatureSpec): [string, string, string] {
  const build = s.size >= 1.15 ? 'large' : s.size <= 0.9 ? 'tiny' : 'small';
  const shape =
    s.plan === 'round'
      ? 'round'
      : s.plan === 'tall'
        ? 'tall'
        : s.plan === 'serpent'
          ? 'long'
          : s.plan;
  const feature =
    s.wings !== 'none'
      ? 'winged'
      : s.tail !== 'none'
        ? 'tailed'
        : s.ears !== 'none'
          ? 'eared'
          : 'plain';
  return [build, shape, feature];
}

function partsOf(s: CreatureSpec): string[] {
  const out: string[] = [];
  if (s.ears !== 'none') out.push(`${s.ears} ears`);
  if (s.tail !== 'none') out.push(`${s.tail} tail`);
  if (s.crest !== 'none') out.push(`${s.crest} crest`);
  if (s.wings !== 'none') out.push(`${s.wings} wings`);
  if (s.arms !== 'stub' && s.arms !== 'none') out.push(`${s.arms} arms`);
  for (const a of s.addons ?? []) out.push(a.kind);
  for (const m of s.marks) out.push(m);
  return out.length ? out : ['plain body'];
}

/**
 * The likeness sheet of one species, or of one Chao form (a variant id such as
 * `first-sun-power`, `second-moon-run-swim`, `eternal-sun`, `look-fox`; derived from its 3D
 * variant spec in `likeness-chao.ts`). Undefined where it has neither.
 */
export function likenessOf(id: string): Likeness | undefined {
  const spec = speciesArt(id);
  if (!spec) return chaoLikeness(id);
  const c = spec.colors;
  const colours = [...new Set([hex(c.body), hex(c.belly), hex(c.accent), hex(c.accent2)])].slice(
    0,
    4,
  );
  const base: Likeness = {
    silhouette: silhouetteOf(spec),
    keyColours: colours,
    mustHave: partsOf(spec),
    plan: spec.plan,
  };
  return { ...base, ...(LIKENESS_OVERRIDES[id] ?? {}) };
}
