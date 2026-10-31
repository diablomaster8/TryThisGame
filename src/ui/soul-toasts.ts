/**
 * Lane A round 8 (SOUL): the toasts for the new soul events, by band: the first time a
 * Nubbin shows its favourite or disliked fruit (R0536), a grumpy refusal and a moody look
 * clearing for good (R0532). Pure apart from reading the world, for tests.
 */
import { NAMES } from '../config/strings';
import { MOODY_TEXT, REUNION_TEXT, TASTE_NAMES, TASTE_TOASTS } from '../config/strings-soul-r8';
import {
  BELLY_TEXT,
  PEEK_TEXT,
  SNATCH_TEXT,
  TRAIT_LABELS,
  TRAIT_TOASTS,
} from '../config/strings-soul-r9';
import { likesOf } from '../sim/likes';
import type { SoundName } from '../platform/audio';
import type { SimEvent, World } from '../sim/types';
import { toastBand } from './fun-toasts';

export function soulToast(world: World, e: SimEvent): string | null {
  if (e.kind === 'reunion') {
    const nm = (id: string) => world.nubbins.find((x) => x.id === id)?.name ?? NAMES.creature;
    return REUNION_TEXT[toastBand(world)].replaceAll('{a}', nm(e.a)).replaceAll('{b}', nm(e.b));
  }
  if (e.kind === 'snatched') {
    const nm = (id: string) => world.nubbins.find((x) => x.id === id)?.name ?? NAMES.creature;
    return SNATCH_TEXT[toastBand(world)]
      .replaceAll('{n}', nm(e.nubbinId))
      .replaceAll('{v}', nm(e.victimId));
  }
  // Lane A r9: a trait picked up (R0528), a burp (R0546), a shy one found (R0543).
  if (e.kind === 'traitEarned' || e.kind === 'burp' || e.kind === 'peekFound') {
    const nm = world.nubbins.find((x) => x.id === e.nubbinId)?.name ?? NAMES.creature;
    const band = toastBand(world);
    if (e.kind === 'traitEarned')
      return TRAIT_TOASTS[band].replaceAll('{n}', nm).replaceAll('{t}', TRAIT_LABELS[e.trait].word);
    return (e.kind === 'burp' ? BELLY_TEXT : PEEK_TEXT)[band].replaceAll('{n}', nm);
  }
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
    case 'burp':
      return 'burp';
    case 'peekFound':
      return 'giggle';
    case 'snatched':
      return 'whoosh';
    case 'traitEarned':
      return 'ding';
    default:
      return null;
  }
}
