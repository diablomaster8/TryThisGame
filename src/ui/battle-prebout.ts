import '../battle-r5.css';
import { NAMES, TRAINER_LABELS } from '../config/strings';
import { BATTLE_SCREEN_TEXT, TYPE_WORDS } from '../config/strings-battle';
import { PREBOUT_TEXT as T } from '../config/strings-battle-r5';
import type { Game } from '../game';
import { combatantOf, rivalLevel, typeOf } from '../sim/battle';
import type { BattleContext, BoutDifficulty } from '../sim/battle/types';
import type { Nubbin } from '../sim/types';
import { button, dialogFocus, el } from './dom';
import { nubbinPortrait, PartyPick } from './battle-party-pick';
import { BATTLE } from '../config/tuning-battle';

/**
 * The pre-bout sheet (recs FIGHT-86): the one door into every bout on the battle screen. It
 * shows the objective (icon and words), the rivals' Battle Level, the party (with the party
 * picker behind "Change party"), the mode (Turn or Command) and a difficulty override (Gentle,
 * Normal, Spicy), with a big "Let's play!" at the bottom in the thumb zone. A story bout gets
 * "Skip this bout" while Settings → Bouts says so (FIGHT-71). Back (or Escape) closes it and
 * sends nothing to the sim, so leaving here has no side effects.
 */
export interface PreBoutHandlers {
  play(context: BattleContext): void;
  skip(context: BattleContext): void;
  back(): void;
}

type TurnContext = Exclude<BattleContext, { kind: 'karate' }>;

