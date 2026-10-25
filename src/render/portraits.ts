import type { TrainerLook } from '../sim/trainers';
import { TRAINERS } from '../sim/trainers';
import { C } from './sprites/palette';

/**
 * Portraits for the speakers no table dresses (r1025 item 5). Most side-story, fun-quest,
 * Atlas and Arcade speakers have no look of their own; they used to fall back to the first
 * trainer's (Fern's), so a hundred strangers wore her face. Each now gets a person seeded by
 * their id from the shared palette: skin, hair, hat and outfit. The same id always draws the
 * same person, and no generated look ever equals a selectable trainer's.
 */

const SKINS = [C.sand, C.sandLight, C.blush, C.wood, C.bark, C.sandDeep, C.roseLight] as const;
const HAIRS = [
  C.darkBark,
  C.bark,
  C.wood,
  C.ink,
  C.sunYellow,
  C.ember,
  C.pale,
  C.greyLight,
  C.plum,
  C.orange,
  C.roseDeep,
  C.tealDeep,
  C.violet,
] as const;
const CLOTH = [
  C.leaf,
  C.forest,
  C.teal,
  C.water,
  C.deepWater,
  C.berry,
  C.rose,
  C.violet,
  C.moonPurple,
  C.lavender,
  C.sunYellow,
  C.orange,
  C.ember,
  C.mint,
  C.cream,
  C.skyDeep,
  C.roseDeep,
  C.leafDeep,
  C.sunDeep,
  C.violetDeep,
  C.tealDeep,
  C.greyDeep,
  C.greyLight,
  C.sandDeep,
] as const;
const PANTS = [C.bark, C.darkBark, C.deepWater, C.nightBlue, C.greyDeep, C.teal, C.plum] as const;
const BOOTS = [C.darkBark, C.bark, C.ink, C.plum, C.greyDeep] as const;
const HATS: readonly TrainerLook['hatStyle'][] = ['sun', 'cap', 'beanie', 'hood', 'band', 'none'];

/** FNV-1a: a stable 32-bit hash of a speaker id. */
export function idHash(id: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** A small seeded stream over the hash, so each pick draws fresh bits. */
function picker(id: string): <T>(list: readonly T[]) => T {
  let s = idHash(id) || 1;
  return <T>(list: readonly T[]): T => {
    // xorshift32
    s ^= s << 13;
    s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return list[s % list.length]!;
  };
}

const same = (a: TrainerLook, b: TrainerLook): boolean =>
  (Object.keys(a) as (keyof TrainerLook)[]).every((k) => a[k] === b[k]);

/** The deterministic person drawn for a speaker id with no look of its own. */
export function generatedLook(id: string): TrainerLook {
  const pick = picker(id);
  const shirt = pick(CLOTH);
  let shirtShade = pick(CLOTH);
  if (shirtShade === shirt) shirtShade = CLOTH[(CLOTH.indexOf(shirt) + 5) % CLOTH.length]!;
  const look: TrainerLook = {
    skin: pick(SKINS),
    hair: pick(HAIRS),
    hatStyle: pick(HATS),
    hat: pick(CLOTH),
    hatBand: pick(CLOTH),
    shirt,
    shirtShade,
    pants: pick(PANTS),
    boots: pick(BOOTS),
    outline: C.darkPlum,
  };
  // Never a selectable trainer's twin (the K4 rule content-check holds the tables to).
  return TRAINERS.some((t) => same(t.look, look))
    ? { ...look, shirt: C.mint, outline: C.ink }
    : look;
}

/**
 * The creature speakers (content `kind: 'nubbin'`) with no Nubbin of the campaign behind
 * them. They get a Nubbin-style portrait rather than a person. Moss, Sable and Wisp are
 * drawn from the campaign's own Nubbins by the dialogue. A test keeps this list in step
 * with the content.
 */
export const CREATURE_SPEAKERS: ReadonlySet<string> = new Set([
  'ts-plush',
  'tall-hood',
  'hooded-three',
  'sir-dent',
  'trotwell',
  'gullwick',
  'barty',
  'gourd-nubbin',
  'shoe-nubbin',
  'gorbold',
  'briar',
  'hush',
  'cinder',
  'fossil',
  'ash',
  'null',
  'bramble',
  'thrums',
  'solo',
  'queen-mother',
  's28-parcel',
  's30-dimple',
  's30-drizzle',
  's30-fidget',
]);

const BANDS = ['neutral', 'sun', 'moon'] as const;
const TYPES = ['normal', 'swim', 'fly', 'run', 'power'] as const;

/** The adult look a creature speaker is drawn in: its band and type, seeded by its id. */
export function creatureLook(id: string): {
  band: (typeof BANDS)[number];
  type: (typeof TYPES)[number];
} {
  const pick = picker(`creature:${id}`);
  return { band: pick(BANDS), type: pick(TYPES) };
}
