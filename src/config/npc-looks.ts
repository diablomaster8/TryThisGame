import type { TrainerLook } from '../sim/trainers';
import { C } from '../render/sprites/palette';
import type { SceneStage, StageCast } from './story';
import { CG4_B4 } from './tuning-b4';

/**
 * H12, M1, C2: one silhouette prop per named person, so the cast reads apart at a distance
 * (the Scarlet/Violet rule) and a portrait never depends on colour alone. Both renderers
 * read this table: the pixel Keeper sheet draws the accessory on its 32 px grid
 * (render/sprites/keeper.ts), the 3D Keeper rig gets prims (render3d/npc-accessories.ts).
 * Corvin's grey coat differs in shape (a long flare), not only in grey. Colours are hex,
 * for the 3D prims; the pixel drawer maps them to palette indices (`pal`, else its own).
 */
export type NpcAccessory =
  | 'coat'
  | 'bucket'
  | 'satchel'
  | 'shawl'
  // M1: Hazel's other Keepers.
  | 'goggles'
  | 'basket'
  | 'headphones'
  | 'scarf'
  | 'apron'
  | 'cap'
  | 'widehat'
  | 'sling'
  // C2: the storylines' speakers.
  | 'notebook'
  | 'bloom'
  | 'cloak'
  | 'scroll'
  | 'broom'
  | 'pack'
  | 'visor'
  | 'backpack'
  | 'antenna';

export interface NpcLook {
  accessory: NpcAccessory;
  /** Body scale; below 1 for Hazel in chapter 11 (smaller, and older). */
  scale?: number;
  /** Main and trim colour of the accessory (3D). */
  main: string;
  trim: string;
  /** Pixel palette indices for the accessory's main and trim, where the drawer takes them. */
  pal?: readonly [number, number];
  /** M13: two darker patches on the sleeves, at the elbows. */
  patches?: boolean;
  /** K38: a static stoop (share of height lost); the pose itself is drawn by package a1. */
  stoop?: number;
  /** K38: she leans on a stick (drawn by package b4's dressings). */
  stick?: boolean;
}

export const NPC_LOOKS: Readonly<Record<string, NpcLook>> = {
  corvin: { accessory: 'coat', main: '#6a707a', trim: '#454a54' },
  marina: { accessory: 'bucket', main: '#9a6a3c', trim: '#5a3c22' },
  fern: { accessory: 'satchel', main: '#b98a52', trim: '#6e4a2a' },
  hazel: { accessory: 'shawl', scale: 0.88, main: '#9a6aa6', trim: '#d9b8dc', patches: true },
  // M1: eight more outlines.
  sparks: { accessory: 'goggles', main: '#3a3444', trim: '#58b8ff' },
  clover: { accessory: 'basket', main: '#b98a52', trim: '#e86a8c' },
  pixel: { accessory: 'headphones', main: '#d94a7a', trim: '#2c2433' },
  luna: { accessory: 'scarf', main: '#7a5ab8', trim: '#c8b6f0' },
  ember: { accessory: 'apron', main: '#e0562e', trim: '#7a2c1c', pal: [C.ember, C.darkBark] },
  byte: { accessory: 'cap', main: '#2c2433', trim: '#5ad0a0' },
  dusty: { accessory: 'widehat', main: '#b99a62', trim: '#6e4a2a' },
  nova: { accessory: 'sling', main: '#2f8a86', trim: '#ffd166' },
};

/** A storyline speaker's look: the person's palette (a trainer look) and their accessory. */
export interface StoryNpcLook extends NpcLook {
  trainer: TrainerLook;
}

const person = (over: Partial<TrainerLook>): TrainerLook => ({
  skin: C.sand,
  hat: C.cream,
  hatBand: C.orange,
  shirt: C.sunYellow,
  shirtShade: C.orange,
  pants: C.teal,
  boots: C.bark,
  hair: C.wood,
  outline: C.darkPlum,
  hatStyle: 'none',
  ...over,
});

/**
 * C2: the ten storyline speakers (the ids of the SPEAKERS arrays in src/content/storyline-*.ts).
 * Each has a hair, hat, coat and palette of their own and an accessory shape no other speaker
 * shares (Ember and Hob both wear aprons, in different colours and in different stories).
 * content-check fails a speaker with no entry here.
 */