export class PreBout {
  readonly root: HTMLDivElement;
  private readonly card: HTMLDivElement;
  private readonly body: HTMLDivElement;
  private readonly focus: { opened(): void; closed(): void };
  private readonly pick: PartyPick;
  private context: TurnContext | null = null;
  private handlers: PreBoutHandlers | null = null;
  private mode: 'turn' | 'atb' = 'turn';
  private level: BoutDifficulty = 'normal';

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.root = el('div', 'expedition bs-prebout');
    this.root.hidden = true;
    this.card = el('div', 'bs-prebout-card');
    const head = el('div', 'bs-prebout-head');
    const heading = el('h2', undefined, T.title);
    head.append(
      button(T.back, () => this.back(), 'btn bs-back'),
      heading,
    );
    this.body = el('div', 'bs-prebout-body');
    this.card.append(head, this.body);
    this.root.appendChild(this.card);
    parent.appendChild(this.root);
    this.focus = dialogFocus(this.root, this.card, heading, () => this.back());
    // Made after the sheet, so its dialog sits on top of it.
    this.pick = new PartyPick(parent, game);
  }

  get isOpen(): boolean {
    return !this.root.hidden || this.pick.isOpen();
  }

  open(context: BattleContext, handlers: PreBoutHandlers): void {
    const g = this.game();
    if (!g || context.kind === 'karate') return;
    const ids = context.ids.length ? context.ids : this.defaultParty(g);
    this.context = { ...context, ids };
    this.handlers = handlers;
    this.mode = context.mode === 'atb' ? 'atb' : 'turn';
    const usual = !!g.world.battlePrefs?.gentle || g.world.settings.bouts === 'gentle';
    this.level = context.difficulty ?? (usual || g.world.edu ? 'gentle' : 'normal');
    this.render(g);
    this.root.hidden = false;
    this.focus.opened();
  }

  close(): void {
    this.pick.close();
    if (this.root.hidden) return;
    this.root.hidden = true;
    this.focus.closed();
  }

  /** Back: close and tell the caller, having sent nothing. */
  back(): void {
    const h = this.handlers;
    this.handlers = null;
    this.close();
    h?.back();
  }

  private defaultParty(g: Game): string[] {
    const ready = g.world.nubbins.filter((n) => n.stage !== 'egg' && n.stage !== 'cocoon');
    const last = (g.world.battlePrefs?.party ?? []).filter((id) => ready.some((n) => n.id === id));
    return last.length ? last : ready.slice(0, 1).map((n) => n.id);
  }

  private party(g: Game): Nubbin[] {
    const ids = this.context?.ids ?? [];
    return ids
      .map((id) => g.world.nubbins.find((n) => n.id === id))
      .filter((n): n is Nubbin => !!n && n.stage !== 'egg' && n.stage !== 'cocoon');
  }

  private objective(c: TurnContext): string {
    if (c.kind === 'dojo') return T.objDojo(c.tier);
    if (c.kind === 'story') return T.objStory;
    if (c.kind === 'circuit') {
      const name = TRAINER_LABELS[c.trainer]?.name ?? c.trainer;
      return c.champion ? T.objChampion(name) : T.objCircuit(name);
    }
    return T.objOther;
  }

  private render(g: Game): void {
    const c = this.context;
    if (!c) return;
    const box = this.body;
    box.innerHTML = '';
    const kid = !!g.world.edu;
    // Objective and the rivals' level.
    const obj = el('section', 'bs-pb-sec');
    obj.append(el('h3', undefined, T.objective), el('p', 'bs-pb-obj', this.objective(c)));
    const party = this.party(g);
    if (party.length) {
      const allies = party.map((n) => combatantOf(n, g.world));
      let lv = rivalLevel(allies, c.tier);
      if (c.kind === 'circuit' && c.champion) lv = Math.min(99, lv + BATTLE.circuit.championBonus);
      obj.appendChild(el('p', 'bs-pb-lv', T.recommended(lv)));
    }
    box.appendChild(obj);
    // The party, with the picker behind a button.
    const ps = el('section', 'bs-pb-sec');
    ps.appendChild(el('h3', undefined, T.party));
    const list = el('div', 'bs-pb-party');
    for (const n of party) {
      const t = TYPE_WORDS[typeOf(n)];
      const row = el('div', 'bs-pb-member');
      const lv = combatantOf(n, g.world).level;
      row.append(
        nubbinPortrait(g, n),
        el('span', 'bs-pick-name', n.name),
        el('small', undefined, `${BATTLE_SCREEN_TEXT.battleLevel(lv)} · ${t.icon} ${t.name}`),
      );
      list.appendChild(row);
    }
    ps.append(
      list,
      button(
        T.changeParty,
        () =>
          this.pick.open((ids) => {
            if (!this.context) return;
            this.context = { ...this.context, ids };
            this.render(g);
          }, 3),
        'btn bs-pb-change',
      ),
    );
    box.appendChild(ps);
    // Mode: Command needs its own choices; the Learning Grove keeps turns.
    if (!kid) {
      const ms = el('section', 'bs-pb-sec');
      ms.appendChild(el('h3', undefined, T.mode));
      ms.appendChild(
        this.choiceRow(
          (['turn', 'atb'] as const).map((m) => ({
            id: m,
            label: T.modes[m],
            help: T.modeHelp[m],
          })),
          this.mode,
          (m) => {
            this.mode = m;
            this.render(g);
          },
          T.mode,
        ),
      );
      box.appendChild(ms);
    }
    // Difficulty: kid mode is always gentle.
    const ds = el('section', 'bs-pb-sec');
    ds.appendChild(el('h3', undefined, T.difficulty));
    if (kid) ds.appendChild(el('p', 'help', T.kidMode));
    else
      ds.appendChild(
        this.choiceRow(
          (['gentle', 'normal', 'spicy'] as const).map((d) => ({
            id: d,
            label: T.levels[d],
            help: T.levelHelp[d],
          })),
          this.level,
          (d) => {
            this.level = d;
            this.render(g);
          },
          T.difficulty,
        ),
      );
    box.appendChild(ds);
    const foot = el('div', 'bs-pb-foot');
    if (c.kind === 'story' && g.world.settings.bouts === 'skip') {
      const skip = button(T.skip, () => this.go(true), 'btn bs-pb-skip');
      skip.title = T.skipHelp;
      foot.append(skip, el('small', 'help', T.skipHelp));
    }
    const play = button(T.play, () => this.go(false), 'btn btn-primary bs-pb-play');
    play.disabled = party.length === 0;
    if (!party.length) play.title = BATTLE_SCREEN_TEXT.partyNone;
    foot.appendChild(play);
    box.appendChild(foot);
  }

  private choiceRow<K extends string>(
    items: { id: K; label: string; help: string }[],
    now: K,
    set: (k: K) => void,
    label: string,
  ): HTMLDivElement {
    const row = el('div', 'bs-pb-choices');
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', label);
    for (const it of items) {
      const b = button('', () => set(it.id), 'btn bs-pb-choice');
      b.append(el('strong', undefined, it.label), el('small', undefined, it.help));
      b.setAttribute('aria-pressed', it.id === now ? 'true' : 'false');
      row.appendChild(b);
    }
    return row;
  }

  private go(skip: boolean): void {
    const c = this.context;
    const h = this.handlers;
    const g = this.game();
    if (!c || !h || !g) return;
    const kid = !!g.world.edu;
    const out: BattleContext = {
      ...c,
      ...(this.mode === 'atb' && !kid ? { mode: 'atb' as const } : {}),
      difficulty: kid ? 'gentle' : this.level,
    };
    if (this.mode !== 'atb' || kid) delete out.mode;
    this.handlers = null;
    this.close();
    if (skip) h.skip(out);
    else h.play(out);
  }

  /** After a skipped bout: a short note with the Shells it paid, then back to the Grove. */
  showSkipped(shells: number, done: () => void): void {
    const box = this.body;
    box.innerHTML = '';
    box.appendChild(el('p', 'bs-pb-obj', T.skipped(shells, NAMES.currency)));
    this.handlers = { play: () => undefined, skip: () => undefined, back: done };
    const ok = button(
      BATTLE_SCREEN_TEXT.backToGrove,
      () => this.back(),
      'btn btn-primary bs-pb-play',
    );
    box.appendChild(ok);
    this.root.hidden = false;
    this.focus.opened();
    ok.focus();
  }
}
