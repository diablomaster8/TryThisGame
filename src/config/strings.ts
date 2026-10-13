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

export const CRITTER_LABELS: Record<string, string> = {
  penguin: 'Penguin',
  seal: 'Seal',
  otter: 'Otter',
  peacock: 'Peacock',
  parrot: 'Parrot',
  condor: 'Condor',
  cheetah: 'Cheetah',
  rabbit: 'Rabbit',
  boar: 'Boar',
  gorilla: 'Gorilla',
  bear: 'Bear',
  tiger: 'Tiger',
  sheep: 'Sheep',
  raccoon: 'Raccoon',
  skunk: 'Skunk',
};

export const ESSENCE_LABELS = {
  swim: 'Blue Essence',
  fly: 'Purple Essence',
  run: 'Green Essence',
  power: 'Red Essence',
  normal: 'Gold Essence',
} as const;

export const GROVE_LABELS = {
  main: '🌿 Main Grove',
  sun: '☀ Sun Grove',
  moon: '☾ Moon Grove',
} as const;

/** Player-facing species names. Ids live in sim/species.ts. */
export const SPECIES_LABELS: Record<string, string> = {
  chao: 'Nubbin',
  zapling: 'Zapling',
  zapkin: 'Zapkin',
  zapmaw: 'Zapmaw',
  starbud: 'Starbud',
  starpuff: 'Starpuff',
  starwing: 'Starwing',
  puffbud: 'Puffbud',
  puffle: 'Puffle',
  pufflow: 'Pufflow',
  shellbit: 'Shellbit',
  shellwing: 'Shellwing',
  scrapper: 'Scrapper',
  kickmaster: 'Kickmaster',
  jabmaster: 'Jabmaster',
  spinmaster: 'Spinmaster',
  kissbud: 'Kissbud',
  frostdiva: 'Frostdiva',
  plugbud: 'Plugbud',
  voltbrute: 'Voltbrute',
  emberbud: 'Emberbud',
  blazebrute: 'Blazebrute',
  droplet: 'Droplet',
  puddlemouse: 'Puddlemouse',
  rivermouse: 'Rivermouse',
  grinlet: 'Grinlet',
  punchbag: 'Punchbag',
  spiralshell: 'Spiralshell',
  spiralking: 'Spiralking',
  domeshell: 'Domeshell',
  domereaper: 'Domereaper',
  skyfang: 'Skyfang',
  'skyfang-grown': 'Skyfang',
  lilystalk: 'Lilystalk',
  lilyking: 'Lilyking',
  clawnymph: 'Clawnymph',
  clawknight: 'Clawknight',
  fuzzlet: 'Fuzzlet',
  chompet: 'Chompet',
  dinolet: 'Dinolet',
  croaklet: 'Croaklet',
  hornsaur: 'Hornsaur',
  redsaur: 'Redsaur',
  shadeling: 'Shadeling',
  blazeman: 'Blazeman',
  slugbert: 'Slugbert',
  skyserpent: 'Skyserpent',
  seaserpent: 'Seaserpent',
  ironsaur: 'Ironsaur',
  beanbot: 'Beanbot',
  hugbear: 'Hugbear',
};

/** The ten playable Keepers. */
export const TRAINER_LABELS: Record<string, { name: string; blurb: string }> = {
  fern: { name: 'Fern', blurb: 'The gardener. Grove-line eggs, mostly.' },
  marina: { name: 'Marina', blurb: 'Tide-pool keeper. Swimmers from the pocket line.' },
  sparks: { name: 'Sparks', blurb: 'Fast and crackly. Runners from the pocket line.' },
  clover: { name: 'Clover', blurb: 'Soft-hearted. Gentle pocket-line babies.' },
  pixel: { name: 'Pixel', blurb: 'Tinkerer. Eggs from the digital line.' },
  luna: { name: 'Luna', blurb: 'Night gardener. Moon-side Grove eggs.' },
  ember: { name: 'Ember', blurb: 'Fighter. Brawlers from the pocket line.' },
  byte: { name: 'Byte', blurb: 'Dark-screen coder. Digital-line eggs.' },
  dusty: { name: 'Dusty', blurb: 'Fossil hunter. Only ancient pocket-line eggs.' },
  nova: { name: 'Nova', blurb: 'Wanderer. A bit of everything.' },
};

export const FAMILY_LABELS = {
  chao: 'Grove line',
  pocket: 'Pocket line',
  digi: 'Digital line',
} as const;

export const HAT_LABELS: Record<string, string> = {
  straw: 'Straw hat',
  crown: 'Crown',
  beanie: 'Beanie',
  flower: 'Flower',
  bucket: 'Bucket hat',
  'look-fox': 'Fox look',
  'look-echidna': 'Echidna look',
  'look-rose': 'Rose look',
  'look-dream': 'Dream look',
};

