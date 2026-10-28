import {
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  HemisphereLight,
  Path,
  Shape,
  ShapeGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  BoxGeometry,
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  CanvasTexture,
  NearestFilter,
  RepeatWrapping,
  Vector2,
  Vector4,
  type Texture,
} from 'three';
import { CAMERA, DUNGEON, GROVE, GROVE3D, LANTERN_POSTS, PIXEL_LIGHT } from '../config/tuning';
import type { SceneStage } from '../config/story';
import type { GroveKind, Location, TileKind, WeatherKind, World } from '../sim/types';
import { PixelDressings, type PixelDressCtx } from './dressings';
import { PIXEL_BUILDINGS, PIXEL_VIEW, safeRect, toScreen } from './stage-api';
import { daylightAt, type Daylight } from './daylight';
import { C, color } from './sprites/palette';
import { groundTexture, makeGroundTexture } from './ground';
import type { GroundJob, GroundResult } from './ground.worker';
import { pondOutline } from './paint/shore';
import {
  paintCliffTexture,
  paintGrassTopTexture,
  paintWaterfallTexture,
  poolShape,
  rampGeometry,
  terraceSide,
  terraceTop,
} from './paint/terrain';
import { BUILDINGS } from './scenery';
import { cellAt, WALL, type Floor } from '../sim/dungeon';
import { pixelTiers, TERRACES } from '../sim/terrain';
import {
  floorWorldSize,
  paintCaveWallTexture,
  paintFloorTexture,
  vistaCells,
} from './paint/dungeon';
import {
  makeBarkTexture,
  makeLeafTexture,
  makeSkyTexture,
  makeBridgeTexture,
  makeWaterGlintTexture,
  makeWaterTexture16,
} from './textures';

/** A flat ribbon along a polyline, UVs running along it so a tile scrolls downstream. */
function ribbon(
  points: ReadonlyArray<{ x: number; z: number }>,
  width: number,
  y: number,
): BufferGeometry {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  let dist = 0;
  for (let i = 0; i < points.length; i++) {
    const p = points[i]!;
    const prev = points[Math.max(0, i - 1)]!;
    const next = points[Math.min(points.length - 1, i + 1)]!;
    const dx = next.x - prev.x;
    const dz = next.z - prev.z;
    const len = Math.hypot(dx, dz) || 1;
    const nx = -dz / len;
    const nz = dx / len;
    if (i > 0) dist += Math.hypot(p.x - prev.x, p.z - prev.z);
    pos.push(
      p.x + (nx * width) / 2,
      y,
      p.z + (nz * width) / 2,
      p.x - (nx * width) / 2,
      y,
      p.z - (nz * width) / 2,
    );
    uv.push(0, dist / width, 1, dist / width);
    if (i > 0) {
      const a = (i - 1) * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/** Sky gradients per phase: top colour, bottom colour, clouds. */
const PX = GROVE3D.cave.pixel;

const SKY_GRADIENTS: Record<string, [string, string, boolean]> = {
  day: [color(C.skyDeep), color(C.skyLight), true],
  dawn: [color(C.violet), color(C.roseLight), true],
  dusk: [color(C.moonPurple), color(C.orange), false],
  night: [color(C.ink), color(C.nightBlue), false],
  sun: [color(C.skyLight), color(C.cream), true],
  moon: [color(C.ink), color(C.violetDeep), false],
};

/** The pond as a flat polygon following the noise shoreline, grown by `grow` units; UVs 0..1 over its box. */
function pondGeometry(grow: number): ShapeGeometry {
  const pts = pondOutline(72, grow);
  const shape = new Shape();
  pts.forEach((p, i) =>
    i === 0
      ? shape.moveTo(p.x - GROVE.pond.x, -(p.z - GROVE.pond.z))
      : shape.lineTo(p.x - GROVE.pond.x, -(p.z - GROVE.pond.z)),
  );
  shape.closePath();
  const geo = new ShapeGeometry(shape, 1);
  remapUv(geo, GROVE.pond.r + grow + 2);
  return geo;
}

/** A ring between two shoreline offsets. */
function pondRingGeometry(inner: number, outer: number): ShapeGeometry {
  const outerPts = pondOutline(72, outer);
  const innerPts = pondOutline(72, inner);
  const shape = new Shape();
  outerPts.forEach((p, i) =>
    i === 0
      ? shape.moveTo(p.x - GROVE.pond.x, -(p.z - GROVE.pond.z))
      : shape.lineTo(p.x - GROVE.pond.x, -(p.z - GROVE.pond.z)),
  );
  shape.closePath();
  const hole = new Path();
  innerPts.forEach((p, i) =>
    i === 0
      ? hole.moveTo(p.x - GROVE.pond.x, -(p.z - GROVE.pond.z))
      : hole.lineTo(p.x - GROVE.pond.x, -(p.z - GROVE.pond.z)),
  );
  hole.closePath();
  shape.holes.push(hole);
  const geo = new ShapeGeometry(shape, 1);
  remapUv(geo, GROVE.pond.r + outer + 2);
  return geo;
}

function remapUv(geo: ShapeGeometry, half: number): void {
  const pos = geo.getAttribute('position');
  const uv = geo.getAttribute('uv');
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + half) / (2 * half), (pos.getY(i) + half) / (2 * half));
  }
  uv.needsUpdate = true;
}

/**
 * The Grove: a low-poly garden with grass, a pond, hills, two fruit trees and a
 * waterfall, all on the shared palette. Static geometry lives here; creatures and items
 * are sprites managed by WorldView.
 */
