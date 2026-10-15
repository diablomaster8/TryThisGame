import * as THREE from 'three';
import { fbm, ridged, vnoise } from '../render/paint/noise';
import { hex, mix, Raster, shade, type RGB } from '../render/paint/raster';

/**
 * Five "think like a console" directions for a full-3D Grove, as live samples
 * (`?retro3d=1..5`): the same little valley (a grass bowl walled by textured cliffs, a
 * cobbled mound, a dirt path, a wooden ramp, billboard trees, the cottage far back,
 * the Keeper seen from behind with two Nubbins) rendered the way each machine did it.
 *
 *   1 n64        320×240 upscaled with a soft bilinear blur, vertex (Gouraud) lighting
 *                baked into vertex colours, 64×64 filtered textures, blob shadows,
 *                camera-facing tree sprites.
 *   2 ps1        320×240 with no texture filtering, vertex snapping to the screen grid,
 *                affine (warping) texture mapping, ordered dithering to 15-bit colour.
 *   3 ds         256×192, flat two-step toon lighting with dark edge marking, tiny
 *                unfiltered textures, strong vertex colours.
 *   4 dreamcast  640×480, smooth higher-poly shapes, per-pixel Phong with specular
 *                highlights and mipmapped textures, soft real shadows, bright skies:
 *                the Chao Garden's own generation.
 *   5 hdport     the n64 scene's simple shapes and bold colours at full resolution:
 *                crisp 256px textures, per-pixel light, soft shadow maps, widescreen.
 */
export type RetroStyle = 'n64' | 'ps1' | 'ds' | 'dreamcast' | 'hdport';
export const RETRO_STYLES: RetroStyle[] = ['n64', 'ps1', 'ds', 'dreamcast', 'hdport'];

type TexKind = 'grass' | 'rock' | 'cobble' | 'dirt' | 'wood' | 'wall' | 'roof';

// ---------------------------------------------------------------- textures (painted, tiling)

function paintTile(kind: TexKind, size: number): Raster {
  const r = new Raster(size, size, hex('#5f9e3c'));
  const s = size;
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      // Sampled on a torus so every tile wraps.
      const ax = Math.cos((x / s) * Math.PI * 2) * 1.6;
      const ay = Math.sin((x / s) * Math.PI * 2) * 1.6;
      const bx = Math.cos((y / s) * Math.PI * 2) * 1.6;
      const by = Math.sin((y / s) * Math.PI * 2) * 1.6;
      const n = fbm(ax + bx + 5, ay + by + 5, 3, 31);
      const fine = fbm(x / (s / 12), y / (s / 12), 2, 32);
      let c: RGB;
      switch (kind) {
        case 'grass':
          // The bright, blotchy green of a 1996 lawn.
          c = mix(hex('#2fa02a'), hex('#8ee84a'), Math.max(0, Math.min(1, (n - 0.25) * 1.9)));
          if (fine > 0.72) c = shade(c, 1.18);
          if (fine < 0.3) c = shade(c, 0.85);
          break;
        case 'rock': {
          // Orange-brown cliff with strata and dark pits.
          const band = fbm(ax + 9, (y / s) * 6 + fbm(ax, 0, 2, 33) * 1.5, 3, 34);
          const g = ridged(x / (s / 8), y / (s / 8), 3, 35);
          c = mix(hex('#7a3a16'), hex('#e08a44'), band * 0.55 + g * 0.45);
          if (g > 0.84) c = shade(c, 0.5);
          break;
        }
        case 'cobble': {
          // Pale blue-grey river stones with dark joints.
          const cell = vnoise(x / (s / 7), y / (s / 7), 36);
          const edge = Math.abs(cell - 0.5) < 0.035;
          c = mix(hex('#8fa0b0'), hex('#dfe8f0'), n * 0.5 + fine * 0.5);
          if (edge || Math.abs(vnoise(x / (s / 7) + 3, y / (s / 7), 37) - 0.5) < 0.03)
            c = shade(c, 0.45);
          break;
        }
        case 'dirt':
          c = mix(hex('#7a5a30'), hex('#c89a5a'), n * 0.6 + fine * 0.4);
          if (fine > 0.8) c = shade(c, 1.2);
          break;
        case 'wood': {
          const plank = Math.floor(y / (s / 4));
          c = mix(
            hex('#8a5a2a'),
            hex('#d4a060'),
            fbm(x / (s / 6), plank * 3, 2, 38) * 0.7 + fine * 0.3,
          );
          if (y % (s / 4) < 2) c = shade(c, 0.5);
          break;
        }
        case 'wall':
          c = mix(hex('#d8cfb8'), hex('#fff6e0'), n);
          if (fine > 0.8) c = shade(c, 0.9);
          break;
        default: {
          const row = Math.floor(y / (s / 6));
          const tx = (x + (row % 2) * (s / 12)) % (s / 6);
          c = mix(hex('#8a3a2a'), hex('#d87a5a'), fine);
          if (tx < 2 || y % (s / 6) < 2) c = shade(c, 0.5);
        }
      }
      r.set(x, y, c);
    }
  }
  return r;
}

