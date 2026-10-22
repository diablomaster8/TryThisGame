import * as THREE from 'three';
import {
  buntingShape,
  DRESSING_FLAGS,
  dungeonTorchesLit,
  RACE_LOOK,
  type Season,
} from '../config/campaign-look';
import type { BuntingShape } from '../config/campaign-look';
import { markAt } from '../config/stage-marks';
import { LANTERN_POSTS } from '../config/tuning';
import { LOOK_F } from '../config/tuning-f';
import { driveCampaign, disposeLook } from '../ui/title-card';
import { townUnlocks, type TownUnlocks } from '../sim/town';
import type { World } from '../sim/types';
import type { Dressing3d, Dress3dCtx } from './dressings';
import { storyPropModel } from './garden';
import {
  buildBanners,
  buildBunting,
  buildCart,
  buildHoloFence,
  buildMotes,
  buildPicnic,
  buildPlums,
  buildRootRoom,
  buildScoreboard,
  buildTorches,
  buildWeatherMachine,
  WAVE,
  type Motes,
} from './dress-f-sets';
import { kitCabin } from './kit-buildings';
import { groveHeight } from './terrain';
import { Village } from './village';

/**
 * Campaign-graphics package f, Full 3D: its story dressing (see the registry contract at
 * the top of render3d/dressings.ts). Every frame it hands the story moment to
 * `driveCampaign` (the campaign grade, staged season and weather, the pale seed, the title
 * card: screen layers shared with the pixel view), then shows the sets that moment calls for:
 * Hazel's ch12 festival (stalls, bunting by the ending, cloth, cake, buns), the Hundred Days'
 * picnic, the Beetle Road's guard house, banners, cart and weather machine, Logged In's
 * scoreboard, holographic fence and white Root Node room, and ch5's plum tree with wasps and
 * the fireflies of c8. It reads the world and never writes it.
 */

let ctx: Dress3dCtx | null = null;
let root: THREE.Group | null = null;
const g = {
  festival: null as THREE.Group | null,
  picnic: null as THREE.Group | null,
  beetle: null as THREE.Group | null,
  logged: null as THREE.Group | null,
  room: null as THREE.Group | null,
};
let bunting: ReturnType<typeof buildBunting> | null = null;
let buntingKey: BuntingShape | null = null;
let village: Village | null = null;
let plums: THREE.InstancedMesh | null = null;
let plumTree = '';
let wasps: Motes | null = null;
let flies: Motes | null = null;
let vane: THREE.Object3D | null = null;
let holo: ReturnType<typeof buildHoloFence> | null = null;
let clock = 0;
let torches: ReturnType<typeof buildTorches> | null = null;
let treeScan = 0;
const treeParts = {
  crowns: [] as Array<{ mesh: THREE.InstancedMesh; count: number }>,
  fruit: [] as THREE.Mesh[],
  grass: [] as THREE.MeshStandardMaterial[],
};
const disposables: Array<() => void> = [];

function place(o: THREE.Object3D, x: number, z: number, yaw = 0): void {
  o.position.set(x, groveHeight(x, z), z);
  o.rotation.y = yaw;
}

