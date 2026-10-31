/**
 * Lane C r10 agent A (R0650, CAMP-58): the map's questline-region switcher. A row of region
 * tabs (the Fold, the server, the Sun, the Moon, the Hollow) under the map's own tabs; a
 * locked region shows a lock and its unlock hint from the chapter it opens at ("After Chapter
 * 3"). An open region's page lists its line and chapter goal, each of its areas with a Go
 * there, and the way in or back. The tabs wrap, so every region and area is reachable at
 * 375 px wide without sideways scrolling, and every button is a 44 px target.
 */
import { STORYLINE_TEXT, STORY_REGION_TEXT } from '../config/strings';
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
    const label = open
      ? `${here === r ? '➤ ' : ''}${name}`
      : `${name} · ${STORY_REGION_TEXT.lockedHint(regionOpensAt(r))}`;
    const b = button(
      label,
      () => (open ? pick(r) : toast(STORY_REGION_TEXT.lockedHint(regionOpensAt(r)))),
      `btn btn-small wm-tab${r === current ? ' btn-primary' : ''}${open ? '' : ' wm-locked'}`,
    );
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', String(r === current));
    b.dataset.region = r;
    row.appendChild(b);
  }
  return row;
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
    const areas = el('div', 'wm-story-areas');
    for (const area of view?.areas ?? []) {
      const b = button(
        `➜ ${STORYLINE_TEXT.areas[area] ?? area}`,
        () => {
          g.send({ kind: 'storyArea', area, line: id });
          close();
        },
        'btn btn-small',
      );
      if (view?.area === area) b.classList.add('active');
      areas.appendChild(b);
    }
    if (areas.childElementCount > 0) card.appendChild(areas);
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
