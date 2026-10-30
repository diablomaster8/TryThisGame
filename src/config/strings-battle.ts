import { FUMBLE_TEXT, FUSION_TEXT } from './strings-battle-r6';
import type { BattleEvent, Combatant, MoodStat, StatusId, TraitId } from '../sim/battle/types';
import type { NubbinType } from '../sim/types';
import { moveName } from './strings-battle-moves';

export { BATTLE_MOVE_TEXT, moveName } from './strings-battle-moves';

/**
 * Every player-facing word of the battle screens, kept apart from `strings.ts` so the combat
 * lane can grow without touching the shared file; `strings.ts` re-exports it. The sim's log
 * holds events; `formatEvent` turns one into a line. Nobody is ever knocked out here: a
 * Nubbin at 0 HP is tuckered out and naps under a leaf blanket, and a rival yawns, waves and
 * toddles home (recs FIGHT-05).
 */
export type BattleLang = 'en' | 'he' | 'ja';

/** Rival names by slot. The dojo uses slots 0–2 (one per tier), party foes the rest. */
export const BATTLE_NAMES: Record<BattleLang, readonly string[]> = {
  en: ['Bramble', 'Tusk', 'Needle', 'Glitch', 'Proxy', 'Null', 'Daemon', 'Cursor', 'Packet'],
  he: ['אטד', 'ניב', 'מחט', 'גליץ׳', 'פרוקסי', 'נאל', 'דימון', 'סמן', 'חבילה'],
  ja: [
    'イバラ',
    'キバ',
    'ハリ',
    'グリッチ',
    'プロキシ',
    'ヌル',
    'デーモン',
    'カーソル',
    'パケット',
  ],
};

/** The first party-foe slot in `BATTLE_NAMES`. */
export const FOE_NAME_BASE = 3;

export function foeName(slot: number, lang: BattleLang = 'en'): string {
  const list = BATTLE_NAMES[lang];
  return list[slot] ?? list[slot % list.length] ?? 'Rival';
}

/** A combatant's shown name: an ally's own, a rival's from its slot. */
export function combatantName(c: Combatant, lang: BattleLang = 'en'): string {
  return c.name ?? foeName(c.foeName, lang);
}

export const BATTLE_TEXT = {
  partyTitle: 'Party bout',
  leave: 'Leave',
  left: 'You left the bout. No result recorded.',
  noParty: 'Nobody in the party has hatched yet.',
  round: (n: number, tier: number) => `Round ${n} · Tier ${tier}`,
  party: 'Your party',
  foes: 'Their side',
  hp: 'HP',
  guarding: 'guarding',
  tuckered: 'tuckered out',
  wentHome: 'went home',
  moves: { strike: 'Bonk', guard: 'Catch your breath', rally: 'Huddle' } as Record<string, string>,
  puff: 'Puff',
  /** A move button: its name and Puff cost. */
  cost: (n: number) => (n === 0 ? 'free' : `${n} Puff`),
  needPuff: 'Not enough Puff',
  yawny: 'Yawny',
  next: 'Next up',
  help: 'Types',
  bigOne: 'Big one!',
  strongHit: "It's a good match-up!",
  weakHit: "It's a poor match-up.",
  who: 'Who? Tap a foe.',
  cancel: 'Back',
  partyWon: 'The party wins! Everyone on their side has toddled home.',
  partyLost: "Everyone's tuckered out. Snack break!",
  draw: 'A long bout. Everyone agrees to call it a draw.',
  done: 'Done',
  prize: (n: number, currency: string) => `+${n} ${currency}`,
  // The dojo.
  karateWon: (name: string) => `${name} wins the bout!`,
  karateLost: (name: string) => `${name} is tuckered out. Snack break, then try again.`,
  karateDraw: (name: string) => `${name} and the rival bow. A draw.`,
  tapMiddle: 'TAP IN THE MIDDLE',
  pow: 'POW!',
  hitWord: 'hit',
  miss: 'MISS',
  zzz: 'Zzz',
  bye: 'bye!',
  /** For screen readers: the bout's state in one line. */
  status: (a: string, ahp: number, b: string, bhp: number) => `${a} ${ahp} · ${b} ${bhp}`,
} as const;

/** Statuses: an icon and a word each, never colour alone (recs FIGHT-15). */
export const STATUS_TEXT: Record<StatusId, { icon: string; name: string }> = {
  drowsy: { icon: '💤', name: 'Drowsy' },
  dizzy: { icon: '💫', name: 'Dizzy' },
  soggy: { icon: '💧', name: 'Soggy' },
  giggly: { icon: '😆', name: 'Giggly' },
  peckish: { icon: '🍎', name: 'Peckish' },
  sticky: { icon: '🍯', name: 'Sticky' },
};

