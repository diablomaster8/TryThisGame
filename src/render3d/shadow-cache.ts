/**
 * hot/perf-leaks round 2: the sun's shadow map without redrawing what holds still.
 *
 * At full quality three redraws every caster into the sun's shadow map each frame, and on a
 * phone that pass was about a quarter of the Full 3D frame. Most casters are scenery: the
 * terrain, the far trees, the merged building pieces (`shadow-merge.ts`). Only the creatures
 * and the odd moving prop change from frame to frame.
 *
 * So while the shadow camera holds still, the static casters are drawn once into a cached
 * depth buffer; each frame the shadow map starts from a copy of that depth (a framebuffer
 * blit, in place of three's clear) and only the moving casters are drawn on top. The shadow
 * map holds depth only, written with the depth test on and no blending, so the result is the
 * nearest depth per texel whichever order the casters come in: exactly what one full pass
 * gives.
 *
 * The cache is dropped (and the frame drawn the plain way) whenever anything it holds could
 * differ: the shadow camera or map changed, a static caster moved, hid, left or changed its
 * geometry or material, or the occluders' hide boxes (which the building depth program reads)
 * changed. Skinned and morphing meshes are always movers (their bones and weights move them
 * without touching the world matrix). A static caster that changes becomes a mover for
 * `MOVER_FRAMES` frames, so a prop that animates for a while is simply drawn every frame
 * meanwhile. Casters under the dynamic roots (the creatures) are always movers. It is rebuilt once the shadow camera has held still
 * for a frame, so a walking Keeper (the box follows them) costs what it did before.
 */
import * as THREE from 'three';

/** Frames a caster that changed stays a mover before it may join the cache again. */
const MOVER_FRAMES = 90;

interface Caster {
  /** The caster's last seen state: world matrix and the numbers below. */
  readonly sig: Float64Array;
  geometry: THREE.BufferGeometry | null;
  material: THREE.Material | THREE.Material[] | null;
  depth: THREE.Material | undefined;
  /** Frame it last changed (or first appeared). */
  changed: number;
}

const SIG = 16 + 12;

export interface ShadowCacheStats {
  /** Frames the shadow map was drawn from the cache (movers only). */
  cached: number;
  /** Frames the cache was rebuilt. */
  rebuilt: number;
  /** Frames drawn the plain way (the cache could not be used). */
  plain: number;
  /** Static casters in the cache. */
  statics: number;
}

