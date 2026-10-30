/**
 * R0310 (FUN-21): the sprout band's sound words. A child joins in on these, so read-aloud
 * plays the matching sound right after it says the word, and the line shows the word in a
 * bubbly face. The content checker counts scenes that have one (target: every scene).
 * Words are matched whole, case-insensitive, with any repeated letters ("plooop") folded.
 */
import type { SoundName } from '../platform/audio';

export const SOUND_WORDS: Record<string, SoundName> = {
  plop: 'plop',
  pop: 'pop',
  splash: 'splash',
  splish: 'splash',
  boing: 'boing',
  creak: 'creak',
  squeak: 'squeak',
  achoo: 'sneeze',
  atishoo: 'sneeze',
  hic: 'hiccup',
  munch: 'munch',
  crunch: 'munch',
  chomp: 'munch',
  nom: 'munch',
  slurp: 'gulp',
  gulp: 'gulp',
  whoosh: 'whoosh',
  swish: 'whoosh',
  whee: 'slideUp',
  wheee: 'slideUp',
  bonk: 'bonk',
  thump: 'bonk',
  ding: 'ding',
  dong: 'ding',
  pitter: 'drip',
  drip: 'drip',
  hee: 'giggle',
  giggle: 'giggle',
  pfft: 'raspberry',
  zoom: 'whoosh',
  crack: 'pop',
  peep: 'squeak',
  tweet: 'squeak',
  buzz: 'raspberry',
};

/** The sound words in a line, in order (`hee-hee` gives `hee` twice). */
export function soundWordsIn(text: string): string[] {
  const out: string[] = [];
  for (const m of text.toLowerCase().matchAll(/[a-z]+/g)) {
    const w = m[0];
    if (SOUND_WORDS[w]) out.push(w);
    else {
      // Folded repeats: "plooop" → "plop", "wheeee" → "whee".
      const folded = w.replace(/(.)\1+/g, '$1$1');
      const once = w.replace(/(.)\1+/g, '$1');
      if (SOUND_WORDS[folded]) out.push(folded);
      else if (SOUND_WORDS[once]) out.push(once);
    }
  }
  return out;
}
