import * as THREE from 'three';
import { CG_C } from '../config/tuning-c';
import { stageFlags } from '../render/scene-stage';
import { activeFx, coldGround, hazelHill } from '../render/story-fx-state';
import { CorvinDress } from './corvin-dress';
import type { Dress3dCtx, Dressing3d } from './dressings';
import { FrostFx } from './frost-fx';
import { buildHillDress, buildLedge, type Ledge } from './hill-dress';
import { StoryFx3d, type StoneSpot } from './story-fx';

/**
 * Campaign-graphics package c, Full 3D: the story places (see the registry contract at the
 * top of render3d/dressings.ts). Corvin's garden and the Hollow camp are built in
 * `story-sets.ts`; this adds what reads the story each frame or lives in the Grove: the pens'
 * gate leaves and the painted numbers (C8, H15), the memorial hill and the ledge behind the
 * falls (H7, H5), the held effects fallsStill, stoneGlow and goldWater from `stage.fx` (H6),
 * breath puffs (N2) and the Keeper's footprints (N3).
 */
let ctx3: Dress3dCtx | null = null;
let corvin: CorvinDress | null = null;
let hill: THREE.Group | null = null;
let ledge: Ledge | null = null;
let fx: StoryFx3d | null = null;
let frost: FrostFx | null = null;
let hollowPlate: THREE.Mesh | null = null;
const windowAt = new THREE.Vector3();

export const dress3dC: Dressing3d = {
  id: 'c',
  build(ctx) {
    ctx3 = ctx;
    corvin = new CorvinDress();
    ctx.scene.add(corvin.group);
    // The memorial hill and the ledge are the home Grove's: hidden when the Keeper is away.
    const h = buildHillDress();
    hill = h.group;
    ledge = buildLedge();
    ctx.world3d.add(hill, ledge.group);
    hill.visible = ledge.group.visible = false;
    // The blue stone in the Hollow: an inlay on the flat stone that waits there.
    const s = CG_C.hollow.stone;
    const inlay = new THREE.MeshStandardMaterial({
      color: '#26364f',
      emissive: CG_C.fx.stone,
      emissiveIntensity: 0,
      roughness: 0.4,
    });
    hollowPlate = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.03, 1.1), inlay);
    hollowPlate.position.set(s.x, 0.52, s.z);
    hollowPlate.rotation.y = 0.4;
    hollowPlate.visible = false;
    ctx.scene.add(hollowPlate);
    const spots: StoneSpot[] = [
      { at: ledge.stoneAt, inlay: ledge.inlay, place: 'grove' },
      { at: new THREE.Vector3(s.x, 0.8, s.z), inlay, place: 'hollow' },
    ];
    fx = new StoryFx3d(ctx.scene, spots, [ctx.world3d]);
    frost = new FrostFx(ctx.scene);
    const hs = CG_C.corvin.house;
    windowAt.set(hs.x + hs.w * 0.28, hs.h * 0.6, hs.z + hs.d / 2 + 0.6);
    for (const o of [corvin.group, hill, ledge.group, hollowPlate]) void ctx.compile(o);
  },
  update(world, stage, _daylight, dt) {
    if (!ctx3 || !corvin || !hill || !ledge || !fx || !frost || !hollowPlate) return;
    const flags = stageFlags(world, stage);
    const still = ctx3.reduceMotion();
    corvin.group.visible = flags.location === 'corvin';
    if (corvin.group.visible) corvin.update(flags.pens, dt, still);
    const stands = hazelHill(flags) && flags.location === 'grove';
    hill.visible = ledge.group.visible = stands;
    hollowPlate.visible = flags.location === 'hollow';
    const on = activeFx(stage, flags);
    fx.update(on, flags.location, dt, still, ctx3.time.value);
    frost.update(
      world,
      { breath: on.has('breath'), prints: coldGround(flags) },
      ctx3.time.value,
      still,
    );
    // Corvin's one lit window lends its warmth to the lamp pool after dusk.
    if (flags.location === 'corvin' && ctx3.lampsOn())
      ctx3.lamps.push({
        x: windowAt.x,
        y: windowAt.y,
        z: windowAt.z,
        color: '#ffb347',
        intensity: 4,
        distance: 9,
        decay: 1.6,
      });
  },
  dispose() {
    corvin?.dispose();
    fx?.dispose();
    frost?.dispose();
    hollowPlate?.removeFromParent();
    ctx3 = null;
    corvin = hill = ledge = fx = frost = hollowPlate = null;
  },
};