export class ShadowCache {
  enabled = true;
  readonly stats: ShadowCacheStats = { cached: 0, rebuilt: 0, plain: 0, statics: 0 };
  private readonly casters = new WeakMap<THREE.Object3D, Caster>();
  /** Static casters this frame, and those the cache was drawn with. */
  private now: THREE.Object3D[] = [];
  private cachedList: THREE.Object3D[] = [];
  /** Movers this frame (outside the dynamic roots), for the static pass. */
  private readonly movers: THREE.Object3D[] = [];
  private readonly dynCasters: THREE.Object3D[] = [];
  private key = new Float64Array(0);
  private lastKey = new Float64Array(0);
  private cachedKey = new Float64Array(0);
  private valid = false;
  private frame = 0;
  private fb: WebGLFramebuffer | null = null;
  private rb: WebGLRenderbuffer | null = null;
  private size = { w: 0, h: 0 };
  /** What the clear inside three's shadow pass does: nothing (rebuild) or copy the cache in. */
  private clearMode: 'off' | 'keep' | 'copy' = 'off';

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    /** Subtrees whose casters always count as movers (the creatures). */
    private readonly dynamicRoots: () => readonly THREE.Object3D[],
    /** Numbers outside the casters that the depth programs read (the occluders' hide boxes). */
    private readonly extraKey: (out: number[]) => void,
  ) {
    const map = renderer.shadowMap;
    const draw = map.render.bind(map);
    const clear = renderer.clear.bind(renderer);
    renderer.clear = (color?: boolean, depth?: boolean, stencil?: boolean) => {
      if (this.clearMode === 'off') return clear(color, depth, stencil);
      if (this.clearMode === 'copy') this.blit(true);
      // 'keep': the static pass's depth is already in the map.
    };
    map.render = (lights, scene, camera) => this.render(draw, lights, scene, camera);
  }

  private render(
    draw: (lights: THREE.Light[], scene: THREE.Scene, camera: THREE.Camera) => void,
    lights: THREE.Light[],
    scene: THREE.Scene,
    camera: THREE.Camera,
  ): void {
    const map = this.renderer.shadowMap;
    // Three draws nothing for these; leave the cache alone.
    if (!map.enabled || (!map.autoUpdate && !map.needsUpdate) || lights.length === 0) {
      draw(lights, scene, camera);
      return;
    }
    this.frame++;
    const sun = this.sun(lights);
    if (!this.enabled || !sun || map.type === THREE.VSMShadowMap || !sun.shadow.map) {
      this.valid = false;
      this.stats.plain++;
      draw(lights, scene, camera);
      return;
    }
    const shadow = sun.shadow;
    // The same matrices three is about to compute, so the key sees where the box is now.
    shadow.updateMatrices(sun);
    this.makeKey(shadow, map.type);
    if (
      !equal(this.key, this.lastKey) ||
      !this.ensureTarget(shadow.map as THREE.WebGLRenderTarget | null)
    ) {
      // The box is moving (a walking Keeper, a race): draw the plain way, and skip the walk
      // over the casters too; a caster that changed meanwhile is caught when the box settles.
      this.valid = false;
      this.stats.plain++;
      draw(lights, scene, camera);
    } else {
      this.collect(scene, camera);
      if (this.valid && equal(this.key, this.cachedKey) && sameList(this.now, this.cachedList)) {
        this.stats.cached++;
        this.drawMovers(draw, lights, scene, camera, 'copy');
      } else {
        this.stats.rebuilt++;
        this.rebuild(draw, lights, scene, camera, shadow.map as THREE.WebGLRenderTarget);
      }
    }
    const k = this.lastKey;
    this.lastKey = this.key;
    this.key = k;
    this.stats.statics = this.cachedList.length;
  }

  /** The one shadow-casting light, if it is the sun (a directional light); else null. */
  private sun(lights: THREE.Light[]): THREE.DirectionalLight | null {
    let sun: THREE.DirectionalLight | null = null;
    for (const l of lights) {
      if (!l.castShadow) continue;
      if (sun || !(l as THREE.DirectionalLight).isDirectionalLight) return null;
      sun = l as THREE.DirectionalLight;
    }
    return sun;
  }

  private readonly keyScratch: number[] = [];
  private makeKey(shadow: THREE.LightShadow, type: THREE.ShadowMapType): void {
    const k = this.keyScratch;
    k.length = 0;
    for (const v of shadow.camera.matrixWorldInverse.elements) k.push(v);
    for (const v of shadow.camera.projectionMatrix.elements) k.push(v);
    k.push(shadow.mapSize.x, shadow.mapSize.y, type, shadow.map!.width, shadow.map!.height);
    this.extraKey(k);
    if (this.key.length !== k.length) this.key = new Float64Array(k.length);
    this.key.set(k);
  }

  /**
   * Walk the scene as three's shadow pass does (visible chain, the view camera's layers) and
   * sort the casters outside the dynamic roots into static ones (`now`) and movers.
   */
  private collect(scene: THREE.Scene, camera: THREE.Camera): void {
    this.now.length = 0;
    this.movers.length = 0;
    const dyn = this.dynamicRoots();
    const frame = this.frame;
    const visit = (o: THREE.Object3D): void => {
      if (!o.visible) return;
      for (let i = 0; i < dyn.length; i++) if (dyn[i] === o) return;
      const m = o as THREE.Mesh;
      if (
        o.castShadow &&
        (m.isMesh || (o as THREE.Line).isLine || (o as THREE.Points).isPoints) &&
        o.layers.test(camera.layers)
      ) {
        // A skinned or morphing mesh moves inside an unchanged world matrix: always a mover.
        if ((m as THREE.SkinnedMesh).isSkinnedMesh || m.morphTargetInfluences?.length) {
          this.movers.push(o);
          for (const c of o.children) visit(c);
          return;
        }
        let c = this.casters.get(o);
        if (!c) {
          c = {
            sig: new Float64Array(SIG),
            geometry: null,
            material: null,
            depth: undefined,
            changed: frame,
          };
          this.casters.set(o, c);
          sign(m, c);
        } else if (!signSame(m, c)) {
          c.changed = frame;
          sign(m, c);
        }
        if (frame - c.changed >= MOVER_FRAMES) this.now.push(o);
        else this.movers.push(o);
      }
      const ch = o.children;
      for (let i = 0; i < ch.length; i++) visit(ch[i]!);
    };
    visit(scene);
  }

  /** Draw only the movers: the statics' cast flag is off for the call. */
  private drawMovers(
    draw: (lights: THREE.Light[], scene: THREE.Scene, camera: THREE.Camera) => void,
    lights: THREE.Light[],
    scene: THREE.Scene,
    camera: THREE.Camera,
    mode: 'copy' | 'keep',
  ): void {
    const list = this.cachedList;
    for (let i = 0; i < list.length; i++) list[i]!.castShadow = false;
    this.clearMode = mode;
    try {
      draw(lights, scene, camera);
    } finally {
      this.clearMode = 'off';
      for (let i = 0; i < list.length; i++) list[i]!.castShadow = true;
    }
  }

  /** Draw the statics alone, keep their depth, then add the movers. */
  private rebuild(
    draw: (lights: THREE.Light[], scene: THREE.Scene, camera: THREE.Camera) => void,
    lights: THREE.Light[],
    scene: THREE.Scene,
    camera: THREE.Camera,
    target: THREE.WebGLRenderTarget,
  ): void {
    const off = this.dynCasters;
    off.length = 0;
    for (const o of this.movers) off.push(o);
    for (const root of this.dynamicRoots())
      root.traverse((o) => {
        if (o.castShadow) off.push(o);
      });
    const map = this.renderer.shadowMap;
    for (const o of off) o.castShadow = false;
    try {
      draw(lights, scene, camera);
    } finally {
      for (const o of off) o.castShadow = true;
    }
    this.copy(target);
    this.cachedList = this.now.slice();
    if (this.cachedKey.length !== this.key.length)
      this.cachedKey = new Float64Array(this.key.length);
    this.cachedKey.set(this.key);
    this.valid = true;
    // The first pass marked the map drawn; the movers' pass belongs to the same frame.
    if (!map.autoUpdate) map.needsUpdate = true;
    this.drawMovers(draw, lights, scene, camera, 'keep');
  }

  /** A depth-only framebuffer the size of the shadow map (no colour: it is never sampled). */
  private ensureTarget(target: THREE.WebGLRenderTarget | null): boolean {
    if (!target?.depthTexture) return false;
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    if (typeof gl.blitFramebuffer !== 'function') return false;
    const { width: w, height: h } = target;
    if (this.fb && this.size.w === w && this.size.h === h) return true;
    this.disposeTarget();
    const fmt = depthFormat(gl, target.depthTexture);
    if (fmt === null) return false;
    this.rb = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.rb);
    gl.renderbufferStorage(gl.RENDERBUFFER, fmt, w, h);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    this.fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.rb);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    this.rebind();
    this.size = { w, h };
    if (!ok) {
      this.disposeTarget();
      this.enabled = false;
    }
    return ok;
  }

  private shadowFb(target: THREE.WebGLRenderTarget): WebGLFramebuffer | null {
    const p = this.renderer.properties.get(target) as { __webglFramebuffer?: WebGLFramebuffer };
    return p.__webglFramebuffer ?? null;
  }

  /** Shadow map depth into the cache (after the static pass). */
  private copy(target: THREE.WebGLRenderTarget): void {
    const src = this.shadowFb(target);
    if (!src || !this.fb) {
      this.valid = false;
      return;
    }
    this.blitBetween(src, this.fb);
    this.rebind();
  }

  /** The cache into the shadow map, which three has bound for its pass (the clear's place). */
  private blit(intoBound: boolean): void {
    const target = this.renderer.getRenderTarget() as THREE.WebGLRenderTarget | null;
    const dst = target ? this.shadowFb(target) : null;
    if (!dst || !this.fb || !intoBound) return;
    this.blitBetween(this.fb, dst);
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    // Back to the shadow map for both reading and drawing, as three's state believes.
    gl.bindFramebuffer(gl.FRAMEBUFFER, dst);
  }

  private blitBetween(src: WebGLFramebuffer, dst: WebGLFramebuffer): void {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const { w, h } = this.size;
    this.renderer.state.buffers.depth.setMask(true);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, src);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, dst);
    gl.blitFramebuffer(0, 0, w, h, 0, 0, w, h, gl.DEPTH_BUFFER_BIT, gl.NEAREST);
  }

  /** Put three's idea of the bound framebuffer back in force after raw GL binds. */
  private rebind(): void {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const st = this.renderer.state;
    st.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.renderer.setRenderTarget(this.renderer.getRenderTarget());
  }

  private disposeTarget(): void {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    if (this.fb) gl.deleteFramebuffer(this.fb);
    if (this.rb) gl.deleteRenderbuffer(this.rb);
    this.fb = null;
    this.rb = null;
    this.valid = false;
  }

  dispose(): void {
    this.disposeTarget();
  }
}

