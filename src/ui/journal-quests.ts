import { SPECIES_LABELS, TRAINER_LABELS, UI_TEXT } from '../config/strings';
import { requestLine } from '../config/strings-fun-r6';
import { OFFER_TEXT } from '../config/strings-camp';
import { JOURNAL_TEXT } from '../config/strings-journal';
import { STORY_TEXT } from '../config/story';
import type { Game } from '../game';
import { isFunQuestCode } from '../sim/audience';
import { questAreaKey } from '../sim/quest-offers';
import { sideStory, storylines } from '../sim/story-scenes';
import { sharesStory } from '../sim/story-book';
import type { JournalView } from '../sim/storyline';
import type { Quest } from '../sim/types';
import { button, el } from './dom';
import {
  endingShelf,
  filterRows,
  giverOf,
  JOURNAL_CHIPS,
  type JournalChip,
  type QuestRow,
  type ShelfRoad,
} from './journal-search';
import { areaName } from './offer-card';
import { endingKey, getShots } from './u4-store';

/**
 * Lane C round 9 (agent J): three journal blocks over existing sim state.
 * - Errands (R0656): the Requests board's one-time asks, folded into the journal, with Claim.
 * - The Quests page (R0665): every story and caper this save knows, plus the errands, with a
 *   search box and filter chips. The query and chips last for the session, not the save.
 * - The endings shelf (R0642): every ending of Hazel's Grove and each line beside it.
 */

function errandLabel(q: Quest): string {
  const make = (UI_TEXT.questText as Record<string, (n: number, p: string) => string>)[q.template];
  const param = q.param ? (SPECIES_LABELS[q.param] ?? q.param) : '';
  return make ? make(q.target, param) : q.template;
}

function errandFrom(from: string): string {
  return TRAINER_LABELS[from]?.name ?? from;
}

/** R0656: the errands, collapsed under the notice board. */
export function renderErrands(g: Game, body: HTMLElement, refresh: () => void): void {
  const list = g.world.quests;
  const box = el('details', 'journal-errands');
  const sum = el('summary', 'btn-name', `${JOURNAL_TEXT.errandsHead} (${list.length})`);
  box.appendChild(sum);
  box.appendChild(el('p', 'help', JOURNAL_TEXT.errandsHelp));
  if (list.length === 0) box.appendChild(el('p', undefined, JOURNAL_TEXT.errandsNone));
  for (const q of list) {
    const row = el('div', 'journal-line');
    row.appendChild(el('div', 'roster-line', errandLabel(q)));
    row.appendChild(
      el(
        'small',
        undefined,
        JOURNAL_TEXT.errandFrom(errandFrom(q.from), Math.min(q.progress, q.target), q.target),
      ),
    );
    const voiced = requestLine(
      q.template,
      q.from,
      !TRAINER_LABELS[q.from],
      q.claimed ? 'thanks' : 'ask',
    );
    if (voiced) row.appendChild(el('p', 'request-voice', voiced));
    const claim = button(
      q.claimed ? JOURNAL_TEXT.claimed : JOURNAL_TEXT.claim,
      () => {
        g.send({ kind: 'claimQuest', id: q.id });
        window.setTimeout(refresh, 150);
      },
      'btn btn-small btn-primary',
    );
    claim.disabled = q.claimed || q.progress < q.target;
    row.appendChild(claim);
    box.appendChild(row);
  }
  body.appendChild(box);
}

/** Every quest this save knows, as Quests-page rows. */
export function questRows(g: Game): QuestRow[] {
  const c = g.world.campaign;
  const rows: QuestRow[] = [];
  if (c && !c.storyline) {
    const ids = new Set([
      ...Object.keys(c.side),
      ...Object.keys(c.fun),
      ...Object.keys(g.world.questBook?.entries ?? {}),
    ]);
    for (const id of ids) {
      const quest = sideStory(id);
      if (!quest) continue;
      const status = c.side[id]?.status ?? c.fun[id]?.status;
      const entry = g.world.questBook?.entries[id];
      const state: QuestRow['state'] =
        status === 'done' || status === 'closed'
          ? 'done'
          : status === 'open'
            ? 'open'
            : entry?.state === 'shelved'
              ? 'shelved'
              : 'offered';
      const key = questAreaKey(quest);
      rows.push({
        id,
        title: quest.title,
        giver: giverOf(quest)?.name ?? '',
        area: key ? areaName(key) : '',
        kind: isFunQuestCode(quest.code) ? 'caper' : 'story',
        audience: quest.audience,
        state,
      });
    }
  }
  for (const q of g.world.quests)
    rows.push({
      id: q.id,
      title: errandLabel(q),
      giver: errandFrom(q.from),
      area: '',
      kind: 'errand',
      audience: 'all',
      state: q.claimed ? 'done' : 'open',
    });
  return rows.sort((a, b) => a.title.localeCompare(b.title));
}

/** The Quests page's search, kept for the session (R0665). */
const search = { query: '', chips: new Set<JournalChip>() };

const STATE_WORD: Record<QuestRow['state'], string> = {
  done: JOURNAL_TEXT.stateDone,
  open: JOURNAL_TEXT.stateOpen,
  offered: JOURNAL_TEXT.stateWaiting,
  shelved: JOURNAL_TEXT.stateShelved,
};

