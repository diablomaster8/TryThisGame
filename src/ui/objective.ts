/**
 * What to do next, on screen (review fixes 2026-10-25, items 3 and 4).
 *
 * The objective chip shows the current campaign or storyline goal and its hint, from the
 * same data the Journal shows, without opening the Journal; a tap opens it. A new goal is
 * announced with a toast. With no campaign goal (the Free Grove, or after an ending) it
 * offers a gentle next step when one is useful: buy an egg, hatch one, feed a hungry
 * Nubbin. It hides during scenes and minigames; the HUD says when.
 *
 * The Learning Grove prompt greets a young player with two big choices, "Hear the story"
 * and "Play", on entering a Learning Grove save and again after a quiet spell, read aloud
 * in the read-aloud band. Everything here reads the world and sends commands.
 */
import { EDU_PROMPT_TEXT, OBJECTIVE_TEXT } from '../config/strings-dlg';
import { goalDoneLine } from '../config/strings-fun';
import { EDU_PROMPT } from '../config/tuning-dlg';
import type { Game } from '../game';
import { goalMet } from '../sim/campaign';
import { isHungry } from '../sim/needs';
import { wantsFirstFruit } from '../sim/first-feed';
import { FIRST_FEED_TEXT } from '../config/strings-tech';
import { journalView } from '../sim/storyline';
import { textBandOf } from '../sim/story-scenes';
import { TRAINERS } from '../sim/trainers';
import type { CampaignState, World } from '../sim/types';
import { CHAPTERS, type ChapterStep } from '../config/story';
import { button, el } from './dom';
import { eduJournal } from './journal';
import { speakLine } from './lesson';
import { TRACK_TEXT } from '../config/strings-camp';
import { sideStory } from '../sim/story-scenes';
import { questProgress } from '../sim/quest-offers';
import { OFFER_TEXT } from '../config/strings-camp';
import { GO_TEXT, REST_TEXT } from '../config/strings';
import { REST } from '../config/tuning';
import { goalTarget } from '../sim/goal-target';
import { restOver, restWait } from '../sim/rest';
import { travelMode } from '../sim/travel';
import { playIris } from './travel-iris';

/**
 * Lane C round 8 (R0609): the Open flow's pinned quests, each at its current step, for the chip
 * to cycle after the spine's goal. A quest between steps (a scene to come) shows its next goal.
 */
export function trackedObjectives(world: World): Objective[] {
  const c = world.campaign;
  const out: Objective[] = [];
  for (const id of world.questBook?.tracked ?? []) {
    const st = c?.side[id] ?? c?.fun[id];
    const quest = sideStory(id);
    const step = st?.status === 'open' ? quest?.steps[st.step] : undefined;
    if (!quest || !step) continue;
    out.push({
      key: `quest:${id}:${st!.step}`,
      goal: TRACK_TEXT.newGoal(quest.title, step.goal),
      // R0635: the step count rides with the hint.
      hint: ((p) =>
        p ? `${OFFER_TEXT.stepOf(p.step, p.of, p.minutesLeft)}. ${step.hint}` : step.hint)(
        questProgress(world, id),
      ),
      story: true,
    });
  }
  return out;
}

export interface Objective {
  /** Changes when the goal does; a campaign key change is announced. */
  key: string;
  goal: string;
  hint: string;
  /** A campaign or storyline goal (tap opens the Journal), not a Grove suggestion. */
  story: boolean;
  /** What a tap does for a suggestion. */
  action?: 'shop';
}

/** The Grove suggestion with no story goal: pure over the world. */
export function groveSuggestion(world: World): Objective | null {
  // The story's own Nubbins (Moss, Sable) are not the player's to raise.
  const c = world.campaign;
  const living = world.nubbins.filter((n) => n.id !== c?.mossId && n.id !== c?.sableId);
  if (living.length === 0)
    return {
      key: 'grove:none',
      goal: OBJECTIVE_TEXT.noNubbins,
      hint: OBJECTIVE_TEXT.noNubbinsHint,
      story: false,
      action: 'shop',
    };
  if (living.every((n) => n.stage === 'egg'))
    return {
      key: 'grove:hatch',
      goal: OBJECTIVE_TEXT.hatch,
      hint: OBJECTIVE_TEXT.hatchHint,
      story: false,
    };
  const hungry = living.find((n) => n.stage !== 'egg' && n.stage !== 'cocoon' && isHungry(n));
  if (hungry)
    return {
      key: 'grove:hungry',
      goal: OBJECTIVE_TEXT.hungry(hungry.name),
      hint: OBJECTIVE_TEXT.hungryHint,
      story: false,
    };
  // TECH-01: a new hatchling's first fruit once no Nubbin is truly hungry.
  const fresh = living.find(wantsFirstFruit);
  if (fresh)
    return {
      key: 'grove:firstFruit',
      goal: FIRST_FEED_TEXT.goal(fresh.name),
      hint: FIRST_FEED_TEXT.hint,
      story: false,
    };
  return null;
}

