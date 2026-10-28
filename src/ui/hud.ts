import { CAMERA, GROVE, INPUT, UI } from '../config/tuning';
import { ACTS } from '../config/dungeon-acts';
import { KEEPER_JUMP_FX, UNREACHABLE } from '../config/tuning-move';
import { MOVE_TEXT } from '../config/strings-move';
import { ACHIEVEMENT_LIST } from '../sim/achievements';
import { SKILL_LIST } from '../sim/skills';
import {
  GROVE_LABELS,
  NAMES,
  SPECIES_LABELS,
  TRAINER_LABELS,
  TYPE_LABELS,
  UI_TEXT,
  DUNGEON_TEXT,
  HOLLOW_TEXT,
  ACT_TEXT,
} from '../config/strings';
import { BOUT_TEXT_SHEET, moveName } from '../config/strings-battle';
import type { Game, GameHooks } from '../game';
import type { AwayReport, GroveKind, SimEvent } from '../sim/types';
import { ExpeditionScreen } from '../minigames/expedition/screen';
import {
  playChirp,
  playSong,
  playSound,
  setAmbience,
  setAmbienceEnabled,
  setMusicEnabled,
  SONG_NAMES,
  type SongName,
  setMusicVolume,
  setSfxVolume,
  setSoundEnabled,
} from '../platform/audio';
import { localHour, phaseAt } from '../render/daylight';
import type { Nubbin } from '../sim/types';
import { AwayScreen } from './away-screen';
import { Celebration } from './celebration';
import { DebugPanel } from './debug-panel';
import { askGrownUp } from './grown-up-gate';
import { JOYSTICK_TUNING } from '../config/tuning-move-joy';
import { JOYSTICK_TEXT } from '../config/strings-move-joy';
import { Joystick } from './joystick';
import { RacesMenu } from './races';
import { holdRenderWhile } from './render-hold';
import { RosterMenu } from './roster';
import { ShopMenu } from './shop';
import { TrainersMenu } from './trainers';
import { button, el } from './dom';
import { isGameKey, isTypingTarget } from '../input/keys';
import { SettingsMenu } from './settings';
import { StatsSheet } from './stats-sheet';
import { Dialogue } from './dialogue';
import { Journal } from './journal';
import { PartyBoutPanel } from './party-bout';
import { STORYLINE_TEXT } from '../config/strings';
import { boutTier, loggedPartyIds } from '../sim/storyline-rules-logged';
import { chapterTitle } from '../sim/storyline';
import { STORY_TEXT } from '../config/story';
import { KindergartenMenu } from './kindergarten';
import { KarateMenu } from './karate';
import { CollectionBook, keyLabel, MemorialCard } from './collection';
import { snapYaw } from '../sim/decorate';
import { DecorateMenu, placingLabel } from './decorate';
import { MapPanel, NeighbourhoodPanel, ProfilePanel, QuestBoard } from './garden-panels';
import { BreakScreen, EduScreen, GrownUpPanel } from './edu';
import { GymMenu } from './gym';
import { DungeonMenu } from './dungeon';
import { TankScreen } from '../minigames/tank/screen';
import { TEN_TEXT, STAT_LABELS } from '../config/strings';
import { EDU_TEXT } from '../config/strings';
import { eduBreakActive, eduBreakDue } from '../sim/edu';
import { speciesOf } from '../sim/species';
import { PhotoMode } from './photo';
import { PocketMode } from './pocket';
import { modal } from './dom';
import { showCrashCard } from './gl-failure';
import { mountPanelStack } from './panel-stack';
import { ATLAS_TEXT } from '../config/strings';
import { LANG_TEXT } from '../config/strings';
import { langWord } from '../sim/lang';
import { visitingTrainer } from '../sim/neighbourhood';
import { loadArcade, loadAtlas, loadMultiverse, loadNeopia } from '../sim/atlas';
import { currentSlot, storageAvailable } from '../platform/storage';
import { armPersistRequest } from '../platform/persist';
import { announceFestivals, StoryShelf } from './atlas';
import { askRift } from './rift-confirm';
import { TRAINER_LABELS as TL } from '../config/strings';
import { UI_FX_TEXT } from '../config/strings-ui';
import { TOASTS } from '../config/tuning-ui';
import { EduPrompt, ObjectiveChip } from './objective';
import { mountCompass } from './compass';
import { mountMinimap } from './minimap';

/** MOVE-35: when the last "Can't get there" toast showed (performance clock). */
let lastUnreachableToast = -Infinity;

/**
 * The HUD: top bar (logo, shells, fruit, settings), carry chip, toasts, and the panels.
 * Everything here only reads world state and sends commands.
 */
