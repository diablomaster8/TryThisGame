import '../battle.css';
import {
  BATTLE_MOVE_TEXT,
  BOUT_TEXT_SHEET,
  moveName,
  TRAIT_HALF,
  TRAIT_TEXT,
} from '../config/strings-battle';
import type { Game } from '../game';
import { combatLevels, deriveStats, moveOf, peekBattle, statMult, traitsOf } from '../sim/battle';
import type { Nubbin } from '../sim/types';
import { button, el } from './dom';

/**
 * The stats sheet's Bout card: the derived battle stats, each with an icon and a label (recs
 * FIGHT-10), the grade traits (FIGHT-12) and the four move slots with the known moves below
 * them (FIGHT-17). Tap a slot, then a known move, to swap it in; tap the slot again to empty
 * it. The card only reads the sim and sends `battleSlots`.
 */
export class BattleCard {
  readonly root: HTMLDivElement;
  private picked: number | null = null;
  private drawn = '';

  constructor(private readonly game: () => Game | null) {
    this.root = el('div', 'bout-card');
  }

  refresh(n: Nubbin): void {
    const g = this.game();
    if (!g) return;
    const b = peekBattle(n);
    const sig = `${n.id}:${b.slots.join(',')}:${b.known.length}:${b.wins}:${b.losses}:${this.picked}:${n.stage}`;
    const st = deriveStats(combatLevels(n, g.world), statMult(n));
    const full = `${sig}:${st.hp}:${st.bonk}:${st.splash}:${st.zip}`;
    if (full === this.drawn) return;
    this.drawn = full;
    this.root.innerHTML = '';
    this.root.hidden = n.stage === 'egg';
    const T = BOUT_TEXT_SHEET;
    this.root.appendChild(el('div', 'btn-name', `⚔ ${T.title} · ${T.level} ${st.level}`));
    const row = el('div', 'bout-stats');
    const cell = (icon: string, label: string, v: string): void => {
      const c = el('span', 'bout-stat', `${icon} ${label} ${v}`);
      row.appendChild(c);
    };
    cell('❤', T.hp, String(st.hp));
    cell('👊', T.bonk, String(Math.round(st.bonk)));
    cell('💧', T.splash, String(Math.round(st.splash)));
    cell('🛡', T.guard, String(Math.round(st.def)));
    cell('💨', T.zip, String(Math.round(st.zip)));
    cell('🪶', T.flutter, `${Math.round(st.flutter * 100)}%`);
    cell('●', T.puff, String(st.puffMax));
    this.root.appendChild(row);

    const traits = traitsOf(n);
    this.root.appendChild(
      el(
        'p',
        'help',
        traits.length
          ? `${T.traits}: ${traits
              .map((t) => (t.full ? TRAIT_TEXT[t.id].name : TRAIT_HALF(TRAIT_TEXT[t.id].name)))
              .join(', ')}`
          : T.noTraits,
      ),
    );

    this.root.appendChild(el('div', 'btn-name', T.slots));
    const slots = el('div', 'bout-slots');
    b.slots.forEach((id, i) => {
      const label = id ? moveName(id) : T.empty;
      const tile = button(label, () => this.pickSlot(n, i), 'btn bout-slot');
      if (this.picked === i) tile.classList.add('picked');
      if (id) tile.title = BATTLE_MOVE_TEXT[id]?.blurb ?? '';
      if (id) tile.appendChild(el('small', undefined, costOf(id)));
      slots.appendChild(tile);
    });
    this.root.appendChild(slots);
    this.root.appendChild(el('p', 'help', T.pick));
    const known = el('div', 'bout-known');
    for (const id of b.known) {
      const chip = button(moveName(id), () => this.place(n, id), 'btn btn-small bout-chip');
      chip.title = BATTLE_MOVE_TEXT[id]?.blurb ?? '';
      chip.disabled = this.picked === null || b.slots.includes(id);
      known.appendChild(chip);
    }
    this.root.appendChild(known);
    this.root.appendChild(el('p', 'help', T.record(b.wins, b.losses)));
  }

  private pickSlot(n: Nubbin, i: number): void {
    const b = peekBattle(n);
    if (this.picked === i && b.slots[i]) {
      // A second tap empties the slot, as long as one move stays.
      const next = [...b.slots];
      next[i] = null;
      this.send(n, next);
      this.picked = null;
    } else this.picked = i;
    this.drawn = '';
    this.refresh(n);
  }

  private place(n: Nubbin, id: string): void {
    if (this.picked === null) return;
    const next = [...peekBattle(n).slots];
    next[this.picked] = id;
    this.send(n, next);
    this.picked = null;
    this.drawn = '';
  }

  private send(n: Nubbin, slots: (string | null)[]): void {
    this.game()?.send({ kind: 'battleSlots', nubbinId: n.id, slots });
  }
}

const costOf = (id: string): string => {
  const p = moveOf(id).puff;
  return p === 0 ? '' : '●'.repeat(p);
};
