/**
 * Player-facing text for the open world (lane D, WORLD-*): region names, the drawn map, travel
 * refusals. Re-exported from `strings.ts` so it can be renamed with everything else.
 */
import type { RegionId } from './regions';

export const WORLD_TEXT = {
  regions: {
    grove: 'The Grove',
    lane: 'The lane',
    village: 'The village',
    shore: 'The shore',
    wood: 'The wood',
    ridge: 'The ridge',
    peaks: 'The peaks',
    caves: 'The caves',
    ruins: 'The ruins',
    sunlands: 'The Sun lands',
    moonlands: 'The Moon lands',
    hollow: 'The Hollow Below',
    'little-grove': 'The Little Grove',
  } satisfies Record<RegionId, string>,
  unknownRegion: 'Not found yet',
  mapHelp: 'Drag to look around, pinch or scroll to zoom, double-tap to find yourself.',
  youAreHere: 'You are here',
  travelHere: 'Travel here',
  /** R0091: one-time collectibles, by kind (singular, plural), and their toasts. */
  keepsake: {
    petal: ['Pressed petal', 'Petals'],
    postcard: ['Lost postcard', 'Postcards'],
    key: ['Old key', 'Keys'],
  },
  keepsakeFound: (name: string, got: number, of: number) => `${name} found (${got}/${of}).`,
  keepsakeSet: {
    petal: 'Every petal pressed. A new flowerbed waits in your decorations.',
    postcard: 'Every postcard home. A flower hat is yours.',
    key: 'The old key turns somewhere. Its lock is still a mystery.',
  },
  keepsakeTally: (name: string, got: number, of: number) => `${name} ${got}/${of}`,
  /** R0074: the map's travel button while a story scene is open. */
  travelBusy: 'Not now. Finish what is happening here first.',
  notFound: 'Not found yet. Walk up to it to add it to the map.',
  exitTo: (name: string) => `To ${name}`,
  regionNotDrawn: (name: string) =>
    `${name} has no map of its own yet. Its ways out are listed below.`,
  questsHere: 'Asks here',
  noQuestsHere: 'Nothing is asking here just now.',
  centre: 'Find me',
  refused: {
    'no-exit': 'There is no way out from here.',
    unbuilt: 'That way is not open yet.',
    locked: 'That way is closed for now.',
    'use-entrance': 'Go in through the cave mouth.',
    'no-place': 'Pick a garden to visit first.',
  } as Record<string, string>,
  regionFound: (name: string) => `New place: ${name}`,
  /** The Nubbin markers' labels, for screen readers (the dot also shows the type's icon). */
  nubbinDot: (name: string) => `${name} is here`,
  /** R0082: the compass rose and its rim ticks. */
  compassLabel: 'Compass. North is marked N. Opens the map',
  compassN: 'N',
  compassHome: 'Home',
  compassUnknown: 'An undiscovered place is near',
  compassObjective: 'Your goal',
  /** The tiny north pointer on the rotate buttons. */
  rotateNorth: 'North',
  /** R0083: the corner minimap and its setting. */
  minimapLabel: 'Minimap. Tap to open the map',
  minimapSetting: 'Minimap',
  minimapLevels: { off: 'Off', on: 'On', auto: 'Auto' } as Record<string, string>,
  minimapHelp: 'Auto shows it in the Grove on screens tall enough to spare the room.',
} as const;

/** R0072: what each outer-ring place's tappable piece says (`config/outer-ring.ts`). */
export const OUTER_TEXT = {
  tap: {
    fairyRing:
      'A ring of mushrooms, perfectly round, that nobody planted. Nubbins walk round it, never through.',
    trail:
      'The trail into the Wood starts here. The sign has been repainted so often it is mostly paint.',
    telescope:
      'You squint east. Past the ridge, something gold catches the light: the way to the Sun lands.',
    stiltLane: 'The lane runs south along the stream to the stilt village. Mind the planks.',
    scarecrow: 'The scarecrow wears an old hat of Hazel’s. The crows seem to find it reassuring.',
    hive: 'A steady hum. The bees are busy, and would like you to be busy somewhere else.',
  },
} as const;

/** R0073 and R0106: the two phone-room settings (`ui/world-settings.ts`). */
export const WORLD_SETTINGS_TEXT = {
  surveyWhenRunning: {
    label: 'Zoom out when running',
    help: 'After two seconds of running the view pulls back to show the land around you.',
  },
  hideBarWhileWalking: {
    label: 'Hide bar while walking',
    help: 'The bottom bar tucks away while you walk, and comes back when you stop or tap its edge.',
  },
  handle: 'Show the menu bar',
} as const;
