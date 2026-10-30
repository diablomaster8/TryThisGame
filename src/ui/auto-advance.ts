/**
 * Lane E r9 (R0730 KIDS-62): the read-aloud story turns its own pages. With the grown-up's
 * switch on (default off), a Little Sprouts line goes on by itself once the voice has said it
 * and `KIDS_READ.autoAdvanceMs` has passed; it never goes past a choice, an ask card or a do
 * beat (those fill the choice row, which stops it). A small ▶️/⏸️ toggle on the box flips the
 * same switch. The dialogue owns the lines; this owns the timer and the toggle.
 */
import { KIDS_READ } from '../config/tuning-look-r9e';
import { KIDS_READ_TEXT } from '../config/strings-look-r9e';
import type { Game } from '../game';
import { button } from './dom';

/** What the dialogue box looks like when a line's voice ends. */
export interface AutoState {
  /** The grown-up's switch, the sprout band and read-aloud: all three on. */
  enabled: boolean;
  open: boolean;
  /** A panel over the scene, or a chapter postcard holding the first line. */
  blocked: boolean;
  /** Choices, an ask card or a do beat fill the choice row. */
  choicesUp: boolean;
  /** The same line is still on screen as when the voice started. */
  sameLine: boolean;
}

/** Whether the next line may come on its own now. */
export function shouldAutoAdvance(s: AutoState): boolean {
  return s.enabled && s.open && !s.blocked && !s.choicesUp && s.sameLine;
}

/** Whether the switch applies to this save: Little Sprouts with read-aloud on. */
export function autoAdvanceOn(g: Game | null): boolean {
  const e = g?.world.edu;
  return !!e && e.band === 'sprout' && e.readAloud && e.autoAdvance === true;
}

/** Whether the device voice is still talking (false where there is no voice). */
function speaking(): boolean {
  try {
    return window.speechSynthesis?.speaking === true;
  } catch {
    return false;
  }
}

export class AutoAdvance {
  readonly btn: HTMLButtonElement;
  private timer = 0;
  /** Bumped on each new line, so a late voice end for an old line does nothing. */
  private token = 0;

  constructor(
    private readonly game: () => Game | null,
    /** The box's state now, and its advance. */
    private readonly state: () => Omit<AutoState, 'enabled' | 'sameLine'>,
    private readonly go: () => void,
  ) {
    this.btn = button('▶️', () => this.toggle(), 'btn dialogue-auto');
    // A tap on the toggle is not a tap on the box: it never turns the page itself.
    this.btn.addEventListener('click', (e) => e.stopPropagation());
    this.btn.hidden = true;
    this.sync();
  }

  /** A new line is up: forget any pending turn, and hand back the hook for its voice end. */
  line(): () => void {
    clearTimeout(this.timer);
    const token = ++this.token;
    this.sync();
    return () => {
      if (token !== this.token) return;
      this.timer = window.setTimeout(() => {
        const s = this.state();
        if (
          shouldAutoAdvance({
            ...s,
            enabled: autoAdvanceOn(this.game()),
            sameLine: token === this.token,
          })
        )
          this.go();
      }, KIDS_READ.autoAdvanceMs);
    };
  }

  /** The scene closed or was skipped: nothing pending. */
  stop(): void {
    clearTimeout(this.timer);
    this.token++;
  }

  /** Show the toggle in the sprout band with read-aloud on, pressed while the switch is on. */
  sync(): void {
    const e = this.game()?.world.edu;
    const shown = !!e && e.band === 'sprout' && e.readAloud;
    this.btn.hidden = !shown;
    const on = shown && e.autoAdvance === true;
    this.btn.textContent = on ? '⏸️' : '▶️';
    this.btn.setAttribute('aria-pressed', String(on));
    const label = on ? KIDS_READ_TEXT.autoOn : KIDS_READ_TEXT.autoOff;
    this.btn.setAttribute('aria-label', label);
    this.btn.title = label;
  }

  private toggle(): void {
    const g = this.game();
    if (!g?.world.edu) return;
    const on = g.world.edu.autoAdvance !== true;
    g.send({ kind: 'eduSetAutoAdvance', on });
    // Turning it on while a line waits and the voice is quiet: go on after the usual pause.
    if (on && !speaking()) this.line()();
    // The sim applies the switch on its next step; show the new state now.
    this.btn.textContent = on ? '⏸️' : '▶️';
    this.btn.setAttribute('aria-pressed', String(on));
    this.btn.setAttribute('aria-label', on ? KIDS_READ_TEXT.autoOn : KIDS_READ_TEXT.autoOff);
  }
}
