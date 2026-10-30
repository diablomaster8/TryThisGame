import { NAMES, SPECIES_LABELS, TEN_TEXT, TRAINER_LABELS, UI_TEXT } from '../config/strings';
import { MOVE_TEXT } from '../config/strings-move';
import { PLOTS, TOWN } from '../config/tuning';
import { canMerge } from '../sim/partners';
import { canBuySkill, SKILL_LIST } from '../sim/skills';
import { TEAM_LIST, teamBoard } from '../sim/teams';
import { townUnlocks } from '../sim/town';
import type { Game } from '../game';
import { ACHIEVEMENT_LIST, titlesEarned } from '../sim/achievements';
import { visitingTrainer } from '../sim/neighbourhood';
import { keeperPerks } from '../sim/perks';
import { rosterCap } from '../sim/roster';
import { TRAINERS } from '../sim/trainers';
import type { Quest } from '../sim/types';
import { button, el, modal } from './dom';
import { ACHIEVEMENT_TEXT, BADGE_FILTER_TEXT } from '../config/strings-badges';
import '../fun.css';

/**
 * The smaller garden panels: the request board, the Keeper profile, the neighbourhood
 * and the map. Each is a modal that rebuilds its body on open and on refresh.
 */
function questLabel(q: Quest): string {
  const make = (UI_TEXT.questText as Record<string, (n: number, p: string) => string>)[q.template];
  const param = q.param ? (SPECIES_LABELS[q.param] ?? q.param) : '';
  return make ? make(q.target, param) : q.template;
}

function fromLabel(from: string, game: Game): string {
  const t = TRAINER_LABELS[from]?.name;
  if (t) return t;
  return game.world.nubbins.find((n) => n.name === from)?.name ?? from;
}

export class QuestBoard {
  private readonly dialog;
  private readonly list: HTMLDivElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, UI_TEXT.quests, UI_TEXT.close);
    this.dialog.body.appendChild(el('p', 'help', UI_TEXT.questsHelp));
    this.list = el('div', 'shop-list');
    this.dialog.body.appendChild(this.list);
  }

  open(): void {
    this.refresh();
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  refresh(): void {
    const g = this.game();
    if (!g) return;
    this.list.innerHTML = '';
    if (g.world.quests.length === 0) this.list.appendChild(el('span', 'help', UI_TEXT.noQuests));
    for (const q of g.world.quests) {
      const row = el('div', 'shop-row');
      const text = el('div');
      const done = q.progress >= q.target;
      text.append(
        el('strong', undefined, questLabel(q)),
        el(
          'small',
          undefined,
          `${UI_TEXT.questFrom(fromLabel(q.from, g))} · ${Math.min(q.progress, q.target)}/${q.target} · ${q.rewardShells} ${NAMES.currency}${q.rewardEgg ? ' + 🥚' : ''}`,
        ),
      );
      const claim = button(
        q.claimed ? '✓' : UI_TEXT.claim,
        () => {
          g.send({ kind: 'claimQuest', id: q.id });
          setTimeout(() => this.refresh(), 150);
        },
        'btn btn-small btn-primary',
      );
      claim.disabled = q.claimed || !done;
      row.append(text, claim);
      this.list.appendChild(row);
    }
  }
}

