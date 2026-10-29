import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';
import { playSound } from '../platform/audio';
import { elevationAt, WALL, WATER, type Floor } from '../sim/dungeon';
import { caveShed } from './cave-shed';
import { looksWet } from './hollow-dress-path';
import {
  CELL,
  cellHash,
  WALL_H,
  type HollowCtx,
  type HollowFrame,
  type HollowModule,
} from './hollow-ctx';
import { QuadCloud } from './quad-particles';

/**
 * The Hollow's air (art pass, items 16, 17, 22, 35, 36, 42, 43): light shafts from ceiling
 * cracks, dust motes and spores, a glow over the water, drips with ripple rings (and a
 * small sound), low fog pooled in basins and over water, glow-worm stars up in the dark,
 * and glow-bugs at the wall feet. Five draws in all: one hover cloud (motes, spores, bugs,
 * all moving in the shader), one cpu cloud (stars, drips, rings, shaft foot glow), one
 * instanced mesh for the shafts, one mesh for the water glow and one for the fog.
 * Every position comes from the floor and `cellHash`, so a floor looks the same each visit.
 * The frame governor's first step (`particles`) hides all of it. Under reduced motion
 * nothing drifts, pulses or twinkles and there are no drips.
 */

const A = GROVE3D.cave.atmos;

const SHAFT_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4( position, 1.0 );
  }
`;

const SHAFT_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    float across = smoothstep( 0.0, 0.45, 0.5 - abs( vUv.x - 0.5 ) );
    float along = smoothstep( 0.0, 0.2, vUv.y ) * smoothstep( 1.0, 0.55, vUv.y );
    float shimmer = 0.85 + 0.15 * sin( uTime * 0.6 + vUv.y * 5.0 + vUv.x * 3.0 );
    float a = across * along * uAlpha * shimmer;
    gl_FragColor = vec4( uColor * a, 0.0 );
  }
`;

/** A flat sheet of cards over a set of cells, with a soft edge value per vertex. */
const SHEET_VERT = /* glsl */ `
  attribute float aEdge;
  uniform float uTime;
  uniform float uPhase;
  varying float vEdge;
  varying vec2 vWorld;
  void main() {
    vEdge = aEdge;
    vWorld = position.xz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const GLOW_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  uniform float uTime;
  uniform float uScale;
  varying float vEdge;
  varying vec2 vWorld;
  void main() {
    vec2 p = vWorld * uScale;
    float c = sin( p.x * 2.1 + uTime * 0.9 + sin( p.y * 1.7 + uTime * 0.6 ) )
            + sin( p.y * 2.6 - uTime * 0.7 + sin( p.x * 1.3 - uTime * 0.5 ) )
            + sin( ( p.x + p.y ) * 1.4 + uTime * 0.4 );
    float web = pow( 1.0 - abs( sin( c * 1.1 ) ), 4.0 );
    float a = uAlpha * ( 0.35 + 0.65 * web ) * vEdge;
    gl_FragColor = vec4( uColor * a, 0.0 );
  }
`;

const FOG_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  uniform float uTime;
  uniform float uPhase;
  varying float vEdge;
  varying vec2 vWorld;
  void main() {
    vec2 p = vWorld * 0.35 + vec2( uTime * 0.7, uTime * 0.4 ) + uPhase;
    float n = 0.5 + 0.25 * sin( p.x * 2.3 + sin( p.y * 1.9 ) ) + 0.25 * sin( p.y * 2.7 - p.x * 1.1 );
    float a = uAlpha * n * vEdge;
    gl_FragColor = vec4( uColor * a, a );
  }
