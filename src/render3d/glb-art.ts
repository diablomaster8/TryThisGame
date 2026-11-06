import * as THREE from 'three';
import { toonMaterial, TOON } from '../samples/creatures';
import type { PoseName, Rigged } from '../samples/species';

/**
 * R0439 (LOOK-71): imported licensed 3D art for a species. `art:<id>` looks resolve a glTF
 * binary first: when `public/models/manifest.json` lists the species id, the pool builds the
 * look from `public/models/<id>.glb` (its materials turned into the Grove's toon material)
 * instead of sculpting it; anything else, a missing file or a failed parse falls back to the
 * sculpted look, so a model can be dropped in without code changes and taken out again.
 *
 * The figure plays a clip named after the pose when the file has one (`idle`, `walk`,
 * `happy`, `sleep`...), and otherwise a small procedural motion (breath, walk bob, hop). The
 * look key's colour modifiers (`~egg:`, `~shiny`...) do not repaint a model: its own colours
 * are the art. Nodes named `head`, `armL`, `armR`, `legL` and `legR` become the rig's bones,
 * so hats, the gaze and the photo wave find them. Format note: `docs/sprite-sheets.md`.
 */

export interface GlbArt {
  scene: THREE.Object3D;
  clips: THREE.AnimationClip[];
}

type State = 'pending' | 'none' | GlbArt;

const base = (): string => {
  try {
    return import.meta.env.BASE_URL ?? '/';
  } catch {
    return '/';
  }
};

let listed: Set<string> | null = null;
let listing: Promise<void> | null = null;
const loaded = new Map<string, State>();

/** The species id of an `art:` look key (modifiers dropped), or null for any other look. */
export function glbArtId(key: string): string | null {
  if (!key.startsWith('art:')) return null;
  const id = key.slice(4).split('~')[0] ?? '';
  return id || null;
}

/** For tests and the dev console: say which ids have a model without fetching the manifest. */
export function setGlbManifest(ids: readonly string[] | null): void {
  listed = ids ? new Set(ids) : null;
  listing = ids ? Promise.resolve() : null;
  loaded.clear();
}

/** For tests: hand a parsed model in for an id, as if it had been fetched. */
export function setGlbArt(id: string, art: GlbArt | null): void {
  loaded.set(id, art ?? 'none');
}

function readManifest(): void {
  if (listing) return;
  listing = (async () => {
    try {
      const r = await fetch(`${base()}models/manifest.json`, { cache: 'no-cache' });
      const j = r.ok ? ((await r.json()) as { species?: unknown }) : null;
      const ids = Array.isArray(j?.species) ? j.species.filter((x) => typeof x === 'string') : [];
      listed = new Set(ids as string[]);
    } catch {
      listed = new Set();
    }
  })();
}

/** Parse a .glb (the loader is loaded on first use, so the Grove's chunk does not carry it). */
export async function parseGlb(buf: ArrayBuffer): Promise<GlbArt> {
  const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
  const gltf = await new GLTFLoader().parseAsync(buf, '');
  return { scene: gltf.scene, clips: gltf.animations };
}

function load(id: string): void {
  loaded.set(id, 'pending');
  void (async () => {
    try {
      const r = await fetch(`${base()}models/${encodeURIComponent(id)}.glb`);
      if (!r.ok) throw new Error(`${r.status}`);
      loaded.set(id, await parseGlb(await r.arrayBuffer()));
    } catch (e) {
      console.warn(`[3d] model for ${id} did not load; using the sculpted look`, e);
      loaded.set(id, 'none');
    }
  })();
}

/**
 * Whether a look is built from a model: `none` (sculpt it as always), `pending` (ask again
 * next frame) or the parsed model.
 */
export function glbFor(key: string): State {
  const id = glbArtId(key);
  if (!id) return 'none';
  if (!listed) {
    readManifest();
    return 'pending';
  }
  if (!listed.has(id)) return 'none';
  const s = loaded.get(id);
  if (s === undefined) {
    load(id);
    return 'pending';
  }
  return s;
}

