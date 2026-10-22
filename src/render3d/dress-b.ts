import * as THREE from 'three';
import { markAt } from '../config/stage-marks';
import { GROVE } from '../config/tuning';
import { STORY_B } from '../config/tuning-b';
import type { SceneStage } from '../config/story';
import type { Daylight } from '../render/daylight';
import { storyBState } from '../render/story-b-state';
import { ddLayout, foldExtras } from '../render/story-b-layout';
import type { World } from '../sim/types';
import { type Dress3dCtx, type Dressing3d } from './dressings';
import {
  buildGate,
  buildGreen,
  buildHouse,
  buildJetty,
  buildSandRing,
  buildWheel,
  crestBoard,
  FOLD_HOUSES,
  type GateModel,
  type WheelModel,
} from './kit-story-b';
import { kitMaterials } from './kit-buildings';
import { groveHeight, WATER_LEVEL } from './terrain';

/**
 * Campaign-graphics package b, Full 3D: the Grove's gate (C4), The Hundred Days' ruined
 * Fold, jetty, mill wheel and day post (C6, M9, M10, N7) and Dawn & Dusk's four crest
 * houses round a green (C7). The stock cottage, school and dojo are merged into the
 * Grove-wide roof, timber and stone meshes, so a building is hidden by collapsing the
 * triangles inside its footprint (the originals are kept and put back). All of it reads the
 * world through `storyBState` and writes nothing back.
 */
type StockId = 'cottage' | 'school' | 'dojo';
const TRIM = new Set(['roof', 'timber', 'stone', 'glass', 'door']);

interface Culled {
  mesh: THREE.Mesh;
  original: Float32Array;
}

/** Footprint half-extents (walls plus the roof's reach and the step) of a stock house. */
function footprint(id: StockId): { x: number; z: number; hx: number; hz: number } {
  const b = GROVE.buildings[id];
  const f = FOLD_HOUSES[id];
  const over = f.style.overhang + 0.35;
  return { x: b.x, z: b.z, hx: f.w / 2 + over, hz: f.d / 2 + over + 0.4 };
}