/** A camera-facing tree: a round two-tone canopy on a short trunk, with alpha. */
function paintTreeSprite(size: number): Raster {
  const r = new Raster(size, Math.round(size * 1.4), null);
  r.tracking = true;
  const cx = size / 2;
  r.rect(cx - size * 0.06, size * 0.9, size * 0.12, size * 0.5, hex('#6a3e1c'));
  const lobes: Array<[number, number, number]> = [
    [0, 0.55, 0.36],
    [-0.26, 0.72, 0.28],
    [0.26, 0.72, 0.28],
    [-0.14, 0.32, 0.26],
    [0.16, 0.3, 0.26],
    [0, 0.85, 0.22],
  ];
  for (const [dx, dy, rr] of lobes) {
    r.disc(cx + dx * size, dy * size, rr * size, hex('#1f7a2c'));
    r.disc(
      cx + dx * size - rr * size * 0.25,
      dy * size - rr * size * 0.25,
      rr * size * 0.7,
      hex('#3fbf3a'),
    );
  }
  r.tracking = false;
  return r;
}

export interface Look {
  style: RetroStyle;
  texSize: number;
  filter: 'nearest' | 'linear' | 'mip';
  /** Render height in pixels; 0 = native. */
  height: number;
  upscale: 'nearest' | 'linear';
  lighting: 'vertex' | 'toon' | 'phong' | 'pbr';
  shadows: 'blob' | 'map';
  trees: 'sprite' | 'mesh';
  outlines: boolean;
}

export const LOOKS: Record<RetroStyle, Look> = {
  n64: {
    style: 'n64',
    texSize: 64,
    filter: 'linear',
    height: 240,
    upscale: 'linear',
    lighting: 'vertex',
    shadows: 'blob',
    trees: 'sprite',
    outlines: false,
  },
  ps1: {
    style: 'ps1',
    texSize: 64,
    filter: 'nearest',
    height: 240,
    upscale: 'nearest',
    lighting: 'vertex',
    shadows: 'blob',
    trees: 'sprite',
    outlines: false,
  },
  ds: {
    style: 'ds',
    texSize: 64,
    filter: 'nearest',
    height: 192,
    upscale: 'nearest',
    lighting: 'toon',
    shadows: 'blob',
    trees: 'sprite',
    outlines: true,
  },
  dreamcast: {
    style: 'dreamcast',
    texSize: 128,
    filter: 'mip',
    height: 480,
    upscale: 'linear',
    lighting: 'phong',
    shadows: 'map',
    trees: 'mesh',
    outlines: false,
  },
  hdport: {
    style: 'hdport',
    texSize: 256,
    filter: 'mip',
    height: 0,
    upscale: 'linear',
    lighting: 'pbr',
    shadows: 'map',
    trees: 'mesh',
    outlines: false,
  },
};

// ---------------------------------------------------------------- materials

const SUN = new THREE.Vector3(0.45, 0.8, 0.35).normalize();

/** Gouraud: light per vertex, baked into a colour attribute, drawn unlit. */
function bakeVertexLight(geo: THREE.BufferGeometry, steps: number): void {
  geo.computeVertexNormals();
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const nrm = geo.attributes.normal as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    n.fromBufferAttribute(nrm, i);
    let l = 0.45 + Math.max(0, n.dot(SUN)) * 0.65;
    if (steps > 0) l = (Math.round(l * steps) / steps) * 0.95 + 0.1;
    colors[i * 3] = l;
    colors[i * 3 + 1] = l;
    colors[i * 3 + 2] = l;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}

const PS1_VERT = /* glsl */ `
  uniform vec2 uRes;
  varying vec3 vUvW;
  varying vec3 vColor;
  void main() {
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // Snap vertices to the screen grid: the PS1 had no sub-pixel precision.
    vec2 grid = uRes * 0.5;
    clip.xy = floor(clip.xy / clip.w * grid + 0.5) / grid * clip.w;
    // Affine texturing: interpolate uv*w and w with perspective, divide after.
    vUvW = vec3(uv * clip.w, clip.w);
    vColor = color;
    gl_Position = clip;
  }
`;

const PS1_FRAG = /* glsl */ `
  uniform sampler2D map;
  uniform vec3 uTint;
  varying vec3 vUvW;
  varying vec3 vColor;
  void main() {
    vec2 uv = vUvW.xy / vUvW.z;
    vec3 c = texture2D(map, uv).rgb * vColor * uTint;
    // Ordered 4×4 dither down to 15-bit colour.
    int x = int(mod(gl_FragCoord.x, 4.0));
    int y = int(mod(gl_FragCoord.y, 4.0));
    int idx = x + y * 4;
    float bayer[16];
    bayer[0]=0.0; bayer[1]=8.0; bayer[2]=2.0; bayer[3]=10.0;
    bayer[4]=12.0; bayer[5]=4.0; bayer[6]=14.0; bayer[7]=6.0;
    bayer[8]=3.0; bayer[9]=11.0; bayer[10]=1.0; bayer[11]=9.0;
    bayer[12]=15.0; bayer[13]=7.0; bayer[14]=13.0; bayer[15]=5.0;
    float d = 0.0;
    for (int i = 0; i < 16; i++) { if (i == idx) d = bayer[i]; }
    c = floor(c * 31.0 + (d / 16.0)) / 31.0;
    gl_FragColor = vec4(c, 1.0);
  }
`;

