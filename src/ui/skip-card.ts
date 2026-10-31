/**
 * Lane C round 10, agent C (R0617, CAMP-25): the card after every skip and every imagined step.
 * A skipped goal changes the world quietly, so the card says what happened (the step's title,
 * a line or two of summary) and what changed in the Grove, before later scenes lean on it.
 * One card per parent, reused; it is an ordinary modal, so Escape and the backdrop close it.
 */
import { SKIP_CARD_TEXT } from '../config/strings';
import { el, modal } from './dom';

const cards = new WeakMap<HTMLElement, ReturnType<typeof modal>>();
const all: Array<ReturnType<typeof modal>> = [];

/** Whether a summary card is up (story scenes wait for it to close). */
export function skipCardOpen(): boolean {
  return all.some((c) => c.isOpen());
}

/** Show the summary card: `title`, then `summary`, then any world `changes` as a list. */
export function showSkipCard(
  parent: HTMLElement,
  title: string,
  summary: string,
  changes: readonly string[] = [],
): void {
  let card = cards.get(parent);
  if (!card) {
    card = modal(parent, SKIP_CARD_TEXT.title, SKIP_CARD_TEXT.ok);
    card.root.classList.add('skip-card');
    cards.set(parent, card);
    all.push(card);
  }
  const body = card.body;
  body.replaceChildren(el('div', 'btn-name', title), el('p', undefined, summary));
  if (changes.length > 0) {
    body.appendChild(el('div', 'btn-name', SKIP_CARD_TEXT.changesHead));
    const list = el('ul', 'skip-card-changes');
    for (const c of changes) list.appendChild(el('li', undefined, c));
    body.appendChild(list);
  }
  card.show();
}

/** The summary of a skipped side step: its writer `summary` if it has one, else "Done: goal". */
export function stepSummary(step: { goal: string; summary?: string }): string {
  return step.summary ?? SKIP_CARD_TEXT.done(step.goal);
}
