/**
 * Lane C round 7, the campaign engine's player-facing text (CAMP, re-exported from
 * strings.ts): the journal's questlines beside Hazel's Grove (ui/journal-lines.ts).
 */
export const CAMP_TEXT = {
  linesHead: 'Other roads',
  linesHelp: 'Stories of their own, walked beside Hazel’s. Two at a time.',
  chapterOf: (n: number, of: number, title: string) => `Chapter ${n} of ${of}: ${title}`,
  begin: 'Begin',
  leave: 'Leave this road',
  leaveAsk: (title: string) => `Leave ${title}? Its Nubbins stay in the Grove.`,
  leaveYes: 'Leave it',
  leaveNo: 'Keep going',
  ended: (title: string) => `Ended: ${title}.`,
  again: 'Walk it again',
  refusal: {
    unknown: '',
    noSpine: 'Opens once Hazel’s story has begun.',
    audience: 'Needs Mature content in Settings.',
    early: 'Opens after Hazel’s chapter 2.',
    quiet: 'Waits while the valley is quiet.',
    running: '',
    cap: 'Finish or leave another road first.',
  } as Record<string, string>,
  lineChapter: (title: string, n: number, chapter: string) => `${title}, chapter ${n}: ${chapter}`,
  lineEnded: (title: string, ending: string) => `${title} is over: ${ending}.`,
  restart: 'Start this road again',
  restartAsk: (title: string) =>
    `Start ${title} again from chapter 1? Its Nubbins stay in the Grove.`,
  quiet: 'The valley holds its breath. The other roads wait.',
  confirmClose: 'Close',
  confirmCancel: 'Cancel',
  confirmTitle: 'Are you sure?',
  eraseYes: 'Erase',
  startOverYes: 'Start over',
  importYes: 'Replace it',
  resetYes: 'Reset',
  homeTitle: 'Keep your Grove safe',
  homeBody:
    'Safari can clear a site’s saves after a week away. Add Grove to your Home Screen and it keeps them.',
  homeSteps: 'Tap Share (the square with an arrow), then “Add to Home Screen”.',
  homeOk: 'Got it',
  backupAsk: 'Back up your Grove?',
  backupYes: 'Export',
  backupNo: 'Not now',
} as const;

/** Lane C round 8 (R0602, R0606, R0607): the Open quest flow's offer card, board and setting. */
export const OFFER_TEXT = {
  story: 'Story',
  caper: 'Caper',
  badge: { teen: '13+', adult: '18+' } as Record<string, string>,
  size: {
    S: 'S · about 5 min',
    M: 'M · about 15 min',
    L: 'L · 30 min or more',
  } as Record<string, string>,
  from: (name: string) => `From ${name}`,
  lapse: 'Hazel’s story will remember if you let this go.',
  accept: 'Accept',
  notNow: 'Not now',
  chip: (title: string) => `! ${title}`,
  chipLabel: (title: string) => `An offer is waiting: ${title}. Tap to see it.`,
  rewardIcon: {
    cosmetic: '🎀',
    feature: '✨',
    item: '🎁',
    decor: '🪴',
    title: '🏷',
  } as Record<string, string>,
  atCap: 'You have five quests going. Put one aside to take this on?',
  shelve: (title: string) => `Put aside ${title}`,
  keep: 'Keep them all',
  accepted: (title: string) => `Taken on: ${title}.`,
  boardHead: 'Notice board',
  boardHelp: 'What this place has to offer, what you put off, and what is done.',
  boardHere: (area: string) => `Here: ${area}`,
  boardNowhere: 'Walk up to a place in the Grove to see its board.',
  available: 'Available',
  inProgress: 'In progress',
  shelved: 'Put aside',
  done: 'Done',
  resume: 'Take it up again',
  putAside: 'Put aside',
  track: 'Pin',
  untrack: 'Unpin',
  empty: 'Nothing here yet.',
  flowLabel: 'Quests',
  flowHelp:
    'Open: stories wait where they happen, to take on or put off. Guided: they come to you.',
  flowOptions: {
    open: 'Open: offered where they happen',
    guided: 'Guided: they come to you',
  } as Record<string, string>,
};

/** Lane C round 8 (R0609): the objective chip's tracked quests. */
export const TRACK_TEXT = {
  next: 'Next tracked goal',
  of: (i: number, n: number) => `${i}/${n}`,
  newGoal: (title: string, goal: string) => `${title}: ${goal}`,
};

/** Lane C round 8 (R0632): the "While you were away" screen's Stories block. */
export const AWAY_STORIES_TEXT = {
  head: 'Stories',
  spineWaits: 'Hazel’s story: the next part waits for you.',
  lineWaits: (title: string, n: number) => `${title}: chapter ${n} waits for you.`,
  lineOn: (title: string, n: number) => `${title}: chapter ${n}, as you left it.`,
  quests: (n: number) => (n === 1 ? 'One quest under way.' : `${n} quests under way.`),
};
