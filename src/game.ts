import { driveCamera } from './game-camera';
import { updateDaylight } from './game-daylight';
import { reactToEvents } from './game-events';
import { keepCheckpoints, runCatchUp } from './game-catchup';
import { stepSim } from './game-steps';
import { buildInput } from './game-input-wiring';

import { setMotionPref } from './platform/motion';
import { WalkFollow } from './render/camera-follow';
import { NO_SHIFT, type ViewShift } from './render/view-shift';

import { Vector3 } from 'three';

import { COLLECT } from './config/region-collectibles';
import { openHere } from './sim/collectibles';
import { openTraces } from './sim/regions-trace';
import { secretGlint } from './sim/world-hints';
import { SIM } from './config/tuning';
import { GameInput, type Placing } from './input/game-input';
import { CameraControls } from './input/camera-controls';
import {
  backupUnreadable,
  currentSlot,
  noteSlotLoaded,
  readSave,
  visitingProfile,
  watchOtherTabs,
  claimSlot,
  writeSave,
  writeThumb,
} from './platform/storage';
import { OrbitCamera } from './render/camera';

import { GroveScene } from './render/grove-scene';
import { Picker } from './render/picker';
import { LowResPipeline, type FrameStats } from './render/pipeline';
import { SceneStager, type FitPoint } from './render/scene-stage';

import { WorldView } from './render/world-view';
import { paintGrade } from './ui/look-paint';

import { currentGrade } from './ui/title-card';

import { syncDungeon, syncWorldScenes } from './render/world-sync';
import type { Grove3dScene } from './render3d/grove-3d-scene';
import { Clock } from './sim/clock';

import { deserialize, serialize } from './sim/save';
import type { AwayReport, Command, GraphicsMode, SimEvent, Vec2, World } from './sim/types';
import { applyCommand, createWorld, findNubbin } from './sim/world';

import { DebugOverlay } from './render/debug-colliders';

import { SpriteCuller } from './render/chunks';
import { STAGE_LINE } from './render/stage-pose';
import { FrameSpikes } from './platform/frame-spikes';

import { PixelGovernor } from './render/pixel-gov';
import { FAST_TIME } from './config/tuning-more/perf-tiers';
import { dedupeEvents } from './ui/event-dedupe';
import { PIXEL_WIND } from './render/wind-px';
import { readDeviceTier, readQualityOverride, type TierReading } from './platform/device-tier';
import { tierForRes } from './config/tuning-world';

/* Lane C r11 (R0619) */
import { playSoulSounds } from './ui/soul-sounds';

/** R0094: the pale mist a fog spell greys the pixel picture toward. */

/* Lane E r9 */
/** FUN-43: listeners told of every command sent (the curiosity triggers read them). */
export const commandTaps = new Set<(cmd: Command) => void>();

export interface GameHooks {
  onEvents(events: SimEvent[]): void;
  /**
   * Show "While you were away". End-of-life checks are held until `closed` is called, so
   * call it once the player has closed the screen.
   */
  onAway(report: AwayReport, closed: () => void): void;
  /**
   * R0620: a long break with no away screen (Aging while closed is off): the story recap may
   * still follow. Optional.
   */
  onBreak?(elapsedMs: number): void;
  onSelect(id: string | null): void;
  onStorageBlocked(): void;
  /** Another tab saved this same slot; this tab has stopped autosaving over it. */
  onOtherTab(): void;
  onCatchUpStart(): void;
  onCatchUpEnd(): void;
  /** The slot's save could not be read; `kept` says whether a copy was put aside. */
  onSaveUnreadable(kept: boolean): void;
  /** A frame threw: saving has stopped so the last good save survives. Called once. */
  onCrash(): void;
}

/**
 * Wires sim, render, input and persistence together. The sim runs fixed steps from
 * the Clock; rendering runs every frame with interpolation; autosave every 30 s and
 * when the tab hides; offline catch-up when the tab shows again or on load.
 */
