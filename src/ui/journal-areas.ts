import { ATLAS_TEXT, C11_TEXT, STORY_REGION_TEXT } from '../config/strings';
import { atlasPagesDone } from '../sim/cross-saves';
import { readCrossSaves } from './atlas';
import { REGIONS } from '../config/regions';
import { STORY_REGION_IDS } from '../config/story-regions';
import type { Game } from '../game';
import {
  areaCounts,
  areaMarks,
  areaPoi,
  MARK_GLYPH,
  markKind,
  questLength,
  questSize,
  type AreaMark,
} from '../sim/camp11';
import { poiPos } from '../sim/beacon';
import { regionOpensAt, storyRegionOpen } from '../sim/story-regions';
import { sideStory } from '../sim/story-scenes';
import { button, el } from './dom';

import { areaName } from './offer-card';
import { travelTo } from './journal-step';
import type { NowOptions } from './journal-now';

/**
 * Round 12 lane C (R0610): the journal's Areas page, split out of journal-now.ts. One fold per
 * place with its counts, the questline regions with when they open, and the Atlas shelf.
 */

/** One area's fold: counts on the summary, its quests and a Go there inside. */
function areaFold(g: Game, m: AreaMark, o: NowOptions): HTMLElement {
  const n = areaCounts(m);
  const fold = el('details', 'c11-row c11-area');
  const sum = el('summary', 'c11-row-sum');
  sum.appendChild(el('strong', undefined, `${MARK_GLYPH[markKind(m)]} ${areaName(m.area)}`));
  sum.appendChild(el('span', 'c11-row-goal', C11_TEXT.areaCounts(n.fresh, n.active, n.done)));
  fold.appendChild(sum);
  const ids = [...m.offer, ...m.tracked, ...m.active, ...m.done];
  for (const id of ids) {
    const q = sideStory(id);
    if (!q) continue;
    const state = m.offer.includes(id)
      ? 'available'
      : m.tracked.includes(id)
        ? 'tracked'
        : m.done.includes(id)
          ? 'done'
          : 'active';
    const len = questLength(id);
    fold.appendChild(
      el(
        'p',
        undefined,
        `${C11_TEXT.markerState[state]} · ${o.titleOf(id)}${len ? ` · ${C11_TEXT.size[questSize(q)]}` : ''}`,
      ),
    );
  }
  const poi = areaPoi(m.area);
  const at = poi && m.area.startsWith('grove/') ? poiPos(poi) : null;
  if (at) {
    fold.appendChild(
      button(
        C11_TEXT.areaGo,
        () => {
          o.close();
          travelTo(g, at);
        },
        'btn btn-small c11-go',
      ),
    );
  }
  return fold;
}

export function renderAreas(g: Game, body: HTMLElement, o: NowOptions): void {
  const marks = Object.values(areaMarks(g.world));
  // Regions in a stable order: the Grove first.
  const byRegion = new Map<string, AreaMark[]>();
  for (const m of marks) {
    const r = m.area.split('/')[0] ?? 'grove';
    byRegion.set(r, [...(byRegion.get(r) ?? []), m]);
  }
  const names = STORY_REGION_TEXT.names as Record<string, string>;
  for (const [region, list] of [...byRegion.entries()].sort((a, b) =>
    a[0] === 'grove' ? -1 : b[0] === 'grove' ? 1 : a[0].localeCompare(b[0]),
  )) {
    const head =
      region === 'grove' ? 'Grove' : REGIONS[region as keyof typeof REGIONS] ? region : region;
    body.appendChild(el('div', 'btn-name', head.charAt(0).toUpperCase() + head.slice(1)));
    for (const m of list) body.appendChild(areaFold(g, m, o));
  }
  if (marks.length === 0) body.appendChild(el('p', 'help', C11_TEXT.areaNone));
  // R0650: the questline regions and when each opens.
  for (const r of STORY_REGION_IDS) {
    if (storyRegionOpen(g.world, r)) continue;
    body.appendChild(
      el('p', 'help c11-locked', `🔒 ${C11_TEXT.unlockHint(regionOpensAt(r), names[r] ?? r)}`),
    );
  }
  // R0630: the story worlds' progress, read from the side save and never written to the Grove.
  const pages = atlasPagesDone(readCrossSaves());
  if (pages.length > 0) {
    body.appendChild(el('div', 'btn-name', ATLAS_TEXT.fromAtlas));
    body.appendChild(el('p', 'help', ATLAS_TEXT.fromAtlasHelp));
    for (const id of pages) body.appendChild(el('p', undefined, ATLAS_TEXT.pages[id] ?? id));
  }
}
