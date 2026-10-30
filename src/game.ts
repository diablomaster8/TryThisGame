import { WalkFollow } from './render/camera-follow';
import { Vector3 } from 'three';
import { REGIONS, regionHour } from './config/regions';
import { regionOf } from './sim/regions';
import { COLLECT } from './config/region-collectibles';
import { openHere } from './sim/collectibles';
import { CAMERA, KEEPER, LANDMARK_HOLD, PIXEL_STAGE, SIM, STAGE2, STAGE4 } from './config/tuning';
import { GameInput, type Placing } from './input/game-input';
import { CameraControls } from './input/camera-controls';
import {
  backupUnreadable,
  currentSlot,
  readSave,
  watchOtherTabs,
  claimSlot,
  writeSave,
} from './platform/storage';
import { OrbitCamera, walkLead, yawIndexToRadians, zoomPixelsPerUnit } from './render/camera';
import { daylightAt, localHour } from './render/daylight';
import { litLanterns } from './sim/campaign';
import { GroveScene } from './render/grove-scene';
import { Picker } from './render/picker';
import { LowResPipeline, type FrameStats } from './render/pipeline';
import {
  clearYaw,
  fitPixel,
  resolveStage,
  SceneStager,
  speaksAsKeeper,
  stageObstacles,
  type FitPoint,
} from './render/scene-stage';
import { PIXEL_BUILDINGS, safeRect, viewRect } from './render/stage-api';
import { stageHides } from './config/stage-sets';
import { WorldView } from './render/world-view';
import { paintGrade } from './ui/look-paint';
import { currentGrade } from './ui/title-card';
import { phoneDefault } from './ui/world-settings';
import { syncDungeon, syncWorldScenes } from './render/world-sync';
import type { Grove3dScene } from './render3d/grove-3d-scene';
import { Clock } from './sim/clock';
import { catchUpInChunks } from './sim/offline';
import { deserialize, serialize } from './sim/save';
import type { AwayReport, Command, GraphicsMode, SimEvent, World } from './sim/types';
import { applyCommand, createWorld, findNubbin, stepWorld } from './sim/world';
import { stepKeeperMotion } from './sim/keeper';
import { CAMERA_FOLLOW, KEEPER_MOTION } from './config/tuning-sim';
import { PERCH } from './config/tuning-move';
import { DEBUG_OVERLAY, DebugOverlay } from './render/debug-colliders';
import { standTopAt } from './sim/obstacles';
import { deckY, groveHeight, hillHeight } from './sim/terrain';
import { runFloor } from './sim/dungeon';
import { terraceY } from './render/scene-stage';
import { SpriteCuller } from './render/chunks';

/** The share of the way an eased value moves this frame at `rate`/s (all of it under reduced motion). */
function reduce0(reduce: boolean, dtMs: number, rate: number): number {
  return reduce ? 1 : 1 - Math.exp((-rate * dtMs) / 1000);
}
import { STAGE_LINE } from './render/stage-pose';

export interface GameHooks {
  onEvents(events: SimEvent[]): void;
  /**
   * Show "While you were away". End-of-life checks are held until `closed` is called, so
   * call it once the player has closed the screen.
   */
  onAway(report: AwayReport, closed: () => void): void;
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
  private readonly lowRes: LowResPipeline | null;
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
  private readonly culler = new SpriteCuller();
  readonly picker: Picker;
  readonly input: GameInput;
  readonly cameraControls: CameraControls;
  private readonly pending: Command[] = [];
  private rafId = 0;
  private running = false;
  /** Per-frame input polls from the UI (the floating joystick), run beside the keyboard's. */
  readonly framePollers: Array<() => void> = [];
  /** While a minigame covers the screen the sim keeps going but the Grove is not drawn. */
  renderPaused = false;
  /** Debug: force an hour (0..24) instead of the real clock; null = real time. */
  hourOverride: number | null = null;
  private lastDaylightMs = -Infinity;
  /** The pixel view's story stager (render/scene-stage.ts); Full 3D keeps its own. */
  private readonly stager = new SceneStager();
  /** MOVE-53: the view turns toward a steady sideways walk when the setting is on. */
  private readonly walkFollow = new WalkFollow();
  /** K48: the points the pixel story fit last kept (K3), for the stage inspector. */
  stageFitKept: FitPoint[] = [];

  /** K48: the story stager the drawn view follows (the 3D scene's own in Full 3D). */
  get storyStager(): SceneStager {
    return this.scene3d ? this.scene3d.storyStager : this.stager;
  }
  private weatherSid: string | null = null;
  /** Who speaks the dialogue line on screen; the HUD sets it, the story cameras frame them. */
  storySpeaker: string | null = null;
  /** The dialogue's line index in the open scene (0 on the first); H5's push-in follows it. */
  storyLine = 0;
  /** The hour the pixel view is lit at, and a blend toward a newly staged one (C2). */
  private drawnHour: number | null = null;
  private hourBlend: { from: number; to: number; startMs: number } | null = null;
  private lastDressMs = 0;
  /** The location and story-queue head last staged, to restage on the frame either changes. */
  private stageKey = '';