export class Game {
  world: World;
  readonly clock = new Clock();
  /** Draw-call and frame-size stats from whichever renderer is on. */
  readonly pipeline: FrameStats;
  /** The pixel renderer and scene; null when the 3D scene is on. */
  readonly lowRes: LowResPipeline | null;
  readonly grove: GroveScene | null;
  /** The full-3D scene, when the Graphics setting picked it. */
  readonly scene3d: Grove3dScene | null;
  readonly camera = new OrbitCamera();
  /**
   * Sprite sheets and the pixel world; in 3D mode only its sheets serve the UI portraits.
   * Its sprite batch and 4096² mega atlas are built on the first pixel draw, so 3D never
   * allocates them.
   */
  readonly view = new WorldView();
  /** WORLD-09: skips pixel sprites that are surely off screen. */
  readonly culler = new SpriteCuller();
  readonly picker: Picker;
  readonly input: GameInput;
  readonly cameraControls: CameraControls;
  readonly pending: Command[] = [];
  /** HOT-2: frame times and the breakdown of long frames, for the debug panel and probes. */
  readonly spikes = new FrameSpikes();
  /** TECH-09: this device's performance tier and what decided it (shown in the debug panel). */
  readonly tier: TierReading;
  /** TECH-53: the Pixel renderer's frame governor (null in Full 3D). */
  pixelGov: PixelGovernor | null = null;
  /**
   * TECH-54: whether the last frame's sim steps ran out of their time budget and left some for
   * later frames (the debug panel shows "×1000 (behind)").
   */
  simBehind = false;
  rafId = 0;
  running = false;
  /** Per-frame input polls from the UI (the floating joystick), run beside the keyboard's. */
  readonly framePollers: Array<() => void> = [];
  /** While a minigame covers the screen the sim keeps going but the Grove is not drawn. */
  renderPaused = false;
  /** Debug: force an hour (0..24) instead of the real clock; null = real time. */
  hourOverride: number | null = null;
  /**
   * R0454 (TECH-12, r12-d3): the visual tests' frame clock. Given the browser's frame time, it
   * returns the time the frame runs at, so wind, water and idle sways land on the same phase
   * in every run (`dev/e2e-api.ts` `freeze`). Null in play.
   */
  frameClock: ((nowMs: number) => number) | null = null;
  lastDaylightMs = -Infinity;
  /** The pixel view's story stager (render/scene-stage.ts); Full 3D keeps its own. */
  readonly stager = new SceneStager();
  /** MOVE-53: the view turns toward a steady sideways walk when the setting is on. */
  readonly walkFollow = new WalkFollow();
  /** K48: the points the pixel story fit last kept (K3), for the stage inspector. */
  stageFitKept: FitPoint[] = [];

  /** K48: the story stager the drawn view follows (the 3D scene's own in Full 3D). */
  get storyStager(): SceneStager {
    return this.scene3d ? this.scene3d.storyStager : this.stager;
  }
  weatherSid: string | null = null;
  /** Who speaks the dialogue line on screen; the HUD sets it, the story cameras frame them. */
  storySpeaker: string | null = null;
  /** The dialogue's line index in the open scene (0 on the first); H5's push-in follows it. */
  storyLine = 0;
  /** The hour the pixel view is lit at, and a blend toward a newly staged one (C2). */
  drawnHour: number | null = null;
  hourBlend: { from: number; to: number; startMs: number } | null = null;
  lastDressMs = 0;
  /** The location and story-queue head last staged, to restage on the frame either changes. */
  stageKey = '';

  /** The player's Reduced motion choice, resolved against the system setting. */
  get reduceMotion(): boolean {
    const r = this.world.settings.reducedMotion;
    return r === 'on' || (r === 'system' && this.camera.prefersReducedMotion);
  }

  /**
   * One frame of the view as it stands, centre-cropped into a new `w` x `h` canvas (chapter
   * photos, campaign graphics 2 N6). The frame is drawn again and copied in the same task,
   * so no preserved drawing buffer is needed. Null when nothing is drawn yet.
   */
  captureFrame(w: number, h: number): HTMLCanvasElement | null {
    if (this.scene3d) this.scene3d.render();
    else if (this.lowRes && this.grove) this.lowRes.render(this.grove.scene, this.camera.camera);
    else return null;
    const src = this.canvas;
    if (!src.width || !src.height) return null;
    const out = document.createElement('canvas');
    out.width = w;
    out.height = h;
    const ctx = out.getContext('2d');
    if (!ctx) return null;
    const k = Math.min(src.width / w, src.height / h);
    const sw = w * k;
    const sh = h * k;
    ctx.drawImage(src, (src.width - sw) / 2, (src.height - sh) / 2, sw, sh, 0, 0, w, h);
    // K30: the DOM grade layers (tint, split grade, desaturation, ground tint) are not in the
    // canvas, so paint them on the copy; the grid's 48 CSS px spacing scales with the crop.
    paintGrade(
      ctx,
      w,
      h,
      currentGrade(),
      48 * (h / Math.max(1, src.clientHeight || src.height / k)),
    );
    return out;
  }

