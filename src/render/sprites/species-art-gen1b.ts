import type { CreaturePalette, CreatureSpec } from './creature';
import { C } from './palette';

/**
 * Art recipes for the second half of the first-generation pocket line (`sim/species-gen1b.ts`),
 * in the same format as `species-art.ts`, which both renderers read. Likeness comes from
 * colour, silhouette and the extra parts in `creature-gen1b.ts`; nothing is traced.
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

/** Floating balls and blobs: no arms, no legs. */
const ORB = { plan: 'round', arms: 'none', legs: 'none' } as const;

const PONY = pal(C.cream, C.sand, C.white, C.orange, C.sunYellow);
const SLOW = pal(C.blush, C.rose, C.cream, C.rose, C.cream);
const MAGNET = pal(C.lilacGrey, C.dusk, C.pale, C.ember, C.water);
const STRUT = pal(C.wood, C.bark, C.sand, C.sunYellow, C.ink);
const SEAL = pal(C.white, C.lilacGrey, C.pale, C.pale, C.pale);
const SLUDGE = pal(C.violet, C.moonPurple, C.lavender, C.lavender, C.plum);
const CRAB = pal(C.ember, C.berry, C.cream, C.ember, C.cream);
const BONE = pal(C.bark, C.darkBark, C.cream, C.sand, C.cream);
const SMOG = pal(C.violet, C.moonPurple, C.cream, C.lavender, C.cream);
const RHINO = pal(C.lilacGrey, C.dusk, C.pale, C.pale, C.cream);
const KOI = pal(C.white, C.lilacGrey, C.white, C.ember, C.pale);

