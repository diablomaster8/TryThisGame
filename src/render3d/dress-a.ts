import * as THREE from 'three';
import { CG_A, CG2_X } from '../config/tuning';
import { markAt } from '../config/stage-marks';
import { SceneStager } from '../render/scene-stage';
import { NIGHT_RIM } from '../samples/creatures';
import type { SceneStage } from '../config/story';
import type { Daylight } from '../render/daylight';
import type { Vec2, World } from '../sim/types';
import { OCCLUDE, occludable } from './building-kit';
import type { Dress3dCtx, Dressing3d } from './dressings';
import { groveHeight } from './terrain-shape';

/**
 * Campaign-graphics package a, "Light and grade", in Full 3D (see the registry contract at
 * the top of render3d/dressings.ts). The night fill itself is in `sky.ts` and the Sun and
 * Moon hue shift in `finish-pass.ts`; this dressing drives the per-frame parts:
 *
 * - C3: the cool night rim on creatures and Keepers (`NIGHT_RIM`), and the story key, one
 *   borrowed lamp-pool light over the framed speakers while a scene is staged after dark.
 *   The story sets (the Hollow camp, Corvin's garden) get a floor under their fill.
 * - M8: lit window and lantern glass scaled past the bloom threshold, so windows glow by
 *   emissive and bloom; the pool still lights only the nearest few.
 * - H9: the framed points handed to the building shader (`OCCLUDE`), which dithers out a
 *   wall standing between the camera and a speaker, and the boxes of any building that
 *   stands in front of them and fills a large share of the frame, which thins whole.
 * - M16: a skyline ring at the fog's edge, three layers of painted hill and treeline in one
 *   draw, with a few lit windows (a second draw) after dark.
 *
 * Nothing here moves on its own, so reduced motion needs no other form.
 */

