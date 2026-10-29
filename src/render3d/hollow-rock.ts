import * as THREE from 'three';
import { DUNGEON, GROVE3D } from '../config/tuning';
import { cellAt, cellCentre, isWalkable, WALL, type Floor } from '../sim/dungeon';
import { surface, type Surface, type Tex } from '../samples/aaa-kit';
import { caveShed } from './cave-shed';
import { fogged } from './hollow-fog';
import {
  CELL,
  WALL_H,
  cellHash,
  disposeObjects,
  type Baker,
  type HollowCtx,
  type HollowFrame,
  type HollowModule,
} from './hollow-ctx';

/**
 * The Hollow's rock: the earth floor (cut fine enough that a terrace edge is a short
 * ledge, and following `Floor.elevation`), the wall blocks (one merged mesh, tall and
 * leaning over the open ground, with a low lip where a vista opens onto the chasm) and the
 * cutaway that sinks any wall standing between the camera and the party. Owns the rock and
 * earth materials, shared across floors, and the bake seam of the other cave modules: each
 * vertex holds a base colour and a torch-light colour that `ctx.bakers` fill in chunks
 * (see `bake`), the torch part flickering through `ctx.uniforms.torchFlicker`.
 *
 * The rock shader (see `rockMaterial`): the painted texture of the floor's band laid on
 * triplanar from the world position (dropped to one projection by the governor's
 * `triplanar` step), strata bands, edge wear, moss and fungus up from the foot and toward
 * water, and a wet gloss with drip streaks near water.
 */

const R = GROVE3D.cave.rock;
const TEX_W = 1024;

/** Walls closer than this to the line from a party member to the camera are cut down. */
const CUT_RADIUS = CELL * 0.95 + R.lean;

/** A small value noise over world space, three channels, for bending the rock. */
const ROCK_NOISE = /* glsl */ `
  float rockHash( vec3 p ) { return fract( sin( dot( p, vec3( 127.1, 311.7, 74.7 ) ) ) * 43758.5453 ); }
  float rockNoise( vec3 p ) {
    vec3 i = floor( p ); vec3 f = fract( p ); f = f * f * ( 3.0 - 2.0 * f );
    return mix(
      mix( mix( rockHash( i ), rockHash( i + vec3( 1, 0, 0 ) ), f.x ),
           mix( rockHash( i + vec3( 0, 1, 0 ) ), rockHash( i + vec3( 1, 1, 0 ) ), f.x ), f.y ),
      mix( mix( rockHash( i + vec3( 0, 0, 1 ) ), rockHash( i + vec3( 1, 0, 1 ) ), f.x ),
           mix( rockHash( i + vec3( 0, 1, 1 ) ), rockHash( i + vec3( 1, 1, 1 ) ), f.x ), f.y ), f.z );
  }
  vec3 rockBend( vec3 p ) {
    return vec3( rockNoise( p ), rockNoise( p + 17.3 ), rockNoise( p - 9.1 ) ) * 2.0 - 1.0;
  }
`;

const glsl = (n: number) => n.toFixed(4);

/** Declarations the wall vertex shader and its shadow-pass twin share. */
const WALL_DECLS = /* glsl */ `
  ${ROCK_NOISE}
  attribute vec3 aWall;
  attribute vec2 aLean;
  uniform sampler2D uWallH;
  uniform float uLean;
  uniform float uRef;
`;

/**
 * Shapes one wall vertex: its height from the data texture, the lean over the open ground
 * and the world-space bend. Leaves `rw` (the world position) and `tt` (height above the
 * foot). Used by the colour pass and, as `customDepthMaterial`, by the sun's shadow pass,
 * so a sunk wall casts a short shadow and a bent one a bent shadow.
 */
const WALL_SHAPE = /* glsl */ `
  int wi = int( aWall.x + 0.5 );
  float hNow = texelFetch( uWallH, ivec2( wi % ${TEX_W}, wi / ${TEX_W} ), 0 ).r;
  float tt = aWall.y * hNow;
  vec4 rr = modelMatrix * vec4( position, 1.0 );
  vec3 bend = rockBend( vec3( rr.x, position.y, rr.z ) * 1.25 ) * ${GROVE3D.cave.rockAmp.toFixed(4)};
  // The foot stays on the floor; the bend grows up the wall.
  bend.y *= clamp( tt / 0.8, 0.0, 1.0 ) * 0.6;
  bend.xz *= 0.55 + 0.45 * clamp( tt / 1.2, 0.0, 1.0 );
  float lt = tt / uRef;
  transformed.y = aWall.z + tt;
  transformed.xz += aLean * uLean * lt * lt;
  transformed += bend;
  vec4 rw = modelMatrix * vec4( transformed, 1.0 );
`;