export function mountHud(
  root: HTMLElement,
  game: () => Game | null,
): { hooks: GameHooks; bind(g: Game): void } {
  // Top bar.
  const top = el('div', 'topbar');
  const logo = button(NAMES.game, () => onLogoTap(), 'btn btn-logo');
  const shells = el('span', 'chip', '');
  const fruit = el('span', 'chip', '');
  const moreBtn = button('⋯', () => more.show(), 'btn btn-icon');
  moreBtn.setAttribute('aria-label', UI_TEXT.more);
  moreBtn.title = UI_TEXT.more;
  // In the Learning Grove, Settings (reset, import, aging) is for grown-ups: a sum first.
  const settingsBtn = button(
    '⚙',
    () => {
      if (!game()?.world.edu) settings.open();
      else void askGrownUp(root, toast).then((ok) => ok && settings.open());
    },
    'btn btn-icon',
  );
  settingsBtn.setAttribute('aria-label', UI_TEXT.settings);
  // Learning Grove: sound on/off stays one tap away for a child, outside the grown-up gate.
  const soundBtn = button(
    '🔊',
    () => {
      const g = game();
      if (!g?.world.edu) return;
      const on = !g.world.settings.sound;
      g.send({ kind: 'setSettings', settings: { ...g.world.settings, sound: on, music: on } });
      setSoundEnabled(on);
      setMusicEnabled(on);
    },
    'btn btn-icon',
  );
  soundBtn.hidden = true;
  soundBtn.setAttribute('aria-label', UI_TEXT.sound);
  const keeperBtn = button('☀', () => trainers.open(), 'btn btn-icon');
  keeperBtn.setAttribute('aria-label', UI_TEXT.trainers);
  keeperBtn.title = UI_TEXT.trainers;
  const groveBtn = button(GROVE_LABELS.main, () => cycleGrove(), 'btn btn-small');
  groveBtn.hidden = true;
  const shopBtn = button('🛒', () => shop.open(), 'btn btn-icon');
  shopBtn.setAttribute('aria-label', UI_TEXT.shop);
  shopBtn.title = UI_TEXT.shop;
  // The compass, not the runner: 🏃 is the Run button's (review C, item 23).
  const expeditionBtn = button(
    '🧭',
    () => {
      if (game()?.world.edu) edu.open();
      else startExpedition();
    },
    'btn btn-icon',
  );
  expeditionBtn.setAttribute('aria-label', UI_TEXT.expedition);
  expeditionBtn.title = UI_TEXT.expedition;
  const racesBtn = button('🏁', () => races.open(), 'btn btn-icon');
  racesBtn.setAttribute('aria-label', UI_TEXT.races);
  racesBtn.title = UI_TEXT.races;
  const journalBtn = button('📖', () => journal.open(), 'btn btn-icon');
  journalBtn.setAttribute('aria-label', STORY_TEXT.journal);
  journalBtn.title = STORY_TEXT.journal;
  journalBtn.hidden = true;
  const rosterBtn = button('📋', () => roster.open(), 'btn btn-icon');
  rosterBtn.setAttribute('aria-label', UI_TEXT.roster);
  rosterBtn.title = UI_TEXT.roster;
  // The menu buttons: inline in the top bar on wide screens, a bottom bar within thumb
  // reach in phone portrait (style.css, .actionbar).
  const actions = el('div', 'actionbar');
  actions.setAttribute('role', 'toolbar');
  actions.setAttribute('aria-label', UI_TEXT.menu);
  actions.append(
    journalBtn,
    rosterBtn,
    moreBtn,
    expeditionBtn,
    racesBtn,
    shopBtn,
    keeperBtn,
    settingsBtn,
  );
  labelActions([
    [journalBtn, '📖', UI_FX_TEXT.actionLabels.journal],
    [rosterBtn, '📋', UI_FX_TEXT.actionLabels.roster],
    [moreBtn, '⋯', UI_FX_TEXT.actionLabels.more],
    [expeditionBtn, '🧭', UI_FX_TEXT.actionLabels.expedition],
    [racesBtn, '🏁', UI_FX_TEXT.actionLabels.races],
    [shopBtn, '🛒', UI_FX_TEXT.actionLabels.shop],
    [keeperBtn, '☀', UI_FX_TEXT.actionLabels.keeper],
    [settingsBtn, '⚙', UI_FX_TEXT.actionLabels.settings],
  ]);
  top.append(logo, shells, fruit, groveBtn, soundBtn, actions);
  root.appendChild(top);

  // Run: a toggle on screen, or hold Shift on a keyboard.
  const runBtn = button(`🏃 ${UI_TEXT.run}`, () => setRunning(!runOn), 'btn run-btn');
  runBtn.title = UI_TEXT.runHelp;
  let runOn = false;
  function setRunning(on: boolean): void {
    runOn = on;
    runBtn.classList.toggle('active', on);
    game()?.send({ kind: 'setRunning', running: on });
  }
  root.appendChild(runBtn);

  // Jump (MOVE-14): a thumb button on touch screens, Space on a keyboard. It reacts on
  // pointerdown, with no click delay; holding it holds the jump higher. With something in
  // hand it shakes that instead, and says so (MOVE-22).
  const jumpBtn = el('button', 'btn jump-btn');
  jumpBtn.type = 'button';
  jumpBtn.setAttribute('aria-label', UI_TEXT.jump);
  jumpBtn.textContent = '⤒';
  let jumpPointer: number | null = null;
  jumpBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    jumpPointer = e.pointerId;
    try {
      jumpBtn.setPointerCapture(e.pointerId);
    } catch {
      // A pointer already gone cannot be captured; its release still ends the jump.
    }
    game()?.send({ kind: 'jump', down: true });
  });
  const jumpUp = (e: PointerEvent): void => {
    if (e.pointerId !== jumpPointer) return;
    jumpPointer = null;
    game()?.send({ kind: 'jump', down: false });
  };
  jumpBtn.addEventListener('pointerup', jumpUp);
  jumpBtn.addEventListener('pointercancel', jumpUp);
  root.appendChild(jumpBtn);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Shift' && !e.repeat && !isTypingTarget(e.target)) setRunning(true);
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') setRunning(false);
  });

  /** The Nubbin that goes on Expeditions and races: the selected one, else the first grown one. */
  function pickRunner(): Nubbin | null {
    const g = game();
    if (!g) return null;
    const selected = g.world.selected
      ? g.world.nubbins.find((n) => n.id === g.world.selected)
      : null;
    if (selected && selected.stage !== 'egg' && selected.stage !== 'cocoon') return selected;
    return g.world.nubbins.find((n) => n.stage === 'child' || n.stage === 'adult') ?? null;
  }

  /** A place name, including a neighbour's Grove. */
  function locationLabel(loc: string): string {
    if (loc.startsWith('visit:')) {
      const t = loc.slice('visit:'.length);
      return `${TL[t]?.name ?? t}’s Grove`;
    }
    return (UI_TEXT.location as Record<string, string>)[loc] ?? loc;
  }

  function startExpedition(): void {
    const g = game();
    if (!g || expedition.isOpen) return;
    const runner = pickRunner();
    if (!runner) {
      toast(UI_TEXT.expeditionNeedsNubbin, UI.toastLongMs);
      return;
    }
    sheet.close();
    g.renderPaused = true;
    expedition.start(
      runner,
      g.view.sheets.forNubbin(runner),
      Date.now() % 2147483647,
      (rewards) => {
        g.renderPaused = false;
        g.send({ kind: 'addRewards', rewards });
      },
      g.world.location === 'hollow' || g.world.campaign?.chapter === 8 ? 'hollow' : 'meadow',
      g.graphics,
      g.scene3d,
    );
  }

  function cycleGrove(): void {
    const g = game();
    if (!g) return;
    const order: GroveKind[] = ['main'];
    if (g.world.unlocks.sunGrove) order.push('sun');
    if (g.world.unlocks.moonGrove) order.push('moon');
    const i = order.indexOf(g.world.grove);
    g.send({ kind: 'setGrove', grove: order[(i + 1) % order.length] ?? 'main' });
  }

  // Carry chip.
  const carry = el('div', 'carry');
  carry.hidden = true;
  const carryText = el('span');
  const putDown = button(UI_TEXT.putDown, () => game()?.send({ kind: 'putDown' }), 'btn btn-small');
  carry.append(carryText, putDown);
  root.appendChild(carry);

  // Toasts.
  const toasts = el('div', 'toasts');
  root.appendChild(toasts);
  // The toast row sits under the top bar, which wraps to two rows on a phone.
  const placeToasts = (): void => {
    const bottom = Math.ceil(top.getBoundingClientRect().bottom);
    root.style.setProperty('--toast-top', `${bottom + 6}px`);
    // The Hollow's floor bar sits under the top bar however many rows it wraps to.
    root.style.setProperty('--topbar-bottom', `${bottom}px`);
  };
  new ResizeObserver(placeToasts).observe(top);
  window.addEventListener('resize', placeToasts);
  placeToasts();
  // Read out politely by screen readers; each toast is added as a new node.
  toasts.setAttribute('role', 'status');
  toasts.setAttribute('aria-live', 'polite');
  const toast = makeToaster(toasts);

  // Catch-up overlay.
  const catching = el('div', 'catching', UI_TEXT.catchingUp);
  catching.hidden = true;
  catching.setAttribute('role', 'status');
  root.appendChild(catching);

  // Blocked storage stays on screen, not one passing toast (review C, item 11): a small chip
  // that says why when tapped.
  const storageChip = button(
    UI_TEXT.storageBlockedChip,
    () => toast(UI_TEXT.storageBlockedTitle),
    'storage-chip',
  );
  storageChip.title = UI_TEXT.storageBlockedTitle;
  storageChip.setAttribute('aria-label', UI_TEXT.storageBlockedTitle);
  storageChip.hidden = storageAvailable();
  root.appendChild(storageChip);

  const sheet = new StatsSheet(root, game, toast);
  const settings = new SettingsMenu(root, game, toast);
  const away = new AwayScreen(root);
  // The debug panel only mounts in dev builds, or in a production build opened with `?debug`.
  const debugEnabled = import.meta.env.DEV || new URLSearchParams(location.search).has('debug');
  const debug = debugEnabled ? new DebugPanel(root, game, () => sheet.selectedId) : null;
  const celebration = new Celebration(root, game);
  const shop = new ShopMenu(root, game, toast);
  const expedition = new ExpeditionScreen(root);
  const races = new RacesMenu(root, game, (t) => toast(t, UI.toastLongMs), pickRunner);
  const roster = new RosterMenu(root, game, (id) => sheet.open(id));
  const trainers = new TrainersMenu(root, game, toast);
  const dialogue = new Dialogue(root, game);
  const journal = new Journal(root, game);
  const partyBout = new PartyBoutPanel(root, game, toast);
  journal.openers.partyBout = () => {
    const g = game();
    const c = g?.world.campaign;
    if (g && c) partyBout.open(loggedPartyIds(c), boutTier(c));
  };
  const kindergarten = new KindergartenMenu(root, game, () => sheet.selectedId, toast);
  const karate = new KarateMenu(root, game, toast, pickRunner);
  const book = new CollectionBook(root, game);
  const memorialCard = new MemorialCard(root, game);
  const decorate = new DecorateMenu(root, game, toast);
  const photo = new PhotoMode(root, game, () => sheet.selectedId);
  const pocket = new PocketMode(root, game);
  const quests = new QuestBoard(root, game);
  const profile = new ProfilePanel(root, game);
  const neighbourhood = new NeighbourhoodPanel(root, game, toast);
  const map = new MapPanel(root, game, toast);
  mountCompass(root, game, () => map.open());
  mountMinimap(root, game, () => map.open());
  const edu = new EduScreen(root, game, toast);
  // r1025 items 3 and 4: what to do next, and the Learning Grove's story prompt.
  const objective = new ObjectiveChip(
    root,
    game,
    { journal: () => journal.open(), shop: () => shop.open() },
    toast,
  );
  const eduPrompt = new EduPrompt(root, game, {
    journal: () => journal.open(),
    play: () => edu.open(),
  });
  const grownUps = new GrownUpPanel(root, game, toast);
  const breakScreen = new BreakScreen(
    root,
    game,
    () => askGrownUp(root, toast),
    () => grownUps.open(),
  );
  const gym = new GymMenu(root, game, toast, pickRunner);
  const dungeon = new DungeonMenu(root, game);
  const tank = new TankScreen(root);
  const atlas = new StoryShelf(root, game, dialogue, toast, {
    which: 'atlas',
    title: ATLAS_TEXT.atlas,
    help: ATLAS_TEXT.atlasHelp,
    empty: ATLAS_TEXT.noPages,
    load: loadAtlas,
  });
  const cabinet = new StoryShelf(root, game, dialogue, toast, {
    which: 'arcade',
    title: ATLAS_TEXT.cabinet,
    help: ATLAS_TEXT.cabinetHelp,
    empty: ATLAS_TEXT.noCarts,
    load: loadArcade,
  });
  // The Multiverse is adult throughout: shown only at Mature content 18+, with the
  // one-time age check before the rift first opens.
  const rift = new StoryShelf(root, game, dialogue, toast, {
    which: 'multiverse',
    title: ATLAS_TEXT.rift,
    help: ATLAS_TEXT.riftHelp,
    empty: ATLAS_TEXT.noRift,
    load: loadMultiverse,
    gate: () => {
      const g = game();
      return g ? askRift(root, g) : Promise.resolve(false);
    },
  });
  const neoGate = new StoryShelf(root, game, dialogue, toast, {
    which: 'neopia',
    title: ATLAS_TEXT.gate,
    help: ATLAS_TEXT.gateHelp,
    empty: ATLAS_TEXT.noGate,
    load: loadNeopia,
  });
  function startTank(): void {
    const g = game();
    if (!g || tank.isOpen) return;
    sheet.close();
    g.renderPaused = true;
    tank.start(Date.now() % 2147483647, (s) => {
      g.renderPaused = false;
      g.send({
        kind: 'tankResult',
        shells: s.cargo.shells,
        wood: s.cargo.wood,
        stone: s.cargo.stone,
        won: s.won,
      });
    });
  }
  // The "More" menu holds everything that does not fit the top bar.
  const more = modal(root, UI_TEXT.more, UI_TEXT.close);
  more.body.appendChild(el('p', 'help', UI_TEXT.moreHelp));
  const moreList = el('div', 'title-menu');
  for (const [label, open] of [
    [`🏫 ${UI_TEXT.kindergarten}`, () => kindergarten.open()],
    [`🥋 ${UI_TEXT.karate}`, () => karate.open()],
    [`📔 ${UI_TEXT.collection}`, () => book.open()],
    [`🪴 ${UI_TEXT.decorate}`, () => decorate.open()],
    [`📷 ${UI_TEXT.photo}`, () => photo.open()],
    [`👜 ${UI_TEXT.pocket}`, () => pocket.open(sheet.selectedId)],
    [`🏋 ${TEN_TEXT.gym}`, () => gym.open()],
    [`🪲 ${TEN_TEXT.tank}`, () => startTank()],
    [`🕳 ${DUNGEON_TEXT.title}`, () => dungeon.open()],
    [`📕 ${ATLAS_TEXT.atlas}`, () => atlas.open()],
    [`🕹 ${ATLAS_TEXT.cabinet}`, () => cabinet.open()],
    [`🌀 ${ATLAS_TEXT.rift}`, () => rift.open()],
    [`🌈 ${ATLAS_TEXT.gate}`, () => neoGate.open()],
    [`📜 ${UI_TEXT.quests}`, () => quests.open()],
    [`🎖 ${UI_TEXT.profile}`, () => profile.open()],
    [`🏡 ${UI_TEXT.neighbourhood}`, () => neighbourhood.open()],
    [`🗺 ${UI_TEXT.map}`, () => map.open()],
    [`🔁 ${UI_TEXT.receive}`, () => roster.receive()],
    [`🧑‍🏫 ${EDU_TEXT.grownUps}`, () => grownUps.open()],
  ] as const) {
    const isEdu = label.includes(EDU_TEXT.grownUps);
    // Receiving a stranger's code is not for the Learning Grove (review C, items 2 and 24).
    const isKarate = label.includes(UI_TEXT.karate) || label.includes(UI_TEXT.receive);
    const isRift = label.includes(ATLAS_TEXT.rift);
    const isGate = label.includes(ATLAS_TEXT.gate);
    const isCabinet = label.includes(ATLAS_TEXT.cabinet);
    const isSide = label.includes(ATLAS_TEXT.atlas) || isCabinet || isRift || isGate;
    moreList.appendChild(
      button(
        label,
        () => {
          more.hide();
          open();
        },
        `btn btn-wide${isEdu ? ' edu-only' : isKarate || isSide ? ' not-edu' : ''}${isCabinet ? ' cabinet' : ''}${isRift ? ' rift' : ''}${isGate ? ' neo-gate' : ''}`,
      ),
    );
  }
  more.body.appendChild(moreList);
  // Placing chip while decorating.
  const placingChip = el('div', 'placing-chip');
  placingChip.hidden = true;
  const placingText = el('span');
  // Decor turns in eighths before it goes down, so fence runs can go any way (MOVE-04).
  const rotateBtn = button(
    `↻ ${UI_TEXT.rotatePiece}`,
    () => {
      const g = game();
      const p = g?.placing;
      if (g && p?.mode === 'decor') g.placing = { ...p, yaw: snapYaw((p.yaw ?? 0) + Math.PI / 4) };
    },
    'btn btn-small',
  );
  placingChip.append(
    placingText,
    rotateBtn,
    button(
      UI_TEXT.donePlacing,
      () => {
        const g = game();
        if (g) g.placing = null;
      },
      'btn btn-small',
    ),
  );
  root.appendChild(placingChip);
  // Visiting a neighbour: the way home stays on screen, not three menus deep (bug 28).
  const goHome = (): void => game()?.send({ kind: 'visit', trainer: null });
  const homeBtn = button(`🏡 ${UI_TEXT.goHome}`, goHome, 'btn home-btn');
  homeBtn.hidden = true;
  root.appendChild(homeBtn);
  let joystick: Joystick | null = null;
  // The first touch offers the floating joystick once, in a toast (R0028).
  const offerJoystick = (e: PointerEvent): void => {
    if (e.pointerType !== 'touch') return;
    window.removeEventListener('pointerdown', offerJoystick, true);
    try {
      if (localStorage.getItem(JOYSTICK_TUNING.offerKey)) return;
      localStorage.setItem(JOYSTICK_TUNING.offerKey, '1');
    } catch {
      /* storage blocked: offer it this session only */
    }
    if (!game()?.world.settings.joystick) toast(JOYSTICK_TEXT.offer, UI.toastLongMs);
  };
  window.addEventListener('pointerdown', offerJoystick, true);
  // The Grove whose festivals were last checked against the side saves.
  let festivalsFor: unknown = null;
  if (import.meta.env.DEV) {
    // Console access during development, alongside `window.grove`.
    (window as unknown as { groveUi: unknown }).groveUi = {
      shop,
      expedition,
      sheet,
      debug,
      races,
      roster,
      dialogue,
      journal,
      kindergarten,
      karate,
      book,
      decorate,
      photo,
      pocket,
      quests,
      profile,
      neighbourhood,
      map,
      settings,
      edu,
      grownUps,
      breakScreen,
      gym,
      tank,
      dungeon,
      atlas,
      cabinet,
      rift,
      neoGate,
    };
  }

  // One full panel at a time (B3). Story scenes, the away screen and celebrations are
  // deliberately layered and stay outside the stack. Running minigames have no `close`, so
  // a menu opened over one (Races over Beetle Run) is shut instead of stacking under it.
  const stack = mountPanelStack(
    root,
    [
      { isOpen: () => settings.isOpen(), close: () => settings.close() },
      { isOpen: () => shop.isOpen(), close: () => shop.close() },
      { isOpen: () => races.isOpen(), close: () => races.close() },
      { isOpen: () => roster.isOpen(), close: () => roster.close() },
      { isOpen: () => trainers.isOpen(), close: () => trainers.close() },
      { isOpen: () => journal.isOpen(), close: () => journal.close() },
      { isOpen: () => partyBout.isOpen(), close: () => partyBout.close() },
      { isOpen: () => kindergarten.isOpen(), close: () => kindergarten.close() },
      { isOpen: () => karate.isOpen(), close: () => karate.close() },
      { isOpen: () => book.isOpen(), close: () => book.close() },
      { isOpen: () => decorate.isOpen(), close: () => decorate.close() },
      { isOpen: () => photo.isOpen(), close: () => photo.close() },
      { isOpen: () => pocket.isOpen, close: () => pocket.close() },
      { isOpen: () => quests.isOpen(), close: () => quests.close() },
      { isOpen: () => profile.isOpen(), close: () => profile.close() },
      { isOpen: () => neighbourhood.isOpen(), close: () => neighbourhood.close() },
      { isOpen: () => map.isOpen(), close: () => map.close() },
      { isOpen: () => grownUps.isOpen(), close: () => grownUps.close() },
      { isOpen: () => gym.isOpen(), close: () => gym.close() },
      { isOpen: () => atlas.isOpen(), close: () => atlas.close() },
      { isOpen: () => cabinet.isOpen(), close: () => cabinet.close() },
      { isOpen: () => rift.isOpen(), close: () => rift.close() },
      { isOpen: () => neoGate.isOpen(), close: () => neoGate.close() },
      { isOpen: () => more.isOpen(), close: () => more.hide() },
      { isOpen: () => !sheet.root.hidden, close: () => sheet.close() },
      { isOpen: () => expedition.isOpen },
      { isOpen: () => tank.isOpen },
      { isOpen: () => races.screen.isOpen },
      { isOpen: () => karate.screen.isOpen },
      { isOpen: () => gym.screen.isOpen },
    ],
    () => dialogue.sync(),
  );
  // A story scene waits on its line under any panel, sheet or notice: the panel takes the
  // taps, and the scene picks up where it was once the last one closes (review 2026-10-18).
  // The debug panel is deliberately not one of them: it stays open through time-skips, and
  // a scene under it must keep taking taps (review B, bug 25).
  // r1025 item 2: a Grove scene takes the screen; the panels and the sheet close first, so
  // nothing sits over it and no focused sheet button keeps Space and Enter.
  dialogue.onStart = (external) => {
    eduPrompt.hide();
    if (!external) stack.closeAll();
  };
  dialogue.waitWhile(
    () =>
      stack.anyOpen() ||
      away.isOpen ||
      celebration.isOpen ||
      memorialCard.isOpen() ||
      journal.isTracing() ||
      edu.isOpen() ||
      breakScreen.isOpen() ||
      !catching.hidden,
  );

  // Triple-tap the logo, or press backtick, for the debug panel.
  let logoTaps: number[] = [];
  function onLogoTap(): void {
    const now = performance.now();
    logoTaps = logoTaps.filter((t) => now - t < INPUT.tripleTapMs);
    logoTaps.push(now);
    if (logoTaps.length >= 3) {
      logoTaps = [];
      debug?.toggle();
    }
  }
  window.addEventListener('keydown', (e) => {
    // PC: F toggles fullscreen.
    if (e.key === 'f' && isGameKey(e) && !e.repeat) {
      const el = document.documentElement;
      if (document.fullscreenElement) void document.exitFullscreen?.().catch(() => undefined);
      else void el.requestFullscreen?.().catch(() => undefined);
    }
    if (e.key === '`' && isGameKey(e)) {
      e.preventDefault();
      debug?.toggle();
    }
    if (e.key === 'Escape') {
      if (away.isOpen) away.hide();
      else if (settings.isOpen()) settings.close();
      else if (shop.isOpen()) shop.close();
      else if (races.isOpen()) races.close();
      else if (roster.isOpen()) roster.close();
      else if (trainers.isOpen()) trainers.close();
      else if (journal.isOpen()) journal.close();
      else if (kindergarten.isOpen()) kindergarten.close();
      else if (karate.isOpen()) karate.close();
      else if (book.isOpen()) book.close();
      else if (memorialCard.isOpen()) memorialCard.close();
      else if (decorate.isOpen()) decorate.close();
      else if (photo.isOpen()) photo.close();
      else if (pocket.isOpen) pocket.close();
      else if (quests.isOpen()) quests.close();
      else if (profile.isOpen()) profile.close();
      else if (neighbourhood.isOpen()) neighbourhood.close();
      else if (map.isOpen()) map.close();
      else if (edu.isOpen()) edu.close();
      else if (grownUps.isOpen()) grownUps.close();
      else if (gym.isOpen()) gym.close();
      // The story shelves, the Hollow menu and the party bout (review C, item 27).
      else if (atlas.isOpen()) atlas.close();
      else if (cabinet.isOpen()) cabinet.close();
      else if (rift.isOpen()) rift.close();
      else if (neoGate.isOpen()) neoGate.close();
      else if (dungeon.isOpen()) dungeon.close();
      else if (partyBout.isOpen()) partyBout.close();
      else if (more.isOpen()) more.hide();
      else if (!sheet.root.hidden) sheet.close();
      // Nothing open: Esc leaves a neighbour's Grove.
      else {
        const g = game();
        if (g && visitingTrainer(g.world) && !dialogue.isOpen) goHome();
      }
    }
  });

  /** A season's festival toast, held until no story scene is on or waiting. */
  let heldFestival: string | null = null;
  // Periodic refresh of live panels.
  let refreshTimer = 0;
  function refreshLoop(): void {
    const g = game();
    if (g) {
      shells.textContent = `🐚 ${g.world.inventory.shells}`;
      fruit.textContent = `🍎 ${g.world.inventory.fruit}`;
      setActionGlyph(keeperBtn, g.world.keeper.alignment === 'sun' ? '☀' : '☾');
      if (!joystick) {
        joystick = new Joystick(root, g.camera, (cmd) => g.send(cmd), {
          set: setRunning,
          isOn: () => runOn,
        });
        g.framePollers.push(() => joystick?.poll());
      }
      joystick.setVisible(g.world.settings.joystick);
      const anyUnlocked = g.world.unlocks.sunGrove || g.world.unlocks.moonGrove;
      groveBtn.hidden = !anyUnlocked;
      groveBtn.textContent = GROVE_LABELS[g.world.grove];
      const carrying = g.world.keeper.carrying;
      const shakes = !!carrying || g.world.nubbins.some((n) => n.behavior.state === 'held');
      const jumpGlyph = shakes ? '🥚' : '⤒';
      if (jumpBtn.textContent !== jumpGlyph) {
        jumpBtn.textContent = jumpGlyph;
        jumpBtn.setAttribute('aria-label', shakes ? UI_TEXT.shake : UI_TEXT.jump);
      }
      carry.hidden = !carrying;
      if (carrying) {
        const n = g.world.nubbins.find((x) => x.id === carrying);
        carryText.textContent = UI_TEXT.carrying(n?.name ?? NAMES.creature);
      }
      if (!sheet.root.hidden) sheet.refresh();
      shop.refresh();
      debug?.refresh();
      // Story scenes wait their turn behind other panels.
      const c = g.world.campaign;
      journalBtn.hidden = !c;
      // Which piece plays: story over dialogue, the minigames their own, else the hour's.
      setMusicEnabled(g.world.settings.music);
      setMusicVolume(g.world.settings.musicVolume);
      setSfxVolume(g.world.settings.sfxVolume);
      const chapter = c?.chapter ?? 0;
      if (dialogue.isOpen) {
        playSong(
          chapter === 6 || chapter === 11 || chapter === 13
            ? 'sorrow'
            : chapter === 5 || chapter === 9
              ? 'tense'
              : 'story',
        );
      } else if (expedition.isOpen) playSong('expedition');
      else if (races.screen.isOpen) playSong('race');
      else if (karate.screen.isOpen) playSong('karate');
      else if (gym.screen.isOpen) playSong('karate');
      else if (tank.isOpen) playSong('expedition');
      else if (
        g.world.settings.jukebox &&
        SONG_NAMES.includes(g.world.settings.jukebox as SongName)
      ) {
        playSong(g.world.settings.jukebox as SongName);
      } else if (g.world.location === 'hollow' || g.world.location === 'dungeon')
        playSong('hollow');
      else if (g.world.location === 'corvin') playSong('tense');
      else {
        const phase = phaseAt(g.hourOverride ?? localHour()).phase;
        playSong(phase === 'night' || phase === 'dusk' ? 'night' : 'grove');
      }
      // The ambient layer follows the hour, the weather and where the Keeper stands.
      setAmbienceEnabled(g.world.settings.ambience);
      {
        const phase = phaseAt(g.hourOverride ?? localHour()).phase;
        const kp = g.world.keeper.pos;
        const nearStream =
          g.world.location === 'grove' &&
          (Math.hypot(kp.x - GROVE.waterfall.x, kp.z - GROVE.waterfall.z) < 9 ||
            Math.abs(kp.x - 9) < 3.5);
        const inSide =
          g.world.location === 'hollow' ||
          g.world.location === 'corvin' ||
          g.world.location === 'dungeon';
        holdRenderWhile(
          g,
          dialogue.isOpen || away.isOpen || photo.isOpen(),
          `${g.world.location}|${g.world.campaign?.queue[0] ?? ''}|${dialogue.speaker ?? ''}|${dialogue.line > 0}`,
        );
        setAmbience(
          dialogue.isOpen || expedition.isOpen || races.screen.isOpen || karate.screen.isOpen
            ? null
            : {
                phase: phase === 'night' || phase === 'dusk' ? 'night' : 'day',
                weather: inSide ? 'clear' : g.world.weather.kind,
                stream: nearStream,
              },
        );
      }
      if (quests.isOpen() && Math.random() < 0.1) quests.refresh();
      // Learning Grove: no races or karate; the 🧭 button is the games; breaks on time.
      const isEdu = !!g.world.edu;
      racesBtn.hidden = isEdu;
      dungeon.refresh(g.world);
      expeditionBtn.title = isEdu ? EDU_TEXT.play : UI_TEXT.expedition;
      expeditionBtn.setAttribute('aria-label', expeditionBtn.title);
      setActionGlyph(expeditionBtn, isEdu ? '🎓' : '🧭');
      setActionLabel(
        expeditionBtn,
        isEdu ? UI_FX_TEXT.actionLabels.play : UI_FX_TEXT.actionLabels.expedition,
      );
      for (const b of moreList.querySelectorAll<HTMLElement>('.edu-only')) b.hidden = !isEdu;
      for (const b of moreList.querySelectorAll<HTMLElement>('.not-edu')) b.hidden = isEdu;
      // The keyboard hint is for grown-up desktops, not for a 3-year-old's screen.
      const keysHint = root.querySelector<HTMLElement>('.keys-hint');
      if (keysHint && keysHint.hidden !== isEdu) keysHint.hidden = isEdu;
      // Pixel's cabinet: after chapter 5 in Hazel's Grove (canon 29), from the start in the Free Grove.
      const cabinetOpen =
        !isEdu && (currentSlot().mode === 'free' || (g.world.campaign?.chapter ?? 0) > 5);
      for (const b of moreList.querySelectorAll<HTMLElement>('.cabinet')) b.hidden = !cabinetOpen;
      // The rift: Mature content 18+ only (canon 20, 33). The rainbow gate: as the fun quests,
      // from the start in the Free Grove and after chapter 2 in Hazel's Grove.
      const riftOpen = !isEdu && g.world.settings.matureContent === 'adult';
      for (const b of moreList.querySelectorAll<HTMLElement>('.rift')) b.hidden = !riftOpen;
      const gateOpen =
        !isEdu && (currentSlot().mode === 'free' || (g.world.campaign?.chapter ?? 0) > 2);
      for (const b of moreList.querySelectorAll<HTMLElement>('.neo-gate')) b.hidden = !gateOpen;
      if (festivalsFor !== g) {
        festivalsFor = g;
        announceFestivals(g, toast);
      }
      soundBtn.hidden = !isEdu;
      if (isEdu) soundBtn.textContent = g.world.settings.sound ? '🔊' : '🔇';
      if (isEdu) {
        const now = Date.now();
        if (!eduBreakActive(g.world, now) && eduBreakDue(g.world))
          g.send({ kind: 'eduStartBreak' });
        if (eduBreakActive(g.world, now)) {
          breakScreen.show();
          breakScreen.update(now);
        } else if (breakScreen.isOpen()) breakScreen.hide();
      }
      placingChip.hidden = !g.placing;
      {
        // r1025 items 3 and 4: off during scenes, minigames, panels and notices.
        const busy =
          dialogue.isOpen ||
          !!(c?.queue[0] && dialogue.shouldPlay(c.queue[0])) ||
          stack.anyOpen() ||
          away.isOpen ||
          celebration.isOpen ||
          edu.isOpen() ||
          breakScreen.isOpen() ||
          journal.isTracing() ||
          g.catchingUp;
        eduPrompt.refresh(busy);
        objective.refresh(busy || eduPrompt.isOpen || !!g.placing);
      }
      // A language quest's tracing step opens its game once its scene has played (bug 31).
      if (
        isEdu &&
        !dialogue.isOpen &&
        !stack.anyOpen() &&
        !edu.isOpen() &&
        !breakScreen.isOpen() &&
        (g.world.campaign?.queue.length ?? 0) === 0
      )
        journal.offerTrace();
      homeBtn.hidden = !visitingTrainer(g.world) || dialogue.isOpen;
      // A minigame is time spent with its Nubbin: no lonely or hungry slips meanwhile (bug 21).
      if (expedition.isOpen || races.screen.isOpen || karate.screen.isOpen || gym.screen.isOpen) {
        const runner = pickRunner();
        if (runner) g.send({ kind: 'playingWith', nubbinId: runner.id });
      }
      // The phone's stats sheet is a bottom sheet: lift the view so the Nubbin stays in sight.
      g.cameraLift = !sheet.root.hidden && window.innerWidth < 720 ? CAMERA.sheetLift : 0;
      // On desktop the sheet docks on the right third: aim past it so the Nubbin stays clear.
      g.cameraSide = !sheet.root.hidden && window.innerWidth >= 720 ? CAMERA.sheetSide : 0;
      g.storySpeaker = dialogue.speaker;
      g.storyLine = dialogue.line;
      // The Run and camera buttons sit under the dialogue box on a phone: hide them meanwhile.
      document.documentElement.classList.toggle('dialogue-open', dialogue.isOpen);
      if (g.placing) placingText.textContent = UI_TEXT.placing(placingLabel(g.placing));
      rotateBtn.hidden = g.placing?.mode !== 'decor';
      if (kindergarten.isOpen() && Math.random() < 0.1) kindergarten.refresh();
      // A debug chapter jump empties the queue: drop the old scene so the new one plays now.
      if (c) dialogue.dropStale(c.queue);
      // Hazel's Grove never starts a scene underground in the Hollow Below: it waits for the
      // Grove (review 2026-10-24, item 4). A storyline's own floor scenes still play there.
      // Nor under the loading veil: the first lines would play unseen while 3D builds.
      const veiled = !!document.querySelector('.load-veil');
      const held = veiled || (!!c && !c.storyline && g.world.location === 'dungeon');
      const next = held ? undefined : c?.queue[0];
      // cg5: the Hollow's floor bar and minimap stay off between a floor scene's lines too
      // (the chapter card, the beat before the next scene), not only while a line is up.
      document.documentElement.classList.toggle(
        'story-queued',
        !!next && dialogue.shouldPlay(next),
      );
      if (
        heldFestival &&
        !(next && dialogue.shouldPlay(next)) &&
        !dialogue.isOpen &&
        !away.isOpen &&
        !g.catchingUp
      ) {
        toast(heldFestival);
        playSound('win');
        heldFestival = null;
      }
      if (
        dialogue.shouldPlay(next) &&
        next &&
        !g.catchingUp &&
        !dialogue.isOpen &&
        !away.isOpen &&
        !expedition.isOpen &&
        !races.isOpen() &&
        !karate.screen.isOpen &&
        !gym.screen.isOpen &&
        !tank.isOpen &&
        !pocket.isOpen &&
        // The Hollow's party bout, photo mode and the story worlds are play of their own.
        !partyBout.isOpen() &&
        !photo.isOpen() &&
        !atlas.isOpen() &&
        !cabinet.isOpen()
      ) {
        sheet.close();
        dialogue.play(next);
      }
    }
    refreshTimer = window.setTimeout(refreshLoop, 200);
  }
  void refreshTimer;

  const hooks: GameHooks = {
    onEvents(events: SimEvent[]) {
      const g = game();
      if (!g) return;
      setSoundEnabled(g.world.settings.sound);
      for (const e of events) {
        if (cantReachToast(e as unknown as { kind: string; targetId?: string }, g, toast)) continue;
        if (e.kind === 'hatched') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(UI_TEXT.hatched(n?.name ?? NAMES.creature));
          playSound('hatch');
          armPersistRequest();
        } else if (e.kind === 'evolved') {
          celebration.show(e);
          playSound('evolve');
        } else if (e.kind === 'reaction' && e.reaction === 'love') {
          playSound('pet');
        } else if (e.kind === 'collected' || e.kind === 'fruitDropped') {
          playSound('pickup');
        } else if (e.kind === 'landed') {
          playSound('hit');
        } else if (e.kind === 'keeperJumped') {
          // MOVE-21: Lane A's jump sounds.
          playSound(e.air ? 'hopAir' : 'hop');
        } else if (e.kind === 'keeperLanded') {
          playSound(e.fall > KEEPER_JUMP_FX.plopFall ? 'plop' : 'pat');
        } else if (e.kind === 'moveUnreachable') {
          // MOVE-35: a gentle bonk every time, the words at most once a while.
          playSound('bonk');
          const now = performance.now();
          if (now - lastUnreachableToast >= UNREACHABLE.toastEveryMs) {
            lastUnreachableToast = now;
            toast(e.jump ? MOVE_TEXT.jumpUpThere : MOVE_TEXT.cantGoThere);
          }
        } else if (e.kind === 'secondEvolved') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(UI_TEXT.secondEvolved(n?.name ?? NAMES.creature, TYPE_LABELS[e.second]));
        } else if (e.kind === 'speciesGrew') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(
            UI_TEXT.speciesGrew(n?.name ?? NAMES.creature, SPECIES_LABELS[e.species] ?? e.species),
          );
        } else if (e.kind === 'cocoonStarted' && e.cocoon !== 'evolve') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          const name = n?.name ?? NAMES.creature;
          toast(e.cocoon === 'rebirth' ? UI_TEXT.cocoonRebirth(name) : UI_TEXT.cocoonDepart(name));
        } else if (e.kind === 'reborn') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(UI_TEXT.reborn(n?.name ?? NAMES.creature));
        } else if (e.kind === 'departed') {
          toast(UI_TEXT.departed(e.name));
          playSound('sad');
        } else if (e.kind === 'moveLearned') {
          // Lane C: a new move (recs FIGHT-17); the stats sheet's Bout card swaps it in.
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          const name = n?.name ?? NAMES.creature;
          const say = e.slotted ? BOUT_TEXT_SHEET.learned : BOUT_TEXT_SHEET.swapIn;
          toast(say(name, moveName(e.move)));
        } else if (e.kind === 'eternal') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(UI_TEXT.eternal(n?.name ?? NAMES.creature));
        } else if (e.kind === 'bought') {
          shop.onBought(e.ok, e.reason, e.item);
          if (e.ok) playSound('buy');
        } else if (e.kind === 'chapter') {
          const title = chapterTitle(g.world.campaign, e.chapter);
          if (title !== null) toast(STORY_TEXT.chapterStarted(e.chapter, title));
        } else if (e.kind === 'turnedShadow') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(STORY_TEXT.turnedShadow(n?.name ?? NAMES.creature));
          playSound('sad');
        } else if (e.kind === 'shadowBonded') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(STORY_TEXT.shadowBonded(n?.name ?? NAMES.creature));
          playSound('evolve');
        } else if (e.kind === 'ranAway') {
          toast(STORY_TEXT.ranAway(e.name));
          playSound('sad');
        } else if (e.kind === 'strayReturned') {
          toast(STORY_TEXT.strayReturned(e.name));
        } else if (e.kind === 'degenerated') {
          toast(STORYLINE_TEXT.degenerated(e.name));
          playSound('sad');
        } else if (e.kind === 'restored') {
          toast(STORYLINE_TEXT.restored(e.name));
          playSound('evolve');
        } else if (e.kind === 'lanternLit') {
          toast(STORY_TEXT.lanternLit);
          playSound('pickup');
        } else if (e.kind === 'langReact' && events.find((x) => x.kind === 'langReact') === e) {
          // One caption per word, for the nearest Nubbin; the faces show on every one.
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(
            LANG_TEXT.reacted(
              n?.name ?? NAMES.creature,
              LANG_TEXT.gestures[e.gesture] ?? '',
              langWord(e.word)?.roman ?? e.word,
            ),
          );
        } else if (e.kind === 'talked') {
          const npc = g.world.npcs.find((x) => x.id === e.npcId);
          const name = npc ? (TRAINER_LABELS[npc.trainer]?.name ?? npc.trainer) : '';
          toast(STORY_TEXT.talkedTo(name));
        } else if (e.kind === 'interacted') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          const name = n?.name ?? NAMES.creature;
          toast(e.ok ? UI_TEXT.interacted(name, e.action) : UI_TEXT.interactRefused(name));
          if (e.ok) playSound('pet');
        } else if (e.kind === 'called') {
          toast(UI_TEXT.called(e.count));
          playSound('tap');
        } else if (e.kind === 'fetching') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(UI_TEXT.fetching(n?.name ?? NAMES.creature));
        } else if (e.kind === 'courting') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(UI_TEXT.courting(n?.name ?? NAMES.creature));
        } else if (e.kind === 'bred') {
          toast(UI_TEXT.bred);
          playSound('hatch');
        } else if (e.kind === 'lessonDone') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(
            UI_TEXT.lessonDone(n?.name ?? NAMES.creature, UI_TEXT.lessonNames[e.lesson], e.level),
          );
          playSound('win');
        } else if (e.kind === 'weather') {
          // No sky underground or inside a minigame (review 2026-10-21, bug 20).
          const loc = g.world.location;
          if (
            loc === 'hollow' ||
            loc === 'dungeon' ||
            expedition.isOpen ||
            races.screen.isOpen ||
            karate.screen.isOpen ||
            gym.screen.isOpen ||
            tank.isOpen
          )
            continue;
          toast(
            e.weather === 'rain'
              ? UI_TEXT.weatherRain
              : e.weather === 'snow'
                ? UI_TEXT.weatherSnow
                : UI_TEXT.weatherClear,
          );
        } else if (e.kind === 'visitor') {
          const who = TL[e.trainer]?.name ?? e.trainer;
          toast(
            e.gift ? UI_TEXT.visitor(who, UI_TEXT.giftNames[e.gift]) : UI_TEXT.visitorNoGift(who),
          );
          if (e.gift) playSound('buy');
        } else if (e.kind === 'lanternNight') {
          toast(UI_TEXT.lanternNight);
        } else if (e.kind === 'decorPlaced') {
          toast(UI_TEXT.decorPlaced);
          playSound('pickup');
        } else if (e.kind === 'decorRefused') {
          toast(UI_TEXT.decorRefused[e.reason]);
        } else if (e.kind === 'firstSeen') {
          toast(UI_TEXT.firstSeen(keyLabel(e.key)));
        } else if (e.kind === 'received') {
          toast(e.ok ? UI_TEXT.received(e.name) : UI_TEXT.receiveFull);
        } else if (e.kind === 'traded') {
          toast(UI_TEXT.traded(e.name));
        } else if (e.kind === 'dungeonEntered') {
          toast(DUNGEON_TEXT.entered(e.daily));
        } else if (e.kind === 'descended') {
          toast(DUNGEON_TEXT.descended(e.depth));
          playSound('pickup');
        } else if (e.kind === 'dungeonLeft') {
          toast(DUNGEON_TEXT.left(e.depth, e.shells, e.items));
        } else if (e.kind === 'dungeonFound') {
          const who = e.by ? (g.world.nubbins.find((x) => x.id === e.by)?.name ?? null) : null;
          toast(DUNGEON_TEXT.found(who, DUNGEON_TEXT.lootName(e.loot, e.amount, e.param)));
          playSound('pickup');
        } else if (e.kind === 'chestOpened') {
          toast(DUNGEON_TEXT.chest(e.shells, e.egg));
          playSound('buy');
        } else if (e.kind === 'strayFed') {
          toast(e.ok && e.name ? DUNGEON_TEXT.strayFed(e.name) : DUNGEON_TEXT.strayNeedsFruit);
        } else if (e.kind === 'strayStartled') {
          toast(DUNGEON_TEXT.strayStartled(e.shells));
        } else if (e.kind === 'packBeaten') {
          // Monster packs (lane B, R0146).
          toast(HOLLOW_TEXT.packBeaten(e.shells));
          playSound('buy');
        } else if (e.kind === 'partyGiggles') {
          toast(HOLLOW_TEXT.partyGiggles);
        } else if (e.kind === 'packFled') {
          toast(HOLLOW_TEXT.packFled);
        } else if (e.kind === 'bossGuard') {
          toast(HOLLOW_TEXT.bossGuard);
        } else if (e.kind === 'bossBeaten') {
          const act = ACTS[e.act];
          toast(HOLLOW_TEXT.bossBeaten(act ? (ACT_TEXT[act.id]?.boss ?? '') : ''));
          playSound('buy');
        } else if (e.kind === 'wildScanned') {
          toast(DUNGEON_TEXT.wildScanned(keyLabel(e.species)));
        } else if (e.kind === 'located') {
          toast(locationLabel(e.location));
        } else if (e.kind === 'karate') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          if (e.won) toast(`${n?.name ?? NAMES.creature}: ${UI_TEXT.belt(e.belt)}`);
        } else if (e.kind === 'planted') {
          toast(UI_TEXT.planted);
          playSound('pickup');
        } else if (e.kind === 'watered') {
          toast(UI_TEXT.watered);
        } else if (e.kind === 'harvested') {
          toast(UI_TEXT.harvested(e.count, UI_TEXT.flavorNames[e.flavor]));
          playSound('buy');
        } else if (e.kind === 'plantGrew') {
          if (e.stage === 3) toast(UI_TEXT.plantGrew);
        } else if (e.kind === 'crafted') {
          if (e.ok) {
            const name = (UI_TEXT.recipeNames as Record<string, string>)[e.recipe] ?? e.recipe;
            toast(UI_TEXT.crafted(name));
            playSound('buy');
          } else toast(UI_TEXT.needsMaterials);
        } else if (e.kind === 'gathered') {
          toast(UI_TEXT.gathered(e.what, e.count));
          playSound('tap');
        } else if (e.kind === 'toyPlaced') {
          toast(UI_TEXT.toyPlaced);
        } else if (e.kind === 'plotBought') {
          if (e.ok) {
            toast(UI_TEXT.plotBought);
            playSound('buy');
          }
        } else if (e.kind === 'achievement') {
          const a = ACHIEVEMENT_LIST.find((x) => x.id === e.id);
          toast(UI_TEXT.achievement(a?.title ?? e.id, e.shells));
          playSound('win');
        } else if (e.kind === 'questDone') {
          toast(UI_TEXT.questDone);
          playSound('cheer');
        } else if (e.kind === 'questClaimed') {
          toast(UI_TEXT.questClaimed(e.shells, e.egg));
          playSound('buy');
        } else if (e.kind === 'friendsMade') {
          const a = g.world.nubbins.find((x) => x.id === e.a);
          const b = g.world.nubbins.find((x) => x.id === e.b);
          toast(UI_TEXT.friendsMade(a?.name ?? NAMES.creature, b?.name ?? NAMES.creature));
        } else if (e.kind === 'wildArrived') {
          toast(UI_TEXT.wildArrived(SPECIES_LABELS[e.species] ?? e.species));
          playChirp(speciesOf(e.species).family);
        } else if (e.kind === 'wildSettled') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(UI_TEXT.wildSettled(n?.name ?? NAMES.creature));
          playSound('hatch');
        } else if (e.kind === 'wildLeft') {
          toast(UI_TEXT.wildLeft);
        } else if (e.kind === 'eduResult') {
          toast(e.sticker ? EDU_TEXT.sticker : EDU_TEXT.eduResultToast(e.stars));
        } else if (e.kind === 'eduStarted') {
          toast(EDU_TEXT.playHelp);
        } else if (e.kind === 'recruited') {
          toast(TEN_TEXT.recruited(e.name, TEN_TEXT.roleNames[e.role] ?? e.role));
          playSound('buy');
        } else if (e.kind === 'townGrew') {
          toast(TEN_TEXT.townGrew(TEN_TEXT.unlockNames[e.unlock] ?? e.unlock));
          playSound('win');
        } else if (e.kind === 'slip') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(
            TEN_TEXT.slipToast(n?.name ?? NAMES.creature, TEN_TEXT.slipNames[e.slip] ?? e.slip),
          );
        } else if (e.kind === 'wellRaised') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(TEN_TEXT.wellRaised(n?.name ?? NAMES.creature));
          playSound('win');
        } else if (e.kind === 'trained') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(
            TEN_TEXT.trained(n?.name ?? NAMES.creature, STAT_LABELS[e.stat], e.points, e.rested),
          );
          playSound('cheer');
        } else if (e.kind === 'merged') {
          const a = g.world.nubbins.find((x) => x.id === e.a);
          const b = g.world.nubbins.find((x) => x.id === e.b);
          toast(TEN_TEXT.merged(a?.name ?? NAMES.creature, b?.name ?? NAMES.creature));
          playSound('evolve');
        } else if (e.kind === 'unmerged') {
          toast(TEN_TEXT.unmerged);
        } else if (e.kind === 'curfew') {
          toast(e.night ? TEN_TEXT.curfewOn : TEN_TEXT.curfewOff);
        } else if (e.kind === 'skillBought') {
          toast(TEN_TEXT.skillBought(SKILL_LIST.find((s) => s.id === e.id)?.name ?? e.id));
          playSound('buy');
        } else if (e.kind === 'scanFull') {
          toast(TEN_TEXT.scanFull(SPECIES_LABELS[e.species] ?? e.species));
          playSound('pickup');
        } else if (e.kind === 'converted') {
          toast(TEN_TEXT.converted(SPECIES_LABELS[e.species] ?? e.species));
          playSound('hatch');
        } else if (e.kind === 'teamJoined') {
          toast(TEN_TEXT.teamJoined(TEN_TEXT.teamNames[e.team] ?? e.team));
        } else if (e.kind === 'missionDone') {
          toast(TEN_TEXT.missionDone);
          playSound('win');
        } else if (e.kind === 'tankDone') {
          toast(e.won ? TEN_TEXT.tankWon(e.shells, e.wood, e.stone) : TEN_TEXT.tankLost(e.shells));
          playSound(e.won ? 'win' : 'sad');
        } else if (e.kind === 'wildFed') {
          toast(UI_TEXT.wildFed);
          playSound('pet');
        } else if (e.kind === 'visiting') {
          if (e.trainer) toast(UI_TEXT.visitingNow(TL[e.trainer]?.name ?? e.trainer));
        } else if (e.kind === 'neighbourGift') {
          if (e.ok) {
            toast(UI_TEXT.neighbourGiftGot(TL[e.trainer]?.name ?? e.trainer, e.shells));
            playSound('buy');
          } else toast(UI_TEXT.giftTaken);
        } else if (e.kind === 'landmarkFound') {
          toast(
            UI_TEXT.landmarkFound((UI_TEXT.landmarkNames as Record<string, string>)[e.id] ?? e.id),
          );
          playSound('pickup');
        } else if (e.kind === 'festival') {
          // The calendar's festival waits for any story scene to finish, so "Autumn harvest"
          // never sits on top of a scene that says it is late spring (review C, item 16).
          heldFestival = UI_TEXT.festival[e.season];
        } else if (e.kind === 'coop') {
          toast(e.active ? UI_TEXT.coopOn : UI_TEXT.coopOff);
        } else if (e.kind === 'dyed') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          toast(UI_TEXT.dyed(n?.name ?? NAMES.creature, e.slot));
        } else if (e.kind === 'reaction') {
          const n = g.world.nubbins.find((x) => x.id === e.nubbinId);
          if (n && Math.random() < 0.35) {
            playChirp(speciesOf(n.species).family, e.reaction !== 'sad' && e.reaction !== 'dizzy');
          }
        }
      }
    },
    onAway(report: AwayReport, closed: () => void) {
      const g = game();
      // Shown at once, so no story scene can start under it; the scene waits for it to close.
      if (g) away.show(report, g.world, closed);
      else setTimeout(() => (game() ? away.show(report, game()!.world, closed) : closed()), 0);
    },
    onSelect(id) {
      const g = game();
      if (id?.startsWith('memorial:') && g) {
        const m = g.world.memorials.find((x) => x.id === id.slice('memorial:'.length));
        if (m) memorialCard.show(m);
        return;
      }
      if (id?.startsWith('building:') && g) {
        const which = id.slice('building:'.length);
        if (which === 'school') kindergarten.open();
        else if (which === 'dojo') karate.open();
        else if (which === 'cottage') pocket.open(sheet.selectedId);
        else if (which === 'workshop') decorate.open('workshop');
        else if (which === 'nursery') toast(UI_TEXT.nurseryTap);
        else if (which === 'bathhouse') toast(UI_TEXT.bathhouseTap);
        else if (which === 'host') g.send({ kind: 'neighbourGift' });
        else if (which === 'windmill') toast(UI_TEXT.windmillTap);
        else if (which === 'cave') dungeon.open();
        return;
      }
      if (id?.startsWith('plant:') && g) {
        const p = g.world.plants.find((x) => x.id === id.slice('plant:'.length));
        if (!p) return;
        if (p.ripe) g.send({ kind: 'harvest', id: p.id });
        else if (p.water < 0.9) g.send({ kind: 'waterPlant', id: p.id });
        else toast(UI_TEXT.plantTap(p.stage, p.water, p.ripe));
        return;
      }
      if (id?.startsWith('decor:') && g) {
        g.send({ kind: 'removeDecor', id: id.slice('decor:'.length) });
        toast(UI_TEXT.decorPickedUp);
        return;
      }
      if (id) sheet.open(id);
      else sheet.close();
    },
    onStorageBlocked() {
      toast(UI_TEXT.storageBlocked);
      storageChip.hidden = false;
    },
    onOtherTab() {
      toast(UI_TEXT.otherTabSaved);
    },
    onSaveUnreadable(kept: boolean) {
      // Called while the game is still being built; the toast row is ready next tick.
      setTimeout(() => toast(kept ? UI_TEXT.unreadableKept : UI_TEXT.unreadableHeld), 0);
    },
    onCrash() {
      showCrashCard();
    },
    onCatchUpStart() {
      catching.hidden = false;
    },
    onCatchUpEnd() {
      catching.hidden = true;
    },
  };

  return {
    hooks,
    bind(g: Game) {
      // A phone starts at the far zoom, so the eggs and the trees are in the first look.
      if (window.matchMedia?.('(max-width: 600px), (max-height: 500px)').matches)
        g.camera.setZoom(CAMERA.phoneZoomIndex);
      refreshLoop();
      if (new URLSearchParams(location.search).has('pocket')) pocket.open();
    },
  };
}

