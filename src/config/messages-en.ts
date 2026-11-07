/**
 * R0345 (FUN-56): the English catalogue of ICU messages. A translator replaces this file's
 * values (and can add `few` and `many` forms) with no change to the code that calls them.
 * First slice: the count and plural strings that used to be `n === 1 ? ... : ...` in
 * `strings.ts`. Keys are stable ids; `tn` notes are for translators.
 */
export const MESSAGES_EN = {
  rebirths: '{n, plural, one {# rebirth} other {# rebirths}}',
  called: '{n, plural, =0 {Nobody came.} one {One came running.} other {# came running.}}',
  memorialRebirths: '{n, plural, one {Reborn once} other {Reborn # times}}',
  lessonCount: '{n, plural, one {# lesson} other {# lessons}}',
  skillCost: '{n, plural, one {# pt} other {# pts}}',
  hollowBest:
    '{runs, plural, =0 {Never been down.} one {Deepest floor {best} · # trip} other {Deepest floor {best} · # trips}}',
  nubbins: '{n, plural, one {# Nubbin} other {# Nubbins}}',
  ago: '{days, plural, =0 {today} one {yesterday} other {# days ago}}',
  pathsHelp: '{n, plural, one {One ending.} other {# endings. Here is how to reach each one.}}',
  steps: '{n, plural, one {# step} other {# steps}}',
  awayQuests: '{n, plural, one {One quest under way.} other {# quests under way.}}',
  storiesDone: '{n, plural, one {# story done} other {# stories done}}',
  restoreBackup: 'Restore backup {n}, {saved}',
  restoreConfirm: 'This save goes back to the backup ({saved}). What happened since is lost.',
  checkpoints:
    '{n, plural, =0 {No chapter checkpoints yet.} one {# chapter checkpoint kept.} other {# chapter checkpoints kept.}}',
  deletedRow:
    '{name} · {days, plural, =0 {deleted today} one {deleted # day ago} other {deleted # days ago}}',
  movedBody:
    '{n, plural, one {Your Grove now lives in your profile. The old copy is kept safe on this device.} other {Your # Groves now live in your profile. The old copies are kept safe on this device.}}',
  movedOlder:
    '{n, plural, one {# older save did not fit in 8 slots. They are under Older saves.} other {# older saves did not fit in 8 slots. They are under Older saves.}}',
  restoredSaves: '{n, plural, one {Restored # save.} other {Restored # saves.}}',
  stepsAbout: '{of, plural, one {# step · about {min} min} other {# steps · about {min} min}}',
  ledgerRegion: '{done}/{of} quests{endings, plural, =0 {} one { · # ending} other { · # endings}}',
  otherRoads: '{n, plural, one {# other road} other {# other roads}}',
  savedAgo:
    'Saved {unit, select, second {{n, plural, one {# second} other {# seconds}}} minute {{n, plural, one {# minute} other {# minutes}}} hour {{n, plural, one {# hour} other {# hours}}} day {{n, plural, one {# day} other {# days}}} other {{n} {unit}}} ago',
  unreadableSaves:
    '{n, plural, one {# unreadable save kept aside (Export unreadable save to keep it).} other {# unreadable saves kept aside (Export unreadable save to keep it).}}',
  boxWords: 'Box {n}: {count, plural, one {# word} other {# words}}',
  wordsWaiting: '{n, plural, one {# word is waiting} other {# words are waiting}}',
  wordsPractised: '{n, plural, one {You practised # word!} other {You practised # words!}}',
  questCount: '{n, plural, one {# quest} other {# quests}}',
  openThe: 'Open the {what}',
  banked: 'Bank it! {n, plural, one {# find} other {# finds}} safely home.',
  endConfirm:
    '{n, plural, =0 {End the trip from level {depth}?} one {End the trip? # unbanked find goes home with you.} other {End the trip? # unbanked finds go home with you.}}',
  hatchedNames: '{n, plural, one {{first} hatched!} other {{init} and {last} hatched!}}',
  hatchShell:
    '{n, plural, one {There is a bit of shell on their head.} other {They are both wearing a bit of shell.}}',
  stones: '{n, plural, one {One stone.} other {# stones.}}',
  starsSay: 'You got {stars, plural, one {# star} other {# stars}}! {name} is so happy.',
  hatchedCount: 'You have hatched {n, plural, one {# Nubbin} other {# Nubbins}}.',
  visits: '{n, plural, one {This is your first visit.} other {You have visited # times.}}',
  grewUp: '{n, plural, one {# Nubbin grew up.} other {# Nubbins grew up.}}',
  expeditionsBest:
    '{n, plural, one {# Expedition, best haul {best} Shells.} other {# Expeditions, best haul {best} Shells.}}',
  racesWon: '{n, plural, one {# race won.} other {# races won.}}',
  moveCards: '🃏 {n, plural, one {# new move card} other {# new move cards}}',
  yawnyStart: '{name} is {state} and starts with little Puff.',
  itemOwn: '{by} has a {item}.',
  itemGive: '{by} gives {to} a {item}.',
  learning: '{name} is learning {cls}.',
  learned: '{name} learned {cls}!',
  feelsToday: '{name} feels {word} today.',
  interacted: '{name} liked that ({action}).',
  awayEvolved: '{name} grew up into {form}.',
  secondEvolved: '{name} grew {type} side.',
  speciesGrew: '{name} grew into {species}!',
  lessonStarted: '{name} is in {lesson} lesson.',
  lessonDone: '{name} finished {lesson} (level {level})!',
  crafted: 'Made {item}.',
  arrived: 'You come to {area}.',
  winRaces: 'Win {n, plural, one {# race} other {# races}}',
  takePhoto: 'Take a photo of {what}',
  visitNeighbours: 'Visit {n, plural, one {# neighbour} other {# neighbours}}',
  makeThings: 'Make {n, plural, one {# thing} other {# things}} in the workshop',
  finishLessons: 'Finish {n, plural, one {# lesson} other {# lessons}}',
  backFromExpeditions: 'Come back from {n, plural, one {# Expedition} other {# Expeditions}}',
  goDownFloors: 'Go down {n, plural, one {# floor} other {# floors}} in the Hollow',
  winBouts: 'Win {n, plural, one {# karate bout} other {# karate bouts}}',
  seedOf: '{what} seed',
  essenceOf: '{what} essence',
  wildScanned: 'You crept up on {species}. Scanned.',
} as const;

/**
 * Translator notes by key. Only strings whose joke or grammar needs one belong here; the
 * plural shapes above need none, since the plural form is the translator's own call.
 */
export const MESSAGE_NOTES: Partial<Record<keyof typeof MESSAGES_EN, string>> = {
  ago: '`yesterday` and `today` are special forms; use the natural words, not a count.',
};
