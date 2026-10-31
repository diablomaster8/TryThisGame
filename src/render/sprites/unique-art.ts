import { UNIQUE_LOOKS } from '../../config/dungeon-r9-a';
import { uniqueSpecies } from '../../sim/dungeon-uniques';
import type { CreatureSpec } from './creature';
import type { ExtraKind } from './creature-extras';
import { C } from './palette';

/**
 * The named uniques' own looks (R0156, lane B r9): a unique's leader is its foe species
 * recoloured, grown and wearing a hat or crown, all from `UNIQUE_LOOKS`. It is an ordinary
 * creature recipe under the art id `unique:<id>`, so the Pixel sheet cache and the 3D look
 * cache (`art:unique:<id>`) each build it once, like any species; nothing is made per frame.
 */
export const UNIQUE_ART_PREFIX = 'unique:';

const cache = new Map<string, CreatureSpec | null>();

const colour = (name: string | undefined, fallback: number): number =>
  name !== undefined && name in C ? C[name as keyof typeof C] : fallback;

/** The art id a unique's leader draws with. */
export const uniqueArtId = (uniqueId: string): string => `${UNIQUE_ART_PREFIX}${uniqueId}`;

/** How much bigger a unique's leader is drawn than its species (1 for anything else). */
export const uniqueScale = (uniqueId: string | undefined): number =>
  (uniqueId && UNIQUE_LOOKS[uniqueId]?.size) || 1;

/**
 * The recipe for `unique:<id>`, built on `base` (the species art lookup, passed in so this
 * file does not import the species table back). Null for an unknown unique.
 */
export function uniqueArt(
  artId: string,
  base: (species: string) => CreatureSpec | undefined,
): CreatureSpec | null {
  const hit = cache.get(artId);
  if (hit !== undefined) return hit;
  const id = artId.slice(UNIQUE_ART_PREFIX.length);
  const look = UNIQUE_LOOKS[id];
  const from = look ? base(uniqueSpecies(id)) : undefined;
  let out: CreatureSpec | null = null;
  if (look && from) {
    const c = from.colors;
    // The hat replaces any head piece the species had, so two never fight for the crown.
    const keep = (from.addons ?? []).filter((e) => !HEAD_KINDS.has(e.kind));
    // The size stays the species' own (the pixel drawer fits it to its frame); both
    // renderers scale the drawn figure by `uniqueScale` instead.
    out = {
      ...from,
      colors: {
        ...c,
        body: colour(look.body, c.body),
        shade: colour(look.shade, c.shade),
        belly: colour(look.belly, c.belly),
        accent: colour(look.accent, c.accent),
        accent2: colour(look.accent2, c.accent2),
      },
      addons: [
        ...keep,
        {
          kind: look.hat as ExtraKind,
          c: colour(look.hatC, c.accent),
          c2: colour(look.hatC2, c.accent2),
        },
      ],
    };
  }
  cache.set(artId, out);
  return out;
}

const HEAD_KINDS = new Set<string>([
  'cap',
  'bucketHat',
  'leafTuft',
  'bigFlower',
  'flowers',
  'plume',
  'hairs',
  'antennae',
  'crown',
]);