export const STORY_NPC_LOOKS: Readonly<Record<string, StoryNpcLook>> = {
  // The Beetle Road: Hob's apron, Vane's notebook.
  'b-hob': {
    accessory: 'apron',
    main: '#c9b48a',
    trim: '#6a4a2a',
    pal: [C.sandLight, C.bark],
    trainer: person({
      skin: C.wood,
      shirt: C.bark,
      shirtShade: C.darkBark,
      pants: C.darkBark,
      boots: C.ink,
      hair: C.lilacGrey,
      hat: C.wood,
      hatBand: C.orange,
      hatStyle: 'cap',
    }),
  },
  'b-vane': {
    accessory: 'notebook',
    main: '#b8365a',
    trim: '#f3ead2',
    trainer: person({
      skin: C.sand,
      shirt: C.teal,
      shirtShade: C.tealDeep,
      pants: C.nightBlue,
      boots: C.darkBark,
      hair: C.plum,
      hat: C.sunYellow,
      hatBand: C.sunYellow,
      hatStyle: 'band',
    }),
  },
  // Dawn & Dusk: the twins who keep the houses, and the scholar at the shrine.
  'd-marigold': {
    accessory: 'bloom',
    main: '#ffc832',
    trim: '#e8741e',
    trainer: person({
      skin: C.sand,
      shirt: C.sunYellow,
      shirtShade: C.orange,
      pants: C.forest,
      boots: C.bark,
      hair: C.orange,
    }),
  },
  'd-ash': {
    accessory: 'cloak',
    main: '#5a3c8c',
    trim: '#ffd166',
    trainer: person({
      skin: C.sand,
      shirt: C.moonPurple,
      shirtShade: C.darkPlum,
      pants: C.nightBlue,
      boots: C.ink,
      hair: C.ink,
      hat: C.plum,
      hatBand: C.violet,
      hatStyle: 'hood',
    }),
  },
  'd-vask': {
    accessory: 'scroll',
    main: '#f3ead2',
    trim: '#6a4a2a',
    trainer: person({
      skin: C.wood,
      shirt: C.forest,
      shirtShade: C.deepGreen,
      pants: C.darkBark,
      boots: C.ink,
      hair: C.lilacGrey,
      hat: C.leaf,
      hatBand: C.leafLight,
      hatStyle: 'beanie',
    }),
  },
  // The Hundred Days: Ida's broom, Sorrel's tinker's pack.
  'h-ida': {
    accessory: 'broom',
    main: '#8a5a32',
    trim: '#d8b872',
    trainer: person({
      skin: C.sand,
      shirt: C.lavender,
      shirtShade: C.violet,
      pants: C.bark,
      boots: C.darkBark,
      hair: C.pale,
      hat: C.cream,
      hatBand: C.rose,
      hatStyle: 'sun',
    }),
  },
  'h-sorrel': {
    accessory: 'pack',
    main: '#7a5232',
    trim: '#b0b6c0',
    trainer: person({
      skin: C.wood,
      shirt: C.orange,
      shirtShade: C.ember,
      pants: C.darkBark,
      boots: C.bark,
      hair: C.berry,
      hat: C.rose,
      hatBand: C.sunYellow,
      hatStyle: 'band',
    }),
  },
  // Logged In: the moderator's visor, the eleven-year-old's backpack, the Root's antenna.
  'l-warden': {
    accessory: 'visor',
    main: '#58c8f0',
    trim: '#2c3a58',
    trainer: person({
      skin: C.sand,
      shirt: C.nightBlue,
      shirtShade: C.skyDeep,
      pants: C.ink,
      boots: C.ink,
      hair: C.ink,
    }),
  },
  'l-juno': {
    accessory: 'backpack',
    scale: 0.84,
    main: '#d94a7a',
    trim: '#ffd166',
    trainer: person({
      skin: C.wood,
      shirt: C.mint,
      shirtShade: C.teal,
      pants: C.skyDeep,
      boots: C.white,
      hair: C.darkBark,
      hat: C.berry,
      hatBand: C.sunYellow,
      hatStyle: 'beanie',
    }),
  },
  'l-root': {
    accessory: 'antenna',
    main: '#e8f4ff',
    trim: '#5ad0a0',
    trainer: person({
      skin: C.pale,
      shirt: C.white,
      shirtShade: C.lilacGrey,
      pants: C.pale,
      boots: C.lilacGrey,
      hair: C.white,
    }),
  },
};

/** The storyline speaker ids that have a look. */
export const STORY_SPEAKER_IDS: readonly string[] = Object.keys(STORY_NPC_LOOKS);

