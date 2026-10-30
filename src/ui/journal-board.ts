import { OFFER_TEXT } from '../config/strings';
import type { Game } from '../game';
import { isFunQuestCode } from '../sim/audience';
import { boardState, declineRule, openFlow, questAreaKey } from '../sim/quest-offers';
import { regionOf } from '../sim/regions';
import { sideStory } from '../sim/story-scenes';
import { areaName } from './offer-card';
import { button, el } from './dom';

/**
 * Lane C round 8 (R0607): the journal's notice board in the Open quest flow. It lists, for the
 * region the Keeper is in, what has been offered or put off (Accept from here at any time), what
 * is under way (Pin, Put aside), what was put aside (Take it up again), and how much is done.
 * Quests never offered yet stay off it: they are found by walking to where they happen.
 */
export function renderBoard(g: Game, body: HTMLElement, refresh: () => void): void {
  const c = g.world.campaign;
  const book = g.world.questBook;
  if (!c || c.storyline || !openFlow(g.world)) return;
  const region = regionOf(g.world.location);
  const box = el('section', 'journal-board');
  box.setAttribute('aria-label', OFFER_TEXT.boardHead);
  box.appendChild(el('div', 'btn-name', OFFER_TEXT.boardHead));
  box.appendChild(el('p', 'help', OFFER_TEXT.boardHelp));
  box.appendChild(
    el(
      'p',
      undefined,
      book?.here ? OFFER_TEXT.boardHere(areaName(book.here)) : OFFER_TEXT.boardNowhere,
    ),
  );
  // A command reaches the sim on a later step: redraw once the book has changed.
  const later = (): void => {
    const was = JSON.stringify(g.world.questBook);
    let tries = 0;
    const look = (): void => {
      if (JSON.stringify(g.world.questBook) !== was || ++tries > 30) refresh();
      else window.setTimeout(look, 100);
    };
    window.setTimeout(look, 100);
  };
  const groups: Record<'available' | 'active' | 'shelved', HTMLElement[]> = {
    available: [],
    active: [],
    shelved: [],
  };
  let done = 0;
  for (const id of Object.keys(book?.entries ?? {})) {
    const quest = sideStory(id);
    if (!quest) continue;
    const key = questAreaKey(quest);
    if (key !== null && !key.startsWith(`${region}/`)) continue;
    const state = boardState(g.world, c, id);
    if (state === 'done') {
      done += 1;
      continue;
    }
    if (!state) continue;
    const row = el('div', 'journal-line');
    const tag = isFunQuestCode(quest.code) ? OFFER_TEXT.caper : OFFER_TEXT.story;
    row.appendChild(el('div', 'roster-line', `${quest.title} · ${tag}`));
    if (key) row.appendChild(el('small', undefined, areaName(key)));
    const send = (cmd: Parameters<Game['send']>[0]): void => {
      g.send(cmd);
      later();
    };
    if (state === 'available') {
      row.appendChild(
        button(OFFER_TEXT.accept, () => send({ kind: 'questAccept', id }), 'btn btn-primary'),
      );
    } else if (state === 'shelved') {
      row.appendChild(button(OFFER_TEXT.resume, () => send({ kind: 'questAccept', id })));
    } else {
      const pinned = book?.tracked.includes(id) ?? false;
      row.appendChild(
        button(pinned ? OFFER_TEXT.untrack : OFFER_TEXT.track, () =>
          send({ kind: 'questTrack', id, on: !pinned }),
        ),
      );
      if (declineRule(id) === 'free')
        row.appendChild(button(OFFER_TEXT.putAside, () => send({ kind: 'questShelve', id })));
    }
    groups[state].push(row);
  }
  const heads = {
    available: OFFER_TEXT.available,
    active: OFFER_TEXT.inProgress,
    shelved: OFFER_TEXT.shelved,
  };
  let any = false;
  for (const k of ['available', 'active', 'shelved'] as const) {
    if (groups[k].length === 0) continue;
    any = true;
    box.appendChild(el('h4', undefined, heads[k]));
    box.append(...groups[k]);
  }
  if (done > 0) box.appendChild(el('p', undefined, `${OFFER_TEXT.done}: ${done}`));
  if (!any && done === 0) box.appendChild(el('p', undefined, OFFER_TEXT.empty));
  body.appendChild(box);
}