export const dress3dB: Dressing3d = (() => {
  let ctx: Dress3dCtx | null = null;
  let gate: GateModel | null = null;
  let shown = 0;
  let wheel: WheelModel | null = null;
  let corvinMill: THREE.Group | null = null;
  let corvinWheel: WheelModel | null = null;
  let jetty: { boards: Map<boolean, THREE.Group>; at: THREE.Group } | null = null;
  let sand: THREE.Mesh | null = null;
  let green: THREE.Group | null = null;
  let props: THREE.Object3D | null = null;
  let blades: THREE.Object3D | null = null;
  let bladesStill: THREE.Object3D | null = null;
  const ruinGroups = new Map<number, THREE.Group>();
  let ruinShown: THREE.Group | null = null;
  const culled = new Map<StockId, Culled[]>();
  const hiddenWalls = new Map<StockId, THREE.Object3D[]>();
  let key = '';
  let jettyKey = '';
  let tallyShown = -1;
  let ivyShown: boolean | null = null;

  function restore(id: StockId): void {
    for (const c of culled.get(id) ?? []) {
      (c.mesh.geometry.attributes.position as THREE.BufferAttribute).array.set(c.original);
      (c.mesh.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
    culled.delete(id);
    for (const w of hiddenWalls.get(id) ?? []) {
      w.visible = true;
      if (ctx && !ctx.pickables.includes(w)) ctx.pickables.push(w);
    }
    hiddenWalls.delete(id);
  }

  /** Collapse every trim triangle inside `id`'s footprint and hide its walls. */
  function hide(id: StockId): void {
    if (!ctx || !props || culled.has(id)) return;
    const f = footprint(id);
    const list: Culled[] = [];
    props.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || !(TRIM.has(mesh.name) || mesh.name.startsWith('shutter-'))) return;
      const geo = mesh.geometry;
      const pos = geo.attributes.position as THREE.BufferAttribute | undefined;
      if (!pos || geo.index) return;
      const arr = pos.array as Float32Array;
      let original: Float32Array | null = null;
      for (let t = 0; t + 2 < pos.count; t += 3) {
        const cx = (arr[t * 3]! + arr[t * 3 + 3]! + arr[t * 3 + 6]!) / 3;
        const cz = (arr[t * 3 + 2]! + arr[t * 3 + 5]! + arr[t * 3 + 8]!) / 3;
        const within = (px: number, pz: number, m: number) =>
          Math.abs(px - f.x) <= f.hx + m && Math.abs(pz - f.z) <= f.hz + m;
        // A long roof triangle's centroid can sit outside the footprint while its corners
        // are all inside a margin of it.
        const corners = [0, 1, 2].every((k) => within(arr[(t + k) * 3]!, arr[(t + k) * 3 + 2]!, 2));
        if (!within(cx, cz, 0) && !corners) continue;
        original ??= arr.slice();
        for (let k = 1; k < 3; k++) {
          arr[(t + k) * 3] = arr[t * 3]!;
          arr[(t + k) * 3 + 1] = arr[t * 3 + 1]!;
          arr[(t + k) * 3 + 2] = arr[t * 3 + 2]!;
        }
      }
      if (original) {
        pos.needsUpdate = true;
        list.push({ mesh, original });
      }
    });
    culled.set(id, list);
    const walls = ctx.pickables.filter((o) => {
      const p = o.userData.pick as { kind: string; id: string } | undefined;
      return p?.kind === 'building' && p.id === id && !o.userData.storyB;
    });
    for (const w of walls) {
      w.visible = false;
      ctx.pickables.splice(ctx.pickables.indexOf(w), 1);
    }
    hiddenWalls.set(id, walls);
  }

  /** The windmill's cap, taken off while the Fold is in ruins (its triangles collapse, then return). */
  let capSaved: Culled[] | null = null;
  function capCull(on: boolean): void {
    if (!props) return;
    if (!on) {
      for (const c of capSaved ?? []) {
        (c.mesh.geometry.attributes.position as THREE.BufferAttribute).array.set(c.original);
        (c.mesh.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      }
      capSaved = null;
      return;
    }
    if (capSaved) return;
    const w = GROVE.buildings.windmill;
    const y0 = groveHeight(w.x, w.z) + 5.0;
    capSaved = [];
    props.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || !(mesh.name === 'roof' || mesh.name === 'timber')) return;
      const pos = mesh.geometry.attributes.position as THREE.BufferAttribute | undefined;
      if (!pos || mesh.geometry.index) return;
      const arr = pos.array as Float32Array;
      let original: Float32Array | null = null;
      for (let t = 0; t + 2 < pos.count; t += 3) {
        const cx = (arr[t * 3]! + arr[t * 3 + 3]! + arr[t * 3 + 6]!) / 3;
        const cy = (arr[t * 3 + 1]! + arr[t * 3 + 4]! + arr[t * 3 + 7]!) / 3;
        const cz = (arr[t * 3 + 2]! + arr[t * 3 + 5]! + arr[t * 3 + 8]!) / 3;
        if (cy < y0 || Math.hypot(cx - w.x, cz - w.z) > 2.2) continue;
        original ??= arr.slice();
        for (let k = 1; k < 3; k++) {
          arr[(t + k) * 3] = arr[t * 3]!;
          arr[(t + k) * 3 + 1] = arr[t * 3 + 1]!;
          arr[(t + k) * 3 + 2] = arr[t * 3 + 2]!;
        }
      }
      if (original) {
        pos.needsUpdate = true;
        capSaved!.push({ mesh, original });
      }
    });
  }

  function ruinGroup(level: number): THREE.Group {
    let g = ruinGroups.get(level);
    if (g || !ctx) return g!;
    g = new THREE.Group();
    g.name = `fold-ruin-${level}`;
    for (const id of STORY_B.fold.buildings) {
      const f = FOLD_HOUSES[id];
      const b = GROVE.buildings[id];
      const built = buildHouse(
        ctx.tex,
        { x: b.x, y: groveHeight(b.x, b.z), z: b.z },
        0,
        f,
        { ...f.style, ruin: level },
        null,
      );
      built.walls.userData.pick = { kind: 'building', id };
      built.walls.userData.storyB = true;
      ctx.pickables.push(built.walls);
      g.add(built.group);
    }
    // More ruins round the square the opening scenes are framed on.
    for (const e of foldExtras()) {
      const f = FOLD_HOUSES[e.kind];
      const sq = markAt('grove', 'fold-square') ?? { x: 0, z: 2 };
      const built = buildHouse(
        ctx.tex,
        { x: e.x, y: groveHeight(e.x, e.z), z: e.z },
        Math.atan2(sq.x - e.x, sq.z - e.z),
        f,
        { ...f.style, ruin: level },
        null,
      );
      g.add(built.group);
    }
    g.visible = false;
    ctx.world3d.add(g);
    void ctx.compile(g);
    ruinGroups.set(level, g);
    return g;
  }

  function buildDawnDusk(c: Dress3dCtx): THREE.Group {
    const D = STORY_B.dawnDusk;
    const g = new THREE.Group();
    g.name = 'dawndusk-b';
    const L = ddLayout();
    g.add(buildGreen(L.centre, L.radius, groveHeight, kitMaterials(c.tex).stone));
    D.houses.forEach((hs, i) => {
      const { x, z, yaw } = L.houses[i]!;
      const size = { w: hs.w, d: hs.w * 0.74, h: hs.w * 0.62 };
      const built = buildHouse(
        c.tex,
        { x, y: groveHeight(x, z), z },
        yaw,
        size,
        { wall: '#f3ebdd', shutter: '#5a8a6a', overhang: 0.4, pitch: 0.6 },
        hs.roof,
        // Raised onto the gable so the carved creature plaque (package k) sits over the door.
        (kit, sz) => crestBoard(kit, hs.crest, { x: 0, y: sz.h + 0.4, z: sz.d / 2 + 0.07 }),
      );
      const stock = D.swapped[i];
      if (stock) {
        built.walls.userData.pick = { kind: 'building', id: stock };
        built.walls.userData.storyB = true;
        c.pickables.push(built.walls);
      }
      g.add(built.group);
    });
    g.visible = false;
    c.world3d.add(g);
    void c.compile(g);
    return g;
  }

  function apply(st: ReturnType<typeof storyBState>): void {
    if (!ctx) return;
    const want = new Set<StockId>();
    if (st.hundred && st.ruin > 0) for (const id of STORY_B.fold.buildings) want.add(id);
    if (st.dawnDusk) for (const id of STORY_B.dawnDusk.swapped) want.add(id);
    for (const id of ['cottage', 'school', 'dojo'] as const) {
      if (want.has(id)) hide(id);
      else restore(id);
    }
    if (ruinShown) ruinShown.visible = false;
    ruinShown = null;
    if (st.hundred && st.ruin > 0) {
      ruinShown = ruinGroup(st.ruin);
      ruinShown.visible = true;
    }
    if (green) green.visible = st.dawnDusk;
    if (blades && bladesStill) {
      blades.visible = !st.sailsStopped;
      bladesStill.visible = st.sailsStopped;
      bladesStill.scale.setScalar(st.ruin >= 3 ? 0.7 : 1);
      bladesStill.rotation.z = st.ruin >= 3 ? 0.55 : 0.35;
      if (st.sailsStopped) capCull(true);
      else capCull(false);
    }
    if (wheel) wheel.group.visible = st.hundred;
    if (sand) sand.visible = st.hundred;
  }

  return {
    id: 'b',
    build(c) {
      ctx = c;
      props = c.world3d.children.find((o) => o.name === 'props') ?? null;
      const mark = markAt('grove', 'gate') ?? { x: 0, z: 23, yaw: Math.PI };
      gate = buildGate(c.tex, false);
      gate.group.position.set(mark.x, groveHeight(mark.x, mark.z), mark.z);
      c.world3d.add(gate.group);
      void c.compile(gate.group);
      // The windmill's sails: a still copy, shown when the Fold's sails have stopped.
      if (props) {
        blades = props.children.find((o) => o.children.some((m) => m.name === 'sail')) ?? null;
        if (blades) {
          bladesStill = blades.clone();
          bladesStill.rotation.z = 0.35;
          bladesStill.visible = false;
          props.add(bladesStill);
        }
      }
      // The mill wheel on the stream between the bridge and the pond.
      const M = STORY_B.mill;
      wheel = buildWheel(c.tex);
      wheel.group.position.set(M.at.x, groveHeight(M.at.x, M.at.z), M.at.z);
      wheel.group.rotation.y = Math.atan2(-1.6, 3.4) + Math.PI / 2;
      wheel.group.visible = false;
      c.world3d.add(wheel.group);
      void c.compile(wheel.group);
      // The shore: grey sand band and the jetty.
      const P = GROVE.pond;
      sand = buildSandRing(
        P,
        P.r - 0.2,
        P.r + STORY_B.shore.sandWidth,
        STORY_B.shore.sand,
        groveHeight,
      );
      sand.visible = false;
      c.world3d.add(sand);
      const J = STORY_B.shore;
      const jx = P.x + Math.cos(J.bearing) * (P.r + 0.5);
      const jz = P.z + Math.sin(J.bearing) * (P.r + 0.5);
      const at = new THREE.Group();
      at.position.set(jx, WATER_LEVEL + 0.28, jz);
      // The jetty runs out from the bank toward the pond's centre.
      at.rotation.y = Math.atan2(P.x - jx, P.z - jz);
      at.visible = false;
      c.world3d.add(at);
      jetty = { boards: new Map(), at };
      green = buildDawnDusk(c);
      // The mill wheel and its millrace in Corvin's garden (the mill chapter's set).
      corvinWheel = buildWheel(c.tex);
      corvinMill = new THREE.Group();
      corvinMill.add(corvinWheel.group);
      corvinWheel.group.position.set(M.corvinAt.x, 0, M.corvinAt.z);
      corvinWheel.group.rotation.y = M.corvinAt.yaw;
      const race = new THREE.Mesh(
        new THREE.PlaneGeometry(1.7, 5.6),
        new THREE.MeshStandardMaterial({
          color: '#4a90cc',
          roughness: 0.25,
          emissive: '#1a3a5a',
          emissiveIntensity: 0.3,
        }),
      );
      race.rotation.x = -Math.PI / 2;
      race.position.set(M.corvinAt.x, 0.05, M.corvinAt.z + 3.1);
      corvinMill.add(race);
      corvinMill.visible = false;
      c.scene.add(corvinMill);
      void c.compile(corvinMill);
    },
    update(world: World, stage: SceneStage, _daylight: Daylight, dt: number) {
      if (!ctx || !gate) return;
      const st = storyBState(world, Object.keys(stage).length ? stage : null);
      // The gate eases to its state, and cuts under reduced motion.
      const target = st.gate.openness;
      shown = ctx.reduceMotion() ? target : shown + (target - shown) * Math.min(1, dt * 2.2);
      gate.setOpenness(shown);
      if (ivyShown !== st.gate.overgrown) {
        ivyShown = st.gate.overgrown;
        gate.setIvy(ivyShown);
      }
      if (tallyShown !== st.gate.tally) {
        tallyShown = st.gate.tally;
        gate.setTally(tallyShown);
        void ctx.compile(gate.group);
      }
      // The Fold, the green, the sails: only when the story's state changes.
      const k = `${st.hundred}|${st.ruin}|${st.dawnDusk}|${st.sailsStopped}`;
      if (k !== key) {
        key = k;
        apply(st);
      }
      if (corvinMill && corvinWheel) {
        corvinMill.visible = st.hundred && world.location === 'corvin';
        corvinWheel.water.visible = st.wheelTurns;
        if (corvinMill.visible && st.wheelTurns && !ctx.reduceMotion())
          corvinWheel.pivot.rotation.x -= dt * STORY_B.mill.speed;
      }
      if (wheel && st.hundred) {
        wheel.water.visible = st.wheelTurns;
        if (st.wheelTurns && !ctx.reduceMotion()) wheel.pivot.rotation.x -= dt * STORY_B.mill.speed;
      }
      // The jetty: the boards missing until the shore chapter is mended.
      if (jetty) {
        jetty.at.visible = st.hundred;
        const jk = String(st.jettyMended);
        if (st.hundred && jk !== jettyKey) {
          jettyKey = jk;
          for (const g of jetty.boards.values()) g.visible = false;
          let g = jetty.boards.get(st.jettyMended);
          if (!g) {
            g = buildJetty(ctx.tex, st.jettyMended ? [] : STORY_B.shore.missing);
            jetty.boards.set(st.jettyMended, g);
            jetty.at.add(g);
            void ctx.compile(g);
          }
          g.visible = true;
        }
      }
    },
    dispose() {
      ctx = null;
    },
  };
})();
