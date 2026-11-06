import { CAMERA, GROVE, INPUT, UI } from '../config/tuning';
import { ALBUM_TEXT } from '../config/strings-soul-r11b';
import { mountWatch } from './watch';
import { AnticAlbum } from './antic-album';
import { albumIdOf } from '../sim/antic-album';
import { WORLD_TEXT } from '../config/strings-world';
import { offerStorageFull } from './backup'; /* Lane C r11 */
import { lastSaveProblem } from '../platform/save-room';
import { setBiomeBed } from '../platform/biome-beds';
import { REGIONS } from '../config/regions';
import { regionOf } from '../sim/regions';
import { clearShift } from '../render/view-shift';
import { RUN_MODE } from '../config/tuning-move';
import { GROVE_LABELS, NAMES, UI_TEXT, DUNGEON_TEXT } from '../config/strings';
import type { Game, GameHooks } from '../game';
import type { AwayReport, GroveKind, SimEvent } from '../sim/types';
import { handleHudEvents, type EventCtx, type HudState } from './hud-events';
import { ExpeditionScreen } from '../minigames/expedition/screen';
import {
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
import { RecapCard, recapDue } from './recap';
import { skipCardOpen } from './skip-card';
import { askResume, setBattleDialogue } from './battle-scenes';
import { liveBattleSong } from './battle-sfx';
import { Celebration } from './celebration';
import type { DebugPanel } from './debug-panel';
import { askGrownUp } from './grown-up-gate';
import { KidSoundSheet, routeSettingsTap } from './kid-sheet';
import { grownUpCorner } from './kids-corner'; /* Lane E r10 */
import { SproutTutorial } from './sprout-tutorial'; /* Lane E r10 */
import { Guide } from './guide';
import { titleCardUp } from './title-card';
import { kidToaster } from './kid-notice';
import { BreakWarning } from './break-warning';
import { speakLine } from './lesson';
import { EduNoticing } from './edu-noticing'; /* R0723 */
import { GlowCave } from './glow-cave';
import { DueWave } from './lang-due'; /* R0701 */
import { JOYSTICK_TUNING } from '../config/tuning-move-joy';
import { JOYSTICK_TEXT } from '../config/strings-move-joy';
import { Joystick } from './joystick';
import { RacesMenu } from './races';
import { holdRenderWhile } from './render-hold';
import { RosterMenu } from './roster';
import { ShopMenu } from './shop';
import { TrainersMenu } from './trainers';
import { SAVE_LAYOUT_TEXT } from '../config/strings-camp11-save';
import { button, el } from './dom';
import { mountVisitPicker } from './visit-picker';
import { MOVE_R10_TEXT } from '../config/strings-move-r10';
import { JumpButtonLook } from './jump-states';
import { LookoutChip } from './lookout-chip';
import { RegionChip } from './region-chip';
import { sceneWaitsForRegion } from '../sim/story-regions';
import { HopLessonChip } from './hop-lesson-chip';
import { HopCourseChip } from './hop-course';
import { AmbientBubbles, BarkBubble } from './bark-bubble';
import { RoutineProps } from './routine-props';
import { NubbinGags } from './nubbin-gags';
import { bandToaster } from './fun-toasts';
import { dedupeToaster } from './event-dedupe';
import { FRAME_WORK } from '../platform/frame-spikes';
import { coarsePointer } from '../platform/viewport';
import { HatchCard } from './hatch-card';
import { nextTip } from './tips';
import { tapToy } from './tap-toy';
import { isGameKey, isTypingTarget } from '../input/keys';
import { SettingsMenu } from './settings';
import { StatsSheet } from './stats-sheet';
import { Dialogue } from './dialogue';
import { Journal } from './journal';
import { PartyBoutPanel } from './party-bout';
import { boutTier, loggedPartyIds } from '../sim/storyline-rules-logged';
import { STORY_TEXT } from '../config/story';
import { KindergartenMenu } from './kindergarten';
import { KarateMenu } from './karate';
import { BATTLE_SCREEN_TEXT } from '../config/strings-battle';
import { CollectionBook, MemorialCard } from './collection';
import { snapYaw } from '../sim/decorate';
import { DecorateMenu, placeHint, placingLabel } from './decorate';
import { PLACE_TEXT } from '../config/strings-fun-r7';
import { MapPanel, NeighbourhoodPanel, ProfilePanel, QuestBoard } from './garden-panels';
import { BreakScreen, EduScreen, GrownUpPanel } from './edu';
import { StickerBook } from './sticker-book';
import { EduPlaces } from './edu-places';
import { SPROUT_HUD_TEXT } from '../config/strings-look-r9e'; /* Lane E r9 */
import { LimitCard, syncKidsLock } from './edu-limits';
import { GymMenu } from './gym';
import { DungeonMenu } from './dungeon';
import { HollowBoutPanel } from './dungeon-bout';
import { TankScreen } from '../minigames/tank/screen';
import { TEN_TEXT } from '../config/strings';
import { EDU_TEXT } from '../config/strings';
import { eduBreakActive, eduBreakShouldStart } from '../sim/edu';
import { PhotoMode } from './photo';
import { PhotoSpotButton } from './photo-spot-button';
import { PocketMode } from './pocket';
import { modal } from './dom';
import { showCrashCard } from './gl-failure';
import { mountPanelStack } from './panel-stack';
import { ATLAS_TEXT } from '../config/strings';
import { visitingTrainer } from '../sim/neighbourhood';
import { loadArcade, loadAtlas, loadMultiverse, loadNeopia } from '../sim/atlas';
import { currentSlot, storageAvailable } from '../platform/storage';
import { announceFestivals, StoryShelf } from './atlas';
import { askRift } from './rift-confirm';
import { askAdultScene } from './adult-entry';
import {
  adultSceneGate,
  isAdultScene,
  lastAdultEntry,
  noteAdultEntry,
} from '../platform/mature-recheck';
import { MATURE_RECHECK } from '../config/tuning-tech';
import { FIRST_MINUTE } from '../config/tuning-r11d4';
import { firstMinuteQuiet } from '../sim/first-loop';
import { TRAINER_LABELS as TL } from '../config/strings';
import { BackupNudge } from './backup-nudge';
import { OfferCard } from './offer-card';
import { UI_FX_TEXT } from '../config/strings-ui';
import { TOASTS } from '../config/tuning-ui';
import { EduPrompt, ObjectiveChip } from './objective';
import { mountCompass } from './compass';
import { mountMinimap } from './minimap';
import { mountWalkTuck } from './walk-tuck';
import { mountBeacon } from './beacon-arrow';
import { mountLandmarkCard } from './landmark-card';
import { mountBackupOffer } from './backup-offer';
import { buzz } from '../platform/haptics';
import { isKeysHintKey, keysHintDone, showKeysHintAgain, watchKeysHint } from './keys-hint';
import { HATCH_BUTTON_TEXT, KEYS_HINT_TEXT, TOPBAR_TEXT } from '../config/strings-r8d';
import { ShakeMeter } from './shake-meter';
import { ShakeHint } from './shake-hint';
import { SelectionLive } from './a11y-live';
import { PressInfo } from './press-info';
import { setIconGlyph } from './pixel-icons';
import { applyHudScheme } from './hud-scheme';
import { watchOnline } from './offline-chip';
import { gateOfflineEntries } from './offline-entries';
import { villageTap } from './village-tap';
import { outerLine } from './outer-gag';
import { festivalGagDue } from '../sim/festival-gags';
import { FESTIVAL_GAGS } from '../content/festival-gags';
import { outerTapOf } from '../config/outer-ring';
import { CuriosityWatch } from './curiosities';
import { commandTaps } from '../game'; /* Lane E r9 */
import { setEmoteFocus } from '../render/emote-size';
import { SoulAmbient } from './soul-ambient';
import { LossNotice } from './loss-notice';

/** MOVE-35: when the last "Can't get there" toast showed (performance clock). */

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
  // Lane E r8, R0680: a Learning Grove's ⋯ opens the Places picture menu instead.
  const moreBtn = button(
    '⋯',
    () => {
      if (game()?.world.edu) return eduPlaces.open();
      visitHas = visitPicker.hasChoices(); // R0669: profiles can change between opens
      visitBtn.hidden = !visitHas;
      more.show();
    },
    'btn btn-icon',
  );
  moreBtn.setAttribute('aria-label', UI_TEXT.more);
  moreBtn.title = UI_TEXT.more;
  // In the Learning Grove, Settings (reset, import, aging) is for grown-ups: a sum first.
  const settingsBtn = button(
    '⚙',
    () => {
      // R0671: a Learning Grove gets the kid-safe sound sheet; the rest is past the gate.
      void routeSettingsTap(!!game()?.world.edu, settingsRoute);
    },
    'btn btn-icon',
  );
  settingsBtn.setAttribute('aria-label', UI_TEXT.settings);
  // Sound on/off stays one tap away, outside Settings and the Learning Grove's grown-up gate
  // (TECH-23: for everyone now). A long press opens Settings for the volume sliders.
  const soundBtn = button(
    '🔊',
    () => {
      const g = game();
      if (!g) return;
      /* Lane E r10, R0679: a sprout's ⚙ is folded in here; the sheet has the big slider. */
      if (g.world.edu?.band === 'sprout') {
        kidSheet.open();
        return;
      }
      const on = !g.world.settings.sound;
      g.send({ kind: 'setSettings', settings: { ...g.world.settings, sound: on, music: on } });
      setSoundEnabled(on);
      setMusicEnabled(on);
    },
    'btn btn-icon',
  );
  soundBtn.setAttribute('aria-label', UI_TEXT.sound);
  soundBtn.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (!game()?.world.edu) settings.open();
  });
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
  const journalBtn = button(
    '📖',
    () => {
      /* Lane E r10, R0679: a sprout's 📖 Story plays the next scene or says what is next. */
      const g = game();
      if (g?.world.edu?.band === 'sprout' && g.world.campaign) {
        if (g.world.campaign.queue.length === 0) edu.showNext();
        return;
      }
      journal.open();
    },
    'btn btn-icon',
  );
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
  // TECH-61: the sound toggle gets a word too, shown under its icon on wide screens only
  // (it stays in the top bar on phones, where the bottom bar's labels do not reach it).
  {
    soundBtn.textContent = '';
    const g = el('span', 'act-glyph');
    setIconGlyph(g, '🔊');
    g.setAttribute('aria-hidden', 'true');
    const l = el('span', 'top-label', TOPBAR_TEXT.sound);
    l.setAttribute('aria-hidden', 'true');
    soundBtn.append(g, l);
    soundBtn.classList.add('top-labelled');
  }
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
  // R0679: what a sprout does not need (style.css hides these under `body.edu-sprout`).
  for (const b of [runBtn, keeperBtn, shopBtn, groveBtn]) b.classList.add('sprout-hide');
  settingsBtn.classList.add('sprout-hide'); /* Lane E r10, R0679: 🔊 opens the sound sheet */
  // MOVE-42: on a phone the Run toggle turns itself off after a few seconds standing still,
  // so it is never left on by accident. Shift on a keyboard is held, so it needs none.
  if (window.matchMedia?.('(pointer: coarse)').matches) {
    let stillMs = 0;
    let last: { x: number; z: number } | null = null;
    window.setInterval(() => {
      const k = game()?.world.keeper;
      if (!runOn || !k) {
        stillMs = 0;
        last = null;
        return;
      }
      const moved = !last || Math.hypot(k.pos.x - last.x, k.pos.z - last.z) > 0.02;
      last = { x: k.pos.x, z: k.pos.z };
      stillMs = moved ? 0 : stillMs + 250;
      if (stillMs >= RUN_MODE.idleResetMs) setRunning(false);
    }, 250);
  }

  // Jump (MOVE-14): a thumb button on touch screens, Space on a keyboard. It reacts on
  // pointerdown, with no click delay; holding it holds the jump higher. With something in
  // hand it shakes that instead, and says so (MOVE-22).
  const jumpBtn = el('button', 'btn jump-btn');
  jumpBtn.type = 'button';
  jumpBtn.setAttribute('aria-label', UI_TEXT.jump);
  // MOVE-51: the hold ring, the air-jump pip and the glide feather.
  const jumpLook = new JumpButtonLook(jumpBtn);
  let jumpPolled = false;
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
  // MOVE-58: the one-time hop lesson's chip.
  const hopLesson = new HopLessonChip(root);
  // MOVE-63: the hop course's chip, toasts and side save.
  const hopCourse = new HopCourseChip(root);
  // R0295: the Keepers' speech bubbles.
  const barkBubble = new BarkBubble(root);
  // R0296 / R0297: the Keepers' routine lines and passing chatter.
  const ambientBubbles = new AmbientBubbles(root, barkBubble);
  // R0312: a hatch is one card (ui/hatch-card.ts).
  const hatchCard = new HatchCard(root, game);
  // MOVE-55: the "Look around" chip on a lookout.
  const lookout = new LookoutChip(
    root,
    (cmd) => game()?.send(cmd),
    () => game()?.camera ?? null,
  );
  // Lane C r10 agent A (R0605): a questline region's Go-to chip at its entrance.
  const regionChip = new RegionChip(root, (cmd) => game()?.send(cmd));
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
    // R11 lane D: a drawn region says its own name.
    if (loc.startsWith('region:'))
      return (WORLD_TEXT.regions as Record<string, string>)[loc.slice(7)] ?? loc;
    return (UI_TEXT.location as Record<string, string>)[loc] ?? loc;
  }

  /** R0687 / R0690: the Learning Grove's places that open existing screens. */
  const openEduAtlas = (): void => atlas.open();
  const openEduArcade = (): void => cabinet.open();
  const openGlowCave = (): void => dungeon.open();

  function startFunRun(): void {
    const g = game();
    if (!g || races.screen.isOpen) return;
    sheet.close();
    races.funRun();
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
    // R0318: a tip while the stage loads.
    expedition.loadTip = nextTip(g.world);
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
      // R0689: a sprout's run is Shell Dash (30 s, gentle bumps, counted aloud); readers keep
      // the normal Expedition.
      g.world.edu?.band === 'sprout'
        ? {
            kid: true,
            speak: (t) => {
              if (game()?.world.edu?.readAloud) speakLine(t);
            },
          }
        : {},
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
  // R0474: the private diary hears which panels get opened and which scenes get skipped.
  window.addEventListener('grove:panel', (e) =>
    game()?.send({ kind: 'diaryNote', what: { panel: String((e as CustomEvent).detail) } }),
  );
  window.addEventListener('grove:skip', () => game()?.send({ kind: 'diaryNote', what: 'skip' }));
  placeToasts();
  // Read out politely by screen readers; each toast is added as a new node.
  toasts.setAttribute('role', 'status');
  toasts.setAttribute('aria-live', 'polite');
  // R0308: the sprout band gets its own toasts (ui/fun-toasts.ts).
  // R0693 (lane E r7): a sprout's notices wait until their activity closes (kid-notice.ts).
  let kidBusy: () => boolean = () => false;
  // TECH-54: while time runs fast, the same toast text shows once in a few seconds.
  const fastSafe = dedupeToaster(makeToaster(toasts), () => game()?.clock.timeScale ?? 1);
  const kidNotices = kidToaster(bandToaster(fastSafe, game), game, () => kidBusy());
  const toast = kidNotices.toast;
  // Lane E r10 (R0694): the heads-up before a Learning Grove loss chapter.
  const noticing = new EduNoticing();
  const lossNotice = new LossNotice(root, game, toast);
  const dueWave = new DueWave(toast); /* R0701 */
  // Lane E (R0332): the curiosities the player stumbles on.
  const curiosities = new CuriosityWatch((c) => game()?.send(c), toast);
  commandTaps.add((c) => curiosities.onCommand(c)); /* Lane E r9 */
  // R0552 (lane A r9): the Grove's snores and chirps.
  const soulAmbient = new SoulAmbient();

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
  // R0671: the kid-safe sheet and the route the ⚙ button takes (kid-sheet.ts).
  const settingsRoute = {
    openFull: () => settings.open(),
    openQuick: () => kidSheet.open(),
    ask: () => askGrownUp(root, toast),
  };
  const kidSheet = new KidSoundSheet(root, game, () => {
    void routeSettingsTap(true, settingsRoute, true);
  });
  const away = new AwayScreen(root);
  // The debug panel only mounts in dev builds, or in a production build opened with `?debug`.
  const debugEnabled = import.meta.env.DEV || new URLSearchParams(location.search).has('debug');
  // TECH-04: loaded only when enabled, so players never download it or its 3D stage inspector.
  let debug: DebugPanel | null = null;
  if (debugEnabled)
    void import('./debug-panel').then((m) => {
      debug = new m.DebugPanel(root, game, () => sheet.selectedId);
    });
  // Lane C: reopen a rumble saved mid-battle or started elsewhere (recs FIGHT-65), on demand.
  window.setInterval(() => {
    const t = game()?.world.tactics;
    if (t && !t.result) void import('./tactics-screen').then((m) => m.openTactics(root, game));
  }, 1000);
  const celebration = new Celebration(root, game);
  // R0354: the comic line after the evolution card.
  celebration.onQuip = (line) => toast(line);
  // R0326: which comic stray line comes next.
  const shop = new ShopMenu(root, game, toast);
  const expedition = new ExpeditionScreen(root);
  const races = new RacesMenu(root, game, (t) => toast(t, UI.toastLongMs), pickRunner);
  const roster = new RosterMenu(root, game, (id) => sheet.open(id));
  const anticAlbum = new AnticAlbum(root, game, UI_TEXT.close); /* R0564 */
  mountWatch(root, game, (n) => anticAlbum.report(n.id, albumIdOf(game()!.world, n))); /* R0550 */
  const trainers = new TrainersMenu(root, game, toast);
  const dialogue = new Dialogue(root, game);
  // Lane C round 6: battle scenes play in this box; a loaded bout asks to resume (FIGHT-64).
  setBattleDialogue(dialogue);
  let resumeAsked = false;
  const journal = new Journal(root, game);
  // Lane C r11 (R0666): a keepsake's Watch again plays the closing scene from a copy; no sim.
  journal.replay = (scene) => dialogue.playScene(scene, {}, () => undefined);
  // Lane C r10 agent C (R0620): "The story so far", after the away screen of a long break.
  const recap = new RecapCard(root, () => journal.open());
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
  // R0138: the "Take photo" button while the Keeper stands in a region's photo frame.
  const photoSpotBtn = new PhotoSpotButton(root, game, () => photo);
  const pocket = new PocketMode(root, game, () => anticAlbum.open('fridge'));
  const quests = new QuestBoard(root, game);
  const profile = new ProfilePanel(root, game);
  const neighbourhood = new NeighbourhoodPanel(root, game, toast);
  const map = new MapPanel(root, game, toast);
  mountCompass(root, game, () => map.open());
  mountMinimap(root, game, () => map.open());
  mountWalkTuck(root, game);
  mountBeacon(root, game, () => map.open());
  // R0107: the landmark name card.
  const landmarkCard = mountLandmarkCard(root);
  // TECH-03: a week in with no export, offer a backup file once.
  mountBackupOffer(root, game);
  watchKeysHint();
  // TECH-80: say so when the game is offline.
  watchOnline(toast);
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
    next: () => edu.showNext(),
  });
  // R0676: the pointing guide, from "Show me" or by itself after a quiet spell.
  const guide = new Guide(root, game, () => sheet.selectedId);
  // TECH-62: the ghost hand that shows how to shake a selected egg.
  const shakeHint = new ShakeHint(root);
  // TECH-28: the selected Nubbin said aloud, and Tab through the Nubbins on the canvas.
  const selectionLive = new SelectionLive(root, game, (id) => sheet.open(id));
  new PressInfo(root, game); // R0472: the long-press info card
  edu.onShowMe(() => guide.show());
  // Lane E r8, R0685: the sticker book, from the results card's sticker (and Places).
  const stickerBook = new StickerBook(root, game);
  edu.onOpenBook((fresh) => stickerBook.open(fresh));
  const grownUps = new GrownUpPanel(root, game, toast);
  settings.setGrownUpArea(() => grownUps.open());
  grownUpCorner(root, () => grownUps.open()); /* Lane E r10, R0679 */
  const sproutTutorial = new SproutTutorial({
    story: journalBtn,
    play: expeditionBtn,
    nubbins: rosterBtn,
    places: moreBtn,
  });
  const breakScreen = new BreakScreen(
    root,
    game,
    () => askGrownUp(root, toast),
    () => grownUps.open(),
  );
  // Lane E r8, R0695: the sleeping-Grove card a grown-up's limits put up.
  const limitCard = new LimitCard(root, game, () => askGrownUp(root, toast));
  // R0724: the moon that fills in the last two minutes before a break.
  const breakWarn = new BreakWarning(root);
  const gym = new GymMenu(root, game, toast, pickRunner);
  const dungeon = new DungeonMenu(root, game);
  // R0690: the Glow Cave's floor puzzle for a sprout.
  const glowCave = new GlowCave(root, game);
  // Lane B r8: the boss scroll (R0207) waits for the boss celebration to close.
  dungeon.scrollBusy = () => celebration.isOpen;
  // Lane B: the Hollow's pack fight opens by itself when a bout starts there.
  const hollowBout = new HollowBoutPanel(root, game);
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
    [`🏫 ${UI_TEXT.kindergarten}`, () => (game()?.world.edu ? edu : kindergarten).open()],
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
    [`📖 ${ALBUM_TEXT.button}`, () => anticAlbum.open()],
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
  // Lane C: the Learning Grove gets the dojo as gentle play-fights (recs FIGHT-24).
  moreList.appendChild(
    button(
      BATTLE_SCREEN_TEXT.playFight,
      () => {
        more.hide();
        karate.open();
      },
      'btn btn-wide edu-only',
    ),
  );
  // R0669: look round another Keeper's Grove, read-only; only when one exists on this device.
  const visitPicker = mountVisitPicker(root, () => void game()?.save());
  const visitBtn = button(
    `👥 ${SAVE_LAYOUT_TEXT.visitMenu}`,
    () => {
      more.hide();
      visitPicker.open();
    },
    'btn btn-wide not-edu visit-more',
  );
  let visitHas = visitPicker.hasChoices();
  visitBtn.hidden = !visitHas;
  moreList.appendChild(visitBtn);
  // TECH-60: the keys hint comes back from here, or from the "?" key.
  moreList.appendChild(
    button(
      KEYS_HINT_TEXT.menu,
      () => {
        more.hide();
        showKeysHintAgain();
      },
      'btn btn-wide not-edu keys-hint-again',
    ),
  );
  // R0014 (lane A r10): on phones the camera cluster drops ⤢ for the jump button; it lives here.
  moreList.appendChild(
    button(
      MOVE_R10_TEXT.zoomMenu,
      () => {
        more.hide();
        game()?.camera.toggleZoom();
      },
      'btn btn-wide zoom-more',
    ),
  );
  window.addEventListener('keydown', (e) => {
    if (isKeysHintKey(e) && !isTypingTarget(e.target) && !game()?.world.edu) showKeysHintAgain();
  });
  more.body.appendChild(moreList);
  // R0520 (TECH-80): offline, grey the story worlds whose chunk this device never fetched.
  gateOfflineEntries(
    more.root,
    (
      [
        [ATLAS_TEXT.atlas, 'atlas-catalogue'],
        [ATLAS_TEXT.cabinet, 'arcade-catalogue'],
        [ATLAS_TEXT.rift, 'multiverse-catalogue'],
        [ATLAS_TEXT.gate, 'neopia-catalogue'],
      ] as const
    ).flatMap(([label, chunk]) => {
      const b = [...moreList.querySelectorAll('button')].find((x) =>
        x.textContent?.endsWith(` ${label}`),
      );
      return b ? [{ button: b, chunk }] : [];
    }),
  );
  // Lane E r8, R0680: the Learning Grove's Places, each a big picture tile.
  const eduPlaces = new EduPlaces(
    root,
    game,
    {
      book: () => stickerBook.open(),
      collection: () => book.open(),
      decorate: () => decorate.open(),
      photo: () => photo.open(),
      playFight: () => karate.open(),
      kindergarten: () => kindergarten.open(),
      map: () => map.open(),
      beetle: () => startTank(),
      shellDash: () => startExpedition(),
      funRun: () => startFunRun(),
      glowCave: () => openGlowCave(),
      atlas: () => openEduAtlas(),
      arcade: () => openEduArcade(),
    },
    () => grownUps.open(),
  );
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
      get creator() {
        return roster.creator;
      },
      get debug() {
        return debug;
      },
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

  kidBusy = () =>
    edu.isOpen() ||
    dialogue.isOpen ||
    breakScreen.isOpen() ||
    limitCard.isOpen() ||
    journal.isTracing();
  // One full panel at a time (B3). Story scenes, the away screen and celebrations are
  // deliberately layered and stay outside the stack. Running minigames have no `close`, so
  // a menu opened over one (Races over Beetle Run) is shut instead of stacking under it.
  const stack = mountPanelStack(
    root,
    [
      { isOpen: () => settings.isOpen(), close: () => settings.close() },
      { isOpen: () => kidSheet.isOpen(), close: () => kidSheet.close() },
      { isOpen: () => shop.isOpen(), close: () => shop.close() },
      { isOpen: () => races.isOpen(), close: () => races.close() },
      { isOpen: () => roster.isOpen(), close: () => roster.close() },
      { isOpen: () => trainers.isOpen(), close: () => trainers.close() },
      { isOpen: () => journal.isOpen(), close: () => journal.close() },
      { isOpen: () => partyBout.isOpen(), close: () => partyBout.close() },
      { isOpen: () => hollowBout.isOpen(), close: () => hollowBout.close() },
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
      recap.isOpen() ||
      skipCardOpen() ||
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
      else if (kidSheet.isOpen()) kidSheet.close();
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
      else if (hollowBout.isOpen()) hollowBout.close();
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
  const hs: HudState = { strayLine: 0, heldFestival: null };
  /** R0467: toasts held through a new save's first minute (visitors). */
  const heldQuiet: string[] = [];
  // R0359: festival vignettes started this visit, so one is never started twice while its
  // `festivalGagSeen` waits for the next sim step.
  const festivalGagsStarted = new Set<string>();
  // Periodic refresh of live panels.
  let refreshTimer = 0;
  // R0517 (TECH-75): an 18+ fun quest scene (It's Always Sunny) asks the grown-up question
  // again after a long spell without an 18+ entry; "Not now" holds it back for a while.
  let adultAsking = false;
  let adultDeferredUntil = 0;
  function playStoryScene(id: string): void {
    if (adultAsking) return;
    const gate = adultSceneGate(id, lastAdultEntry(), Date.now(), adultDeferredUntil);
    if (gate === 'wait') return;
    if (gate === 'ask') {
      adultAsking = true;
      void askAdultScene(root).then((ok) => {
        adultAsking = false;
        // Confirmed: the next refresh finds the entry fresh and plays the scene.
        if (ok) noteAdultEntry();
        else adultDeferredUntil = Date.now() + MATURE_RECHECK.deferMs;
      });
      return;
    }
    if (isAdultScene(id)) noteAdultEntry();
    dialogue.play(id);
  }

  let moreKeyShown = '';
  function refreshLoop(): void {
    // TECH-31: the refresh runs between frames; its time is charged to the next frame log.
    const hudT0 = performance.now();
    const g = game();
    if (g) {
      curiosities.tick(g.world, g.camera.currentYawIndex);
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
      // R0510: in the Hollow on a touch device the stick is on without a trip to Settings.
      const hollowTouch =
        (g.world.location === 'hollow' || g.world.location === 'dungeon') && coarsePointer();
      joystick.setVisible(g.world.settings.joystick || !!hollowTouch);
      joystick.onEdge = () =>
        void buzz(
          'stickEdge',
          g.world.settings,
          document.documentElement.classList.contains('reduce-motion'),
        );
      // MOVE-14: Left-handed mirrors the thumb buttons and the pad.
      const lefty = !!g.world.settings.leftHanded;
      joystick.leftHanded = lefty;
      document.documentElement.classList.toggle('left-handed', lefty);
      const anyUnlocked = g.world.unlocks.sunGrove || g.world.unlocks.moonGrove;
      groveBtn.hidden = !anyUnlocked;
      groveBtn.textContent = GROVE_LABELS[g.world.grove];
      const carrying = g.world.keeper.carrying;
      const shakes = !!carrying || g.world.nubbins.some((n) => n.behavior.state === 'held');
      const jumpGlyph = shakes ? '🥚' : '⤒';
      jumpLook.setGlyph(jumpGlyph);
      jumpBtn.setAttribute('aria-label', shakes ? UI_TEXT.shake : UI_TEXT.jump);
      if (!resumeAsked) {
        resumeAsked = true;
        setTimeout(() => askResume(root, game), 1500);
      }
      if (!jumpPolled) {
        jumpPolled = true;
        g.framePollers.push(() => jumpLook.update(g.world, performance.now()));
        g.framePollers.push(() => lookout.update(g.world, performance.now()));
        g.framePollers.push(() => regionChip.update(g.world));
        g.framePollers.push(() => hopLesson.update(g.world));
        g.framePollers.push(() => hopCourse.update(g.world));
        g.framePollers.push(() => barkBubble.update(g, performance.now()));
        g.framePollers.push(() => ambientBubbles.update(g, performance.now()));
        // R0296: the routine stations' prop gags beside the Keepers.
        const routineProps = new RoutineProps(root);
        g.framePollers.push(() => routineProps.update(g));
        // R0329: the weather gags over the Nubbins.
        const nubbinGags = new NubbinGags(root);
        g.framePollers.push(() => nubbinGags.update(g));
        // PERF: the panel stack now hears only real `hidden` changes; the dialogue's waiting class
        // still follows its wait every frame, as it did when the pollers rewrote `hidden`.
        g.framePollers.push(() => dialogue.sync());
        // TECH-16: the shake meter while a held egg is dragged and shaken.
        const shakeMeter = new ShakeMeter(root);
        g.framePollers.push(() => {
          const now = performance.now();
          shakeMeter.update(g.world, g.input.shake.progress(now), now);
        });
      }
      // TECH-17: the sheet covers the chip, so it hides while the sheet is open.
      carry.hidden = !carrying || !sheet.root.hidden;
      if (carrying) {
        const n = g.world.nubbins.find((x) => x.id === carrying);
        carryText.textContent = UI_TEXT.carrying(n?.name ?? NAMES.creature);
        // TECH-17: a ready egg's Put down says it hatches.
        const ready = n?.stage === 'egg' && n.hatchRemainingMs <= 0;
        const label = ready ? HATCH_BUTTON_TEXT.putDownToHatch : UI_TEXT.putDown;
        if (putDown.textContent !== label) putDown.textContent = label;
        putDown.classList.toggle('btn-primary', ready);
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
      else if (karate.screen.isOpen) playSong(liveBattleSong(game()?.world));
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
        photoSpotBtn.update(dialogue.isOpen || away.isOpen || photo.isOpen());
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
        // R0139 (lane D r9): the biome's sound bed, quiet whenever the ambience is.
        setBiomeBed(
          dialogue.isOpen || expedition.isOpen || races.screen.isOpen || karate.screen.isOpen
            ? null
            : REGIONS[regionOf(g.world.location)].biome,
        );
      }
      if (quests.isOpen() && Math.random() < 0.1) quests.refresh();
      // Learning Grove: no races or karate; the 🧭 button is the games; breaks on time.
      const isEdu = !!g.world.edu;
      racesBtn.hidden = isEdu;
      dungeon.refresh(g.world);
      glowCave.refresh();
      expeditionBtn.title = isEdu ? EDU_TEXT.play : UI_TEXT.expedition;
      expeditionBtn.setAttribute('aria-label', expeditionBtn.title);
      setActionGlyph(expeditionBtn, isEdu ? '🎓' : '🧭');
      setActionLabel(
        expeditionBtn,
        isEdu ? UI_FX_TEXT.actionLabels.play : UI_FX_TEXT.actionLabels.expedition,
      );
      visitBtn.hidden = isEdu || !visitHas;
      // The keyboard hint is for grown-up desktops, not for a 3-year-old's screen.
      const keysHint = root.querySelector<HTMLElement>('.keys-hint');
      // TECH-60: gone for good once the keys have been used.
      const keysOff = isEdu || keysHintDone();
      if (keysHint && keysHint.hidden !== keysOff) keysHint.hidden = keysOff;
      // R0678 / R0679 (lane E r7): the sprout band's simple HUD of big picture buttons; the
      // grown-up controls hide (style.css, `body.edu-sprout`). Readers keep the full HUD.
      const sprout = isEdu && g.world.edu?.band === 'sprout';
      if (document.body.classList.contains('edu-sprout') !== sprout)
        document.body.classList.toggle('edu-sprout', sprout);
      /* Lane E r9, R0679: the sprout's four picture buttons say what they open. */
      setActionLabel(journalBtn, sprout ? SPROUT_HUD_TEXT.story : UI_FX_TEXT.actionLabels.journal);
      setActionGlyph(rosterBtn, sprout ? '🐣' : '📋');
      setActionLabel(rosterBtn, sprout ? SPROUT_HUD_TEXT.nubbins : UI_FX_TEXT.actionLabels.roster);
      setActionGlyph(moreBtn, sprout ? '🗺' : '⋯');
      setActionLabel(moreBtn, sprout ? SPROUT_HUD_TEXT.places : UI_FX_TEXT.actionLabels.more);
      // Pixel's cabinet: after chapter 5 in Hazel's Grove (canon 29), from the start in the Free Grove.
      const cabinetOpen =
        !isEdu && (currentSlot().mode === 'free' || (g.world.campaign?.chapter ?? 0) > 5);
      // The rift: Mature content 18+ only (canon 20, 33). The rainbow gate: as the fun quests,
      // from the start in the Free Grove and after chapter 2 in Hazel's Grove.
      const riftOpen = !isEdu && g.world.settings.matureContent === 'adult';
      const gateOpen =
        !isEdu && (currentSlot().mode === 'free' || (g.world.campaign?.chapter ?? 0) > 2);
      // PERF: each button's final state in one pass, and only when an input changed. It used to
      // set `.not-edu` visible and then `.cabinet`, `.rift` and `.neo-gate` hidden every refresh,
      // a real attribute flip-flop that restyled the HUD.
      const moreKey = `${isEdu}|${cabinetOpen}|${riftOpen}|${gateOpen}`;
      if (moreKey !== moreKeyShown) {
        moreKeyShown = moreKey;
        for (const b of moreList.querySelectorAll<HTMLElement>('.edu-only')) b.hidden = !isEdu;
        for (const b of moreList.querySelectorAll<HTMLElement>('.not-edu'))
          b.hidden =
            isEdu ||
            (b.classList.contains('cabinet') && !cabinetOpen) ||
            (b.classList.contains('rift') && !riftOpen) ||
            (b.classList.contains('neo-gate') && !gateOpen);
      }
      if (festivalsFor !== g) {
        festivalsFor = g;
        announceFestivals(g, toast);
      }
      setActionGlyph(soundBtn, g.world.settings.sound ? '🔊' : '🔇');
      soundBtn.setAttribute('aria-pressed', String(g.world.settings.sound));
      if (isEdu) {
        const now = Date.now();
        // R0724: a round, scene or tracing still open finishes first (within a grace).
        const midActivity = edu.isOpen() || dialogue.isOpen || journal.isTracing();
        if (!eduBreakActive(g.world, now) && eduBreakShouldStart(g.world, midActivity))
          g.send({ kind: 'eduStartBreak' });
        breakWarn.update(g);
        // Lane E r8, R0695.
        limitCard.update(now);
        syncKidsLock(g);
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
        guide.update(busy || eduPrompt.isOpen);
        sproutTutorial.update(g, busy || eduPrompt.isOpen || guide.isShowing()); /* Lane E r10 */
        shakeHint.update(g, busy || eduPrompt.isOpen, guide.isShowing());
        selectionLive.update(g.world, g, busy || eduPrompt.isOpen);
        applyHudScheme(g.world);
        kidNotices.flush();
        lossNotice.update(g, busy);
        dueWave.update(g, busy || eduPrompt.isOpen); /* R0701 */
        // R0729: the chip would repeat the chapter card while it is up.
        objective.refresh(busy || eduPrompt.isOpen || !!g.placing || titleCardUp());
        offerCard.refresh(busy || eduPrompt.isOpen || !!g.placing || titleCardUp());
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
      // HOT-1: with the stats sheet open the camera centres on its Nubbin in the part of the
      // screen the sheet leaves clear (a bottom sheet on a phone, docked right on a desktop),
      // measured from the sheet itself rather than a fixed share of the view.
      g.cameraLift = 0;
      g.cameraSide = 0;
      // R0473 (lane D r10): measure the canvas only with the sheet open (it forced a layout).
      g.sheetFocus =
        sheet.root.hidden || !sheet.selectedId
          ? null
          : sheetFocusFor(sheet.root, sheet.selectedId, g.canvas.getBoundingClientRect());
      // R0552 (lane A r9): snores and chat chirps near the Keeper.
      const amb = soulAmbient.tick(g.world, performance.now());
      if (amb) playSound(amb);
      // R0549 (lane A r9): its mood bubble is drawn big while the sheet is open.
      setEmoteFocus(g.sheetFocus?.id ?? null);
      hollowBout.update();
      g.storySpeaker = dialogue.speaker;
      g.storyLine = dialogue.line;
      // The Run and camera buttons sit under the dialogue box on a phone: hide them meanwhile.
      document.documentElement.classList.toggle('dialogue-open', dialogue.isOpen);
      if (g.placing) placingText.textContent = UI_TEXT.placing(placingLabel(g.placing));
      // R0003: on a desktop the chip says, before the click, whether the piece fits there.
      const fit = g.placing?.mode === 'decor' && g.placeHoverAt ? placeHint(g) : null;
      placingChip.classList.toggle('placing-bad', !!fit && fit !== true);
      if (fit && fit !== true) placingText.textContent = `✗ ${UI_TEXT.decorRefused[fit]}`;
      else if (fit) placingText.textContent += ` · ✓ ${PLACE_TEXT.fits}`;
      rotateBtn.hidden = g.placing?.mode !== 'decor';
      if (kindergarten.isOpen() && Math.random() < 0.1) kindergarten.refresh();
      // A debug chapter jump empties the queue: drop the old scene so the new one plays now.
      if (c) dialogue.dropStale(c.queue);
      // Hazel's Grove never starts a scene underground in the Hollow Below: it waits for the
      // Grove (review 2026-10-24, item 4). A storyline's own floor scenes still play there.
      // Nor under the loading veil: the first lines would play unseen while 3D builds.
      const veiled = !!document.querySelector('.load-veil');
      // R0597 (lane C r10 agent A): nor a line's scene outside its region.
      const held =
        veiled ||
        (!!c && !c.storyline && g.world.location === 'dungeon') ||
        (!!c?.queue[0] && sceneWaitsForRegion(g.world, c.queue[0]));
      const next = held ? undefined : c?.queue[0];
      // cg5: the Hollow's floor bar and minimap stay off between a floor scene's lines too
      // (the chapter card, the beat before the next scene), not only while a line is up.
      document.documentElement.classList.toggle(
        'story-queued',
        !!next && dialogue.shouldPlay(next),
      );
      if (heldQuiet.length > 0 && !firstMinuteQuiet(g.world)) {
        for (const t of heldQuiet.splice(0)) toast(t);
      }
      if (
        hs.heldFestival &&
        !firstMinuteQuiet(g.world) &&
        !(next && dialogue.shouldPlay(next)) &&
        !dialogue.isOpen &&
        !away.isOpen &&
        !g.catchingUp
      ) {
        toast(hs.heldFestival);
        playSound('win');
        hs.heldFestival = null;
      }
      // R0359: the season's festival vignette, once per save, when nothing else is up.
      const gag = hs.heldFestival ? null : festivalGagDue(g.world);
      if (
        gag &&
        !festivalGagsStarted.has(gag) &&
        !(next && dialogue.shouldPlay(next)) &&
        !dialogue.isOpen &&
        !away.isOpen &&
        !g.catchingUp
      ) {
        festivalGagsStarted.add(gag);
        dialogue.playScene(FESTIVAL_GAGS[gag], {}, () =>
          game()?.send({ kind: 'festivalGagSeen', season: gag }),
        );
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
        !hollowBout.isOpen() &&
        !photo.isOpen() &&
        !atlas.isOpen() &&
        !cabinet.isOpen()
      ) {
        sheet.close();
        playStoryScene(next);
      }
    }
    FRAME_WORK.hudMs += performance.now() - hudT0;
    refreshTimer = window.setTimeout(refreshLoop, 200);
  }
  void refreshTimer;

  // Lane C r7 (R0624): the Home Screen card and the backup chip.
  const backupNudge = new BackupNudge(root, game);
  // Lane C r8 (R0606): the Open quest flow's offer card and its folded chip.
  const offerCard = new OfferCard(root, game, (t) => toast(t));
  const evCtx: EventCtx = {
    ambientBubbles,
    backupNudge,
    barkBubble,
    celebration,
    curiosities,
    dungeon,
    edu,
    expedition,
    game,
    gym,
    hatchCard,
    heldQuiet,
    hopCourse,
    karate,
    landmarkCard,
    locationLabel,
    noticing,
    offerCard,
    races,
    regionChip,
    shop,
    tank,
    toast,
    hs,
  };
  const hooks: GameHooks = {
    onEvents(events: SimEvent[]) {
      handleHudEvents(evCtx, events);
    },
    // R0620: with Aging while closed off there is no away screen; the recap still follows a long break.
    onBreak(elapsedMs: number) {
      const g = game();
      if (g?.world.campaign && recapDue(elapsedMs)) recap.show(g);
    },
    onAway(report: AwayReport, closed: () => void) {
      const g = game();
      // Shown at once, so no story scene can start under it; the scene waits for it to close.
      // Lane C r10 agent C (R0620): after a long break, the recap follows it, never before.
      const done = recapDue(report.elapsedMs)
        ? () => {
            closed();
            const now = game();
            if (now?.world.campaign) recap.show(now);
          }
        : closed;
      if (g) away.show(report, g.world, done);
      else setTimeout(() => (game() ? away.show(report, game()!.world, done) : done()), 0);
    },
    onSelect(id) {
      const g = game();
      curiosities.onSelect(id); /* Lane E r9 */
      if (id?.startsWith('memorial:') && g) {
        const m = g.world.memorials.find((x) => x.id === id.slice('memorial:'.length));
        if (m) memorialCard.show(m);
        return;
      }
      if (id?.startsWith('building:') && g) {
        const which = id.slice('building:'.length);
        // R0742: in the Learning Grove the hut is the door to Play & learn.
        if (which === 'school') (g.world.edu ? edu : kindergarten).open();
        else if (which === 'dojo') karate.open();
        // R0527 (lane A r10): a Nubbin hiding inside is coaxed out by a tap on the door.
        else if (which === 'cottage' && g.world.nubbins.some((n) => n.cottageHide))
          g.send({ kind: 'coaxOut' });
        else if (which === 'cottage') pocket.open(sheet.selectedId);
        else if (which === 'workshop') decorate.open('workshop');
        // R0630: the doors to the story worlds, tapped in the Grove.
        else if (which === 'door-atlas') atlas.open();
        else if (which === 'door-cabinet') cabinet.open();
        else if (which === 'door-rift') rift.open();
        else if (which === 'door-gate') neoGate.open();
        else if (which === 'nursery') toast(UI_TEXT.nurseryTap);
        else if (which === 'bathhouse') toast(UI_TEXT.bathhouseTap);
        else if (which === 'host') g.send({ kind: 'neighbourGift' });
        else if (which === 'windmill') toast(UI_TEXT.windmillTap);
        else if (which === 'cave') dungeon.open();
        // R0072: an outer-ring piece answers with its line.
        // R0129: and a gag on later taps (`ui/outer-gag.ts`).
        else if (outerTapOf(which)) toast(outerLine(which, g.world) ?? '');
        // R0095: the village square's buildings and recruits.
        else villageTap(which, g.world, { shop: () => shop.open(), gym: () => gym.open() }, toast);
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
      // R0322: repeated taps on a Nubbin squeak up the scale (ui/tap-toy.ts).
      if (id && g && g.world.nubbins.some((n) => n.id === id))
        tapToy(g, id, sheet.selectedId, performance.now());
      if (id) sheet.open(id);
      else sheet.close();
    },
    onStorageBlocked() {
      // Lane C r11 (R0623): a full store offers the backup file; blocked storage says so.
      if (lastSaveProblem() === 'full') offerStorageFull(toast);
      else toast(UI_TEXT.storageBlocked);
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
    setIconGlyph(g, glyph); // R0502: pixel-art icon where there is one
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
  if (g) setIconGlyph(g, glyph);
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
    while (queue.length > 0 && visible < FIRST_MINUTE.maxVisibleToasts) {
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

/** HOT-1: the sheet's Nubbin and where it should sit, from the sheet's box over the canvas. */
function sheetFocusFor(
  root: HTMLElement,
  id: string | null,
  canvas: { left: number; top: number; width: number; height: number },
): Game['sheetFocus'] {
  if (root.hidden || !id || canvas.width <= 0) return null;
  const r = root.getBoundingClientRect();
  const box = {
    left: r.left - canvas.left,
    top: r.top - canvas.top,
    right: r.right - canvas.left,
    bottom: r.bottom - canvas.top,
  };
  return { id, shift: clearShift(canvas.width, canvas.height, box) };
}