  /**
   * The hour to light the pixel view at: a queued scene's staged hour, else `clock`. A
   * change of more than a quarter hour blends over `PIXEL_STAGE.hourBlendMs`; reduced
   * motion cuts. The clock's own slow drift is followed as it is.
   */
  private stagedHour(clock: number, nowMs: number): number {
    const target = this.stager.hourOr(clock);
    if (this.drawnHour === null || this.reduceMotion) {
      this.hourBlend = null;
      this.drawnHour = target;
      return target;
    }
    const goal = this.hourBlend?.to ?? this.drawnHour;
    if (Math.abs(hourDelta(goal, target)) > 0.25)
      this.hourBlend = { from: this.drawnHour, to: target, startMs: nowMs };
    const b = this.hourBlend;
    if (b) {
      const t = Math.min(1, Math.max(0, (nowMs - b.startMs) / PIXEL_STAGE.hourBlendMs));
      this.drawnHour = (b.from + hourDelta(b.from, b.to) * t + 24) % 24;
      if (t >= 1) this.hourBlend = null;
    } else this.drawnHour = target;
    return this.drawnHour;
  }

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

  /**
   * Follow the story queue for the pixel view and return the point to aim at while a scene
   * waits (the centroid of who is framed), or null to follow the Keeper. Holds the near zoom
   * for `two` and `close` shots, and for an unstaged scene whose cast stands close.
   */
  private stagePixelCamera(
    nowMs: number,
    focused: boolean,
  ): { x: number; z: number; fitted: boolean } | null {
    const st = this.stager;
    this.stageFitKept = [];
    st.speaker = this.storySpeaker;
    if (st.update(this.world, nowMs)) {
      this.lastDaylightMs = -Infinity;
      // Campaign graphics 2: a set hides the Grove-only buildings, an exclusive stage all.
      PIXEL_BUILDINGS.stageHidden = new Set(stageHides(st.stage));
      PIXEL_BUILDINGS.stageHidesAll = st.exclusive;
    }
    st.noteLine(this.storyLine, nowMs, this.storySpeaker);
    this.grove?.setBare(st.exclusive);
    if (this.scene3d) return null;
    // A shot that names its own focus (the green, a house, Moss) centres on that, not the Keeper.
    let points = st.active && !focused ? st.subjects(this.world) : [];
    // H5: after the first line, or on the first spoken one, a wide or establishing shot
    // pushes in (to `two` unless it says).
    const kind = st.shotKind();
    if (points.length < 2 && !kind) {
      this.camera.holdZoom(null, nowMs);
      this.camera.holdYaw(null, nowMs);
      return null;
    }
    // Review fix 2: of the 45° steps from the player's, the nearest that sees the cast and
    // whoever speaks past the houses.
    const who = st.speaker;
    const speaker =
      who && who !== 'narrator' && !speaksAsKeeper(this.world, who, st.stage)
        ? st.spotOf(this.world, who)
        : null;
    // K3: whoever speaks is never dropped from a fit.
    const seen = speaker ? [...points, { ...speaker, speaker: true }] : points;
    const base = this.camera.playerYawIndex;
    const order = [0, 1, -1, 2, -2, 3, -3, 4].map((k) => base + k);
    const yaws = order.map((i) => yawIndexToRadians(i));
    const mid = {
      x: seen.reduce((a, p) => a + p.x, 0) / Math.max(1, seen.length),
      z: seen.reduce((a, p) => a + p.z, 0) / Math.max(1, seen.length),
    };
    const obstacles = stageObstacles(this.world, (id) => PIXEL_BUILDINGS.isHidden(id));
    const best = clearYaw(yaws, seen, mid, this.camera.pitch, 60, obstacles);
    const turn = order[Math.max(0, yaws.indexOf(best))]!;
    this.camera.holdYaw(turn === base ? null : turn, nowMs);
    const yaw = yawIndexToRadians(turn);
    const ppu = CAMERA.pixelsPerUnit;
    const last = ppu.length - 1;
    // The story-only step past the player's nearest (campaign graphics 3).
    const story = ppu.length;
    const cur = this.camera.pixelsPerUnit;
    /** The view's width (world units) at zoom step `i`. */
    const widthAt = (i: number) => (this.camera.visibleWidth * cur) / zoomPixelsPerUnit(i);
    const first = st.stage.shot?.kind;
    // K9: in two speakers' exchange the view leans toward whoever speaks (the follow eases
    // it, a cut under reduced motion).
    const rev = st.reverse(this.world, this.camera.currentYaw, STAGE4.reverse.sideRad);
    const lean = (x: number, z: number): { x: number; z: number; fitted: false } => {
      const k = rev ? STAGE4.reverse.panToward : 0;
      return {
        x: x + ((rev?.at.x ?? x) - x) * k,
        z: z + ((rev?.at.z ?? z) - z) * k,
        fitted: false,
      };
    };
    if (st.pushedMs !== null && kind !== first && kind !== 'wide') {
      // H5 in pixel: the push-in, on the Keeper and whoever speaks: the story step when the
      // pair fit across it (a desktop is already on the near step, so the push showed
      // nothing), else the near step; on the speaker alone when the pair fit neither.
      if (speaker && !points.some((p) => p.x === speaker.x && p.z === speaker.z))
        points = [...points, speaker];
      const cx = points.reduce((a, p) => a + p.x, 0) / Math.max(1, points.length);
      const cz = points.reduce((a, p) => a + p.z, 0) / Math.max(1, points.length);
      const spread = Math.max(0, ...points.map((p) => Math.hypot(p.x - cx, p.z - cz)));
      const close = spread * 2.4 < widthAt(story);
      this.camera.holdZoom(close ? story : last, nowMs);
      if (!close && spread * 2.4 >= widthAt(last) && speaker)
        return { x: speaker.x, z: speaker.z, fitted: false };
      return lean(cx, cz);
    }
    if (points.length > 0 && st.fits()) {
      // H4: the nearest zoom step that fits every focus point inside the HUD-safe area.
      const views = ppu.map((p) => ({
        w: (this.camera.visibleWidth * cur) / p,
        h: (this.camera.visibleHeight * cur) / p,
      }));
      const v = viewRect();
      const s = safeRect();
      const fit = fitPixel(
        seen,
        yaw,
        this.camera.pitch,
        views,
        {
          x0: (s.x - v.x) / v.w,
          y0: (s.y - v.y) / v.h,
          x1: (s.x + s.w - v.x) / v.w,
          y1: (s.y + s.h - v.y) / v.h,
        },
        STAGE2.figureH,
        STAGE2.fitRadius,
      );
      this.camera.holdZoom(fit.zoom, nowMs);
      this.stageFitKept = fit.kept;
      return { x: fit.x, z: fit.z, fitted: true };
    }
    const cx = points.reduce((a, p) => a + p.x, 0) / points.length;
    const cz = points.reduce((a, p) => a + p.z, 0) / points.length;
    const spread = Math.max(...points.map((p) => Math.hypot(p.x - cx, p.z - cz)));
    // The near zoom only when the cast fits across it (a phone held upright is narrow).
    const fits = spread * 2.4 < widthAt(last);
    const near = kind === 'close' || ((kind === 'two' || !kind) && fits);
    // A close shot goes to the story step when its people fit across it.
    const closer = kind === 'close' && spread * 2.4 < widthAt(story);
    this.camera.holdZoom(closer ? story : near ? last : null, nowMs);
    return lean(cx, cz);
  }

