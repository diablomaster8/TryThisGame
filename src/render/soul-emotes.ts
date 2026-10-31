/**
 * Lane A round 9 (SOUL): the emote ball for the new acts, ahead of the mood's own. A hiding
 * shy one shows no ball (that would give it away, R0543); a hum and a giggle fit show a note
 * (R0528); a snatch runs off with a cheeky spiky ball (R0545); a burp puffs (R0546); and a
 * call for attention asks: a "?" for the Keeper, a "!" under a tree, a "zz" rubbing its eyes
 * (R0559). Render-only.
 */
import type { Nubbin } from '../sim/types';
import type { EmoteShape } from './sprites/emote';

export function soulEmote(n: Nubbin): EmoteShape | null {
  const id = n.behavior.itemId ?? '';
  switch (n.behavior.state) {
    case 'perform':
      if (id === 'peekTree') return n.behavior.target ? 'question' : 'none';
      if (id === 'giggle') return 'note';
      if (id === 'burp') return 'puff';
      if (id.startsWith('snatch')) return 'spiky';
      // R0542: sharing carries a heart over; hoarding is a spiky business.
      if (id.startsWith('share')) return 'heart';
      if (id.startsWith('hoard')) return 'spiky';
      // R0560: jealous: asking to be picked up too, or a cheeky nudge.
      if (id === 'askUp') return 'heart';
      if (id.startsWith('nudge:')) return 'spiky';
      // R0538 (lane A r10): rivals huff at each other; making up is a hug.
      if (id === 'rivalPuff') return 'puff';
      if (id === 'makeUpHug') return 'heart';
      // R0542 (lane A r10): tidying a toy home, and the pleased look after.
      if (id.startsWith('tidy')) return 'star';
      return null;
    case 'wander':
      if (id === 'hum') return 'note';
      if (id === 'inspect') return 'exclaim';
      if (id === 'callKeeper') return 'question';
      if (id === 'callFruit') return 'exclaim';
      return null;
    case 'sit':
      if (id === 'tug') return 'question';
      if (id === 'callFruit') return 'exclaim';
      if (id === 'rubEyes') return 'zz';
      if (id === 'watchJealous') return 'puff';
      if (id === 'hoardSit') return 'spiky';
      return null;
    default:
      return null;
  }
}
