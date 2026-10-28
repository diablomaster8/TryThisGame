import {
  BufferAttribute,
  BufferGeometry,
  Path,
  RepeatWrapping,
  Shape,
  ShapeGeometry,
  type CanvasTexture,
} from 'three';
import { GROVE } from '../../config/tuning';
import { TERRACE } from '../../config/tuning-sim';
import { hillHeight, type Terrace } from '../../sim/terrain';
import { fbm, ridged, warped } from './noise';
import { hex, mix, Raster, shade } from './raster';
import { pondRadius } from './shore';

/**
 * Painted terrain: a cliff-face tile for the hill terraces (strata, cracks, moss, a
 * lit lip), a grass tile for their tops, a scrolling waterfall tile, and terrace
 * geometry whose outline wanders with noise instead of being a perfect circle.
 */
export function paintCliffTexture(): CanvasTexture {
  const w = 96;
  const h = 48;
  const r = new Raster(w, h, hex('#4a4150'));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Strata: bands that undulate; cracks from ridged noise; a lit lip at the top.
      const band = fbm(x / 40, y / 5 + fbm(x / 20, 0, 2, 61) * 2, 3, 62);
      const rockN = ridged(x / 11, y / 11, 4, 63);
      let c = mix(hex('#5a5066'), hex('#b4a8bc'), band * 0.55 + rockN * 0.45);
      const crack = ridged(x / 6, y / 9, 3, 64);
      if (crack > 0.82) c = shade(c, 0.55);
      if (y < 4) c = mix(c, hex('#b9a8c0'), ((4 - y) / 4) * 0.6);
      if (y > h - 10 && fbm(x / 7, y / 7, 2, 65) > 0.55)
        c = mix(c, hex('#4f8a3a'), ((y - (h - 10)) / 10) * 0.8);
      if (fbm(x / 5, y / 5, 2, 66) > 0.74 && y < h - 8) c = mix(c, hex('#6a7a5a'), 0.35);
      r.set(x, y, c);
    }
  }
  const tex = r.toTexture(true);
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  return tex;
}

export function paintGrassTopTexture(): CanvasTexture {
  const s = 128;
  const r = new Raster(s, s, hex('#5f9e3c'));
  const grassA = hex('#4d9440');
  const grassB = hex('#8fcf62');
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      // Sampled on a torus so the tile wraps.
      const ax = Math.cos((x / s) * Math.PI * 2) * 2;
      const ay = Math.sin((x / s) * Math.PI * 2) * 2;
      const bx = Math.cos((y / s) * Math.PI * 2) * 2;
      const by = Math.sin((y / s) * Math.PI * 2) * 2;
      const n = fbm(ax + bx + 10, ay + by + 10, 4, 71);
      const fine = fbm(x / 9, y / 9, 2, 72);
      let c = mix(grassA, grassB, Math.max(0, Math.min(1, (n - 0.3) * 1.8)));
      c = shade(c, 0.86 + fine * 0.3);
      r.set(x, y, c);
    }
  }
  for (let i = 0; i < 1400; i++) {
    const x = Math.floor(Math.abs(Math.sin(i * 12.9898) * 43758.5453) % s);
    const y = Math.floor(Math.abs(Math.sin(i * 78.233) * 12345.678) % s);
    const base = r.get(x, y);
    r.line(x, y, x, y - 2, shade(base, 1.22), 0.9);
  }
  const tex = r.toTexture(true);
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  return tex;
}

export function paintWaterfallTexture(): CanvasTexture {
  const w = 48;
  const h = 96;
  const r = new Raster(w, h, hex('#3f8fe0'));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Vertical streaks, sampled so the tile wraps top to bottom.
      const ty = (y / h) * Math.PI * 2;
      const streak = fbm(x / 4, Math.sin(ty) * 3 + Math.cos(ty) * 3, 3, 81);
      const flow = fbm(x / 9 + Math.cos(ty) * 1.5, Math.sin(ty) * 1.5 + 5, 2, 82);
      let c = mix(hex('#2b6fc2'), hex('#7fc0e8'), flow);
      if (streak > 0.5) c = mix(c, hex('#f4fbff'), Math.min(1, (streak - 0.5) * 3.5));
      if (streak < 0.42) c = shade(c, 0.6);
      r.set(x, y, c);
    }
  }
  const tex = r.toTexture(true);
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  return tex;
}

