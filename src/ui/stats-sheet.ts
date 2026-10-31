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
import { HATCH_BUTTON_TEXT, SHEET_TABS_TEXT } from '../config/strings-r8d';
import {
  careFaces,
  hatchFraction,
  PLAYS,
  playsUnlocked,
  sheetTabsFor,
  type SheetTab,
} from './sheet-tabs';
import { toastBand } from './fun-toasts';
import { BIRTHMARK_TEXT, FLAVOUR } from '../config/strings-look';
import { RenameDialog } from './rename-dialog';
import { sheetCaption } from './sheet-caption';
import { PersonalityChip } from './personality-chip';
import { RecentlyBox, SoulRow } from './soul-row';
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
  /** R0357: the rename dialog, made on first use beside the sheet. */
  private renamer: RenameDialog | null = null;
  /** R0360: the dry caption under the name. */
  private readonly caption: HTMLDivElement;
  /** R0522: the personality chip (a child's leaning) and its card. */
  private readonly personality = new PersonalityChip();
  /** Lane A r8: likes, dislikes, the favourite toy and a moody chip. */
  private readonly soul = new SoulRow();
  /** R0563: the "Recently" lines. */
  private readonly recent = new RecentlyBox();
  private readonly host: HTMLElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void = () => undefined,
  ) {
    this.host = parent;
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
    this.caption = el('div', 'sheet-caption');
    this.caption.hidden = true;

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
    // R0676: the Learning Grove guide finds these to pulse them (ui/guide.ts).
    this.petBtn.dataset.guide = 'pet';
    this.feedBtn.dataset.guide = 'feed';
    this.shakeBtn.dataset.guide = 'shake';
    this.carryBtn.dataset.guide = 'pickup';

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
    // TECH-07: the plays, in the order a child discovers them (ui/sheet-tabs.ts).
    const playLabels: Record<string, string> = {
      tickle: UI_TEXT.tickle,
      hug: UI_TEXT.hug,
      groom: UI_TEXT.groom,
      highFive: UI_TEXT.highFive,
      praise: UI_TEXT.praise,
      tuckIn: UI_TEXT.tuckIn,
    };
    this.plays = PLAYS.map((a) => interact(a, playLabels[a] ?? a));
    this.more.append(
      ...this.plays,
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
    // TECH-07: tabs. Care holds what a young Nubbin needs; Inside the numbers; Grow (after
    // the first evolution) the stats, accessories, rebirth and Bout card.
    this.statsEl = stats;
    this.tabBar = el('div', 'sheet-tabs');
    this.tabBar.setAttribute('role', 'tablist');
    this.tabBar.setAttribute('aria-label', SHEET_TABS_TEXT.tabsLabel);
    for (const t of ['care', 'inside', 'grow'] as const) {
      const b = button(SHEET_TABS_TEXT.tabs[t], () => this.setTab(t), 'btn btn-small sheet-tab');
      b.setAttribute('role', 'tab');
      this.tabBtns[t] = b;
      this.tabBar.appendChild(b);
    }
    this.eggRing = el('div', 'egg-ring');
    this.eggRing.setAttribute('role', 'img');
    this.faces = el('div', 'sheet-faces');
    this.faceEls = [el('span', 'sheet-face'), el('span', 'sheet-face'), el('span', 'sheet-face')];
    this.faces.append(...this.faceEls);
    this.moreToggle = button(
      SHEET_TABS_TEXT.morePlays,
      () => {
        this.moreOpen = !this.moreOpen;
        this.refresh();
      },
      'btn btn-small sheet-more-toggle',
    );
    this.careInfo = el('div', 'sheet-care-info');
    this.careInfo.append(
      this.personality.root,
      this.personality.forming,
      this.personality.details,
      this.soul.root,
      this.recent.root,
    );
    this.careBox = el('div', 'sheet-panel');
    this.careBox.append(
      this.eggRing,
      this.careInfo,
      this.faces,
      this.actions,
      this.moreToggle,
      this.more,
      this.give,
    );
    this.insideBox = el('div', 'sheet-panel');
    this.insideBox.append(needs);
    this.growBox = el('div', 'sheet-panel');
    this.placeGrow(false);
    this.root.append(head, this.caption, this.tabBar, this.careBox, this.insideBox, this.growBox);
    parent.appendChild(this.root);
  }

  private readonly statsEl: HTMLDivElement;
  private readonly tabBar: HTMLDivElement;
  private readonly tabBtns: Partial<Record<SheetTab, HTMLButtonElement>> = {};
  private readonly careBox: HTMLDivElement;
  private readonly careInfo: HTMLDivElement;
  private readonly insideBox: HTMLDivElement;
  private readonly growBox: HTMLDivElement;
  private readonly eggRing: HTMLDivElement;
  private readonly faces: HTMLDivElement;
  private readonly faceEls: HTMLSpanElement[];
  private readonly moreToggle: HTMLButtonElement;
  private readonly plays: HTMLButtonElement[];
  private tab: SheetTab = 'care';
  private moreOpen = false;
  private grownLayout: boolean | null = null;

  /** TECH-07: stats, accessories, rebirth and the Bout card sit in Grow once there is one. */
  private placeGrow(grown: boolean): void {
    if (this.grownLayout === grown) return;
    this.grownLayout = grown;
    const box = grown ? this.growBox : this.insideBox;
    box.append(this.statsEl, this.acc, this.life, this.bout.root);
  }

  private setTab(t: SheetTab): void {
    this.tab = t;
    this.refresh();
  }

  /** TECH-07: which tab and panels show, the egg ring, the faces and the plays found so far. */
  private refreshLayout(n: Nubbin): void {
    const tabs = sheetTabsFor(n);
    if (!tabs.includes(this.tab)) this.tab = 'care';
    this.placeGrow(tabs.includes('grow'));
    this.tabBar.hidden = tabs.length === 0;
    for (const t of ['care', 'inside', 'grow'] as const) {
      const b = this.tabBtns[t];
      if (!b) continue;
      b.hidden = !tabs.includes(t);
      const on = this.tab === t;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', String(on));
    }
    this.careBox.hidden = tabs.length > 0 && this.tab !== 'care';
    this.insideBox.hidden = tabs.length === 0 || this.tab !== 'inside';
    this.growBox.hidden = !tabs.includes('grow') || this.tab !== 'grow';
    const isEgg = n.stage === 'egg';
    const young = isEgg || n.stage === 'cocoon';
    this.careInfo.hidden = isEgg;
    this.eggRing.hidden = !isEgg;
    if (isEgg) {
      const f = hatchFraction(n);
      this.eggRing.style.setProperty('--hatch', `${Math.round(f * 360)}deg`);
      this.eggRing.setAttribute('aria-label', SHEET_TABS_TEXT.hatchRing(Math.round(f * 100)));
    }
    this.faces.hidden = young;
    if (!young) {
      careFaces(n).forEach((f, i) => {
        const s = this.faceEls[i];
        if (!s) return;
        if (s.textContent !== f.text) s.textContent = f.text;
        s.setAttribute('aria-label', f.label);
        s.dataset.band = f.band;
      });
    }
    this.moreToggle.hidden = young;
    this.moreToggle.textContent = this.moreOpen
      ? SHEET_TABS_TEXT.fewerPlays
      : SHEET_TABS_TEXT.morePlays;
    this.moreToggle.setAttribute('aria-expanded', String(this.moreOpen));
    const k = playsUnlocked(n);
    this.plays.forEach((b, i) => (b.hidden = i >= k));
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
    // TECH-07: every opening starts on Care with the extra plays folded away.
    if (id !== this.id) {
      this.tab = 'care';
      this.moreOpen = false;
    }
    this.id = id;
    this.root.hidden = false;
    // R0360: one dry caption per opening, in the main band.
    const g = this.game();
    const n = g?.world.nubbins.find((x) => x.id === id);
    this.caption.textContent = (g && n && sheetCaption(g.world, n)) || '';
    this.caption.hidden = !this.caption.textContent;
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
    this.personality.update(n);
    this.personality.meter(n, toastBand(world) === 'sprout');
    this.soul.update(n);
    this.recent.update(world, n);

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
    // TECH-17: a ready egg in hand says what putting it down does, in the button itself.
    const hatchNow = carried && isEgg && n.hatchRemainingMs <= 0;
    this.carryBtn.textContent = hatchNow
      ? HATCH_BUTTON_TEXT.putDownToHatch
      : carried
        ? UI_TEXT.putDown
        : UI_TEXT.pickUp;
    this.carryBtn.classList.toggle('btn-primary', hatchNow);
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
    this.more.hidden = isEgg || n.stage === 'cocoon' || !this.moreOpen;
    this.refreshLayout(n);
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
    // R0357: a small dialog with a silly-name button, in place of the prompt box.
    this.renamer ??= new RenameDialog(this.host, this.game);
    this.renamer.open(this.id);
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
