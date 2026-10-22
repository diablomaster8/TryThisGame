import * as THREE from 'three';
import { markAt } from '../config/stage-marks';
import { DUNGEON } from '../config/tuning';
import { CG2_S } from '../config/tuning-s';
import { flameTexture, gridTexture, holoEdgeTexture, softTexture } from '../render/art-s';
import { bandFor } from '../render/cave-bands';
import { paintFloorTexture } from '../render/paint/dungeon';
import { belowFloor, belowMark, dripSpot, rootMark, setsS, torchSpots } from '../render/sets-s';
import type { World } from '../sim/types';
import type { Dress3dCtx, Dressing3d } from './dressings';
import { BOX, CONE, Kit, ROCK, kitMaterial } from './hollow-dress-kit';
import { groveHeight } from './terrain';

/**
 * Campaign graphics 2, package s, Full 3D (see render3d/dressings.ts). Every set lives in
 * `ctx.scene` with its own visibility, since an exclusive stage hides `world3d`:
 *
 * - C3, the Root Node's white room: a white void dome, a pale floor disc with a fine rim,
 *   one kit chair on its mark and a soft contact shadow; the scene's background and fog go
 *   near-white while it shows, and are put back after.
 * - C4, the Beetle Road's floors below: the dungeon painter's floor round `keeper-below`, a
 *   cave shell of Hollow-kit rocks in eight sectors (the one facing the camera stands
 *   aside), wall torches as emissive flame cards with halos (no lights: the lamp pool is in
 *   the hidden world), a dark dome, and drips with puddle rings when it rains.
 * - M3, Logged In's digital set (in `world3d`, the Grove's own): a grid decal draped over
 *   the terrain, a holo edge round the scoreboard, pixel sparkles over the eggs, and
 *   chapter 6's plain door.
 *
 * Under reduced motion the flames, drips and sparkles hold still.
 */

let ctx: Dress3dCtx | null = null;
let clock = 0;
const disposables: Array<{ dispose(): void }> = [];

let room: THREE.Group | null = null;
let cave: THREE.Group | null = null;
let sectors: THREE.Mesh[] = [];
let flames: THREE.Sprite[] = [];
let drips: THREE.InstancedMesh | null = null;
let puddles: THREE.Mesh | null = null;
let digital: THREE.Group | null = null;
let gridMat: THREE.MeshBasicMaterial | null = null;
let door: THREE.Group | null = null;
let sparks: THREE.Sprite[] = [];
let sparkMat: THREE.SpriteMaterial | null = null;

/** The background and fog colour a set took over, to put back when it goes. */
let saved: { bg: THREE.Scene['background']; fog: THREE.Color | null } | null = null;
const tmpColor = new THREE.Color();
const m4 = new THREE.Matrix4();
const q = new THREE.Quaternion();
const v = new THREE.Vector3();
const sc = new THREE.Vector3();

function keep<T extends { dispose(): void }>(d: T): T {
  disposables.push(d);
  return d;
}

function basic(p: THREE.MeshBasicMaterialParameters): THREE.MeshBasicMaterial {
  return keep(new THREE.MeshBasicMaterial({ toneMapped: false, ...p }));
}

function dome(color: string, gain = 1): THREE.Mesh {
  const d = new THREE.Mesh(
    keep(new THREE.SphereGeometry(150, 24, 12)),
    basic({
      color: new THREE.Color(color).multiplyScalar(gain),
      side: THREE.BackSide,
      fog: false,
      depthWrite: false,
    }),
  );
  d.renderOrder = -10;
  d.frustumCulled = false;
  return d;
}

function flatMesh(geo: THREE.BufferGeometry, mat: THREE.Material, y: number): THREE.Mesh {
  const m = new THREE.Mesh(keep(geo), mat);
  m.rotation.x = -Math.PI / 2;
  m.position.y = y;
  return m;
}

// ------------------------------------------------------------------------------ C3

