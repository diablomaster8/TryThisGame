/**
 * R0723: what the Grove's real fruit tells the Learning Grove. Two small shared facts, kept
 * here so the noticing moments (edu-noticing.ts), the pointing guide (guide.ts) and the
 * counting do-beat (do-beats.ts) agree without reaching into each other:
 *  - the fruit a noticing moment wants lit up, for a little while;
 *  - how many pieces of fruit the child's Nubbins have really eaten, so a "count the fruit"
 *    beat can credit real fruit instead of only taps.
 * Reads nothing and changes no sim state: the HUD's event loop feeds it.
 */

let highlight: { id: string; untilMs: number } | null = null;
let eaten = 0;
let spent = 0;
const listeners = new Set<() => void>();

/** Light fruit `id` until `untilMs` (a `performance.now()` time). */
export function setNoticeHighlight(id: string, untilMs: number): void {
  highlight = { id, untilMs };
}

/** The item id to point at, or null once the moment is over. */
export function noticeHighlight(nowMs: number): string | null {
  if (highlight && nowMs >= highlight.untilMs) highlight = null;
  return highlight ? highlight.id : null;
}

/** A Nubbin ate a piece of fruit (the sim's `ate` event). */
export function noteFruitEaten(): void {
  eaten += 1;
  for (const l of [...listeners]) l();
}

/** Real fruit eaten and not yet counted by a beat. */
export function fruitAvailable(): number {
  return eaten - spent;
}

/** A beat takes `k` of the real fruit; returns how many it really got (at most `k`). */
export function takeFruit(k: number): number {
  const got = Math.max(0, Math.min(k, eaten - spent));
  spent += got;
  return got;
}

/** Call `cb` after each real fruit eaten; returns the way to stop. */
export function onFruitEaten(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** The count beats whose things are the Grove's fruit (`edu:count:fruit:5`). */
const FRUIT_THINGS: ReadonlySet<string> = new Set(['fruit', 'fruits', 'apples', 'plums']);
export const isFruitThing = (thing: string): boolean => FRUIT_THINGS.has(thing);

/** Test hook: forget everything. */
export function resetGroveNoticed(): void {
  highlight = null;
  eaten = 0;
  spent = 0;
  listeners.clear();
}
