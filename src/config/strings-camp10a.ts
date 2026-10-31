/** Lane C round 10, agent A (re-exported through strings-camp10.ts). */

/** R0605, R0640, R0650: the questline regions reached from the Grove. */
export const STORY_REGION_TEXT = {
  names: {
    grove: 'the Grove',
    fold: 'the Fold',
    server: 'the server',
    hollow: 'the Hollow',
    sun: 'the Sun Grove',
    moon: 'the Moon Grove',
  } as Readonly<Record<string, string>>,
  /** Short tab labels on the map. */
  tabs: {
    grove: 'Grove',
    fold: 'Fold',
    server: 'Server',
    hollow: 'Hollow',
    sun: 'Sun',
    moon: 'Moon',
  } as Readonly<Record<string, string>>,
  entrances: {
    gate: 'the lane beyond the gate',
    workbench: "Pixel's workbench",
    stairs: 'the Hollow Below stairs',
    shrine: 'the green’s shrine',
  } as Readonly<Record<string, string>>,
  goTo: (name: string) => `Go to ${name}`,
  back: 'Back to the Grove',
  entered: (name: string) => `You are in ${name}.`,
  left: 'Back in the Grove.',
  refused: {
    locked: 'That way is not open yet.',
    noLine: 'Nothing is waiting there yet.',
    busy: 'Not while a scene is playing.',
  } as Readonly<Record<string, string>>,
  /** R0640: each region is announced once, by someone who would know (a toast, never a modal). */
  opened: {
    fold: 'Hazel: The lane beyond the gate is open now. Mind the puddles.',
    server: 'Pixel: The workbench is talking to the server again. Come and look when you like.',
    sun: 'Hazel: The shrine on the green has started catching the morning. Odd, that.',
    moon: 'Hazel: The shrine on the green has started catching the evening too.',
    hollow: 'Hazel: Something is moving on the Hollow stairs. Beetles, by the sound.',
  } as Readonly<Record<string, string>>,
  /** R0650: unlock hints from the opening chapter. */
  lockedHint: (chapter: number) => `\u{1F512} After Chapter ${chapter}`,
  waits: (name: string) => `Waiting for you in ${name}`,
  mapRegions: 'Regions',
  goThere: 'Go there',
  noQuests: 'No stories waiting here.',
} as const;
