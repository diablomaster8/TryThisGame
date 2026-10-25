import * as THREE from 'three';
import { EXPEDITION3D, READ3D } from '../config/tuning';
import { EXPEDITION3D_PORTRAIT } from '../config/tuning-fx3d';
import { NAMES } from '../config/strings';
import type { ExpeditionTheme, ExpeditionView } from '../minigames/expedition/view';
import { progressOf, type RunState, type ThingKind } from '../minigames/expedition/run';
import { buildGrass } from '../samples/aaa-kit';
import type { Rigged } from '../samples/species';
import type { SpriteSheet } from '../render/sprites/atlas';
import type { Nubbin, NubbinType } from '../sim/types';
import { el } from '../ui/dom';
import { nubbinLook, type Look } from './creature-pool';
import { gaitTime } from './gait';
import type { Grove3dScene } from './grove-3d-scene';
import { hillHeight, portraitChase, ringSlot, runnerWorld, thingWorld } from './minigame-layout';
import { MiniStage, UV_PERIOD } from './minigame-stage';

/** The burst each pickup and a hit throw up. */
const BURST = {
  pickup: { spread: 0.25, speed: 0.9, rise: 1.2, lifeMs: 550 },
  hit: { spread: 0.4, speed: 1.2, rise: 0.6, lifeMs: 500 },
} as const;

/**
 * The Expedition in Full 3D (G17): the pure run drawn as a side-on track along x with a
 * chase camera on the viewer's side, the runner's own sculpted rig walking and hopping
 * along it, shells, essences, critter bubbles and obstacles as small props, rows of
 * hills for depth, and a ring of the Grove's trees and grass recycled along the way.
 * Reads the run only; the screen keeps the flow, the input and the results.
 */
export class Expedition3dView implements ExpeditionView {
  readonly element: HTMLDivElement;
  ready = false;
  private readonly nameTag: HTMLDivElement;
  private readonly progress: HTMLElement;
  private stage: MiniStage | null = null;
  private look: Look | null = null;
  private rig: Rigged | null = null;
  private stand: THREE.Mesh | null = null;
  private compilingRig = false;
  /** The scenery's programs are linked; nothing draws before that. */
  private sceneryReady = false;
  private openedMs = 0;
  private things = new Map<number, THREE.Object3D>();
  /** Props no longer on the track, by kind (essences by type), for the next of their kind. */
  private spare: Record<string, THREE.Object3D[]> = {};
  private trees: THREE.Group[] = [];
  private grass: THREE.Group[] = [];
  private hills: THREE.Mesh[] = [];
  private ground: THREE.Mesh[] = [];
  private lastEventAt = -1;
  private lastMs = 0;
  private readonly at = new THREE.Vector3();

  constructor(private readonly host: Grove3dScene) {
    this.element = el('div', 'expedition-3d');
    this.nameTag = el('div', 'expedition-name');
    this.progress = el('i');
    const bar = el('div', 'expedition-progress');
    bar.appendChild(this.progress);
    this.element.append(bar, this.nameTag);
  }

  start(runner: Nubbin, _sheet: SpriteSheet, theme: ExpeditionTheme): void {
    this.stop();
    const stage = new MiniStage(this.host, EXPEDITION3D.hour[theme]);
    this.stage = stage;
    this.nameTag.textContent = runner.name || NAMES.creature;
    this.look = nubbinLook(runner);
    this.openedMs = performance.now();
    this.lastEventAt = -1;
    this.lastMs = 0;
    const back = EXPEDITION3D.backdrop[theme];
    stage.backdrop(back.top, back.bottom);
    this.buildScenery(stage);
    // Link the scenery's programs before the first frame; the rig links when it lands.
    void stage.compile().then(() => {
      if (this.stage !== stage) return;
      this.sceneryReady = true;
      if (this.rig && !this.compilingRig) this.showRig();
    });
  }

  resize(): void {
    this.stage?.fit(expeditionLens(this.stage.aspect));
  }

  stop(): void {
    this.stage?.dispose();
    this.stage = null;
    this.rig = null;
    this.stand = null;
    this.look = null;
    this.things.clear();
    this.spare = {};
    this.trees = [];
    this.grass = [];
    this.hills = [];
    this.ground = [];
    this.ready = false;
    this.compilingRig = false;
    this.sceneryReady = false;
  }

  dispose(): void {
    this.stop();
  }