  private updateDaylight(nowMs: number): void {
    // The sky changes slowly: re-evaluate every few seconds, or every frame of a blend.
    // A staged weather replaces the live one in the drawn scene (the package-f overlay draws
    // it), so a scene change refreshes at once.
    const sid = this.world.campaign?.queue[0] ?? null;
    if (sid !== this.weatherSid) {
      this.weatherSid = sid;
      this.lastDaylightMs = -Infinity;
    }
    const wk = resolveStage(this.world)?.stage.weather ? 'clear' : this.world.weather.kind;
    const blending = this.hourBlend !== null;
    const clock =
      this.hourOverride ?? regionHour(REGIONS[regionOf(this.world.location)].clock, localHour());
    const hour = this.scene3d ? clock : this.stagedHour(clock, nowMs);
    if (!blending && !this.hourBlend && nowMs - this.lastDaylightMs < 3000) return;
    this.lastDaylightMs = nowMs;
    const d = daylightAt(hour);
    const s = this.world.settings;
    const reduce = this.reduceMotion;
    if (this.scene3d) {
      this.scene3d.setLit(litLanterns(this.world));
      this.view.lanterns = () => this.scene3d!.lanternStates();
      this.scene3d.setDaylight(clock, d, this.world.location, wk, s.particles);
      return;
    }
    if (!this.grove || !this.lowRes) return;
    this.grove.setLit(litLanterns(this.world));
    const grove = this.grove;
    this.view.lanterns = () => grove.lanternStates();
    const place = this.world.location.startsWith('visit:') ? 'grove' : this.world.location;
    this.grove.setLocation(place);
    this.grove.setDaylight(d, place, wk);
    this.view.location = this.world.location;
    this.view.setDaylight(d, reduce);
    this.view.lights = this.grove.lampsOn ? this.grove.lampSpots : [];
    this.view.setWeather(
      place === 'dungeon' ? 'clear' : wk,
      this.world.weather.intensity,
      s.particles,
      reduce,
    );
    // Rain greys the grade a little; snow brightens and cools it.
    const w = wk;
    const tint = w === 'rain' ? d.tint.clone().multiply(new Vector3(0.85, 0.9, 1.0)) : d.tint;
    const tintAmount = w === 'rain' ? Math.max(d.tintAmount, 0.35) : d.tintAmount;
    this.lowRes.postPass?.apply({
      tint,
      tintAmount,
      bloom: w === 'snow' ? d.bloom + 0.15 : d.bloom,
    });
  }

