/**
 * Lane C round 11, helper "profiles" (R0618, R0619): chapter select for finished chapters.
 * Pure: which chapters of the spine and each line are finished, the scenes each one showed
 * (in the order they were first seen, for Watch again), and the checkpoint a branch starts
 * from. Nothing here changes the world; the live save is never rewound.
 */
import { SPINE_LINE } from './story-marks';
import type { CampaignState, World } from './types';

/** One finished chapter in the chapter select. */
export interface DoneChapter {
  /** `hazel` for the spine, else the line's storyline id. */
  line: string;
  n: number;
  /** Scene ids, in first-seen order, for Watch again. */
  scenes: string[];
  /** The checkpoint's IndexedDB id, or null when none was kept (Watch again only). */
  checkpoint: string | null;
}

/** The chapter a scene id belongs to: `c4-open` and `h-c4-open` are both chapter 4. */
export function chapterOfScene(id: string): number | null {
  const m = /(?:^|-)c(\d+)-/.exec(id);
  return m ? Number(m[1]) : null;
}

/** The finished chapters of one story state, oldest first. */
export function doneChapters(c: CampaignState, line: string, spine: CampaignState): DoneChapter[] {
  // An ended story has every chapter it reached behind it; a running one, those before now.
  const last = c.ending ? c.chapter : c.chapter - 1;
  const out: DoneChapter[] = [];
  for (let n = 1; n <= last; n++) {
    const scenes = c.seen
      .filter((id) => chapterOfScene(id) === n)
      .sort((a, b) => (c.seenMs[a] ?? 0) - (c.seenMs[b] ?? 0));
    if (scenes.length === 0) continue;
    out.push({ line, n, scenes, checkpoint: spine.checkpoints?.[`${line}/${n}`] ?? null });
  }
  return out;
}

/** Every finished chapter in this world: the spine's first, then each line's. */
export function chapterSelect(world: World): DoneChapter[] {
  const spine = world.campaign;
  if (!spine) return [];
  const own = spine.storyline ?? SPINE_LINE;
  const out = doneChapters(spine, own, spine);
  for (const [id, l] of Object.entries(world.lines ?? {})) out.push(...doneChapters(l, id, spine));
  return out;
}

/** `<line>/<n>` for the spine's and every line's chapter now, for checkpoints after catch-up. */
export function currentChapterKeys(world: World): string[] {
  const spine = world.campaign;
  if (!spine) return [];
  const keys: string[] = [];
  if (!spine.ending) keys.push(`${spine.storyline ?? SPINE_LINE}/${spine.chapter}`);
  for (const [id, l] of Object.entries(world.lines ?? {}))
    if (!l.ending) keys.push(`${id}/${l.chapter}`);
  return keys;
}
