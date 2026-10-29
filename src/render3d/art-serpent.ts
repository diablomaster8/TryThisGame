import * as THREE from 'three';
import type { CreatureSpec } from '../render/sprites/creature';
import { V, type Prim } from '../samples/sculpted';
import type { PartSpec, SpeciesSpec } from '../samples/species';
import type { Layout } from './art-species';

/**
 * The serpent body plan in 3D (LOOK-05), from the same `serpent` settings the pixel
 * drawer reads (`render/sprites/creature-serpent.ts`). The neck that stands up under the
 * head is sculpted into the torso; the body that lies on the ground is a chain of tapered
 * segments, each its own part, re-hung bone under bone so a yaw on each one bends the
 * whole spine. Locomotion is a travelling wave down that spine on the rig's gait clock,
 * so it speeds up with the ground speed and never slides feet it does not have.
 */

/** Segment radius at the neck, in the format's units (a Nubbin stands about 3.1). */
const R0 = 0.42;
/** The side view's length over its height (LOOK-05 done-when: at least 2.5). */
const LONG = 2.6;
/** Yaw of each spine joint at the walk's peak, and at rest (a slow sway), radians. */
const WAVE_WALK = 0.17;
const WAVE_REST = 0.07;
/** Phase step between neighbouring joints, radians: the wave travels head to tail. */
const WAVE_STEP = 0.6;

export interface SerpentChain {
  /** The plan layout the rest of the builder reads: `body` is the tail end, so tails hang there. */
  layout: Layout;
  /** Spine nodes from the head end (0) to the tail tip, and their radii. */
  nodes: THREE.Vector3[];
  radii: number[];
  rise: number;
}

/** Lay out the spine for a species: a raised neck, then a long body running back along -z. */
export function serpentChain(art: CreatureSpec): SerpentChain {
  const o = art.serpent ?? {};
  const n = Math.max(7, Math.min(10, o.segments ?? 8));
  const taper = o.taper ?? 0.35;
  const rise = Math.max(1, Math.min(n - 3, o.rise ?? 2));
  const radii = Array.from({ length: n }, (_, i) => R0 * (1 - ((1 - taper) * i) / (n - 1)));
  const headY = 0.55 + 0.32 * rise;
  const height = headY + 0.55;
  // Spread the lying segments so the whole figure is LONG times its height from the side.
  const sp = Math.max(0.42, (LONG * height - 0.95) / (n - 1 - rise));
  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < n; i++) {
    if (i < rise) {
      const u = (rise - i) / rise;
      nodes.push(V(0, radii[rise]! + (headY - 0.35 - radii[rise]!) * Math.pow(u, 0.8), 0.3 * u));
      continue;
    }
    const k = i - rise;
    // A gentle S at rest, so the body lies like a snake and not a plank.
    nodes.push(V(Math.sin(k * 0.9) * 0.22, radii[i]!, -k * sp));
  }
  const tip = nodes[n - 1]!;
  const rt = radii[n - 1]!;
  return {
    nodes,
    radii,
    rise,
    layout: {
      // The tail-end "body": `tail()` and the fish tail hang at -r.z * 0.85 from here.
      body: { y: rt + 0.05, r: V(rt * 1.2, rt, Math.abs(tip.z) / 0.85) },
      head: { y: headY, z: 0.35, r: V(0.55, 0.5, 0.6) },
      hipY: radii[rise]!,
      legLen: 0,
    },
  };
}

const cone = (a: THREE.Vector3, b: THREE.Vector3, r: number, r2: number, c: string): Prim => ({
  kind: 'cone',
  a,
  b,
  r,
  r2,
  color: c,
});
const sphere = (a: THREE.Vector3, r: number, c: string, blend?: number): Prim => ({
  kind: 'sphere',
  a,
  r,
  color: c,
  ...(blend !== undefined ? { blend } : {}),
});

