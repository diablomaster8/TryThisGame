import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { fbm, ridged } from '../render/paint/noise';
import { hex, mix, Raster, shade } from '../render/paint/raster';

/**
 * Five art directions for a full-3D Grove, as quick samples (`?style3d=1..5`): the same
 * little scene (ground, a hill, a pond, trees, the cottage, the well, two Nubbins and
 * the Keeper) built with each style's geometry, materials, lighting and post. Nothing
 * here is wired into the game; it is a conversation piece for Maor's pick.
 */
export type Style3D = 'lowpoly' | 'toon' | 'cozy' | 'painterly' | 'voxel';

export const STYLES: Style3D[] = ['lowpoly', 'toon', 'cozy', 'painterly', 'voxel'];

interface Ctx {
  style: Style3D;
  scene: THREE.Scene;
  mat: (color: string, opts?: { rough?: number; emissive?: string }) => THREE.Material;
  outline: (mesh: THREE.Mesh) => void;
}

// ---------------------------------------------------------------- materials per style

function toonGradient(): THREE.DataTexture {
  const colors = new Uint8Array([70, 130, 200, 255]);
  const tex = new THREE.DataTexture(colors, colors.length, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

/** A painted tile from the organic raster pipeline, wrapped as a repeating texture. */
function paintedTexture(
  kind: 'grass' | 'bark' | 'roof' | 'stone' | 'leaf' | 'water',
): THREE.CanvasTexture {
  const s = 128;
  const r = new Raster(s, s, hex('#5f9e3c'));
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const ax = Math.cos((x / s) * Math.PI * 2) * 2;
      const ay = Math.sin((x / s) * Math.PI * 2) * 2;
      const bx = Math.cos((y / s) * Math.PI * 2) * 2;
      const by = Math.sin((y / s) * Math.PI * 2) * 2;
      const n = fbm(ax + bx + 10, ay + by + 10, 4, 71);
      const fine = fbm(x / 9, y / 9, 2, 72);
      let c;
      if (kind === 'grass') {
        c = mix(hex('#4d9440'), hex('#8fcf62'), Math.max(0, Math.min(1, (n - 0.3) * 1.8)));
        c = shade(c, 0.86 + fine * 0.3);
        if (fine > 0.78) c = shade(c, 1.2);
      } else if (kind === 'leaf') {
        c = mix(hex('#27602c'), hex('#8fd262'), Math.max(0, Math.min(1, (n - 0.25) * 1.6)));
        c = shade(c, 0.8 + fine * 0.4);
      } else if (kind === 'bark') {
        const g = ridged(x / 6, y / 14, 3, 73);
        c = mix(hex('#4a2e18'), hex('#8a5a32'), n * 0.5 + g * 0.5);
        if (g > 0.8) c = shade(c, 0.6);
      } else if (kind === 'roof') {
        const row = Math.floor(y / 12);
        const off = (row % 2) * 10;
        const tx = (x + off) % 20;
        c = mix(hex('#8a4a30'), hex('#d08050'), fine);
        if (tx < 2 || y % 12 < 2) c = shade(c, 0.55);
      } else if (kind === 'water') {
        c = mix(hex('#1d4a86'), hex('#7fc0e8'), n * 0.7 + fine * 0.3);
        if (fine > 0.86) c = hex('#cfefff');
      } else {
        const g = ridged(x / 10, y / 10, 3, 74);
        c = mix(hex('#7a7a88'), hex('#c2c2cc'), n);
        if (g > 0.82) c = shade(c, 0.6);
      }
      r.set(x, y, c);
    }
  }
  const tex = r.toTexture(true);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

function makeCtx(style: Style3D, scene: THREE.Scene): Ctx {
  const gradient = style === 'toon' ? toonGradient() : null;
  const painted =
    style === 'painterly'
      ? {
          grass: paintedTexture('grass'),
          bark: paintedTexture('bark'),
          roof: paintedTexture('roof'),
          stone: paintedTexture('stone'),
          leaf: paintedTexture('leaf'),
          water: paintedTexture('water'),
        }
      : null;
  const mat: Ctx['mat'] = (color, opts = {}) => {
    const c = new THREE.Color(color);
    switch (style) {
      case 'lowpoly':
        return new THREE.MeshStandardMaterial({ color: c, flatShading: true, roughness: 0.9 });
      case 'toon':
        return new THREE.MeshToonMaterial({ color: c, gradientMap: gradient! });
      case 'cozy':
        return new THREE.MeshStandardMaterial({
          color: c,
          roughness: opts.rough ?? 0.75,
          metalness: 0,
          emissive: new THREE.Color(opts.emissive ?? '#000000'),
        });
      case 'painterly': {
        // Painted textures on the big surfaces; small parts keep a flat painted tone.
        const key = (
          {
            '#5f9e3c': 'grass',
            '#4d9440': 'grass',
            '#8a5a32': 'bark',
            '#b0603a': 'roof',
            '#8a8a96': 'stone',
            '#4a9c42': 'leaf',
            '#2f7a35': 'leaf',
            '#3a6a9a': 'water',
          } as Record<string, keyof NonNullable<typeof painted>>
        )[color];
        return new THREE.MeshLambertMaterial({
          color: key ? '#ffffff' : c,
          map: key ? painted![key] : null,
        });
      }
      case 'voxel':
        return new THREE.MeshLambertMaterial({ color: c });
    }
  };
  const outline = (mesh: THREE.Mesh) => {
    if (style !== 'toon') return;
    const o = new THREE.Mesh(
      mesh.geometry,
      new THREE.MeshBasicMaterial({ color: '#1a1030', side: THREE.BackSide }),
    );
    o.scale.multiplyScalar(1.045);
    mesh.add(o);
  };
  return { style, scene, mat, outline };
}

// ---------------------------------------------------------------- the props

const seg = (style: Style3D, lo: number, hi: number) => (style === 'lowpoly' ? lo : hi);

function add(ctx: Ctx, mesh: THREE.Mesh, x: number, y: number, z: number): THREE.Mesh {
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  ctx.outline(mesh);
  ctx.scene.add(mesh);
  return mesh;
}

/** Voxel models: a list of unit cubes, merged into one mesh per colour. */
function voxels(
  ctx: Ctx,
  cells: Array<[number, number, number, string]>,
  x: number,
  z: number,
  size = 0.35,
): void {
  const byColor = new Map<string, THREE.Vector3[]>();
  for (const [vx, vy, vz, c] of cells) {
    if (!byColor.has(c)) byColor.set(c, []);
    byColor.get(c)!.push(new THREE.Vector3(vx, vy, vz));
  }
  const box = new THREE.BoxGeometry(size, size, size);
  for (const [c, list] of byColor) {
    const m = new THREE.InstancedMesh(box, ctx.mat(c), list.length);
    const mtx = new THREE.Matrix4();
    list.forEach((p, i) => {
      mtx.makeTranslation(x + p.x * size, p.y * size + size / 2, z + p.z * size);
      m.setMatrixAt(i, mtx);
    });
    m.castShadow = true;
    m.receiveShadow = true;
    ctx.scene.add(m);
  }
}

function ground(ctx: Ctx): void {
  const s = ctx.style;
  if (s === 'voxel') {
    const cells: Array<[number, number, number, string]> = [];
    for (let x = -24; x < 24; x++)
      for (let z = -24; z < 24; z++) {
        const n = fbm(x / 6, z / 6, 2, 5);
        cells.push([x, 0, z, n > 0.58 ? '#8fcf62' : n < 0.4 ? '#4d9440' : '#5f9e3c']);
      }
    voxels(ctx, cells, 0, 0, 0.5);
    return;
  }
  const geo = new THREE.PlaneGeometry(26, 26, seg(s, 26, 1), seg(s, 26, 1));
  if (s === 'lowpoly') {
    // A gently bumpy low-poly floor.
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      pos.setZ(i, fbm(pos.getX(i) / 5, pos.getY(i) / 5, 2, 9) * 0.5 - 0.2);
    }
    geo.computeVertexNormals();
  }
  const m = ctx.mat('#5f9e3c');
  if (s === 'painterly') {
    const tex = (m as THREE.MeshLambertMaterial).map;
    if (tex) tex.repeat.set(4, 4);
  }
  const mesh = new THREE.Mesh(geo, m);
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  ctx.scene.add(mesh);
}