export const GEN1B_ART: Record<string, CreatureSpec> = {
  // ---- fire foal ----
  emberfoal: spec(PONY, {
    size: 0.9,
    ears: 'catTips',
    crest: 'flame',
    tail: 'flame',
    legs: 'long',
    eyes: 'big',
  }),
  blazesteed: spec(PONY, {
    plan: 'tall',
    size: 1.15,
    ears: 'catTips',
    crest: 'flame',
    tail: 'flame',
    legs: 'long',
    eyes: 'angry',
    arms: 'none',
  }),
  // ---- dawdle line ----
  dawdlet: spec(SLOW, {
    plan: 'round',
    size: 0.9,
    ears: 'round',
    tail: 'long',
    marks: ['chest'],
  }),
  dawdleshell: spec(pal(C.blush, C.rose, C.cream, C.lilacGrey, C.pale), {
    size: 1.15,
    ears: 'round',
    tail: 'long',
    marks: ['chest'],
    gen1b: ['backShell'],
  }),
  // ---- magnets ----
  clinkbolt: spec(MAGNET, { ...ORB, size: 0.75, gen1b: ['magnets', 'cyclops'] }),
  clinktrio: spec(MAGNET, {
    ...ORB,
    size: 0.95,
    gen1b: ['magnets', 'cyclops'],
    heads: { count: 3, neck: 0, spread: 130, sizes: [1, 1, 1], faces: 'full' },
  }),
  // ---- leek duck ----
  leekbill: spec(STRUT, {
    size: 0.95,
    wings: 'small',
    arms: 'none',
    marks: ['belly'],
    gen1b: ['beak', 'leek'],
  }),
  // ---- running birds ----
  twinstrut: spec(STRUT, {
    size: 0.9,
    arms: 'none',
    legs: 'long',
    marks: ['belly'],
    gen1b: ['beak'],
    heads: { count: 2, neck: 1, spread: 40, sizes: [1, 1], faces: 'full' },
  }),
  tristrut: spec(STRUT, {
    size: 1.1,
    legs: 'long',
    arms: 'none',
    tail: 'stub',
    marks: ['belly'],
    eyes: 'angry',
    gen1b: ['beak'],
    heads: { count: 3, neck: 1, spread: 100, sizes: [1, 1, 1], faces: 'full' },
  }),
  // ---- floe seals ----
  floepup: spec(SEAL, { ...ORB, size: 0.9, crest: 'horn', gen1b: ['fishTail'] }),
  floeglide: spec(SEAL, {
    plan: 'serpent',
    size: 1.15,
    crest: 'horn',
    legs: 'none',
    arms: 'none',
    gen1b: ['fishTail'],
  }),
  // ---- sludge ----
  gloplet: spec(SLUDGE, { plan: 'slug', size: 0.9, marks: ['spots'], gen1b: ['floatHands'] }),
  glopheap: spec(SLUDGE, {
    plan: 'slug',
    size: 1.25,
    marks: ['spots'],
    eyes: 'angry',
    gen1b: ['floatHands'],
  }),
  // ---- clams ----
  clamlet: spec(pal(C.dusk, C.ink, C.lilacGrey, C.violet, C.moonPurple, C.white), {
    ...ORB,
    size: 0.8,
    gen1b: ['shellPair', 'tongue'],
  }),
  clamfort: spec(pal(C.dusk, C.ink, C.lilacGrey, C.moonPurple, C.lavender, C.white), {
    ...ORB,
    size: 1.1,
    crest: 'horn',
    eyes: 'angry',
    gen1b: ['shellPair'],
  }),
  // ---- ghosts ----
  spooklet: spec(pal(C.plum, C.darkPlum, C.dusk, C.violet, C.lavender), {
    ...ORB,
    size: 0.8,
    eyes: 'angry',
    gen1b: ['gas', 'grin', 'float'],
  }),
  spookhand: spec(pal(C.violet, C.moonPurple, C.lavender, C.violet, C.ink), {
    ...ORB,
    size: 0.95,
    crest: 'spikesTop',
    tail: 'stub',
    eyes: 'angry',
    gen1b: ['ghostHands', 'grin', 'float'],
  }),
  spookgrin: spec(pal(C.violet, C.moonPurple, C.lavender, C.violet, C.ember), {
    irisColor: '#d8202a',
    size: 1.1,
    ears: 'catTips',
    crest: 'spikesTop',
    tail: 'stub',
    eyes: 'angry',
    gen1b: ['grin'],
  }),
  // ---- rock snake ----
  boulderwyrm: spec(pal(C.lilacGrey, C.dusk, C.pale, C.dusk, C.plum), {
    plan: 'serpent',
    size: 1.2,
    crest: 'horn',
    eyes: 'angry',
    legs: 'none',
    arms: 'none',
    gen1b: ['boulders'],
  }),
  // ---- dream eaters ----
  dozetrunk: spec(pal(C.sunYellow, C.orange, C.cream, C.bark, C.bark), {
    ears: 'round',
    eyes: 'closed',
    gen1b: ['lowerHalf', 'snout'],
  }),
  dozeswing: spec(pal(C.sunYellow, C.orange, C.white, C.bark, C.bark), {
    plan: 'tall',
    size: 1.15,
    ears: 'catTips',
    eyes: 'angry',
    arms: 'long',
    legs: 'long',
    gen1b: ['ruff', 'snout', 'pendulum'],
  }),
  // ---- crabs ----
  pinchlet: spec(CRAB, {
    plan: 'round',
    size: 0.85,
    arms: 'none',
    eyes: 'stalk',
    gen1b: ['lowerHalf', 'pincers'],
  }),
  pinchking: spec(CRAB, {
    plan: 'round',
    size: 1.1,
    arms: 'none',
    crest: 'spikesTop',
    eyes: 'angry',
    gen1b: ['lowerHalf', 'bigPincer'],
  }),
  // ---- spark balls ----
  sparkorb: spec(pal(C.ember, C.berry, C.white, C.ember, C.white), {
    ...ORB,
    size: 0.85,
    eyes: 'angry',
    gen1b: ['lowerHalf'],
  }),
  fizzorb: spec(pal(C.white, C.lilacGrey, C.white, C.ember, C.ember), {
    ...ORB,
    size: 1.05,
    eyes: 'angry',
    gen1b: ['lowerHalf', 'grin'],
  }),
  // ---- seed clutch and palm ----
  seedclutch: spec(pal(C.blush, C.rose, C.cream, C.ink, C.rose), {
    ...ORB,
    size: 0.7,
    heads: {
      count: 6,
      neck: 0,
      spread: 0,
      sizes: [1, 1, 1, 1, 1, 1],
      faces: 'full',
      cluster: true,
    },
  }),
  palmtrio: spec(pal(C.sand, C.sandDeep, C.cream, C.leaf, C.bark), {
    plan: 'tall',
    size: 1.2,
    eyes: 'angry',
    gen1b: ['palm', 'lowerHalf'],
    heads: { count: 3, neck: 0.3, spread: 150, sizes: [1, 1, 1], faces: 'full' },
  }),
  // ---- bone keepers ----
  bonecap: spec(BONE, { size: 0.9, tail: 'stub', marks: ['belly'], gen1b: ['skull', 'bone'] }),
  boneguard: spec(BONE, {
    size: 1.1,
    tail: 'stub',
    eyes: 'angry',
    marks: ['belly'],
    gen1b: ['skull', 'bone'],
  }),
  // ---- the licker ----
  lickalot: spec(pal(C.blush, C.rose, C.cream, C.rose, C.cream), {
    size: 1.1,
    tail: 'long',
    marks: ['belly', 'stripes'],
    gen1b: ['tongue'],
  }),
  // ---- smog ----
  smogpuff: spec(SMOG, { ...ORB, size: 0.9, eyes: 'angry', marks: ['spots'], gen1b: ['aura'] }),
  smogtwin: spec(SMOG, {
    ...ORB,
    size: 1.05,
    eyes: 'angry',
    marks: ['spots'],
    gen1b: ['aura'],
    heads: { count: 2, neck: 0, spread: 60, sizes: [1, 0.8], faces: 'full' },
  }),
  // ---- horned rocks ----
  rockhorn: spec(RHINO, {
    size: 0.95,
    crest: 'horn',
    tail: 'club',
    eyes: 'angry',
    marks: ['stripes'],
  }),
  drillhorn: spec(RHINO, {
    size: 1.2,
    crest: 'horn',
    tail: 'long',
    arms: 'claws',
    eyes: 'angry',
    marks: ['belly', 'stripes'],
  }),
  // ---- singles ----
  eggtender: spec(pal(C.blush, C.rose, C.pale, C.rose, C.white), {
    plan: 'round',
    size: 1,
    ears: 'round',
    tail: 'stub',
    gen1b: ['pouchEgg'],
  }),
  tanglet: spec(pal(C.water, C.deepWater, C.skyLight, C.skyDeep, C.ember), {
    plan: 'round',
    size: 0.95,
    arms: 'none',
    gen1b: ['vines'],
  }),
  pouchmum: spec(pal(C.bark, C.darkBark, C.sand, C.sand, C.wood), {
    plan: 'tall',
    size: 1.2,
    ears: 'catTips',
    tail: 'long',
    arms: 'long',
    eyes: 'angry',
    marks: ['belly'],
    gen1b: ['pouchBaby'],
  }),
  // ---- sea horses ----
  snoutling: spec(pal(C.skyLight, C.water, C.cream, C.white, C.water), {
    plan: 'stalk',
    size: 0.85,
    ears: 'fins',
    tail: 'curl',
    eyes: 'cute',
    marks: ['belly'],
    gen1b: ['snout'],
  }),
  snoutspine: spec(pal(C.water, C.deepWater, C.cream, C.skyLight, C.water), {
    plan: 'stalk',
    size: 1.1,
    ears: 'fins',
    crest: 'spikesTop',
    tail: 'curl',
    eyes: 'angry',
    gen1b: ['snout'],
  }),
  // ---- horned fish ----
  silkfin: spec(KOI, {
    ...ORB,
    size: 0.85,
    ears: 'fins',
    crest: 'horn',
    eyes: 'cute',
    marks: ['spots'],
    gen1b: ['fishTail'],
  }),
  hornfin: spec(pal(C.orange, C.ember, C.white, C.ember, C.cream), {
    ...ORB,
    size: 1.1,
    ears: 'fins',
    crest: 'horn',
    eyes: 'angry',
    marks: ['spots'],
    gen1b: ['fishTail'],
  }),
  // ---- stars ----
  corestar: spec(pal(C.wood, C.bark, C.sand, C.sunYellow, C.ember), {
    ...ORB,
    size: 0.7,
    gen1b: ['star5', 'gem'],
  }),
  prismstar: spec(pal(C.violet, C.moonPurple, C.lavender, C.sunYellow, C.ember), {
    ...ORB,
    size: 0.8,
    gen1b: ['star10', 'gem'],
  }),
  // ---- mime, mantis, beetle, bull ----
  wallmime: spec(pal(C.white, C.lilacGrey, C.blush, C.rose, C.water), {
    crest: 'twinHorns',
    arms: 'boxing',
    eyes: 'big',
    marks: ['cheeks', 'belly'],
  }),
  sicklewing: spec(pal(C.leaf, C.forest, C.cream, C.sprout, C.cream), {
    size: 1.05,
    wings: 'small',
    arms: 'none',
    legs: 'long',
    eyes: 'angry',
    marks: ['belly'],
    gen1b: ['scythes'],
  }),
  pinchbeetle: spec(pal(C.bark, C.darkBark, C.sand, C.ink, C.pale), {
    size: 1.05,
    arms: 'claws',
    eyes: 'angry',
    marks: ['stripes'],
    gen1b: ['pincerHead'],
  }),
  stampbull: spec(pal(C.wood, C.bark, C.sand, C.lilacGrey, C.darkBark), {
    size: 1.1,
    ears: 'horns',
    tail: 'spiky',
    eyes: 'angry',
    marks: ['belly'],
  }),
  // ---- carp and sea dragon ----
  flopfish: spec(pal(C.orange, C.ember, C.cream, C.cream, C.sunYellow), {
    ...ORB,
    size: 0.85,
    ears: 'fins',
    crest: 'spikesTop',
    eyes: 'big',
    gen1b: ['fishTail', 'barbels'],
  }),
  stormwyrm: spec(pal(C.water, C.deepWater, C.cream, C.white, C.cream), {
    plan: 'serpent',
    size: 1.25,
    ears: 'fins',
    crest: 'twinHorns',
    eyes: 'angry',
    legs: 'none',
    arms: 'none',
    gen1b: ['fishTail', 'barbels'],
  }),
  // ---- rare ones ----
  ferrysong: spec(pal(C.water, C.deepWater, C.cream, C.lilacGrey, C.pale), {
    plan: 'serpent',
    size: 1.15,
    ears: 'catTips',
    crest: 'horn',
    eyes: 'cute',
    legs: 'none',
    arms: 'none',
    marks: ['belly'],
    gen1b: ['backShell'],
  }),
  copyblob: spec(pal(C.lavender, C.violet, C.lavender, C.violet, C.violet), {
    plan: 'slug',
    size: 1.05,
  }),
  snoozelump: spec(pal(C.deepWater, C.nightBlue, C.cream, C.cream, C.white), {
    plan: 'round',
    size: 1.2,
    ears: 'catTips',
    eyes: 'closed',
    marks: ['chest'],
  }),
  // ---- the fluff kit and its three stones ----
  fluffkit: spec(pal(C.wood, C.bark, C.cream, C.rose, C.cream), {
    size: 0.9,
    ears: 'tallPointed',
    tail: 'ball',
    eyes: 'big',
    gen1b: ['ruff'],
  }),
  tidefox: spec(pal(C.skyLight, C.water, C.white, C.deepWater, C.deepWater), {
    size: 1.05,
    ears: 'fins',
    eyes: 'big',
    gen1b: ['ruff', 'fishTail'],
  }),
  sparkfox: spec(pal(C.sunYellow, C.orange, C.white, C.sunYellow, C.white), {
    size: 1.05,
    ears: 'tallPointed',
    crest: 'spikesTop',
    tail: 'spiky',
    eyes: 'big',
    gen1b: ['spikeRuff'],
  }),
  flarefox: spec(pal(C.orange, C.ember, C.sunLight, C.sunYellow, C.cream), {
    size: 1.05,
    ears: 'tallPointed',
    crest: 'forelock',
    tail: 'ball',
    eyes: 'big',
    gen1b: ['ruff'],
  }),
  facetbird: spec(pal(C.blush, C.rose, C.water, C.water, C.white), {
    size: 0.95,
    arms: 'none',
    tail: 'stub',
    eyes: 'big',
    marks: ['belly'],
    gen1b: ['beak'],
  }),
  // ---- the three plume birds ----
  frostplume: spec(pal(C.skyLight, C.water, C.shallows, C.deepWater, C.skyDeep), {
    size: 1.1,
    wings: 'feather',
    crest: 'spikesTop',
    tail: 'long',
    legs: 'long',
    arms: 'none',
    eyes: 'angry',
    gen1b: ['beak'],
  }),
  boltplume: spec(pal(C.sunYellow, C.orange, C.cream, C.orange, C.sunYellow), {
    size: 1.1,
    wings: 'bat',
    crest: 'spikesTop',
    tail: 'spiky',
    legs: 'long',
    arms: 'none',
    eyes: 'angry',
    gen1b: ['beak'],
  }),
  blazeplume: spec(pal(C.sunYellow, C.orange, C.orange, C.ember, C.orange), {
    size: 1.1,
    wings: 'feather',
    crest: 'flame',
    tail: 'flame',
    legs: 'long',
    arms: 'none',
    eyes: 'angry',
    gen1b: ['beak'],
  }),
  // ---- ribbon wyrms ----
  wyrmlet: spec(pal(C.skyLight, C.water, C.white, C.white, C.white), {
    plan: 'serpent',
    size: 0.9,
    ears: 'fins',
    eyes: 'cute',
    legs: 'none',
    arms: 'none',
    marks: ['belly'],
  }),
  ribbonwyrm: spec(pal(C.water, C.deepWater, C.white, C.white, C.white), {
    plan: 'serpent',
    size: 1.1,
    ears: 'fins',
    crest: 'horn',
    eyes: 'cute',
    legs: 'none',
    arms: 'none',
    marks: ['belly'],
    gen1b: ['pearl'],
  }),
  hugwyrm: spec(pal(C.orange, C.ember, C.sunLight, C.orange, C.teal), {
    size: 1.25,
    wings: 'small',
    crest: 'antenna',
    tail: 'long',
    eyes: 'cute',
    marks: ['belly'],
  }),
  // ---- the psychic pair ----
  psyclone: spec(pal(C.pale, C.lilacGrey, C.violet, C.violet, C.violet), {
    irisColor: '#7a3ac0',
    plan: 'tall',
    size: 1.15,
    ears: 'catTips',
    tail: 'long',
    arms: 'long',
    legs: 'long',
    eyes: 'angry',
    marks: ['belly'],
  }),
  whimsy: spec(pal(C.blush, C.rose, C.pale, C.rose, C.skyDeep), {
    plan: 'round',
    size: 0.8,
    ears: 'catTips',
    tail: 'long',
    eyes: 'big',
  }),
};
