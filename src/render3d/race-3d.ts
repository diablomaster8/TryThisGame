import * as THREE from 'three';
import { GROVE3D, RACE3D } from '../config/tuning';
import { SECTION_LABELS } from '../config/strings';
import type { RaceView } from '../minigames/race/view';
import type { Rigged } from '../samples/species';
import { variantById } from '../samples/nubbin-variant-catalogue';
import { sectionAt, type RaceState, type Racer } from '../sim/race';
import type { Nubbin } from '../sim/types';
import { el } from '../ui/dom';
import { nubbinLook, type Look } from './creature-pool';
import { gaitTime } from './gait';
import type { Grove3dScene } from './grove-3d-scene';
import {
  laneZ,
  racerY,
  sectionSpans,
  stackTags,
  trackHeight,
  type SectionSpan,
  type TagRect,
} from './minigame-layout';
import { MiniStage } from './minigame-stage';
import { waterMaterial, waterNormal } from './water';

interface Runner {
  racer: Racer;
  lane: number;
  look: Look;
  rig: Rigged | null;
  stand: THREE.Mesh | null;
  compiling: boolean;
  tag: THREE.Sprite;
  stamina: { group: THREE.Group; fill: THREE.Sprite } | null;
  pose: string;
}

/** Wait for the field this long after the stage is linked before stand-ins run. */
const U = RACE3D.unitsPerTrack;

/**
 * The races in Full 3D (G17): the sim's track laid along x with the lanes stacked away
 * from the camera, each section built to read as itself (grass to run, a sunk water
 * channel to swim, a pit to fly over, a rock ramp to climb, worn earth for the stamina
 * stretch), the racers as their own rigs with billboard name tags that stay readable in
 * portrait, and a camera that follows the player and leans toward the leader. Reads the
 * race only; the screen keeps the cheer button, the HUD and the results.
 */
export class Race3dView implements RaceView {
  readonly element: HTMLDivElement;
  ready = false;
  private stage: MiniStage | null = null;
  private runners: Runner[] = [];
  private spans: SectionSpan[] = [];
  private water: THREE.MeshPhysicalMaterial[] = [];
  private openedMs = 0;
  private sceneryReady = false;
  private lastMs = 0;
  private camX = 0;
  private signs: { sprite: THREE.Sprite; x: number; y: number; start: number; end: number }[] = [];
  /** This frame's tag anchors (x, y over the head, z), laid out after every racer is placed. */
  private readonly anchors: { r: Runner; x: number; y: number; z: number }[] = [];
  private readonly at = new THREE.Vector3();
  private readonly v = new THREE.Vector3();

  constructor(private readonly host: Grove3dScene) {
    // The 3D race keeps its HUD in the screen's own elements; this holds nothing yet.
    this.element = el('div', 'expedition-3d');
  }

  start(race: RaceState, player: Nubbin): void {
    this.stop();
    const stage = new MiniStage(this.host, RACE3D.hour);
    this.stage = stage;
    this.spans = sectionSpans(race.course);
    this.openedMs = performance.now();
    this.lastMs = 0;
    this.camX = 0;
    stage.backdrop(RACE3D.backdrop.top, RACE3D.backdrop.bottom);
    this.buildTrack(stage, race);
    this.runners = race.racers.map((racer, lane) => {
      const look = racer.isPlayer ? nubbinLook(player) : rivalLook(racer);
      const tag = stage.nameTag(racer.name, racer.isPlayer ? '#f2d34c' : '#fff6d8', RACE3D.nameTag);
      const stamina = racer.isPlayer ? stage.bar(1.1, 0.14, '#7ddc8a') : null;
      return {
        racer,
        lane,
        look,
        rig: null,
        stand: null,
        compiling: false,
        tag,
        stamina,
        pose: '',
      };
    });
    void stage.compile().then(() => {
      if (this.stage !== stage) return;
      this.sceneryReady = true;
      this.openedMs = performance.now();
    });
  }

  resize(): void {
    this.stage?.fit(RACE3D.camera);
  }

  cheered(race: RaceState, nowMs: number): void {
    const stage = this.stage;
    const me = this.runners.find((r) => r.racer.isPlayer);
    if (!stage || !me || stage.reduceMotion) return;
    const { section } = sectionAt(race.course, me.racer.pos);
    const y = racerY(section.kind, trackHeight(this.spans, me.racer.pos), me.racer.restMs > 0);
    this.at.set(me.racer.pos * U, y + 0.6, laneZ(me.lane));
    const b = RACE3D.cheerBurst;
    stage.bursts.burst('sparkle', this.at, b.count, b, nowMs);
  }