export const dress3dF: Dressing3d = {
  id: 'f',
  build(c) {
    ctx = c;
    clock = 0;
    root = new THREE.Group();
    root.name = 'dress-f';
    c.world3d.add(root);
    const sub = (name: string): THREE.Group => {
      const s = new THREE.Group();
      s.name = `dress-f-${name}`;
      s.visible = false;
      root!.add(s);
      return s;
    };
    g.festival = sub('festival');
    g.picnic = sub('picnic');
    g.beetle = sub('beetle');
    g.logged = sub('logged');
    g.room = sub('room');

    // Festival: the village stalls (mine, shown only where the square has not unlocked its own),
    // the cloth with the collapsed cake and the buns.
    village = new Village(g.festival, c.tex, groveHeight);
    const fest = buildPicnic({ cake: true, basket: false });
    place(fest, 0.5, 2.5, 0.2);
    g.festival.add(fest);

    // The Hundred Days' meadow: the same cloth and a basket.
    const meadow = buildPicnic({ cake: false, basket: true });
    const fm = markAt('grove', 'fold-square') ?? { x: 0, z: 2, yaw: 0 };
    place(meadow, fm.x + 1.5, fm.z + 1.2, -0.3);
    g.picnic.add(meadow);

    // The Beetle Road: guard house with three banners, the cart under its tarp, the machine.
    const gh = markAt('grove', 'guardhouse') ?? { x: -3, z: 20, yaw: 0 };
    const cab = LOOK_F.beetle.cabin;
    const cabin = kitCabin(c.tex, cab, { window: true, doorW: 1 });
    place(cabin, gh.x, gh.z);
    const bans = buildBanners();
    const spots: Array<[number, number, number, number]> = [
      [-cab.w / 2 + 0.55, cab.h - 0.35, cab.d / 2 + 0.07, 0],
      [cab.w / 2 - 0.55, cab.h - 0.35, cab.d / 2 + 0.07, 0],
      [cab.w / 2 + 0.07, cab.h - 0.35, 0, Math.PI / 2],
    ];
    bans.forEach((b, i) => {
      const s = spots[i]!;
      b.position.set(s[0], s[1], s[2]);
      b.rotation.y = s[3];
      cabin.add(b);
    });
    g.beetle.add(cabin);
    const cart = buildCart();
    place(cart, LOOK_F.beetle.cart.x, LOOK_F.beetle.cart.z, -0.5);
    g.beetle.add(cart);
    const m = buildWeatherMachine();
    place(m.group, LOOK_F.beetle.machine.x, LOOK_F.beetle.machine.z, 0.4);
    vane = m.vane;
    g.beetle.add(m.group);

    // Logged In: the lobby scoreboard and the holographic fence.
    const board = buildScoreboard();
    const bm = markAt('grove', 'board') ?? { x: 3, z: -2, yaw: 0 };
    place(board, bm.x, bm.z);
    g.logged.add(board);
    holo = buildHoloFence(groveHeight);
    g.logged.add(holo.mesh);

    // The white room, with one chair on the Root Node's mark.
    const rm = markAt('grove', 'root-chair') ?? { x: -3, z: -2.5, yaw: 0 };
    const room = buildRootRoom();
    place(room, rm.x, rm.z);
    const chair = storyPropModel('chair');
    chair.position.set(0, 0.04, 0);
    chair.scale.setScalar(1.6);
    room.add(chair);
    g.room.add(room);

    // Plums and motes.
    plums = buildPlums();
    plums.visible = false;
    root.add(plums);
    wasps = buildMotes(LOOK_F.wasps.count, '#ffd23a', 0.16);
    flies = buildMotes(LOOK_F.fireflies.count, '#ffe08a', 0.3);
    root.add(wasps.points, flies.points);
    torches = buildTorches();
    root.add(torches.group);
    treeParts.crowns = [];
    treeParts.fruit = [];
    treeParts.grass = [];
    treeScan = 0;

    void c.compile(root);
    disposables.push(
      () => wasps?.dispose(),
      () => flies?.dispose(),
    );
  },

  update(world: World, stage, _daylight, dt) {
    if (!ctx || !root) return;
    const reduce = ctx.reduceMotion();
    clock += dt;
    const m = driveCampaign(world, stage, reduce);
    const s = m.sets;
    DRESSING_FLAGS.dungeon.torches =
      dungeonTorchesLit(m.flags.campaign, m.flags.storyChapter) || m.below;
    RACE_LOOK.story = m.flags.campaign === 'hazel' && m.flags.chapter === 5;

    g.festival!.visible = s.festival;
    g.picnic!.visible = s.picnic;
    g.beetle!.visible = s.beetle;
    g.logged!.visible = s.logged;
    g.room!.visible = s.rootRoom;

    // Festival: stalls unless the square already has its own, and bunting by the ending.
    if (s.festival) {
      const own = townUnlocks(world);
      const show: TownUnlocks = {
        stall: !own.stall,
        attendant: !own.attendant,
        festival: !own.festival,
        gym: false,
        fortune: false,
      };
      village?.update(show);
      const shape = buntingShape(m.ending, m.finalChoice);
      if (shape !== buntingKey) {
        if (bunting) {
          g.festival!.remove(bunting.group);
          bunting.dispose();
        }
        bunting = buildBunting(LANTERN_POSTS, groveHeight, shape);
        buntingKey = shape;
        g.festival!.add(bunting.group);
        void ctx.compile(bunting.group);
      }
      if (ctx.lampsOn())
        ctx.lamps.push({
          x: 0.5,
          y: 2.6,
          z: 1,
          color: '#ffb86b',
          intensity: 4,
          distance: 16,
          decay: 1.5,
        });
    }

    // The Beetle Road's below grade: standing torches round the Keeper, flames still when reduced.
    if (torches) {
      torches.group.visible = m.below;
      if (m.below) {
        const k = world.keeper.pos;
        torches.group.children.forEach((t, i) => {
          const a = Math.PI / 4 + (i * Math.PI) / 2;
          const x = k.x + Math.cos(a) * 3.4;
          const z = k.z + Math.sin(a) * 3.4;
          t.position.set(x, groveHeight(x, z), z);
        });
        torches.flames.forEach((f, i) => {
          f.scale.y = reduce ? 1 : 1 + 0.18 * Math.sin(clock * 9 + i * 2);
        });
        if (ctx.lampsOn())
          ctx.lamps.push({
            x: k.x,
            y: 1.8,
            z: k.z,
            color: '#ff9a3c',
            intensity: 6,
            distance: 12,
            decay: 1.4,
          });
      }
    }
    seasonTrees(ctx, world, m.season);

    // Beetle Road: the banners wave and the vane turns, or stand still.
    WAVE.value = reduce ? 0 : clock;
    if (vane) vane.rotation.y = reduce ? 0.6 : clock * 0.9;
    if (holo) {
      holo.uniforms.uTime.value = clock;
      holo.uniforms.uStill.value = reduce ? 1 : 0;
    }

    // Plums on the tree nearest the gate during chapter 5; wasps only when motion is allowed.
    const tree = s.plums ? nearestTree(world) : null;
    if (plums) {
      plums.visible = !!tree;
      if (tree && tree.id !== plumTree) {
        plumTree = tree.id;
        layoutPlums(plums, tree.pos.x, tree.pos.z);
      }
    }
    if (wasps) {
      wasps.points.visible = !!tree && !reduce;
      if (wasps.points.visible && tree) swarm(wasps, tree.pos.x, tree.pos.z, clock);
    }
    if (flies) {
      flies.points.visible = m.fx.fireflies && !reduce;
      if (flies.points.visible) drift(flies, world.keeper.pos.x, world.keeper.pos.z, clock);
    }
  },

  dispose() {
    if (bunting) bunting.dispose();
    for (const d of disposables) d();
    disposables.length = 0;
    bunting = null;
    buntingKey = null;
    village = null;
    plums = null;
    plumTree = '';
    wasps = null;
    flies = null;
    vane = null;
    holo = null;
    torches = null;
    root = null;
    ctx = null;
    disposeLook();
  },
};

