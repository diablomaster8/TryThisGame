import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { holoClear, type BuntingShape } from '../config/campaign-look';
import { TITLE_CARD_TEXT } from '../config/strings';
import { LOOK_F } from '../config/tuning-f';

/**
 * Campaign graphics package f, Full 3D: the geometry of the story sets (bunting, picnic
 * cloth, cake and buns, the Beetle Road's banners, cart and weather machine, Logged In's
 * scoreboard, holo fence and white room). Each builder returns a ready group; `dress-f.ts`
 * places them and decides when they show. Few draw calls: parts are merged by vertex
 * colour, the bunting and the fence are instanced, glow is unlit colour past 1 for bloom.
 */

type Part = { geo: THREE.BufferGeometry; color: string };

/** Merge parts into one vertex-coloured geometry (each part is already positioned). */
function merged(parts: Part[]): THREE.BufferGeometry {
  const geos = parts.map(({ geo, color }) => {
    const g = geo.index ? geo.toNonIndexed() : geo;
    const c = new THREE.Color(color);
    const n = g.attributes.position!.count;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) arr.set([c.r, c.g, c.b], i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
    for (const k of Object.keys(g.attributes))
      if (!['position', 'normal', 'color'].includes(k)) g.deleteAttribute(k);
    return g;
  });
  const out = mergeGeometries(geos, false);
  if (!out) throw new Error('merge failed');
  return out;
}

function at<T extends THREE.BufferGeometry>(
  g: T,
  x: number,
  y: number,
  z: number,
  rx = 0,
  ry = 0,
  rz = 0,
): T {
  g.rotateX(rx);
  g.rotateY(ry);
  g.rotateZ(rz);
  g.translate(x, y, z);
  return g;
}

const lit = () =>
  new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, flatShading: true });

function canvasTex(
  w: number,
  h: number,
  draw: (c: CanvasRenderingContext2D) => void,
): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const c = cv.getContext('2d');
  if (c) draw(c);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

// ---------------------------------------------------------------------------- bunting (H13, N6)

/** One flat pennant shape, hanging from its top edge at the origin, `s` across. */
export function pennantGeometry(shape: BuntingShape, s: number): THREE.ShapeGeometry {
  const sh = new THREE.Shape();
  const cy = -s * 0.62;
  if (shape === 'star') {
    for (let i = 0; i < 10; i++) {
      const a = Math.PI / 2 + (i * Math.PI) / 5;
      const r = (i % 2 ? 0.24 : 0.58) * s;
      const x = Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) sh.moveTo(x, y);
      else sh.lineTo(x, y);
    }
  } else if (shape === 'leaf') {
    sh.moveTo(0, cy + s * 0.62);
    sh.bezierCurveTo(s * 0.62, cy + s * 0.3, s * 0.5, cy - s * 0.4, 0, cy - s * 0.62);
    sh.bezierCurveTo(-s * 0.5, cy - s * 0.4, -s * 0.62, cy + s * 0.3, 0, cy + s * 0.62);
  } else {
    // A crescent: a full disc with a bite taken out of one side.
    sh.absarc(0, cy, s * 0.55, 0, Math.PI * 2, false);
    const bite = new THREE.Path();
    bite.absarc(s * 0.28, cy + s * 0.06, s * 0.47, 0, Math.PI * 2, true);
    sh.holes.push(bite);
  }
  return new THREE.ShapeGeometry(sh, 10);
}

const BUNTING_COLORS = ['#ffd166', '#ff8fa3', '#fff1c9', '#9be07c'];

/**
 * String bunting round a closed run of posts: one instanced mesh of pennants (the ending's
 * shape) plus one line mesh for the strings. TODO(package E): drive the glow from the
 * lantern states once they exist; until then it is a steady unlit glow under bloom.
 */
