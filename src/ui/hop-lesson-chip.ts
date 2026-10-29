/**
 * MOVE-58: the hop lesson's chip. While the one-time lesson is shown (`world.hopLesson`), a
 * chip at the top of the screen suggests a hop over the log or the stream; it goes for good
 * on the first clear. In the sprout band it is read aloud once as it appears. Plain words,
 * an invitation and never a quiz (the Learning Grove's rule).
 */
import '../move.css';
import { HOP_LESSON_TEXT } from '../config/strings-move';
import { hopLessonNear } from '../sim/hop-lesson';
import { textBandOf } from '../sim/story-scenes';
import type { World } from '../sim/types';
import { el } from './dom';
import { speakLine } from './lesson';

export class HopLessonChip {
  readonly root: HTMLDivElement;
  private shown = false;

  constructor(parent: HTMLElement) {
    this.root = el('div', 'hop-lesson-chip');
    this.root.setAttribute('role', 'status');
    this.root.hidden = true;
    parent.appendChild(this.root);
  }

  /** Per frame: up while the lesson is shown, gone once it is done. */
  update(world: World): void {
    const on = world.hopLesson === 'shown' && world.location === 'grove';
    if (on && !this.shown) {
      const near = hopLessonNear(world, world.keeper.pos);
      this.root.textContent = near === 'stream' ? HOP_LESSON_TEXT.stream : HOP_LESSON_TEXT.chip;
      if (textBandOf(world) === 'sprout') speakLine(this.root.textContent);
    }
    this.shown = on;
    this.root.hidden = !on;
  }
}
