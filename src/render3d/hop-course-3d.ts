import * as THREE from 'three';
import { hopFlagsShown, hopGhostAt } from '../render/hop-course-view';
import { SIM } from '../config/tuning';
import { keeperFooting } from '../sim/keeper';
import type { World } from '../sim/types';

/**
 * MOVE-63: the hop course in Full 3D: up to two flags on poles (the start flag chequered,
 * the next flag red, the one after it faded) and the best run's ghost, a pale glowing wisp.
 * A few meshes made once and moved each frame; nothing is built while the course is shut.
 */

const FLAGS = 2;

export class HopCourse3D {
  private readonly group = new THREE.Group();
  private flags: THREE.Group[] = [];
  private cloths: THREE.MeshStandardMaterial[] = [];
  private ghost: THREE.Mesh | null = null;
  private built = false;

  constructor(parent: THREE.Object3D) {
    this.group.name = 'hop-course';
    parent.add(this.group);
  }

  private build(): void {
    this.built = true;
    const pole = new THREE.MeshStandardMaterial({ color: '#5a3c24', roughness: 0.8 });
    for (let i = 0; i < FLAGS; i++) {
      const g = new THREE.Group();
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 1.3, 6), pole);
      stick.position.y = 0.65;
      g.add(stick);
      const cloth = new THREE.MeshStandardMaterial({
        color: '#d8463c',
        roughness: 0.7,
        side: THREE.DoubleSide,
        transparent: true,
      });
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(0.5, -0.17);
      shape.lineTo(0, -0.34);
      const flag = new THREE.Mesh(new THREE.ShapeGeometry(shape), cloth);
      flag.position.set(0.04, 1.28, 0);
      g.add(flag);
      const knob = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 8, 6),
        new THREE.MeshStandardMaterial({ color: '#ffd94a', emissive: '#a07010' }),
      );
      knob.position.y = 1.32;
      g.add(knob);
      g.visible = false;
      this.group.add(g);
      this.flags.push(g);
      this.cloths.push(cloth);
    }
    this.ghost = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 12, 8),
      new THREE.MeshBasicMaterial({ color: '#cfeaff', transparent: true, opacity: 0.45 }),
    );
    this.ghost.scale.y = 1.4;
    this.ghost.visible = false;
    this.group.add(this.ghost);
  }

  update(world: World, alpha: number, nowMs: number, calm: boolean): void {
    const shown = hopFlagsShown(world);
    if (!this.built) {
      if (shown.length === 0) return;
      this.build();
    }
    for (let i = 0; i < FLAGS; i++) {
      const g = this.flags[i]!;
      const f = shown[i];
      g.visible = !!f;
      if (!f) continue;
      g.position.set(f.x, keeperFooting(world, f.x, f.z).y, f.z);
      // The pennant flutters a little, unless motion is reduced.
      g.rotation.y = calm ? 0 : Math.sin(nowMs / 400 + i) * 0.25;
      const cloth = this.cloths[i]!;
      cloth.color.set(f.kind === 'start' ? '#f4f0e8' : '#d8463c');
      cloth.opacity = f.kind === 'after' ? 0.45 : 1;
    }
    const gh = hopGhostAt(world, world.timeMs - (1 - alpha) * SIM.stepMs);
    const ghost = this.ghost!;
    ghost.visible = !!gh;
    if (gh) ghost.position.set(gh.x, gh.y + 0.5, gh.z);
  }
}
