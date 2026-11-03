import type { CreaturePalette, CreatureSpec } from './creature';
import { ex } from './creature-extras';
import { C } from './palette';

/**
 * Art recipes for the round 11 evolutions (`sim/species-r11.ts`), in the same format as
 * `species-art.ts`, which both renderers read. Likeness comes from colour, silhouette and
 * the shared extra parts; nothing is traced. Each final reads bigger than the form before it.
 */
const pal = (
  body: number,
  shade: number,
  belly: number,
  accent: number,
  accent2: number,
  eye: number = C.ink,
  outline: number = C.darkPlum,
): CreaturePalette => ({ body, shade, belly, accent, accent2, eye, outline });

const base: Omit<CreatureSpec, 'colors'> = {
  plan: 'biped',
  size: 1,
  ears: 'none',
  tail: 'none',
  crest: 'none',
  wings: 'none',
  arms: 'stub',
  legs: 'stub',
  eyes: 'dot',
  marks: [],
};

const spec = (colors: CreaturePalette, over: Partial<CreatureSpec>): CreatureSpec => ({
  ...base,
  colors,
  ...over,
});

export const R11_ART: Record<string, CreatureSpec> = {
  // Togekiss: white, a halo of wings and a small star on the chest.
  shellhalo: spec(pal(C.white, C.pale, C.white, C.ember, C.skyDeep), {
    size: 1.2,
    crest: 'shellTop',
    wings: 'feather',
    eyes: 'cute',
    marks: ['star', 'belly'],
    legs: 'long',
    addons: [ex('angelWings', C.white, C.skyLight)],
  }),
  // Electivire: a bigger yellow brute with two black rings on its horns and two long tails.
  stormbrute: spec(pal(C.sunYellow, C.orange, C.cream, C.ink, C.ink), {
    size: 1.3,
    ears: 'horns',
    tail: 'lightning',
    eyes: 'angry',
    marks: ['stripes'],
    arms: 'long',
    legs: 'long',
    addons: [ex('tubes', C.ink)],
  }),
  // Magmortar: red, a flame crest and tail, a cannon for an arm.
  blazecannon: spec(pal(C.ember, C.berry, C.sunYellow, C.sunYellow, C.orange), {
    size: 1.3,
    crest: 'flame',
    tail: 'flame',
    eyes: 'angry',
    arms: 'metal',
    marks: ['belly'],
    addons: [ex('cannons', C.greyDeep)],
  }),
  // Kingdra: a deep blue sea dragon with a spiked fin and a pale belly.
  snoutking: spec(pal(C.skyDeep, C.nightBlue, C.cream, C.sunYellow, C.water), {
    plan: 'stalk',
    size: 1.3,
    ears: 'fins',
    crest: 'spikesTop',
    tail: 'curl',
    eyes: 'angry',
    marks: ['belly'],
    gen1b: ['snout'],
    addons: [ex('backSpikes', C.sunYellow)],
  }),
  // Steelix: a longer, steel-grey chain, plated and horned.
  ironwyrm: spec(pal(C.greyLight, C.greyDeep, C.pale, C.dusk, C.plum), {
    plan: 'serpent',
    serpent: { segments: 10, taper: 0.55, rise: 3 },
    size: 1.3,
    crest: 'horn',
    eyes: 'angry',
    legs: 'none',
    arms: 'none',
    gen1b: ['boulders'],
    addons: [ex('plates', C.dusk)],
  }),
  // Scizor: red, with a pair of big silver pincers and thin wings.
  shearwing: spec(pal(C.ember, C.berry, C.roseLight, C.greyLight, C.pale), {
    size: 1.2,
    wings: 'small',
    arms: 'none',
    legs: 'long',
    eyes: 'angry',
    marks: ['belly'],
    gen1b: ['scythes', 'pincers'],
  }),
  // Blissey: round and pink with a tuft and an egg in its pouch.
  eggheart: spec(pal(C.blush, C.rose, C.white, C.rose, C.white), {
    plan: 'round',
    size: 1.2,
    ears: 'round',
    tail: 'ball',
    crest: 'forelock',
    eyes: 'cute',
    marks: ['cheeks'],
    gen1b: ['pouchEgg'],
  }),
  // Porygon2: a pink-red head and blue body, a duck bill, sharper edges.
  prismbird: spec(pal(C.rose, C.roseDeep, C.skyDeep, C.water, C.white), {
    size: 1.15,
    wings: 'small',
    arms: 'none',
    tail: 'spiky',
    eyes: 'big',
    marks: ['belly'],
    gen1b: ['beak'],
    addons: [ex('plates', C.skyDeep)],
  }),
};
