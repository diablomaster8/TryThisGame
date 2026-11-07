/**
 * The HUD's 200 ms refresh step: syncs the buttons, music, panels and story scenes with the
 * world. Split from hud.ts (TECH-24); the HUD passes its parts in one context object.
 * Reads world state and sends commands only.
 */
import { GROVE } from '../config/tuning';
import { SNOWBALL } from '../config/tuning-r13d1';
import { GROVE_LABELS, NAMES, UI_TEXT, EDU_TEXT } from '../config/strings';
import { HATCH_BUTTON_TEXT } from '../config/strings-r8d';
import { SPROUT_HUD_TEXT } from '../config/strings-look-r9e';
import { UI_FX_TEXT } from '../config/strings-ui';
import { PLACE_TEXT } from '../config/strings-fun-r7';
import { REGIONS } from '../config/regions';
import { FESTIVAL_GAGS } from '../content/festival-gags';
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
} from '../platform/audio';
import { applyVoices } from '../platform/voices';
import { setBiomeBed } from '../platform/biome-beds';
import { buzz } from '../platform/haptics';
import { FRAME_WORK } from '../platform/frame-spikes';
import { coarsePointer } from '../platform/viewport';
import { currentSlot } from '../platform/storage';
import { clearShift } from '../render/view-shift';
import { localHour, phaseAt } from '../render/daylight';
import { setEmoteFocus } from '../render/emote-size';
import { regionOf } from '../sim/regions';
import { sceneWaitsForRegion } from '../sim/story-regions';
import { eduBreakActive, eduBreakShouldStart } from '../sim/edu';
import { firstMinuteQuiet } from '../sim/first-loop';
import { festivalGagDue } from '../sim/festival-gags';
import { visitingTrainer } from '../sim/neighbourhood';
import type { Game } from '../game';
import type { JumpButtonLook } from './jump-states';
import type { HopLessonChip } from './hop-lesson-chip';
import type { HopCourseChip } from './hop-course';
import type { BarkBubble } from './bark-bubble';
import type { AmbientBubbles } from './bark-bubble';
import type { LookoutChip } from './lookout-chip';
import type { RegionChip } from './region-chip';
import type { LossNotice } from './loss-notice';
import type { DueWave } from './lang-due'; /* R0701 */
import type { GlowCave } from './glow-cave';
import type { CuriosityWatch } from './curiosities';
import type { SoulAmbient } from './soul-ambient';
import type { StatsSheet } from './stats-sheet';
import type { AwayScreen } from './away-screen';
import type { Celebration } from './celebration';
import type { ShopMenu } from './shop';
import type { ExpeditionScreen } from '../minigames/expedition/screen';
import type { RacesMenu } from './races';
import type { Dialogue } from './dialogue';
import type { Journal } from './journal';
import type { PartyBoutPanel } from './party-bout';
import type { KindergartenMenu } from './kindergarten';
import type { KarateMenu } from './karate';
import type { PhotoMode } from './photo';
import type { PhotoSpotButton } from './photo-spot-button';
import type { PocketMode } from './pocket';
import type { QuestBoard } from './garden-panels';
import type { EduScreen } from './edu';
import type { ObjectiveChip } from './objective';
import type { EduPrompt } from './objective';
import type { Guide } from './guide';
import type { ShakeHint } from './shake-hint';
import type { SelectionLive } from './a11y-live';
import type { SproutTutorial } from './sprout-tutorial';
import type { BreakScreen } from './edu';
import type { LimitCard } from './edu-limits';
import type { BreakWarning } from './break-warning';
import type { GymMenu } from './gym';
import type { DungeonMenu } from './dungeon';
import type { HollowBoutPanel } from './dungeon-bout';
import type { TankScreen } from '../minigames/tank/screen';
import type { StoryShelf } from './atlas';
import type { OfferCard } from './offer-card';
import type { Nubbin } from '../sim/types';
import { askResume } from './battle-scenes';
import { liveBattleSong } from './battle-sfx';
import { holdRenderWhile } from './render-hold';
import { keysHintDone } from './keys-hint';
import { applyHudScheme } from './hud-scheme';
import { syncKidsLock } from './edu-limits';
import { placeHint, placingLabel } from './decorate';
import { announceFestivals } from './atlas';
import { titleCardUp } from './title-card';
import { RoutineProps } from './routine-props';
import { NubbinGags } from './nubbin-gags';
import { ShakeMeter } from './shake-meter';
import { Joystick } from './joystick';
import { joystickWanted } from './joystick-math';
import { setIconGlyph } from './pixel-icons';
import type { HudState } from './hud-events';
import type { DebugPanel } from './debug-panel';
import type { PanelStack } from './panel-stack';