  /** Decorating: the piece a ground tap places, or null. */
  placing: Placing = null;
  /** R0003: the ground under the mouse while placing decor (desktop), for the fit hint. */
  placeHoverAt: Vec2 | null = null;
  lastFrameMs = 0;
  /** Time banked toward the Keeper's next fine step (MOVE-15). */
  keeperAccMs = 0;
  lastSaveMs = 0;
  storageOk = true;
  /**
   * Set when an unreadable save could not be copied aside, or another tab saved this slot:
   * autosave then holds off, so the other copy survives until the player imports or resets.
   */
  holdSaves = false;
  /**
   * R0669 (CAMP-77): another profile's Grove, open read-only. The world is frozen (no sim
   * steps, no commands) and nothing is ever saved; a reload ends the visit.
   */
  readonly visiting = visitingProfile() !== null;
  /** A frame threw; nothing is saved until the player reloads, imports or resets. */
  crashed = false;
  /** The save text that failed to load this session, for Settings to export. */
  unreadableJson: string | null = null;
  /** Wall time between the loaded save and now, made up by `catchUpOnLoad`. */
  pendingGapMs = 0;
  /** True while an offline catch-up is running between paints: no steps, no saves. */
  catchingUp = false;
  /** Fraction of the view to lift the Keeper by, while a bottom sheet covers the lower part. */
  cameraLift = 0;
  /** The ground the cameras follow under the Keeper, and the look-ahead (MOVE-23). */
  groundY = 0;
  /** MOVE-26: the extra look height while the Keeper stands on a rock, eased. */
  perchLift = 0;
  /** MOVE-38: the debug overlays, built the first time a toggle is turned on. */
  debugOverlay: DebugOverlay | null = null;
  readonly ahead = { x: 0, z: 0 };
  lastKp: { x: number; z: number } | null = null;

  /** Share of the view's width the camera aims right of the Keeper (the docked desktop sheet). */
  cameraSide = 0;
  /**
   * HOT-1: the Nubbin the stats sheet is open on, and where the Keeper should sit on screen
   * (the centre of the part the sheet leaves clear); the HUD sets it each frame, null if closed.
   */
  sheetFocus: { id: string; shift: ViewShift } | null = null;
  /** HOT-1: the shift in force, eased toward the sheet's (both cameras read it). */
  viewShift: ViewShift = NO_SHIFT;
  /** HOT-3: the speaker the camera last came round to (a new one cuts under reduced motion). */
  talkerKey: string | null = null;
  /** A Nubbin the camera turns to for a moment (its end-of-life check is playing). */
  focus: { id: string; untilMs: number } | null = null;
  /** R0550: set while "Watch" follows one Nubbin with no time limit. */
  watchId: string | null = null;
  /** R0107: the camera holds still until this time after a landmark is found. */
  landmarkHoldUntil = -Infinity;
  /** R11 lane D: a loaded border's iris is playing. */
  exitPending = false;

  hooks: GameHooks;

