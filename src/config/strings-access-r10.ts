/**
 * Lane E round 10 strings: reading and touch access (R0709 KIDS-41, R0710 KIDS-42), the
 * grown-up heads-up before the loss chapters (R0694 KIDS-26) and the co-play tips deck
 * (R0740 KIDS-72).
 */

/** KIDS-41 and KIDS-42: Settings rows, also shown in the grown-up area. */
export const ACCESS_TEXT = {
  heading: 'Reading and touch',
  fontLabel: 'Reading font',
  fonts: { default: 'Standard', readable: 'Easy to read (wider spacing)' },
  contrastLabel: 'Contrast',
  contrasts: { normal: 'Normal', high: 'High (black and white)' },
  simpleTouch: 'Simple touch',
  simpleTouchHelp:
    'One tap does it: tap an egg to shake it, tap a Nubbin to pet it. No pinch, drag or hold.',
  textSizeHint: 'Text size is in Settings, under Text size.',
} as const;

const LOSS_SIDE_NAMES: Record<string, string> = {
  s10: 'Fourteen Months',
  s19: 'Cinder’s Last Light',
  s27: 'Some Nubbin',
};

/** KIDS-26: the heads-up card and the grown-up area's section. */
export const LOSS_TEXT = {
  noticeTitle: 'A grown-up moment',
  noticeBody: (story: string) =>
    `${story} is about saying goodbye. It is gentle, and best read with a grown-up nearby.`,
  together: 'We are together now: play it',
  later: 'Not yet',
  heading: 'Stories about loss',
  help: 'These stories talk plainly and gently about a friend dying. You choose how each one starts.',
  chapterRow: (chapter: number) => `Chapter ${chapter}`,
  storyLabel: (key: number | string): string =>
    typeof key === 'number' ? `Chapter ${key}` : (LOSS_SIDE_NAMES[key] ?? 'This story'),
  holds: {
    together: 'Play when we are together',
    play: 'Let it play',
    released: 'Started together',
  },
  guideHeading: 'Talking about loss',
  guide: [
    'Use the plain words: "died" and "not coming back". Softer words can confuse a small child.',
    'Let them ask the same question many times. Repeating is how they understand.',
    'It is fine to say you feel sad too. Showing feelings teaches that they are safe.',
    'Remember together: a favourite thing the friend did, a picture, a flower on the hill.',
    'Keep the day ordinary afterwards. Meals, play and bedtime as usual are a comfort.',
  ],
  waitingChip: 'This chapter is waiting for a grown-up',
} as const;

/** KIDS-72: the co-play tips deck. `{name}` is the child; `{items}` the things they are learning. */
export const EDU_TIPS = {
  heading: 'Grown-up tips',
  prev: '‹ Back',
  next: 'More ›',
  page: (n: number, of: number) => `${n} of ${of}`,
  /** Keyed by the kind of item still being learned (`letter:G`, `count:7` ...). */
  weak: {
    letter: [
      '{name} is working on {items}. Spot them on cereal boxes or signs today.',
      'Draw {items} in the air, big, and let {name} guess which one.',
      'Find something at home that starts with {items}, and say the sound together.',
    ],
    count: [
      '{name} is practising {items}. Count stairs, spoons or socks to those numbers.',
      'Clap {items} times together, slowly, and count out loud.',
      'Lay out that many pieces of fruit, and let {name} check them by touching each one.',
    ],
    colour: [
      '{name} is learning {items}. Go on a colour hunt round the room.',
      'Ask "What else is that colour?" at mealtimes, with {items} in mind.',
      'Sort laundry or toys by colour together, starting with {items}.',
    ],
    shape: [
      '{name} is learning {items}. Look for them in windows, plates and doors.',
      'Make {items} with fingers, string or playdough.',
      'Trace {items} on a steamy window or in sand.',
    ],
  },
  /** Keyed by the area of an enabled game. */
  domain: {
    cognition: [
      'Ask "How do you know?" after a right answer.',
      'Play "what comes next?" with a pattern of spoons and forks.',
      'Let {name} set the table and count the places.',
    ],
    literacy: [
      'Say the letter sound together, not just its name.',
      'Point to the words as you read a bedtime story.',
      'Write {name}’s name together and find its first letter on a shop sign.',
    ],
    language: [
      'Let them teach you the rhyme.',
      'Play "I hear with my little ear" with sounds round the house.',
      'Make up a silly word that rhymes with a Nubbin’s name.',
    ],
    nature: [
      'Look for one real animal or bird outside today and talk about where it lives.',
      'Ask which Grove critter {name} would like to meet, and why.',
      'Watch a snail, an ant or a pigeon together for one quiet minute.',
    ],
  },
  general: [
    'Count things around the room after the game.',
    'Play side by side for five minutes and let {name} lead.',
    'Ask about the Nubbin: "What does it like? How did it feel today?"',
    'Stop while it is still fun. A short happy session beats a long tired one.',
    'Praise the trying, not the being right: "You kept looking!"',
    'Retell a story scene together in your own words afterwards.',
  ],
} as const;

