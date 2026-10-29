import * as THREE from 'three';
import { JUMP_TOYS } from '../config/tuning-move';
import { springBouncedAt } from '../sim/decorate';
import type { DecorKind, World } from '../sim/types';
import { shroomSquash } from '../render/scenery-jump';

/**
 * MOVE-57: the jump toys' Full 3D models (the spring mushroom and the hay bale), and the
 * mushroom's squash. `render3d/garden.ts` asks `jumpToyModel` first for any placed piece;
 * the actors' update hands over the live world each frame (`noteJumpToyWorld`), and the
 * cap reads it just before it draws to find its own bounce.
 */

let live: { world: World; calm: boolean } | null = null;

/** Called once a frame by the actors with the world being drawn. */
export function noteJumpToyWorld(world: World, calm: boolean): void {
  live = { world, calm };
}

const mat = (color: string) => new THREE.MeshStandardMaterial({ color, roughness: 0.75 });

/** The model for a jump toy, or null for any other kind of piece. */
export function jumpToyModel(kind: DecorKind): THREE.Group | null {
  if (kind === 'springShroom') return shroomModel();
  if (kind === 'hayBale') return hayModel();
  return null;
}

function shroomModel(): THREE.Group {
  const g = new THREE.Group();
  const top = JUMP_TOYS.colliders.springShroom.top;
  const r = JUMP_TOYS.colliders.springShroom.shape.r;
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 0.38, r * 0.48, top * 0.8, 10),
    mat('#f4ead6'),
  );
  stem.position.y = top * 0.4;
  g.add(stem);
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(r * 1.1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    mat('#d8463c'),
  );
  cap.scale.y = 0.55;
  cap.position.y = top * 0.75;
  g.add(cap);
  const spot = mat('#fff3dc');
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.4;
    const s = new THREE.Mesh(new THREE.SphereGeometry(r * 0.13, 6, 4), spot);
    const lean = i % 2 ? 0.55 : 0.85;
    s.position.set(
      Math.cos(a) * r * lean,
      cap.position.y + r * 0.55 * Math.sqrt(1 - lean * lean) + 0.02,
      Math.sin(a) * r * lean,
    );
    s.scale.y = 0.5;
    g.add(s);
  }
  // Squash the whole mushroom about its foot, read just before the cap draws.
  cap.onBeforeRender = () => {
    if (!live) return;
    const p = g.position;
    const d = live.world.placed.find(
      (q) => q.kind === 'springShroom' && Math.abs(q.pos.x - p.x) + Math.abs(q.pos.z - p.z) < 0.05,
    );
    if (!d) return;
    const sq =
      shroomSquash(d.id, springBouncedAt(live.world, d.id), performance.now(), live.calm) *
      JUMP_TOYS.squash;
    g.scale.set(1 + sq * 0.5, 1 - sq, 1 + sq * 0.5);
  };
  return g;
}

function hayModel(): THREE.Group {
  const g = new THREE.Group();
  const c = JUMP_TOYS.colliders.hayBale;
  const w = c.shape.hw * 2;
  const d = c.shape.hd * 2;
  const bale = new THREE.Mesh(new THREE.BoxGeometry(w, c.top, d), mat('#d9b04a'));
  bale.position.y = c.top / 2;
  g.add(bale);
  const twine = mat('#7a5232');
  for (const x of [-w * 0.28, w * 0.28]) {
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.05, c.top + 0.01, d + 0.01), twine);
    band.position.set(x, c.top / 2, 0);
    g.add(band);
  }
  return g;
}