class Materials {
  private readonly cache = new Map<string, THREE.Texture>();
  private white: THREE.Texture | null = null;
  readonly resolution = new THREE.Vector2(320, 240);

  constructor(readonly look: Look) {}

  texture(kind: TexKind | 'white'): THREE.Texture {
    if (kind === 'white') {
      if (!this.white) {
        const r = new Raster(4, 4, hex('#ffffff'));
        this.white = r.toTexture(true);
      }
      return this.white;
    }
    let t = this.cache.get(kind);
    if (!t) {
      t = paintTile(kind, this.look.texSize).toTexture(true);
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      const f = this.look.filter;
      t.magFilter = f === 'nearest' ? THREE.NearestFilter : THREE.LinearFilter;
      t.minFilter =
        f === 'nearest'
          ? THREE.NearestFilter
          : f === 'linear'
            ? THREE.LinearFilter
            : THREE.LinearMipmapLinearFilter;
      t.generateMipmaps = f === 'mip';
      t.anisotropy = f === 'mip' && this.look.style === 'hdport' ? 8 : 1;
      this.cache.set(kind, t);
    }
    return t;
  }

  /** A surface material for a geometry (the geometry is lit here for the vertex styles). */
  surface(
    geo: THREE.BufferGeometry,
    kind: TexKind | 'white',
    color = '#ffffff',
    shiny = false,
  ): THREE.Material {
    const map = this.texture(kind);
    const tint = new THREE.Color(color);
    switch (this.look.lighting) {
      case 'vertex': {
        bakeVertexLight(geo, 0);
        if (this.look.style === 'ps1') {
          return new THREE.ShaderMaterial({
            uniforms: {
              map: { value: map },
              uRes: { value: this.resolution },
              uTint: { value: tint },
            },
            vertexShader: PS1_VERT,
            fragmentShader: PS1_FRAG,
            vertexColors: true,
          });
        }
        return new THREE.MeshBasicMaterial({ map, color: tint, vertexColors: true });
      }
      case 'toon':
        bakeVertexLight(geo, 2);
        return new THREE.MeshBasicMaterial({ map, color: tint, vertexColors: true });
      case 'phong':
        return new THREE.MeshPhongMaterial({
          map,
          color: tint,
          shininess: shiny ? 60 : 12,
          specular: new THREE.Color(shiny ? '#ffffff' : '#404040'),
        });
      default:
        return new THREE.MeshStandardMaterial({
          map,
          color: tint,
          roughness: shiny ? 0.35 : 0.85,
          metalness: 0,
        });
    }
  }
}

// ---------------------------------------------------------------- the valley

export interface SurfaceMaker {
  surface(
    geo: THREE.BufferGeometry,
    kind: TexKind | 'white',
    color?: string,
    shiny?: boolean,
  ): THREE.Material;
}

export interface Build {
  scene: THREE.Scene;
  mats: SurfaceMaker;
  look: Look;
  sprites: THREE.Sprite[];
}

function mesh(
  b: Build,
  geo: THREE.BufferGeometry,
  kind: TexKind | 'white',
  color?: string,
  shiny?: boolean,
): THREE.Mesh {
  const m = new THREE.Mesh(geo, b.mats.surface(geo, kind, color, shiny));
  m.castShadow = b.look.shadows === 'map';
  m.receiveShadow = b.look.shadows === 'map';
  if (b.look.outlines) {
    const o = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: '#10101c', side: THREE.BackSide }),
    );
    o.scale.multiplyScalar(1.035);
    m.add(o);
  }
  b.scene.add(m);
  return m;
}

function repeatUv(geo: THREE.BufferGeometry, ru: number, rv: number): THREE.BufferGeometry {
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * ru, uv.getY(i) * rv);
  return geo;
}

function blob(b: Build, x: number, z: number, r: number): void {
  if (b.look.shadows !== 'blob') return;
  const g = new THREE.CircleGeometry(r, 10);
  const m = new THREE.Mesh(
    g,
    new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.45 }),
  );
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, 0.02, z);
  b.scene.add(m);
}