/** R0718 (KIDS-50), R0717 (KIDS-49), R0745 (KIDS-77): the tabbed grown-up area and report. */
export const GROWN_UP_TEXT = {
  tabsLabel: 'Grown-up area sections',
  tabs: { child: 'Child', time: 'Time', content: 'Content', progress: 'Progress' },
  weekTitle: 'Minutes played this week',
  weekNone: 'No play counted yet this week.',
  weekBar: (day: string, minutes: number) => `${day}: ${minutes} min`,
  today: 'Today',
  attentionTitle: 'How long each game holds attention',
  attentionHelp: 'Counted on this device only. Nothing is sent anywhere.',
  attentionNone: 'No games played yet.',
  attentionRow: (name: string, game: string, secs: number) =>
    `${name} plays ${game} for about ${secs < 90 ? `${secs} seconds` : `${Math.round(secs / 60)} minutes`}`,
  attentionCounts: (opens: number, done: number, quits: number) =>
    `${opens} started · ${done} finished · ${quits} left early`,
  gameStandardsTitle: 'What the games practise',
  printButton: 'Print or save as PDF',
  printTitle: (name: string) => `Learning Grove report${name ? ` for ${name}` : ''}`,
  topicFold: (topic: string, met: number, all: number) => `${topic}: ${met} of ${all} met`,
  matureNote: 'Mature content is never offered in a Learning Grove.',
  yourChild: 'your child',
} as const;

/**
 * R0717 (KIDS-49): every standard code the Learning Grove uses, in plain words for a parent.
 * The grown-up report shows these with the code in small print; content-check fails on a code
 * used in content or `EDU_ROUND_STANDARDS` that has no label here.
 */
