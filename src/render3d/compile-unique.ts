import * as THREE from 'three';

/**
 * HOT-3 (load time): three's `compile` works a program's parameters and cache key out for
 * every mesh it walks, though most of the Grove's thousands of meshes share a material and
 * an attribute layout with one walked already: a whole-scene compile spent most of its
 * second in `getParameters` for programs it had just found. `uniqueStandIns` hands it one
 * stand-in per material and layout instead. A program's parameters read only the material,
 * the geometry's attributes and morphs, and the object's kind (instanced, batched, skinned,
 * points, line, sprite), and every one of those is copied onto the stand-in, so the
 * programs linked are exactly the ones the scene draws with, for a fraction of the CPU.
 *
 * The stand-ins share the real geometry and materials and are never drawn or disposed;
 * lights inside `roots` are left out, as the scene's own lights are the ones a draw uses.
 */

/** The parts of an object a program's parameters read, as a key. */
function layoutKey(o: THREE.Object3D): string {
  const m = o as THREE.InstancedMesh & THREE.SkinnedMesh & THREE.Points & THREE.Line;
  let k = m.isInstancedMesh
    ? `I${m.instanceColor ? 'c' : ''}${m.morphTexture ? 'm' : ''}`
    : m.isSkinnedMesh
      ? 'S'
      : m.isPoints
        ? 'P'
        : m.isLine
          ? 'L'
          : (o as THREE.Sprite).isSprite
            ? 'T'
            : 'M';
  const g = m.geometry as THREE.BufferGeometry | undefined;
  if (g) {
    for (const name in g.attributes) k += `|${name}${g.attributes[name]!.itemSize}`;
    for (const [name, list] of Object.entries(g.morphAttributes))
      k += `|~${name}${(list as unknown[] | undefined)?.length ?? 0}`;
  }
  return k;
}

/** An undrawn object with `o`'s kind, geometry and the one material, or null to use `o`. */
function standIn(o: THREE.Object3D, mat: THREE.Material): THREE.Object3D | null {
  const m = o as THREE.Mesh;
  if ((o as THREE.BatchedMesh).isBatchedMesh) return null;
  if ((o as THREE.InstancedMesh).isInstancedMesh) {
    const src = o as THREE.InstancedMesh;
    const p = new THREE.InstancedMesh(src.geometry, mat, 0);
    p.instanceColor = src.instanceColor;
    p.morphTexture = src.morphTexture;
    return p;
  }
  if ((o as THREE.SkinnedMesh).isSkinnedMesh) return new THREE.SkinnedMesh(m.geometry, mat);
  if ((o as THREE.Points).isPoints) return new THREE.Points(m.geometry, mat);
  if ((o as THREE.Line).isLine) return new THREE.Line(m.geometry, mat);
  if ((o as THREE.Sprite).isSprite) return new THREE.Sprite(mat as THREE.SpriteMaterial);
  return new THREE.Mesh(m.geometry, mat);
}

/**
 * The drawables under `roots`, one per material and layout, in walk order, packed under
 * undrawn groups of at most `per` stand-ins: one `compile` call each, so a caller can spread
 * the packs over several tasks. A batched mesh (rare) is its own entry, compiled as itself.
 */
export function uniqueStandIns(roots: readonly THREE.Object3D[], per = Infinity): THREE.Object3D[] {
  const out: THREE.Object3D[] = [];
  let pack: THREE.Group | null = null;
  const made = new Set<THREE.Object3D>();
  for (const o of standIns(roots, made)) {
    if (!made.has(o)) {
      out.push(o);
      continue;
    }
    if (!pack || pack.children.length >= per) out.push((pack = new THREE.Group()));
    pack.add(o);
  }
  return out;
}

function standIns(roots: readonly THREE.Object3D[], made: Set<THREE.Object3D>): THREE.Object3D[] {
  const seen = new Map<THREE.Material, Set<string>>();
  const out: THREE.Object3D[] = [];
  for (const root of roots)
    root.traverse((o) => {
      const d = o as THREE.Mesh;
      if (!(d.isMesh || (o as THREE.Points).isPoints || (o as THREE.Line).isLine)) {
        if (!(o as THREE.Sprite).isSprite) return;
      }
      const mats = d.material;
      if (!mats) return;
      const key = layoutKey(o);
      for (const mat of Array.isArray(mats) ? mats : [mats]) {
        let keys = seen.get(mat);
        if (!keys) seen.set(mat, (keys = new Set()));
        if (keys.has(key)) continue;
        keys.add(key);
        const p = standIn(o, mat);
        if (p) made.add(p);
        out.push(p ?? o);
      }
    });
  return out;
}
