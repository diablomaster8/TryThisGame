/**
 * LOOK-53: a birthmark for about one Nubbin in five, so two of the same form and colour can
 * still be told apart. It is read from the Nubbin's own seed (saved since its egg was laid),
 * never rolled from the sim's generator, so it costs the sim nothing, needs no save field,
 * survives every reload and is the same in both renderers. Three in a hundred carry a rare
 * one on the brow, a little star or heart. "Notch" is a small nick in the crown, like
 * Wisp's ear: a feature, never a wound. Only the Chao line has them; the others wear their
 * species' own markings.
 */
import { BIRTHMARK } from '../config/tuning';
import type { Nubbin } from '../sim/types';

export type BirthmarkKind =
  'spots' | 'stripe' | 'patch' | 'freckles' | 'star' | 'moon' | 'heart' | 'notch';

export interface Birthmark {
  kind: BirthmarkKind;
  /** Which side of the face it sits on, where that matters. */
  side: -1 | 1;
}

const COMMON: readonly BirthmarkKind[] = ['spots', 'stripe', 'patch', 'freckles', 'moon', 'notch'];

function mix(x: number): number {
  let h = (x ^ 0x5eed1e) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}

export function birthmarkOf(n: Pick<Nubbin, 'seed' | 'species' | 'stage'>): Birthmark | null {
  if (n.species !== 'chao' || n.stage === 'egg') return null;
  const h = mix(n.seed);
  const roll = (h % 10000) / 10000;
  if (roll >= BIRTHMARK.chance) return null;
  const side: -1 | 1 = (h >>> 20) & 1 ? 1 : -1;
  if (roll < BIRTHMARK.rareChance) return { kind: (h >>> 16) & 1 ? 'star' : 'heart', side };
  return { kind: COMMON[(h >>> 14) % COMMON.length]!, side };
}

/** The mark as a look-key fragment, '' for none. */
export const birthmarkKey = (m: Birthmark | null): string => (m ? `${m.kind}:${m.side}` : '');