export function buildBunting(
  posts: ReadonlyArray<{ x: number; z: number }>,
  ground: (x: number, z: number) => number,
  shape: BuntingShape,
): { group: THREE.Group; mesh: THREE.InstancedMesh; dispose: () => void } {
  const b = LOOK_F.bunting;
  const group = new THREE.Group();
  const runs = posts.length;
  const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false });
  const mesh = new THREE.InstancedMesh(pennantGeometry(shape, b.size), mat, runs * b.perRun);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const col = new THREE.Color();
  const pts: number[] = [];
  let k = 0;
  for (let r = 0; r < runs; r++) {
    const a = posts[r]!;
    const c = posts[(r + 1) % runs]!;
    const ya = ground(a.x, a.z) + b.postHeight;
    const yc = ground(c.x, c.z) + b.postHeight;
    const ang = Math.atan2(-(c.z - a.z), c.x - a.x);
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), ang);
    const seg = 24;
    for (let i = 0; i < seg; i++) {
      for (const t of [i / seg, (i + 1) / seg]) {
        pts.push(
          a.x + (c.x - a.x) * t,
          ya + (yc - ya) * t - b.sag * 4 * t * (1 - t),
          a.z + (c.z - a.z) * t,
        );
      }
    }
    for (let i = 0; i < b.perRun; i++) {
      const t = (i + 0.5) / b.perRun;
      m4.compose(
        new THREE.Vector3(
          a.x + (c.x - a.x) * t,
          ya + (yc - ya) * t - b.sag * 4 * t * (1 - t),
          a.z + (c.z - a.z) * t,
        ),
        q,
        new THREE.Vector3(1, 1, 1),
      );
      mesh.setMatrixAt(k, m4);
      col.set(BUNTING_COLORS[(i + r) % BUNTING_COLORS.length]!).multiplyScalar(1.5);
      mesh.setColorAt(k, col);
      k++;
    }
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.frustumCulled = false;
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: '#5a4630' });
  const strings = new THREE.LineSegments(lineGeo, lineMat);
  strings.frustumCulled = false;
  group.add(mesh, strings);
  return {
    group,
    mesh,
    dispose: () => {
      mesh.geometry.dispose();
      mat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
    },
  };
}

// ---------------------------------------------------------------------------- picnic (H13, N5)

function ginghamTexture(): THREE.CanvasTexture {
  return canvasTex(64, 64, (c) => {
    c.fillStyle = '#f6efe2';
    c.fillRect(0, 0, 64, 64);
    c.fillStyle = 'rgba(200,50,70,0.62)';
    for (let i = 0; i < 4; i++) {
      c.fillRect(i * 16, 0, 8, 64);
      c.fillRect(0, i * 16, 64, 8);
    }
  });
}

/** A picnic cloth (flat, gingham) with, optionally, the collapsed glowing cake and a tray of buns. */
export function buildPicnic(o: { cake: boolean; basket: boolean }): THREE.Group {
  const g = new THREE.Group();
  const cloth = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 2.6),
    new THREE.MeshStandardMaterial({ map: ginghamTexture(), roughness: 1 }),
  );
  cloth.rotation.x = -Math.PI / 2;
  cloth.position.y = 0.025;
  cloth.receiveShadow = true;
  g.add(cloth);
  const parts: Part[] = [];
  if (o.cake) {
    // The cake has collapsed: two layers, the upper slumped off to one side.
    parts.push({
      geo: at(new THREE.CylinderGeometry(0.5, 0.52, 0.26, 14), -0.55, 0.16, 0.1),
      color: '#f4e3c0',
    });
    parts.push({
      geo: at(new THREE.CylinderGeometry(0.34, 0.37, 0.22, 12), -0.35, 0.36, 0.12, 0, 0, 0.34),
      color: '#f0d6a8',
    });
    // The tray of lantern buns.
    parts.push({
      geo: at(new THREE.CylinderGeometry(0.5, 0.5, 0.04, 16), 0.75, 0.06, -0.15),
      color: '#8a6038',
    });
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const r = i === 0 ? 0 : 0.28;
      parts.push({
        geo: at(
          new THREE.SphereGeometry(0.11, 8, 6),
          0.75 + Math.cos(a) * r,
          0.17,
          -0.15 + Math.sin(a) * r,
        ),
        color: '#e8b46a',
      });
    }
  }
  if (o.basket) {
    parts.push({
      geo: at(new THREE.BoxGeometry(0.62, 0.34, 0.44), 0.7, 0.2, -0.1),
      color: '#b98a50',
    });
    parts.push({
      geo: at(new THREE.TorusGeometry(0.26, 0.025, 6, 12, Math.PI), 0.7, 0.37, -0.1),
      color: '#8a6038',
    });
    parts.push({ geo: at(new THREE.SphereGeometry(0.13, 8, 6), -0.4, 0.1, 0.5), color: '#d94a4a' });
    parts.push({
      geo: at(new THREE.SphereGeometry(0.12, 8, 6), -0.15, 0.1, 0.62),
      color: '#f2a93b',
    });
  }
  const body = new THREE.Mesh(merged(parts), lit());
  body.castShadow = body.receiveShadow = true;
  g.add(body);
  if (o.cake) {
    // Emissive icing: a thin glowing cap on each layer.
    const icing = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ffe6a8').multiplyScalar(1.6),
      toneMapped: false,
    });
    const a = new THREE.Mesh(
      at(new THREE.CylinderGeometry(0.46, 0.46, 0.03, 14), -0.55, 0.3, 0.1),
      icing,
    );
    const b = new THREE.Mesh(
      at(new THREE.CylinderGeometry(0.31, 0.31, 0.03, 12), -0.34, 0.47, 0.1, 0, 0, 0.34),
      icing,
    );
    g.add(a, b);
  }
  return g;
}

