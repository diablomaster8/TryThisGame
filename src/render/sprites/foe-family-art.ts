import { FOE_FAMILIES, type FoeFamilyDef } from '../../config/dungeon-foes';
import type { CreaturePalette, CreatureSpec } from './creature';
import { ex } from './creature-extras';
import { C } from './palette';

/**
 * The Hollow's foe families in their own looks (R0157, DUNG-17, lane B r10): rascally
 * wildlife drawn by the generic creature drawer, so each family gets the drawer's five angles
 * (mirrored for the other three), its idle, walk and hit clips, and a 3D sculpt from the same
 * recipe. A family's art id is `foe:<family id>`; an Act V Greyling's is `foe:grey-<id>`, the
 * same recipe colour-drained. Both renderers build each id once (the Pixel sheet cache, the
 * 3D look cache `art:foe:<id>`), never per frame. The family's battle stats still come from
 * its `look` species in `dungeon-foes.ts`; only the drawing is its own.
 */
export const FOE_ART_PREFIX = 'foe:';

const pal = (
  body: number,
  shade: number,
  belly: number,
  accent: number,
  accent2: number,
  eye: number = C.ink,
): CreaturePalette => ({ body, shade, belly, accent, accent2, eye, outline: C.darkPlum });

const spec = (colors: CreaturePalette, over: Partial<CreatureSpec>): CreatureSpec => ({
  plan: 'round',
  size: 0.85,
  ears: 'none',
  tail: 'none',
  crest: 'none',
  wings: 'none',
  arms: 'stub',
  legs: 'stub',
  eyes: 'cute',
  marks: [],
  colors,
  ...over,
});

/** One recipe per family, by family id. Silhouette first, colour second. */
export const FOE_ART: Readonly<Record<string, CreatureSpec>> = {
  // ---- Act I, the Rootways: a cave's small residents.
  grubble: spec(pal(C.sandLight, C.sand, C.cream, C.leaf, C.bark), {
    plan: 'slug',
    size: 0.8,
    eyes: 'big',
    marks: ['stripes'],
    addons: [ex('antennae', C.bark, C.leaf), ex('buckTeeth', C.white)],
  }),
  sporepuff: spec(pal(C.cream, C.sand, C.white, C.berry, C.white), {
    size: 0.8,
    arms: 'none',
    legs: 'none',
    move: 'hop',
    marks: ['cheeks'],
    addons: [ex('cap', C.berry, C.white)],
  }),
  batling: spec(pal(C.violet, C.moonPurple, C.lavender, C.sunYellow, C.bark), {
    size: 0.8,
    ears: 'tallPointed',
    wings: 'bat',
    arms: 'none',
    legs: 'long',
    // Goggles: a band across the eyes in the accent colour.
    marks: ['eyeMask'],
  }),
  rockhermit: spec(pal(C.sand, C.sandDeep, C.cream, C.greyLight, C.greyDeep), {
    plan: 'shell',
    size: 0.85,
    eyes: 'stalk',
    arms: 'claws',
    addons: [ex('backShell', C.greyLight, C.greyDeep), ex('rocks', C.greyDeep)],
  }),
  // ---- Act II, the Cloister Gardens: garden folk.
  helmhog: spec(pal(C.wood, C.bark, C.sandLight, C.greyLight, C.greyDeep), {
    size: 0.85,
    ears: 'round',
    crest: 'helmet',
    eyes: 'dot',
    addons: [ex('backSpikes', C.darkBark, C.bark), ex('snout', C.darkBark)],
  }),
  gnomelet: spec(pal(C.blush, C.roseLight, C.cream, C.berry, C.white), {
    plan: 'biped',
    size: 0.8,
    eyes: 'dot',
    marks: ['cheeks'],
    addons: [ex('plume', C.berry, C.roseDeep), ex('moustache', C.white)],
  }),
  lanternmoth: spec(pal(C.cream, C.sandLight, C.sunLight, C.lavender, C.violet), {
    size: 0.8,
    arms: 'none',
    legs: 'none',
    marks: ['belly'],
    addons: [ex('insectWings', C.lavender, C.violet), ex('antennae', C.violet, C.sunYellow)],
  }),
  ivyimp: spec(pal(C.leaf, C.forest, C.leafLight, C.rose, C.sprout), {
    plan: 'biped',
    size: 0.8,
    ears: 'catTips',
    tail: 'spiky',
    eyes: 'big',
    marks: ['stripes'],
    addons: [ex('leafTuft', C.sprout, C.leafDeep, 3)],
  }),
  // ---- Act III, the Dunes: desert scamps.
  dunemouse: spec(pal(C.sandLight, C.sand, C.cream, C.rose, C.bark), {
    size: 0.8,
    ears: 'roundBig',
    tail: 'long',
    eyes: 'big',
    addons: [ex('whiskers', C.bark)],
  }),
  scarablet: spec(pal(C.teal, C.tealDeep, C.mint, C.sunYellow, C.tealLight), {
    plan: 'shell',
    size: 0.8,
    crest: 'horn',
    arms: 'none',
    eyes: 'dot',
    addons: [ex('gems', C.sunYellow)],
  }),
  tumbleweed: spec(pal(C.wood, C.bark, C.sand, C.sandDeep, C.darkBark), {
    size: 0.85,
    arms: 'none',
    legs: 'none',
    move: 'hop',
    eyes: 'dot',
    marks: ['spots'],
    addons: [ex('hairs', C.bark), ex('swirl', C.darkBark)],
  }),
  sandsprite: spec(pal(C.sunLight, C.sunYellow, C.cream, C.orange, C.white), {
    size: 0.75,
    legs: 'none',
    wings: 'small',
    marks: ['star'],
    addons: [ex('flowers', C.orange, C.white)],
  }),
  // ---- Act IV, the Frost Halls: snow critters.
  penguinling: spec(pal(C.nightBlue, C.ink, C.white, C.orange, C.sunYellow), {
    size: 0.85,
    wings: 'small',
    arms: 'none',
    marks: ['belly'],
    addons: [ex('beak', C.orange)],
  }),
  snowgolem: spec(pal(C.white, C.pale, C.white, C.orange, C.greyDeep), {
    size: 0.9,
    arms: 'stub',
    legs: 'none',
    eyes: 'dot',
    // A carrot nose and pebble buttons.
    addons: [ex('nose', C.orange), ex('rocks', C.greyDeep), ex('bucketHat', C.skyDeep, C.skyLight)],
  }),
  frostferret: spec(pal(C.pale, C.lilacGrey, C.white, C.dusk, C.skyLight), {
    plan: 'biped',
    size: 0.8,
    ears: 'round',
    tail: 'long',
    eyes: 'dot',
    // The ferret's mask.
    marks: ['eyeMask'],
    addons: [ex('whiskers', C.dusk)],
  }),
  icejelly: spec(pal(C.skyLight, C.shallows, C.white, C.lavender, C.white), {
    size: 0.8,
    arms: 'tentacles',
    legs: 'none',
    crest: 'dome',
    move: 'hop',
    marks: ['cheeks'],
  }),
};

