/**
 * R0741: "teach your Nubbin". The round card gets the child's first Nubbin sitting beside
 * it, wearing the keepsakes the child has earned (`sim/edu-keepsakes.ts`: each is a hat, so the
 * portrait shows it on the head). On a right answer it hops, says "<name> learned it too!" and
 * copies the answer: on a colour, shape, picture or letter round a pointing hand travels to the
 * right option; on a counting round a row of finger marks lights one by one, in step with the
 * spoken count when the card reads one. Under reduced motion nothing travels or hops: the hand
 * just stands at the answer and the fingers are lit at once. UI only: it reads the world and
 * sends nothing.
 */
import { BUDDY_A11Y, BUDDY_TEXT } from '../config/strings-buddy';
import { BUDDY_TUNING as T } from '../config/tuning-buddy';
import { EDU_VOICE } from '../config/tuning-kids';
import { EDU_KEEPSAKES } from '../config/tuning-more/kids-noticing';
import type { Game } from '../game';
import type { EduOption, EduRound } from '../minigames/edu/games';
import { reducedMotion } from '../platform/motion';
import { nubbinPortrait } from './battle-party-pick';
import { el } from './dom';
import './edu-buddy.css';

/** How the buddy copies a right answer. */
export type BuddyReaction = 'point' | 'count' | 'cheer';

const POINT_KINDS: ReadonlySet<EduOption['kind']> = new Set([
  'colour',
  'thing',
  'shape',
  'prop',
  'letter',
  'picture',
]);

/** The number a counting round is about (the cue's icons, or the right option), else null. */
export function countOf(r: EduRound): number | null {
  const pick = (o: EduOption | null | undefined): number | null => {
    if (!o) return null;
    if (o.kind === 'count' || o.kind === 'number') return o.n;
    if (o.kind === 'sum') return o.a + o.b;
    return null;
  };
  return pick(r.cue) ?? pick(r.options[r.answer]);
}

/** Pointing at a colour, shape, picture or letter; counting on its fingers on a counting round. */
export function buddyReaction(r: EduRound | null | undefined): BuddyReaction {
  if (!r) return 'point';
  const n = countOf(r);
  if (n !== null && n >= 1) return 'count';
  const right = r.options[r.answer];
  if (right && POINT_KINDS.has(right.kind)) return 'point';
  return r.cue && POINT_KINDS.has(r.cue.kind) ? 'point' : 'cheer';
}

/** How many finger marks a count shows (at most two hands), and how they split by hand. */
export function fingerRows(n: number): number[] {
  const total = Math.max(0, Math.min(T.maxFingers, Math.floor(n)));
  const rows: number[] = [];
  for (let left = total; left > 0; left -= T.perHand) rows.push(Math.min(T.perHand, left));
  return rows;
}

/** Put the buddy at the top of a round card (a card is rebuilt each round). */
export function showBuddy(card: HTMLElement, g: Game | null): void {
  const n = g?.world.nubbins[0];
  if (!g || !n) return;
  card.classList.add('edu-buddy-host');
  const box = el('div', 'edu-buddy');
  const pic = nubbinPortrait(g, n);
  pic.classList.add('edu-buddy-pic');
  pic.setAttribute('role', 'img');
  pic.setAttribute('aria-label', BUDDY_TEXT.alt(n.name));
  box.appendChild(pic);
  // The keepsakes are hats now, so a worn one is on the portrait's head. One earned but not
  // on (another hat is chosen) is a small marker beside it, never the only signal.
  const waiting = EDU_KEEPSAKES.filter(
    (k) => (g.world.inventory.keepsakes ?? []).includes(k.id) && n.hat !== k.id,
  );
  if (waiting.length) {
    const tag = el('span', 'edu-buddy-worn', waiting.map((k) => k.icon).join(' '));
    tag.title = waiting
      .map((k) =>
        BUDDY_TEXT.wearing(n.name, BUDDY_TEXT.names[k.id as keyof typeof BUDDY_TEXT.names]),
      )
      .join(' ');
    box.appendChild(tag);
  }
  box.appendChild(el('span', 'edu-buddy-say'));
  card.appendChild(box);
}

/** The centre of `a` in `host`'s own coordinates. */
function centreIn(host: HTMLElement, a: HTMLElement): { x: number; y: number } {
  const h = host.getBoundingClientRect();
  const r = a.getBoundingClientRect();
  return { x: r.left - h.left + r.width / 2, y: r.top - h.top + r.height / 2 };
}

const SVG = 'http://www.w3.org/2000/svg';

