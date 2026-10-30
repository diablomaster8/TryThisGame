import {
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  Mesh,
  MeshBasicMaterial,
  GreaterDepth,
  ShaderMaterial,
  Vector2,
  Vector3,
  Vector4,
  Color,
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
  /**
   * Checkerboard thinning 0..1 inside the batch's dither circle (`ditherCircle`): 1 drops
   * every other pixel, as a building fades from in front of the cast (campaign graphics 2).
   */
  dither?: number;
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
/**
 * R0073: Nubbins (and eggs) drawn this many times larger at the survey zoom (map tokens; the
 * camera sets it). Their pick quads grow with them, so they stay tappable.
 */
export const SPRITE_TOKENS = { scale: 1 };

export class SpriteBatch {
  readonly mesh: Mesh<BufferGeometry, MeshBasicMaterial>;

  readonly quads: DrawnQuad[] = [];
  /**
   * The x-ray pass (MOVE-19): quads redrawn as a tinted silhouette wherever something nearer
   * hides them. It is a child mesh over the same buffers, so it costs one extra draw call.
   */
  readonly xray: Mesh<BufferGeometry, ShaderMaterial>;
  private xrayQuads: Array<{ index: number; color: Color }> = [];
  private xrayTexel = { value: new Vector2(1 / 4096, 1 / 4096) };
  /** When set, the matching sprite is drawn with a bright halo behind it. */
  highlight: { kind: string; id: string } | null = null;
  private pulse = 0;
  private capacity = 64;
  private count = 0;
  private positions = new Float32Array(this.capacity * 12);
  private uvs = new Float32Array(this.capacity * 8);
  private colors = new Float32Array(this.capacity * 16);
  private dithers = new Float32Array(this.capacity * 4);
  private indices = new Uint16Array(this.capacity * 6);
  /**
   * Where sprites drawn with `dither` thin: x, y the centre in NDC, z the radius as a share
   * of the view's height. Set each frame by the WorldView (round the framed cast).
   */
  readonly ditherCircle = { value: new Vector2(0, 0) };
  readonly ditherRadius = { value: 0 };
  private readonly viewport = { value: new Vector2(1, 1) };
  private readonly vp = new Vector4();
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
    this.xray = new Mesh(new BufferGeometry(), this.xrayMaterial());
    this.xray.frustumCulled = false;
    this.xray.renderOrder = 50;
    this.xray.visible = false;
    this.mesh.add(this.xray);
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uDitherC = this.ditherCircle;
      shader.uniforms.uDitherR = this.ditherRadius;
      shader.uniforms.uViewport = this.viewport;
      // HOT-2: the atlas's second page; a quad on it has u shifted by 2.
      shader.uniforms.map2 = { value: this.atlas.texture2 };
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          '#include <common>\nattribute float dither;\nvarying float vDither;',
        )
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvDither = dither;');
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          '#include <common>\nuniform vec2 uDitherC;\nuniform float uDitherR;\nuniform vec2 uViewport;\nvarying float vDither;\nuniform sampler2D map2;',
        )
        .replace(
          '#include <map_fragment>',
          `vec4 sampledDiffuseColor = vMapUv.x < 1.5 ? texture2D(map, vMapUv) : texture2D(map2, vMapUv - vec2(2.0, 0.0));
          diffuseColor *= sampledDiffuseColor;`,
        )
        .replace(
          '#include <clipping_planes_fragment>',
          `#include <clipping_planes_fragment>
          if (vDither > 0.0) {
            vec2 ndc = gl_FragCoord.xy / uViewport * 2.0 - 1.0;
            vec2 d = (ndc - uDitherC) * vec2(uViewport.x / uViewport.y, 1.0) * 0.5;
            if (length(d) < uDitherR) {
              vec2 c = mod(floor(gl_FragCoord.xy), 2.0);
              float b = c.y < 0.5 ? (c.x < 0.5 ? 0.0 : 0.5) : (c.x < 0.5 ? 0.75 : 0.25);
              if (b < vDither * 0.5) discard;
            }
          }`,
        );
    };
    material.customProgramCacheKey = () => 'sprite-batch|dither|pages';
    // New sheets upload only their own region, just before the batch is drawn.
    this.mesh.onBeforeRender = (renderer) => {
      this.atlas.flush(renderer);
      renderer.getCurrentViewport(this.vp);
      this.viewport.value.set(Math.max(1, this.vp.z), Math.max(1, this.vp.w));
    };
  }

  private xrayMaterial(): ShaderMaterial {
    return new ShaderMaterial({
      uniforms: {
        map: { value: this.atlas.texture },
        map2: { value: this.atlas.texture2 },
        uTexel: this.xrayTexel,
      },
      vertexShader: `attribute vec4 color; varying vec4 vColor; varying vec2 vUv;
        void main() { vColor = color; vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform sampler2D map; uniform sampler2D map2; uniform vec2 uTexel;
        varying vec4 vColor; varying vec2 vUv;
        float alphaAt(vec2 uv) {
          return uv.x < 1.5 ? texture2D(map, uv).a : texture2D(map2, uv - vec2(2.0, 0.0)).a;
        }
        void main() {
          float a = alphaAt(vUv);
          if (a < 0.5) discard;
          float edge = 1.0;
          edge = min(edge, step(0.5, alphaAt(vUv + vec2(uTexel.x, 0.0))));
          edge = min(edge, step(0.5, alphaAt(vUv - vec2(uTexel.x, 0.0))));
          edge = min(edge, step(0.5, alphaAt(vUv + vec2(0.0, uTexel.y))));
          edge = min(edge, step(0.5, alphaAt(vUv - vec2(0.0, uTexel.y))));
          gl_FragColor = vec4(vColor.rgb, edge > 0.5 ? vColor.a : min(1.0, vColor.a + 0.4));
        }`,
      transparent: true,
      depthTest: true,
      depthFunc: GreaterDepth,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -4,
    });
  }

  /**
   * Mark the sprite just drawn for the x-ray pass: it is redrawn at 45% in `color` only
   * where a nearer sprite or building hides it (MOVE-19).
   */
  markXray(color: number): void {
    if (this.lastCulled || this.count === 0 || this.xrayQuads.length >= 4) return;
    this.xrayQuads.push({ index: this.count - 1, color: new Color(color) });
  }

  /** The corners a sprite would be drawn with, without drawing it. */
  quadCorners(d: SpriteDraw): [Vector3, Vector3, Vector3, Vector3] {
    return this.cornersFor(d, d.w ?? d.rect.w / NATIVE_PPU, d.h ?? d.rect.h / NATIVE_PPU);
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
    geometry.setAttribute(
      'dither',
      new BufferAttribute(this.dithers, 1).setUsage(DynamicDrawUsage),
    );
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
    const dithers = new Float32Array(this.capacity * 4);
    dithers.set(this.dithers);
    this.positions = positions;
    this.uvs = uvs;
    this.colors = colors;
    this.dithers = dithers;
    this.indices = new Uint16Array(this.capacity * 6);
    this.mesh.geometry.dispose();
    this.mesh.geometry = new BufferGeometry();
    this.fillAttributes(this.mesh.geometry);
    this.xray.geometry.dispose();
    this.xray.geometry = new BufferGeometry();
  }

  /** Start a frame. Billboards face a camera at `yaw` with the fixed `pitch`. */
  /**
   * WORLD-09: when set, sprites it calls surely off screen are skipped (not drawn, not
   * pickable); `culled` counts them per frame for the debug panel and the perf probe.
   */
  cull: ((d: SpriteDraw, w: number, h: number) => boolean) | null = null;
  culled = 0;
  private lastCulled = false;

  begin(yaw: number, pitch: number): void {
    this.culled = 0;
    this.count = 0;
    this.quads.length = 0;
    this.xrayQuads.length = 0;
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
    if (SPRITE_TOKENS.scale !== 1 && pick?.kind === 'nubbin') {
      const k = SPRITE_TOKENS.scale;
      d = { ...d, w: (d.w ?? d.rect.w / NATIVE_PPU) * k, h: (d.h ?? d.rect.h / NATIVE_PPU) * k };
    }
    this.lastCorners = null;
    this.lastCulled =
      this.cull !== null &&
      !this.cull(d, d.w ?? d.rect.w / NATIVE_PPU, d.h ?? d.rect.h / NATIVE_PPU);
    if (this.lastCulled) {
      this.culled++;
      return;
    }
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
    this.dithers.fill(d.dither ?? 0, i * 4, i * 4 + 4);
    this.lastCorners = corners;
    if (pick && pick.kind === 'nubbin' && this.highlight?.id === pick.id && !d.dither) {
      this.markXray(0xfff3b0);
    }
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

  /** The last drawn sprite's corners (for a renderer that wants its screen rect). */
  lastCorners: [Vector3, Vector3, Vector3, Vector3] | null = null;

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
    this.endXray();
    const g = this.mesh.geometry;
    for (const name of ['position', 'uv', 'color', 'dither'] as const) {
      (g.getAttribute(name) as BufferAttribute).needsUpdate = true;
    }
    g.setDrawRange(0, this.count * 6);
    this.mesh.visible = this.count > 0;
  }

  /** Copy the marked quads after the real ones and point the x-ray mesh at just those. */
  private endXray(): void {
    const n = this.xrayQuads.length;
    this.xray.visible = n > 0 && this.count > 0;
    if (!this.xray.visible) return;
    while (this.count + n > this.capacity) {
      this.grow();
    }
    const g = this.mesh.geometry;
    const xg = this.xray.geometry;
    if (xg.getAttribute('position') !== g.getAttribute('position')) {
      for (const name of ['position', 'uv', 'color'] as const) {
        xg.setAttribute(name, g.getAttribute(name));
      }
      xg.setIndex(g.getIndex());
    }
    this.xrayQuads.forEach((q, k) => {
      const from = q.index;
      const to = this.count + k;
      this.positions.copyWithin(to * 12, from * 12, from * 12 + 12);
      this.uvs.copyWithin(to * 8, from * 8, from * 8 + 8);
      for (let c = 0; c < 4; c++) {
        this.colors.set([q.color.r, q.color.g, q.color.b, 0.45], to * 16 + c * 4);
      }
    });
    this.xray.geometry.setDrawRange(this.count * 6, n * 6);
    const img = this.atlas.texture.image as { width?: number; height?: number } | null;
    this.xrayTexel.value.set(1 / (img?.width || 4096), 1 / (img?.height || 4096));
  }

  get drawn(): number {
    return this.count;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.xray.geometry.dispose();
    this.xray.material.dispose();
    this.atlas.dispose();
  }
}
