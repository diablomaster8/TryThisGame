import { ACTS } from '../config/dungeon-acts';
import { ACT_TEXT, DUNGEON_TEXT, HOLLOW_TEXT, UI_TEXT } from '../config/strings';
import { actOpen } from '../sim/dungeon-acts';
import type { Game } from '../game';
import { partyIds } from '../sim/dungeon';
import type { World } from '../sim/types';
import { button, el, modal } from './dom';
import { HollowMap } from './hollow-map';
import { BuffRing } from './dungeon-buffs';
import { WaypointPanel } from './waypoint-panel';
import { HOLLOW } from '../config/tuning';
import { campPortalHere, canUseAcorn, standingOnWaypoint } from '../sim/dungeon-travel';
import { parseLevelId } from '../sim/dungeon-levels';
import { HOLLOW_ZONE_TEXT, RUMBLE_TEXT } from '../config/strings';
import { serviceHere } from '../sim/dungeon-towns';
import { mouthHere } from '../sim/dungeon-zones';
import { TownPanel } from './dungeon-town';
import { PartyPicker } from './dungeon-party';

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
  /** Who comes along (R0168). */
  private readonly party: PartyPicker;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
  ) {
    this.dialog = modal(parent, DUNGEON_TEXT.title, UI_TEXT.close);
    this.dialog.body.appendChild(el('p', 'help', DUNGEON_TEXT.help));
    this.info = el('div', 'shop-note');
    this.dialog.body.appendChild(this.info);
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
      button(
        DUNGEON_TEXT.leave,
        () => this.game()?.send({ kind: 'leaveDungeon' }),
        'btn btn-small',
      ),
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
    this.party.render(g.world, partyIds(g.world));
    this.listActs(g.world);
    this.listTravel(g.world);
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
    this.waypoints.close();
    this.town.close();
  }

  isOpen(): boolean {
    return this.dialog.isOpen() || this.waypoints.isOpen() || this.town.isOpen();
  }

  /** Called every frame by the HUD: the underground bar follows the run. */
  refresh(world: World): void {
    const run = world.location === 'dungeon' ? world.dungeon : null;
    this.bar.hidden = !run;
    // The overlay map turns with the camera (R0154).
    this.map.refresh(world, this.game()?.camera.currentYaw ?? 0);
    this.buffs.refresh(run);
    this.town.refresh(world);
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
    this.calmBtn.hidden = this.snackBtn.hidden = !run.strayAsk;
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
  }

  private listActs(world: World): void {
    this.acts.replaceChildren();
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

  private enter(daily: boolean): void {
    const g = this.game();
    if (!g) return;
    this.close();
    g.send({ kind: 'enterDungeon', daily });
  }
}
