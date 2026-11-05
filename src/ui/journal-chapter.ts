/**
 * Lane C r13 (R0610): the journal's Chapter page, its quest lists and memories, split out of
 * journal.ts. Behaviour is unchanged.
 */

import { ATLAS_TEXT, LANG_TEXT, STORYLINE_TEXT, STORY_U4_TEXT, TRAINER_LABELS } from '../config/strings';
import { SPEAKERS, STORY_TEXT } from '../config/story';
import { LINE_REWARD_TEXT } from '../config/strings-camp9';
import { doItLabel, fernCairnLine } from '../config/strings-fun-r6';
import { atlasPagesDone } from '../sim/cross-saves';
import { fernStones } from '../sim/fern-stone';
import { isLangQuestCode, TRACE_TARGETS } from '../sim/lang';
import { MICRO_BUILT, microFor, microSkipped } from '../sim/micro';
import { hashSeed } from '../sim/rng';
import { timeCheckMet } from '../sim/side-rule-kit';
import { funQuestIds, RUNNER_STORIES, sideActable } from '../sim/side-stories';
import { rewardById, sideStory } from '../sim/story-scenes';
import type { JournalView } from '../sim/storyline';
import type { SideStoryState } from '../sim/types';
import { readCrossSaves } from './atlas';
import { storyBoutJournal } from './battle-scenes';
import { el, button } from './dom';
import { renderBoard } from './journal-board';
import type { JournalCtx } from './journal-ctx';
import { eduJournal, waitMoment } from './journal-edu';
import { renderLines } from './journal-lines';
import { renderErrands } from './journal-quests';
import { spineControls, stepControls, storyActButton } from './journal-step';
import { scriptParagraph } from './lang-dom';
import { showSkipCard, stepSummary } from './skip-card';
import { getShots, thumbKey } from './u4-store';

/** The side stories the runner drives, then the open fun quests: each one's current step. */
export function renderSideStories(x: JournalCtx): void {
  const g = x.g;
  const c = g.world.campaign!;
  renderQuestList(
    x,
    STORY_TEXT.sideStories,
    RUNNER_STORIES.filter((id) => c.side[id]?.status === 'open'),
    c.side,
  );
  renderQuestList(
    x,
    STORY_TEXT.funQuests,
    funQuestIds(c).filter((id) => c.fun[id]?.status === 'open'),
    c.fun,
  );
}

