import {
  Color,
  CylinderGeometry,
  DirectionalLight,
  HemisphereLight,
  IcosahedronGeometry,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
  Scene,
} from 'three';
import { TEST_SCENE } from '../config/tuning';
import { Billboard } from './billboard';
import type { OrbitCamera } from './camera';
import { C, color } from './sprites/palette';
import { makeGrassTexture, makePlaceholderSpriteTexture } from './sprites/placeholder';

/**
 * M0 test scene: a textured ground plane, one low-poly tree and one camera-facing
 * sprite. Enough to prove the low-res pipeline, the camera snap and billboarding.
 */
export class TestScene {
  readonly scene = new Scene();
  private readonly sprite: Billboard;
  private readonly disposables: Array<{ dispose(): void }> = [];

  constructor() {
    this.scene.background = new Color(color(C.nightBlue));

    // Lights: soft sky/ground fill plus one sun for the tree's flat shading.
    const hemi = new HemisphereLight(new Color(color(C.shallows)), new Color(color(C.forest)), 1.4);
    this.scene.add(hemi);
    const sun = new DirectionalLight(new Color(color(C.cream)), 1.2);
    sun.position.set(6, 10, 4);
    this.scene.add(sun);

    // Ground.
    const size = TEST_SCENE.groundSize;
    const grass = makeGrassTexture(TEST_SCENE.groundTilePx, size * TEST_SCENE.groundTilesPerUnit);
    const groundGeo = new PlaneGeometry(size, size);
    const groundMat = new MeshLambertMaterial({ map: grass });
    const ground = new Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);
    this.disposables.push(groundGeo, groundMat, grass);

    // Tree: trunk + faceted canopy.
    const trunkGeo = new CylinderGeometry(0.3, 0.45, 2.2, 6);
    const trunkMat = new MeshLambertMaterial({
      color: new Color(color(C.bark)),
      flatShading: true,
    });
    const trunk = new Mesh(trunkGeo, trunkMat);
    trunk.position.set(-3, 1.1, -2);
    this.scene.add(trunk);

    const canopyGeo = new IcosahedronGeometry(1.8, 0);
    const canopyMat = new MeshLambertMaterial({
      color: new Color(color(C.leaf)),
      flatShading: true,
    });
    const canopy = new Mesh(canopyGeo, canopyMat);
    canopy.position.set(-3, 3.3, -2);
    this.scene.add(canopy);
    this.disposables.push(trunkGeo, trunkMat, canopyGeo, canopyMat);

    // One camera-facing sprite.
    const spriteTex = makePlaceholderSpriteTexture(TEST_SCENE.spriteSizePx);
    this.sprite = new Billboard(spriteTex, TEST_SCENE.spriteWorldHeight);
    this.sprite.mesh.position.set(1.5, 0, 1);
    this.scene.add(this.sprite.mesh);
    this.disposables.push(spriteTex, this.sprite);
  }

  /** Called every frame before render. Reads camera state, never changes it. */
  update(camera: OrbitCamera): void {
    this.sprite.faceCamera(camera.currentYaw, camera.pitch);
  }

  dispose(): void {
    for (const d of this.disposables) d.dispose();
  }
}