  constructor(
    readonly canvas: HTMLCanvasElement,
    hooks: GameHooks,
    readonly graphics: GraphicsMode = 'pixel',
    scene3d: Grove3dScene | null = null,
  ) {
    this.hooks = hooks;
    // Two tabs on one slot would each autosave over the other: the tab that did not write
    // last stops saving and says so, until the player reloads, imports or resets.
    watchOtherTabs(() => {
      if (this.holdSaves) return;
      this.holdSaves = true;
      this.hooks.onOtherTab();
    });
    // Lane C r7 (R0658): and before anyone writes, a newer tab on this slot takes it over.
    claimSlot(() => {
      if (this.holdSaves) return;
      this.holdSaves = true;
      this.hooks.onOtherTab();
    });
    // Loaded first so the Grove scene can paint the saved ground from its first frame.
    this.world = this.load();
    // TECH-45: the sim reads days and hours in this time zone, sent before any catch-up.
    this.sendTimeZone();
    this.scene3d = graphics === '3d' ? scene3d : null;
    if (this.scene3d) {
      this.lowRes = null;
      this.grove = null;
      this.pipeline = this.scene3d;
      this.picker = this.scene3d.picker(canvas);
    } else {
      this.lowRes = new LowResPipeline(canvas);
      this.lowRes.enablePost();
      this.pixelGov = new PixelGovernor();
      this.applyPixelGov();
      this.pipeline = this.lowRes;
      this.grove = new GroveScene(this.world.tiles, this.view);
      this.picker = new Picker(canvas);
      this.grove.scene.add(this.view.root);
      // HOT load time: the programs link in the background while the first frame's sprites bake.
      this.lowRes.warm(this.grove.scene, this.camera.camera);
      // The pixel view draws the story cast where the stager puts them, and the Grove
      // scene's dressings join its sprite pass (render/dressings.ts).
      this.view.staging = this.stager;
      this.view.onDraw = (world, nowMs) => {
        const dt = this.lastDressMs === 0 ? 0 : Math.min(0.1, (nowMs - this.lastDressMs) / 1000);
        this.lastDressMs = nowMs;
        this.grove?.dress(world, this.stager.stage, Math.max(0, dt));
      };
    }
    const s3 = this.scene3d;
    this.cameraControls = new CameraControls(this.camera, canvas);
    this.input = buildInput(this, canvas, s3);
    this.framePollers.push(() => {
      // MOVE-59: the sim keeps the view's yaw as a hint for where care walks stop.
      const yaw = this.camera.currentYaw;
      if (this.world.viewYaw === undefined || Math.abs(yaw - this.world.viewYaw) > 0.01)
        this.send({ kind: 'viewYaw', yaw });
      // MOVE-53: Camera follows walking, never while a dialogue is up.
      const talking = document.documentElement.classList.contains('dialogue-open');
      this.walkFollow.update(this.world, this.camera, performance.now(), talking);
    });
    this.markReduceMotion();
    // The save mirrors the device-wide renderer choice made on the title screen.
    this.world.settings.graphics = graphics;
    if (this.scene3d) {
      // The sculpt grid is picked once per save by a quick benchmark, then kept.
      this.world.settings.sculptRes ??= this.scene3d.pickSculptRes();
      this.scene3d.setSculptRes(this.world.settings.sculptRes);
    }
    // TECH-09: the tier, from the GPU, memory and the sculpt benchmark (3D only); TECH-52 starts
    // Full 3D at its settings.
    {
      const res = this.world.settings.sculptRes;
      this.tier = readDeviceTier(
        this.pipeline.renderer.getContext(),
        this.scene3d && res !== null ? tierForRes(res) : undefined,
        readQualityOverride(),
      );
    }
    if (this.scene3d) {
      this.scene3d.applyTier(this.tier.tier);
      // Start reading the cache and marching now, while the rest of the page loads.
      this.scene3d.prewarm(this.world);
    }
    this.syncDungeon();
  }

  /** The Hollow floor the scene and view should show, if underground. */
  syncDungeon(): void {
    syncDungeon(this.world, [this.grove, this.scene3d, this.view]);
  }

  /** Can this Nubbin be lifted right now? */
  canGrab(id: string): boolean {
    const n = findNubbin(this.world, id);
    return !!n && n.behavior.state !== 'thrown' && n.stage !== 'cocoon';
  }

  reduceClass: boolean | null = null;

  /**
   * Mirror the effective Reduced motion choice (the Settings value, or the system's when it
   * says "system") as `reduce-motion` on the root element, so the stylesheet can follow the
   * in-game setting and not only the media query (review D, bug 42).
   */
  markReduceMotion(): void {
    setMotionPref(this.world.settings.reducedMotion);
    const reduce = this.reduceMotion;
    if (reduce === this.reduceClass || typeof document === 'undefined') return;
    this.reduceClass = reduce;
    document.documentElement.classList.toggle('reduce-motion', reduce);
  }

  // ---------- persistence ----------