function renderQuestList(
  x: JournalCtx,
  title: string,
  open: string[],
  store: Record<string, SideStoryState>,
): void {
  const g = x.g;
  const c = g.world.campaign!;
  if (open.length === 0) return;
  x.body.appendChild(el('div', 'btn-name', title));
  for (const id of open) {
    const quest = sideStory(id);
    const st = store[id]!;
    const step = quest?.steps[Math.min(st.step, (quest?.steps.length ?? 1) - 1)];
    if (!quest || !step) continue;
    const edu = eduJournal(g)?.goal(id, step.id);
    const title = eduJournal(g)?.title(id) ?? quest.title;
    x.body.appendChild(scriptParagraph(undefined, `${title}: ${edu?.goal ?? step.goal}`));
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
    x.body.appendChild(scriptParagraph('help', hint));
    // A step held for a moment of the story clock shows it is waiting, not stuck (bug 30).
    const waiting = st.stage === 'check' && timeCheckMet(g.world, st, step.check) === false;
    if (waiting)
      x.body.appendChild(
        el('p', 'help wait-cue', LANG_TEXT.waitingFor(waitMoment(step.check))),
      );
    if (trace && sideActable(g.world, c, id)) {
      // A tracing step (CV3): the game meets it, not a plain button.
      x.body.appendChild(
        button(
          LANG_TEXT.trace,
          () => {
            x.hide();
            x.trace.open(id, trace, () => x.reopen());
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
          parent: x.parent,
          id,
          title,
          stepIndex: st.step,
          step,
          close: () => x.hide(),
          playMicro: (kind, act) => {
            const seed = Math.abs(hashSeed(`${id}:${step.id}`));
            x.micro.open(kind, step.goal, seed, g.reduceMotion, act);
          },
        }),
      );
      x.body.appendChild(row);
    } else if (sideActable(g.world, c, id)) {
      // R0369 (FUN-80): the button names the step's verb.
      const verbKind = waiting ? null : microFor(step.check);
      x.body.appendChild(
        button(
          waiting ? LANG_TEXT.skipWait : verbKind ? doItLabel(verbKind) : STORY_TEXT.doStep,
          () => {
            // The Journal steps aside first, so the scene the step starts plays in the
            // clear rather than under it (review 2026-10-21, bug 29).
            x.hide();
            // Lane C r11 (R0617, R0641): skipping a wait says what happened, and is remembered.
            const act = (): void => {
              g.send({ kind: 'sideAct', story: id, ...(waiting ? { skipped: true } : {}) });
              if (waiting) showSkipCard(x.parent, title, stepSummary(step));
            };
            // R0294 (FUN-05): a carry, find or collect step plays its micro-game first.
            const kind = verbKind;
            if (kind && !microSkipped(g.world) && MICRO_BUILT.has(kind)) {
              const seed = Math.abs(hashSeed(`${id}:${step.id}`));
              x.micro.open(kind, step.goal, seed, g.reduceMotion, act);
            } else act();
          },
          'btn btn-small',
        ),
      );
    } else if (st.stage === 'check') {
      x.body.appendChild(el('p', 'help', STORY_TEXT.waitStep));
    }
  }
}

/** What the stories left you: every keepsake, newest first, with its story's words. */
function renderMemories(x: JournalCtx): void {
  const g = x.g;
  const kept = g.world.inventory.keepsakes;
  renderAtlasShelf(x);
  if (kept.length === 0) return;
  x.body.appendChild(el('div', 'btn-name', STORY_TEXT.memories));
  x.body.appendChild(el('p', 'help', STORY_TEXT.memoriesHelp));
  for (const id of [...kept].reverse()) {
    const found = rewardById(id);
    // Lane C r9 (R0639): a finished line's keepsake and Grove change, by their own words.
    const lineWords = LINE_REWARD_TEXT.keepsake[id] ?? LINE_REWARD_TEXT.grove[id];
    if (!found && lineWords) x.body.appendChild(el('p', undefined, lineWords));
    if (!found) continue;
    const quest = sideStory(found.quest);
    x.body.appendChild(
      el('p', undefined, `${found.reward.label}${quest ? ` · ${quest.title}` : ''}`),
    );
    x.body.appendChild(el('p', 'help', found.reward.description));
  }
}

/** Finished Atlas pages, read from the Atlas save; nothing is copied into the Grove. */
function renderAtlasShelf(x: JournalCtx): void {
  const done = atlasPagesDone(readCrossSaves());
  if (done.length === 0) return;
  x.body.appendChild(el('div', 'btn-name', ATLAS_TEXT.fromAtlas));
  x.body.appendChild(el('p', 'help', ATLAS_TEXT.fromAtlasHelp));
  for (const id of done) x.body.appendChild(el('p', undefined, ATLAS_TEXT.pages[id] ?? id));
}