function hill(ctx: Ctx, x: number, z: number): void {
  const s = ctx.style;
  if (s === 'voxel') {
    const cells: Array<[number, number, number, string]> = [];
    for (let vx = -7; vx <= 7; vx++)
      for (let vz = -7; vz <= 7; vz++) {
        const d = Math.hypot(vx, vz);
        const h = d < 3 ? 5 : d < 5 ? 3 : d < 7 ? 1 : 0;
        for (let y = 0; y < h; y++)
          cells.push([vx, y + 1, vz, y === h - 1 ? '#7fcb58' : '#8a7a9a']);
      }
    voxels(ctx, cells, x, z, 0.5);
    return;
  }
  const tiers: Array<[number, number]> = [
    [3.6, 1.1],
    [2.6, 0.9],
    [1.7, 0.7],
  ];
  let y0 = 0;
  for (const [r, h] of tiers) {
    const geo = new THREE.CylinderGeometry(r * 0.92, r, h, seg(s, 9, 28), 1);
    const side = add(ctx, new THREE.Mesh(geo, ctx.mat('#8a8a96', { rough: 1 })), x, y0 + h / 2, z);
    void side;
    const top = add(
      ctx,
      new THREE.Mesh(new THREE.CircleGeometry(r * 0.92, seg(s, 9, 28)), ctx.mat('#4d9440')),
      x,
      y0 + h + 0.01,
      z,
    );
    top.rotation.x = -Math.PI / 2;
    y0 += h;
  }
}

