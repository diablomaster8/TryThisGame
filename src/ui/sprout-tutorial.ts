/**
 * Lane E r10, R0679 (KIDS-11 / KIDS-05): the sprout HUD's spoken one-time tutorial, in place
 * of the hidden "Tap to walk · tap a Nubbin…" hint text. Once per Grove, when nothing else is
 * on screen and the voice can be heard, it says what tapping does and what each of the four
 * picture buttons opens, lighting each button as it is named. It is marked said when it
 * starts, so an interruption never makes it nag again.
 */
import '../kids-r10.css';
import { KIDS_R10_TEXT } from '../config/strings-kids-r10';
import { KIDS_R10_TUNING } from '../config/tuning-kids-r10';
import type { Game } from '../game';
import { isAudioUnlocked, isSoundEnabled } from '../platform/audio';
import type { EduState } from '../sim/types';
import { speakLine } from './lesson';

/** Pure: the tutorial starts for a sprout who hasn't heard it, when nothing else is up. */
export function tutorialShouldStart(
  edu: Pick<EduState, 'band' | 'tutorialSaid' | 'readAloud'> | null,
  busy: boolean,
  canSpeak: boolean,
): boolean {
  return !!edu && edu.band === 'sprout' && !edu.tutorialSaid && edu.readAloud && !busy && canSpeak;
}

export interface TutorialButtons {
  story: HTMLElement;
  play: HTMLElement;
  nubbins: HTMLElement;
  places: HTMLElement;
}

export class SproutTutorial {
  private running = false;
  private lit: HTMLElement | null = null;

  constructor(private readonly buttons: TutorialButtons) {}

  update(g: Game, busy: boolean): void {
    if (this.running) {
      // Something else came up (a scene, a round): stop pointing; the voice is theirs now.
      if (busy) this.stop();
      return;
    }
    if (!tutorialShouldStart(g.world.edu, busy, isAudioUnlocked() && isSoundEnabled())) return;
    this.running = true;
    g.send({ kind: 'eduTutorialSaid' });
    const b = this.buttons;
    const steps: Array<[string, HTMLElement | null]> = [
      [KIDS_R10_TEXT.tutorial.walk, null],
      [KIDS_R10_TEXT.tutorial.pet, null],
      [KIDS_R10_TEXT.tutorial.story, b.story],
      [KIDS_R10_TEXT.tutorial.play, b.play],
      [KIDS_R10_TEXT.tutorial.nubbins, b.nubbins],
      [KIDS_R10_TEXT.tutorial.places, b.places],
    ];
    const say = (i: number): void => {
      if (!this.running) return;
      const step = steps[i];
      if (!step) {
        this.stop();
        return;
      }
      this.light(step[1]);
      // A voice that never reports its end (or no voice at all) still moves the light on.
      let moved = false;
      const go = (): void => {
        if (moved) return;
        moved = true;
        window.clearTimeout(timer);
        say(i + 1);
      };
      const timer = window.setTimeout(go, KIDS_R10_TUNING.tutorialStepMaxMs);
      speakLine(step[0], { onDone: go });
    };
    say(0);
  }

  private light(el: HTMLElement | null): void {
    this.lit?.classList.remove('sprout-tut-lit');
    this.lit = el && !el.hidden ? el : null;
    this.lit?.classList.add('sprout-tut-lit');
  }

  private stop(): void {
    this.running = false;
    this.light(null);
  }
}
