/**
 * Lane A round 8 (SOUL): the toasts for the new soul events, by band: the first time a
 * Nubbin shows its favourite or disliked fruit (R0536), a grumpy refusal and a moody look
 * clearing for good (R0532). Pure apart from reading the world, for tests.
 */
import { NAMES } from '../config/strings';
import { MOODY_TEXT, TASTE_NAMES, TASTE_TOASTS } from '../config/strings-soul-r8';
import { likesOf } from '../sim/likes';
import type { SoundName } from '../platform/audio';
import type { SimEvent, World } from '../sim/types';
import { toastBand } from './fun-toasts';

export function soulToast(world: World, e: SimEvent): string | null {
  if (e.kind !== 'fruitTaste' && e.kind !== 'moodyCleared' && e.kind !== 'highFiveRefused')
    return null;
  const n = world.nubbins.find((x) => x.id === e.nubbinId);
  const name = n?.name ?? NAMES.creature;
  const band = toastBand(world);
  if (e.kind === 'fruitTaste') {
    if (!e.first || !n) return null;
    const l = likesOf(n);
    const fruit = TASTE_NAMES[e.taste === 'yum' ? l.fruit : l.dislike];
    return TASTE_TOASTS[e.taste][band].replaceAll('{n}', name).replaceAll('{f}', fruit);
  }
  if (e.kind === 'highFiveRefused') return MOODY_TEXT.refused[band].replaceAll('{n}', name);
  return MOODY_TEXT.cleared[e.was][band].replaceAll('{n}', name);
}

/** R0552 (SOUL-35): the synth sound for an antic or a soul moment, or null. */
export function soulSound(e: SimEvent): SoundName | null {
  switch (e.kind) {
    case 'antic':
      return e.antic === 'trip'
        ? 'boing'
        : e.antic === 'sneeze'
          ? 'sneeze'
          : e.antic === 'hiccup'
            ? 'hiccup'
            : 'giggle';
    case 'fruitTaste':
      return e.taste === 'yum' ? 'munch' : 'raspberry';
    case 'pranked':
      return 'pop';
    case 'comforted':
      return 'pet';
    case 'highFiveRefused':
      return 'squeak';
    default:
      return null;
  }
}