  /** Decorating: the piece a ground tap places, or null. */
  placing: Placing = null;
  private lastFrameMs = 0;
  /** Time banked toward the Keeper's next fine step (MOVE-15). */
  private keeperAccMs = 0;
  private lastSaveMs = 0;
  private storageOk = true;
  /**
   * Set when an unreadable save could not be copied aside, or another tab saved this slot:
   * autosave then holds off, so the other copy survives until the player imports or resets.
   */
  private holdSaves = false;
  /** A frame threw; nothing is saved until the player reloads, imports or resets. */
  private crashed = false;
  /** The save text that failed to load this session, for Settings to export. */
  unreadableJson: string | null = null;
  /** Wall time between the loaded save and now, made up by `catchUpOnLoad`. */
  private pendingGapMs = 0;
  /** True while an offline catch-up is running between paints: no steps, no saves. */
  catchingUp = false;
  /** Fraction of the view to lift the Keeper by, while a bottom sheet covers the lower part. */
  cameraLift = 0;
  /** The ground the cameras follow under the Keeper, and the look-ahead (MOVE-23). */
  private groundY = 0;
  /** MOVE-26: the extra look height while the Keeper stands on a rock, eased. */
  private perchLift = 0;
  /** MOVE-38: the debug overlays, built the first time a toggle is turned on. */
  private debugOverlay: DebugOverlay | null = null;
  private readonly ahead = { x: 0, z: 0 };
  private lastKp: { x: number; z: number } | null = null;