/**
 * R0319 (FUN-30): the chapter's how-to steps, one at a time. Progress lives here (UI state,
 * never saved): it restarts when the chapter changes, and a step ticks off when its event
 * comes in. Once every step is done the chip goes back to the chapter's one-line hint.
 */
const howTo = { chapter: -1, done: 0 };

function stepsOf(c: CampaignState): readonly ChapterStep[] {
  if (c.storyline) return [];
  return CHAPTERS.find((ch) => ch.n === c.chapter)?.howTo ?? [];
}

/** A sim event: tick off the current step if it is the one this event completes. */
export function noteHowTo(world: World, kind: string): void {
  const c = world.campaign;
  if (!c) return;
  if (howTo.chapter !== c.chapter) {
    howTo.chapter = c.chapter;
    howTo.done = 0;
  }
  // A later step's event counts too (an egg can hatch unshaken), skipping what it implies.
  const i = stepsOf(c).findIndex((s, k) => k >= howTo.done && s.on === kind);
  if (i >= 0) howTo.done = i + 1;
}

/** The hint while steps remain: the ticks so far, then the next step. */
export function howToHint(c: CampaignState): string | null {
  const steps = stepsOf(c);
  const done = howTo.chapter === c.chapter ? howTo.done : 0;
  const next = steps[done];
  if (!next) return null;
  return `${'✓ '.repeat(done)}${next.text} (${done + 1}/${steps.length})`;
}

/** The goal to show now: the campaign's chapter goal, else a Grove suggestion. */
export function objectiveOf(g: Game): Objective | null {
  const c = g.world.campaign;
  const none = groveSuggestion(g.world);
  // No Nubbin of your own and no egg: the chapter goal cannot move until you buy one.
  if (none?.action === 'shop') return none;
  if (c) {
    const met = goalMet(g.world, c);
    const view = journalView(g.world, c, met);
    if (view && c.chapter <= view.final) {
      const edu = eduJournal(g)?.chapter(c.chapter);
      return {
        key: `story:${c.storyline ?? 'hazel'}:${view.n}`,
        goal: edu?.goalText ?? view.goalText,
        // R0305: the breather after a goal, in voice, one line per chapter.
        hint: met
          ? goalDoneLine(c.chapter, textBandOf(g.world) === 'sprout')
          : (edu?.hint ?? howToHint(c) ?? view.hint),
        story: true,
      };
    }
  }
  return none;
}