function pond(ctx: Ctx, x: number, z: number): void {
  const s = ctx.style;
  if (s === 'voxel') {
    const cells: Array<[number, number, number, string]> = [];
    for (let vx = -5; vx <= 5; vx++)
      for (let vz = -4; vz <= 4; vz++)
        if (Math.hypot(vx / 5, vz / 4) < 1)
          cells.push([vx, 0, vz, (vx + vz) % 3 ? '#3a6a9a' : '#7fc0e8']);
    voxels(ctx, cells, x, z, 0.5);
    return;
  }
  const rim = add(
    ctx,
    new THREE.Mesh(new THREE.CircleGeometry(4.4, seg(s, 10, 40)), ctx.mat('#c9b784', { rough: 1 })),
    x,
    0.02,
    z,
  );
  rim.rotation.x = -Math.PI / 2;
  const water = new THREE.Mesh(
    new THREE.CircleGeometry(3.9, seg(s, 10, 40)),
    s === 'cozy'
      ? new THREE.MeshPhysicalMaterial({
          color: '#3a86c8',
          roughness: 0.1,
          metalness: 0,
          transmission: 0.3,
          transparent: true,
          opacity: 0.9,
        })
      : ctx.mat('#3a6a9a', { rough: 0.2 }),
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(x, 0.05, z);
  water.receiveShadow = true;
  ctx.scene.add(water);
}

function tree(ctx: Ctx, x: number, z: number, scale = 1): void {
  const s = ctx.style;
  if (s === 'voxel') {
    const cells: Array<[number, number, number, string]> = [];
    for (let y = 0; y < 5; y++) cells.push([0, y, 0, '#8a5a32']);
    for (let vx = -2; vx <= 2; vx++)
      for (let vy = 4; vy <= 8; vy++)
        for (let vz = -2; vz <= 2; vz++) {
          const d = Math.hypot(vx, (vy - 6) * 0.9, vz);
          if (d < 2.4) cells.push([vx, vy, vz, (vx + vy + vz) % 2 ? '#4a9c42' : '#68b94f']);
        }
    cells.push([1, 7, 2, '#ff9a3a'], [-2, 6, 0, '#ff9a3a']);
    voxels(ctx, cells, x, z, 0.4 * scale);
    return;
  }
  const trunk = add(
    ctx,
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.28 * scale, 0.45 * scale, 2.4 * scale, seg(s, 6, 14)),
      ctx.mat('#8a5a32'),
    ),
    x,
    1.2 * scale,
    z,
  );
  void trunk;
  const lobes: Array<[number, number, number, number, string]> = [
    [0, 3.4, 0, 1.7, '#4a9c42'],
    [1.1, 2.9, 0.4, 1.15, '#2f7a35'],
    [-1.0, 3.0, -0.4, 1.15, '#2f7a35'],
    [0.2, 4.5, 0.3, 1.0, '#4a9c42'],
  ];
  for (const [dx, dy, dz, r, c] of lobes) {
    const geo =
      s === 'lowpoly'
        ? new THREE.IcosahedronGeometry(r * scale, 0)
        : new THREE.SphereGeometry(r * scale, seg(s, 8, 24), seg(s, 6, 18));
    add(ctx, new THREE.Mesh(geo, ctx.mat(c)), x + dx * scale, dy * scale, z + dz * scale);
  }
  for (const [dx, dy, dz] of [
    [1.2, 2.6, 0.9],
    [-0.9, 3.1, 1.0],
    [0.3, 3.9, 1.2],
  ]) {
    add(
      ctx,
      new THREE.Mesh(
        new THREE.SphereGeometry(0.22 * scale, seg(s, 5, 12), seg(s, 4, 10)),
        ctx.mat('#ff9a3a'),
      ),
      x + dx! * scale,
      dy! * scale,
      z + dz! * scale,
    );
  }
}