function nearestTree(world: World): { id: string; pos: { x: number; z: number } } | null {
  let best: { id: string; pos: { x: number; z: number } } | null = null;
  let bd = Infinity;
  for (const t of world.trees) {
    const d = Math.hypot(t.pos.x - LOOK_F.plumNear.x, t.pos.z - LOOK_F.plumNear.z);
    if (d < bd) {
      bd = d;
      best = t;
    }
  }
  return best;
}

/** Plums among the crown's lower leaves and a scatter fallen on the grass. */
function layoutPlums(mesh: THREE.InstancedMesh, x: number, z: number): void {
  const y0 = groveHeight(x, z);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const sc = new THREE.Vector3(1, 1, 1);
  const crown = 14;
  for (let i = 0; i < mesh.count; i++) {
    const a = i * 2.399;
    if (i < crown) {
      const r = 0.7 + ((i * 37) % 10) * 0.07;
      m4.compose(
        new THREE.Vector3(
          x + Math.cos(a) * r,
          y0 + 1.9 + ((i * 53) % 10) * 0.07,
          z + Math.sin(a) * r,
        ),
        q,
        sc,
      );
    } else {
      const r = 0.5 + ((i * 29) % 10) * 0.11;
      m4.compose(new THREE.Vector3(x + Math.cos(a) * r, y0 + 0.1, z + Math.sin(a) * r), q, sc);
    }
    mesh.setMatrixAt(i, m4);
  }
  mesh.instanceMatrix.needsUpdate = true;
}

