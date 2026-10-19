import * as THREE from 'three';
import { DUNGEON, GROVE3D } from '../config/tuning';
import { cellAt, cellCentre, WALL, WATER, type Floor } from '../sim/dungeon';
import type { DungeonRun } from '../sim/types';
import type { Tex } from '../samples/aaa-kit';
import { paintedWater, type PaintedWater } from './water';

/**
 * A Hollow Below floor in 3D, built from the sim's `Floor` (`sim/dungeon.ts`): rock walls
 * on the cells that border the open ground, a stone floor, still water in the wet cells,
 * the stairs up and down, the chest (open once looted), torches and glowing crystals, and
 * the loot still lying about (shaped as the pixel view paints it, `render/paint/dungeon.ts`).
 * Light comes from four point lights (the most a phone frame affords, review C item 6): the
 * Keeper's own lamp, as in the pixel view, and three that follow the torches nearest the
 * Keeper, so the light count never changes while underground. Their
 * programs differ from the Grove's (the lamps, no lanterns), so the scene links
 * them in the background with `withLamps` and the hidden `samples` (see grove-3d-scene.ts).
 * Picks use the pixel view's kinds: `stairs` (`up`/`down`), `chest`, `loot`.
 *
 * The cave kit (art pass 2): rock blocks bent by a world-space noise and faceted, the
 * painted rock texture laid on from the world position, moss on the tops, each block its
 * own tone; an earth floor darkened where it meets the rock; loose stones and spikes along
 * the walls; the painted water in the pools. Any wall standing between the camera and the
 * Keeper or a partner sinks to a low stub, smoothly, and rises again once passed, so the
 * party is never hidden behind it (review C, item 10).
 */
const CELL = DUNGEON.cell;
const WALL_H = 2.4;
/** The Keeper's lamp and the three torch lamps. */
const LAMPS = 4;

const mat = (color: string, o: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.9, ...o });

/**
 * A rock block: a box cut into a few rows so the noise in `rockMaterial` can bend it, dark
 * at the foot and pale at the lip (vertex colour, eased so the band sits low).
 */