function terrain(b: Build): void {
  // The lawn: a big plane with a slight roll, so the far side rises into the cliffs.
  const g = new THREE.PlaneGeometry(70, 70, 24, 24);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, fbm(x / 9, y / 9, 2, 41) * 0.9 - 0.4 + Math.max(0, (y - 14) * 0.12));
  }
  repeatUv(g, 14, 14);
  const lawn = mesh(b, g, 'grass');
  lawn.rotation.x = -Math.PI / 2;
  // Cliff walls on three sides, tall and textured, leaning in a little.
  const wall = (x: number, z: number, w: number, rotY: number) => {
    const wg = new THREE.PlaneGeometry(w, 16, 6, 3);
    const p = wg.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++)
      p.setZ(i, (fbm(p.getX(i) / 5, p.getY(i) / 5, 2, 42) - 0.5) * 2.2);
    repeatUv(wg, w / 6, 2.6);
    const m = mesh(b, wg, 'rock');
    m.position.set(x, 7, z);
    m.rotation.y = rotY;
  };
  wall(0, 30, 72, Math.PI);
  wall(-34, 0, 70, Math.PI / 2);
  wall(34, 0, 70, -Math.PI / 2);
  // The cobbled mound (an eight-sided frustum) with a dark hole in the top.
  const mound = new THREE.CylinderGeometry(5.2, 7.6, 1.5, 8, 1);
  repeatUv(mound, 6, 1.2);
  const mm = mesh(b, mound, 'cobble');
  mm.position.set(-1, 0.75, 9);
  mm.rotation.y = Math.PI / 8;
  const hole = new THREE.Mesh(
    new THREE.CircleGeometry(0.9, 10),
    new THREE.MeshBasicMaterial({ color: '#1a1a22' }),
  );
  hole.rotation.x = -Math.PI / 2;
  hole.position.set(-1.5, 1.52, 8.5);
  b.scene.add(hole);
  // A dirt path winding to the ramp.
  const path = new THREE.PlaneGeometry(2.6, 26, 2, 12);
  const pp = path.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pp.count; i++) pp.setX(i, pp.getX(i) + Math.sin(pp.getY(i) / 5) * 1.6);
  repeatUv(path, 1, 8);
  const pm = mesh(b, path, 'dirt');
  pm.rotation.x = -Math.PI / 2;
  pm.position.set(13, 0.05, 12);
  // A wooden ramp up to the right-hand ledge, and the ledge.
  const ramp = new THREE.BoxGeometry(5, 0.4, 14);
  repeatUv(ramp, 1.2, 4);
  const rm = mesh(b, ramp, 'wood');
  rm.position.set(21, 2.4, 20);
  rm.rotation.x = -0.34;
  const ledge = new THREE.BoxGeometry(14, 5, 10);
  repeatUv(ledge, 3, 1.2);
  const lm = mesh(b, ledge, 'rock');
  lm.position.set(28, 2.5, 30);
  // Signs.
  for (const [x, z] of [
    [9, 14],
    [17, 9],
  ] as const) {
    const post = mesh(b, new THREE.BoxGeometry(0.16, 1.2, 0.16), 'wood');
    post.position.set(x, 0.6, z);
    const board = mesh(b, new THREE.BoxGeometry(1.1, 0.7, 0.1), 'wood');
    board.position.set(x, 1.3, z);
  }
  // A crate.
  const crate = mesh(b, new THREE.BoxGeometry(1.2, 1.2, 1.2), 'wood');
  crate.position.set(20, 0.6, 7);
  // The cottage, far back on the left.
  const house = mesh(b, repeatUv(new THREE.BoxGeometry(6, 3, 4.5), 2, 1), 'wall');
  house.position.set(-14, 1.5, 20);
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-3.6, 0);
  roofShape.lineTo(3.6, 0);
  roofShape.lineTo(0, 2.4);
  roofShape.closePath();
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 5.3, bevelEnabled: false });
  roofGeo.computeBoundingBox();
  // Planar UVs for the extrusion so the tiles read.
  const rp = roofGeo.attributes.position as THREE.BufferAttribute;
  const ruv = new Float32Array(rp.count * 2);
  for (let i = 0; i < rp.count; i++) {
    ruv[i * 2] = rp.getZ(i) / 2.5;
    ruv[i * 2 + 1] = rp.getX(i) / 2.5;
  }
  roofGeo.setAttribute('uv', new THREE.BufferAttribute(ruv, 2));
  const roof = mesh(b, roofGeo, 'roof');
  roof.position.set(-14, 3, 17.35);
  const door = mesh(b, new THREE.BoxGeometry(1.1, 1.8, 0.1), 'white', '#5a3418');
  door.position.set(-14, 0.9, 22.3);
}

function tree(b: Build, x: number, z: number, scale: number): void {
  if (b.look.trees === 'sprite') {
    const r = paintTreeSprite(b.look.texSize);
    const t = r.toTexture(false);
    t.magFilter = b.look.filter === 'nearest' ? THREE.NearestFilter : THREE.LinearFilter;
    t.minFilter = t.magFilter;
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: t, transparent: true, alphaTest: 0.5 }),
    );
    s.scale.set(5.2 * scale, 7.3 * scale, 1);
    s.position.set(x, 3.6 * scale, z);
    b.scene.add(s);
    b.sprites.push(s);
    blob(b, x, z, 1.4 * scale);
    return;
  }
  const trunk = mesh(
    b,
    new THREE.CylinderGeometry(0.3 * scale, 0.5 * scale, 2.6 * scale, 10),
    'wood',
  );
  trunk.position.set(x, 1.3 * scale, z);
  for (const [dx, dy, dz, rr, c] of [
    [0, 3.6, 0, 1.8, '#2f8a2f'],
    [-1.2, 3.0, 0.5, 1.2, '#1f7a2c'],
    [1.2, 3.1, -0.4, 1.2, '#1f7a2c'],
    [0.2, 4.9, 0.3, 1.1, '#3fbf3a'],
  ] as const) {
    const lobe = mesh(b, new THREE.SphereGeometry(rr * scale, 18, 14), 'white', c);
    lobe.position.set(x + dx * scale, dy * scale, z + dz * scale);
  }
}

