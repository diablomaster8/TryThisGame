import {
  CRITTER_LABELS,
  ESSENCE_LABELS,
  formatDuration,
  NAMES,
  SPECIES_LABELS,
  STAGE_LABELS,
  STAT_ICONS,
  STAT_LABELS,
  TYPE_LABELS,
  UI_TEXT,
} from '../config/strings';
import { bandOf, childHint } from '../sim/alignment';
import { levelOf } from '../sim/stats';
import { STAT_KEYS, type Nubbin, type NubbinType, type World } from '../sim/types';
import type { Game } from '../game';
import { button, el, meter } from './dom';

/**
 * The stats sheet: opens when a Nubbin is tapped. Shows needs as meters with icon and
 * label (never colour alone), the five stats with grades, and the care actions.
 */
export class StatsSheet {
  readonly root: HTMLDivElement;
  private id: string | null = null;
  private readonly name: HTMLButtonElement;
  private readonly subtitle: HTMLDivElement;
  private readonly meters: Record<
    'hunger' | 'energy' | 'happiness' | 'affection',
    ReturnType<typeof meter>
  >;
  private readonly statRows = new Map<string, HTMLSpanElement>();
  private readonly actions: HTMLDivElement;
  private readonly petBtn: HTMLButtonElement;
  private readonly carryBtn: HTMLButtonElement;
  private readonly feedBtn: HTMLButtonElement;
  private readonly shakeBtn: HTMLButtonElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.root = el('div', 'sheet');
    this.root.hidden = true;

    const head = el('div', 'sheet-head');
    this.name = button('', () => this.rename(), 'btn btn-name');
    this.name.title = UI_TEXT.rename;
    this.subtitle = el('div', 'sheet-sub');
    const close = button('×', () => this.close(), 'btn btn-close');
    close.setAttribute('aria-label', UI_TEXT.close);
    head.append(this.name, this.subtitle, close);

    const needs = el('div', 'sheet-needs');
    this.meters = {
      hunger: meter(UI_TEXT.hunger, '🍎'),
      energy: meter(UI_TEXT.energy, '⚡'),
      happiness: meter(UI_TEXT.happiness, '☺'),
      affection: meter(UI_TEXT.affection, '♥'),
    };
    for (const m of Object.values(this.meters)) needs.appendChild(m.root);

    const stats = el('div', 'sheet-stats');
    for (const key of STAT_KEYS) {
      const row = el('div', 'stat-row');
      row.append(
        el('span', 'stat-icon', STAT_ICONS[key]),
        el('span', 'stat-label', STAT_LABELS[key]),
      );
      const value = el('span', 'stat-value', '');
      row.appendChild(value);
      this.statRows.set(key, value);
      stats.appendChild(row);
    }

    this.actions = el('div', 'sheet-actions');
    this.petBtn = button(UI_TEXT.pet, () => this.act('pet'));
    this.carryBtn = button(UI_TEXT.pickUp, () => this.act('carry'));
    this.feedBtn = button(UI_TEXT.feed, () => this.act('feed'));
    this.shakeBtn = button(UI_TEXT.shake, () => this.act('shake'));
    this.actions.append(this.petBtn, this.carryBtn, this.feedBtn, this.shakeBtn);

    this.give = el('div', 'sheet-give');
    this.giveTitle = el('div', 'sheet-give-title', UI_TEXT.give);
    this.giveList = el('div', 'sheet-give-list');
    this.give.append(this.giveTitle, this.giveList);

