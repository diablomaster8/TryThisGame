/** R0511 (TECH-69) and R0474 (TECH-32): the Progress page and the Grove diary. */
const plural = (n: number, one: string, many: string): string => (n === 1 ? one : many);

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
    hatched: (n: number) => `You have hatched ${n} ${plural(n, 'Nubbin', 'Nubbins')}.`,
    firstHatch: (s: number) => `Your first hatch took ${s} seconds.`,
    firstPet: (s: number) => `You gave your first pat after ${s} seconds.`,
    firstFeed: (s: number) => `Your first meal was served after ${s} seconds.`,
    played: (m: number) => `You have played for ${m} minutes.`,
    sessions: (n: number) =>
      n === 1 ? 'This is your first visit.' : `You have visited ${n} times.`,
    longest: (m: number) => `Your longest visit was ${m} minutes.`,
    evolutions: (n: number) => `${n} ${plural(n, 'Nubbin', 'Nubbins')} grew up.`,
    rebirths: (n: number) => `${n} came back reborn.`,
    expeditions: (n: number, best: number) =>
      `${n} ${plural(n, 'Expedition', 'Expeditions')}, best haul ${best} Shells.`,
    races: (n: number) => `${n} ${plural(n, 'race', 'races')} won.`,
  },
  copyDiary: 'Copy my diary',
  copied: 'Diary copied.',
  copyFailed: 'Could not copy. Select the text instead.',
};
