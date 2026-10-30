// Every player-facing name and piece of text. All names are working titles.
import { aOrAn, ordinal, plural } from './grammar';
import type { PlaceRefusal } from '../sim/types';
import { GEN1B_SPECIES_LABELS } from './strings-gen1b';

import { DIGI2_LABELS } from './strings-digi2';

import { GEN1A_LABELS } from './strings-gen1a';
import { MORE_CRITTER_LABELS } from './strings-look';

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
  ...MORE_CRITTER_LABELS,
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
  ...DIGI2_LABELS,
  ...GEN1B_SPECIES_LABELS,
  ...GEN1A_LABELS,
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

/**
 * The playable Keeper looks, named for the look and never for the villager who wears it,
 * so a story never has you meet yourself ("I'm Fern, from next door").
 */
export const KEEPER_LOOK_NAMES: Record<string, string> = {
  fern: 'Gardener',
  marina: 'Tide-pooler',
  sparks: 'Live Wire',
  clover: 'Knitter',
  pixel: 'Tinkerer',
  luna: 'Night Gardener',
  ember: 'Scrapper',
  byte: 'Night Coder',
  dusty: 'Fossil Hunter',
  nova: 'Wanderer',
};

/** One line under each look in the title's Keeper picker: what hatches with them (review C, 23). */
export const KEEPER_LOOK_BLURBS: Record<string, string> = {
  fern: 'Grove-line eggs, mostly.',
  marina: 'Swimmers from the pocket line.',
  sparks: 'Runners from the pocket line.',
  clover: 'Gentle pocket-line babies.',
  pixel: 'Eggs from the digital line.',
  luna: 'Moon-side Grove eggs.',
  ember: 'Brawlers from the pocket line.',
  byte: 'Digital-line eggs.',
  dusty: 'Only ancient pocket-line eggs.',
  nova: 'A bit of everything.',
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

/** The race sections' signs, as the track shows them. */
export const SECTION_LABELS = {
  swim: 'SWIM',
  fly: 'FLY',
  run: 'RUN',
  climb: 'CLIMB',
  stretch: 'STAMINA',
} as const;

export const SHOP_ITEMS = {
  fruit: { name: 'Fruit', help: 'Fills a hungry belly and adds Stamina.' },
  egg: { name: 'Egg', help: 'A new Nubbin. Sometimes a rare colour!' },
  hat: { name: 'Hat', help: 'A random hat for the collection.' },
  toy: { name: 'Ball', help: 'Nubbins play with it in the Grove.' },
  heartFruit: {
    name: 'Heart fruit',
    help: 'Feed it to a grown Nubbin that loves you; with a partner nearby, an egg follows.',
  },
  twine: { name: 'Twine', help: 'Binds two partners for a minute of merged strength.' },
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
  desktopHint:
    'WASD move · Space jump · X shake · Q / E rotate · scroll zoom · click to select · drag to lift',
  settings: 'Settings',
  close: 'Close',
  pet: 'Pet',
  statPoints: (into: number, per: number, next: number) =>
    `${into} of ${per} points toward level ${next}`,
  run: 'Run',
  runHelp: 'Hold Shift or tap Run to move faster.',
  jump: 'Jump',
  pickUp: 'Pick up',
  putDown: 'Put down',
  feed: 'Feed',
  shake: 'Shake',
  /** The egg's Shake while it is on the ground: it shakes only in the Keeper's arms. */
  shakeNeedsHold: 'Pick up to shake',
  /** A full Nubbin's Feed button, and the note when a feed is refused. */
  feedFull: 'Full',
  isFull: (name: string) => `${name} is full. Save the fruit for later.`,
  rename: 'Rename',
  hatchesIn: (s: string) => `Hatches in ${s}`,
  /** An egg whose time is up hatches once it is on the ground. */
  hatchReadyHeld: 'Ready to hatch: put it down',
  hatchReady: 'Hatching…',
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
  matureTitle: 'Mature content',
  matureHelp: 'Which stories the Grove may offer. Off by default.',
  matureOff: 'Off',
  matureOffHelp: 'Stories for everyone.',
  matureTeen: '13+',
  matureTeenHelp: 'Adds stories for teens: some peril and sadness.',
  matureAdult: '18+',
  matureAdultHelp:
    'Adds grown-up stories, such as the Multiverse. Includes violence and crude humour.',
  riftTitle: 'Before the rift opens',
  riftText:
    'The worlds beyond the rift are for grown-ups: violence, horror and crude humour. Are you 18 or older?',
  riftConfirm: 'I am 18 or older',
  riftCancel: 'Not now',
  exportSave: 'Export save',
  mayClearStorage:
    'This browser may clear your Grove after a week away. Install Grove or export a backup.',
  importSave: 'Import save',
  importError: 'That file is not a valid save.',
  imported: (slot: string) => `Save imported into ${slot}.`,
  capHoursReverted: (n: number) => `Not saved: enter 1 to 720. Still ${n} hours.`,
  eduSettingsTitle: 'Learning Grove',
  importTooBig: 'That file is too big to be a Grove save.',
  importWrongMode: (from: string, to: string) =>
    `That save is from ${from}. Open a ${from} slot to import it, not ${to}.`,
  importConfirm: (slot: string) => `Replace ${slot} with the imported save? This can’t be undone.`,
  unreadableKept:
    'Your saved Grove could not be opened, so a new one has started. The old save is kept: export it from Settings.',
  unreadableHeld:
    'Your saved Grove could not be opened or copied. A new one has started, but it will not save over the old one.',
  exportUnreadable: 'Export the save that could not be opened',
  updateNotice: 'A new version of the Grove is out. Reload to update.',
  updateReload: 'Reload to update',
  /** The boot card when a part of the game would not download (boot agent, 2026-10-25). */
  bootFailed: {
    offline: 'The Grove could not finish loading. Check the connection, then try again.',
    online: 'Part of the Grove would not load. A reload usually fixes it.',
    retry: 'Try again',
    reload: 'Reload',
  },
  glFailure: {
    unsupported: 'This browser cannot draw the Grove: it needs WebGL2. Try an up-to-date browser.',
    failed: 'The Grove’s graphics would not start on this device.',
    lost: 'The graphics stopped (the device needed the memory back). Your Grove is saved.',
  } as Record<'unsupported' | 'failed' | 'lost', string>,
  glReload: 'Reload',
  crashed:
    'Something went wrong in the Grove. Nothing has been saved since, so your last save is safe.',
  glToPixel: 'Switch to Pixel',
  /** A passing notice for an error nothing else caught; play goes on. */
  errorNotice: 'Something went a little wrong. If the Grove looks odd, reload.',
  resetSave: 'Reset save',
  resetConfirm: 'Erase the Grove and start over?',
  // Away screen
  awayTitle: 'While you were away',
  awayNothing: 'Everyone was quiet.',
  awayElapsed: (s: string) => `You were gone for ${s}.`,
  awaySimulated: (s: string) => `${s} of Grove time passed.`,
  awayHatched: (name: string) => `${name} hatched!`,
  awayEvolved: (name: string, form: string) => `${name} grew up into ${aOrAn(form)}.`,
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
  expeditionNeedsNubbin:
    'Hatch a Nubbin first. Eggs hatch in about 3 minutes, or pick one up and shake it to hurry it.',
  expeditionTip: 'Tap to jump, hold to jump higher.',
  expeditionTipKeys: 'Tap or press Space to jump; hold to jump higher.',
  expeditionResults: 'Expedition results',
  resultShells: (n: number) => `🐚 ${n} Shells`,
  resultNothing: 'Nothing this time. Jump for the shells!',
  backToGrove: 'Back to the Grove',
  expeditionHint: 'Tap to jump · hold to jump higher',
  /** Shown while a Full 3D minigame builds its stage and the runners' rigs. */
  stageLoading: 'Setting the stage…',
  // Races
  races: 'Races',
  racesHelp: 'Pick a course. Win a tier to unlock the next. The selected Nubbin runs.',
  tierLabel: (tier: number) => `Tier ${tier}`,
  cheer: 'Cheer!',
  raceResults: 'Race results',
  place: (p: number) =>
    `${ordinal(p)} place`,
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
  sound: 'Sound effects',
  soundHelp: 'Little blips for taps, pickups and big moments.',
  music: 'Music',
  musicHelp:
    'The Grove’s own score: a waltz by day, a music box at night, themes for the title, races and Expeditions.',
  quitMinigame: 'Leave (Esc)',
  joystick: 'On-screen joystick',
  joystickHelp: 'A thumb pad for moving the Keeper. Tapping the ground always works too.',
  nothingToGive: 'Nothing to give yet. Expeditions bring Critters and Essences.',
  switchKeeper: 'Switch Keeper',
  groveButton: 'Grove',
  // Celebration
  evolvedTitle: (name: string) => `${name} evolved!`,
  evolvedForm: (band: string, type: string) => `${band} ${type}`,
  gradeUp: (stat: string, grade: string) => `${stat} grade is now ${grade}`,
  groveUnlocked: (grove: string) => `${grove} unlocked!`,
  secondEvolved: (name: string, type: string) => `${name} grew ${aOrAn(type)} side.`,
  speciesGrew: (name: string, species: string) => `${name} grew into ${aOrAn(species)}!`,
  // Interactions
  tickle: 'Tickle',
  hug: 'Hug',
  groom: 'Brush',
  tuckIn: 'Tuck in',
  praise: 'Praise',
  highFive: 'High five',
  call: 'Call',
  callAll: 'Call everyone',
  playCatch: 'Play catch',
  heartFruitGive: 'Heart fruit',
  interactRefused: (name: string) => `${name} flinches away. Not yet.`,
  interacted: (name: string, action: string) => `${name} liked that (${action.toLowerCase()}).`,
  called: (n: number) =>
    n === 0 ? 'Nobody came.' : n === 1 ? 'One came running.' : `${n} came running.`,
  fetching: (name: string) => `${name} is after the ball!`,
  courting: (name: string) => `${name} is looking for a partner…`,
  bred: 'An egg! Two Nubbins made a little one.',
  // Settings
  musicVolume: 'Music volume',
  sfxVolume: 'Effects volume',
  textSpeed: 'Story text speed',
  textSpeeds: { slow: 'Slow', normal: 'Normal', fast: 'Fast', instant: 'Instant' },
  screenShake: 'Screen shake',
  screenShakeHelp: 'A little camera bump on landings and shaken trees.',
  gentleJumps: 'Gentle jumps',
  gentleJumpsHelp: 'Floatier jumps, with more time to press. Always on in a Learning Grove.',
  particlesLabel: 'Particles',
  particleLevels: { full: 'Full', light: 'Light', off: 'Off' },
  graphicsLabel: 'Graphics',
  graphicsLevels: { pixel: 'Pixel art', '3d': 'Full 3D' },
  graphicsHelp: 'Full 3D is new and heavier on phones. Changing it reloads the Grove.',
  loading3d: 'Shaping the Grove',
  reducedMotionLabel: 'Reduced motion',
  reducedMotionLevels: { system: 'Follow system', on: 'On', off: 'Off' },
  fullscreen: 'Fullscreen',
  backToTitle: 'Back to title',
  // Kindergarten
  kindergarten: 'Kindergarten',
  kindergartenHelp:
    'Lessons give a Nubbin a skill it shows off in the Grove. The doctor and the fortune teller read what the eye cannot.',
  lessons: 'Lessons',
  lessonNames: { drawing: 'Drawing', singing: 'Singing', dance: 'Dance', instrument: 'Instrument' },
  lessonLevel: (level: number, max: number) => `${'★'.repeat(level)}${'☆'.repeat(max - level)}`,
  lessonStarted: (name: string, lesson: string) =>
    `${name} is in ${aOrAn(lesson.toLowerCase())} lesson.`,
  lessonDone: (name: string, lesson: string, level: number) =>
    `${name} finished ${lesson.toLowerCase()} (level ${level})!`,
  lessonBusy: 'In a lesson',
  lessonMax: 'Mastered',
  doctor: 'Doctor',
  doctorHelp: 'A full check-up of the hidden numbers.',
  fortuneTeller: 'Fortune teller',
  fortuneHelp: 'A reading of character and the road ahead.',
  needShells: (n: number) => `Needs ${n} Shells.`,
  pickNubbinFirst: 'Tap a Nubbin in the Grove first.',
  rebirthLikely: 'Rebirth is in the cards.',
  rebirthUnlikely: 'The cards are quiet about rebirth. More love, more joy.',
  // Karate
  karate: 'Karate',
  karateHelp:
    'Power lands the strike, Stamina takes the hit, Run slips it. Tap when the bar is in the middle.',
  belt: (n: number) => ['No belt', 'Yellow belt', 'Green belt', 'Black belt'][n] ?? 'Belt',
  strike: 'Strike!',
  karateWon: (name: string) => `${name} wins the bout!`,
  karateLost: (name: string) => `${name} is knocked down. Train and try again.`,
  karateLeft: 'Left the dojo. No result recorded.',
  karateResults: 'Dojo results',
  // Collection
  collection: 'Collection book',
  collectionHelp: (seen: number, total: number) => `${seen} of ${total} seen.`,
  unknown: '???',
  firstSeen: (name: string) => `New in the book: ${name}`,
  // Decorate
  decorate: 'Decorate',
  decorateHelp: 'Buy a piece, then tap the grass to place it. Tap a placed piece to pick it up.',
  decorNames: {
    fence: 'Fence',
    flowerbed: 'Flower bed',
    bench: 'Bench',
    statue: 'Statue',
    pathTile: 'Path stone',
    lanternSmall: 'Garden lantern',
    nursery: 'Nursery',
    bathhouse: 'Bathhouse',
    workshop: 'Workshop',
    rockPile: 'Rock pile',
    thicket: 'Thicket',
  },
  placeDecor: 'Place',
  placing: (name: string) => `Placing ${name} · tap the grass`,
  donePlacing: 'Done',
  decorPlaced: 'Placed.',
  /** Why a piece won't go where the Keeper tapped (MOVE-05). */
  decorRefused: {
    water: 'Too wet there.',
    edge: 'Too close to the edge of the Grove.',
    solid: 'Something is already there.',
    path: 'That would block the bridge.',
    someone: 'Someone is standing there.',
    spot: 'That spot is kept clear.',
  } satisfies Record<PlaceRefusal, string>,
  /** Turns the piece being placed by an eighth. */
  rotatePiece: 'Turn',
  decorPickedUp: 'Picked up.',
  // Photo
  photo: 'Photo',
  photoHelp: 'A framed snapshot of the selected Nubbin.',
  savePhoto: 'Save picture',
  // Pocket
  pocket: 'Pocket',
  pocketHelp: 'One Nubbin, close up. Good for a quick visit.',
  // Share
  share: 'Share code',
  shareHelp: 'Copy a code a friend can paste in to receive this Nubbin.',
  tradeAway: 'Trade away',
  tradeConfirm: (name: string) =>
    `Save ${name}’s code first: copy it, or select it and copy it by hand. Then send them away for good.`,
  tradeSend: (name: string) => `Code saved: send ${name} away`,
  copyCode: 'Copy code',
  copyByHand: 'Copying did not work here. Select the code and copy it by hand.',
  receive: 'Receive a Nubbin',
  receivePrompt: 'Paste a share code:',
  receiveTake: 'Take them in',
  codeCopied: 'Code copied.',
  codeBad: 'That is not a Nubbin code.',
  received: (name: string) => `${name} has arrived!`,
  receiveFull: 'The Grove is full (8).',
  traded: (name: string) => `${name} has gone to a new Grove.`,
  // Memorial
  memorialTitle: (name: string) => `In memory of ${name}`,
  memorialLived: (s: string) => `Lived ${s}`,
  memorialForm: (f: string) => `Grew into: ${f}`,
  memorialRebirths: (n: number) => (n === 1 ? 'Reborn once' : `Reborn ${n} times`),
  memorialAgo: (s: string) => `Moved on ${s} ago`,
  // Weather and days
  weatherRain: 'Rain. The swimmers are out; everyone else is under the trees.',
  weatherSnow: 'Snow is falling.',
  weatherClear: 'The sky clears.',
  visitor: (name: string, gift: string) => `${name} stopped by with ${gift}!`,
  visitorNoGift: (name: string) => `${name} stopped by to say hello.`,
  giftNames: {
    shells: 'a bag of Shells',
    fruit: 'some fruit',
    egg: 'an egg',
    heartFruit: 'a heart fruit',
  },
  lanternNight: 'Lantern night! The lanterns stay lit till morning.',
  more: 'More',
  menu: 'Menu',
  moreHelp: 'Everything else the Grove offers.',
  location: {
    grove: 'The Grove',
    hollow: 'The Hollow',
    corvin: 'Corvin’s garden',
    dungeon: 'The Hollow Below',
  },
  returnToGrove: 'Back to the Grove',
  // Orchard, crops, toys, tiles, crafting
  orchard: 'Orchard & crops',
  orchardHelp:
    'Plant seeds from Expeditions. Trees drop stat fruit; crops are harvested by hand. Rain waters them; tap one to water it in a dry spell.',
  seeds: 'Seeds',
  plantTree: 'Plant a tree',
  plantCrop: 'Plant a crop row',
  flavorNames: {
    swim: 'Swim',
    fly: 'Fly',
    run: 'Run',
    power: 'Power',
    stamina: 'Stamina',
    sun: 'Sun',
    moon: 'Moon',
  },
  planted: 'Planted.',
  watered: 'Watered.',
  harvested: (n: number, flavor: string) => `Harvested ${n} ${flavor} fruit.`,
  plantGrew: 'Something grew.',
  plantTap: (stage: number, water: number, ripe: boolean) =>
    ripe ? 'Ripe! Tap to harvest.' : `Stage ${stage + 1} of 4 · water ${Math.round(water * 100)}%`,
  water: 'Water',
  harvestBtn: 'Harvest',
  toys: 'Toys',
  toyNames: { ball: 'Ball', radio: 'Radio', blocks: 'Blocks', mirror: 'Mirror', tv: 'Little TV' },
  toyHelp: {
    ball: 'Chased and fetched.',
    radio: 'Dancing lessons for free.',
    blocks: 'Builds a little Power.',
    mirror: 'Affection for the vain.',
    tv: 'A rest without a nap.',
  },
  paint: 'Paint tiles',
  paintHelp: 'Tap the grass to lay dirt, water, flowers or stone. Grass erases.',
  tileNames: { grass: 'Grass', dirt: 'Dirt', water: 'Water', flowers: 'Flowers', stone: 'Stone' },
  workshop: 'Workshop',
  workshopHelp:
    'Wood from shaken trees, stone from the rocks, reeds from the stream bank. Build the workshop first for everything but a fence.',
  materials: (wood: number, stone: number, reeds: number) =>
    `🪵 ${wood} · 🪨 ${stone} · 🌾 ${reeds}`,
  craftBtn: 'Make',
  needsWorkshop: 'Build the workshop first.',
  needsMaterials: 'Not enough materials.',
  crafted: (name: string) => `Made ${aOrAn(name.toLowerCase())}.`,
  gathered: (what: string, n: number) => `+${n} ${what}`,
  recipeNames: {
    fence: 'Fence',
    bench: 'Bench',
    pathTile: 'Path stone',
    statue: 'Statue',
    lanternSmall: 'Garden lantern',
    flowerbed: 'Flower bed',
    rockPile: 'Rock pile',
    thicket: 'Thicket',
    nursery: 'Nursery',
    bathhouse: 'Bathhouse',
    workshop: 'Workshop',
    ball: 'Ball',
    dye: 'Dye',
  },
  dyeNames: {
    rose: 'Rose',
    sky: 'Sky',
    mint: 'Mint',
    gold: 'Gold',
    violet: 'Violet',
    ember: 'Ember',
  },
  dyeHat: 'Dye hat',
  dyeScarf: 'Scarf',
  glasses: 'Glasses',
  noDye: 'Make a dye in the workshop first.',
  // Quests, profile, neighbourhood, map
  quests: 'Requests',
  questsHelp: 'Three asks a day from the Nubbins and the neighbours. Claim the reward when done.',
  questText: {
    pet: (n: number) => `Pet a Nubbin ${n} times`,
    feed: (n: number) => `Feed a Nubbin ${n} times`,
    fruit: (n: number) => `Pick up ${n} fruit`,
    race: (n: number) => `Win ${plural(n, 'race')}`,
    karate: () => 'Win a karate bout',
    lanterns: () => 'Light all four lanterns',
    photo: (_n: number, p: string) => `Take a photo of ${aOrAn(p)}`,
    visit: (n: number) => `Visit ${plural(n, 'neighbour')}`,
    craft: (n: number) => `Make ${plural(n, 'thing')} in the workshop`,
    water: (n: number) => `Water ${n} plants`,
    hug: (n: number) => `Give ${n} hugs`,
    lesson: (n: number) => `Finish ${plural(n, 'lesson')}`,
    expedition: (n: number) => `Come back from ${plural(n, 'Expedition')}`,
    gather: (n: number) => `Gather ${n} materials`,
    hollow: (n: number) => `Go down ${plural(n, 'floor')} in the Hollow`,
  },
  questFrom: (who: string) => `from ${who}`,
  claim: 'Claim',
  questDone: 'A request is done. Check the board.',
  questClaimed: (shells: number, egg: boolean) => `+${shells} Shells${egg ? ' and an egg!' : ''}`,
  profile: 'Keeper profile',
  profileHelp: 'Titles, badges, borrowed moves and garden plots.',
  titleLabel: 'Title',
  noTitle: 'No title',
  badges: 'Badges',
  perksLabel: 'Borrowed moves',
  perkNames: {
    wade: 'Wade the pond',
    glide: 'Glide (faster running)',
    power: 'Power shake (extra fruit)',
    sprint: 'Sprint (faster running)',
  },
  perkFrom: (name: string) => `from ${name}`,
  noPerks: 'A loved adult lends you its move.',
  plotsLabel: (plots: number, cap: number) => `Garden plots: ${plots} · roster ${cap}`,
  buyPlot: (price: number) => `Buy a plot (${price} Shells)`,
  plotBought: 'A new plot! More room for Nubbins.',
  achievement: (title: string, shells: number) => `Badge earned: ${title} (+${shells} Shells)`,
  neighbourhood: 'Neighbourhood',
  neighbourhoodHelp:
    'Walk around the other Keepers’ Groves. Tap the host for a gift. Each neighbour has one to give.',
  visitBtn: 'Visit',
  goHome: 'Go home',
  giftBtn: 'Ask for a gift',
  giftTaken: 'You already have their gift.',
  neighbourGiftGot: (name: string, shells: number) => `${name} gave you ${shells} Shells.`,
  visitingNow: (name: string) => `Visiting ${name}’s Grove`,
  map: 'Map',
  mapHelp: 'Found landmarks are fast-travel spots. Tap one to go there.',
  landmarkNames: {
    bridge: 'The bridge',
    well: 'The well',
    falls: 'The falls',
    cottage: 'The cottage',
    dojo: 'The dojo',
    school: 'The school',
    oldTree: 'The old tree',
    southBend: 'The south bend',
    westHill: 'The west hill',
    northWood: 'The north wood',
    eastRidge: 'The east ridge',
    southMarsh: 'The south marsh',
    westMeadow: 'The west meadow',
    farOrchard: 'The far orchard',
  },
  landmarkFound: (name: string) => `Found: ${name}`,
  travelled: 'Off you go.',
  festival: {
    spring: 'Spring hatching: eggs are half price and rarer.',
    summer: 'Summer races: double prizes.',
    autumn: 'Autumn harvest: fruit falls twice as fast.',
    winter: 'Winter lanterns: lit all day, fireflies out.',
  },
  friendsMade: (a: string, b: string) => `${a} and ${b} are friends now.`,
  bestFriend: (name: string) => `Best friend: ${name}`,
  wildArrived: (species: string) => `A wild ${species} is looking around.`,
  wildSettled: (name: string) => `${name} has settled in!`,
  wildLeft: 'The wild one wandered off.',
  wildTap: 'Tap it with fruit in your pocket to feed it.',
  coop: 'Second Keeper',
  coopHelp: 'A friend on the same screen: IJKL to move, U to pet, O to feed, or a gamepad.',
  coopTrainer: 'Second Keeper look',
  jukebox: 'Jukebox',
  jukeboxAuto: 'Automatic',
  ambience: 'Ambient sounds',
  ambienceHelp: 'Birds by day, crickets at night, rain and the stream.',
  sledding: (name: string) => `${name} is sledding!`,
  tileHelp: 'Tap the grass.',
  notFromHere: 'Go home to the Grove first.',
  windmillTap: 'The mill turns when the wind is up. Flour for the bathhouse buns.',
  wildFed: 'It took the fruit. It will be back.',
  noQuests: 'The board is empty until tomorrow.',
  nurseryTap: 'The nursery: courting pairs lay their eggs here, safe and warm.',
  bathhouseTap: 'The bathhouse: Nubbins come out clean, calm and a little happier.',
  noSeeds: 'No seeds yet. Expeditions and harvests give them.',
  songNames: {
    title: 'Title theme',
    grove: 'The Grove',
    night: 'Night in the Grove',
    race: 'Race day',
    expedition: 'Expedition',
    story: 'Hazel’s theme',
    sorrow: 'Sorrow',
    tense: 'Corvin',
    hollow: 'The Hollow',
    karate: 'The dojo',
  } as Record<string, string>,
  coopOn: 'A second Keeper has joined.',
  coopOff: 'The second Keeper has left.',
  dyed: (name: string, slot: string) => `${name}'s ${slot} is dyed.`,
  toyPlaced: 'Toy placed.',
  photoTaken: 'Snap!',
  // Toasts
  storageBlocked: 'Saving is blocked in this browser. The Grove will not be kept.',
  /** Kept on screen while storage is blocked (review C, item 11). */
  storageBlockedChip: '⚠ Not saving',
  graphicsSwitchBlocked:
    'Saving is blocked, so a reload would lose the Grove. Pick the graphics on the title screen instead.',
  storageBlockedTitle:
    'Saving is blocked in this browser (private browsing, or site data switched off). Games you play now will not be kept, and saved games cannot be read.',
  otherTabSaved:
    'This Grove is open in another tab, so this tab has stopped saving. Reload to carry on.',
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

/** Educational mode ("Learning Grove") text. */
export const EDU_TEXT = {
  learningGrove: 'Learning Grove (ages 3–10)',
  newLearning: 'New Learning Grove',
  continueLearning: 'Continue Learning Grove',
  newLearningConfirm: 'Start a new Learning Grove? The old one will be erased.',
  chooseAge: 'How old is the player?',
  ageHelp: 'The games fit the age. A grown-up can change them any time.',
  play: 'Play & learn',
  playHelp: 'Pick a game. Three tries, then we show the answer together. No clocks.',
  gameNames: {
    colours: 'Colours',
    letters: 'Letters',
    counting: 'Counting',
    shapes: 'Shapes',
    sounds: 'Sounds & rhymes',
    animals: 'Animals',
  },
  gameIcons: {
    colours: '🎨',
    letters: '🔤',
    counting: '🔢',
    shapes: '🔷',
    sounds: '🎵',
    animals: '🐾',
  },
  /** The reader band's names for the three games it plays (review C, item 18). */
  readerGameNames: {
    counting: 'Sums',
    letters: 'Spelling',
    sounds: 'Rhymes & beats',
  } as Partial<Record<string, string>>,
  readerGameBlurbs: {
    counting: 'Add and take away to 20, and the 2, 5 and 10 times tables.',
    letters: 'Pick the right spelling of a picture word.',
    sounds: 'Read words that rhyme, and count the beats.',
  } as Partial<Record<string, string>>,
  gameBlurbs: {
    colours: 'Find the colour, then sort by colour.',
    letters: 'Letter names, first letters, big and small.',
    counting: 'Count up, more or fewer, little sums.',
    shapes: 'Circle, square, triangle and friends.',
    sounds: 'Animal sounds, first sounds, rhymes, claps.',
    animals: 'Names, sounds, homes and babies.',
  },
  domains: {
    cognition: 'Thinking & maths',
    literacy: 'Letters & reading',
    language: 'Listening & sounds',
    nature: 'Animals & nature',
  },
  recommended: (age: number) => `Recommended for age ${age}`,
  tryAgain: 'Try again!',
  almost: 'Almost. Have another look.',
  showAnswer: 'Here it is:',
  wellDone: ['Well done!', 'Yes!', 'You found it!', 'Great looking!', 'That’s it!'],
  nextRound: 'Next',
  leave: 'Leave',
  roundOf: (n: number, total: number) => `${n} of ${total}`,
  stars: (n: number) => `${'⭐'.repeat(n)}`,
  finished: (stars: number, max: number) => `${stars} of ${max} stars!`,
  sticker: 'A new sticker for your book!',
  stickers: (n: number) => `Stickers: ${n}`,
  backToGrove: 'Back to the Grove',
  playAgain: 'Play again',
  // Grown-up area
  grownUps: 'Grown-ups',
  gateTitle: 'Grown-ups only',
  gateHelp: (a: number, b: number) =>
    `To continue, work out ${a} × ${b}, type the answer, then press and hold Enter.`,
  gateHold: 'Keep holding…',
  gateWrong: 'Not quite. Here is a new one. Ask a grown-up.',
  gateEnter: 'Enter',
  parentTitle: 'Grown-up area',
  parentHelp:
    'The age sets which games are suggested and how hard they are. Switch any game on or off to make it yours.',
  ageLabel: 'Age',
  childName: 'Child’s name (for the letter games)',
  sessionLabel: 'Session length (minutes)',
  sessionHelp: 'A gentle "time for a break" screen appears after this long.',
  gamesLabel: 'Games',
  resetRecommended: 'Reset to recommended',
  progressLabel: 'Progress by area',
  progressRow: (plays: number, stars: number) => `${plays} rounds · ${stars} stars`,
  coPlay: [
    'Ask: "How do you know?" after a right answer.',
    'Say the letter sound together, not just its name.',
    'Count things around the room after the game.',
    'Let them teach you the rhyme.',
  ],
  breakTitle: 'Time for a break',
  breakBody: 'Stretch, have a drink of water, look out of a window. The Grove will wait.',
  breakMore: 'Grown-up: a little longer',
  breakSay: 'Time for a rest. Let us have a little sleep, and play again soon.',
  eduResultToast: (stars: number) => `${'⭐'.repeat(stars)} +${stars * 5} Shells`,
  noGames: 'All games are switched off. Ask a grown-up to turn some on.',
} as const;

/** The Learning Grove's story (CV2): the band switch, lesson beats, glossary, progress. */
export const EDU_STORY_TEXT = {
  readerAges: '7–10',
  bands: {
    sprout: 'Little Sprouts (3–6, read aloud)',
    reader: 'Grove Readers (7–10, reads alone)',
  },
  story: 'Story',
  storyBlurb: 'Hazel’s Grove, told for your age.',
  nextTitle: "What's next",
  nextOk: 'OK',
  hearAgain: 'Hear it again',
  nextNothing: 'Have a play with your Nubbin. The story will come to find you.',
  bandLabel: 'Story band',
  languageLabel: 'Story language',
  languages: { learning: 'Learning', standard: 'Standard' },
  languageHelp:
    'Learning plays each scene in the band’s words, with lessons. Standard plays the main game’s words, with gentler lines where a quest has them.',
  readAloudLabel: 'Read aloud (Little Sprouts)',
  readAloudHelp:
    'Uses the device’s own voice once sound is on. Grown-up prompts in brackets are not read.',
  replay: 'Read it again',
  weDidIt: 'We did it!',
  countTap: (n: number, of: number) => (n === 0 ? 'Tap to count' : `${n} of ${of}`),
  bestStar: '⭐',
  next: 'Go on',
  glossaryClose: 'Got it',
  progressTitle: 'Story lessons',
  progressNone: 'No story lessons yet. They come up as the story plays.',
  byDomain: 'By area',
  byStandard: 'By standard',
  recentNotes: 'What your child practised',
  lessonCount: (n: number) => `${n} ${n === 1 ? 'lesson' : 'lessons'}`,
  lessonDomains: {
    maths: 'Maths',
    literacy: 'Reading & words',
    science: 'Science',
    'social-studies': 'People & places',
    sel: 'Feelings & friends',
    music: 'Music',
    art: 'Art',
    health: 'Health & body',
  } as Record<string, string>,
} as const;

/** The Learning Grove's language courses (CV3): Nova's postcard, word lists, tracing. */
export const LANG_TEXT = {
  postcard: 'Nova’s postcard',
  postcardBlurb: 'Two friends are coming to stay.',
  postcardBody:
    'Nova writes: “Two friends of mine are coming to the valley. Ori speaks Hebrew and Hana speaks Japanese. Who would you like to meet first?”',
  needStory: 'The friends arrive once the story has begun.',
  meet: (name: string) => `Meet ${name}`,
  carryOn: (name: string) => `Visit ${name}`,
  friends: { hebrew: 'Ori', japanese: 'Hana' } as Record<string, string>,
  languages: { hebrew: 'Hebrew', japanese: 'Japanese' } as Record<string, string>,
  progress: (done: number, total: number, words: number) =>
    `Quests ${done} of ${total} · ${words} words learned`,
  arriving: 'On the way! Look out for the gate.',
  words: 'Words',
  wordsTitle: (lang: string) => `${lang} words`,
  noWordsYet: 'No words yet. They appear here once you have met them in the story.',
  tapToHear: 'Tap a word to hear it.',
  placeholderClip:
    'Recordings by native speakers are on their way. Until a word has one, tapping it plays a chime.',
  back: 'Back',
  // The grown-up area
  grownUpTitle: 'Language words',
  grownUpHelp:
    'Heard: the word came up in a scene, or your child tapped it. Used: your child traced it or picked it in a choice.',
  heardUsed: (heard: number, used: number) => `heard ${heard} · used ${used}`,
  notMet: 'not met yet',
  // Tracing
  trace: 'Trace it',
  traceTitle: 'Tracing',
  traceHelpHe: 'Hebrew goes from right to left. Start each letter on its right side.',
  traceHelpJa: 'Follow the numbered strokes in order, starting at the dot.',
  traceAgain: 'Nearly! Start at the dot and follow the line.',
  traceMore: 'Keep going over the letter.',
  traceDone: 'Beautiful tracing!',
  traceClose: 'Stop',
  /** A language quest between scenes: its next part comes by itself (review 2026-10-21, 8). */
  langNext: (friend: string) =>
    `${friend}’s next part comes up on its own. Keep playing in the Grove.`,
  /** A step that waits on the story clock says so, with a way past it (bug 30). */
  waitingFor: (when: string) => `(Waiting for ${when}…)`,
  waitMoments: {
    dusk: 'dusk',
    dawn: 'morning',
    midnight: 'midnight',
    late: 'later on',
    short: 'a little while',
  } as Record<string, string>,
  skipWait: 'Don’t wait',
  langTraceHint: 'Tap “Trace it” and follow the shapes with a finger.',
  /** A Nubbin's reaction to a word it knows, shown as a caption. */
  gestures: {
    wave: 'waves',
    bow: 'bows',
    nod: 'nods',
    yawn: 'yawns',
    'look-up': 'looks up',
    smile: 'smiles',
    droop: 'droops',
    point: 'points',
  } as Record<string, string>,
  reacted: (name: string, gesture: string, word: string) => `${name} ${gesture} at ${word}`,
} as const;

/** The Digimon-inspired ten: square, slips, gym, partners, curfew, memories, skills, scans, teams, the Beetle Run. */
export const TEN_TEXT = {
  square: 'Village square',
  squareHelp:
    'Creatures you win over move into the square: settled wild ones, strays that come home, race and karate rivals you beat. Prosperity opens the stall, the gym bonus, the bathhouse attendant, free fortunes and a standing festival.',
  prosperity: (p: number, max: number) => `Prosperity ${p} / ${max}`,
  recruitsLabel: 'Recruits',
  noRecruits: 'Nobody yet. Feed a wild visitor, bring a stray home, or win a race.',
  roleNames: {
    stall: 'runs the stall',
    gym: 'coaches at the gym',
    attendant: 'tends the bathhouse',
    fortune: 'reads fortunes',
    festival: 'hangs the bunting',
    guard: 'keeps watch',
  } as Record<string, string>,
  unlockNames: {
    stall: 'Stall (cheaper goods)',
    gym: 'Gym coach (+20% training)',
    attendant: 'Bathhouse attendant',
    fortune: 'Free fortunes',
    festival: 'Festival (+15% race prizes)',
  } as Record<string, string>,
  recruited: (name: string, role: string) => `${name} moved into the square and ${role}.`,
  townGrew: (unlock: string) => `The square grew: ${unlock}.`,
  // Slips
  slips: 'Slips',
  noSlips: 'No slips. Well raised so far.',
  slipNames: {
    hungry: 'went hungry',
    sleepy: 'stayed up exhausted',
    lonely: 'felt lonely',
    wet: 'stood in the rain',
  } as Record<string, string>,
  slipToast: (name: string, slip: string) => `${name} ${slip}. (A slip.)`,
  wellRaised: (name: string) => `${name} was well raised: a second stat gained a grade.`,
  moodyTag: { grumpy: 'Grumpy', sleepy: 'Sleepy' } as Record<string, string>,
  dayCount: (day: number, of: number) => `Day ${day} of about ${of}`,
  // Gym
  gym: 'Gym',
  gymHelp:
    'Four stations, one per stat. Tap when the bar is in the zone; every hit is points. A fed, rested Nubbin gains half again as much. Each round costs energy.',
  stationNames: {
    lane: 'Swim lane',
    rings: 'Fly rings',
    track: 'Run track',
    rocks: 'Power rocks',
  } as Record<string, string>,
  train: 'Train',
  tooTired: 'Too tired to train. Let it nap first.',
  trained: (name: string, stat: string, points: number, rested: boolean) =>
    `${name}: +${points} ${stat}${rested ? ' (rested bonus)' : ''}`,
  gymHits: (hits: number) => `Hits: ${hits}`,
  gymTap: 'Tap in the zone!',
  gymDone: 'Round over',
  // Partners
  partners: 'Partners',
  partnersHelp:
    'Two Nubbins who keep near you and bond faster. Two bonded adult partners can merge with a twine for a minute of shared strength in races and bouts.',
  partnerSlot: (i: number) => `Partner ${i + 1}`,
  noPartner: 'None',
  mergeBtn: 'Merge (1 twine)',
  mergeWhy: {
    partners: 'Pick two partners first.',
    adults: 'Both partners must be adults.',
    bond: 'Both need affection 60 or more.',
    twine: 'Buy a twine at the shop.',
    merged: 'Already merged.',
  } as Record<string, string>,
  merged: (a: string, b: string) => `${a} and ${b} merged! One minute of shared strength.`,
  unmerged: 'The merge faded. Both are themselves again.',
  twineCount: (n: number) => `Twine: ${n}`,
  // Curfew
  curfewOn: 'Night has fallen. The Nubbins grow sleepy; light the lanterns to keep them up.',
  curfewOff: 'Morning. The Grove wakes.',
  // Memories
  memoryLabel: 'Rebirth keeps',
  memoryNames: {
    grade: 'A grade (best stat steps up)',
    part: 'Its critter parts',
    lesson: 'Its lessons',
    accessory: 'Its hat, scarf and glasses',
  } as Record<string, string>,
  ancestry: (lives: string[]) => `Past lives: ${lives.join(' → ')}`,
  heirloomTag: 'Heirloom',
  // Skills
  skills: 'Keeper skills',
  skillsHelp: 'Badges and finished requests give skill points. Each branch opens in order.',
  skillPoints: (n: number) => `Skill points: ${n}`,
  branchNames: { care: 'Care', garden: 'Garden', games: 'Games', story: 'Story' } as Record<
    string,
    string
  >,
  skillCost: (n: number) => `${n} pt${n === 1 ? '' : 's'}`,
  skillBought: (name: string) => `Learned: ${name}`,
  owned: 'Owned',
  // Scans
  scan: (p: number) => `Scan ${Math.min(100, p)}%`,
  convert: 'Convert to egg',
  scanFull: (species: string) => `${species} scanned in full. Convert it in the Book.`,
  converted: (species: string) => `An egg of ${species}, from the scans.`,
  convertWhy: { scan: 'Scan it to 100% first.', roster: 'No room in the roster.' } as Record<
    string,
    string
  >,
  // Teams
  team: 'Guard team',
  teamHelp:
    'Join a team for a short run of missions; each one finished earns points and ranks. The board shows your rivals.',
  teamNames: { dawn: 'Dawn', dusk: 'Dusk', dew: 'Dew' } as Record<string, string>,
  joinTeam: (name: string, leader: string) => `Join ${name} (led by ${leader})`,
  teamJoined: (name: string) => `You joined team ${name}.`,
  mission: 'Team mission',
  missionText: {
    expeditions: (n: number) => `Come back from ${plural(n, 'Expedition')}`,
    shells: (n: number) => `Bring home ${n} Shells from Expeditions`,
    raceWin: (n: number) => `Win ${plural(n, 'race')}`,
    karateWin: (n: number) => `Win ${plural(n, 'karate bout')}`,
  } as Record<string, (n: number) => string>,
  missionDone: 'Mission done! Team points earned.',
  rankLabel: (rank: number, points: number) => `Rank ${rank} · ${points} points`,
  board: 'Board',
  // Beetle Run
  tank: 'Beetle Run',
  tankHelp:
    'Drive the cart through the cave. Tap above or below the cart (or press up / down) to change lane, dodge spores, rocks and acid, and fill the cargo with shells, wood and stone before the boss door.',
  tankCargo: (n: number, max: number) => `Cargo ${n}/${max}`,
  tankHits: (n: number) => `Hits ${n}/6`,
  tankWon: (shells: number, wood: number, stone: number) =>
    `Through the door! +${shells} Shells, +${wood} wood, +${stone} stone`,
  tankLost: (shells: number) => `The cart limped home with ${shells} Shells.`,
  tankStart: 'Drive',
  tankBest: (best: number) => `Best haul: ${best} Shells`,
} as const;

/** The Hollow Below. */
export const DUNGEON_TEXT = {
  title: 'The Hollow Below',
  help: 'A cave under the Grove, different every time. Walk over what you find; your party of two fetches what it can reach. Shadow strays snatch Shells unless you feed them a fruit. Tap the stairs to go deeper, or the stairs you came down to head home with everything.',
  today: 'Today’s Hollow',
  todayHelp: 'The same cave for every Keeper today.',
  fresh: 'A new Hollow',
  freshHelp: 'A cave nobody has walked before.',
  party: (names: string[]) =>
    names.length
      ? `Coming along: ${names.join(' and ')}`
      : 'Nobody to bring along yet; you go alone.',
  best: (best: number, runs: number) =>
    runs === 0
      ? 'Never been down.'
      : `Deepest floor ${best} · ${runs} trip${runs === 1 ? '' : 's'}`,
  floor: (n: number) => `Floor ${n}`,
  haul: (shells: number, items: number) => `${items} found · ${shells} Shells`,
  leave: 'Head home',
  entered: (daily: boolean) =>
    daily ? 'Today’s Hollow. Mind the strays.' : 'Down into the dark. Mind the strays.',
  descended: (n: number) => `Floor ${n}. Darker down here.`,
  left: (depth: number, shells: number, items: number) =>
    `Home from floor ${depth} with ${items} finds and ${shells} Shells.`,
  found: (who: string | null, what: string) =>
    who ? `${who} found ${what}!` : `You found ${what}.`,
  lootName: (kind: string, n: number, p: string | null): string => {
    switch (kind) {
      case 'shells':
        return `${n} Shells`;
      case 'stone':
        return `${n} stone`;
      case 'seed':
        return p ? `${aOrAn(p)} seed` : 'a seed';
      case 'essence':
        return p ? `${aOrAn(p)} essence` : 'an essence';
      case 'critter':
        return `a lost ${p ?? 'critter'}`;
      default:
        return 'a lost egg';
    }
  },
  chest: (shells: number, egg: boolean) =>
    `The chest held ${shells} Shells${egg ? ' and an egg!' : '.'}`,
  chestEmpty: 'The chest is empty.',
  strayFed: (name: string) => `${name} stopped being a stray and went up to the square.`,
  strayNeedsFruit: 'A stray. Bring a fruit to win it over.',
  strayStartled: (shells: number) => `A stray snatched ${shells} Shells and ran!`,
  wildScanned: (species: string) => `You crept up on ${aOrAn(species)}. Scanned.`,
  stairsDown: 'Stairs down',
  stairsUp: 'The way home',
  sealed: 'The way down is sealed on this floor.',
  cave: 'The Hollow Below: a cave mouth in the hill.',
  go: 'Go down',
} as const;

/** Save slots on the title screen. */
export const SLOT_TEXT = {
  modes: {
    campaign: 'Hazel’s Grove',
    free: 'Free Grove',
    edu: 'Learning Grove (ages 3–10)',
    hundred: 'The Hundred Days',
    logged: 'Logged In',
    beetle: 'The Beetle Road',
    dawndusk: 'Dawn & Dusk',
  } as Record<string, string>,
  slot: (n: number) => `Slot ${n}`,
  empty: 'Empty',
  newHere: 'New',
  continue: 'Continue',
  erase: 'Erase',
  back: 'Back',
  eraseConfirm: (n: number) => `Erase slot ${n}? This cannot be undone.`,
  newOverConfirm: (n: number) => `Start a new game in slot ${n}? The old one will be erased.`,
  nubbins: (n: number) => (n === 1 ? '1 Nubbin' : `${n} Nubbins`),
  chapter: (n: number) => `Chapter ${n}`,
  age: (n: number | string) => `Age ${n}`,
  ago: (days: number) => (days <= 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`),
  current: (mode: string, n: number) => `Playing ${mode}, slot ${n}.`,
  /** Screen-reader names for the slot buttons, which otherwise all read alike. */
  continueLabel: (mode: string, n: number, summary: string) =>
    `Continue ${mode}, slot ${n}${summary ? `: ${summary}` : ''}`,
  newLabel: (mode: string, n: number) => `Start a new ${mode} in empty slot ${n}`,
  newOverLabel: (mode: string, n: number) => `Start a new ${mode} over slot ${n}`,
} as const;

/** The separate campaigns (sim/storyline.ts): title picks, journal buttons, areas. */
export const STORYLINE_TEXT = {
  chooseSide: 'Which side of the day?',
  sides: { dawn: 'Dawn', dusk: 'Dusk' } as Record<string, string>,
  sideHelp: {
    dawn: 'The Sun Keepers’ half. Four families to serve, a dojo to climb, a mystery from the bright side.',
    dusk: 'The Moon Keepers’ half. The same valley after dark, and the mystery from the other side.',
  } as Record<string, string>,
  locked: (other: string) => `Finish ${other} first.`,
  pathsHelp: (n: number) =>
    n === 1 ? 'One ending.' : `${n} endings. Here is how to reach each one.`,
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
  arrived: (area: string) => `You come to ${area.toLowerCase()}.`,
  degenerated: (name: string) => `${name} has gone back to an egg.`,
  restored: (name: string) => `${name} is grown again, and remembers.`,
} as const;

/** SL2's (Logged In) party bouts (ui/party-bout.ts). */
export const BOUT_TEXT = {
  title: 'Party bout',
  leave: 'Leave',
  left: 'You left the bout.',
  noParty: 'Nobody in the party has hatched yet.',
  round: (n: number, tier: number) => `Round ${n} · Tier ${tier}`,
  party: 'Your party',
  foes: 'Their side',
  hp: 'HP',
  guarding: 'guarding',
  down: 'down',
  moves: { strike: 'Strike', guard: 'Guard', rally: 'Rally' } as Record<string, string>,
  won: 'The party wins.',
  lost: 'The party is down.',
  done: 'Done',
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
export * from './strings-world';
export * from './strings-dungeon';
export * from './strings-move';
export * from './strings-move-joy';
export * from './strings-battle';
export * from './strings-look';
export * from './strings-fun';
