/**
 * R0318 (FUN-29): one tip per load, never the same twice running, filtered to what this
 * player may see: their band, the chapter they have reached (no spoilers) and the Mature
 * content level. With no world yet (the first veil), only ungated main-band tips.
 */
import { TIPS, type Tip, type TipBand } from '../config/tips';
import type { World } from '../sim/types';
import { toastBand } from './fun-toasts';

let last = '';
let turn = 0;

/** The tips this world may show. */
export function tipsFor(world: World | null): Tip[] {
  const band: TipBand = world ? toastBand(world) : 'main';
  const c = world?.campaign;
  const chapter = c && !c.storyline ? c.chapter : 0;
  const mature = world?.settings.matureContent ?? 'off';
  return TIPS.filter(
    (t) =>
      (t.bands ?? ['main', 'reader']).includes(band) &&
      (t.minChapter ?? 0) <= chapter &&
      (!t.mature || mature === 'adult' || (t.mature === 'teen' && mature === 'teen')),
  );
}

/** The next tip: picked in a stride through the pool, skipping the last one shown. */
export function nextTip(world: World | null, seed = Date.now()): string {
  const pool = tipsFor(world);
  if (pool.length === 0) return '';
  turn = (turn + 1 + (seed % 7)) % pool.length;
  let t = pool[turn]!;
  if (t.text === last && pool.length > 1) t = pool[(turn + 1) % pool.length]!;
  last = t.text;
  return t.text;
}
