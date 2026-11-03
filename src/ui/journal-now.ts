import { ATLAS_TEXT, C11_TEXT } from '../config/strings';
import { atlasPagesDone } from '../sim/cross-saves';
import { readCrossSaves } from './atlas';
import { C11_UI } from '../config/tuning';
import { REGIONS } from '../config/regions';
import { STORY_REGION_TEXT } from '../config/strings';
import { STORY_REGION_IDS } from '../config/story-regions';
import { STORY_TEXT } from '../config/story';
import type { Game } from '../game';
import { goalMet } from '../sim/campaign';
import {
  areaCounts,
  areaMarks,
  areaPoi,
  MARK_GLYPH,
  markKind,
  questLength,
  questSize,
  storyFirst,
  suggestedNext,
  type AreaMark,
} from '../sim/camp11';
import { poiPos } from '../sim/beacon';
import { boardState, questProgress } from '../sim/quest-offers';
import { regionOpensAt, storyRegionOpen } from '../sim/story-regions';
import { journalView } from '../sim/storyline';
import { sideStory } from '../sim/story-scenes';
import { button, el } from './dom';
import { areaName } from './offer-card';
import { travelTo } from './journal-step';

/**
 * Lane C round 11, helper ui (R0610, R0663, R0635, R0650): the journal's Now and Areas pages.
 * Now is the goal, then every other quest under way as one collapsed row (title and step goal;
 * the hint, the step count and the buttons show on expand). Areas is one fold per place with
 * its counts, and the questline regions with when they open. Every control is a 44 px target
 * (`.c11-row`, `.c11-go` in style.css) and the folds are native `details`, so Tab and Enter
 * follow the visual order.
 */

export interface NowOptions {
  /** The title in the save's text band. */
  titleOf: (id: string) => string;
  /** The buttons for a quest's current step (Go there, Play it, Imagine it, Skip), or null. */
  controls: (id: string) => HTMLElement | null;
  /** The spine goal's buttons. */
  spine: () => HTMLElement | null;
  close: () => void;
}

/** "Hazel's story: chapter 6 is at the cottage", and the suggested next quest. */
export function storyFirstRows(g: Game, titleOf: (id: string) => string): HTMLElement | null {
  const first = storyFirst(g.world);
  if (!first) return null;
  const box = el('div', 'c11-first');
  if (first.over) box.appendChild(el('p', 'help', C11_TEXT.storyFirstEnd));
  else
    box.appendChild(
      el(
        'p',
        undefined,
        C11_TEXT.storyFirst(
          first.chapter,
          first.poi ? areaName(`grove/${first.poi}`) : C11_TEXT.storyFirstAnywhere,
        ),
      ),
    );
  const next = suggestedNext(g.world);
  const quest = next ? sideStory(next) : undefined;
  box.appendChild(
    el(
      'p',
      'help',
      quest && next
        ? C11_TEXT.suggested(titleOf(next), C11_TEXT.size[questSize(quest)] ?? '')
        : C11_TEXT.suggestedNone,
    ),
  );
  return box;
}

/** One quest as a collapsed row: title and step goal, the rest under the fold. */
export function questRow(
  g: Game,
  id: string,
  o: Pick<NowOptions, 'titleOf' | 'controls'>,
  pinned = false,
): HTMLElement | null {
  const c = g.world.campaign;
  const quest = sideStory(id);
  const st = c?.fun[id] ?? c?.side[id];
  const step = quest?.steps[Math.min(st?.step ?? 0, (quest?.steps.length ?? 1) - 1)];
  if (!quest || !step) return null;
  const row = el('details', 'c11-row');
  const sum = el('summary', 'c11-row-sum');
  sum.appendChild(el('strong', undefined, `${pinned ? '◆ ' : '◇ '}${o.titleOf(id)}`));
  sum.appendChild(el('span', 'c11-row-goal', step.goal));
  row.appendChild(sum);
  const p = questProgress(g.world, id);
  const len = questLength(id);
  const line = p
    ? C11_TEXT.stepsLeft(p.step, p.of, p.minutesLeft)
    : len
      ? C11_TEXT.length(len.of, len.minutes)
      : '';
  if (line) row.appendChild(el('p', 'help', line));
  row.appendChild(el('p', 'help', step.hint));
  const ctl = o.controls(id);
  if (ctl) row.appendChild(ctl);
  return row;
}

export function renderNow(g: Game, body: HTMLElement, o: NowOptions): void {
  const c = g.world.campaign;
  if (!c) return;
  const first = storyFirstRows(g, o.titleOf);
  if (first) body.appendChild(first);
  // The goal.
  const view = journalView(g.world, c, goalMet(g.world, c));
  if (view && c.chapter <= view.final) {
    const box = el('section', 'c11-goal');
    box.appendChild(el('div', 'btn-name', `${C11_TEXT.nowGoal}${view.met ? ' ✓' : ''}`));
    box.appendChild(el('p', undefined, view.goalText));
    box.appendChild(el('p', 'help', view.hint));
    const ctl = o.spine();
    if (ctl) box.appendChild(ctl);
    body.appendChild(box);
  } else if (view) {
    body.appendChild(
      el('p', 'help', STORY_TEXT.endingReached(view.endings[view.ending ?? '']?.title ?? '')),
    );
  }
  // Pinned quests first, then the rest of what is under way.
  const tracked = g.world.questBook?.tracked ?? [];
  const open: string[] = [];
  for (const id of tracked) if (boardState(g.world, c, id) === 'active') open.push(id);
  for (const k of Object.keys({ ...c.side, ...c.fun }))
    if (!open.includes(k) && (c.fun[k] ?? c.side[k])?.status === 'open') open.push(k);
  if (open.length === 0) {
    body.appendChild(el('p', 'help', C11_TEXT.nowNothing));
    return;
  }
  body.appendChild(el('div', 'btn-name', C11_TEXT.nowOthers));
  const list = el('div', 'c11-rows');
  body.appendChild(list);
  const rows = open
    .map((id) => questRow(g, id, o, tracked.includes(id)))
    .filter((r): r is HTMLElement => r !== null);
  rows.forEach((r) => list.appendChild(r));
  if (rows.length > C11_UI.nowRows) {
    const more = rows.slice(C11_UI.nowRows);
    more.forEach((r) => (r.hidden = true));
    let shown = false;
    const b = button(
      C11_TEXT.expand,
      () => {
        shown = !shown;
        more.forEach((r) => (r.hidden = !shown));
        b.textContent = shown ? C11_TEXT.collapse : C11_TEXT.expand;
        b.setAttribute('aria-expanded', String(shown));
      },
      'btn btn-small c11-more',
    );
    b.setAttribute('aria-expanded', 'false');
    body.appendChild(b);
  }
}

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
