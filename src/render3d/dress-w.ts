import * as THREE from 'three';
import { seasonFor } from '../config/campaign-look';
import type { SceneStage } from '../config/story';
import { GROVE, LANTERN_POSTS } from '../config/tuning';
import { HUSH } from '../config/tuning-e';
import { CG2_W } from '../config/tuning-w';
import type { Daylight } from '../render/daylight';
import { pondIceWanted } from '../render/dress-w';
import { lanternLights, SceneClock } from '../render/dress-e';
import { HushTrail } from '../render/hush-trail';
import { LineClock } from '../render/line-clock';
import { iceRibbon } from '../render/ice-ribbon';
import { ICE_MARGIN, paintPondIce, paintStreamIce } from '../render/paint/terrain';
import { stageFlags } from '../render/scene-stage';
import type { World } from '../sim/types';
import type { Dress3dCtx, Dressing3d } from './dressings';
import { FrostDecals } from './frost-fx';
import { WATER_LEVEL } from './terrain';

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
    shader.uniforms.uWinterH = grassHeight;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uWinterH;')
      .replace(FADE, `${FADE}\n transformed.y *= uWinterH;`);
  };
  mat.customProgramCacheKey = () => 'grove-grass-winter';
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
  private clock = new SceneClock();
  private line = new LineClock();
  private trail = new HushTrail();
  private time = 0;

  build(ctx: Dress3dCtx): void {
    this.ctx = ctx;
    this.clock = new SceneClock();
    this.line = new LineClock();
    this.trail = new HushTrail();
    this.grass = null;
    this.earth = null;
    this.frostMix = 0;
    this.scanned = -10;
    this.time = 0;
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
    void ctx.compile(ice);
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

    // C7: the pond's ice.
    if (this.ice) {
      this.ice.visible = home && pondIceWanted(stage, flags.campaign, flags.chapter);
      if (this.stream) this.stream.visible = this.ice.visible;
      (this.ice.material as THREE.MeshStandardMaterial).emissiveIntensity =
        CG2_W.ice.glow3d * (1 - 0.7 * daylight.darkness);
    }

    // H8: the meadow's height follows the season.
    this.findGrass(ctx);
    const season = seasonFor(staged, flags.campaign, flags.chapter);
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
      return;
    }
    const sceneT = this.line.tick(flags.sceneId, this.clock.tick(flags.sceneId, dt), dt);
    const states = lanternLights(flags, stage, sceneT, reduce);
    const sid = flags.sceneId;
    this.frost.set(
      this.trail.update(
        flags,
        states,
        LANTERN_POSTS,
        sid !== null && HUSH.out.includes(sid),
        sid !== null && HUSH.back.includes(sid),
        dt,
        reduce,
      ),
    );
  }

  dispose(): void {
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
