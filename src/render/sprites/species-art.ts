import type { CreaturePalette, CreatureSpec } from './creature';
import { C } from './palette';
import { ex } from './creature-extras';
import { DIGI2_ART } from './species-art-digi2';
import { GEN1B_ART } from './species-art-gen1b';
import { SPECIES_ART_GEN1A } from './species-art-gen1a';

/**
 * Art specs for every non-Chao species, keyed by species id (sim/species.ts). Each is
 * a body plan, a size, a palette and a few features; the creature drawer does the rest.
 * Likeness comes from colour and silhouette; nothing here is traced from any sprite.
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

const YELLOW = pal(C.sunYellow, C.orange, C.cream, C.rose, C.ink);
const PINK = pal(C.blush, C.rose, C.pale, C.rose, C.berry);
const CREAM = pal(C.cream, C.sand, C.white, C.ember, C.water);
const BLUE = pal(C.water, C.deepWater, C.shallows, C.white, C.deepWater);
const ORANGE = pal(C.orange, C.ember, C.cream, C.ember, C.sunYellow);
const GREY = pal(C.lilacGrey, C.dusk, C.pale, C.plum, C.dusk);
const SHELL = pal(C.shallows, C.water, C.pale, C.sand, C.wood);
const TEAL = pal(C.teal, C.deepGreen, C.mint, C.sprout, C.forest);

export const SPECIES_ART: Record<string, CreatureSpec> = {
  // ---- mouse line ----
  zapling: spec(YELLOW, {
    plan: 'round',
    size: 0.85,
    ears: 'tallPointed',
    tail: 'stub',
    eyes: 'cute',
    marks: ['cheeks'],
    legs: 'stub',
  }),
  zapkin: spec(YELLOW, {
    ears: 'tallPointed',
    tail: 'lightning',
    eyes: 'cute',
    marks: ['cheeks', 'belly'],
    size: 1,
  }),
  zapmaw: spec(pal(C.orange, C.ember, C.cream, C.sunYellow, C.sunYellow), {
    ears: 'tallPointed',
    tail: 'lightningCurl',
    eyes: 'cute',
    marks: ['cheeks', 'belly'],
    size: 1.15,
    arms: 'long',
  }),
  // ---- star line ----
  starbud: spec(PINK, {
    plan: 'round',
    size: 0.8,
    ears: 'catTips',
    crest: 'forelock',
    eyes: 'cute',
    tail: 'curl',
  }),
  starpuff: spec(PINK, {
    ears: 'catTips',
    crest: 'forelock',
    tail: 'curl',
    eyes: 'cute',
    wings: 'small',
    size: 1,
  }),
  starwing: spec(pal(C.blush, C.rose, C.pale, C.rose, C.berry), {
    ears: 'catTips',
    crest: 'forelock',
    tail: 'curl',
    eyes: 'cute',
    wings: 'feather',
    size: 1.15,
  }),
  // ---- puff line ----
  puffbud: spec(pal(C.blush, C.rose, C.pale, C.rose, C.deepWater), {
    plan: 'round',
    size: 0.8,
    crest: 'forelock',
    eyes: 'big',
  }),
  puffle: spec(pal(C.blush, C.rose, C.pale, C.rose, C.teal), {
    plan: 'round',
    size: 1,
    crest: 'forelock',
    ears: 'catTips',
    eyes: 'big',
    arms: 'stub',
  }),
  pufflow: spec(pal(C.blush, C.rose, C.pale, C.rose, C.teal), {
    plan: 'tall',
    size: 1.1,
    ears: 'tallPointed',
    crest: 'forelock',
    eyes: 'big',
    arms: 'long',
  }),
  // ---- shell line ----
  shellbit: spec(pal(C.cream, C.sand, C.white, C.ember, C.water), {
    plan: 'round',
    size: 0.85,
    crest: 'shellTop',
    eyes: 'dot',
    marks: ['star'],
    legs: 'none',
  }),
  shellwing: spec(CREAM, {
    crest: 'shellTop',
    wings: 'feather',
    eyes: 'dot',
    marks: ['star', 'belly'],
    legs: 'long',
    size: 1.05,
  }),
  // ---- scrapper line ----
  scrapper: spec(pal(C.lavender, C.violet, C.sand, C.sand, C.plum), {
    ears: 'none',
    crest: 'spikesTop',
    eyes: 'angry',
    marks: ['belly'],
    arms: 'long',
    size: 0.9,
  }),
  kickmaster: spec(pal(C.sand, C.wood, C.cream, C.wood, C.bark), {
    legs: 'long',
    arms: 'long',
    eyes: 'angry',
    size: 1.1,
    marks: ['stripes'],
  }),
  jabmaster: spec(pal(C.sand, C.wood, C.cream, C.ember, C.violet), {
    arms: 'boxing',
    eyes: 'angry',
    size: 1.1,
    marks: ['belly'],
  }),
  spinmaster: spec(pal(C.sand, C.wood, C.cream, C.water, C.wood), {
    crest: 'antenna',
    arms: 'long',
    eyes: 'angry',
    size: 1.05,
    legs: 'long',
    marks: ['belly'],
  }),
  // ---- kiss line ----
  kissbud: spec(pal(C.lavender, C.violet, C.blush, C.sunYellow, C.rose), {
    plan: 'round',
    size: 0.85,
    crest: 'hair',
    eyes: 'cute',
    marks: ['cheeks'],
    legs: 'stub',
  }),
  frostdiva: spec(pal(C.violet, C.moonPurple, C.ember, C.sunYellow, C.rose), {
    plan: 'tall',
    size: 1.15,
    crest: 'hair',
    eyes: 'big',
    arms: 'long',
    marks: ['belly'],
  }),
  // ---- plug line ----
  plugbud: spec(pal(C.sunYellow, C.orange, C.cream, C.ink, C.ink), {
    ears: 'prongs',
    eyes: 'angry',
    marks: ['stripes', 'belly'],
    arms: 'long',
    size: 0.9,
  }),
  voltbrute: spec(pal(C.sunYellow, C.orange, C.cream, C.ink, C.ink), {
    ears: 'horns',
    tail: 'spiky',
    eyes: 'angry',
    marks: ['stripes'],
    arms: 'long',
    size: 1.2,
  }),
  // ---- ember line ----
  emberbud: spec(ORANGE, {
    crest: 'flame',
    tail: 'flame',
    eyes: 'cute',
    marks: ['belly'],
    size: 0.9,
  }),
  blazebrute: spec(pal(C.ember, C.berry, C.sunYellow, C.sunYellow, C.orange), {
    crest: 'flame',
    tail: 'flame',
    eyes: 'angry',
    arms: 'claws',
    marks: ['belly'],
    size: 1.2,
  }),
  // ---- droplet line ----
  droplet: spec(pal(C.water, C.deepWater, C.shallows, C.white, C.deepWater), {
    plan: 'round',
    size: 0.8,
    ears: 'roundBig',
    tail: 'ball',
    eyes: 'cute',
    marks: ['cheeks'],
  }),
  puddlemouse: spec(BLUE, {
    plan: 'round',
    size: 1,
    ears: 'roundBig',
    tail: 'ball',
    eyes: 'cute',
    marks: ['belly'],
    legs: 'stub',
  }),
  rivermouse: spec(BLUE, {
    ears: 'roundBig',
    tail: 'ball',
    eyes: 'cute',
    marks: ['belly', 'zigzag'],
    size: 1.2,
    arms: 'long',
  }),
  // ---- grin line ----
  grinlet: spec(pal(C.shallows, C.water, C.pale, C.ink, C.ink), {
    plan: 'round',
    size: 0.85,
    ears: 'stubs',
    tail: 'club',
    eyes: 'closed',
    marks: [],
  }),
  punchbag: spec(pal(C.shallows, C.water, C.shallows, C.ink, C.ink), {
    plan: 'tall',
    size: 1.2,
    tail: 'club',
    eyes: 'closed',
    arms: 'long',
    legs: 'none',
  }),
  // ---- fossils ----
  spiralshell: spec(SHELL, {
    plan: 'shell',
    size: 0.9,
    eyes: 'big',
    arms: 'tentacles',
    marks: ['spots'],
  }),
  spiralking: spec(pal(C.shallows, C.water, C.pale, C.sand, C.wood), {
    plan: 'tall',
    size: 1.15,
    crest: 'spikesTop',
    arms: 'tentacles',
    eyes: 'angry',
    legs: 'none',
    marks: ['belly'],
  }),
  domeshell: spec(pal(C.bark, C.darkBark, C.sand, C.ember, C.wood), {
    plan: 'shell',
    size: 0.9,
    eyes: 'angry',
    marks: ['spots'],
  }),
  domereaper: spec(pal(C.bark, C.darkBark, C.sand, C.ember, C.wood), {
    crest: 'dome',
    arms: 'claws',
    eyes: 'angry',
    size: 1.2,
    legs: 'long',
  }),
  // Single stage, so one look for life: between the old baby and grown sizes.
  skyfang: spec(GREY, {
    wings: 'bat',
    tail: 'long',
    crest: 'twinHorns',
    eyes: 'angry',
    size: 1.05,
    arms: 'claws',
  }),
  lilystalk: spec(pal(C.violet, C.moonPurple, C.lavender, C.blush, C.rose), {
    plan: 'stalk',
    size: 0.9,
    crest: 'petals',
    eyes: 'dot',
    legs: 'none',
    arms: 'none',
  }),
  lilyking: spec(pal(C.teal, C.deepGreen, C.mint, C.blush, C.rose), {
    plan: 'stalk',
    size: 1.2,
    crest: 'petals',
    eyes: 'dot',
    legs: 'none',
    arms: 'tentacles',
    marks: ['spots'],
  }),
  clawnymph: spec(pal(C.lilacGrey, C.dusk, C.pale, C.ember, C.dusk), {
    plan: 'slug',
    size: 0.9,
    eyes: 'stalk',
    crest: 'twinHorns',
    arms: 'claws',
  }),
  clawknight: spec(pal(C.dusk, C.plum, C.lilacGrey, C.ember, C.plum), {
    crest: 'twinHorns',
    arms: 'claws',
    eyes: 'angry',
    size: 1.25,
    marks: ['stripes'],
  }),
  // ---- digital line ----
  fuzzlet: spec(pal(C.ink, C.darkPlum, C.dusk, C.sunYellow, C.sunYellow, C.sunYellow), {
    plan: 'round',
    move: 'hop',
    size: 0.8,
    eyes: 'big',
    legs: 'none',
    arms: 'none',
  }),
  chompet: spec(pal(C.blush, C.rose, C.pale, C.ember, C.rose), {
    plan: 'round',
    move: 'hop',
    size: 0.9,
    ears: 'tallPointed',
    eyes: 'big',
    legs: 'none',
    arms: 'none',
    marks: [],
  }),
  dinolet: spec(pal(C.orange, C.sunDeep, C.cream, C.ember, C.white), {
    irisColor: '#58a838',
    tail: 'long',
    arms: 'claws',
    eyes: 'big',
    marks: ['belly'],
    size: 1,
  }),
  croaklet: spec(TEAL, {
    plan: 'round',
    size: 1,
    ears: 'fins',
    crest: 'spikesTop',
    eyes: 'big',
    legs: 'stub',
    marks: ['belly'],
  }),
  // Greymon (LOOK-08): an upright dinosaur, orange with blue-grey stripes, under a brown
  // skull helmet with three horns.
  hornsaur: spec(pal(C.orange, C.ember, C.cream, C.sand, C.deepWater, C.ink, C.deepWater), {
    plan: 'tall',
    extras: ['skullHelmet', 'dinoSnout'],
    tail: 'long',
    arms: 'claws',
    eyes: 'angry',
    size: 1.2,
    marks: ['stripes', 'belly'],
  }),
  redsaur: spec(pal(C.ember, C.berry, C.cream, C.sunYellow, C.wood), {
    tail: 'long',
    arms: 'claws',
    eyes: 'angry',
    size: 1.2,
    marks: ['belly', 'stripes'],
  }),
  shadeling: spec(pal(C.ink, C.darkPlum, C.dusk, C.ember, C.darkPlum, C.ember), {
    plan: 'tall',
    wings: 'bat',
    crest: 'twinHorns',
    arms: 'claws',
    eyes: 'angry',
    size: 1.15,
    legs: 'long',
  }),
  blazeman: spec(pal(C.ember, C.berry, C.sunYellow, C.sunYellow, C.orange, C.water), {
    plan: 'tall',
    crest: 'flame',
    eyes: 'angry',
    arms: 'long',
    size: 1.1,
    marks: ['belly'],
  }),
  slugbert: spec(pal(C.sprout, C.grass, C.cream, C.rose, C.forest), {
    plan: 'slug',
    size: 1.1,
    eyes: 'stalk',
    marks: ['eyeMask'],
  }),
  skyserpent: spec(pal(C.water, C.deepWater, C.shallows, C.white, C.ember), {
    plan: 'serpent',
    size: 1.15,
    serpent: { rise: 5, belly: true },
    wings: 'feather',
    crest: 'twinHorns',
    eyes: 'angry',
    legs: 'none',
    arms: 'none',
  }),
  seaserpent: spec(pal(C.water, C.deepWater, C.shallows, C.sunYellow, C.deepWater), {
    plan: 'serpent',
    size: 1.15,
    serpent: { segments: 9, rise: 3, belly: true },
    ears: 'fins',
    crest: 'helmet',
    eyes: 'angry',
    legs: 'none',
    arms: 'none',
  }),
  // MetalGreymon: Greymon's body and helmet with a metal arm, a chest plate and bat wings.
  ironsaur: spec(pal(C.orange, C.ember, C.lilacGrey, C.sand, C.deepWater, C.ink, C.deepWater), {
    plan: 'tall',
    extras: ['skullHelmet', 'dinoSnout'],
    wings: 'bat',
    tail: 'long',
    arms: 'metal',
    eyes: 'angry',
    size: 1.25,
    marks: ['stripes', 'chest'],
  }),
  beanbot: spec(pal(C.lilacGrey, C.dusk, C.pale, C.sunYellow, C.plum), {
    plan: 'round',
    size: 1.05,
    eyes: 'big',
    arms: 'metal',
    legs: 'stub',
    marks: ['chest'],
  }),
  hugbear: spec(pal(C.sunYellow, C.orange, C.cream, C.ember, C.wood), {
    plan: 'tall',
    size: 1.25,
    ears: 'round',
    eyes: 'dot',
    arms: 'long',
    marks: ['belly'],
    crest: 'bow',
    // Monzaemon's pink heart on the chest (LOOK-41).
    addons: [ex('heart', C.rose)],
  }),
  // ---- digital line, Versions 2 to 5 ----
  ...DIGI2_ART,
  ...GEN1B_ART,
  ...SPECIES_ART_GEN1A,
};

export function speciesArt(id: string): CreatureSpec | undefined {
  return SPECIES_ART[id];
}
