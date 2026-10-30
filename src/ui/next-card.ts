/**
 * The Learning Grove's "What's next" card (KIDS-04): where a tap on Story lands when no scene
 * is waiting. It speaks the current goal instead of toasting, so a child who cannot read yet
 * is never left at a dead end. A sprout chapter shows its `goalIcon` big and says its
 * `goalSay` (R0673); "Show me" hands over to the pointing guide (R0676). Reads the world only.
 */
import { EDU_STORY_TEXT } from '../config/strings';
import { GUIDE_TEXT } from '../config/strings-kids';
import type { Game } from '../game';
import { textBandOf } from '../sim/story-scenes';
import { button, el, modal } from './dom';
import { eduJournal } from './journal';
import { speakLine } from './lesson';
import { objectiveOf } from './objective';

/** What the card shows and says for the world as it is: pure, for the tests. */
export function nextCardContent(g: Game): { icon: string; say: string } {
  const o = objectiveOf(g);
  const c = g.world.campaign;
  const edu = c && textBandOf(g.world) === 'sprout' ? eduJournal(g)?.chapter(c.chapter) : null;
  if (o?.story && edu?.goalSay) return { icon: edu.goalIcon ?? '🧭', say: edu.goalSay };
  return {
    icon: edu?.goalIcon ?? '🧭',
    say: o ? `${o.goal}. ${o.hint}` : EDU_STORY_TEXT.nextNothing,
  };
}

export class NextCard {
  private readonly dialog;
  private readonly icon: HTMLElement;
  private readonly goal: HTMLElement;
  private said = '';

  constructor(parent: HTMLElement, showMe?: () => void) {
    this.dialog = modal(parent, EDU_STORY_TEXT.nextTitle, EDU_STORY_TEXT.nextOk);
    this.icon = el('div', 'edu-big next-card-icon', '🧭');
    this.goal = el('p', 'help');
    this.dialog.body.append(this.icon, this.goal);
    if (showMe)
      this.dialog.body.appendChild(
        button(
          `👉 ${GUIDE_TEXT.showMe}`,
          () => {
            this.dialog.hide();
            showMe();
          },
          'btn btn-primary next-card-show',
        ),
      );
    this.dialog.body.appendChild(
      button(EDU_STORY_TEXT.hearAgain, () => speakLine(this.said), 'btn btn-small'),
    );
  }

  /** Show the current goal and say it aloud. */
  show(g: Game): void {
    const { icon, say } = nextCardContent(g);
    this.said = say;
    this.icon.textContent = icon;
    this.goal.textContent = say;
    this.dialog.show();
    speakLine(say);
  }
}