  draw(run: RunState, nowMs: number): void {
    const stage = this.stage;
    if (!stage || !this.sceneryReady) return;
    stage.fit(expeditionLens(stage.aspect));
    const dt = this.lastMs ? Math.min(0.1, (nowMs - this.lastMs) / 1000) : 0;
    this.lastMs = nowMs;
    stage.pool.frame();
    this.ensureRig(nowMs);

    const runner = runnerWorld(run.distance, run.runnerY);
    this.placeScenery(runner.x);
    this.placeThings(run, nowMs);
    this.placeRunner(run, runner, nowMs, dt);
    this.events(run, runner);

    const cam = EXPEDITION3D.camera;
    // A tall screen frames the runner larger, a third of the way in, the track lower.
    const look = portraitChase(
      stage.aspect,
      stage.halfSpan,
      stage.halfHeight,
      cam,
      EXPEDITION3D_PORTRAIT,
    );
    stage.aim(runner.x + look.lookAhead, look.lookHeight, 0, cam.pitchDeg, dt);
    stage.render(nowMs, () => 0);
    this.progress.style.width = `${(progressOf(run) * 100).toFixed(1)}%`;
  }

  // ---------------------------------------------------------------- the runner

  /** Take the rig when the pool has it; after `rigWaitMs` run with a stand-in meanwhile. */
  private ensureRig(nowMs: number): void {
    const stage = this.stage;
    if (!stage || !this.look || this.rig) return;
    const rig = stage.acquire(this.look);
    if (rig) {
      this.rig = rig;
      rig.ground = () => 0;
      rig.setPose('walk');
      // Three-quarters to the camera, so the face reads (bug 16).
      rig.face(Math.PI / 2 - READ3D.faceTurn);
      this.compilingRig = true;
      void stage.compile([rig.group]).then(() => {
        if (this.stage !== stage) return;
        this.compilingRig = false;
        if (this.sceneryReady) this.showRig();
      });
      return;
    }
    if (!this.ready && this.sceneryReady && nowMs - this.openedMs > EXPEDITION3D.rigWaitMs) {
      this.stand ??= stage.standIn(this.look);
      this.ready = true;
    }
  }

  private showRig(): void {
    if (!this.rig || this.compilingRig) return;
    this.rig.group.visible = true;
    if (this.stand) {
      this.stand.visible = false;
      this.stand = null;
    }
    this.ready = true;
  }

  private placeRunner(
    run: RunState,
    at: { x: number; y: number },
    nowMs: number,
    dt: number,
  ): void {
    const hit = run.lastEvent?.kind === 'hit' && run.timeMs - run.lastEvent.atMs < 300;
    const shown = !hit || Math.floor(nowMs / 60) % 2 === 0;
    if (this.stand) {
      this.stand.position.set(at.x, at.y + this.stand.scale.y * 0.55, 0);
      this.stand.visible = shown;
    }
    const rig = this.rig;
    if (!rig || this.compilingRig) return;
    rig.group.visible = shown;
    rig.group.position.set(at.x, at.y, 0);
    rig.lift = at.y;
    rig.setPose(run.onGround ? 'walk' : 'happy');
    rig.animate(gaitTime(rig, at.x, 0, nowMs / 1000, dt, run.onGround));
  }

  /** Sparkles on a pickup, dust and a kick on a hit, once per event. */
  private events(run: RunState, at: { x: number; y: number }): void {
    const stage = this.stage;
    const e = run.lastEvent;
    if (!stage || !e || e.atMs === this.lastEventAt) return;
    this.lastEventAt = e.atMs;
    this.at.set(at.x + 0.2, at.y + 0.7, 0);
    const now = performance.now();
    if (e.kind === 'hit') {
      stage.kick(EXPEDITION3D.shake);
      if (!stage.reduceMotion) stage.bursts.burst('dust', this.at, 10, BURST.hit, now);
    } else if (!stage.reduceMotion) {
      stage.bursts.burst(e.kind === 'critter' ? 'heart' : 'sparkle', this.at, 8, BURST.pickup, now);
    }
  }

  // ---------------------------------------------------------------- things

  private placeThings(run: RunState, nowMs: number): void {
    const stage = this.stage;
    if (!stage) return;
    const live = new Set<number>();
    const t = nowMs / 1000;
    for (const thing of run.things) {
      live.add(thing.id);
      let o = this.things.get(thing.id);
      if (!o) {
        const key = thing.kind === 'essence' ? `essence:${thing.type ?? 'normal'}` : thing.kind;
        o = this.spare[key]?.pop() ?? this.make(stage, thing.kind, thing.type);
        o.visible = true;
        o.userData.spare = key;
        this.things.set(thing.id, o);
      }
      const w = thingWorld(thing);
      const bob = Math.sin(t * 3 + thing.id) * 0.06;
      switch (thing.kind) {
        case 'shell':
          o.position.set(w.x, w.y + 0.1 + bob, 0);
          o.rotation.set(0, t * 1.8 + thing.id, 0);
          o.scale.setScalar(EXPEDITION3D.shellRadius);
          break;
        case 'essence':
          o.position.set(w.x, w.y + bob, 0);
          o.rotation.y = t * 1.4 + thing.id;
          o.scale.set(
            EXPEDITION3D.essenceSize,
            EXPEDITION3D.essenceSize * 1.4,
            EXPEDITION3D.essenceSize,
          );
          break;
        case 'critter':
          o.position.set(w.x, w.y + bob * 1.5, 0);
          o.scale.setScalar(EXPEDITION3D.bubbleRadius);
          break;
        case 'rock':
          o.position.set(w.x, w.y - thing.h * EXPEDITION3D.unitsPerPx * 0.15, 0);
          o.scale.set(
            thing.w * EXPEDITION3D.unitsPerPx * 0.55,
            thing.h * EXPEDITION3D.unitsPerPx * 0.65,
            0.45,
          );
          break;
        case 'log':
          o.position.set(w.x, w.y, 0);
          o.scale.set(
            thing.w * EXPEDITION3D.unitsPerPx,
            thing.h * EXPEDITION3D.unitsPerPx * 0.5,
            thing.h * EXPEDITION3D.unitsPerPx * 0.5,
          );
          break;
        case 'bush':
          o.position.set(w.x, w.y, 0);
          o.scale.setScalar(thing.h * EXPEDITION3D.unitsPerPx * 0.55);
          break;
      }
    }
    for (const [id, o] of this.things) {
      if (live.has(id)) continue;
      this.things.delete(id);
      o.visible = false;
      const key = o.userData.spare as string;
      (this.spare[key] ??= []).push(o);
    }
  }