/** PERF: the More menu's last applied visibility inputs, per menu list. */
const moreKeyShown = new WeakMap<HTMLElement, string>();

export interface RefreshCtx {
  root: HTMLElement;
  game: () => Game | null;
  runOn: () => boolean;
  setRunning: (on: boolean) => void;
  debug: () => DebugPanel | null;
  shells: HTMLElement;
  fruit: HTMLElement;
  moreBtn: HTMLButtonElement;
  soundBtn: HTMLButtonElement;
  keeperBtn: HTMLButtonElement;
  groveBtn: HTMLButtonElement;
  expeditionBtn: HTMLButtonElement;
  racesBtn: HTMLButtonElement;
  journalBtn: HTMLButtonElement;
  rosterBtn: HTMLButtonElement;
  jumpBtn: HTMLButtonElement;
  snowBtn: HTMLButtonElement;
  jumpLook: JumpButtonLook;
  hopLesson: HopLessonChip;
  hopCourse: HopCourseChip;
  barkBubble: BarkBubble;
  ambientBubbles: AmbientBubbles;
  lookout: LookoutChip;
  regionChip: RegionChip;
  carry: HTMLElement;
  carryText: HTMLElement;
  putDown: HTMLButtonElement;
  kidNotices: { toast: (text: string, ms?: number) => void; flush: () => void };
  toast: (text: string, ms?: number) => void;
  lossNotice: LossNotice;
  curiosities: CuriosityWatch;
  soulAmbient: SoulAmbient;
  sheet: StatsSheet;
  away: AwayScreen;
  celebration: Celebration;
  shop: ShopMenu;
  expedition: ExpeditionScreen;
  races: RacesMenu;
  dialogue: Dialogue;
  journal: Journal;
  partyBout: PartyBoutPanel;
  kindergarten: KindergartenMenu;
  karate: KarateMenu;
  photo: PhotoMode;
  photoSpotBtn: PhotoSpotButton;
  pocket: PocketMode;
  quests: QuestBoard;
  edu: EduScreen;
  objective: ObjectiveChip;
  eduPrompt: EduPrompt;
  guide: Guide;
  shakeHint: ShakeHint;
  selectionLive: SelectionLive;
  sproutTutorial: SproutTutorial;
  breakScreen: BreakScreen;
  limitCard: LimitCard;
  breakWarn: BreakWarning;
  gym: GymMenu;
  dungeon: DungeonMenu;
  glowCave: GlowCave;
  dueWave: DueWave;
  visit: { btn: HTMLElement; has: () => boolean };
  hollowBout: HollowBoutPanel;
  tank: TankScreen;
  atlas: StoryShelf;
  cabinet: StoryShelf;
  moreList: HTMLElement;
  placingChip: HTMLElement;
  placingText: HTMLElement;
  rotateBtn: HTMLButtonElement;
  homeBtn: HTMLButtonElement;
  stack: PanelStack;
  offerCard: OfferCard;
  hs: HudState;
  heldQuiet: string[];
  festivalGagsStarted: Set<string>;
  playStoryScene: (id: string) => void;
  pickRunner: () => Nubbin | null;
}

/** State the refresh step keeps between calls. */
export interface RefreshState {
  joystick: Joystick | null;
  resumeAsked: boolean;
  jumpPolled: boolean;
  festivalsFor: unknown;
}