// ---------------------------------------------------------------------------- the Beetle Road (H17)

/** Time uniform for the banners' wave; the dressing zeroes it under reduced motion. */
export const WAVE = { value: 0 };

function emblemTexture(kind: 'sun' | 'moon' | 'drop'): THREE.CanvasTexture {
  const cloth = { sun: '#d9534f', moon: '#4f4aa8', drop: '#2f8f9d' }[kind];
  return canvasTex(128, 192, (c) => {
    c.fillStyle = cloth;
    c.fillRect(0, 0, 128, 192);
    c.fillStyle = 'rgba(0,0,0,0.18)';
    c.fillRect(0, 0, 8, 192);
    c.fillRect(120, 0, 8, 192);
    c.fillStyle = '#fff1c9';
    c.strokeStyle = '#fff1c9';
    c.lineWidth = 7;
    c.lineCap = 'round';
    c.translate(64, 88);
    if (kind === 'sun') {
      c.beginPath();
      c.arc(0, 0, 26, 0, Math.PI * 2);
      c.fill();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        c.beginPath();
        c.moveTo(Math.cos(a) * 36, Math.sin(a) * 36);
        c.lineTo(Math.cos(a) * 52, Math.sin(a) * 52);
        c.stroke();
      }
    } else if (kind === 'moon') {
      c.beginPath();
      c.arc(0, 0, 44, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = cloth;
      c.beginPath();
      c.arc(22, -10, 38, 0, Math.PI * 2);
      c.fill();
    } else {
      c.beginPath();
      c.moveTo(0, -48);
      c.bezierCurveTo(40, 0, 40, 40, 0, 44);
      c.bezierCurveTo(-40, 40, -40, 0, 0, -48);
      c.fill();
    }
  });
}

