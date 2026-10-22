import * as THREE from 'three';
import { CG_A } from '../config/tuning';
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
 * - M8: lit window and lantern glass scaled past the bloom threshold, so windows glow by
 *   emissive and bloom; the pool still lights only the nearest few.
 * - H9: the framed points handed to the building shader (`OCCLUDE`), which dithers out a
 *   wall standing between the camera and a speaker.
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
    // H9: a building's outline hull would show black through its dithered wall, so the
    // buildings' hulls take a copy of the shared hull material that dithers with them.
    ctx.scene.traverse((o) => {
      const parent = o.parent as THREE.Mesh | null;
      const host = parent?.material as THREE.Material | undefined;
      if (!o.userData.hull || !host || Array.isArray(host)) return;
      if (!host.customProgramCacheKey().startsWith('building-toon')) return;
      const hull = o as THREE.Mesh;
      const base = hull.material as THREE.Material;
      if (!this.hull) {
        const m = base.clone();
        m.onBeforeCompile = (shader, renderer) => {
          base.onBeforeCompile(shader, renderer);
          occludable(shader);
        };
        m.customProgramCacheKey = () => `${base.customProgramCacheKey()}|occ`;
        this.hull = { base, mat: m };
      }
      hull.material = this.hull.mat;
    });
    this.ring = skylineRing();
    this.windows = skylineWindows();
    // On the scene, not the home Grove's group: Corvin's garden and a neighbour's Grove
    // have the same open edge. Hidden underground (`update`).
    ctx.scene.add(this.ring.mesh, this.windows);
    void ctx.compile(this.ring.mesh);
    void ctx.compile(this.windows);
  }

  update(world: World, _stage: SceneStage, daylight: Daylight): void {
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

    // The framed points of a staged scene: the Keeper first, then the speakers.
    this.stager.update(world);
    const home = world.location === 'grove';
    const groundAt = (p: Vec2) => (home ? groveHeight(p.x, p.z) : 0);
    const points = this.stager.active ? this.stager.frame(world).slice(0, 3) : [];
    const occ = CG_A.occlude;
    OCCLUDE.on.value = points.length > 0 ? 1 : 0;
    OCCLUDE.radius.value = occ.radius;
    OCCLUDE.keep.value = occ.keep;
    OCCLUDE.margin.value = occ.margin;
    OCCLUDE.points.value.forEach((v, i) => {
      const p = points[i];
      if (p) v.set(p.x, groundAt(p) + occ.height, p.z, 1);
      else v.set(0, 0, 0, 0);
    });

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