/** The shadow-pass material for the walls: the same shaping, depth only. */
function wallDepthMaterial(u: RockUniforms): THREE.MeshDepthMaterial {
  const m = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uWallH = u.wallH;
    shader.uniforms.uLean = { value: R.lean };
    shader.uniforms.uRef = { value: WALL_H };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${WALL_DECLS}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n{\n${WALL_SHAPE}\n}`);
  };
  m.customProgramCacheKey = () => 'hollow-rock-depth';
  return m;
}

interface RockUniforms {
  torch: { value: number };
  tri: { value: number };
  wallH: { value: THREE.Texture };
  tint: { value: THREE.Color };
  rim: { value: THREE.Color };
  moss: { value: THREE.Color };
  fungus: { value: THREE.Color };
  strata: { value: THREE.Vector4 };
  fungusAmt: { value: number };
}

const placeholderH = (): THREE.DataTexture => {
  const t = new THREE.DataTexture(new Float32Array([1]), 1, 1, THREE.RedFormat, THREE.FloatType);
  t.needsUpdate = true;
  return t;
};

/** Which painted texture each band's rock wears (sandstone is the shared rock texture). */
type RockTex = (typeof R.looks)[number]['tex'];

/**
 * The cave's rock material. Triplanar albedo (a three-way blend of world-position
 * projections weighted by the faceted normal), the block bent by a world-space noise
 * (shared corners move together, so the wall never gaps) and faceted by flat shading. The
 * wall heights come from a data texture (`uWallH`, one texel a block) so the cutaway can sink
 * a block without touching the merged geometry.
 */
function rockMaterial(tex: Tex, u: RockUniforms): THREE.MeshStandardMaterial {
  const { rockTexel } = GROVE3D.cave;
  const m = new THREE.MeshStandardMaterial({
    map: tex.rock.map,
    normalMap: tex.rock.normal,
    normalScale: new THREE.Vector2(1.1, 1.1),
    roughness: 0.95,
    vertexColors: true,
    flatShading: true,
  });
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, {
      uTorchFlicker: u.torch,
      uTri: u.tri,
      uWallH: u.wallH,
      uTint: u.tint,
      uRim: u.rim,
      uMossCol: u.moss,
      uFungusCol: u.fungus,
      uStrata: u.strata,
      uFungusAmt: u.fungusAmt,
      uLean: { value: R.lean },
      uRef: { value: WALL_H },
      uWear: { value: new THREE.Vector2(R.wear.ridge, R.wear.lip) },
      uMossP: { value: new THREE.Vector3(R.moss.foot, R.moss.wet, R.moss.amount) },
      uWetP: { value: new THREE.Vector3(R.wet.darken, R.wet.rough, R.wet.drip) },
    });
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        ${WALL_DECLS}
        attribute vec3 aTorch;
        attribute float aWet;
        varying vec3 vW;
        varying float vFrac;
        varying float vH;
        varying float vWet;
        varying vec3 vTorch;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        {
          ${WALL_SHAPE}
          vec3 an = abs( normal );
          vec2 tuv = an.y > 0.5 ? rw.xz : an.x > an.z ? rw.zy : rw.xy;
          tuv /= ${glsl(rockTexel)};
          #ifdef USE_MAP
            vMapUv = tuv;
          #endif
          #ifdef USE_NORMALMAP
            vNormalMapUv = tuv;
          #endif
          vW = rw.xyz;
          vFrac = aWall.y;
          vH = tt;
          vWet = aWet;
          vTorch = aTorch;
        }`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        ${ROCK_NOISE}
        uniform float uTri;
        uniform float uTorchFlicker;
        uniform vec3 uTint;
        uniform vec3 uRim;
        uniform vec3 uMossCol;
        uniform vec3 uFungusCol;
        uniform vec4 uStrata;
        uniform float uFungusAmt;
        uniform vec2 uWear;
        uniform vec3 uMossP;
        uniform vec3 uWetP;
        varying vec3 vW;
        varying float vFrac;
        varying float vH;
        varying float vWet;
        varying vec3 vTorch;`,
      )
      .replace(
        '#include <map_fragment>',
        `
        // The faceted normal from the world position, then a three-way blend by it.
        vec3 fn = normalize( cross( dFdx( vW ), dFdy( vW ) ) );
        vec3 tw = pow( abs( fn ), vec3( ${glsl(R.triplanarPower)} ) );
        tw /= tw.x + tw.y + tw.z;
        float sideW = 1.0 - tw.y;
        #ifdef USE_MAP
          vec4 sampledDiffuseColor;
          if ( uTri > 0.5 ) {
            float ti = 1.0 / ${glsl(rockTexel)};
            sampledDiffuseColor = texture2D( map, vW.zy * ti ) * tw.x
              + texture2D( map, vW.xz * ti ) * tw.y
              + texture2D( map, vW.xy * ti ) * tw.z;
          } else {
            sampledDiffuseColor = texture2D( map, vMapUv );
          }
          diffuseColor *= sampledDiffuseColor;
        #endif
        float rkWet = 0.0;
        vec3 fungusGlow = vec3( 0.0 );`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        diffuseColor.rgb *= uTint;
        // Strata: a pale stripe every few units on the sides, a darker trough under it.
        float sn = rockNoise( vec3( vW.x * 0.6, vW.y * 0.25, vW.z * 0.6 ) );
        float sb = sin( ( vW.y + sn * uStrata.z ) * uStrata.x );
        float stripe = smoothstep( uStrata.w, 1.0, sb );
        float trough = smoothstep( -0.55, -1.0, sb );
        diffuseColor.rgb = mix( diffuseColor.rgb, diffuseColor.rgb * 1.9 + 0.04, stripe * uStrata.y * sideW );
        diffuseColor.rgb *= 1.0 - trough * uStrata.y * 0.45 * sideW;
        // Edge wear: up-facing ridges and the top lip catch the rim colour, chipped by noise.
        float chip = 0.55 + 0.9 * rockNoise( vW * 3.1 );
        float ridge = smoothstep( 0.55, 0.95, fn.y );
        float lipTop = smoothstep( 0.86, 1.0, vFrac ) * sideW;
        float wear = clamp( ( ridge * uWear.x + lipTop * uWear.y ) * chip, 0.0, 1.0 );
        diffuseColor.rgb = mix( diffuseColor.rgb, uRim * 1.15, wear * 0.55 );
        // Moss and fungus: up from the foot, more toward water, some on the tops.
        float mnz = rockNoise( vW * 1.7 );
        float mossAmt = ( 1.0 - smoothstep( 0.0, uMossP.x, vH ) ) + vWet * uMossP.y + tw.y * 0.45;
        float mm = mossAmt * 1.2 + ( mnz - 0.5 ) * 0.9;
        float mossMask = smoothstep( 0.45, 0.8, mm ) * uMossP.z;
        diffuseColor.rgb = mix( diffuseColor.rgb, uMossCol * 0.75, mossMask );
        float spot = step( 0.74, rockNoise( vW * 6.0 ) ) * smoothstep( 0.3, 0.9, mossAmt * ( mnz + 0.4 ) );
        diffuseColor.rgb = mix( diffuseColor.rgb, uFungusCol, spot * uFungusAmt * 0.4 );
        fungusGlow = uFungusCol * spot * uFungusAmt * 0.35;
        // Wet: darker and glossier near water, with drip streaks down the faces.
        float dn = rockNoise( vec3( ( vW.x + vW.z ) * 3.3, vW.y * 0.22, ( vW.x - vW.z ) * 0.4 ) );
        float drip = smoothstep( 0.6, 0.82, dn ) * sideW * vWet;
        rkWet = clamp( vWet * 0.85 + drip * 0.8, 0.0, 1.0 );
        diffuseColor.rgb *= 1.0 - ( vWet * uWetP.x + drip * uWetP.z );`,
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
        roughnessFactor = mix( roughnessFactor, uWetP.y, rkWet );`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        totalEmissiveRadiance += fungusGlow;`,
      )
      .replace(
        '#include <lights_fragment_end>',
        `#include <lights_fragment_end>
        reflectedLight.indirectDiffuse += diffuseColor.rgb * vTorch * uTorchFlicker;`,
      );
  };
  m.customProgramCacheKey = () => 'hollow-rock-2';
  return m;
}

