/**
 * R0547 (SOUL-29), lane A round 11: the ambient critters (butterflies, fireflies, a frog, a
 * dragonfly) in the Full 3D Grove, as a small pool of camera-facing sprites cut from the same
 * pixel sheet the Pixel view uses (`render/sprites/ambient-art.ts`). Each frame's texture is a
 * framed clone of the one uploaded sheet (no new upload); slots are made on first need and
 * hidden when unused. Also hearts for the Keeper when a concert forms nearby. Render-only.
 * R0562 (round 12): rain puddles lie flat on the ground as planes. R0585: when the frame
 * governor is straining, the living critters are dropped before anything else.
 */
import type { ReadonlyWorld } from '../render/readonly-world';
import * as THREE from 'three';
import { ambientDraws } from '../render/ambient-look';
import type { FrameRect, SpriteSheet } from '../render/sprites/atlas';
import { ambientKey, buildAmbientSheet } from '../render/sprites/ambient-art';
import { jamsOf } from '../sim/jam';


export class Ambient3D {
  private sheet: SpriteSheet | null = null;
  private readonly mats = new Map<string, THREE.SpriteMaterial>();
  private readonly slots: THREE.Sprite[] = [];
  /** Puddles: one flat plane each, made on first need. */
  private readonly flats: THREE.Mesh[] = [];
  private readonly flatMats = new Map<string, THREE.MeshBasicMaterial>();
  /** R0555: concerts whose Keeper hearts have already risen (3D burst, once each). */
  private readonly hearted = new WeakSet<object>();
  /** R0555: the scene's particle hook (the same one the idle looks use). */
  burst: ((kind: 'heart', x: number, z: number) => void) | null = null;
  /** Draw calls the last frame cost (the debug panel shows it). */
  drawn = 0;

  constructor(
    private readonly group: THREE.Group,
    private readonly ground: (x: number, z: number) => number,
  ) {}

  private ensureSheet(): SpriteSheet {
    if (!this.sheet) this.sheet = buildAmbientSheet();
    return this.sheet;
  }

  private matFor(key: string): THREE.SpriteMaterial | undefined {
    let m = this.mats.get(key);
    if (m) return m;
    const sheet = this.ensureSheet();
    const rect: FrameRect | undefined = sheet.frames.get(key);
    if (!rect) return undefined;
    const tex = sheet.texture.clone();
    tex.repeat.set(rect.w / sheet.width, rect.h / sheet.height);
    tex.offset.set(rect.x / sheet.width, 1 - (rect.y + rect.h) / sheet.height);
    tex.needsUpdate = false;
    m = new THREE.SpriteMaterial({ map: tex, transparent: true, alphaTest: 0.4 });
    this.mats.set(key, m);
    return m;
  }

  private flatMat(key: string): THREE.MeshBasicMaterial | undefined {
    let m = this.flatMats.get(key);
    if (m) return m;
    const base = this.matFor(key);
    if (!base) return undefined;
    m = new THREE.MeshBasicMaterial({
      map: base.map,
      transparent: true,
      alphaTest: 0.2,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.flatMats.set(key, m);
    return m;
  }

  /**
   * Once a frame: place a sprite for every critter, hide the rest. `shed` (the governor is
   * straining) drops the living critters first and keeps the snow figures and puddles.
   */
  frame(world: ReadonlyWorld, inGrove: boolean, nowMs: number, reduce: boolean, shed = false): void {
    const rows = inGrove ? ambientDraws(world, nowMs, reduce) : [];
    let used = 0;
    let flatUsed = 0;
    for (const r of rows) {
      if (r.flat) {
        const fm = this.flatMat(ambientKey(r.kind, r.frame, r.colour));
        if (!fm) continue;
        let p = this.flats[flatUsed];
        if (!p) {
          p = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), fm);
          p.name = 'ambientPuddle';
          p.rotation.x = -Math.PI / 2;
          p.renderOrder = 1;
          this.group.add(p);
          this.flats[flatUsed] = p;
        }
        flatUsed++;
        p.material = fm;
        p.visible = true;
        p.position.set(r.x, this.ground(r.x, r.z) + r.y, r.z);
        p.scale.setScalar(r.size * 1.6);
        continue;
      }
      if (shed && r.kind !== 'snowman') continue;
      const mat = this.matFor(ambientKey(r.kind, r.frame, r.colour));
      if (!mat) continue;
      let s = this.slots[used];
      if (!s) {
        s = new THREE.Sprite(mat);
        s.name = 'ambientCritter';
        this.group.add(s);
        this.slots[used] = s;
      }
      used++;
      s.material = mat;
      s.visible = true;
      s.position.set(r.x, this.ground(r.x, r.z) + r.y + r.size * 0.4, r.z);
      s.scale.setScalar(r.size * 1.6);
    }
    for (let i = used; i < this.slots.length; i++) this.slots[i]!.visible = false;
    for (let i = flatUsed; i < this.flats.length; i++) this.flats[i]!.visible = false;
    this.drawn = used + flatUsed;
    if (inGrove && this.burst) {
      for (const j of jamsOf(world)) {
        if (j.heartAtMs <= 0 || this.hearted.has(j)) continue;
        this.hearted.add(j);
        for (let i = 0; i < 3; i++) this.burst('heart', world.keeper.pos.x, world.keeper.pos.z);
      }
    }
  }

  dispose(): void {
    for (const s of this.slots) s.removeFromParent();
    for (const p of this.flats) {
      p.removeFromParent();
      p.geometry.dispose();
    }
    for (const m of this.flatMats.values()) m.dispose();
    for (const m of this.mats.values()) {
      m.map?.dispose();
      m.dispose();
    }
  }
}
