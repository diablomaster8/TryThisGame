import { FERN_STONE } from '../config/tuning';
import type { SimEvent, World } from './types';

/**
 * R0313 (FUN-24): Fern's stone by the signpost. The cairn has one stone per chapter of Hazel's
 * Grove (Fern adds one each chapter), drawn by both renderers from `fernStones`. A tap is a
 * `storyProp` command for `fern-stone`: it notes the chapter it was tapped in (the "Good
 * Stone" badge counts five of them) and asks the HUD for the next line.
 */

/** Stones in the cairn now: the chapter number, capped; none outside Hazel's campaign. */
export function fernStones(world: World): number {
  const c = world.campaign;
  if (!c || c.storyline || c.chapter < 1 || world.location !== 'grove') return 0;
  return Math.min(FERN_STONE.maxStones, c.chapter);
}

/** Chapters in which the stone has been tapped (for the badge and the Journal). */
export function fernStoneChapters(world: World): number {
  const f = world.campaign?.flags ?? {};
  let n = 0;
  for (const k in f) if (k.startsWith('fern-stone-tap:')) n++;
  return n;
}

/** A tap on the stone. Returns true when the command was for it. */
export function tapFernStone(world: World, prop: string, events: SimEvent[]): boolean {
  if (prop !== FERN_STONE.id) return false;
  const c = world.campaign;
  if (!c || fernStones(world) === 0) return true;
  c.flags[`fern-stone-tap:${c.chapter}`] = true;
  const taps = (Number(c.flags['fern-stone-taps']) || 0) + 1;
  c.flags['fern-stone-taps'] = taps;
  events.push({ kind: 'fernStone', line: taps - 1, stones: fernStones(world) });
  return true;
}
