import {
  BufferAttribute,
  CircleGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
} from 'three';
import { CAMERA } from '../config/tuning';
import type { FrameRect, SpriteSheet } from './sprites/atlas';

/** Native pixels per world unit: a 32px sprite stands 2 units tall at the near zoom. */
const NATIVE_PPU = CAMERA.pixelsPerUnit[CAMERA.pixelsPerUnit.length - 1] ?? 16;

const shadowGeometry = new CircleGeometry(0.5, 10);

/**
 * A flat sprite that stands on the ground (origin at its feet), turns to face the
 * camera around the vertical axis, and tilts back by the camera pitch so its pixels
 * are never foreshortened. Frames come from a sheet by UV sub-rectangle. A soft shadow
 * disc sits on the ground beneath it and shrinks as the sprite rises.
 */
export class SpriteView {
  readonly root = new Object3D();
  readonly mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;
  readonly shadow: Mesh<CircleGeometry, MeshBasicMaterial>;
  private sheet: SpriteSheet | null = null;
  private frameKey = '';
  private flip = false;
  private height = 0;

  constructor(cellW: number, cellH: number, shadowRadius = 0.5) {
    const w = cellW / NATIVE_PPU;
    const h = cellH / NATIVE_PPU;
    const geometry = new PlaneGeometry(w, h);
    geometry.translate(0, h / 2, 0);
    const material = new MeshBasicMaterial({
      transparent: true,
      alphaTest: 0.5,
      depthWrite: true,
    });
    this.mesh = new Mesh(geometry, material);
    this.mesh.rotation.order = 'YXZ';
    this.root.add(this.mesh);

    this.shadow = new Mesh(
      shadowGeometry,
      new MeshBasicMaterial({
        color: 0x0d0a1a,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
      }),
    );
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.y = 0.012;
    this.root.add(this.shadow);
    this.setShadowRadius(shadowRadius);
  }

  setSheet(sheet: SpriteSheet): void {
    if (this.sheet === sheet) return;
    this.sheet = sheet;
    this.mesh.material.map = sheet.texture;
    this.mesh.material.needsUpdate = true;
    this.frameKey = '';
  }

  /** Pick a frame by key; unknown keys fall back to the first frame on the sheet. */
  setFrame(key: string, flip = false): void {
    if (!this.sheet) return;
    if (key === this.frameKey && flip === this.flip) return;
    const rect = this.sheet.frames.get(key) ?? this.sheet.frames.values().next().value;
    if (!rect) return;
    this.frameKey = key;
    this.flip = flip;
    applyUv(this.mesh.geometry, rect, this.sheet.width, this.sheet.height, flip);
  }

  /** World position of the feet; `y` lifts the sprite (held, thrown). */
  setPosition(x: number, y: number, z: number): void {
    this.root.position.set(x, 0, z);
    this.mesh.position.y = y;
    this.height = y;
    const s = Math.max(0.35, 1 - y * 0.25);
    this.shadow.scale.set(this.baseShadowScale * s, this.baseShadowScale * s, 1);
    this.shadow.material.opacity = 0.3 * Math.max(0.3, 1 - y * 0.2);
  }

  private baseShadowScale = 1;

  setShadowRadius(r: number): void {
    this.baseShadowScale = r * 2;
    this.shadow.scale.set(this.baseShadowScale, this.baseShadowScale, 1);
  }

  faceCamera(yaw: number, pitch: number): void {
    this.mesh.rotation.set(-pitch, yaw, 0, 'YXZ');
  }

  get lift(): number {
    return this.height;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.shadow.material.dispose();
    this.root.removeFromParent();
  }
}

/** Write a sheet sub-rectangle into a PlaneGeometry's UVs. Canvas textures are flipped in Y. */
export function applyUv(
  geometry: PlaneGeometry,
  rect: FrameRect,
  sheetW: number,
  sheetH: number,
  flip: boolean,
): void {
  const u0 = rect.x / sheetW;
  const u1 = (rect.x + rect.w) / sheetW;
  const v0 = 1 - rect.y / sheetH;
  const v1 = 1 - (rect.y + rect.h) / sheetH;
  const left = flip ? u1 : u0;
  const right = flip ? u0 : u1;
  const uv = geometry.getAttribute('uv') as BufferAttribute;
  uv.setXY(0, left, v0);
  uv.setXY(1, right, v0);
  uv.setXY(2, left, v1);
  uv.setXY(3, right, v1);
  uv.needsUpdate = true;
}
