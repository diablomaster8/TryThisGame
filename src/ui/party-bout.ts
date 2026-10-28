import '../battle.css';
import {
  BATTLE_TEXT,
  combatantName,
  formatEvent,
  moodWord,
  moveName,
  STATUS_TEXT,
} from '../config/strings-battle';
import { NAMES } from '../config/strings';
import type { Game } from '../game';
import {
  canChoose,
  moveOf,
  MOOD_STATS,
  prizeFor,
  standing,
  zipOf,
  type BattleAction,
  type BattleState,
  type Combatant,
} from '../sim/battle';
import { openTypeHelp } from './battle-help';
import { button, el, modal } from './dom';

/**
 * SL2's (Logged In) party bout panel, on the battle core: the sim owns the bout in
 * `world.battle` and pays the prize; this panel only sends `battleStart`, `battleAct` and
 * `battleForfeit` and draws what the sim holds. Each ally picks Bonk, a slotted move (with its
 * Puff cost), Huddle or Catch your breath; a move aimed at one foe asks "Who?" and turns the
 * foe rows into big tap targets (recs FIGHT-08); one foe left is picked for you. Rows show
 * Puff pips, statuses and moods as an icon and a word. Nobody is knocked down: a tuckered
 * ally naps under a leaf, a tuckered foe toddles home.
 */
export class PartyBoutPanel {
  private readonly dialog;
  private readonly body: HTMLDivElement;
  /** `world.battleRuns` when this panel asked for its bout; the bout is ours once it moves on. */
  private runsAtStart = -1;
  /** The move waiting for a target ('bonk' for Strike), or null. */
  private picking: string | null = null;
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
    this.picking = null;
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
    const view = `${sig}:${this.picking ?? ''}:${this.waitingOn ?? ''}`;
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
    this.picking = null;
    this.waitingOn = `${s.log.length}:${s.turn}:${s.active}:0`;
    g.send({ kind: 'battleAct', action });
  }

  private actionFor(move: string, target?: string): BattleAction {
    const t = target === undefined ? {} : { target };
    return move === 'bonk' ? { k: 'strike', ...t } : { k: 'move', move, ...t };
  }

  /** A move aimed at one foe asks who, unless only one is left; the rest go straight. */
  private use(s: BattleState, move: string): void {
    const up = s.sides[1].filter(standing);
    const single = moveOf(move).target === 'foe';
    if (!single || up.length === 1)
      this.send(s, this.actionFor(move, single ? up[0]!.id : undefined));
    else this.picking = move;
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
      ? button('', () => this.send(s, this.actionFor(this.picking!, c.id)), 'battle-row foe')
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
    if (!out) {
      // Puff pips, then any status and moods, each as an icon and a word.
      const pips = el('span', 'battle-puff', '●'.repeat(c.puff) + '○'.repeat(c.puffMax - c.puff));
      pips.setAttribute('aria-label', `${BATTLE_TEXT.puff} ${c.puff}/${c.puffMax}`);
      nameBox.appendChild(pips);
      const marks: string[] = [];
      if (c.major) marks.push(`${STATUS_TEXT[c.major.id].icon} ${STATUS_TEXT[c.major.id].name}`);
      for (const st of MOOD_STATS) if (c.moods[st]) marks.push(moodWord(st, c.moods[st]!));
      if (marks.length) nameBox.appendChild(el('span', 'battle-marks', marks.join(' · ')));
    }
    node.append(el('span', 'battle-icon', icon), nameBox, el('span', 'battle-tag', tag));
    node.setAttribute('aria-label', `${name}, ${tag}`);
    return node;
  }

  private render(s: BattleState | null): void {
    this.body.innerHTML = '';
    if (!s) return;
    this.body.appendChild(el('p', 'help', BATTLE_TEXT.round(s.turn, s.context.tier)));
    if (!s.result) {
      // Who goes next, roughly: by Zip (priority and the dice can still change it).
      const order = [...s.sides[0], ...s.sides[1]]
        .filter(standing)
        .sort((a, b) => zipOf(b) - zipOf(a))
        .map((c) => combatantName(c));
      this.body.appendChild(el('p', 'battle-order', `${BATTLE_TEXT.next}: ${order.join(' › ')}`));
    }
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
      .slice(-4);
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
          () => ((this.picking = null), (this.drawn = '')),
          'btn btn-small',
        ),
      );
    } else {
      const busy = this.waitingOn !== null;
      const me = s.sides[0][s.active];
      const add = (label: string, cost: number, ok: boolean, press: () => void): void => {
        const b = button('', press, 'btn btn-small battle-move');
        b.append(el('span', undefined, label), el('small', undefined, BATTLE_TEXT.cost(cost)));
        b.disabled = busy || !ok;
        if (!ok) b.title = BATTLE_TEXT.needPuff;
        row.appendChild(b);
      };
      if (me) {
        for (const id of ['bonk', ...me.moves])
          add(moveName(id), moveOf(id).puff, canChoose(s, me, this.actionFor(id)), () =>
            this.use(s, id),
          );
        const huddle = canChoose(s, me, { k: 'rally' });
        add(BATTLE_TEXT.moves.rally!, moveOf('huddle').puff, huddle, () =>
          this.send(s, { k: 'rally' }),
        );
        add(BATTLE_TEXT.moves.guard!, 0, true, () => this.send(s, { k: 'guard' }));
      }
      row.appendChild(
        button(BATTLE_TEXT.help, () => openTypeHelp(this.dialog.body), 'btn btn-small'),
      );
    }
    this.body.appendChild(row);
  }
}