function wallGeometry(): THREE.BoxGeometry {
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

/** Loose stones and the odd spike: flat-shaded rock with plain UVs. */
function stoneMaterial(tex: Tex): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: tex.rock.map,
    color: '#9a8c94',
    roughness: 0.95,
    flatShading: true,
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

/**
 * The still pools, one mesh over every wet cell, carrying the painted water's `depth`:
 * zero at a corner that touches dry ground, so foam rings the shore.
 */
function poolGeometry(f: Floor): THREE.BufferGeometry | null {
  const wet = (x: number, y: number) => cellAt(f, x, y) === WATER;
  const corners = new Map<number, number>();
  const pos: number[] = [];
  const depth: number[] = [];
  const index: number[] = [];
  const corner = (ix: number, iz: number): number => {
    const key = iz * (f.cols + 1) + ix;
    const had = corners.get(key);
    if (had !== undefined) return had;
    const i = pos.length / 3;
    corners.set(key, i);
    pos.push((ix - f.cols / 2) * CELL, 0.04, (iz - f.rows / 2) * CELL);
    const all = wet(ix - 1, iz - 1) && wet(ix, iz - 1) && wet(ix - 1, iz) && wet(ix, iz);
    depth.push(all ? 0.8 : 0);
    return i;
  };
  for (let y = 0; y < f.rows; y++)
    for (let x = 0; x < f.cols; x++) {
      if (!wet(x, y)) continue;
      const a = corner(x, y);
      const b = corner(x + 1, y);
      const c = corner(x, y + 1);
      const d = corner(x + 1, y + 1);
      index.push(a, c, b, b, c, d);
    }
  if (!index.length) return null;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('depth', new THREE.Float32BufferAttribute(depth, 1));
  g.setIndex(index);
  return g;
}

/** A repeatable hash of a cell, 0..1, for placing stones. */
const cellHash = (x: number, y: number, k = 0): number => {
  const v = Math.sin(x * 12.9898 + y * 78.233 + k * 37.719) * 43758.5453;
  return v - Math.floor(v);
};

/** Walls closer than this to the line from a party member to the camera are cut down. */
const CUT_RADIUS = CELL * 0.95;

/** Loot as the pixel floor paints it: a little heap of shells, a grey stone, a sprouting
 * seed, a violet essence crystal, a critter in a bubble, a speckled egg. */
function lootModel(kind: string): THREE.Object3D {
  const g = new THREE.Group();
  const add = (geo: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) => {
    const o = new THREE.Mesh(geo, m);
    o.position.set(x, y, z);
    o.castShadow = true;
    g.add(o);
    return o;
  };
  if (kind === 'shells') {
    const gold = mat('#f2d34c', { metalness: 0.6, roughness: 0.35 });
    const geo = new THREE.SphereGeometry(0.09, 10, 8);
    for (const [x, z] of [
      [-0.1, 0.05],
      [0.08, 0.09],
      [-0.02, -0.08],
      [0.12, -0.06],
    ] as const)
      add(geo, gold, x, -0.12, z).scale.set(1, 0.45, 0.8);
  } else if (kind === 'stone') {
    add(new THREE.DodecahedronGeometry(0.16), mat('#8a8a98', { flatShading: true })).scale.set(
      1,
      0.7,
      0.85,
    );
  } else if (kind === 'seed') {
    add(new THREE.SphereGeometry(0.11, 12, 10), mat('#8a5a32', { roughness: 0.6 })).scale.set(
      0.85,
      1.1,
      0.85,
    );
    add(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 5), mat('#4a9c42'), 0.03, 0.17, 0);
    add(new THREE.SphereGeometry(0.05, 8, 6), mat('#8fd262'), 0.07, 0.24, 0).scale.set(
      1.4,
      0.5,
      0.8,
    );
  } else if (kind === 'essence') {
    const glow = { emissive: '#b58cff', emissiveIntensity: 0.9, roughness: 0.25 };
    add(new THREE.ConeGeometry(0.11, 0.34, 6), mat('#b58cff', glow), 0, 0.02, 0);
    add(new THREE.CylinderGeometry(0.13, 0.13, 0.03, 12), mat('#7a5ad0'), 0, -0.16, 0);
  } else if (kind === 'critter') {
    add(new THREE.SphereGeometry(0.08, 10, 8), mat('#3a3346'));
    const eye = mat('#ffffff', { emissive: '#ffffff', emissiveIntensity: 0.4 });
    const dot = new THREE.SphereGeometry(0.018, 6, 4);
    add(dot, eye, -0.03, 0.02, 0.07);
    add(dot, eye, 0.03, 0.02, 0.07);
    const bubble = add(
      new THREE.SphereGeometry(0.2, 16, 12),
      mat('#9ad0ff', {
        emissive: '#9ad0ff',
        emissiveIntensity: 0.5,
        roughness: 0.1,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      }),
    );
    bubble.castShadow = false;
  } else {
    add(new THREE.SphereGeometry(0.2, 14, 10), mat('#f3efe2', { roughness: 0.5 })).scale.set(
      0.85,
      1.1,
      0.85,
    );
    const speck = mat('#c9a0ff');
    const geo = new THREE.SphereGeometry(0.025, 6, 4);
    for (let i = 0; i < 6; i++) {
      const a = i * 2.4;
      const y = -0.1 + (i % 3) * 0.09;
      const r = Math.sqrt(Math.max(0, 1 - (y / 0.22) ** 2)) * 0.165;
      add(geo, speck, Math.cos(a) * r, y, Math.sin(a) * r);
    }
  }
  return g;
}

export class Hollow {
  readonly group = new THREE.Group();
  private floor: Floor | null = null;
  private readonly lamps: THREE.PointLight[] = [];
  private torchAt: THREE.Vector3[] = [];
  private chestLid: THREE.Object3D | null = null;
  /** The rock blocks, their resting heights, and which are cut down now (see `cutaway`). */
  private wallMesh: THREE.InstancedMesh | null = null;
  private wallAt: THREE.Vector3[] = [];
  private wallK: number[] = [];
  /** Each block's height now, as a share of full, easing toward its target. */
  private wallNow: number[] = [];
  private cutKey = '';
  private cut: boolean[] = [];
  private lastT = 0;
  private flames: THREE.Mesh[] = [];
  /** Shared across floors, so a new floor links no programs. */
  private readonly rock: THREE.MeshStandardMaterial;
  private readonly earth: THREE.MeshStandardMaterial;
  private readonly stone: THREE.MeshStandardMaterial;
  private readonly water: PaintedWater;
  private readonly loot = new Map<string, THREE.Object3D>();
  private readonly picks: Array<[THREE.Vector3, 'stairs' | 'chest' | 'loot', string, number]> = [];
  /**
   * One hidden mesh per program kind a floor uses (plain, flat-shaded and plain
   * instanced), so the cave programs can link before the first floor exists.
   */
  readonly samples = new THREE.Group();
  /** The shadow pass's depth programs for those (never drawn, never in the scene). */
  readonly shadowSamples = new THREE.Group();

