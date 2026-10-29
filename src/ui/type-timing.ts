/**
 * R0302 (FUN-13): the dialogue typewriter's comic timing, kept apart from the DOM so it can
 * be tested: how long to hold after a stretch of text, and whose voice blips.
 */
import { TYPE_TIMING, VOICES, type BlipVoice } from '../config/tuning-fun';
/** R0302: a speaker's blip voice, or null for a silent one. */
export function voiceOf(who: string): BlipVoice | null {
  return who in VOICES ? (VOICES[who] ?? null) : VOICES.default!;
}

/**
 * R0302: how long the typewriter holds after the first `n` characters of `text`: a beat
 * after a sentence end, a longer one after an ellipsis or a dash that trails off, a short
 * one after a comma. Only when a space or the line's end follows, so "3.5" types straight.
 */
export function pauseAfter(text: string, n: number): number {
  if (n >= text.length) return 0;
  const c = text[n - 1]!;
  const next = text[n]!;
  if (!/[\s"”’)]/.test(next)) return 0;
  const p = TYPE_TIMING.pauses;
  if (c === '…' || (c === '.' && text[n - 2] === '.')) return p.trail;
  if (c === '—' || c === '–') return p.trail;
  if (c === '.' || c === '!' || c === '?') return p.stop;
  if (c === ',' || c === ';') return p.comma;
  return 0;
}
