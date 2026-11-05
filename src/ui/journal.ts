import { STORY_U4_TEXT } from '../config/strings';
import { STORY_TEXT } from '../config/story';
import type { Game } from '../game';
import { goalMet } from '../sim/campaign';
import { journalView } from '../sim/storyline';
import { funQuestIds, sideActable } from '../sim/side-stories';
import { timeCheckMet } from '../sim/side-rule-kit';
import type { JournalView } from '../sim/storyline';
import { sideStory } from '../sim/story-scenes';
import { button, el, modal } from './dom';
import { MicroScreen } from '../minigames/micro/micro-screen';
import { hashSeed } from '../sim/rng';
import { isLangQuestCode, TRACE_TARGETS } from '../sim/lang';
import { TraceGame } from './trace';
import { renderHollowPage } from './hollow-journal';
import { HOLLOW_R6_TEXT } from '../config/strings';
import { PLACES_TEXT } from '../config/strings-world';
import { renderPlaces } from './landmark-card';
import { renderLines } from './journal-lines';
import { renderChapterSelect } from './chapter-select';
import { renderEndingShelf, renderQuestsPage } from './journal-quests';
import { JOURNAL_TEXT } from '../config/strings-journal';
import { PROGRESS_TEXT } from '../config/strings-r11d4-progress';
import { phoneSheet, tabKeys } from './journal-sheet';
import { spineControls, stepControls } from './journal-step';
import '../camp-r11.css';
import { C11_TEXT } from '../config/strings';
import type { Scene } from '../config/story';
import { renderNow, type NowOptions } from './journal-now';
import { renderAreas } from './journal-areas';
import { renderDone, renderSpineCard } from './journal-done';
import type { JournalCtx } from './journal-ctx';
import { eduJournal } from './journal-edu';
import { renderChapter } from './journal-chapter';
import { renderEndings, renderPaths } from './journal-endings';

export { eduJournal };

/** Lane C r11 (R0610): the page the journal last showed this session, kept across openings. */
let lastPage: string | null = null;

/** The campaign journal: chapter, goal and hint, friends, and the Paths page of endings. */
export class Journal {
  private readonly dialog;
  private readonly body: HTMLDivElement;
  private page:
    | 'now'
    | 'areas'
    | 'lines'
    | 'done'
    | 'more'
    | 'chapter'
    | 'quests'
    | 'paths'
    | 'endings'
    | 'hollow'
    | 'places'
    | 'progress' = 'now';
  /** R0666: plays a closing scene again from a copy (the HUD sets it to the dialogue's). */
  replay: ((scene: Scene) => void) | null = null;
  /** R0660: on a phone the tabs sit at the foot of the sheet, in thumb reach. */
  private readonly phone = window.matchMedia?.('(orientation: portrait) and (max-width: 600px)');

  private readonly micro: MicroScreen;