function buildRoom(): THREE.Group {
  const R = CG2_S.root;
  const g = new THREE.Group();
  g.name = 'dress-s-room';
  const m = rootMark();
  const h = groveHeight(m.x, m.z);
  g.position.set(m.x, h, m.z);
  g.add(dome(R.void, R.gain));
  g.add(
    flatMesh(
      new THREE.CircleGeometry(R.floorRadius, 48),
      basic({ color: new THREE.Color(R.floor).multiplyScalar(R.gain) }),
      0.03,
    ),
  );
  g.add(
    flatMesh(
      new THREE.RingGeometry(R.floorRadius, R.floorRadius + 0.05, 64),
      basic({ color: R.horizon }),
      0.035,
    ),
  );
  const shadowTex = softTexture('rgba(40,44,64,0.55)');
  if (shadowTex) {
    keep(shadowTex);
    g.add(
      flatMesh(
        new THREE.PlaneGeometry(2.2, 2.2),
        basic({ map: shadowTex, transparent: true, depthWrite: false }),
        0.05,
      ),
    );
  }
  g.add(buildChair(m.yaw));
  g.visible = false;
  return g;
}

/**
 * One plain chair from Hollow-kit boxes (the prop kit's chair shares the building material,
 * which an exclusive stage's building mask discards). Faces `yaw`.
 */
function buildChair(yaw: number): THREE.Mesh {
  const s = CG2_S.root.chairScale;
  const k = new Kit();
  const wood = '#a8754a';
  const dark = '#7a5232';
  for (const [x, z] of [
    [-0.2, -0.2],
    [0.2, -0.2],
    [-0.2, 0.2],
    [0.2, 0.2],
  ] as const)
    k.part(BOX(), x * s, 0.22 * s, z * s, 0.06 * s, 0.44 * s, 0.06 * s, dark);
  k.part(BOX(), 0, 0.46 * s, 0, 0.5 * s, 0.06 * s, 0.5 * s, wood);
  k.part(BOX(), 0, 0.78 * s, -0.22 * s, 0.5 * s, 0.6 * s, 0.06 * s, wood);
  k.part(BOX(), 0, 0.98 * s, -0.22 * s, 0.56 * s, 0.07 * s, 0.09 * s, dark);
  const geo = keep(k.build() ?? new THREE.BufferGeometry());
  const mesh = new THREE.Mesh(geo, keep(kitMaterial()));
  mesh.rotation.y = yaw;
  mesh.position.y = 0.04;
  return mesh;
}

// ------------------------------------------------------------------------------ C4