export class ProfilePanel {
  private readonly dialog;
  private readonly body: HTMLDivElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, UI_TEXT.profile, UI_TEXT.close);
    this.dialog.body.appendChild(el('p', 'help', UI_TEXT.profileHelp));
    this.body = el('div');
    this.dialog.body.appendChild(this.body);
  }

  open(): void {
    this.refresh();
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  refresh(): void {
    const g = this.game();
    if (!g) return;
    const w = g.world;
    this.body.innerHTML = '';
    // Title.
    const titleRow = el('label', 'field-row');
    const sel = el('select');
    const none = el('option', undefined, UI_TEXT.noTitle);
    none.value = '';
    sel.appendChild(none);
    for (const t of titlesEarned(w)) {
      const o = el('option', undefined, t);
      o.value = t;
      sel.appendChild(o);
    }
    sel.value = w.title ?? '';
    sel.addEventListener('change', () => {
      g.send({ kind: 'setTitle', title: sel.value || null });
    });
    titleRow.append(el('strong', undefined, UI_TEXT.titleLabel), sel);
    this.body.appendChild(titleRow);
    // Plots.
    const plots = el('div', 'shop-row');
    const ptext = el('div');
    ptext.append(el('strong', undefined, UI_TEXT.plotsLabel(w.plots, rosterCap(w))));
    const buy = button(
      UI_TEXT.buyPlot(PLOTS.price),
      () => {
        g.send({ kind: 'buyPlot' });
        setTimeout(() => this.refresh(), 150);
      },
      'btn btn-small btn-primary',
    );
    buy.disabled = w.plots >= PLOTS.max || w.inventory.shells < PLOTS.price;
    plots.append(ptext, buy);
    this.body.appendChild(plots);
    // Perks.
    const perks = keeperPerks(w);
    this.body.appendChild(el('h3', undefined, UI_TEXT.perksLabel));
    const perkList = el('div', 'shop-list');
    const rows: Array<[boolean, string, string | undefined]> = [
      [perks.wade, UI_TEXT.perkNames.wade, perks.from.swim],
      // MOVE-27: the Fly perk is a hold-to-glide now.
      [perks.glide, MOVE_TEXT.glidePerk, perks.from.fly],
      [perks.power, UI_TEXT.perkNames.power, perks.from.power],
      [perks.sprint, UI_TEXT.perkNames.sprint, perks.from.run],
    ];
    let any = false;
    for (const [on, label, from] of rows) {
      if (!on) continue;
      any = true;
      const r = el('div', 'shop-row');
      const t = el('div');
      t.append(
        el('strong', undefined, label),
        el('small', undefined, UI_TEXT.perkFrom(from ?? '')),
      );
      r.appendChild(t);
      perkList.appendChild(r);
    }
    if (!any) perkList.appendChild(el('span', 'help', UI_TEXT.noPerks));
    this.body.appendChild(perkList);
    this.square(g);
    this.partnersSection(g);
    this.skillsSection(g);
    this.teamSection(g);
    // Badges.
    this.body.appendChild(el('h3', undefined, UI_TEXT.badges));
    const badges = el('div', 'badge-grid');
    for (const a of ACHIEVEMENT_LIST) {
      const got = w.achievements[a.id] !== undefined;
      const b = el('div', `badge${got ? ' badge-got' : ''}`, got ? `🏅 ${a.title}` : '· · ·');
      b.title = a.title;
      // R0315: the blurb once earned, and a mark for the Silly filter.
      if (got) b.title = `${a.title}: ${ACHIEVEMENT_TEXT[a.id]?.blurb ?? ''}`;
      if (a.silly) b.dataset.silly = '1';
      badges.appendChild(b);
    }
    this.body.appendChild(badges);
    // R0315: show only the joke badges.
    const silly = button(
      BADGE_FILTER_TEXT.silly,
      () => {
        const on = badges.classList.toggle('silly-only');
        silly.textContent = on ? BADGE_FILTER_TEXT.all : BADGE_FILTER_TEXT.silly;
        silly.setAttribute('aria-pressed', String(on));
      },
      'btn btn-small badge-filter',
    );
    silly.setAttribute('aria-pressed', 'false');
    badges.before(silly);
  }

  private square(g: Game): void {
    const w = g.world;
    this.body.appendChild(el('h3', undefined, TEN_TEXT.square));
    this.body.appendChild(el('p', 'help', TEN_TEXT.squareHelp));
    this.body.appendChild(el('div', 'shop-note', TEN_TEXT.prosperity(w.town.prosperity, TOWN.max)));
    const bar = el('div', 'meter-bar');
    const fill = el('div');
    fill.style.width = `${Math.round((w.town.prosperity / TOWN.max) * 100)}%`;
    bar.appendChild(fill);
    this.body.appendChild(bar);
    const unlocks = townUnlocks(w);
    const list = el('div', 'badge-grid');
    for (const [key, label] of Object.entries(TEN_TEXT.unlockNames)) {
      const on = unlocks[key as keyof typeof unlocks];
      list.appendChild(el('div', `badge${on ? ' badge-got' : ''}`, `${on ? '✓ ' : ''}${label}`));
    }
    this.body.appendChild(list);
    this.body.appendChild(el('h3', undefined, TEN_TEXT.recruitsLabel));
    if (w.town.recruits.length === 0) this.body.appendChild(el('p', 'help', TEN_TEXT.noRecruits));
    const rec = el('div', 'shop-list');
    for (const r of w.town.recruits) {
      const row = el('div', 'shop-row');
      const t = el('div');
      t.append(
        el('strong', undefined, r.name),
        el(
          'small',
          undefined,
          `${SPECIES_LABELS[r.species] ?? r.species} · ${TEN_TEXT.roleNames[r.role] ?? r.role}`,
        ),
      );
      row.appendChild(t);
      rec.appendChild(row);
    }
    this.body.appendChild(rec);
  }

  private partnersSection(g: Game): void {
    const w = g.world;
    this.body.appendChild(el('h3', undefined, TEN_TEXT.partners));
    this.body.appendChild(el('p', 'help', TEN_TEXT.partnersHelp));
    for (const slot of [0, 1] as const) {
      const row = el('label', 'field-row');
      const sel = el('select');
      const none = el('option', undefined, TEN_TEXT.noPartner);
      none.value = '';
      sel.appendChild(none);
      for (const n of w.nubbins) {
        if (n.stage === 'egg') continue;
        const o = el('option', undefined, n.name);
        o.value = n.id;
        sel.appendChild(o);
      }
      sel.value = w.partners[slot] ?? '';
      sel.addEventListener('change', () => {
        g.send({ kind: 'setPartner', slot, nubbinId: sel.value || null });
        setTimeout(() => this.refresh(), 100);
      });
      row.append(el('strong', undefined, TEN_TEXT.partnerSlot(slot)), sel);
      this.body.appendChild(row);
    }
    const why = canMerge(w);
    const mergeRow = el('div', 'shop-row');
    const text = el('div');
    text.append(
      el('strong', undefined, TEN_TEXT.twineCount(w.inventory.twine)),
      el('small', undefined, why ? (TEN_TEXT.mergeWhy[why] ?? why) : ''),
    );
    const b = button(
      TEN_TEXT.mergeBtn,
      () => {
        g.send({ kind: 'merge' });
        setTimeout(() => this.refresh(), 100);
      },
      'btn btn-small btn-primary',
    );
    b.disabled = why !== null;
    mergeRow.append(text, b);
    this.body.appendChild(mergeRow);
  }

  private skillsSection(g: Game): void {
    const w = g.world;
    this.body.appendChild(el('h3', undefined, TEN_TEXT.skills));
    this.body.appendChild(el('p', 'help', TEN_TEXT.skillsHelp));
    this.body.appendChild(el('div', 'shop-note', TEN_TEXT.skillPoints(w.skillPoints)));
    for (const branch of ['care', 'garden', 'games', 'story'] as const) {
      this.body.appendChild(el('div', 'shop-note', TEN_TEXT.branchNames[branch] ?? branch));
      const grid = el('div', 'skill-grid');
      for (const s of SKILL_LIST.filter((x) => x.branch === branch)) {
        const why = canBuySkill(w, s.id);
        const owned = why === 'owned';
        const b = button(
          '',
          () => {
            g.send({ kind: 'buySkill', id: s.id });
            setTimeout(() => this.refresh(), 100);
          },
          `btn skill${owned ? ' owned' : why === 'locked' ? ' locked' : ''}`,
        );
        b.append(
          el('strong', undefined, s.name),
          el(
            'small',
            undefined,
            `${s.blurb} · ${owned ? TEN_TEXT.owned : TEN_TEXT.skillCost(s.cost)}`,
          ),
        );
        b.disabled = why !== null;
        grid.appendChild(b);
      }
      this.body.appendChild(grid);
    }
  }

  private teamSection(g: Game): void {
    const w = g.world;
    this.body.appendChild(el('h3', undefined, TEN_TEXT.team));
    this.body.appendChild(el('p', 'help', TEN_TEXT.teamHelp));
    if (!w.team) {
      const row = el('div', 'settings-actions');
      for (const t of TEAM_LIST) {
        row.appendChild(
          button(
            TEN_TEXT.joinTeam(TEN_TEXT.teamNames[t.id] ?? t.id, t.leader),
            () => {
              g.send({ kind: 'joinTeam', team: t.id });
              setTimeout(() => this.refresh(), 100);
            },
            'btn btn-small',
          ),
        );
      }
      this.body.appendChild(row);
      return;
    }
    const t = w.team;
    this.body.appendChild(
      el(
        'div',
        'shop-note',
        `${TEN_TEXT.teamNames[t.id] ?? t.id} · ${TEN_TEXT.rankLabel(t.rank, t.points)}`,
      ),
    );
    const m = t.mission;
    if (m) {
      const text = TEN_TEXT.missionText[m.kind]?.(m.target) ?? m.kind;
      this.body.appendChild(
        el(
          'div',
          'shop-row',
          `${TEN_TEXT.mission}: ${text} · ${Math.min(m.progress, m.target)}/${m.target}${m.done ? ' ✓' : ''}`,
        ),
      );
    }
    this.body.appendChild(el('div', 'shop-note', TEN_TEXT.board));
    const board = el('div', 'shop-list');
    for (const row of teamBoard(w)) {
      const r = el('div', `shop-row${row.you ? ' active' : ''}`);
      r.append(
        el('strong', undefined, row.name),
        el('small', undefined, `${TEN_TEXT.teamNames[row.team] ?? row.team} · ${row.points}`),
      );
      board.appendChild(r);
    }
    this.body.appendChild(board);
  }
}

