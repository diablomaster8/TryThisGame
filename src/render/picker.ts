import { Plane, Raycaster, Vector2, Vector3, type Camera, type Object3D } from 'three';
import type { Vec2 } from '../sim/types';

export interface PickHit {
  kind: 'nubbin' | 'item' | 'tree' | 'ground';
  id: string;
  /** Where the ray met the ground plane, if it did. */
  ground: Vec2 | null;
}

const GROUND = new Plane(new Vector3(0, 1, 0), 0);

/** Screen → world queries: what sprite or prop is under a point, and where on the ground it lands. */
export class Picker {
  private readonly raycaster = new Raycaster();
  private readonly ndc = new Vector2();
  private readonly hit = new Vector3();

  constructor(private readonly canvas: HTMLCanvasElement) {}

  private setRay(clientX: number, clientY: number, camera: Camera): void {
    const rect = this.canvas.getBoundingClientRect();
    this.ndc.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.ndc, camera);
  }

  groundPoint(clientX: number, clientY: number, camera: Camera): Vec2 | null {
    this.setRay(clientX, clientY, camera);
    const p = this.raycaster.ray.intersectPlane(GROUND, this.hit);
    return p ? { x: p.x, z: p.z } : null;
  }

  pick(clientX: number, clientY: number, camera: Camera, objects: Object3D[]): PickHit | null {
    this.setRay(clientX, clientY, camera);
    const ground = this.raycaster.ray.intersectPlane(GROUND, this.hit);
    const groundPos = ground ? { x: ground.x, z: ground.z } : null;
    const hits = this.raycaster.intersectObjects(objects, false);
    for (const h of hits) {
      const pick = h.object.userData.pick as PickHit | undefined;
      if (!pick) continue;
      // Sprites are alpha-tested: ignore clicks on their transparent corners by checking UV alpha
      // is not available cheaply here, so a hit on the quad counts. Quads are small enough.
      return { kind: pick.kind, id: pick.id, ground: groundPos };
    }
    return groundPos ? { kind: 'ground', id: 'ground', ground: groundPos } : null;
  }
}
