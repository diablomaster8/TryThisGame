/**
 * Lane E round 10 (R0740 KIDS-72): the grown-up area's "Grown-up tips" deck, in place of one
 * random line. Pages of three, most relevant first (sim/edu-tips.ts): the first page names
 * what the child is still learning; Back and More page through the rest.
 */
import '../access-r10.css';
import { EDU_TIPS } from '../config/strings-access-r10';
import type { Game } from '../game';
import { tipsDeck } from '../sim/edu-tips';
import { button, el } from './dom';

const PER_PAGE = 3;

export function tipsDeckPanel(body: HTMLElement, g: Game): void {
  const deck = tipsDeck(g.world);
  if (deck.length === 0) return;
  const pages = Math.ceil(deck.length / PER_PAGE);
  let page = 0;
  const wrap = el('section', 'tips-deck');
  wrap.setAttribute('aria-label', EDU_TIPS.heading);
  const list = el('ul');
  list.setAttribute('aria-live', 'polite');
  const count = el('span', 'help');
  const prev = button(EDU_TIPS.prev, () => go(-1), 'btn btn-small');
  const next = button(EDU_TIPS.next, () => go(1), 'btn btn-small');
  const nav = el('div', 'tips-deck-nav');
  nav.append(prev, count, next);
  const draw = () => {
    list.replaceChildren(
      ...deck.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE).map((t) => el('li', undefined, t)),
    );
    count.textContent = EDU_TIPS.page(page + 1, pages);
    prev.disabled = page === 0;
    next.disabled = page >= pages - 1;
  };
  function go(d: number): void {
    page = Math.max(0, Math.min(pages - 1, page + d));
    draw();
  }
  wrap.append(el('h3', undefined, EDU_TIPS.heading), list, nav);
  draw();
  body.appendChild(wrap);
}