function cottage(ctx: Ctx, x: number, z: number): void {
  const s = ctx.style;
  if (s === 'voxel') {
    const cells: Array<[number, number, number, string]> = [];
    for (let vx = -4; vx <= 4; vx++)
      for (let vz = -3; vz <= 3; vz++)
        for (let vy = 0; vy < 4; vy++) {
          const wall = Math.abs(vx) === 4 || Math.abs(vz) === 3;
          if (wall) cells.push([vx, vy, vz, vy === 0 ? '#8a8a96' : '#f4efe6']);
        }
    for (let layer = 0; layer < 4; layer++)
      for (let vx = -5 + layer; vx <= 5 - layer; vx++)
        for (let vz = -4 + layer; vz <= 4 - layer; vz++)
          cells.push([vx, 4 + layer, vz, layer % 2 ? '#b0603a' : '#8a4a30']);
    cells.push([0, 1, 4, '#6a3e1c'], [0, 0, 4, '#6a3e1c']);
    cells.push([-2, 2, 4, '#7fc0e8'], [2, 2, 4, '#7fc0e8']);
    cells.push([3, 8, -1, '#8a8a96'], [3, 9, -1, '#8a8a96']);
    voxels(ctx, cells, x, z, 0.4);
    return;
  }
  const w = 4.4;
  const d = 3.2;
  const h = 2.2;
  add(
    ctx,
    new THREE.Mesh(new THREE.BoxGeometry(w, h, d), ctx.mat('#f4efe6', { rough: 0.95 })),
    x,
    h / 2,
    z,
  );
  // A gabled roof: a triangular prism.
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-w / 2 - 0.4, 0);
  roofShape.lineTo(w / 2 + 0.4, 0);
  roofShape.lineTo(0, 1.8);
  roofShape.closePath();
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: d + 0.8, bevelEnabled: false });
  const roof = add(
    ctx,
    new THREE.Mesh(roofGeo, ctx.mat('#b0603a', { rough: 0.9 })),
    x,
    h,
    z - d / 2 - 0.4,
  );
  if (s === 'painterly') {
    const tex = (roof.material as THREE.MeshLambertMaterial).map;
    if (tex) tex.repeat.set(1.5, 1.5);
  }
  add(
    ctx,
    new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.4, 0.1), ctx.mat('#6a3e1c')),
    x,
    0.7,
    z + d / 2 + 0.05,
  );
  for (const dx of [-1.4, 1.4]) {
    add(
      ctx,
      new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.1),
        ctx.mat('#7fc0e8', { rough: 0.2, ...(s === 'cozy' ? { emissive: '#4a3a10' } : {}) }),
      ),
      x + dx,
      1.3,
      z + d / 2 + 0.05,
    );
  }
  add(
    ctx,
    new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 0.5), ctx.mat('#8a8a96')),
    x + 1.3,
    h + 1.6,
    z - 0.6,
  );
}