const KIND_WORD: Record<QuestRow['kind'], string> = {
  story: OFFER_TEXT.story,
  caper: OFFER_TEXT.caper,
  errand: JOURNAL_TEXT.errandsHead,
};

/** R0665: the Quests page. Typing redraws the list only, so the box keeps its focus. */
export function renderQuestsPage(g: Game, body: HTMLElement): void {
  const rows = questRows(g);
  const box = el('section', 'journal-quests');
  const label = el('label', 'journal-search');
  const input = document.createElement('input');
  input.type = 'search';
  input.value = search.query;
  input.placeholder = JOURNAL_TEXT.searchHint;
  input.setAttribute('aria-label', JOURNAL_TEXT.search);
  input.autocomplete = 'off';
  label.append(el('span', 'btn-name', JOURNAL_TEXT.search), input);
  const chips = el('div', 'journal-chips');
  chips.setAttribute('role', 'group');
  chips.setAttribute('aria-label', JOURNAL_TEXT.chipsLabel);
  const count = el('p', 'help');
  count.setAttribute('aria-live', 'polite');
  const list = el('div', 'journal-quest-list');
  const draw = (): void => {
    const shown = filterRows(rows, search.query, search.chips);
    count.textContent = JOURNAL_TEXT.results(shown.length);
    list.replaceChildren();
    if (shown.length === 0) list.appendChild(el('p', undefined, JOURNAL_TEXT.nothingFound));
    for (const r of shown) {
      const row = el('div', `journal-line${r.state === 'done' ? ' done' : ''}`);
      row.appendChild(el('div', 'roster-line', `${r.state === 'done' ? '✓ ' : ''}${r.title}`));
      const badge = OFFER_TEXT.badge[r.audience];
      const bits = [KIND_WORD[r.kind], badge, r.giver, r.area, STATE_WORD[r.state]].filter(
        (x): x is string => !!x,
      );
      row.appendChild(el('small', undefined, bits.join(' · ')));
      list.appendChild(row);
    }
  };
  for (const k of JOURNAL_CHIPS) {
    const b = button(
      JOURNAL_TEXT.chips[k] ?? k,
      () => {
        if (search.chips.has(k)) search.chips.delete(k);
        else search.chips.add(k);
        b.setAttribute('aria-pressed', String(search.chips.has(k)));
        b.classList.toggle('active', search.chips.has(k));
        draw();
      },
      'btn btn-small journal-chip',
    );
    b.setAttribute('aria-pressed', String(search.chips.has(k)));
    if (search.chips.has(k)) b.classList.add('active');
    chips.appendChild(b);
  }
  input.addEventListener('input', () => {
    search.query = input.value;
    draw();
  });
  box.append(label, chips, count, list);
  draw();
  body.appendChild(box);
}

/** R0642: the shelf of every road's endings, under the current story's gallery. */
export function renderEndingShelf(g: Game, body: HTMLElement, view: JournalView): void {
  if (view.storyline !== null || !sharesStory(g.world)) return;
  const roads: Array<ShelfRoad & { reached: Set<string> }> = [
    {
      id: 'hazel',
      title: STORY_TEXT.title,
      endings: view.endings,
      reached: new Set(view.ending ? [view.ending] : []),
    },
  ];
  for (const s of storylines()) {
    const end = g.world.lines[s.id]?.ending;
    roads.push({
      id: s.id,
      title: s.title,
      endings: s.endings,
      reached: new Set(end ? [end] : []),
    });
  }
  const box = el('section', 'journal-shelf');
  box.setAttribute('aria-label', JOURNAL_TEXT.shelfHead);
  const draw = (): void => {
    box.replaceChildren(
      el('div', 'btn-name', JOURNAL_TEXT.shelfHead),
      el('p', 'help', JOURNAL_TEXT.shelfHelp),
    );
    for (const road of endingShelf(roads)) {
      box.appendChild(el('h4', undefined, JOURNAL_TEXT.shelfCount(road.title, road.got, road.of)));
      const ul = el('ul', 'journal-shelf-list');
      for (const it of road.items) {
        const li = el(
          'li',
          it.reached ? 'reached' : undefined,
          `${it.reached ? JOURNAL_TEXT.reachedMark : JOURNAL_TEXT.unknown} ${it.title ?? ''}`.trim(),
        );
        if (it.hint) li.appendChild(el('span', 'help', ` · ${it.hint}`));
        ul.appendChild(li);
      }
      box.appendChild(ul);
    }
  };
  draw();
  body.appendChild(box);
  // Endings reached in earlier plays left their last picture behind: count them as found.
  const keys = roads.flatMap((r) =>
    Object.keys(r.endings).map((e) => ({ r, e, key: endingKey(r.id, e) })),
  );
  void getShots(keys.map((k) => k.key)).then((urls) => {
    let more = false;
    urls.forEach((u, i) => {
      const k = keys[i]!;
      if (u && !k.r.reached.has(k.e)) {
        k.r.reached.add(k.e);
        more = true;
      }
    });
    if (more && box.isConnected) draw();
  });
}
