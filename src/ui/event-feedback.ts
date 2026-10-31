/**
 * R0450 (TECH-08): the Grove's event-to-sound table for the moments that were silent: a
 * fruit's thup, a shaken tree's rustle, a throw's "whee", a Nubbin's "nom" as it eats and
 * a soft "hmm" when a tap cannot be reached. Pure, so a test can read it; hud.ts plays it.
 */
import type { SoundName } from '../platform/audio';
import type { SimEvent } from '../sim/types';

export function groveSfx(e: SimEvent): SoundName | null {
  switch (e.kind) {
    case 'fruitDropped':
      return 'thup';
    case 'treeShaken':
      return 'rustle';
    case 'thrown':
      return 'whee';
    case 'ate':
      return 'nom';
    case 'cantReach':
      return 'hmm';
    default:
      return null;
  }
}