/** The GL internal format three gives a depth texture (see `WebGLTextures`), or null. */
function depthFormat(gl: WebGL2RenderingContext, tex: THREE.DepthTexture): number | null {
  if (tex.format !== THREE.DepthFormat) return null;
  if (tex.type === THREE.UnsignedIntType || tex.type === THREE.UnsignedInt248Type)
    return gl.DEPTH_COMPONENT24;
  if (tex.type === THREE.FloatType) return gl.DEPTH_COMPONENT32F;
  if (tex.type === THREE.UnsignedShortType) return gl.DEPTH_COMPONENT16;
  return null;
}

function equal(a: Float64Array, b: Float64Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function sameList(a: readonly THREE.Object3D[], b: readonly THREE.Object3D[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/** The numbers besides the world matrix that change what a caster puts in the depth map. */
function numbers(m: THREE.Mesh, out: Float64Array): void {
  const g = m.geometry as THREE.BufferGeometry | undefined;
  const pos = g?.attributes.position;
  const idx = g?.index;
  const inst = m as THREE.InstancedMesh;
  const mat = Array.isArray(m.material) ? m.material[0] : m.material;
  out[16] = pos ? ((pos as THREE.BufferAttribute).version ?? -1) : -1;
  out[17] = pos ? pos.count : -1;
  out[18] = idx ? idx.version : -1;
  out[19] = idx ? idx.count : -1;
  out[20] = g ? g.drawRange.start : -1;
  out[21] = g ? g.drawRange.count : -1;
  out[22] = inst.isInstancedMesh ? inst.count : -1;
  out[23] = inst.isInstancedMesh ? inst.instanceMatrix.version : -1;
  out[24] = mat ? mat.version : -1;
  out[25] = mat ? mat.side + (mat.visible ? 4 : 0) : -1;
  out[26] = mat && mat.shadowSide !== null ? mat.shadowSide : -1;
  out[27] = mat ? mat.alphaTest : -1;
}

const scratch = new Float64Array(SIG);

function sign(m: THREE.Mesh, c: Caster): void {
  c.sig.set(m.matrixWorld.elements);
  numbers(m, c.sig);
  c.geometry = (m.geometry as THREE.BufferGeometry | undefined) ?? null;
  c.material = m.material ?? null;
  c.depth = m.customDepthMaterial;
}

function signSame(m: THREE.Mesh, c: Caster): boolean {
  if (m.geometry !== c.geometry || m.material !== c.material) return false;
  if (m.customDepthMaterial !== c.depth) return false;
  const e = m.matrixWorld.elements;
  const s = c.sig;
  for (let i = 0; i < 16; i++) if (e[i] !== s[i]) return false;
  numbers(m, scratch);
  for (let i = 16; i < SIG; i++) if (scratch[i] !== s[i]) return false;
  return true;
}
