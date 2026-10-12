import { Mesh, MeshBasicMaterial, PlaneGeometry, type Texture } from 'three';

/**
 * A flat sprite that stands on the ground (origin at bottom-centre) and turns to face
 * the camera around the vertical axis. Because the camera pitch is fixed, the plane is
 * also tilted back by that pitch so its pixels are never foreshortened.
 */
export class Billboard {
  readonly mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;

  constructor(texture: Texture, worldHeight: number, aspect = 1) {
    const geometry = new PlaneGeometry(worldHeight * aspect, worldHeight);
    geometry.translate(0, worldHeight / 2, 0); // anchor at the feet
    const material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.5,
      depthWrite: true,
    });
    this.mesh = new Mesh(geometry, material);
    this.mesh.rotation.order = 'YXZ';
  }

  /** yaw/pitch in radians, matching the camera. */
  faceCamera(yaw: number, pitch: number): void {
    this.mesh.rotation.set(-pitch, yaw, 0, 'YXZ');
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
