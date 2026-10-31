import * as THREE from 'three';
import { seasonHere } from '../render/grove-season';
import type { SceneStage } from '../config/story';
import { GROVE, LANTERN_POSTS } from '../config/tuning';
import { HUSH } from '../config/tuning-e';
import { CG2_W } from '../config/tuning-w';
import type { Daylight } from '../render/daylight';
import { pondIceWanted } from '../render/dress-w';
import { CG4_D4 } from '../config/tuning-d4';
import { hushFog, hushWalk, WindState } from '../render/d4-state';
import { lanternLights, SceneClock } from '../render/dress-e';
import { HushTrail } from '../render/hush-trail';
import { LineClock } from '../render/line-clock';
import { iceRibbon } from '../render/ice-ribbon';
import { ICE_MARGIN, paintPondIce, paintStreamIce } from '../render/paint/terrain';
import { stageFlags } from '../render/scene-stage';
import type { World } from '../sim/types';
import type { Dress3dCtx, Dressing3d } from './dressings';
import { FrostDecals } from './frost-fx';
import { hushFogTexture } from './hush-card';
import { setWind, SNOW_U, WIND_GLSL_DECL, WIND_U } from './wind-d4';
import { groveHeight, WATER_LEVEL } from './terrain';

/**
 * Campaign graphics 2, package w, Full 3D (winter, water, the Hush): the pond's ice (C7), a
 * short frosted meadow in winter (H8) and the Hush's frost under the lanterns it put out
 * (M14). One opaque disc, one instanced decal draw and a uniform on the grass, so it costs
 * nothing a phone would notice (the ice even hides the water's shader). The colossus and
 * the lantern ring's timing are in dress-e. All still, so reduced motion needs no other form.
 */

/** The grass's blade-height uniform, patched into its shader once. */
const grassHeight = { value: 1 };
const FADE =
  'transformed *= 1.0 - smoothstep( uFadeFrom, uFadeTo, distance( ip.xz, cameraPosition.xz ) );';

/**
 * Teach the meadow's material a winter height: blades shrink towards their root by
 * `uWinterH`. The grass shader belongs to the stage kit; this wraps its compile hook and
 * adds one line after the tuft's fade, so a missing anchor leaves the grass exactly as is.
 */