/** One stretch of the spine, `i` to `i + 1`, with the belly stripe, fin or boulder it carries. */
function segmentPrims(
  ch: SerpentChain,
  i: number,
  art: CreatureSpec,
  c: Record<string, string>,
): Prim[] {
  const o = art.serpent ?? {};
  const a = ch.nodes[i]!;
  const b = ch.nodes[i + 1]!;
  const ra = ch.radii[i]!;
  const rb = ch.radii[i + 1]!;
  if (art.gen1b?.includes('boulders')) {
    // Onix: a rock per segment, big enough to touch its neighbours, blended only a little.
    const r = Math.max(ra, a.distanceTo(b) * 0.55);
    return [sphere(a, r, c.body!, 0.04), sphere(a.clone().lerp(b, 0.5), r * 0.55, c.shade!, 0.04)];
  }
  const out = [cone(a, b, ra, rb, c.body!)];
  if (o.belly) {
    const down = (p: THREE.Vector3, r: number) => p.clone().add(V(0, -r * 0.32, 0));
    out.push(cone(down(a, ra), down(b, rb), ra * 0.76, rb * 0.76, c.belly!));
  }
  if (o.fin && (i === 2 || i === 5))
    out.push(
      cone(
        a.clone().add(V(0, ra * 0.7, 0)),
        a.clone().add(V(0, ra + 0.45, -0.18)),
        0.14,
        0.03,
        c.accent!,
      ),
    );
  return out;
}

/**
 * Rebuild a generated serpent's body as the spine chain. `spec` is what the generic
 * builder made from the recipe with `ch.layout`; its torso blob is replaced, its tail
 * parts ride the last segment and its wings move to the second.
 */
export function serpentSpec(
  spec: SpeciesSpec,
  art: CreatureSpec,
  ch: SerpentChain,
  c: Record<string, string>,
  boxOf: (prims: Prim[]) => [THREE.Vector3, THREE.Vector3],
): SpeciesSpec {
  const { nodes, radii, rise } = ch;
  const h = ch.layout.head;
  // The neck: from the first lying node up to the head's underside.
  const torso: Prim[] = [];
  for (let i = 0; i < rise; i++) torso.push(...segmentPrims(ch, i, art, c));
  torso.push(
    cone(nodes[0]!, V(0, h.y - h.r.y * 0.5, h.z * 0.7), radii[0]!, radii[0]! * 0.9, c.body!),
  );
  const segs: PartSpec[] = [];
  for (let i = rise; i < nodes.length - 1; i++) {
    const prims = segmentPrims(ch, i, art, c);
    segs.push({
      name: `seg${i}`,
      pivot: nodes[i]!.clone(),
      prims,
      box: boxOf(prims),
      resolution: 40,
    });
  }
  const names = segs.map((s) => s.name);
  const last = names[names.length - 1]!;
  const tailNames = spec.parts.filter((p) => p.name.startsWith('tail')).map((p) => p.name);
  const wingAt = nodes[Math.min(rise + 1, nodes.length - 1)]!;
  const hook: NonNullable<SpeciesSpec['extras']> = (rig) => {
    // Re-hang each segment under the one before it, keeping where it is, so yaws add up
    // down the spine; the tail rides the tip.
    for (let k = 1; k < names.length; k++) rig.bones[names[k - 1]!]!.attach(rig.bones[names[k]!]!);
    for (const t of tailNames) if (rig.bones[t]) rig.bones[last]!.attach(rig.bones[t]);
    return (t, pose) => {
      const moving = pose === 'walk' || pose === 'swim' || pose === 'flap';
      const amp = moving ? WAVE_WALK : WAVE_REST;
      const w = moving ? 7.5 : 1.4;
      names.forEach((nm, k) => {
        rig.bones[nm]!.rotation.y = Math.sin(t * w - k * WAVE_STEP) * amp;
      });
      // The biped sleep pitches the hips forward; the lying body stays on the grass and
      // only the neck bows.
      rig.bones[names[0]!]!.rotation.x = -rig.hips.rotation.x;
    };
  };
  const prev = spec.extras;
  return {
    ...spec,
    torso: { prims: torso, box: boxOf(torso) },
    head: { ...spec.head, pivot: V(0, h.y - h.r.y * 0.6, h.z * 0.6) },
    parts: [...spec.parts, ...segs],
    hipY: ch.layout.hipY,
    ...(spec.wings
      ? { wings: { ...spec.wings, y: wingAt.y + radii[rise + 1]! * 0.6, z: wingAt.z } }
      : {}),
    extras: prev
      ? (rig) => {
          const a = prev(rig);
          const b = hook(rig);
          return (t, pose) => {
            if (a) a(t, pose);
            if (b) b(t, pose);
          };
        }
      : hook,
  };
}