export class GroveScene {
  readonly scene = new Scene();
  /** Everything that belongs to the home Grove, hidden in the other places. */
  private readonly groveGroup = new Group();
  private readonly hollowGroup = new Group();
  private readonly corvinGroup = new Group();
  private location: Location = 'grove';
  private weather: WeatherKind = 'clear';
  private groundMat: MeshLambertMaterial | null = null;
  private groundTex: Texture | null = null;
  private ground: Mesh | null = null;
  private skirt: Mesh | null = null;
  /** The Hollow Below: its floor, walls and lights, rebuilt per floor. */
  private readonly dungeonGroup = new Group();
  private readonly dungeonLights: PointLight[] = [];
  private dungeonTorches: Array<{ x: number; z: number }> = [];
  private dungeonParts: Array<{ dispose(): void }> = [];
  private dungeonPickables: Object3D[] = [];
  private cliffMat: MeshLambertMaterial | null = null;
  /** Reduced motion: the torch lamps do not flicker. */
  private holdStill = false;
  /** The strip of wall that sinks between the camera and the Keeper (see patchCaveCut). */
  private readonly caveCut = {
    keeper: { value: new Vector2() },
    dir: { value: new Vector2(0, 1) },
    params: {
      value: new Vector4(
        PX.cutWidth,
        PX.cutSoft,
        PX.wallH / Math.tan((CAMERA.pitchDeg * Math.PI) / 180) + PX.cutExtra,
        PX.cutHeight,
      ),
    },
  };

  /** Repaint the ground with the painted tiles (terraforming). */
  setTiles(tiles: Record<string, TileKind>): void {
    this.requestGround(tiles);
  }

  private groundWorker: Worker | null = null;
  private groundJob = 0;

  /**
   * The full painting takes a couple of seconds for the 96-unit field, so it runs in a
   * worker and swaps in when done; until then the quick low-res painting shows. Where
   * workers are unavailable it paints on the main thread.
   */
  private requestGround(tiles: Record<string, TileKind>): void {
    const id = ++this.groundJob;
    const inline = () => this.swapGround(makeGroundTexture(7, tiles));
    if (typeof Worker === 'undefined') {
      inline();
      return;
    }
    if (!this.groundWorker) {
      try {
        this.groundWorker = new Worker(new URL('./ground.worker.ts', import.meta.url), {
          type: 'module',
        });
        this.groundWorker.onmessage = (e: MessageEvent<GroundResult>) => {
          if (e.data.id !== this.groundJob) return;
          this.swapGround(groundTexture(e.data));
        };
        this.groundWorker.onerror = () => {
          this.groundWorker?.terminate();
          this.groundWorker = null;
          inline();
        };
      } catch {
        this.groundWorker = null;
        inline();
        return;
      }
    }
    const job: GroundJob = { id, seed: 7, tiles };
    this.groundWorker.postMessage(job);
  }

  private swapGround(next: Texture): void {
    if (!this.groundMat) {
      next.dispose();
      return;
    }
    this.groundMat.map = next;
    this.groundMat.needsUpdate = true;
    this.groundTex?.dispose();
    this.groundTex = next;
  }
  /** Meshes that can be tapped, with `userData.pick = { kind, id }`. */
  readonly pickables: Object3D[] = [];
  private readonly water: Texture;
  private readonly glint: Texture;
  private readonly falls: Texture;
  private readonly disposables: Array<{ dispose(): void }> = [];
  private readonly hemi: HemisphereLight;
  private readonly sun: DirectionalLight;
  /** Textured materials that take the Sun/Moon tint. */
  private readonly tintable: MeshLambertMaterial[] = [];
  private groveKind: GroveKind = 'main';
  private readonly canopies: Mesh[] = [];
  private readonly skies = new Map<string, Texture>();
  /** The four lantern posts, for the view. */
  readonly lanternSpots: Array<{ id: string; x: number; z: number }> = [];
  private duskLanterns = false;

  /** Lantern states for the view: lit at dusk, or when the Keeper lit them. */
  lanternStates(): Array<{ id: string; x: number; z: number; lit: boolean }> {
    return this.lanternSpots.map((s) => ({ ...s, lit: this.duskLanterns || this.lit.has(s.id) }));
  }
  private lit = new Set<string>();
  private readonly lanternLight: PointLight;
  private readonly lamps: PointLight[] = [];
  /** Where the lamps stand, for the view's sprite lighting. */
  readonly lampSpots: Array<{ x: number; z: number; r: number }> = [];
  /** True while the lamps are on. */
  lampsOn = false;
  private readonly foam: Mesh<ShapeGeometry, MeshBasicMaterial>;

  /** The campaign-graphics packages' story dressing (render/dressings.ts). */
  private readonly dressings = new PixelDressings();

