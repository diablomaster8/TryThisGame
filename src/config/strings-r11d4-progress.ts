import { fmt } from './icu';
import { MESSAGES_EN } from './messages-en';
/** R0511 (TECH-69) and R0474 (TECH-32): the Progress page and the Grove diary. */

export const PROGRESS_TEXT = {
  tab: 'Progress',
  title: 'My Grove progress',
  openFromSettings: 'Progress and diary',
  ringsTitle: 'What you have found',
  rings: {
    forms: 'Nubbin forms',
    pocket: 'Pocket line',
    digital: 'Digital line',
    badges: 'Badges',
    races: 'Race courses won',
  } as Record<string, string>,
  of: (a: number, b: number) => `${a} of ${b}`,
  bests: 'Your bests',
  hollowBest: (n: number) => (n > 0 ? `Deepest Hollow level: ${n}` : 'Hollow: not visited yet'),
  expeditionBest: (n: number) =>
    n > 0 ? `Best Expedition: ${n} Shells` : 'Expedition: no run yet',
  diaryTitle: 'My Grove diary',
  diaryPrivate: 'Only on this device. Nothing is ever sent anywhere.',
  diaryEmpty: 'Play a little and this page fills in.',
  line: {
    hatched: (n: number) => fmt(MESSAGES_EN.hatchedCount, { n }),
    firstHatch: (s: number) => `Your first hatch took ${s} seconds.`,
    firstPet: (s: number) => `You gave your first pat after ${s} seconds.`,
    firstFeed: (s: number) => `Your first meal was served after ${s} seconds.`,
    played: (m: number) => `You have played for ${m} minutes.`,
    sessions: (n: number) => fmt(MESSAGES_EN.visits, { n }),
    longest: (m: number) => `Your longest visit was ${m} minutes.`,
    evolutions: (n: number) => fmt(MESSAGES_EN.grewUp, { n }),
    rebirths: (n: number) => `${n} came back reborn.`,
    expeditions: (n: number, best: number) => fmt(MESSAGES_EN.expeditionsBest, { n, best }),
    races: (n: number) => fmt(MESSAGES_EN.racesWon, { n }),
  },
  copyDiary: 'Copy my diary',
  copied: 'Diary copied.',
  copyFailed: 'Could not copy. Select the text instead.',
};