/** Moods by stat and direction. */
export const MOOD_TEXT: Record<MoodStat, { up: string; down: string; icon: string }> = {
  bonk: { up: 'Pumped', down: 'Sulky', icon: '💪' },
  guard: { up: 'Puffed up', down: 'Flustered', icon: '🛡' },
  zip: { up: 'Zoomy', down: 'Dawdly', icon: '💨' },
  acc: { up: 'Sharp-eyed', down: 'Shy-eyed', icon: '👀' },
};

export function moodWord(stat: MoodStat, stage: number): string {
  const t = MOOD_TEXT[stat];
  return `${t.icon} ${stage > 0 ? t.up : t.down}${Math.abs(stage) > 1 ? ' ×2' : ''}`;
}

/** Grade traits (recs FIGHT-12): the S name, and what the A version is called. */
export const TRAIT_TEXT: Record<TraitId, { name: string; blurb: string }> = {
  slippery: { name: 'Slippery', blurb: 'The first status on it slides off.' },
  featherlight: { name: 'Featherlight', blurb: 'Floats over moves along the ground.' },
  headStart: { name: 'Head Start', blurb: 'Acts first on the first turn.' },
  heavyHugger: { name: 'Heavy Hugger', blurb: 'Hugs push foes back further (tactics bouts).' },
  secondWind: { name: 'Second Wind', blurb: 'Once a bout, keeps going on 1 HP.' },
};
export const TRAIT_HALF = (name: string): string => `${name} (half)`;

/** The Bout row on the stats sheet. */
export const BOUT_TEXT_SHEET = {
  title: 'Bout',
  level: 'Lv',
  hp: 'HP',
  bonk: 'Bonk',
  splash: 'Splash',
  guard: 'Guard',
  zip: 'Zip',
  flutter: 'Flutter',
  puff: 'Puff',
  traits: 'Traits',
  noTraits: 'No traits yet: an A or S grade gives one.',
  slots: 'Moves',
  known: 'Known moves',
  pick: 'Tap a slot, then a move.',
  empty: 'empty',
  record: (w: number, l: number) => `Bouts won ${w} · lost ${l}`,
  learned: (name: string, move: string) => `${name} learned ${move}!`,
  swapIn: (name: string, move: string) =>
    `${name} learned ${move}! Swap it in from the stats sheet.`,
};

/** The type wheel help card (recs FIGHT-13): built from the loop so the words match the maths. */
export const TYPE_WORDS: Record<NubbinType, { icon: string; name: string; verb: string }> = {
  swim: { icon: '🌊', name: 'Swim', verb: 'soaks' },
  fly: { icon: '🪶', name: 'Fly', verb: 'flies over' },
  run: { icon: '👟', name: 'Run', verb: 'outruns' },
  power: { icon: '💪', name: 'Power', verb: 'out-splashes' },
  normal: { icon: '⭐', name: 'Normal', verb: '' },
};
export const TYPE_HELP = {
  title: 'Who beats who',
  beats: (a: NubbinType, b: NubbinType) =>
    `${TYPE_WORDS[a].icon} ${TYPE_WORDS[a].name} ${TYPE_WORDS[a].verb} ${TYPE_WORDS[b].icon} ${TYPE_WORDS[b].name}`,
  normal: '⭐ Normal is steady: it hits everyone the same and is hit the same.',
  even: 'Swim and Run, and Fly and Power, are evenly matched.',
  sunMoon: '☀ Sun moves land harder on Moon Nubbins, and 🌙 Moon moves on Sun ones.',
  eternal: 'Eternals take the same from everything.',
  close: 'Got it',
};

