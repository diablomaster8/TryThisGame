/**
 * R0511 (TECH-69) and R0474 (TECH-32): the Progress page (ring meters from data the save
 * already has) and the Grove diary (sim/grove-diary.ts), as one panel. It is loaded on demand
 * from the Journal's Progress tab and from Settings, and every number comes from the world:
 * no new state, no network. `renderProgress` fills any container; `openProgress` wraps it
 * in a modal for the places that have no Journal (the Free Grove).
 */
import { ACHIEVEMENT_LIST } from '../sim/achievements';
import { tabProgress, type BookTab } from '../sim/collection';
import { newDiary } from '../sim/grove-diary';
import { COURSES } from '../sim/race';
import type { World } from '../sim/types';
import { PROGRESS_TEXT as T } from '../config/strings-r11d4-progress';
import { button, el, modal } from './dom';

export interface Ring {
  key: string;
  seen: number;
  total: number;
}

/** Pure: the ring meters' numbers. */
export function ringsOf(world: World): Ring[] {
  const tab = (t: BookTab): Ring => ({ key: t, ...tabProgress(world, t) });
  const won = Object.values(world.races ?? {}).filter((t) => t > 0).length;
  return [
    tab('forms'),
    tab('pocket'),
    tab('digital'),
    {
      key: 'badges',
      seen: ACHIEVEMENT_LIST.filter((a) => world.achievements?.[a.id] !== undefined).length,
      total: ACHIEVEMENT_LIST.length,
    },
    { key: 'races', seen: won, total: COURSES.length },
  ];
}

/** Pure: the diary's kid-friendly lines (empty before there is anything to say). */
export function diaryLines(world: World): string[] {
  const d = world.diary ?? newDiary();
  const sec = (ms: number): number => Math.max(1, Math.round(ms / 1000));
  const out: string[] = [];
  if (d.hatched > 0) out.push(T.line.hatched(d.hatched));
  if (d.firstHatchMs !== null) out.push(T.line.firstHatch(sec(d.firstHatchMs)));
  if (d.firstPetMs !== null) out.push(T.line.firstPet(sec(d.firstPetMs)));
  if (d.firstFeedMs !== null) out.push(T.line.firstFeed(sec(d.firstFeedMs)));
  if (d.minutesPlayed >= 1) out.push(T.line.played(Math.round(d.minutesPlayed)));
  if (d.sessions > 0) out.push(T.line.sessions(d.sessions));
  if (d.longestSessionMin >= 1) out.push(T.line.longest(Math.round(d.longestSessionMin)));
  if (d.evolutions > 0) out.push(T.line.evolutions(d.evolutions));
  if (d.rebirths > 0) out.push(T.line.rebirths(d.rebirths));
  if (d.expeditionRuns > 0) out.push(T.line.expeditions(d.expeditionRuns, d.bestExpedition));
  if (d.racesWon > 0) out.push(T.line.races(d.racesWon));
  return out;
}

/** The diary as plain text, for the bug report and the Copy button. */
export function diaryText(world: World): string {
  return JSON.stringify(world.diary ?? newDiary());
}

export function renderProgress(world: World, into: HTMLElement): void {
  into.appendChild(el('h3', undefined, T.ringsTitle));
  const grid = el('div', 'progress-rings');
  for (const r of ringsOf(world)) {
    const pct = r.total > 0 ? Math.round((r.seen / r.total) * 100) : 0;
    const name = T.rings[r.key] ?? r.key;
    const cell = el('div', 'progress-ring');
    const dial = el('div', 'progress-dial', `${pct}%`);
    dial.style.setProperty('--pct', String(pct));
    cell.setAttribute('role', 'img');
    cell.setAttribute('aria-label', `${name}: ${T.of(r.seen, r.total)}`);
    cell.append(dial, el('strong', undefined, name), el('small', undefined, T.of(r.seen, r.total)));
    grid.appendChild(cell);
  }
  into.appendChild(grid);
  const deepest = Math.max(0, ...(world.hollow?.acts ?? []).map((a) => a.deepest));
  into.appendChild(el('h3', undefined, T.bests));
  const best = el('ul', 'progress-bests');
  best.append(
    el('li', undefined, T.hollowBest(deepest)),
    el('li', undefined, T.expeditionBest(world.diary?.bestExpedition ?? 0)),
  );
  into.appendChild(best);
  into.appendChild(el('h3', undefined, T.diaryTitle));
  into.appendChild(el('p', 'help', T.diaryPrivate));
  const lines = diaryLines(world);
  if (lines.length === 0) into.appendChild(el('p', 'help', T.diaryEmpty));
  else {
    const ul = el('ul', 'progress-diary');
    for (const l of lines) ul.appendChild(el('li', undefined, l));
    into.appendChild(ul);
  }
  const copy = button(T.copyDiary, () => {
    void navigator.clipboard
      ?.writeText(diaryText(world))
      .then(() => (copy.textContent = T.copied))
      .catch(() => (copy.textContent = T.copyFailed));
  });
  into.appendChild(copy);
}

/** A stand-alone panel for saves without a Journal. */
export function openProgress(parent: HTMLElement, world: () => World | null): void {
  const m = modal(parent, T.title, 'Close');
  const w = world();
  if (w) renderProgress(w, m.body);
  m.show();
  const obs = new MutationObserver(() => {
    if (!m.isOpen()) {
      obs.disconnect();
      m.root.remove();
    }
  });
  obs.observe(m.root, { attributes: true, attributeFilter: ['hidden'] });
}
