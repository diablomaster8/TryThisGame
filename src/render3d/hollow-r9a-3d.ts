import * as THREE from 'three';
import { FOOTPRINT_R9, LIGHT_RING_R9, PORTAL_R9 } from '../config/dungeon-r9-a';
import { PARTY_R8 } from '../config/dungeon-party-r8';
import {
  footprintPulse,
  guideMarks,
  lightRing,
  paintAcorn,
  paintSwirl,
  portalSpin,
  portalSpot,
} from '../render/hollow-r9a';
import { elevationAt, runFloor } from '../sim/dungeon';
import type { World } from '../sim/types';

/**
 * Lane B round 9 (a) in Full 3D, the twin of the Pixel parts in `render/hollow-r9a.ts`,
 * reading the same pure helpers so the two views agree:
 *
 * - The Keeper's light ring (R0190): one flat ring at the sight radius in the act's lamp
 *   colour, the same unlit additive material kind as the strays' rings (no new program).
 * - The guide's footprints (R0208): one merged mesh of prints, rebuilt only when the path
 *   changes (a few hundred vertices, never a texture); they breathe by opacity, still under
 *   reduced motion.
 * - The acorn portal (R0150): a sprite acorn and a turning sprite leaf-swirl behind it, with
 *   the gear pop's sprite settings; the two canvases are drawn once, on first use.
 *
 * Lives in the scene root (not the Hollow group), as the portal also stands in the Grove.
 */
export class HollowR9a3D {
  private readonly ring: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
  private readonly prints: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  private readonly printPos: Float32Array;
  private printKey = '';
  private acorn: THREE.Sprite | null = null;
  private swirl: THREE.Sprite | null = null;
  private closing: { startMs: number; at: { x: number; z: number } | null } | null = null;

