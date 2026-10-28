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
} as const;
