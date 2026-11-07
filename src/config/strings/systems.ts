// The Digimon-inspired ten, the Hollow Below and save slots.
import { fmt } from '../icu';
import { MESSAGES_EN } from '../messages-en';
import { aOrAn } from '../grammar';

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
  // The gentle life cycle (2026-11-02): rebirth readiness and the last day.
  readiness: 'Ready to come back',
  readinessYes: 'Ready: it will be reborn when its time comes.',
  readinessNo: 'Not yet. Pets, fruit and happy days help it come back.',
  graceHint: 'Its last day. Stay close: pets and fruit from your hand count double now.',
  restSoon: (name: string) =>
    `${name} is near the end of this life. Some care now helps it come back.`,
  graceStarted: (name: string) =>
    `${name} is fading softly. Stay close: pets and fruit from your hand count double now.`,
  graceKept: (name: string) => `${name}'s glow steadies. It will come back.`,
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
  skillCost: (n: number) => fmt(MESSAGES_EN.skillCost, { n }),
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
    expeditions: (n: number) => fmt(MESSAGES_EN.backFromExpeditions, { n }),
    shells: (n: number) => `Bring home ${n} Shells from Expeditions`,
    raceWin: (n: number) => fmt(MESSAGES_EN.winRaces, { n }),
    karateWin: (n: number) => fmt(MESSAGES_EN.winBouts, { n }),
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
  best: (best: number, runs: number) => fmt(MESSAGES_EN.hollowBest, { best, runs }),
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
        return p ? fmt(MESSAGES_EN.seedOf, { what: aOrAn(p) }) : 'a seed';
      case 'essence':
        return p ? fmt(MESSAGES_EN.essenceOf, { what: aOrAn(p) }) : 'an essence';
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
  wildScanned: (species: string) => fmt(MESSAGES_EN.wildScanned, { species: aOrAn(species) }),
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
  nubbins: (n: number) => fmt(MESSAGES_EN.nubbins, { n }),
  chapter: (n: number) => `Chapter ${n}`,
  age: (n: number | string) => `Age ${n}`,
  ago: (days: number) => fmt(MESSAGES_EN.ago, { days: Math.max(0, days) }),
  current: (mode: string, n: number) => `Playing ${mode}, slot ${n}.`,
  /** Screen-reader names for the slot buttons, which otherwise all read alike. */
  continueLabel: (mode: string, n: number, summary: string) =>
    `Continue ${mode}, slot ${n}${summary ? `: ${summary}` : ''}`,
  newLabel: (mode: string, n: number) => `Start a new ${mode} in empty slot ${n}`,
  newOverLabel: (mode: string, n: number) => `Start a new ${mode} over slot ${n}`,
} as const;
