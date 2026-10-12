// Every player-facing name and piece of text. All names are working titles.

export const NAMES = {
  game: 'Grove',
  creature: 'Nubbin',
  creaturePlural: 'Nubbins',
  garden: 'Grove',
  currency: 'Shells',
  smallAnimals: 'Critters',
  statCrystals: 'Essences',
  alignmentSun: 'Sun',
  alignmentMoon: 'Moon',
  alignmentNeutral: 'Neutral',
  eternal: 'Eternal',
  player: 'Keeper',
  playerSun: 'Sun Keeper',
  playerMoon: 'Moon Keeper',
} as const;

/** Random names for new Nubbins. The player can rename them. */
export const NUBBIN_NAMES = [
  'Pip',
  'Momo',
  'Bibi',
  'Tuft',
  'Nono',
  'Kiki',
  'Dew',
  'Fig',
  'Lulu',
  'Pebble',
  'Wisp',
  'Tilly',
  'Bo',
  'Juniper',
  'Sprig',
  'Puff',
] as const;

export const STAT_LABELS = {
  swim: 'Swim',
  fly: 'Fly',
  run: 'Run',
  power: 'Power',
  stamina: 'Stamina',
} as const;

export const STAT_ICONS = {
  swim: '🌊',
  fly: '🪶',
  run: '👟',
  power: '💪',
  stamina: '🌿',
} as const;

export const STAGE_LABELS = {
  egg: 'Egg',
  child: 'Child',
  cocoon: 'Cocoon',
  adult: 'Adult',
} as const;

export const TYPE_LABELS = {
  normal: 'Normal',
  swim: 'Swim',
  fly: 'Fly',
  run: 'Run',
  power: 'Power',
} as const;

export const MOOD_LABELS = {
  content: 'Content',
  happy: 'Happy',
  sad: 'Sad',
  hungry: 'Hungry',
  sleepy: 'Sleepy',
  dizzy: 'Dizzy',
} as const;

export const UI_TEXT = {
  rotateLeft: 'Rotate camera left',
  rotateRight: 'Rotate camera right',
  zoomToggle: 'Toggle zoom',
  fps: (fps: number) => `${fps} fps`,
  desktopHint: 'WASD move · Q / E rotate · scroll zoom · click to select · drag to lift',
  settings: 'Settings',
  close: 'Close',
  pet: 'Pet',
  pickUp: 'Pick up',
  putDown: 'Put down',
  feed: 'Feed',
  shake: 'Shake',
  rename: 'Rename',
  hatchesIn: (s: string) => `Hatches in ${s}`,
  age: (s: string) => `Age ${s}`,
  hunger: 'Hunger',
  energy: 'Energy',
  happiness: 'Happiness',
  affection: 'Affection',
  rebirths: (n: number) => (n === 1 ? '1 rebirth' : `${n} rebirths`),
  fruitCount: (n: number) => `${n}`,
  // Settings
  offlineAgingTitle: 'Aging while closed',
  offlineAgingHelp: 'What happens to the Grove while the game is closed.',
  modeIndefinite: 'Indefinite',
  modeIndefiniteHelp: 'Simulate all the time that passed.',
  modeCapped: 'Capped',
  modeCappedHelp: 'Simulate up to a number of hours.',
  modeOff: 'Off',
  modeOffHelp: 'Nothing happens while closed.',
  capHours: 'Hours to simulate',
  capHoursError: 'Enter a whole number from 1 to 720.',
  allowDepartures: 'Allow departures while closed',
  allowDeparturesHelp: 'When off, a Nubbin at the end of its life waits for you.',
  exportSave: 'Export save',
  importSave: 'Import save',
  importError: 'That file is not a valid save.',
  resetSave: 'Reset save',
  resetConfirm: 'Erase the Grove and start over?',
  // Away screen
  awayTitle: 'While you were away',
  awayNothing: 'Everyone was quiet.',
  awayElapsed: (s: string) => `You were gone for ${s}.`,
  awaySimulated: (s: string) => `${s} of Grove time passed.`,
  awayHatched: (name: string) => `${name} hatched!`,
  awayEvolved: (name: string, form: string) => `${name} grew up into a ${form}.`,
  awayReborn: (name: string) => `${name} was reborn.`,
  awayDeparted: (name: string) => `${name} moved on, leaving a flower.`,
  continueButton: 'Continue',
  catchingUp: 'Catching up…',
  // Debug
  debugTitle: 'Debug',
  debugSpeed: 'Speed',
  debugGive: 'Give',
  debugForceEvolve: 'Force evolve',
  debugForceEnd: 'Force end of life',
  debugHatchNow: 'Hatch now',
  debugFillNeeds: 'Fill needs',
  debugReset: 'Reset save',
  debugNoSelection: 'Tap a Nubbin to inspect it.',
  // Toasts
  storageBlocked: 'Saving is blocked in this browser. The Grove will not be kept.',
  saved: 'Saved',
  hatched: (name: string) => `${name} hatched!`,
  evolved: (name: string) => `${name} evolved!`,
  carrying: (name: string) => `Carrying ${name}`,
} as const;

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
