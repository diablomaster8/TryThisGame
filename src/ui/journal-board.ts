import { OFFER_TEXT } from '../config/strings';
import { KID_FLOW_TEXT } from '../config/strings-camp12d';
import type { Game } from '../game';
import { isFunQuestCode } from '../sim/audience';
import {
  boardState,
  declineRule,
  kidFlow,
  openFlow,
  questAreaKey,
  questProgress,
} from '../sim/quest-offers';
import { fitProgress } from '../sim/quest-minutes';
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
  if (kidFlow(g.world)) return renderKidBoard(g, body, region, refresh);
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
    // R0635: how far along it is, or how long it is before it starts.
    const prog = fitProgress(id, questProgress(g.world, id));
    const size = prog
      ? OFFER_TEXT.stepOf(prog.step, prog.of, prog.minutesLeft)
      : OFFER_TEXT.steps(quest.steps.length);
    row.appendChild(el('small', undefined, key ? `${areaName(key)} · ${size}` : size));
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

/**
 * R0629 (CAMP-37): a child's notice board is picture tiles only: one big tile per story offered,
 * put aside or under way, tapped to start (or to take up again). No Pin, no Put aside, no counts.
 * A story under way says so in its label as well as by its border colour.
 */
function renderKidBoard(g: Game, body: HTMLElement, region: string, refresh: () => void): void {
  const c = g.world.campaign;
  const book = g.world.questBook;
  if (!c) return;
  const box = el('section', 'journal-board board-kid');
  box.setAttribute('aria-label', OFFER_TEXT.boardHead);
  const tiles = el('div', 'kid-tiles');
  for (const id of Object.keys(book?.entries ?? {})) {
    const quest = sideStory(id);
    if (!quest) continue;
    const key = questAreaKey(quest);
    if (key !== null && !key.startsWith(`${region}/`)) continue;
    const state = boardState(g.world, c, id);
    if (state !== 'available' && state !== 'shelved' && state !== 'active') continue;
    const gift = quest.rewards.find((r) => r.kind !== 'flag');
    const pic = (gift && OFFER_TEXT.rewardIcon[gift.kind]) || KID_FLOW_TEXT.boardPicture;
    const active = state === 'active';
    const tile = button(
      '',
      () => {
        if (!active) g.send({ kind: 'questAccept', id });
        window.setTimeout(refresh, 300);
      },
      `kid-tile${active ? ' kid-tile-active' : ''}`,
    );
    tile.append(el('span', 'kid-pic', pic), el('span', undefined, quest.title));
    tile.setAttribute(
      'aria-label',
      active ? KID_FLOW_TEXT.boardActive(quest.title) : KID_FLOW_TEXT.boardStart(quest.title),
    );
    tiles.append(tile);
  }
  if (tiles.childElementCount === 0) return;
  box.append(tiles);
  body.appendChild(box);
}
