import { EDU_COLOURS, EDU_LADDER, EDU_SHAPES, type EduGameId } from '../config/edu';
import { EDU_MASTERY_TEXT, EDU_TEXT } from '../config/strings';
import { eduMastery, eduRung, gamesForBand } from '../sim/edu';
import type { World } from '../sim/types';
import { el } from './dom';

/**
 * R0683 (KIDS-15): the grown-up area's per-item report: 26 letter tiles, then strips for the
 * numbers, colours and shapes. Each tile is green (known), amber (learning) or grey (not met),
 * with its state in the title and a mark, so colour is never the only signal.
 * R0682 (KIDS-14): under it, each game's rung on its ladder in plain words.
 */
export function masteryReport(body: HTMLElement, world: World): void {
  const e = world.edu;
  if (!e) return;
  const items = e.items ?? {};
  body.appendChild(el('h3', undefined, EDU_MASTERY_TEXT.heading));
  body.appendChild(el('p', 'help', EDU_MASTERY_TEXT.help));
  const strip = (label: string, ids: { id: string; text: string }[]) => {
    const wrap = el('div', 'edu-mastery');
    wrap.appendChild(el('strong', undefined, label));
    const grid = el('div', 'edu-mastery-grid');
    for (const { id, text } of ids) {
      const state = eduMastery(items[id]);
      const tile = el('span', `edu-mastery-tile is-${state}`, text);
      tile.title = `${text}: ${EDU_MASTERY_TEXT.states[state]}`;
      tile.dataset.state = state;
      tile.setAttribute('aria-label', tile.title);
      grid.appendChild(tile);
    }
    wrap.appendChild(grid);
    body.appendChild(wrap);
  };
  strip(
    EDU_MASTERY_TEXT.letters,
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l) => ({ id: `letter:${l}`, text: l })),
  );
  strip(
    EDU_MASTERY_TEXT.numbers,
    Array.from({ length: 10 }, (_, i) => ({ id: `count:${i + 1}`, text: String(i + 1) })),
  );
  strip(
    EDU_MASTERY_TEXT.colours,
    EDU_COLOURS[6].map((c) => ({ id: `colour:${c}`, text: c })),
  );
  strip(
    EDU_MASTERY_TEXT.shapes,
    EDU_SHAPES[6].map((s) => ({ id: `shape:${s}`, text: s })),
  );
  if (e.band === 'reader') return;
  body.appendChild(el('h3', undefined, EDU_MASTERY_TEXT.ladderHeading));
  const list = el('div', 'shop-list');
  for (const id of gamesForBand(e.band) as readonly EduGameId[]) {
    const rungs = EDU_LADDER[id];
    const r = eduRung(world, id);
    const row = el('div', 'shop-row');
    const t = el('div');
    t.append(
      el('strong', undefined, `${EDU_TEXT.gameIcons[id]} ${EDU_TEXT.gameNames[id]}`),
      el('small', undefined, EDU_MASTERY_TEXT.ladderRow(rungs[r]!.say, r + 1, rungs.length)),
    );
    row.appendChild(t);
    list.appendChild(row);
  }
  body.appendChild(list);
}
