import '../battle.css';
import { TRAINER_LABELS, UI_TEXT } from '../config/strings';
import { BATTLE_SCREEN_TEXT as T } from '../config/strings-battle';
import { BATTLE } from '../config/tuning-battle';
import type { Game } from '../game';
import {
  CIRCUIT_TIERS,
  circuitOf,
  circuitOpen,
  circuitTier,
  type BattleContext,
} from '../sim/battle';
import type { Nubbin } from '../sim/types';
import { battleScreen, type BattleScreen } from './battle-screen';
import { FRIENDLY_TEXT, LADDER_TEXT } from '../config/strings-battle-r6';
import { BATTLE_R6 } from '../config/tuning-battle-r6';
import { ladderBelt, ladderContext, ladderOf } from '../sim/battle/ladder';
import { PartyPick } from './battle-party-pick';
import { button, el, modal } from './dom';

/**
 * The dojo (recs FIGHT-28) and the Grove Circuit (FIGHT-22). Dojo bouts are turn-based singles
 * in three tiers, each won tier earning its belt; Bonk asks for a tap on the old timing bar, a
 * "Power swing". The Circuit lists the ten Keepers tier by tier with a ribbon slot each (icon and
 * name), and the Champion rematches once all ten are won. Every bout picks a party of up to
 * three on the party sheet and plays on the one battle screen. "Gentle bouts" turns kid mode on
 * for anyone (always on in the Learning Grove).
 */