/** Five wasps buzzing round the crown in tight, jittering loops. */
function swarm(m: Motes, x: number, z: number, t: number): void {
  const w = LOOK_F.wasps;
  const y0 = groveHeight(x, z);
  for (let i = 0; i < w.count; i++) {
    const a = t * w.speed * (0.8 + i * 0.13) + i * 1.9;
    const r = w.radius * (0.7 + 0.3 * Math.sin(t * 2.1 + i));
    m.positions[i * 3] = x + Math.cos(a) * r;
    m.positions[i * 3 + 1] = y0 + w.height + Math.sin(t * 5 + i * 2) * 0.3;
    m.positions[i * 3 + 2] = z + Math.sin(a) * r;
  }
  (m.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
}

/** Fireflies hovering and wandering about the Keeper on the walk back. */
function drift(m: Motes, x: number, z: number, t: number): void {
  const f = LOOK_F.fireflies;
  for (let i = 0; i < f.count; i++) {
    const a = i * 2.399 + t * 0.08 * (1 + (i % 3) * 0.3);
    const r = 1.5 + (((i * 37) % 100) / 100) * f.radius + Math.sin(t * 0.5 + i) * 0.6;
    const px = x + Math.cos(a) * r;
    const pz = z + Math.sin(a) * r;
    m.positions[i * 3] = px;
    m.positions[i * 3 + 1] =
      groveHeight(px, pz) + 0.4 + (0.5 + 0.5 * Math.sin(t * 0.8 + i * 1.3)) * f.height;
    m.positions[i * 3 + 2] = pz;
  }
  (m.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
}

const TREE_TINT: Record<Season, { color: string; leaves: number; fruit: boolean }> = {
  spring: { color: '#f0ffd8', leaves: 1, fruit: true },
  summer: { color: '#ffffff', leaves: 1, fruit: true },
  autumn: { color: '#ffa848', leaves: 0.8, fruit: true },
  winter: { color: '#e4eef8', leaves: 0.22, fruit: false },
};

/**
 * The drawn season on the fruit trees: leaf tint, fewer leaves and no fruit in winter. The
 * crowns and fruit are found by shape once the trees exist, and restored when no season shows.
 */
function seasonTrees(c: Dress3dCtx, _world: World, season: { season: Season } | null): void {
  if ((!treeParts.crowns.length || !treeParts.grass.length) && clock - treeScan > 2) {
    treeScan = clock;
    c.world3d.traverse((o) => {
      const m = o as THREE.InstancedMesh;
      const mat = m.material as THREE.MeshStandardMaterial | undefined;
      if (m.isInstancedMesh && mat?.map && m.instanceColor && m.castShadow && m.count > 50)
        if (!treeParts.crowns.some((t) => t.mesh === m))
          treeParts.crowns.push({ mesh: m, count: m.count });
      if (m.isInstancedMesh && mat?.map === c.tex.tuft && !treeParts.grass.includes(mat))
        treeParts.grass.push(mat);
      const f = o as THREE.Mesh;
      const fm = f.material as THREE.MeshPhysicalMaterial | undefined;
      if (f.isMesh && fm?.isMeshPhysicalMaterial && fm.color.getHexString() === 'ff8a2a')
        if (!treeParts.fruit.includes(f)) treeParts.fruit.push(f);
    });
  }
  const want = season ? TREE_TINT[season.season] : null;
  for (const t of treeParts.crowns) {
    (t.mesh.material as THREE.MeshStandardMaterial).color.set(want?.color ?? '#ffffff');
    t.mesh.count = Math.max(1, Math.round(t.count * (want?.leaves ?? 1)));
  }
  // The meadow: frosted pale in winter, straw-gold in autumn.
  const g = season?.season;
  for (const gm of treeParts.grass) {
    gm.color.set(g === 'winter' ? '#c8d8e6' : g === 'autumn' ? '#e8c070' : '#ffffff');
    gm.emissive.set(g === 'winter' ? '#7f98b4' : '#000000');
    gm.emissiveIntensity = g === 'winter' ? 0.5 : 1;
  }
  for (const f of treeParts.fruit) f.scale.setScalar(want && !want.fruit ? 0.0001 : 1);
}