export const EGG_COLOR_LABELS: Record<string, string> = {
  plain: 'Plain',
  sky: 'Sky',
  rose: 'Rose',
  mint: 'Mint',
  gold: 'Gold',
  violet: 'Violet',
};

export const PERSONALITY_LABELS = {
  cheerful: 'Cheerful',
  shy: 'Shy',
  mischievous: 'Mischievous',
  lazy: 'Lazy',
} as const;

export const COURSE_LABELS: Record<string, string> = {
  meadow: 'Meadow Dash',
  cliffs: 'Cliff Climb',
  lagoon: 'Lagoon Loop',
};

export const SHOP_ITEMS = {
  fruit: { name: 'Fruit', help: 'Fills a hungry belly and adds Stamina.' },
  egg: { name: 'Egg', help: 'A new Nubbin. Sometimes a rare colour!' },
  hat: { name: 'Hat', help: 'A random hat for the collection.' },
  toy: { name: 'Ball', help: 'Nubbins play with it in the Grove.' },
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
  trust: 'Trust',
  shadowTag: 'Shadow',
  bondedTag: 'Shadow · bonded',
  strayTag: 'Stray',
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
  awayEternal: (name: string) => `${name} became Eternal!`,
  awayWaiting: (name: string) => `${name} reached the end of a life and is waiting for you.`,
  reborn: (name: string) => `${name} was reborn!`,
  departed: (name: string) => `${name} moved on. A flower remains.`,
  eternal: (name: string) => `${name} is Eternal!`,
  cocoonRebirth: (name: string) => `${name} is glowing…`,
  cocoonDepart: (name: string) => `${name} is fading softly…`,
  waiting: 'Waiting for you',
  eternalLabel: 'Eternal',
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
  give: 'Give',
  giveCritters: 'Critters',
  giveEssences: 'Essences',
  // Shop
  shop: 'Shop',
  bought: (name: string) => `Bought ${name}.`,
  notEnoughShells: 'Not enough Shells.',
  rosterFull: 'The Grove is full (8 Nubbins).',
  tooManyToys: 'Enough toys lying around already.',
  // Expedition
  expedition: 'Expedition',
  expeditionNeedsNubbin: 'Hatch a Nubbin first; it goes on the Expedition.',
  expeditionResults: 'Expedition results',
  resultShells: (n: number) => `🐚 ${n} Shells`,
  resultNothing: 'Nothing this time. Jump for the shells!',
  backToGrove: 'Back to the Grove',
  expeditionHint: 'Tap to jump · hold to jump higher',
  // Races
  races: 'Races',
  racesHelp: 'Pick a course. Win a tier to unlock the next. The selected Nubbin runs.',
  tierLabel: (tier: number) => `Tier ${tier}`,
  cheer: 'Cheer!',
  raceResults: 'Race results',
  place: (p: number) =>
    p === 1 ? '1st place' : p === 2 ? '2nd place' : p === 3 ? '3rd place' : `${p}th place`,
  wonHat: 'You won a hat!',
  tierUnlocked: 'Next tier unlocked!',
  // Roster
  roster: 'Roster',
  rosterCount: (n: number) => `${n} / 8 Nubbins`,
  noHat: 'No hat',
  find: 'Go to',
  // Trainers
  trainers: 'Keepers',
  trainersHelp: 'Pick who tends the Grove. New eggs follow the active Keeper.',
  eggsLabel: 'Eggs',
  favouriteLabel: 'Favours',
  chooseTrainer: 'Choose',
  activeTrainer: 'Active',
  trainerChosen: (name: string) => `${name} tends the Grove now.`,
  // Sound
  sound: 'Sound',
  soundHelp: 'Soft music and little blips for taps, pickups and big moments.',
  joystick: 'On-screen joystick',
  joystickHelp: 'A thumb pad for moving the Keeper. Tapping the ground always works too.',
  nothingToGive: 'Nothing to give yet. Expeditions (M4) bring Critters and Essences.',
  switchKeeper: 'Switch Keeper',
  groveButton: 'Grove',
  // Celebration
  evolvedTitle: (name: string) => `${name} evolved!`,
  evolvedForm: (band: string, type: string) => `${band} ${type}`,
  gradeUp: (stat: string, grade: string) => `${stat} grade is now ${grade}`,
  groveUnlocked: (grove: string) => `${grove} unlocked!`,
  secondEvolved: (name: string, type: string) => `${name} grew a ${type} side.`,
  speciesGrew: (name: string, species: string) => `${name} grew into a ${species}!`,
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
