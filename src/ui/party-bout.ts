import { BOUT_TEXT } from '../config/strings';
import type { Game } from '../game';
import {
  createPartyBout,
  partyMove,
  partyPrize,
  type PartyBout,
  type PartyMove,
} from '../sim/party-bout';
import type { Nubbin } from '../sim/types';
import { button, el, modal } from './dom';

/**
 * S2's party bout panel: three partners against a line of foes, one move per turn
 * (strike, guard, rally), a short log, and the result sent to the sim as
 * `partyBoutResult`. Plain DOM over the canvas, like the other panels.
 */
export class PartyBoutPanel {
  private readonly dialog;
  private readonly body: HTMLDivElement;
  private bout: PartyBout | null = null;
  private tier = 1;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.dialog = modal(parent, BOUT_TEXT.title, BOUT_TEXT.leave);
    this.body = el('div');
    this.dialog.body.appendChild(this.body);
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  close(): void {
    if (this.bout && !this.bout.finished) this.toast(BOUT_TEXT.left);
    this.bout = null;
    this.dialog.hide();
  }

  /** Start a bout for the party `ids` at `tier`. */
  open(ids: string[], tier: number): void {
    const g = this.game();
    if (!g) return;
    const party = ids
      .map((id) => g.world.nubbins.find((n) => n.id === id))
      .filter((n): n is Nubbin => n !== undefined && n.stage !== 'egg');
    if (party.length === 0) {
      this.toast(BOUT_TEXT.noParty);
      return;
    }
    this.tier = tier;
    this.bout = createPartyBout(party, tier, Date.now() % 2147483647);
    this.render();
    this.dialog.show();
  }

  private move(move: PartyMove): void {
    const g = this.game();
    if (!this.bout || !g) return;
    partyMove(this.bout, move);
    if (this.bout.finished) {
      const won = this.bout.won === true;
      g.send({ kind: 'partyBoutResult', won, tier: this.tier, shells: partyPrize(this.tier, won) });
      this.toast(won ? BOUT_TEXT.won : BOUT_TEXT.lost);
    }
    this.render();
  }

  private render(): void {
    const b = this.bout;
    this.body.innerHTML = '';
    if (!b) return;
    this.body.appendChild(el('p', 'help', BOUT_TEXT.round(b.round, b.tier)));
    const side = (title: string, fighters: PartyBout['party'], mine: boolean) => {
      this.body.appendChild(el('div', 'btn-name', title));
      fighters.forEach((f, i) => {
        const row = el('div', 'roster-line');
        const active = mine && i === b.active && !b.finished;
        row.textContent = `${active ? '▶ ' : ''}${f.name} · ${BOUT_TEXT.hp} ${f.hp}/${f.maxHp}${f.guard ? ` · ${BOUT_TEXT.guarding}` : ''}${f.hp <= 0 ? ` · ${BOUT_TEXT.down}` : ''}`;
        this.body.appendChild(row);
      });
    };
    side(BOUT_TEXT.party, b.party, true);
    side(BOUT_TEXT.foes, b.foes, false);
    const log = el('div', 'help');
    log.textContent = b.log.slice(-3).join(' ');
    this.body.appendChild(log);
    const row = el('div', 'race-tiers');
    if (b.finished) {
      row.appendChild(el('div', 'btn-name', b.won ? BOUT_TEXT.won : BOUT_TEXT.lost));
      row.appendChild(button(BOUT_TEXT.done, () => this.close(), 'btn btn-small btn-primary'));
    } else {
      for (const move of ['strike', 'guard', 'rally'] as const) {
        row.appendChild(
          button(BOUT_TEXT.moves[move] ?? move, () => this.move(move), 'btn btn-small'),
        );
      }
    }
    this.body.appendChild(row);
  }
}