export class ObjectiveChip {
  readonly root: HTMLButtonElement;
  private readonly goal: HTMLSpanElement;
  private readonly hint: HTMLSpanElement;
  private current: Objective | null = null;
  private lastStoryKey: string | null = null;
  /** R0609: which of the spine's goal and the tracked quests the chip shows, and its arrow. */
  private pick = 0;
  private readonly cycle: HTMLButtonElement;
  private readonly count: HTMLSpanElement;
  private trackedKeys = new Set<string>();
  private trackSeeded = false;
  /** R0661: "Go there" for the shown goal; R0616: "Rest until …" and the rest under way. */
  private readonly go: HTMLButtonElement;
  private readonly rest: HTMLButtonElement;
  private resting: { untilMs: number; scale: number; when: string } | null = null;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly openers: { journal: () => void; shop: () => void },
    private readonly toast: (text: string) => void,
  ) {
    this.root = button('', () => this.press(), 'objective-chip');
    this.root.hidden = true;
    this.root.title = OBJECTIVE_TEXT.open;
    const label = el('span', 'objective-label', `🧭 ${OBJECTIVE_TEXT.label}`);
    const words = el('span', 'objective-words');
    this.goal = el('span', 'objective-goal');
    this.hint = el('span', 'objective-hint');
    words.append(this.goal, this.hint);
    this.count = el('span', 'objective-count');
    this.root.append(label, words, this.count);
    parent.appendChild(this.root);
    this.cycle = button(
      '›',
      () => {
        this.pick += 1;
        this.refresh(false);
      },
      'objective-cycle',
    );
    this.cycle.hidden = true;
    this.cycle.setAttribute('aria-label', TRACK_TEXT.next);
    parent.appendChild(this.cycle);
    this.go = button(GO_TEXT.button, () => this.goThere(), 'objective-go');
    this.go.hidden = true;
    this.go.setAttribute('aria-label', GO_TEXT.label);
    this.go.title = GO_TEXT.label;
    parent.appendChild(this.go);
    this.rest = button('', () => this.toggleRest(), 'objective-rest');
    this.rest.hidden = true;
    this.rest.title = REST_TEXT.help;
    parent.appendChild(this.rest);
  }

  /** R0661: walk (or, with Travel assist, run or hop) to where the shown goal is. */
  private goThere(): void {
    const g = this.game();
    const at = g && this.current ? goalTarget(g.world, this.current.key) : null;
    if (!g || !at) return;
    const mode = travelMode(g.world);
    if (mode === 'skip') playIris(() => g.send({ kind: 'fastTravel', pos: { ...at } }));
    else if (mode === 'auto') g.send({ kind: 'travelAssist', pos: { ...at } });
    else g.send({ kind: 'moveKeeperTo', pos: { ...at } });
  }

  /** R0616: start resting until the story's hour on the ordinary live clock, or stop. */
  private toggleRest(): void {
    const g = this.game();
    if (!g) return;
    if (this.resting) {
      this.stopRest(g);
      return;
    }
    const wait = restWait(g.world);
    if (!wait || g.clock.timeScale !== 1) return;
    this.resting = { untilMs: wait.untilMs, scale: g.clock.timeScale, when: wait.when };
    g.setTimeScale(REST.restScale);
    document.documentElement.classList.add('story-resting');
  }

  private stopRest(g: Game): void {
    if (!this.resting) return;
    g.setTimeScale(this.resting.scale);
    this.resting = null;
    document.documentElement.classList.remove('story-resting');
  }

  /** R0616: the rest button's state, once a refresh. */
  private refreshRest(g: Game | null, hide: boolean): void {
    if (g && this.resting && restOver(g.world, this.resting.untilMs)) this.stopRest(g);
    const wait = g && !this.resting && g.clock.timeScale === 1 ? restWait(g.world) : null;
    const word = (w: string): string => REST_TEXT.words[w] ?? w;
    this.rest.hidden = hide && !this.resting ? true : !this.resting && !wait;
    const text = this.resting
      ? REST_TEXT.resting(word(this.resting.when))
      : wait
        ? REST_TEXT.button(word(wait.when))
        : '';
    if (this.rest.textContent !== text) this.rest.textContent = text;
  }

  private press(): void {
    const o = this.current;
    if (!o) return;
    if (o.story) this.openers.journal();
    else if (o.action === 'shop') this.openers.shop();
    else this.toast(o.hint);
  }

  /** Called from the HUD's refresh loop; `hide` covers scenes, minigames and panels. */
  refresh(hide: boolean): void {
    const g = this.game();
    this.refreshRest(g, hide);
    let o = g ? objectiveOf(g) : null;
    // A new story goal is announced once, never on load and never over a scene.
    if (o?.story && o.key !== this.lastStoryKey) {
      if (this.lastStoryKey !== null && !hide) this.toast(OBJECTIVE_TEXT.newGoal(o.goal));
      if (!hide || this.lastStoryKey === null) this.lastStoryKey = o.key;
    }
    // R0609: the tracked quests after the spine's goal; a new step is announced once, if pinned.
    const tracked = g ? trackedObjectives(g.world) : [];
    for (const t of tracked) {
      if (hide || this.trackedKeys.has(t.key)) continue;
      // Never on load: only a step reached (or a quest pinned) while playing is news.
      if (this.trackSeeded) this.toast(OBJECTIVE_TEXT.newGoal(t.goal));
      this.trackedKeys.add(t.key);
    }
    if (g && !hide) this.trackSeeded = true;
    const all = [...(o ? [o] : []), ...tracked];
    this.pick = all.length > 0 ? this.pick % all.length : 0;
    const shown = all[this.pick] ?? null;
    this.cycle.hidden = hide || all.length < 2;
    this.count.textContent = all.length > 1 ? TRACK_TEXT.of(this.pick + 1, all.length) : '';
    this.current = shown;
    this.root.hidden = hide || !shown;
    this.go.hidden = hide || !shown || !g || goalTarget(g.world, shown.key) === null;
    if (!shown) return;
    o = shown;
    if (this.goal.textContent !== o.goal) this.goal.textContent = o.goal;
    if (this.hint.textContent !== o.hint) this.hint.textContent = o.hint;
    this.root.setAttribute('aria-label', `${OBJECTIVE_TEXT.label}: ${o.goal}. ${o.hint}`);
  }
}