  constructor(private readonly parent: THREE.Object3D) {
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#fff0d0',
      transparent: true,
      opacity: LIGHT_RING_R9.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.ring = new THREE.Mesh(new THREE.RingGeometry(1 - LIGHT_RING_R9.width, 1, 64), ringMat);
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.name = 'keeper-light-ring';
    this.ring.visible = false;
    parent.add(this.ring);
    // Room for every print the guide draws: maxSteps / every prints, PRINT_TRIS each.
    const most = Math.ceil(PARTY_R8.guide.maxSteps / PARTY_R8.guide.every) + 1;
    this.printPos = new Float32Array(most * PRINT_TRIS * 9);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(this.printPos, 3).setUsage(THREE.DynamicDrawUsage),
    );
    geo.setDrawRange(0, 0);
    this.prints = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({
        color: '#ffeec8',
        transparent: true,
        opacity: FOOTPRINT_R9.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.prints.name = 'guide-prints';
    this.prints.frustumCulled = false;
    this.prints.visible = false;
    parent.add(this.prints);
  }

  /** The portal closing behind the party (event `portalReturned`). */
  portalReturned(nowMs: number): void {
    this.closing = { startMs: nowMs, at: null };
  }

  update(
    world: World,
    nowMs: number,
    keeper: { x: number; z: number },
    still: boolean,
    groveGround: (x: number, z: number) => number,
  ): void {
    const underground = world.location === 'dungeon' && !!world.dungeon;
    const f = underground ? runFloor(world) : null;
    const ground = (x: number, z: number) =>
      f ? elevationAt(f, { x, z }) : world.location === 'grove' ? groveGround(x, z) : 0;
    // The light ring.
    const ring = lightRing(f, underground ? world.dungeon : null);
    this.ring.visible = !!ring;
    if (ring) {
      this.ring.material.color.set(ring.colour);
      this.ring.scale.set(ring.r, ring.r, 1);
      this.ring.position.set(keeper.x, ground(keeper.x, keeper.z) + 0.05, keeper.z);
    }
    // The guide's prints.
    const marks = underground ? guideMarks(world) : [];
    this.prints.visible = marks.length > 0;
    if (f && marks.length) {
      const key = `${f.cols}:${marks.map((m) => `${m.x.toFixed(2)},${m.z.toFixed(2)}`).join(';')}`;
      if (key !== this.printKey) {
        this.printKey = key;
        let o = 0;
        for (const m of marks) o = writePrint(this.printPos, o, m, ground(m.x, m.z) + 0.04);
        const geo = this.prints.geometry;
        geo.setDrawRange(0, o / 3);
        geo.attributes.position!.needsUpdate = true;
        geo.computeBoundingSphere();
      }
      this.prints.material.opacity = FOOTPRINT_R9.opacity * footprintPulse(0, nowMs * 0.5, still);
    }
    // The portal: open at the return spot, or closing on the floor after stepping back.
    let at = portalSpot(world);
    let fade = 1;
    const c = this.closing;
    if (!at && c && underground) {
      const age = nowMs - c.startMs;
      if (age > PORTAL_R9.closeMs) this.closing = null;
      else {
        c.at ??= { x: keeper.x + PORTAL_R9.offset.x, z: keeper.z + PORTAL_R9.offset.z };
        at = c.at;
        fade = 1 - age / PORTAL_R9.closeMs;
      }
    }
    if (!at) {
      if (this.acorn) this.acorn.visible = this.swirl!.visible = false;
      return;
    }
    const { acorn, swirl } = this.portal();
    const y = ground(at.x, at.z);
    const bob = still ? 0 : Math.sin(nowMs / 500) * 0.06;
    acorn.visible = swirl.visible = true;
    acorn.position.set(at.x, y + PORTAL_R9.size * 0.5 + 0.1 + bob, at.z);
    acorn.scale.setScalar(PORTAL_R9.size * fade);
    swirl.position.set(at.x, y + PORTAL_R9.size * 0.45, at.z);
    swirl.scale.setScalar(PORTAL_R9.ring * 2 * (0.6 + 0.4 * fade));
    swirl.material.rotation = portalSpin(nowMs, still);
    acorn.material.opacity = swirl.material.opacity = fade;
  }

  private portal(): { acorn: THREE.Sprite; swirl: THREE.Sprite } {
    if (!this.acorn || !this.swirl) {
      this.swirl = sprite(64, paintSwirl, 9);
      this.acorn = sprite(64, paintAcorn, 10);
      this.swirl.name = 'acorn-swirl';
      this.acorn.name = 'acorn-portal';
      this.parent.add(this.swirl, this.acorn);
    }
    return { acorn: this.acorn, swirl: this.swirl };
  }

  /** Hide everything (leaving the scene). */
  hide(): void {
    this.ring.visible = this.prints.visible = false;
    if (this.acorn) this.acorn.visible = this.swirl!.visible = false;
  }

  dispose(): void {
    for (const o of [this.ring, this.prints]) {
      o.removeFromParent();
      o.geometry.dispose();
      o.material.dispose();
    }
    for (const s of [this.acorn, this.swirl]) {
      if (!s) continue;
      s.removeFromParent();
      s.material.map?.dispose();
      s.material.dispose();
    }
    this.acorn = this.swirl = null;
  }
}

/** A canvas sprite with the gear pop's settings, so it shares that program. */
function sprite(
  px: number,
  paint: (g: CanvasRenderingContext2D, s: number) => void,
  order: number,
): THREE.Sprite {
  const c = document.createElement('canvas');
  c.width = c.height = px;
  const g = c.getContext('2d')!;
  paint(g, px);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, fog: false, transparent: true }));
  s.renderOrder = order;
  s.visible = false;
  return s;
}

/** Triangles per print: an eight-sided sole and three four-sided toes. */
const SOLE = 8;
const TOE = 4;
const PRINT_TRIS = SOLE + 3 * TOE;

/** Write one print's triangles (flat, facing up) at `o`; returns the next offset. */
function writePrint(
  out: Float32Array,
  o: number,
  m: { x: number; z: number; angle: number },
  y: number,
): number {
  const s = FOOTPRINT_R9.size;
  // Forward is the heading (sin, cos) in x and z; across is a quarter turn from it.
  const fx = Math.sin(m.angle);
  const fz = Math.cos(m.angle);
  const ax = fz;
  const az = -fx;
  const put = (along: number, across: number) => {
    out[o++] = m.x + fx * along + ax * across;
    out[o++] = y;
    out[o++] = m.z + fz * along + az * across;
  };
  const blob = (ca: number, cs: number, ra: number, rs: number, n: number) => {
    for (let i = 0; i < n; i++) {
      const t0 = (i / n) * Math.PI * 2;
      const t1 = ((i + 1) / n) * Math.PI * 2;
      // Wound so the face points up (counter-clockwise seen from above).
      put(ca, cs);
      put(ca + Math.cos(t0) * ra, cs + Math.sin(t0) * rs);
      put(ca + Math.cos(t1) * ra, cs + Math.sin(t1) * rs);
    }
  };
  blob(-s * 0.08, 0, s * 0.24, s * 0.17, SOLE);
  for (const d of [-0.16, 0, 0.16])
    blob(s * (0.26 - Math.abs(d) * 0.3), d * s, s * 0.075, s * 0.075, TOE);
  return o;
}
