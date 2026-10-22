import * as THREE from 'three';
import type { SceneStage } from '../config/story';
import type { Daylight } from '../render/daylight';
import { dressItems, itemSignature, type DressItem } from '../render/dress-d-rules';
import type { World } from '../sim/types';
import type { Dress3dCtx, Dressing3d } from './dressings';
import { buildDressItem } from './dress-shapes';
import { Glints, glintBob, type GlintPoint } from './glint-3d';
import { groveHeight } from './terrain';

/**
 * Campaign-graphics package d, Full 3D: props and items (H11, M1, M2, M7, M12, M17, N1, N4).
 * The list of what stands comes from render/dress-d-rules.ts, shared with the pixel view;
 * here each item is a kit-built model (dress-shapes.ts), merged by material, and every
 * glinting item gets one instanced star card (glint-3d.ts). A model is rebuilt only when
 * its signature changes. The Grove's props sit in the home Grove's group, Corvin's in a
 * group of their own shown only in his garden.
 */
interface Shown {
  sig: string;
  group: THREE.Group | null;
  item: DressItem;
}

let ctx: Dress3dCtx | null = null;
let grove: THREE.Group | null = null;
let corvin: THREE.Group | null = null;
let glints: Glints | null = null;
const shown = new Map<string, Shown>();

function disposeGroup(g: THREE.Group): void {
  g.removeFromParent();
  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).geometry.dispose();
  });
}

function floorY(it: DressItem): number {
  return it.place === 'grove' ? groveHeight(it.x, it.z) : 0;
}

export const dress3dD: Dressing3d = {
  id: 'd',
  build(c) {
    ctx = c;
    shown.clear();
    grove = new THREE.Group();
    grove.name = 'dress-d-grove';
    c.world3d.add(grove);
    corvin = new THREE.Group();
    corvin.name = 'dress-d-corvin';
    corvin.visible = false;
    c.scene.add(corvin);
    glints = new Glints();
    c.scene.add(glints.mesh);
  },
  update(world: World, stage: SceneStage, daylight: Daylight) {
    const c = ctx;
    if (!c || !grove || !corvin || !glints) return;
    const still = c.reduceMotion();
    const t = c.time.value;
    corvin.visible = world.location === 'corvin';
    const items = dressItems(world, stage, daylight.darkness);
    const keep = new Set<string>();
    const points: GlintPoint[] = [];
    for (const it of items) {
      keep.add(it.key);
      const sig = `${itemSignature(it)}|${it.x.toFixed(2)},${it.z.toFixed(2)},${it.yaw.toFixed(2)}`;
      let s = shown.get(it.key);
      if (!s || s.sig !== sig) {
        if (s?.group) disposeGroup(s.group);
        const model = buildDressItem(c.tex, it);
        if (model) {
          model.rotation.y = it.yaw;
          (it.place === 'grove' ? grove : corvin).add(model);
          void c.compile(model);
        }
        s = { sig, group: model, item: it };
        shown.set(it.key, s);
      }
      s.item = it;
      const fy = floorY(it);
      if (s.group)
        s.group.position.set(it.x, fy + (it.glint ? glintBob(it.x, it.z, t, still) : 0), it.z);
      if (it.glint) points.push({ x: it.x, y: fy, z: it.z, at: rotated(it) });
    }
    for (const [key, s] of shown) {
      if (keep.has(key)) continue;
      if (s.group) disposeGroup(s.group);
      shown.delete(key);
    }
    glints.set(points, t, still);
  },
  dispose() {
    for (const s of shown.values()) if (s.group) disposeGroup(s.group);
    shown.clear();
    grove?.removeFromParent();
    corvin?.removeFromParent();
    if (glints) {
      glints.mesh.removeFromParent();
      glints.dispose();
    }
    ctx = grove = corvin = null;
    glints = null;
  },
};

/** The glint's offset turned with the item's yaw, so it hangs over the right spot. */
function rotated(it: DressItem): readonly [number, number, number] {
  const [dx, dy, dz] = it.glintAt;
  const c = Math.cos(it.yaw);
  const s = Math.sin(it.yaw);
  return [dx * c + dz * s, dy, -dx * s + dz * c];
}
