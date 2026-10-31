/**
 * Lane E round 10 (R0694 KIDS-26): the grown-up heads-up before a story about loss (chapters
 * 10 and 11, and the side stories with a departure). While one waits in a Learning Grove
 * (sim/loss-notice.ts), a calm card says so, with "We are together now: play it" (behind the
 * grown-up gate) and "Not yet" (hides it until the next visit to the Grove). The grown-up
 * area's section lists the upcoming ones with a choice each and a five-tip guide.
 */
import '../access-r10.css';
import { LOSS_TEXT } from '../config/strings-access-r10';
import type { Game } from '../game';
import {
  lossHoldOf,
  lossWaiting,
  upcomingLossChapters,
  upcomingLossSideStories,
  type LossKey,
} from '../sim/loss-notice';
import type { LossHold } from '../sim/types';
import { button, el } from './dom';
import { askGrownUp } from './grown-up-gate';

export class LossNotice {
  private readonly root: HTMLDivElement;
  private readonly body: HTMLParagraphElement;
  private story: LossKey | null = null;
  /** "Not yet" for this story, this page load. */
  private dismissed = new Set<LossKey>();
  private asking = false;

  constructor(
    private readonly parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.root = el('div', 'loss-notice');
    this.root.setAttribute('role', 'dialog');
    this.root.setAttribute('aria-live', 'polite');
    const title = el('h3', undefined, LOSS_TEXT.noticeTitle);
    this.body = el('p');
    const actions = el('div', 'loss-notice-actions');
    actions.append(
      button(LOSS_TEXT.together, () => void this.release()),
      button(LOSS_TEXT.later, () => {
        if (this.story !== null) this.dismissed.add(this.story);
        this.root.hidden = true;
      }),
    );
    this.root.append(title, this.body, actions);
    this.root.hidden = true;
    parent.appendChild(this.root);
  }

  /** Each frame: touches the DOM only when the waiting story or visibility changes. */
  update(g: Game, busy: boolean): void {
    const key = lossWaiting(g.world);
    const show = key !== null && !busy && !this.dismissed.has(key) && !this.asking;
    if (key !== this.story) {
      this.story = key;
      if (key !== null) this.body.textContent = LOSS_TEXT.noticeBody(LOSS_TEXT.storyLabel(key));
    }
    if (this.root.hidden === show) this.root.hidden = !show;
  }

  private async release(): Promise<void> {
    const key = this.story;
    if (key === null) return;
    this.asking = true;
    this.root.hidden = true;
    const ok = await askGrownUp(this.parent, this.toast);
    this.asking = false;
    if (ok) this.game()?.send({ kind: 'eduLossHold', chapter: key, hold: 'released' });
  }
}

/** The grown-up area's section: upcoming loss stories, a choice each, and the guide. */
export function lossSettings(body: HTMLElement, g: Game): void {
  if (!g.world.edu) return;
  const stories: LossKey[] = [
    ...upcomingLossChapters(g.world),
    ...upcomingLossSideStories(g.world),
  ];
  body.appendChild(el('h3', undefined, LOSS_TEXT.heading));
  body.appendChild(el('p', 'help', LOSS_TEXT.help));
  for (const key of stories) {
    const row = el('label', 'field-row');
    const sel = el('select');
    const now = lossHoldOf(g.world, key) ?? 'play';
    const options: LossHold[] = now === 'released' ? ['released', 'play'] : ['together', 'play'];
    for (const h of options) {
      const o = el('option', undefined, LOSS_TEXT.holds[h]);
      o.value = h;
      sel.appendChild(o);
    }
    sel.value = now;
    sel.addEventListener('change', () =>
      g.send({ kind: 'eduLossHold', chapter: key, hold: sel.value as LossHold }),
    );
    row.append(el('strong', undefined, LOSS_TEXT.storyLabel(key)), sel);
    body.appendChild(row);
  }
  const guide = el('details', 'loss-guide');
  guide.appendChild(el('summary', undefined, LOSS_TEXT.guideHeading));
  const list = el('ul');
  for (const tip of LOSS_TEXT.guide) list.appendChild(el('li', undefined, tip));
  guide.appendChild(list);
  body.appendChild(guide);
}
