import '../battle.css';
import { BATTLE_TEXT, combatantName, formatEvent } from '../config/strings-battle';
import { NAMES } from '../config/strings';
import type { Game } from '../game';
import {
  prizeFor,
  standing,
  type BattleAction,
  type BattleState,
  type Combatant,
} from '../sim/battle';
import { button, el, modal } from './dom';

/**
 * SL2's (Logged In) party bout panel, on the battle core: the sim owns the bout in
 * `world.battle` and pays the prize; this panel only sends `battleStart`, `battleAct` and
 * `battleForfeit` and draws what the sim holds. Strike asks "Who?" and turns the foe rows into
 * big tap targets (recs FIGHT-08); one foe left is picked for you. Nobody is knocked down: a
 * tuckered ally naps under a leaf, a tuckered foe toddles home.
 */
export class PartyBoutPanel {
  private readonly dialog;
  private readonly body: HTMLDivElement;
  /** `world.battleRuns` when this panel asked for its bout; the bout is ours once it moves on. */
  private runsAtStart = -1;
  private picking = false;
  /** The state signature an action was sent from; buttons wait until the sim has moved on. */
  private waitingOn: string | null = null;
  private drawn = '';
  private announced = false;
  private rafId = 0;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.dialog = modal(parent, BATTLE_TEXT.partyTitle, BATTLE_TEXT.leave);
    this.body = el('div');
    this.body.setAttribute('aria-live', 'polite');
    this.dialog.body.appendChild(this.body);
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  close(): void {
    this.dialog.hide();
    this.leave();
  }

  /** Start a bout for the party `ids` at `tier`. */
  open(ids: string[], tier: number): void {
    const g = this.game();
    if (!g) return;
    const hatched = ids.filter((id) => {
      const n = g.world.nubbins.find((x) => x.id === id);
      return n !== undefined && n.stage !== 'egg' && n.stage !== 'cocoon';
    });
    if (hatched.length === 0) {
      this.toast(BATTLE_TEXT.noParty);
      return;
    }
    this.runsAtStart = g.world.battleRuns ?? 0;
    this.picking = false;
    this.waitingOn = null;
    this.drawn = '';
    this.announced = false;
    g.send({ kind: 'battleStart', context: { kind: 'party', tier, ids: hatched } });
    this.body.innerHTML = '';
    this.dialog.show();
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(this.tick);
  }

  /** The bout this panel started, once the sim has made it. */
  private bout(): BattleState | null {
    const g = this.game();
    const s = g?.world.battle;
    if (!g || !s || s.context.kind !== 'party') return null;
    return (g.world.battleRuns ?? 0) > this.runsAtStart ? s : null;
  }

  /** Closing an unfinished bout forfeits it: no prize, no loss on the record. */
  private leave(): void {
    cancelAnimationFrame(this.rafId);
    const g = this.game();
    const s = this.bout();
    if (g && s && !s.result) {
      g.send({ kind: 'battleForfeit' });
      this.toast(BATTLE_TEXT.left);
    }
    this.runsAtStart = Number.MAX_SAFE_INTEGER;
  }

  private tick = (): void => {
    // The modal's own close button hides it without calling close().
    if (!this.dialog.isOpen()) {
      this.leave();
      return;
    }
    const s = this.bout();
    const sig = s ? `${s.log.length}:${s.turn}:${s.active}:${s.result ? 1 : 0}` : 'none';
    if (this.waitingOn !== null && sig !== this.waitingOn) this.waitingOn = null;
    const view = `${sig}:${this.picking ? 1 : 0}:${this.waitingOn ?? ''}`;
    if (view !== this.drawn) {
      this.drawn = view;
      this.render(s);
    }
    if (s?.result && !this.announced) {
      this.announced = true;
      this.toast(this.resultText(s));
    }
    this.rafId = requestAnimationFrame(this.tick);
  };

  private send(s: BattleState, action: BattleAction): void {
    const g = this.game();
    if (!g || s.result || this.waitingOn !== null) return;
    this.picking = false;
    this.waitingOn = `${s.log.length}:${s.turn}:${s.active}:0`;
    g.send({ kind: 'battleAct', action });
  }

