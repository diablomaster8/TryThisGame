import * as THREE from 'three';
import type { Collider } from '../config/grove-layout';
import { DEBUG_OVERLAY_LOOK } from '../config/tuning-move';
import { navDebug } from '../sim/nav';
import { colliderTopY, obstacles } from '../sim/obstacles';
import type { World } from '../sim/types';

/**
 * Debug overlays for collision work (MOVE-38), the same in both renderers: the collider
 * table as wire outlines at their tops, coloured by flag; the nav grid's shut, soft and
 * hop cells near the Keeper and its current route as dots. Built from the sim's own data
 * by one line-list builder and added to whichever scene is drawing. Toggled from the debug
 * panel only; nothing is built while every toggle is off.
 */

export const DEBUG_OVERLAY = { colliders: false, nav: false, groundY: false };

const COLOURS: Record<string, number> = {
  solid: 0xff3b30,
  keeperOnly: 0xff9500,
  nubbinOnly: 0xaf52de,
  hop: 0xffd60a,
  standable: 0x34c759,
  soft: 0x0a84ff,
};

function colourOf(c: Collider): number {
  for (const f of ['standable', 'hop', 'soft', 'nubbinOnly', 'keeperOnly'] as const)
    if (c.flags.includes(f)) return COLOURS[f]!;
  return COLOURS.solid!;
}

/** A collider's outline as line-list pairs, at its top's height. */
export function colliderLines(c: Collider, out: number[], col: number[]): void {
  const y = colliderTopY(c);
  const k = new THREE.Color(colourOf(c));
  const ring: Array<[number, number]> = [];
  const s = c.shape;
  if (s.type === 'circle') {
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      ring.push([Math.cos(a) * s.r, Math.sin(a) * s.r]);
    }
  } else if (s.type === 'box') {
    ring.push([-s.hw, -s.hd], [s.hw, -s.hd], [s.hw, s.hd], [-s.hw, s.hd]);
  } else {
    // A segment along local x, with round ends drawn as a stadium.
    const h = s.len / 2;
    for (let i = 0; i <= 8; i++) {
      const a = -Math.PI / 2 + (i / 8) * Math.PI;
      ring.push([h + Math.cos(a) * s.r, Math.sin(a) * s.r]);
    }
    for (let i = 0; i <= 8; i++) {
      const a = Math.PI / 2 + (i / 8) * Math.PI;
      ring.push([-h + Math.cos(a) * s.r, Math.sin(a) * s.r]);
    }
  }
  // Local to world: the sim's frame turns local (x, z) by the yaw as three.js rotation.y.
  const cos = Math.cos(c.yaw);
  const sin = Math.sin(c.yaw);
  const w = ring.map(([x, z]) => [c.x + x * cos + z * sin, c.z - x * sin + z * cos] as const);
  for (let i = 0; i < w.length; i++) {
    const a = w[i]!;
    const b = w[(i + 1) % w.length]!;
    out.push(a[0], y, a[1], b[0], y, b[1]);
    col.push(k.r, k.g, k.b, k.r, k.g, k.b);
  }
}

/** A small text card for the ground-y label. */
function textSprite(text: string): THREE.Sprite {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 32;
  const g = c.getContext('2d');
  if (g) {
    g.fillStyle = 'rgba(0,0,0,0.6)';
    g.fillRect(0, 0, 128, 32);
    g.fillStyle = '#fff';
    g.font = '20px monospace';
    g.textAlign = 'center';
    g.fillText(text, 64, 23);
  }
  const m = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false });
  const s = new THREE.Sprite(m);
  s.scale.set(1.2, 0.3, 1);
  return s;
}

/** The overlay for one scene: built lazily, rebuilt when the collider table changes. */
export class DebugOverlay {
  readonly group = new THREE.Group();
  private lines: THREE.LineSegments | null = null;
  private dots: THREE.Points | null = null;
  private table: readonly Collider[] | null = null;
  private readonly lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    depthTest: false,
    transparent: true,
  });
  private readonly dotMat = new THREE.PointsMaterial({
    vertexColors: true,
    size: DEBUG_OVERLAY_LOOK.dotPx,
    sizeAttenuation: false,
    depthTest: false,
    transparent: true,
  });

  /** "Show ground y": the height the Keeper's feet stand at, on a label under it. */
  private label: THREE.Sprite | null = null;
  private labelText = '';

  constructor(scene: THREE.Scene) {
    this.group.renderOrder = 999;
    scene.add(this.group);
  }

  private groundLabel(world: World): void {
    const k = world.keeper;
    const text = DEBUG_OVERLAY.groundY ? `y ${k.y.toFixed(2)}` : '';
    if (text !== this.labelText) {
      this.labelText = text;
      if (this.label) {
        this.label.material.map?.dispose();
        this.label.material.dispose();
        this.label.removeFromParent();
        this.label = null;
      }
      if (text) {
        this.label = textSprite(text);
        this.group.add(this.label);
      }
    }
    this.label?.position.set(k.pos.x, k.y - 0.25, k.pos.z);
  }

  update(world: World, ground: (x: number, z: number) => number): void {
    const home = world.location === 'grove';
    this.group.visible =
      home && (DEBUG_OVERLAY.colliders || DEBUG_OVERLAY.nav || DEBUG_OVERLAY.groundY);
    if (!this.group.visible) return;
    this.groundLabel(world);
    const table = obstacles(world);
    if (DEBUG_OVERLAY.colliders && table !== this.table) {
      this.table = table;
      const pos: number[] = [];
      const col: number[] = [];
      for (const c of table) colliderLines(c, pos, col);
      this.lines?.geometry.dispose();
      this.lines?.removeFromParent();
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      this.lines = new THREE.LineSegments(g, this.lineMat);
      this.lines.frustumCulled = false;
      this.group.add(this.lines);
    }
    if (this.lines) this.lines.visible = DEBUG_OVERLAY.colliders;
    this.dots?.geometry.dispose();
    this.dots?.removeFromParent();
    this.dots = null;
    if (!DEBUG_OVERLAY.nav) return;
    // The nav grid within reach of the Keeper (the whole field is too many dots), then the route.
    const n = navDebug(world);
    const k = world.keeper.pos;
    const R = DEBUG_OVERLAY_LOOK.navReach;
    const pos: number[] = [];
    const col: number[] = [];
    const kinds = [
      [1, 0.23, 0.19],
      [0, 0, 0],
      [0.04, 0.52, 1],
      [1, 0.84, 0.04],
    ];
    const lo = (v: number) => Math.max(0, Math.floor((v - R + n.half) / n.cell));
    const hi = (v: number) => Math.min(n.side - 1, Math.floor((v + R + n.half) / n.cell));
    for (let iz = lo(k.z); iz <= hi(k.z); iz++)
      for (let ix = lo(k.x); ix <= hi(k.x); ix++) {
        const m = n.mask[iz * n.side + ix]!;
        if (m === 1) continue;
        const x = -n.half + (ix + 0.5) * n.cell;
        const z = -n.half + (iz + 0.5) * n.cell;
        pos.push(x, ground(x, z) + 0.05, z);
        col.push(...kinds[m]!);
      }
    for (const p of n.route) {
      pos.push(p.x, ground(p.x, p.z) + 0.15, p.z);
      col.push(1, 1, 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    this.dots = new THREE.Points(g, this.dotMat);
    this.dots.frustumCulled = false;
    this.group.add(this.dots);
  }
}