    this.root.append(head, needs, stats, this.actions, this.give);
    parent.appendChild(this.root);
  }

  private readonly give: HTMLDivElement;
  private readonly giveTitle: HTMLDivElement;
  private readonly giveList: HTMLDivElement;
  private giveKey = '';

  /** Rebuild the Critter / Essence buttons only when the inventory changes. */
  private refreshGive(world: World, n: Nubbin): void {
    const inv = world.inventory;
    const critters = Object.entries(inv.critters).filter(([, c]) => c > 0);
    const essences = Object.entries(inv.essences).filter(([, c]) => c > 0);
    const key = `${n.stage}|${critters.map(([k, c]) => `${k}:${c}`).join(',')}|${essences.map(([k, c]) => `${k}:${c}`).join(',')}`;
    if (key === this.giveKey) return;
    this.giveKey = key;
    this.giveList.innerHTML = '';
    const canGive = n.stage !== 'egg' && n.stage !== 'cocoon';
    this.give.hidden = !canGive;
    if (!canGive) return;
    if (critters.length === 0 && essences.length === 0) {
      this.giveList.appendChild(el('span', 'help', UI_TEXT.nothingToGive));
      return;
    }
    for (const [species, count] of critters) {
      const b = button(
        `${CRITTER_LABELS[species] ?? species} ×${count}`,
        () => {
          this.game()?.send({ kind: 'giveCritter', nubbinId: n.id, species });
        },
        'btn btn-small',
      );
      this.giveList.appendChild(b);
    }
    for (const [type, count] of essences) {
      const t = type as NubbinType;
      const b = button(
        `${ESSENCE_LABELS[t]} ×${count}`,
        () => {
          this.game()?.send({ kind: 'giveEssence', nubbinId: n.id, type: t });
        },
        'btn btn-small',
      );
      this.giveList.appendChild(b);
    }
  }

  get selectedId(): string | null {
    return this.id;
  }

  open(id: string): void {
    this.id = id;
    this.root.hidden = false;
    this.refresh();
  }

  close(): void {
    this.id = null;
    this.root.hidden = true;
    this.game()?.send({ kind: 'select', id: null });
  }

  /** Called every few frames while open. */
  refresh(): void {
    const g = this.game();
    if (!g || !this.id) return;
    const world = g.world;
    const n = world.nubbins.find((x) => x.id === this.id);
    if (!n) {
      this.close();
      return;
    }
    this.name.textContent = n.name;
    this.subtitle.textContent = subtitleFor(n, world);

    this.meters.hunger.set(n.needs.hunger);
    this.meters.energy.set(n.needs.energy);
    this.meters.happiness.set((n.needs.happiness + 100) / 200);
    this.meters.affection.set(n.needs.affection / 100);

    for (const key of STAT_KEYS) {
      const s = n.stats[key];
      const cell = this.statRows.get(key);
      if (cell) cell.textContent = `Lv ${levelOf(s.points)} · ${s.grade}`;
    }
    this.refreshGive(world, n);

    const isEgg = n.stage === 'egg';
    const carried = world.keeper.carrying === n.id;
    this.petBtn.hidden = isEgg || n.stage === 'cocoon';
    this.carryBtn.textContent = carried ? UI_TEXT.putDown : UI_TEXT.pickUp;
    this.carryBtn.disabled = !carried && world.keeper.carrying !== null;
    this.feedBtn.hidden = isEgg || n.stage === 'cocoon';
    this.feedBtn.textContent = `${UI_TEXT.feed} (${world.inventory.fruit})`;
    this.feedBtn.disabled = world.inventory.fruit <= 0;
    this.shakeBtn.hidden = !isEgg;
    this.shakeBtn.disabled = !carried && n.behavior.state !== 'held';
  }

  private act(what: 'pet' | 'carry' | 'feed' | 'shake'): void {
    const g = this.game();
    if (!g || !this.id) return;
    switch (what) {
      case 'pet':
        g.send({ kind: 'pet', nubbinId: this.id });
        break;
      case 'carry':
        if (g.world.keeper.carrying === this.id) g.send({ kind: 'putDown' });
        else g.send({ kind: 'pickUp', nubbinId: this.id });
        break;
      case 'feed':
        g.send({ kind: 'feed', nubbinId: this.id });
        break;
      case 'shake':
        g.send({ kind: 'shakeHeld' });
        break;
    }
  }

  private rename(): void {
    const g = this.game();
    if (!g || !this.id) return;
    const n = g.world.nubbins.find((x) => x.id === this.id);
    if (!n) return;
    const name = window.prompt(UI_TEXT.rename, n.name);
    if (name && name.trim()) g.send({ kind: 'rename', nubbinId: this.id, name });
  }
}

function subtitleFor(n: Nubbin, world: World): string {
  if (n.stage === 'egg') {
    return UI_TEXT.hatchesIn(formatDuration(Math.max(0, n.hatchRemainingMs)));
  }
  const stage =
    n.species === 'chao'
      ? STAGE_LABELS[n.stage]
      : `${SPECIES_LABELS[n.species] ?? n.species} · ${STAGE_LABELS[n.stage]}`;
  const band = n.form ? bandOf(n.alignment) : childHint(n.alignment);
  const bandLabel =
    band === 'sun'
      ? `☀ ${NAMES.alignmentSun}`
      : band === 'moon'
        ? `☾ ${NAMES.alignmentMoon}`
        : `◐ ${NAMES.alignmentNeutral}`;
  const type = n.form
    ? ` · ${TYPE_LABELS[n.form.type]}${n.form.second && n.form.second !== 'normal' ? ` / ${TYPE_LABELS[n.form.second]}` : ''}`
    : '';
  const rebirths = n.rebirths > 0 ? ` · ${UI_TEXT.rebirths(n.rebirths)}` : '';
  const eternal = n.eternal ? ` · ✦ ${UI_TEXT.eternalLabel}` : '';
  const waiting = n.awaitingKeeper ? ` · ${UI_TEXT.waiting}` : '';
  void world;
  return `${stage}${type} · ${bandLabel} · ${UI_TEXT.age(formatDuration(n.ageMs))}${rebirths}${eternal}${waiting}`;
}
