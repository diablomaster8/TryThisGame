import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { SceneStage } from '../config/story';
import { GROVE, STORY } from '../config/tuning';
import { LOOK_F } from '../config/tuning-f';
import { CG2_K } from '../config/tuning-k';
import { STORY_B } from '../config/tuning-b';
import { stageFlags } from '../render/scene-stage';
import { ddLayout, foldExtras } from '../render/story-b-layout';
import { stateFrom } from '../render/story-b-state';
import type { World } from '../sim/types';
import type { Dress3dCtx, Dressing3d } from './dressings';
import { FOLD_HOUSES } from './kit-story-b';
import {
  addBannerPole,
  addMending,
  addMilestone,
  addPlaque,
  addRubble,
  addWreath,
  buildBeetleCart,
  buildRoad,
  buildSundial,
  buildTallyPost,
  litWindows,
  Pack,
  type HouseBox,
} from './kit-k';
import { groveHeight } from './terrain';
import { markAt } from '../config/stage-marks';

/**
 * Campaign graphics 2, package k, Full 3D (H3, M2, M4, M5, N5): each separate campaign's own
 * landmarks on the Grove. The Hundred Days' Fold gets rubble and then the mending by chapter
 * (new tile patches, a scaffold, stacked planks), a lit window in chapter 10, the well's tally
 * post and wreaths on the doors from chapter 7; the Beetle Road gets its lane with ruts, three
 * milestones, three banner poles whose crests are shapes as well as colours, and a kit-built
 * cart (tarp on, or off in chapter 5) that stands in for package f's; Dawn & Dusk gets a
 * carved creature plaque over each crest-house door and a sundial on the green. Each kit is
 * one to three merged meshes. Hides its pieces on an exclusive stage. Reads the world only.
 */
const FOLD_KINDS = ['cottage', 'school', 'dojo'] as const;

function foldHouses(): HouseBox[] {
  const sq = markAt('grove', 'fold-square') ?? { x: 0, z: 2 };
  const out: HouseBox[] = [];
  const box = (kind: (typeof FOLD_KINDS)[number], x: number, z: number, yaw: number): HouseBox => {
    const f = FOLD_HOUSES[kind];
    return {
      x,
      y: groveHeight(x, z),
      z,
      yaw,
      w: f.w,
      d: f.d,
      h: f.h,
      pitch: f.style.pitch,
      overhang: f.style.overhang,
    };
  };
  for (const kind of FOLD_KINDS) {
    const b = GROVE.buildings[kind];
    out.push(box(kind, b.x, b.z, 0));
  }
  for (const e of foldExtras()) out.push(box(e.kind, e.x, e.z, Math.atan2(sq.x - e.x, sq.z - e.z)));
  return out;
}