  load(): World {
    const now = Date.now();
    const json = readSave();
    if (json) {
      try {
        const file = deserialize(json);
        const world = file.world;
        // R0598 step 8: a unified slot counts its loads before its legacy key may go.
        noteSlotLoaded();
        if (visitingProfile() !== null) {
          // A visit looks at the Grove as it was saved: no catch-up, nothing written.
          this.pendingGapMs = 0;
          return world;
        }
        // A save with no timestamp has no gap to make up (review C, item 13); the catch-up
        // itself runs once the HUD is bound, so its indicator can paint (`catchUpOnLoad`).
        this.pendingGapMs = file.savedAtWallMs > 0 ? now - file.savedAtWallMs : 0;
        return world;
      } catch (err) {
        // Never let the autosave destroy the only copy: put it aside first, or hold off.
        console.warn('Save could not be loaded; starting fresh.', err);
        const kept = backupUnreadable(currentSlot(), json);
        this.unreadableJson = json;
        this.holdSaves = !kept;
        this.hooks.onSaveUnreadable(kept);
      }
    }
    return createWorld(now % 2147483647, now);
  }

  /** Run the catch-up for the gap since the save was written; call once the HUD is bound. */
  async catchUpOnLoad(): Promise<void> {
    // MOVE-24/42: a phone that has never chosen gets Auto-hop and Auto-run on (tap-to-move is
    // its main control). One command: a second would spread the settings from before the first.
    if (typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches) {
      const s = this.world.settings;
      if (s.autoHop === undefined || s.autoRun === undefined)
        this.send({
          kind: 'setSettings',
          settings: { ...s, autoHop: s.autoHop ?? true, autoRun: s.autoRun ?? true },
        });
    }
    const gap = this.pendingGapMs;
    this.pendingGapMs = 0;
    await runCatchUp(this, gap, Date.now());
    // A tab hidden and shown again during the catch-up stopped the loop, and its resume()
    // stood aside while the catch-up ran: start again now, or the Grove stays frozen
    // until the next hide and show (review D, bug 6).
    this.startIfVisible();
  }

  /** Start the loop unless the page is hidden (the next visibility change starts it). */
  startIfVisible(): void {
    if (typeof document === 'undefined' || !document.hidden) this.start();
  }

  /** R0447: a 160x90 picture of the Grove for the title's slot list, at most every 2 minutes. */
  saveThumb(): void {
    const now = performance.now();
    if (document.hidden || now < this.nextThumbMs || this.world.dungeon) return;
    this.nextThumbMs = now + 120_000;
    try {
      const c = this.captureFrame(160, 90);
      if (c) writeThumb(currentSlot(), c.toDataURL('image/jpeg', 0.5));
    } catch {
      // A tainted or lost canvas: the slot just has no picture.
    }
  }

  nextThumbMs = 15_000;

  save(): boolean {
    if (this.holdSaves || this.catchingUp || this.crashed || this.visiting) {
      this.lastSaveMs = performance.now();
      return false;
    }
    const ok = writeSave(serialize(this.world, Date.now()));
    if (!ok && this.storageOk) this.hooks.onStorageBlocked();
    // Storage that recovers (space freed, a setting changed) warns again if it fails later.
    this.storageOk = ok;
    this.lastSaveMs = performance.now();
    if (ok) this.saveThumb();
    return ok;
  }

  /** Replace the world (import, reset). */
  replaceWorld(world: World): void {
    // The player chose this (import or reset), so saving resumes.
    this.holdSaves = false;
    this.crashed = false;
    this.world = world;
    this.world.lastWallMs = Date.now();
    // R0509 (TECH-67): the renderer is this device's choice; an imported save's is ignored.
    this.world.settings.graphics = this.graphics;
    // The scenes keep the ground and the Hollow floor as their own state: show the new
    // world's, and re-read its sky and place on the next frame (review D, bug 5).
    syncWorldScenes(world, this.grove, [this.grove, this.scene3d, this.view]);
    this.lastDaylightMs = -Infinity;
    this.save();
  }

  exportJson(): string {
    return serialize(this.world, Date.now());
  }

  // ---------- commands ----------

  /** R0550: the Nubbin the Watch camera follows, or null. */
  get watching(): string | null {
    return this.watchId && this.focus?.id === this.watchId ? this.watchId : null;
  }

