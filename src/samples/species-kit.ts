import * as THREE from 'three';
import type { Prim } from './sculpted';

/**
 * Builders that stamp groups of primitives from one line, so a species spec stays short:
 * `digits` for toes, fingers and paw pads, `tuft` and `tuftRow` for sculpted fur clumps.
 * They return plain `Prim[]` to spread into a part's `prims`; nothing here is special to
 * the builder, so a hand-written primitive and a stamped one mix freely.
 */

export interface DigitsOpts {
  /** How many toes or fingers. */
  count: number;
  /** Width the digits fan across, in body units, measured at their tips. */
  spread: number;
  /** Length of each digit from `at` to its tip. */
  length: number;
  /** Radius of each digit. */
  r: number;
  color: string;
  /** Body-space direction the digits point; the sideways axis is worked out from it. */
  dir?: THREE.Vector3;
  /** `toes` stand apart, `fingers` are longer and thinner, `mitt` fuse into a rounded paw. */
  style?: 'toes' | 'fingers' | 'mitt';
  /** A paw pad under the digits: its colour and radius. */
  pad?: { color: string; r: number };
  /** Emissive strength of the digits, for a spirit whose fingertips glow. */
  glow?: number;
  tag?: string;
}

const UP = new THREE.Vector3(0, 1, 0);

/**
 * Digits fanned out from a wrist or ankle `at`. Each is a capsule with a tight blend so
 * the grooves between them stay crisp while the root stays soft; `mitt` uses a wide blend
 * so the digits read as one rounded paw with notches at the tips. The pad is a flat
 * ellipsoid on the underside, in its own colour.
 */
export function digits(at: THREE.Vector3, o: DigitsOpts): Prim[] {
  const dir = (o.dir ?? new THREE.Vector3(0, 0, 1)).clone().normalize();
  const side = new THREE.Vector3().crossVectors(UP, dir);
  if (side.lengthSq() < 1e-6) side.set(1, 0, 0);
  side.normalize();
  const style = o.style ?? 'toes';
  const blend = style === 'mitt' ? 0.14 : 0.04;
  const length = style === 'fingers' ? o.length * 1.25 : o.length;
  const r = style === 'fingers' ? o.r * 0.8 : o.r;
  const tag = o.tag ?? 'digit';
  const out: Prim[] = [];
  for (let i = 0; i < o.count; i++) {
    const k = o.count === 1 ? 0 : i / (o.count - 1) - 0.5;
    const tip = at
      .clone()
      .addScaledVector(dir, length * (1 - Math.abs(k) * 0.35))
      .addScaledVector(side, k * o.spread);
    const root = at.clone().addScaledVector(side, k * o.spread * 0.35);
    out.push({
      kind: 'capsule',
      a: root,
      b: tip,
      r,
      color: o.color,
      tag,
      blend,
      ...(o.glow ? { glow: o.glow } : {}),
    });
  }
  if (o.pad) {
    // The pad sits on the underside, under the digits' roots, so it shows from below and
    // from the side as a darker sole.
    const c = at
      .clone()
      .addScaledVector(dir, length * 0.1)
      .addScaledVector(UP, -r * 0.55);
    out.push({
      kind: 'ellipsoid',
      a: c,
      radii: new THREE.Vector3(Math.max(o.pad.r, o.spread * 0.4), o.pad.r * 0.45, o.pad.r * 1.15),
      r: 0,
      color: o.pad.color,
      tag: 'pad',
      blend: 0.05,
    });
  }
  return out;
}

/**
 * One fur clump: a short cone from `at` along `dir`, wide at the root and pointed at the
 * tip. The tight blend keeps its point crisp against the body so it reads on the outline.
 */
export function tuft(
  at: THREE.Vector3,
  dir: THREE.Vector3,
  len: number,
  r: number,
  color: string,
  tag = 'tuft',
): Prim {
  return {
    kind: 'cone',
    a: at.clone(),
    b: at.clone().addScaledVector(dir.clone().normalize(), len),
    r,
    r2: r * 0.12,
    color,
    tag,
    blend: 0.07,
  };
}

/**
 * A row of clumps from `from` to `to`, `n` of them, each leaning along `dir`; the clumps
 * taper in size toward `to` by `taper` (1 keeps them equal) so a ruff or a tail tip
 * thins out instead of ending in a wall.
 */
export function tuftRow(
  from: THREE.Vector3,
  to: THREE.Vector3,
  n: number,
  dir: THREE.Vector3,
  len: number,
  r: number,
  color: string,
  taper = 1,
  tag = 'tuft',
): Prim[] {
  const out: Prim[] = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const s = 1 + (taper - 1) * t;
    out.push(tuft(from.clone().lerp(to, t), dir, len * s, r * s, color, tag));
  }
  return out;
}
