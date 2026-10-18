import { Vector3 } from 'three';
import { CAMERA, SIM } from './config/tuning';
import { GameInput, type Placing } from './input/game-input';
import { CameraControls } from './input/camera-controls';
import { backupUnreadable, currentSlot, readSave, writeSave } from './platform/storage';
import { OrbitCamera } from './render/camera';
import { daylightAt, localHour } from './render/daylight';
import { litLanterns } from './sim/campaign';
import { runFloor } from './sim/dungeon';
import { GroveScene } from './render/grove-scene';
import { Picker } from './render/picker';
import { LowResPipeline, type FrameStats } from './render/pipeline';
import { WorldView } from './render/world-view';
import type { Grove3dScene } from './render3d/grove-3d-scene';
import { Clock } from './sim/clock';
import { catchUp, coarseStep } from './sim/offline';
import { deserialize, serialize } from './sim/save';
import type { AwayReport, Command, GraphicsMode, SimEvent, World } from './sim/types';
import { applyCommand, createWorld, findNubbin, stepWorld } from './sim/world';

export interface GameHooks {
  onEvents(events: SimEvent[]): void;
  onAway(report: AwayReport): void;
  onSelect(id: string | null): void;
  onStorageBlocked(): void;
  onCatchUpStart(): void;
  onCatchUpEnd(): void;
  /** The slot's save could not be read; `kept` says whether a copy was put aside. */
  onSaveUnreadable(kept: boolean): void;
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
  readonly picker: Picker;
  readonly input: GameInput;
  readonly cameraControls: CameraControls;
  private readonly pending: Command[] = [];
  private rafId = 0;
  private running = false;
  /** While a minigame covers the screen the sim keeps going but the Grove is not drawn. */
  renderPaused = false;
  /** Debug: force an hour (0..24) instead of the real clock; null = real time. */
  hourOverride: number | null = null;
  private lastDaylightMs = -Infinity;

  /** The player's Reduced motion choice, resolved against the system setting. */
  get reduceMotion(): boolean {
    const r = this.world.settings.reducedMotion;
    return r === 'on' || (r === 'system' && this.camera.prefersReducedMotion);
  }