export class DojoMenu {
  private readonly dialog;
  private readonly list: HTMLDivElement;
  readonly screen: BattleScreen;
  private readonly pick: PartyPick;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
    private readonly fighterPick: () => Nubbin | null,
  ) {
    this.dialog = modal(parent, T.dojoTitle, UI_TEXT.close);
    this.dialog.root.classList.add('bs-dojo');
    this.list = el('div', 'shop-list');
    this.dialog.body.append(el('p', 'help', T.dojoHelp), this.list);
    this.screen = battleScreen(parent, game);
    this.pick = new PartyPick(parent, game);
  }

  open(): void {
    this.refresh();
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
    this.pick.close();
  }

  isOpen(): boolean {
    return this.dialog.isOpen() || this.pick.isOpen();
  }

  private refresh(): void {
    const g = this.game();
    if (!g) return;
    const w = g.world;
    this.list.innerHTML = '';
    this.list.appendChild(el('div', 'btn-name', UI_TEXT.belt(w.karate.belt)));
    const tiers = el('div', 'bs-tiers');
    for (let tier = 1; tier <= BATTLE.karate.tiers; tier++) {
      const b = button(
        UI_TEXT.tierLabel(tier),
        () => this.fight({ kind: 'dojo', tier, ids: [] }),
        'btn bs-tier',
      );
      b.disabled = tier > w.karate.belt + 1;
      if (tier <= w.karate.belt) b.classList.add('active');
      tiers.appendChild(b);
    }
    this.list.append(
      el('small', undefined, `${w.karate.wins} wins · ${w.karate.losses} losses`),
      tiers,
    );
    const gentle = !!w.battlePrefs?.gentle || !!w.edu;
    const gb = button(
      `${gentle ? '☑' : '☐'} ${T.gentle}`,
      () => this.toggleGentle(),
      'btn bs-tier',
    );
    gb.title = T.gentleHelp;
    gb.disabled = !!w.edu;
    gb.setAttribute('aria-pressed', gentle ? 'true' : 'false');
    this.list.appendChild(gb);
    this.ladder(g);
    this.friendly(g);
    this.circuit(g);
  }

  /** The Dojo Ladder (recs FIGHT-99) for the selected Nubbin: its belt and its next bout. */
  private ladder(g: Game): void {
    const n =
      this.fighterPick() ?? g.world.nubbins.find((x) => x.stage !== 'egg' && x.stage !== 'cocoon');
    if (!n || n.stage === 'egg' || n.stage === 'cocoon') return;
    const belt = ladderBelt(n);
    this.list.appendChild(
      el('div', 'btn-name', `${LADDER_TEXT.title} · ${n.name}: ${LADDER_TEXT.belt(belt)}`),
    );
    const next = ladderContext(n);
    if (!next) {
      this.list.appendChild(el('small', undefined, LADDER_TEXT.top));
      return;
    }
    const name = LADDER_TEXT.belts[(next.ladder ?? 1) - 1] ?? '';
    const b = button(
      LADDER_TEXT.bout(name, ladderOf(n).step + 1, BATTLE_R6.ladder.bouts),
      () => this.fight(next),
      'btn bs-tier',
    );
    this.list.appendChild(b);
  }

  /** Pass-and-play (FIGHT-96): the slot split in two, or Keeper 2's share codes. */
  private friendly(g: Game): void {
    this.list.appendChild(el('div', 'btn-name', FRIENDLY_TEXT.title));
    this.list.appendChild(el('p', 'help', FRIENDLY_TEXT.help));
    const codes = el('textarea');
    codes.rows = 2;
    codes.placeholder = FRIENDLY_TEXT.codes;
    codes.setAttribute('aria-label', FRIENDLY_TEXT.codes);
    const go = button(
      FRIENDLY_TEXT.start,
      () => {
        const hatched = g.world.nubbins
          .filter((n) => n.stage !== 'egg' && n.stage !== 'cocoon')
          .map((n) => n.id);
        const guests = codes.value.split(/\s+/).filter(Boolean).slice(0, 3);
        const half = guests.length ? Math.min(3, hatched.length) : Math.ceil(hatched.length / 2);
        const ids = hatched.slice(0, Math.min(3, half));
        const foeIds = guests.length ? [] : hatched.slice(half, half + 3);
        if (!ids.length || (!foeIds.length && !guests.length)) {
          this.toast(FRIENDLY_TEXT.none);
          return;
        }
        this.fight({ kind: 'friendly', tier: 1, ids, foeIds, guests });
      },
      'btn bs-tier',
    );
    this.list.append(codes, go);
  }

  private circuit(g: Game): void {
    const w = g.world;
    const won = circuitOf(w);
    this.list.appendChild(el('div', 'btn-name', `${T.circuit} · ${T.ribbons(won.ribbons.length)}`));
    this.list.appendChild(el('p', 'help', T.circuitHelp));
    const slots = el('div', 'bs-ribbons');
    for (const id of CIRCUIT_TIERS.flat()) {
      const has = won.ribbons.includes(id);
      const name = TRAINER_LABELS[id]?.name ?? id;
      const mirror = w.trainer === id ? ` (${T.mirror})` : '';
      const open = circuitOpen(w, id);
      const b = button(
        '',
        () => this.fight({ kind: 'circuit', trainer: id, tier: circuitTier(id), ids: [] }),
        'btn bs-ribbon',
      );
      b.append(
        el('span', 'bs-ribbon-icon', has ? T.ribbon : T.noRibbon),
        el('span', undefined, `${name}${mirror}`),
      );
      b.disabled = !open;
      b.setAttribute('aria-label', `${name}${mirror}: ${has ? T.ribbon : T.noRibbon}`);
      slots.appendChild(b);
    }
    this.list.appendChild(slots);
    if (CIRCUIT_TIERS.flat().every((id) => won.ribbons.includes(id))) {
      const champs = el('div', 'bs-ribbons');
      for (const id of CIRCUIT_TIERS.flat()) {
        const name = TRAINER_LABELS[id]?.name ?? id;
        const b = button(
          `${won.champion.includes(id) ? '🏆' : '○'} ${T.champion}: ${name}`,
          () => this.fight({ kind: 'circuit', trainer: id, champion: true, tier: 3, ids: [] }),
          'btn bs-ribbon',
        );
        champs.appendChild(b);
      }
      this.list.appendChild(champs);
    }
  }

  private toggleGentle(): void {
    const g = this.game();
    if (!g) return;
    g.send({ kind: 'battlePrefs', prefs: { gentle: !g.world.battlePrefs?.gentle } });
    // The command lands on the next step; draw the switch as it will be.
    setTimeout(() => this.refresh(), 150);
  }

  /** Pick the party, then fight. */
  private fight(context: BattleContext): void {
    const g = this.game();
    if (!g) return;
    if (!g.world.nubbins.some((n) => n.stage !== 'egg' && n.stage !== 'cocoon')) {
      this.toast(UI_TEXT.expeditionNeedsNubbin);
      return;
    }
    this.dialog.hide();
    if (context.kind === 'karate' || context.kind === 'encounter') return;
    // The pre-bout sheet (FIGHT-86) picks the party now; Back there returns to this menu.
    // A ladder bout is the picked Nubbin's own; every other bout picks its party on the sheet.
    const ids =
      (context.kind === 'dojo' && context.ladder) || context.kind === 'friendly' ? context.ids : [];
    this.screen.start({ ...context, ids }, (s) => (s ? this.refreshLater() : this.open()));
  }

  private refreshLater(): void {
    setTimeout(() => this.isOpen() && this.refresh(), 200);
  }
}
