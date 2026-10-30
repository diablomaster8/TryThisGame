/**
 * R0315 (FUN-26): every badge's title and dry blurb, out of the sim. Titles are saved as the
 * Keeper's chosen title, so the 20 original ones keep their exact words. `silly` marks the
 * joke badges, which the profile can filter on. Re-exported through `strings-fun.ts`.
 */
export interface BadgeText {
  title: string;
  blurb: string;
  silly?: true;
}

export const ACHIEVEMENT_TEXT: Record<string, BadgeText> = {
  firstHatch: { title: 'Warm Hands', blurb: 'An egg hatched. You were warm about it.' },
  firstEvolve: { title: 'Grown', blurb: 'Somebody grew up. They did most of the work.' },
  rebirth: { title: 'Again and Again', blurb: 'Reborn, and pleased to see you again.' },
  eternal: { title: 'Timeless', blurb: 'One of yours will never get old. Lucky them.' },
  raceWin: { title: 'Fast Friend', blurb: 'First across the line. Nobody fell in the pond.' },
  raceTier3: { title: 'Champion', blurb: 'The hardest tier, won. Byte timed it twice.' },
  blackBelt: { title: 'Black Belt', blurb: 'A black belt, and still bows to the scarecrow.' },
  bonded: { title: 'Slow Hands', blurb: 'A grey one trusted you. Slowly is the only way.' },
  lanterns: { title: 'Lantern Lighter', blurb: 'All four lanterns lit. Sparks only singed one.' },
  bred: { title: 'Matchmaker', blurb: 'Two Nubbins, one egg, a lot of blushing.' },
  decorated: { title: 'Gardener', blurb: 'Ten things placed just so. Then moved twice.' },
  orchard: { title: 'Orchardist', blurb: 'Three trees in full fruit. Mind your head.' },
  crafter: { title: 'Tinker', blurb: 'You made a thing. It mostly works.' },
  halfBook: { title: 'Collector', blurb: 'Half the book filled in. The other half is shy.' },
  fullBook: { title: 'Keeper of Every Kind', blurb: 'Every page of the book. Every single one.' },
  friends: { title: 'Good Company', blurb: 'Two of yours became friends without being asked.' },
  neighbour: { title: 'Neighbourly', blurb: 'A gift to the neighbours. They will bring a pie.' },
  wild: { title: 'Habitat Maker', blurb: 'A wild one moved in. It brought nothing.' },
  explorer: { title: 'Explorer', blurb: 'Six landmarks found. The map is getting crowded.' },
  storyEnd: { title: 'Hazel’s Heir', blurb: 'The Grove is yours now. It always was.' },
  // The joke badges (none for throwing, neglect or loss).
  gravity: {
    title: 'Gravity Demonstration',
    blurb: 'A fruit landed on a head. Science.',
    silly: true,
  },
  patter: {
    title: 'Professional Patter',
    blurb: 'A hundred pets. Your hand knows the way.',
    silly: true,
  },
  ruleFour: {
    title: 'Rule Four',
    blurb: 'Ten meals by hand. Nobody was Sparks about it.',
    silly: true,
  },
  bonkAppetit: {
    title: 'Bonk Appetit',
    blurb: 'Hit by a fruit, ate the fruit. Fair.',
    silly: true,
  },
  neverEver: {
    title: 'Never, Ever',
    blurb: 'A Nubbin grew up and nobody was ever thrown. Rule two.',
    silly: true,
  },
  stopwatchSix: {
    title: 'Stopwatch Six',
    blurb: 'Byte has six stopwatches. You helped.',
    silly: true,
  },
  goodStone: {
    title: 'Good Stone',
    blurb: 'Said hello to Fern’s stone in five chapters.',
    silly: true,
  },
  liftAndPush: {
    title: 'Lift and Push',
    blurb: 'The gate sticks. You know the trick.',
    silly: true,
  },
  snackDiplomacy: {
    title: 'Snack Diplomacy',
    blurb: 'Three strays won over with food.',
    silly: true,
  },
  whoopsADaisy: {
    title: 'Whoops-a-daisy',
    blurb: 'Two bonks on the scenery. The scenery is fine.',
    silly: true,
  },
  legDay: {
    title: 'Leg Day',
    blurb: 'Ten Expeditions. Somebody’s legs are very small.',
    silly: true,
  },
  springStep: {
    title: 'Spring in the Step',
    blurb: 'Ten boings on a mushroom. Boing.',
    silly: true,
  },
  shakeItOff: {
    title: 'Shake It Off',
    blurb: 'Twenty-five trees shaken. They have forgiven you.',
    silly: true,
  },
  eggWhisperer: {
    title: 'Egg Whisperer',
    blurb: 'Ten gentle shakes. It’s had worse.',
    silly: true,
  },
  puddlePerson: {
    title: 'Puddle Person',
    blurb: 'You went in the water. On purpose, you said.',
    silly: true,
  },
  skidMark: { title: 'Skid Mark', blurb: 'Five skids. The grass has notes.', silly: true },
  lookAThing: { title: 'Look, a Thing', blurb: 'Spotted something from up high.', silly: true },
  tickleMonster: {
    title: 'Tickle Monster',
    blurb: 'Twenty tickles. Someone has hiccups.',
    silly: true,
  },
  highFiveClub: {
    title: 'High Five Club',
    blurb: 'Ten high fives. Some even hit your hand.',
    silly: true,
  },
  hugMileage: { title: 'Hug Mileage', blurb: 'Fifty hugs. That’s a lot of squish.', silly: true },
  smallTalk: {
    title: 'Small Talk',
    blurb: 'Thirty chats with the neighbours. Mostly weather.',
    silly: true,
  },
  heardItBefore: {
    title: 'He’s Heard It Before',
    blurb: 'Ten taps on Fern’s stone. The stone is very patient.',
    silly: true,
  },
  openHouse: {
    title: 'Open House',
    blurb: 'Five visitors at the gate. Put the kettle on.',
    silly: true,
  },
  hatTrick: { title: 'Hat Trick', blurb: 'Three dye jobs. Fashion is a journey.', silly: true },
  downTheHole: {
    title: 'Down the Hole',
    blurb: 'Went down into the Hollow. Came back up, too.',
    silly: true,
  },
};

/** Profile: the joke-badge filter's label. */
export const BADGE_FILTER_TEXT = { all: 'All', silly: 'Silly' } as const;
