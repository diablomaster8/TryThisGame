import { ACTS } from '../config/dungeon-acts';
import { ACT_TEXT, DUNGEON_TEXT, HOLLOW_TEXT, UI_TEXT } from '../config/strings';
import { actOpen } from '../sim/dungeon-acts';
import type { Game } from '../game';
import { dailySeed, partyIds } from '../sim/dungeon';
import type { World } from '../sim/types';
import { button, el, modal } from './dom';
import { HollowMap } from './hollow-map';
import { BuffRing } from './dungeon-buffs';
import { WaypointPanel } from './waypoint-panel';
import { HOLLOW } from '../config/tuning';
import { campPortalHere, canUseAcorn, standingOnWaypoint } from '../sim/dungeon-travel';
import { parseLevelId } from '../sim/dungeon-levels';
import { GEAR_TEXT, HOLLOW_ZONE_TEXT, RUMBLE_TEXT } from '../config/strings';
import { GearPanel } from './dungeon-gear';
import { CottageChest, StashPanel } from './dungeon-stash';
import { serviceHere } from '../sim/dungeon-towns';
import { mouthHere } from '../sim/dungeon-zones';
import { calmers } from '../sim/dungeon-strays';
import { TownPanel } from './dungeon-town';
import { PartyPicker } from './dungeon-party';
import { HOLLOW_R6_TEXT, HOLLOW_R7_TEXT } from '../config/strings';
import { hollowTier, TIERS, tiersOpen } from '../sim/dungeon-tiers';
import { HOLLOW_R6 } from '../config/tuning';
import { clockText } from '../sim/dungeon-log';
import { runClock } from '../sim/dungeon-speed';
import { sackCount } from '../sim/dungeon-sack';
import type { DungeonRun } from '../sim/types';
import type { SimEvent } from '../sim/types';
import { HOLLOW_R8_TEXT } from '../config/strings-hollow-r8-party';
import { PARTY_R8 } from '../config/dungeon-party-r8';
import { HollowScroll, ShareCard } from './hollow-scroll';
import { guideOn, guidePath, lookAheadCell } from '../sim/dungeon-guide';
import { cellCentre, runFloor } from '../sim/dungeon';
import { screenBearing } from './hud-world-math';
import { tzOf } from '../sim/local-time';

/**
 * The Hollow Below: the menu at the cave mouth (today's shared cave or a fresh one,
 * who comes along, the best depth so far) and the bar shown underground (floor, haul,
 * and the way home).
 */
