import { Object3D } from 'three';
import { EGG, UI } from '../config/tuning';
import { childHint } from '../sim/alignment';
import { moodOf } from '../sim/needs';
import type { Item, Nubbin, SimEvent, Vec2, World } from '../sim/types';
import type { OrbitCamera } from './camera';
import { SpriteView } from './sprite-view';
import { CLIPS, frameAt, frameKey, type ClipName } from './sprites/animations';
import { viewAngle } from './sprites/angles';
import { CHAO_SIZE } from './sprites/chao';
import { EGG_SIZE } from './sprites/egg';
import { EMOTE_SIZE, type EmoteShape } from './sprites/emote';
import { KEEPER_SIZE } from './sprites/keeper';
import { PROP_SIZE } from './sprites/props';
import { SheetCache } from './sprites/sheets';

interface Snapshot {
  pos: Vec2;
  y: number;
}

interface NubbinView {
  sprite: SpriteView;
  emote: SpriteView;
  clip: string;
  clipStartMs: number;
  /** A one-off bubble shown for a reaction, with its expiry. */
  bubble: { shape: EmoteShape; untilMs: number } | null;
  prev: Snapshot;
}

/**
 * Mirrors sim state as sprites. Reads the world, never changes it. Positions are
 * interpolated between the last two sim steps so movement is smooth at any frame rate.
 */
export class WorldView {
  readonly root = new Object3D();
  readonly sheets = new SheetCache();
  private readonly nubbins = new Map<string, NubbinView>();
  private readonly items = new Map<string, { sprite: SpriteView; prev: Snapshot }>();
  private readonly keeper: SpriteView;
  private keeperPrev: Snapshot = { pos: { x: 0, z: 0 }, y: 0 };
  private keeperClipStart = 0;
  private keeperMoving = false;

  constructor() {
    this.keeper = new SpriteView(KEEPER_SIZE, KEEPER_SIZE, 0.45);
    this.root.add(this.keeper.root);
  }

  /** Meshes that can be tapped, each with `userData.pick = { kind, id }`. */
  get pickables(): Object3D[] {
    const out: Object3D[] = [];
    for (const [id, v] of this.nubbins) {
      v.sprite.mesh.userData.pick = { kind: 'nubbin', id };
      out.push(v.sprite.mesh);
    }
    for (const [id, v] of this.items) {
      v.sprite.mesh.userData.pick = { kind: 'item', id };
      out.push(v.sprite.mesh);
    }
    return out;
  }

