/**
 * Every Atlas page's script, gathered for the runner. Imported only through
 * `loadAtlas()` so the pages stay in their own lazy chunk.
 *
 * Pages are found by file name (`content/atlas-aNN.ts`), so a page joins the atlas when
 * its script lands. Each file exports its quests as `ATLAS_ANN` and its variant scenes
 * under a name ending in `VARIANTS` (some files shorten it to `ANN_VARIANTS`).
 */
import type { Scene } from '../config/story';
import { ATLAS_TEXT } from '../config/strings';
import type { Quest } from '../content/types';
import type { StoryLine } from './atlas';

const FILES = import.meta.glob<Record<string, unknown>>('../content/atlas-a*.ts', {
  eager: true,
});

function pageOf(path: string, mod: Record<string, unknown>): StoryLine | null {
  const m = /atlas-a(\d+)\.ts$/.exec(path);
  if (!m) return null;
  const id = `A${Number(m[1])}`;
  const quests = Object.entries(mod).find(([k]) => /^ATLAS_A\d+$/.test(k))?.[1];
  const variants = Object.entries(mod).find(([k]) => k.endsWith('VARIANTS'))?.[1];
  if (!Array.isArray(quests)) return null;
  return {
    id,
    title: ATLAS_TEXT.pages[id] ?? id,
    quests: quests as Quest[],
    variants: Array.isArray(variants) ? (variants as Scene[]) : [],
  };
}

export const ATLAS_PAGES: StoryLine[] = Object.entries(FILES)
  .map(([path, mod]) => pageOf(path, mod))
  .filter((p): p is StoryLine => p !== null)
  .sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
