import * as THREE from 'three';
import { BATTLE_TEXT } from '../config/strings-battle';
import { GROVE3D } from '../config/tuning';
import { BATTLE3D as B } from '../config/tuning-battle-3d';
import type { BattleCast, BattleFrame, BattleView } from '../minigames/battle/view';
import { speciesArt } from '../render/sprites/species-art';
import { pbr, repeatUv, shadowed } from '../samples/aaa-kit';
import { variantById } from '../samples/nubbin-variant-catalogue';
import type { PoseName, Rigged } from '../samples/species';
import { ROSTER } from '../samples/species-roster';
import { moveById, type BattleEvent, type BattleState, type Combatant } from '../sim/battle';
import { HOLLOW_BATTLE_SOURCE } from '../sim/dungeon-encounters';
import { idleKind, idlePose, reducedMotion, type IdleKind } from '../ui/battle-idle';
import { el } from '../ui/dom';
import { nubbinLook, type Look } from './creature-pool';
import type { Grove3dScene } from './grove-3d-scene';
import { MiniStage } from './minigame-stage';

/**
 * The battle stage in Full 3D (R0219, FIGHT-07): each side's shown combatant as its own rig
 * from the creature pool (a Nubbin in its own look, a rival in its species' or Hollow family's
 * look), standing on a small arena by bout kind (the dojo's boards and mats, a Grove meadow, the
 * Hollow's rock, a story's night), drawn with the Grove's renderer into the game canvas under
 * the see-through stage box, framed to that box. It plays the same beats the pixel stage does
 * (the wind-up lunge, the hit shake, the dodge, the walk home, the trot over, the nap) as rig
 * poses (R0239's clips mapped onto the poses the rigs have), shows the rising numbers and the
 * personality idles (FIGHT-78) as floating words, and holds still poses under reduced motion.
 * Reads the bout only; the screen keeps the cards, the log and the sheet.
 */
type Arena = 'dojo' | 'grove' | 'story' | 'hollow';

interface Actor {
  look: Look;
  rig: Rigged | null;
  stand: THREE.Mesh | null;
  compiling: boolean;
  pose: PoseName | '';
  rival: boolean;
}

/** Which idle pose a personality idle plays over (the pixel view only moves the sprite). */
const IDLE_POSE: Readonly<Record<IdleKind, PoseName>> = {
  bounce: 'happy',
  peek: 'love',
  tongue: 'happy',
  yawn: 'sleep',
  cross: 'sad',
  nod: 'sleep',
  float: 'idle',
};

/** The look a rival with no Nubbin wears: its roster species, its drawn art, else a child. */
export function rivalLook(art: string): Look {
  const height = GROVE3D.nubbinHeight;
  if (art !== 'chao') {
    const roster = ROSTER.find((s) => s.name.toLowerCase() === art.toLowerCase());
    if (roster) return { key: `roster:${roster.name}`, height };
    const drawn = speciesArt(art);
    if (drawn) return { key: `art:${art}`, height: height * drawn.size };
  }
  return variantById('child') ? { key: 'variant:child', height } : { key: 'nubbin', height };
}

/** The arena a bout stands in, by where it comes from. */
export function arenaFor(s: BattleState): Arena {
  const c = s.context;
  if (c.kind === 'dojo' || c.kind === 'karate' || c.kind === 'party' || c.kind === 'friendly')
    return 'dojo';
  if (c.kind === 'story') return 'story';
  if (c.kind === 'encounter' && c.source === HOLLOW_BATTLE_SOURCE) return 'hollow';
  return 'grove';
}

export class Battle3dView implements BattleView {
  readonly element: HTMLDivElement;
  ready = false;
  private stage: MiniStage | null = null;
  private cast: BattleCast | null = null;
  private readonly actors = new Map<string, Actor>();
  private rect: DOMRect | null = null;
  private openedMs = 0;
  private sceneryReady = false;
  private lastEvent: BattleEvent | null = null;
  private readonly tags = new Map<string, THREE.Sprite>();
  private readonly shownTags = new Set<THREE.Sprite>();
  private readonly at = new THREE.Vector3();
  private readonly size = new THREE.Vector2();

  constructor(private readonly host: Grove3dScene) {
    // The 3D stage draws into the game canvas; this element holds nothing.
    this.element = el('div', 'bs-3d');
  }