/** The floor: packed earth on a grid, darker where it meets the rock (vertex colour). */
function floorMaterial(tex: Tex, torch: { value: number }): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({
    map: tex.dirt.map,
    normalMap: tex.dirt.normal,
    normalScale: new THREE.Vector2(0.9, 0.9),
    color: '#8f8a9a',
    roughness: 0.95,
    vertexColors: true,
  });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uTorchFlicker = torch;
    shader.uniforms.uWetP = { value: new THREE.Vector3(R.wet.darken, R.wet.rough, R.wet.drip) };
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        attribute vec3 aTorch;
        attribute float aWet;
        varying float vWet;
        varying vec3 vTorch;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vWet = aWet;
        vTorch = aTorch;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float uTorchFlicker;
        uniform vec3 uWetP;
        varying float vWet;
        varying vec3 vTorch;`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        diffuseColor.rgb *= 1.0 - vWet * uWetP.x;`,
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
        roughnessFactor = mix( roughnessFactor, uWetP.y, vWet * 0.9 );`,
      )
      .replace(
        '#include <lights_fragment_end>',
        `#include <lights_fragment_end>
        reflectedLight.indirectDiffuse += diffuseColor.rgb * vTorch * uTorchFlicker;`,
      );
  };
  m.customProgramCacheKey = () => 'hollow-floor-2';
  return m;
}

const smooth = THREE.MathUtils.smoothstep;

/** A cell-centred field of numbers, sampled bilinearly at a world position. */
class CellField {
  readonly v: Float32Array;
  constructor(
    private readonly f: Floor,
    fill: (x: number, y: number) => number,
    private readonly outside = 0,
  ) {
    this.v = new Float32Array(f.cols * f.rows);
    for (let y = 0; y < f.rows; y++)
      for (let x = 0; x < f.cols; x++) this.v[y * f.cols + x] = fill(x, y);
  }
  at(x: number, y: number): number {
    if (x < 0 || y < 0 || x >= this.f.cols || y >= this.f.rows) return this.outside;
    return this.v[y * this.f.cols + x] ?? this.outside;
  }
  /** Bilinear between cell centres. */
  sample(x: number, z: number): number {
    const gx = x / CELL + this.f.cols / 2 - 0.5;
    const gz = z / CELL + this.f.rows / 2 - 0.5;
    const x0 = Math.floor(gx);
    const y0 = Math.floor(gz);
    const tx = gx - x0;
    const ty = gz - y0;
    return (
      (this.at(x0, y0) * (1 - tx) + this.at(x0 + 1, y0) * tx) * (1 - ty) +
      (this.at(x0, y0 + 1) * (1 - tx) + this.at(x0 + 1, y0 + 1) * tx) * ty
    );
  }
  /** The gradient of the sampled field, as `[d/dx, d/dz]`, in field units a cell. */
  gradient(x: number, z: number): [number, number] {
    const gx = x / CELL + this.f.cols / 2 - 0.5;
    const gz = z / CELL + this.f.rows / 2 - 0.5;
    const x0 = Math.floor(gx);
    const y0 = Math.floor(gz);
    const tx = gx - x0;
    const ty = gz - y0;
    const a = this.at(x0, y0);
    const b = this.at(x0 + 1, y0);
    const c = this.at(x0, y0 + 1);
    const d = this.at(x0 + 1, y0 + 1);
    return [(b - a) * (1 - ty) + (d - c) * ty, (c - a) * (1 - tx) + (d - b) * tx];
  }
}

/** The ground height at a world position: `elevationAt`, with each ledge made steep. */
function groundHeight(f: Floor, x: number, z: number): number {
  const gx = x / CELL + f.cols / 2 - 0.5;
  const gz = z / CELL + f.rows / 2 - 0.5;
  const x0 = Math.floor(gx);
  const y0 = Math.floor(gz);
  const [a, b] = R.ledge;
  const tx = smooth(gx - x0, a, b);
  const ty = smooth(gz - y0, a, b);
  let sum = 0;
  let weight = 0;
  let all = 0;
  for (const [dx, dy, w] of [
    [0, 0, (1 - tx) * (1 - ty)],
    [1, 0, tx * (1 - ty)],
    [0, 1, (1 - tx) * ty],
    [1, 1, tx * ty],
  ] as const) {
    const cx = x0 + dx;
    const cy = y0 + dy;
    const e =
      cx < 0 || cy < 0 || cx >= f.cols || cy >= f.rows ? 0 : (f.elevation[cy * f.cols + cx] ?? 0);
    all += e * 0.25;
    if (!isWalkable(f, cx, cy) || w <= 0) continue;
    sum += e * w;
    weight += w;
  }
  return weight > 0 ? sum / weight : all;
}

/** One block of rock: where it stands, its foot, its resting height. */
interface Wall {
  x: number;
  z: number;
  cx: number;
  cy: number;
  base: number;
  full: number;
  lip: boolean;
}

/** A buffer of vertices that the bakers fill in (`HollowRock.bake`). */
interface BakeJob {
  count: number;
  pos: THREE.BufferAttribute;
  nrm: THREE.BufferAttribute;
  col: THREE.BufferAttribute;
  torch: THREE.BufferAttribute;
  init: Float32Array;
}

/** Growable float arrays for building a mesh. */
class Buf {
  data: number[] = [];
  push(...v: number[]): void {
    for (const n of v) this.data.push(n);
  }
  get floats(): Float32Array {
    return Float32Array.from(this.data);
  }
}

export class HollowRock implements HollowModule {
  /** Shared across floors, so a new floor links no programs. */
  readonly rock: THREE.MeshStandardMaterial;
  readonly earth: THREE.MeshStandardMaterial;
  /** The walls' shadow-pass material (same shaping as the colour pass). */
  readonly depth: THREE.MeshDepthMaterial;
  private readonly u: RockUniforms;
  private readonly objs: THREE.Object3D[] = [];
  private readonly surfaces = new Map<string, Surface>();
  private ctx: HollowCtx | null = null;
  /** The merged wall mesh; `wallH` holds each block's height now, in world units. */
  private wallMesh: THREE.Mesh | null = null;
  private wallH = new Float32Array(0);
  private wallTex: THREE.DataTexture | null = null;
  private walls: Wall[] = [];
  /** Each block's height now, easing toward its target. */
  private cutKey = '';
  private cut: boolean[] = [];
  private lastT = 0;
  private jobs: BakeJob[] = [];
  private jobAt = 0;
  private vertAt = 0;
  private readonly base = new THREE.Color();
  private readonly torch = new THREE.Color();

  constructor(
    private readonly tex: Tex,
    torchFlicker: { value: number } = { value: 1 },
  ) {
    this.u = {
      torch: torchFlicker,
      tri: { value: 1 },
      wallH: { value: placeholderH() },
      tint: { value: new THREE.Color('#ffffff') },
      rim: { value: new THREE.Color('#a494b4') },
      moss: { value: new THREE.Color('#4c6744') },
      fungus: { value: new THREE.Color('#9ad0ff') },
      strata: { value: new THREE.Vector4(2.4, 0.5, 1.6, 0.72) },
      fungusAmt: { value: 0 },
    };
    // Fog-aware (R0153): unseen rock and floor stay dark, so the layout never shows early.
    this.rock = fogged(rockMaterial(tex, this.u));
    this.earth = fogged(floorMaterial(tex, torchFlicker));
    this.depth = wallDepthMaterial(this.u);
    // The governor drops the triplanar blend to the one cheap projection (item 9).
    caveShed.register({ name: 'triplanar', apply: (shed) => (this.u.tri.value = shed ? 0 : 1) });
  }

  /** The painted texture a band's rock wears: sandstone is the shared one, the rest are painted once. */
  private surfaceFor(name: RockTex): Surface {
    if (name === 'sandstone') return this.tex.rock;
    let s = this.surfaces.get(name);
    if (!s) {
      s = surface(name, 256, 5);
      this.surfaces.set(name, s);
    }
    return s;
  }

  /** Run the bakers over every vertex again (a sconce was lit); chunked over the next frames. */
  rebake(): void {
    this.jobAt = 0;
    this.vertAt = 0;
  }

  build(f: Floor, ctx: HollowCtx): void {
    this.ctx = ctx;
    const bi = Math.max(0, GROVE3D.cave.bands.indexOf(ctx.band));
    const look = R.looks[Math.min(bi, R.looks.length - 1)]!;
    const surf = this.surfaceFor(look.tex);
    this.rock.map = surf.map;
    this.rock.normalMap = surf.normal;
    const mix = (hex: string, k: number): THREE.Color => {
      const c = new THREE.Color(hex);
      c.multiplyScalar(1 / Math.max(c.r, c.g, c.b, 0.001));
      return new THREE.Color('#ffffff').lerp(c, k);
    };
    this.u.tint.value.copy(mix(ctx.band.rock, R.tintMix));
    this.u.rim.value.set(ctx.band.rim);
    this.u.moss.value.set(ctx.band.moss);
    this.u.fungus.value.set(ctx.band.crystal);
    this.u.strata.value.set(look.freq, look.amount, look.warp, look.thick);
    this.u.fungusAmt.value = look.fungus;

    const jobs: BakeJob[] = [];
    // Fields over the grid: how near water is (0..1), how open a cell is, how solid.
    const wet = this.wetField(f);
    const open = new CellField(f, (x, y) => (cellAt(f, x, y) === WALL ? 0 : 1));
    const solid = new CellField(f, (x, y) => (cellAt(f, x, y) === WALL ? 1 : 0), 1);
    const vistaCells = this.vistaCells(f);

    jobs.push(this.buildFloor(f, ctx, wet, solid, vistaCells));
    jobs.push(this.buildWalls(f, ctx, wet, open, vistaCells));
    this.jobs = jobs;
    this.rebake();
  }

  /** 0..1 by nearness to a water cell, within `wet.radius` cells. */
  private wetField(f: Floor): CellField {
    const r = R.wet.radius;
    const near = new Float32Array(f.cols * f.rows);
    for (let y = 0; y < f.rows; y++)
      for (let x = 0; x < f.cols; x++) {
        if (cellAt(f, x, y) !== 2) continue;
        for (let dy = -r; dy <= r; dy++)
          for (let dx = -r; dx <= r; dx++) {
            const cx = x + dx;
            const cy = y + dy;
            if (cx < 0 || cy < 0 || cx >= f.cols || cy >= f.rows) continue;
            const w = 1 - Math.hypot(dx, dy) / (r + 0.75);
            const i = cy * f.cols + cx;
            if (w > (near[i] ?? 0)) near[i] = w;
          }
      }
    return new CellField(f, (x, y) => near[y * f.cols + x] ?? 0);
  }

  /** Wall cells that Floor.vistas leaves open onto the chasm (they get a low lip, no floor). */
  private vistaCells(f: Floor): Set<number> {
    const s = new Set<number>();
    for (const v of f.vistas) {
      const along = v.dir === 'n' || v.dir === 's' ? [1, 0] : [0, 1];
      const out =
        v.dir === 'n' ? [0, -1] : v.dir === 's' ? [0, 1] : v.dir === 'w' ? [-1, 0] : [1, 0];
      for (let w = 0; w < v.width; w++)
        for (let d = 1; d <= v.depth; d++) {
          const x = v.cell.x + along[0]! * w + out[0]! * d;
          const y = v.cell.y + along[1]! * w + out[1]! * d;
          if (x >= 0 && y >= 0 && x < f.cols && y < f.rows) s.add(y * f.cols + x);
        }
    }
    return s;
  }

  private buildFloor(
    f: Floor,
    ctx: HollowCtx,
    wet: CellField,
    solid: CellField,
    vistas: Set<number>,
  ): BakeJob {
    const S = R.floorSub;
    const W = f.cols * S + 1;
    const H = f.rows * S + 1;
    const vid = new Int32Array(W * H).fill(-1);
    const pos = new Buf();
    const wetB = new Buf();
    const index: number[] = [];
    const vtx = (i: number, j: number): number => {
      const k = j * W + i;
      let v = vid[k]!;
      if (v < 0) {
        v = pos.data.length / 3;
        vid[k] = v;
        const x = (i / S - f.cols / 2) * CELL;
        const z = (j / S - f.rows / 2) * CELL;
        pos.push(x, groundHeight(f, x, z), z);
        wetB.push(wet.sample(x, z));
      }
      return v;
    };
    const quad = (i: number, j: number, n: number): void => {
      const a = vtx(i, j);
      const b = vtx(i + n, j);
      const c = vtx(i, j + n);
      const d = vtx(i + n, j + n);
      index.push(a, c, b, b, c, d);
    };
    for (let cy = 0; cy < f.rows; cy++)
      for (let cx = 0; cx < f.cols; cx++) {
        if (vistas.has(cy * f.cols + cx)) continue;
        let near = false;
        for (let dy = -1; dy <= 1 && !near; dy++)
          for (let dx = -1; dx <= 1 && !near; dx++)
            if (cellAt(f, cx + dx, cy + dy) !== WALL) near = true;
        if (near) {
          for (let sj = 0; sj < S; sj++)
            for (let si = 0; si < S; si++) quad(cx * S + si, cy * S + sj, 1);
        } else quad(cx * S, cy * S, S);
      }
    const n = pos.data.length / 3;
    const p = pos.floats;
    const col = new Float32Array(n * 3);
    const nrmGeo = new THREE.BufferGeometry();
    nrmGeo.setAttribute('position', new THREE.BufferAttribute(p, 3));
    nrmGeo.setIndex(index);
    nrmGeo.computeVertexNormals();
    const nrm = nrmGeo.attributes.normal as THREE.BufferAttribute;
    const uv = new Float32Array(n * 2);
    const mossC = new THREE.Color(ctx.band.moss);
    const c = new THREE.Color();
    const d = CELL * 0.4;
    for (let i = 0; i < n; i++) {
      const x = p[i * 3]!;
      const y = p[i * 3 + 1]!;
      const z = p[i * 3 + 2]!;
      uv[i * 2] = x / GROVE3D.cave.floorTexel;
      uv[i * 2 + 1] = z / GROVE3D.cave.floorTexel;
      // Darker toward the rock (the old corner count, now smooth).
      const r = solid.sample(x, z);
      let k = r >= 0.999 ? 0.12 : Math.max(0.12, 1 - 4 * GROVE3D.cave.floorAo * r);
      // A ledge: the upper lip a little lighter, the foot a little darker.
      const mean =
        (groundHeight(f, x + d, z) +
          groundHeight(f, x - d, z) +
          groundHeight(f, x, z + d) +
          groundHeight(f, x, z - d)) /
        4;
      k *= 1 + THREE.MathUtils.clamp((y - mean) / (DUNGEON.elev.step * 0.5), -1, 1) * R.ledgeWear;
      c.setRGB(k, k, k);
      // Moss creeping out from the wall foot, broken up by a hash of the position.
      const mossAmt =
        smooth(r, 0.12, 0.65) *
        smooth(cellHash(Math.round(x * 3), Math.round(z * 3), 5) + r * 0.6, 0.35, 0.95);
      c.lerp(mossC, mossAmt * R.moss.floor * 0.6);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('normal', nrm);
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    const colAttr = new THREE.BufferAttribute(col.slice(), 3);
    colAttr.setUsage(THREE.DynamicDrawUsage);
    const torchAttr = new THREE.BufferAttribute(new Float32Array(n * 3), 3);
    torchAttr.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('color', colAttr);
    g.setAttribute('aTorch', torchAttr);
    g.setAttribute('aWet', new THREE.BufferAttribute(wetB.floats, 1));
    g.setIndex(index);
    nrmGeo.dispose();
    const floor = new THREE.Mesh(g, this.earth);
    floor.receiveShadow = true;
    ctx.group.add(floor);
    this.objs.push(floor);
    return {
      count: n,
      pos: g.attributes.position as THREE.BufferAttribute,
      nrm,
      col: colAttr,
      torch: torchAttr,
      init: col,
    };
  }

  private buildWalls(
    f: Floor,
    ctx: HollowCtx,
    wet: CellField,
    open: CellField,
    vistas: Set<number>,
  ): BakeJob {
    // Walls only where rock meets open ground: the solid interior is never seen.
    const built = new Int32Array(f.cols * f.rows).fill(-1);
    const walls: Wall[] = [];
    for (let y = 0; y < f.rows; y++)
      for (let x = 0; x < f.cols; x++) {
        if (cellAt(f, x, y) !== WALL) continue;
        let edge = false;
        let low = Infinity;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            if (cellAt(f, x + dx, y + dy) === WALL) continue;
            edge = true;
            low = Math.min(low, f.elevation[(y + dy) * f.cols + x + dx] ?? 0);
          }
        if (!edge) continue;
        const at = cellCentre(f, { x, y });
        const lip = vistas.has(y * f.cols + x);
        const k = 1 + Math.sin(at.x * 3.1 + at.z * 1.7) * R.wallVary;
        built[y * f.cols + x] = walls.length;
        walls.push({
          x: at.x,
          z: at.z,
          cx: x,
          cy: y,
          base: low - 0.25,
          full: lip ? R.vistaLip : WALL_H * k,
          lip,
        });
      }
    this.walls = walls;
    const pos = new Buf();
    const nrm = new Buf();
    const wallB = new Buf();
    const leanB = new Buf();
    const wetB = new Buf();
    const col = new Buf();
    const index: number[] = [];
    const foot = new THREE.Color('#5a5266');
    const lipC = new THREE.Color('#b0a8be');
    const c = new THREE.Color();
    const half = CELL / 2;
    const emit = (
      w: Wall,
      i: number,
      x: number,
      z: number,
      frac: number,
      nx: number,
      ny: number,
      nz: number,
      tone: THREE.Color,
    ): void => {
      pos.push(x, w.base + frac * w.full, z);
      nrm.push(nx, ny, nz);
      wallB.push(i, frac, w.base);
      const [gx, gz] = w.lip ? [0, 0] : open.gradient(x, z);
      const len = Math.hypot(gx, gz);
      const s = len > 1 ? 1 / len : 1;
      leanB.push(gx * s, gz * s);
      wetB.push(wet.sample(x, z));
      c.copy(foot)
        .lerp(lipC, smooth(frac, 0, 0.45))
        .multiply(tone);
      col.push(c.r, c.g, c.b);
    };
    const tone = new THREE.Color();
    walls.forEach((w, i) => {
      // Each block its own stone: a little warmer or cooler, lighter or darker.
      const h = cellHash(w.x, w.z);
      tone.setRGB(0.8 + h * 0.22, 0.8 + h * 0.18, 0.86 + (1 - h) * 0.16);
      // The top, four quads.
      const t0 = pos.data.length / 3;
      for (let j = 0; j <= 2; j++)
        for (let k = 0; k <= 2; k++)
          emit(w, i, w.x - half + (k * CELL) / 2, w.z - half + (j * CELL) / 2, 1, 0, 1, 0, tone);
      for (let j = 0; j < 2; j++)
        for (let k = 0; k < 2; k++) {
          const a = t0 + j * 3 + k;
          index.push(a, a + 3, a + 1, a + 1, a + 3, a + 4);
        }
      // The sides: finely cut toward open ground, a plain strip toward another block.
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const nx = w.cx + dx;
        const ny = w.cy + dy;
        const isOpen = cellAt(f, nx, ny) !== WALL;
        const nb = nx < 0 || ny < 0 || nx >= f.cols || ny >= f.rows ? -1 : built[ny * f.cols + nx]!;
        if (!isOpen && nb < 0) continue;
        const nu = isOpen ? 2 : 1;
        const nv = isOpen ? R.wallRows : 2;
        // Along the face, starting at a corner, so that the winding faces outward.
        const px = dx !== 0 ? w.x + dx * half : w.x - half;
        const pz = dy !== 0 ? w.z + dy * half : w.z - half;
        const ax = dx !== 0 ? 0 : CELL;
        const az = dx !== 0 ? CELL : 0;
        const flip = -az * dx + ax * dy < 0; // cross(along, up) dotted with the outward normal
        const s0 = pos.data.length / 3;
        for (let j = 0; j <= nv; j++)
          for (let k = 0; k <= nu; k++)
            emit(w, i, px + (ax * k) / nu, pz + (az * k) / nu, j / nv, dx, 0, dy, tone);
        for (let j = 0; j < nv; j++)
          for (let k = 0; k < nu; k++) {
            const a = s0 + j * (nu + 1) + k;
            const b = a + 1;
            const cc = a + nu + 1;
            const d = cc + 1;
            if (flip) index.push(a, cc, b, b, cc, d);
            else index.push(a, b, cc, b, d, cc);
          }
      }
    });
    const n = pos.data.length / 3;
    const g = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(pos.floats, 3);
    const nrmAttr = new THREE.BufferAttribute(nrm.floats, 3);
    const init = col.floats;
    const colAttr = new THREE.BufferAttribute(init.slice(), 3);
    colAttr.setUsage(THREE.DynamicDrawUsage);
    const torchAttr = new THREE.BufferAttribute(new Float32Array(n * 3), 3);
    torchAttr.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('position', posAttr);
    g.setAttribute('normal', nrmAttr);
    g.setAttribute('color', colAttr);
    g.setAttribute('aTorch', torchAttr);
    g.setAttribute('aWall', new THREE.BufferAttribute(wallB.floats, 3));
    g.setAttribute('aLean', new THREE.BufferAttribute(leanB.floats, 2));
    g.setAttribute('aWet', new THREE.BufferAttribute(wetB.floats, 1));
    g.setIndex(index);
    g.computeBoundingSphere();
    if (g.boundingSphere) g.boundingSphere.radius += R.lean + 1;

    // One texel a block: the height each stands at now.
    const rows = Math.max(1, Math.ceil(walls.length / TEX_W));
    this.wallH = new Float32Array(TEX_W * rows);
    walls.forEach((w, i) => (this.wallH[i] = w.full));
    this.wallTex = new THREE.DataTexture(this.wallH, TEX_W, rows, THREE.RedFormat, THREE.FloatType);
    this.wallTex.minFilter = this.wallTex.magFilter = THREE.NearestFilter;
    this.wallTex.needsUpdate = true;
    this.u.wallH.value = this.wallTex;
    this.cut = walls.map(() => false);
    this.cutKey = '';

    const mesh = new THREE.Mesh(g, this.rock);
    mesh.customDepthMaterial = this.depth;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.wallMesh = mesh;
    ctx.group.add(mesh);
    this.objs.push(mesh);
    return { count: n, pos: posAttr, nrm: nrmAttr, col: colAttr, torch: torchAttr, init };
  }

  dispose(): void {
    disposeObjects(this.objs);
    this.wallTex?.dispose();
    this.wallTex = null;
    this.u.wallH.value = placeholderH();
    this.wallMesh = null;
    this.walls = [];
    this.wallH = new Float32Array(0);
    this.cut = [];
    this.cutKey = '';
    this.jobs = [];
  }

  update(t: number, keeper: { x: number; z: number }, fr: HollowFrame): void {
    if (!fr.on) return;
    const dt = Math.min(0.1, Math.max(0, t - this.lastT));
    this.lastT = t;
    this.bake();
    if (fr.camera) this.cutaway(fr.camera, [keeper, ...fr.party], dt);
  }

  /**
   * Run `ctx.bakers` over the vertices for `bakeMs` a frame: each vertex starts from its
   * initial colour, the bakers tint it and add torch light, and the finished range goes to
   * the GPU. A new floor or `rebake()` starts again from the first vertex.
   */
  private bake(): void {
    const ctx = this.ctx;
    if (!ctx || this.jobAt >= this.jobs.length) return;
    const start = performance.now();
    const bakers: Baker[] = ctx.bakers;
    while (this.jobAt < this.jobs.length) {
      const job = this.jobs[this.jobAt]!;
      const from = this.vertAt;
      let i = from;
      const p = job.pos.array as Float32Array;
      const nr = job.nrm.array as Float32Array;
      const cc = job.col.array as Float32Array;
      const tc = job.torch.array as Float32Array;
      while (i < job.count) {
        this.base.setRGB(job.init[i * 3]!, job.init[i * 3 + 1]!, job.init[i * 3 + 2]!);
        this.torch.setRGB(0, 0, 0);
        const x = p[i * 3]!;
        const y = p[i * 3 + 1]!;
        const z = p[i * 3 + 2]!;
        const ny = nr[i * 3 + 1]!;
        for (const b of bakers) b(x, y, z, ny, this.base, this.torch);
        cc[i * 3] = this.base.r;
        cc[i * 3 + 1] = this.base.g;
        cc[i * 3 + 2] = this.base.b;
        tc[i * 3] = this.torch.r;
        tc[i * 3 + 1] = this.torch.g;
        tc[i * 3 + 2] = this.torch.b;
        i++;
        if ((i & 255) === 0 && performance.now() - start > R.bakeMs) break;
      }
      if (i > from) {
        job.col.addUpdateRange(from * 3, (i - from) * 3);
        job.col.needsUpdate = true;
        job.torch.addUpdateRange(from * 3, (i - from) * 3);
        job.torch.needsUpdate = true;
      }
      if (i >= job.count) {
        this.jobAt++;
        this.vertAt = 0;
      } else {
        this.vertAt = i;
        return;
      }
    }
  }

  /**
   * Sink every wall between the camera and a party member (and any right beside one, on
   * the camera's side), and stand the rest back up, easing at `cutPerSec` so a wall slides
   * down rather than vanishing. The cut set is worked out again only when someone crosses
   * a cell or the camera turns; the height texture is rewritten only while a block moves.
   * A vista's lip is never cut.
   */
  private cutaway(
    camera: THREE.Vector3,
    party: ReadonlyArray<{ x: number; z: number }>,
    dt: number,
  ): void {
    if (!this.wallMesh || !this.wallTex) return;
    const key = `${Math.round(camera.x * 2)},${Math.round(camera.z * 2)}|${party
      .map((p) => `${Math.round(p.x / (CELL / 2))},${Math.round(p.z / (CELL / 2))}`)
      .join(';')}`;
    if (key !== this.cutKey) {
      this.cutKey = key;
      this.cut = this.walls.map(
        (w) =>
          !w.lip &&
          party.some((p) => {
            const dx = camera.x - p.x;
            const dz = camera.z - p.z;
            const len2 = dx * dx + dz * dz || 1;
            const t = ((w.x - p.x) * dx + (w.z - p.z) * dz) / len2;
            if (t <= 0) return false;
            const k = Math.min(1, t);
            return Math.hypot(w.x - (p.x + dx * k), w.z - (p.z + dz * k)) < CUT_RADIUS;
          }),
      );
    }
    const { cutHeight, cutPerSec } = GROVE3D.cave;
    const step = cutPerSec * dt;
    let moved = false;
    this.walls.forEach((w, i) => {
      const want = this.cut[i] ? cutHeight * w.full : w.full;
      const now = this.wallH[i]!;
      if (now === want) return;
      // `cutPerSec` is a share of full height a second.
      const s = step * w.full;
      this.wallH[i] = Math.abs(want - now) <= s ? want : now + Math.sign(want - now) * s;
      moved = true;
    });
    if (moved) this.wallTex.needsUpdate = true;
  }
}
