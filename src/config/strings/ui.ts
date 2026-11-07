// The main UI text (UI_TEXT) and formatDuration.
import { fmt } from '../icu';
import { MESSAGES_EN } from '../messages-en';
import { aOrAn, ordinal } from '../grammar';

import { UI_TEXT_MORE } from './ui-more';

const UI_TEXT_CORE = {
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
  rebirths: (n: number) => fmt(MESSAGES_EN.rebirths, { n }),
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
  awayEvolved: (name: string, form: string) =>
    fmt(MESSAGES_EN.awayEvolved, { name, form: aOrAn(form) }),
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
  place: (p: number) => `${ordinal(p)} place`,
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
  voicesStory: 'Story voices',
  voicesStoryHelp:
    'Reads the story’s lines and choices aloud. Off by default outside the Learning Grove.',
  voicesUi: 'Read everything else aloud',
  voicesUiHelp: 'Menus, cards, captions and prompts. Separate from the story voices.',
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
  secondEvolved: (name: string, type: string) =>
    fmt(MESSAGES_EN.secondEvolved, { name, type: aOrAn(type) }),
  speciesGrew: (name: string, species: string) =>
    fmt(MESSAGES_EN.speciesGrew, { name, species: aOrAn(species) }),
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
  interacted: (name: string, action: string) =>
    fmt(MESSAGES_EN.interacted, { name, action: action.toLowerCase() }),
  called: (n: number) => fmt(MESSAGES_EN.called, { n }),
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
} as const;

export const UI_TEXT = { ...UI_TEXT_CORE, ...UI_TEXT_MORE } as const;

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
