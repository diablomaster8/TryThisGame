import { Vector3 } from 'three';
import { EGG, LIFECYCLE, UI } from '../config/tuning';
import { childHint } from '../sim/alignment';
import { moodOf } from '../sim/needs';
import type { Nubbin, SimEvent, Vec2, World } from '../sim/types';
import type { OrbitCamera } from './camera';
import { SpriteBatch } from './sprite-batch';
import { CLIPS, frameAt, frameKey, type ClipName } from './sprites/animations';
import { viewAngle } from './sprites/angles';
import type { SpriteSheet } from './sprites/atlas';
import type { EmoteShape } from './sprites/emote';
import { buildShadowSheet } from './sprites/props';
import { SheetCache } from './sprites/sheets';

interface Snapshot {
  pos: Vec2;
  y: number;
}

interface NubbinView {
  clip: string;
  clipStartMs: number;
  /** A one-off bubble shown for a reaction, with its expiry. */
  bubble: { shape: EmoteShape; untilMs: number } | null;
  prev: Snapshot;
}

export interface SpritePick {
  kind: 'nubbin' | 'item';
  id: string;
}

/**
 * Mirrors sim state as sprites. Reads the world, never changes it. Every sprite goes
 * through one SpriteBatch (one draw call); positions are interpolated between the last
 * two sim steps so movement is smooth at any frame rate.
 */
export class WorldView {
  readonly batch = new SpriteBatch();
  readonly sheets = new SheetCache();
  private readonly nubbins = new Map<string, NubbinView>();
  private readonly items = new Map<string, Snapshot>();
  private keeperPrev: Snapshot = { pos: { x: 0, z: 0 }, y: 0 };
  private keeperClipStart = 0;
  private keeperMoving = false;
  private shadowSheet: SpriteSheet | null = null;
  private readonly tmp = new Vector3();