/**
 * A palette index's grey: Act V's cold takes the colour, keeping each colour's lightness so
 * the family still reads by its shape and shading.
 */
const GREY_OF: Readonly<Partial<Record<number, number>>> = {
  [C.white]: C.pale,
  [C.cream]: C.pale,
  [C.pale]: C.greyLight,
  [C.sandLight]: C.greyLight,
  [C.sunLight]: C.greyLight,
  [C.skyLight]: C.greyLight,
  [C.leafLight]: C.greyLight,
  [C.lavender]: C.lilacGrey,
  [C.mint]: C.lilacGrey,
  [C.blush]: C.lilacGrey,
  [C.roseLight]: C.lilacGrey,
  [C.shallows]: C.lilacGrey,
  [C.ink]: C.ink,
  [C.darkPlum]: C.darkPlum,
  [C.nightBlue]: C.dusk,
  [C.darkBark]: C.dusk,
  [C.greyDeep]: C.greyDeep,
};

const grey = (i: number): number => GREY_OF[i] ?? (i === C.greyLight ? C.greyLight : C.greyDeep);

/** A recipe colour-drained: every colour to its grey (the eyes and outline keep theirs). */
export function greyRecipe(s: CreatureSpec): CreatureSpec {
  const c = s.colors;
  return {
    ...s,
    colors: {
      body: grey(c.body),
      shade: grey(c.shade),
      belly: grey(c.belly),
      accent: grey(c.accent),
      accent2: grey(c.accent2),
      eye: c.eye,
      outline: c.outline,
    },
    ...(s.addons
      ? {
          addons: s.addons.map((e) => ({
            ...e,
            ...(e.c !== undefined ? { c: grey(e.c) } : {}),
            ...(e.c2 !== undefined ? { c2: grey(e.c2) } : {}),
          })),
        }
      : {}),
  };
}

const greyCache = new Map<string, CreatureSpec>();

/** The recipe for `foe:<id>` or `foe:grey-<id>`, or undefined for an unknown family. */
export function foeArt(artId: string): CreatureSpec | undefined {
  const id = artId.slice(FOE_ART_PREFIX.length);
  if (!id.startsWith('grey-')) return FOE_ART[id];
  let hit = greyCache.get(id);
  const base = FOE_ART[id.slice('grey-'.length)];
  if (!hit && base) greyCache.set(id, (hit = greyRecipe(base)));
  return hit;
}

/** Each act's families by the species they borrow, for `foeArtId` (built once). */
const BY_LOOK = new Map<string, FoeFamilyDef>(FOE_FAMILIES.map((f) => [f.look, f]));

/**
 * The art id a pack member draws with: its family's own look when the member is one of the
 * act families (a stray of another family keeps that family's look), Greyling-drained on a
 * grey pack; any other species (the Deep Hollow's babies, the boss) draws as itself.
 */
export function foeArtId(
  pack: { family: string; grey?: true | undefined },
  species: string,
): string {
  const fam = BY_LOOK.get(species);
  if (!fam || pack.family === 'boss') return species;
  return `${FOE_ART_PREFIX}${pack.grey ? 'grey-' : ''}${fam.id}`;
}