/**
 * K4, K38: looks that exist only in the story and are chosen by `storyId`. They are in no
 * trainer picker and match no selectable trainer's look (content-check fails one that does).
 * Fern's wears a satchel, a flat band cap in green and a rose scarf at the collar; Hazel's
 * two ages are the young one of the tales and the stooped one with a stick (chapter 11 on).
 */
export const STORY_ONLY_LOOKS: Readonly<Record<string, StoryNpcLook>> = {
  'fern-story': {
    accessory: 'satchel',
    main: '#7a8a52',
    trim: '#d94a7a',
    pal: [C.leaf, C.rose],
    trainer: person({
      skin: C.sand,
      hat: C.forest,
      hatBand: C.rose,
      shirt: C.leaf,
      shirtShade: C.rose,
      pants: C.bark,
      boots: C.darkBark,
      hair: C.wood,
      hatStyle: 'cap',
    }),
  },
  'young-hazel': {
    accessory: 'shawl',
    scale: CG4_B4.hazel.youngScale,
    main: '#b8b0a0',
    trim: '#e8e0d0',
    trainer: person({
      skin: C.sand,
      hat: C.cream,
      hatBand: C.cream,
      shirt: C.cream,
      shirtShade: C.sandLight,
      pants: C.bark,
      boots: C.darkBark,
      hair: C.darkBark,
      hatStyle: 'none',
    }),
  },
  'hazel-old': {
    accessory: 'shawl',
    scale: CG4_B4.hazel.oldScale,
    stoop: CG4_B4.hazel.oldStoop,
    stick: true,
    patches: true,
    main: '#9a6aa6',
    trim: '#d9b8dc',
    trainer: person({
      skin: C.sand,
      hat: C.cream,
      hatBand: C.blush,
      shirt: C.lavender,
      shirtShade: C.violet,
      pants: C.bark,
      boots: C.darkBark,
      hair: C.pale,
      hatStyle: 'sun',
    }),
  },
};

/**
 * What the story is showing, set each frame by package b4's dressing in whichever renderer
 * runs (as `WEATHERED`): a told tale (K11) and the campaign and chapter (K38).
 */
export const LOOK_STATE: {
  tale: boolean;
  campaign: string;
  chapter: number;
  /** The dialogue's line on screen and the scene's line count (K37 reads the last one). */
  line: number;
  lines: number;
} = {
  tale: false,
  campaign: 'hazel',
  chapter: 0,
  line: 0,
  lines: 0,
};

/**
 * K4, K38: the look id to draw a person as in the story world, portraits and the stage:
 * Fern in her own story look (never the Gardener's), Hazel young in a tale, and stooped
 * with a stick from chapter 11. Anyone else is drawn as themselves. The trainer picker
 * and the player's own Keeper never go through this, so the Gardener stays the Gardener.
 */
export function storyId(who: string): string {
  if (who === 'fern') return 'fern-story';
  if (who !== 'hazel') return who;
  if (LOOK_STATE.tale) return 'young-hazel';
  return LOOK_STATE.campaign === 'hazel' && LOOK_STATE.chapter >= CG4_B4.hazel.oldFromChapter
    ? 'hazel-old'
    : who;
}

/** A trainer's or storyline speaker's accessory look, or undefined. */
export const npcLookOf = (who: string): NpcLook | undefined =>
  NPC_LOOKS[who] ?? STORY_NPC_LOOKS[who] ?? STORY_ONLY_LOOKS[who];

/**
 * C6: the Nubbins drawn weathered grey (Moss while he is "the grey shape", or any cast entry
 * with `tint: 'weathered'`). The dressings set it each frame; both renderers' look keys read
 * it, so the colour comes back in one step when the set empties.
 */
export const WEATHERED: { ids: ReadonlySet<string> } = { ids: new Set() };

/** The stage's cast entries who carry a lantern. */
export function lanternCarriers(stage: SceneStage | null | undefined): StageCast[] {
  return (stage?.cast ?? []).filter((c) => c.carry === 'lantern');
}

/** Whether the stage seats the Nubbin `nubbinId` (M6): only Moss, on a `pose: 'sit'` entry. */
export function nubbinSits(
  stage: SceneStage | null | undefined,
  mossId: string | null | undefined,
  nubbinId: string,
): boolean {
  if (!mossId || nubbinId !== mossId) return false;
  return (stage?.cast ?? []).some((c) => c.who === 'moss' && c.pose === 'sit');
}