  stop(): void {
    // Rival looks are a race's own; their rigs would otherwise pile up in the pool.
    const keep = new Set(this.runners.filter((r) => r.racer.isPlayer).map((r) => r.look.key));
    const rivals = this.runners.filter((r) => !keep.has(r.look.key)).map((r) => r.look.key);
    this.stage?.dispose();
    for (const key of new Set(rivals)) this.host.pool.discard(key);
    this.stage = null;
    this.runners = [];
    this.spans = [];
    this.signs = [];
    this.water = [];
    this.ready = false;
    this.sceneryReady = false;
  }

  dispose(): void {
    this.stop();
  }

  draw(race: RaceState, nowMs: number): void {
    const stage = this.stage;
    if (!stage || !this.sceneryReady) return;
    stage.fit(RACE3D.camera);
    const dt = this.lastMs ? Math.min(0.1, (nowMs - this.lastMs) / 1000) : 0;
    this.lastMs = nowMs;
    stage.pool.frame();
    this.ensureRigs(nowMs);
    for (const w of this.water) w.normalMap!.offset.set(nowMs * 0.000015, nowMs * 0.00002);

    const player = this.runners.find((r) => r.racer.isPlayer) ?? this.runners[0]!;
    const leader = this.runners.reduce((a, b) => (b.racer.pos > a.racer.pos ? b : a), player);
    this.anchors.length = 0;
    for (const r of this.runners) this.placeRunner(race, r, nowMs, dt);

    const cam = RACE3D.camera;
    // Lean toward the leader, but never so far that the player leaves the left third of
    // the screen (in portrait the lean alone would push it off the edge).
    const px = player.racer.pos * U;
    const want = Math.min(
      px + (leader.racer.pos - player.racer.pos) * U * cam.leaderWeight,
      px + stage.halfSpan * cam.playerKeep - cam.lookAhead,
    );
    const atStart = this.camX === 0 && race.timeMs === 0;
    this.camX = atStart
      ? want
      : this.camX + (want - this.camX) * (1 - Math.exp(-cam.followRate * dt));
    const midLane = laneZ((this.runners.length - 1) / 2);
    const y = trackHeight(this.spans, this.camX / U) + cam.lookHeight;
    stage.aim(this.camX + cam.lookAhead, y, midLane, cam.pitchDeg, dt);
    // The signs settle first, then the tags are laid out (with the signs) against this
    // frame's camera, after it has moved.
    this.placeSigns(this.camX + cam.lookAhead, stage.halfSpan);
    this.layoutTags(stage);
    stage.render(nowMs, (x) => trackHeight(this.spans, x / U));
  }

  // ---------------------------------------------------------------- the field

  /** Take rigs as the pool builds them; after `rigWaitMs` the rest run as stand-ins. */
  private ensureRigs(nowMs: number): void {
    const stage = this.stage;
    if (!stage) return;
    let missing = 0;
    for (const r of this.runners) {
      if (r.rig) {
        if (r.compiling) missing++;
        continue;
      }
      const rig = stage.acquire(r.look);
      if (!rig) {
        missing++;
        continue;
      }
      r.rig = rig;
      r.compiling = true;
      rig.ground = (x) => trackHeight(this.spans, x / U);
      rig.setPose('idle');
      rig.face(Math.PI / 2);
      void stage.compile([rig.group]).then(() => {
        if (this.stage !== stage) return;
        r.compiling = false;
        rig.group.visible = true;
        if (r.stand) {
          r.stand.visible = false;
          r.stand = null;
        }
      });
    }
    if (this.ready) return;
    if (missing === 0) this.ready = true;
    else if (nowMs - this.openedMs > RACE3D.rigWaitMs) {
      for (const r of this.runners) if (!r.rig || r.compiling) r.stand ??= stage.standIn(r.look);
      this.ready = true;
    }
  }

