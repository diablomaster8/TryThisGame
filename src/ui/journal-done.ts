import { C11_TEXT, STORY_REGION_TEXT } from '../config/strings';
import { STORY_TEXT } from '../config/story';
import type { Scene } from '../config/story';
import type { Game } from '../game';
import { ledger } from '../sim/camp11';
import { FINAL_CHAPTER } from '../sim/campaign';
import { journalView } from '../sim/storyline';
import { rewardById, sideStory } from '../sim/story-scenes';
import { recapBlocks } from './recap';
import { el } from './dom';
import { button } from './dom';
import { renderEndingShelf } from './journal-quests';

/**
 * Lane C round 11, helper ui (R0641, R0666, R0620, R0610): the journal's Done and Lines pages.
 * Done holds the completion ledger (per region and line, with the leaf on quests played
 * through; no penalty and nothing lost for a skip), the keepsakes with a Watch again that
 * replays the quest's closing scene from a copy and changes nothing, and the endings shelf.
 * Lines opens with Hazel's Grove as a card with its chapter bar and the story so far.
 */

/** A `<progress>`-style bar that screen readers can read, n of of. */
export function bar(n: number, of: number, label: string): HTMLElement {
  const wrap = el('div', 'c11-bar');
  wrap.setAttribute('role', 'progressbar');
  wrap.setAttribute('aria-valuemin', '0');
  wrap.setAttribute('aria-valuemax', String(of));
  wrap.setAttribute('aria-valuenow', String(Math.min(n, of)));
  wrap.setAttribute('aria-label', label);
  const fill = el('div', 'c11-bar-fill');
  fill.style.width = `${of === 0 ? 0 : Math.round((Math.min(n, of) / of) * 100)}%`;
  wrap.appendChild(fill);
  return wrap;
}

export interface DoneOptions {
  titleOf: (id: string) => string;
  /** Play a scene again in replay mode (the dialogue's side-scene path; no sim). */
  replay: ((scene: Scene) => void) | null;
  close: () => void;
}

export function renderDone(g: Game, body: HTMLElement, o: DoneOptions): void {
  const led = ledger(g.world);
  body.appendChild(el('div', 'btn-name', C11_TEXT.ledgerHead));
  body.appendChild(el('p', undefined, C11_TEXT.ledgerAll(led.percent)));
  body.appendChild(bar(led.percent, 100, C11_TEXT.ledgerAll(led.percent)));
  const names = STORY_REGION_TEXT.names as Record<string, string>;
  const list = el('ul', 'c11-ledger');
  for (const r of led.regions) {
    const li = el(
      'li',
      undefined,
      `${names[r.id] ?? r.id}: ${C11_TEXT.ledgerRegion(r.done, r.total, r.endings)}`,
    );
    if (r.played > 0) {
      const leaf = el('span', 'c11-leaf', ` ${C11_TEXT.leaf} ${r.played}`);
      leaf.setAttribute('role', 'img');
      leaf.setAttribute('aria-label', `${r.played} ${C11_TEXT.leafLabel}`);
      li.appendChild(leaf);
    }
    list.appendChild(li);
  }
  for (const l of led.lines)
    list.appendChild(
      el(
        'li',
        undefined,
        `${l.title}: ${l.begun || l.ending ? C11_TEXT.ledgerLine(l.n, l.of, l.ending) : C11_TEXT.ledgerLineNew}`,
      ),
    );
  body.appendChild(list);
  body.appendChild(el('p', 'help', C11_TEXT.leafHelp));
  // Keepsakes, newest first, each with Watch again.
  const kept = g.world.inventory.keepsakes;
  if (kept.length > 0) {
    body.appendChild(el('div', 'btn-name', C11_TEXT.keepsakesHead));
    body.appendChild(el('p', 'help', C11_TEXT.keepsakesHelp));
    for (const id of [...kept].reverse()) {
      const found = rewardById(id);
      const quest = found ? sideStory(found.quest) : undefined;
      if (!found || !quest) continue;
      const row = el('div', 'c11-keep');
      const leaf = led.leaves.has(quest.id) ? ` ${C11_TEXT.leaf}` : '';
      row.appendChild(el('strong', undefined, `${found.reward.label}${leaf}`));
      row.appendChild(el('span', 'help', ` · ${o.titleOf(quest.id)}`));
      row.appendChild(el('p', 'help', found.reward.description));
      const scene = quest.complete;
      if (o.replay && scene)
        row.appendChild(
          button(
            C11_TEXT.replay,
            () => {
              o.close();
              o.replay?.(scene);
            },
            'btn btn-small c11-go',
          ),
        );
      body.appendChild(row);
    }
  }
  const view = journalView(g.world, g.world.campaign!, false);
  if (view) renderEndingShelf(g, body, view);
}

/** Hazel's Grove as the first card of Lines: chapter n of 12, the bar, the story so far. */
export function renderSpineCard(g: Game, body: HTMLElement): void {
  const c = g.world.campaign;
  if (!c || c.storyline) return;
  const card = el('section', 'journal-line c11-spine');
  const n = Math.min(c.chapter, FINAL_CHAPTER + 1) - 1;
  const view = journalView(g.world, c, false);
  card.appendChild(el('div', 'roster-line', STORY_TEXT.journal));
  if (view)
    card.appendChild(
      el(
        'p',
        undefined,
        c.chapter > view.final
          ? STORY_TEXT.endingReached(view.endings[view.ending ?? '']?.title ?? '')
          : STORY_TEXT.chapter(view.n, view.title),
      ),
    );
  card.appendChild(bar(n, FINAL_CHAPTER, `${n}/${FINAL_CHAPTER}`));
  const blocks = recapBlocks(g).spine;
  if (blocks.length > 0) {
    const fold = el('details', 'journal-recap');
    fold.appendChild(el('summary', undefined, C11_TEXT.recapHead));
    for (const r of blocks) fold.appendChild(el('p', 'help', r));
    card.appendChild(fold);
  }
  body.appendChild(card);
}
