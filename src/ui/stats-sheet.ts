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
import { SHEET_TEXT } from '../config/strings-tech';
import { BIRTHMARK_TEXT, FLAVOUR } from '../config/strings-look';
import { birthmarkOf } from '../render/birthmark';
import { bandOf, childHint } from '../sim/alignment';
import { dayCount } from '../sim/curfew';
import { TEN_TEXT } from '../config/strings';
import { levelOf } from '../sim/stats';
import { STATS, UI } from '../config/tuning';
import {
  STAT_KEYS,
  type DyeColor,
  type Interaction,
  type Memory,
  type Nubbin,
  type NubbinType,
  type World,
} from '../sim/types';

const DYES: DyeColor[] = ['rose', 'sky', 'mint', 'gold', 'violet', 'ember'];
import type { Game } from '../game';
import { RideButton } from './ride-button';
import { BattleCard } from './battle-card';
import { jobOfNubbin } from '../sim/battle/tactics/jobs';
import { JOB_LAYER_TEXT, JOB_TEXT } from '../config/strings-tactics';
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
    'hunger' | 'energy' | 'happiness' | 'affection' | 'trust',
    ReturnType<typeof meter>
  >;
  private readonly statRows = new Map<string, HTMLSpanElement>();
  /** Each stat's bar toward the next level, and the points last shown, to mark a gain. */
  private readonly statBars = new Map<string, { row: HTMLElement; fill: HTMLElement }>();
  private shownPoints: { id: string; points: Record<string, number> } | null = null;
  /** The last gain per stat, shown as "+N" for a couple of seconds. */
  private readonly gains = new Map<string, { n: number; until: number }>();
  private readonly actions: HTMLDivElement;
  private readonly petBtn: HTMLButtonElement;
  private readonly carryBtn: HTMLButtonElement;
  private readonly feedBtn: HTMLButtonElement;
  private readonly shakeBtn: HTMLButtonElement;
  private more!: HTMLDivElement;
  private heartBtn!: HTMLButtonElement;
  /** R0085: Ride / Get down, and Cheer on (`ui/ride-button.ts`). */
  private rideBtn = new RideButton(() => this.game());
  private catchBtn!: HTMLButtonElement;
  /** Lane C: the Bout card (battle stats, traits, move slots). */
  private readonly bout: BattleCard;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void = () => undefined,
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
    // TECH-17: on a phone a handle above the header grows the sheet (tap, or drag up/down).
    let dragY: number | null = null;
    let dragged = false;
    const handle = button(
      '',
      () => {
        if (!dragged) this.root.classList.toggle('sheet-tall');
        dragged = false;
      },
      'sheet-handle',
    );
    handle.setAttribute('aria-label', SHEET_TEXT.grow);
    handle.addEventListener('pointerdown', (e) => (dragY = e.clientY));
    handle.addEventListener('pointerup', (e) => {
      if (dragY === null) return;
      const dy = e.clientY - dragY;
      dragY = null;
      dragged = Math.abs(dy) > 24;
      if (dragged) this.root.classList.toggle('sheet-tall', dy < 0);
    });
    head.prepend(handle);

    const needs = el('div', 'sheet-needs');
    this.meters = {
      hunger: meter(UI_TEXT.hunger, '🍎'),
      energy: meter(UI_TEXT.energy, '⚡'),
      happiness: meter(UI_TEXT.happiness, '☺'),
      affection: meter(UI_TEXT.affection, '♥'),
      trust: meter(UI_TEXT.trust, '🤝'),
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
      // Points toward the next level, so a critter or an essence shows (review C, item 22).
      const bar = el('span', 'stat-progress');
      const fill = el('i');
      bar.appendChild(fill);
      row.append(value, bar);
      this.statRows.set(key, value);
      this.statBars.set(key, { row, fill });
      stats.appendChild(row);
    }

    this.actions = el('div', 'sheet-actions');
    this.petBtn = button(UI_TEXT.pet, () => this.act('pet'));
    this.carryBtn = button(UI_TEXT.pickUp, () => this.act('carry'));
    this.feedBtn = button(UI_TEXT.feed, () => this.act('feed'));
    this.shakeBtn = button(UI_TEXT.shake, () => this.act('shake'));
    this.actions.append(this.petBtn, this.carryBtn, this.feedBtn, this.shakeBtn);

    // The gentler interactions and games; the sim decides what each one does.
    this.more = el('div', 'sheet-actions sheet-more');
    const send = (make: (id: string) => Parameters<Game['send']>[0]) => {
      const g = this.game();
      if (g && this.id) g.send(make(this.id));
    };
    const interact = (action: Interaction, label: string) =>
      button(
        label,
        () => send((id) => ({ kind: 'interact', nubbinId: id, action })),
        'btn btn-small',
      );
    this.heartBtn = button(
      UI_TEXT.heartFruitGive,
      () => send((id) => ({ kind: 'giveHeartFruit', nubbinId: id })),
      'btn btn-small',
    );
    this.catchBtn = button(
      UI_TEXT.playCatch,
      () => send((id) => ({ kind: 'playCatch', nubbinId: id })),
      'btn btn-small',
    );
    this.more.append(
      interact('tickle', UI_TEXT.tickle),
      interact('hug', UI_TEXT.hug),
      interact('groom', UI_TEXT.groom),
      interact('highFive', UI_TEXT.highFive),
      interact('praise', UI_TEXT.praise),
      interact('tuckIn', UI_TEXT.tuckIn),
      button(UI_TEXT.call, () => send((id) => ({ kind: 'call', nubbinId: id })), 'btn btn-small'),
      this.catchBtn,
      this.heartBtn,
      this.rideBtn.ride,
      this.rideBtn.cheer,
    );

    // Accessories: dyed hat and scarf, glasses.
    this.life = el('div', 'sheet-life');
    this.memorySel = el('select');
    this.memorySel.setAttribute('aria-label', TEN_TEXT.memoryLabel);
    for (const [k, label] of Object.entries(TEN_TEXT.memoryNames)) {
      const o = el('option', undefined, label);
      o.value = k;
      this.memorySel.appendChild(o);
    }
    this.memorySel.addEventListener('change', () => {
      send((id) => ({ kind: 'setMemory', nubbinId: id, memory: this.memorySel.value as Memory }));
    });
    const memRow = el('label', 'field-row');
    memRow.append(el('strong', undefined, TEN_TEXT.memoryLabel), this.memorySel);
    this.life.appendChild(memRow);
    this.lifeText = el('div', 'help');
    this.life.appendChild(this.lifeText);
    this.acc = el('div', 'sheet-acc');
    const dyeSelect = (label: string, slot: 'hat' | 'scarf') => {
      const sel = el('select');
      sel.setAttribute('aria-label', label);
      const none = el('option', undefined, label);
      none.value = '';
      sel.appendChild(none);
      for (const d of DYES) {
        const o = el('option', undefined, UI_TEXT.dyeNames[d]);
        o.value = d;
        sel.appendChild(o);
      }
      sel.addEventListener('change', () => {
        const color = (sel.value || null) as DyeColor | null;
        send((id) => ({ kind: 'dye', nubbinId: id, slot, color }));
      });
      return sel;
    };
    this.hatDye = dyeSelect(UI_TEXT.dyeHat, 'hat');
    this.scarfDye = dyeSelect(UI_TEXT.dyeScarf, 'scarf');
    this.glassesBtn = button(
      UI_TEXT.glasses,
      () => {
        const g = this.game();
        const n = g?.world.nubbins.find((x) => x.id === this.id);
        if (n) send((id) => ({ kind: 'wearGlasses', nubbinId: id, on: !n.glasses }));
      },
      'btn btn-small',
    );
    this.acc.append(this.hatDye, this.scarfDye, this.glassesBtn);

    this.give = el('div', 'sheet-give');
    this.giveTitle = el('div', 'sheet-give-title', UI_TEXT.give);
    this.giveList = el('div', 'sheet-give-list');
    this.give.append(this.giveTitle, this.giveList);

    this.bout = new BattleCard(game);
    this.root.append(head, needs, stats, this.actions, this.more, this.acc, this.life, this.give);
    this.root.appendChild(this.bout.root);
    parent.appendChild(this.root);
  }

  private readonly give: HTMLDivElement;
  private readonly acc: HTMLDivElement;
  private readonly life: HTMLDivElement;
  private readonly lifeText: HTMLDivElement;
  private readonly memorySel: HTMLSelectElement;
  private readonly hatDye: HTMLSelectElement;
  private readonly scarfDye: HTMLSelectElement;
  private readonly glassesBtn: HTMLButtonElement;
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
      // FUN-28: the critter's dry line, on hover and for screen readers.
      b.title = FLAVOUR.critter[species] ?? '';
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
      b.title = FLAVOUR.essence[t] ?? '';
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
    this.meters.trust.set(n.trust / 100);

    const last = this.shownPoints?.id === n.id ? this.shownPoints.points : null;
    const points: Record<string, number> = {};
    for (const key of STAT_KEYS) {
      const s = n.stats[key];
      const cell = this.statRows.get(key);
      const lv = levelOf(s.points);
      const per = STATS.pointsPerLevel;
      const into = lv >= STATS.maxLevel ? per : Math.floor(s.points - lv * per);
      const gained = last ? Math.floor(s.points - (last[key] ?? s.points)) : 0;
      const now = performance.now();
      if (gained > 0) this.gains.set(key, { n: gained, until: now + 2500 });
      else if (!last) this.gains.delete(key);
      const gain = this.gains.get(key);
      const plus = gain && gain.until > now ? ` +${gain.n}` : '';
      if (cell) cell.textContent = `Lv ${lv} · ${s.grade}${plus}`;
      const bar = this.statBars.get(key);
      if (bar) {
        bar.fill.style.width = `${(100 * into) / per}%`;
        bar.row.title = UI_TEXT.statPoints(into, per, Math.min(lv + 1, STATS.maxLevel));
        if (gained > 0) {
          bar.row.classList.remove('stat-gain');
          void bar.row.offsetWidth; // restart the highlight
          bar.row.classList.add('stat-gain');
        }
      }
      points[key] = s.points;
    }
    this.shownPoints = { id: n.id, points };
    this.refreshGive(world, n);
    this.bout.refresh(n);
    this.rideBtn.refresh(world, n);

    const isEgg = n.stage === 'egg';
    const carried = world.keeper.carrying === n.id;
    this.petBtn.hidden = isEgg || n.stage === 'cocoon';
    this.carryBtn.textContent = carried ? UI_TEXT.putDown : UI_TEXT.pickUp;
    this.carryBtn.disabled = !carried && world.keeper.carrying !== null;
    this.feedBtn.hidden = isEgg || n.stage === 'cocoon';
    // A full Nubbin says so on the button, and a tap explains instead of spending fruit.
    const full = n.needs.hunger >= UI.feedFullAt;
    this.feedBtn.textContent = full
      ? `${UI_TEXT.feed} · ${UI_TEXT.feedFull}`
      : `${UI_TEXT.feed} (${world.inventory.fruit})`;
    this.feedBtn.classList.toggle('is-full', full);
    this.feedBtn.disabled = world.inventory.fruit <= 0;
    this.shakeBtn.hidden = !isEgg;
    this.more.hidden = isEgg || n.stage === 'cocoon';
    this.heartBtn.hidden = n.stage !== 'adult' || !!n.eternal;
    this.heartBtn.disabled = world.inventory.heartFruit <= 0;
    this.catchBtn.disabled = !world.items.some((i) => i.kind === 'toy');
    this.shakeBtn.disabled = !carried && n.behavior.state !== 'held';
    // Say why it is off, rather than a dead button (review 2026-10-21, bug 18).
    this.shakeBtn.textContent = this.shakeBtn.disabled ? UI_TEXT.shakeNeedsHold : UI_TEXT.shake;
    // Accessories only on hatched Chao-line Nubbins; dyes need stock.
    this.acc.hidden = isEgg || n.stage === 'cocoon' || n.species !== 'chao';
    const dyes = Object.values(world.inventory.dyes).reduce((s, c) => s + (c ?? 0), 0);
    const hasDye = (d: DyeColor) => (world.inventory.dyes[d] ?? 0) > 0;
    for (const sel of [this.hatDye, this.scarfDye]) {
      for (const o of sel.options) {
        if (o.value) o.disabled = !hasDye(o.value as DyeColor) && o.value !== sel.value;
      }
    }
    if (document.activeElement !== this.hatDye) this.hatDye.value = n.hatDye ?? '';
    if (document.activeElement !== this.scarfDye) this.scarfDye.value = n.scarf ?? '';
    this.hatDye.hidden = !n.hat;
    this.hatDye.title = dyes === 0 ? UI_TEXT.noDye : '';
    this.glassesBtn.classList.toggle('active', !!n.glasses);
    // Life: the day count, slips, past lives, what the next rebirth keeps.
    this.life.hidden = isEgg;
    if (document.activeElement !== this.memorySel) this.memorySel.value = n.memory;
    const dc = dayCount(n);
    const lines = [TEN_TEXT.dayCount(dc.day, dc.of)];
    if (n.slips.length === 0) lines.push(TEN_TEXT.noSlips);
    else {
      const recent = n.slips.slice(-3).map((s) => TEN_TEXT.slipNames[s.kind] ?? s.kind);
      lines.push(`${TEN_TEXT.slips}: ${n.slipCount} · ${recent.join(', ')}`);
    }
    if (n.ancestry.length > 0) lines.push(TEN_TEXT.ancestry(n.ancestry));
    // LOOK-53: the birthmark, by name.
    const mark = birthmarkOf(n);
    if (mark) lines.push(BIRTHMARK_TEXT.line(BIRTHMARK_TEXT.kinds[mark.kind] ?? mark.kind));
    this.lifeText.textContent = lines.join(' · ');
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
      case 'feed': {
        const n = g.world.nubbins.find((x) => x.id === this.id);
        if (n && n.needs.hunger >= UI.feedFullAt) {
          this.toast(UI_TEXT.isFull(n.name));
          break;
        }
        g.send({ kind: 'feed', nubbinId: this.id });
        break;
      }
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
    // Time up: an egg in the Keeper's arms waits to be put down, so say that, not "0s".
    if (n.hatchRemainingMs <= 0)
      return world.keeper.carrying === n.id ? UI_TEXT.hatchReadyHeld : UI_TEXT.hatchReady;
    return UI_TEXT.hatchesIn(formatDuration(n.hatchRemainingMs));
  }
  const stage =
    n.species === 'chao'
      ? STAGE_LABELS[n.stage]
      : `${SPECIES_LABELS[n.species] ?? n.species} · ${STAGE_LABELS[n.stage]}`;
  const extra = [
    n.moody ? TEN_TEXT.moodyTag[n.moody] : null,
    n.heirloom ? TEN_TEXT.heirloomTag : null,
  ]
    .filter(Boolean)
    .join(' · ');
  const tag = n.shadow
    ? n.bond
      ? UI_TEXT.bondedTag
      : n.stray
        ? UI_TEXT.strayTag
        : UI_TEXT.shadowTag
    : null;
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
  // The tactics job (recs FIGHT-55): derived, never chosen, so the sheet just names it.
  const jb = jobOfNubbin(n);
  const layer = jb.layer ? JOB_LAYER_TEXT[jb.layer] : null;
  const job = ` · ${JOB_TEXT[jb.job].icon} ${JOB_TEXT[jb.job].name}${layer ? ` ${layer.icon}` : ''}`;
  const waiting = n.awaitingKeeper ? ` · ${UI_TEXT.waiting}` : '';
  const shadowTag = tag ? ` · ${tag}` : '';
  const extraTag = extra ? ` · ${extra}` : '';
  return `${stage}${type}${job} · ${bandLabel} · ${UI_TEXT.age(formatDuration(n.ageMs))}${rebirths}${eternal}${waiting}${shadowTag}${extraTag}`;
}