function nubbin(b: Build, x: number, z: number, body: string, facing: number): void {
  const g = new THREE.Group();
  const seg = b.look.lighting === 'vertex' || b.look.lighting === 'toon' ? 10 : 24;
  const sph = (r: number, c: string, shiny = false) =>
    mesh(b, new THREE.SphereGeometry(r, seg, Math.round(seg * 0.7)), 'white', c, shiny);
  const bod = sph(0.75, body, true);
  bod.position.y = 0.8;
  const head = sph(0.62, body, true);
  head.position.y = 1.85;
  const crown = mesh(b, new THREE.ConeGeometry(0.2, 0.5, 8), 'white', '#ffe066');
  crown.position.y = 2.6;
  const ball = sph(0.17, '#ffe066');
  ball.position.y = 3.2;
  const parts = [bod, head, crown, ball];
  for (const dx of [-0.24, 0.24]) {
    const eye = sph(0.13, '#101018');
    eye.position.set(dx, 1.95, 0.52);
    parts.push(eye);
  }
  for (const dx of [-0.42, 0.42]) {
    const foot = sph(0.26, '#ffb020');
    foot.position.set(dx, 0.2, 0.25);
    parts.push(foot);
    const arm = sph(0.2, '#ffe066');
    arm.position.set(dx * 1.9, 0.95, 0.1);
    parts.push(arm);
  }
  for (const p of parts) {
    b.scene.remove(p);
    g.add(p);
  }
  g.position.set(x, 0, z);
  g.rotation.y = facing;
  b.scene.add(g);
  blob(b, x, z, 0.8);
}