  /** Call right before stepping the sim, so the next frame can interpolate from here. */
  snapshot(world: World): void {
    for (const n of world.nubbins) {
      const v = this.nubbins.get(n.id);
      if (v) {
        v.prev.pos.x = n.pos.x;
        v.prev.pos.z = n.pos.z;
        v.prev.y = n.y;
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
    this.keeperPrev.pos.x = world.keeper.pos.x;
    this.keeperPrev.pos.z = world.keeper.pos.z;
  }

  /** React to sim events: reaction bubbles and clip restarts. */
  onEvents(events: SimEvent[], nowMs: number): void {
    for (const e of events) {
      if (e.kind === 'reaction') {
        const v = this.nubbins.get(e.nubbinId);
        if (!v) continue;
        const shape: EmoteShape =
          e.reaction === 'love' || e.reaction === 'happy'
            ? 'heart'
            : e.reaction === 'dizzy'
              ? 'spiral'
              : e.reaction === 'surprised'
                ? 'exclaim'
                : e.reaction === 'confused'
                  ? 'question'
                  : 'spiral';
        v.bubble = { shape, untilMs: nowMs + UI.bubbleMs };
      }
    }
  }

  update(world: World, camera: OrbitCamera, alpha: number, nowMs: number): void {
    const yaw = camera.currentYaw;
    const pitch = camera.pitch;

    // Nubbins.
    const seen = new Set<string>();
    for (const n of world.nubbins) {
      seen.add(n.id);
      let v = this.nubbins.get(n.id);
      if (!v) {
        v = this.createNubbin(n, nowMs);
        this.nubbins.set(n.id, v);
      }
      this.updateNubbin(v, n, world, yaw, pitch, alpha, nowMs);
    }
    for (const [id, v] of this.nubbins) {
      if (seen.has(id)) continue;
      v.sprite.dispose();
      v.emote.dispose();
      this.nubbins.delete(id);
    }

    // Items.
    const seenItems = new Set<string>();
    for (const item of world.items) {
      seenItems.add(item.id);
      let v = this.items.get(item.id);
      if (!v) {
        const sprite = new SpriteView(PROP_SIZE, PROP_SIZE, 0.25);
        sprite.setShadowRadius(0.25);
        sprite.setSheet(this.sheets.props());
        sprite.setFrame(frameKey(item.kind, 'front', 0));
        this.root.add(sprite.root);
        v = { sprite, prev: { pos: { x: item.pos.x, z: item.pos.z }, y: item.y } };
        this.items.set(item.id, v);
      }
      this.updateItem(v, item, yaw, pitch, alpha);
    }
    for (const [id, v] of this.items) {
      if (seenItems.has(id)) continue;
      v.sprite.dispose();
      this.items.delete(id);
    }

    // Keeper.
    const k = world.keeper;
    this.keeper.setSheet(this.sheets.keeper(k.alignment));
    const kx = lerp(this.keeperPrev.pos.x, k.pos.x, alpha);
    const kz = lerp(this.keeperPrev.pos.z, k.pos.z, alpha);
    const moving =
      Math.hypot(k.pos.x - this.keeperPrev.pos.x, k.pos.z - this.keeperPrev.pos.z) > 0.001;
    if (moving !== this.keeperMoving) {
      this.keeperMoving = moving;
      this.keeperClipStart = nowMs;
    }
    const kclip: ClipName = moving ? 'walk' : 'idle';
    const kview = viewAngle(k.facing, yaw);
    this.keeper.setFrame(
      frameKey(kclip, kview.angle, frameAt(CLIPS[kclip], nowMs - this.keeperClipStart)),
      kview.flip,
    );
    this.keeper.setPosition(kx, 0, kz);
    this.keeper.faceCamera(yaw, pitch);
  }

  private createNubbin(n: Nubbin, nowMs: number): NubbinView {
    const size = n.stage === 'egg' || n.stage === 'cocoon' ? EGG_SIZE : CHAO_SIZE;
    const sprite = new SpriteView(size, size, 0.55);
    sprite.setShadowRadius(0.55);
    const emote = new SpriteView(EMOTE_SIZE, EMOTE_SIZE, 0);
    emote.shadow.visible = false;
    this.root.add(sprite.root, emote.root);
    return {
      sprite,
      emote,
      clip: '',
      clipStartMs: nowMs,
      bubble: null,
      prev: { pos: { x: n.pos.x, z: n.pos.z }, y: n.y },
    };
  }

  private updateNubbin(
    v: NubbinView,
    n: Nubbin,
    world: World,
    yaw: number,
    pitch: number,
    alpha: number,
    nowMs: number,
  ): void {
    v.sprite.setSheet(this.sheets.forNubbin(n));
    const x = lerp(v.prev.pos.x, n.pos.x, alpha);
    const z = lerp(v.prev.pos.z, n.pos.z, alpha);
    const y = lerp(v.prev.y, n.y, alpha);

    let key: string;
    let flip = false;
    let emote: EmoteShape = 'none';

    if (n.stage === 'egg') {
      const shaking = world.timeMs - n.lastShakeMs < EGG.shakeCooldownMs * 2;
      let f = 'idle';
      if (n.behavior.state === 'held' || n.behavior.state === 'carried') f = 'held';
      else if (shaking) f = Math.floor(nowMs / 90) % 2 === 0 ? 'wobbleL' : 'wobbleR';
      else if (n.hatchRemainingMs < 5000) f = 'crack2';
      else if (n.hatchRemainingMs < 20000) f = 'crack1';
      else if (n.hatchRemainingMs < EGG.hatchMs * 0.5 && Math.floor(nowMs / 700) % 6 === 0)
        f = 'wobbleL';
      key = frameKey(f, 'front', 0);
    } else if (n.stage === 'cocoon') {
      key = frameKey('idle', 'front', Math.floor(nowMs / 600) % 2);
    } else {
      const clip = clipFor(n);
      if (clip !== v.clip) {
        v.clip = clip;
        v.clipStartMs = nowMs;
      }
      const view = viewAngle(n.facing, yaw);
      flip = view.flip;
      const def = CLIPS[clip as ClipName];
      const frame = def ? frameAt(def, nowMs - v.clipStartMs) : 0;
      key = frameKey(clip, view.angle, frame);
      emote = emoteFor(n);
    }

    v.sprite.setFrame(key, flip);
    v.sprite.setPosition(x, y, z);
    v.sprite.faceCamera(yaw, pitch);

    // Emote ball above the head.
    if (v.bubble && nowMs < v.bubble.untilMs) emote = v.bubble.shape;
    else v.bubble = null;
    if (emote === 'none' || n.stage === 'egg' || n.stage === 'cocoon') {
      v.emote.root.visible = false;
    } else {
      v.emote.root.visible = true;
      v.emote.setSheet(this.sheets.emotes());
      v.emote.setFrame(frameKey(emote, 'front', Math.floor(nowMs / 400) % 2));
      v.emote.setPosition(x, y + 2.15, z);
      v.emote.faceCamera(yaw, pitch);
    }
  }

  private updateItem(
    v: { sprite: SpriteView; prev: Snapshot },
    item: Item,
    yaw: number,
    pitch: number,
    alpha: number,
  ): void {
    v.sprite.setPosition(
      lerp(v.prev.pos.x, item.pos.x, alpha),
      lerp(v.prev.y, item.y, alpha),
      lerp(v.prev.pos.z, item.pos.z, alpha),
    );
    v.sprite.faceCamera(yaw, pitch);
  }

  dispose(): void {
    for (const v of this.nubbins.values()) {
      v.sprite.dispose();
      v.emote.dispose();
    }
    for (const v of this.items.values()) v.sprite.dispose();
    this.keeper.dispose();
    this.sheets.dispose();
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Which clip a free Nubbin plays. */
export function clipFor(n: Nubbin): string {
  switch (n.behavior.state) {
    case 'wander':
    case 'findFood':
      return 'walk';
    case 'swim':
      return 'swim';
    case 'nap':
      return 'sleep';
    case 'eat':
      return 'eat';
    case 'cry':
      return 'sad';
    case 'greet':
      return 'happy';
    case 'held':
    case 'carried':
      return 'held';
    case 'thrown':
      return 'surprised';
    case 'react':
      switch (n.behavior.reaction) {
        case 'love':
        case 'happy':
          return 'happy';
        case 'dizzy':
          return 'dizzy';
        case 'surprised':
          return 'surprised';
        case 'sad':
          return 'sad';
        default:
          return 'idle';
      }
    default: {
      const mood = moodOf(n);
      if (mood === 'sad' || mood === 'hungry') return 'sad';
      return 'idle';
    }
  }
}

/** Resting emote shape by mood and alignment hint. */
export function emoteFor(n: Nubbin): EmoteShape {
  const mood = moodOf(n);
  if (n.behavior.state === 'nap') return 'zz';
  switch (mood) {
    case 'happy':
      return 'heart';
    case 'hungry':
      return 'exclaim';
    case 'sad':
    case 'dizzy':
      return 'spiral';
    default: {
      const hint = n.form ? n.form.band : childHint(n.alignment);
      return hint === 'sun' ? 'halo' : hint === 'moon' ? 'spiky' : 'ball';
    }
  }
}