  private strike(s: BattleState): void {
    const up = s.sides[1].filter(standing);
    if (up.length === 1) this.send(s, { k: 'strike', target: up[0]!.id });
    else this.picking = true;
    this.drawn = '';
  }

  private resultText(s: BattleState): string {
    const w = s.result?.winner;
    return w === 0 ? BATTLE_TEXT.partyWon : w === 1 ? BATTLE_TEXT.partyLost : BATTLE_TEXT.draw;
  }

  private row(s: BattleState, c: Combatant, ix: number): HTMLElement {
    const foe = c.side === 1;
    const out = !standing(c);
    const pickable = foe && this.picking && !out && !s.result;
    const node: HTMLElement = pickable
      ? button('', () => this.send(s, { k: 'strike', target: c.id }), 'battle-row foe')
      : el('div', `battle-row${foe ? ' foe' : ''}`);
    const active = !foe && ix === s.active && !s.result;
    if (active) node.classList.add('active');
    if (out) node.classList.add(foe ? 'gone' : 'tuckered');
    const icon = out ? (foe ? '🎒' : '🍃') : active ? '▶' : foe ? '◆' : '●';
    const name = combatantName(c);
    const nameBox = el('span', 'battle-name');
    nameBox.appendChild(el('span', undefined, name));
    const hp = el('span', 'battle-hp');
    const fill = el('span');
    fill.style.width = `${Math.round((100 * c.hp) / c.maxHp)}%`;
    hp.appendChild(fill);
    nameBox.appendChild(hp);
    const tag = out
      ? foe
        ? BATTLE_TEXT.wentHome
        : `${BATTLE_TEXT.tuckered} ${BATTLE_TEXT.zzz}`
      : `${BATTLE_TEXT.hp} ${c.hp}/${c.maxHp}${c.guard ? ` · ${BATTLE_TEXT.guarding}` : ''}`;
    node.append(el('span', 'battle-icon', icon), nameBox, el('span', 'battle-tag', tag));
    node.setAttribute('aria-label', `${name}, ${tag}`);
    return node;
  }

  private render(s: BattleState | null): void {
    this.body.innerHTML = '';
    if (!s) return;
    this.body.appendChild(el('p', 'help', BATTLE_TEXT.round(s.turn, s.context.tier)));
    const side = (title: string, list: Combatant[]) => {
      this.body.appendChild(el('div', 'btn-name', title));
      const box = el('div', 'battle-side');
      list.forEach((c, i) => box.appendChild(this.row(s, c, i)));
      this.body.appendChild(box);
    };
    side(BATTLE_TEXT.party, s.sides[0]);
    if (this.picking) this.body.appendChild(el('p', 'battle-prompt', BATTLE_TEXT.who));
    side(BATTLE_TEXT.foes, s.sides[1]);
    const names = new Map([...s.sides[0], ...s.sides[1]].map((c) => [c.id, combatantName(c)]));
    const lines = s.log
      .map((e) => formatEvent(e, (id) => names.get(id) ?? id))
      .filter((l): l is string => l !== null)
      .slice(-3);
    const log = el('div', 'help battle-log');
    for (const l of lines) log.appendChild(el('p', undefined, l));
    this.body.appendChild(log);
    const row = el('div', 'battle-moves');
    if (s.result) {
      const shells = prizeFor(s.context, s.result);
      row.appendChild(el('div', 'btn-name', this.resultText(s)));
      if (shells > 0)
        row.appendChild(el('div', 'btn-name', BATTLE_TEXT.prize(shells, NAMES.currency)));
      row.appendChild(button(BATTLE_TEXT.done, () => this.close(), 'btn btn-small btn-primary'));
    } else if (this.picking) {
      row.appendChild(
        button(
          BATTLE_TEXT.cancel,
          () => ((this.picking = false), (this.drawn = '')),
          'btn btn-small',
        ),
      );
    } else {
      const busy = this.waitingOn !== null;
      for (const move of ['strike', 'guard', 'rally'] as const) {
        const b = button(
          BATTLE_TEXT.moves[move] ?? move,
          () => (move === 'strike' ? this.strike(s) : this.send(s, { k: move })),
          'btn btn-small',
        );
        b.disabled = busy;
        row.appendChild(b);
      }
    }
    this.body.appendChild(row);
  }
}