  private placeRunner(race: RaceState, r: Runner, nowMs: number, dt: number): void {
    const { section } = sectionAt(race.course, r.racer.pos);
    const resting = r.racer.restMs > 0;
    const x = r.racer.pos * U;
    const z = laneZ(r.lane);
    const trackY = trackHeight(this.spans, r.racer.pos);
    let y = racerY(section.kind, trackY, resting);
    const flying = section.kind === 'fly' && !resting;
    if (flying) y += Math.sin(nowMs / 260 + r.lane) * 0.12;
    const swimming = section.kind === 'swim';
    if (r.stand) r.stand.position.set(x, y + r.stand.scale.y * 0.55, z);
    const rig = r.rig;
    if (!rig || r.compiling) {
      this.placeTag(r, x, y + r.look.height + 0.25, z);
      return;
    }
    rig.group.position.set(x, y, z);
    // A flyer hovers over the gap; a swimmer stands on the surface it is sunk under.
    rig.ground = flying
      ? () => trackY
      : swimming
        ? () => y
        : (gx) => trackHeight(this.spans, gx / U);
    rig.lift = flying ? y - trackY : 0;
    const pose = resting
      ? 'sleep'
      : flying
        ? 'happy'
        : race.finished || r.racer.finishedAtMs !== null
          ? 'idle'
          : 'walk';
    if (pose !== r.pose) {
      r.pose = pose;
      rig.setPose(pose);
    }
    rig.animate(gaitTime(rig, x, z, nowMs / 1000, dt, pose === 'walk', swimming ? 0.6 : 1));
    this.placeTag(r, x, y + r.look.height + 0.25, z);
  }

  private placeTag(r: Runner, x: number, y: number, z: number): void {
    this.anchors.push({ r, x: x + 0.2, y, z });
  }

  /**
   * Lay the tags and the visible section signs out so no two overlap on screen: each is
   * projected through this frame's camera to a pixel rectangle of its rendered size,
   * `stackTags` lifts the crowded ones apart, and each lift goes back to world units at
   * that card's depth.
   */
  private layoutTags(stage: MiniStage): void {
    const { width, height } = RACE3D.nameTag;
    const cam = stage.camera;
    cam.updateMatrixWorld();
    const size = stage.renderer.getSize(new THREE.Vector2());
    const rects: TagRect[] = [];
    const pxPerUnit: number[] = [];
    const cards: { x: number; y: number; z: number; w: number; h: number }[] = this.anchors.map(
      (a) => ({ x: a.x, y: a.y, z: a.z, w: width, h: height }),
    );
    const signs = this.signs.filter((s) => s.sprite.visible);
    for (const s of signs) {
      const p = s.sprite.position;
      cards.push({ x: p.x, y: s.y, z: p.z, w: s.sprite.scale.x, h: s.sprite.scale.y });
    }
    // A sprite is centred on its position: project its bottom and top edges. The tilted
    // camera draws a raised card a little larger, so the cards are measured where they
    // ended up and stacked again: two passes settle it.
    const measure = (a: (typeof cards)[number], at: number): TagRect => {
      this.v.set(a.x, at - a.h / 2, a.z).project(cam);
      const x = ((this.v.x + 1) / 2) * size.x;
      const bottom = ((1 - this.v.y) / 2) * size.y;
      this.v.set(a.x, at + a.h / 2, a.z).project(cam);
      const top = ((1 - this.v.y) / 2) * size.y;
      const h = Math.max(1, bottom - top);
      return { x, y: (top + bottom) / 2, w: (h * a.w) / a.h, h };
    };
    let lifted = cards.map((a) => a.y);
    for (let pass = 0; pass < 2; pass++) {
      rects.length = 0;
      pxPerUnit.length = 0;
      cards.forEach((a, i) => {
        const base = measure(a, a.y);
        const now = measure(a, lifted[i]!);
        // Where the card would sit unlifted, at the size it has where it is.
        rects.push({ x: base.x, y: base.y, w: now.w, h: now.h });
        pxPerUnit.push(now.h / a.h);
      });
      const lift = stackTags(rects, 3);
      // Back to world units: an estimate from the local scale, then one correction
      // against the real projection.
      lifted = cards.map((a, i) => {
        if (lift[i]! <= 0) return a.y;
        let y = a.y + lift[i]! / pxPerUnit[i]!;
        const want = rects[i]!.y - lift[i]!;
        y += (measure(a, y).y - want) / pxPerUnit[i]!;
        return y;
      });
    }
    this.anchors.forEach((a, i) => this.placeTagAt(a.r, a.x, lifted[i]!, a.z));
    signs.forEach((s, j) => {
      s.sprite.position.y = lifted[this.anchors.length + j]!;
    });
  }