/** Hang a cloth banner: its top fixed to a rod, the lower cloth riding a wave. */
function banner(kind: 'sun' | 'moon' | 'drop', w: number, h: number): THREE.Group {
  const g = new THREE.Group();
  const tex = emblemTexture(kind);
  const mat = new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 1 });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uWave = WAVE;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uWave;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float hang = clamp(0.5 - position.y / ${h.toFixed(3)}, 0.0, 1.0);
        transformed.z += sin(uWave * 2.2 + position.x * 5.0 + position.y * 2.5) * 0.05 * hang * hang;`,
      );
  };
  mat.customProgramCacheKey = () => 'cg-f-banner';
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(w, h, 6, 8), mat);
  cloth.position.y = -h / 2;
  cloth.castShadow = true;
  const rod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, w + 0.2, 6),
    new THREE.MeshStandardMaterial({ color: '#5a3c28', roughness: 0.9 }),
  );
  rod.rotation.z = Math.PI / 2;
  g.add(cloth, rod);
  return g;
}

/** Three team banners (Dawn: sun, Dusk: moon, Dew: droplet), each a shape as well as a colour. */
export function buildBanners(): THREE.Group[] {
  return (['sun', 'moon', 'drop'] as const).map((k) => banner(k, 0.78, 1.15));
}

/** A cart under a tarp: a box and wheels with a draped cloth over a humped load. */
export function buildCart(): THREE.Group {
  const g = new THREE.Group();
  const parts: Part[] = [
    { geo: at(new THREE.BoxGeometry(1.5, 0.22, 0.95), 0, 0.52, 0), color: '#8a5c34' },
    {
      geo: at(new THREE.BoxGeometry(0.1, 0.05, 1.5), -0.72, 0.3, 0, 0, Math.PI / 2),
      color: '#5a3c28',
    },
    {
      geo: at(new THREE.CylinderGeometry(0.34, 0.34, 0.1, 12), -0.5, 0.34, 0.55, Math.PI / 2),
      color: '#5a3c28',
    },
    {
      geo: at(new THREE.CylinderGeometry(0.34, 0.34, 0.1, 12), -0.5, 0.34, -0.55, Math.PI / 2),
      color: '#5a3c28',
    },
    {
      geo: at(new THREE.CylinderGeometry(0.34, 0.34, 0.1, 12), 0.5, 0.34, 0.55, Math.PI / 2),
      color: '#5a3c28',
    },
    {
      geo: at(new THREE.CylinderGeometry(0.34, 0.34, 0.1, 12), 0.5, 0.34, -0.55, Math.PI / 2),
      color: '#5a3c28',
    },
    {
      geo: at(new THREE.BoxGeometry(1.2, 0.07, 0.07), 1.35, 0.5, 0.2, 0, 0, 0.12),
      color: '#6a4426',
    },
    {
      geo: at(new THREE.BoxGeometry(1.2, 0.07, 0.07), 1.35, 0.5, -0.2, 0, 0, 0.12),
      color: '#6a4426',
    },
  ];
  const body = new THREE.Mesh(merged(parts), lit());
  body.castShadow = true;
  // The tarp: a plane pulled up into a hump over the load and hanging at its edges.
  const tg = new THREE.PlaneGeometry(1.9, 1.35, 12, 8);
  tg.rotateX(-Math.PI / 2);
  const pos = tg.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) / 0.95;
    const v = pos.getZ(i) / 0.675;
    const edge = Math.max(Math.abs(u), Math.abs(v));
    const hump = 0.5 * Math.max(0, 1 - u * u) * Math.max(0, 1 - v * v);
    const drop = Math.max(0, (edge - 0.72) / 0.28) ** 1.5 * 0.34;
    pos.setY(i, 0.66 + hump - drop);
  }
  tg.computeVertexNormals();
  const tarp = new THREE.Mesh(
    tg,
    new THREE.MeshStandardMaterial({
      color: '#7d8f68',
      roughness: 1,
      side: THREE.DoubleSide,
      flatShading: true,
    }),
  );
  tarp.castShadow = true;
  g.add(body, tarp);
  return g;
}

/** The weather machine: pipes up a plank tower to a funnel, with a vane that turns. */
export function buildWeatherMachine(): { group: THREE.Group; vane: THREE.Object3D } {
  const g = new THREE.Group();
  const parts: Part[] = [
    { geo: at(new THREE.BoxGeometry(1.0, 0.4, 1.0), 0, 0.2, 0), color: '#7a5434' },
    { geo: at(new THREE.BoxGeometry(0.6, 1.5, 0.6), 0, 1.15, 0), color: '#a8784a' },
    { geo: at(new THREE.CylinderGeometry(0.1, 0.1, 2.6, 8), 0.45, 1.5, 0.2), color: '#9aa4ad' },
    { geo: at(new THREE.CylinderGeometry(0.08, 0.08, 2.2, 8), -0.45, 1.3, -0.2), color: '#b08a58' },
    {
      geo: at(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8), 0.0, 2.4, 0.2, 0, 0, Math.PI / 2),
      color: '#9aa4ad',
    },
    { geo: at(new THREE.SphereGeometry(0.16, 8, 6), 0.45, 2.85, 0.2), color: '#c9d2da' },
    {
      geo: at(new THREE.ConeGeometry(0.4, 0.5, 10, 1, true), 0, 2.2, 0, Math.PI),
      color: '#6f7d8a',
    },
    { geo: at(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 6), 0, 2.85, 0), color: '#5a3c28' },
  ];
  const body = new THREE.Mesh(merged(parts), lit());
  body.castShadow = true;
  (body.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
  // The vane: two arms and a cup at each end, turning about the mast.
  const vane = new THREE.Group();
  vane.position.set(0, 3.15, 0);
  const vm = lit();
  const vg = merged([
    { geo: new THREE.BoxGeometry(1.1, 0.05, 0.05), color: '#5a3c28' },
    { geo: new THREE.BoxGeometry(0.05, 0.05, 1.1), color: '#5a3c28' },
    { geo: at(new THREE.SphereGeometry(0.15, 8, 6, 0, Math.PI), 0.55, 0, 0), color: '#e0556a' },
    {
      geo: at(new THREE.SphereGeometry(0.15, 8, 6, 0, Math.PI), -0.55, 0, 0, 0, Math.PI),
      color: '#e0556a',
    },
    {
      geo: at(new THREE.SphereGeometry(0.15, 8, 6, 0, Math.PI), 0, 0, 0.55, 0, Math.PI / 2),
      color: '#f2d34c',
    },
    {
      geo: at(new THREE.SphereGeometry(0.15, 8, 6, 0, Math.PI), 0, 0, -0.55, 0, -Math.PI / 2),
      color: '#f2d34c',
    },
  ]);
  vane.add(new THREE.Mesh(vg, vm));
  g.add(body, vane);
  return { group: g, vane };
}

// ---------------------------------------------------------------------------- Logged In (H16)

/** The lobby scoreboard: a lit panel on two posts; the panel turns to face the camera about Y. */
export function buildScoreboard(): THREE.Group {
  const g = new THREE.Group();
  const T = TITLE_CARD_TEXT.scoreboard;
  const tex = canvasTex(256, 160, (c) => {
    c.fillStyle = '#04141f';
    c.fillRect(0, 0, 256, 160);
    c.strokeStyle = '#52e6ff';
    c.lineWidth = 6;
    c.strokeRect(5, 5, 246, 150);
    c.fillStyle = '#52e6ff';
    c.font = 'bold 26px monospace';
    c.textAlign = 'center';
    c.fillText(T.title, 128, 38);
    c.textAlign = 'left';
    c.font = 'bold 22px monospace';
    T.rows.forEach((r, i) => {
      c.fillStyle = i === 1 ? '#ffe27a' : '#9fe9ff';
      c.fillText(r, 40, 72 + i * 26);
    });
  });
  const mat = new THREE.ShaderMaterial({
    uniforms: { map: { value: tex } },
    vertexShader: `varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 c = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
        vec3 to = cameraPosition - c; to.y = 0.0; to = normalize(to);
        vec3 right = vec3(to.z, 0.0, -to.x);
        vec3 w = c + right * position.x + vec3(0.0, position.y, 0.0);
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
      }`,
    fragmentShader: `uniform sampler2D map; varying vec2 vUv;
      void main() { gl_FragColor = vec4(texture2D(map, vUv).rgb * 1.35, 1.0); }`,
  });
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.44), mat);
  panel.position.y = 2.15;
  panel.frustumCulled = false;
  const posts = new THREE.Mesh(
    merged([
      { geo: at(new THREE.BoxGeometry(0.12, 2.0, 0.12), -1.0, 1.0, -0.06), color: '#3a4a5a' },
      { geo: at(new THREE.BoxGeometry(0.12, 2.0, 0.12), 1.0, 1.0, -0.06), color: '#3a4a5a' },
    ]),
    lit(),
  );
  g.add(panel, posts);
  return g;
}

/** Holographic fence panels round a circle: instanced, a scanline and lattice shader. */
export function buildHoloFence(ground: (x: number, z: number) => number): {
  mesh: THREE.InstancedMesh;
  uniforms: { uTime: { value: number }; uStill: { value: number } };
} {
  const h = LOOK_F.holo;
  const uniforms = { uTime: { value: 0 }, uStill: { value: 0 } };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    vertexShader: `varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform float uTime; uniform float uStill; varying vec2 vUv;
      void main() {
        float t = uTime * (1.0 - uStill);
        float scan = 0.55 + 0.45 * step(0.5, fract(vUv.y * 14.0 - t * 0.6));
        vec2 g = abs(fract(vUv * vec2(5.0, 3.0)) - 0.5);
        float lattice = smoothstep(0.46, 0.5, max(g.x, g.y));
        float edge = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x);
        float fade = smoothstep(0.0, 0.15, vUv.y) * (1.0 - 0.55 * vUv.y);
        float a = (0.12 * scan + 0.55 * lattice) * edge * fade;
        gl_FragColor = vec4(vec3(0.25, 1.0, 0.6) * 1.4, a);
      }`,
  });
  // A gap at the south (+z) for the way in.
  const spots: THREE.Matrix4[] = [];
  const q = new THREE.Quaternion();
  for (let i = 0; i < h.panels; i++) {
    const a = (i / h.panels) * Math.PI * 2;
    if (Math.abs(Math.atan2(Math.sin(a), Math.cos(a)) - Math.PI / 2) < 0.2) continue;
    const x = h.cx + Math.cos(a) * h.radius;
    const z = h.cz + Math.sin(a) * h.radius;
    if (!holoClear(x, z)) continue;
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -a + Math.PI / 2);
    spots.push(
      new THREE.Matrix4().compose(
        new THREE.Vector3(x, ground(x, z) + h.height / 2 + 0.05, z),
        q,
        new THREE.Vector3(1, 1, 1),
      ),
    );
  }
  const mesh = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(h.width, h.height),
    mat,
    spots.length,
  );
  spots.forEach((m, i) => mesh.setMatrixAt(i, m));
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  mesh.renderOrder = 3;
  return { mesh, uniforms };
}

/** The Root Node's white room: an unlit dome and floor round a single chair's spot. */
export function buildRootRoom(): THREE.Group {
  const g = new THREE.Group();
  const white = new THREE.MeshBasicMaterial({
    color: '#fbfbff',
    side: THREE.BackSide,
    toneMapped: false,
  });
  const r = LOOK_F.root.radius;
  g.add(new THREE.Mesh(new THREE.SphereGeometry(r, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), white));
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(r, 28),
    new THREE.MeshBasicMaterial({ color: '#f1f2f8', toneMapped: false }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.04;
  g.add(floor);
  return g;
}

// ---------------------------------------------------------------------------- plums and motes

function glowTexture(): THREE.CanvasTexture {
  return canvasTex(32, 32, (c) => {
    const gr = c.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.4, 'rgba(255,255,255,0.45)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = gr;
    c.fillRect(0, 0, 32, 32);
  });
}

export interface Motes {
  points: THREE.Points;
  positions: Float32Array;
  dispose: () => void;
}

/** A small additive cloud of `n` soft points. */
export function buildMotes(n: number, color: string, size: number): Motes {
  const positions = new Float32Array(n * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const tex = glowTexture();
  const mat = new THREE.PointsMaterial({
    map: tex,
    color,
    size,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  points.visible = false;
  return {
    points,
    positions,
    dispose: () => {
      geo.dispose();
      tex.dispose();
      mat.dispose();
    },
  };
}

/** Plums on one tree's crown and a few fallen under it, one instanced mesh. */
export function buildPlums(): THREE.InstancedMesh {
  const n = 14 + 7;
  const mesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.12, 8, 6),
    new THREE.MeshStandardMaterial({ color: '#6a2f86', roughness: 0.45 }),
    n,
  );
  mesh.castShadow = true;
  mesh.frustumCulled = false;
  return mesh;
}

// ---------------------------------------------------------------------------- the story race (M4)

export interface RaceSpan {
  kind: string;
  start: number;
  end: number;
  y0: number;
  y1: number;
}

/**
 * Frosted rails along the run, stretch and climb sections, and two stands of spectators (small
 * Keeper figures, instanced) at the start and the finish. Static: nothing moves.
 */
export function buildStoryRace(o: {
  spans: readonly RaceSpan[];
  unit: number;
  zBack: number;
  zFront: number;
  endX: number;
  endY: number;
}): THREE.Group {
  const g = new THREE.Group();
  const frost = new THREE.MeshStandardMaterial({
    color: '#cfe3f2',
    emissive: '#6f8fb0',
    emissiveIntensity: 0.25,
    roughness: 0.5,
  });
  const rail = new THREE.BoxGeometry(1, 0.07, 0.07);
  const post = new THREE.BoxGeometry(0.08, 0.5, 0.08);
  for (const s of o.spans) {
    if (s.kind !== 'run' && s.kind !== 'stretch' && s.kind !== 'climb') continue;
    const x0 = s.start * o.unit;
    const x1 = s.end * o.unit;
    const len = Math.hypot(x1 - x0, s.y1 - s.y0);
    const tilt = Math.atan2(s.y1 - s.y0, x1 - x0);
    for (const z of [o.zBack, o.zFront]) {
      const r = new THREE.Mesh(rail, frost);
      r.scale.x = len;
      r.position.set((x0 + x1) / 2, (s.y0 + s.y1) / 2 + 0.5, z);
      r.rotation.z = tilt;
      g.add(r);
      const n = Math.max(2, Math.round((x1 - x0) / 2.4));
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const p = new THREE.Mesh(post, frost);
        p.position.set(x0 + (x1 - x0) * t, s.y0 + (s.y1 - s.y0) * t + 0.25, z);
        g.add(p);
      }
    }
  }
  // Stands: three plank steps, spectators on each.
  const wood = new THREE.MeshStandardMaterial({ color: '#85726a', roughness: 0.9 });
  const body = new THREE.CylinderGeometry(0.14, 0.17, 0.42, 8);
  const head = new THREE.SphereGeometry(0.12, 8, 6);
  const shirts = ['#d9534f', '#4f8fd9', '#e0b43a', '#6fbf73', '#9a6ad9', '#e07fb0'];
  const skins = ['#f2c9a0', '#d9a074', '#a8734a', '#f6d7b8'];
  const stands: Array<[number, number]> = [
    [-9, 0],
    [o.endX - 14, o.endY],
  ];
  const per = 18;
  const bodies = new THREE.InstancedMesh(
    body,
    new THREE.MeshStandardMaterial({ roughness: 0.8 }),
    stands.length * per * 2,
  );
  const heads = new THREE.InstancedMesh(
    head,
    new THREE.MeshStandardMaterial({ roughness: 0.7 }),
    stands.length * per * 2,
  );
  const m4 = new THREE.Matrix4();
  const c = new THREE.Color();
  let k = 0;
  for (const [sx, sy] of stands) {
    for (let step = 0; step < 3; step++) {
      const z = o.zBack - 1.4 - step * 0.9;
      const slab = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 0.9), wood);
      slab.position.set(sx + 6, sy + 0.2 + step * 0.4, z);
      slab.castShadow = slab.receiveShadow = true;
      g.add(slab);
      if (step > 1) continue;
      for (let i = 0; i < per; i++) {
        const h = (i * 2654435761 + step * 97 + (sx | 0)) >>> 0;
        if (h % 5 === 0) {
          // An empty seat, so the stand is not a wall of faces.
          continue;
        }
        const x = sx + 0.4 + (i / per) * 11.2;
        const y = sy + 0.4 + step * 0.4;
        m4.makeTranslation(x, y + 0.21, z);
        bodies.setMatrixAt(k, m4);
        bodies.setColorAt(k, c.set(shirts[(h >> 3) % shirts.length]!));
        m4.makeTranslation(x, y + 0.55, z);
        heads.setMatrixAt(k, m4);
        heads.setColorAt(k, c.set(skins[(h >> 5) % skins.length]!));
        k++;
      }
    }
  }
  bodies.count = k;
  heads.count = k;
  bodies.instanceMatrix.needsUpdate = heads.instanceMatrix.needsUpdate = true;
  if (bodies.instanceColor) bodies.instanceColor.needsUpdate = true;
  if (heads.instanceColor) heads.instanceColor.needsUpdate = true;
  bodies.frustumCulled = heads.frustumCulled = false;
  g.add(bodies, heads);
  return g;
}

// ---------------------------------------------------------------------------- torches (M14, H18)

/** Four wall-less standing torches with an emissive flame, for the Beetle Road's below grade. */
export function buildTorches(): { group: THREE.Group; flames: THREE.Mesh[] } {
  const group = new THREE.Group();
  const post = new THREE.CylinderGeometry(0.06, 0.08, 1.7, 6);
  const flameGeo = new THREE.ConeGeometry(0.2, 0.55, 8);
  const woodMat = new THREE.MeshStandardMaterial({ color: '#5a3c28', roughness: 0.9 });
  const flameMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#ff9a2c').multiplyScalar(2),
    toneMapped: false,
  });
  const flames: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const t = new THREE.Group();
    const p = new THREE.Mesh(post, woodMat);
    p.position.y = 0.85;
    const f = new THREE.Mesh(flameGeo, flameMat);
    f.position.y = 1.95;
    t.add(p, f);
    group.add(t);
    flames.push(f);
  }
  group.visible = false;
  return { group, flames };
}
