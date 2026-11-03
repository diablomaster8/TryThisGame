/** R0701: the language review game's words ("Ori's Word Pond", "Hana's Word Garden"). */
export const LANG_REVIEW_TEXT = {
  title: { hebrew: "Ori's Word Pond", japanese: "Hana's Word Garden" } as Record<string, string>,
  button: 'Word game',
  due: (n: number) => (n === 1 ? '1 word is waiting' : `${n} words are waiting`),
  prompt: 'Which picture is it?',
  hear: 'Hear it again',
  right: ['Yes!', 'That is it!', 'You remembered!'],
  wrong: 'Nearly. This one!',
  allDone: 'All caught up. Come back soon!',
  done: (n: number) => (n === 1 ? 'You practised 1 word!' : `You practised ${n} words!`),
  back: 'Back',
  say: { right: 'Yes!', wrong: 'Nearly. This one!', done: 'Well done!' },
} as const;
