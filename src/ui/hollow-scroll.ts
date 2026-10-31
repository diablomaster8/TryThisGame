import { ACTS } from '../config/dungeon-acts';
import { ACT_TEXT } from '../config/strings';
import { HOLLOW_R8_TEXT } from '../config/strings-hollow-r8-party';
import { dailySeed } from '../sim/dungeon';
import { todayShareText } from '../sim/dungeon-log';
import type { World } from '../sim/types';
import { button, el, modal } from './dom';
import { HOLLOW_R9C_TEXT } from '../config/strings-hollow-r9-c';
import { compareBox, todayCode } from './hollow-r9-c';

/**
 * Two small cards for the Hollow (lane B round 8):
 * - The "Story so far" scroll (R0207): when an act's boss falls for the first time, a few
 *   short lines in the game's voice, read at the player's own pace. The sim decides when
 *   (`noteStoryScroll`: once per act, never in campaign chapters 9 to 11).
 * - Today's share card (R0185): the day's deepest level, best time and finds as one line of
 *   text to copy and paste anywhere, with a short code a friend can paste back in to compare
 *   (round 9). No server, nothing to keep up.
 */
export class HollowScroll {
  private readonly dialog;
  private readonly lines = el('div', 'hollow-scroll');

  constructor(parent: HTMLElement) {
    this.dialog = modal(parent, HOLLOW_R8_TEXT.scrollTitle, HOLLOW_R8_TEXT.scrollClose);
    this.dialog.body.append(
      this.lines,
      button(HOLLOW_R8_TEXT.scrollClose, () => this.dialog.hide(), 'btn btn-primary'),
    );
  }

  /** Unrolls act `act`'s scroll; false when the act has no lines. */
  show(act: number): boolean {
    const id = ACTS[act]?.id;
    const text = id ? HOLLOW_R8_TEXT.scroll[id] : undefined;
    if (!id || !text) return false;
    this.lines.replaceChildren(
      el('h3', undefined, ACT_TEXT[id]?.name ?? id),
      ...text.map((l) => el('p', undefined, l)),
    );
    this.dialog.show();
    return true;
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  close(): void {
    this.dialog.hide();
  }
}

export class ShareCard {
  private readonly dialog;
  private readonly text = el('p', 'hollow-share-text');
  private readonly status = el('p', 'help');
  private readonly copy: HTMLButtonElement;

  constructor(parent: HTMLElement) {
    this.dialog = modal(parent, HOLLOW_R8_TEXT.shareTitle, HOLLOW_R8_TEXT.scrollClose);
    this.status.setAttribute('aria-live', 'polite');
    this.copy = button(HOLLOW_R8_TEXT.shareCopy, () => void this.copyText(), 'btn btn-primary');
    this.dialog.body.append(this.text, this.copy, this.status);
    // R0185 (round 9): compare with a friend's short code.
    this.dialog.body.append(compareBox(() => this.world));
  }

  private world: World | null = null;

  open(world: World): void {
    this.world = world;
    const line = todayShareText(world, HOLLOW_R8_TEXT.shareText, dailySeed(world.lastWallMs).day);
    // R0185 (round 9): the line carries today's short share code.
    const code = line ? todayCode(world) : null;
    this.text.textContent = line
      ? code
        ? `${line} ${HOLLOW_R9C_TEXT.shareCode(code)}`
        : line
      : HOLLOW_R8_TEXT.shareNone;
    this.copy.hidden = line === null;
    this.status.textContent = '';
    this.dialog.show();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  close(): void {
    this.dialog.hide();
  }

  private async copyText(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.text.textContent ?? '');
      this.status.textContent = HOLLOW_R8_TEXT.shareCopied;
    } catch {
      this.status.textContent = HOLLOW_R8_TEXT.shareCopyFailed;
    }
  }
}
