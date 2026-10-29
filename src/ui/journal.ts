import { ATLAS_TEXT, STORY_U4_TEXT, STORYLINE_TEXT } from '../config/strings';
import { atlasPagesDone } from '../sim/cross-saves';
import { readCrossSaves } from './atlas';
import { TRAINER_LABELS } from '../config/strings';
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
import { doItLabel } from '../config/strings-fun-r6';
import { hashSeed } from '../sim/rng';
import { LANG_TEXT } from '../config/strings';
import { isLangQuestCode, TRACE_TARGETS } from '../sim/lang';
import { scriptParagraph } from './lang-dom';
import { TraceGame } from './trace';
import { endingKey, getShots, thumbKey } from './u4-store';

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
  private page: 'chapter' | 'paths' | 'endings' = 'chapter';

  private readonly micro: MicroScreen;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, STORY_TEXT.journal, 'Close');
    // R0294: the micro-games that stand in for a bare "Do it".
    this.micro = new MicroScreen(parent);
    this.body = el('div');
    this.dialog.body.appendChild(this.body);
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
    const view = journalView(g.world, c, goalMet(g.world, c));
    if (!view) return;
    const tabs = el('div', 'race-tiers');
    for (const [id, label] of [
      ['chapter', STORY_TEXT.chapter(view.n, eduJournal(g)?.chapter(view.n)?.title ?? view.title)],
      ['paths', STORY_TEXT.paths],
      ['endings', STORY_U4_TEXT.endingsTab],
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
    if (this.page === 'paths') this.renderPaths(view);
    else if (this.page === 'endings') this.renderEndings(view);
    else this.renderChapter(g, view);
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
              const act = (): void => g.send({ kind: 'sideAct', story: id });
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
      this.renderStoryActions(g, view);
    }
    if (!c.storyline) this.renderSideStories(g);
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
      row.appendChild(
        button(
          STORY_TEXT.doStep,
          () => {
            g.send({ kind: 'storyAct', label });
            this.refresh();
          },
          'btn btn-small btn-primary',
        ),
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

  /** K47: every ending of this story, its last picture if reached, a lock icon if not. */
  private renderEndings(view: JournalView): void {
    const key = view.storyline ?? 'hazel';
    this.body.appendChild(el('p', 'help', STORY_U4_TEXT.endingsHelp));
    const grid = el('div', 'ending-gallery');
    this.body.appendChild(grid);
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