export const dress3dK: Dressing3d = (() => {
  let ctx: Dress3dCtx | null = null;
  let root: THREE.Group | null = null;
  const rubble = new Map<number, THREE.Group>();
  const windowMeshes: Array<{ extra: boolean; mesh: THREE.Mesh }> = [];
  const wreathMeshes: Array<{ extra: boolean; mesh: THREE.Mesh }> = [];
  let tally: THREE.Mesh | null = null;
  let tallyDays = -1;
  let beetle: THREE.Group | null = null;
  const carts: { shut: THREE.Group | null; open: THREE.Group | null } = { shut: null, open: null };
  let poles: THREE.Mesh | null = null;
  let fCart: THREE.Object3D | null = null;
  let fCartSearched = false;
  let dd: THREE.Group | null = null;
  const houses = foldHouses();

  const ground = (x: number, z: number) => groveHeight(x, z);

  function addTo(parent: THREE.Object3D, obj: THREE.Object3D | null): void {
    if (!obj || !ctx) return;
    parent.add(obj);
    void ctx.compile(obj);
  }

  function rubbleGroup(level: number): THREE.Group {
    let g = rubble.get(level);
    if (g) return g;
    g = new THREE.Group();
    g.name = `k-fold-${level}`;
    const pack = new Pack();
    houses.forEach((b, i) => {
      addRubble(pack, b, level, i + 1, ground);
      addMending(pack, b, level, i + 1, ground);
    });
    addTo(g, pack.build(`k-fold-ruin-${level}`));
    g.visible = false;
    root!.add(g);
    rubble.set(level, g);
    return g;
  }

  function buildBeetle(c: Dress3dCtx): THREE.Group {
    const B = CG2_K.beetle;
    const g = new THREE.Group();
    g.name = 'k-beetle';
    addTo(g, buildRoad(B.road, B.roadWidth, B.rutOffset, B.rutWidth, ground));
    const pack = new Pack();
    for (const m of B.milestones)
      addMilestone(pack, { x: m.x, y: ground(m.x, m.z), z: m.z }, 0.3 * m.n - 0.4, m.n);
    B.poles.forEach((p, i) =>
      addBannerPole(
        pack,
        { x: p.x, y: ground(p.x, p.z), z: p.z },
        [0.12, -0.1, 0.2][i]!,
        B.poleHeight,
        B.cloth,
        p.crest,
        p.colour,
      ),
    );
    poles = pack.build('k-beetle-props');
    addTo(g, poles);
    for (const open of [false, true]) {
      const cart = buildBeetleCart(open);
      const at = LOOK_F.beetle.cart;
      cart.position.set(at.x, ground(at.x, at.z), at.z);
      cart.rotation.y = B.cartYaw;
      cart.visible = false;
      addTo(g, cart);
      carts[open ? 'open' : 'shut'] = cart;
    }
    g.visible = false;
    c.world3d.add(g);
    return g;
  }

  function buildDd(c: Dress3dCtx): THREE.Group {
    const P = CG2_K.plaque;
    const g = new THREE.Group();
    g.name = 'k-dawndusk';
    const L = ddLayout();
    const pack = new Pack();
    STORY_B.dawnDusk.houses.forEach((hs, i) => {
      const h = L.houses[i]!;
      const d = hs.w * 0.74;
      // The door faces the green: the plaque sits on the front wall over the lintel.
      const c0 = Math.cos(h.yaw);
      const s0 = Math.sin(h.yaw);
      const off = d / 2 + 0.05;
      addPlaque(
        pack,
        P.creatures[i]!,
        { w: P.w, h: P.h, relief: P.relief },
        { x: h.x + off * s0, y: groveHeight(h.x, h.z) + P.centreY, z: h.z + off * c0 },
        h.yaw,
      );
    });
    addTo(g, pack.build('k-plaques'));
    const sun = buildSundial();
    sun.position.set(L.centre.x, groveHeight(L.centre.x, L.centre.z), L.centre.z);
    addTo(g, sun);
    g.visible = false;
    c.world3d.add(g);
    return g;
  }

  /** Package f's own cart, found once among its group's children by where it stands. */
  function findFCart(): THREE.Object3D | null {
    if (fCartSearched || !ctx) return fCart;
    const grp = ctx.scene.getObjectByName('dress-f-beetle');
    if (!grp) return null;
    fCartSearched = true;
    const at = LOOK_F.beetle.cart;
    fCart =
      grp.children.find(
        (o) => Math.abs(o.position.x - at.x) < 0.2 && Math.abs(o.position.z - at.z) < 0.2,
      ) ?? null;
    return fCart;
  }

  return {
    id: 'k',
    build(c) {
      ctx = c;
      root = new THREE.Group();
      root.name = 'dress-k';
      c.world3d.add(root);
      beetle = buildBeetle(c);
      dd = buildDd(c);
      // The wreaths wait for chapter 7 and the lit windows for the last chapter. The three
      // stock houses are always there; the three extras stand only while the Fold is in ruin.
      const lampMat = new THREE.MeshBasicMaterial({
        color: '#ffd27a',
        side: THREE.DoubleSide,
        toneMapped: false,
      });
      for (const extra of [false, true]) {
        const list = houses.filter((_, i) => i >= FOLD_KINDS.length === extra);
        const wp = new Pack();
        for (const b of list) addWreath(wp, b, { dx: 0, y: 1.12, dz: 0.16 }, ground);
        const wm = wp.build(extra ? 'k-wreaths-extra' : 'k-wreaths');
        if (wm) {
          wm.visible = false;
          addTo(root, wm);
          wreathMeshes.push({ extra, mesh: wm });
        }
        const g = mergeGeometries(
          list.map((b) => litWindows(b)),
          false,
        );
        if (g) {
          const m = new THREE.Mesh(g, lampMat);
          m.name = extra ? 'k-lit-windows-extra' : 'k-lit-windows';
          m.visible = false;
          addTo(root, m);
          windowMeshes.push({ extra, mesh: m });
        }
      }
    },
    update(world: World, stage: SceneStage) {
      if (!ctx || !root) return;
      const st = Object.keys(stage).length ? stage : null;
      const f = stageFlags(world, st);
      const home = f.location === 'grove' && !stage.exclusive;
      const b = stateFrom(world, st, f);
      const idx = f.storyChapter ?? -1;
      // The Fold: rubble and the mending by ruin level, wreaths, lit window, tally post.
      for (const [level, g] of rubble) g.visible = home && b.hundred && b.ruin === level;
      if (home && b.hundred && b.ruin > 0 && !rubble.get(b.ruin))
        rubbleGroup(b.ruin).visible = true;
      for (const w of wreathMeshes)
        w.mesh.visible =
          home && b.hundred && idx >= CG2_K.fold.wreathFromIndex && (!w.extra || b.ruin > 0);
      for (const w of windowMeshes)
        w.mesh.visible =
          home && b.hundred && idx >= CG2_K.fold.litWindowIndex && (!w.extra || b.ruin > 0);
      const days = b.hundred
        ? Math.min(CG2_K.fold.tallyMax, Math.max(0, Math.floor(world.timeMs / STORY.dayMs)))
        : 0;
      if (days !== tallyDays || (b.hundred && !tally)) {
        tallyDays = days;
        if (tally) {
          tally.removeFromParent();
          tally.geometry.dispose();
          tally = null;
        }
        if (b.hundred) {
          const well = GROVE.buildings.well;
          const T = CG2_K.fold;
          tally = buildTallyPost(days, T.perGroup, T.postHeight, ground, {
            x: well.x + Math.cos(T.postAngle) * T.postOut,
            z: well.z + Math.sin(T.postAngle) * T.postOut,
            yaw: 0,
          });
          addTo(root, tally);
        }
      }
      if (tally) tally.visible = home && b.hundred;

      // The Beetle Road.
      const onBeetle = home && f.campaign === 'beetle';
      if (beetle) beetle.visible = onBeetle;
      if (onBeetle) {
        const open = stage.props?.cart ? stage.props.cart === 'open' : idx >= 4;
        if (carts.open) carts.open.visible = open;
        if (carts.shut) carts.shut.visible = !open;
        if (poles) poles.visible = stage.props?.banners !== 'hide';
      }
      // Package f's cart stands where mine does; one of the two shows.
      const fc = findFCart();
      if (fc) fc.visible = !onBeetle;

      // Dawn & Dusk.
      if (dd) dd.visible = home && b.dawnDusk;
    },
    dispose() {
      ctx = null;
      root = null;
    },
  };
})();