/** The terrace outline's radius at an angle: a noise wobble around the circle. */
export function terraceRadius(r: number, angle: number, salt: number): number {
  const n = warped(Math.cos(angle) * 1.5 + salt, Math.sin(angle) * 1.5 + salt, 0.4, 90 + salt);
  return r * (1 + 0.16 * (n - 0.5) * 2);
}

/**
 * The side wall of a terrace: a ring with UVs for the cliff tile. Its foot stands on the
 * sim's rim (MOVE-09) and it leans in to its top over the cliff's eased edge, so figures
 * stand on the drawn shelves; `wobble` lets other rings wander round the circle.
 */
export function terraceSide(
  r: number,
  height: number,
  salt: number,
  segments = 40,
  wobble = false,
): BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  const repeat = Math.max(2, Math.round((2 * Math.PI * r) / 3));
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const rb = wobble ? terraceRadius(r, a, salt) : r;
    const rt = wobble ? rb * 0.94 : r - TERRACE.edge / 2;
    const cx = Math.cos(a);
    const cz = Math.sin(a);
    positions.push(cx * rt, height, cz * rt, cx * rb, 0, cz * rb);
    normals.push(cx, 0.2, cz, cx, 0.2, cz);
    uvs.push((i / segments) * repeat, 1, (i / segments) * repeat, 0);
  }
  for (let i = 0; i < segments; i++) {
    const t = i * 2;
    indices.push(t, t + 1, t + 2, t + 1, t + 3, t + 2);
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  geo.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
  geo.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
  geo.setIndex(indices);
  return geo;
}

/** The grass top of a terrace, following the same wandering outline. */
export function terraceTop(r: number, salt: number, segments = 40, wobble = false): ShapeGeometry {
  const shape = new Shape();
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const rr = wobble ? terraceRadius(r, a, salt) * 0.94 : r - TERRACE.edge / 2;
    if (i === 0) shape.moveTo(Math.cos(a) * rr, -Math.sin(a) * rr);
    else shape.lineTo(Math.cos(a) * rr, -Math.sin(a) * rr);
  }
  shape.closePath();
  const geo = new ShapeGeometry(shape, 1);
  const pos = geo.getAttribute('position');
  const uv = geo.getAttribute('uv');
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / 4, pos.getY(i) / 4);
  uv.needsUpdate = true;
  return geo;
}

/**
 * One leg of a hill's ramp (MOVE-09) as a sheet in the hill's own frame: the band and its
 * banks, sampled on the sim's hard ground so Pixel feet stand on it, a hair proud of the
 * shelf below so the shelf never shows through.
 */
export function rampGeometry(t: Terrace, leg: number): BufferGeometry {
  const l = t.ramp[leg]!;
  const bankEnd = Math.min(l.rOut + TERRACE.rampBank, l.rim);
  const fade = TERRACE.rampBank / ((l.rIn + l.rOut) / 2);
  const span = l.a1 - l.a0 + fade;
  const along = Math.max(8, Math.ceil((span * (l.rIn + l.rOut)) / 2 / 0.35));
  const across = Math.max(2, Math.ceil((bankEnd - l.rIn) / 0.3));
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= along; i++) {
    const a = l.a0 + (span * i) / along;
    for (let j = 0; j <= across; j++) {
      const d = l.rIn + 0.02 + ((bankEnd - 0.02 - l.rIn - 0.02) * j) / across;
      const x = Math.cos(a) * d;
      const z = Math.sin(a) * d;
      positions.push(x, hillHeight(t.x + x, t.z + z, false) + 0.015, z);
      uvs.push(x / 4, z / 4);
    }
  }
  const row = across + 1;
  for (let i = 0; i < along; i++)
    for (let j = 0; j < across; j++) {
      const p = i * row + j;
      indices.push(p, p + 1, p + row, p + 1, p + row + 1, p + row);
    }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  geo.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/** A pool outline for the splash pool, wandering too. */
