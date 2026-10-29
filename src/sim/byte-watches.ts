import { BYTE_WATCHES } from '../config/tuning';
import type { CampaignState } from './types';

/**
 * R0314 (FUN-25): Byte's stopwatches, counted on the race results card. Races entered from
 * chapter 5 of Hazel's Grove are counted in a campaign flag; the count of watches is read
 * from it, so nothing new is saved and old saves start at four.
 */
export const BYTE_RACES_FLAG = 'byte-watch-races';

/** A race was entered: count it once Byte has his first four. */
export function noteByteRace(c: CampaignState): void {
  if (c.storyline || c.chapter < BYTE_WATCHES.fromChapter) return;
  c.flags[BYTE_RACES_FLAG] = (Number(c.flags[BYTE_RACES_FLAG]) || 0) + 1;
}

/** Byte's stopwatches after `races` counted races (null before chapter 5). */
export function byteWatches(c: CampaignState | null, extra = 0): number | null {
  if (!c || c.storyline || c.chapter < BYTE_WATCHES.fromChapter) return null;
  const races = (Number(c.flags[BYTE_RACES_FLAG]) || 0) + extra;
  return Math.min(BYTE_WATCHES.cap, BYTE_WATCHES.start + Math.floor(races / BYTE_WATCHES.racesPer));
}