/** The Learning Grove's "Hear the story / Play" prompt (item 4). */
export class EduPrompt {
  private readonly root: HTMLDivElement;
  private shownFor: Game | null = null;
  private enteredAt = 0;
  private lastInput = performance.now();

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly openers: { journal: () => void; play: () => void; next?: () => void },
  ) {
    this.root = el('div', 'edu-entry');
    this.root.hidden = true;
    const card = el('div', 'edu-entry-card');
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', EDU_PROMPT_TEXT.title);
    const big = (icon: string, label: string, onPress: () => void): HTMLButtonElement => {
      const b = button('', onPress, 'btn edu-entry-btn');
      b.append(el('span', 'edu-entry-icon', icon), el('strong', undefined, label));
      return b;
    };
    card.append(
      el('h2', undefined, EDU_PROMPT_TEXT.title),
      big('📖', EDU_PROMPT_TEXT.story, () => this.story()),
      big('🎨', EDU_PROMPT_TEXT.play, () => {
        this.hide();
        this.openers.play();
      }),
      button(EDU_PROMPT_TEXT.look, () => this.hide(), 'btn btn-small edu-entry-look'),
    );
    this.root.appendChild(card);
    parent.appendChild(this.root);
    const note = (): void => {
      this.lastInput = performance.now();
    };
    window.addEventListener('pointerdown', note, { passive: true });
    window.addEventListener('keydown', note);
  }

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  hide(): void {
    this.root.hidden = true;
    this.lastInput = performance.now();
  }

  private story(): void {
    const g = this.game();
    this.hide();
    if (!g) return;
    if (!g.world.campaign) {
      // As the picker's Story button: the Learning Grove starts with the first Keeper.
      g.send({ kind: 'setTrainer', id: TRAINERS[0]!.id });
      g.send({ kind: 'campaignStart' });
    } else if ((g.world.campaign.queue.length ?? 0) === 0) {
      // R0673: a non-reader hears the next step; a reader gets the journal.
      if (this.openers.next && textBandOf(g.world) === 'sprout') this.openers.next();
      else this.openers.journal();
    }
    // Otherwise the next scene is queued and plays as soon as the prompt is gone.
  }

  /** Called from the HUD's refresh loop; `busy` is anything else on screen. */
  refresh(busy: boolean): void {
    const g = this.game();
    if (!g?.world.edu) {
      this.root.hidden = true;
      return;
    }
    if (busy) {
      if (!this.root.hidden) this.root.hidden = true;
      return;
    }
    const now = performance.now();
    if (this.shownFor !== g) {
      // A new Learning Grove (or a reload): greet once the Grove has settled.
      if (this.enteredAt === 0) this.enteredAt = now;
      if (now - this.enteredAt < EDU_PROMPT.enterDelayMs) return;
      this.shownFor = g;
      this.enteredAt = 0;
      this.show(g);
      return;
    }
    if (this.root.hidden && now - this.lastInput > EDU_PROMPT.idleMs) this.show(g);
  }

  private show(g: Game): void {
    this.root.hidden = false;
    this.lastInput = performance.now();
    if (textBandOf(g.world) === 'sprout' && g.world.edu?.readAloud) speakLine(EDU_PROMPT_TEXT.say);
    this.root.querySelector<HTMLButtonElement>('.edu-entry-btn')?.focus({ preventScroll: true });
  }
}
