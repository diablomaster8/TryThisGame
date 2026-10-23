import * as THREE from 'three';
import { WEATHERED } from '../config/npc-looks';
import type { SceneStage } from '../config/story';
import { GROVE3D } from '../config/tuning';
import { HAND_LANTERN } from '../config/tuning-e';
import { CG2_P } from '../config/tuning-p';
import { CG4_A1 } from '../config/tuning-a1';
import type { Daylight } from '../render/daylight';
import {
  festivalNubbinSpots,
  festivalScene,
  StageTracker,
  type CarryProp,
} from '../render/stage-actors';
import type { Tex } from '../samples/aaa-kit';
import type { World } from '../sim/types';
import { STAGE_FIGURES, type Figure } from './crowd';
import type { Dress3dCtx, Dressing3d } from './dressings';
import { arc, box, cyl, Parts, sph } from './prop-kit';
import { handPoint } from './stage-pose3d';
import { groveHeight } from './terrain';

/**
 * Campaign graphics 2, package p, Full 3D ("people"): the storylines' speakers on the ground
 * (C1: figures the crowd draws from the cast, with their own look keys), the carry props in
 * their hands (N3: prop-kit pieces at the hand lantern's offset), Moss weathered (C6: the set
 * the look key reads), the speaker chevron (H6) and the festival's Nubbins (H9). Accessories
 * and the story looks (M1, M13, C2) are Keeper-spec prims built by `specForKey`.
 */

/** A small prop built from the prop kit, origin at the foot of the thing held. */
function buildCarry(tex: Tex, prop: CarryProp): THREE.Group {
  const P = new Parts(tex);
  switch (prop) {
    case 'broom':
      P.add('wood', cyl(0.022, 0.022, 1.45, 6), [0, 0.78, 0], '#8a5a32');
      P.add('plain', cyl(0.06, 0.15, 0.32, 8), [0, 0.16, 0], '#d8b872');
      P.add('wood', box(0.2, 0.03, 0.06, 0.01), [0, 0.32, 0], '#6a4428');
      break;
    case 'notebook':
      P.add('plain', box(0.2, 0.035, 0.27, 0.01), [0, 0, 0], '#b8365a');
      P.add('plain', box(0.17, 0.02, 0.24, 0.005), [0, 0.02, 0], '#f3ead2');
      P.add('plain', box(0.012, 0.04, 0.2, 0.004), [0, 0.02, 0], '#7a2c44');
      break;
    case 'egg':
      P.add('plain', sph(0.1, 12, 10), [0, 0.02, 0], '#f3ead2', [0, 0, 0], [1, 1.3, 1]);
      P.add('plain', sph(0.014, 6, 5), [0.05, 0.08, 0.06], '#c9a96a');
      P.add('plain', sph(0.012, 6, 5), [-0.04, 0.0, 0.08], '#c9a96a');
      break;
    case 'keys':
      P.add('plain', arc(0.06, 0.012, Math.PI * 2), [0, 0, 0], '#e0b030', [Math.PI / 2, 0, 0]);
      P.add('plain', box(0.016, 0.13, 0.016, 0.004), [-0.035, -0.1, 0], '#d4a62a');
      P.add('plain', box(0.016, 0.15, 0.016, 0.004), [0, -0.11, 0.01], '#e0b030');
      P.add('plain', box(0.016, 0.12, 0.016, 0.004), [0.035, -0.095, 0], '#d4a62a');
      break;
  }
  return P.flush();
}

