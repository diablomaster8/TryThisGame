/**
 * The Learning Grove's "What's next" card (KIDS-04): where a tap on Story lands when no scene
 * is waiting. It speaks the current goal instead of toasting, so a child who cannot read yet
 * is never left at a dead end. Reads the world only.
 */
import { EDU_STORY_TEXT } from '../config/strings';
import type { Game } from '../game';
import { button, el, modal } from './dom';
import { speakLine } from './lesson';
import { objectiveOf } from './objective';

export class NextCard {
  private readonly dialog;
  private readonly goal: HTMLElement;
  private said = '';

  constructor(parent: HTMLElement) {
    this.dialog = modal(parent, EDU_STORY_TEXT.nextTitle, EDU_STORY_TEXT.nextOk);
    this.dialog.body.appendChild(el('div', 'edu-big', '🧭'));
    this.goal = el('p', 'help');
    this.dialog.body.append(
      this.goal,
      button(EDU_STORY_TEXT.hearAgain, () => speakLine(this.said), 'btn btn-small'),
    );
  }

  /** Show the current goal and say it aloud. */
  show(g: Game): void {
    const o = objectiveOf(g);
    this.said = o ? `${o.goal}. ${o.hint}` : EDU_STORY_TEXT.nextNothing;
    this.goal.textContent = this.said;
    this.dialog.show();
    speakLine(this.said);
  }
}