  /**
   * `tiles` is the loaded world's painted ground, so a reload paints it straight away.
   * `sprites` is the WorldView's batch and sheets, for the dressings' billboards.
   */
  constructor(tiles: Record<string, TileKind> = {}, sprites: PixelDressCtx['sprites'] = null) {
    this.scene.background = new Color(color(C.nightBlue));

    this.hemi = new HemisphereLight(new Color(color(C.shallows)), new Color(color(C.forest)), 1.5);
    this.scene.add(this.hemi);
    this.sun = new DirectionalLight(new Color(color(C.cream)), 1.1);
    this.sun.position.set(6, 10, 4);
    this.scene.add(this.sun);

    // Ground.
    const size = GROVE.size;
    // A quick coarse painting first; the full one arrives from the worker.
    const grass = makeGroundTexture(7, {}, 4);
    const groundGeo = new PlaneGeometry(size, size);
    const groundMat = new MeshLambertMaterial({ map: grass });
    this.groundMat = groundMat;
    this.groundTex = grass;
    this.tintable.push(groundMat);
    const ground = new Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.userData.pick = { kind: 'ground', id: 'ground' };
    this.scene.add(ground);
    this.pickables.push(ground);
    this.ground = ground;
    this.disposables.push(groundGeo, groundMat, grass);
    // The wild wood beyond the field: at the far zoom the Grove no longer floats as a
    // diamond over the sky (review C, item 21). Not pickable, so taps there do nothing.
    const skirtTex = makeSkirtTexture();
    skirtTex.repeat.set((size * 9) / 6, (size * 9) / 6);
    const skirtGeo = new PlaneGeometry(size * 9, size * 9);
    const skirtMat = new MeshLambertMaterial({ map: skirtTex });
    this.tintable.push(skirtMat);
    const skirt = new Mesh(skirtGeo, skirtMat);
    skirt.rotation.x = -Math.PI / 2;
    skirt.position.y = -0.06;
    this.scene.add(skirt);
    this.skirt = skirt;
    this.disposables.push(skirtGeo, skirtMat, skirtTex);
    this.requestGround(tiles);

    // Pond: a wet rim, the water disc with a scrolling wave tile, a drifting glint layer
    // the other way, and a lit shallows ring at the bank. The stream shares the same look.
    const pond = GROVE.pond;
    const rimGeo = pondGeometry(0.4);
    const rimMat = new MeshLambertMaterial({ color: new Color(color(C.sandDeep)) });
    const rim = new Mesh(rimGeo, rimMat);
    rim.rotation.x = -Math.PI / 2;
    rim.position.set(pond.x, 0.01, pond.z);
    this.groveGroup.add(rim);
    this.water = makeWaterTexture16(pond.r);
    this.glint = makeWaterGlintTexture(pond.r * 0.9);
    const waterMat = new MeshLambertMaterial({ map: this.water });
    const glintMat = new MeshBasicMaterial({
      map: this.glint,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const waterGeo = pondGeometry(0);
    const water = new Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(pond.x, 0.02, pond.z);
    water.userData.pick = { kind: 'ground', id: 'pond' };
    const glintDisc = new Mesh(waterGeo, glintMat);
    glintDisc.rotation.x = -Math.PI / 2;
    glintDisc.position.set(pond.x, 0.025, pond.z);
    const shallowGeo = pondRingGeometry(-0.9, 0);
    const shallowMat = new MeshBasicMaterial({
      color: new Color(color(C.shallows)),
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const shallows = new Mesh(shallowGeo, shallowMat);
    shallows.rotation.x = -Math.PI / 2;
    shallows.position.set(pond.x, 0.028, pond.z);
    this.groveGroup.add(water, glintDisc, shallows);
    this.pickables.push(water);
    this.disposables.push(
      rimGeo,
      rimMat,
      waterGeo,
      waterMat,
      glintMat,
      shallowGeo,
      shallowMat,
      this.water,
      this.glint,
    );

    // The stream: ribbons from the waterfall pool into the pond and out to the edge.
    for (const points of [GROVE.river.inflow, GROVE.river.outflow]) {
      const bank = new Mesh(ribbon(points, GROVE.river.width + 0.8, 0.012), rimMat);
      const flow = new Mesh(ribbon(points, GROVE.river.width, 0.02), waterMat);
      const flowGlint = new Mesh(ribbon(points, GROVE.river.width, 0.025), glintMat);
      flow.userData.pick = { kind: 'ground', id: 'stream' };
      this.groveGroup.add(bank, flow, flowGlint);
      this.pickables.push(flow);
      this.disposables.push(bank.geometry, flow.geometry, flowGlint.geometry);
    }
    // A plank bridge where the path crosses the inflow.
    {
      const b = GROVE.bridge;
      const a0 = GROVE.river.inflow[1]!;
      const a1 = GROVE.river.inflow[2]!;
      const along = Math.atan2(a1.x - a0.x, a1.z - a0.z);
      const bridgeTex = makeBridgeTexture();
      const bridgeGeo = new PlaneGeometry(GROVE.river.width + 1.2, 2.2);
      const bridgeMat = new MeshLambertMaterial({ map: bridgeTex });
      const bridge = new Mesh(bridgeGeo, bridgeMat);
      bridge.rotation.x = -Math.PI / 2;
      bridge.rotation.z = along;
      bridge.position.set(b.x, 0.06, b.z);
      bridge.userData.pick = { kind: 'ground', id: 'bridge' };
      this.groveGroup.add(bridge);
      this.pickables.push(bridge);
      this.disposables.push(bridgeTex, bridgeGeo, bridgeMat);
    }

    // Hills: terraced plateaus, a cliff-face texture on the sides and grass on top.
    const hillTex = paintGrassTopTexture();
    const topMat = new MeshLambertMaterial({ map: hillTex });
    this.tintable.push(topMat);
    this.disposables.push(hillTex, topMat);
    const cliffTex = paintCliffTexture();
    const cliffMat = new MeshLambertMaterial({
      map: cliffTex,
      emissive: new Color(0xb0a8b8),
      emissiveMap: cliffTex,
      side: DoubleSide,
    });
    this.tintable.push(cliffMat);
    this.disposables.push(cliffTex, cliffMat);
    // The ramps (MOVE-09): a worn, sandier grass so the way up reads from afar.
    const rampMat = new MeshLambertMaterial({
      map: hillTex,
      color: new Color(0xe6d2a0),
      side: DoubleSide,
    });
    this.tintable.push(rampMat);
    this.disposables.push(rampMat);
    GROVE.hills.forEach((h, hi) => {
      // Two to five tiers, each a little smaller; the cliff tile repeats by circumference
      // so the rocks keep their size on big and small hills. The tiers and the ramp come
      // from the sim (MOVE-09), so the ground it stands on is the one drawn.
      const tiers = pixelTiers(h);
      tiers.forEach(([r, height, y0], ti) => {
        const salt = hi * 10 + ti;
        const side = terraceSide(r, height, salt);
        const sideMesh = new Mesh(side, cliffMat);
        sideMesh.position.set(h.x, y0, h.z);
        sideMesh.userData.pick = { kind: 'ground', id: 'hill' };
        const top = terraceTop(r, salt);
        const topMesh = new Mesh(top, topMat);
        topMesh.rotation.x = -Math.PI / 2;
        topMesh.position.set(h.x, y0 + height + 0.01, h.z);
        topMesh.userData.pick = { kind: 'ground', id: 'hill' };
        this.groveGroup.add(sideMesh, topMesh);
        this.pickables.push(sideMesh, topMesh);
        this.disposables.push(side, top);
      });
      const terrace = TERRACES[hi]!;
      terrace.ramp.forEach((_, li) => {
        const geo = rampGeometry(terrace, li);
        const ramp = new Mesh(geo, rampMat);
        ramp.position.set(h.x, 0, h.z);
        ramp.userData.pick = { kind: 'ground', id: 'hill' };
        this.groveGroup.add(ramp);
        this.pickables.push(ramp);
        this.disposables.push(geo);
      });
    });

    // Waterfall on the big hill: a vertical scrolling plane plus a splash pool.
    const wf = GROVE.waterfall;
    this.falls = paintWaterfallTexture();
    this.falls.repeat.set(1.5, wf.height / 1.5);
    const fallGeo = new PlaneGeometry(wf.width, wf.height);
    const fallMat = new MeshBasicMaterial({ map: this.falls });
    const fall = new Mesh(fallGeo, fallMat);
    fall.position.set(wf.x - 3.2, wf.height / 2 + 0.3, wf.z + 4.6);
    fall.rotation.y = Math.PI / 6;
    this.groveGroup.add(fall);
    const poolGeo = poolShape(1.6, 7);
    const poolMat = new MeshLambertMaterial({ color: new Color(0x8ad0f0) });
    const pool = new Mesh(poolGeo, poolMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(wf.x - 3.6, 0.015, wf.z + 5.6);
    this.groveGroup.add(pool);
    this.disposables.push(fallGeo, fallMat, this.falls, poolGeo, poolMat);

    // Fruit trees: a textured, tapered trunk with roots and a canopy of overlapping
    // leaf-textured lobes in two greens, so the crown reads as foliage with depth.
    const bark = makeBarkTexture(8, 16);
    const trunkGeo = new CylinderGeometry(0.3, 0.5, 2.2, 7);
    const trunkMat = new MeshLambertMaterial({ map: bark, flatShading: true });
    const rootGeo = new ConeGeometry(0.22, 0.7, 4);
    const leaves = makeLeafTexture(8, 3);
    const lobeGeo = new SphereGeometry(1, 8, 6);
    const lobeMat = new MeshLambertMaterial({ map: leaves, flatShading: true });
    const lobeDarkMat = new MeshLambertMaterial({
      map: leaves,
      color: new Color(color(C.leaf)),
      flatShading: true,
    });
    this.tintable.push(lobeMat, lobeDarkMat, trunkMat);
    const fruitGeo = new SphereGeometry(0.22, 6, 4);
    const fruitMat = new MeshLambertMaterial({ color: new Color(color(C.orange)) });
    this.disposables.push(
      bark,
      trunkGeo,
      trunkMat,
      rootGeo,
      leaves,
      lobeGeo,
      lobeMat,
      lobeDarkMat,
      fruitGeo,
      fruitMat,
    );
    // Trees are sprites now (render/scenery.ts); the lobe materials still dress the Hollow.

    // Foam ring on the pond edge, animated in update().
    const foamGeo = pondRingGeometry(-0.35, 0);
    const foamMat = new MeshBasicMaterial({
      color: new Color(color(C.skyLight)),
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    this.foam = new Mesh(foamGeo, foamMat);
    this.foam.rotation.x = -Math.PI / 2;
    this.foam.position.set(pond.x, 0.03, pond.z);
    this.groveGroup.add(this.foam);
    this.disposables.push(foamGeo, foamMat);

    // Lanterns: painted posts drawn by the view (tappable sprites); their light lives here.
    for (const { id, x, z } of LANTERN_POSTS) this.lanternSpots.push({ id, x, z });
    this.lanternLight = new PointLight(new Color(color(C.sunYellow)), 0, 14, 1.2);
    this.lanternLight.position.set(0, 2.5, 0);
    this.lanternLight.visible = false;
    this.lanternLight.intensity = 6;
    this.scene.add(this.lanternLight);

    // Bushes: two leaf-textured lobes each, and a few mossy rocks at the hill feet.
    const bushMat = new MeshLambertMaterial({
      map: leaves,
      color: new Color(color(C.forest)),
      flatShading: true,
    });
    this.tintable.push(bushMat);
    this.disposables.push(bushMat);
    // Bushes are sprites too (render/scenery.ts).
    // Rocks are painted sprites (render/scenery.ts); a flat tappable pad marks each for gathering.
    const rockPadGeo = new CircleGeometry(0.9, 8);
    const rockPadMat = new MeshBasicMaterial({ visible: false });
    this.disposables.push(rockPadGeo, rockPadMat);
    for (const [x, z] of [
      [-7, 9],
      [6, -9],
      [13, -5],
      [-13, 12],
    ] as const) {
      const pad = new Mesh(rockPadGeo, rockPadMat);
      pad.rotation.x = -Math.PI / 2;
      pad.position.set(x, 0.015, z);
      pad.userData.pick = { kind: 'ground', id: 'rock' };
      this.groveGroup.add(pad);
      this.pickables.push(pad);
    }
    // Lamps in the windows and by the doors, on at dusk; the view lifts sprites near them.
    for (const [x, z] of [
      [BUILDINGS.cottage!.x, BUILDINGS.cottage!.z + 1],
      [BUILDINGS.cottage!.x - 3.2, BUILDINGS.cottage!.z + 1.6],
      [BUILDINGS.dojo!.x, BUILDINGS.dojo!.z + 1.5],
      [BUILDINGS.school!.x, BUILDINGS.school!.z + 1.5],
    ] as const) {
      const lamp = new PointLight(new Color(color(C.sunLight)), 0, 11, 1.4);
      lamp.position.set(x, 1.6, z);
      lamp.visible = false;
      this.scene.add(lamp);
      this.lamps.push(lamp);
      this.lampSpots.push({ x, z, r: 7 });
    }

    this.scene.add(this.groveGroup, this.hollowGroup, this.corvinGroup, this.dungeonGroup);
    // The Hollow Below: a lamp that follows the Keeper and the torches nearest them.
    for (let i = 0; i < 6; i++) {
      const l = new PointLight(new Color(i === 0 ? color(C.sunLight) : '#ff9a3a'), 0, 9, 1.5);
      l.visible = false;
      this.dungeonGroup.add(l);
      this.dungeonLights.push(l);
    }
    this.dungeonGroup.visible = false;
    this.buildHollow(lobeGeo, leaves, bark);
    this.buildCorvin();
    this.dressings.build({
      scene: this.scene,
      groups: {
        grove: this.groveGroup,
        hollow: this.hollowGroup,
        corvin: this.corvinGroup,
        dungeon: this.dungeonGroup,
      },
      textures: { water: this.water, glint: this.glint, falls: this.falls },
      sprites,
      pickables: this.pickables,
      reduceMotion: () => this.holdStill,
      track: (d) => this.disposables.push(d),
      buildings: PIXEL_BUILDINGS,
      camera: { toScreen: (x, y, z) => toScreen(PIXEL_VIEW.camera, x, y, z) },
      safeRect,
    });
  }

  /**
   * The dressings' frame (render/dressings.ts): called from inside the WorldView's sprite
   * pass, so their billboards join the batch. `dt` is seconds.
   */
  dress(world: World, stage: SceneStage, dt: number): void {
    this.dressings.update(world, stage, this.daylight, dt);
  }

  /** The Hollow: a dark wood past the falls, a flat stone where the notebook waits. */
  private buildHollow(lobeGeo: SphereGeometry, leaves: Texture, bark: Texture): void {
    const dark = new MeshLambertMaterial({
      map: leaves,
      color: new Color(color(C.deepGreen)),
      flatShading: true,
    });
    const trunkMat = new MeshLambertMaterial({ map: bark, flatShading: true });
    const trunkGeo = new CylinderGeometry(0.35, 0.6, 3.2, 7);
    const stoneGeo = new BoxGeometry(2.4, 0.5, 1.8);
    const stoneMat = new MeshLambertMaterial({ color: new Color(color(C.greyLight)) });
    this.disposables.push(dark, trunkMat, trunkGeo, stoneGeo, stoneMat);
    const spots: Array<[number, number, number]> = [
      [-13, -13, 1.3],
      [-6, -13, 1.1],
      [1, -13, 1.4],
      [8, -12, 1.2],
      [13, -9, 1.3],
      [-13, -5, 1.2],
      [13, -2, 1.1],
      [-13, 3, 1.4],
      [13, 5, 1.2],
      [-12, 11, 1.1],
      [-5, 13, 1.3],
      [3, 13, 1.1],
      [10, 12, 1.4],
      [-8, -6, 1.0],
      [7, -6, 1.2],
      [-3, 8, 1.1],
      [9, 4, 1.0],
      [-9, 4, 1.2],
    ];
    spots.forEach(([x, z, s], i) => {
      const tree = new Object3D();
      tree.position.set(x, 0, z);
      const trunk = new Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.6;
      tree.add(trunk);
      for (const [dx, dy, dz, ls] of [
        [0, 3.6, 0, 1.7],
        [1.1, 3.0, 0.4, 1.1],
        [-1.0, 3.1, -0.4, 1.1],
        [0.2, 4.6, 0.3, 1.0],
      ] as const) {
        const lobe = new Mesh(lobeGeo, dark);
        lobe.position.set(dx, dy, dz);
        lobe.scale.set(ls * s, ls * s * 0.85, ls * s);
        tree.add(lobe);
      }
      tree.rotation.y = i * 0.9;
      this.hollowGroup.add(tree);
    });
    const stone = new Mesh(stoneGeo, stoneMat);
    stone.position.set(-9, 0.25, -9);
    stone.rotation.y = 0.4;
    this.hollowGroup.add(stone);
    this.hollowGroup.visible = false;
  }

  /** Corvin's garden: square pens of pale fence, nothing growing. */
  private buildCorvin(): void {
    const railGeo = new BoxGeometry(2, 0.12, 0.12);
    const postGeo = new BoxGeometry(0.16, 1.0, 0.16);
    const mat = new MeshLambertMaterial({ color: new Color(color(C.lilacGrey)) });
    this.disposables.push(railGeo, postGeo, mat);
    const pen = (x0: number, z0: number, w: number, d: number) => {
      const edge = (ax: number, az: number, bx: number, bz: number) => {
        const len = Math.hypot(bx - ax, bz - az);
        const n = Math.max(1, Math.round(len / 2));
        for (let i = 0; i <= n; i++) {
          const t = i / n;
          const post = new Mesh(postGeo, mat);
          post.position.set(ax + (bx - ax) * t, 0.5, az + (bz - az) * t);
          this.corvinGroup.add(post);
          if (i < n) {
            for (const y of [0.35, 0.8]) {
              const rail = new Mesh(railGeo, mat);
              rail.position.set(ax + (bx - ax) * (t + 0.5 / n), y, az + (bz - az) * (t + 0.5 / n));
              rail.rotation.y = Math.atan2(bx - ax, bz - az) + Math.PI / 2;
              rail.scale.x = len / n / 2;
              this.corvinGroup.add(rail);
            }
          }
        }
      };
      edge(x0, z0, x0 + w, z0);
      edge(x0, z0 + d, x0 + w, z0 + d);
      edge(x0, z0, x0, z0 + d);
      edge(x0 + w, z0, x0 + w, z0 + d);
    };
    pen(-10, -7.5, 20, 3);
    pen(-10, -4.5, 20, 3);
    pen(-10, -1.5, 20, 3);
    this.corvinGroup.visible = false;
  }

  /** Show the scenery of one place. */
  setLocation(location: Location): void {
    if (this.location === location) return;
    this.location = location;
    this.applyPlace();
    this.applyLight();
  }

  /** An exclusive stage (campaign graphics C3, C4): the place's own world is not drawn. */
  private bare = false;

  /** Hide the place's ground, scenery and water for an exclusive stage; false shows them. */
  setBare(bare: boolean): void {
    if (this.bare === bare) return;
    this.bare = bare;
    this.applyPlace();
  }

  private applyPlace(): void {
    const location = this.location;
    const shown = !this.bare;
    this.groveGroup.visible = shown && location === 'grove';
    this.hollowGroup.visible = shown && location === 'hollow';
    this.corvinGroup.visible = shown && location === 'corvin';
    this.dungeonGroup.visible = location === 'dungeon';
    if (this.ground) this.ground.visible = shown && location !== 'dungeon';
    if (this.skirt) this.skirt.visible = shown && location !== 'dungeon';
  }

  /**
   * Animate water, the waterfall, swaying canopies and the foam ring. `nowMs` is wall
   * time. With reduced motion everything holds still, as if at time zero.
   */
  update(wallMs: number, reduceMotion = false): void {
    this.holdStill = reduceMotion;
    const nowMs = reduceMotion ? 0 : wallMs;
    this.water.offset.set((nowMs / 7000) % 1, (nowMs / 10000) % 1);
    this.glint.offset.set((-nowMs / 5000) % 1, (nowMs / 12000) % 1);
    this.falls.offset.set(0, (-nowMs / 400) % 1);
    this.canopies.forEach((c, i) => {
      c.rotation.z = Math.sin(nowMs / 1400 + i * 1.7) * 0.03;
      c.rotation.x = Math.cos(nowMs / 1900 + i) * 0.02;
    });
    this.foam.material.opacity = 0.35 + 0.2 * Math.sin(nowMs / 700);
    this.foam.scale.setScalar(1 + 0.02 * Math.sin(nowMs / 900));
  }

  /**
   * The Sun and Moon Groves are recolours of the main Grove: a tint on the lit
   * materials, a different sky and light. Cheap, and every sprite stays the same.
   */
  setGrove(kind: GroveKind): void {
    if (this.groveKind === kind) return;
    this.groveKind = kind;
    const tint = kind === 'sun' ? color(C.cream) : kind === 'moon' ? color(C.lavender) : '#ffffff';
    for (const m of this.tintable) m.color.set(tint);
    this.applyLight();
  }

  private daylight: Daylight = daylightAt(12);

  /** Lanterns the player lit (campaign); they glow regardless of the hour. */
  setLit(ids: Set<string>): void {
    this.lit = ids;
    this.applyLight();
  }

  /** Time of day: sky, light rig and lanterns. The Grove kind layers on top. */
  setDaylight(
    d: Daylight,
    location: Location = this.location,
    weather: WeatherKind = this.weather,
  ): void {
    this.daylight = d;
    this.location = location;
    this.weather = weather;
    this.applyPlace();
    this.applyLight();
  }

  private applyLight(): void {
    const d = this.daylight;
    const kind = this.groveKind;
    // A gradient sky per phase (cached), with clouds by day.
    const key =
      this.location === 'hollow' || this.location === 'dungeon'
        ? 'night'
        : kind === 'sun' && d.phase === 'day'
          ? 'sun'
          : kind === 'moon' && d.phase === 'day'
            ? 'moon'
            : d.phase;
    let sky = this.skies.get(key);
    if (!sky) {
      const [top, bottom, clouds] = SKY_GRADIENTS[key] ?? SKY_GRADIENTS.day!;
      sky = makeSkyTexture(top, bottom, clouds);
      this.skies.set(key, sky);
      this.disposables.push(sky);
    }
    this.scene.background = sky;
    const place = this.location;
    const rain = this.weather === 'rain' ? 0.75 : this.weather === 'snow' ? 1.1 : 1;
    // Exposure for the sRGB output: full lift by day, easing to the night value with darkness.
    const gain =
      PIXEL_LIGHT.dayGain + ((PIXEL_LIGHT.nightGain - PIXEL_LIGHT.dayGain) * d.darkness) / 0.7;
    this.hemi.intensity =
      gain *
      d.hemiIntensity *
      (kind === 'moon' ? 0.85 : 1) *
      (place === 'hollow' ? 0.45 : place === 'dungeon' ? 1.5 : 1) *
      rain;
    if (this.groundMat) {
      this.groundMat.color.set(
        place === 'hollow'
          ? color(C.deepGreen)
          : place === 'corvin'
            ? color(C.lilacGrey)
            : this.weather === 'snow'
              ? color(C.pale)
              : kind === 'sun'
                ? color(C.cream)
                : kind === 'moon'
                  ? color(C.lavender)
                  : '#ffffff',
      );
    }
    this.hemi.color.set(
      place === 'dungeon'
        ? DUNGEON.caveAmbient
        : kind === 'moon' && d.phase === 'day'
          ? color(C.violet)
          : d.hemiColor,
    );
    this.sun.intensity =
      gain *
      d.sunIntensity *
      (kind === 'sun' ? 1.3 : 1) *
      (place === 'hollow' ? 0.4 : place === 'dungeon' ? 0.1 : rain);
    this.sun.color.set(d.sunColor);
    this.lanternLight.visible = (d.lanterns || this.lit.size > 0) && place !== 'dungeon';
    this.lampsOn = d.lanterns;
    this.duskLanterns = d.lanterns;
    for (const lamp of this.lamps) {
      lamp.visible = d.lanterns && place !== 'dungeon';
      lamp.intensity = 5 * d.darkness;
    }
  }

  /**
   * Build (or clear) the Hollow floor: a painted plane, rock blocks where the walls
   * meet the floor (tops carry the same painting, faces the cliff texture), and the
   * lights parked until `updateDungeonLights` places them.
   */
  setDungeon(floor: Floor | null, depth = 1): void {
    for (const p of this.dungeonParts) p.dispose();
    this.dungeonParts = [];
    for (const o of this.dungeonPickables) {
      this.dungeonGroup.remove(o);
      const i = this.pickables.indexOf(o);
      if (i >= 0) this.pickables.splice(i, 1);
    }
    this.dungeonPickables = [];
    for (const child of [...this.dungeonGroup.children]) {
      if (!(child instanceof PointLight)) this.dungeonGroup.remove(child);
    }
    this.dungeonTorches = [];
    if (!floor) return;
    const { w, h } = floorWorldSize(floor);
    const tex = paintFloorTexture(floor, depth);
    const mat = new MeshLambertMaterial({ map: tex });
    const geo = new PlaneGeometry(w, h, 1, 1);
    const plane = new Mesh(geo, mat);
    plane.rotation.x = -Math.PI / 2;
    plane.userData.pick = { kind: 'ground', id: 'ground' };
    this.dungeonGroup.add(plane);
    this.pickables.push(plane);
    this.dungeonPickables.push(plane);
    this.dungeonParts.push(tex, mat, geo);
    // Walls (item 37): every rock cell within two of the floor gets a tall block, its top
    // carrying the floor painting and its faces the strata texture. A vista's cells stay low:
    // a lip beside the floor and a chasm beyond it.
    const cell = DUNGEON.cell;
    const wallH = PX.wallH;
    const vista = vistaCells(floor);
    const heightOf = (cx: number, cy: number): number => {
      const v = vista.get(cy * floor.cols + cx);
      return v ? (v.d === 1 ? PX.vistaLip : PX.vistaSink) : wallH;
    };
    const tops: number[] = [];
    const topUv: number[] = [];
    const sides: number[] = [];
    const sideUv: number[] = [];
    const sideN: number[] = [];
    const nearFloor = (cx: number, cy: number) => {
      for (let dy = -2; dy <= 2; dy++)
        for (let dx = -2; dx <= 2; dx++) if (cellAt(floor, cx + dx, cy + dy) !== WALL) return true;
      return false;
    };
    for (let cy = 0; cy < floor.rows; cy++) {
      for (let cx = 0; cx < floor.cols; cx++) {
        if (cellAt(floor, cx, cy) !== WALL) continue;
        const top = heightOf(cx, cy);
        if (!vista.has(cy * floor.cols + cx) && !nearFloor(cx, cy)) continue;
        const x0 = (cx - floor.cols / 2) * cell;
        const z0 = (cy - floor.rows / 2) * cell;
        const x1 = x0 + cell;
        const z1 = z0 + cell;
        const u0 = (x0 + w / 2) / w;
        const u1 = (x1 + w / 2) / w;
        const tv0 = 1 - (z0 + h / 2) / h;
        const tv1 = 1 - (z1 + h / 2) / h;
        const tp: Array<[number, number, number]> = [
          [x0, top, z0],
          [x0, top, z1],
          [x1, top, z1],
          [x1, top, z0],
        ];
        const tt: Array<[number, number]> = [
          [u0, tv0],
          [u0, tv1],
          [u1, tv1],
          [u1, tv0],
        ];
        for (const i of [0, 1, 2, 0, 2, 3]) {
          tops.push(...tp[i]!);
          topUv.push(...tt[i]!);
        }
        // Faces: toward open ground from the floor up; toward a lower wall cell from its top.
        const faces: Array<[number, number, [number, number, number]]> = [
          [0, 1, [0, 0, 1]],
          [0, -1, [0, 0, -1]],
          [1, 0, [1, 0, 0]],
          [-1, 0, [-1, 0, 0]],
        ];
        for (const [dx, dy, n] of faces) {
          const nx = cx + dx;
          const ny = cy + dy;
          const open = cellAt(floor, nx, ny) !== WALL;
          const low = open
            ? 0
            : nx < 0 || ny < 0 || nx >= floor.cols || ny >= floor.rows
              ? top
              : heightOf(nx, ny);
          if (low >= top) continue;
          // The face's corners: along the edge, then bottom and top.
          const [ax0, az0, ax1, az1] =
            dy === 1
              ? [x0, z1, x1, z1]
              : dy === -1
                ? [x1, z0, x0, z0]
                : dx === 1
                  ? [x1, z1, x1, z0]
                  : [x0, z0, x0, z1];
          const p: Array<[number, number, number]> = [
            [ax0, low, az0],
            [ax1, low, az1],
            [ax1, top, az1],
            [ax0, top, az0],
          ];
          const along = (q: [number, number, number]) => (dx === 0 ? q[0] : q[2]) / PX.faceUnitsW;
          for (const i of [0, 1, 2, 0, 2, 3]) {
            const q = p[i]!;
            sides.push(...q);
            // The top row of the texture is the top of the wall, wherever the wall ends.
            sideUv.push(along(q), 1 - (top - q[1]) / wallH);
            sideN.push(...n);
          }
        }
      }
    }
    const topMat = new MeshLambertMaterial({
      map: tex,
      emissive: new Color(0x34344a),
      emissiveMap: tex,
    });
    this.patchCaveCut(topMat);
    const topGeo = new BufferGeometry();
    topGeo.setAttribute('position', new Float32BufferAttribute(tops, 3));
    topGeo.setAttribute('uv', new Float32BufferAttribute(topUv, 2));
    topGeo.computeVertexNormals();
    const topMesh = new Mesh(topGeo, topMat);
    this.dungeonGroup.add(topMesh);
    // The strata face of this depth band's rock, kept readable by a little emissive.
    const faceTex = paintCaveWallTexture(depth);
    const faceMat = new MeshLambertMaterial({
      map: faceTex,
      color: new Color('#ffffff'),
      emissive: new Color(0x403848),
      emissiveMap: faceTex,
      side: DoubleSide,
    });
    this.patchCaveCut(faceMat);
    const sideGeo = new BufferGeometry();
    sideGeo.setAttribute('position', new Float32BufferAttribute(sides, 3));
    sideGeo.setAttribute('uv', new Float32BufferAttribute(sideUv, 2));
    sideGeo.setAttribute('normal', new Float32BufferAttribute(sideN, 3));
    const sideMesh = new Mesh(sideGeo, faceMat);
    this.dungeonGroup.add(sideMesh);
    this.dungeonParts.push(topGeo, topMat, faceTex, faceMat, sideGeo);
    this.dungeonTorches = floor.torches.map((t) => ({
      x: (t.x + 0.5 - floor.cols / 2) * cell,
      z: (t.y + 0.1 - floor.rows / 2) * cell,
    }));
  }

  /**
   * Walls between the camera and the Keeper sink to `cutHeight` of their height (item 37), in
   * the vertex shader: one shared strip, so the party and the Keeper stay in sight and the
   * walls cost no extra draw calls. Heights above the ground only; a chasm stays put.
   */
  private patchCaveCut(m: MeshLambertMaterial): void {
    const u = this.caveCut;
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uCutKeeper = u.keeper;
      sh.uniforms.uCutDir = u.dir;
      sh.uniforms.uCutP = u.params;
      sh.vertexShader = sh.vertexShader
        .replace(
          '#include <common>',
          '#include <common>\nuniform vec2 uCutKeeper;\nuniform vec2 uCutDir;\nuniform vec4 uCutP;',
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
          if (transformed.y > 0.0) {
            vec2 rel = position.xz - uCutKeeper;
            float along = dot(rel, uCutDir);
            float lat = abs(dot(rel, vec2(-uCutDir.y, uCutDir.x)));
            float k = smoothstep(-0.2, 1.0, along)
              * (1.0 - smoothstep(uCutP.z - 1.5, uCutP.z, along))
              * (1.0 - smoothstep(uCutP.x * 0.5, uCutP.x * 0.5 + uCutP.y, lat));
            transformed.y *= mix(1.0, uCutP.w, k);
          }`,
        );
    };
    m.customProgramCacheKey = () => 'caveCut';
  }

  /** The Keeper's lamp and the five torches nearest them, every frame underground. */
  updateDungeonLights(keeper: { x: number; z: number }, yaw = 0): void {
    this.caveCut.keeper.value.set(keeper.x, keeper.z);
    this.caveCut.dir.value.set(Math.sin(yaw), Math.cos(yaw));
    const lamp = this.dungeonLights[0];
    if (!lamp) return;
    lamp.visible = true;
    lamp.intensity = 7;
    lamp.position.set(keeper.x, 1.3, keeper.z);
    const near = [...this.dungeonTorches]
      .sort(
        (a, b) =>
          Math.hypot(a.x - keeper.x, a.z - keeper.z) - Math.hypot(b.x - keeper.x, b.z - keeper.z),
      )
      .slice(0, this.dungeonLights.length - 1);
    for (let i = 1; i < this.dungeonLights.length; i++) {
      const l = this.dungeonLights[i]!;
      const t = near[i - 1];
      l.visible = !!t;
      if (t) {
        l.position.set(t.x, PX.sconceY - 0.2, t.z);
        l.intensity = 4 + (this.holdStill ? 0 : Math.sin(performance.now() / 90 + i * 1.7) * 0.6);
      }
    }
  }

  dispose(): void {
    this.dressings.dispose();
    for (const d of this.disposables) d.dispose();
    for (const p of this.dungeonParts) p.dispose();
    this.groundWorker?.terminate();
    this.groundWorker = null;
  }
}

/**
 * A small tile of dark undergrowth for the ground past the field's edge: deep leaf with
 * forest and leaf-light flecks, from a fixed hash so it never shimmers between loads.
 */
function makeSkirtTexture(): CanvasTexture {
  const n = 24;
  const canvas = document.createElement('canvas');
  canvas.width = n;
  canvas.height = n;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color(C.leafDeep);
  ctx.fillRect(0, 0, n, n);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      const f = h - Math.floor(h);
      if (f < 0.28) ctx.fillStyle = color(C.forest);
      else if (f > 0.96) ctx.fillStyle = color(C.leaf);
      else continue;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  const tex = new CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.magFilter = tex.minFilter = NearestFilter;
  return tex;
}
