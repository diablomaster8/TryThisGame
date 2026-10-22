import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';
import { cellAt, cellCentre, WALL, type Floor } from '../sim/dungeon';
import type { Tex } from '../samples/aaa-kit';
import {
  CELL,
  WALL_H,
  cellHash,
  disposeObjects,
  type HollowCtx,
  type HollowFrame,
  type HollowModule,
} from './hollow-ctx';

/**
 * The Hollow's rock: the earth floor, the wall blocks (one InstancedMesh, bent by a
 * world-space noise, moss on the tops) and the cutaway that sinks any wall standing between
 * the camera and the party. Owns the rock and earth materials, shared across floors.
 */

/** Walls closer than this to the line from a party member to the camera are cut down. */
const CUT_RADIUS = CELL * 0.95;

/**
 * A rock block: a box cut into a few rows so the noise in `rockMaterial` can bend it, dark
 * at the foot and pale at the lip (vertex colour, eased so the band sits low).
 */
export function wallGeometry(): THREE.BoxGeometry {
  const g = new THREE.BoxGeometry(CELL, WALL_H, CELL, 2, 4, 2);
  const pos = g.attributes.position!;
  const foot = new THREE.Color('#24212c');
  const lip = new THREE.Color('#a29eae');
  const c = new THREE.Color();
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const up = pos.getY(i) / WALL_H + 0.5;
    c.copy(foot).lerp(lip, THREE.MathUtils.smoothstep(up, 0, 0.85));
    c.toArray(colors, i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return g;
}

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

/**
 * The cave's rock: the painted rock texture laid on from the world position (top faces
 * from above, sides from the side, so no two blocks repeat and a cut-down wall is not
 * squashed), the block bent by a world-space noise (corners shared by two blocks move
 * together, so the wall never gaps) and faceted by flat shading, moss on the tops. One
 * program for every floor; the blocks are an InstancedMesh scaled only in height.
 */
function rockMaterial(tex: Tex): THREE.MeshStandardMaterial {
  const { rockAmp, rockTexel, moss } = GROVE3D.cave;
  const m = new THREE.MeshStandardMaterial({
    map: tex.rock.map,
    normalMap: tex.rock.normal,
    normalScale: new THREE.Vector2(1.1, 1.1),
    roughness: 0.95,
    vertexColors: true,
    flatShading: true,
  });
  const mc = new THREE.Color(moss.color);
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${ROCK_NOISE}\nvarying float vMoss;`)
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        {
          mat4 inst = mat4( 1.0 );
          #ifdef USE_INSTANCING
            inst = instanceMatrix;
          #endif
          vec4 rw = modelMatrix * inst * vec4( transformed, 1.0 );
          vec3 bend = rockBend( rw.xyz * 1.25 ) * ${glsl(rockAmp)};
          // The foot stays on the floor; the bend grows up the wall.
          bend.y *= clamp( rw.y / 0.8, 0.0, 1.0 ) * 0.6;
          bend.xz *= 0.55 + 0.45 * clamp( rw.y / 1.2, 0.0, 1.0 );
          transformed += vec3( bend.x, bend.y / max( inst[ 1 ][ 1 ], 0.05 ), bend.z );
          rw.xyz += bend;
          vec3 an = abs( normal );
          vec2 tuv = an.y > 0.5 ? rw.xz : an.x > an.z ? rw.zy : rw.xy;
          tuv /= ${glsl(rockTexel)};
          #ifdef USE_MAP
            vMapUv = tuv;
          #endif
          #ifdef USE_NORMALMAP
            vNormalMapUv = tuv;
          #endif
          vMoss = normal.y > 0.5 ? rockNoise( rw.xyz * 1.7 ) : 0.0;
        }`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vMoss;')
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        diffuseColor.rgb = mix( diffuseColor.rgb, vec3( ${glsl(mc.r)}, ${glsl(mc.g)}, ${glsl(mc.b)} ), smoothstep( 0.5, 0.75, vMoss ) * ${glsl(moss.amount)} );`,
      );
  };
  m.customProgramCacheKey = () => 'hollow-rock';
  return m;
}

/** The floor: packed earth on a grid, darker where it meets the rock (vertex colour). */
function floorMaterial(tex: Tex): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: tex.dirt.map,
    normalMap: tex.dirt.normal,
    normalScale: new THREE.Vector2(0.9, 0.9),
    color: '#8f8a9a',
    roughness: 0.95,
    vertexColors: true,
  });
}

/**
 * The floor grid, one vertex per cell corner: the shade at a corner falls with the rock
 * cells that touch it (deep inside the rock, where no wall is built, it is near black).
 */
function floorGeometry(f: Floor): THREE.BufferGeometry {
  const { floorTexel, floorAo } = GROVE3D.cave;
  const nx = f.cols + 1;
  const nz = f.rows + 1;
  const pos = new Float32Array(nx * nz * 3);
  const nrm = new Float32Array(nx * nz * 3);
  const uv = new Float32Array(nx * nz * 2);
  const col = new Float32Array(nx * nz * 3);
  for (let iz = 0; iz < nz; iz++)
    for (let ix = 0; ix < nx; ix++) {
      const i = iz * nx + ix;
      const x = (ix - f.cols / 2) * CELL;
      const z = (iz - f.rows / 2) * CELL;
      pos.set([x, 0, z], i * 3);
      nrm.set([0, 1, 0], i * 3);
      uv.set([x / floorTexel, z / floorTexel], i * 2);
      let rock = 0;
      for (const [dx, dz] of [
        [-1, -1],
        [0, -1],
        [-1, 0],
        [0, 0],
      ] as const)
        if (cellAt(f, ix + dx, iz + dz) === WALL) rock++;
      const k = rock === 4 ? 0.12 : 1 - rock * floorAo;
      col.set([k, k, k], i * 3);
    }
  const index: number[] = [];
  for (let iz = 0; iz < f.rows; iz++)
    for (let ix = 0; ix < f.cols; ix++) {
      const a = iz * nx + ix;
      const c = a + nx;
      index.push(a, c, a + 1, a + 1, c, c + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setIndex(index);
  return g;
}

export class HollowRock implements HollowModule {
  /** Shared across floors, so a new floor links no programs. */
  readonly rock: THREE.MeshStandardMaterial;
  readonly earth: THREE.MeshStandardMaterial;
  private readonly objs: THREE.Object3D[] = [];
  /** The rock blocks, their resting heights, and which are cut down now (see `cutaway`). */
  private wallMesh: THREE.InstancedMesh | null = null;
  private wallAt: THREE.Vector3[] = [];
  private wallK: number[] = [];
  /** Each block's height now, as a share of full, easing toward its target. */
  private wallNow: number[] = [];
  private cutKey = '';
  private cut: boolean[] = [];
  private lastT = 0;

  constructor(tex: Tex) {
    this.rock = rockMaterial(tex);
    this.earth = floorMaterial(tex);
  }

  build(f: Floor, ctx: HollowCtx): void {
    const floor = new THREE.Mesh(floorGeometry(f), this.earth);
    floor.receiveShadow = true;
    ctx.group.add(floor);
    this.objs.push(floor);
    // Walls only where rock meets open ground: the solid interior is never seen.
    const walls: THREE.Vector3[] = [];
    for (let y = 0; y < f.rows; y++)
      for (let x = 0; x < f.cols; x++) {
        if (cellAt(f, x, y) !== WALL) continue;
        let edge = false;
        for (let dy = -1; dy <= 1 && !edge; dy++)
          for (let dx = -1; dx <= 1 && !edge; dx++)
            if (cellAt(f, x + dx, y + dy) !== WALL) edge = true;
        const at = cellCentre(f, { x, y });
        if (edge) walls.push(new THREE.Vector3(at.x, 0, at.z));
      }
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const wallMesh = new THREE.InstancedMesh(wallGeometry(), this.rock, walls.length);
    const tone = new THREE.Color();
    walls.forEach((p, i) => {
      // Uneven tops so the rock does not read as a hedge.
      const k = 0.8 + ((Math.sin(p.x * 3.1 + p.z * 1.7) + 1) / 2) * 0.45;
      s.set(1, k, 1);
      wallMesh.setMatrixAt(i, m4.compose(new THREE.Vector3(p.x, (WALL_H * k) / 2, p.z), q, s));
      // Each block its own stone: a little warmer or cooler, lighter or darker.
      const w = cellHash(p.x, p.z);
      tone.setRGB(0.8 + w * 0.22, 0.8 + w * 0.18, 0.86 + (1 - w) * 0.16);
      wallMesh.setColorAt(i, tone);
      this.wallK.push(k);
      this.wallNow.push(k);
      this.cut.push(false);
    });
    this.wallMesh = wallMesh;
    this.wallAt = walls;
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    ctx.group.add(wallMesh);
    this.objs.push(wallMesh);
  }

  dispose(): void {
    disposeObjects(this.objs);
    this.wallMesh = null;
    this.wallAt = [];
    this.wallK = [];
    this.wallNow = [];
    this.cut = [];
    this.cutKey = '';
  }

  update(t: number, keeper: { x: number; z: number }, fr: HollowFrame): void {
    if (!fr.on) return;
    const dt = Math.min(0.1, Math.max(0, t - this.lastT));
    this.lastT = t;
    if (fr.camera) this.cutaway(fr.camera, [keeper, ...fr.party], dt);
  }

  /**
   * Sink every wall between the camera and a party member (and any right beside one, on
   * the camera's side), and stand the rest back up, easing at `cutPerSec` so a wall slides
   * down rather than vanishing. The cut set is worked out again only when someone crosses
   * a cell or the camera turns; matrices are rewritten only while a block is moving.
   */
  private cutaway(
    camera: THREE.Vector3,
    party: ReadonlyArray<{ x: number; z: number }>,
    dt: number,
  ): void {
    const mesh = this.wallMesh;
    if (!mesh) return;
    const key = `${Math.round(camera.x * 2)},${Math.round(camera.z * 2)}|${party
      .map((p) => `${Math.round(p.x / (CELL / 2))},${Math.round(p.z / (CELL / 2))}`)
      .join(';')}`;
    if (key !== this.cutKey) {
      this.cutKey = key;
      this.cut = this.wallAt.map((w) =>
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
    const m4 = this.m4;
    const s = this.sv;
    const at = this.av;
    this.wallAt.forEach((p, i) => {
      const want = this.cut[i] ? cutHeight : this.wallK[i]!;
      const now = this.wallNow[i]!;
      if (now === want) return;
      const next = Math.abs(want - now) <= step ? want : now + Math.sign(want - now) * step;
      this.wallNow[i] = next;
      s.set(1, next, 1);
      mesh.setMatrixAt(i, m4.compose(at.set(p.x, (WALL_H * next) / 2, p.z), this.q0, s));
      moved = true;
    });
    if (moved) mesh.instanceMatrix.needsUpdate = true;
    // The bounds three culls by were taken at full height; a cut wall only ever shrinks.
  }

  private readonly m4 = new THREE.Matrix4();
  private readonly q0 = new THREE.Quaternion();
  private readonly sv = new THREE.Vector3();
  private readonly av = new THREE.Vector3();
}