export function poolShape(r: number, salt: number, segments = 24): ShapeGeometry {
  const shape = new Shape();
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const rr = terraceRadius(r, a, salt);
    if (i === 0) shape.moveTo(Math.cos(a) * rr, -Math.sin(a) * rr);
    else shape.lineTo(Math.cos(a) * rr, -Math.sin(a) * rr);
  }
  shape.closePath();
  void Path;
  return new ShapeGeometry(shape, 1);
}

/** The pond ice texture covers the pond's box, this many units wider than the pond's radius. */
export const ICE_MARGIN = 2;

/**
 * C7: the pond's winter skin, painted once (static, so reduced motion needs no other form):
 * a pale blue-white sheet, a little deeper in the middle where the water is, white crack
 * lines with a few blue hairlines under them, and a rime of white flecks along the shore.
 * The texture covers the box `pond.r + ICE_MARGIN` either side of the pond's centre, with
 * the same noise shoreline as the water, so it fits the bank it freezes against.
 */
export function paintPondIce(size = 192): CanvasTexture {
  const R = GROVE.pond.r + ICE_MARGIN;
  const r = new Raster(size, size, hex('#d6e9f5'));
  const deep = hex('#a9cde6');
  const pale = hex('#e8f4fb');
  const white = hex('#ffffff');
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const wx = (x / size - 0.5) * 2 * R;
      const wz = (y / size - 0.5) * 2 * R;
      const shore = pondRadius(Math.atan2(wz, wx));
      const d = Math.hypot(wx, wz) / shore;
      const n = fbm(x / 22, y / 22, 3, 301);
      // Thicker, bluer ice towards the middle; milky and thin at the edge.
      let c = mix(pale, deep, Math.max(0, Math.min(1, (1 - d) * 0.9 + (n - 0.5) * 0.5)));
      // Cracks: ridged noise, thin lines, a hairline of shade beside each.
      const crack = ridged(x / 17, y / 17, 3, 302);
      if (crack > 0.9) c = white;
      else if (crack > 0.865) c = mix(c, hex('#7fa6c6'), 0.75);
      // Frozen bubbles and scuffs.
      if (fbm(x / 3, y / 3, 2, 303) > 0.78) c = mix(c, white, 0.5);
      // The rime along the shore.
      if (d > 0.84) {
        const fleck = fbm(x / 2.2, y / 2.2, 2, 304);
        c = mix(c, white, Math.min(1, (d - 0.84) * 5 + (fleck > 0.55 ? 0.35 : 0)));
      }
      r.set(x, y, c);
    }
  }
  const tex = r.toTexture(true);
  return tex;
}

/** A tileable sheet of stream ice: pale blue, a few cracks and frozen bubbles. */
export function paintStreamIce(size = 64): CanvasTexture {
  const r = new Raster(size, size, hex('#d3e7f3'));
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      // Sampled on a torus so the tile wraps.
      const a = (x / size) * Math.PI * 2;
      const b = (y / size) * Math.PI * 2;
      const n = fbm(
        Math.cos(a) * 2 + Math.cos(b) * 2 + 5,
        Math.sin(a) * 2 + Math.sin(b) * 2 + 5,
        3,
        311,
      );
      let c = mix(hex('#e6f3fb'), hex('#a9cde6'), n);
      if (
        ridged(Math.cos(a) * 3 + Math.cos(b) * 3, Math.sin(a) * 3 + Math.sin(b) * 3, 2, 312) > 0.9
      )
        c = hex('#ffffff');
      r.set(x, y, c);
    }
  const tex = r.toTexture(true);
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  return tex;
}
