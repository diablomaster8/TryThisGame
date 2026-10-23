import * as THREE from 'three';
import type { SceneStage } from '../config/story';
import { GROVE } from '../config/tuning';
import { CG4_D4 } from '../config/tuning-d4';
import type { Daylight } from '../render/daylight';
import { moonPhaseFor, pathWear, rainingNow, snowCover, WetTracker } from '../render/d4-state';
import { stageFlags } from '../render/scene-stage';
import type { World } from '../sim/types';
import type { Dress3dCtx, Dressing3d } from './dressings';
import { SNOW_U } from './wind-d4';
import { groveHeight, pathDistance, riverDistance, WATER_LEVEL } from './terrain';

/**
 * Campaign graphics 4, package d4, Full 3D: the moon and the stars by chapter (K24); snow
 * cover, path wear, puddles' wet ground and cloud shadows through one patch of the terrain
 * shader (K25, K26, K34, K23); instanced puddles (K34); and morning light shafts with dust
 * motes (K22). The Hush's walk (K17) and the wind (K35) are in dress-w.ts, depth of field
 * (K21) in dof-pass.ts. Everything here is render-only and reads `stageFlags`; under reduced
 * motion the clouds stop, the motes hold still, and the rest changes only with the story.
 */

/** The terrain patch's live uniforms; one set, shared by the one terrain material. */
const TERRAIN_U = {
  uSnowAmt: SNOW_U.uSnowAmt,
  uWearAmt: { value: 0 },
  uWetAmt: { value: 0 },
  uCloudAmt: { value: 0 },
  uSnowCol: { value: new THREE.Color(CG4_D4.snow.color) },
};

const DIRT_MIX =
  'vec4 sampledDiffuseColor = mix( mix( cGrass, cDirt, vBlend.y ), cRock, vBlend.x );';
const DIFFUSE = 'diffuseColor *= sampledDiffuseColor;';
const ROUGH = '#include <roughnessmap_fragment>';

/**
 * Teach the Grove's terrain material four things. Wear widens the dirt of the paths; snow whitens
 * the flat ground in patches, then wholly, leaving the paths thin; wetness darkens the ground
 * and lowers its roughness; clouds drift soft shadows over it by day. Each anchor is checked,
 * so a changed terrain shader is left exactly as it was.
 */
function patchTerrain(mat: THREE.Material, time: { value: number }): void {
  if (mat.userData.d4) return;
  mat.userData.d4 = true;
  const prev = mat.onBeforeCompile.bind(mat);
  mat.onBeforeCompile = (shader, renderer) => {
    prev(shader, renderer);
    const f = shader.fragmentShader;
    if (!f.includes(DIRT_MIX) || !f.includes(DIFFUSE) || !f.includes(ROUGH)) return;
    Object.assign(shader.uniforms, TERRAIN_U, { uCloudT: time });
    const c = CG4_D4.clouds;
    const w = CG4_D4.wet;
    shader.fragmentShader = f
      .replace(
        '#include <common>',
        `#include <common>
uniform float uSnowAmt;
uniform float uWearAmt;
uniform float uWetAmt;
uniform float uCloudAmt;
uniform float uCloudT;
uniform vec3 uSnowCol;`,
      )
      .replace(
        DIRT_MIX,
        `float dirtK = clamp( vBlend.y * ( 1.0 + uWearAmt * 1.3 ), 0.0, 1.0 );
         vec4 sampledDiffuseColor = mix( mix( cGrass, cDirt, dirtK ), cRock, vBlend.x );`,
      )
      .replace(
        DIFFUSE,
        `${DIFFUSE}
         float sm = 0.0;
         if ( uSnowAmt > 0.0 ) {
           float nz = 0.5 + 0.25 * sin( vGround.x * 0.83 + sin( vGround.y * 0.61 ) * 2.1 )
             + 0.25 * sin( vGround.y * 1.27 + vGround.x * 0.37 );
           sm = smoothstep( 0.0, 0.5, uSnowAmt * 1.5 - 0.25 - ( 1.0 - nz ) * 0.7 )
             * ( 1.0 - vBlend.x ) * ( 1.0 - dirtK * 0.5 );
           diffuseColor.rgb = mix( diffuseColor.rgb, uSnowCol, sm * 0.94 );
         }
         diffuseColor.rgb *= 1.0 - uWetAmt * ( 1.0 - sm ) * ${w.darken.toFixed(3)};
         if ( uCloudAmt > 0.0 ) {
           float sc = ${c.scale.toFixed(4)};
           float t = uCloudT * ${c.speed.toFixed(3)};
           float cn = 0.5 + 0.5 * sin( ( vGround.x + t ) * sc + sin( ( vGround.y - t * 0.3 ) * sc * 1.7 ) * 1.6 )
             * sin( ( vGround.y + t * 0.6 ) * sc * 1.3 + 1.0 + sin( vGround.x * sc * 0.8 ) );
           diffuseColor.rgb *= 1.0 - uCloudAmt * smoothstep( 0.45, 0.75, cn );
         }`,
      )
      .replace(ROUGH, `${ROUGH}\n roughnessFactor = mix( roughnessFactor, 0.32, uWetAmt * 0.85 );`);
  };
  const key = mat.customProgramCacheKey.bind(mat);
  mat.customProgramCacheKey = () => `${key()}|d4`;
  mat.needsUpdate = true;
}

