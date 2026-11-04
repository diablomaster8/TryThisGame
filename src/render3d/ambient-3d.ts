/**
 * R0547 (SOUL-29), lane A round 11: the ambient critters (butterflies, fireflies, a frog, a
 * dragonfly) in the Full 3D Grove, as a small pool of camera-facing sprites cut from the same
 * pixel sheet the Pixel view uses (`render/sprites/ambient-art.ts`). Each frame's texture is a
 * framed clone of the one uploaded sheet (no new upload); slots are made on first need and
 * hidden when unused. Also hearts for the Keeper when a concert forms nearby. Render-only.
 */
import * as THREE from 'three';
import { ambientDraws } from '../render/ambient-look';
import type { FrameRect, SpriteSheet } from '../render/sprites/atlas';
import { ambientKey, buildAmbientSheet } from '../render/sprites/ambient-art';
import type { World } from '../sim/types';

export class Ambient3D {
  private sheet: SpriteSheet | null = null;
  private readonly mats = new Map<string, THREE.SpriteMaterial>();
  private readonly slots: THREE.Sprite[] = [];

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

  /** Once a frame: place a sprite for every critter, hide the rest. */
  frame(world: World, inGrove: boolean, nowMs: number, reduce: boolean): void {
    const rows = inGrove ? ambientDraws(world, nowMs, reduce) : [];
    let used = 0;
    for (const r of rows) {
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
  }

  dispose(): void {
    for (const s of this.slots) s.removeFromParent();
    for (const m of this.mats.values()) {
      m.map?.dispose();
      m.dispose();
    }
  }
}
