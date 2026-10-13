import { TRAINER_LABELS } from '../config/strings';
import { CHAPTERS, ENDINGS, SPEAKERS, STORY_TEXT } from '../config/story';
import type { Game } from '../game';
import { chapterDef, goalMet } from '../sim/campaign';
import { button, el, modal } from './dom';

/** The campaign journal: chapter, goal and hint, friends, and the Paths page of endings. */
export class Journal {
  private readonly dialog;
  private readonly body: HTMLDivElement;
  private page: 'chapter' | 'paths' = 'chapter';

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, STORY_TEXT.journal, 'Close');
    this.body = el('div');
    this.dialog.body.appendChild(this.body);
  }

  open(): void {
    this.refresh();
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  private refresh(): void {
    const g = this.game();
    const c = g?.world.campaign;
    this.body.innerHTML = '';
    if (!g || !c) return;
    const tabs = el('div', 'race-tiers');
    for (const [id, label] of [
      ['chapter', STORY_TEXT.chapter(Math.min(c.chapter, 12), chapterDef(Math.min(c.chapter, 12))?.title ?? '')],
      ['paths', STORY_TEXT.paths],
    ] as const) {
      const b = button(
        label,
        () => {
          this.page = id;
          this.refresh();
        },
        'btn btn-small',
      );
      if (this.page === id) b.classList.add('active');
      tabs.appendChild(b);
    }
    this.body.appendChild(tabs);
    if (this.page === 'paths') this.renderPaths(c.ending);
    else this.renderChapter(g);
  }

  private renderChapter(g: Game): void {
    const c = g.world.campaign!;
    const def = chapterDef(Math.min(c.chapter, 12));
    if (!def) return;
    if (c.chapter > 12) {
      const ending = c.ending ? ENDINGS[c.ending] : undefined;
      this.body.appendChild(el('p', 'help', STORY_TEXT.endingReached(ending?.title ?? '')));
    } else {
      const met = goalMet(g.world, c);
      this.body.appendChild(el('div', 'btn-name', `${STORY_TEXT.goal}${met ? ' ✓' : ''}`));
      this.body.appendChild(el('p', undefined, def.goalText));
      this.body.appendChild(el('div', 'btn-name', STORY_TEXT.hint));
      this.body.appendChild(el('p', 'help', def.hint));
    }
    // Sable and Moss at a glance.
    const list = el('div', 'journal-cast');
    for (const id of [c.sableId, c.mossId]) {
      const n = id ? g.world.nubbins.find((x) => x.id === id) : undefined;
      if (!n) continue;
      const state = n.shadow
        ? n.bond
          ? STORY_TEXT.bonded
          : n.stray
            ? STORY_TEXT.stray
            : STORY_TEXT.shadow
        : '';
      list.appendChild(
        el('div', 'roster-line', `${n.name} · ${STORY_TEXT.trust} ${Math.round(n.trust)}${state ? ` · ${state}` : ''}`),
      );
    }
    this.body.appendChild(list);
    // Friends.
    const friends = Object.entries(c.friendship)
      .filter(([, v]) => v !== 0)
      .sort((a, b) => b[1] - a[1]);
    if (friends.length > 0) {
      this.body.appendChild(el('div', 'btn-name', STORY_TEXT.friends));
      const row = el('div', 'roster-stats');
      row.textContent = friends
        .map(([id, v]) => `${TRAINER_LABELS[id]?.name ?? SPEAKERS[id]?.name ?? id} ${v > 0 ? '+' : ''}${v}`)
        .join(' · ');
      this.body.appendChild(row);
    }
    // Chapter list.
    const chapters = el('div', 'journal-chapters');
    for (const ch of CHAPTERS) {
      const done = ch.n < c.chapter;
      const current = ch.n === c.chapter;
      chapters.appendChild(
        el('div', `journal-chapter${done ? ' done' : current ? ' current' : ''}`, `${done ? '✓' : current ? '▶' : '·'} ${STORY_TEXT.chapter(ch.n, ch.title)}`),
      );
    }
    this.body.appendChild(chapters);
  }

  private renderPaths(reached: string | null): void {
    this.body.appendChild(el('p', 'help', STORY_TEXT.pathsHelp));
    for (const [id, e] of Object.entries(ENDINGS)) {
      const row = el('div', 'journal-path');
      row.appendChild(el('div', 'btn-name', `${reached === id ? '★ ' : ''}${e.title}${reached === id ? ` · ${STORY_TEXT.reached}` : ''}`));
      row.appendChild(el('p', 'help', e.how));
      this.body.appendChild(row);
    }
  }
}