  /** R0550: follow one Nubbin until `watch(null)`; a null id ends it. */
  watch(id: string | null): void {
    this.watchId = id;
    this.focus = id ? { id, untilMs: Infinity } : null;
  }

  /** R0550: glide the camera to a Nubbin for a moment (an edge chip was tapped). */
  panTo(id: string, ms = 2500): void {
    if (!this.watching) this.focus = { id, untilMs: performance.now() + ms };
  }

  /**
   * R0550: where a world point is on screen, in NDC (-1..1, y up), or null before the first
   * frame. `behind` is true when it is behind the camera (never in the ortho pixel view).
   */
  ndcOf(x: number, y: number, z: number): { x: number; y: number; behind: boolean } | null {
    const cam = this.scene3d ? this.scene3d.cameraRig(this.camera).camera : this.camera.camera;
    const v = new Vector3(x, y, z).project(cam);
    if (!Number.isFinite(v.x) || !Number.isFinite(v.y)) return null;
    return { x: v.x, y: v.y, behind: v.z > 1 };
  }

  send(cmd: Command): void {
    // R0669: a visit sends the sim nothing.
    if (this.visiting) return;
    this.pending.push(cmd);
    for (const tap of commandTaps) tap(cmd); /* Lane E r9 */
  }

  setTimeScale(scale: number): void {
    this.clock.setTimeScale(scale);
  }

