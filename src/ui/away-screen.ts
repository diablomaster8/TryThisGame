import { formatDuration, NAMES, TYPE_LABELS, UI_TEXT } from '../config/strings';
import type { AwayReport, World } from '../sim/types';
import { button, dialogFocus, el } from './dom';

/** "While you were away": what the catch-up did, shown once per return. */
export class AwayScreen {
  private readonly root: HTMLDivElement;
  private readonly list: HTMLUListElement;
  private readonly summary: HTMLParagraphElement;
  private readonly focus: ReturnType<typeof dialogFocus>;

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
      button(UI_TEXT.continueButton, () => this.hide(), 'btn btn-primary'),
    );
    this.root.appendChild(card);
    parent.appendChild(this.root);
  }

  get isOpen(): boolean {
    return !this.root.hidden;
  }

  show(report: AwayReport, world: World): void {
    this.summary.textContent = `${UI_TEXT.awayElapsed(formatDuration(report.elapsedMs))} ${UI_TEXT.awaySimulated(formatDuration(report.simulatedMs))}`;
    this.list.innerHTML = '';
    const nameOf = (id: string) => world.nubbins.find((n) => n.id === id)?.name ?? NAMES.creature;
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
      if (text) this.list.appendChild(el('li', undefined, text));
    }
    if (this.list.childElementCount === 0)
      this.list.appendChild(el('li', undefined, UI_TEXT.awayNothing));
    this.root.hidden = false;
    this.focus.opened();
  }

  hide(): void {
    if (this.root.hidden) return;
    this.root.hidden = true;
    this.focus.closed();
  }
}

function bandWord(band: 'sun' | 'moon' | 'neutral'): string {
  return band === 'sun'
    ? NAMES.alignmentSun
    : band === 'moon'
      ? NAMES.alignmentMoon
      : NAMES.alignmentNeutral;
}
