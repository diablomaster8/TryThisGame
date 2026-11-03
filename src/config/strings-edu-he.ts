/**
 * R0739 (KIDS-71), first slice: the Learning Grove's child-facing chrome in Hebrew (the
 * picker, the round buttons, the results and the break screen). Plain modern Hebrew without
 * vowel points, addressed to a group ("you", plural) the way a children's app does. Round
 * prompts, the grown-up area and the story stay English for now (see PROGRESS).
 * Needs a native speaker's read before it ships to children.
 */
export const EDU_TEXT_HE = {
  play: 'לשחק וללמוד',
  playHelp: 'בחרו משחק. שלושה ניסיונות, ואז נראה יחד את התשובה. בלי שעון.',
  gameNames: {
    colours: 'צבעים',
    letters: 'אותיות',
    counting: 'ספירה',
    shapes: 'צורות',
    sounds: 'צלילים וחרוזים',
    animals: 'חיות',
    tracing: 'כתיבה',
  },
  gameBlurbs: {
    colours: 'למצוא את הצבע ולמיין לפי צבע.',
    letters: 'שמות אותיות, אות ראשונה, גדולות וקטנות.',
    counting: 'לספור, יותר או פחות, חישובים קטנים.',
    shapes: 'עיגול, ריבוע, משולש וחברים.',
    sounds: 'קולות של חיות, צלילים ראשונים, חרוזים, מחיאות כפיים.',
    animals: 'שמות, קולות, בתים וגורים.',
    tracing: 'לכתוב אותיות, מספרים ואת השם שלכם.',
  },
  tryAgain: 'עוד פעם!',
  almost: 'כמעט. הביטו שוב.',
  showAnswer: 'הנה זה:',
  wellDone: ['כל הכבוד!', 'כן!', 'מצאתם!', 'התבוננות יפה!', 'בדיוק!'],
  nextRound: 'הבא',
  leave: 'יציאה',
  roundOf: (n: number, total: number) => `${n} מתוך ${total}`,
  finished: (stars: number, max: number) => `${stars} מתוך ${max} כוכבים!`,
  sticker: 'מדבקה חדשה לספר שלכם!',
  stickers: (n: number) => `מדבקות: ${n}`,
  backToGrove: 'חזרה לחורשה',
  playAgain: 'שוב',
  breakTitle: 'זמן להפסקה',
  breakBody: 'להתמתח, לשתות מים, להסתכל מהחלון. החורשה תחכה.',
  breakSay: 'זמן למנוחה. נלך לישון קצת ונשחק שוב בקרוב.',
  noGames: 'כל המשחקים כבויים. בקשו ממבוגר להדליק כמה.',
} as const;
