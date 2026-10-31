import type { AlignmentBand, Nubbin } from '../sim/types';
import { C } from './sprites/palette';
import type { EmoteShape } from './sprites/emote';

/**
 * LOOK-17 (lane E r10): the reaction bubbles take the band's colour, so a Moon Nubbin's
 * heart is a dark red-purple heart and a Sun one's a cyan-white one, not the same rose
 * heart. Neutral keeps the stock colours (the rose heart, the yellow spiral, the ember "!").
 * Both renderers bake the tinted frames once, beside the stock ones, keyed `shape@band`.
 */
export type EmoteBand = AlignmentBand;

/** The shapes drawn in a band's colours. */
export const BANDED_EMOTES: readonly EmoteShape[] = ['heart', 'spiral', 'exclaim'];

/** Each band's tint: the fill, its highlight and its shade (palette indices). */
export const BAND_EMOTE_COLOURS: Record<
  'sun' | 'moon',
  { fill: number; light: number; deep: number }
> = {
  sun: { fill: C.skyLight, light: C.white, deep: C.skyDeep },
  moon: { fill: C.roseDeep, light: C.violet, deep: C.darkPlum },
};

/**
 * Which band's bubbles a Nubbin shows: an Eternal's own band, else an adult's form band.
 * Children keep the stock bubbles (their alignment is only a faint hint).
 */
export function emoteBand(n: Pick<Nubbin, 'eternal' | 'form' | 'stage'>): EmoteBand {
  if (n.eternal) return n.eternal;
  if (n.stage === 'adult' && n.form) return n.form.band;
  return 'neutral';
}

/** The frame name for a shape in a band: `heart@moon`, or the plain shape. */
export function bandedEmote(shape: string, band: EmoteBand): string {
  return band !== 'neutral' && (BANDED_EMOTES as readonly string[]).includes(shape)
    ? `${shape}@${band}`
    : shape;
}
