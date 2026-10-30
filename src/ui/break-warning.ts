/**
 * R0724 (KIDS-56): the break never arrives out of nowhere. Two minutes before it, a small
 * moon appears in the HUD corner and fills in as the time runs down, and the child hears
 * "Two more minutes, then a rest!" once. Reads the world only.
 */
import { EDU } from '../config/edu';
import { BREAK_KID_TEXT } from '../config/strings-kids';
import type { Game } from '../game';
import { eduBreakActive, eduBreakSoon } from '../sim/edu';
import { el } from './dom';
import { speakLine } from './lesson';

export class BreakWarning {
  private readonly root: HTMLDivElement;
  private warnedAt = -1;

  constructor(parent: HTMLElement) {
    this.root = el('div', 'edu-break-warn');
    this.root.hidden = true;
    this.root.setAttribute('role', 'status');
    this.root.appendChild(el('span', 'edu-break-moon', '🌙'));
    parent.appendChild(this.root);
  }

  update(g: Game): void {
    const e = g.world.edu;
    const soon = !!e && eduBreakSoon(g.world) && !eduBreakActive(g.world, Date.now());
    if (this.root.hidden === soon) this.root.hidden = !soon;
    if (!e || !soon) {
      // A new session (the count restarted) may warn again.
      if (e && e.playedMs < this.warnedAt) this.warnedAt = -1;
      return;
    }
    const total = EDU.breakWarnMinutes * 60_000;
    const left = e.sessionMinutes * 60_000 - e.playedMs;
    this.root.style.setProperty('--fill', String(Math.max(0, Math.min(1, 1 - left / total))));
    this.root.setAttribute('aria-label', BREAK_KID_TEXT.soon);
    if (this.warnedAt < 0) {
      this.warnedAt = e.playedMs;
      if (e.readAloud) speakLine(BREAK_KID_TEXT.soon);
    }
  }
}