  constructor(
    private readonly parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, STORY_TEXT.journal, 'Close');
    // R0294: the micro-games that stand in for a bare "Do it".
    this.micro = new MicroScreen(parent);
    this.body = el('div');
    this.dialog.body.appendChild(this.body);
    // R0662: the pages are a tablist over this panel; R0660: a swipe down on the title closes.
    this.body.id = 'journal-panel';
    this.body.setAttribute('role', 'tabpanel');
    this.dialog.root.classList.add('journal-modal');
    phoneSheet(this.dialog.root, () => this.close());
    this.trace = new TraceGame(parent, game);
  }

  /** The language courses' tracing game (CV3), opened from a tracing step. */
  private readonly trace: TraceGame;

  /** Tracing steps already offered this session, as `quest:step`, so each opens once. */
  private readonly offered = new Set<string>();

  /**
   * Right after the scene that asks for it, a language quest's tracing step opens the
   * tracing game itself rather than waiting in the Journal (review 2026-10-21, bug 31).
   * The HUD calls this when no scene or panel is up; true if the game opened.
   */
  offerTrace(): boolean {
    const g = this.game();
    const c = g?.world.campaign;
    if (!g?.world.edu || !c || this.trace.isOpen()) return false;
    for (const id of funQuestIds(c)) {
      const st = c.fun[id];
      const quest = sideStory(id);
      const step = quest?.steps[st?.step ?? 0];
      if (!st || !quest || !step || !isLangQuestCode(quest.code)) continue;
      const target = TRACE_TARGETS[step.check];
      const key = `${id}:${st.step}`;
      if (!target || this.offered.has(key) || !sideActable(g.world, c, id)) continue;
      this.offered.add(key);
      this.trace.open(id, target, () => undefined);
      return true;
    }
    return false;
  }

  isTracing(): boolean {
    return this.trace.isOpen();
  }

  /** Panels a storyline action opens (hud.ts fills these in), by StoryAction.ui. */
  readonly openers: Record<string, () => void> = {};

  open(): void {
    // R0610: the last page of this session, else Now.
    if (lastPage) this.page = lastPage as typeof this.page;
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
    // R0662: a tab chosen from the keyboard keeps the focus on the redrawn tab.
    const onTab = document.activeElement?.getAttribute('role') === 'tab';
    this.body.innerHTML = '';
    if (!g || !c) return;
    if (onTab)
      queueMicrotask(() =>
        this.body.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.focus(),
      );
    const view = journalView(g.world, c, goalMet(g.world, c));
    if (!view) return;
    const tabs = el('div', 'race-tiers journal-tabs');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', JOURNAL_TEXT.tabsLabel);
    const OLD = ['chapter', 'quests', 'paths', 'endings', 'hollow', 'places'];
    const shown = this.page !== 'more' && OLD.includes(this.page) ? 'more' : this.page;
    for (const [id, label] of [
      ['now', C11_TEXT.tabs.now!],
      ['areas', C11_TEXT.tabs.areas!],
      ['lines', C11_TEXT.tabs.lines!],
      ['done', C11_TEXT.tabs.done!],
      ['more', JOURNAL_TEXT.moreTab],
      // R0511 / R0474: ring meters and the private diary (`ui/progress-panel.ts`, on demand).
      ['progress', PROGRESS_TEXT.tab],
    ] as const) {
      const b = button(
        label,
        () => {
          this.page = id;
          lastPage = id;
          this.refresh();
        },
        'btn btn-small',
      );
      if (shown === id) b.classList.add('active');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(shown === id));
      b.setAttribute('aria-controls', this.body.id);
      b.tabIndex = shown === id ? 0 : -1;
      tabs.appendChild(b);
    }
    tabKeys(tabs);
    this.body.appendChild(tabs);
    if (this.page === 'progress') {
      const holder = el('div', 'journal-progress');
      this.body.appendChild(holder);
      void import('./progress-panel').then((m) => m.renderProgress(g.world, holder));
    } else if (this.page === 'now') renderNow(g, this.body, this.nowOptions(g));
    else if (this.page === 'areas') renderAreas(g, this.body, this.nowOptions(g));
    else if (this.page === 'lines') this.renderLinesPage(g);
    else if (this.page === 'done')
      renderDone(g, this.body, {
        titleOf: (id) => eduJournal(g)?.title(id) ?? sideStory(id)?.title ?? id,
        replay: this.replay,
        close: () => this.close(),
      });
    else if (this.page === 'more') this.renderMore(view);
    else if (this.page === 'places') this.body.appendChild(renderPlaces(g.world));
    else if (this.page === 'quests') renderQuestsPage(g, this.body);
    else if (this.page === 'paths') renderPaths(this.ctx(g), view);
    else if (this.page === 'endings') {
      renderEndings(this.ctx(g), view);
      renderEndingShelf(g, this.body, view);
    } else if (this.page === 'hollow') renderHollowPage(g.world, this.body);
    else renderChapter(this.ctx(g), view);
    // R0660: on a phone the tabs move to a sticky footer just above Close.
    if (this.phone?.matches) {
      tabs.classList.add('journal-tabs-foot');
      this.body.appendChild(tabs);
    }
  }

  /** R0610: what the Now and Areas pages need from the journal. */
  private nowOptions(g: Game): NowOptions {
    return {
      titleOf: (id) => eduJournal(g)?.title(id) ?? sideStory(id)?.title ?? id,
      controls: (id) => this.questControls(g, id),
      spine: () => {
        const ctl = spineControls(g, this.parent, () => this.close());
        if (ctl.length === 0) return null;
        const row = el('div', 'journal-actions');
        row.append(...ctl);
        return row;
      },
      close: () => this.close(),
    };
  }

  /** The buttons for a quest's current step, as the Quests lists show them, or null. */
  private questControls(g: Game, id: string): HTMLElement | null {
    const c = g.world.campaign!;
    const st = c.fun[id] ?? c.side[id];
    const quest = sideStory(id);
    const step = quest?.steps[Math.min(st?.step ?? 0, (quest?.steps.length ?? 1) - 1)];
    if (!st || !quest || !step || st.status !== 'open' || !sideActable(g.world, c, id)) return null;
    if (TRACE_TARGETS[step.check]) return null;
    if (st.stage === 'check' && timeCheckMet(g.world, st, step.check) === false) return null;
    const row = el('div', 'journal-actions');
    row.append(
      ...stepControls({
        g,
        parent: this.parent,
        id,
        title: eduJournal(g)?.title(id) ?? quest.title,
        stepIndex: st.step,
        step,
        close: () => this.dialog.hide(),
        playMicro: (kind, act) => {
          const seed = Math.abs(hashSeed(`${id}:${step.id}`));
          this.micro.open(kind, step.goal, seed, g.reduceMotion, act);
        },
      }),
    );
    return row;
  }

  /** R0610: Lines, with Hazel's Grove first, then each road beside it. */
  private renderLinesPage(g: Game): void {
    renderSpineCard(g, this.body);
    renderLines(
      g,
      this.body,
      () => this.refresh(),
      () => this.close(),
      this.openers,
    );
    // Lane C r11 (R0618): finished chapters, Watch again or Play from here.
    renderChapterSelect(g, this.body, this.replay, () => this.close());
  }

  /** The older pages, one tap each, so nothing the journal had is lost. */
  private renderMore(view: JournalView): void {
    const row = el('div', 'c11-more-pages');
    for (const [id, label] of [
      ['chapter', STORY_TEXT.chapter(view.n, view.title)],
      ['quests', JOURNAL_TEXT.questsTab],
      ['paths', STORY_TEXT.paths],
      ['endings', STORY_U4_TEXT.endingsTab],
      ['hollow', HOLLOW_R6_TEXT.journalTitle],
      ['places', PLACES_TEXT.tab],
    ] as const)
      row.appendChild(
        button(
          label,
          () => {
            this.page = id;
            lastPage = id;
            this.refresh();
          },
          'btn c11-go',
        ),
      );
    this.body.appendChild(row);
  }

  /** What the Chapter, Endings and Paths pages need from this journal. */
  private ctx(g: Game): JournalCtx {
    return {
      g,
      body: this.body,
      parent: this.parent,
      hide: () => this.dialog.hide(),
      close: () => this.close(),
      refresh: () => this.refresh(),
      reopen: () => this.open(),
      openers: this.openers,
      micro: this.micro,
      trace: this.trace,
    };
  }
}
