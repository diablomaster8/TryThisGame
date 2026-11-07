import { CAMERA, INPUT, UI } from '../config/tuning';
import { ALBUM_TEXT } from '../config/strings-soul-r11b';
import { mountWatch } from './watch';
import { AnticAlbum } from './antic-album';
import { albumIdOf } from '../sim/antic-album';
import { EduNoticing } from './edu-noticing'; /* R0723 */
import { GlowCave } from './glow-cave';
import { DueWave } from './lang-due'; /* R0701 */
import { mountEduSignposts } from './edu-signposts';

import { offerStorageFull } from './backup'; /* Lane C r11 */
import { lastSaveProblem } from '../platform/save-room';

import { UI_TEXT, DUNGEON_TEXT } from '../config/strings';
import type { Game, GameHooks } from '../game';
import type { AwayReport, SimEvent } from '../sim/types';
import { refreshStep, type RefreshCtx, type RefreshState } from './hud-refresh';
import { makeToaster } from './hud-toasts';
import {
  cycleGrove,
  locationLabel,
  startExpedition,
  startFunRun,
  startTank,
  type ActionCtx,
} from './hud-actions';
import { mountChips } from './hud-chips';
import { mountRunJump } from './hud-moves';
import { buildTopbar } from './hud-topbar';
import { handleSelect, type SelectCtx } from './hud-select';
import { fillMoreList, mountVisitEntry } from './hud-more';
import { handleHudEvents, type EventCtx, type HudState } from './hud-events';
import { ExpeditionScreen } from '../minigames/expedition/screen';

import type { Nubbin } from '../sim/types';
import { AwayScreen } from './away-screen';
import { RecapCard, recapDue } from './recap';
import { skipCardOpen } from './skip-card';
import { setBattleDialogue } from './battle-scenes';
import { Celebration } from './celebration';
import type { DebugPanel } from './debug-panel';
import { askGrownUp } from './grown-up-gate';
import { KidSoundSheet, routeSettingsTap } from './kid-sheet';
import { grownUpCorner } from './kids-corner'; /* Lane E r10 */
import { SproutTutorial } from './sprout-tutorial'; /* Lane E r10 */
import { Guide } from './guide';
import { kidToaster } from './kid-notice';
import { BreakWarning } from './break-warning';

import { RacesMenu } from './races';
import { RosterMenu } from './roster';
import { ShopMenu } from './shop';
import { TrainersMenu } from './trainers';
import { button, el } from './dom';

import { LookoutChip } from './lookout-chip';
import { RegionChip } from './region-chip';
import { HopLessonChip } from './hop-lesson-chip';
import { HopCourseChip } from './hop-course';
import { AmbientBubbles, BarkBubble } from './bark-bubble';
import { bandToaster } from './fun-toasts';
import { dedupeToaster } from './event-dedupe';
import { HatchCard } from './hatch-card';

import { isGameKey, isTypingTarget } from '../input/keys';
import { SettingsMenu } from './settings';
import { StatsSheet } from './stats-sheet';
import { Dialogue } from './dialogue';
import { Journal } from './journal';
import { PartyBoutPanel } from './party-bout';
import { boutTier, loggedPartyIds } from '../sim/storyline-rules-logged';

import { KindergartenMenu } from './kindergarten';
import { KarateMenu } from './karate';
import { CollectionBook, MemorialCard } from './collection';

import { DecorateMenu } from './decorate';
import { MapPanel, NeighbourhoodPanel, ProfilePanel, QuestBoard } from './garden-panels';
import { BreakScreen, EduScreen, GrownUpPanel } from './edu';
import { StickerBook } from './sticker-book';
import { EduPlaces } from './edu-places';
/* Lane E r9 */
import { LimitCard } from './edu-limits';
import { GymMenu } from './gym';
import { DungeonMenu } from './dungeon';
import { HollowBoutPanel } from './dungeon-bout';
import { TankScreen } from '../minigames/tank/screen';
import { TEN_TEXT } from '../config/strings';
import { EDU_TEXT } from '../config/strings';

import { PhotoMode } from './photo';
import { PhotoSpotButton } from './photo-spot-button';
import { PocketMode } from './pocket';
import { modal } from './dom';
import { showCrashCard } from './gl-failure';
import { mountPanelStack } from './panel-stack';
import { ATLAS_TEXT } from '../config/strings';
import { visitingTrainer } from '../sim/neighbourhood';
import { loadArcade, loadAtlas, loadMultiverse, loadNeopia } from '../sim/atlas';
import { storageAvailable } from '../platform/storage';
import { StoryShelf } from './atlas';
import { askRift } from './rift-confirm';
import { askAdultScene } from './adult-entry';
import {
  adultSceneGate,
  isAdultScene,
  lastAdultEntry,
  noteAdultEntry,
} from '../platform/mature-recheck';
import { MATURE_RECHECK } from '../config/tuning-tech';

import { BackupNudge } from './backup-nudge';
import { OfferCard } from './offer-card';

import { EduPrompt, ObjectiveChip } from './objective';
import { mountCompass } from './compass';
import { mountMinimap } from './minimap';
import { mountWalkTuck } from './walk-tuck';
import { mountBeacon } from './beacon-arrow';
import { mountLandmarkCard } from './landmark-card';
import { mountBackupOffer } from './backup-offer';
import { isKeysHintKey, showKeysHintAgain, watchKeysHint } from './keys-hint';

import { ShakeHint } from './shake-hint';
import { SelectionLive } from './a11y-live';
import { PressInfo } from './press-info';

import { watchOnline } from './offline-chip';
import { gateOfflineEntries } from './offline-entries';

