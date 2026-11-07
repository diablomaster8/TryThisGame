/**
 * hot/perf-leaks round 5: the still scenery in a few draw calls.
 *
 * The 3D Grove's buildings, plinths, timber, doors, walls and prop sets are each one mesh per
 * material (`building-kit.ts` buckets), so a phone frame spent most of its draw time on three's
 * per-draw program and uniform setup, about forty times. Most of those meshes run the same
 * program and differ only in a few material numbers: the colour, the glow, the normal-map
 * strength, the occluder's ground flag, and which painted surface they sample.
 *
 * So the meshes that hold still are folded, per program, into one merged mesh whose vertices
 * carry the piece they came from (`wmId`): a small float texture holds each piece's colour,
 * glow (emissive x intensity), normal strength, ground flag and whether it shows this frame,
 * read in the vertex shader into flat varyings, and up to `WORLD_MERGE.maxSets` texture sets are
 * sampled by a per-vertex index (with the derivatives taken once, outside the branch). The
 * merged material replays the first piece's own shader hooks (toon bands, occluder dither,
 * snow), so the program is the pieces' program with those uniforms read per piece.
 *
 * The pieces stay in the scene as they were: picking, the occluders, the shadow pass (they
 * and `ShadowMerge` still cast), the hulls, the dressings that find them by name, all see what
 * they saw. Only the piece's own main-pass draw is skipped while the merged mesh stands in for
 * it, and it is checked before every render: a piece that hides, moves, changes geometry,
 * material or any number the merge does not carry draws itself again at once (and the merged
 * mesh drops it), then is merged afresh after it holds still (a rebuild, rate-limited), or
 * after `WORLD_MERGE.moves` changes keeps drawing itself. The view's frustum test is done per
 * piece, so off-screen pieces cost no vertex work. `enabled` (and `?merge=0`) turns it off.
 */
import * as THREE from 'three';
import { WORLD_MERGE } from '../config/tuning';
import { bakeGeometry } from './world-merge-bake';
import { mergeable, mergedMaterial, OPTIONAL_HOOKS, PER_PIECE_FLOATS } from './world-merge-shader';

export { patchMerged, mergeable } from './world-merge-shader';

/** Standard-material uniforms the merge reads per piece instead of from the material. */
const PER_PIECE = new Set(['diffuse', 'emissive', 'normalScale', 'uOccIsGround']);

for (const [n] of PER_PIECE_FLOATS) PER_PIECE.add(n);
for (const list of Object.values(OPTIONAL_HOOKS)) for (const n of list) PER_PIECE.add(n);

/** Rows of the per-piece data texture. */
const ROWS = 4;

/** Texture slots a merged piece's material must leave empty (only `map` and `normalMap` merge). */
const OTHER_MAPS = [
  'lightMap',
  'aoMap',
  'emissiveMap',
  'bumpMap',
  'displacementMap',
  'roughnessMap',
  'metalnessMap',
  'alphaMap',
  'envMap',
  'clearcoatMap',
  'clearcoatRoughnessMap',
  'clearcoatNormalMap',
  'iridescenceMap',
  'iridescenceThicknessMap',
  'sheenColorMap',
  'sheenRoughnessMap',
  'transmissionMap',
  'thicknessMap',
  'specularIntensityMap',
  'specularColorMap',
  'anisotropyMap',
] as const;

const noRaycast = (): void => {};

/** The URL switch: `?merge=0` starts with merging off. */
export function mergeWanted(): boolean {
  if (typeof location === 'undefined') return true;
  return new URLSearchParams(location.search).get('merge') !== '0';
}

interface Piece {
  readonly mesh: THREE.Mesh;
  readonly mat: THREE.MeshStandardMaterial;
  readonly ver: number;
  readonly matrix: THREE.Matrix4;
  readonly geo: THREE.BufferGeometry;
  readonly stamp: Float64Array;
  readonly snap: Float64Array;
  readonly ground: THREE.IUniform | null;
  /** The `PER_PIECE_FLOATS` uniforms of its material (null where it has none). */
  readonly floats: (THREE.IUniform | null)[];
  /** Which `OPTIONAL_HOOKS` its program has. */
  readonly hooks: readonly string[];
  readonly sphere: THREE.Sphere;
  /** Index of its texture set in the group's `sets`. */
  readonly set: number;
  /** Still a member (false once it left: then it stays in the mesh, masked, until a rebuild). */
  live: boolean;
}