  start(s: BattleState, cast: BattleCast): void {
    this.stop();
    this.cast = cast;
    const stage = new MiniStage(this.host, B.hour);
    this.stage = stage;
    this.openedMs = performance.now();
    this.build(stage, arenaFor(s));
    void stage.compile().then(() => {
      if (this.stage !== stage) return;
      this.sceneryReady = true;
      this.openedMs = performance.now();
    });
  }

  resize(rect: DOMRect): void {
    this.rect = rect;
  }

  stop(): void {
    const rivals = new Set<string>();
    for (const a of this.actors.values()) if (a.rival) rivals.add(a.look.key);
    this.stage?.camera.clearViewOffset();
    this.stage?.dispose();
    // Rival looks are a bout's own; their spare rigs would otherwise pile up in the pool.
    for (const key of rivals) this.host.pool.discard(key);
    this.stage = null;
    this.cast = null;
    this.actors.clear();
    this.tags.clear();
    this.shownTags.clear();
    this.lastEvent = null;
    this.ready = false;
    this.sceneryReady = false;
  }

  dispose(): void {
    this.stop();
  }

  draw(s: BattleState, f: BattleFrame, nowMs: number): void {
    const stage = this.stage;
    if (!stage) return;
    this.frame(stage);
    if (!this.sceneryReady) return;
    stage.pool.frame();
    const still = reducedMotion();
    if (f.e && f.e !== this.lastEvent) {
      this.lastEvent = f.e;
      this.beat(stage, f, nowMs);
    }
    for (const sp of this.shownTags) sp.visible = false;
    this.shownTags.clear();
    const shownIds = new Set<string>();
    let missing = 0;
    for (const side of [1, 0] as const) {
      const c = f.shown[side];
      if (!c) continue;
      shownIds.add(c.id);
      const a = this.actor(stage, c);
      if (!a.rig || a.compiling) missing++;
      this.place(s, f, c, side, a, nowMs, still);
    }
    for (const [id, a] of this.actors) {
      if (shownIds.has(id)) continue;
      if (a.rig) a.rig.group.visible = false;
      if (a.stand) a.stand.visible = false;
    }
    if (!this.ready) {
      if (missing === 0) this.ready = true;
      else if (nowMs - this.openedMs > B.rigWaitMs) {
        for (const c of f.shown) {
          const a = c && this.actors.get(c.id);
          if (a && (!a.rig || a.compiling)) a.stand ??= stage.standIn(a.look);
        }
        this.ready = true;
      }
    }
    if (this.ready) stage.render(nowMs, () => 0);
  }

  // ---------------------------------------------------------------- the camera

  /**
   * Frame the two sides inside the screen's stage box: the camera's frustum is the box's own
   * (its aspect, a field of view wide enough for both rigs), widened by a view offset to cover
   * the whole game canvas, so the action sits in the box and the rest hides under the panels.
   */
  private frame(stage: MiniStage): void {
    stage.fit({ height: 4, minSpan: 6, fovDeg: 40 });
    const cam = stage.camera;
    const size = stage.renderer.getSize(this.size);
    const W = Math.max(1, size.x);
    const H = Math.max(1, size.y);
    const c = stage.renderer.domElement.getBoundingClientRect();
    const r = this.rect && this.rect.width > 0 ? this.rect : c;
    const sx = W / Math.max(1, c.width);
    const sy = H / Math.max(1, c.height);
    const rx = (r.left - c.left) * sx;
    const ry = (r.top - c.top) * sy;
    const rw = Math.max(1, r.width * sx);
    const rh = Math.max(1, r.height * sy);
    const k = B.camera;
    cam.position.set(k.look.x + k.from.x, k.look.y + k.from.y, k.look.z + k.from.z);
    cam.lookAt(k.look.x, k.look.y, k.look.z);
    if (stage.shake > 0 && !stage.reduceMotion) {
      cam.position.x += (Math.random() - 0.5) * stage.shake;
      cam.position.y += (Math.random() - 0.5) * stage.shake;
      stage.shake = Math.max(0, stage.shake - 0.006);
    }
    const dist = Math.hypot(k.from.x, k.from.y, k.from.z);
    const half = Math.max(k.halfHeight, k.halfWidth / (rw / rh));
    const fov = THREE.MathUtils.radToDeg(2 * Math.atan(half / dist));
    cam.fov = THREE.MathUtils.clamp(fov, k.minFov, k.maxFov);
    cam.setViewOffset(rw, rh, -rx, -ry, W, H);
    cam.updateProjectionMatrix();
  }