function well(ctx: Ctx, x: number, z: number): void {
  const s = ctx.style;
  if (s === 'voxel') {
    const cells: Array<[number, number, number, string]> = [];
    for (let vx = -1; vx <= 1; vx++)
      for (let vz = -1; vz <= 1; vz++)
        if (Math.abs(vx) === 1 || Math.abs(vz) === 1)
          cells.push([vx, 0, vz, '#8a8a96'], [vx, 1, vz, '#8a8a96']);
    cells.push(
      [-1, 2, 0, '#6a3e1c'],
      [-1, 3, 0, '#6a3e1c'],
      [1, 2, 0, '#6a3e1c'],
      [1, 3, 0, '#6a3e1c'],
    );
    for (let vx = -1; vx <= 1; vx++) cells.push([vx, 4, 0, '#b0603a']);
    voxels(ctx, cells, x, z, 0.4);
    return;
  }
  add(
    ctx,
    new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.85, 0.8, seg(s, 8, 20)), ctx.mat('#8a8a96')),
    x,
    0.4,
    z,
  );
  for (const dx of [-0.7, 0.7])
    add(
      ctx,
      new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 0.12), ctx.mat('#6a3e1c')),
      x + dx,
      1.4,
      z,
    );
  const roof = add(
    ctx,
    new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.6, seg(s, 4, 4)), ctx.mat('#b0603a')),
    x,
    2.3,
    z,
  );
  roof.rotation.y = Math.PI / 4;
}

function nubbin(ctx: Ctx, x: number, z: number, body: string, facing: number): void {
  const s = ctx.style;
  if (s === 'voxel') {
    const cells: Array<[number, number, number, string]> = [];
    for (let vx = -1; vx <= 1; vx++)
      for (let vz = -1; vz <= 1; vz++) {
        cells.push([vx, 0, vz, body], [vx, 1, vz, body], [vx, 2, vz, body]);
        // The eyes sit in the face instead of sticking out of it.
        if (!(vz === 1 && Math.abs(vx) === 1)) cells.push([vx, 3, vz, body]);
      }
    cells.push([0, 4, 0, '#ffe066']);
    cells.push([-1, 3, 1, '#1a1030'], [1, 3, 1, '#1a1030']);
    cells.push([-2, 1, 0, body], [2, 1, 0, body], [-2, 2, -1, '#ffffff'], [2, 2, -1, '#ffffff']);
    cells.push([0, 6, 0, '#ffe066']);
    voxels(ctx, cells, x, z, 0.32);
    return;
  }
  const g = new THREE.Group();
  const sph = (r: number, c: string, opts?: { rough?: number; emissive?: string }) =>
    new THREE.Mesh(
      s === 'lowpoly'
        ? new THREE.IcosahedronGeometry(r, 1)
        : new THREE.SphereGeometry(r, seg(s, 10, 28), seg(s, 8, 20)),
      ctx.mat(c, opts),
    );
  const b = sph(0.5, body);
  b.position.y = 0.5;
  const head = sph(0.46, body);
  head.position.y = 1.25;
  const crown = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 0.4, seg(s, 5, 12)),
    ctx.mat('#ffe066'),
  );
  crown.position.y = 1.8;
  const ball = sph(0.14, '#ffe066', { emissive: '#8a6a10' });
  ball.position.y = 2.3;
  for (const dx of [-0.17, 0.17]) {
    const eye = sph(0.09, '#1a1030');
    eye.position.set(dx, 1.32, 0.4);
    g.add(eye);
  }
  for (const dx of [-0.55, 0.55]) {
    const arm = sph(0.16, '#ffe066');
    arm.position.set(dx, 0.55, 0.1);
    g.add(arm);
    const foot = sph(0.18, '#ffe066');
    foot.position.set(dx * 0.55, 0.12, 0.2);
    g.add(foot);
    const wing = new THREE.Mesh(new THREE.CircleGeometry(0.22, seg(s, 5, 14)), ctx.mat('#ffffff'));
    wing.position.set(dx * 0.9, 0.95, -0.35);
    wing.rotation.y = dx > 0 ? -0.6 : 0.6;
    g.add(wing);
  }
  for (const m of [b, head, crown, ball]) {
    m.castShadow = true;
    ctx.outline(m);
    g.add(m);
  }
  g.position.set(x, 0, z);
  g.rotation.y = facing;
  ctx.scene.add(g);
}