function keeper(b: Build): void {
  const g = new THREE.Group();
  const seg = b.look.lighting === 'vertex' || b.look.lighting === 'toon' ? 10 : 24;
  const sph = (r: number, c: string) =>
    mesh(b, new THREE.SphereGeometry(r, seg, Math.round(seg * 0.7)), 'white', c);
  const torso = mesh(b, new THREE.CapsuleGeometry(0.5, 0.6, 4, seg), 'white', '#e03030');
  torso.position.y = 1.35;
  const overalls = mesh(b, new THREE.CapsuleGeometry(0.52, 0.3, 4, seg), 'white', '#2a4ad0');
  overalls.position.y = 0.95;
  const head = sph(0.55, '#ffd0a8');
  head.position.y = 2.25;
  const hair = sph(0.5, '#5a2a10');
  hair.position.set(0, 2.42, -0.14);
  const cap = mesh(
    b,
    new THREE.SphereGeometry(0.58, seg, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    'white',
    '#e03030',
  );
  cap.position.y = 2.42;
  const brim = mesh(b, new THREE.CylinderGeometry(0.62, 0.62, 0.08, seg), 'white', '#e03030');
  brim.position.set(0, 2.5, 0.25);
  const parts = [torso, overalls, head, hair, cap, brim];
  for (const dx of [-0.42, 0.42]) {
    const leg = mesh(b, new THREE.CylinderGeometry(0.17, 0.2, 0.7, 8), 'white', '#2a4ad0');
    leg.position.set(dx * 0.6, 0.45, 0);
    parts.push(leg);
    const shoe = sph(0.24, '#6a3010');
    shoe.position.set(dx * 0.6, 0.15, 0.12);
    parts.push(shoe);
    const arm = mesh(b, new THREE.CylinderGeometry(0.14, 0.14, 0.8, 8), 'white', '#e03030');
    arm.position.set(dx * 1.5, 1.4, 0);
    arm.rotation.z = -dx * 0.6;
    parts.push(arm);
    const hand = sph(0.2, '#ffffff');
    hand.position.set(dx * 1.9, 1.0, 0.05);
    parts.push(hand);
  }
  for (const p of parts) {
    b.scene.remove(p);
    g.add(p);
  }
  g.rotation.y = Math.PI; // seen from behind
  b.scene.add(g);
  blob(b, 0, 0, 0.7);
}

function populate(b: Build): void {
  terrain(b);
  tree(b, -9, 13, 1.1);
  tree(b, 22, 7, 1);
  tree(b, -24, 8, 1.2);
  tree(b, 8, 24, 1.1);
  const fine = b.look.style === 'hdport' || b.look.style === 'dreamcast';
  const closeup = fine && new URLSearchParams(location.search).has('closeup');
  const nub = fine ? nubbinFine : nubbin;
  nub(b, 4.2, 2.2, '#ff8ac0', closeup ? Math.PI + 0.25 : 0.6);
  nub(b, -3.5, 10.5, '#ff8ac0', 0.1);
  nub(b, -7, 4, '#9ad0ff', -0.4);
  if (fine) keeperFine(b, closeup ? Math.PI - 0.57 : 0);
  else keeper(b);
}

// ---------------------------------------------------------------- mounting

export function mountRetroSample(canvas: HTMLCanvasElement, style: RetroStyle): () => void {
  const look = LOOKS[style];
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: look.height === 0 });
  renderer.setPixelRatio(look.height === 0 ? Math.min(2, window.devicePixelRatio) : 1);
  renderer.shadowMap.enabled = look.shadows === 'map';
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = style === 'hdport' ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(style === 'ps1' ? '#6aa8ff' : '#7ec8ff');
  // A gradient sky and far mountains so the valley has a horizon.
  const skyGeo = new THREE.SphereGeometry(90, 16, 8);
  const skyMat = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    vertexColors: true,
  });
  {
    const p = skyGeo.attributes.position as THREE.BufferAttribute;
    const c = new Float32Array(p.count * 3);
    for (let i = 0; i < p.count; i++) {
      const t = Math.max(0, Math.min(1, p.getY(i) / 90));
      const col = mix(hex('#cfefff'), hex('#3a7ae0'), t);
      c[i * 3] = col[0];
      c[i * 3 + 1] = col[1];
      c[i * 3 + 2] = col[2];
    }
    skyGeo.setAttribute('color', new THREE.BufferAttribute(c, 3));
  }
  scene.add(new THREE.Mesh(skyGeo, skyMat));
  for (const [x, z, s] of [
    [-20, 60, 22],
    [10, 66, 28],
    [40, 58, 20],
  ] as const) {
    const m = new THREE.Mesh(
      new THREE.ConeGeometry(s, s * 0.9, 7),
      new THREE.MeshBasicMaterial({ color: '#8aa8c0' }),
    );
    m.position.set(x, 4, z);
    scene.add(m);
  }

  const mats = new Materials(look);
  const b: Build = { scene, mats, look, sprites: [] };
  populate(b);

  if (look.lighting === 'phong' || look.lighting === 'pbr') {
    scene.add(new THREE.HemisphereLight('#dff2ff', '#3a6a2a', look.lighting === 'pbr' ? 0.9 : 0.8));
    const sun = new THREE.DirectionalLight('#fff4dc', look.lighting === 'pbr' ? 2.4 : 1.6);
    sun.position.copy(SUN).multiplyScalar(30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -36;
    sun.shadow.camera.right = 36;
    sun.shadow.camera.top = 36;
    sun.shadow.camera.bottom = -36;
    sun.shadow.camera.far = 90;
    sun.shadow.bias = -0.0008;
    sun.shadow.radius = 3;
    scene.add(sun);
  }

  // The Lakitu camera: low, behind the Keeper, drifting a little.
  const closeup = new URLSearchParams(location.search).has('closeup');
  const camera = new THREE.PerspectiveCamera(closeup ? 40 : 50, 16 / 9, 0.1, 220);

  // Low-res rendering through a render target, blitted to the canvas.
  let rt: THREE.WebGLRenderTarget | null = null;
  const blitScene = new THREE.Scene();
  const blitCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const blitMat = new THREE.MeshBasicMaterial();
  blitScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blitMat));

  const resize = () => {
    const w = canvas.clientWidth || 800;
    const h = canvas.clientHeight || 450;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    rt?.dispose();
    rt = null;
    if (look.height > 0) {
      const rh = look.height;
      const rw = Math.round((rh * w) / h);
      rt = new THREE.WebGLRenderTarget(rw, rh, {
        magFilter: look.upscale === 'nearest' ? THREE.NearestFilter : THREE.LinearFilter,
        minFilter: THREE.LinearFilter,
        depthBuffer: true,
      });
      rt.texture.colorSpace = THREE.SRGBColorSpace;
      blitMat.map = rt.texture;
      blitMat.needsUpdate = true;
      mats.resolution.set(rw, rh);
    }
  };
  resize();
  window.addEventListener('resize', resize);

  let raf = 0;
  const t0 = performance.now();
  const loop = () => {
    const t = (performance.now() - t0) / 1000;
    const a = Math.sin(t * 0.25) * 0.18;
    if (closeup) {
      camera.position.set(2.6 + Math.sin(a), 2.1, -4.0);
      camera.lookAt(1.1, 1.45, 0.6);
    } else {
      camera.position.set(Math.sin(a) * -7.5, 3.1, Math.cos(a) * -7.5);
      camera.lookAt(Math.sin(a) * 2, 1.6, 6);
    }
    for (const s of b.sprites) s.material.rotation = 0;
    if (rt) {
      renderer.setRenderTarget(rt);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(blitScene, blitCam);
    } else {
      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(loop);
  };
  loop();
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    rt?.dispose();
    renderer.dispose();
  };
}

