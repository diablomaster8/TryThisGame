import { HOLLOW_KID } from '../content/edu-hollow-kid';
import { R10B3 } from '../config/tuning-r10b3';
import type { SimEvent, World } from '../sim/types';
import { speakLine } from './lesson';

/**
 * Kid mode's read-aloud captions in the Hollow (R0188, lane B r10): a short sprout-band line
 * for each shrine, find, counting berry and tag (`content/edu-hollow-kid.ts`), shown as a
 * toast and spoken with the device's voice. Only in a kid run. Speech follows the game's
 * rules: `speakLine` stays silent until sound is on and unlocked by a first tap, and in a
 * Learning Grove it follows the grown-up's Read aloud (Little Sprouts) or Read to me (Grove
 * Readers) switch. Outside a Learning Grove it reads aloud only when Settings → Sound → "Read everything else
 * aloud" is on (off by default).
 */

/** The caption for one event in a kid run, or null. */
export function hollowKidLine(world: World, e: SimEvent): string | null {
  if (world.location !== 'dungeon' || !world.dungeon?.kid) return null;
  const K = HOLLOW_KID;
  switch (e.kind) {
    case 'shrineUsed':
      return K.shrine[e.shrine] ?? null;
    case 'dungeonFound':
      return K.find[e.loot] ?? null;
    case 'chestOpened':
      return K.find.chest ?? null;
    case 'gearFound':
      return K.find.gear ?? null;
    case 'hollowKid':
      if (e.what === 'berry') return K.berries[e.n - 1] ?? null;
      if (e.what === 'tagStart') return K.tag.start;
      // The last tag also says it runs home: one line, so the voice never cuts itself off.
      return e.n >= R10B3.tag.tags
        ? `${K.tag.tags[K.tag.tags.length - 1]} ${K.tag.home}`
        : (K.tag.tags[e.n - 1] ?? null);
    default:
      return null;
  }
}

/** Whether captions are spoken: the Learning Grove's switch for its band, else the explicit setting. */
export function kidSpeaks(world: World): boolean {
  const e = world.edu;
  if (!e) return world.settings.voicesUi === true;
  return e.band === 'sprout' ? e.readAloud : e.readToMe === true;
}

/** Toast every caption in this batch of events and speak the last one. */
export function hollowKidVoice(world: World, events: SimEvent[], toast: (t: string) => void) {
  let last: string | null = null;
  for (const e of events) {
    const line = hollowKidLine(world, e);
    if (!line) continue;
    toast(line);
    last = line;
  }
  if (last && kidSpeaks(world)) speakLine(last);
}
