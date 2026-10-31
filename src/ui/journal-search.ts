/**
 * Lane C round 9 (agent J): the journal's pure helpers, kept free of the DOM so Vitest can
 * check them. The Quests page's search and chips (R0665), a line's time left (R0635) and the
 * endings shelf with its no-spoiler hints (R0642).
 */

export type QuestKind = 'story' | 'caper' | 'errand';
export type JournalChip = 'story' | 'caper' | 'errand' | 'teen' | 'adult' | 'done';
export const JOURNAL_CHIPS: readonly JournalChip[] = [
  'story',
  'caper',
  'errand',
  'teen',
  'adult',
  'done',
];

/** One row of the Quests page: a side story, a caper or an errand. */
export interface QuestRow {
  id: string;
  title: string;
  giver: string;
  area: string;
  kind: QuestKind;
  audience: string;
  state: 'done' | 'open' | 'offered' | 'shelved';
}

const fold = (s: string): string =>
  s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[’']/g, '');

/** Every word of the query is found in the title, the giver or the area. */
export function matchesQuery(row: QuestRow, query: string): boolean {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const hay = fold(`${row.title} ${row.giver} ${row.area}`);
  return words.every((w) => hay.includes(w));
}

/**
 * The rows the query and chips let through. Chips of one group widen each other (Story or
 * Capers); groups narrow each other (Capers and 18+). No chip in a group means no filter.
 */
export function filterRows(
  rows: readonly QuestRow[],
  query: string,
  chips: ReadonlySet<JournalChip>,
): QuestRow[] {
  const kinds = (['story', 'caper', 'errand'] as const).filter((k) => chips.has(k));
  const ages = (['teen', 'adult'] as const).filter((k) => chips.has(k));
  return rows.filter(
    (r) =>
      (kinds.length === 0 || kinds.includes(r.kind as (typeof kinds)[number])) &&
      (ages.length === 0 || ages.includes(r.audience as (typeof ages)[number])) &&
      (!chips.has('done') || r.state === 'done') &&
      matchesQuery(r, query),
  );
}

/** R0635: a line on chapter `n` of `final` has this chapter and the rest to go. */
export function lineMinutesLeft(n: number, final: number, perChapter: number): number {
  return Math.max(1, (Math.max(final, n) - n + 1) * perChapter);
}

/** One road on the endings shelf: its endings and the ones this save has reached. */
export interface ShelfRoad {
  id: string;
  title: string;
  endings: Record<string, { title: string; how: string }>;
  reached: ReadonlySet<string>;
}

export interface ShelfEntry {
  id: string;
  title: string;
  got: number;
  of: number;
  items: Array<{ id: string; title: string | null; reached: boolean; hint: string | null }>;
}

/**
 * R0642: each road's endings. A reached ending shows its title; an unreached one shows "?",
 * and its `how` hint only once that road has ended at least once (no spoilers on first play).
 */
export function endingShelf(roads: readonly ShelfRoad[]): ShelfEntry[] {
  return roads.map((r) => {
    const ids = Object.keys(r.endings);
    const got = ids.filter((id) => r.reached.has(id)).length;
    return {
      id: r.id,
      title: r.title,
      got,
      of: ids.length,
      items: ids.map((id) => {
        const reached = r.reached.has(id);
        return {
          id,
          title: reached ? r.endings[id]!.title : null,
          reached,
          hint: !reached && got > 0 ? r.endings[id]!.how : null,
        };
      }),
    };
  });
}

/** The giver of a quest: its first speaker who is not the Keeper. */
export function giverOf(quest: {
  speakers: ReadonlyArray<{ id: string; name: string; kind: string }>;
}): { id: string; name: string } | null {
  const s = quest.speakers.find((x) => x.kind !== 'keeper' && x.id !== 'you');
  return s ? { id: s.id, name: s.name } : null;
}