interface Group {
  readonly key: string;
  /** The key without the chunk number (`keyOf`). */
  readonly base: string;
  pieces: Piece[];
  /** Texture sets (colour map, normal map) its pieces sample; a piece's `set` indexes it. */
  sets: [THREE.Texture | null, THREE.Texture | null][];
  mesh: THREE.Mesh | null;
  tex: THREE.DataTexture | null;
  data: Float32Array;
  /** Any piece shown in the view this render (else the merged mesh skips its draw). */
  any: boolean;
  dirty: boolean;
  /** Vertices in the merged mesh, and how many of them belong to pieces that left. */
  verts: number;
  /** Pieces in the merged mesh (the first `built` of `pieces`). */
  built: number;
  gone: number;
}

/** Numbers of a material the merged program bakes in: a change means the piece draws itself. */
function snapOf(mesh: THREE.Mesh, m: THREE.MeshStandardMaterial, out: Float64Array): Float64Array {
  let i = 0;
  out[i++] = m.side;
  out[i++] = m.opacity;
  out[i++] = m.alphaTest;
  out[i++] = m.roughness;
  out[i++] = m.metalness;
  out[i++] = m.envMapIntensity;
  out[i++] = +m.depthTest;
  out[i++] = +m.depthWrite;
  out[i++] = +m.colorWrite;
  out[i++] = +m.transparent;
  out[i++] = +m.visible;
  out[i++] = m.blending;
  out[i++] = +m.polygonOffset;
  out[i++] = m.polygonOffsetFactor;
  out[i++] = m.polygonOffsetUnits;
  out[i++] = +m.toneMapped;
  out[i++] = +m.fog;
  out[i++] = +m.flatShading;
  out[i++] = +m.wireframe;
  out[i++] = +m.vertexColors;
  out[i++] = m.map ? m.map.id : -1;
  out[i++] = m.normalMap ? m.normalMap.id : -1;
  out[i++] = +mesh.receiveShadow;
  out[i++] = mesh.renderOrder;
  out[i++] = mesh.layers.mask;
  // MeshPhysicalMaterial's own numbers (0 on a standard material).
  const ph = m as THREE.MeshPhysicalMaterial;
  if (ph.isMeshPhysicalMaterial) {
    out[i++] = ph.clearcoat;
    out[i++] = ph.clearcoatRoughness;
    out[i++] = ph.ior;
    out[i++] = ph.sheen;
    out[i++] = ph.sheenRoughness;
    out[i++] = ph.sheenColor.r;
    out[i++] = ph.sheenColor.g;
    out[i++] = ph.sheenColor.b;
    out[i++] = ph.transmission;
    out[i++] = ph.thickness;
    out[i++] = ph.attenuationDistance;
    out[i++] = ph.attenuationColor.r;
    out[i++] = ph.attenuationColor.g;
    out[i++] = ph.attenuationColor.b;
    out[i++] = ph.iridescence;
    out[i++] = ph.iridescenceIOR;
    out[i++] = ph.specularIntensity;
    out[i++] = ph.specularColor.r;
    out[i++] = ph.specularColor.g;
    out[i++] = ph.specularColor.b;
    out[i++] = ph.anisotropy;
    out[i++] = ph.anisotropyRotation;
    out[i++] = ph.dispersion;
    out[i++] = ph.clearcoatNormalScale.x;
    out[i] = ph.clearcoatNormalScale.y;
  } else out.fill(0, i);
  return out;
}
const SNAP = 50;
const snapTmp = new Float64Array(SNAP);

/** What the geometry is now: a refilled or re-sliced mesh counts as a change. */
function stampOf(g: THREE.BufferGeometry, out: Float64Array): Float64Array {
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  const i = g.index;
  out[0] = g.id;
  out[1] = pos.version;
  out[2] = i ? i.version : -1;
  out[3] = i ? i.count : pos.count;
  out[4] = g.drawRange.start;
  out[5] = g.drawRange.count;
  return out;
}
const stampTmp = new Float64Array(6);

