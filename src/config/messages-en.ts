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
} as const;

/**
 * Translator notes by key. Only strings whose joke or grammar needs one belong here; the
 * plural shapes above need none, since the plural form is the translator's own call.
 */
export const MESSAGE_NOTES: Partial<Record<keyof typeof MESSAGES_EN, string>> = {
  ago: '`yesterday` and `today` are special forms; use the natural words, not a count.',
};