/** One log event as a line, or null for events the log does not show. */
export function formatEvent(e: BattleEvent, name: (id: string) => string): string | null {
  switch (e.k) {
    case 'hit': {
      const tail = e.crit
        ? ` ${BATTLE_TEXT.bigOne}`
        : (e.eff ?? 1) > 1
          ? ` ${BATTLE_TEXT.strongHit}`
          : (e.eff ?? 1) < 1
            ? ` ${BATTLE_TEXT.weakHit}`
            : '';
      return `${name(e.to)} takes ${e.dmg}${e.guarded ? ' (braced)' : ''}.${tail}`;
    }
    case 'miss':
      return e.float ? `${name(e.to)} floats right over it.` : `${name(e.to)} slips aside.`;
    case 'guard':
      return `${name(e.by)} catches their breath.`;
    case 'rally':
      return `${name(e.by)} feels better (+${e.heal}).`;
    case 'use':
      return `${name(e.by)} uses ${moveName(e.move)}!`;
    case 'status':
      return e.on
        ? `${name(e.to)} is ${STATUS_TEXT[e.id].icon} ${STATUS_TEXT[e.id].name}.`
        : `${name(e.to)} is no longer ${STATUS_TEXT[e.id].name}.`;
    case 'shrug':
      return `${name(e.to)} shrugs it off.`;
    case 'mood':
      return `${name(e.to)} feels ${moodWord(e.stat, e.delta)}.`;
    case 'skip':
      return e.why === 'drowsy'
        ? `${name(e.who)} is dozing. ${BATTLE_TEXT.zzz}`
        : `${name(e.who)} can't stop giggling!`;
    case 'boing':
      return `${name(e.who)} spins round and bonks themself. Boing!`;
    case 'peckish':
      return `${name(e.who)}'s tummy rumbles.`;
    case 'trait':
      return `${name(e.who)}: ${TRAIT_TEXT[e.id].name}!`;
    case 'decoy':
      return e.by === e.to
        ? `${name(e.by)} draws a doodle of themself.`
        : `${name(e.by)} bonks the doodle instead!`;
    case 'yawny':
      return `${name(e.who)} is ${BATTLE_TEXT.yawny.toLowerCase()} and starts with little Puff.`;
    case 'turnStart':
    case 'turnEnd':
      return null;
    case 'tuckered':
      return e.side === 0
        ? `${name(e.who)} is tuckered out and naps under a leaf.`
        : `${name(e.who)} yawns, waves and toddles home.`;
    case 'round':
      return null;
    case 'end':
      return null;
    default:
      return formatRound3(e, name);
  }
}

/** The full-screen battle screen, the party sheet, the dojo and the Circuit (round 3). */
export const BATTLE_SCREEN_TEXT = {
  back: '‹ Back',
  leaveAsk: 'Leave the bout? Nothing is won or lost.',
  leaveYes: 'Leave',
  leaveNo: 'Stay',
  swap: 'Swap',
  item: 'Item',
  breath: 'Breath',
  hug: 'Hug',
  speed: (n: number) => `×${n}`,
  speedLabel: 'Playback speed',
  pickNext: 'Who goes next?',
  swapTitle: 'Swap in',
  itemTitle: 'Use an item',
  noItems: 'Nothing in your bag.',
  onWho: (item: string) => `${item}: on who?`,
  calm: 'Calm',
  calmIcon: '🕊',
  waiting: 'Watching…',
  yourTurn: (name: string) => `What will ${name} do?`,
  tapToSkip: 'Tap to skip',
  matchGood: '×1.5',
  matchPoor: '×0.67',
  results: 'Bout over',
  won: 'You win!',
  lost: "Everyone's tuckered out. Snack break!",
  hugged: 'A play-fight hug! Everyone had fun.',
  friends: 'They decided to come home with you!',
  draw: 'A long bout. Call it a draw.',
  newFriend: (name: string) => `${name} came home with you.`,
  calmed: (name: string, calm: number) => `${name}: Calm ${calm}/100`,
  backToGrove: 'Back to the Grove',
  /** Gentle bouts: the glowing move's hint. */
  hint: (move: string, word: string) => `Try ${move}! ${word}`,
  hintWord: {
    swim: 'Swim soaks Fly!',
    fly: 'Fly flies over Run!',
    run: 'Run outruns Power!',
    power: 'Power out-splashes Swim!',
    normal: 'A good bonk!',
  } as Record<string, string>,
  swingTap: 'Tap in the middle for a Power swing!',
  swingSweet: 'Power swing!',
  items: {
    fruit: { icon: '🍎', name: 'Fruit' },
    'fruit:swim': { icon: '🫐', name: 'Swim fruit' },
    'fruit:fly': { icon: '🍐', name: 'Fly fruit' },
    'fruit:run': { icon: '🍊', name: 'Run fruit' },
    'fruit:power': { icon: '🍓', name: 'Power fruit' },
    'fruit:stamina': { icon: '🍑', name: 'Stamina fruit' },
    'fruit:sun': { icon: '☀', name: 'Sun fruit' },
    'fruit:moon': { icon: '🌙', name: 'Moon fruit' },
    toy: { icon: '🧸', name: 'Toy' },
  } as Record<string, { icon: string; name: string }>,
  // The party sheet (recs FIGHT-19).
  partyTitle: 'Pick your party',
  partyHelp: 'Up to three. The first one starts.',
  partyGo: 'Start the bout',
  partyNone: 'Pick at least one.',
  battleLevel: (n: number) => `Lv ${n}`,
  // The dojo (recs FIGHT-28).
  dojoTitle: 'Dojo bouts',
  dojoHelp: 'Turn-based singles. Win a tier to earn its belt.',
  circuit: 'Grove Circuit',
  circuitHelp: 'Win a ribbon from each Keeper. Tier by tier.',
  champion: 'Champion',
  mirror: 'Mirror match',
  ribbon: '🎀',
  noRibbon: '○',
  ribbons: (n: number) => `Ribbons ${n}/10`,
  playFight: '🤗 Play-fight',
  gentle: 'Gentle bouts',
  gentleHelp: 'Foes go easy, nobody is tuckered, every move is free.',
} as const;

