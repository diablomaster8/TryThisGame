/**
 * R0525 (SOUL-07), lane A round 10: the performance props and the crayon doodles in the Full
 * 3D Grove, from the same pixel sheet the Pixel view uses (`render/sprites/perform-art.ts`).
 * The sheet's texture is uploaded once; each prop and doodle slot is a clone of it (three
 * shares the GPU texture between clones of one source) with its own offset and repeat, so
 * nothing is redrawn or re-uploaded per frame. A prop is one sprite per performer, made only
 * when someone first performs; doodles are a fixed pool of flat quads, hidden when unused.
 * Rising notes reuse the emote ball's own note material. Render-only.
 */
import * as THREE from 'three';
import { PERFORM } from '../config/tuning';
import type { PerformLook, PerformProp } from '../render/perform-look';
import { buildPerformSheet, doodleKey, propKey } from '../render/sprites/perform-art';
import type { FrameRect, SpriteSheet } from '../render/sprites/atlas';
import { doodleAlpha } from '../sim/perform';
import { actDoodleAlpha, actDoodles } from '../render/idle-acts';
import { IDLE_ACTS } from '../config/tuning-look-r10e';
import type { World } from '../sim/types';

const NOTE_MS = 1100;

export class Perform3D {
  private sheet: SpriteSheet | null = null;
  private readonly propMats = new Map<PerformProp, THREE.SpriteMaterial>();
  private readonly props = new Map<string, THREE.Sprite>();
  private readonly doodles: THREE.Mesh[] = [];
  private readonly notes: Array<{
    s: THREE.Sprite;
    bornMs: number;
    x: number;
    y: number;
    z: number;
  }> = [];

  constructor(
    private readonly group: THREE.Group,
    private readonly noteMat: () => THREE.SpriteMaterial | undefined,
    private readonly ground: (x: number, z: number) => number,
  ) {}

  private ensureSheet(): SpriteSheet {
    if (!this.sheet) this.sheet = buildPerformSheet();
    return this.sheet;
  }

  /** A clone of the sheet's texture framed on one cell (no new upload). */
  private framed(rect: FrameRect): THREE.Texture {
    const sheet = this.ensureSheet();
    const tex = sheet.texture.clone();
    tex.repeat.set(rect.w / sheet.width, rect.h / sheet.height);
    tex.offset.set(rect.x / sheet.width, 1 - (rect.y + rect.h) / sheet.height);
    tex.needsUpdate = false;
    return tex;
  }

  private propMat(p: PerformProp): THREE.SpriteMaterial | undefined {
    let m = this.propMats.get(p);
    if (m) return m;
    const rect = this.ensureSheet().frames.get(propKey(p));
    if (!rect) return undefined;
    m = new THREE.SpriteMaterial({ map: this.framed(rect), transparent: true, alphaTest: 0.5 });
    this.propMats.set(p, m);
    return m;
  }

  /**
   * Place one performer's prop beside it (camera-right side, a hand's height up), or hide it.
   * `right` is the camera's right vector on the ground.
   */
  nubbin(
    id: string,
    look: PerformLook | null,
    x: number,
    y: number,
    z: number,
    right: THREE.Vector3,
    scale: number,
    noteNow: boolean,
    nowMs: number,
  ): void {
    let s = this.props.get(id);
    if (!look?.prop) {
      if (s) s.visible = false;
    } else {
      const mat = this.propMat(look.prop);
      if (mat && !s) {
        s = new THREE.Sprite(mat);
        s.name = 'performProp';
        this.group.add(s);
        this.props.set(id, s);
      }
      if (s && mat) {
        s.material = mat;
        s.visible = true;
        const side = PERFORM.propSide * scale + look.propDx;
        s.position.set(
          x + right.x * side,
          y + (PERFORM.propUp + look.propDy) * scale,
          z + right.z * side,
        );
        s.scale.setScalar(PERFORM.propSize * scale);
      }
    }
    if (noteNow) this.addNote(x, y + 1.3 * scale, z, nowMs);
  }