export class DungeonMenu {
  private readonly dialog;
  private readonly info: HTMLDivElement;
  private readonly bar: HTMLDivElement;
  private readonly barText: HTMLSpanElement;
  private readonly map: HollowMap;
  /** Shrine buffs (R0159). */
  private readonly buffs = new BuffRing();
  private readonly acts: HTMLDivElement;
  /** Waypoints, the acorn portal, new paths and acorns (lane B round 2). */
  private readonly travel: HTMLDivElement;
  private readonly waypoints: WaypointPanel;
  private readonly stoneBtn: HTMLButtonElement;
  private readonly acornBtn: HTMLButtonElement;
  /** Act camps and fields (R0152, R0147): the service at hand and the cave mouth. */
  private readonly town: TownPanel;
  private readonly serviceBtn: HTMLButtonElement;
  private readonly mouthBtn: HTMLButtonElement;
  /** In a camp with an acorn portal open into its act (R0150). */
  private readonly portalBtn: HTMLButtonElement;
  /** R0281: the stray's choice, shown while a stray asks. */
  private readonly calmBtn: HTMLButtonElement;
  private readonly snackBtn: HTMLButtonElement;
  /** R0164: the gear panel. */
  private readonly gear: GearPanel;
  private readonly cottage: CottageChest;
  /** Who comes along (R0168). */
  private readonly party: PartyPicker;
  /** Lane B round 6: End trip with a confirm (R0184), and "Sneak past?" (R0180). */
  private readonly endDialog;
  private readonly endText: HTMLParagraphElement;
  private readonly sneakBtn: HTMLButtonElement;
  // Lane B round 8: the boss scroll (R0207) and today's share card (R0185).
  private readonly scroll: HollowScroll;
  private readonly share: ShareCard;
  /** A boss scroll waiting its turn: it opens after the fight and the boss card are done. */
  private scrollWaiting: { act: number; since: number } | null = null;
  /** Set by the HUD: whether a card the scroll must wait for (the boss celebration) is up. */
  scrollBusy: () => boolean = () => false;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, DUNGEON_TEXT.title, UI_TEXT.close);
    this.dialog.body.appendChild(el('p', 'help', DUNGEON_TEXT.help));
    this.info = el('div', 'shop-note');
    this.dialog.body.appendChild(this.info);
    this.share = new ShareCard(parent);
    this.scroll = new HollowScroll(parent);
    this.dialog.body.appendChild(
      button(
        HOLLOW_R8_TEXT.shareButton,
        () => {
          const g = this.game();
          if (g) this.share.open(g.world);
        },
        'btn btn-small',
      ),
    );
    this.party = new PartyPicker(game);
    this.dialog.body.appendChild(this.party.root);
    const list = el('div', 'shop-list');
    for (const [label, help, daily] of [
      [DUNGEON_TEXT.today, DUNGEON_TEXT.todayHelp, true],
      [DUNGEON_TEXT.fresh, DUNGEON_TEXT.freshHelp, false],
    ] as const) {
      const row = el('div', 'shop-row');
      const text = el('div');
      text.append(el('strong', undefined, label), el('small', undefined, help));
      row.append(
        text,
        button(DUNGEON_TEXT.go, () => this.enter(daily), 'btn btn-small btn-primary'),
      );
      list.appendChild(row);
    }
    this.dialog.body.appendChild(list);
    // The five acts (R0145): each opens once the boss above it is beaten.
    this.dialog.body.appendChild(el('h3', undefined, HOLLOW_TEXT.actsTitle));
    this.acts = el('div', 'shop-list');
    this.dialog.body.appendChild(this.acts);
    this.travel = el('div', 'shop-list');
    this.dialog.body.appendChild(this.travel);
    this.waypoints = new WaypointPanel(parent, game);

    this.bar = el('div', 'hollow-bar');
    this.bar.hidden = true;
    this.barText = el('span');
    this.bar.append(
      this.barText,
      this.buffs.root,
      this.buffs.announcer,
      button(HOLLOW_R6_TEXT.endTrip, () => this.endTrip(), 'btn btn-small'),
    );
    // Underground: the stone the Keeper stands on, and the Homing Acorn (R0148, R0150).
    this.stoneBtn = button(
      HOLLOW_TEXT.waypointButton,
      () => this.waypoints.open(),
      'btn btn-small hollow-extra',
    );
    this.stoneBtn.hidden = true;
    this.acornBtn = button(
      '',
      () => this.game()?.send({ kind: 'useAcorn' }),
      'btn btn-small hollow-extra',
    );
    this.bar.append(this.stoneBtn, this.acornBtn);
    this.town = new TownPanel(parent, game);
    this.serviceBtn = button('', () => this.town.open(), 'btn btn-small btn-primary hollow-extra');
    this.serviceBtn.hidden = true;
    this.mouthBtn = button(
      HOLLOW_ZONE_TEXT.mouthButton,
      () => this.game()?.send({ kind: 'enterMouth' }),
      'btn btn-small btn-primary hollow-extra',
    );
    this.mouthBtn.hidden = true;
    this.portalBtn = button(
      HOLLOW_ZONE_TEXT.portalBack,
      () => this.game()?.send({ kind: 'portalReturn' }),
      'btn btn-small btn-primary hollow-extra',
    );
    this.portalBtn.hidden = true;
    // R0281: a stray that bumped the Keeper waits a moment for Calm it or a snack.
    const asking = () => this.game()?.world.dungeon?.strayAsk?.id;
    this.calmBtn = button(
      RUMBLE_TEXT.calm,
      () => {
        const id = asking();
        if (id) this.game()?.send({ kind: 'strayCalm', id });
      },
      'btn btn-small btn-primary hollow-extra',
    );
    this.snackBtn = button(
      RUMBLE_TEXT.snack,
      () => {
        const id = asking();
        if (id) this.game()?.send({ kind: 'feedStray', id });
      },
      'btn btn-small hollow-extra',
    );
    this.calmBtn.hidden = this.snackBtn.hidden = true;
    this.bar.append(this.serviceBtn, this.mouthBtn, this.portalBtn);
    this.bar.append(this.calmBtn, this.snackBtn);
    // R0180: after a few losses to one pack, sneak past it for a minute.
    this.sneakBtn = button(
      HOLLOW_R6_TEXT.sneakYes,
      () => {
        const id = sneakable(this.game()?.world.dungeon ?? null, this.game()?.world.timeMs ?? 0);
        if (id) this.game()?.send({ kind: 'packSneak', packId: id });
      },
      'btn btn-small btn-primary hollow-extra',
    );
    this.sneakBtn.hidden = true;
    this.bar.append(this.sneakBtn);
    // R0184: ending a deep trip, or one with finds unbanked, asks first.
    this.endDialog = modal(parent, HOLLOW_R6_TEXT.endTrip, HOLLOW_R6_TEXT.endNo);
    this.endText = el('p', 'help');
    this.endDialog.body.append(
      this.endText,
      button(
        HOLLOW_R6_TEXT.endYes,
        () => {
          this.endDialog.hide();
          this.game()?.send({ kind: 'leaveDungeon' });
        },
        'btn btn-primary',
      ),
    );
    this.gear = new GearPanel(parent, game);
    // R0174 (lane B round 8): the Grove cottage's stash chest.
    this.cottage = new CottageChest(parent, new StashPanel(parent, game));
    this.bar.append(button(GEAR_TEXT.button, () => this.gear.open(), 'btn btn-small hollow-extra'));
    // The minimap: its button sits in the bar, its panel is the bar's last row.
    this.map = new HollowMap(this.bar);
    this.bar.insertBefore(this.map.toggle, this.map.panel);
    parent.appendChild(this.bar);
  }

  open(): void {
    const g = this.game();
    if (!g) return;
    if (g.world.location !== 'grove') return;
    // Who comes along is the picker's cards now (R0168).
    this.info.textContent = DUNGEON_TEXT.best(g.world.hollow.best, g.world.hollow.runs);
    // R0185: today's results, which simply refresh each day.
    const t = g.world.hollow.today;
    const day = t?.day ?? '';
    this.info.append(
      el('br'),
      day === dailySeed(g.world.lastWallMs, tzOf(g.world)).day && t!.deepest > 0
        ? HOLLOW_R6_TEXT.today(t!.deepest, clockText(t!.bestMs), t!.finds)
        : HOLLOW_R6_TEXT.todayNone,
    );
    this.party.render(g.world, partyIds(g.world));
    this.listActs(g.world);
    this.listTravel(g.world);
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
    this.waypoints.close();
    this.endDialog.hide();
    this.town.close();
    this.gear.close();
    this.share.close();
    this.scroll.close();
  }

  /** The HUD's event hook: the Scout's "!" (R0167) and the boss scroll (R0207). */
  onEvents(events: readonly SimEvent[], world: World, toast: (text: string) => void): void {
    for (const e of events) {
      if (e.kind === 'scoutSpotted') {
        const who = world.nubbins.find((n) => n.id === e.nubbinId)?.name ?? '';
        toast(HOLLOW_R8_TEXT.scoutSpotted(who));
      } else if (e.kind === 'storyScroll')
        this.scrollWaiting = { act: e.act, since: performance.now() };
    }
  }

  isOpen(): boolean {
    return (
      this.dialog.isOpen() ||
      this.waypoints.isOpen() ||
      this.town.isOpen() ||
      this.gear.isOpen() ||
      this.share.isOpen() ||
      this.scroll.isOpen()
    );
  }

  /** Called every frame by the HUD: the underground bar follows the run. */
  refresh(world: World): void {
    const run = world.location === 'dungeon' ? world.dungeon : null;
    // R0196: no Hollow bar over a fight.
    this.bar.hidden = !run || !!run.encounter || !!run.strayBout || !!world.tactics;
    // R0207: the scroll queues behind the fight's end and the boss card (which may open a
    // tick after the scroll's event), so the two never stack.
    const wait = this.scrollWaiting;
    if (
      wait &&
      performance.now() - wait.since >= PARTY_R8.scrollDelayMs &&
      !this.scrollBusy() &&
      !run?.encounter &&
      !world.tactics
    ) {
      this.scrollWaiting = null;
      this.scroll.show(wait.act);
    }
    // The overlay map turns with the camera (R0154).
    this.map.refresh(world, this.game()?.camera.currentYaw ?? 0);
    this.buffs.refresh(run);
    this.town.refresh(world);
    this.cottage.refresh(world);
    if (!run) {
      this.serviceBtn.hidden = this.mouthBtn.hidden = this.portalBtn.hidden = true;
      this.calmBtn.hidden = this.snackBtn.hidden = true;
      return;
    }
    const service = serviceHere(world);
    this.serviceBtn.hidden = !service;
    if (service) this.serviceBtn.textContent = TownPanel.label(world, service);
    this.mouthBtn.hidden = mouthHere(world) === null;
    this.portalBtn.hidden = !campPortalHere(world);
    this.snackBtn.hidden = !run.strayAsk;
    this.calmBtn.hidden = !run.strayAsk || !calmers(world, run).length;
    this.sneakBtn.hidden = !sneakable(run, world.timeMs);
    this.stoneBtn.hidden = !standingOnWaypoint(world);
    const free = !run.acornUsed;
    this.acornBtn.textContent = HOLLOW_TEXT.acornButton(world.hollow.acorns, free);
    this.acornBtn.disabled = !canUseAcorn(world);
    this.acornBtn.hidden = !!run.story;
    const actName = run.act !== undefined ? (ACT_TEXT[ACTS[run.act]!.id]?.name ?? '') : '';
    const place =
      run.zone === 'town'
        ? HOLLOW_ZONE_TEXT.town(actName)
        : run.zone === 'field'
          ? HOLLOW_ZONE_TEXT.field(actName)
          : run.zone === 'side'
            ? HOLLOW_ZONE_TEXT.side(actName, (run.side ?? 0) + 1)
            : DUNGEON_TEXT.floor(run.depth);
    this.barText.textContent = `${place} · ${DUNGEON_TEXT.haul(run.haul.shells, run.haul.items)}`;
    // R0187: the speed run's clock, on the sim clock (it stops when the game does).
    if (world.hollow.speedRun && run.act !== undefined)
      this.barText.textContent += ` · ⏱ ${clockText(runClock(world, run))}`;
    // R0175: what rides in the sack until the next waypoint, camp, acorn or home.
    const sack = sackCount(run);
    if (sack > 0) this.barText.textContent += ` · ${HOLLOW_R6_TEXT.sack(sack)}`;
    // R0208: the guide's arrow toward the stairs or the unexplored, turned with the camera.
    const hint = guideHint(world, this.game()?.camera.currentYaw ?? 0);
    if (hint) this.barText.textContent += ` · ${hint}`;
  }

  private listActs(world: World): void {
    this.acts.replaceChildren();
    // R0179: the tier picker, big icons; a shut tier says how it opens.
    const tiers = el('div', 'hollow-tiers');
    const open = tiersOpen(world);
    for (const t of TIERS) {
      const b = button(
        `${HOLLOW_R7_TEXT.tiers[t].icon} ${HOLLOW_R7_TEXT.tiers[t].name}`,
        () => {
          this.game()?.send({ kind: 'hollowTier', tier: t });
          setTimeout(() => {
            const g = this.game();
            if (g && this.dialog.isOpen()) this.listActs(g.world);
          }, 250);
        },
        'btn btn-small hollow-tier',
      );
      b.disabled = !open.includes(t);
      b.setAttribute('aria-pressed', String(hollowTier(world) === t));
      b.title = open.includes(t) ? HOLLOW_R7_TEXT.tiers[t].help : HOLLOW_R7_TEXT.tierLocked;
      tiers.appendChild(b);
    }
    this.acts.append(tiers, el('small', 'help', HOLLOW_R7_TEXT.tiers[hollowTier(world)].help));
    // R0187: the speed-run toggle.
    const speed = button(
      world.hollow.speedRun ? HOLLOW_R7_TEXT.speedOn : HOLLOW_R7_TEXT.speedOff,
      () => {
        this.game()?.send({ kind: 'hollowSpeedRun', on: !world.hollow.speedRun });
        setTimeout(() => {
          const g = this.game();
          if (g && this.dialog.isOpen()) this.listActs(g.world);
        }, 250);
      },
      'btn btn-small hollow-tier',
    );
    speed.setAttribute('aria-pressed', String(!!world.hollow.speedRun));
    this.acts.append(speed);
    // R0208: "Show me the way", for anyone; off until switched on, on by default in kid mode.
    const guideIsOn = guideOn(world);
    const guide = button(
      guideIsOn ? HOLLOW_R8_TEXT.guideOn : HOLLOW_R8_TEXT.guideOff,
      () => {
        this.game()?.send({ kind: 'hollowGuide', on: !guideIsOn });
        setTimeout(() => {
          const g = this.game();
          if (g && this.dialog.isOpen()) this.listActs(g.world);
        }, 250);
      },
      'btn btn-small hollow-tier',
    );
    guide.setAttribute('aria-pressed', String(guideIsOn));
    guide.title = HOLLOW_R8_TEXT.guideHelp;
    this.acts.append(guide);
    ACTS.forEach((act, i) => {
      const text = ACT_TEXT[act.id]!;
      const open = actOpen(world, i);
      const beaten = world.hollow.acts[i]?.bossDefeated === true;
      const row = el('div', 'shop-row');
      const info = el('div');
      const note = !open ? HOLLOW_TEXT.actLocked : beaten ? HOLLOW_TEXT.actCleared : text.blurb;
      info.append(el('strong', undefined, text.name), el('small', undefined, note));
      const go = button(
        DUNGEON_TEXT.go,
        () => {
          this.close();
          // An act starts at its camp (R0152); waypoints still go straight down.
          this.game()?.send({ kind: 'enterTown', act: i });
        },
        'btn btn-small btn-primary',
      );
      go.disabled = !open;
      row.append(info, go);
      this.acts.appendChild(row);
    });
  }

  /** Waypoints, the open acorn portal, new paths and the acorn bundle. */
  private listTravel(world: World): void {
    this.travel.replaceChildren();
    const row = (title: string, help: string, label: string, act: () => void, ok = true) => {
      const r = el('div', 'shop-row');
      const info = el('div');
      info.append(el('strong', undefined, title), el('small', undefined, help));
      const b = button(label, act, 'btn btn-small btn-primary');
      b.disabled = !ok;
      r.append(info, b);
      this.travel.appendChild(r);
    };
    const portal = world.hollow.portal;
    if (portal) {
      const at = parseLevelId(portal.levelId);
      const actName = at ? (ACT_TEXT[ACTS[at.act]!.id]?.name ?? '') : '';
      const name = at
        ? at.zone
          ? (at.zone === 'town' ? HOLLOW_ZONE_TEXT.town : HOLLOW_ZONE_TEXT.field)(actName)
          : `${actName}, ${HOLLOW_TEXT.waypointLevel(at.level)}`
        : DUNGEON_TEXT.floor(portal.run.depth);
      row(HOLLOW_TEXT.portalTitle, HOLLOW_TEXT.portalHelp(name), HOLLOW_TEXT.portalGo, () => {
        this.close();
        this.game()?.send({ kind: 'portalReturn' });
      });
    }
    row(
      HOLLOW_TEXT.waypointsTitle,
      HOLLOW_TEXT.waypointsHelp,
      HOLLOW_TEXT.waypointButton,
      () => {
        this.dialog.hide();
        this.waypoints.open();
      },
      world.hollow.waypoints.length > 0,
    );
    row(HOLLOW_TEXT.newPaths, HOLLOW_TEXT.newPathsHelp, HOLLOW_TEXT.newPaths, () => {
      this.game()?.send({ kind: 'rerollActs' });
      this.close();
    });
    const { bundle, price } = HOLLOW.acorns;
    row(
      HOLLOW_TEXT.acornsTitle,
      HOLLOW_TEXT.acornsHelp(world.hollow.acorns, bundle, price),
      HOLLOW_TEXT.acornsBuy,
      () => {
        const g = this.game();
        if (!g) return;
        g.send({ kind: 'buyAcorns' });
        this.listTravel(g.world);
      },
      world.inventory.shells >= price,
    );
  }

  /** R0184: End trip, with a confirm when finds are unbanked or the trip is deep. */
  private endTrip(): void {
    const run = this.game()?.world.dungeon;
    if (!run) return;
    const sack = sackCount(run);
    if (sack === 0 && run.depth <= 1) {
      this.game()?.send({ kind: 'leaveDungeon' });
      return;
    }
    this.endText.textContent = HOLLOW_R6_TEXT.endConfirm(sack, run.depth);
    this.endDialog.show();
  }

  private enter(daily: boolean): void {
    const g = this.game();
    if (!g) return;
    this.close();
    g.send({ kind: 'enterDungeon', daily });
  }
}