/** Event lines for the new events (FIGHT-19 to FIGHT-24). */
export function formatRound3(e: BattleEvent, name: (id: string) => string): string | null {
  const T = BATTLE_SCREEN_TEXT;
  switch (e.k) {
    case 'swap':
      return `${name(e.to)} swaps in for ${name(e.from)}!`;
    case 'item': {
      const it = T.items[e.item];
      return e.by === e.to
        ? `${name(e.by)} has a ${it?.name.toLowerCase() ?? e.item}.`
        : `${name(e.by)} gives ${name(e.to)} a ${it?.name.toLowerCase() ?? e.item}.`;
    }
    case 'calm':
      return e.delta >= 0 ? `${name(e.to)} looks calmer.` : `${name(e.to)} looks wary.`;
    case 'befriend':
      return `${name(e.who)} decides to come home with you!`;
    case 'play':
      return `${name(e.who)} is busy playing with the toy.`;
    case 'cuddle':
      return `${name(e.who)} needs a cuddle. A free fruit! (+${e.heal})`;
    case 'swing':
      return e.sweet ? T.swingSweet : null;
    case 'unhurt':
      return `${name(e.to)} isn't hurt. Maybe try kindness?`;
    case 'bark':
      return e.text;
    case 'fumble':
      return FUMBLE_TEXT(name(e.who));
    case 'fusion':
      return e.on ? FUSION_TEXT.on(name(e.who)) : FUSION_TEXT.off(name(e.who));
    default:
      return null;
  }
}
export * from './strings-tactics';

/**
 * Round 5 comedy (recs FIGHT-75): spare lines for the events players see most, at least two
 * per kind and three per personality for a tuck-in, so a long bout does not repeat itself.
 * `{a}` is the one acting or tuckered, `{b}` the one it was aimed at. `sim/battle/lines.ts`
 * picks one per log entry from the bout's seed, so a replay reads the same.
 */
export type QuipKind =
  | 'miss'
  | 'missFloat'
  | 'boing'
  | 'shrug'
  | 'tuckered'
  | 'tuckeredCheerful'
  | 'tuckeredShy'
  | 'tuckeredMischievous'
  | 'tuckeredLazy'
  | 'foeHome'
  | 'wildHome';

