/**
 * Lane C r10 agent A (R0650, CAMP-58): the map's questline-region switcher. A row of region
 * tabs (the Fold, the server, the Sun, the Moon, the Hollow) under the map's own tabs; a
 * locked region shows a lock and its unlock hint from the chapter it opens at ("After Chapter
 * 3"). An open region's page lists its line and chapter goal, each of its areas with a Go
 * there, and the way in or back. The tabs wrap, so every region and area is reachable at
 * 375 px wide without sideways scrolling, and every button is a 44 px target.
 */
import { STORYLINE_TEXT, STORY_REGION_TEXT } from '../config/strings';
import { STORY_TEXT } from '../config/story';
import { CAMP13C_TEXT } from '../config/strings-camp13c';
import { STORY_REGIONS, type StoryRegionId } from '../config/story-regions';
import type { Game } from '../game';
import { journalView } from '../sim/storyline';
import { storylineById } from '../sim/story-scenes';
import {
  regionLines,
  regionOpenOrder,
  regionOpensAt,
  storyRegionBlock,
  storyRegionHere,
  storyRegionOpen,
} from '../sim/story-regions';
import type { World } from '../sim/types';
import { button, el } from './dom';
import { goToRegion } from './region-chip';

/** Whether this world has questline regions (Hazel's Grove with lines beside it). */
export function hasStoryRegions(w: World): boolean {
  return !!w.campaign && w.campaign.storyline === null && w.campaign.chapter > 0 && !w.edu;
}

/** The region tabs, with the shown one marked; `pick` switches to a region. */
export function storyRegionTabs(
  w: World,
  current: StoryRegionId | null,
  pick: (r: StoryRegionId) => void,
  toast: (text: string) => void,
): HTMLElement {
  const row = el('div', 'wm-story-tabs');
  row.setAttribute('role', 'tablist');
  row.setAttribute('aria-label', STORY_REGION_TEXT.mapRegions);
  const here = storyRegionHere(w);
  for (const r of regionOpenOrder()) {
    const open = storyRegionOpen(w, r);
    const name = STORY_REGION_TEXT.tabs[r] ?? r;
    // Lane C r11 (R0650): a locked tab is a lock and a name, so the row stays short on a phone;
    // its hint is in its label for a screen reader and the nearest one is written below.
    const label = open ? `${here === r ? '➤ ' : ''}${name}` : `🔒 ${name}`;
    const b = button(
      label,
      () => (open ? pick(r) : toast(STORY_REGION_TEXT.lockedHint(regionOpensAt(r)))),
      `btn btn-small wm-tab${r === current ? ' btn-primary' : ''}${open ? '' : ' wm-locked'}`,
    );
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', String(r === current));
    b.dataset.region = r;
    if (!open)
      b.setAttribute('aria-label', `${name}. ${STORY_REGION_TEXT.lockedHint(regionOpensAt(r))}`);
    row.appendChild(b);
  }
  const next = regionOpenOrder().find((r) => !storyRegionOpen(w, r));
  if (next)
    row.appendChild(
      el(
        'p',
        'help wm-next-unlock',
        `${STORY_REGION_TEXT.names[next] ?? next}: ${STORY_REGION_TEXT.lockedHint(regionOpensAt(next))}`,
      ),
    );
  return row;
}

export type ChapterState = 'done' | 'now' | 'later';
export const CHAPTER_GLYPH: Readonly<Record<ChapterState, string>> = {
  done: '✓',
  now: '◆',
  later: '○',
};

export interface AreaQuests {
  /** The line area, or null for chapters with no single place. */
  area: string | null;
  rows: Array<{ n: number; title: string; state: ChapterState }>;
}

/**
 * R0650: a line's chapters grouped by the area they happen in: the line's areas in their order
 * (those with a chapter), then "anywhere" (area null). Reads only; nothing is written.
 */
export function chapterAreaGroups(
  chapters: ReadonlyArray<{ n: number; title: string; area?: string }>,
  current: number,
  areas: readonly string[],
): AreaQuests[] {
  const out = new Map<string | null, AreaQuests>();
  const known = new Set(areas);
  for (const ch of chapters) {
    const key = ch.area && known.has(ch.area) ? ch.area : null;
    const g = out.get(key) ?? { area: key, rows: [] };
    g.rows.push({
      n: ch.n,
      title: ch.title,
      state: ch.n < current ? 'done' : ch.n === current ? 'now' : 'later',
    });
    out.set(key, g);
  }
  const ordered = areas.flatMap((a) => (out.has(a) ? [out.get(a)!] : []));
  return out.has(null) ? [...ordered, out.get(null)!] : ordered;
}

