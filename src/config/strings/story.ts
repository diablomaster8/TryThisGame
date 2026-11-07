// Storylines, props, the atlas, title cards and story UI.
import { fmt } from '../icu';
import { MESSAGES_EN } from '../messages-en';

/** The separate campaigns (sim/storyline.ts): title picks, journal buttons, areas. */
export const STORYLINE_TEXT = {
  chooseSide: 'Which side of the day?',
  sides: { dawn: 'Dawn', dusk: 'Dusk' } as Record<string, string>,
  sideHelp: {
    dawn: 'The Sun Keepers’ half. Four families to serve, a dojo to climb, a mystery from the bright side.',
    dusk: 'The Moon Keepers’ half. The same valley after dark, and the mystery from the other side.',
  } as Record<string, string>,
  locked: (other: string) => `Finish ${other} first.`,
  pathsHelp: (n: number) => fmt(MESSAGES_EN.pathsHelp, { n }),
  whereTo: 'Where to',
  here: 'Here',
  areas: {
    meadow: 'The meadow',
    shore: 'The shore',
    cave: 'The cave',
    mountain: 'The mountain',
    mire: 'The mire',
    mill: 'The old mill',
    day: 'Day Grove',
    night: 'Night Grove',
  } as Record<string, string>,
  actions: { bout: 'Fight a bout', fuse: 'Fuse the partners' } as Record<string, string>,
  arrived: (area: string) => fmt(MESSAGES_EN.arrived, { area: area.toLowerCase() }),
  degenerated: (name: string) => `${name} has gone back to an egg.`,
  restored: (name: string) => `${name} is grown again, and remembers.`,
} as const;

/** The side-story props, by id (sim/story-props.ts). */
export const STORY_PROP_NAMES: Record<string, string> = {
  'old-trowel': 'The old trowel',
  'hatch-register': 'Hazel’s hatch register',
  'hazels-lantern': 'Hazel’s lantern',
  'sunrise-shelf': 'The Sunrise Shelf',
  'flat-stone': 'The flat stone',
  'hazels-bench': 'Hazel’s bench',
  'corvins-chair': 'Corvin’s chair',
  'lantern-shed': 'The lantern shed',
  'old-barn': 'Hazel’s old barn',
  'walled-garden-door': 'The door in the Old Wall',
  'hush-bench': 'Hush’s bench',
};

/** Nova's atlas, Pixel's cabinet and the festivals their pages unlock (CV4, CV5). */
export const ATLAS_TEXT = {
  atlas: 'Nova’s atlas',
  atlasHelp: 'Each page is a story of its own. Read them in any order; the atlas remembers.',
  loading: 'Opening the atlas…',
  page: (title: string, done: number, total: number) => `${title} · ${done}/${total}`,
  read: 'Read on',
  doIt: 'Do it',
  finished: 'Finished',
  back: 'Back to the pages',
  noPages: 'The atlas has no pages you can read yet.',
  cabinet: 'Pixel’s cabinet',
  cabinetHelp: 'Pixel dragged it out of the Workyard skip. Each cartridge is a world of its own.',
  noCarts: 'No cartridge here suits this Grove’s settings.',
  carts: {
    PA1: 'The Chao Altar',
    PA2: 'The Clone Island',
    PA3: 'The Hollow Kingdom',
    PA4: 'Mercy',
    PA5: 'The Hundred-Year Sleep',
  } as Record<string, string>,
  rift: 'The rift',
  riftHelp:
    'The rift above the waterfall opens onto other worlds. Each line is a story of its own; the endgames wait for the lines they need.',
  noRift: 'The rift is closed. It opens with Mature content set to 18+.',
  mvLines: {
    IM: 'Iron Man',
    CA: 'Captain America',
    FF: 'Doom and the Fantastic Four',
    UL: 'Ultron',
    MK: 'Moon Knight',
    SP: 'Spawn',
    DB: 'Dragon Ball',
    TS: 'Toy Story',
    E: 'The Endgames',
  } as Record<string, string>,
  gate: 'The rainbow gate',
  gateHelp:
    'The rainbow gate by the pond opens onto Neopia. What you earn there stays there, with your Neo pet and your Neopia sandbox.',
  noGate: 'Nothing waits through the gate for this Grove yet.',
  neoLines: {
    NP: 'The Plots of Neopia',
    'NQ-faerie': 'Faerie Quests',
    'NQ-illusen': 'Illusen’s Glade',
    'NQ-jhudora': 'Jhudora’s Cloud',
    'NQ-kitchen': 'Kitchen Quests',
    'NQ-edna': 'Edna’s Tower',
    'NQ-wonders': 'Wonders of Neopia',
  } as Record<string, string>,
  waiting: 'The next story here waits for another line to finish first.',
  kept: (n: number) => `Kept in this world: ${n}`,
  fromAtlas: 'From the atlas',
  fromAtlasHelp: 'Pages you finished in Nova’s atlas.',
  festival: (name: string) => `A festival is ready in the Grove: ${name}.`,
  festivals: {
    remembering: 'The Night of Remembering',
    voyage: 'The Great Voyage',
    power: 'The Price of Power',
    longTable: 'The Long Table',
    highScore: 'High Score Night',
  } as Record<string, string>,
  pages: {
    A1: 'The Brothers’ Bargain',
    A2: 'The Monkey and the Monk',
    A3: 'Forty-Nine Days',
    A4: 'The Waterfall Prince',
    A5: 'The Lion of Mali',
    A6: 'Seven Voyages',
    A7: 'The Marigold Bridge',
    A8: 'The Twelve Tasks',
    A9: 'The Comet',
    A10: 'The Heart of the Island',
    A11: 'The Enchanted Place',
    A12: 'The Mirror Shard',
    A13: 'The Wooden Boy',
    A14: 'Homecoming',
    A15: 'The Humbug',
    A16: 'The Fox and the Rose',
    A17: 'The Camphor Tree',
    A18: 'The Doll in the Pocket',
    A19: 'The Dragon Who Fell',
    A20: 'The Weeping',
    A21: 'The Flower Field',
    A22: 'The Candle',
    A23: 'Remember Who You Are',
    A24: 'The Law of the Jungle',
    A25: 'The Nothing',
    A26: 'The Wall of Uruk',
    A27: 'The White-Haired Prince',
    A28: 'The Box of Stories',
    A29: 'The Honmoon',
    A30: 'The Word on the Brow',
    A31: 'The Hero Twins',
  } as Record<string, string>,
};

