/**
 * R0540 (SOUL-22), lane A round 10: how a friend chat looks, for both renderers. The speaker
 * shows its picture bubble and the happy clip; the listener stands, its own ball showing; the
 * ending is a laugh (both bounce with a sparkle), a hug (hearts, the love clip) or a huff
 * (puffs). Reduced motion keeps the bubbles and drops the bounce. Render-only.
 */
import { CHAT } from '../config/tuning';
import { chatBeat } from '../sim/chat';
import type { Nubbin } from '../sim/types';
import type { EmoteShape } from './sprites/emote';

const END_SHAPE = { laugh: 'sparkle', hug: 'heart', huff: 'puff' } as const;

export function chatEmote(n: Nubbin, simMs: number): EmoteShape | null {
  const beat = chatBeat(n, simMs);
  if (!beat) return null;
  if (beat.kind === 'speak') return beat.shape as EmoteShape;
  if (beat.kind === 'end') return END_SHAPE[beat.end];
  return null;
}

/** The clip a chatter plays now, or null when not chatting. */
export function chatClip(n: Nubbin, simMs: number): 'happy' | 'idle' | 'love' | null {
  const beat = chatBeat(n, simMs);
  if (!beat) return null;
  if (beat.kind === 'speak') return 'happy';
  if (beat.kind === 'end')
    return beat.end === 'hug' ? 'love' : beat.end === 'laugh' ? 'happy' : 'idle';
  return 'idle';
}

/** The laugh's bounce (world units), or 0. */
export function chatHop(n: Nubbin, simMs: number, reduce: boolean): number {
  if (reduce) return 0;
  const beat = chatBeat(n, simMs);
  if (beat?.kind !== 'end' || beat.end !== 'laugh') return 0;
  const t = simMs - n.behavior.sinceMs - CHAT.turns * CHAT.turnMs;
  return Math.abs(Math.sin((t / 260) * Math.PI)) * 0.14;
}