/** H6: a downward chevron with a dark edge, on a 16 px card. */
function pipTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 16;
  c.height = 16;
  const g = c.getContext('2d');
  if (g) {
    const P = CG2_P.pip;
    const path = (): void => {
      g.beginPath();
      g.moveTo(2, 4);
      g.lineTo(14, 4);
      g.lineTo(8, 13);
      g.closePath();
    };
    path();
    g.fillStyle = P.edge;
    g.fill();
    g.lineWidth = 3;
    g.strokeStyle = P.edge;
    g.lineJoin = 'round';
    g.stroke();
    g.beginPath();
    g.moveTo(3.5, 5.5);
    g.lineTo(12.5, 5.5);
    g.lineTo(8, 11.5);
    g.closePath();
    g.fillStyle = P.fill;
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const FESTIVAL_KEYS = ['variant:child', 'variant:child-sun', 'variant:child-moon'] as const;

class Dress3dP implements Dressing3d {
  readonly id = 'p';
  private ctx: Dress3dCtx | null = null;
  private root = new THREE.Group();
  private tracker = new StageTracker();
  private time = 0;
  private pip: THREE.Sprite | null = null;
  private carry = new Map<CarryProp, THREE.Group[]>();
  private owned: Array<{ dispose(): void }> = [];
  private readonly hand = new THREE.Vector3();

  build(ctx: Dress3dCtx): void {
    this.ctx = ctx;
    this.root = new THREE.Group();
    this.root.name = 'dress-p';
    this.tracker = new StageTracker();
    this.time = 0;
    this.carry.clear();
    this.owned = [];
    const tex = pipTexture();
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      fog: false,
    });
    this.owned.push(tex, mat);
    this.pip = new THREE.Sprite(mat);
    this.pip.scale.setScalar(CG2_P.pip.size3d);
    this.pip.renderOrder = 20;
    this.pip.visible = false;
    this.root.add(this.pip);
    ctx.scene.add(this.root);
  }

  /** A pooled carry prop: the next free group of its kind, built the first time it is wanted. */
  private carryGroup(ctx: Dress3dCtx, prop: CarryProp, i: number): THREE.Group {
    let list = this.carry.get(prop);
    if (!list) {
      list = [];
      this.carry.set(prop, list);
    }
    let g = list[i];
    if (!g) {
      g = i === 0 ? buildCarry(ctx.tex as Tex, prop) : list[0]!.clone();
      g.visible = false;
      this.root.add(g);
      list[i] = g;
      void ctx.compile(g);
    }
    return g;
  }

  update(world: World, stage: SceneStage, daylight: Daylight, dt: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    void stage;
    void daylight;
    const reduce = ctx.reduceMotion();
    this.time += dt;
    const tracker = this.tracker;
    tracker.tick(world, dt);
    // C6: the look key of these Nubbins carries `~weathered` from the next frame on.
    WEATHERED.ids = tracker.weathered(world);
    const home = world.location === 'grove';

    // C1: stage actors, drawn by the crowd from its pool.
    const figures: Figure[] = [];
    const actors = tracker.actors(world);
    for (const a of actors) {
      const side = a.who === 'd-ash' ? 'moon' : 'sun';
      figures.push({
        id: `stage-${a.who}`,
        kind: 'ambient',
        look: {
          key: `keeper-${side}~npc:${a.who}`,
          height: GROVE3D.keeperHeight * (a.look.scale ?? 1),
        },
        x: a.x,
        z: a.z,
        facing: a.yaw,
        pose: a.pose === 'walk' ? 'walk' : 'idle',
      });
    }

    // H9: the festival's Nubbins in the gaps of the Keepers' ring.
    if (home && festivalScene(tracker.stage)) {
      festivalNubbinSpots(
        world.location,
        CG2_P.festival.nubbinRadius,
        CG2_P.festival.nubbinCount,
      ).forEach((s, i) => {
        figures.push({
          id: `festival-nubbin-${i}`,
          kind: 'ambient',
          look: { key: FESTIVAL_KEYS[i % FESTIVAL_KEYS.length]!, height: GROVE3D.nubbinHeight },
          x: s.x,
          z: s.z,
          facing: s.yaw,
          pose: 'idle',
        });
      });
    }
    STAGE_FIGURES.list = figures;

    // N3: what the cast hold, at the hand lantern's offset from their feet.
    const used = new Map<CarryProp, number>();
    for (const list of this.carry.values()) for (const g of list) g.visible = false;
    for (const c of tracker.carriers(world, actors)) {
      const i = used.get(c.prop) ?? 0;
      if (i >= CG2_P.carry.poolSize) continue;
      used.set(c.prop, i + 1);
      const g = this.carryGroup(ctx, c.prop, i);
      const s = c.scale;
      // K13 (package a1): held in the right hand when the figure's rig is up.
      const npc = world.npcs.find((n) => n.trainer === c.who);
      const fid = actors.some((a) => a.who === c.who) ? `stage-${c.who}` : npc?.id;
      if (fid && handPoint(fid, this.hand)) {
        const H = CG4_A1.hand;
        const drop = c.prop === 'broom' ? H.broomDrop : H.heldDrop;
        const floor = groveHeight(this.hand.x, this.hand.z);
        g.position.set(this.hand.x, Math.max(floor, this.hand.y - drop * s), this.hand.z);
        g.rotation.set(c.prop === 'notebook' ? -0.35 : 0, c.yaw, 0);
        g.scale.setScalar(s);
        g.visible = true;
        continue;
      }
      const lx = HAND_LANTERN.side * s;
      const lz = HAND_LANTERN.forward * s;
      const cs = Math.cos(c.yaw);
      const sn = Math.sin(c.yaw);
      const gx = c.x + lx * cs + lz * sn;
      const gz = c.z - lx * sn + lz * cs;
      // The broom stands on the ground; the rest are held at the hand's height.
      const held =
        c.prop === 'broom' ? 0 : HAND_LANTERN.height * s + (c.prop === 'egg' ? 0.14 : 0.05);
      g.position.set(gx, groveHeight(gx, gz) + held, gz);
      g.rotation.set(c.prop === 'notebook' ? -0.35 : 0, c.yaw, 0);
      g.scale.setScalar(s);
      g.visible = true;
    }

    // H6: the chevron above whoever speaks. The bob is still under reduced motion.
    const pip = this.pip;
    if (pip) {
      const who = tracker.speakerSpot(world);
      pip.visible = !!who;
      if (who) {
        const P = CG2_P.pip;
        const h = who.kind === 'nubbin' ? GROVE3D.adultHeight : GROVE3D.keeperHeight * who.scale;
        const bob = reduce ? 0 : Math.sin(this.time * P.bobHz * Math.PI * 2) * P.bob3d;
        pip.position.set(who.x, groveHeight(who.x, who.z) + h + P.lift3d + bob, who.z);
      }
    }
  }

  dispose(): void {
    STAGE_FIGURES.list = [];
    WEATHERED.ids = new Set();
    this.root.removeFromParent();
    for (const d of this.owned) d.dispose();
    this.owned = [];
    this.carry.clear();
    this.ctx = null;
  }
}

export const dress3dP: Dressing3d = new Dress3dP();
