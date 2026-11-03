/** Lane C round 11, helper ui (re-exported through strings.ts): journal tabs, markers, ledger. */

export const C11_TEXT = {
  tabs: { now: 'Now', areas: 'Areas', lines: 'Lines', done: 'Done' } as Readonly<
    Record<string, string>
  >,
  tabsLabel: 'Journal pages',
  // R0608: the map's markers, each a shape and a colour name, never colour alone.
  marker: {
    offer: 'Someone has a request here',
    tracked: 'A pinned quest goes on here',
    active: 'A quest is under way here',
    done: 'Everything here is done',
    locked: 'Not open yet',
  } as Readonly<Record<string, string>>,
  markerCount: (n: number) => `${n} here`,
  markerSheetHead: 'Quests here',
  markerState: {
    available: 'New',
    active: 'Under way',
    tracked: 'Pinned',
    done: 'Done',
  } as Readonly<Record<string, string>>,
  // R0635: length and what is left, one voice everywhere.
  size: { S: 'Short', M: 'Medium', L: 'Long' } as Readonly<Record<string, string>>,
  stepsLeft: (step: number, of: number, min: number) =>
    `Step ${step} of ${of} · about ${min} min left`,
  length: (of: number, min: number) => `${of} step${of === 1 ? '' : 's'} · about ${min} min`,
  // R0610: the Now tab.
  nowGoal: 'Your goal',
  nowNothing: 'Nothing pinned. Pick a quest from the board, or just wander.',
  nowOthers: 'Other quests under way',
  expand: 'Show more',
  collapse: 'Show less',
  // R0610: Areas.
  areaCounts: (n: number, a: number, d: number) => `${n} new · ${a} active · ${d} done`,
  areaGo: 'Go there',
  areaNone: 'Nothing here yet.',
  areaBoard: 'On the board',
  // R0663: Story first.
  storyFirst: (n: number, where: string) => `Hazel's story: chapter ${n} is at ${where}`,
  storyFirstEnd: "Hazel's story has reached its ending.",
  storyFirstAnywhere: 'the Grove',
  suggested: (title: string, size: string) => `Suggested next: ${title} (${size})`,
  suggestedNone: 'Suggested next: nothing short is waiting here.',
  // R0641: the ledger.
  ledgerHead: 'Your progress',
  ledgerAll: (pct: number) => `${pct}% of everything open to you`,
  ledgerRegion: (done: number, of: number, endings: number) =>
    `${done}/${of} quests${endings > 0 ? ` · ${endings} ending${endings === 1 ? '' : 's'}` : ''}`,
  ledgerLine: (n: number, of: number, ending: string | null) =>
    ending ? `Finished: ${ending}` : `Chapter ${n} of ${of}`,
  ledgerLineNew: 'Not begun',
  leaf: '🍃',
  leafLabel: 'Played it through',
  leafHelp: 'The leaf marks a quest finished without a skip. Skipping is fine; nothing is lost.',
  // R0666: keepsakes.
  keepsakesHead: 'Keepsakes',
  keepsakesHelp: 'Tap one to watch its story end again. Nothing changes.',
  replay: 'Watch again',
  // R0620: recap.
  recapHead: 'The story so far',
  // R0650: unlock hints.
  unlockHint: (n: number, region: string) => `${region} opens after Chapter ${n}.`,
  // R0651: arrival beat.
  beat: (who: string) => `${who} waves you over.`,
  beatSomeone: 'Someone waves you over.',
  // R0667: compare.
  compare: 'Compare with…',
  compareHead: 'Choices that differ',
  comparePick: 'Compare this slot with:',
  compareSame: 'Every choice we can see is the same.',
  compareNotMade: 'not made yet',
  compareClose: 'Close',
  // R0669: visit.
  visit: 'Visit',
  visitHead: (name: string) => `A visit to ${name}'s Grove`,
  visitHelp: 'You are only looking. Nothing here is changed or saved.',
  visitNubbins: (n: number) => `${n} Nubbin${n === 1 ? '' : 's'}`,
  visitQuests: (n: number) => `${n} quests done`,
  visitChapter: (n: number) => `Chapter ${n}`,
  visitLines: (n: number) => `${n} other road${n === 1 ? '' : 's'}`,
  visitEmpty: "There's nothing to see in this Grove yet.",
  // R0611: the title's fold of separate questline saves.
  roadsHead: 'Separate stories',
  roadsHelp: "Hazel's Grove offers these in its own regions. Their separate saves are still here.",
  pitchTag: 'Questline',
  pitchBegin: 'Begin',
  pitchLater: 'Not now',
  // R0640: first hour.
  firstHourNote: 'The first hour always runs at a gentle pace.',
} as const;