/** The Hollow minimap (`ui/hollow-map.ts`). */
export const HOLLOW_MAP_TEXT = {
  open: 'Map',
  you: 'You',
  down: 'Stairs down',
  up: 'Stairs up',
  chest: 'Chest',
  label: (floor: number) => `Map of floor ${floor}`,
} as const;

/** Chapter title cards and the campaigns' names for them (`ui/title-card.ts`, package f). */
export const TITLE_CARD_TEXT = {
  chapter: (n: number) => `Chapter ${n}`,
  /** Read by screen readers when a card shows. */
  announce: (campaign: string, n: number, title: string) => `${campaign}, chapter ${n}: ${title}`,
  campaigns: {
    hazel: 'Hazel’s Grove',
    hundred: 'The Hundred Days',
    logged: 'Logged In',
    beetle: 'The Beetle Road',
    dawn: 'Dawn & Dusk: First Light',
    dusk: 'Dawn & Dusk: Last Light',
  } as Record<string, string>,
  /** The scoreboard in Logged In's lobby. */
  scoreboard: { title: 'RANKS', rows: ['1  JUNO', '2  YOU', '3  ---', '4  ???'] },
} as const;

/** Story items, chapter postcards and chapter photos (campaign graphics 2, package u). */
export const STORY_UI_TEXT = {
  items: {
    letter: 'Hazel’s letter',
    notebook: 'Hazel’s notebook',
    stone: 'The stone',
    'vane-notebook': 'Vane’s notebook',
    recording: 'The recording',
  } as Record<string, string>,
  /** Screen readers: the card names its item. */
  itemAlt: (name: string) => `Close view: ${name}`,
  skipHint: 'Tap to begin',
  offerTitle: (n: number, title: string) => `Chapter ${n}: ${title}`,
  offerText: 'Keep a photo of this moment?',
  offerYes: 'Take photo',
  offerNo: 'Not now',
  chapterPhoto: 'Chapter photo',
  nubbinPhoto: 'Nubbin photo',
  chapterPhotoHelp: 'A keepsake of the chapter, as the scene stood.',
} as const;

/** Campaign graphics 4, package u4: the keepsake inspector, boards, gallery and map. */
export const STORY_U4_TEXT = {
  /** More story items for the item card and the inspector (merged with STORY_UI_TEXT.items). */
  items: { board: 'The message board' } as Record<string, string>,
  /** One line under the inspector's view (K12). */
  itemLines: {
    letter: 'Folded twice, and sealed with red wax that never quite set.',
    notebook: 'Green cloth, a yellow band, and a ribbon she used as a bookmark.',
    'vane-notebook': 'Scuffed brown, held shut with a black band. Pages loose at the top.',
    stone: 'Flat, cool, and lit very faintly from inside.',
    recording: 'A small white player with three bars that rise when it speaks.',
    board: 'Cards pinned with a red dot each. Someone has drawn a tiny sun on one.',
  } as Record<string, string>,
  inspectHint: 'Drag to turn it',
  inspectTap: 'Tap the card to look closer',
  inspectClose: 'Close',
  inspectAlt: (name: string) => `${name}, turned by dragging`,
  /** The message board and the guard house notices (K29): lines come from here, never the art. */
  board: {
    title: 'REQUESTS',
    cards: [
      ['LOST', 'a red kite', 'ask Pip'],
      ['WANTED', 'ripe plums', 'ask Juno'],
      ['SWAP', 'eggs for tea', 'ask Wren'],
      ['HELP', 'stuck ladder', 'ask Dusty'],
      ['FOUND', 'one glove', 'ask anyone'],
      ['WANTED', 'quiet games', 'ask Pixel'],
    ] as ReadonlyArray<readonly [string, string, string]>,
    empty: 'Nothing pinned today.',
    notices: {
      title: 'NOTICES',
      lines: [
        'Cart leaves at first light',
        'Mind the low beams below',
        'Boots by the door, please',
      ],
    },
  },
  /** Journal: the chapter thumbnails and the endings page (K31, K47). */
  endingsTab: 'Endings',
  endingsHelp: 'Each ending you reach keeps its last picture here.',
  endingLocked: 'Not reached yet',
  endingNoPicture: 'Reached (no picture kept)',
  lockAlt: 'Locked',
  thumbAlt: (title: string) => `Chapter picture: ${title}`,
  /** The campaign map (K33). */
  mapCampaign: (name: string) => `${name}: the places of this story`,
  landmarks: {
    'fold-well': 'The Fold’s well',
    'fold-door-1': 'The cottage step',
    'green-centre': 'The green',
    board: 'The message board',
    'guardhouse-bench': 'The guard house',
    'banner-1': 'The first banner',
    'house-1-door': 'The first house',
  } as Record<string, string>,
  /** The Hundred Days' tally label for screen readers. */
  tally: (n: number) => `Day ${n}`,
} as const;