/** A puddle: a dark wet disc with a pale sky glint, clear at its rim. */
function puddleTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, 'rgba(126,156,182,0.9)');
  grad.addColorStop(0.75, 'rgba(92,120,146,0.9)');
  grad.addColorStop(0.9, 'rgba(58,74,90,0.7)');
  grad.addColorStop(1, 'rgba(58,74,90,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  // The sky in the water.
  const sky = g.createRadialGradient(46, 48, 2, 46, 48, 30);
  sky.addColorStop(0, 'rgba(225,238,250,0.8)');
  sky.addColorStop(1, 'rgba(225,238,250,0)');
  g.fillStyle = sky;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** A light shaft: soft at its sides, strongest in the middle, fading at both ends. */
function shaftTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 256;
  const g = c.getContext('2d')!;
  const across = g.createLinearGradient(0, 0, 64, 0);
  across.addColorStop(0, 'rgba(255,255,255,0)');
  across.addColorStop(0.5, 'rgba(255,255,255,1)');
  across.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = across;
  g.fillRect(0, 0, 64, 256);
  g.globalCompositeOperation = 'destination-in';
  const along = g.createLinearGradient(0, 0, 0, 256);
  along.addColorStop(0, 'rgba(0,0,0,0.95)');
  along.addColorStop(0.6, 'rgba(0,0,0,0.8)');
  along.addColorStop(0.92, 'rgba(0,0,0,0.35)');
  along.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = along;
  g.fillRect(0, 0, 64, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** A soft round dust mote. */
function moteTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255,248,224,1)');
  grad.addColorStop(0.4, 'rgba(255,244,210,0.5)');
  grad.addColorStop(1, 'rgba(255,244,210,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** A deterministic 0..1 hash of an index, so the puddles and motes fall the same every time. */
const hash1 = (i: number, salt: number): number => {
  const s = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return s - Math.floor(s);
};

/** Open ground for a puddle: off the pond, the stream, the buildings and the steep hill. */
function openGround(x: number, z: number): boolean {
  const y = groveHeight(x, z);
  if (y > 2.2 || y < WATER_LEVEL + 0.25) return false;
  if (Math.hypot(x - GROVE.pond.x, z - GROVE.pond.z) < GROVE.pond.r + 1.8) return false;
  if (riverDistance(x, z) < GROVE.river.width * 0.5 + 1.2) return false;
  for (const b of Object.values(GROVE.buildings)) {
    if (Math.hypot(x - b.x, z - b.z) < b.r + 1.6) return false;
  }
  return true;
}

class Dress3dD4 implements Dressing3d {
  readonly id = 'd4';
  private ctx: Dress3dCtx | null = null;
  private owned: Array<{ dispose(): void }> = [];
  private time = 0;
  private skyMat: THREE.ShaderMaterial | null = null;
  private wet = new WetTracker();
  private snow = 0;
  private snowSeen = false;
  private puddles: THREE.InstancedMesh | null = null;
  private puddleMat: THREE.MeshBasicMaterial | null = null;
  private puddleSpots: Array<{ x: number; z: number; y: number; r: number; th: number }> = [];
  private lastWet = -1;
  private shafts: THREE.Mesh[] = [];
  private shaftMat: THREE.MeshBasicMaterial | null = null;
  private motes: THREE.InstancedMesh | null = null;
  private moteMat: THREE.MeshBasicMaterial | null = null;
  private rayK = 0;
  private readonly m4 = new THREE.Matrix4();
  private readonly v3a = new THREE.Vector3();
  private readonly v3b = new THREE.Vector3();
  private readonly v3c = new THREE.Vector3();
  private readonly v3d = new THREE.Vector3();
  private readonly q = new THREE.Quaternion();
  private readonly one = new THREE.Vector3(1, 1, 1);
  private readonly v3e = new THREE.Vector3();
  private readonly v3f = new THREE.Vector3();

  build(ctx: Dress3dCtx): void {
    this.ctx = ctx;
    this.time = 0;
    this.skyMat = null;
    this.wet = new WetTracker();
    this.snow = 0;
    this.snowSeen = false;
    this.lastWet = -1;
    this.rayK = 0;
    this.shafts = [];
    this.owned = [];
    if (typeof document === 'undefined') return;
    const terrain = ctx.world3d.getObjectByName('terrain') as THREE.Mesh | undefined;
    if (terrain) patchTerrain(terrain.material as THREE.Material, ctx.time);
    this.buildPuddles(ctx);
    this.buildRays(ctx);
  }

  private buildPuddles(ctx: Dress3dCtx): void {
    const w = CG4_D4.wet;
    const tex = puddleTexture();
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    const geo = new THREE.PlaneGeometry(2, 2);
    geo.rotateX(-Math.PI / 2);
    const spots: typeof this.puddleSpots = [];
    for (let i = 0; spots.length < w.puddles && i < 4000; i++) {
      const x = (hash1(i, 1) * 2 - 1) * w.range * 1.4;
      const z = (hash1(i, 2) * 2 - 1) * w.range * 1.4;
      if (!openGround(x, z)) continue;
      // On or beside a path, where the ground is bare: the meadow's blades would hide them.
      if (pathDistance(x, z) > 1.4) continue;
      const n = spots.length;
      spots.push({
        x,
        z,
        y: groveHeight(x, z) + 0.04,
        r: w.minR + (w.maxR - w.minR) * hash1(i, 3),
        th: (n / w.puddles) * 0.62,
      });
    }
    this.puddleSpots = spots;
    const mesh = new THREE.InstancedMesh(geo, mat, Math.max(1, spots.length));
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.visible = false;
    mesh.renderOrder = 1;
    ctx.world3d.add(mesh);
    this.puddles = mesh;
    this.puddleMat = mat;
    this.owned.push(tex, mat, geo);
    void ctx.compile(mesh);
  }

  private buildRays(ctx: Dress3dCtx): void {
    const r = CG4_D4.rays;
    const shaft = shaftTexture();
    const mat = new THREE.MeshBasicMaterial({
      map: shaft,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      fog: false,
      color: '#ffd68a',
    });
    const geo = new THREE.PlaneGeometry(1, 1);
    for (let i = 0; i < r.shafts; i++) {
      const m = new THREE.Mesh(geo, mat);
      m.frustumCulled = false;
      m.visible = false;
      m.renderOrder = 4;
      m.matrixAutoUpdate = false;
      ctx.world3d.add(m);
      this.shafts.push(m);
    }
    this.shaftMat = mat;
    const dot = moteTexture();
    const moteMat = new THREE.MeshBasicMaterial({
      map: dot,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    });
    const motes = new THREE.InstancedMesh(geo, moteMat, r.motes);
    motes.frustumCulled = false;
    motes.visible = false;
    motes.renderOrder = 4;
    ctx.world3d.add(motes);
    this.motes = motes;
    this.moteMat = moteMat;
    this.owned.push(shaft, mat, dot, moteMat, geo);
    void ctx.compile(motes);
  }

  update(world: World, stage: SceneStage, daylight: Daylight, dt: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    this.time += dt;
    const reduce = ctx.reduceMotion();
    const staged = Object.keys(stage).length ? stage : null;
    const flags = stageFlags(world, staged);
    const home = flags.location === 'grove';
    const shown = home && stage.exclusive !== true;

    // K24: the moon's phase and what it does to the stars (the sky's own shader draws both).
    this.skyMat ??= (ctx.scene.getObjectByName('sky') as THREE.Mesh | undefined)
      ?.material as THREE.ShaderMaterial | null;
    const u = this.skyMat?.uniforms;
    if (u?.uMoonL) {
      const m = CG4_D4.moon;
      const phase = moonPhaseFor(flags);
      const lit = m.lit[phase];
      // The phase angle whose lit share is `lit`: the light across the disc and toward us.
      const a = Math.acos(2 * lit - 1);
      (u.uMoonL.value as THREE.Vector3).set(Math.sin(a), 0, Math.cos(a));
      u.uMoonLit!.value = lit;
      u.uMoonRadius!.value = m.radius;
      u.uStarGain!.value = m.starGain[phase];
    }

    // K25, K26, K34, K23: the terrain's uniforms.
    const goal = shown ? snowCover(flags) : 0;
    if (!this.snowSeen) {
      // A reload mid-vigil starts at the cover it should have.
      this.snow = goal;
      this.snowSeen = true;
    }
    const step = reduce ? 1 : Math.min(1, dt / CG4_D4.snow.easeS);
    this.snow += (goal - this.snow) * step;
    if (Math.abs(goal - this.snow) < 0.002) this.snow = goal;
    TERRAIN_U.uSnowAmt.value = this.snow;
    TERRAIN_U.uWearAmt.value = shown ? pathWear(flags) : 0;
    const raining = home && rainingNow(world.weather.kind, stage);
    const wet = this.wet.update(raining, dt);
    TERRAIN_U.uWetAmt.value = shown ? wet : 0;
    const c = CG4_D4.clouds;
    const dayK = THREE.MathUtils.clamp(1 - daylight.darkness / c.fadeAtDark, 0, 1);
    // Off under reduced motion, at night, in rain (the sky is grey, not patchy) and in
    // exclusive sets.
    TERRAIN_U.uCloudAmt.value =
      shown && !reduce && !raining ? c.strength * dayK * (1 - 0.6 * wet) : 0;

    this.updatePuddles(shown ? wet : 0, daylight);
    this.updateRays(ctx, flags, stage, daylight, shown, reduce, dt);
  }

  /** K34: puddles grow with the wetness, each from its own threshold, and dry with it. */
  private updatePuddles(wet: number, daylight: Daylight): void {
    const mesh = this.puddles;
    const mat = this.puddleMat;
    if (!mesh || !mat) return;
    const on = wet > 0.02;
    mesh.visible = on;
    if (!on) {
      this.lastWet = -1;
      return;
    }
    // Dimmed at night with the rest of the unlit ground.
    mat.color.setScalar(0.4 + 0.6 * (1 - daylight.darkness));
    mat.opacity = 0.9;
    if (Math.abs(wet - this.lastWet) < 0.004) return;
    this.lastWet = wet;
    let n = 0;
    for (const s of this.puddleSpots) {
      const k = THREE.MathUtils.smoothstep(wet, s.th, s.th + 0.3);
      if (k <= 0.01) continue;
      this.v3a.set(s.x, s.y, s.z);
      const r = s.r * k;
      this.v3b.set(r, 1, r * 0.78);
      this.q.identity();
      this.m4.compose(this.v3a, this.q, this.v3b);
      mesh.setMatrixAt(n++, this.m4);
    }
    mesh.count = n;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.visible = n > 0;
  }

  /** K22: shafts and motes on a crisp morning: a Dawn half, a `crisp` grade, the last morning. */
  private updateRays(
    ctx: Dress3dCtx,
    flags: ReturnType<typeof stageFlags>,
    stage: SceneStage,
    daylight: Daylight,
    shown: boolean,
    reduce: boolean,
    dt: number,
  ): void {
    const r = CG4_D4.rays;
    const morning =
      stage.grade === 'crisp' ||
      flags.half === 'dawn' ||
      (flags.campaign === 'hundred' && flags.chapter === 10);
    const wanted = shown && morning && flags.inside === null && daylight.darkness < 0.35;
    const goal = wanted ? 1 : 0;
    this.rayK += (goal - this.rayK) * (reduce ? 1 : Math.min(1, dt / 1.5));
    if (Math.abs(goal - this.rayK) < 0.01) this.rayK = goal;
    const on = this.rayK > 0.01;
    for (const s of this.shafts) s.visible = on;
    if (this.motes) this.motes.visible = on;
    if (!on || !this.shaftMat || !this.moteMat || !this.motes) return;
    const cam = ctx.camera;
    // Where the camera looks at the ground: the shafts are laid out round that spot.
    cam.getWorldDirection(this.v3a);
    const fwd = this.v3a;
    const t = fwd.y < -0.08 ? Math.min(60, (1 - cam.position.y) / fwd.y) : 24;
    const fx = cam.position.x + fwd.x * t;
    const fz = cam.position.z + fwd.z * t;
    const fy = groveHeight(fx, fz);
    // The sun's direction from the sky dome, kept steep enough that a shaft stays a shaft.
    const sunU = this.skyMat?.uniforms.uSunDir?.value as THREE.Vector3 | undefined;
    const sun = this.v3b.copy(sunU ?? this.v3b.set(0.3, 0.8, 0.2));
    sun.y = Math.max(sun.y, 0.45);
    sun.normalize();
    // Across the view (right of the camera, flattened) and away from it.
    const right = this.v3c.set(fwd.z, 0, -fwd.x).normalize();
    const away = this.v3d.set(fwd.x, 0, fwd.z).normalize();
    const k = this.rayK * (1 - daylight.darkness);
    this.shaftMat.opacity = r.opacity * k;
    for (let i = 0; i < this.shafts.length; i++) {
      const lat = (i - (this.shafts.length - 1) / 2) * r.spread * (0.8 + 0.4 * hash1(i, 5));
      const back = 1.5 + i * 2.6;
      const px = fx + right.x * lat + away.x * back;
      const pz = fz + right.z * lat + away.z * back;
      const py = groveHeight(px, pz);
      // The card's long axis is the sun's, its face turned as far toward the camera as that
      // allows.
      const toCam = this.v3e.set(cam.position.x - px, cam.position.y - py, cam.position.z - pz);
      toCam.addScaledVector(sun, -toCam.dot(sun)).normalize();
      const xAxis = this.v3f
        .crossVectors(sun, toCam)
        .normalize()
        .multiplyScalar(r.w * (0.8 + 0.5 * hash1(i, 7)));
      const m = this.shafts[i]!;
      this.m4.makeBasis(xAxis, this.v3a.copy(sun).multiplyScalar(r.h), toCam);

      this.m4.setPosition(
        px + sun.x * r.h * 0.38,
        py + sun.y * r.h * 0.38,
        pz + sun.z * r.h * 0.38,
      );
      m.matrix.copy(this.m4);
      m.matrixWorldNeedsUpdate = true;
    }
    // The motes: a loose cloud round the focus, drifting slowly (held under reduced motion).
    this.moteMat.opacity = 0.75 * k;
    const phase = reduce ? 0 : (this.time / r.moteDriftS) * Math.PI * 2;
    this.q.copy(cam.quaternion);
    for (let i = 0; i < r.motes; i++) {
      const bx = (hash1(i, 11) * 2 - 1) * r.moteBox;
      const bz = (hash1(i, 12) * 2 - 1) * r.moteBox;
      const by = hash1(i, 13) * r.moteHeight;
      const ph = hash1(i, 14) * Math.PI * 2;
      const x = fx + bx + Math.sin(phase + ph) * 0.9;
      const z = fz + bz + Math.cos(phase * 0.8 + ph) * 0.9;
      const y = fy + 0.4 + by + Math.sin(phase * 1.3 + ph * 2) * 0.35;
      this.v3a.set(x, y, z);
      const sz = r.moteSize * (0.6 + 0.8 * hash1(i, 15));
      this.v3b.set(sz, sz, sz);
      this.m4.compose(this.v3a, this.q, this.v3b);
      this.motes.setMatrixAt(i, this.m4);
    }
    this.motes.instanceMatrix.needsUpdate = true;
  }

  dispose(): void {
    for (const s of this.shafts) s.removeFromParent();
    this.shafts = [];
    this.motes?.removeFromParent();
    this.motes = null;
    this.puddles?.removeFromParent();
    this.puddles = null;
    for (const o of this.owned) o.dispose();
    this.owned = [];
    TERRAIN_U.uSnowAmt.value = 0;
    TERRAIN_U.uWearAmt.value = 0;
    TERRAIN_U.uWetAmt.value = 0;
    TERRAIN_U.uCloudAmt.value = 0;
    this.skyMat = null;
    this.ctx = null;
  }
}

export const dress3dD4: Dressing3d = new Dress3dD4();
