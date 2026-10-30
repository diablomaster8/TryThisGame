/**
 * R0674 (KIDS-02): what the Learning Grove's minigames say aloud. The words shown are for the
 * eye (emoji, quote marks); these are for the ear: "How many apples?", "the letter B",
 * "one, two, three". Pure, so the tests can count the utterances a round makes.
 *
 * Who hears what: the sprout band hears the prompt on every round and the reply to every
 * answer, when read-aloud is on. Readers hear nothing unless they press 🔊 or hold an option.
 */
import { EDU_SAY_TEXT } from '../config/strings-kids';
import type { EduOption, EduRound } from '../minigames/edu/games';

const EMOJI = /\p{Extended_Pictographic}️?/gu;

/** A shown line made ready for the voice: counting emoji become words, the rest go. */
export function spoken(text: string): string {
  return (
    text
      // A row of stars is a score to look at, not a word to say.
      .replace(/(\p{Extended_Pictographic}️?)\1+/gu, ' ')
      .replace(EMOJI, (e) => {
        const word = EDU_SAY_TEXT.emoji[e.replace('️', '')];
        return word ? ` ${word} ` : ' ';
      })
      .replace(/["“”]/g, '')
      .replace(/\s+([.,?!])/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

export function numberWord(n: number): string {
  return EDU_SAY_TEXT.numbers[n] ?? String(n);
}

/** "one, two, three": a count said the way a child counts on fingers. */
export function countAloud(n: number): string {
  return Array.from({ length: n }, (_, i) => numberWord(i + 1)).join(', ');
}

/** What a long press on an option says. */
export function optionSay(o: EduOption): string {
  switch (o.kind) {
    case 'colour':
    case 'shape':
    case 'picture':
      return o.label;
    case 'letter':
      return EDU_SAY_TEXT.letter(o.letter);
    case 'number':
      return numberWord(o.n);
    case 'count':
      return countAloud(o.n);
    case 'word':
      return o.word;
  }
}

export type Band = 'sprout' | 'reader';

/** The lines a round says as it opens: the prompt, for a sprout with read-aloud on. */
export function roundSpeech(r: EduRound, band: Band, readAloud: boolean): string[] {
  return band === 'sprout' && readAloud ? [spoken(r.prompt)] : [];
}

/** The line said after an answer (praise, try again, the answer shown), same rule. */
export function replySpeech(shown: string, band: Band, readAloud: boolean): string[] {
  return band === 'sprout' && readAloud ? [spoken(shown)] : [];
}
