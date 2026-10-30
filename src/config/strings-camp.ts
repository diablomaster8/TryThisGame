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
} as const;
