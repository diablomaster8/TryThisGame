import { NAMES, SPECIES_LABELS, TRAINER_LABELS, UI_TEXT } from '../config/strings';
import { PLOTS } from '../config/tuning';
import type { Game } from '../game';
import { ACHIEVEMENT_LIST, titlesEarned } from '../sim/achievements';
import { landmarkList } from '../sim/landmarks';
import { visitingTrainer } from '../sim/neighbourhood';
import { keeperPerks } from '../sim/perks';
import { rosterCap } from '../sim/roster';
import { TRAINERS } from '../sim/trainers';
import type { Quest } from '../sim/types';
import { button, el, modal } from './dom';

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
      [perks.glide, UI_TEXT.perkNames.glide, perks.from.fly],
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
    // Badges.
    this.body.appendChild(el('h3', undefined, UI_TEXT.badges));
    const badges = el('div', 'badge-grid');
    for (const a of ACHIEVEMENT_LIST) {
      const got = w.achievements[a.id] !== undefined;
      const b = el('div', `badge${got ? ' badge-got' : ''}`, got ? `🏅 ${a.title}` : '· · ·');
      b.title = a.title;
      badges.appendChild(b);
    }
    this.body.appendChild(badges);
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

export class MapPanel {
  private readonly dialog;
  private readonly list: HTMLDivElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.dialog = modal(parent, UI_TEXT.map, UI_TEXT.close);
    this.dialog.body.appendChild(el('p', 'help', UI_TEXT.mapHelp));
    this.list = el('div', 'map-grid');
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
    const names = UI_TEXT.landmarkNames as Record<string, string>;
    for (const l of landmarkList()) {
      const found = w.landmarks[l.id] !== undefined;
      const b = button(
        found ? `📍 ${names[l.id] ?? l.id}` : '?',
        () => {
          if (w.location !== 'grove') {
            this.toast(UI_TEXT.notFromHere);
            return;
          }
          g.send({ kind: 'teleport', pos: { x: l.x, z: l.z } });
          this.toast(UI_TEXT.travelled);
          this.close();
        },
        `btn btn-small${found ? ' btn-primary' : ''}`,
      );
      b.disabled = !found;
      // Lay the buttons out roughly where the spots are.
      b.style.gridColumn = String(Math.round(((l.x + 24) / 48) * 5) + 1);
      b.style.gridRow = String(Math.round(((l.z + 24) / 48) * 5) + 1);
      this.list.appendChild(b);
    }
  }
}