function patchGrass(mat: THREE.MeshStandardMaterial): void {
  if (mat.userData.winterHeight) return;
  mat.userData.winterHeight = true;
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (shader, renderer) => {
    prev.call(mat, shader, renderer);
    if (!shader.vertexShader.includes(FADE)) return;
    Object.assign(shader.uniforms, { uWinterH: grassHeight }, WIND_U, SNOW_U);
    // K35: the shared wind leans every blade, more at the tip, and ripples gusts through. The
    // push is a world-space offset, so it goes through the instance's inverse rotation.
    const wind = `{
      vec3 dl = ( vec3( uWindDir.x, 0.0, uWindDir.y ) * mat3( instanceMatrix ) ) /
        dot( instanceMatrix[ 0 ].xyz, instanceMatrix[ 0 ].xyz );
      float m = windMag( ip, uv.y * uv.y, uTime );
      transformed.xz += dl.xz * m;
    }`;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\nuniform float uWinterH;\n${WIND_GLSL_DECL}`)
      .replace(FADE, `${FADE}\n ${wind}\n transformed.y *= uWinterH;`);
    // K25: under snow the blades go white with the ground, so the cover reads on the meadow.
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uSnowAmt;')
      .replace(
        '#include <color_fragment>',
        '#include <color_fragment>\n diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.9, 0.95, 1.0 ), uSnowAmt * 0.8 );',
      );
  };
  mat.customProgramCacheKey = () => 'grove-grass-winter-wind';
  mat.needsUpdate = true;
}

class Dress3dW implements Dressing3d {
  readonly id = 'w';
  private ctx: Dress3dCtx | null = null;
  private ice: THREE.Mesh | null = null;
  private stream: THREE.Group | null = null;
  private frost: FrostDecals | null = null;
  private owned: Array<{ dispose(): void }> = [];
  private grass: THREE.MeshStandardMaterial | null = null;
  private earth: THREE.MeshStandardMaterial | null = null;
  private frostMix = 0;
  private readonly white = new THREE.Color('#ffffff');
  private readonly frostColor = new THREE.Color(CG2_W.winter.groundFrost);
  private readonly frostGlow = new THREE.Color(CG2_W.winter.groundGlowColor);
  private scanned = -10;
  private scannedHush = -10;
  private clock = new SceneClock();
  private line = new LineClock();
  private trail = new HushTrail();
  private time = 0;
  /** K35: the wind the grass shares. K17: the Hush's walk and its fog band. */
  private wind = new WindState();
  private colossus: THREE.Sprite | null = null;
  private fog: THREE.InstancedMesh | null = null;
  private fogMat: THREE.MeshBasicMaterial | null = null;
  private readonly fogM = new THREE.Matrix4();
  private readonly fogQ = new THREE.Quaternion();
  private readonly fogP = new THREE.Vector3();
  private readonly fogS = new THREE.Vector3();
  private readonly fogUp = new THREE.Vector3(0, 1, 0);
  private readonly fogColor = new THREE.Color();

  build(ctx: Dress3dCtx): void {
    this.ctx = ctx;
    this.clock = new SceneClock();
    this.line = new LineClock();
    this.trail = new HushTrail();
    this.grass = null;
    this.earth = null;
    this.frostMix = 0;
    this.scanned = -10;
    this.scannedHush = -10;
    this.time = 0;
    this.wind = new WindState();
    this.colossus = null;
    grassHeight.value = 1;
    if (typeof document === 'undefined') return;
    const R = GROVE.pond.r + CG2_W.ice.grow3d;
    const tex = paintPondIce(256);
    // Smooth, not the pixel view's hard texels; the box is wider than the disc.
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.generateMipmaps = true;
    tex.anisotropy = 4;
    tex.center.set(0.5, 0.5);
    const k = R / (GROVE.pond.r + ICE_MARGIN);
    tex.repeat.set(k, k);
    const geo = new THREE.CircleGeometry(R, 56);
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.2,
      metalness: 0,
      emissive: '#9bbfdc',
      emissiveMap: tex,
      emissiveIntensity: CG2_W.ice.glow3d,
    });
    const ice = new THREE.Mesh(geo, mat);
    ice.rotation.x = -Math.PI / 2;
    ice.position.set(GROVE.pond.x, WATER_LEVEL + CG2_W.ice.lift3d, GROVE.pond.z);
    ice.receiveShadow = true;
    ice.visible = false;
    ctx.world3d.add(ice);
    this.owned.push(tex, geo, mat);
    this.ice = ice;
    const st = paintStreamIce();
    const sm = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      map: st,
      roughness: 0.25,
      emissive: '#9bbfdc',
      emissiveMap: st,
      emissiveIntensity: CG2_W.ice.glow3d,
    });
    const group = new THREE.Group();
    for (const line of [GROVE.river.inflow, GROVE.river.outflow]) {
      const g = iceRibbon(line, GROVE.river.width + 0.9, WATER_LEVEL + CG2_W.ice.lift3d);
      this.owned.push(g);
      group.add(new THREE.Mesh(g, sm));
    }
    group.visible = false;
    ctx.world3d.add(group);
    this.owned.push(st, sm);
    this.stream = group;
    this.frost = new FrostDecals(ctx.world3d, LANTERN_POSTS);
    this.buildFog(ctx);
    void ctx.compile(ice);
  }

  /** K17: the walk's fog band, one instanced mesh of soft puffs (a single draw). */
  private buildFog(ctx: Dress3dCtx): void {
    const c = CG4_D4.hush;
    const tex = hushFogTexture();
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      opacity: 0,
      fog: false,
      color: '#c9d4e2',
    });
    const geo = new THREE.PlaneGeometry(1, 1);
    const count = c.pathPuffs + LANTERN_POSTS.length * c.tendrilPuffs;
    const fog = new THREE.InstancedMesh(geo, mat, count);
    fog.count = 0;
    fog.frustumCulled = false;
    fog.renderOrder = 3;
    fog.visible = false;
    ctx.world3d.add(fog);
    this.owned.push(tex, mat, geo);
    this.fog = fog;
    this.fogMat = mat;
  }

  /** The colossus card dress-e draws, found once by the mark its texture carries. */
  private findColossus(ctx: Dress3dCtx): void {
    if (this.colossus || this.time - this.scannedHush < 2) return;
    this.scannedHush = this.time;
    ctx.world3d.traverse((o) => {
      const s = o as THREE.Sprite;
      if (!this.colossus && s.isSprite && s.material.map?.userData.hush) this.colossus = s;
    });
  }

  /** The meadow's material: the instanced meshes drawn with the tuft texture. */
  private findGrass(ctx: Dress3dCtx): void {
    if (this.grass || this.time - this.scanned < 2) return;
    this.scanned = this.time;
    ctx.world3d.traverse((o) => {
      const m = o as THREE.InstancedMesh;
      const mat = m.material as THREE.MeshStandardMaterial | undefined;
      if (!this.grass && m.isInstancedMesh && mat?.map && mat.map === ctx.tex.tuft) {
        this.grass = mat;
        patchGrass(mat);
      }
    });
  }

  /** The ground's material, from the pickable the Grove marks as its terrain. */
  private findEarth(ctx: Dress3dCtx): THREE.MeshStandardMaterial | null {
    for (const o of ctx.pickables) {
      const p = o.userData.pick as { kind: string; id: string } | undefined;
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (p?.kind === 'ground' && p.id === 'ground' && m?.isMeshStandardMaterial) return m;
    }
    return null;
  }

  update(world: World, stage: SceneStage, daylight: Daylight, dt: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    this.time += dt;
    const reduce = ctx.reduceMotion();
    const staged = Object.keys(stage).length ? stage : null;
    const flags = stageFlags(world, staged);
    const home = flags.location === 'grove';

    // K35: one wind for the meadow (and anything else that reads WIND_U).
    this.wind.update(stage, dt, reduce);
    setWind(this.wind, reduce, ctx.time.value);

    // C7: the pond's ice.
    if (this.ice) {
      // R0118 (lane D r9): no free-play ice in 3D: the ice and stream sheets cost 2 to 4 draws
      // (farOrchard 143 → 147), over this pass's zero-draw rule; Pixel freezes its pond.
      this.ice.visible = home && pondIceWanted(stage, flags.campaign, flags.chapter);
      if (this.stream) this.stream.visible = this.ice.visible;
      (this.ice.material as THREE.MeshStandardMaterial).emissiveIntensity =
        CG2_W.ice.glow3d * (1 - 0.7 * daylight.darkness);
    }

    // H8: the meadow's height follows the season.
    this.findGrass(ctx);
    const season = seasonHere(world, staged, flags.campaign, flags.chapter, flags.location);
    const winter = home && season?.season === 'winter' && season.strength >= 0.9;
    const goal = winter ? CG2_W.winter.grassScale : 1;
    const step = reduce ? 1 : Math.min(1, dt / CG2_W.winter.grassEase);
    grassHeight.value += (goal - grassHeight.value) * step;
    // The ground under it frosts over by the same ease (the terrain's own colour multiplier).
    this.earth ??= this.findEarth(ctx);
    this.frostMix += ((winter ? 1 : 0) - this.frostMix) * step;
    if (this.earth) {
      this.earth.color.lerpColors(this.white, this.frostColor, this.frostMix);
      this.earth.emissive
        .copy(this.frostGlow)
        .multiplyScalar(this.frostMix * CG2_W.winter.groundGlow * (1 - 0.8 * daylight.darkness));
      this.earth.emissiveIntensity = 1;
    }
    if (Math.abs(goal - grassHeight.value) < 0.002) grassHeight.value = goal;

    // M14: the Hush's frost under the lanterns it put out.
    if (!this.frost) return;
    if (!home) {
      this.trail.reset();
      this.frost.set(new Map());
      if (this.fog) this.fog.visible = false;
      return;
    }
    const sceneT = this.line.tick(flags.sceneId, this.clock.tick(flags.sceneId, dt), dt);
    const states = lanternLights(flags, stage, sceneT, reduce);
    const sid = flags.sceneId;
    const grown = this.trail.update(
      flags,
      states,
      LANTERN_POSTS,
      sid !== null && HUSH.out.includes(sid),
      sid !== null && HUSH.back.includes(sid),
      dt,
      reduce,
    );
    this.frost.set(grown);
    this.hushWalk(ctx, sid, sceneT, reduce, grown, daylight);
  }

  /**
   * K17: the Hush walks from its mark toward the Fold, a stretch each scene, with a ground-fog
   * band behind it that reaches each lantern as the lantern's frost grows. Reduced motion: it
   * stands at the stretch's end. dress-e owns the card (its fade-in and its opacity); this
   * moves it.
   */
  private hushWalk(
    ctx: Dress3dCtx,
    sid: string | null,
    sceneT: number,
    reduce: boolean,
    grown: ReadonlyMap<string, number>,
    daylight: Daylight,
  ): void {
    this.findColossus(ctx);
    const fog = this.fog;
    const mat = this.fogMat;
    const place = hushWalk(sid, sceneT, reduce);
    const card = this.colossus;
    const shown = card !== null && card.visible && place !== null;
    if (card && place) {
      const c = CG2_W.hush;
      card.position.set(place.x, groveHeight(place.x, place.z + c.z3d) + c.y3d, place.z + c.z3d);
    }
    if (!fog || !mat) return;
    if (!shown || !place || !card) {
      fog.visible = false;
      return;
    }
    const puffs = hushFog(place, grown, LANTERN_POSTS, CG2_W.hush.z3d);
    const c = CG4_D4.hush;
    const cam = ctx.camera.position;
    let n = 0;
    for (const p of puffs) {
      if (n >= fog.instanceMatrix.count) break;
      const y = groveHeight(p.x, p.z) + c.lift;
      this.fogP.set(p.x, y, p.z);
      this.fogQ.setFromAxisAngle(this.fogUp, Math.atan2(cam.x - p.x, cam.z - p.z));
      this.fogS.set(c.puffW * (0.7 + 0.3 * p.k), c.puffH * (0.7 + 0.3 * p.k), 1);
      this.fogM.compose(this.fogP, this.fogQ, this.fogS);
      fog.setMatrixAt(n++, this.fogM);
    }
    fog.count = n;
    fog.instanceMatrix.needsUpdate = true;
    fog.visible = n > 0;
    // The band is as present as the figure, and dims with the night like the other frost.
    const presence = Math.min(1, card.material.opacity / CG2_W.hush.opacity3d);
    mat.opacity = c.opacity * presence;
    mat.color.copy(this.fogColor.set('#c9d4e2')).multiplyScalar(1 - 0.5 * daylight.darkness);
  }

  dispose(): void {
    this.fog?.removeFromParent();
    this.fog = null;
    this.fogMat = null;
    this.colossus = null;
    this.ice?.removeFromParent();
    this.ice = null;
    this.stream?.removeFromParent();
    this.stream = null;
    this.frost?.dispose();
    this.frost = null;
    for (const o of this.owned) o.dispose();
    this.owned = [];
    grassHeight.value = 1;
    this.earth?.color.set('#ffffff');
    this.earth?.emissive.set('#000000');
    this.earth = null;
    this.ctx = null;
  }
}

export const dress3dW: Dressing3d = new Dress3dW();