function keeper(ctx: Ctx, x: number, z: number): void {
  const s = ctx.style;
  if (s === 'voxel') {
    const cells: Array<[number, number, number, string]> = [];
    for (let y = 0; y < 3; y++) cells.push([-1, y, 0, '#3a5a9a'], [1, y, 0, '#3a5a9a']);
    for (let vx = -1; vx <= 1; vx++) for (let y = 3; y < 7; y++) cells.push([vx, y, 0, '#e04a6a']);
    for (let y = 3; y < 6; y++) cells.push([-2, y, 0, '#ffd9b3'], [2, y, 0, '#ffd9b3']);
    for (let vx = -1; vx <= 1; vx++)
      for (let y = 7; y < 10; y++)
        for (let vz = -1; vz <= 1; vz++) cells.push([vx, y, vz, '#ffd9b3']);
    for (let vx = -2; vx <= 2; vx++)
      for (let vz = -2; vz <= 2; vz++) cells.push([vx, 10, vz, '#d9a76a']);
    cells.push([0, 11, 0, '#d9a76a'], [-1, 11, 0, '#d9a76a'], [1, 11, 0, '#d9a76a']);
    voxels(ctx, cells, x, z, 0.27);
    return;
  }
  const g = new THREE.Group();
  const bodyGeo = new THREE.CapsuleGeometry(0.42, 0.9, seg(s, 2, 6), seg(s, 8, 20));
  const body = new THREE.Mesh(bodyGeo, ctx.mat('#e04a6a', { rough: 0.9 }));
  body.position.y = 1.05;
  const head = new THREE.Mesh(
    s === 'lowpoly' ? new THREE.IcosahedronGeometry(0.4, 1) : new THREE.SphereGeometry(0.4, 24, 18),
    ctx.mat('#ffd9b3'),
  );
  head.position.y = 2.05;
  const brim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.75, 0.08, seg(s, 8, 24)),
    ctx.mat('#d9a76a'),
  );
  brim.position.y = 2.3;
  const hat = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.42, 0.36, seg(s, 8, 24)),
    ctx.mat('#d9a76a'),
  );
  hat.position.y = 2.5;
  for (const dx of [-0.3, 0.3]) {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.16, 0.7, seg(s, 6, 12)),
      ctx.mat('#3a5a9a'),
    );
    leg.position.set(dx, 0.35, 0);
    leg.castShadow = true;
    ctx.outline(leg);
    g.add(leg);
  }
  for (const m of [body, head, brim, hat]) {
    m.castShadow = true;
    ctx.outline(m);
    g.add(m);
  }
  g.position.set(x, 0, z);
  g.rotation.y = 0.4;
  ctx.scene.add(g);
}

