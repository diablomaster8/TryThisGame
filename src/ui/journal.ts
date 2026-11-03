import { ATLAS_TEXT, STORY_U4_TEXT, STORYLINE_TEXT } from '../config/strings';
import { atlasPagesDone } from '../sim/cross-saves';
import { readCrossSaves } from './atlas';
import { TRAINER_LABELS } from '../config/strings';
import { CAMP11C_TEXT } from '../config/strings-camp11c';
import { epilogueReady, fairSeen } from '../sim/epilogue';
import { SPEAKERS, STORY_TEXT } from '../config/story';
import type { Game } from '../game';
import { goalMet } from '../sim/campaign';
import { journalView } from '../sim/storyline';
import { funQuestIds, RUNNER_STORIES, sideActable } from '../sim/side-stories';
import { timeCheckMet } from '../sim/side-rule-kit';
import type { SideStoryState } from '../sim/types';
import type { JournalView } from '../sim/storyline';
import { eduContent, rewardById, sideStory, textBandOf } from '../sim/story-scenes';
import { button, el, modal } from './dom';
import { MicroScreen } from '../minigames/micro/micro-screen';
import { MICRO_BUILT, microFor, microSkipped } from '../sim/micro';
import { doItLabel, fernCairnLine } from '../config/strings-fun-r6';
import { fernStones } from '../sim/fern-stone';
import { hashSeed } from '../sim/rng';
import { LANG_TEXT } from '../config/strings';
import { isLangQuestCode, TRACE_TARGETS } from '../sim/lang';
import { scriptParagraph } from './lang-dom';
import { TraceGame } from './trace';
import { endingKey, getShots, thumbKey } from './u4-store';
import { renderHollowPage } from './hollow-journal';
import { HOLLOW_R6_TEXT } from '../config/strings';
import { PLACES_TEXT } from '../config/strings-world';
import { renderPlaces } from './landmark-card';
import { renderLines } from './journal-lines';
import { renderChapterSelect } from './chapter-select';
import { renderBoard } from './journal-board';
import { renderEndingShelf, renderErrands, renderQuestsPage } from './journal-quests';
import { JOURNAL_TEXT } from '../config/strings-journal';
import { LINE_REWARD_TEXT } from '../config/strings-camp9';
import { PROGRESS_TEXT } from '../config/strings-r11d4-progress';
import { phoneSheet, tabKeys } from './journal-sheet';
import { storyBoutJournal } from './battle-scenes';
import { spineControls, stepControls, storyActButton } from './journal-step';
import '../camp-r11.css';
import { C11_TEXT } from '../config/strings';
import { showSkipCard, stepSummary } from './skip-card';
import type { Scene } from '../config/story';
import { renderAreas, renderNow, type NowOptions } from './journal-now';
import { renderDone, renderSpineCard } from './journal-done';

/** Lane C r11 (R0610): the page the journal last showed this session, kept across openings. */
let lastPage: string | null = null;

/**
 * The band's journal text in a Learning Grove save on the Learning story language (CV2):
 * the chapter's title, goal and hint, and each quest's title and step goals.
 */
export function eduJournal(g: Game) {
  const band = textBandOf(g.world);
  const m = eduContent();
  if (band === 'main' || !m) return null;
  return {
    chapter: (n: number) => m.eduChapterText(band, n),
    goal: (quest: string, step: string) => m.eduGoal(band, quest, step),
    title: (quest: string) => m.eduQuestTitle(band, quest),
  };
}