  constructor(
    parent: THREE.Object3D,
    tex: Tex,
    private readonly sky: { sun: THREE.DirectionalLight; hemi: THREE.HemisphereLight },
  ) {
    this.rock = rockMaterial(tex);
    this.earth = floorMaterial(tex);
    this.stone = stoneMaterial(tex);
    this.water = paintedWater(0, 0.55);
    this.group.name = 'hollow';
    this.group.visible = false;
    parent.add(this.group);
    for (let i = 0; i < LAMPS; i++) {
      // Hidden above ground: four more lights on every Grove material would cost each frame;
      // the one recompile happens on the way down the stairs.
      const l = new THREE.PointLight('#ffa850', 0, 9, 1.6);
      l.visible = false;
      this.lamps.push(l);
      parent.add(l);
    }
    const box = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const wallSample = new THREE.InstancedMesh(wallGeometry(), this.rock, 1);
    wallSample.setColorAt(0, new THREE.Color('#ffffff'));
    const pool = new THREE.BufferGeometry();
    pool.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([0, 0, 0, 0.1, 0, 0, 0, 0, 0.1], 3),
    );
    pool.setAttribute('depth', new THREE.Float32BufferAttribute([0, 0, 0], 1));
    this.samples.add(
      new THREE.Mesh(box, mat('#4a4450')),
      wallSample,
      new THREE.Mesh(box, this.earth),
      new THREE.InstancedMesh(box, this.stone, 1),
      new THREE.Mesh(pool, this.water.material),
    );
    this.samples.traverse((o) => (o.castShadow = o.receiveShadow = true));
    // And a textured sprite, as the emote balls are, which may first appear underground.
    const dot = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
    this.samples.add(new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, fog: false })));
    // The shadow pass draws casters with its own depth material (back faces), which
    // `compile` never sees; these match it when compiled as the pass draws (see the scene).
    const depth = new THREE.MeshDepthMaterial({ side: THREE.BackSide });
    this.shadowSamples.add(new THREE.Mesh(box, depth), new THREE.InstancedMesh(box, depth, 1));
    this.samples.visible = false;
    parent.add(this.samples);
  }

  /** Whether the torch lamps are on (a floor is showing). */
  get lit(): boolean {
    return this.lamps[0]!.visible;
  }

  /** Run `fn` with the lamps counted as on or off; for compiling another place's set. */
  withLamps<T>(on: boolean, fn: () => T): T {
    const was = this.lamps.map((l) => l.visible);
    for (const l of this.lamps) l.visible = on;
    try {
      return fn();
    } finally {
      this.lamps.forEach((l, i) => (l.visible = was[i]!));
    }
  }

  /** Build (or clear) the floor; called when the sim enters or leaves a floor. */
  set(f: Floor | null): void {
    if (f === this.floor) return;
    this.floor = f;
    for (const c of [...this.group.children]) {
      c.removeFromParent();
      c.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
      });
    }
    this.loot.clear();
    this.picks.length = 0;
    this.torchAt = [];
    this.chestLid = null;
    this.wallMesh = null;
    this.wallAt = [];
    this.wallK = [];
    this.wallNow = [];
    this.cut = [];
    this.flames = [];
    this.cutKey = '';
    if (f) this.build(f);
  }

  private build(f: Floor): void {
    const floor = new THREE.Mesh(floorGeometry(f), this.earth);
    floor.receiveShadow = true;
    this.group.add(floor);
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
    this.group.add(wallMesh);
    // Loose stones and spikes on the open cells that touch the rock, leaned against it;
    // never on a cell with something to tap.
    const busy = new Set(
      [f.stairsUp, f.stairsDown, f.chest, ...f.torches, ...f.loot.map((l) => l.cell)]
        .filter((c): c is NonNullable<typeof c> => !!c)
        .map((c) => `${c.x},${c.y}`),
    );
    const stones: THREE.Matrix4[] = [];
    const spikes: THREE.Matrix4[] = [];
    const { rubbleShare, spikeShare } = GROVE3D.cave;
    const e = new THREE.Euler();
    for (let y = 0; y < f.rows; y++)
      for (let x = 0; x < f.cols; x++) {
        const c = cellAt(f, x, y);
        if (c === WALL || c === WATER || busy.has(`${x},${y}`)) continue;
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ] as const) {
          if (cellAt(f, x + dx, y + dy) !== WALL) continue;
          const at = cellCentre(f, { x, y });
          const h1 = cellHash(x * 2 + dx, y * 2 + dy, 1);
          const along = (cellHash(x, y, 2 + dx + dy * 3) - 0.5) * CELL * 0.7;
          const px = at.x + dx * CELL * 0.38 + dy * along;
          const pz = at.z + dy * CELL * 0.38 + dx * along;
          if (h1 < rubbleShare) {
            const n = 1 + Math.floor(cellHash(x, y, 7 + dx) * 3);
            for (let i = 0; i < n; i++) {
              const r = 0.07 + cellHash(x + i, y, 9) * 0.12;
              const ox = (cellHash(x, y + i, 11) - 0.5) * 0.5;
              const oz = (cellHash(x + i, y + i, 13) - 0.5) * 0.5;
              e.set(cellHash(i, x, 3) * 3, cellHash(y, i, 5) * 6, 0);
              stones.push(
                new THREE.Matrix4().compose(
                  new THREE.Vector3(px + ox * 0.6, r * 0.45, pz + oz * 0.6),
                  q.clone().setFromEuler(e),
                  new THREE.Vector3(r, r * 0.7, r),
                ),
              );
            }
          } else if (h1 < rubbleShare + spikeShare) {
            const tall = 0.45 + cellHash(x, y, 17) * 0.65;
            const r = 0.13 + cellHash(y, x, 19) * 0.1;
            spikes.push(
              new THREE.Matrix4().compose(
                new THREE.Vector3(px, tall / 2 - 0.02, pz),
                q.clone().setFromEuler(e.set((cellHash(x, y, 23) - 0.5) * 0.25, 0, 0)),
                new THREE.Vector3(r, tall, r),
              ),
            );
          }
        }
      }
    const scatter = (geo: THREE.BufferGeometry, list: THREE.Matrix4[], shadow: boolean) => {
      if (!list.length) return;
      const im = new THREE.InstancedMesh(geo, this.stone, list.length);
      list.forEach((m, i) => im.setMatrixAt(i, m));
      im.castShadow = shadow;
      im.receiveShadow = true;
      this.group.add(im);
    };
    scatter(new THREE.DodecahedronGeometry(1, 0), stones, false);
    scatter(new THREE.ConeGeometry(1, 1, 6, 2), spikes, true);
    const pool = poolGeometry(f);
    if (pool) this.group.add(new THREE.Mesh(pool, this.water.material));
    // Stairs: steps rising for the way up, a dark well with a rim for the way down.
    const up = cellCentre(f, f.stairsUp);
    const steps = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const st = new THREE.Mesh(
        new THREE.BoxGeometry(CELL * 0.8, 0.18 * (i + 1), CELL * 0.22),
        mat('#8a8490'),
      );
      st.position.set(0, 0.09 * (i + 1), -CELL * 0.3 + i * CELL * 0.2);
      steps.add(st);
    }
    steps.position.set(up.x, 0, up.z);
    this.group.add(steps);
    this.picks.push([new THREE.Vector3(up.x, 0.4, up.z), 'stairs', 'up', 0.9]);
    if (f.stairsDown) {
      const dn = cellCentre(f, f.stairsDown);
      const hole = new THREE.Mesh(new THREE.CircleGeometry(CELL * 0.38, 20), mat('#05040a'));
      hole.rotation.x = -Math.PI / 2;
      hole.position.set(dn.x, 0.03, dn.z);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(CELL * 0.4, 0.08, 8, 24), mat('#8a8490'));
      rim.rotation.x = -Math.PI / 2;
      rim.position.set(dn.x, 0.06, dn.z);
      this.group.add(hole, rim);
      this.picks.push([new THREE.Vector3(dn.x, 0.2, dn.z), 'stairs', 'down', 0.9]);
    }
    // The chest.
    const ch = cellCentre(f, f.chest);
    const chest = new THREE.Group();
    chest.add(new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.45), mat('#8a5a2a')));
    chest.children[0]!.position.y = 0.2;
    const lid = new THREE.Group();
    const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.14, 0.47), mat('#a06a32'));
    lidMesh.position.set(0, 0.07, 0.235);
    lid.add(lidMesh);
    lid.position.set(0, 0.4, -0.235);
    chest.add(lid);
    const band = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.42, 0.47),
      mat('#e0c060', { metalness: 0.8, roughness: 0.3 }),
    );
    band.position.y = 0.21;
    chest.add(band);
    chest.position.set(ch.x, 0, ch.z);
    chest.traverse((o) => (o.castShadow = true));
    this.chestLid = lid;
    this.group.add(chest);
    this.picks.push([new THREE.Vector3(ch.x, 0.3, ch.z), 'chest', 'chest', 0.6]);
    // Torches: a post, a flame that glows; the lamps follow the nearest four.
    const flame = mat('#ffd080', { emissive: '#ff9a30', emissiveIntensity: 3 });
    for (const t of f.torches) {
      const p = cellCentre(f, t);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.1, 6), mat('#5a3a22'));
      post.position.set(p.x, 0.55, p.z);
      const fire = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 8), flame);
      fire.position.set(p.x, 1.25, p.z);
      this.flames.push(fire);
      this.group.add(post, fire);
      this.torchAt.push(new THREE.Vector3(p.x, 1.4, p.z));
    }
    const crystal = mat('#9ae8ff', { emissive: '#4ac8ff', emissiveIntensity: 1.4, roughness: 0.2 });
    for (const c of f.crystals) {
      const p = cellCentre(f, c);
      for (let i = 0; i < 3; i++) {
        const k = new THREE.Mesh(new THREE.OctahedronGeometry(0.16 + i * 0.05), crystal);
        k.scale.y = 2;
        k.position.set(
          p.x + Math.cos(i * 2.1) * 0.2,
          0.3 + i * 0.05,
          p.z + Math.sin(i * 2.1) * 0.2,
        );
        k.rotation.z = (i - 1) * 0.3;
        this.group.add(k);
      }
    }
    for (const l of f.loot) {
      const p = cellCentre(f, l.cell);
      const m = lootModel(l.kind);
      m.position.set(p.x, 0.25, p.z);
      this.group.add(m);
      this.loot.set(l.id, m);
      this.picks.push([m.position, 'loot', l.id, 0.45]);
    }
  }

  update(
    run: DungeonRun | null,
    keeper: { x: number; z: number },
    t: number,
    camera?: THREE.Vector3,
    party: ReadonlyArray<{ x: number; z: number }> = [],
  ): void {
    const on = !!this.floor && !!run;
    this.group.visible = on;
    for (const l of this.lamps) {
      l.intensity = 0;
      l.visible = on;
    }
    if (!on || !run) return;
    for (const [id, m] of this.loot) {
      m.visible = !run.taken.includes(id);
      m.position.y = 0.25 + Math.sin(t * 2 + m.position.x) * 0.04;
      m.rotation.y = t * 0.8;
    }
    if (this.chestLid) this.chestLid.rotation.x = run.chestOpen ? -1.9 : 0;
    const dt = Math.min(0.1, Math.max(0, t - this.lastT));
    this.lastT = t;
    if (camera) this.cutaway(camera, [keeper, ...party], dt);
    this.water.update(t, this.sky.sun, this.sky.hemi);
    this.flames.forEach((fl, i) => {
      const k = 1 + Math.sin(t * 11 + i * 1.7) * 0.08 + Math.sin(t * 23 + i) * 0.05;
      fl.scale.set(2 - k, k, 2 - k);
    });
    // The Keeper carries a lamp, as in the pixel view; the other three go to the torches
    // nearest the Keeper, flickering a little.
    const own = this.lamps[0]!;
    own.color.set('#fff0d0');
    own.position.set(keeper.x, 1.8, keeper.z);
    own.intensity = GROVE3D.keeperLamp;
    const near = [...this.torchAt]
      .sort(
        (a, b) =>
          Math.hypot(a.x - keeper.x, a.z - keeper.z) - Math.hypot(b.x - keeper.x, b.z - keeper.z),
      )
      .slice(0, LAMPS - 1);
    near.forEach((p, i) => {
      const l = this.lamps[i + 1]!;
      l.position.copy(p);
      l.intensity = 16 + Math.sin(t * 13 + i * 2) * 2;
    });
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

  pick(
    ray: THREE.Ray,
    run: DungeonRun | null,
  ): { kind: 'stairs' | 'chest' | 'loot'; id: string; d: number } | null {
    if (!this.group.visible) return null;
    const sphere = new THREE.Sphere();
    const hit = new THREE.Vector3();
    let best: { kind: 'stairs' | 'chest' | 'loot'; id: string; d: number } | null = null;
    for (const [c, kind, id, r] of this.picks) {
      if (kind === 'loot' && run?.taken.includes(id)) continue;
      sphere.center.copy(c);
      sphere.radius = r;
      if (!ray.intersectSphere(sphere, hit)) continue;
      const d = hit.distanceTo(ray.origin);
      if (!best || d < best.d) best = { kind, id, d };
    }
    return best;
  }

  /** Where stairs, the chest or a piece of loot sits and its reach, for the tap highlight. */
  spot(kind: string, id: string): { x: number; z: number; r: number } | null {
    if (!this.group.visible) return null;
    const p = this.picks.find(([, k, i]) => k === kind && i === id);
    return p ? { x: p[0].x, z: p[0].z, r: p[3] } : null;
  }

  /** Ambient light for the floor: 0..1, deeper floors darker. */
  get light(): number {
    return this.floor?.light ?? 1;
  }
}