export class NeighbourhoodPanel {
  private readonly dialog;
  private readonly list: HTMLDivElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.dialog = modal(parent, UI_TEXT.neighbourhood, UI_TEXT.close);
    this.dialog.body.appendChild(el('p', 'help', UI_TEXT.neighbourhoodHelp));
    this.list = el('div', 'shop-list');
    this.dialog.body.appendChild(this.list);
  }

  open(): void {
    this.refresh();
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  refresh(): void {
    const g = this.game();
    if (!g) return;
    const w = g.world;
    this.list.innerHTML = '';
    const here = visitingTrainer(w);
    if (here) {
      const row = el('div', 'shop-row');
      row.append(
        el('strong', undefined, UI_TEXT.visitingNow(TRAINER_LABELS[here]?.name ?? here)),
        button(
          UI_TEXT.giftBtn,
          () => g.send({ kind: 'neighbourGift' }),
          'btn btn-small btn-primary',
        ),
        button(
          UI_TEXT.goHome,
          () => {
            g.send({ kind: 'visit', trainer: null });
            this.close();
          },
          'btn btn-small',
        ),
      );
      this.list.appendChild(row);
    }
    for (const t of TRAINERS) {
      if (t.id === w.trainer) continue;
      const row = el('div', 'shop-row');
      const text = el('div');
      const label = TRAINER_LABELS[t.id];
      text.append(
        el('strong', undefined, label?.name ?? t.id),
        el('small', undefined, label?.blurb ?? ''),
      );
      const go = button(
        UI_TEXT.visitBtn,
        () => {
          if (w.location !== 'grove' && !here) {
            this.toast(UI_TEXT.notFromHere);
            return;
          }
          g.send({ kind: 'visit', trainer: t.id });
          this.close();
        },
        'btn btn-small btn-primary',
      );
      go.disabled = here === t.id;
      row.append(text, go);
      this.list.appendChild(row);
    }
  }
}

/** The drawn map (WORLD-02) lives in its own file; the HUD still imports it from here. */
export { WorldMapPanel as MapPanel } from './world-map';