import { CuriosityWatch } from './curiosities';
import { commandTaps } from '../game'; /* Lane E r9 */
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
  const bar = buildTopbar(root, game, {
    logo: () => onLogoTap(),
    places: () => eduPlaces.open(),
    more: () => visit.show(),
    settings: () => void routeSettingsTap(!!game()?.world.edu, settingsRoute),
    openSettings: () => settings.open(),
    kidSheet: () => kidSheet.open(),
    trainers: () => trainers.open(),
    cycleGrove: () => cycleGrove(game),
    shop: () => shop.open(),
    edu: () => edu.open(),
    expedition: () => startExpedition(actionCtx),
    eduNext: () => edu.showNext(),
    races: () => races.open(),
    journal: () => journal.open(),
    roster: () => roster.open(),
  });
  const { top, shells, fruit, moreBtn, settingsBtn, soundBtn, keeperBtn, groveBtn, shopBtn } = bar;
  const { expeditionBtn, racesBtn, journalBtn, rosterBtn } = bar;

  const rj = mountRunJump(root, game, [keeperBtn, shopBtn, groveBtn, settingsBtn]);
  const { setRunning, jumpBtn, jumpLook, snowBtn } = rj;
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
  mountEduSignposts(root, game);
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
  const actionCtx: ActionCtx = { game, pickRunner, toast, sheet, expedition, tank, races };
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
  // The "More" menu holds everything that does not fit the top bar.
  const more = modal(root, UI_TEXT.more, UI_TEXT.close);
  more.body.appendChild(el('p', 'help', UI_TEXT.moreHelp));
  const moreList = el('div', 'title-menu');
  const visit = mountVisitEntry(root, game, more);
  fillMoreList(
    more,
    moreList,
    [
      [`🏫 ${UI_TEXT.kindergarten}`, () => (game()?.world.edu ? edu : kindergarten).open()],
      [`🥋 ${UI_TEXT.karate}`, () => karate.open()],
      [`📔 ${UI_TEXT.collection}`, () => book.open()],
      [`🪴 ${UI_TEXT.decorate}`, () => decorate.open()],
      [`📷 ${UI_TEXT.photo}`, () => photo.open()],
      [`👜 ${UI_TEXT.pocket}`, () => pocket.open(sheet.selectedId)],
      [`🏋 ${TEN_TEXT.gym}`, () => gym.open()],
      [`🪲 ${TEN_TEXT.tank}`, () => startTank(actionCtx)],
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
    ],
    game,
    () => karate.open(),
    visit.btn,
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
      beetle: () => startTank(actionCtx),
      shellDash: () => startExpedition(actionCtx),
      funRun: () => startFunRun(actionCtx),
      glowCave: () => dungeon.open(),
      atlas: () => atlas.open(),
      arcade: () => cabinet.open(),
    },
    () => grownUps.open(),
  );
  const { placingChip, placingText, rotateBtn, homeBtn } = mountChips(root, game, toast);
  // The Grove whose festivals were last checked against the side saves.
  if (import.meta.env.DEV) {
    // Console access during development, alongside `window.grove`.
    (window as unknown as { groveUi: unknown }).groveUi = {
      shop,
      expedition,
      sheet,
      get creator() {
        return roster.creator;
      },
      get creatorGallery() {
        return roster.creator.gallery;
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
        if (g && visitingTrainer(g.world) && !dialogue.isOpen)
          game()?.send({ kind: 'visit', trainer: null });
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

  function refreshLoop(): void {
    refreshStep(refreshCtx, refreshState);
    refreshTimer = window.setTimeout(refreshLoop, 200);
  }
  void refreshTimer;

  // Lane C r7 (R0624): the Home Screen card and the backup chip.
  const backupNudge = new BackupNudge(root, game);
  // Lane C r8 (R0606): the Open quest flow's offer card and its folded chip.
  const offerCard = new OfferCard(root, game, (t) => toast(t));
  const refreshState: RefreshState = {
    joystick: null,
    resumeAsked: false,
    jumpPolled: false,
    festivalsFor: null,
  };
  const refreshCtx: RefreshCtx = {
    root,
    game,
    runOn: rj.runOn,
    setRunning,
    debug: () => debug,
    shells,
    fruit,
    moreBtn,
    soundBtn,
    keeperBtn,
    groveBtn,
    expeditionBtn,
    racesBtn,
    journalBtn,
    rosterBtn,
    jumpBtn,
    snowBtn,
    jumpLook,
    hopLesson,
    hopCourse,
    barkBubble,
    ambientBubbles,
    lookout,
    regionChip,
    carry,
    carryText,
    putDown,
    kidNotices,
    toast,
    lossNotice,
    curiosities,
    soulAmbient,
    sheet,
    away,
    celebration,
    shop,
    expedition,
    races,
    dialogue,
    journal,
    partyBout,
    kindergarten,
    karate,
    photo,
    photoSpotBtn,
    pocket,
    quests,
    edu,
    objective,
    eduPrompt,
    guide,
    shakeHint,
    selectionLive,
    sproutTutorial,
    breakScreen,
    limitCard,
    breakWarn,
    gym,
    dungeon,
    glowCave,
    dueWave,
    visit,
    hollowBout,
    tank,
    atlas,
    cabinet,
    moreList,
    placingChip,
    placingText,
    rotateBtn,
    homeBtn,
    stack,
    offerCard,
    hs,
    heldQuiet,
    festivalGagsStarted,
    playStoryScene,
    pickRunner,
  };
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
  const selectCtx: SelectCtx = {
    game,
    curiosities,
    memorialCard,
    kindergarten,
    edu,
    karate,
    pocket,
    sheet,
    decorate,
    atlas,
    cabinet,
    rift,
    neoGate,
    dungeon,
    shop,
    gym,
    toast,
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
      handleSelect(selectCtx, id);
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