  /** The essence's colour is its type's; a reused essence keeps the type it was made with. */
  private make(stage: MiniStage, kind: ThingKind, type: NubbinType | null): THREE.Object3D {
    switch (kind) {
      case 'shell':
        return stage.shell();
      case 'essence':
        return stage.essence(type ?? 'normal');
      case 'critter':
        return stage.bubble();
      case 'rock':
        return stage.rock();
      case 'log':
        return stage.log();
      case 'bush':
        return stage.bush();
    }
  }

  // ---------------------------------------------------------------- scenery

  private buildScenery(stage: MiniStage): void {
    const { ground, hills, trees, grass } = EXPEDITION3D;
    const half = EXPEDITION3D.sceneryHalf;
    // The meadow and the worn path the runner keeps to.
    this.ground.push(stage.strip(-half, half, -ground.back, ground.front, 'grass'));
    this.ground.push(stage.strip(-half, half, -0.7, 0.7, 'dirt', { y: 0.012 }));
    // Hill rows, one ribbon each, a whole number of periods long so they tile.
    for (const row of hills) {
      const len = Math.ceil((half * 2 + row.period) / row.period) * row.period;
      this.hills.push(this.hillRibbon(stage, len, row));
    }
    for (let i = 0; i < trees.count; i++) this.trees.push(stage.tree(trees.scale, i + 3));
    for (let i = 0; i < 2; i++) {
      const g = new THREE.Group();
      buildGrass(g, stage.tex, stage.time, {
        ground: () => 0,
        half: grass.span / 2,
        centreZ: -grass.depth / 2 + 0.5,
        count: grass.count,
        allow: (_x, z) =>
          Math.abs(z + grass.depth / 2 - 0.5) < grass.depth / 2 && Math.abs(z) > 0.9,
      });
      stage.scene.add(g);
      this.grass.push(g);
    }
  }

  private hillRibbon(
    stage: MiniStage,
    len: number,
    row: { z: number; rise: number; period: number; color: string },
  ): THREE.Mesh {
    const segs = Math.max(8, Math.round(len / 1.5));
    const pos: number[] = [];
    const idx: number[] = [];
    for (let i = 0; i <= segs; i++) {
      const x = -len / 2 + (i / segs) * len;
      pos.push(x, hillHeight(x, row.rise, row.period), 0, x, -2, 0);
      if (i < segs) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const m = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ color: row.color, roughness: 1, side: THREE.DoubleSide }),
    );
    m.position.z = row.z;
    m.receiveShadow = true;
    stage.scene.add(m);
    return m;
  }

  /** Recentre the tiling scenery on the camera and recycle the tree ring. */
  private placeScenery(camX: number): void {
    const { hills, trees, grass } = EXPEDITION3D;
    for (const g of this.ground) g.position.x = Math.round(camX / UV_PERIOD) * UV_PERIOD;
    this.hills.forEach((m, i) => {
      const p = hills[i]!.period;
      m.position.x = Math.round(camX / p) * p;
    });
    this.trees.forEach((g, i) => {
      g.position.set(ringSlot(i, trees.count, trees.spacing, camX, trees.spacing * 2), 0, trees.z);
    });
    const tile = Math.round(camX / grass.span) * grass.span;
    const side = camX >= tile ? 1 : -1;
    this.grass[0]!.position.x = tile;
    this.grass[1]!.position.x = tile + side * grass.span;
  }
}

/** The chase lens for a screen aspect: landscape's, with a narrower span on a tall screen. */
function expeditionLens(aspect: number): { height: number; minSpan: number; fovDeg: number } {
  const cam = EXPEDITION3D.camera;
  return aspect < 1 ? { ...cam, minSpan: EXPEDITION3D_PORTRAIT.minSpan } : cam;
}
