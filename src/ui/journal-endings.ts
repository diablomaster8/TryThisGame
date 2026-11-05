/** Lane C r13 (R0610): the journal's Endings and Paths pages, split out of journal.ts. */

import { CAMP11C_TEXT } from '../config/strings-camp11c';
import { STORY_TEXT } from '../config/story';
import { STORYLINE_TEXT, STORY_U4_TEXT } from '../config/strings';
import { epilogueReady, fairSeen } from '../sim/epilogue';
import type { JournalView } from '../sim/storyline';
import { button, el } from './dom';
import type { JournalCtx } from './journal-ctx';
import { endingKey, getShots } from './u4-store';

/** R0600: the Valley Fair card on Hazel's Endings tab: open once the story and two lines ended. */
function renderFair(x: JournalCtx, view: JournalView): void {
  const g = x.g;
  if (view.storyline) return;
  const card = el('section', 'journal-line');
  card.appendChild(el('div', 'roster-line', CAMP11C_TEXT.fairTitle));
  const open = epilogueReady(g.world);
  card.appendChild(el('p', 'help', open ? CAMP11C_TEXT.fairHelp : CAMP11C_TEXT.fairLocked));
  if (open)
    card.appendChild(
      button(
        fairSeen(g.world) ? CAMP11C_TEXT.fairAgain : CAMP11C_TEXT.fairPlay,
        () => g.send({ kind: 'playFair' }),
        'btn btn-primary',
      ),
    );
  x.body.appendChild(card);
}
/** K47: every ending of this story, its last picture if reached, a lock icon if not. */
export function renderEndings(x: JournalCtx, view: JournalView): void {
  const key = view.storyline ?? 'hazel';
  x.body.appendChild(el('p', 'help', STORY_U4_TEXT.endingsHelp));
  const grid = el('div', 'ending-gallery');
  x.body.appendChild(grid);
  renderFair(x, view);
  const entries = Object.entries(view.endings);
  const cells = entries.map(([id, e]) => {
    const cell = el('div', 'ending-card locked');
    const frame = el('div', 'ending-frame');
    const lock = el('span', 'ending-lock', '🔒');
    lock.setAttribute('role', 'img');
    lock.setAttribute('aria-label', STORY_U4_TEXT.lockAlt);
    frame.appendChild(lock);
    cell.append(frame, el('div', 'btn-name ending-title', e.title));
    cell.appendChild(el('div', 'help ending-state', STORY_U4_TEXT.endingLocked));
    grid.appendChild(cell);
    return { id, cell, frame, state: cell.querySelector('.ending-state') as HTMLElement };
  });
  // The ending the save has reached shows its title even before its picture is read back.
  const open = (c: (typeof cells)[number], url: string | null): void => {
    c.cell.classList.remove('locked');
    c.frame.replaceChildren();
    if (url) {
      const img = document.createElement('img');
      img.src = url;
      img.alt = entries.find(([id]) => id === c.id)?.[1].title ?? '';
      c.frame.appendChild(img);
      c.state.textContent = '';
    } else {
      c.frame.appendChild(el('span', 'ending-lock', '★'));
      c.state.textContent = STORY_U4_TEXT.endingNoPicture;
    }
  };
  for (const c of cells) if (c.id === view.ending) open(c, null);
  void getShots(cells.map((c) => endingKey(key, c.id))).then((urls) => {
    cells.forEach((c, i) => {
      const url = urls[i];
      if (!grid.isConnected) return;
      if (url) open(c, url);
    });
  });
}
export function renderPaths(x: JournalCtx, view: JournalView): void {
  const reached = view.ending;
  const n = Object.keys(view.endings).length;
  x.body.appendChild(
    el('p', 'help', view.storyline === null ? STORY_TEXT.pathsHelp : STORYLINE_TEXT.pathsHelp(n)),
  );
  for (const [id, e] of Object.entries(view.endings)) {
    const row = el('div', 'journal-path');
    row.appendChild(
      el(
        'div',
        'btn-name',
        `${reached === id ? '★ ' : ''}${e.title}${reached === id ? ` · ${STORY_TEXT.reached}` : ''}`,
      ),
    );
    row.appendChild(el('p', 'help', e.how));
    x.body.appendChild(row);
  }
}
