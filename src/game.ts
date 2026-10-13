import { Vector3 } from 'three';
import { CAMERA, SIM } from './config/tuning';
import { GameInput } from './input/game-input';
import { CameraControls } from './input/camera-controls';
import { readSave, writeSave } from './platform/storage';
import { OrbitCamera } from './render/camera';
import { daylightAt, localHour } from './render/daylight';
import { litLanterns } from './sim/campaign';
import { GroveScene } from './render/grove-scene';
import { Picker } from './render/picker';
import { LowResPipeline } from './render/pipeline';
import { WorldView } from './render/world-view';
import { Clock } from './sim/clock';
import { catchUp, coarseStep } from './sim/offline';
import { deserialize, serialize } from './sim/save';
import type { AwayReport, Command, SimEvent, World } from './sim/types';
import { applyCommand, createWorld, findNubbin, stepWorld } from './sim/world';

export interface GameHooks {
  onEvents(events: SimEvent[]): void;
  onAway(report: AwayReport): void;
  onSelect(id: string | null): void;
  onStorageBlocked(): void;
  onCatchUpStart(): void;
  onCatchUpEnd(): void;
}

/**
 * Wires sim, render, input and persistence together. The sim runs fixed steps from
 * the Clock; rendering runs every frame with interpolation; autosave every 30 s and
 * when the tab hides; offline catch-up when the tab shows again or on load.
 */
export class Game {
  world: World;
  readonly clock = new Clock();
  readonly pipeline: LowResPipeline;
  readonly camera = new OrbitCamera();
  readonly grove = new GroveScene();
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

  private updateDaylight(nowMs: number): void {
    // The sky changes slowly: re-evaluate every few seconds.
    if (nowMs - this.lastDaylightMs < 3000) return;
    this.lastDaylightMs = nowMs;
    const d = daylightAt(this.hourOverride ?? localHour());
    const s = this.world.settings;
    const reduce =
      s.reducedMotion === 'on' || (s.reducedMotion === 'system' && this.camera.reduceMotion);
    this.grove.setLit(litLanterns(this.world));
    const place = this.world.location.startsWith('visit:') ? 'grove' : this.world.location;
    this.grove.setLocation(place);
    this.grove.setDaylight(d, place, this.world.weather.kind);
    this.view.location = this.world.location;
    this.view.setDaylight(d, reduce);
    this.view.setWeather(
      this.world.weather.kind,
      this.world.weather.intensity,
      s.particles,
      reduce,
    );
    // Rain greys the grade a little; snow brightens and cools it.
    const w = this.world.weather.kind;
    const tint = w === 'rain' ? d.tint.clone().multiply(new Vector3(0.85, 0.9, 1.0)) : d.tint;
    const tintAmount = w === 'rain' ? Math.max(d.tintAmount, 0.35) : d.tintAmount;
    this.pipeline.postPass?.apply({
      tint,
      tintAmount,
      bloom: w === 'snow' ? d.bloom + 0.15 : d.bloom,
    });
  }

  /** Decorating: the piece a ground tap places, or null. */
  placing: import('./sim/types').DecorKind | null = null;
  private lastFrameMs = 0;
  private lastSaveMs = 0;
  private storageOk = true;
  private hooks: GameHooks;

  constructor(
    readonly canvas: HTMLCanvasElement,
    hooks: GameHooks,
  ) {
    this.hooks = hooks;
    this.pipeline = new LowResPipeline(canvas);
    this.pipeline.enablePost();
    this.picker = new Picker(canvas);
    this.grove.scene.add(this.view.root);
    this.cameraControls = new CameraControls(this.camera, canvas);
    this.input = new GameInput(canvas, {
      camera: this.camera,
      picker: this.picker,
      pickables: () => this.grove.pickables,
      pickSprite: (ndcX, ndcY) => this.view.pick(ndcX, ndcY, this.camera),
      placing: () => this.placing,
      canGrab: (id) => {
        const n = findNubbin(this.world, id);
        return !!n && n.behavior.state !== 'thrown' && n.stage !== 'cocoon';
      },
      send: (cmd) => this.send(cmd),
      onSelect: (id) => this.hooks.onSelect(id),
    });
    this.world = this.load();
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
        console.warn('Save could not be loaded; starting fresh.', err);
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
    const size = this.pipeline.resize(width, height);
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
      this.view.snapshot(this.world);
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
      this.view.onEvents(events, nowMs);
      this.hooks.onEvents(events);
      for (const e of events) {
        const shake = this.world.settings.screenShake;
        if (e.kind === 'landed' && shake) this.camera.shake(0.18);
        else if (e.kind === 'treeShaken' && shake) this.camera.shake(0.08);
        else if (e.kind === 'weather' || e.kind === 'located') this.lastDaylightMs = -Infinity;
        else if (e.kind === 'lanternLit') this.grove.setLit(litLanterns(this.world));
      }
    }

    // Camera follows the Keeper.
    const k = this.world.keeper;
    const t = 1 - Math.exp((-CAMERA.followRate * dt) / 1000);
    this.camera.target.x += (k.pos.x - this.camera.target.x) * t;
    this.camera.target.z += (k.pos.z - this.camera.target.z) * t;
    this.camera.update(nowMs);

    if (!this.renderPaused) {
      this.grove.update(nowMs);
      this.grove.setGrove(this.world.grove);
      this.updateDaylight(nowMs);
      this.view.update(this.world, this.camera, this.clock.alpha, nowMs);
      this.pipeline.render(this.grove.scene, this.camera.camera);
    }

    if (nowMs - this.lastSaveMs >= SIM.autosaveMs) this.save();
    this.rafId = requestAnimationFrame(this.frame);
  };
}