/** The moment a timed check names, in words, from the same words the sim reads. */
function waitMoment(check: string): string {
  const t = check.split(':');
  const has = (...w: string[]) => t.some((x) => w.includes(x));
  const key = has('midnight', 'one-oclock', 'small-hours')
    ? 'midnight'
    : has('frost', 'later')
      ? 'late'
      : has('dawn', 'morning', 'first-light', 'sunrise')
        ? 'dawn'
        : has('dusk', 'evening', 'night', 'sunset') || t[0] === 'night'
          ? 'dusk'
          : 'short';
  return LANG_TEXT.waitMoments[key] ?? '';
}

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
    else if (this.page === 'paths') this.renderPaths(view);
    else if (this.page === 'endings') {
      this.renderEndings(view);
      renderEndingShelf(g, this.body, view);
    } else if (this.page === 'hollow') renderHollowPage(g.world, this.body);
    else this.renderChapter(g, view);
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

  /** The side stories the runner drives, then the open fun quests: each one's current step. */
  private renderSideStories(g: Game): void {
    const c = g.world.campaign!;
    this.renderQuestList(
      g,
      STORY_TEXT.sideStories,
      RUNNER_STORIES.filter((id) => c.side[id]?.status === 'open'),
      c.side,
    );
    this.renderQuestList(
      g,
      STORY_TEXT.funQuests,
      funQuestIds(c).filter((id) => c.fun[id]?.status === 'open'),
      c.fun,
    );
  }

  private renderQuestList(
    g: Game,
    title: string,
    open: string[],
    store: Record<string, SideStoryState>,
  ): void {
    const c = g.world.campaign!;
    if (open.length === 0) return;
    this.body.appendChild(el('div', 'btn-name', title));
    for (const id of open) {
      const quest = sideStory(id);
      const st = store[id]!;
      const step = quest?.steps[Math.min(st.step, (quest?.steps.length ?? 1) - 1)];
      if (!quest || !step) continue;
      const edu = eduJournal(g)?.goal(id, step.id);
      const title = eduJournal(g)?.title(id) ?? quest.title;
      this.body.appendChild(scriptParagraph(undefined, `${title}: ${edu?.goal ?? step.goal}`));
      // S18 lent the register to the museum; Delve has brought it back.
      const trace = TRACE_TARGETS[step.check];
      // A language quest's steps are met by its scenes (or the tracing game): the scripted
      // hints name Grove actions ("choose Say") that do not exist (review 2026-10-21, 8).
      const lang = isLangQuestCode(quest.code)
        ? trace && st.stage === 'check'
          ? LANG_TEXT.langTraceHint
          : LANG_TEXT.langNext(
              LANG_TEXT.friends[quest.code.startsWith('LH') ? 'hebrew' : 'japanese'] ?? '',
            )
        : null;
      const hint =
        id === 's10' && st.step === 0 && c.flags['s18-centre'] === 'register'
          ? STORY_TEXT.registerOnLoan
          : (lang ?? edu?.hint ?? step.hint);
      this.body.appendChild(scriptParagraph('help', hint));
      // A step held for a moment of the story clock shows it is waiting, not stuck (bug 30).
      const waiting = st.stage === 'check' && timeCheckMet(g.world, st, step.check) === false;
      if (waiting)
        this.body.appendChild(
          el('p', 'help wait-cue', LANG_TEXT.waitingFor(waitMoment(step.check))),
        );
      if (trace && sideActable(g.world, c, id)) {
        // A tracing step (CV3): the game meets it, not a plain button.
        this.body.appendChild(
          button(
            LANG_TEXT.trace,
            () => {
              this.dialog.hide();
              this.trace.open(id, trace, () => this.open());
            },
            'btn btn-small',
          ),
        );
      } else if (sideActable(g.world, c, id) && !waiting) {
        // Lane C r10 agent C (R0636, R0617): Go there, Play it, Imagine it or Skip, with a card.
        const row = el('div', 'journal-actions');
        row.append(
          ...stepControls({
            g,
            parent: this.parent,
            id,
            title,
            stepIndex: st.step,
            step,
            close: () => this.dialog.hide(),
            playMicro: (kind, act) => {
              const seed = Math.abs(hashSeed(`${id}:${step.id}`));
              this.micro.open(kind, step.goal, seed, g.reduceMotion, act);
            },
          }),
        );
        this.body.appendChild(row);
      } else if (sideActable(g.world, c, id)) {
        // R0369 (FUN-80): the button names the step's verb.
        const verbKind = waiting ? null : microFor(step.check);
        this.body.appendChild(
          button(
            waiting ? LANG_TEXT.skipWait : verbKind ? doItLabel(verbKind) : STORY_TEXT.doStep,
            () => {
              // The Journal steps aside first, so the scene the step starts plays in the
              // clear rather than under it (review 2026-10-21, bug 29).
              this.dialog.hide();
              // Lane C r11 (R0617, R0641): skipping a wait says what happened, and is remembered.
              const act = (): void => {
                g.send({ kind: 'sideAct', story: id, ...(waiting ? { skipped: true } : {}) });
                if (waiting) showSkipCard(this.parent, title, stepSummary(step));
              };
              // R0294 (FUN-05): a carry, find or collect step plays its micro-game first.
              const kind = verbKind;
              if (kind && !microSkipped(g.world) && MICRO_BUILT.has(kind)) {
                const seed = Math.abs(hashSeed(`${id}:${step.id}`));
                this.micro.open(kind, step.goal, seed, g.reduceMotion, act);
              } else act();
            },
            'btn btn-small',
          ),
        );
      } else if (st.stage === 'check') {
        this.body.appendChild(el('p', 'help', STORY_TEXT.waitStep));
      }
    }
  }

  /** What the stories left you: every keepsake, newest first, with its story's words. */
  private renderMemories(g: Game): void {
    const kept = g.world.inventory.keepsakes;
    this.renderAtlasShelf();
    if (kept.length === 0) return;
    this.body.appendChild(el('div', 'btn-name', STORY_TEXT.memories));
    this.body.appendChild(el('p', 'help', STORY_TEXT.memoriesHelp));
    for (const id of [...kept].reverse()) {
      const found = rewardById(id);
      // Lane C r9 (R0639): a finished line's keepsake and Grove change, by their own words.
      const lineWords = LINE_REWARD_TEXT.keepsake[id] ?? LINE_REWARD_TEXT.grove[id];
      if (!found && lineWords) this.body.appendChild(el('p', undefined, lineWords));
      if (!found) continue;
      const quest = sideStory(found.quest);
      this.body.appendChild(
        el('p', undefined, `${found.reward.label}${quest ? ` · ${quest.title}` : ''}`),
      );
      this.body.appendChild(el('p', 'help', found.reward.description));
    }
  }

  /** Finished Atlas pages, read from the Atlas save; nothing is copied into the Grove. */
  private renderAtlasShelf(): void {
    const done = atlasPagesDone(readCrossSaves());
    if (done.length === 0) return;
    this.body.appendChild(el('div', 'btn-name', ATLAS_TEXT.fromAtlas));
    this.body.appendChild(el('p', 'help', ATLAS_TEXT.fromAtlasHelp));
    for (const id of done) this.body.appendChild(el('p', undefined, ATLAS_TEXT.pages[id] ?? id));
  }

  private renderChapter(g: Game, view: JournalView): void {
    const c = g.world.campaign!;
    if (c.chapter > view.final) {
      const ending = view.ending ? view.endings[view.ending] : undefined;
      this.body.appendChild(el('p', 'help', STORY_TEXT.endingReached(ending?.title ?? '')));
    } else {
      const edu = eduJournal(g)?.chapter(c.chapter);
      this.body.appendChild(el('div', 'btn-name', `${STORY_TEXT.goal}${view.met ? ' ✓' : ''}`));
      this.body.appendChild(el('p', undefined, edu?.goalText ?? view.goalText));
      this.body.appendChild(el('div', 'btn-name', STORY_TEXT.hint));
      this.body.appendChild(el('p', 'help', edu?.hint ?? view.hint));
      // Lane C r10 agent C (R0661, R0614): Go there and, at Story only pace, Skip goal.
      const spine = spineControls(g, this.parent, () => this.close());
      if (spine.length > 0) {
        const row = el('div', 'journal-actions');
        row.append(...spine);
        this.body.appendChild(row);
      }
      this.renderStoryActions(g, view);
    }
    if (!c.storyline) this.renderSideStories(g);
    // Lane C r7 (R0275, R0596): a story bout at its beat, and the questlines beside Hazel's Grove.
    if (!c.storyline) storyBoutJournal(g, this.body, () => this.close());
    // Lane C r8 (R0607): the Open quest flow's notice board for this region.
    renderBoard(g, this.body, () => this.refresh());
    // Lane C r9 (R0656): the Requests board's one-time errands, folded under the board.
    if (!c.storyline) renderErrands(g, this.body, () => this.refresh());
    renderLines(
      g,
      this.body,
      () => this.refresh(),
      () => this.close(),
      this.openers,
    );
    this.renderMemories(g);
    // Sable and Moss at a glance.
    const list = el('div', 'journal-cast');
    for (const id of c.storyline ? [] : [c.sableId, c.mossId]) {
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
        el(
          'div',
          'roster-line',
          `${n.name} · ${STORY_TEXT.trust} ${Math.round(n.trust)}${state ? ` · ${state}` : ''}`,
        ),
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
        .map(
          ([id, v]) =>
            `${TRAINER_LABELS[id]?.name ?? SPEAKERS[id]?.name ?? id} ${v > 0 ? '+' : ''}${v}`,
        )
        .join(' · ');
      this.body.appendChild(row);
    }
    // R0313 (FUN-24): Fern's running stone, counted with the friends.
    const stones = fernStones(g.world);
    if (stones > 0) this.body.appendChild(el('p', 'help', fernCairnLine(stones)));
    // Chapter list.
    const chapters = el('div', 'journal-chapters');
    const rows: Array<{ n: number; title: string; row: HTMLElement }> = [];
    for (const ch of view.chapters) {
      const done = ch.n < c.chapter;
      const current = ch.n === c.chapter;
      const row = el(
        'div',
        `journal-chapter${done ? ' done' : current ? ' current' : ''}`,
        `${done ? '✓' : current ? '▶' : '·'} ${STORY_TEXT.chapter(ch.n, ch.title)}`,
      );
      chapters.appendChild(row);
      if (done) rows.push({ n: ch.n, title: ch.title, row });
    }
    this.body.appendChild(chapters);
    void this.fillThumbs(c.storyline ?? 'hazel', rows);
  }

  /** A storyline's buttons: the goal's Do-it, travel between its areas, its own actions. */
  private renderStoryActions(g: Game, view: JournalView): void {
    const c = g.world.campaign!;
    if (!c.storyline) return;
    const row = el('div', 'journal-actions');
    if (view.act && !c.flags[`act:${view.act}`] && !view.met) {
      const label = view.act;
      // Lane C r10 agent C (R0636, R0617): Imagine it, with the summary card.
      row.appendChild(
        storyActButton(this.parent, STORY_TEXT.chapter(view.n, view.title), view.goalText, () => {
          g.send({ kind: 'storyAct', label });
          this.refresh();
        }),
      );
    }
    for (const a of view.actions) {
      const b = button(
        STORYLINE_TEXT.actions[a.id] ?? a.id,
        () => {
          const open = a.ui ? this.openers[a.ui] : undefined;
          if (open) {
            this.close();
            open();
          } else {
            g.send(a.command);
            this.refresh();
          }
        },
        'btn btn-small',
      );
      b.disabled = !a.enabled;
      row.appendChild(b);
    }
    if (row.childElementCount > 0) this.body.appendChild(row);
    if (view.areas.length > 0) {
      this.body.appendChild(el('div', 'btn-name', STORYLINE_TEXT.whereTo));
      const areas = el('div', 'race-tiers');
      for (const area of view.areas) {
        const b = button(
          STORYLINE_TEXT.areas[area] ?? area,
          () => {
            g.send({ kind: 'storyArea', area });
            this.close();
          },
          'btn btn-small',
        );
        if (view.area === area) b.classList.add('active');
        areas.appendChild(b);
      }
      this.body.appendChild(areas);
    }
  }

  /** K31: each closed chapter's 160 x 90 picture, beside its title, once the store answers. */
  private async fillThumbs(
    key: string,
    rows: Array<{ n: number; title: string; row: HTMLElement }>,
  ): Promise<void> {
    if (rows.length === 0) return;
    const urls = await getShots(rows.map((r) => thumbKey(key, r.n)));
    rows.forEach((r, i) => {
      const url = urls[i];
      if (!url || !r.row.isConnected) return;
      const img = document.createElement('img');
      img.className = 'journal-thumb';
      img.src = url;
      img.width = 160;
      img.height = 90;
      img.alt = STORY_U4_TEXT.thumbAlt(r.title);
      r.row.classList.add('has-thumb');
      r.row.prepend(img);
    });
  }

  /** R0600: the Valley Fair card on Hazel's Endings tab: open once the story and two lines ended. */
  private renderFair(view: JournalView): void {
    const g = this.game();
    if (!g || view.storyline) return;
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
    this.body.appendChild(card);
  }

  /** K47: every ending of this story, its last picture if reached, a lock icon if not. */
  private renderEndings(view: JournalView): void {
    const key = view.storyline ?? 'hazel';
    this.body.appendChild(el('p', 'help', STORY_U4_TEXT.endingsHelp));
    const grid = el('div', 'ending-gallery');
    this.body.appendChild(grid);
    this.renderFair(view);
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

  private renderPaths(view: JournalView): void {
    const reached = view.ending;
    const n = Object.keys(view.endings).length;
    this.body.appendChild(
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
      this.body.appendChild(row);
    }
  }
}
