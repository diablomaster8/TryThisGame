import { VO_FROZEN } from './vo-frozen';

/** R0344: a short stable hash of a line's text (FNV-1a, 32 bits, hex), for frozen voice-over ids. */
export function lineHash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

/** The frozen voice-over id of a line recorded first, found by its text; undefined otherwise. */
export function frozenVoId(text: string): string | undefined {
  return VO_FROZEN[lineHash(text)];
}