// ---------------------------------------------------------------- the modelled characters

/** A smooth solid of revolution from a radius profile (radius, height), y up. */
function lathe(profile: Array<[number, number]>, segments = 32): THREE.LatheGeometry {
  const pts = profile.map(([r, y]) => new THREE.Vector2(r, y));
  const g = new THREE.LatheGeometry(pts, segments);
  g.computeVertexNormals();
  return g;
}

function part(
  b: Build,
  g: THREE.Group,
  geo: THREE.BufferGeometry,
  color: string,
  shiny = false,
): THREE.Mesh {
  const m = mesh(b, geo, 'white', color, shiny);
  b.scene.remove(m);
  g.add(m);
  return m;
}

/**
 * A Chao-faithful Nubbin: a round belly that tucks in at the neck, a head that rises
 * to the pointed crown, big dark eyes with a catchlight, yellow tips on hands and feet,
 * little wings and the emote ball.
 */
export function nubbinFine(b: Build, x: number, z: number, body: string, facing: number): void {
  const g = new THREE.Group();
  const tip = '#ffe066';
  part(
    b,
    g,
    lathe([
      [0, 0.05],
      [0.42, 0.08],
      [0.66, 0.4],
      [0.7, 0.7],
      [0.6, 1.05],
      [0.38, 1.3],
      [0.3, 1.38],
      [0, 1.4],
    ]),
    body,
    true,
  );
  const head = part(
    b,
    g,
    lathe([
      [0, 0],
      [0.5, 0.1],
      [0.7, 0.42],
      [0.72, 0.7],
      [0.62, 1.0],
      [0.4, 1.25],
      [0.18, 1.5],
      [0.06, 1.75],
      [0, 1.85],
    ]),
    body,
    true,
  );
  head.position.y = 1.3;
  const crownTip = part(b, g, new THREE.SphereGeometry(0.1, 12, 10), tip);
  crownTip.position.y = 3.1;
  for (const dx of [-0.25, 0.25]) {
    const eye = part(b, g, new THREE.SphereGeometry(0.15, 18, 14), '#141a3a', true);
    eye.scale.set(1, 1.6, 0.55);
    eye.position.set(dx, 2.0, 0.6);
    eye.rotation.y = dx * 0.5;
    const light = part(b, g, new THREE.SphereGeometry(0.05, 10, 8), '#ffffff');
    light.position.set(dx - 0.04, 2.12, 0.72);
  }
  for (const dx of [-0.4, 0.4]) {
    const cheek = part(b, g, new THREE.SphereGeometry(0.09, 12, 10), '#ffb3c8');
    cheek.scale.set(1, 0.6, 0.4);
    cheek.position.set(dx, 1.82, 0.58);
  }
  const smile = part(b, g, new THREE.TorusGeometry(0.1, 0.02, 8, 16, Math.PI), '#6a3a4a');
  smile.position.set(0, 1.78, 0.7);
  smile.rotation.z = Math.PI;
  for (const dx of [-1, 1]) {
    const arm = part(b, g, new THREE.CapsuleGeometry(0.13, 0.42, 6, 14), body, true);
    arm.position.set(dx * 0.72, 0.85, 0.15);
    arm.rotation.z = dx * 1.1;
    const hand = part(b, g, new THREE.SphereGeometry(0.17, 14, 12), tip, true);
    hand.position.set(dx * 0.98, 0.72, 0.2);
    const foot = part(b, g, new THREE.SphereGeometry(0.24, 16, 12), tip, true);
    foot.scale.set(1, 0.6, 1.3);
    foot.position.set(dx * 0.34, 0.14, 0.22);
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.quadraticCurveTo(0.35, 0.5, 0.1, 0.8);
    wingShape.quadraticCurveTo(-0.15, 0.5, 0, 0);
    const wing = part(b, g, new THREE.ShapeGeometry(wingShape, 12), '#ffffff');
    wing.material = new THREE.MeshStandardMaterial({
      color: '#eef6ff',
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    });
    wing.position.set(dx * 0.45, 1.0, -0.62);
    wing.rotation.y = dx * -0.7;
    wing.scale.x = dx;
  }
  const ball = part(b, g, new THREE.SphereGeometry(0.17, 18, 14), tip, true);
  ball.position.y = 3.55;
  (ball.material as THREE.MeshStandardMaterial).emissive = new THREE.Color('#6a5010');
  g.position.set(x, 0, z);
  g.rotation.y = facing;
  g.scale.setScalar(0.72);
  b.scene.add(g);
  blob(b, x, z, 0.8);
}

/**
 * The Keeper, modelled: a cartoon head on a lathe-built shirt and overalls with
 * straps and buttons, hair under the cap, eyes with pupils and catchlights, a nose,
 * ears, gloves and rounded shoes.
 */
