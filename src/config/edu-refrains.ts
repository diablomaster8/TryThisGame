/**
 * R0323 (FUN-34): the sprout band's join-in refrains. A sprout line that contains one (or
 * names it with `refrain: '<id>'`) shows a big round "Say it!" button; a tap plays the sound
 * and lights a star. `match` is a case-insensitive pattern over the line's text.
 */
import type { SoundName } from '../platform/audio';

export interface Refrain {
  match: RegExp;
  sound: SoundName;
}

export const REFRAINS: Record<string, Refrain> = {
  'lift-push': { match: /lift and push!? lift and push/i, sound: 'creak' },
  'hee-hee': { match: /\bhee,? hee\b/i, sound: 'giggle' },
  'drip-drip': { match: /\bdrip,? drip\b/i, sound: 'drip' },
  'crunch-crunch': { match: /\bcrunch,? crunch\b/i, sound: 'munch' },
  'munch-munch': { match: /\bmunch,? munch\b/i, sound: 'munch' },
  'nom-nom': { match: /\bnom,? nom\b/i, sound: 'munch' },
  'thump-thump': { match: /\bthump,? thump\b/i, sound: 'bonk' },
  'creak-creak': { match: /\bcreak,? creak\b/i, sound: 'creak' },
  'pop-pop': { match: /\bpop!?,? pop\b/i, sound: 'pop' },
  'peep-peep': { match: /\bpeep,? peep\b/i, sound: 'squeak' },
  'hum-hum': { match: /\bhum,? hum\b/i, sound: 'slideUp' },
  'buzz-buzz': { match: /\bbuzz,? buzz\b/i, sound: 'raspberry' },
  'squeak-squeak': { match: /\bsqueak,? squeak\b/i, sound: 'squeak' },
  'splash-splash': { match: /\bsplash,? splash\b/i, sound: 'splash' },
  'ding-dong': { match: /\bding,? (ding|dong)\b/i, sound: 'ding' },
  'bonk-bonk': { match: /\bbonk,? bonk\b/i, sound: 'bonk' },
  'shake-shake': { match: /\bshake,? shake\b/i, sound: 'boing' },
  'click-click': { match: /\bclick!?,? click\b/i, sound: 'tap' },
  sparkly: { match: /\bsparkly!?,? sparkly\b/i, sound: 'ding' },
  'clap-clap': { match: /\bclap,? clap\b/i, sound: 'pat' },
  'slowly-slowly': { match: /\bslowly,? slowly\b/i, sound: 'slideDown' },
};

/** The refrain a sprout line carries: its own `refrain` id, else the first that matches. */
export function refrainOf(text: string, id?: string): Refrain | null {
  if (id && REFRAINS[id]) return REFRAINS[id];
  for (const r of Object.values(REFRAINS)) if (r.match.test(text)) return r;
  return null;
}
