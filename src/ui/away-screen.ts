import { formatDuration, NAMES, TYPE_LABELS, UI_TEXT } from '../config/strings';
import type { AwayReport, World } from '../sim/types';
import { button, dialogFocus, el } from './dom';
import { awayDiary } from '../sim/away-diary';
import { AWAY_SHORT } from '../config/strings-fun-r5';
import { toastBand } from './fun-toasts';
import '../fun.css';

/** "While you were away": what the catch-up did, shown once per return. */
export class AwayScreen {
  private readonly root: HTMLDivElement;
  private readonly list: HTMLUListElement;
  private readonly summary: HTMLParagraphElement;
  private readonly focus: ReturnType<typeof dialogFocus>;
  private onClosed: (() => void) | null = null;

  constructor(parent: HTMLElement) {
    this.root = el('div', 'modal');
    this.root.hidden = true;
    const card = el('div', 'modal-card away');
    const heading = el('h2', undefined, UI_TEXT.awayTitle);
    card.appendChild(heading);
    this.focus = dialogFocus(this.root, card, heading, () => this.hide());
    this.summary = el('p', 'help');
    this.list = el('ul', 'away-list');
    card.append(
      this.summary,
      this.list,
      button(UI_TEXT.continueButton, () => this.hide(), 'btn btn-primary away-go'),
    );
    this.root.appendChild(card);
    parent.appendChild(this.root);
  }

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  /**
   * `onClosed` runs once when the player closes the screen: the game releases the
   * end-of-life checks it held, so waiting cocoons play out in front of the player.
   */
  show(report: AwayReport, world: World, onClosed?: () => void): void {
    // A second report over an open screen keeps the first one's release too.
    const earlier = this.onClosed;
    this.onClosed = onClosed
      ? () => {
          earlier?.();
          onClosed();
        }
      : earlier;
    this.summary.textContent = `${UI_TEXT.awayElapsed(formatDuration(report.elapsedMs))} ${UI_TEXT.awaySimulated(formatDuration(report.simulatedMs))}`;
    this.list.innerHTML = '';
    const nameOf = (id: string) => world.nubbins.find((n) => n.id === id)?.name ?? NAMES.creature;
    const headlines: string[] = [];
    for (const e of report.events) {
      let text: string | null = null;
      switch (e.kind) {
        case 'hatched':
          text = UI_TEXT.awayHatched(nameOf(e.nubbinId));
          break;
        case 'evolved':
          text = UI_TEXT.awayEvolved(
            nameOf(e.nubbinId),
            `${bandWord(e.band)} ${TYPE_LABELS[e.type]}`,
          );
          break;
        case 'reborn':
          text = UI_TEXT.awayReborn(nameOf(e.nubbinId));
          break;
        case 'departed':
          text = UI_TEXT.awayDeparted(e.name);
          break;
        case 'eternal':
          text = UI_TEXT.awayEternal(nameOf(e.nubbinId));
          break;
        case 'awaitingKeeper':
          text = UI_TEXT.awayWaiting(nameOf(e.nubbinId));
          break;
        default:
          break;
      }
      if (text) headlines.push(text);
    }
    // R0316 (TECH-76): at most three headlines, then "+N more" on one line.
    for (const text of headlines.slice(0, AWAY_SHORT.headlines))
      this.list.appendChild(el('li', undefined, text));
    if (headlines.length > AWAY_SHORT.headlines)
      this.list.appendChild(
        el('li', 'away-more', AWAY_SHORT.more(headlines.length - AWAY_SHORT.headlines)),
      );
    // R0316 (FUN-27): the diary, which also stands in for "Everyone was quiet."
    for (const line of awayDiary(report, world, toastBand(world), world.rngState))
      this.list.appendChild(el('li', 'away-diary', line));
    this.root.hidden = false;
    this.focus.opened();
  }

  hide(): void {
    if (this.root.hidden) return;
    this.root.hidden = true;
    this.focus.closed();
    const closed = this.onClosed;
    this.onClosed = null;
    closed?.();
  }
}

function bandWord(band: 'sun' | 'moon' | 'neutral'): string {
  return band === 'sun'
    ? NAMES.alignmentSun
    : band === 'moon'
      ? NAMES.alignmentMoon
      : NAMES.alignmentNeutral;
}