/** A copy of the model with its own geometry and the toon material (pool rigs are freed one by one). */
function copyModel(src: THREE.Object3D): THREE.Object3D {
  const copy = src.clone(true);
  copy.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    m.geometry = m.geometry.clone();
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    const next = mats.map((x) => {
      const s = x as THREE.MeshStandardMaterial;
      const p = new THREE.MeshPhysicalMaterial({
        color: s.color?.clone() ?? new THREE.Color('#ffffff'),
        map: s.map ?? null,
        vertexColors: !!s.vertexColors,
        roughness: 1,
        metalness: 0,
        transparent: false,
        side: s.side,
      });
      return TOON.on ? toonMaterial(p) : p;
    });
    m.material = Array.isArray(m.material) ? next : next[0]!;
  });
  return copy;
}

/** A rig over a model: the pose, the eased turn, the lift and a little procedural motion. */
export function glbRig(art: GlbArt, name: string): Rigged {
  const root = new THREE.Group();
  root.name = name;
  const pivot = new THREE.Group();
  root.add(pivot);
  const model = copyModel(art.scene);
  pivot.add(model);
  const bones: Record<string, THREE.Group> = {};
  model.traverse((o) => {
    if (['head', 'armL', 'armR', 'legL', 'legR'].includes(o.name)) bones[o.name] = o as THREE.Group;
  });
  const rest = new Map<THREE.Object3D, THREE.Euler>();
  for (const b of Object.values(bones)) rest.set(b, b.rotation.clone());
  const mixer = art.clips.length ? new THREE.AnimationMixer(model) : null;
  let action: THREE.AnimationAction | null = null;
  let pose: PoseName = 'idle';
  let last = -1;
  let yawFrom = 0;
  let yawTo = 0;
  let turnAt = -1;
  let now = 0;
  const play = (p: PoseName) => {
    if (!mixer) return;
    const clip = THREE.AnimationClip.findByName(art.clips, p) ?? null;
    const next = clip ? mixer.clipAction(clip) : null;
    if (next === action) return;
    action?.fadeOut(0.2);
    action = next;
    action?.reset().fadeIn(0.2).play();
  };
  play(pose);
  const rig: Rigged = {
    group: root,
    name,
    bones,
    lookAt: null,
    strideLength: 0.6,
    stridePeriod: 0.6,
    setPose: (p) => {
      if (p === pose) return;
      pose = p;
      play(p);
    },
    face: (yaw) => {
      if (turnAt < 0) {
        root.rotation.y = yawFrom = yawTo = yaw;
        turnAt = now;
        return;
      }
      if (Math.abs(Math.atan2(Math.sin(yaw - yawTo), Math.cos(yaw - yawTo))) < 1e-4) return;
      yawFrom = root.rotation.y;
      yawTo = yawFrom + Math.atan2(Math.sin(yaw - yawFrom), Math.cos(yaw - yawFrom));
      turnAt = now;
    },
    animate: (t) => {
      const dt = last < 0 ? 0 : Math.max(0, Math.min(0.1, t - last));
      last = t;
      now = t;
      const k = turnAt < 0 ? 1 : Math.min(1, (t - turnAt) / 0.4);
      root.rotation.y = yawFrom + (yawTo - yawFrom) * (k * k * (3 - 2 * k));
      for (const [b, e] of rest) b.rotation.copy(e);
      pivot.position.set(0, 0, 0);
      pivot.rotation.set(0, 0, 0);
      pivot.scale.set(1, 1, 1);
      if (mixer && action) mixer.update(dt);
      else if (pose === 'walk') {
        pivot.position.y = Math.abs(Math.sin(t * 9)) * 0.06;
        pivot.rotation.z = Math.sin(t * 9) * 0.06 * (rig.waddleScale ?? 1);
      } else if (pose === 'happy' || pose === 'love') {
        pivot.position.y = Math.max(0, Math.sin(t * 7)) * 0.12;
      } else if (pose === 'sleep' || pose === 'sit') {
        pivot.scale.set(1.04, 0.92, 1.04);
        if (pose === 'sleep') pivot.rotation.z = 0.12;
      } else pivot.scale.y = 1 + Math.sin(t * Math.PI * 0.5) * 0.015;
      root.position.y += rig.lift ?? 0;
    },
  };
  return rig;
}
