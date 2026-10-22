import { BufferGeometry, CatmullRomCurve3, Float32BufferAttribute, Vector3 } from 'three';

/**
 * C7: the stream freezes with the pond. A flat strip of ice along a river's centre line,
 * `width` across, lying at height `y`, with UVs across 0..1 and along in tile lengths so the
 * painted stream ice repeats down it. Shared by the pixel and 3D dressings (pure geometry).
 */
export function iceRibbon(
  line: ReadonlyArray<{ x: number; z: number }>,
  width: number,
  y: number,
): BufferGeometry {
  const curve = new CatmullRomCurve3(
    line.map((p) => new Vector3(p.x, y, p.z)),
    false,
    'centripetal',
    0.5,
  );
  const n = line.length * 6;
  const across = 4;
  const cols = across + 1;
  const verts: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const p = curve.getPoint(t);
    const d = curve.getTangent(t);
    for (let k = 0; k < cols; k++) {
      const s = (k / across) * 2 - 1;
      verts.push(p.x - d.z * width * 0.5 * s, y, p.z + d.x * width * 0.5 * s);
      uvs.push(k / across, t * n * 0.5);
    }
    if (i < n)
      for (let k = 0; k < across; k++) {
        const a = i * cols + k;
        idx.push(a, a + cols, a + 1, a + 1, a + cols, a + cols + 1);
      }
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(verts, 3));
  geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