export function refreshStep(hc: RefreshCtx, rs: RefreshState): void {
  const { root, game } = hc;
  const {
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
  } = hc;
  const hudT0 = performance.now();
  const g = game();
  if (g) {
    curiosities.tick(g.world, g.camera.currentYawIndex);
    shells.textContent = `🐚 ${g.world.inventory.shells}`;
    fruit.textContent = `🍎 ${g.world.inventory.fruit}`;
    setActionGlyph(keeperBtn, g.world.keeper.alignment === 'sun' ? '☀' : '☾');
    if (!rs.joystick) {
      rs.joystick = new Joystick(root, g.camera, (cmd) => g.send(cmd), {
        set: hc.setRunning,
        isOn: () => hc.runOn(),
      });
      g.framePollers.push(() => rs.joystick?.poll());
    }
    // R0510: in the Hollow on a touch device the stick is on without a trip to Settings.
    rs.joystick.setVisible(
      joystickWanted(!!g.world.settings.joystick, g.world.location, coarsePointer()),
    );
    rs.joystick.onEdge = () =>
      void buzz(
        'stickEdge',
        g.world.settings,
        document.documentElement.classList.contains('reduce-motion'),
      );
    // MOVE-14: Left-handed mirrors the thumb buttons and the pad.
    const lefty = !!g.world.settings.leftHanded;
    rs.joystick.leftHanded = lefty;
    document.documentElement.classList.toggle('left-handed', lefty);
    const anyUnlocked = g.world.unlocks.sunGrove || g.world.unlocks.moonGrove;
    groveBtn.hidden = !anyUnlocked;
    snowBtn.hidden = !(
      g.world.location === 'region:ridge' && g.world.keeper.pos.z <= SNOWBALL.snowZ
    );
    groveBtn.textContent = GROVE_LABELS[g.world.grove];
    const carrying = g.world.keeper.carrying;
    const shakes = !!carrying || g.world.nubbins.some((n) => n.behavior.state === 'held');
    const jumpGlyph = shakes ? '🥚' : '⤒';
    jumpLook.setGlyph(jumpGlyph);
    jumpBtn.setAttribute('aria-label', shakes ? UI_TEXT.shake : UI_TEXT.jump);
    if (!rs.resumeAsked) {
      rs.resumeAsked = true;
      setTimeout(() => askResume(root, game), 1500);
    }
    if (!rs.jumpPolled) {
      rs.jumpPolled = true;
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
    hc.debug()?.refresh();
    // Story scenes wait their turn behind other panels.
    const c = g.world.campaign;
    journalBtn.hidden = !c;
    // Which piece plays: story over dialogue, the minigames their own, else the hour's.
    setMusicEnabled(g.world.settings.music);
    applyVoices(g.world.settings, g.world.edu);
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
    } else if (g.world.location === 'hollow' || g.world.location === 'dungeon') playSong('hollow');
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
    visit.btn.hidden = isEdu || !visit.has();
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
    if (moreKeyShown.get(moreList) !== moreKey) {
      moreKeyShown.set(moreList, moreKey);
      for (const b of moreList.querySelectorAll<HTMLElement>('.edu-only')) b.hidden = !isEdu;
      for (const b of moreList.querySelectorAll<HTMLElement>('.not-edu'))
        b.hidden =
          isEdu ||
          (b.classList.contains('cabinet') && !cabinetOpen) ||
          (b.classList.contains('rift') && !riftOpen) ||
          (b.classList.contains('neo-gate') && !gateOpen);
    }
    if (rs.festivalsFor !== g) {
      rs.festivalsFor = g;
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
    document.documentElement.classList.toggle('story-queued', !!next && dialogue.shouldPlay(next));
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
}

export function setActionGlyph(b: HTMLButtonElement, glyph: string): void {
  const g = b.querySelector('.act-glyph');
  if (g) setIconGlyph(g, glyph);
}

export function setActionLabel(b: HTMLButtonElement, label: string): void {
  const l = b.querySelector('.act-label');
  if (l && l.textContent !== label) l.textContent = label;
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