  // ---------------------------------------------------------------- the combatants

  private actor(stage: MiniStage, c: Combatant): Actor {
    let a = this.actors.get(c.id);
    if (!a) {
      const n = this.cast?.nubbin(c) ?? null;
      const look = n ? nubbinLook(n) : rivalLook(this.cast?.art(c) ?? c.species);
      a = { look, rig: null, stand: null, compiling: false, pose: '', rival: !n };
      this.actors.set(c.id, a);
    }
    if (!a.rig) {
      const rig = stage.acquire(a.look);
      if (rig) {
        const actor = a;
        actor.rig = rig;
        actor.compiling = true;
        rig.setPose('idle');
        void stage.compile([rig.group]).then(() => {
          if (this.stage !== stage) return;
          actor.compiling = false;
          if (actor.stand) {
            actor.stand.visible = false;
            actor.stand = null;
          }
        });
      }
    }
    return a;
  }

  /** Where a side stands and which way it faces at rest. */
  private home(side: 0 | 1): { x: number; z: number; yaw: number } {
    const me = side === 0 ? B.ally : B.foe;
    const them = side === 0 ? B.foe : B.ally;
    const toward = Math.atan2(them.x - me.x, them.z - me.z);
    // Turn toward the camera (yaw 0 faces it): ours turns a long way, theirs a little.
    const turn = side === 0 ? B.faceTurn.ally : B.faceTurn.foe;
    const yaw = toward > 0 ? toward - turn : toward + turn;
    return { x: me.x, z: me.z, yaw };
  }

  /**
   * One combatant this frame: the pixel stage's rules (who shows, who naps, who walks home)
   * with each beat as a pose and a move in world units, then its floating words.
   */
  private place(
    s: BattleState,
    f: BattleFrame,
    c: Combatant,
    side: 0 | 1,
    a: Actor,
    nowMs: number,
    still: boolean,
  ): void {
    const { e, k } = f;
    const home = this.home(side);
    const out = f.hp(c) <= 0 || (c.friend && !f.busy);
    let pose: PoseName = out ? (side === 0 ? 'sleep' : 'walk') : 'idle';
    let x = home.x;
    let y = 0;
    let z = home.z;
    let yaw = home.yaw;
    const other = side === 0 ? B.foe : B.ally;
    const dirX = other.x - home.x;
    const dirZ = other.z - home.z;
    const len = Math.hypot(dirX, dirZ) || 1;
    if (e) {
      const by = 'by' in e ? e.by : null;
      const who = 'who' in e ? e.who : null;
      const to = 'to' in e ? e.to : null;
      if (e.k === 'befriend' || e.k === 'cuddle') pose = 'happy';
      if (e.k === 'use' && by === c.id) {
        // The wind-up, then the lunge (R0239: windup, bonk, splash).
        const kind = moveById(e.move)?.kind;
        pose = kind === 'splash' ? 'flap' : kind === 'bonk' ? 'throw' : 'happy';
        if (!still) {
          const l = Math.sin(k * Math.PI) * B.lunge;
          x += (dirX / len) * l;
          z += (dirZ / len) * l;
        }
      }
      if (e.k === 'hit' && to === c.id) {
        pose = 'sad';
        if (!still) x += Math.sin(k * Math.PI * 6) * B.shake * (1 - k);
      }
      if (e.k === 'miss' && to === c.id) {
        // The dodge: a hop to the side.
        pose = 'surprised';
        if (!still) {
          const d = Math.sin(k * Math.PI * 2) * B.dodge;
          x += (-dirZ / len) * d;
          z += (dirX / len) * d;
        }
      }
      if ((e.k === 'boing' || e.k === 'fumble') && who === c.id) pose = 'dizzy';
      if (e.k === 'skip' && who === c.id) pose = e.why === 'drowsy' ? 'sleep' : 'happy';
      if ((e.k === 'rally' && by === c.id) || (e.k === 'swing' && by === c.id && e.sweet))
        pose = 'happy';
      if (e.k === 'play' && who === c.id) pose = 'happy';
      if (e.k === 'yawny' && who === c.id) pose = 'sleep';
      if (e.k === 'tuckered' && who === c.id) {
        // R0239 tuckered: ours naps where it stands, theirs toddles home.
        pose = side === 0 ? 'sleep' : 'walk';
        if (side === 1) {
          yaw = Math.atan2(1, -0.6);
          if (!still) {
            x += k * B.walkHome;
            z -= k * B.walkHome * 0.6;
          }
        }
      }
      if (e.k === 'befriend' && who === c.id) {
        pose = 'love';
        yaw = Math.atan2(dirX, dirZ);
        if (!still) {
          x += (dirX / len) * k * B.trotOver;
          z += (dirZ / len) * k * B.trotOver;
        }
      }
    }
    const rig = a.rig;
    const hide = out && side === 1 && !(e && 'who' in e && e.who === c.id);
    let glyph = '';
    // FIGHT-78: a personality idle while the bout waits for the Keeper.
    if (!e && !out && !s.result && s.phase === 'choose') {
      const n = c.nubbinId ? this.cast?.nubbin(c) : null;
      const kind = idleKind({ ...c, moody: n?.moody ?? null });
      const idle = idlePose(kind, c.id, s.seed, nowMs, still);
      x += idle.dx * B.idlePxToWorld;
      y -= idle.dy * B.idlePxToWorld;
      if (idle.kind) pose = IDLE_POSE[idle.kind];
      glyph = idle.glyph;
    }
    if (a.stand) {
      a.stand.visible = !hide;
      a.stand.position.set(x, y + a.stand.scale.y * 0.55, z);
    }
    if (rig && !a.compiling) {
      rig.group.visible = !hide;
      rig.group.position.set(x, y, z);
      rig.still = still;
      if (pose !== a.pose) {
        a.pose = pose;
        rig.setPose(pose);
      }
      rig.face(yaw);
      rig.animate(nowMs / 1000);
    }
    if (hide) return;
    const top = y + a.look.height + 0.3;
    if (glyph) this.showTag('glyph' + side, glyph, B.glyph, x + 0.45, top, z);
    if (out && side === 0) {
      this.showTag('zzz', BATTLE_TEXT.zzz, B.tag, x + 0.5, top, z);
      this.showTag('dizzy', '💫', B.glyph, x - 0.5, top, z);
    }
    const pop = f.pop;
    if (pop?.id === c.id && nowMs - pop.at < 700) {
      const t = (nowMs - pop.at) / 700;
      const sp = this.showTag(
        'pop',
        pop.text,
        B.tag,
        x,
        top + 0.25 + (still ? 0 : t * B.popRise),
        z,
      );
      (sp.material as THREE.SpriteMaterial).opacity = still ? Math.min(1, t * 3) : 1 - t * 0.5;
    }
  }