/** A pointing hand drawn as an SVG arrow: its tip is at (4, 2) of a 48 px square. */
function pointer(): SVGSVGElement {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 48 48');
  svg.setAttribute('width', String(T.markPx));
  svg.setAttribute('height', String(T.markPx));
  svg.setAttribute('class', 'edu-buddy-pointer');
  svg.setAttribute('aria-hidden', 'true');
  const poly = document.createElementNS(SVG, 'polygon');
  poly.setAttribute('points', '4,2 4,34 12,26 19,42 27,38 20,23 32,23');
  svg.appendChild(poly);
  return svg;
}

/** The hand travels from the Nubbin to the right option (it just stands there when still). */
function pointAtAnswer(card: HTMLElement, box: HTMLElement, name: string): void {
  const target = card.querySelector<HTMLElement>('.edu-option.right');
  if (!target) return;
  card.querySelectorAll('.edu-buddy-pointer').forEach((p) => p.remove());
  const hand = pointer();
  hand.setAttribute('aria-label', BUDDY_A11Y.points(name));
  card.appendChild(hand);
  target.classList.add('edu-buddy-target');
  const to = centreIn(card, target);
  // The tip (4, 2 of 48) lands on the middle of the option.
  const tip = (p: { x: number; y: number }): string =>
    `translate(${Math.round(p.x - 4)}px, ${Math.round(p.y - 2)}px)`;
  const motion = !reducedMotion() && typeof hand.animate === 'function';
  if (!motion) {
    hand.style.transform = tip(to);
    return;
  }
  const pic = box.querySelector<HTMLElement>('canvas') ?? box;
  const from = centreIn(card, pic);
  hand.style.transform = tip(to);
  hand.animate([{ transform: tip(from) }, { transform: tip(to) }], {
    duration: T.pointMs,
    easing: 'ease-in-out',
  });
  window.setTimeout(() => {
    if (!hand.isConnected) return;
    const fade = hand.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 });
    fade.onfinish = () => {
      hand.remove();
      target.classList.remove('edu-buddy-target');
    };
  }, T.pointMs + T.pointHoldMs);
}

/** The finger marks: one hand of five, then a second. Lit one by one, or all at once when still. */
function countOnFingers(card: HTMLElement, box: HTMLElement, n: number, name: string): void {
  const rows = fingerRows(n);
  if (!rows.length) return;
  box.querySelector('.edu-buddy-fingers')?.remove();
  const wrap = el('div', 'edu-buddy-fingers');
  wrap.setAttribute('role', 'img');
  wrap.setAttribute('aria-label', BUDDY_A11Y.counts(name, n));
  const marks: HTMLElement[] = [];
  for (const count of rows) {
    const row = el('div', 'edu-buddy-hand');
    for (let i = 0; i < count; i++) {
      const m = el('span', 'edu-buddy-finger');
      marks.push(m);
      row.appendChild(m);
    }
    wrap.appendChild(row);
  }
  box.appendChild(wrap);
  const light = (upTo: number): void => {
    marks.forEach((m, i) => m.classList.toggle('lit', i < upTo));
  };
  if (reducedMotion()) {
    light(marks.length);
    return;
  }
  // The card's own count-along lights its icons as it says each number; follow it so the
  // fingers and the spoken count stay together. Without icons, count on a timer.
  const icons = [...card.querySelectorAll<HTMLElement>('.edu-cue .edu-icons > span')];
  if (icons.length && typeof MutationObserver === 'function') {
    const seen = (): number => icons.filter((s) => s.classList.contains('edu-counted-keep')).length;
    const obs = new MutationObserver(() => {
      light(seen());
      if (!card.isConnected || seen() >= icons.length) obs.disconnect();
    });
    for (const s of icons) obs.observe(s, { attributes: true, attributeFilter: ['class'] });
    return;
  }
  const step = (i: number): void => {
    if (!wrap.isConnected || i > marks.length) return;
    light(i);
    window.setTimeout(() => step(i + 1), EDU_VOICE.countMs);
  };
  step(1);
}

/**
 * The buddy copies a right answer: a hop, its line, and a point or a count. `round` is the
 * round just answered; without it the buddy points at the option marked right.
 */
export function cheerBuddy(card: HTMLElement, g: Game | null, round?: EduRound | null): void {
  const box = card.querySelector<HTMLElement>('.edu-buddy');
  const n = g?.world.nubbins[0];
  if (!box || !n) return;
  const say = box.querySelector<HTMLElement>('.edu-buddy-say');
  if (say) say.textContent = BUDDY_TEXT.learned(n.name);
  if (!reducedMotion())
    box
      .querySelector('canvas')
      ?.animate?.(
        [
          { transform: 'translateY(0)' },
          { transform: `translateY(-${T.hopPx}px)` },
          { transform: 'none' },
        ],
        { duration: T.hopMs, easing: 'ease-out' },
      );
  const how = buddyReaction(round);
  if (how === 'point') pointAtAnswer(card, box, n.name);
  else if (how === 'count' && round) {
    const count = countOf(round);
    if (count !== null) countOnFingers(card, box, count, n.name);
  }
}
