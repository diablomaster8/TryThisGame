import {
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from 'three';
import { CAMERA } from '../config/tuning';
import type { FrameRect, SpriteSheet } from './sprites/atlas';
import { MegaAtlas } from './sprites/mega-atlas';

/** Native pixels per world unit: a 32px sprite stands 2 units tall at the near zoom. */
export const NATIVE_PPU: number = CAMERA.pixelsPerUnit[CAMERA.pixelsPerUnit.length - 1] ?? 16;

export interface SpriteDraw {
  sheet: SpriteSheet;
  rect: FrameRect;
  flip: boolean;
  /** Feet position; `y` lifts the sprite. */
  x: number;
  y: number;
  z: number;
  /** 'billboard' turns to the camera and tilts back; 'flat' lies on the ground. */
  mode: 'billboard' | 'flat';
  /** World size; defaults to the frame size over NATIVE_PPU. */
  w?: number;
  h?: number;
  opacity?: number;
  /** Brightness 0..1 multiplied into the vertex colour (night dimming). */
  tint?: number;
}

/** A sprite's four corners as drawn, kept for CPU picking. */
export interface DrawnQuad {
  id: string;
  kind:
    | 'nubbin'
    | 'item'
    | 'npc'
    | 'memorial'
    | 'decor'
    | 'tree'
    | 'building'
    | 'plant'
    | 'wild'
    | 'lantern'
    | 'stairs'
    | 'chest'
    | 'stray'
    | 'loot'
    | 'storyProp';
  corners: [Vector3, Vector3, Vector3, Vector3];
  /** The frame drawn, so a pick can test the texel under the tap instead of the whole box. */
  sheet: SpriteSheet;
  rect: FrameRect;
  flip: boolean;
}

/**
 * Every sprite in the Grove in one mesh and one draw call: quads are rebuilt each frame
 * (a few dozen at most) and sampled from one mega atlas. Alpha comes from the vertex
 * colour so cocoons can fade without a second material.
 */
export class SpriteBatch {
  readonly mesh: Mesh<BufferGeometry, MeshBasicMaterial>;

  readonly quads: DrawnQuad[] = [];
  /** When set, the matching sprite is drawn with a bright halo behind it. */
  highlight: { kind: string; id: string } | null = null;
  private pulse = 0;
  private capacity = 64;
  private count = 0;
  private positions = new Float32Array(this.capacity * 12);
  private uvs = new Float32Array(this.capacity * 8);
  private colors = new Float32Array(this.capacity * 16);
  private indices = new Uint16Array(this.capacity * 6);
  private readonly right = new Vector3();
  private readonly up = new Vector3();
  /** What each quad of this frame shows, so its UVs can be rebuilt after an atlas repack. */
  private frameDraws: Array<{ sheet: SpriteSheet; rect: FrameRect; flip: boolean }> = [];
  /** The atlas generation this frame's UVs were taken from. */
  private uvGeneration = 0;

  /** The atlas is injectable so tests can hand in one with a fake canvas. */
  constructor(readonly atlas: MegaAtlas = new MegaAtlas()) {
    const geometry = new BufferGeometry();
    this.fillAttributes(geometry);
    const material = new MeshBasicMaterial({
      map: this.atlas.texture,
      transparent: true,
      alphaTest: 0.05,
      depthWrite: true,
      vertexColors: true,
    });
    this.mesh = new Mesh(geometry, material);
    this.mesh.frustumCulled = false;
    // New sheets upload only their own region, just before the batch is drawn.
    this.mesh.onBeforeRender = (renderer) => this.atlas.flush(renderer);
  }

  private fillAttributes(geometry: BufferGeometry): void {
    for (let i = 0; i < this.capacity; i++) {
      const v = i * 4;
      this.indices.set([v, v + 2, v + 1, v + 1, v + 2, v + 3], i * 6);
    }
    geometry.setAttribute(
      'position',
      new BufferAttribute(this.positions, 3).setUsage(DynamicDrawUsage),
    );
    geometry.setAttribute('uv', new BufferAttribute(this.uvs, 2).setUsage(DynamicDrawUsage));
    geometry.setAttribute('color', new BufferAttribute(this.colors, 4).setUsage(DynamicDrawUsage));
    geometry.setIndex(new BufferAttribute(this.indices, 1));
  }

  private grow(): void {
    this.capacity *= 2;
    const positions = new Float32Array(this.capacity * 12);
    positions.set(this.positions);
    const uvs = new Float32Array(this.capacity * 8);
    uvs.set(this.uvs);
    const colors = new Float32Array(this.capacity * 16);
    colors.set(this.colors);
    this.positions = positions;
    this.uvs = uvs;
    this.colors = colors;
    this.indices = new Uint16Array(this.capacity * 6);
    this.mesh.geometry.dispose();
    this.mesh.geometry = new BufferGeometry();
    this.fillAttributes(this.mesh.geometry);
  }

  /** Start a frame. Billboards face a camera at `yaw` with the fixed `pitch`. */
  begin(yaw: number, pitch: number): void {
    this.count = 0;
    this.quads.length = 0;
    this.frameDraws.length = 0;
    this.atlas.beginFrame();
    this.uvGeneration = this.atlas.generation;
    this.pulse = 0.5 + 0.5 * Math.sin(Date.now() / 160);
    // Camera right on the ground plane, and the tilted-back up vector.
    this.right.set(Math.cos(yaw), 0, -Math.sin(yaw));
    this.up.set(
      -Math.sin(yaw) * Math.sin(pitch),
      Math.cos(pitch),
      -Math.cos(yaw) * Math.sin(pitch),
    );
  }

  draw(
    d: SpriteDraw,
    pick?: {
      id: string;
      kind:
        | 'nubbin'
        | 'item'
        | 'npc'
        | 'memorial'
        | 'decor'
        | 'tree'
        | 'building'
        | 'plant'
        | 'wild'
        | 'lantern'
        | 'stairs'
        | 'chest'
        | 'stray'
        | 'loot'
        | 'storyProp';
    },
  ): void {
    // Placing may evict and repack; then the quads already drawn this frame re-ask their UVs.
    if (!this.atlas.place(d.sheet)) return;
    if (this.atlas.generation !== this.uvGeneration) this.refreshUvs();
    const uv = this.atlas.uv(d.sheet, d.rect);
    if (!uv) return;
    // The highlight: the same frame, a little larger and bright, drawn first so the real
    // sprite covers its middle and only a glowing rim shows.
    if (
      pick &&
      this.highlight &&
      pick.id === this.highlight.id &&
      pick.kind === this.highlight.kind
    ) {
      const hw = (d.w ?? d.rect.w / NATIVE_PPU) * (1.12 + this.pulse * 0.05);
      const hh = (d.h ?? d.rect.h / NATIVE_PPU) * (1.12 + this.pulse * 0.05);
      const halo = this.highlight;
      this.highlight = null;
      this.draw({
        ...d,
        w: hw,
        h: hh,
        y: d.y - (d.mode === 'flat' ? 0.001 : hh * 0.05),
        tint: 1.8 + this.pulse * 0.4,
        opacity: 0.85,
      });
      this.highlight = halo;
    }
    if (this.count >= this.capacity) this.grow();
    const i = this.count++;
    const w = d.w ?? d.rect.w / NATIVE_PPU;
    const h = d.h ?? d.rect.h / NATIVE_PPU;
    const corners = this.cornersFor(d, w, h);
    const o = i * 12;
    corners.forEach((v, c) => {
      this.positions[o + c * 3] = v.x;
      this.positions[o + c * 3 + 1] = v.y;
      this.positions[o + c * 3 + 2] = v.z;
    });
    this.writeUv(i, uv, d.flip);
    this.frameDraws[i] = { sheet: d.sheet, rect: d.rect, flip: d.flip };
    const a = d.opacity ?? 1;
    const b = d.tint ?? 1;
    for (let c = 0; c < 4; c++) this.colors.set([b, b, b, a], i * 16 + c * 4);
    if (pick) {
      this.quads.push({
        id: pick.id,
        kind: pick.kind,
        corners,
        sheet: d.sheet,
        rect: d.rect,
        flip: d.flip,
      });
    }
  }

  private writeUv(i: number, uv: [number, number, number, number], flip: boolean): void {
    const [u0, v0, u1, v1] = uv;
    const left = flip ? u1 : u0;
    const right = flip ? u0 : u1;
    this.uvs.set([left, v0, right, v0, left, v1, right, v1], i * 8);
  }

  /** After a repack every sheet may have moved: point this frame's quads at their new places. */
  private refreshUvs(): void {
    this.uvGeneration = this.atlas.generation;
    for (let i = 0; i < this.count; i++) {
      const f = this.frameDraws[i];
      if (!f) continue;
      // A sheet that no longer fits collapses to an empty quad rather than showing the wrong art.
      this.writeUv(i, this.atlas.uv(f.sheet, f.rect) ?? [0, 0, 0, 0], f.flip);
    }
  }

  /** Corners in order: top-left, top-right, bottom-left, bottom-right. */
  private cornersFor(d: SpriteDraw, w: number, h: number): [Vector3, Vector3, Vector3, Vector3] {
    const hw = w / 2;
    if (d.mode === 'flat') {
      const y = 0.012 + d.y;
      const hh = h / 2;
      return [
        new Vector3(d.x - hw, y, d.z - hh),
        new Vector3(d.x + hw, y, d.z - hh),
        new Vector3(d.x - hw, y, d.z + hh),
        new Vector3(d.x + hw, y, d.z + hh),
      ];
    }
    const base = new Vector3(d.x, d.y, d.z);
    const bl = base.clone().addScaledVector(this.right, -hw);
    const br = base.clone().addScaledVector(this.right, hw);
    return [bl.clone().addScaledVector(this.up, h), br.clone().addScaledVector(this.up, h), bl, br];
  }

  /** Finish the frame: upload and set the draw range. */
  end(): void {
    const g = this.mesh.geometry;
    for (const name of ['position', 'uv', 'color'] as const) {
      (g.getAttribute(name) as BufferAttribute).needsUpdate = true;
    }
    g.setDrawRange(0, this.count * 6);
    this.mesh.visible = this.count > 0;
  }

  get drawn(): number {
    return this.count;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.atlas.dispose();
  }
}