  /** An event starts: the particles and the camera's kick that go with it. */
  private beat(stage: MiniStage, f: BattleFrame, nowMs: number): void {
    const e = f.e;
    if (!e) return;
    const spot = (id: string): THREE.Vector3 | null => {
      const side = f.shown[0]?.id === id ? 0 : f.shown[1]?.id === id ? 1 : -1;
      if (side < 0) return null;
      const p = side === 0 ? B.ally : B.foe;
      return this.at.set(p.x, 0.6, p.z);
    };
    if (e.k === 'hit') {
      const p = spot(e.to);
      if (p) stage.bursts.burst('spark', p, B.burst.count, B.burst, nowMs);
      stage.kick(e.crit || e.strong ? B.kickBig : B.kick);
    } else if (e.k === 'miss') {
      const p = spot(e.to);
      if (p) stage.bursts.burst('dust', p.setY(0.1), B.burst.count, B.burst, nowMs);
    } else if (e.k === 'befriend' || e.k === 'cuddle') {
      const p = spot(e.who);
      if (p) stage.bursts.burst('heart', p, B.burst.count, B.burst, nowMs);
    } else if (e.k === 'rally') {
      const p = spot(e.by);
      if (p) stage.bursts.burst('sparkle', p, B.burst.count, B.burst, nowMs);
    }
  }

  /** A floating word, made once per slot and text and shown this frame. */
  private showTag(
    slot: string,
    text: string,
    o: { width: number; height: number; fontPx: number },
    x: number,
    y: number,
    z: number,
  ): THREE.Sprite {
    const key = `${slot}\n${text}`;
    let sp = this.tags.get(key);
    if (!sp) {
      sp = this.stage!.nameTag(text, '#fff6d8', o);
      this.tags.set(key, sp);
    }
    sp.visible = true;
    (sp.material as THREE.SpriteMaterial).opacity = 1;
    sp.position.set(x, y, z);
    this.shownTags.add(sp);
    return sp;
  }