export function keeperFine(b: Build, facing: number): void {
  const g = new THREE.Group();
  const skin = '#ffd0a8';
  const red = '#e03030';
  const blue = '#2a4ad0';
  part(
    b,
    g,
    lathe([
      [0.36, 0.55],
      [0.5, 0.6],
      [0.56, 0.95],
      [0.52, 1.3],
      [0.44, 1.5],
      [0.4, 1.56],
      [0, 1.56],
    ]),
    blue,
  );
  part(
    b,
    g,
    lathe([
      [0.4, 1.5],
      [0.52, 1.58],
      [0.58, 1.78],
      [0.54, 1.98],
      [0.34, 2.08],
      [0, 2.08],
    ]),
    red,
  );
  for (const dx of [-0.22, 0.22]) {
    const strap = part(b, g, new THREE.BoxGeometry(0.13, 0.6, 0.08), blue);
    strap.position.set(dx, 1.78, 0.46);
    strap.rotation.x = 0.25;
    const button = part(b, g, new THREE.CylinderGeometry(0.06, 0.06, 0.03, 12), '#ffe066', true);
    button.rotation.x = Math.PI / 2;
    button.position.set(dx, 1.52, 0.56);
  }
  const head = part(b, g, new THREE.SphereGeometry(0.62, 32, 24), skin);
  head.position.y = 2.6;
  head.scale.set(1, 0.95, 0.98);
  for (const dx of [-1, 1]) {
    const side = part(b, g, new THREE.SphereGeometry(0.17, 14, 12), '#6a3a18');
    side.scale.set(0.6, 1.1, 0.9);
    side.position.set(dx * 0.56, 2.62, -0.12);
  }
  const back = part(b, g, new THREE.SphereGeometry(0.42, 18, 14), '#6a3a18');
  back.scale.set(1.1, 0.7, 0.7);
  back.position.set(0, 2.62, -0.42);
  for (const dx of [-0.3, 0, 0.3]) {
    const fringe = part(b, g, new THREE.SphereGeometry(0.12, 12, 10), '#6a3a18');
    fringe.scale.set(1, 0.5, 0.7);
    fringe.position.set(dx, 2.96, 0.52);
  }
  const cap = part(
    b,
    g,
    new THREE.SphereGeometry(0.66, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.48),
    red,
  );
  cap.position.set(0, 2.78, -0.02);
  const brim = part(b, g, new THREE.CylinderGeometry(0.5, 0.5, 0.07, 24), red);
  brim.scale.set(1, 1, 0.7);
  brim.position.set(0, 3.0, 0.5);
  brim.rotation.x = -0.15;
  const badge = part(b, g, new THREE.CylinderGeometry(0.13, 0.13, 0.04, 16), '#ffffff');
  badge.rotation.x = Math.PI / 2 - 0.3;
  badge.position.set(0, 3.12, 0.6);
  for (const dx of [-0.2, 0.2]) {
    const white = part(b, g, new THREE.SphereGeometry(0.13, 18, 14), '#ffffff');
    white.scale.set(0.8, 1.3, 0.6);
    white.position.set(dx, 2.68, 0.6);
    const pupil = part(b, g, new THREE.SphereGeometry(0.07, 14, 12), '#1a3a9a', true);
    pupil.scale.set(0.9, 1.2, 0.6);
    pupil.position.set(dx + (dx > 0 ? -0.02 : 0.02), 2.67, 0.68);
    const light = part(b, g, new THREE.SphereGeometry(0.03, 8, 6), '#ffffff');
    light.position.set(dx + 0.02, 2.74, 0.73);
    const ear = part(b, g, new THREE.SphereGeometry(0.11, 12, 10), skin);
    ear.scale.set(0.5, 1, 0.8);
    ear.position.set(dx * 3.1, 2.56, -0.02);
  }
  const nose = part(b, g, new THREE.SphereGeometry(0.15, 16, 12), '#ffc090');
  nose.scale.set(1, 0.85, 1);
  nose.position.set(0, 2.5, 0.68);
  const mouth = part(b, g, new THREE.TorusGeometry(0.12, 0.025, 8, 16, Math.PI), '#8a3a3a');
  mouth.position.set(0, 2.3, 0.6);
  mouth.rotation.z = Math.PI;
  mouth.rotation.x = -0.3;
  for (const dx of [-1, 1]) {
    const arm = part(b, g, new THREE.CapsuleGeometry(0.15, 0.55, 6, 16), red);
    arm.position.set(dx * 0.7, 1.55, 0.08);
    arm.rotation.z = dx * 0.75;
    const glove = part(b, g, new THREE.SphereGeometry(0.21, 18, 14), '#ffffff');
    glove.position.set(dx * 0.98, 1.2, 0.14);
    const leg = part(b, g, new THREE.CapsuleGeometry(0.19, 0.3, 6, 16), blue);
    leg.position.set(dx * 0.26, 0.42, 0);
    const shoe = part(b, g, new THREE.SphereGeometry(0.26, 18, 14), '#6a3010');
    shoe.scale.set(1, 0.62, 1.35);
    shoe.position.set(dx * 0.28, 0.16, 0.1);
  }
  g.rotation.y = facing;
  g.scale.setScalar(0.78);
  b.scene.add(g);
  blob(b, 0, 0, 0.7);
}
