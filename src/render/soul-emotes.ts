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
      return null;
    default:
      return null;
  }
}