  // ---------------------------------------------------------------- the arenas

  private build(stage: MiniStage, arena: Arena): void {
    const A = B.arena;
    if (arena === 'dojo') {
      stage.backdrop(A.dojo.top, A.dojo.bottom);
      this.dojo(stage);
    } else if (arena === 'hollow') {
      stage.backdrop(A.hollow.top, A.hollow.bottom);
      stage.strip(-9, 9, -7, 4, 'rock');
      for (const [x, z, sc] of [
        [-4.6, -4.2, 0.9],
        [-2.2, -5.4, 0.6],
        [3.4, -4.8, 1.1],
        [5.4, -2.6, 0.7],
        [-5.4, -1.2, 0.55],
      ] as const) {
        const r = stage.rock();
        r.position.set(x, sc * 0.4, z);
        r.scale.setScalar(sc);
      }
      const lamp = new THREE.PointLight(A.hollow.lamp, 6, 9, 1.6);
      lamp.position.set(-2.5, 2.4, -2);
      stage.scene.add(lamp);
    } else {
      const story = arena === 'story';
      stage.backdrop(story ? A.story.top : A.grove.top, story ? A.story.bottom : A.grove.bottom);
      stage.strip(-9, 9, -7, 4, story ? 'cobble' : 'grass');
      if (!story) {
        for (const [x, z, sc, seed] of [
          [-5.2, -5.4, 1.0, 3],
          [4.8, -5.8, 1.1, 7],
          [0.8, -6.6, 0.9, 11],
        ] as const) {
          const t = stage.tree(sc, seed);
          t.position.set(x, 0, z);
        }
        for (const [x, z] of [
          [-3.4, -3.4],
          [3.6, -2.6],
        ] as const) {
          const b = stage.bush();
          b.position.set(x, 0.3, z);
          b.scale.setScalar(0.5);
        }
      }
    }
  }

  /** The dojo: a board floor, a mat under each side, a paper wall with posts and a beam. */
  private dojo(stage: MiniStage): void {
    const D = B.arena.dojo;
    const tex = stage.tex;
    const floorGeo = repeatUv(new THREE.PlaneGeometry(16, 10).rotateX(-Math.PI / 2), 6, 4);
    const floor = new THREE.Mesh(floorGeo, pbr(tex.wood, { color: D.floor, rough: 0.7 }));
    floor.position.set(0, 0, -1.5);
    floor.receiveShadow = true;
    stage.scene.add(floor);
    const matMat = new THREE.MeshStandardMaterial({ color: D.mat, roughness: 0.9 });
    const edge = new THREE.MeshStandardMaterial({ color: '#f2e4c0', roughness: 0.9 });
    for (const p of [B.ally, B.foe]) {
      const mat = new THREE.Mesh(new THREE.CircleGeometry(1.0, 32).rotateX(-Math.PI / 2), matMat);
      mat.position.set(p.x, 0.012, p.z);
      mat.receiveShadow = true;
      const ring = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.1, 32).rotateX(-Math.PI / 2), edge);
      ring.position.set(p.x, 0.014, p.z);
      stage.scene.add(mat, ring);
    }
    const wallZ = -5.2;
    const wall = new THREE.Mesh(
      repeatUv(new THREE.PlaneGeometry(16, 4.6), 4, 1),
      pbr(tex.plaster, { color: D.wall, rough: 0.95 }),
    );
    wall.position.set(0, 2.3, wallZ);
    wall.receiveShadow = true;
    stage.scene.add(wall);
    const wood = pbr(tex.wood, { color: D.post, rough: 0.8 });
    const postGeo = new THREE.BoxGeometry(0.32, 4.6, 0.32);
    for (const x of [-6.4, -3.2, 0, 3.2, 6.4]) {
      const post = shadowed(new THREE.Mesh(postGeo, wood));
      post.position.set(x, 2.3, wallZ + 0.18);
      stage.scene.add(post);
    }
    const beam = shadowed(new THREE.Mesh(new THREE.BoxGeometry(16, 0.36, 0.4), wood));
    beam.position.set(0, 3.4, wallZ + 0.22);
    const sill = shadowed(new THREE.Mesh(new THREE.BoxGeometry(16, 0.22, 0.36), wood));
    sill.position.set(0, 0.11, wallZ + 0.2);
    stage.scene.add(beam, sill);
  }
}