/** One group as a fold: counts in the summary (a glyph and a word each), the chapters inside. */
function areaQuestFold(grp: AreaQuests, open: boolean, title?: string): HTMLElement {
  const fold = el('details', 'c11-row wm-story-chapters');
  if (open && grp.rows.some((r) => r.state === 'now')) fold.setAttribute('open', '');
  const count = (s: ChapterState) => grp.rows.filter((r) => r.state === s).length;
  fold.appendChild(
    el(
      'summary',
      'c11-row-sum',
      title ?? CAMP13C_TEXT.areaCounts(count('now'), count('done'), count('later')),
    ),
  );
  for (const r of grp.rows)
    fold.appendChild(
      el('p', undefined, `${CHAPTER_GLYPH[r.state]} ${STORY_TEXT.chapter(r.n, r.title)}`),
    );
  return fold;
}

/** An open region's page: its line's goal, its areas with Go there, and the way in or out. */
export function storyRegionPage(
  g: Game,
  r: StoryRegionId,
  toast: (text: string) => void,
  close: () => void,
  fade: HTMLElement | null,
): HTMLElement {
  const w = g.world;
  const page = el('div', 'wm-story-page');
  const name = STORY_REGION_TEXT.names[r] ?? r;
  page.appendChild(el('p', 'help', STORY_REGION_TEXT.entrances[STORY_REGIONS[r].entrance] ?? ''));
  const here = storyRegionHere(w) === r;
  if (here) page.appendChild(el('p', 'wm-here', `➤ ${STORY_REGION_TEXT.entered(name)}`));
  const lines = regionLines(w, r);
  if (lines.length === 0) page.appendChild(el('p', 'help', STORY_REGION_TEXT.noQuests));
  for (const line of lines) {
    const id = line.storyline!;
    const view = journalView(w, line, false);
    const card = el('div', 'wm-story-line');
    card.appendChild(el('h4', '', storylineById(id)?.title ?? id));
    if (view) card.appendChild(el('p', '', view.goalText));
    const groups = view ? chapterAreaGroups(view.chapters, line.chapter, view.areas) : [];
    const grouped = groups.some((x) => x.area !== null);
    const areas = el('div', 'wm-story-areas');
    for (const area of view?.areas ?? []) {
      const sec = el('div', 'wm-story-area');
      const b = button(
        `➜ ${STORYLINE_TEXT.areas[area] ?? area}`,
        () => {
          g.send({ kind: 'storyArea', area, line: id });
          close();
        },
        'btn btn-small',
      );
      if (view?.area === area) b.classList.add('active');
      sec.appendChild(b);
      const grp = groups.find((x) => x.area === area);
      if (grp) sec.appendChild(areaQuestFold(grp, true));
      areas.appendChild(sec);
    }
    if (areas.childElementCount > 0) card.appendChild(areas);
    // R0650: the line's quests (its chapters), so the page says what happens here and what is next.
    // Chapters with no single place, or all of them for a line with no areas, sit in one fold.
    const rest = groups.find((x) => x.area === null);
    if (view && (rest || !grouped)) {
      const all = rest ?? chapterAreaGroups(view.chapters, line.chapter, [])[0];
      if (all)
        card.appendChild(
          areaQuestFold(all, false, CAMP13C_TEXT.regionChapters(view.n, view.final)),
        );
    }
    page.appendChild(card);
  }
  const why = here ? null : storyRegionBlock(w, r);
  const go = button(
    here ? STORY_REGION_TEXT.back : `➜ ${STORY_REGION_TEXT.goThere}`,
    () => {
      if (why) {
        toast(STORY_REGION_TEXT.refused[why] ?? STORY_REGION_TEXT.refused.noLine!);
        return;
      }
      close();
      goToRegion((cmd) => g.send(cmd), here ? null : r, fade);
    },
    'btn btn-primary wm-story-go',
  );
  go.disabled = !!why && why !== 'noLine';
  page.appendChild(go);
  return page;
}
