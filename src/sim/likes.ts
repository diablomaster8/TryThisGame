/**
 * R0536 (SOUL-18), R0537 (SOUL-19): each Nubbin's favourite fruit, the one it won't touch
 * unless starving, and its favourite toy. They are rolled from the Nubbin's own seed, so
 * they need no save field and stay the same across loads; only what the Keeper has seen
 * (`tasteSeen`) is stored. Likes change reactions and happiness only, never stats: a
 * disliked fruit still fills the belly and gives its points.
 */
import { hashSeed } from './rng';
import { FLAVORS, type Flavor, type Nubbin, type ToyKind } from './types';

export type Taste = Flavor | 'plain';

const TOYS: readonly ToyKind[] = ['ball', 'radio', 'blocks', 'mirror', 'tv'];

type Likes = { fruit: Taste; dislike: Flavor; toy: ToyKind };

/** Rolled once per seed: the sim asks for them every step a hungry Nubbin looks for fruit. */
const cache = new Map<number, Likes>();

/** The favourite fruit, the disliked one (never plain, never the favourite) and the toy. */
export function likesOf(n: Pick<Nubbin, 'seed'>): Likes {
  const hit = cache.get(n.seed);
  if (hit) return hit;
  if (cache.size > 512) cache.clear();
  const h = hashSeed(`likes:${n.seed}`);
  const all: Taste[] = [...FLAVORS, 'plain'];
  const fruit = all[h % all.length]!;
  const rest = FLAVORS.filter((f) => f !== fruit);
  const dislike = rest[(h >>> 8) % rest.length]!;
  const toy = TOYS[(h >>> 16) % TOYS.length]!;
  const out = { fruit, dislike, toy };
  cache.set(n.seed, out);
  return out;
}

/** How this Nubbin takes a fruit of this flavour: its favourite, a dislike, or neither. */
export function tasteOf(
  n: Pick<Nubbin, 'seed'>,
  flavor: Flavor | undefined,
): 'yum' | 'bleh' | null {
  const l = likesOf(n);
  const f: Taste = flavor ?? 'plain';
  if (f === l.fruit) return 'yum';
  if (f === l.dislike) return 'bleh';
  return null;
}