  // ---------- loop ----------

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastFrameMs = 0;
    this.clock.reset();
    this.rafId = requestAnimationFrame(this.frame);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.spikes.rest();
  }

  /** Tab shown again: catch up on the time hidden, then carry on. */
  async resume(): Promise<void> {
    // A catch-up already running starts the loop itself when it finishes, if visible.
    if (this.catchingUp) return;
    // TECH-45: the device may have changed time zone while hidden (a flight, a DST change).
    this.sendTimeZone();
    const now = Date.now();
    await runCatchUp(this, now - this.world.lastWallMs, now);
    // Hidden again while catching up: the next visibility change resumes from here.
    this.startIfVisible();
  }

  resize(width: number, height: number): void {
    if (this.scene3d) {
      this.scene3d.resize(width, height);
      this.camera.setFrame(width, height);
      return;
    }
    const size = this.lowRes!.resize(width, height);
    this.camera.setFrame(size.width, size.height);
  }

  readonly frame = (nowMs: number): void => {
    if (!this.running) return;
    // One bad value must not freeze the page or be autosaved over the last good save:
    // keep the loop alive, stop saving and let the HUD offer a reload.
    this.spikes.begin();
    try {
      this.tick(this.frameClock ? this.frameClock(nowMs) : nowMs);
    } catch (err) {
      if (!this.crashed) {
        console.error('Grove: a frame failed; saving has stopped.', err);
        this.crashed = true;
        this.hooks.onCrash();
      }
    }
    this.spikes.end();
    this.rafId = requestAnimationFrame(this.frame);
  };

  tick(nowMs: number): void {
    // Slow frames still advance the sim in real time; the clock caps the steps per frame
    // and the overflow is finished in coarse steps below.
    const dt = this.lastFrameMs === 0 ? 0 : Math.min(SIM.maxFrameDeltaMs, nowMs - this.lastFrameMs);
    this.lastFrameMs = nowMs;

    this.input.pollKeyboard();
    for (const poll of this.framePollers) poll();
    this.spikes.lap('input');

    const events = stepSim(this, dt);
    this.spikes.lap('sim');
    if (events.length > 0) {
      if (this.scene3d) this.scene3d.onEvents(events);
      else this.view.onEvents(events, nowMs);
      // TECH-54: at high speed the HUD hears each kind of thing once per subject per frame.
      this.hooks.onEvents(
        this.clock.timeScale > FAST_TIME.fromScale ? dedupeEvents(events) : events,
      );
      keepCheckpoints(this, events);
      // Lane A r10: performance and chat sounds (R0525, R0540).
      playSoulSounds(events, this.world, this.clock.timeScale);
      reactToEvents(this, events, nowMs);
    }

    this.spikes.lap('events');
    const kp = driveCamera(this, nowMs, dt);
    const reduce = this.reduceMotion;

    this.spikes.lap('camera');
    // K7 (package a1): the stage poses read the line on screen for its gesture.
    STAGE_LINE.line = this.storyLine;
    if (!this.renderPaused) {
      if (this.scene3d) {
        updateDaylight(this, nowMs);
        this.scene3d.storySpeaker = this.storySpeaker;
        this.scene3d.storyLine = this.storyLine;
        this.scene3d.update(this.world, this.camera, this.clock.alpha, nowMs);
        this.spikes.lap('update');
        this.scene3d.render();
        this.spikes.lap('draw');
      } else if (this.grove && this.lowRes) {
        if (this.world.location === 'dungeon')
          this.grove.updateDungeonLights(kp, this.camera.currentYaw);
        // Lane B r8: sealed rock (secrets, the boss door) stands or sinks without a rebuild.
        this.grove.updateDungeonSeals(
          this.world.location === 'dungeon' ? this.world.dungeon : null,
        );
        // Fog of war (R0153): the Hollow floor's materials read this each frame.
        this.grove.dungeonFog.update(
          this.world.location === 'dungeon' ? this.world.dungeon : null,
          this.world.keeper.pos,
        );
        this.grove.update(nowMs, reduce);
        this.grove.setGrove(this.world.grove);
        updateDaylight(this, nowMs);
        this.culler.update(this.camera);
        this.view.batch.cull = this.culler.visible;
        this.view.culler = this.culler;
        this.view.update(this.world, this.camera, this.clock.alpha, nowMs);
        // WORLD-39 (R12 lane D): the Grove's ground drawn back across a seamless border.
        this.grove.setEdgeOffset(this.view.regions.groveOff);
        this.spikes.lap('update');
        this.lowRes.render(this.grove.scene, this.camera.camera);
        this.spikes.lap('draw');
        if (this.pixelGov?.sample(dt, nowMs)) this.applyPixelGov();
      }
    }

    // R0091: findable collectibles twinkle near the Keeper, in either renderer.
    this.glintKeepsakes(nowMs);

    if (nowMs - this.lastSaveMs >= SIM.autosaveMs) this.save();
    this.spikes.lap('save');
  }

  /**
   * TECH-45: tell the sim the device's time zone. Applied at once, not queued: the catch-up
   * that follows a load or a return already counts days in it.
   */
  sendTimeZone(): void {
    applyCommand(
      this.world,
      { kind: 'setTimeZone', offsetMin: -new Date().getTimezoneOffset() },
      [],
    );
    // R0474: a load or a return from another tab is a new visit in the private diary.
    applyCommand(this.world, { kind: 'diaryNote', what: 'session' }, []);
  }

  /** TECH-53: put the Pixel governor's shed level into the view: sway, daylight, frame height. */
  applyPixelGov(): void {
    const gov = this.pixelGov;
    if (!gov || !this.lowRes) return;
    PIXEL_WIND.shed = gov.sheds('wind');
    this.lastDaylightMs = -Infinity;
    const before = this.lowRes.currentSize;
    const size = this.lowRes.setTargetHeight(gov.targetHeight);
    if (size.width !== before.width || size.height !== before.height)
      this.camera.setFrame(size.width, size.height);
  }

  /** R0091: when the last twinkle was, and the next one over each collectible in reach. */
  glintMs = 0;
  glintKeepsakes(nowMs: number): void {
    if (nowMs - this.glintMs < COLLECT.sparkleEveryMs) return;
    this.glintMs = nowMs;
    const k = this.world.keeper.pos;
    const near: Array<{ x: number; z: number }> = openHere(this.world).filter(
      (c) => Math.hypot(c.x - k.x, c.z - k.z) <= COLLECT.sparkleRadius,
    );
    // R0111 (lane D r9): the Grove's secret nook twinkles while its Old Key is held.
    for (const t of openTraces(this.world)) {
      if (Math.hypot(t.x - k.x, t.z - k.z) <= COLLECT.sparkleRadius) near.push(t);
    }
    const nook = secretGlint(this.world);
    if (nook) near.push(nook);
    if (!near.length) return;
    if (this.scene3d) this.scene3d.glint(near, nowMs);
    else this.view.particles.glint(near);
  }
}