export const STANDARD_LABELS: Readonly<Record<string, string>> = {
  'ELOF: Approaches to Learning': 'Curiosity, focus and sticking with things',
  'ELOF: Social and Emotional Development': 'Feelings, friendships and getting along',
  'ELOF: Language and Communication': 'Listening, talking and new words',
  'ELOF: Literacy': 'Letters, books and early reading',
  'ELOF: Mathematics Development': 'Numbers, shapes and patterns',
  'ELOF: Scientific Reasoning': 'Noticing, sorting and asking why',
  'ELOF: Perceptual, Motor, and Physical Development': 'Moving, looking and body control',
  'CASEL: Self-awareness': 'Knowing their own feelings',
  'CASEL: Self-management': 'Calming down and waiting',
  'CASEL: Social awareness': 'Seeing how others feel',
  'CASEL: Relationship skills': 'Sharing, helping and making up',
  'CASEL: Responsible decision-making': 'Making kind, careful choices',
  'K.CC.A.1': 'Counts to 100 by ones and tens',
  'K.CC.B.4': 'Matches counting to how many',
  'K.CC.B.5': 'Counts objects to answer "how many?"',
  'K.CC.C.6': 'Says which group has more or fewer',
  'K.OA.A.1': 'Adds and takes away with objects',
  'K.OA.A.2': 'Solves small add and take-away stories',
  'K.MD.A.2': 'Compares two things: taller, heavier, more',
  'K.MD.B.3': 'Sorts things into groups and counts them',
  'K.G.A.1': 'Words for where things are: above, below, beside',
  'K.G.A.2': 'Names shapes, whatever their size or turn',
  '1.OA.A.1': 'Adds and subtracts in stories up to 20',
  '1.MD.B.3': 'Tells the time in hours and half hours',
  '1.G.A.3': 'Halves and quarters of shapes',
  '2.OA.A.1': 'Adds and subtracts in stories up to 100',
  '2.OA.C.3': 'Odd and even numbers',
  '2.MD.A.1': 'Measures length with a ruler',
  '2.MD.C.7': 'Tells the time to five minutes',
  '2.MD.D.10': 'Reads picture graphs and bar graphs',
  '3.OA.A.1': 'Multiplying as equal groups',
  '3.OA.A.3': 'Multiplies and divides in stories',
  '3.OA.D.8': 'Solves two-step problems',
  '4.NBT.B.4': 'Adds and subtracts bigger numbers',
  '3.NF.A.1': 'Simple fractions: halves, thirds, quarters',
  '3.NF.A.3': 'Fractions that are the same size',
  '3.MD.A.1': 'Time to the minute, and how long things take',
  '3.MD.B.3': 'Picture and bar graphs with a scale',
  '3.MD.C.7': 'Area of rectangles',
  '3.MD.D.8': 'Distance round a shape (perimeter)',
  '4.OA.C.5': 'Number and shape patterns that follow a rule',
  '4.MD.A.1': 'Units: metres, grams, minutes',
  '4.MD.A.2': 'Problems with distance, time and weight',
  '4.G.A.3': 'Lines of symmetry',
  'RF.K.1d': 'Knows the letters of the alphabet',
  'RF.K.2': 'Hears rhymes, syllables and first sounds',
  'RF.K.3a': 'Matches letters to their sounds',
  'RL.K.3': 'Talks about characters, places and what happened',
  'RL.1.4': 'Notices words for feelings and senses',
  'RL.2.3': 'Says how characters react to what happens',
  'RL.2.4': 'Hears rhythm, rhyme and repeated lines',
  'RL.3.3': 'Explains what characters are like and why they act',
  'RL.3.6': 'Tells their own view from a character’s',
  'RL.4.2': 'Finds what a story is really about',
  'RL.4.3': 'Describes a character or place in detail',
  'L.2.4': 'Works out new words',
  'L.3.4': 'Words with more than one meaning',
  'L.4.5': 'Similes and metaphors',
  'SL.K.1': 'Takes turns in a conversation',
  'K-PS3-1': 'Sunlight warms the ground',
  'K-LS1-1': 'What plants and animals need to live',
  'K-ESS2-1': 'Weather changes over days',
  'K-ESS2-2': 'Plants and animals change their homes',
  'K-ESS3-1': 'Animals live where their needs are met',
  'K-ESS3-3': 'Looking after land, water and living things',
  '1-PS4-1': 'Sound comes from things shaking',
  '1-PS4-2': 'We see things when there is light',
  '1-LS1-2': 'Parents help their young survive',
  '1-LS3-1': 'Young are like their parents, but not the same',
  '1-ESS1-1': 'Patterns of the Sun, Moon and stars',
  '1-ESS1-2': 'Days are longer or shorter through the year',
  '2-PS1-1': 'Sorts materials by what they are like',
  '2-PS1-4': 'Some heating and cooling can be undone, some can’t',
  '2-LS2-1': 'Plants need water and light',
  '2-LS2-2': 'Animals spread seeds and pollen',
  '2-LS4-1': 'Different places, different life',
  '2-ESS1-1': 'The Earth changes, fast or slow',
  '2-ESS2-2': 'Maps of land and water',
  '2-ESS2-3': 'Water as ice and as liquid',
  '3-PS2-1': 'Pushes and pulls that balance or don’t',
  '3-LS1-1': 'Life cycles',
  '3-LS2-1': 'Animals in groups help each other',
  '3-LS3-1': 'Traits passed down, and differences',
  '3-LS4-1': 'Fossils tell us about the past',
  '3-LS4-3': 'Some living things suit a place better',
  '3-LS4-4': 'Solving problems when a place changes',
  '3-ESS2-1': 'Weather through the seasons',
  '4-PS3-2': 'Energy moves as sound, light, heat and electricity',
  '4-PS3-4': 'Machines that change energy',
  '4-LS1-1': 'Body parts that help animals survive',
  '4-LS1-2': 'How animals sense the world',
  '4-ESS1-1': 'Rock layers show how places changed',
  '4-ESS2-1': 'Weathering and erosion',
  '4-ESS2-2': 'Reading maps of hills, rivers and coasts',
  '5-ESS1-2': 'Shadows, day and night, and the seasons’ stars',
  'K-2-ETS1-1': 'Spots a problem to solve',
  '3-5-ETS1-2': 'Compares ways to solve a problem',
  'D2.His.2.K-2': 'Life long ago and today',
  'D2.Geo.2.K-2': 'Maps and places',
  'D2.Civ.8.K-2': 'Fairness, rules and respect',
  'D2.Eco.1.K-2': 'Not enough of something means choosing',
  'D2.His.2.3-5': 'How life changed over time',
  'D2.Geo.2.3-5': 'Maps of places and regions',
  'D2.Civ.8.3-5': 'Fair rules in everyday life',
  'D2.Eco.1.3-5': 'Choices have costs and benefits',
};

/** The plain label for a code, or the code itself when none is known. */
export function standardLabel(code: string): string {
  return STANDARD_LABELS[code] ?? code;
}