  private updateDaylight(nowMs: number): void {
    // The sky changes slowly: re-evaluate every few seconds.
    if (nowMs - this.lastDaylightMs < 3000) return;
    this.lastDaylightMs = nowMs;
    const d = daylightAt(this.hourOverride ?? localHour());
    const s = this.world.settings;
    const reduce = this.reduceMotion;
    if (this.scene3d) {
      this.scene3d.setLit(litLanterns(this.world));
      this.view.lanterns = () => this.scene3d!.lanternStates();
      this.scene3d.setDaylight(
        this.hourOverride ?? localHour(),
        d,
        this.world.location,
        this.world.weather.kind,
        s.particles,
      );
      return;
    }
    if (!this.grove || !this.lowRes) return;
    this.grove.setLit(litLanterns(this.world));
    const grove = this.grove;
    this.view.lanterns = () => grove.lanternStates();
    const place = this.world.location.startsWith('visit:') ? 'grove' : this.world.location;
    this.grove.setLocation(place);
    this.grove.setDaylight(d, place, this.world.weather.kind);
    this.view.location = this.world.location;
    this.view.setDaylight(d, reduce);
    this.view.lights = this.grove.lampsOn ? this.grove.lampSpots : [];
    this.view.setWeather(
      place === 'dungeon' ? 'clear' : this.world.weather.kind,
      this.world.weather.intensity,
      s.particles,
      reduce,
    );
    // Rain greys the grade a little; snow brightens and cools it.
    const w = this.world.weather.kind;
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
  private lastSaveMs = 0;
  private storageOk = true;
  /**
   * Set when an unreadable save could not be copied aside: autosave then holds off, so the
   * only copy survives until the player imports or resets on purpose.
   */
  private holdSaves = false;
  /** The save text that failed to load this session, for Settings to export. */
  unreadableJson: string | null = null;
  private hooks: GameHooks;

  constructor(
    readonly canvas: HTMLCanvasElement,
    hooks: GameHooks,
    readonly graphics: GraphicsMode = 'pixel',
    scene3d: Grove3dScene | null = null,
  ) {
    this.hooks = hooks;
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
      this.grove = new GroveScene();
      this.picker = new Picker(canvas);
      this.grove.scene.add(this.view.root);
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
        canvas.style.cursor = hit ? 'pointer' : '';
      },
      sparkle: (pos) => (s3 ?? this.view).sparkle(pos.x, pos.z),
      placing: () => this.placing,
      canGrab: (id) => {
        const n = findNubbin(this.world, id);
        return !!n && n.behavior.state !== 'thrown' && n.stage !== 'cocoon';
      },
      send: (cmd) => this.send(cmd),
      onSelect: (id) => this.hooks.onSelect(id),
    });
    this.world = this.load();
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
    const f = runFloor(this.world);
    this.grove?.setDungeon(f);
    this.scene3d?.setDungeon(f);
    this.view.setDungeon(f);
  }

  // ---------- persistence ----------

  private load(): World {
    const now = Date.now();
    const json = readSave();
    if (json) {
      try {
        const file = deserialize(json);
        const world = file.world;
        this.runCatchUp(world, now - file.savedAtWallMs, now);
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

  private runCatchUp(world: World, elapsedMs: number, now: number): void {
    if (elapsedMs < 5000) {
      world.lastWallMs = now;
      return;
    }
    const start = performance.now();
    if (elapsedMs > SIM.coarseAfterMs) this.hooks.onCatchUpStart();
    const report = catchUp(world, elapsedMs, now);
    const took = performance.now() - start;
    if (took > SIM.catchUpProgressMs || elapsedMs > SIM.coarseAfterMs) this.hooks.onCatchUpEnd();
    // A quick reload is not "being away": only report real absences or actual news.
    if (report.simulatedMs > 0 && (report.events.length > 0 || elapsedMs > SIM.coarseAfterMs)) {
      this.hooks.onAway(report);
    }
  }

  save(): boolean {
    if (this.holdSaves) {
      this.lastSaveMs = performance.now();
      return false;
    }
    const ok = writeSave(serialize(this.world, Date.now()));
    if (!ok && this.storageOk) {
      this.storageOk = false;
      this.hooks.onStorageBlocked();
    }
    this.lastSaveMs = performance.now();
    return ok;
  }

  /** Replace the world (import, reset). */
  replaceWorld(world: World): void {
    // The player chose this (import or reset), so saving resumes.
    this.holdSaves = false;
    this.world = world;
    this.world.lastWallMs = Date.now();
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

  /** Tab shown again: catch up on the time hidden. */
  resume(): void {
    const now = Date.now();
    this.runCatchUp(this.world, now - this.world.lastWallMs, now);
    this.start();
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
    // Slow frames still advance the sim in real time; the clock caps the steps per frame
    // and the overflow is finished in coarse steps below.
    const dt = this.lastFrameMs === 0 ? 0 : Math.min(SIM.maxFrameDeltaMs, nowMs - this.lastFrameMs);
    this.lastFrameMs = nowMs;

    this.input.pollKeyboard();

    // Sim steps.
    const steps = this.clock.advance(dt);
    const events: SimEvent[] = [];
    const wall = Date.now();
    if (steps > 0 || this.pending.length > 0) {
      (this.scene3d ?? this.view).snapshot(this.world);
      for (const cmd of this.pending.splice(0)) applyCommand(this.world, cmd, events);
      for (let i = 0; i < steps; i++) events.push(...stepWorld(this.world, SIM.stepMs, wall));
      // Far behind (very high time scale): finish the backlog in coarse steps.
      const overflow = this.clock.takeOverflowMs();
      if (overflow >= SIM.coarseStepMs) {
        const coarse = Math.floor(overflow / SIM.coarseStepMs);
        for (let i = 0; i < coarse; i++) coarseStep(this.world, SIM.coarseStepMs, events);
      }
    }
    if (events.length > 0) {
      if (this.scene3d) this.scene3d.onEvents(events);
      else this.view.onEvents(events, nowMs);
      this.hooks.onEvents(events);
      for (const e of events) {
        const shake = this.world.settings.screenShake;
        if (e.kind === 'landed' && shake) this.camera.shake(0.18);
        else if (e.kind === 'treeShaken' && shake) this.camera.shake(0.08);
        else if (e.kind === 'weather' || e.kind === 'located') this.lastDaylightMs = -Infinity;
        else if (e.kind === 'tilePainted') this.grove?.setTiles(this.world.tiles);
        else if (e.kind === 'lanternLit') {
          this.grove?.setLit(litLanterns(this.world));
          this.scene3d?.setLit(litLanterns(this.world));
        } else if (
          e.kind === 'dungeonEntered' ||
          e.kind === 'descended' ||
          e.kind === 'dungeonLeft'
        )
          this.syncDungeon();
      }
    }

    // Camera follows the Keeper as drawn (interpolated between sim steps), so the
    // Keeper and the camera move together and nothing judders at the step rate.
    const kp = (this.scene3d ?? this.view).keeperDrawPos(this.world, this.clock.alpha);
    const t = 1 - Math.exp((-CAMERA.followRate * dt) / 1000);
    this.camera.target.x += (kp.x - this.camera.target.x) * t;
    this.camera.target.z += (kp.z - this.camera.target.z) * t;
    // The Settings choice reaches both cameras and the Grove's idle motion at once.
    const reduce = this.reduceMotion;
    this.camera.reduceMotion = reduce;
    if (this.scene3d) this.scene3d.reduceMotion = reduce;
    this.camera.update(nowMs);

    if (!this.renderPaused) {
      if (this.scene3d) {
        this.updateDaylight(nowMs);
        this.scene3d.update(this.world, this.camera, this.clock.alpha, nowMs);
        this.scene3d.render();
      } else if (this.grove && this.lowRes) {
        if (this.world.location === 'dungeon') this.grove.updateDungeonLights(kp);
        this.grove.update(nowMs, reduce);
        this.grove.setGrove(this.world.grove);
        this.updateDaylight(nowMs);
        this.view.update(this.world, this.camera, this.clock.alpha, nowMs);
        this.lowRes.render(this.grove.scene, this.camera.camera);
      }
    }

    if (nowMs - this.lastSaveMs >= SIM.autosaveMs) this.save();
    this.rafId = requestAnimationFrame(this.frame);
  };
}
