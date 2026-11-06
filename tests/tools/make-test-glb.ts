/**
 * R0439 (LOOK-71): writes `tests/fixtures/test-figure.glb`, the tiny glTF binary the model
 * path is proved with: a yellow body, a head node named `head` and two arm nodes, vertex
 * colours, no textures. Run: `npx tsx tests/tools/make-test-glb.ts`.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

interface Part {
  name: string;
  r: number;
  at: [number, number, number];
  colour: [number, number, number];
}

const PARTS: Part[] = [
  { name: 'body', r: 0.45, at: [0, 0.45, 0], colour: [0.98, 0.84, 0.2] },
  { name: 'head', r: 0.36, at: [0, 1.12, 0], colour: [1, 0.9, 0.3] },
  { name: 'armL', r: 0.12, at: [0.46, 0.62, 0], colour: [0.95, 0.75, 0.15] },
  { name: 'armR', r: 0.12, at: [-0.46, 0.62, 0], colour: [0.95, 0.75, 0.15] },
];

/** A low UV sphere at the origin: positions, normals, colours and indices. */
function sphere(r: number, c: [number, number, number], seg = 10, rings = 7) {
  const pos: number[] = [];
  const nor: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  for (let y = 0; y <= rings; y++) {
    const v = y / rings;
    const th = v * Math.PI;
    for (let x = 0; x <= seg; x++) {
      const ph = (x / seg) * Math.PI * 2;
      const nx = Math.sin(th) * Math.cos(ph);
      const ny = Math.cos(th);
      const nz = Math.sin(th) * Math.sin(ph);
      pos.push(nx * r, ny * r, nz * r);
      nor.push(nx, ny, nz);
      // A darker band low down, so the turn reads.
      const k = ny < -0.4 ? 0.8 : 1;
      col.push(c[0] * k, c[1] * k, c[2] * k);
    }
  }
  for (let y = 0; y < rings; y++)
    for (let x = 0; x < seg; x++) {
      const a = y * (seg + 1) + x;
      const b = a + seg + 1;
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
  return { pos, nor, col, idx };
}

const bin: Buffer[] = [];
let offset = 0;
const bufferViews: object[] = [];
const accessors: object[] = [];
function add(
  data: Float32Array | Uint16Array,
  target: number,
  type: string,
  count: number,
  bounds = false,
) {
  const buf = Buffer.from(data.buffer);
  const pad = (4 - (buf.length % 4)) % 4;
  bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: buf.length, target });
  bin.push(buf, Buffer.alloc(pad));
  offset += buf.length + pad;
  const acc: Record<string, unknown> = {
    bufferView: bufferViews.length - 1,
    componentType: data instanceof Float32Array ? 5126 : 5123,
    count,
    type,
  };
  if (bounds) {
    // Positions carry their bounds (required by the spec).
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < data.length; i += 3)
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k]!, data[i + k]!);
        max[k] = Math.max(max[k]!, data[i + k]!);
      }
    acc.min = min;
    acc.max = max;
  }
  accessors.push(acc);
  return accessors.length - 1;
}

const meshes: object[] = [];
const nodes: object[] = [];
for (const p of PARTS) {
  const s = sphere(p.r, p.colour);
  const n = s.pos.length / 3;
  const a = add(new Float32Array(s.pos), 34962, 'VEC3', n, true);
  const b = add(new Float32Array(s.nor), 34962, 'VEC3', n);
  const c = add(new Float32Array(s.col), 34962, 'VEC3', n);
  const d = add(new Uint16Array(s.idx), 34963, 'SCALAR', s.idx.length);
  meshes.push({
    name: p.name,
    primitives: [{ attributes: { POSITION: a, NORMAL: b, COLOR_0: c }, indices: d, material: 0 }],
  });
  nodes.push({ name: p.name, mesh: meshes.length - 1, translation: p.at });
}
// The arms and head hang off the body node's parent, a root named for the figure.
nodes.push({ name: 'test-figure', children: PARTS.map((_, i) => i) });

const json = {
  asset: { version: '2.0', generator: 'grove tests/tools/make-test-glb.ts' },
  scene: 0,
  scenes: [{ nodes: [nodes.length - 1] }],
  nodes,
  meshes,
  materials: [
    {
      name: 'figure',
      pbrMetallicRoughness: {
        baseColorFactor: [1, 1, 1, 1],
        roughnessFactor: 1,
        metallicFactor: 0,
      },
    },
  ],
  accessors,
  bufferViews,
  buffers: [{ byteLength: offset }],
};

let jsonBuf = Buffer.from(JSON.stringify(json), 'utf8');
jsonBuf = Buffer.concat([jsonBuf, Buffer.alloc((4 - (jsonBuf.length % 4)) % 4, 0x20)]);
const binBuf = Buffer.concat(bin);
const total = 12 + 8 + jsonBuf.length + 8 + binBuf.length;
const head = Buffer.alloc(12);
head.writeUInt32LE(0x46546c67, 0);
head.writeUInt32LE(2, 4);
head.writeUInt32LE(total, 8);
const jh = Buffer.alloc(8);
jh.writeUInt32LE(jsonBuf.length, 0);
jh.writeUInt32LE(0x4e4f534a, 4);
const bh = Buffer.alloc(8);
bh.writeUInt32LE(binBuf.length, 0);
bh.writeUInt32LE(0x004e4942, 4);
const out = resolve(dirname(fileURLToPath(import.meta.url)), '../fixtures/test-figure.glb');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.concat([head, jh, jsonBuf, bh, binBuf]));
console.log(`wrote ${out} (${total} bytes)`);