`;

interface Drip {
  x: number;
  z: number;
  y: number;
  top: number;
  period: number;
  off: number;
  wet: boolean;
  last: number;
}

interface Star {
  x: number;
  z: number;
  y: number;
  ph: number;
}

export class HollowAtmos implements HollowModule {
  private ctx: HollowCtx | null = null;
  private hover: QuadCloud | null = null;
  private fx: QuadCloud | null = null;
  private shafts: THREE.InstancedMesh | null = null;
  private shaftPos: Array<{ x: number; z: number; w: number }> = [];
  private glow: THREE.Mesh | null = null;
  private fog: THREE.Mesh | null = null;
  private drips: Drip[] = [];
  private stars: Star[] = [];
  private offShed: (() => void) | null = null;
  private shed = false;
  private lastSound = -10;
  private readonly tmp = new THREE.Matrix4();
  private readonly quat = new THREE.Quaternion();
  private readonly up = new THREE.Vector3(0, 1, 0);

  build(f: Floor, ctx: HollowCtx): void {
    this.ctx = ctx;
    const b = ctx.band;
    const col = (hex: string, k = 1) => {
      const c = new THREE.Color(hex);
      return { r: c.r * k, g: c.g * k, b: c.b * k };
    };
    const wx = (cx: number) => (cx + 0.5 - f.cols / 2) * CELL;
    const wz = (cy: number) => (cy + 0.5 - f.rows / 2) * CELL;
    const open = (x: number, y: number) =>
      x >= 0 && y >= 0 && x < f.cols && y < f.rows && f.cells[y * f.cols + x] !== WALL;
    const elev = (x: number, y: number) => f.elevation[y * f.cols + x] ?? 0;
    const cells: Array<[number, number]> = [];
    const wet: Array<[number, number]> = [];
    const foot: Array<[number, number]> = []; // open cells touching a wall
    for (let y = 0; y < f.rows; y++)
      for (let x = 0; x < f.cols; x++) {
        const v = f.cells[y * f.cols + x];
        if (v === WALL) continue;
        cells.push([x, y]);
        if (looksWet(f, x, y)) wet.push([x, y]);
        else if (!open(x - 1, y) || !open(x + 1, y) || !open(x, y - 1) || !open(x, y + 1))
          foot.push([x, y]);
      }
    const special = f.special;
    const spread = (x: number, y: number, k: number) => [
      wx(x) + (cellHash(x, y, k) - 0.5) * CELL,
      wz(y) + (cellHash(x, y, k + 1) - 0.5) * CELL,
    ];

    // ---- hover cloud: motes, spores (item 17) and glow-bugs (item 43)
    const mo = A.motes;
    const nMote = Math.min(mo.moteMax, Math.round(cells.length * mo.perCell));
    const nBug = foot.length ? (special === 'glowworm' ? A.bugs.glowCount : A.bugs.count) : 0;
    const hover = new QuadCloud(ctx.group, nMote + nBug, 'hover');
    hover.mesh.name = 'hollow-air';
    const mote = col('#fff2d8');
    const spore = col(b.moss, 1.8);
    const bug = col('#d8ff7a');
    const bugAlt = col('#7affd0');
    let n = 0;
    for (let i = 0; i < nMote && cells.length; i++) {
      const [cx, cy] = cells[Math.floor(cellHash(i, 7, 31) * cells.length)]!;
      const [x, z] = spread(cx, cy, i);
      const sp = cellHash(i, 3, 5) < mo.spore;
      hover.set(
        x!,
        elev(cx, cy) + 0.4 + cellHash(i, 9, 4) * 1.8,
        z!,
        sp ? spore : mote,
        mo.alpha * (sp ? 1 : 0.7),
        mo.size * (0.6 + cellHash(i, 2, 8) * (sp ? 0.9 : 0.7)),
        sp ? 'glow' : 'dot',
        { additive: true },
        n++,
      );
    }
    for (let i = 0; i < nBug; i++) {
      const [cx, cy] = foot[Math.floor(cellHash(i, 11, 17) * foot.length)]!;
      const [x, z] = spread(cx, cy, 40 + i);
      hover.set(
        x!,
        elev(cx, cy) + 0.2 + cellHash(i, 5, 6) * 0.7,
        z!,
        cellHash(i, 8, 2) < 0.5 ? bug : bugAlt,
        A.bugs.alpha,
        A.bugs.size,
        'glow',
        { additive: true },
        n++,
      );
    }
    hover.commit(n);
    this.hover = hover;

    // ---- cpu cloud: stars (42), drips and rings (35), shaft foot glow (16)
    const dr = A.drips;
    const nDrip = Math.min(dr.max, Math.max(2, Math.round(cells.length / dr.perDrip)));
    this.drips = [];
    for (let i = 0; i < nDrip; i++) {
      const wetPick = wet.length > 0 && cellHash(i, 1, 90) < 0.6;
      const pool = wetPick ? wet : foot.length ? foot : cells;
      const [cx, cy] = pool[Math.floor(cellHash(i, 4, 91) * pool.length)]!;
      const [x, z] = spread(cx, cy, 60 + i);
      this.drips.push({
        x: x!,
        z: z!,
        y: elev(cx, cy) + 0.05,
        top: elev(cx, cy) + WALL_H * 0.7,
        period: dr.period[0]! + cellHash(i, 6, 92) * (dr.period[1]! - dr.period[0]!),
        off: cellHash(i, 7, 93) * 10,
        wet: wetPick,
        last: -1,
      });
    }
    const nStar = special === 'glowworm' ? A.stars.glowCount : A.stars.count;
    this.stars = [];
    for (let i = 0; i < nStar && cells.length; i++) {
      const [cx, cy] = cells[Math.floor(cellHash(i, 13, 95) * cells.length)]!;
      const [x, z] = spread(cx, cy, 120 + i);
      this.stars.push({
        x: x!,
        z: z!,
        y: A.stars.height + cellHash(i, 14, 96) * 2.2,
        ph: cellHash(i, 15, 97) * 6.28,
      });
    }
    const fx = new QuadCloud(ctx.group, this.stars.length + nDrip * 3 + A.shafts.max + 2, 'cpu');
    fx.mesh.name = 'hollow-fx';
    this.fx = fx;

    // ---- shafts (16): medium rooms by seeded pick, the great chamber gets one
    this.shaftPos = [];
    const sh = A.shafts;
    f.rooms.forEach((r, ri) => {
      const great = ri === f.greatRoom || r.kind === 'great';
      if (r.kind === 'small') return;
      if (!great && (this.shaftPos.length >= sh.max || cellHash(ri, 3, 70) > sh.perRoom)) return;
      // A seeded open cell inside the room's box, nearest the middle for the great one.
      let best: [number, number] | null = null;
      let score = great ? 1e9 : -1;
      const mx = r.x + r.w / 2;
      const my = r.y + r.h / 2;
      for (let y = r.y; y < r.y + r.h; y++)
        for (let x = r.x; x < r.x + r.w; x++) {
          if (!open(x, y) || f.cells[y * f.cols + x] === WATER) continue;
          const s = great ? Math.hypot(x - mx, y - my) : cellHash(x, y, 71 + ri);
          if (great ? s < score : s > score) {
            score = s;
            best = [x, y];
          }
        }
      if (!best) return;
      this.shaftPos.push({
        x: wx(best[0]),
        z: wz(best[1]),
        w: sh.width * (great ? sh.greatScale : 1),
      });
    });
    if (this.shaftPos.length) {
      const g = new THREE.PlaneGeometry(1, 1);
      // A beam: wide at the foot, narrow at the crack, leaning a little.
      const p = g.attributes.position!;
      for (let i = 0; i < p.count; i++) {
        const top = p.getY(i) > 0;
        p.setX(i, p.getX(i) * (top ? 0.45 : 1) + (top ? 0.55 : 0));
        p.setY(i, p.getY(i) + 0.5);
      }
      const m = new THREE.ShaderMaterial({
        name: 'HollowShaft',
        uniforms: {
          uColor: { value: new THREE.Color(b.key).lerp(new THREE.Color('#ffffff'), 0.35) },
          uAlpha: { value: sh.alpha },
          uTime: { value: 0 },
        },
        vertexShader: SHAFT_VERT,
        fragmentShader: SHAFT_FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.CustomBlending,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneMinusSrcAlphaFactor,
        blendSrcAlpha: THREE.OneFactor,
        blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
      });
      const mesh = new THREE.InstancedMesh(g, m, this.shaftPos.length);
      mesh.frustumCulled = false;
      mesh.renderOrder = 1;
      mesh.name = 'hollow-shafts';
      this.shafts = mesh;
      ctx.group.add(mesh);
    }

    // ---- water glow (22) and basin fog (36)
    const isBasin = (x: number, y: number) =>
      open(x, y) && (f.cells[y * f.cols + x] === WATER || elev(x, y) < -0.1);
    const glowGeo = sheet(f, (x, y) => f.cells[y * f.cols + x] === WATER, [0.07], elev);
    if (glowGeo) {
      this.glow = new THREE.Mesh(
        glowGeo,
        new THREE.ShaderMaterial({
          name: 'HollowWaterGlow',
          uniforms: {
            uColor: { value: new THREE.Color(b.crystal).lerp(new THREE.Color('#ffffff'), 0.2) },
            uAlpha: { value: A.glow.alpha },
            uTime: { value: 0 },
            uScale: { value: A.glow.scale },
            uPhase: { value: 0 },
          },
          vertexShader: SHEET_VERT,
          fragmentShader: GLOW_FRAG,
          transparent: true,
          depthWrite: false,
          blending: THREE.CustomBlending,
          blendSrc: THREE.OneFactor,
          blendDst: THREE.OneMinusSrcAlphaFactor,
          blendSrcAlpha: THREE.OneFactor,
          blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
        }),
      );
      this.glow.renderOrder = 1;
      this.glow.frustumCulled = false;
      this.glow.name = 'hollow-water-glow';
      ctx.group.add(this.glow);
    }
    const heights = Array.from({ length: A.fog.layers }, (_, i) => 0.12 + i * A.fog.height);
    const fogGeo = sheet(f, isBasin, heights, elev);
    if (fogGeo) {
      const fogCol = new THREE.Color(b.background).lerp(new THREE.Color('#aab8d0'), 0.55);
      this.fog = new THREE.Mesh(
        fogGeo,
        new THREE.ShaderMaterial({
          name: 'HollowBasinFog',
          uniforms: {
            uColor: { value: fogCol },
            uAlpha: { value: A.fog.alpha },
            uTime: { value: 0 },
            uPhase: { value: 0 },
          },
          vertexShader: SHEET_VERT,
          fragmentShader: FOG_FRAG,
          transparent: true,
          depthWrite: false,
          blending: THREE.CustomBlending,
          blendSrc: THREE.OneFactor,
          blendDst: THREE.OneMinusSrcAlphaFactor,
          blendSrcAlpha: THREE.OneFactor,
          blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
        }),
      );
      this.fog.renderOrder = 1;
      this.fog.frustumCulled = false;
      this.fog.name = 'hollow-basin-fog';
      ctx.group.add(this.fog);
    }

    this.offShed = caveShed.register({
      name: 'particles',
      apply: (s) => {
        this.shed = s;
        this.setVisible();
      },
    });
    this.setVisible();
    this.floor = f;
  }

  private floor: Floor | null = null;

  private setVisible(): void {
    const v = !this.shed;
    for (const o of [this.hover?.mesh, this.fx?.mesh, this.shafts, this.glow, this.fog])
      if (o) o.visible = v;
  }

  dispose(): void {
    this.offShed?.();
    this.offShed = null;
    this.hover?.dispose();
    this.fx?.dispose();
    for (const o of [this.shafts, this.glow, this.fog]) {
      if (!o) continue;
      o.removeFromParent();
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
    this.hover = this.fx = null;
    this.shafts = this.glow = this.fog = null;
    this.shaftPos = [];
    this.drips = [];
    this.stars = [];
    this.floor = null;
  }

  update(t: number, keeper: { x: number; z: number }, fr: HollowFrame): void {
    const ctx = this.ctx;
    const f = this.floor;
    if (!ctx || !f || !fr.on || this.shed) return;
    const still = ctx.reduceMotion;
    const ts = t % 3600;
    const tm = still ? 0 : ts;
    const b = ctx.band;
    if (this.hover) this.hover.material.uniforms.uMode!.value = still ? 0 : 2;
    for (const o of [this.glow, this.fog]) {
      const u = (o?.material as THREE.ShaderMaterial | undefined)?.uniforms;
      if (u) u.uTime!.value = tm * (o === this.glow ? A.glow.speed : A.fog.speed * 4);
    }
    if (this.shafts) {
      (this.shafts.material as THREE.ShaderMaterial).uniforms.uTime!.value = tm;
      const cam = fr.camera;
      for (let i = 0; i < this.shaftPos.length; i++) {
        const s = this.shaftPos[i]!;
        const y = elevationAt(f, { x: s.x, z: s.z });
        const yaw = cam ? Math.atan2(cam.x - s.x, cam.z - s.z) : 0;
        this.quat.setFromAxisAngle(this.up, yaw);
        this.tmp.compose(
          new THREE.Vector3(s.x, y, s.z),
          this.quat,
          new THREE.Vector3(s.w, A.shafts.height, 1),
        );
        this.shafts.setMatrixAt(i, this.tmp);
      }
      this.shafts.instanceMatrix.needsUpdate = true;
    }

    const fx = this.fx;
    if (!fx) return;
    // Shaft foot: a soft pool of light where each beam lands.
    const key = new THREE.Color(b.key);
    for (const s of this.shaftPos) {
      fx.set(
        s.x,
        elevationAt(f, { x: s.x, z: s.z }) + 0.06,
        s.z,
        { r: key.r, g: key.g, b: key.b },
        0.22,
        s.w * 1.6,
        'glow',
        { additive: true, stretch: 0.6 },
      );
    }
    // Glow-worm stars: those near the Keeper, fading at the edge of the range.
    const R = A.stars.range;
    const wc = new THREE.Color(b.crystal).lerp(new THREE.Color('#fff4c0'), 0.5);
    for (const s of this.stars) {
      const d = Math.hypot(s.x - keeper.x, s.z - keeper.z);
      if (d > R) continue;
      const fade = 1 - d / R;
      const tw = still ? 0.8 : 0.65 + 0.35 * Math.sin(ts * 0.8 + s.ph);
      fx.set(
        s.x,
        s.y,
        s.z,
        { r: wc.r, g: wc.g, b: wc.b },
        A.stars.alpha * fade * tw,
        A.stars.size,
        'glow',
        { additive: true },
      );
    }
    // Drips and rings.
    if (!still) {
      const dr = A.drips;
      const ring = new THREE.Color('#cfe4ff');
      for (const d of this.drips) {
        const u = t - d.off;
        const k = Math.floor(u / d.period);
        const lt = u - k * d.period;
        if (lt < dr.fall) {
          const p = lt / dr.fall;
          fx.set(
            d.x,
            d.y + (d.top - d.y) * (1 - p * p),
            d.z,
            { r: ring.r, g: ring.g, b: ring.b },
            0.9 * dr.alpha,
            dr.size,
            'streak',
            { additive: true, stretch: 4 },
          );
          fx.set(
            d.x,
            d.y + (d.top - d.y) * (1 - p * p),
            d.z,
            { r: ring.r, g: ring.g, b: ring.b },
            0.8 * dr.alpha,
            dr.size * 1.4,
            'glow',
            { additive: true },
          );
        } else if (lt < dr.fall + dr.ring) {
          const p = (lt - dr.fall) / dr.ring;
          if (d.last !== k) {
            d.last = k;
            const near = Math.hypot(d.x - keeper.x, d.z - keeper.z) < dr.hear;
            if (near && t - this.lastSound > 0.6) {
              this.lastSound = t;
              playSound('drip');
            }
          }
          fx.set(
            d.x,
            d.y + 0.02,
            d.z,
            { r: ring.r, g: ring.g, b: ring.b },
            (d.wet ? 1.6 : 1.1) * dr.alpha * (1 - p * p),
            0.2 + p * dr.ringSize * (d.wet ? 1 : 0.7),
            'ring',
            { additive: true, stretch: 0.6 },
          );
        }
      }
    }
    fx.flush();
  }
}

/**
 * Flat cards over every cell `pred` accepts, one set per height in `ys`, as one geometry.
 * `aEdge` is 1 at the middle of a cell and the share of its neighbours that also pass at a
 * corner, so a sheet thins out to nothing at its border.
 */
function sheet(
  f: Floor,
  pred: (x: number, y: number) => boolean,
  ys: number[],
  elev: (x: number, y: number) => number,
): THREE.BufferGeometry | null {
  const ok = (x: number, y: number) => x >= 0 && y >= 0 && x < f.cols && y < f.rows && pred(x, y);
  const pos: number[] = [];
  const edge: number[] = [];
  const idx: number[] = [];
  for (const yo of ys)
    for (let y = 0; y < f.rows; y++)
      for (let x = 0; x < f.cols; x++) {
        if (!ok(x, y)) continue;
        const base = pos.length / 3;
        const h = elev(x, y) + yo;
        const corners: Array<[number, number]> = [
          [0, 0],
          [1, 0],
          [0, 1],
          [1, 1],
        ];
        for (const [dx, dz] of corners) {
          const n =
            (ok(x + dx - 1, y + dz - 1) ? 1 : 0) +
            (ok(x + dx, y + dz - 1) ? 1 : 0) +
            (ok(x + dx - 1, y + dz) ? 1 : 0) +
            (ok(x + dx, y + dz) ? 1 : 0);
          pos.push((x + dx - f.cols / 2) * CELL, h, (y + dz - f.rows / 2) * CELL);
          edge.push((n / 4) ** 2);
        }
        pos.push((x + 0.5 - f.cols / 2) * CELL, h, (y + 0.5 - f.rows / 2) * CELL);
        edge.push(1);
        idx.push(base, base + 2, base + 4, base + 2, base + 3, base + 4);
        idx.push(base + 3, base + 1, base + 4, base + 1, base, base + 4);
      }
  if (!idx.length) return null;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aEdge', new THREE.Float32BufferAttribute(edge, 1));
  g.setIndex(idx);
  return g;
}
