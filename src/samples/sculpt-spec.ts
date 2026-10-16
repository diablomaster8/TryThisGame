import * as THREE from 'three';
import { sculpt, sdf, smin, weldIndex, type Prim, type Sculpt } from './sculpted';
import { resolveRule, ruleRef, ruleSource, type RuleRef } from './sculpt-rules';

/**
 * One surface's sculpt as plain data: the primitives, blend, box and grid resolution, and
 * the colour, shade and fur hooks as named rules (`sculpt-rules.ts`). It can be posted to
 * a worker, stored, and hashed, and `sculptData` turns it back into the same geometry
 * `sculpt` makes from the live spec. Shades run in order; `color` and `fur` are optional.
 */
export type Vec3 = [number, number, number];

export interface PrimData {
  kind: Prim['kind'];
  a: Vec3;
  b?: Vec3;
  r: number;
  r2?: number;
  radii?: Vec3;
  color: string;
  blend?: number;
  glow?: number;
  tag?: string;
}

export interface SculptData {
  prims: PrimData[];
  blend: number;
  min: Vec3;
  max: Vec3;
  res: number;
  ao?: number;
  /** Colour by position and nearest primitive; null falls back to the primitive's colour. */
  color?: RuleRef;
  shades: RuleRef[];
  fur?: RuleRef;
}

/**
 * Bump when the marching, the AO bake or the attribute layout changes in a way the
 * source hash below would not catch (a change in `three`'s MarchingCubes, say).
 */
export const SCULPT_VERSION = 4;

// `+ 0` turns -0 into 0: JSON drops the sign, and a parsed spec must hash like the live one.
const vec = (v: THREE.Vector3): Vec3 => [v.x + 0, v.y + 0, v.z + 0];
const v3 = (a: Vec3): THREE.Vector3 => new THREE.Vector3(a[0], a[1], a[2]);

export function primData(q: Prim): PrimData {
  return {
    kind: q.kind,
    a: vec(q.a),
    ...(q.b ? { b: vec(q.b) } : {}),
    r: q.r,
    ...(q.r2 !== undefined ? { r2: q.r2 } : {}),
    ...(q.radii ? { radii: vec(q.radii) } : {}),
    color: q.color,
    ...(q.blend !== undefined ? { blend: q.blend } : {}),
    ...(q.glow !== undefined ? { glow: q.glow } : {}),
    ...(q.tag !== undefined ? { tag: q.tag } : {}),
  };
}

export function primFromData(d: PrimData): Prim {
  return {
    kind: d.kind,
    a: v3(d.a),
    ...(d.b ? { b: v3(d.b) } : {}),
    r: d.r,
    ...(d.r2 !== undefined ? { r2: d.r2 } : {}),
    ...(d.radii ? { radii: v3(d.radii) } : {}),
    color: d.color,
    ...(d.blend !== undefined ? { blend: d.blend } : {}),
    ...(d.glow !== undefined ? { glow: d.glow } : {}),
    ...(d.tag !== undefined ? { tag: d.tag } : {}),
  };
}

/** The data behind a hook; a hook no rule made cannot travel, so that is an error. */
export function refOf(fn: (...args: never[]) => unknown, what: string): RuleRef {
  const ref = ruleRef(fn);
  if (!ref) throw new Error(`${what} is not a named sculpt rule (see sculpt-rules.ts)`);
  return ref;
}

/** The live `Sculpt` a data spec describes, hooks resolved from the rule registry. */
export function sculptFromData(d: SculptData): Sculpt {
  type Shade = NonNullable<Sculpt['shade']>;
  type ColorRule = (p: THREE.Vector3, q: Prim) => string | null;
  const shades = d.shades.map((s) => resolveRule<Shade>(s));
  const color = d.color ? resolveRule<ColorRule>(d.color) : null;
  return {
    prims: d.prims.map(primFromData),
    blend: d.blend,
    min: v3(d.min),
    max: v3(d.max),
    ...(d.ao !== undefined ? { ao: d.ao } : {}),
    ...(color ? { colorAt: (p: THREE.Vector3, q: Prim) => color(p, q) ?? q.color } : {}),
    ...(shades.length
      ? {
          shade: (p: THREE.Vector3, n: THREE.Vector3, c: THREE.Color, q: Prim) => {
            for (const s of shades) s(p, n, c, q);
          },
        }
      : {}),
    ...(d.fur ? { fur: resolveRule<NonNullable<Sculpt['fur']>>(d.fur) } : {}),
  };
}

/** March a data spec: what the sculpt worker runs, and the page when it has no workers. */
export function sculptData(d: SculptData): THREE.BufferGeometry {
  return sculpt(sculptFromData(d), d.res);
}

/** A sculpted surface as plain arrays: what a worker posts and the cache stores. */
export interface SurfaceArrays {
  attrs: Array<{ name: string; array: Float32Array; itemSize: number }>;
  index: Uint16Array | Uint32Array | null;
}

export function toArrays(geo: THREE.BufferGeometry): SurfaceArrays {
  return {
    attrs: Object.entries(geo.attributes).map(([name, a]) => ({
      name,
      array: a.array as Float32Array,
      itemSize: a.itemSize,
    })),
    index: (geo.index?.array as Uint16Array | Uint32Array | undefined) ?? null,
  };
}

export function fromArrays(s: SurfaceArrays): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  for (const a of s.attrs) geo.setAttribute(a.name, new THREE.BufferAttribute(a.array, a.itemSize));
  if (s.index) geo.setIndex(new THREE.BufferAttribute(s.index, 1));
  return geo;
}

/** The buffers to transfer (not copy) when posting a surface. */
export const transferables = (s: SurfaceArrays): ArrayBuffer[] => [
  ...s.attrs.map((a) => a.array.buffer as ArrayBuffer),
  ...(s.index ? [s.index.buffer as ArrayBuffer] : []),
];

/** The spec as a stable string: key order is fixed by construction, so equal specs match. */
export function serializeSculpt(d: SculptData): string {
  return JSON.stringify(d);
}

export function parseSculpt(json: string): SculptData {
  return JSON.parse(json) as SculptData;
}

/** cyrb53: a fast 53-bit string hash, as 14 hex digits. Not cryptographic; it need not be. */
export function hash53(str: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const n = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  return n.toString(16).padStart(14, '0');
}

/**
 * The sculpt code's version: the constant above plus the source of the functions that
 * march and bake, so a change to them invalidates every cached surface on its own.
 */
let codeVersion: string | null = null;
export function sculptCodeVersion(): string {
  codeVersion ??= `${SCULPT_VERSION}.${hash53(
    [sculpt, sdf, smin, weldIndex, sculptFromData].map((f) => f.toString()).join('\n'),
  )}`;
  return codeVersion;
}

/** Hash of a data spec and the source of every rule it names. */
export function sculptHash(d: SculptData): string {
  const rules = [d.color, d.fur, ...d.shades]
    .filter((r): r is RuleRef => !!r)
    .map((r) => ruleSource(r.rule));
  return hash53(serializeSculpt(d) + '\n' + [...new Set(rules)].join('\n'));
}

/**
 * Where a surface is filed (look, surface index, resolution) and the version it must
 * carry to be used: the spec hash with the code version. A record whose version differs
 * is stale and is rebuilt and overwritten in place.
 */
export function sculptCacheKey(
  look: string,
  index: number,
  d: SculptData,
): { key: string; version: string } {
  return {
    key: `${look}#${index}@${d.res}`,
    version: `${sculptCodeVersion()}:${sculptHash(d)}`,
  };
}
