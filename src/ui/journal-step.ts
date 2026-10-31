/**
 * Lane C round 10, agent C: the journal's controls for a goal or a quest step.
 *
 * - R0636 (CAMP-44): "Do it" is retired. A step that happens somewhere the Grove has shows
 *   **Go there**; one a micro-game stands in for shows **Play it**; one nothing in the Grove can
 *   play yet shows **Imagine it**; anything else the sim watches shows **Skip**.
 * - R0617 (CAMP-25): every skip and imagined step shows the summary card (`skip-card.ts`).
 * - R0661 (CAMP-69): the spine's goal gets the same Go there as the objective chip.
 * - R0614 (CAMP-22): at Story only pace the spine's goal shows Skip goal (never a choice).
 */
import { SKIP_CARD_TEXT, STEP_TEXT } from '../config/strings';
import { DO_IT_BY } from '../config/strings-fun-r6';
import { chapterDef } from '../sim/campaign';
import { goalTarget } from '../sim/goal-target';
import { skippableGoal, stepPlayable } from '../sim/goal-skips';
import { MICRO_BUILT, microFor, microSkipped, type MicroKind } from '../sim/micro';
import { goalsSkippable } from '../sim/story-pace';
import { travelMode } from '../sim/travel';
import type { Vec2 } from '../sim/types';
import type { Game } from '../game';
import { STORY_TEXT } from '../config/story';
import { button } from './dom';
import { showSkipCard, stepSummary } from './skip-card';
import { playIris } from './travel-iris';

/** Walk (or, with Travel assist, run or hop) the Keeper to `at`. */
export function travelTo(g: Game, at: Vec2): void {
  const mode = travelMode(g.world);
  if (mode === 'skip') playIris(() => g.send({ kind: 'fastTravel', pos: { ...at } }));
  else if (mode === 'auto') g.send({ kind: 'travelAssist', pos: { ...at } });
  else g.send({ kind: 'moveKeeperTo', pos: { ...at } });
}

/** A Go there button for the goal with chip key `key`, or null when it has no place. */
export function goThereButton(g: Game, key: string, close: () => void): HTMLButtonElement | null {
  if (!goalTarget(g.world, key)) return null;
  const b = button(
    STEP_TEXT.goThere,
    () => {
      // Resolved again on the press: Dusty or the nearest unlit lantern may have moved.
      const at = goalTarget(g.world, key);
      close();
      if (at) travelTo(g, at);
    },
    'btn btn-small objective-go-journal',
  );
  b.setAttribute('aria-label', STEP_TEXT.goThereLabel);
  return b;
}

/** The label of the control that plays micro-game `kind`, or Imagine it / Skip when none. */
export function playLabel(kind: MicroKind | null, skipGames: boolean, check: string): string {
  if (kind && !skipGames && MICRO_BUILT.has(kind)) return STEP_TEXT.playIt(DO_IT_BY[kind].label);
  return stepPlayable(check) ? STEP_TEXT.skip : STEP_TEXT.imagine;
}

export interface StepControlOptions {
  g: Game;
  parent: HTMLElement;
  /** The quest's id, title, current step index and step. */
  id: string;
  title: string;
  stepIndex: number;
  step: { goal: string; check: string; summary?: string };
  /** Close the journal before acting, so the step's scene plays in the clear. */
  close: () => void;
  /** Open the micro-game; `act` meets the step when it ends. */
  playMicro: (kind: MicroKind, act: () => void) => void;
}

/** The controls for an actable side step (not a tracing step, not a timed wait). */
export function stepControls(o: StepControlOptions): HTMLButtonElement[] {
  const { g, step } = o;
  const act = (): void => g.send({ kind: 'sideAct', story: o.id });
  const skip = (): void => {
    o.close();
    act();
    showSkipCard(o.parent, o.title, stepSummary(step));
  };
  const out: HTMLButtonElement[] = [];
  const kind = microFor(step.check);
  const games = !microSkipped(g.world);
  const plays = kind !== null && games && MICRO_BUILT.has(kind);
  const go = plays ? null : goThereButton(g, `quest:${o.id}:${o.stepIndex}`, o.close);
  if (plays)
    out.push(
      button(
        playLabel(kind, false, step.check),
        () => {
          o.close();
          o.playMicro(kind, act);
        },
        'btn btn-small',
      ),
    );
  else if (go && stepPlayable(step.check)) out.push(go);
  // Nothing plays it: Imagine it (or Skip, for a step the sim watches), always with the card.
  // Beside Play it, a Skip appears only at Story only pace; beside Go there, always, since
  // the place may not hold what the step needs yet.
  if (!plays || goalsSkippable(g.world)) {
    const label = plays ? STEP_TEXT.skip : playLabel(null, true, step.check);
    const b = button(label, skip, out.length > 0 ? 'btn btn-small' : 'btn btn-small btn-primary');
    if (label === STEP_TEXT.imagine) b.title = STEP_TEXT.imagineHelp;
    out.push(b);
  }
  return out;
}

/** The spine goal's Go there and, at Story only pace, Skip goal. */
export function spineControls(
  g: Game,
  parent: HTMLElement,
  close: () => void,
): HTMLButtonElement[] {
  const c = g.world.campaign;
  if (!c || c.storyline) return [];
  const out: HTMLButtonElement[] = [];
  const go = goThereButton(g, `story:hazel:${c.chapter}`, close);
  if (go) out.push(go);
  if (skippableGoal(g.world)) {
    out.push(
      button(
        STEP_TEXT.skipGoal,
        () => {
          // The journal steps aside so the card stands alone and the closing plays clear.
          close();
          skipGoalWithCard(g, parent);
        },
        'btn btn-small',
      ),
    );
  }
  return out;
}

/** Send `skipGoal` and show what the skip did. */
export function skipGoalWithCard(g: Game, parent: HTMLElement): void {
  const c = g.world.campaign;
  const goal = skippableGoal(g.world);
  if (!c || !goal) return;
  const n = c.chapter;
  const def = chapterDef(n);
  g.send({ kind: 'skipGoal' });
  showSkipCard(
    parent,
    STORY_TEXT.chapter(n, def?.title ?? ''),
    SKIP_CARD_TEXT.chapter[n] ?? SKIP_CARD_TEXT.done(def?.goalText ?? ''),
    SKIP_CARD_TEXT.changes[goal === 'vigil' ? 'lanternsAgain' : goal] ?? [],
  );
}

/** A storyline goal that waits on the Keeper's word: Imagine it, with the card. */
export function storyActButton(
  parent: HTMLElement,
  title: string,
  goalText: string,
  send: () => void,
): HTMLButtonElement {
  const b = button(
    STEP_TEXT.storyImagine,
    () => {
      send();
      showSkipCard(parent, title, SKIP_CARD_TEXT.done(goalText));
    },
    'btn btn-small btn-primary',
  );
  b.title = STEP_TEXT.imagineHelp;
  return b;
}