function buildCave(): THREE.Group {
  const B = CG2_S.below;
  const band = bandFor(B.depth);
  const g = new THREE.Group();
  g.name = 'dress-s-cave';
  const m = belowMark();
  const h = groveHeight(m.x, m.z);
  g.position.set(m.x, h, m.z);
  g.add(dome(B.dark));

  const size = B.cells * DUNGEON.cell;
  const floorTex = keep(paintFloorTexture(belowFloor(), B.depth));
  g.add(
    flatMesh(new THREE.PlaneGeometry(size, size), basic({ map: floorTex, color: '#d8d0c8' }), 0.02),
  );

  // The shell: rocks round the oval in eight sectors, lit near the torches (baked glow).
  const spots = torchSpots();
  const kits = Array.from({ length: 8 }, () => new Kit());
  const hash = (i: number, k: number) => {
    const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const lit = (x: number, z: number) => {
    let best = 99;
    for (const t of spots) best = Math.min(best, Math.hypot(x - t.x, z - t.z));
    return Math.max(0.06, 0.4 - best * 0.09);
  };
  for (let i = 0; i < B.rocks; i++) {
    const a = (i / B.rocks) * Math.PI * 2;
    const sector = Math.floor(((a + Math.PI / 8) / (Math.PI * 2)) * 8) % 8;
    const kit = kits[sector]!;
    const rx = Math.cos(a) * (B.ovalX + 1.1);
    const rz = Math.sin(a) * (B.ovalZ + 1.1);
    const glow = lit(rx, rz);
    const s = 1.8 + hash(i, 1) * 1.2;
    kit.part(ROCK(), rx, s * 0.4, rz, s * 1.3, s, s * 1.2, band.rock, glow, hash(i, 2) * 6);
    const s2 = 1.2 + hash(i, 3) * 1.0;
    kit.part(
      ROCK(),
      rx * 1.08,
      B.wallH - s2 * 0.3,
      rz * 1.08,
      s2 * 1.4,
      s2,
      s2 * 1.3,
      i % 3 === 0 ? band.moss : band.rock,
      glow * 0.7,
      hash(i, 4) * 6,
    );
    if (i % 4 === 1)
      kit.part(CONE(6), rx * 0.86, 0.45, rz * 0.86, 0.5, 0.9 + hash(i, 5), 0.5, band.rim, glow);
  }
  // Torch brackets on the wall, in their sector's kit.
  for (const t of spots) {
    const sector = Math.floor(((t.a + Math.PI / 8) / (Math.PI * 2)) * 8 + 8) % 8;
    kits[sector]!.part(BOX(), t.x, 1.05, t.z, 0.14, 0.5, 0.14, '#3a2a1e', 0.1);
    kits[sector]!.part(BOX(), t.x, 1.32, t.z, 0.3, 0.08, 0.3, '#5a4030', 0.2);
  }
  const mat = keep(kitMaterial());
  sectors = kits.map((k, i) => {
    const geo = k.build() ?? new THREE.BufferGeometry();
    keep(geo);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = `dress-s-cave-${i}`;
    g.add(mesh);
    return mesh;
  });

  // The flames: emissive cards over the brackets, a warm halo behind each.
  const flameTex = flameTexture();
  const haloTex = softTexture('rgba(255,168,80,0.85)');
  if (flameTex) keep(flameTex);
  if (haloTex) keep(haloTex);
  const flameMat = keep(
    new THREE.SpriteMaterial({
      ...(flameTex ? { map: flameTex } : {}),
      color: new THREE.Color(B.torchColor).multiplyScalar(B.torchGlow),
      toneMapped: false,
      fog: false,
    }),
  );
  const haloMat = keep(
    new THREE.SpriteMaterial({
      ...(haloTex ? { map: haloTex } : {}),
      color: new THREE.Color(B.torchColor),
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      fog: false,
    }),
  );
  flames = [];
  for (const t of spots) {
    const f = new THREE.Sprite(flameMat);
    f.position.set(t.x, 1.62, t.z);
    f.scale.set(0.32, 0.48, 1);
    const halo = new THREE.Sprite(haloMat);
    halo.position.set(t.x, 1.55, t.z);
    halo.scale.set(2.6, 2.6, 1);
    g.add(halo, f);
    flames.push(f);
  }

  // Drips: thin falling streaks, with puddle rings under them.
  const n = B.drips;
  drips = new THREE.InstancedMesh(
    keep(new THREE.BoxGeometry(0.035, 0.3, 0.035)),
    basic({ color: '#b8dcff', transparent: true, opacity: 0.75, depthWrite: false }),
    n,
  );
  drips.frustumCulled = false;
  g.add(drips);
  const rings: THREE.BufferGeometry[] = [];
  for (let i = 0; i < n; i++) {
    const d = dripSpot(i);
    const r = new THREE.RingGeometry(0.16, 0.22, 16).rotateX(-Math.PI / 2);
    r.translate(d.x, 0.04, d.z);
    rings.push(r);
  }
  puddles = new THREE.Mesh(
    keep(mergeGeos(rings)),
    basic({ color: '#9cc8f0', transparent: true, opacity: 0.55, depthWrite: false }),
  );
  for (const r of rings) r.dispose();
  g.add(puddles);
  g.visible = false;
  return g;
}

/** Merge position-only geometries (the puddle rings) into one. */
function mergeGeos(list: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const pos: number[] = [];
  const idx: number[] = [];
  for (const g of list) {
    const base = pos.length / 3;
    const P = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < P.count; i++) pos.push(P.getX(i), P.getY(i), P.getZ(i));
    const I = g.index;
    if (I) for (let i = 0; i < I.count; i++) idx.push(base + I.getX(i));
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setIndex(idx);
  return out;
}

// ------------------------------------------------------------------------------ M3

/** A card that turns round the vertical only, as package f's scoreboard does. */
function yawCard(w: number, h: number, map: THREE.Texture, color: string): THREE.Mesh {
  const mat = keep(
    new THREE.ShaderMaterial({
      uniforms: { map: { value: map }, tint: { value: new THREE.Color(color) } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 c = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
          vec3 to = cameraPosition - c; to.y = 0.0; to = normalize(to);
          vec3 right = vec3(to.z, 0.0, -to.x);
          vec3 w = c + right * position.x + vec3(0.0, position.y, 0.0) + to * 0.02;
          gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
        }`,
      fragmentShader: `uniform sampler2D map; uniform vec3 tint; varying vec2 vUv;
        void main() {
          vec4 t = texture2D(map, vUv);
          if (t.a < 0.05) discard;
          gl_FragColor = vec4(t.rgb * tint * 1.6 * t.a, t.a);
        }`,
    }),
  );
  const mesh = new THREE.Mesh(keep(new THREE.PlaneGeometry(w, h)), mat);
  mesh.frustumCulled = false;
  return mesh;
}

function buildDigital(): THREE.Group {
  const D = CG2_S.digital;
  const g = new THREE.Group();
  g.name = 'dress-s-digital';
  // The grid, draped over the terrain: a segmented plane lifted to the ground's height.
  const t = gridTexture();
  if (t) {
    keep(t);
    gridMat = basic({
      color: D.gridColor,
      map: t,
      transparent: true,
      opacity: D.gridDay,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    const seg = 88;
    const geo = keep(
      new THREE.PlaneGeometry(D.gridSize, D.gridSize, seg, seg).rotateX(-Math.PI / 2),
    );
    const P = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < P.count; i++) {
      const x = P.getX(i) + D.gridX;
      const z = P.getZ(i) + D.gridZ;
      P.setY(i, groveHeight(x, z) + 0.06);
    }
    geo.computeBoundingSphere();
    const grid = new THREE.Mesh(geo, gridMat);
    grid.position.set(D.gridX, 0, D.gridZ);
    grid.renderOrder = 2;
    g.add(grid);
  }
  // The scoreboard's holo edge, a little larger than its 2.3 by 1.44 panel.
  const edge = holoEdgeTexture();
  if (edge) {
    keep(edge);
    const bm = markAt('grove', 'board') ?? { x: 3, z: -2, yaw: 0 };
    const card = yawCard(2.55, 1.6, edge, '#52e6ff');
    card.position.set(bm.x, groveHeight(bm.x, bm.z) + 2.15, bm.z);
    g.add(card);
    // The door: frame, slab and knob, with its own holo edge.
    door = new THREE.Group();
    const kit = new Kit();
    kit.part(BOX(), -0.62, 1.2, 0, 0.14, 2.4, 0.18, '#2c3440');
    kit.part(BOX(), 0.62, 1.2, 0, 0.14, 2.4, 0.18, '#2c3440');
    kit.part(BOX(), 0, 2.45, 0, 1.38, 0.14, 0.18, '#2c3440');
    kit.part(BOX(), 0, 1.15, 0, 1.08, 2.26, 0.08, '#e9e4d8');
    kit.part(BOX(), 0.36, 1.1, 0.06, 0.08, 0.08, 0.06, '#e9c46a', 0.6);
    const geo = kit.build();
    if (geo) {
      keep(geo);
      door.add(new THREE.Mesh(geo, keep(kitMaterial())));
    }
    const dcard = yawCard(1.5, 2.65, edge, '#52e6ff');
    dcard.position.y = 1.25;
    door.add(dcard);
    door.position.set(D.doorX, groveHeight(D.doorX, D.doorZ), D.doorZ);
    door.rotation.y = D.doorYaw;
    door.visible = false;
    g.add(door);
  }
  // Egg sparkles: a pool of sprites, placed each frame.
  const spark = sparkTexture();
  if (spark) keep(spark);
  sparkMat = keep(
    new THREE.SpriteMaterial({
      ...(spark ? { map: spark } : {}),
      color: new THREE.Color('#c8f8ff').multiplyScalar(1.6),
      toneMapped: false,
      depthWrite: false,
    }),
  );
  sparks = [];
  for (let i = 0; i < 8; i++) {
    const s = new THREE.Sprite(sparkMat);
    s.visible = false;
    g.add(s);
    sparks.push(s);
  }
  g.visible = false;
  return g;
}

/** A four-point pixel sparkle, nearest-filtered. */
function sparkTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const cv = document.createElement('canvas');
  cv.width = cv.height = 9;
  const c = cv.getContext('2d');
  if (!c) return null;
  c.fillStyle = '#ffffff';
  for (let i = -4; i <= 4; i++) {
    c.fillRect(4 + i, 4, 1, 1);
    c.fillRect(4, 4 + i, 1, 1);
  }
  c.fillRect(3, 3, 3, 3);
  const t = new THREE.CanvasTexture(cv);
  t.magFilter = t.minFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ------------------------------------------------------------------------------ frame

/** Take over the scene's background and fog colour while a void set shows. */
function takeSky(c: Dress3dCtx, color: string | null): void {
  const fog = c.scene.fog as THREE.FogExp2 | THREE.Fog | null;
  if (color) {
    if (!saved) saved = { bg: c.scene.background, fog: fog ? fog.color.clone() : null };
    tmpColor.set(color);
    c.scene.background = tmpColor;
    if (fog) fog.color.set(color);
  } else if (saved) {
    // Put back only what is still ours: the sky may have set its own since.
    if (c.scene.background === tmpColor) c.scene.background = saved.bg;
    if (fog && saved.fog) fog.color.copy(saved.fog);
    saved = null;
  }
}

export const dress3dS: Dressing3d = {
  id: 's',
  build(c) {
    ctx = c;
    clock = 0;
    saved = null;
    if (typeof document === 'undefined') return;
    room = buildRoom();
    cave = buildCave();
    digital = buildDigital();
    c.scene.add(room, cave);
    c.world3d.add(digital);
    void c.compile(room);
    void c.compile(cave);
    void c.compile(digital);
  },

  update(world: World, stage, daylight, dt) {
    if (!ctx || !room || !cave || !digital) return;
    const reduce = ctx.reduceMotion();
    clock += dt;
    const s = setsS(world, stage);
    room.visible = s.root;
    cave.visible = s.below;
    digital.visible = s.digital;
    takeSky(ctx, s.root ? CG2_S.root.void : s.below ? CG2_S.below.dark : null);

    if (s.below) {
      // The sector between the camera and the mark stands aside.
      const cam = ctx.camera.position;
      const ca = Math.atan2(cam.z - cave.position.z, cam.x - cave.position.x);
      sectors.forEach((m, i) => {
        const a = (i * Math.PI) / 4;
        const d = Math.abs(Math.atan2(Math.sin(ca - a), Math.cos(ca - a)));
        m.visible = d > Math.PI / 3.2;
      });
      flames.forEach((f, i) => {
        const k = reduce
          ? 1
          : 1 + 0.1 * Math.sin(clock * 9 + i * 2.1) + 0.05 * Math.sin(clock * 23 + i);
        f.scale.set(0.32, 0.48 * k, 1);
      });
      const B = CG2_S.below;
      if (drips && puddles) {
        drips.visible = s.drips;
        puddles.visible = s.drips;
        if (s.drips) {
          for (let i = 0; i < B.drips; i++) {
            const d = dripSpot(i);
            const t = reduce ? 0.5 : (clock / B.dripFallS + d.phase) % 1;
            m4.compose(v.set(d.x, B.dripFrom * (1 - t) + 0.15, d.z), q, sc.set(1, 1, 1));
            drips.setMatrixAt(i, m4);
          }
          drips.instanceMatrix.needsUpdate = true;
        }
      }
    }

    if (s.digital) {
      const D = CG2_S.digital;
      if (gridMat)
        gridMat.opacity =
          D.gridDay + (D.gridNight - D.gridDay) * Math.min(1, daylight.darkness / 0.7);
      if (door) door.visible = s.door;
      let i = 0;
      for (const n of world.nubbins) {
        if (n.stage !== 'egg' || i >= sparks.length) continue;
        const sp = sparks[i]!;
        const ph = reduce ? 0.6 : (clock / D.glintS + i * 0.37) % 1;
        const size = ph < 0.6 ? 0.12 + Math.sin((ph / 0.6) * Math.PI) * 0.3 : 0;
        sp.visible = size > 0.02;
        sp.scale.setScalar(size);
        sp.position.set(n.pos.x + 0.3, groveHeight(n.pos.x, n.pos.z) + 0.75 + n.y, n.pos.z);
        i++;
      }
      for (; i < sparks.length; i++) sparks[i]!.visible = false;
    }
  },

  dispose() {
    if (ctx) takeSky(ctx, null);
    for (const d of disposables.splice(0)) d.dispose();
    room?.removeFromParent();
    cave?.removeFromParent();
    digital?.removeFromParent();
    ctx = null;
    room = cave = digital = null;
    door = null;
    drips = puddles = null;
    gridMat = sparkMat = null;
    sectors = [];
    flames = [];
    sparks = [];
  },
};
