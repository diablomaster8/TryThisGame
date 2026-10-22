/**
 * Which story chunks a slot needs before its first frame, and which can follow after boot.
 *
 * - A save with a story in it (Hazel's Grove, a separate campaign, or a Free or Learning
 *   Grove where one was started) waits for the campaign, side-story and storyline chunks:
 *   save.ts drops queued scene ids the registry does not know, and catch-up runs the side
 *   stories' rules.
 * - A Free Grove with no story never reads those scripts (every side-story rule takes the
 *   campaign state, which it has none of, and only the campaign queue plays scenes), so it
 *   boots at once and the chunks load in the background, ready for the debug panel's Start.
 * - A Learning Grove also waits for its own band's edu chunk, and for the band of any lesson
 *   it has already played (the grown-up progress view lists them), never the other band.
 */
import type { EduBand } from './content/types';
import { readSave, type SaveSlot } from './platform/storage';
import { loadEduScripts, loadStoryScripts } from './sim/story-scenes';

const BANDS: readonly EduBand[] = ['sprout', 'reader'];
const isBand = (v: unknown): v is EduBand => BANDS.includes(v as EduBand);

/** What the stored save says about its story and its Learning Grove bands; null if unreadable. */
export function storyNeeds(json: string): { story: boolean; bands: EduBand[] } | null {
  try {
    const w = (JSON.parse(json) as { world?: unknown }).world as {
      campaign?: unknown;
      edu?: { band?: unknown; lessons?: Record<string, unknown> } | null;
    } | null;
    if (!w || typeof w !== 'object') return null;
    const bands = new Set<EduBand>();
    if (w.edu) {
      if (isBand(w.edu.band)) bands.add(w.edu.band);
      for (const id of Object.keys(w.edu.lessons ?? {})) {
        const band = id.split(':')[0];
        // A lesson id without a band prefix cannot say where it came from: load every band.
        if (isBand(band)) bands.add(band);
        else for (const b of BANDS) bands.add(b);
      }
    }
    return { story: w.campaign !== null && w.campaign !== undefined, bands: [...bands] };
  } catch {
    return null;
  }
}

/**
 * The chunks the current slot waits for before it boots (rejects when one fails to load, so
 * the caller shows the update notice). `freshBand` is a new Learning Grove's chosen band.
 */
export function storyChunksBeforePlay(slot: SaveSlot, freshBand: EduBand | null): Promise<void> {
  const json = readSave();
  // An unreadable save is treated as needing everything, as before.
  const needs = json === null ? { story: false, bands: [] } : storyNeeds(json);
  if (slot.mode === 'free' && needs && !needs.story) {
    loadStoryScripts().catch(() => undefined);
    return Promise.resolve();
  }
  if (slot.mode !== 'edu') return loadStoryScripts();
  const bands = new Set<EduBand>(needs ? needs.bands : BANDS);
  if (freshBand) bands.add(freshBand);
  // A Learning Grove save with no band recorded starts in sprout (sim/edu.ts `eduStart`).
  if (bands.size === 0) bands.add('sprout');
  return Promise.all([loadStoryScripts(), loadEduScripts([...bands])]).then(() => undefined);
}