  /**
   * Track the Keeper's ground height and look-ahead for the camera (MOVE-23). On the ground
   * the camera follows the floor the Keeper is drawn on (a terrace, a bench, the bridge);
   * through a jump it holds, unless the Keeper climbs well past where it took off.
   */
  private followKeeper(kp: { x: number; z: number }, dt: number, staged: boolean): void {
    const w = this.world;
    const k = w.keeper;
    const F = CAMERA_FOLLOW;
    if (w.location !== 'grove' || runFloor(w)) this.groundY = 0;
    else {
      // The height Pixel draws the feet at; 3D keeps its own ground under the orbit target.
      const feet =
        deckY(kp.x, kp.z) !== null
          ? 0
          : Math.max(0, k.y - groveHeight(kp.x, kp.z) + hillHeight(kp.x, kp.z));
      if (k.grounded) this.groundY = feet;
      else if (feet > this.groundY + F.airSlack) this.groundY = feet - F.airSlack;
      else if (feet < this.groundY - F.airSlack) this.groundY = feet;
    }
    // MOVE-26: up on a rock (a standable top half a unit or more up), the look rises to open
    // the view; it settles back once the Keeper steps down.
    const top = w.location === 'grove' ? standTopAt(w, kp.x, kp.z) : -Infinity;
    const perched =
      k.grounded &&
      Math.abs(k.y - top) < 0.05 &&
      top - groveHeight(kp.x, kp.z) >= PERCH.minTop - 0.02;
    const pr = reduce0(this.reduceMotion, dt, PERCH.rate);
    this.perchLift += ((perched ? PERCH.lift : 0) - this.perchLift) * pr;
    if (this.scene3d) this.scene3d.perchLift = this.perchLift;
    const s = dt / 1000;
    let vx = 0;
    let vz = 0;
    if (this.lastKp && s > 0) {
      vx = (kp.x - this.lastKp.x) / s;
      vz = (kp.z - this.lastKp.z) / s;
    }
    this.lastKp = { x: kp.x, z: kp.z };
    const speed = Math.hypot(vx, vz);
    // A teleport is not a walk; nor is anything during a scene.
    const norm = staged || speed > KEEPER.speed * 4 ? 0 : Math.min(1, speed / KEEPER.speed);
    const lead = walkLead(this.camera, F.lookAhead, k.carrying !== null);
    const want = speed > 1e-6 ? (lead * norm) / speed : 0;
    const e = reduce0(this.reduceMotion, dt, F.lookAheadRate);
    this.ahead.x += (vx * want - this.ahead.x) * e;
    this.ahead.z += (vz * want - this.ahead.z) * e;
  }
  /** Share of the view's width the camera aims right of the Keeper (the docked desktop sheet). */
  cameraSide = 0;
  /** A Nubbin the camera turns to for a moment (its end-of-life check is playing). */
  private focus: { id: string; untilMs: number } | null = null;
  /** R0107: the camera holds still until this time after a landmark is found. */
  private landmarkHoldUntil = -Infinity;
  private hooks: GameHooks;

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
    this.scene3d = graphics === '3d' ? scene3d : null;
    if (this.scene3d) {
      this.lowRes = null;
      this.grove = null;
      this.pipeline = this.scene3d;
      this.picker = this.scene3d.picker(canvas);
    } else {
      this.lowRes = new LowResPipeline(canvas);
      this.lowRes.enablePost();
      this.pipeline = this.lowRes;
      this.grove = new GroveScene(this.world.tiles, this.view);
      this.picker = new Picker(canvas);
      this.grove.scene.add(this.view.root);
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
    this.input = new GameInput(canvas, {
      camera: s3 ? s3.cameraRig(this.camera) : this.camera,
      picker: this.picker,
      pickables: () => this.grove?.pickables ?? s3!.pickables,
      pickSprite: (ndcX, ndcY) =>
        s3 ? s3.pick(ndcX, ndcY) : this.view.pick(ndcX, ndcY, this.camera),
      hover: (hit) => {
        (s3 ?? this.view).setHighlight(hit);
        // A Nubbin that can be lifted says so; anything else tappable gets the hand.
        const grabbable = hit?.kind === 'nubbin' && this.canGrab(hit.id);
        canvas.style.cursor = grabbable ? 'grab' : hit ? 'pointer' : '';
      },
      sparkle: (pos) => (s3 ?? this.view).sparkle(pos.x, pos.z),
      placing: () => this.placing,
      canGrab: (id) => this.canGrab(id),
      send: (cmd) => this.send(cmd),
      onSelect: (id) => this.hooks.onSelect(id),
      // MOVE-49: a gamepad drives Keeper 1 when co-op is off.
      pad: {
        coop: () => this.world.coop.active,
        nearNubbin: (within) => {
          const k = this.world.keeper.pos;
          let best: string | null = null;
          let bestD = within;
          for (const n of this.world.nubbins) {
            const d = Math.hypot(n.pos.x - k.x, n.pos.z - k.z);
            if (n.stage !== 'egg' && d <= bestD) {
              bestD = d;
              best = n.id;
            }
          }
          return best;
        },
        holding: () => this.world.keeper.carrying !== null,
        rotate: (dir) => this.camera.rotate(dir),
        zoom: (dir) => (dir > 0 ? this.camera.zoomIn() : this.camera.zoomOut()),
      },
    });
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
      // Start reading the cache and marching now, while the rest of the page loads.
      this.scene3d.prewarm(this.world);
    }
    this.syncDungeon();
  }

  /** The Hollow floor the scene and view should show, if underground. */
  private syncDungeon(): void {
    syncDungeon(this.world, [this.grove, this.scene3d, this.view]);
  }

  /** Can this Nubbin be lifted right now? */
  private canGrab(id: string): boolean {
    const n = findNubbin(this.world, id);
    return !!n && n.behavior.state !== 'thrown' && n.stage !== 'cocoon';
  }

  private reduceClass: boolean | null = null;

  /**
   * Mirror the effective Reduced motion choice (the Settings value, or the system's when it
   * says "system") as `reduce-motion` on the root element, so the stylesheet can follow the
   * in-game setting and not only the media query (review D, bug 42).
   */
  private markReduceMotion(): void {
    const reduce = this.reduceMotion;
    if (reduce === this.reduceClass || typeof document === 'undefined') return;
    this.reduceClass = reduce;
    document.documentElement.classList.toggle('reduce-motion', reduce);
  }

  // ---------- persistence ----------

  private load(): World {
    const now = Date.now();
    const json = readSave();
    if (json) {
      try {
        const file = deserialize(json);
        const world = file.world;
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
    await this.runCatchUp(gap, Date.now());
    // A tab hidden and shown again during the catch-up stopped the loop, and its resume()
    // stood aside while the catch-up ran: start again now, or the Grove stays frozen
    // until the next hide and show (review D, bug 6).
    this.startIfVisible();
  }

  /** Start the loop unless the page is hidden (the next visibility change starts it). */
  private startIfVisible(): void {
    if (typeof document === 'undefined' || !document.hidden) this.start();
  }

  /**
   * Catch the world up in chunks, yielding to the browser between them so the indicator
   * paints and a week away does not freeze the page (review C, item 12). The sim does not
   * step and nothing is saved until it finishes, so a half-done catch-up is never written.
   */
  private async runCatchUp(elapsedMs: number, now: number): Promise<void> {
    const world = this.world;
    if (elapsedMs < 5000) {
      world.lastWallMs = now;
      return;
    }
    this.catchingUp = true;
    const start = performance.now();
    let shown = false;
    try {
      const run = catchUpInChunks(world, elapsedMs, now);
      let sliceStart = start;
      for (;;) {
        const next = run.next();
        if (next.done) {
          // A quick reload is not "being away": only report real absences or actual news.
          const report = next.value;
          if (
            report.simulatedMs > 0 &&
            (report.events.length > 0 || elapsedMs > SIM.coarseAfterMs)
          ) {
            // Nubbins waiting for the Keeper meet their end-of-life check in front of the
            // player, not under this screen: the sim holds the checks until it closes.
            this.send({ kind: 'holdEndOfLife', hold: true });
            this.hooks.onAway(report, () => this.send({ kind: 'holdEndOfLife', hold: false }));
          }
          break;
        }
        // Most catch-ups finish in one slice; past a short budget, show the indicator and
        // give the browser a frame to paint it before carrying on.
        if (performance.now() - sliceStart < SIM.catchUpSliceMs) continue;
        if (!shown) {
          shown = true;
          this.hooks.onCatchUpStart();
        }
        await nextPaint();
        sliceStart = performance.now();
      }
    } finally {
      this.catchingUp = false;
      if (shown) this.hooks.onCatchUpEnd();
    }
  }

  save(): boolean {
    if (this.holdSaves || this.catchingUp || this.crashed) {
      this.lastSaveMs = performance.now();
      return false;
    }
    const ok = writeSave(serialize(this.world, Date.now()));
    if (!ok && this.storageOk) this.hooks.onStorageBlocked();
    // Storage that recovers (space freed, a setting changed) warns again if it fails later.
    this.storageOk = ok;
    this.lastSaveMs = performance.now();
    return ok;
  }

  /** Replace the world (import, reset). */
  replaceWorld(world: World): void {
    // The player chose this (import or reset), so saving resumes.
    this.holdSaves = false;
    this.crashed = false;
    this.world = world;
    this.world.lastWallMs = Date.now();
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

  send(cmd: Command): void {
    this.pending.push(cmd);
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
  }

  /** Tab shown again: catch up on the time hidden, then carry on. */
  async resume(): Promise<void> {
    // A catch-up already running starts the loop itself when it finishes, if visible.
    if (this.catchingUp) return;
    const now = Date.now();
    await this.runCatchUp(now - this.world.lastWallMs, now);
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

  private readonly frame = (nowMs: number): void => {
    if (!this.running) return;
    // One bad value must not freeze the page or be autosaved over the last good save:
    // keep the loop alive, stop saving and let the HUD offer a reload.
    try {
      this.tick(nowMs);
    } catch (err) {
      if (!this.crashed) {
        console.error('Grove: a frame failed; saving has stopped.', err);
        this.crashed = true;
        this.hooks.onCrash();
      }
    }
    this.rafId = requestAnimationFrame(this.frame);
  };

  private tick(nowMs: number): void {
    // Slow frames still advance the sim in real time; the clock caps the steps per frame
    // and the overflow is finished in coarse steps below.
    const dt = this.lastFrameMs === 0 ? 0 : Math.min(SIM.maxFrameDeltaMs, nowMs - this.lastFrameMs);
    this.lastFrameMs = nowMs;

    this.input.pollKeyboard();
    for (const poll of this.framePollers) poll();

    // Sim steps.
    const steps = this.clock.advance(dt);
    const events: SimEvent[] = [];
    const wall = Date.now();
    if (this.catchingUp) {
      // The world is mid catch-up: draw it, but hold steps and commands until it is done.
      this.clock.reset();
    } else if (steps > 0 || this.pending.length > 0) {
      (this.scene3d ?? this.view).snapshot(this.world);
      for (const cmd of this.pending.splice(0)) applyCommand(this.world, cmd, events);
      const playCounts = this.clock.timeScale === 1 && !document.hidden;
      for (let i = 0; i < steps; i++)
        events.push(...stepWorld(this.world, SIM.stepMs, wall, false, playCounts));
      // Far behind (very high time scale, slow device): live play keeps the live rules, so
      // the backlog runs as fine steps on later frames and only what is past
      // `maxLiveBacklogMs` is dropped (review C, item 14). Offline rules are for absences.
      this.clock.capBacklog(SIM.maxLiveBacklogMs);
    }
    // The Keeper's own fine clock (MOVE-15): it moves at 60 Hz between the 10 Hz sim steps,
    // so a key or a jump shows on the next frame. Never during catch-up or a time skip.
    const kview = this.scene3d ?? this.view;
    if (this.catchingUp || this.clock.timeScale !== 1) {
      this.keeperAccMs = 0;
      kview.keeperAlpha = null;
    } else {
      const sub = 1000 / KEEPER_MOTION.hz;
      this.keeperAccMs += dt;
      while (this.keeperAccMs >= sub) {
        kview.snapshotKeeper(this.world);
        if (!stepKeeperMotion(this.world, events)) {
          // A whole sim step ahead already: wait for the sim and draw where it stands.
          this.keeperAccMs = sub;
          break;
        }
        this.keeperAccMs -= sub;
      }
      kview.keeperAlpha = Math.min(1, this.keeperAccMs / sub);
    }
    if (events.length > 0) {
      if (this.scene3d) this.scene3d.onEvents(events);
      else this.view.onEvents(events, nowMs);
      this.hooks.onEvents(events);
      for (const e of events) {
        // Shake is motion too: the in-game Reduced motion choice turns it off (review D, 42).
        const shake = this.world.settings.screenShake && !this.reduceMotion;
        if (e.kind === 'landed' && shake) this.camera.shake(0.18);
        else if (e.kind === 'treeShaken' && shake) this.camera.shake(0.08);
        else if (e.kind === 'weather' || e.kind === 'located') this.lastDaylightMs = -Infinity;
        else if (e.kind === 'travelled') {
          // R0074: the iris hides the jump; the follow starts at the new place, not across the map.
          this.camera.target.x = e.to.x;
          this.camera.target.z = e.to.z;
        } else if (e.kind === 'tilePainted') this.grove?.setTiles(this.world.tiles);
        // R0107: a found landmark gets a beat: the view holds while the Keeper takes it in.
        else if (e.kind === 'landmarkFound' && !this.reduceMotion)
          this.landmarkHoldUntil = nowMs + LANDMARK_HOLD.ms;
        else if (e.kind === 'endOfLifeFocus')
          this.focus = { id: e.nubbinId, untilMs: nowMs + CAMERA.focusMs };
        else if (e.kind === 'lanternLit') {
          this.grove?.setLit(litLanterns(this.world));
          this.scene3d?.setLit(litLanterns(this.world));
        } else if (
          e.kind === 'dungeonEntered' ||
          e.kind === 'descended' ||
          e.kind === 'levelChanged' ||
          e.kind === 'dungeonLeft'
        )
          this.syncDungeon();
      }
    }

    // A new place or a new scene at the head of the story queue (a debug chapter jump among
    // them) restages this frame: daylight, the story sets and the place's scenery.
    const headNow = `${this.world.location}|${this.world.campaign?.queue[0] ?? ''}`;
    if (headNow !== this.stageKey) {
      this.stageKey = headNow;
      this.lastDaylightMs = -Infinity;
    }

    // Camera follows the Keeper as drawn (interpolated between sim steps), so the
    // Keeper and the camera move together and nothing judders at the step rate.
    const kp = (this.scene3d ?? this.view).keeperDrawPos(this.world, this.clock.alpha);
    // While a held end-of-life check plays, look at that Nubbin, not the Keeper (review D, 1).
    const focused =
      this.focus && nowMs < this.focus.untilMs
        ? this.world.nubbins.find((n) => n.id === this.focus?.id)
        : undefined;
    if (!focused) this.focus = null;
    // A story scene in the pixel view: frame its cast, lifted clear of the dialogue box,
    // on the near zoom for two-shots and close shots (campaign graphics C2, H14).
    const staged = this.stagePixelCamera(nowMs, !!focused);
    const subject = focused ? focused.pos : (staged ?? kp);
    // With a bottom sheet open on a phone, aim past the Keeper toward the camera, so the
    // Keeper and the Nubbin beside them sit in the clear top part (review C, item 22).
    // A fitted shot (H4) already sits inside the HUD-safe area.
    const liftK =
      staged && !staged.fitted ? Math.max(this.cameraLift, PIXEL_STAGE.boxLift) : this.cameraLift;
    const lift = (liftK * this.camera.visibleHeight) / Math.sin(CAMERA.pitchRad);
    const yaw = this.camera.currentYaw;
    // Aim right of the subject (along the camera's right vector) so a docked desktop sheet
    // on the right third leaves it in sight.
    const side = this.cameraSide * this.camera.visibleWidth;
    this.followKeeper(kp, dt, !!staged || !!focused);
    const aimX =
      subject.x +
      Math.sin(yaw) * lift +
      Math.cos(yaw) * side +
      (staged || focused ? 0 : this.ahead.x);
    const aimZ =
      subject.z +
      Math.cos(yaw) * lift -
      Math.sin(yaw) * side +
      (staged || focused ? 0 : this.ahead.z);
    const rate = staged ? PIXEL_STAGE.followRate : CAMERA.followRate;
    const held = !staged && !focused && nowMs < this.landmarkHoldUntil;
    const t = held ? 0 : staged && this.reduceMotion ? 1 : 1 - Math.exp((-rate * dt) / 1000);
    this.camera.target.x += (aimX - this.camera.target.x) * t;
    this.camera.target.z += (aimZ - this.camera.target.z) * t;
    // Up and down with the ground under the Keeper, or the mark a scene frames (MOVE-23).
    const aimY =
      staged || focused
        ? this.world.location === 'grove'
          ? terraceY(subject.x, subject.z)
          : 0
        : this.groundY + this.perchLift;
    const ty = reduce0(this.reduceMotion, dt, CAMERA_FOLLOW.groundRate);
    this.camera.target.y += (aimY - this.camera.target.y) * ty;
    // The Settings choice reaches both cameras and the Grove's idle motion at once.
    const reduce = this.reduceMotion;
    this.camera.reduceMotion = reduce;
    this.markReduceMotion();
    if (this.scene3d) this.scene3d.reduceMotion = reduce;
    // R0073: "Zoom out when running" pulls the view out to the survey step on a long run.
    {
      const k = this.world.keeper;
      const moving = k.moveTarget !== null || k.input.x !== 0 || k.input.z !== 0;
      const on = phoneDefault(this.world.settings.surveyWhenRunning);
      this.camera.runTick(on && this.world.location === 'grove' && k.running && moving, nowMs);
    }
    this.camera.update(nowMs);
    // MOVE-38: the collider, nav and ground-y overlays, only once a debug toggle was on.
    if (
      DEBUG_OVERLAY.colliders ||
      DEBUG_OVERLAY.nav ||
      DEBUG_OVERLAY.groundY ||
      this.debugOverlay
    ) {
      const scene = this.scene3d?.scene ?? this.grove?.scene;
      if (scene) {
        this.debugOverlay ??= new DebugOverlay(scene);
        this.debugOverlay.update(this.world, groveHeight);
      }
    }

    // K7 (package a1): the stage poses read the line on screen for its gesture.
    STAGE_LINE.line = this.storyLine;
    if (!this.renderPaused) {
      if (this.scene3d) {
        this.updateDaylight(nowMs);
        this.scene3d.storySpeaker = this.storySpeaker;
        this.scene3d.storyLine = this.storyLine;
        this.scene3d.update(this.world, this.camera, this.clock.alpha, nowMs);
        this.scene3d.render();
      } else if (this.grove && this.lowRes) {
        if (this.world.location === 'dungeon')
          this.grove.updateDungeonLights(kp, this.camera.currentYaw);
        // Fog of war (R0153): the Hollow floor's materials read this each frame.
        this.grove.dungeonFog.update(
          this.world.location === 'dungeon' ? this.world.dungeon : null,
          this.world.keeper.pos,
        );
        this.grove.update(nowMs, reduce);
        this.grove.setGrove(this.world.grove);
        this.updateDaylight(nowMs);
        this.culler.update(this.camera);
        this.view.batch.cull = this.culler.visible;
        this.view.update(this.world, this.camera, this.clock.alpha, nowMs);
        this.lowRes.render(this.grove.scene, this.camera.camera);
      }
    }

    // R0091: findable collectibles twinkle near the Keeper, in either renderer.
    this.glintKeepsakes(nowMs);

    if (nowMs - this.lastSaveMs >= SIM.autosaveMs) this.save();
  }

  /** R0091: when the last twinkle was, and the next one over each collectible in reach. */
  private glintMs = 0;
  private glintKeepsakes(nowMs: number): void {
    if (nowMs - this.glintMs < COLLECT.sparkleEveryMs) return;
    this.glintMs = nowMs;
    const k = this.world.keeper.pos;
    const near = openHere(this.world).filter(
      (c) => Math.hypot(c.x - k.x, c.z - k.z) <= COLLECT.sparkleRadius,
    );
    if (!near.length) return;
    if (this.scene3d) this.scene3d.glint(near, nowMs);
    else this.view.particles.glint(near);
  }
}

/**
 * Resolves after the browser has had a chance to paint: the next animation frame, or a
 * short timeout in a hidden tab where frames never come.
 */
function nextPaint(): Promise<void> {
  return new Promise((done) => {
    let settled = false;
    const finish = (): void => {
      if (settled) return;
      settled = true;
      setTimeout(done, 0);
    };
    requestAnimationFrame(finish);
    setTimeout(finish, 50);
  });
}

/** Signed shortest way round the 24-hour clock from `a` to `b`, in hours. */
function hourDelta(a: number, b: number): number {
  return ((((b - a) % 24) + 36) % 24) - 12;
}
