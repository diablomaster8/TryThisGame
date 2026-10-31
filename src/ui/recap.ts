/**
 * Lane C round 10, agent C (R0620, CAMP-28): "The story so far". After a break of
 * `RECAP.afterDays` or more, Continue shows it once the "While you were away" screen closes
 * (never before it): the spine's chapter and the last two choices you made, each running
 * questline in one line, and the tracked quests' current goals. The journal's Other roads
 * show the same per line. Every line is assembled from the story's own data (chapter titles,
 * goal texts and the labels of the choices taken), so no new prose is needed.
 */
import { RECAP_TEXT } from '../config/strings';
import { RECAP } from '../config/tuning';
import { STORY_TEXT } from '../config/story';
import type { Game } from '../game';
import { goalMet, sceneById } from '../sim/campaign';
import { activeLines } from '../sim/story-book';
import { storylineById } from '../sim/story-scenes';
import { journalView } from '../sim/storyline';
import type { CampaignState, World } from '../sim/types';
import { button, el, modal } from './dom';
import { eduJournal } from './journal';
import { trackedObjectives } from './objective';

const DAY_MS = 86_400_000;

/** Whether a gap of `elapsedMs` away earns the recap. */
export function recapDue(elapsedMs: number): boolean {
  return elapsedMs >= RECAP.afterDays * DAY_MS;
}

/** The labels of the last `max` choices this story's flags still show, newest first. */
export function recentChoices(c: CampaignState, max: number = RECAP.choices): string[] {
  const out: string[] = [];
  for (let i = c.seen.length - 1; i >= 0 && out.length < max; i--) {
    const scene = sceneById(c.seen[i]!);
    const picked = scene?.choices?.find((ch) => {
      const set = Object.entries(ch.set ?? {});
      return set.length > 0 && set.every(([k, v]) => c.flags[k] === v);
    });
    if (picked) out.push(picked.label);
  }
  return out;
}

export interface RecapBlocks {
  spine: string[];
  lines: string[];
  quests: string[];
}

/** The three blocks of the recap, from the world as it stands. Empty blocks are left out. */
export function recapBlocks(g: Game): RecapBlocks {
  const world: World = g.world;
  const c = world.campaign;
  const spine: string[] = [];
  if (c) {
    const view = journalView(world, c, goalMet(world, c));
    if (view && c.chapter > view.final) {
      const ending = view.ending ? view.endings[view.ending] : undefined;
      spine.push(STORY_TEXT.endingReached(ending?.title ?? ''));
    } else if (view) {
      const edu = eduJournal(g)?.chapter(view.n);
      const prev = view.chapters.find((ch) => ch.n === view.n - 1);
      if (prev) spine.push(RECAP_TEXT.lastDone(prev.n, prev.title));
      spine.push(
        RECAP_TEXT.chapterNow(view.n, edu?.title ?? view.title, edu?.goalText ?? view.goalText),
      );
    }
    for (const label of recentChoices(c).reverse()) spine.push(RECAP_TEXT.chose(label));
  }
  const lines: string[] = [];
  for (const line of activeLines(world)) {
    const view = line.storyline ? journalView(world, line, false) : null;
    if (!view || !line.storyline) continue;
    const title = storylineById(line.storyline)?.title ?? line.storyline;
    lines.push(RECAP_TEXT.line(title, view.n, view.final, view.goalText));
  }
  const quests = trackedObjectives(world).map((o) => o.goal);
  return { spine, lines, quests };
}

/** The chapters a line has finished, each with its goal, then the choices its flags show. */
export function lineRecap(line: CampaignState): string[] {
  const s = line.storyline ? storylineById(line.storyline) : undefined;
  if (!s) return [];
  const out = s.chapters
    .filter((ch) => ch.n < line.chapter)
    .map((ch) => RECAP_TEXT.chapterDone(ch.n, ch.title, ch.goalText));
  for (const label of recentChoices(line, RECAP.choices).reverse())
    out.push(RECAP_TEXT.chose(label));
  return out;
}

/** The recap card: three short blocks, Got it and Open journal. */
export class RecapCard {
  private readonly dialog;

  constructor(
    parent: HTMLElement,
    private readonly openJournal: () => void,
  ) {
    this.dialog = modal(parent, RECAP_TEXT.title, RECAP_TEXT.ok);
    this.dialog.root.classList.add('recap-card');
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  /** Show the recap for `g`, unless there is nothing to recap. */
  show(g: Game): void {
    const b = recapBlocks(g);
    if (b.spine.length + b.lines.length + b.quests.length === 0) return;
    const body = this.dialog.body;
    body.replaceChildren();
    const block = (head: string, rows: string[]): void => {
      if (rows.length === 0) return;
      body.appendChild(el('div', 'btn-name', head));
      for (const r of rows) body.appendChild(el('p', undefined, r));
    };
    block(g.world.campaign?.storyline ? RECAP_TEXT.title : RECAP_TEXT.spineHead, b.spine);
    block(RECAP_TEXT.linesHead, b.lines);
    block(RECAP_TEXT.questsHead, b.quests);
    const row = el('div', 'journal-actions');
    row.append(
      button(RECAP_TEXT.ok, () => this.dialog.hide(), 'btn btn-primary'),
      button(
        RECAP_TEXT.journal,
        () => {
          this.dialog.hide();
          this.openJournal();
        },
        'btn',
      ),
    );
    body.appendChild(row);
    this.dialog.show();
  }
}