  private addNote(x: number, y: number, z: number, nowMs: number): void {
    const mat = this.noteMat();
    if (!mat) return;
    let n = this.notes.find((q) => !q.s.visible);
    if (!n) {
      if (this.notes.length >= 12) return;
      const s = new THREE.Sprite(mat);
      s.name = 'performNote';
      this.group.add(s);
      n = { s, bornMs: 0, x: 0, y: 0, z: 0 };
      this.notes.push(n);
    }
    n.s.material = mat;
    n.s.visible = true;
    n.bornMs = nowMs;
    n.x = x + (((nowMs / 37) % 1) - 0.5) * 0.4;
    n.y = y;
    n.z = z;
  }

  /** Once a frame after the Nubbins: drift the notes, lay the doodles, drop the leavers. */
  finish(world: World, inGrove: boolean, live: ReadonlySet<string>, nowMs: number): void {
    for (const q of this.notes) {
      if (!q.s.visible) continue;
      const t = (nowMs - q.bornMs) / NOTE_MS;
      if (t >= 1 || t < 0) {
        q.s.visible = false;
        continue;
      }
      q.s.position.set(q.x + Math.sin(t * 6) * 0.08, q.y + t * 0.7, q.z);
      q.s.scale.setScalar(0.28 * (1 - t * 0.4));
    }
    for (const [id, s] of this.props)
      if (!live.has(id)) {
        s.removeFromParent();
        this.props.delete(id);
      }
    const list = inGrove ? (world.doodles ?? []) : [];
    let used = 0;
    for (const d of list) {
      const a = doodleAlpha(d, world.timeMs);
      if (a <= 0 || used >= PERFORM.doodleMax) continue;
      const m = this.doodleAt(used++);
      const mat = m.material as THREE.MeshBasicMaterial;
      if (m.userData.kind !== d.kind) {
        const rect = this.ensureSheet().frames.get(doodleKey(d.kind));
        if (rect) {
          mat.map?.dispose();
          mat.map = this.framed(rect);
          mat.needsUpdate = true;
        }
        m.userData.kind = d.kind;
      }
      mat.opacity = 0.85 * a;
      m.position.set(d.x, this.ground(d.x, d.z) + 0.03, d.z);
      m.scale.setScalar(1);
      m.visible = true;
    }
    // R0421 (LOOK-51, lane E r10): the idle acts' smaller crayon scribbles, gone after 30 s.
    for (const d of inGrove ? actDoodles() : []) {
      const a = actDoodleAlpha(d, world.timeMs);
      if (a <= 0 || used >= PERFORM.doodleMax + IDLE_ACTS.doodleMax) continue;
      const m = this.doodleAt(used++);
      const mat = m.material as THREE.MeshBasicMaterial;
      if (m.userData.kind !== d.kind) {
        const rect = this.ensureSheet().frames.get(doodleKey(d.kind));
        if (rect) {
          mat.map?.dispose();
          mat.map = this.framed(rect);
          mat.needsUpdate = true;
        }
        m.userData.kind = d.kind;
      }
      mat.opacity = 0.8 * a;
      m.position.set(d.x, this.ground(d.x, d.z) + 0.03, d.z);
      m.scale.setScalar(0.6);
      m.visible = true;
    }
    for (let i = used; i < this.doodles.length; i++) this.doodles[i]!.visible = false;
  }

  private doodleAt(i: number): THREE.Mesh {
    let m = this.doodles[i];
    if (m) return m;
    const geo = new THREE.PlaneGeometry(PERFORM.doodleSize, PERFORM.doodleSize);
    geo.rotateX(-Math.PI / 2);
    m = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, alphaTest: 0.05 }),
    );
    m.name = 'doodle';
    m.renderOrder = 1;
    m.userData.kind = -1;
    this.group.add(m);
    this.doodles[i] = m;
    return m;
  }

  dispose(): void {
    for (const m of this.propMats.values()) {
      m.map?.dispose();
      m.dispose();
    }
    for (const s of this.props.values()) s.removeFromParent();
    for (const q of this.notes) q.s.removeFromParent();
    for (const m of this.doodles) {
      m.geometry.dispose();
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.map?.dispose();
      mat.dispose();
      m.removeFromParent();
    }
    this.sheet?.dispose();
  }
}
