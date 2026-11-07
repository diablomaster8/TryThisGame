import * as THREE from 'three';
import { V } from './sculpted';
import { CHILD, variant, type NubbinVariant } from './nubbin-variants';
import { WHITE, cone, devilTail } from './nubbin-lineup-kit';
import { withGemFinish } from './gem-finish';
import type { SpeciesSpec } from './species';

/**
 * R0414 (LOOK-38): the classic three, Angel, Devil and Chaos, as character looks on the child
 * body. They unlock when a Nubbin becomes Eternal (`sim/lifecycle.ts`) and are worn as a hat
 * id like the six in `nubbin-variants-lineup.ts`. An adult wearing one keeps its own form and
 * takes the palette (`render3d/looks.ts`) and the accessory (`render3d/dress.ts`).
 */

const ANGEL_GOLD = '#ffd84a';
const DEVIL_BLACK = '#1f1a26';
const DEVIL_RED = '#d02a32';
const DEVIL_DEEP = '#7a1620';
/** The Chaos body's pale water blue, and its green core. */
export const CHAOS_WATER = '#8ad4ff';
export const CHAOS_GREEN = '#3ee070';

/** A feathered lobe, as the stock feather wing draws it (species.ts), at `size`. */
function featherShape(dx: number, k: number): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(0.7 * dx * k, 0.35 * k, 0.55 * dx * k, 1.05 * k);
  s.quadraticCurveTo(0.35 * dx * k, 0.75 * k, 0.22 * dx * k, 0.95 * k);
  s.quadraticCurveTo(0.08 * dx * k, 0.6 * k, -0.1 * dx * k, 0.55 * k);
  s.quadraticCurveTo(-0.1 * dx * k, 0.2 * k, 0, 0);
  return s;
}

/** The Angel's second, lower pair of wings, plus the halo over the head. */
function angelExtras(rig: Parameters<NonNullable<SpeciesSpec['extras']>>[0]): void {
  for (const dx of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(dx * 0.46, 0.75 - 0.0, -0.5);
    pivot.rotation.y = -dx * 0.55;
    pivot.rotation.z = dx * -0.7;
    pivot.add(
      new THREE.Mesh(
        new THREE.ShapeGeometry(featherShape(dx, 0.85), 14),
        new THREE.MeshPhysicalMaterial({
          color: '#f4faff',
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
          roughness: 0.3,
        }),
      ),
    );
    rig.root.add(pivot);
  }
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.07, 8, 28),
    new THREE.MeshBasicMaterial({ color: ANGEL_GOLD }),
  );
  halo.position.set(0, 3.2, -0.05);
  halo.rotation.x = Math.PI / 2 - 0.12;
  rig.root.add(halo);
}

const ANGEL = variant(CHILD, 'Nubbin (Angel look)', {
  colors: {
    body: WHITE,
    belly: WHITE,
    tip: '#fff4c0',
    pad: '#fff4c0',
    crownShade: '#e8f0ff',
    iris: '#2a5ab0',
    wing: '#fafdff',
  },
  // A small white tuft crown.
  crown: [
    cone(V(0, 2.4, 0.05), V(0, 2.95, -0.2), 0.25, 0.04, WHITE, 'crown', 0.1),
    cone(V(0.14, 2.38, 0), V(0.35, 2.8, -0.2), 0.14, 0.03, WHITE, 'crown', 0.06),
    cone(V(-0.14, 2.38, 0), V(-0.35, 2.8, -0.2), 0.14, 0.03, WHITE, 'crown', 0.06),
  ],
  wings: { shape: 'feather', size: 1.45, y: 1.45, color: '#fafdff' },
  ball: { shape: 'halo', color: ANGEL_GOLD, glow: '#d0a020' },
  surface: { rimGlow: 0.2 },
  patch: (spec) => {
    spec.extras = angelExtras;
  },
  notes: 'R0414: the classic Angel: white, two pairs of feathered wings, a gold halo, a tuft.',
});

const DEVIL = variant(CHILD, 'Nubbin (Devil look)', {
  colors: {
    body: DEVIL_BLACK,
    belly: DEVIL_RED,
    tip: DEVIL_RED,
    pad: DEVIL_RED,
    crownShade: DEVIL_BLACK,
    blush: DEVIL_BLACK,
    star: DEVIL_BLACK,
    iris: '#ff4030',
    wing: DEVIL_DEEP,
  },
  // Two curved red horns.
  crown: [-1, 1].flatMap((dx) => [
    cone(V(dx * 0.5, 2.35, 0), V(dx * 0.7, 2.95, -0.1), 0.2, 0.03, DEVIL_RED, 'horn', 0.05),
  ]),
  wings: { shape: 'bat', size: 1.3, color: DEVIL_DEEP },
  ball: { shape: 'spikes', color: DEVIL_RED, glow: '#a01020' },
  slots: { tail: devilTailFor() },
  eyes: { glow: 0.5 },
  notes: 'R0414: the classic Devil: black and red, bat wings, horns, a spade tail.',
});

function devilTailFor() {
  return devilTail(DEVIL_BLACK, DEVIL_RED);
}

const CHAOS = variant(CHILD, 'Nubbin (Chaos look)', {
  colors: {
    body: CHAOS_WATER,
    belly: '#b8e8ff',
    tip: '#c8f0ff',
    pad: '#a0dcff',
    crownShade: '#9adcff',
    blush: CHAOS_WATER,
    star: '#e0f8ff',
    iris: CHAOS_GREEN,
    wing: '#c8f0ff',
  },
  crown: 'none',
  ball: { color: '#bff0ff', glow: '#60b0e0' },
  surface: { roughness: 0.15, clearcoat: 0.8 },
  eyes: { glow: 0.5 },
  patch: (spec) => {
    // The glass finish (LOOK-31), and the green core showing through the head.
    withGemFinish(spec, { glass: true });
    const before = spec.extras;
    spec.extras = (rig) => {
      const own = before?.(rig);
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.46, 16, 12),
        new THREE.MeshBasicMaterial({ color: CHAOS_GREEN }),
      );
      core.position.set(0, 2.0, 0);
      rig.root.add(core);
      return (t, pose) => {
        own?.(t, pose);
        core.scale.setScalar(1 + Math.sin(t * 2.2) * 0.06);
      };
    };
  },
  notes: 'R0414: the classic Chaos: a glass water body, a green core in the head, green eyes.',
});

export const ETERNAL_LOOKS: NubbinVariant[] = [
  { id: 'look-angel', family: 'special', spec: ANGEL },
  { id: 'look-devil', family: 'special', spec: DEVIL },
  { id: 'look-chaos', family: 'special', spec: CHAOS },
];
