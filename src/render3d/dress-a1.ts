import * as THREE from 'three';
import type { SceneStage } from '../config/story';
import type { Daylight } from '../render/daylight';
import { StageTracker } from '../render/stage-actors';
import { POSE_CUES, PoseDirector } from '../render/stage-pose';
import type { World } from '../sim/types';
import type { Dress3dCtx, Dressing3d } from './dressings';
import { clearRigs, handOf } from './stage-pose3d';

/**
 * Campaign graphics 4, package a1, Full 3D: works out the stage cues each frame (sit and
 * kneel on a seat, K1; heads to the speaker, K6 and K41; line gestures, K7; the item-get pose,
 * K39). The crowd and the actors hand them to their rigs through `poseRig`
 * (render3d/stage-pose3d.ts); the carry props hang from `hand.R` (K13, in dress-e and dress-p).
 * The one thing drawn here is the found thing the Keeper holds up during the item-get: a pale
 * card between the raised hands (one draw, faintly emissive, no light).
 */
class Dress3dA1 implements Dressing3d {
  readonly id = 'a1';
  private ctx: Dress3dCtx | null = null;
  private tracker = new StageTracker();
  private director = new PoseDirector();
  private card: THREE.Mesh | null = null;
  private readonly at = new THREE.Vector3();
  private readonly q = new THREE.Quaternion();

  build(ctx: Dress3dCtx): void {
    this.ctx = ctx;
    this.tracker = new StageTracker();
    this.director = new PoseDirector();
    const geo = new THREE.BoxGeometry(0.34, 0.24, 0.03);
    const mat = new THREE.MeshStandardMaterial({
      color: '#f3e6c4',
      emissive: '#fff0c8',
      emissiveIntensity: 0.6,
      roughness: 0.8,
    });
    this.card = new THREE.Mesh(geo, mat);
    this.card.name = 'a1-item-card';
    this.card.visible = false;
    ctx.scene.add(this.card);
    void ctx.compile(this.card);
  }

  update(world: World, stage: SceneStage, daylight: Daylight, dt: number): void {
    void stage;
    void daylight;
    const ctx = this.ctx;
    if (!ctx) return;
    this.tracker.tick(world, dt);
    this.director.update(world, this.tracker, dt, ctx.reduceMotion());
    // K39: the card rides over the raised hands, square to the Keeper, while the pose holds.
    const card = this.card;
    if (card) {
      const hand = POSE_CUES.get('keeper')?.pose === 'itemGet' ? handOf('keeper') : null;
      card.visible = !!hand;
      if (hand) {
        hand.updateWorldMatrix(true, false);
        hand.getWorldPosition(this.at);
        // Between the two raised hands: on the body's centre line, at the hands' height.
        const body = hand.parent?.parent?.parent?.parent;
        if (body) {
          body.getWorldQuaternion(this.q);
          card.position.set(body.position.x, this.at.y + 0.12, body.position.z);
        } else card.position.set(this.at.x, this.at.y + 0.12, this.at.z);
        card.quaternion.copy(this.q);
      }
    }
    // The hands were read by the dressings before this one (e, p); the next frame notes afresh.
    clearRigs();
  }

  dispose(): void {
    clearRigs();
    POSE_CUES.clear();
    if (this.card) {
      this.card.removeFromParent();
      this.card.geometry.dispose();
      (this.card.material as THREE.Material).dispose();
      this.card = null;
    }
    this.ctx = null;
  }
}

export const dress3dA1: Dressing3d = new Dress3dA1();
