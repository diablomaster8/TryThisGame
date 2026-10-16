import { ATLAS_TEXT } from '../config/strings';
import { atlasPagesDone } from '../sim/cross-saves';
import { readCrossSaves } from './atlas';
import { TRAINER_LABELS } from '../config/strings';
import { CHAPTERS, ENDINGS, SPEAKERS, STORY_TEXT } from '../config/story';
import type { Game } from '../game';
import { chapterDef, goalMet } from '../sim/campaign';
import { funQuestIds, RUNNER_STORIES, sideActable } from '../sim/side-stories';
import type { SideStoryState } from '../sim/types';
import { eduContent, rewardById, sideStory, textBandOf } from '../sim/story-scenes';
import { button, el, modal } from './dom';

/**
 * The band's journal text in a Learning Grove save on the Learning story language (CV2):
 * the chapter's title, goal and hint, and each quest's title and step goals.
 */
function eduJournal(g: Game) {
  const band = textBandOf(g.world);
  const m = eduContent();
  if (band === 'main' || !m) return null;
  return {
    chapter: (n: number) => m.eduChapterText(band, n),
    goal: (quest: string, step: string) => m.eduGoal(band, quest, step),
    title: (quest: string) => m.eduQuestTitle(band, quest),
  };
}

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
      [
        'chapter',
        STORY_TEXT.chapter(
          Math.min(c.chapter, 12),
          eduJournal(g)?.chapter(Math.min(c.chapter, 12))?.title ??
            chapterDef(Math.min(c.chapter, 12))?.title ??
            '',
        ),
      ],
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
      this.body.appendChild(el('p', undefined, `${title}: ${edu?.goal ?? step.goal}`));
      // S18 lent the register to the museum; Delve has brought it back.
      const hint =
        id === 's10' && st.step === 0 && c.flags['s18-centre'] === 'register'
          ? STORY_TEXT.registerOnLoan
          : (edu?.hint ?? step.hint);
      this.body.appendChild(el('p', 'help', hint));
      if (sideActable(g.world, c, id)) {
        this.body.appendChild(
          button(
            STORY_TEXT.doStep,
            () => {
              g.send({ kind: 'sideAct', story: id });
              this.refresh();
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

  private renderChapter(g: Game): void {
    const c = g.world.campaign!;
    const def = chapterDef(Math.min(c.chapter, 12));
    if (!def) return;
    if (c.chapter > 12) {
      const ending = c.ending ? ENDINGS[c.ending] : undefined;
      this.body.appendChild(el('p', 'help', STORY_TEXT.endingReached(ending?.title ?? '')));
    } else {
      const met = goalMet(g.world, c);
      const edu = eduJournal(g)?.chapter(c.chapter);
      this.body.appendChild(el('div', 'btn-name', `${STORY_TEXT.goal}${met ? ' ✓' : ''}`));
      this.body.appendChild(el('p', undefined, edu?.goalText ?? def.goalText));
      this.body.appendChild(el('div', 'btn-name', STORY_TEXT.hint));
      this.body.appendChild(el('p', 'help', edu?.hint ?? def.hint));
    }
    this.renderSideStories(g);
    this.renderMemories(g);
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
    for (const ch of CHAPTERS) {
      const done = ch.n < c.chapter;
      const current = ch.n === c.chapter;
      chapters.appendChild(
        el(
          'div',
          `journal-chapter${done ? ' done' : current ? ' current' : ''}`,
          `${done ? '✓' : current ? '▶' : '·'} ${STORY_TEXT.chapter(ch.n, ch.title)}`,
        ),
      );
    }
    this.body.appendChild(chapters);
  }

  private renderPaths(reached: string | null): void {
    this.body.appendChild(el('p', 'help', STORY_TEXT.pathsHelp));
    for (const [id, e] of Object.entries(ENDINGS)) {
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