function sameArr(a: Float64Array, b: Float64Array): boolean {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/** The geometry's attributes besides position and normal: name, size, type, normalised. */
function attrsKey(g: THREE.BufferGeometry): string {
  // Colour is left out: pieces without vertex colours read white (`build`).
  return Object.keys(g.attributes)
    .filter((k) => k !== 'position' && k !== 'normal' && k !== 'color')
    .sort()
    .map((k) => {
      const a = g.getAttribute(k) as THREE.BufferAttribute;
      return `${k}:${a.itemSize}:${a.array.constructor.name}:${+a.normalized}`;
    })
    .join(',');
}

/** The program key without the parts of `OPTIONAL_HOOKS`. */
function programBase(mat: THREE.Material): string {
  return mat
    .customProgramCacheKey()
    .split('|')
    .filter((t) => !(t in OPTIONAL_HOOKS))
    .join('|');
}

/** Which `OPTIONAL_HOOKS` a material's program has. */
function optionalHooks(mat: THREE.Material): string[] {
  return mat
    .customProgramCacheKey()
    .split('|')
    .filter((t) => t in OPTIONAL_HOOKS);
}

/** A small id per object, so the group key can say "the same uniform object". */
const ids = new WeakMap<object, number>();
let nextId = 1;
function idOf(o: object): number {
  let n = ids.get(o);
  if (n === undefined) ids.set(o, (n = nextId++));
  return n;
}

/** Whether `o` and its ancestors up to `root` are shown, and `o` is still under `root`. */
function shownUnder(o: THREE.Object3D, root: THREE.Object3D): boolean {
  let p: THREE.Object3D | null = o;
  while (p && p !== root) {
    if (!p.visible) return false;
    p = p.parent;
  }
  return p === root && root.visible;
}

function sameMatrix(a: THREE.Matrix4, b: THREE.Matrix4): boolean {
  const x = a.elements;
  const y = b.elements;
  for (let i = 0; i < 16; i++) if (x[i] !== y[i]) return false;
  return true;
}

/** Is this mesh a still-scenery candidate by what it is (not yet whether it holds still)? */
export function mergeCandidate(o: THREE.Object3D): o is THREE.Mesh {
  const mesh = o as THREE.Mesh;
  if (!mesh.isMesh || (mesh as THREE.InstancedMesh).isInstancedMesh) return false;
  if ((mesh as THREE.SkinnedMesh).isSkinnedMesh || mesh.userData.worldMerge) return false;
  if (mesh.userData.hull || mesh.layers.mask !== 1) return false;
  if (mesh.onBeforeRender !== THREE.Object3D.prototype.onBeforeRender) return false;
  if (mesh.onAfterRender !== THREE.Object3D.prototype.onAfterRender) return false;
  const m = mesh.material as THREE.MeshPhysicalMaterial;
  if (Array.isArray(m) || !m || m.transparent) return false;
  if (m.type !== 'MeshStandardMaterial' && m.type !== 'MeshPhysicalMaterial') return false;
  // A transmissive piece needs three's transmission pass, which looks at each object.
  if (m.isMeshPhysicalMaterial && m.transmission > 0) return false;
  if (!m.visible || m.alphaHash || m.alphaToCoverage || m.clippingPlanes?.length) return false;
  if (m.onBeforeRender !== THREE.Material.prototype.onBeforeRender) return false;
  for (const k of OTHER_MAPS) if ((m as unknown as Record<string, unknown>)[k]) return false;
  const g = mesh.geometry;
  const pos = g.getAttribute('position');
  if (!pos || pos.itemSize !== 3 || !g.getAttribute('normal')) return false;
  if (g.morphAttributes.position || g.getAttribute('tangent') || g.groups.length) return false;
  if ((m.map || m.normalMap) && !g.getAttribute('uv')) return false;
  if (m.vertexColors && !g.getAttribute('color')) return false;
  if (m.map && m.map.channel !== 0) return false;
  if (m.normalMap && m.normalMap.channel !== 0) return false;
  const n = g.index ? g.index.count : pos.count;
  if (g.drawRange.start !== 0 || g.drawRange.count < n) return false;
  return true;
}

export interface WorldMergeStats {
  groups: number;
  pieces: number;
  /** Pieces whose own draw the last render skipped. */
  skipped: number;
  rebuilds: number;
  /** Time spent in the last rebuild, ms. */
  buildMs: number;
  /** Why pieces left their groups, by reason (debug). */
  why: Record<string, number>;
}

/**
 * The renderer hooks, installed once per renderer (stages come and go; their merges register
 * and leave): the merge whose scene is being drawn sees each draw first.
 */
interface Hooks {
  on: boolean;
  merges: WorldMerge[];
}
const HOOKS = new WeakMap<THREE.WebGLRenderer, Hooks>();

function hooksFor(renderer: THREE.WebGLRenderer): Hooks {
  const had = HOOKS.get(renderer);
  if (had) return had;
  const h: Hooks = { on: true, merges: [] };
  HOOKS.set(renderer, h);
  let current: WorldMerge | null = null;
  const render = renderer.render.bind(renderer);
  renderer.render = (s, camera) => {
    const m = h.on && !current ? h.merges.find((x) => x.target === s) : undefined;
    if (!m) return render(s, camera);
    m.begin(camera);
    current = m;
    try {
      render(s, camera);
    } finally {
      current = null;
      m.end();
    }
  };
  const direct = renderer.renderBufferDirect.bind(renderer);
  renderer.renderBufferDirect = (cam, s, geometry, material, object, group) => {
    if (current && !current.draws(material, object)) return;
    direct(cam, s, geometry, material, object, group);
  };
  return h;
}

export class WorldMerge {
  readonly stats: WorldMergeStats = {
    groups: 0,
    pieces: 0,
    skipped: 0,
    rebuilds: 0,
    buildMs: 0,
    why: {},
  };
  private on = true;
  private readonly groups = new Map<string, Group>();
  private readonly pieceOf = new Map<THREE.Mesh, Group>();
  private readonly pending = new Map<THREE.Mesh, { matrix: THREE.Matrix4; stamp: Float64Array }>();
  private readonly moved = new WeakMap<THREE.Mesh, number>();
  private readonly dynamic = new WeakSet<THREE.Mesh>();
  /** Group keys whose program the merge cannot patch (`mergeable`). */
  private readonly failed = new Set<string>();
  /** Pieces drawn by a merged mesh in the render under way. */
  private readonly skip = new Set<THREE.Object3D>();
  private readonly merged = new Map<THREE.Object3D, Group>();
  private camera: THREE.Camera | null = null;
  private due = false;
  private readonly hooks: Hooks;
  private nextSweep = 0;
  private lastBuild = -Infinity;
  private readonly frustum = new THREE.Frustum();
  private readonly projView = new THREE.Matrix4();
  private readonly invRoot = new THREE.Matrix4();
  private readonly baseUniforms: Set<string>;
  private readonly snaps = new WeakMap<THREE.Material, Float64Array[]>();
  /** Snapshots checked this render, and the answer. */
  private readonly seen = new Map<Float64Array, boolean>();
  /** Texture sets one merged program may sample: two samplers each, four kept for the rest. */
  private readonly maxSets: number;
  /** One piece's data texture column, as float32. */
  private readonly row = new Float32Array(ROWS * 4);

  constructor(
    private readonly root: THREE.Object3D,
    private readonly scene: THREE.Object3D,
    private readonly renderer: THREE.WebGLRenderer,
    /** Subtrees never merged (they move or are rebuilt all the time). */
    private readonly exclude: (o: THREE.Object3D) => boolean = () => false,
    private readonly now: () => number = () => performance.now(),
  ) {
    // A standard material runs three's physical program (and its uniforms), plus clipping.
    this.baseUniforms = new Set([
      ...Object.keys(THREE.ShaderLib.physical.uniforms),
      'clippingPlanes',
    ]);
    const units =
      (renderer.capabilities as { maxTextures?: number } | undefined)?.maxTextures ?? 16;
    this.maxSets = Math.max(1, Math.min(WORLD_MERGE.maxSets, Math.floor((units - 4) / 2)));
    this.hooks = hooksFor(renderer);
    this.hooks.merges.push(this);
    this.on = this.hooks.on;
  }

  /** Every merge on `renderer` (the Grove's and a live stage's): debug and tests. */
  static of(renderer: THREE.WebGLRenderer): readonly WorldMerge[] {
    return HOOKS.get(renderer)?.merges ?? [];
  }

  get enabled(): boolean {
    return this.hooks.on;
  }

  /**
   * The kill switch, shared by every merge on this renderer (the Grove's and a race's or run's
   * stage): off, every piece draws itself and the merged meshes hide.
   */
  set enabled(v: boolean) {
    this.hooks.on = v;
    for (const m of this.hooks.merges) m.setOn(v);
  }

  private setOn(v: boolean): void {
    if (v === this.on) return;
    this.on = v;
    for (const g of this.groups.values()) if (g.mesh) g.mesh.visible = v;
    this.skip.clear();
  }

  /** Called by the renderer hook when this merge's scene starts a render. */
  begin(camera: THREE.Camera): void {
    this.sweepIfDue();
    this.camera = camera;
    this.due = true;
  }

  /** Called by the renderer hook for each draw of this merge's render: false skips it. */
  draws(material: THREE.Material, object: THREE.Object3D): boolean {
    if (this.due) this.frame();
    if (material !== (object as THREE.Mesh).material) return true;
    if (this.skip.has(object)) return false;
    const g = this.merged.get(object);
    return !g || g.any;
  }

  /** Called when the render is over. */
  end(): void {
    this.due = false;
    this.skip.clear();
  }

  /** The scene this merge serves. */
  get target(): THREE.Object3D {
    return this.scene;
  }

  /** Look for pieces and check members now (tests; the renderer does it once a sweep). */
  sweepNow(): void {
    this.nextSweep = 0;
    this.lastBuild = -Infinity;
    this.sweepIfDue();
  }

  dispose(): void {
    const i = this.hooks.merges.indexOf(this);
    if (i >= 0) this.hooks.merges.splice(i, 1);
    for (const g of this.groups.values()) this.drop(g);
    this.groups.clear();
    this.pieceOf.clear();
    this.pending.clear();
    this.merged.clear();
  }

  private sweepIfDue(): void {
    const now = this.now();
    if (now < this.nextSweep) return;
    this.nextSweep = now + WORLD_MERGE.sweepMs;
    this.sweep();
    if (now - this.lastBuild < WORLD_MERGE.rebuildMs) return;
    let built = false;
    for (const g of this.groups.values()) {
      if (!g.dirty) continue;
      this.build(g);
      built = true;
    }
    if (built) this.lastBuild = now;
    let n = 0;
    for (const g of this.groups.values()) n += g.mesh ? g.pieces.length : 0;
    this.stats.pieces = n;
    this.stats.groups = [...this.groups.values()].filter((g) => g.mesh).length;
  }

  private sweep(): void {
    // Members that changed (or left) go; a mover may come back after it holds still.
    for (const [mesh, g] of this.pieceOf) {
      let i = g.pieces.length - 1;
      while (i > 0 && g.pieces[i]!.mesh !== mesh) i--;
      const p = g.pieces[i]!;
      // Hidden but otherwise unchanged stays merged (the mask hides it).
      if (this.valid(p) && this.attached(mesh)) continue;
      // A material relinked or touched without changing anything the merge bakes in (same
      // program, same numbers, same textures) keeps its place: no rebuild.
      if (this.attached(mesh) && this.refresh(p, g, i)) continue;
      this.why(p);
      this.remove(mesh, g);
      this.moveOrDrop(mesh);
    }
    for (const [mesh, was] of this.pending) {
      this.pending.delete(mesh);
      if (!shownUnder(mesh, this.root) || !mergeCandidate(mesh)) continue;
      const still = sameArr(stampOf(mesh.geometry, stampTmp), was.stamp);
      if (!sameMatrix(mesh.matrixWorld, was.matrix) || !still) {
        this.moveOrDrop(mesh);
        continue;
      }
      this.join(mesh);
    }
    const walk = (o: THREE.Object3D): void => {
      if (!o.visible || this.exclude(o)) return;
      if (mergeCandidate(o) && !this.pieceOf.has(o) && !this.dynamic.has(o) && !this.pending.has(o))
        this.pending.set(o, {
          matrix: o.matrixWorld.clone(),
          stamp: stampOf(o.geometry, new Float64Array(6)),
        });
      for (const c of o.children) walk(c);
    };
    for (const c of this.root.children) walk(c);
  }

  private attached(o: THREE.Object3D): boolean {
    let p: THREE.Object3D | null = o;
    while (p && p !== this.root) p = p.parent;
    return p === this.root;
  }

  private moveOrDrop(mesh: THREE.Mesh): void {
    const n = (this.moved.get(mesh) ?? 0) + 1;
    this.moved.set(mesh, n);
    if (n >= WORLD_MERGE.moves || !this.attached(mesh)) this.dynamic.add(mesh);
  }

  /**
   * A piece that left its group draws itself from now on; its copy stays in the merged mesh,
   * masked, until half the mesh is such leftovers (then it is rebuilt without them), so a story
   * set rebuilt on each visit does not cost a rebuild of everything it shared a mesh with.
   */
  private remove(mesh: THREE.Mesh, g: Group): void {
    this.pieceOf.delete(mesh);
    for (const p of g.pieces) if (p.mesh === mesh) p.live = false;
    if (!g.mesh) {
      g.pieces = g.pieces.filter((p) => p.mesh !== mesh);
      g.dirty = true;
      return;
    }
    g.gone += mesh.geometry.getAttribute('position').count;
    if (g.gone * 2 > g.verts) g.dirty = true;
  }

  /**
   * Group a piece by everything its program and its baked numbers depend on. Its material must
   * have been compiled (its hook uniforms are read from the renderer); otherwise it waits.
   */
  private join(mesh: THREE.Mesh): void {
    const mat = mesh.material as THREE.MeshStandardMaterial;
    const uniforms = this.uniformsOf(mat);
    const key = uniforms && this.keyOf(mesh, uniforms);
    if (!uniforms || !key) return;
    if (this.failed.has(key)) {
      this.dynamic.add(mesh);
      return;
    }
    // The first group of this key with room for the piece's texture set.
    let group: Group | undefined;
    let set = -1;
    for (let k = 0; !group; k++) {
      const gk = `${key}#${k}`;
      let g2 = this.groups.get(gk);
      if (!g2) {
        g2 = {
          key: gk,
          base: key,
          pieces: [],
          sets: [],
          mesh: null,
          tex: null,
          data: new Float32Array(0),
          any: false,
          dirty: true,
          verts: 0,
          built: 0,
          gone: 0,
        };
        this.groups.set(gk, g2);
      }
      // A big merged mesh takes no late pieces (a rebuild of it would be a hitch): they start
      // the next chunk.
      if (g2.mesh && g2.verts > WORLD_MERGE.sealVerts) continue;
      set = g2.sets.findIndex(([a, b]) => a === mat.map && b === mat.normalMap);
      if (set < 0 && g2.sets.length < this.maxSets) {
        g2.sets.push([mat.map, mat.normalMap]);
        set = g2.sets.length - 1;
      }
      if (set >= 0) group = g2;
    }
    group.pieces.push(this.pieceFor(mesh, uniforms, set));
    group.dirty = true;
    this.pieceOf.set(mesh, group);
  }

  private uniformsOf(mat: THREE.Material): Record<string, THREE.IUniform> | undefined {
    return (this.renderer.properties.get(mat) as { uniforms?: Record<string, THREE.IUniform> })
      .uniforms;
  }

  private pieceFor(mesh: THREE.Mesh, uniforms: Record<string, THREE.IUniform>, set: number): Piece {
    const mat = mesh.material as THREE.MeshStandardMaterial;
    const g = mesh.geometry;
    if (!g.boundingSphere) g.computeBoundingSphere();
    return {
      mesh,
      mat,
      ver: mat.version,
      matrix: mesh.matrixWorld.clone(),
      geo: g,
      stamp: stampOf(g, new Float64Array(6)),
      snap: this.intern(mat, snapOf(mesh, mat, new Float64Array(SNAP))),
      ground: uniforms.uOccIsGround ?? null,
      floats: PER_PIECE_FLOATS.map(([n]) => uniforms[n] ?? null),
      hooks: optionalHooks(mat),
      sphere: g.boundingSphere!.clone().applyMatrix4(mesh.matrixWorld),
      set,
      live: true,
    };
  }

  /** One snapshot array per material and state, shared by its pieces (`valid` checks it once). */
  private intern(mat: THREE.Material, snap: Float64Array): Float64Array {
    let list = this.snaps.get(mat);
    if (!list) this.snaps.set(mat, (list = []));
    const had = list.find((x) => sameArr(x, snap));
    if (had) return had;
    list.push(snap);
    if (list.length > 8) list.shift();
    return snap;
  }

  /** Same mesh, place, geometry, key and textures as when merged: take its new state in place. */
  private refresh(p: Piece, g: Group, i: number): boolean {
    const mesh = p.mesh;
    if (mesh.material !== p.mat || mesh.geometry !== p.geo) return false;
    if (!sameMatrix(mesh.matrixWorld, p.matrix)) return false;
    if (!sameArr(stampOf(p.geo, stampTmp), p.stamp)) return false;
    const set = g.sets[p.set];
    if (!set || set[0] !== p.mat.map || set[1] !== p.mat.normalMap) return false;
    const uniforms = this.uniformsOf(p.mat);
    if (!uniforms || this.keyOf(mesh, uniforms) !== g.base) return false;
    g.pieces[i] = this.pieceFor(mesh, uniforms, p.set);
    return true;
  }

  /** Why a piece left its group (debug: `stats.why`). */
  private why(p: Piece): void {
    const mesh = p.mesh;
    const r = !this.attached(mesh)
      ? 'left'
      : mesh.material !== p.mat
        ? 'material'
        : mesh.geometry !== p.geo || !sameArr(stampOf(p.geo, stampTmp), p.stamp)
          ? 'geometry'
          : !sameMatrix(mesh.matrixWorld, p.matrix)
            ? 'moved'
            : 'program';
    this.stats.why[r] = (this.stats.why[r] ?? 0) + 1;
  }

  /**
   * Everything the piece's program and its baked numbers depend on (texture ids aside: those
   * are its texture set), or null when it cannot merge.
   */
  private keyOf(mesh: THREE.Mesh, uniforms: Record<string, THREE.IUniform>): string | null {
    const mat = mesh.material as THREE.MeshStandardMaterial;
    const g = mesh.geometry;
    const tx = (t: THREE.Texture | null): string => {
      if (!t) return '-';
      if (t.matrixAutoUpdate) t.updateMatrix();
      return t.matrix.elements.join(',');
    };
    const hooks: string[] = [];
    for (const name of Object.keys(uniforms).sort()) {
      if (this.baseUniforms.has(name) || PER_PIECE.has(name)) continue;
      // The same uniform object, not just the same value: a per-material one (a crown's fade)
      // keeps its pieces apart.
      hooks.push(`${name}#${idOf(uniforms[name]!)}`);
    }
    snapOf(mesh, mat, snapTmp);
    // Texture ids leave the key: they become the piece's texture set.
    // Vertex colours (index 19) leave the key too: pieces without them read white.
    const snap =
      Array.from(snapTmp.subarray(0, 19)).join(',') + Array.from(snapTmp.subarray(25)).join(',');
    return [
      programBase(mat),
      snap,
      mesh.receiveShadow,
      mesh.renderOrder,
      attrsKey(g),
      !!mat.map,
      !!mat.normalMap,
      tx(mat.map),
      tx(mat.normalMap),
      mat.normalMapType,
      JSON.stringify(mat.defines ?? {}),
      hooks.join('&'),
    ].join('|');
  }

  /** Whether the piece is as it was merged (not whether it shows). */
  private valid(p: Piece): boolean {
    const mesh = p.mesh;
    if (mesh.material !== p.mat || p.mat.version !== p.ver) return false;
    if (mesh.geometry !== p.geo || !sameMatrix(mesh.matrixWorld, p.matrix)) return false;
    if (!sameArr(stampOf(p.geo, stampTmp), p.stamp)) return false;
    const s = p.snap;
    if (+mesh.receiveShadow !== s[22] || mesh.renderOrder !== s[23] || mesh.layers.mask !== s[24])
      return false;
    // The material's numbers once a render for all its pieces (they share one snapshot array
    // when they joined with the same numbers, see `intern`).
    const seen = this.seen.get(s);
    if (seen !== undefined) return seen;
    const ok = sameArr(snapOf(mesh, p.mat, snapTmp), s);
    this.seen.set(s, ok);
    return ok;
  }

  /** Before the first draw of a render: which pieces the merged meshes draw, and their numbers. */
  private frame(): void {
    this.due = false;
    const cam = this.camera;
    if (!cam || !cam.layers.test(this.root.layers)) return;
    this.frustum.setFromProjectionMatrix(
      this.projView.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse),
      cam.coordinateSystem,
    );
    let skipped = 0;
    for (const g of this.groups.values()) {
      const mesh = g.mesh;
      if (!mesh) continue;
      const d = g.data;
      let changed = false;
      let any = false;
      // Pieces that joined after the build are not in the mesh yet: they draw themselves.
      const w = g.built;
      for (let i = 0; i < w; i++) {
        const p = g.pieces[i]!;
        // Cheapest test first: most pieces are off screen, and then nothing else is asked (a
        // piece that moved into view from where it was merged is not in its old sphere, so it
        // draws itself).
        const shown =
          this.frustum.intersectsSphere(p.sphere) &&
          p.live &&
          shownUnder(p.mesh, this.root) &&
          this.valid(p);
        if (!shown) {
          const at = i * 4 + 3;
          if (d[at] !== 0) {
            d[at] = 0;
            changed = true;
          }
          continue;
        }
        // Only what the merged mesh draws is skipped: a piece three still draws (its own culling
        // rounding the other way) then simply draws itself.
        this.skip.add(p.mesh);
        skipped++;
        any = true;
        const m = p.mat;
        const t = this.row;
        const e = m.emissiveIntensity;
        const flip = m.side === THREE.BackSide ? -1 : 1;
        t[0] = m.color.r;
        t[1] = m.color.g;
        t[2] = m.color.b;
        t[3] = 1;
        t[4] = m.emissive.r * e;
        t[5] = m.emissive.g * e;
        t[6] = m.emissive.b * e;
        t[7] = p.ground ? (p.ground.value as number) : 1;
        t[8] = m.normalScale.x * flip;
        t[9] = m.normalScale.y * flip;
        for (let f = 0; f < 4; f++)
          t[12 + f] = (p.floats[f]?.value as number | undefined) ?? PER_PIECE_FLOATS[f]![1];
        // Written as float32, so compare as float32: an unchanged texture is not re-sent.
        for (let r = 0; r < ROWS; r++)
          for (let c = 0; c < 4; c++) {
            const at = (r * w + i) * 4 + c;
            if (d[at] !== t[r * 4 + c]) {
              d[at] = t[r * 4 + c]!;
              changed = true;
            }
          }
      }
      g.any = any;
      if (changed && g.tex) g.tex.needsUpdate = true;
    }
    this.stats.skipped = skipped;
  }

  private drop(g: Group): void {
    if (!g.mesh) return;
    this.merged.delete(g.mesh);
    g.mesh.removeFromParent();
    g.mesh.geometry.dispose();
    (g.mesh.material as THREE.Material).dispose();
    g.tex?.dispose();
    g.mesh = null;
    g.tex = null;
  }

  /** Merge a group's pieces into one mesh (or drop it when fewer than two are left). */
  private build(g: Group): void {
    const t0 = this.now();
    g.dirty = false;
    this.drop(g);
    // Sets no piece uses any more go (a piece's `set` is renumbered with them).
    const used = g.sets.filter((_, i) => g.pieces.some((p) => p.set === i));
    if (used.length !== g.sets.length) {
      g.pieces = g.pieces.map((p) => ({ ...p, set: used.indexOf(g.sets[p.set]!) }));
      g.sets = used;
    }
    g.pieces = g.pieces.filter((p) => p.live && this.pieceOf.get(p.mesh) === g);
    g.gone = 0;
    const pieces = g.pieces;
    const sets = g.sets;
    // A lone piece gains nothing: it draws itself until another of its kind joins.
    if (pieces.length < 2) return;
    // The representative runs every optional hook any piece has (the others read neutral
    // values); a piece with a hook it lacks waits for a group of its own.
    const best = pieces.reduce((a, b) => (b.hooks.length > a.hooks.length ? b : a));
    const odd = pieces.filter((p) => p.hooks.some((h) => !best.hooks.includes(h)));
    if (odd.length) {
      for (const p of odd) {
        p.live = false;
        this.pieceOf.delete(p.mesh);
        this.dynamic.add(p.mesh);
      }
      g.pieces = pieces.filter((p) => p.live);
      g.dirty = true;
      return;
    }
    // Vertex colours: one coloured piece makes them all coloured (white for the rest), of one
    // layout.
    const coloured = pieces.filter((p) => p.mat.vertexColors);
    const layout = (p: Piece): string => {
      const a = p.mesh.geometry.getAttribute('color') as THREE.BufferAttribute;
      return `${a.itemSize}:${a.array.constructor.name}:${+a.normalized}`;
    };
    if (coloured.some((p) => layout(p) !== layout(coloured[0]!))) {
      this.failed.add(g.base);
      for (const p of pieces) {
        this.pieceOf.delete(p.mesh);
        this.dynamic.add(p.mesh);
      }
      this.groups.delete(g.key);
      return;
    }
    const can = mergeable(best.mat, sets, this.renderer);
    const ns = pieces[0]!.mat.normalScale;
    if (!can || (can === 'colours' && pieces.some((p) => !p.mat.normalScale.equals(ns)))) {
      // Its program cannot carry the per-piece numbers: these pieces draw themselves for good.
      this.failed.add(g.base);
      for (const p of pieces) {
        this.pieceOf.delete(p.mesh);
        this.dynamic.add(p.mesh);
      }
      this.groups.delete(g.key);
      return;
    }
    this.root.updateWorldMatrix(true, false);
    this.invRoot.copy(this.root.matrixWorld).invert();
    const rep = best.mat;
    const { geo, verts } = bakeGeometry(pieces, this.invRoot, coloured[0]);
    const colours = coloured.length > 0;

    const w = pieces.length;
    g.data = new Float32Array(w * ROWS * 4);
    const tex = new THREE.DataTexture(g.data, w, ROWS, THREE.RGBAFormat, THREE.FloatType);
    tex.magFilter = tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;
    g.tex = tex;
    const mat = mergedMaterial(rep, sets, tex, can === 'all', colours);
    // (`mergeable` was asked before any of this: see the top of `build`.)
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = 'world-merge';
    mesh.userData.worldMerge = true;
    mesh.castShadow = false;
    mesh.receiveShadow = pieces[0]!.mesh.receiveShadow;
    mesh.renderOrder = pieces[0]!.mesh.renderOrder;
    mesh.matrixAutoUpdate = false;
    mesh.raycast = noRaycast;
    mesh.visible = this.on;
    this.root.add(mesh);
    mesh.updateMatrixWorld(true);
    g.mesh = mesh;
    g.verts = verts;
    g.built = pieces.length;
    this.merged.set(mesh, g);
    this.stats.rebuilds++;
    this.stats.buildMs = this.now() - t0;
  }
}