/** R0180: a pack the party has lost to often enough, still about and not yet sneaked past. */
function sneakable(run: DungeonRun | null, now: number): string | null {
  if (!run?.packLosses) return null;
  for (const [id, n] of Object.entries(run.packLosses)) {
    if (n < HOLLOW_R6.sneakAfter || (run.sneakUntil?.[id] ?? -1) > now) continue;
    if (run.packs?.some((p) => p.id === id && p.state !== 'beaten')) return id;
  }
  return null;
}

const ARROWS = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'] as const;

/** R0208: "👣 Stairs ↗" from the guide's path, or null with the guide off or nowhere to go. */
function guideHint(world: World, yaw: number): string | null {
  const path = guidePath(world);
  const f = runFloor(world);
  const at = path ? lookAheadCell(path) : undefined;
  if (!path || !f || at === undefined || path.cells.length < 2) return null;
  const p = cellCentre(f, { x: at % f.cols, y: Math.floor(at / f.cols) });
  const k = world.keeper.pos;
  const b = screenBearing(p.x - k.x, p.z - k.z, yaw);
  const arrow = ARROWS[Math.round(b / (Math.PI / 4)) % 8]!;
  return path.goal === 'stairs'
    ? HOLLOW_R8_TEXT.guideStairs(arrow)
    : HOLLOW_R8_TEXT.guideExplore(arrow);
}