export function renderChapter(x: JournalCtx, view: JournalView): void {
  const g = x.g;
  const c = g.world.campaign!;
  if (c.chapter > view.final) {
    const ending = view.ending ? view.endings[view.ending] : undefined;
    x.body.appendChild(el('p', 'help', STORY_TEXT.endingReached(ending?.title ?? '')));
  } else {
    const edu = eduJournal(g)?.chapter(c.chapter);
    x.body.appendChild(el('div', 'btn-name', `${STORY_TEXT.goal}${view.met ? ' ✓' : ''}`));
    x.body.appendChild(el('p', undefined, edu?.goalText ?? view.goalText));
    x.body.appendChild(el('div', 'btn-name', STORY_TEXT.hint));
    x.body.appendChild(el('p', 'help', edu?.hint ?? view.hint));
    // Lane C r10 agent C (R0661, R0614): Go there and, at Story only pace, Skip goal.
    const spine = spineControls(g, x.parent, () => x.close());
    if (spine.length > 0) {
      const row = el('div', 'journal-actions');
      row.append(...spine);
      x.body.appendChild(row);
    }
    renderStoryActions(x, view);
  }
  if (!c.storyline) renderSideStories(x);
  // Lane C r7 (R0275, R0596): a story bout at its beat, and the questlines beside Hazel's Grove.
  if (!c.storyline) storyBoutJournal(g, x.body, () => x.close());
  // Lane C r8 (R0607): the Open quest flow's notice board for this region.
  renderBoard(g, x.body, () => x.refresh());
  // Lane C r9 (R0656): the Requests board's one-time errands, folded under the board.
  if (!c.storyline) renderErrands(g, x.body, () => x.refresh());
  renderLines(
    g,
    x.body,
    () => x.refresh(),
    () => x.close(),
    x.openers,
  );
  renderMemories(x);
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
  x.body.appendChild(list);
  // Friends.
  const friends = Object.entries(c.friendship)
    .filter(([, v]) => v !== 0)
    .sort((a, b) => b[1] - a[1]);
  if (friends.length > 0) {
    x.body.appendChild(el('div', 'btn-name', STORY_TEXT.friends));
    const row = el('div', 'roster-stats');
    row.textContent = friends
      .map(
        ([id, v]) =>
          `${TRAINER_LABELS[id]?.name ?? SPEAKERS[id]?.name ?? id} ${v > 0 ? '+' : ''}${v}`,
      )
      .join(' · ');
    x.body.appendChild(row);
  }
  // R0313 (FUN-24): Fern's running stone, counted with the friends.
  const stones = fernStones(g.world);
  if (stones > 0) x.body.appendChild(el('p', 'help', fernCairnLine(stones)));
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
  x.body.appendChild(chapters);
  void fillThumbs(c.storyline ?? 'hazel', rows);
}

/** A storyline's buttons: the goal's Do-it, travel between its areas, its own actions. */
function renderStoryActions(x: JournalCtx, view: JournalView): void {
  const g = x.g;
  const c = g.world.campaign!;
  if (!c.storyline) return;
  const row = el('div', 'journal-actions');
  if (view.act && !c.flags[`act:${view.act}`] && !view.met) {
    const label = view.act;
    // Lane C r10 agent C (R0636, R0617): Imagine it, with the summary card.
    row.appendChild(
      storyActButton(x.parent, STORY_TEXT.chapter(view.n, view.title), view.goalText, () => {
        g.send({ kind: 'storyAct', label });
        x.refresh();
      }),
    );
  }
  for (const a of view.actions) {
    const b = button(
      STORYLINE_TEXT.actions[a.id] ?? a.id,
      () => {
        const open = a.ui ? x.openers[a.ui] : undefined;
        if (open) {
          x.close();
          open();
        } else {
          g.send(a.command);
          x.refresh();
        }
      },
      'btn btn-small',
    );
    b.disabled = !a.enabled;
    row.appendChild(b);
  }
  if (row.childElementCount > 0) x.body.appendChild(row);
  if (view.areas.length > 0) {
    x.body.appendChild(el('div', 'btn-name', STORYLINE_TEXT.whereTo));
    const areas = el('div', 'race-tiers');
    for (const area of view.areas) {
      const b = button(
        STORYLINE_TEXT.areas[area] ?? area,
        () => {
          g.send({ kind: 'storyArea', area });
          x.close();
        },
        'btn btn-small',
      );
      if (view.area === area) b.classList.add('active');
      areas.appendChild(b);
    }
    x.body.appendChild(areas);
  }
}

/** K31: each closed chapter's 160 x 90 picture, beside its title, once the store answers. */
async function fillThumbs(
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