  get root() {
    return this.batch.mesh;
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
        v.pos.x = i.pos.x;
        v.pos.z = i.pos.z;
        v.y = i.y;
      }
    }
    this.keeperPrev.pos.x = world.keeper.pos.x;
    this.keeperPrev.pos.z = world.keeper.pos.z;
  }

  /** React to sim events: reaction bubbles. */
  onEvents(events: SimEvent[], nowMs: number): void {
    for (const e of events) {
      if (e.kind !== 'reaction') continue;
      const v = this.nubbins.get(e.nubbinId);
      if (!v) continue;
      const shape: EmoteShape =
        e.reaction === 'love' || e.reaction === 'happy'
          ? 'heart'
          : e.reaction === 'surprised'
            ? 'exclaim'
            : e.reaction === 'confused'
              ? 'question'
              : 'spiral';
      v.bubble = { shape, untilMs: nowMs + UI.bubbleMs };
    }
  }

  /** Which sprite is under a screen point (NDC), nearest to the camera. */
  pick(ndcX: number, ndcY: number, camera: OrbitCamera): SpritePick | null {
    const cam = camera.camera;
    let best: SpritePick | null = null;
    let bestDepth = Infinity;
    for (const q of this.batch.quads) {
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      let depth = 0;
      for (const c of q.corners) {
        this.tmp.copy(c).project(cam);
        minX = Math.min(minX, this.tmp.x);
        maxX = Math.max(maxX, this.tmp.x);
        minY = Math.min(minY, this.tmp.y);
        maxY = Math.max(maxY, this.tmp.y);
        depth += this.tmp.z / 4;
      }
      // Sprites are axis-aligned on screen, so the bounding box is the quad.
      if (ndcX < minX || ndcX > maxX || ndcY < minY || ndcY > maxY) continue;
      if (depth < bestDepth) {
        bestDepth = depth;
        best = { kind: q.kind, id: q.id };
      }
    }
    return best;
  }

  update(world: World, camera: OrbitCamera, alpha: number, nowMs: number): void {
    const yaw = camera.currentYaw;
    const batch = this.batch;
    batch.begin(yaw, camera.pitch);
    this.shadowSheet ??= buildShadowSheet();
    const shadowSheet = this.shadowSheet;
    const shadowRect = shadowSheet.frames.get(frameKey('shadow', 'front', 0));

    const shadow = (x: number, y: number, z: number, radius: number) => {
      if (!shadowRect) return;
      const s = Math.max(0.35, 1 - y * 0.25);
      batch.draw({
        sheet: shadowSheet,
        rect: shadowRect,
        flip: false,
        x,
        y: 0,
        z,
        mode: 'flat',
        w: radius * 2 * s,
        h: radius * 2 * s,
        opacity: 0.35 * Math.max(0.3, 1 - y * 0.2),
      });
    };

    // Memorial flowers.
    const props = this.sheets.props();
    const flower = props.frames.get(frameKey('flower', 'front', 0));
    for (const m of world.memorials) {
      if (flower) {
        batch.draw({
          sheet: props,
          rect: flower,
          flip: false,
          x: m.pos.x,
          y: 0,
          z: m.pos.z,
          mode: 'billboard',
        });
      }
    }

    // Items.
    const seenItems = new Set<string>();
    for (const item of world.items) {
      seenItems.add(item.id);
      let prev = this.items.get(item.id);
      if (!prev) {
        prev = { pos: { x: item.pos.x, z: item.pos.z }, y: item.y };
        this.items.set(item.id, prev);
      }
      const x = lerp(prev.pos.x, item.pos.x, alpha);
      const y = lerp(prev.y, item.y, alpha);
      const z = lerp(prev.pos.z, item.pos.z, alpha);
      const rect = props.frames.get(frameKey(item.kind, 'front', 0));
      if (!rect) continue;
      shadow(x, y, z, 0.25);
      batch.draw(
        { sheet: props, rect, flip: false, x, y, z, mode: 'billboard' },
        { id: item.id, kind: 'item' },
      );
    }
    for (const id of this.items.keys()) if (!seenItems.has(id)) this.items.delete(id);

    // Nubbins.
    const seen = new Set<string>();
    for (const n of world.nubbins) {
      seen.add(n.id);
      let v = this.nubbins.get(n.id);
      if (!v) {
        v = {
          clip: '',
          clipStartMs: nowMs,
          bubble: null,
          prev: { pos: { x: n.pos.x, z: n.pos.z }, y: n.y },
        };
        this.nubbins.set(n.id, v);
      }
      this.drawNubbin(v, n, world, yaw, alpha, nowMs, shadow);
    }
    for (const id of this.nubbins.keys()) if (!seen.has(id)) this.nubbins.delete(id);

    // Keeper.
    const k = world.keeper;
    const ksheet = this.sheets.keeper(k.alignment);
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
    const krect = ksheet.frames.get(
      frameKey(kclip, kview.angle, frameAt(CLIPS[kclip], nowMs - this.keeperClipStart)),
    );
    shadow(kx, 0, kz, 0.45);
    if (krect) {
      batch.draw({
        sheet: ksheet,
        rect: krect,
        flip: kview.flip,
        x: kx,
        y: 0,
        z: kz,
        mode: 'billboard',
      });
    }

    batch.end();
  }

  private drawNubbin(
    v: NubbinView,
    n: Nubbin,
    world: World,
    yaw: number,
    alpha: number,
    nowMs: number,
    shadow: (x: number, y: number, z: number, r: number) => void,
  ): void {
    const sheet = this.sheets.forNubbin(n);
    const x = lerp(v.prev.pos.x, n.pos.x, alpha);
    const z = lerp(v.prev.pos.z, n.pos.z, alpha);
    const y = lerp(v.prev.y, n.y, alpha);

    let key: string;
    let flip = false;
    let emote: EmoteShape = 'none';
    let opacity = 1;

    if (n.stage === 'egg') {
      const shaking = world.timeMs - n.lastShakeMs < EGG.shakeCooldownMs * 2;
      let f = 'idle';
      if (n.behavior.state === 'held' || n.behavior.state === 'carried') f = 'held';
      else if (shaking) f = Math.floor(nowMs / 90) % 2 === 0 ? 'wobbleL' : 'wobbleR';
      else if (n.hatchRemainingMs < 5000) f = 'crack2';
      else if (n.hatchRemainingMs < 20000) f = 'crack1';
      else if (n.hatchRemainingMs < EGG.hatchMs * 0.5 && Math.floor(nowMs / 700) % 6 === 0) {
        f = 'wobbleL';
      }
      key = frameKey(f, 'front', 0);
    } else if (n.stage === 'cocoon') {
      key = frameKey('idle', 'front', Math.floor(nowMs / 600) % 2);
      if (n.cocoonKind === 'depart') {
        opacity = 1 - Math.min(1, n.stageMs / LIFECYCLE.cocoonMs) * 0.85;
      } else if (n.cocoonKind === 'rebirth') {
        opacity = 0.85 + 0.15 * Math.sin(nowMs / 150);
      }
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

    const rect = sheet.frames.get(key) ?? sheet.frames.values().next().value;
    shadow(x, y, z, 0.55);
    if (rect) {
      this.batch.draw(
        { sheet, rect, flip, x, y, z, mode: 'billboard', opacity },
        { id: n.id, kind: 'nubbin' },
      );
    }

    if (v.bubble && nowMs < v.bubble.untilMs) emote = v.bubble.shape;
    else v.bubble = null;
    if (emote !== 'none' && n.stage !== 'egg' && n.stage !== 'cocoon') {
      const emotes = this.sheets.emotes();
      const erect = emotes.frames.get(frameKey(emote, 'front', Math.floor(nowMs / 400) % 2));
      if (erect) {
        this.batch.draw({
          sheet: emotes,
          rect: erect,
          flip: false,
          x,
          y: y + 2.15,
          z,
          mode: 'billboard',
        });
      }
    }
  }

  dispose(): void {
    this.batch.dispose();
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
    case 'play':
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
      if (n.eternal === 'neutral') return 'star';
      const hint = n.eternal ?? (n.form ? n.form.band : childHint(n.alignment));
      return hint === 'sun' ? 'halo' : hint === 'moon' ? 'spiky' : 'ball';
    }
  }
}
