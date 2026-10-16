import * as THREE from 'three';
import { buildEmoteSheet, type EmoteShape } from '../render/sprites/emote';
import { frameKey } from '../render/sprites/animations';
import { emoteFor } from '../render/world-view';
import type { PoseName, Rigged } from '../samples/species';
import type { Item, Nubbin, Vec2, World } from '../sim/types';
import { CreaturePool, keeperLook, nubbinLook } from './creature-pool';
import { stubOnce } from './stubs';

/**
 * Everything that moves in the 3D Grove: the Nubbins and the Keeper as pooled rigs,
 * eggs and cocoons as simple shells, items as small props, the emote ball over each
 * head, the highlight ring under the thing under the pointer, and tap sparkles.
 * Positions are interpolated between sim steps, as the pixel view does.
 */
interface Snapshot {
  pos: Vec2;
  y: number;
}

interface Actor {
  key: string;
  rig: Rigged | null;
  /** The egg or cocoon shell shown instead of a rig for those stages. */
  shell: THREE.Mesh | null;
  prev: Snapshot;
  pose: PoseName;
  emote: THREE.Sprite;
  emoteShape: EmoteShape;
}

const EGG_COLORS: Record<string, string> = {
  plain: '#f3efe2',
  red: '#f08a7a',
  blue: '#8ab8f0',
  yellow: '#f0dc7a',
  green: '#9ad08a',
  pink: '#f0a0c8',
  purple: '#b89af0',
  black: '#4a4a58',
  white: '#ffffff',
  orange: '#f0b070',
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Sim behaviour and handling, mapped to the species format's poses. */
export function poseFor(n: Nubbin, moving: boolean, petted: boolean): PoseName {
  if (petted) return 'pet';
  switch (n.behavior.state) {
    case 'held':
    case 'carried':
      return 'pet';
    case 'nap':
    case 'shelter':
      return 'sleep';
    case 'eat':
      return 'eat';
    case 'play':
    case 'greet':
    case 'court':
    case 'perform':
    case 'fetch':
      return 'happy';
    case 'cry':
      stubOnce('pose:sad', 'cry shows the idle pose');
      return 'idle';
    case 'swim':
      stubOnce('pose:swim', 'swimming shows the walk pose');
      return moving ? 'walk' : 'idle';
    case 'thrown':
      return 'idle';
    default:
      return moving ? 'walk' : 'idle';
  }
}

export class Actors {
  readonly group = new THREE.Group();
  readonly pool = new CreaturePool();
  private readonly nubbins = new Map<string, Actor>();
  private readonly items = new Map<string, { mesh: THREE.Mesh; prev: Snapshot }>();
  private readonly memorials = new Map<string, THREE.Group>();
  private keeper: { key: string; rig: Rigged } | null = null;
  private keeperPrev: Vec2 = { x: 0, z: 0 };
  private keeperMoving = false;
  private readonly emoteMats = new Map<string, THREE.SpriteMaterial>();
  private readonly highlight: THREE.Mesh;
  private highlightId: string | null = null;
  private readonly sparks: Array<{ p: THREE.Vector3; v: THREE.Vector3; born: number }> = [];
  private readonly sparkPoints: THREE.Points;
  private readonly sparkPos: THREE.BufferAttribute;
  private readonly tmp = new THREE.Vector3();
  /** Ground height for feet: the terrain in the Grove, flat elsewhere. */
  ground: (x: number, z: number) => number = () => 0;

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
    this.group.name = 'actors';
    // The emote ball frames come from the pixel sheet, one sprite material per frame.
    const sheet = buildEmoteSheet();
    const image = sheet.texture.image as HTMLCanvasElement;
    for (const [key, rect] of sheet.frames) {
      const c = document.createElement('canvas');
      c.width = rect.w;
      c.height = rect.h;
      const ctx = c.getContext('2d');
      ctx?.drawImage(image, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
      const tex = new THREE.CanvasTexture(c);
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
      this.emoteMats.set(key, new THREE.SpriteMaterial({ map: tex, depthTest: true, fog: false }));
    }
    sheet.dispose();
    this.highlight = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.72, 32),
      new THREE.MeshBasicMaterial({
        color: '#ffe680',
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.highlight.rotation.x = -Math.PI / 2;
    this.highlight.visible = false;
    this.group.add(this.highlight);
    const max = 96;
    this.sparkPos = new THREE.BufferAttribute(new Float32Array(max * 3), 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', this.sparkPos);
    geo.setDrawRange(0, 0);
    this.sparkPoints = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: '#fff2a8',
        size: 0.14,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      }),
    );
    this.sparkPoints.frustumCulled = false;
    this.group.add(this.sparkPoints);
  }

  /** Build the Keeper and the child first, so the opening seconds do not stall. */
  warm(world: World): void {
    const looks = [keeperLook(world.keeper)];
    for (const n of world.nubbins) looks.push(nubbinLook(n));
    const seen = new Set<string>();
    this.pool.warm(
      looks.filter((l) => {
        if (seen.has(l.key)) return false;
        seen.add(l.key);
        return true;
      }),
    );
  }

  snapshot(world: World): void {
    for (const n of world.nubbins) {
      const a = this.nubbins.get(n.id);
      if (a) {
        a.prev.pos.x = n.pos.x;
        a.prev.pos.z = n.pos.z;
        a.prev.y = n.y;
      }
    }
    for (const i of world.items) {
      const v = this.items.get(i.id);
      if (v) {
        v.prev.pos.x = i.pos.x;
        v.prev.pos.z = i.pos.z;
        v.prev.y = i.y;
      }
    }
    this.keeperPrev.x = world.keeper.pos.x;
    this.keeperPrev.z = world.keeper.pos.z;
  }

  keeperDrawPos(world: World, alpha: number): Vec2 {
    return {
      x: lerp(this.keeperPrev.x, world.keeper.pos.x, alpha),
      z: lerp(this.keeperPrev.z, world.keeper.pos.z, alpha),
    };
  }

  setHighlight(hit: { kind: string; id: string } | null): void {
    this.highlightId = hit && (hit.kind === 'nubbin' || hit.kind === 'item') ? hit.id : null;
  }

  sparkle(x: number, z: number, y: number, nowMs: number): void {
    for (let i = 0; i < 8 && this.sparks.length < 96; i++) {
      const a = (i / 8) * Math.PI * 2;
      this.sparks.push({
        p: new THREE.Vector3(x, this.ground(x, z) + y, z),
        v: new THREE.Vector3(Math.cos(a) * 0.9, 1.4 + (i % 3) * 0.3, Math.sin(a) * 0.9),
        born: nowMs,
      });
    }
  }

  /** Nubbins picked by a ray: the nearest sphere around a figure, if any. */
  pick(ray: THREE.Ray): { kind: 'nubbin' | 'item'; id: string } | null {
    const sphere = new THREE.Sphere();
    let best: { kind: 'nubbin' | 'item'; id: string; d: number } | null = null;
    const test = (
      kind: 'nubbin' | 'item',
      id: string,
      o: THREE.Object3D,
      r: number,
      lift: number,
    ) => {
      sphere.center.copy(o.position);
      sphere.center.y += lift;
      sphere.radius = r;
      if (!ray.intersectSphere(sphere, this.tmp)) return;
      const d = this.tmp.distanceTo(ray.origin);
      if (!best || d < best.d) best = { kind, id, d };
    };
    for (const [id, a] of this.nubbins) {
      const o = a.rig?.group ?? a.shell;
      if (!o) continue;
      const r = a.rig
        ? Math.max(
            0.55,
            ((a.rig.group.userData.footprint as number) ?? 0.4) * a.rig.group.scale.x * 1.4,
          )
        : 0.5;
      test('nubbin', id, o, r, a.rig ? 0.6 : 0.4);
    }
    for (const [id, i] of this.items) test('item', id, i.mesh, 0.4, 0.1);
    return best
      ? { kind: (best as { kind: 'nubbin' | 'item' }).kind, id: (best as { id: string }).id }
      : null;
  }

  private shell(stage: 'egg' | 'cocoon', n: Nubbin): THREE.Mesh {
    const color = stage === 'egg' ? (EGG_COLORS[n.eggColor] ?? '#f3efe2') : '#d8c8f0';
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 20, 16),
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: stage === 'egg' ? 0.5 : 0.15,
        clearcoat: stage === 'egg' ? 0.3 : 1,
        transmission: stage === 'egg' ? 0 : 0.35,
        thickness: 0.6,
        emissive: stage === 'egg' ? '#000000' : '#8a70c0',
        emissiveIntensity: stage === 'egg' ? 0 : 0.5,
      }),
    );
    mesh.scale.set(0.85, 1.1, 0.85);
    mesh.castShadow = true;
    return mesh;
  }

  private ensureNubbin(n: Nubbin): Actor {
    const want = n.stage === 'egg' || n.stage === 'cocoon' ? `shell:${n.stage}` : nubbinLook(n).key;
    let a = this.nubbins.get(n.id);
    if (a && a.key !== want) {
      this.drop(n.id);
      a = undefined;
    }
    if (a) return a;
    const emote = new THREE.Sprite(this.emoteMats.get(frameKey('ball', 'front', 0)));
    emote.scale.setScalar(0.42);
    emote.visible = false;
    this.group.add(emote);
    const actor: Actor = {
      key: want,
      rig: null,
      shell: null,
      prev: { pos: { x: n.pos.x, z: n.pos.z }, y: n.y },
      pose: 'idle',
      emote,
      emoteShape: 'none',
    };
    if (n.stage === 'egg' || n.stage === 'cocoon') {
      actor.shell = this.shell(n.stage, n);
      this.group.add(actor.shell);
    } else {
      actor.rig = this.pool.acquire(nubbinLook(n));
      actor.rig.ground = this.ground;
      actor.rig.setPose('idle');
      this.group.add(actor.rig.group);
      if (n.shiny || n.tone) stubOnce('look:shiny-or-tone', 'colour variants use the base look');
    }
    this.nubbins.set(n.id, actor);
    return actor;
  }

  private drop(id: string): void {
    const a = this.nubbins.get(id);
    if (!a) return;
    if (a.rig) this.pool.release(a.key, a.rig);
    a.shell?.removeFromParent();
    a.emote.removeFromParent();
    this.nubbins.delete(id);
  }

  private ensureKeeper(world: World): Rigged {
    const look = keeperLook(world.keeper);
    if (this.keeper && this.keeper.key !== look.key) {
      this.pool.release(this.keeper.key, this.keeper.rig);
      this.keeper = null;
    }
    if (!this.keeper) {
      const rig = this.pool.acquire(look);
      rig.ground = this.ground;
      rig.setPose('idle');
      this.group.add(rig.group);
      this.keeper = { key: look.key, rig };
    }
    return this.keeper.rig;
  }

  private itemMesh(i: Item): THREE.Mesh {
    let mesh: THREE.Mesh;
    if (i.kind === 'fruit') {
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 14, 10),
        new THREE.MeshPhysicalMaterial({ color: '#ff8a2a', roughness: 0.35, clearcoat: 0.6 }),
      );
    } else if (i.kind === 'toy') {
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 14, 10),
        new THREE.MeshStandardMaterial({ color: '#e04a6a', roughness: 0.6 }),
      );
      stubOnce('item:toy', 'every toy is a red ball');
    } else {
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.06, 0.46),
        new THREE.MeshStandardMaterial({ color: '#f0e6c8', roughness: 0.8 }),
      );
    }
    mesh.castShadow = true;
    return mesh;
  }

  update(world: World, alpha: number, nowMs: number, dt: number, cameraPos: THREE.Vector3): void {
    const t = nowMs / 1000;
    const keeper = world.keeper;
    const petting = keeper.intent?.kind === 'pet' ? keeper.intent.nubbinId : null;
    // Pixel-mode layers without a 3D counterpart yet, noted once each.
    if (world.npcs.length > 0) stubOnce('npcs', 'visiting trainers are not drawn');
    if (world.strays.length > 0) stubOnce('strays', 'Shadow strays are not drawn');
    if (world.plants.length > 0) stubOnce('plants', 'planted beds are not drawn');
    if (world.placed.length > 0) stubOnce('decor:placed', 'placed decor is not drawn');
    if (Object.keys(world.tiles).length > 0) stubOnce('tiles', 'painted tiles are not drawn');
    if (world.grove !== 'main')
      stubOnce(`grove:${world.grove}`, 'the Sun and Moon Groves use the main colours');

    // Nubbins.
    const live = new Set<string>();
    for (const n of world.nubbins) {
      live.add(n.id);
      const a = this.ensureNubbin(n);
      const x = lerp(a.prev.pos.x, n.pos.x, alpha);
      const z = lerp(a.prev.pos.z, n.pos.z, alpha);
      const y = lerp(a.prev.y, n.y, alpha);
      const gy = this.ground(x, z);
      const o = a.rig?.group ?? a.shell!;
      const moving = Math.hypot(n.pos.x - a.prev.pos.x, n.pos.z - a.prev.pos.z) > 0.004;
      if (a.rig) {
        const near = Math.hypot(keeper.pos.x - n.pos.x, keeper.pos.z - n.pos.z) < 1.5;
        const pose = poseFor(n, moving, petting === n.id && near);
        if (pose !== a.pose) {
          a.pose = pose;
          a.rig.setPose(pose);
        }
        o.position.set(x, gy + y, z);
        a.rig.ground = y > 0.01 ? () => gy + y : this.ground;
        a.rig.face(n.facing);
        a.rig.lookAt =
          pose === 'pet' ? this.tmp.set(keeper.pos.x, gy + 1.0, keeper.pos.z).clone() : null;
        a.rig.animate(t);
      } else if (a.shell) {
        o.position.set(x, gy + 0.46 + y, z);
        if (n.stage === 'egg') o.rotation.z = Math.sin(t * 2.2 + x) * 0.06;
        else o.rotation.y = t * 0.4;
      }
      // The emote ball over the head: the same choice the pixel view makes.
      const shape = n.stage === 'egg' || n.stage === 'cocoon' ? 'none' : emoteFor(n);
      if (shape !== a.emoteShape) {
        a.emoteShape = shape;
        const mat = this.emoteMats.get(frameKey(shape, 'front', 0));
        a.emote.visible = shape !== 'none' && !!mat;
        if (mat) a.emote.material = mat;
      }
      if (a.emote.visible) {
        const head = a.rig?.bones.head;
        if (head) {
          head.getWorldPosition(this.tmp);
          a.emote.position.set(this.tmp.x, this.tmp.y + 0.48 + Math.sin(t * 2) * 0.03, this.tmp.z);
        } else a.emote.position.set(x, gy + y + 1.2, z);
      }
    }
    for (const id of [...this.nubbins.keys()]) if (!live.has(id)) this.drop(id);

    // The Keeper.
    const rig = this.ensureKeeper(world);
    const kp = this.keeperDrawPos(world, alpha);
    const kMoving =
      Math.hypot(keeper.pos.x - this.keeperPrev.x, keeper.pos.z - this.keeperPrev.z) > 0.004;
    this.keeperMoving = kMoving;
    const kPose: PoseName = keeper.carrying
      ? 'carry'
      : petting &&
          Math.hypot(
            keeper.pos.x - (world.nubbins.find((n) => n.id === petting)?.pos.x ?? 1e9),
            0,
          ) < 1.5
        ? 'pet'
        : this.keeperMoving
          ? 'walk'
          : 'idle';
    if (kPose !== (rig.group.userData.pose as PoseName | undefined)) {
      rig.group.userData.pose = kPose;
      rig.setPose(kPose);
    }
    rig.group.position.set(kp.x, this.ground(kp.x, kp.z), kp.z);
    rig.face(keeper.facing);
    rig.animate(t);

    // Items.
    const liveItems = new Set<string>();
    for (const i of world.items) {
      liveItems.add(i.id);
      let v = this.items.get(i.id);
      if (!v) {
        v = { mesh: this.itemMesh(i), prev: { pos: { x: i.pos.x, z: i.pos.z }, y: i.y } };
        this.group.add(v.mesh);
        this.items.set(i.id, v);
      }
      const x = lerp(v.prev.pos.x, i.pos.x, alpha);
      const z = lerp(v.prev.pos.z, i.pos.z, alpha);
      v.mesh.position.set(x, this.ground(x, z) + 0.2 + lerp(v.prev.y, i.y, alpha), z);
    }
    for (const [id, v] of [...this.items]) {
      if (liveItems.has(id)) continue;
      v.mesh.removeFromParent();
      this.items.delete(id);
    }

    // Memorial flowers on the hill.
    for (const m of world.memorials) {
      if (this.memorials.has(m.id)) continue;
      const g = new THREE.Group();
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.04, 0.5, 6),
        new THREE.MeshStandardMaterial({ color: '#4f8a3a' }),
      );
      stem.position.y = 0.25;
      const bloom = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 10, 8),
        new THREE.MeshStandardMaterial({
          color: '#ffd1e8',
          emissive: '#ff9ecb',
          emissiveIntensity: 0.4,
        }),
      );
      bloom.position.y = 0.55;
      g.add(stem, bloom);
      g.position.set(m.pos.x, this.ground(m.pos.x, m.pos.z), m.pos.z);
      this.group.add(g);
      this.memorials.set(m.id, g);
    }

    // The highlight ring.
    const hl = this.highlightId;
    const target = hl
      ? (this.nubbins.get(hl)?.rig?.group ??
        this.nubbins.get(hl)?.shell ??
        this.items.get(hl)?.mesh)
      : null;
    this.highlight.visible = !!target;
    if (target) {
      this.highlight.position.set(
        target.position.x,
        this.ground(target.position.x, target.position.z) + 0.04,
        target.position.z,
      );
      (this.highlight.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(t * 6) * 0.25;
    }

    // Sparkles.
    let n = 0;
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i]!;
      if (nowMs - s.born > 700) {
        this.sparks.splice(i, 1);
        continue;
      }
      s.v.y -= 3.2 * dt;
      s.p.addScaledVector(s.v, dt);
      this.sparkPos.setXYZ(n++, s.p.x, s.p.y, s.p.z);
    }
    this.sparkPos.needsUpdate = true;
    this.sparkPoints.geometry.setDrawRange(0, n);
    void cameraPos;
  }

  /** Creatures pushing the grass: positions and footprints, nearest to the camera first. */
  pushers(): Array<{ x: number; z: number; r: number }> {
    const out: Array<{ x: number; z: number; r: number }> = [];
    if (this.keeper) {
      const g = this.keeper.rig.group;
      out.push({
        x: g.position.x,
        z: g.position.z,
        r: ((g.userData.footprint as number) ?? 0.4) * g.scale.x * 1.6,
      });
    }
    for (const a of this.nubbins.values()) {
      if (!a.rig) continue;
      const g = a.rig.group;
      out.push({
        x: g.position.x,
        z: g.position.z,
        r: ((g.userData.footprint as number) ?? 0.35) * g.scale.x * 1.6,
      });
    }
    return out;
  }

  dispose(): void {
    for (const id of [...this.nubbins.keys()]) this.drop(id);
    for (const m of this.emoteMats.values()) {
      m.map?.dispose();
      m.dispose();
    }
    this.group.removeFromParent();
  }
}