export const BATTLE_QUIPS: Record<BattleLang, Record<QuipKind, readonly string[]>> = {
  en: {
    miss: [
      '{a} bonks the air with great confidence.',
      '{b} was never there. {a} looks round, puzzled.',
      '{a} misses by a whisker and pretends that was the plan.',
    ],
    missFloat: ['{b} floats right over it.', '{b} drifts up and over, humming.'],
    boing: [
      '{a} spins round and bonks themself. Boing!',
      '{a} gets dizzy and walks into a friendly tree.',
    ],
    shrug: ['{a} shrugs it off.', '{a} has decided not to notice.'],
    tuckered: [
      '{a} is tuckered out and naps under a leaf.',
      '{a} sits down hard, yawns, and that is that.',
    ],
    tuckeredCheerful: [
      '{a} waves from the ground.',
      '{a} lies on its back and smiles at the sky.',
      '{a} is tuckered out but still waving both arms.',
    ],
    tuckeredShy: [
      '{a} hides inside its own ears.',
      '{a} curls up behind a leaf and peeks out.',
      '{a} decides the grass needs a closer look. Lying down.',
    ],
    tuckeredMischievous: [
      '{a} pretends to be tuckered. Then actually is.',
      '{a} flops over with a wink. The wink turns into a snore.',
      '{a} sneaks off for a nap and is caught snoring.',
    ],
    tuckeredLazy: [
      '{a} was going to lie down anyway.',
      '{a} lies down. It had been meaning to all day.',
      "{a} declares it nap o'clock and obeys at once.",
    ],
    foeHome: [
      '{a} remembers it left the kettle on.',
      '{a} yawns, waves and toddles home.',
      '{a} has to be home for tea. Bye!',
    ],
    wildHome: [
      "{a}'s mother collects it, glaring at nobody in particular.",
      '{a} scampers back to its burrow for a nap.',
      '{a} trots home to tell everyone about you.',
    ],
  },
  he: {
    miss: ['{a} חובט באוויר בביטחון רב.', '{b} בכלל לא היה שם. {a} מסתכל סביב, מבולבל.'],
    missFloat: ['{b} מרחף מעל זה.', '{b} עולה ועובר מעל, מזמזם.'],
    boing: ['{a} מסתובב ונחבט בעצמו. בוינג!', '{a} מסוחרר ונתקל בעץ ידידותי.'],
    shrug: ['{a} מושך בכתפיים.', '{a} החליט לא לשים לב.'],
    tuckered: ['{a} עייף ונרדם מתחת לעלה.', '{a} מתיישב, מפהק, וזהו.'],
    tuckeredCheerful: [
      '{a} מנופף מהרצפה.',
      '{a} שוכב על הגב ומחייך לשמיים.',
      '{a} עייף, אבל עדיין מנופף בשתי הידיים.',
    ],
    tuckeredShy: [
      '{a} מתחבא בתוך האוזניים של עצמו.',
      '{a} מתכרבל מאחורי עלה ומציץ.',
      '{a} מחליט שהדשא צריך מבט מקרוב. בשכיבה.',
    ],
    tuckeredMischievous: [
      '{a} מעמיד פנים שהוא עייף. ואז באמת עייף.',
      '{a} נופל עם קריצה. הקריצה הופכת לנחירה.',
      '{a} מתגנב לתנומה ונתפס נוחר.',
    ],
    tuckeredLazy: [
      '{a} בין כה וכה רצה לשכב.',
      '{a} נשכב. הוא תכנן את זה כל היום.',
      '{a} מכריז על שעת תנומה ומציית מיד.',
    ],
    foeHome: ['{a} נזכר שהשאיר את הקומקום דולק.', '{a} מפהק, מנופף והולך הביתה.'],
    wildHome: ['אמא של {a} אוספת אותו, כועסת על אף אחד.', '{a} רץ חזרה למחילה לתנומה.'],
  },
  ja: {
    miss: [
      '{a}は じしんまんまんで くうきを ポカッ。',
      '{b}は もう いなかった。{a}は きょろきょろ。',
    ],
    missFloat: ['{b}は ふわっと とびこえた。', '{b}は はなうたまじりに ふわり。'],
    boing: [
      '{a}は くるくる まわって じぶんに ポカッ。ボヨン!',
      '{a}は ふらふらして きに ぶつかった。',
    ],
    shrug: ['{a}は へっちゃら。', '{a}は きにしない ことに した。'],
    tuckered: [
      '{a}は へとへと。はっぱの したで おひるね。',
      '{a}は すわりこんで あくび。おしまい。',
    ],
    tuckeredCheerful: [
      '{a}は じめんから てを ふっている。',
      '{a}は あおむけで そらに にっこり。',
      '{a}は へとへと。でも りょうてを ふっている。',
    ],
    tuckeredShy: [
      '{a}は じぶんの みみの なかに かくれた。',
      '{a}は はっぱの かげで まるくなって のぞいている。',
      '{a}は くさを よく みたく なった。ねころんで。',
    ],
    tuckeredMischievous: [
      '{a}は つかれた ふり。そして ほんとうに つかれた。',
      '{a}は ウインクして たおれた。ウインクが いびきに なった。',
      '{a}は こっそり おひるね。いびきで ばれた。',
    ],
    tuckeredLazy: [
      '{a}は どうせ ねころぶ つもりだった。',
      '{a}は ねころんだ。いちにちじゅう そう したかった。',
      '{a}は おひるねの じかんを せんげんして すぐ ねた。',
    ],
    foeHome: [
      '{a}は やかんを かけっぱなしだと おもいだした。',
      '{a}は あくびして てを ふって かえっていった。',
    ],
    wildHome: [
      '{a}の おかあさんが むかえに きた。だれにともなく にらんでいる。',
      '{a}は すあなに かけもどって おひるね。',
    ],
  },
};

/** Fills `{a}` and `{b}` in a quip. */
export function fillQuip(line: string, a: string, b = ''): string {
  return line.replaceAll('{a}', a).replaceAll('{b}', b);
}