/**
 * The action-bar buttons: an icon over a short word. The word shows on phones (style.css,
 * `.act-label`), where the bar sits at the bottom; wide screens keep the icon alone.
 */
function labelActions(list: Array<[HTMLButtonElement, string, string]>): void {
  for (const [b, glyph, label] of list) {
    b.textContent = '';
    const g = document.createElement('span');
    g.className = 'act-glyph';
    g.setAttribute('aria-hidden', 'true');
    g.textContent = glyph;
    const l = document.createElement('span');
    l.className = 'act-label';
    l.setAttribute('aria-hidden', 'true');
    l.textContent = label;
    b.append(g, l);
    b.classList.add('act-btn');
  }
}

function setActionGlyph(b: HTMLButtonElement, glyph: string): void {
  const g = b.querySelector('.act-glyph');
  if (g && g.textContent !== glyph) g.textContent = glyph;
}

function setActionLabel(b: HTMLButtonElement, label: string): void {
  const l = b.querySelector('.act-label');
  if (l && l.textContent !== label) l.textContent = label;
}

/**
 * Toasts without the pile-up (review 2026-10-24): the same text again within a short while
 * is dropped, at most a few show at once, and a burst comes in one at a time.
 */
function makeToaster(host: HTMLElement): (text: string, ms?: number) => void {
  const lastShown = new Map<string, number>();
  const queue: Array<{ text: string; ms: number }> = [];
  let visible = 0;
  let nextAt = 0;
  let timer = 0;
  const pump = (): void => {
    timer = 0;
    while (queue.length > 0 && visible < TOASTS.maxVisible) {
      const now = performance.now();
      if (now < nextAt) {
        timer = window.setTimeout(pump, nextAt - now);
        return;
      }
      const { text, ms } = queue.shift()!;
      const t = document.createElement('div');
      t.className = 'toast';
      t.textContent = text;
      host.appendChild(t);
      visible++;
      nextAt = now + TOASTS.staggerMs;
      window.setTimeout(() => {
        t.remove();
        visible--;
        if (!timer) pump();
      }, ms);
    }
  };
  return (text: string, ms: number = UI.toastMs): void => {
    const now = performance.now();
    const last = lastShown.get(text);
    if (last !== undefined && now - last < TOASTS.repeatMs) return;
    lastShown.set(text, now);
    queue.push({ text, ms });
    while (queue.length > TOASTS.maxQueued) queue.shift();
    if (!timer) pump();
  };
}

/**
 * The sim's `cantReach` event (a care walk that stalled), checked by its kind as a string so
 * this compiles before the sim branch that adds the event type is merged.
 */
function cantReachToast(
  e: { kind: string; targetId?: string },
  g: Game,
  toast: (text: string) => void,
): boolean {
  if (e.kind !== 'cantReach') return false;
  const n = e.targetId ? g.world.nubbins.find((x) => x.id === e.targetId) : undefined;
  toast(UI_FX_TEXT.cantReach(n?.name ?? UI_FX_TEXT.cantReachThere));
  return true;
}