  private placeTagAt(r: Runner, x: number, y: number, z: number): void {
    r.tag.position.set(x, y, z);
    if (r.stamina) {
      r.stamina.group.position.set(x, y - 0.3, z);
      const k = Math.max(0, Math.min(1, r.racer.stamina / r.racer.staminaMax));
      r.stamina.fill.scale.x = 1.1 * k;
      (r.stamina.fill.material as THREE.SpriteMaterial).color.set(k > 0.25 ? '#7ddc8a' : '#ff8a5a');
    }
  }

  /**
   * A sign stays whole on screen while its section is in view: it slides in from the
   * right as the section nears, sits on its post, then holds at the left edge until the
   * section has passed, rather than clipping at either edge.
   */
  private placeSigns(lookX: number, halfSpan: number): void {
    const margin = RACE3D.nameTag.width * 0.6;
    const left = lookX - halfSpan + margin;
    const right = lookX + halfSpan - margin;
    for (const s of this.signs) {
      const shown = s.end > lookX - halfSpan && s.start < lookX + halfSpan;
      s.sprite.visible = shown;
      if (shown) s.sprite.position.x = Math.min(right, Math.max(left, s.x));
    }
  }

  // ---------------------------------------------------------------- the track

  /** Chalk lines between the lanes along a flat section, so each racer reads in its lane. */
  private laneLines(stage: MiniStage, x0: number, x1: number, lanes: number, y: number): void {
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    for (let i = 0; i < lanes - 1; i++) {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, 0.14), mat);
      line.rotation.x = -Math.PI / 2;
      line.position.set((x0 + x1) / 2, y + 0.03, (laneZ(i) + laneZ(i + 1)) / 2);
      line.renderOrder = 1;
      stage.scene.add(line);
    }
  }

  private buildTrack(stage: MiniStage, race: RaceState): void {
    const lanes = race.racers.length;
    const zBack = laneZ(lanes - 1) - RACE3D.margin;
    const zFront = RACE3D.margin;
    const normal = stage.own(waterNormal());
    // The run-up before the line, then each section.
    stage.strip(-RACE3D.startPad * U - 8, 0, zBack - 6, zFront + 4, 'grass');
    for (const s of this.spans) {
      const x0 = s.start * U;
      const x1 = s.end * U;
      switch (s.kind) {
        // A run is a dirt track with chalked lanes, not more field: on grass the runners
        // looked loose on the lawn beside the course (review C, item 20).
        case 'run':
          stage.strip(x0, x1, zBack, zFront, 'dirt', { y: s.y0 });
          this.laneLines(stage, x0, x1, lanes, s.y0);
          break;
        case 'stretch':
          stage.strip(x0, x1, zBack, zFront, 'cobble', { y: s.y0 });
          this.laneLines(stage, x0, x1, lanes, s.y0);
          break;
        case 'climb': {
          stage.strip(x0, x1, zBack, zFront, 'rock', { y: s.y0, y1: s.y1 });
          // The cliff face under the ramp's far end, so the rise reads as a wall.
          const face = stage.earth(new THREE.PlaneGeometry(zFront - zBack, s.y1 - s.y0), true);
          face.rotation.y = Math.PI / 2;
          face.position.set(x1 - 0.01, (s.y0 + s.y1) / 2, (zBack + zFront) / 2);
          stage.scene.add(face);
          break;
        }
        case 'swim': {
          const bed = s.y0 - RACE3D.channelDepth;
          stage.strip(x0, x1, zBack, zFront, 'cobble', { y: bed });
          // The Grove's water less its refraction: a transmission pass costs a full-size
          // target per camera that the renderer keeps, and a second draw of the scene.
          const mat = waterMaterial(normal, 0.2);
          mat.transmission = 0;
          mat.opacity = 0.82;
          this.water.push(mat);
          const w = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, zFront - zBack), mat);
          w.rotation.x = -Math.PI / 2;
          w.position.set((x0 + x1) / 2, s.y0 + RACE3D.waterLevel, (zBack + zFront) / 2);
          stage.scene.add(w);
          for (const [xe, side] of [
            [x0, 1],
            [x1, -1],
          ] as const) {
            const bank = stage.earth(new THREE.PlaneGeometry(zFront - zBack, RACE3D.channelDepth));
            bank.rotation.y = (side * Math.PI) / 2;
            bank.position.set(xe, bed + RACE3D.channelDepth / 2, (zBack + zFront) / 2);
            stage.scene.add(bank);
          }
          break;
        }
        case 'fly': {
          const floor = s.y0 - RACE3D.gapDepth;
          // A gully floor of bare rock, so the gap reads as a drop and not another strip.
          const pit = stage.earth(new THREE.PlaneGeometry(x1 - x0, zFront - zBack + 4), true);
          pit.rotation.x = -Math.PI / 2;
          pit.position.set((x0 + x1) / 2, floor, (zBack + zFront) / 2);
          stage.scene.add(pit);
          for (const [xe, side] of [
            [x0, 1],
            [x1, -1],
          ] as const) {
            const wall = stage.earth(new THREE.PlaneGeometry(zFront - zBack + 4, RACE3D.gapDepth));
            wall.rotation.y = (side * Math.PI) / 2;
            wall.position.set(xe, floor + RACE3D.gapDepth / 2, (zBack + zFront) / 2);
            stage.scene.add(wall);
          }
          break;
        }
      }
      // The section's sign at its start, over the far lane.
      const sign = stage.nameTag(SECTION_LABELS[s.kind], '#fff6d8', {
        width: 2.2,
        height: 0.5,
        fontPx: 48,
      });
      sign.position.set(x0 + 1.1, Math.max(s.y0, s.y1) + RACE3D.signHeight, zBack + 0.6);
      this.signs.push({ sprite: sign, x: x0 + 1.1, y: sign.position.y, start: x0, end: x1 });
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1.6, 6),
        new THREE.MeshStandardMaterial({ color: '#5a3c28', roughness: 0.9 }),
      );
      post.scale.y = RACE3D.signHeight / 1.6;
      post.position.set(x0, Math.max(s.y0, s.y1) + RACE3D.signHeight / 2, zBack + 0.6);
      stage.scene.add(post);
    }
    // Past the finish, and the line itself: checked posts across the lanes.
    const last = this.spans[this.spans.length - 1]!;
    const endX = race.length * U;
    stage.strip(endX, endX + 12, zBack - 6, zFront + 4, 'grass', { y: last.y1 });
    const check = stage.own(checkerTexture());
    const line = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, zFront - zBack),
      new THREE.MeshStandardMaterial({ map: check, roughness: 0.8 }),
    );
    line.rotation.x = -Math.PI / 2;
    line.position.set(endX, last.y1 + 0.015, (zBack + zFront) / 2);
    stage.scene.add(line);
    for (const z of [zBack, zFront]) {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 2.6, 8),
        new THREE.MeshStandardMaterial({ color: '#f2eee0', roughness: 0.6 }),
      );
      pole.position.set(endX, last.y1 + 1.3, z);
      pole.castShadow = true;
      stage.scene.add(pole);
    }
    const banner = new THREE.Mesh(
      new THREE.PlaneGeometry(zFront - zBack, 0.5),
      new THREE.MeshStandardMaterial({ map: check, roughness: 0.8, side: THREE.DoubleSide }),
    );
    banner.rotation.y = Math.PI / 2;
    banner.position.set(endX, last.y1 + 2.45, (zBack + zFront) / 2);
    stage.scene.add(banner);
    // Trees along the far side, and a hill behind them, so the track sits in a place.
    const t = RACE3D.trees;
    for (let i = 0; i < t.count; i++) {
      const g = stage.tree(t.scale, i + 11);
      const x = -4 + i * t.spacing;
      g.position.set(x, trackHeight(this.spans, x / U), zBack - t.back - (i % 2) * 1.5);
    }
    const back = stage.strip(-20, endX + 24, zBack - 30, zBack, 'grass', { y: -0.02 });
    back.receiveShadow = false;
    const hill = new THREE.Mesh(
      new THREE.SphereGeometry(1, 24, 12),
      new THREE.MeshStandardMaterial({ color: '#5f8f4a', roughness: 1 }),
    );
    hill.scale.set(endX * 0.7 + 20, 7, 12);
    hill.position.set(endX / 2, -1, zBack - 24);
    stage.scene.add(hill);
  }
}

/** A rival's look from its sim hint: the first evolution of its band and type. */
function rivalLook(r: Racer): Look {
  const id = `first-${r.look.band}-${r.look.type}`;
  return {
    key: variantById(id) ? `variant:${id}` : 'nubbin',
    height: GROVE3D.adultHeight,
  };
}

function checkerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext('2d');
  if (ctx) {
    for (let y = 0; y < 4; y++)
      for (let x = 0; x < 4; x++) {
        ctx.fillStyle = (x + y) % 2 ? '#1a1626' : '#f4f1ea';
        ctx.fillRect(x * 8, y * 8, 8, 8);
      }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.magFilter = THREE.NearestFilter;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 4);
  return t;
}
