import '../battle.css';
import '../dungeon.css';
import { BATTLE_TEXT, combatantName, formatEvent } from '../config/strings-battle';
import { HOLLOW_TEXT } from '../config/strings-dungeon';
import type { Game } from '../game';
import { standing, type BattleAction, type BattleState, type Combatant } from '../sim/battle';
import { HOLLOW_BATTLE_SOURCE } from '../sim/dungeon-encounters';
import { runFloor } from '../sim/dungeon';
import { championMod, PLATE_GLYPH } from '../config/dungeon-foes';
import { UNIQUE_TEXT } from '../config/strings-dungeon';
import { button, el, modal } from './dom';

/**
 * The Hollow's pack fight on lane C's battle core. Bumping into a pack makes the sim start an
 * `encounter` bout (`battleHandler`); this panel notices it, opens by itself and only sends
 * `battleAct` and `battleForfeit`. When the bout ends the sim finishes the encounter on the
 * floor (the HUD toasts the poof, the giggles or the slip-away); Done closes the panel.
 * Closing early backs off: a forfeit, which flees a pack and loses to a boss.
 */
export class HollowBoutPanel {
  private readonly dialog;
  private readonly body: HTMLDivElement;
  /** `world.battleRuns` of the bout on show; -1 when none. */
  private shown = -1;
  private picking = false;
  private waitingOn: string | null = null;
  private drawn = '';
  /** The bout already given up, so a back-off is sent once. */
  private left = -1;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, HOLLOW_TEXT.boutTitle, HOLLOW_TEXT.boutBackOff);
    this.dialog.root.classList.add('hollow-bout');
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

  /** The bout on show, while the sim still holds it. */
  private bout(): BattleState | null {
    const w = this.game()?.world;
    const s = w?.battle;
    if (!w || !s || (w.battleRuns ?? 0) !== this.shown) return null;
    return s.context.kind === 'encounter' && s.context.source === HOLLOW_BATTLE_SOURCE ? s : null;
  }

  /** A bout the Hollow just started and nobody has shown yet. */
  private fresh(): number {
    const w = this.game()?.world;
    // A pack's bout, or a stray's calm bout (R0281).
    const bout = w?.dungeon?.encounter?.bout ?? w?.dungeon?.strayBout?.bout;
    if (!w || bout === undefined || bout === this.shown || w.battle?.result) return -1;
    return bout === (w.battleRuns ?? 0) ? bout : -1;
  }

  private leave(): void {
    const s = this.bout();
    if (!s || s.result || this.left === this.shown) return;
    this.left = this.shown;
    this.game()?.send({ kind: 'battleForfeit' });
  }

  /** Each frame from the HUD: open on a new bout, redraw on a change. */
  update(): void {
    if (!this.dialog.isOpen()) {
      // The modal's own close button and backdrop hide it without calling close().
      if (this.shown >= 0 && this.bout() && !this.bout()!.result) this.leave();
      const n = this.fresh();
      if (n < 0) return;
      this.shown = n;
      this.picking = false;
      this.waitingOn = null;
      this.drawn = '';
      this.dialog.show();
    }
    const s = this.bout();
    if (!s) {
      this.dialog.hide();
      return;
    }
    const sig = `${s.log.length}:${s.turn}:${s.active}:${s.result ? 1 : 0}`;
    if (this.waitingOn !== null && sig !== this.waitingOn) this.waitingOn = null;
    const view = `${sig}:${this.picking ? 1 : 0}:${this.waitingOn ?? ''}`;
    if (view === this.drawn) return;
    this.drawn = view;
    this.render(s);
  }

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

  private render(s: BattleState): void {
    this.body.innerHTML = '';
    this.body.appendChild(el('p', 'help', BATTLE_TEXT.round(s.turn, s.context.tier)));
    // A champion, elite or boss pack's plate, shape and words (R0155).
    const plate = packPlate(
      this.game(),
      s.context.kind === 'encounter' ? s.context.key : undefined,
    );
    if (plate) this.body.appendChild(el('p', 'hollow-plate', plate));
    const side = (title: string, list: Combatant[]) => {
      this.body.appendChild(el('div', 'btn-name', title));
      const box = el('div', 'battle-side');
      list.forEach((c, i) => box.appendChild(this.row(s, c, i)));
      this.body.appendChild(box);
    };
    side(BATTLE_TEXT.party, s.sides[0]);
    if (this.picking) this.body.appendChild(el('p', 'battle-prompt', BATTLE_TEXT.who));
    side(HOLLOW_TEXT.boutFoes, s.sides[1]);
    const names = new Map([...s.sides[0], ...s.sides[1]].map((c) => [c.id, combatantName(c)]));
    const log = el('div', 'help battle-log');
    for (const l of s.log
      .map((e) => formatEvent(e, (id) => names.get(id) ?? id))
      .filter((x): x is string => x !== null)
      .slice(-3))
      log.appendChild(el('p', undefined, l));
    this.body.appendChild(log);
    const row = el('div', 'battle-moves');
    if (s.result) {
      const w = s.result.winner;
      const text =
        w === 0
          ? HOLLOW_TEXT.boutWon
          : w === 1 && s.result.reason !== 'forfeit'
            ? HOLLOW_TEXT.partyGiggles
            : HOLLOW_TEXT.boutEnded;
      row.appendChild(el('div', 'btn-name', text));
      row.appendChild(
        button(BATTLE_TEXT.done, () => this.dialog.hide(), 'btn btn-small btn-primary'),
      );
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

/** "◆ Champion pack · » Zoomy" for the pack a bout is with, or null for a plain one. */
function packPlate(g: Game | null, key: string | undefined): string | null {
  const f = g ? runFloor(g.world) : null;
  const pack = f?.packs?.find((p) => p.id === key);
  if (!pack || !PLATE_GLYPH[pack.kind]) return null;
  const mods = (pack.members[0]?.mods ?? []).map(
    (m) => `${championMod(m).icon} ${championMod(m).name}`,
  );
  // A named unique (R0156): its name, and a caption of what it does (foes never speak).
  const u = pack.unique ? UNIQUE_TEXT[pack.unique] : undefined;
  if (u) return [`${PLATE_GLYPH.unique} ${u.name}`, ...mods, u.line].join(' · ');
  return [`${PLATE_GLYPH[pack.kind]} ${HOLLOW_TEXT.plate[pack.kind]}`, ...mods].join(' · ');
}
