/**
 * Neopia, through the rainbow gate: the thirteen plots (NP1–NP13) and the one-time quests
 * (NQ1–NQ32) split into lines the Keeper picks between, gathered for the runner. Imported
 * only through `loadNeopia()` so the scripts stay in their own lazy chunk.
 *
 * Everything Neopia gives (blessings, potions, cookbook pages, sandbox decor) is kept in
 * the Neopia save and works on your Neo pet and your Neopia sandbox; nothing reaches the
 * Grove (canon 21). The faerie rivalry: beginning Illusen's chain closes Jhudora's, and
 * the other way round (neopia-quests.ts header).
 */
import { ATLAS_TEXT } from '../config/strings';
import { NEOPIA_LINE, NEOPIA_LINE_VARIANTS } from '../content/neopia-line';
import { NEOPIA_QUESTS, NEOPIA_QUESTS_VARIANTS } from '../content/neopia-quests';
import type { StoryLine } from './atlas';

/** The quest lines, by the NQ numbers each holds. */
const QUEST_LINES: Array<{ id: string; from: number; to: number; closedBy?: string }> = [
  { id: 'NQ-faerie', from: 1, to: 10 },
  { id: 'NQ-illusen', from: 11, to: 13, closedBy: 'neo-side-jhudora' },
  { id: 'NQ-jhudora', from: 14, to: 16, closedBy: 'neo-side-illusen' },
  { id: 'NQ-kitchen', from: 17, to: 21 },
  { id: 'NQ-edna', from: 22, to: 26 },
  { id: 'NQ-wonders', from: 27, to: 32 },
];

const number = (code: string): number => Number(code.replace(/^NQ/, ''));

export const NEOPIA_LINES: StoryLine[] = [
  {
    id: 'NP',
    title: ATLAS_TEXT.neoLines.NP ?? 'NP',
    quests: NEOPIA_LINE,
    variants: NEOPIA_LINE_VARIANTS,
  },
  ...QUEST_LINES.map(({ id, from, to, closedBy }): StoryLine => {
    const quests = NEOPIA_QUESTS.filter((q) => number(q.code) >= from && number(q.code) <= to);
    const ids = new Set(quests.flatMap((q) => scenesOf(q)));
    return {
      id,
      title: ATLAS_TEXT.neoLines[id] ?? id,
      quests,
      variants: NEOPIA_QUESTS_VARIANTS.filter((v) =>
        [...ids].some((s) => v.id.startsWith(`${s}-`)),
      ),
      ...(closedBy ? { closed: (flags) => flags[closedBy] === true } : {}),
    };
  }),
];

function scenesOf(q: StoryLine['quests'][number]): string[] {
  return [...q.steps.flatMap((s) => [s.scene.id, ...(s.done ? [s.done.id] : [])]), q.complete.id];
}
