/**
 * R0739 (KIDS-71): the Learning Grove's child-facing chrome in Japanese, the same keys as the
 * Hebrew slice (the picker, the round buttons, the results and the break screen). Soft,
 * short and mostly hiragana with a few easy kanji, spoken to one child. Round prompts, the
 * grown-up area and the story stay English for now (see PROGRESS). Needs a native speaker's
 * read before it ships to children.
 */
export const EDU_TEXT_JA = {
  play: 'あそんで まなぶ',
  playHelp:
    'ゲームを えらんでね。3かい ためして、そのあと いっしょに こたえを みよう。とけいは ないよ。',
  gameNames: {
    colours: 'いろ',
    letters: 'もじ',
    counting: 'かぞえる',
    shapes: 'かたち',
    sounds: 'おとと ことばあそび',
    animals: 'どうぶつ',
    tracing: 'なぞりがき',
    times: 'かけざん',
    timeMoney: 'とけいと かいがら',
    numbers: 'かずの しくみ',
    reading: 'よんで こたえる',
    science: 'しぜんの なかまわけ',
  },
  gameBlurbs: {
    colours: 'いろを みつけて、いろで なかまわけ しよう。',
    letters: 'もじの なまえ、さいしょの もじ、大きい もじと 小さい もじ。',
    counting: 'かぞえよう。おおい、すくない、ちいさな たしざん。',
    shapes: 'まる、しかく、さんかくと その なかまたち。',
    sounds: 'どうぶつの こえ、さいしょの おと、おなじ ひびき、はくしゅ。',
    animals: 'なまえ、なきごえ、おうち、あかちゃん。',
    tracing: 'もじや すうじ、じぶんの なまえを なぞろう。',
    times: '2から 12までの かけざん。',
    timeMoney: 'とけいを よんで、かいがらで ねだんを つくろう。',
    numbers: 'くらいどり、はんぶん、4ぶんの1、3ぶんの1。',
    reading: 'みじかい おはなしを よんで、だれ・なに・どうしてに こたえよう。',
    science: 'いきものや、うくもの、みず、どうぶつの おうちを わけよう。',
  },
  readerGameNames: {
    counting: 'けいさん',
    letters: 'つづり',
    sounds: 'ライムと リズム',
  },
  readerGameBlurbs: {
    counting: 'たしざんと ひきざん。2けたの けいさんまで。',
    letters: 'えの ことばの ただしい つづりを えらぼう。',
    sounds: 'ひびきが おなじ ことばを よんで、リズムを かぞえよう。',
  },
  tryAgain: 'もういっかい!',
  almost: 'おしい! もういちど みてみよう。',
  showAnswer: 'こたえは これだよ:',
  wellDone: ['よくできました!', 'せいかい!', 'みつけたね!', 'いい 目だね!', 'そのとおり!'],
  nextRound: 'つぎへ',
  leave: 'やめる',
  roundOf: (n: number, total: number) => `${total}もんちゅう ${n}もんめ`,
  finished: (stars: number, max: number) => `ほしが ${max}こ中 ${stars}こ!`,
  sticker: 'ほんに あたらしい シールが ふえたよ!',
  stickers: (n: number) => `シール: ${n}`,
  backToGrove: 'もりへ もどる',
  playAgain: 'もういちど',
  breakTitle: 'ひとやすみ しよう',
  breakBody: 'のびを して、おみずを のんで、まどの そとを みてみよう。もりは まっているよ。',
  breakSay: 'おやすみの じかん。ちょっと ねて、また すぐに あそぼうね。',
  noGames: 'ぜんぶの ゲームが オフに なっているよ。おとなの ひとに オンに してもらってね。',
};