/** A tileable strip of hills topped with a treeline, white on clear, for the ring. */
function skylineTexture(): THREE.CanvasTexture {
  const W = 2048;
  const H = 256;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const g = cv.getContext('2d')!;
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  // Rolling hills: whole periods across the strip, so it tiles round the ring.
  const hill = (x: number) => {
    const t = (x / W) * Math.PI * 2;
    return (
      0.58 + 0.1 * Math.sin(t * 3 + 0.4) + 0.06 * Math.sin(t * 7 + 1.3) + 0.03 * Math.sin(t * 17)
    );
  };
  const grad = g.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(1, '#b8b8b8');
  g.fillStyle = grad;
  g.beginPath();
  g.moveTo(0, H);
  for (let x = 0; x <= W; x += 8) g.lineTo(x, H * (1 - hill(x)));
  g.lineTo(W, H);
  g.closePath();
  g.fill();
  // The treeline: round crowns and a few firs along the hill tops, drawn across the seam.
  for (let i = 0; i < 150; i++) {
    const x = rnd() * W;
    const top = H * (1 - hill(x));
    const r = 6 + rnd() * 12;
    for (const dx of [-W, 0, W]) {
      g.fillStyle = rnd() < 0.5 ? '#f2f2f2' : '#dcdcdc';
      g.beginPath();
      if (rnd() < 0.3) {
        g.moveTo(x + dx - r * 0.7, top + 4);
        g.lineTo(x + dx, top - r * 2.4);
        g.lineTo(x + dx + r * 0.7, top + 4);
      } else g.arc(x + dx, top - r * 0.6, r, 0, Math.PI * 2);
      g.fill();
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const SEGMENTS = 72;

/**
 * H10: a mesh the occluder must leave alone: a ground-hugging card or slab (light spills,
 * the well's water, a step; under 0.35 tall over its whole box), or a shadow-only proxy
 * (drawn with no colour, or a material switched off).
 */
/** The well's dark water colour (props.ts). */
const WELL_WATER = 0x0d1a2a;

/** Ground flag for pieces that belong to a house only (none of them is ground). */
const HOUSE_ONLY = { value: 0 };

function flatOrHidden(mesh: THREE.Mesh): boolean {
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  if (mats.every((m) => !m.visible || !m.colorWrite)) return true;
  const box = new THREE.Box3().setFromObject(mesh);
  return !box.isEmpty() && box.max.y - box.min.y < 0.35;
}

/**
 * The framed people only (the Keeper first, always; speakers and cast in the focus): a focus mark such
 * as a house's door is framed by the camera but is no one to cut a window to, and its own
 * house must not hide for it.
 */
function people(stager: SceneStager, world: World): Vec2[] {
  const marks = (stager.focusNow() ?? [])
    .map((n) => markAt(world.location, n))
    .filter((m): m is NonNullable<typeof m> => m !== null && m !== undefined);
  return stager
    .frame(world)
    .filter((p, i) => i === 0 || !marks.some((m) => Math.hypot(m.x - p.x, m.z - p.z) < 0.01));
}

/**
 * C9: the names a staged scene is about, its place, its shot's focus and the props it
 * sets; a building or tagged piece named here never thins. The step is the cottage's.
 */
export function subjectsOf(stage: SceneStage): ReadonlySet<string> {
  const out = new Set<string>(stage.shot?.focus ?? []);
  if (stage.place) out.add(stage.place);
  if (stage.place === 'step') out.add('cottage');
  for (const k of Object.keys(stage.props ?? {})) out.add(k);
  return out;
}

/** Whether `o` and every parent are visible (drawn this frame, if in view). */
function shown(o: THREE.Object3D | null): boolean {
  for (; o; o = o.parent) if (!o.visible) return false;
  return true;
}

/** The three layers as one open band of quads, each with its own turn and repeat. */
function skylineRing(): { mesh: THREE.Mesh; colors: THREE.BufferAttribute } {
  const s = CG_A.skyline;
  const pos: number[] = [];
  const uv: number[] = [];
  const index: number[] = [];
  s.radii.forEach((r, layer) => {
    const base = pos.length / 3;
    const h = s.heights[layer]!;
    // Whole repeats round the ring that keep the strip's 8:1 shape, so crowns stay round.
    const repeat = Math.max(1, Math.round((Math.PI * 2 * r) / (8 * h)));
    const turn = layer * 1.7;
    for (let j = 0; j <= SEGMENTS; j++) {
      const a = (j / SEGMENTS) * Math.PI * 2 + turn;
      const x = Math.sin(a) * r;
      const z = Math.cos(a) * r;
      pos.push(x, s.base, z, x, s.base + h, z);
      const u = (j / SEGMENTS) * repeat;
      uv.push(u, 0, u, 1);
    }
    for (let j = 0; j < SEGMENTS; j++) {
      const a = base + j * 2;
      index.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
    }
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  const colors = new THREE.Float32BufferAttribute(new Float32Array(pos.length), 3);
  geo.setAttribute('color', colors);
  geo.setIndex(index);
  const mat = new THREE.MeshBasicMaterial({
    map: skylineTexture(),
    vertexColors: true,
    alphaTest: 0.5,
    side: THREE.DoubleSide,
    fog: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'skyline-ring';
  mesh.frustumCulled = false;
  mesh.renderOrder = -1;
  return { mesh, colors };
}

/** Small lit windows low on the nearest layer's hills, facing the Grove (one mesh). */
function skylineWindows(): THREE.Mesh {
  const s = CG_A.skyline;
  const r = s.radii[0] - 0.6;
  const geos: THREE.BufferGeometry[] = [];
  for (let i = 0; i < s.windows; i++) {
    const a = (i / s.windows) * Math.PI * 2 + Math.sin(i * 12.9898) * 0.18;
    const q = new THREE.PlaneGeometry(0.9, 0.7);
    q.rotateY(a + Math.PI);
    q.translate(
      Math.sin(a) * r,
      s.base + s.heights[0] * (0.3 + 0.05 * Math.sin(i * 4.1)),
      Math.cos(a) * r,
    );
    geos.push(q);
  }
  const pos: number[] = [];
  for (const q of geos) {
    const p = q.toNonIndexed().attributes.position!;
    for (let k = 0; k < p.count; k++) pos.push(p.getX(k), p.getY(k), p.getZ(k));
    q.dispose();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(s.windowColor).multiplyScalar(s.windowGlow),
    side: THREE.DoubleSide,
    fog: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'skyline-windows';
  mesh.frustumCulled = false;
  mesh.visible = false;
  return mesh;
}

class LightAndGrade implements Dressing3d {
  readonly id = 'a';
  private ctx: Dress3dCtx | null = null;
  private readonly stager = new SceneStager();
  private camera: THREE.Camera | null = null;
  private ring: { mesh: THREE.Mesh; colors: THREE.BufferAttribute } | null = null;
  private windows: THREE.Mesh | null = null;
  private readonly glass = new Set<THREE.Material>();
  private readonly tint = new THREE.Color();
  private readonly fogColor = new THREE.Color();
  private lastTint = '';
  /** The buildings' own copy of the outline hull (H9), shown and hidden with the shared one. */
  private hull: { base: THREE.Material; mat: THREE.Material } | null = null;
  /** The sky's fill light, held up on the story sets (C3). */
  private hemi: THREE.HemisphereLight | null = null;
  /** Each building's box (its walls grown to take in the roof), for H9's whole-building fade. */
  private readonly buildings = new Map<THREE.Object3D, THREE.Box3>();
  /** Materials already hooked into the H9 fade (cards, water, story-set crowns). */
  private readonly patched = new WeakSet<THREE.Material>();
  private discovered = false;
  /** Frames until the scene's second look for buildings (0: none due). */
  private again = 0;
  private readonly corner = new THREE.Vector3();
  private readonly ray = new THREE.Ray();

  build(ctx: Dress3dCtx): void {
    this.ctx = ctx;
    // The camera the Grove is drawn with: the scene's own pre-render hook hands it over.
    const prev = ctx.scene.onBeforeRender.bind(ctx.scene);
    ctx.scene.onBeforeRender = (...args) => {
      if ((args[2] as THREE.PerspectiveCamera).isPerspectiveCamera) this.camera = args[2];
      prev(...args);
    };
    // M8: the lit glass (window panes, lantern boxes share one warm emissive) is pushed
    // past the bloom threshold once; the scene still switches it on and off.
    ctx.scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (!m || Array.isArray(m) || !m.emissive || this.glass.has(m)) return;
      if (m.emissive.getHex() !== 0xffb347) return;
      m.emissive.multiplyScalar(CG_A.glassGlow);
      this.glass.add(m);
    });
    this.hulls(ctx);
    ctx.scene.traverse((o) => {
      if ((o as THREE.HemisphereLight).isHemisphereLight) this.hemi = o as THREE.HemisphereLight;
    });
    // C3: the Hollow camp's grass floor (the story sets' wide plane) is painted lighter, so
    // the camp's ground reads without a fill strong enough to flare the pale eggs.
    for (const o of ctx.pickables) {
      const mesh = o as THREE.Mesh;
      const geo = mesh.geometry as THREE.PlaneGeometry | undefined;
      const pick = o.userData.pick as { id?: string } | undefined;
      if (pick?.id !== 'ground' || geo?.type !== 'PlaneGeometry') continue;
      if (geo.parameters.width < 100) continue;
      (mesh.material as THREE.MeshStandardMaterial).color.multiplyScalar(
        CG_A.storyFloor.hollowGround,
      );
    }
    this.ring = skylineRing();
    this.windows = skylineWindows();
    // On the scene, not the home Grove's group: Corvin's garden and a neighbour's Grove
    // have the same open edge. Hidden underground (`update`).
    ctx.scene.add(this.ring.mesh, this.windows);
    void ctx.compile(this.ring.mesh);
    void ctx.compile(this.windows);
  }

  update(world: World, stage: SceneStage, daylight: Daylight): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const night = THREE.MathUtils.smoothstep(
      daylight.darkness,
      CG_A.nightRim.from,
      CG_A.nightRim.full,
    );
    NIGHT_RIM.value = CG_A.nightRim.strength * night;
    if (this.hull) this.hull.mat.visible = this.hull.base.visible;
    this.skyline(night, ctx, world.location !== 'dungeon' && world.location !== 'hollow');
    this.storyFloor(world.location, ctx, night);

    // The framed points of a staged scene: the Keeper first, then the speakers.
    // Other dressings build a scene's houses in their own update, after this one: look
    // again a few frames into each scene.
    if (this.stager.update(world) || !this.discovered) {
      this.discover(ctx);
      this.again = 3;
    } else if (this.again > 0 && --this.again === 0) this.discover(ctx);
    const home = world.location === 'grove';
    const groundAt = (p: Vec2) => (home ? groveHeight(p.x, p.z) : 0);
    const points = this.stager.active ? people(this.stager, world).slice(0, 3) : [];
    const occ = CG_A.occlude;
    OCCLUDE.on.value = points.length > 0 ? 1 : 0;
    OCCLUDE.radius.value = CG2_X.occlude.radius;
    OCCLUDE.keep.value = occ.keep;
    OCCLUDE.margin.value = occ.margin;
    // Campaign graphics 2 (H10, H14): low and flat pieces are never cut, the cut round a
    // subject is a clean round window, and in a staged scene anything right by the lens goes.
    const x = CG2_X.occlude;
    OCCLUDE.nearCam.value = points.length > 0 ? Math.max(occ.nearCam, x.nearCam) : 0;
    OCCLUDE.ground.value = points.length > 0 ? Math.min(...points.map(groundAt)) + x.ground : -1e9;
    OCCLUDE.points.value.forEach((v, i) => {
      const p = points[i];
      if (p) v.set(p.x, groundAt(p) + occ.height, p.z, 1);
      else v.set(0, 0, 0, 0);
    });
    OCCLUDE.boxes.value = this.blockers(
      points.map((p) => new THREE.Vector3(p.x, groundAt(p), p.z)),
      subjectsOf(stage),
    );

    // C3's story key: soft and shadowless (pool lights cast none), over the speakers and
    // pulled toward the camera so it falls on faces.
    if (points.length > 0 && ctx.lampsOn()) {
      const cx = points.reduce((a, p) => a + p.x, 0) / points.length;
      const cz = points.reduce((a, p) => a + p.z, 0) / points.length;
      const k = CG_A.storyKey;
      let dx = 0;
      let dz = 0;
      if (this.camera) {
        dx = this.camera.position.x - cx;
        dz = this.camera.position.z - cz;
        const len = Math.hypot(dx, dz) || 1;
        dx = (dx / len) * k.toward;
        dz = (dz / len) * k.toward;
      }
      const x = cx + dx;
      const z = cz + dz;
      ctx.lamps.push({
        x,
        y: groundAt({ x, z }) + k.lift,
        z,
        color: k.color,
        intensity: k.intensity,
        distance: k.distance,
        decay: k.decay,
      });
    }
  }

  /**
   * H9's building hiding (reworked by campaign graphics 2, H10 and H14): a building drawn
   * this frame is hidden outright above its foot when it stands on a sight line from the
   * camera to a framed subject (feet, middle or head) before that subject, when its box
   * comes within `nearHide` of the lens, or, nearer the lens than every subject, when the
   * frame's bottom or side edge cuts it or it covers `fill` of the frame. A building the scene is
   * about never hides. Its glass, lamp and spill cards sit in the same box and go with it.
   * Four at most; returns how many.
   */
  private blockers(feet: THREE.Vector3[], subjects: ReadonlySet<string>): number {
    const cam = this.camera;
    if (!cam || feet.length === 0) return 0;
    const occ = CG_A.occlude;
    const x = CG2_X.occlude;
    const sights: { to: THREE.Vector3; dist: number }[] = [];
    for (const f of feet)
      for (const up of [0.3, occ.subjectHeight * 0.5, occ.subjectHeight]) {
        const to = new THREE.Vector3(f.x, f.y + up, f.z);
        sights.push({ to, dist: to.distanceTo(cam.position) });
      }
    const nearest = Math.min(...sights.map((s) => s.dist));
    const found: { box: THREE.Box3; rank: number }[] = [];
    for (const [o, box] of this.buildings) {
      if (!shown(o)) continue;
      const id = (o.userData.pick as { id?: string } | undefined)?.id;
      if (id && subjects.has(id)) continue;
      const blocks = sights.some((s) => {
        this.ray.origin.copy(cam.position);
        this.ray.direction.copy(s.to).sub(cam.position).normalize();
        const hit = this.ray.intersectBox(box, this.corner);
        return hit !== null && hit.distanceTo(cam.position) < s.dist - occ.margin;
      });
      const near = box.distanceToPoint(cam.position);
      let rank = blocks ? 0 : near < x.nearHide ? 1 : -1;
      if (rank < 0 && near < nearest - occ.margin && this.crowds(box, cam)) rank = 2;
      if (rank >= 0) found.push({ box, rank: rank * 1000 + near });
    }
    found.sort((a, b) => a.rank - b.rank);
    let n = 0;
    for (const { box } of found) {
      if (n >= OCCLUDE.boxMin.value.length) break;
      OCCLUDE.boxMin.value[n]!.copy(box.min);
      OCCLUDE.boxMin.value[n]!.y += x.floor;
      OCCLUDE.boxMax.value[n]!.copy(box.max);
      n++;
    }
    return n;
  }

  /** Whether a box is cut by the frame's bottom or side edges, or covers `fill` of the frame. */
  private crowds(box: THREE.Box3, cam: THREE.Camera): boolean {
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (let i = 0; i < 8; i++) {
      const c = this.corner.set(
        i & 1 ? box.max.x : box.min.x,
        i & 2 ? box.max.y : box.min.y,
        i & 4 ? box.max.z : box.min.z,
      );
      c.project(cam);
      if (c.z > 1) return false;
      x0 = Math.min(x0, c.x);
      x1 = Math.max(x1, c.x);
      y0 = Math.min(y0, c.y);
      y1 = Math.max(y1, c.y);
    }
    // Wholly off screen: nothing to clear.
    if (x1 < -1 || x0 > 1 || y1 < -1 || y0 > 1) return false;
    const w = Math.min(1, x1) - Math.max(-1, x0);
    const h = Math.min(1, y1) - Math.max(-1, y0);
    // Cut by the bottom or a side edge (campaign graphics 3: a roof cut by the left edge
    // read as a giant fragment), or filling the frame.
    return y0 < -1 || x0 < -1 || x1 > 1 || (w * h) / 4 > CG2_X.occlude.fill;
  }

  /**
   * H9: a building's outline hull would show black where its wall is cut or hidden, so the
   * buildings' hulls take a copy of the shared hull material that is cut with them. Run at
   * build and again on each discovery: story houses built later have hulls too.
   */
  private hulls(ctx: Dress3dCtx): void {
    ctx.scene.traverse((o) => {
      const parent = o.parent as THREE.Mesh | null;
      const host = parent?.material as THREE.Material | undefined;
      if (!o.userData.hull || !host || Array.isArray(host)) return;
      if (!host.customProgramCacheKey().startsWith('building-toon')) return;
      const hull = o as THREE.Mesh;
      const base = hull.material as THREE.Material;
      if (this.hull && base === this.hull.mat) return;
      if (!this.hull) {
        const m = base.clone();
        m.onBeforeCompile = (shader, renderer) => {
          base.onBeforeCompile(shader, renderer);
          occludable(shader);
        };
        m.customProgramCacheKey = () => `${base.customProgramCacheKey()}|occ`;
        this.hull = { base, mat: m };
      }
      if (base === this.hull.base) hull.material = this.hull.mat;
    });
  }

  /**
   * Find what the fade needs, once and again when a scene begins (other packages build
   * their sets after this dressing): every `building` pickable's box, and the materials
   * that must thin with a building (warm glass and lamp cards, additive light spills, the
   * well's dark water) or on their own (the story sets' instanced crowns and trunks).
   */
  private discover(ctx: Dress3dCtx): void {
    this.discovered = true;
    for (const o of ctx.pickables) {
      const pick = o.userData.pick as { kind?: string } | undefined;
      if (pick?.kind !== 'building' || this.buildings.has(o)) continue;
      this.addBuilding(o);
    }
    // Every house the kit built, tappable or not (the crest houses, the Fold's extras).
    ctx.scene.traverse((o) => {
      if (o.userData.house && !this.buildings.has(o)) this.addBuilding(o);
    });
    this.patch(ctx);
    this.hulls(ctx);
  }

  /** A building's box: its walls grown by the eaves and up to the roof's ridge. */
  private addBuilding(o: THREE.Object3D): void {
    const occ = CG_A.occlude;
    // A house built this frame may not have its parents' matrices yet.
    o.updateWorldMatrix(true, false);
    const box = new THREE.Box3().setFromObject(o);
    // Empty, or a whole street in one pick: not one building to hide.
    if (box.isEmpty() || Math.max(box.max.x - box.min.x, box.max.z - box.min.z) > 16) return;
    box.min.x -= occ.eaves;
    box.min.z -= occ.eaves;
    box.max.x += occ.eaves;
    box.max.z += occ.eaves;
    box.max.y += occ.roof;
    this.buildings.set(o, box);
  }

  /** Hook the materials that must go with a building (cards) or on their own (crowns). */
  private patch(ctx: Dress3dCtx): void {
    ctx.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || o.userData.hull) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      // The well's dark water is flat, but must go with the well (campaign graphics 3).
      const water = mats.some(
        (m) => (m as THREE.MeshStandardMaterial).color?.getHex?.() === WELL_WATER,
      );
      if (!water && flatOrHidden(mesh)) return;
      const geo = mesh.geometry.type;
      const crown =
        (mesh as THREE.InstancedMesh).isInstancedMesh &&
        (geo === 'IcosahedronGeometry' || geo === 'CylinderGeometry');
      for (const m of mats) {
        if (this.patched.has(m) || (m as THREE.ShaderMaterial).isShaderMaterial) continue;
        const key = m.customProgramCacheKey();
        if (key.startsWith('building-toon') || key.startsWith('toon|')) continue;
        const s = m as THREE.MeshStandardMaterial;
        const card =
          mesh.name === 'light-spills' ||
          m.blending === THREE.AdditiveBlending ||
          (s.emissive !== undefined && s.emissive.getHex() !== 0) ||
          (s.color !== undefined && s.color.getHex() === WELL_WATER);
        // The Fold's rubble, mending and wreaths (package k) go with the house they dress.
        const kit = /^k-(fold-|wreaths)/.test(mesh.name);
        const rubble = /^k-fold-ruin-/.test(mesh.name);
        if ((!card || s.vertexColors) && !crown && !kit) continue;
        this.patched.add(m);
        const prevHook = m.onBeforeCompile.bind(m);
        m.onBeforeCompile = (shader, renderer) => {
          prevHook(shader, renderer);
          // The Fold's rubble is never ground: its flat boards and tiles go with the house.
          occludable(shader, crown, !water && !rubble, rubble ? HOUSE_ONLY : undefined);
        };
        m.customProgramCacheKey = () =>
          `${key}|occ${crown ? '' : '-box'}${water ? '-water' : ''}${rubble ? '-rubble' : ''}`;
        m.needsUpdate = true;
      }
    });
  }

  /**
   * C3 on the story sets: the Hollow camp is lit by the cave rig and Corvin's garden by a
   * dark floor, so both held near black. The fill is raised to a floor here, every frame
   * (the scene resets it every few seconds), so it never steps.
   */
  private storyFloor(location: string, ctx: Dress3dCtx, night: number): void {
    const hemi = this.hemi;
    if (!hemi) return;
    const f = CG_A.storyFloor;
    if (location === 'hollow') {
      hemi.color.set(f.hollowColor);
      hemi.intensity = Math.max(hemi.intensity, f.hemi);
      ctx.scene.environmentIntensity = Math.max(ctx.scene.environmentIntensity, f.env);
    } else if (location === 'corvin' && night > 0.5) {
      // After dark only: by day the garden's frost is already bright, and a floor bleached it.
      hemi.intensity = Math.max(hemi.intensity, f.corvinHemi * night);
      ctx.scene.environmentIntensity = Math.max(ctx.scene.environmentIntensity, f.env * night);
    }
  }

  /** The ring's three layers take the fog's colour by distance; windows light after dark. */
  private skyline(night: number, ctx: Dress3dCtx, outdoors: boolean): void {
    const ring = this.ring;
    if (!ring || !this.windows) return;
    ring.mesh.visible = outdoors;
    const s = CG_A.skyline;
    const fog = ctx.scene.fog as THREE.FogExp2 | null;
    this.fogColor.copy(fog ? fog.color : this.tint.set('#c9dcf0'));
    const base = this.tint.set(s.day).lerp(new THREE.Color(s.night), night);
    const key = `${base.getHexString()}${this.fogColor.getHexString()}`;
    this.windows.visible = outdoors && ctx.lampsOn() && night > 0.5;
    if (key === this.lastTint) return;
    this.lastTint = key;
    const per = SEGMENTS + 1;
    const c = new THREE.Color();
    s.fog.forEach((f, layer) => {
      c.copy(base).lerp(this.fogColor, f);
      for (let v = 0; v < per * 2; v++) ring.colors.setXYZ(layer * per * 2 + v, c.r, c.g, c.b);
    });
    ring.colors.needsUpdate = true;
  }

  dispose(): void {
    if (this.ring) {
      this.ring.mesh.geometry.dispose();
      const m = this.ring.mesh.material as THREE.MeshBasicMaterial;
      m.map?.dispose();
      m.dispose();
    }
    if (this.windows) {
      this.windows.geometry.dispose();
      (this.windows.material as THREE.Material).dispose();
    }
    NIGHT_RIM.value = 0;
    OCCLUDE.on.value = 0;
  }
}

export const dress3dA: Dressing3d = new LightAndGrade();