function buildScene(ctx: Ctx): void {
  ground(ctx);
  hill(ctx, -7, -5);
  pond(ctx, 6, 3);
  tree(ctx, -2.5, -3, 1);
  tree(ctx, 7.5, -6, 0.85);
  tree(ctx, -8, 6, 0.9);
  cottage(ctx, 3.5, -7);
  well(ctx, -3.5, 4);
  nubbin(ctx, 0.3, 1.2, '#9ad0ff', 0.3);
  nubbin(ctx, 2.2, 0.2, '#f7a8c8', -0.6);
  keeper(ctx, -1.2, 2.4);
}

// ---------------------------------------------------------------- lighting, camera, post

export function mountStyleSample(canvas: HTMLCanvasElement, style: Style3D): () => void {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: style !== 'voxel' });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.shadowMap.enabled = style !== 'toon';
  renderer.shadowMap.type = style === 'voxel' ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
  renderer.toneMapping = style === 'cozy' ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
  renderer.toneMappingExposure = style === 'cozy' ? 1.05 : 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const sky: Record<Style3D, string> = {
    lowpoly: '#bfe3ff',
    toon: '#8fd3ff',
    cozy: '#dcecff',
    painterly: '#a9c8ec',
    voxel: '#9ed4ff',
  };
  scene.background = new THREE.Color(sky[style]);
  if (style === 'cozy' || style === 'lowpoly') scene.fog = new THREE.Fog(sky[style], 24, 46);

  const ctx = makeCtx(style, scene);
  buildScene(ctx);

  // Light rig: a warm key with shadows and a cool sky fill; the toon rig is harder.
  const hemi = new THREE.HemisphereLight('#cfe8ff', '#4a6a3a', style === 'toon' ? 0.9 : 0.75);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(
    '#fff1d6',
    style === 'cozy' ? 2.2 : style === 'toon' ? 1.6 : 1.9,
  );
  sun.position.set(8, 14, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -16;
  sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 16;
  sun.shadow.camera.bottom = -16;
  sun.shadow.bias = -0.0005;
  sun.shadow.radius = style === 'cozy' ? 4 : 1;
  scene.add(sun);
  if (style === 'cozy') {
    const rim = new THREE.DirectionalLight('#ffd0a0', 0.6);
    rim.position.set(-6, 6, -8);
    scene.add(rim);
  }

  let camera: THREE.Camera;
  const aspect = () => canvas.clientWidth / Math.max(1, canvas.clientHeight);
  if (style === 'voxel') {
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    cam.position.set(14, 14, 14);
    cam.lookAt(0, 0.5, 0);
    camera = cam;
  } else {
    const cam = new THREE.PerspectiveCamera(38, aspect(), 0.1, 100);
    cam.position.set(10, 9.5, 13);
    cam.lookAt(0, 0.6, 0);
    camera = cam;
  }

  let composer: EffectComposer | null = null;
  if (style === 'cozy') {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.35, 0.6, 0.85));
    composer.addPass(
      new BokehPass(scene, camera, { focus: 17, aperture: 0.00035, maxblur: 0.008 }),
    );
    composer.addPass(new OutputPass());
  }

  const resize = () => {
    const w = canvas.clientWidth || 800;
    const h = canvas.clientHeight || 450;
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    } else if (camera instanceof THREE.OrthographicCamera) {
      const half = 8;
      camera.left = -half * (w / h);
      camera.right = half * (w / h);
      camera.top = half;
      camera.bottom = -half;
      camera.updateProjectionMatrix();
    }
  };
  resize();
  window.addEventListener('resize', resize);

  let raf = 0;
  const t0 = performance.now();
  const loop = () => {
    const t = (performance.now() - t0) / 1000;
    // A slow drift so the shading reads; the game would orbit in 45° steps as now.
    const r = style === 'voxel' ? 19.8 : 16.4;
    const a = 0.72 + Math.sin(t * 0.15) * 0.12;
    camera.position.set(Math.sin(a) * r, style === 'voxel' ? 14 : 9.5, Math.cos(a) * r);
    camera.lookAt(0, 0.6, 0);
    if (composer) composer.render();
    else renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  };
  loop();
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    renderer.dispose();
  };
}
