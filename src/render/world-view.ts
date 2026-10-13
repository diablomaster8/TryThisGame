import { Vector3 } from 'three';
import { EGG, LIFECYCLE, UI } from '../config/tuning';
import { childHint } from '../sim/alignment';
import { moodOf } from '../sim/needs';
import type { Nubbin, SimEvent, Vec2, World } from '../sim/types';
import type { OrbitCamera } from './camera';
import type { Daylight } from './daylight';
import { GROVE } from '../config/tuning';
import { placeDecorations } from './decor';
import { Particles } from './particles';
import { NATIVE_PPU, SpriteBatch } from './sprite-batch';
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
  /** Last dust puff while walking and last ripple while swimming. */
  lastDustMs: number;
  lastRippleMs: number;
  /** A short squash (landing) or pop (hatch, evolve) scales the quad at draw time. */
  pop: { kind: 'squash' | 'pop'; startMs: number } | null;
}

export interface SpritePick {
  kind: 'nubbin' | 'item' | 'npc' | 'memorial' | 'decor';
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
  readonly particles = new Particles();
  private readonly decor = placeDecorations();
  private darkness = 0;
  private keeperDustMs = 0;
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

  /** Time of day: sprite dimming and the ambient particle layer. */
  private weather: 'clear' | 'rain' | 'snow' = 'clear';
  private weatherIntensity = 0;
  private density: 'full' | 'light' | 'off' = 'full';
  private daylight: Daylight | null = null;
  /** The Hollow is always dark and full of fireflies. */
  location: 'grove' | 'hollow' | 'corvin' = 'grove';

  setDaylight(d: Daylight, reduceMotion: boolean): void {
    this.daylight = d;
    const hollow = this.location === 'hollow';
    this.darkness = hollow ? Math.max(0.6, d.darkness) : d.darkness;
    this.particles.env = {
      fireflies: d.fireflies || hollow,
      leaves: (d.phase === 'day' || d.phase === 'dawn') && this.weather === 'clear',
      darkness: this.darkness,
      weather: this.weather,
      weatherIntensity: this.weatherIntensity,
      density: this.density,
    };
    this.particles.reduceMotion = reduceMotion;
  }

  /** Weather and particle density from the sim and Settings; re-applies the daylight. */
  setWeather(
    kind: 'clear' | 'rain' | 'snow',
    intensity: number,
    density: 'full' | 'light' | 'off',
    reduceMotion: boolean,
  ): void {
    this.weather = kind;
    this.weatherIntensity = intensity;
    this.density = density;
    if (this.daylight) this.setDaylight(this.daylight, reduceMotion);
  }

  /** React to sim events: reaction bubbles and particle bursts. */
  onEvents(events: SimEvent[], nowMs: number): void {
    for (const e of events) {
      this.burstFor(e);
      if (e.kind === 'landed') {
        const v = this.nubbins.get(e.nubbinId);
        if (v) v.pop = { kind: 'squash', startMs: nowMs };
      } else if (e.kind === 'hatched' || e.kind === 'evolved' || e.kind === 'reborn') {
        const v = this.nubbins.get(e.nubbinId);
        if (v) v.pop = { kind: 'pop', startMs: nowMs };
      }
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

    const inGrove = this.location === 'grove';
    // Ground dressing, then memorial flowers.
    const props = this.sheets.props();
    for (const d of inGrove ? this.decor : []) {
      const rect = props.frames.get(frameKey(d.frame, 'front', 0));
      if (!rect) continue;
      batch.draw({
        sheet: props,
        rect,
        flip: d.flip,
        x: d.x,
        y: d.flat ? 0.03 : 0,
        z: d.z,
        mode: d.flat ? 'flat' : 'billboard',
        tint: this.dim,
      });
    }
    const flower = props.frames.get(frameKey('flower', 'front', 0));
    // Placed garden pieces, tappable so they can be picked up again.
    for (const d of inGrove ? world.placed : []) {
      const rect = props.frames.get(frameKey(d.kind, 'front', 0));
      if (!rect) continue;
      const flat = d.kind === 'pathTile';
      batch.draw(
        {
          sheet: props,
          rect,
          flip: false,
          x: d.pos.x,
          y: flat ? 0.02 : 0,
          z: d.pos.z,
          mode: flat ? 'flat' : 'billboard',
          tint: this.dim,
        },
        { id: d.id, kind: 'decor' },
      );
    }
    for (const m of inGrove ? world.memorials : []) {
      if (flower) {
        batch.draw(
          {
            sheet: props,
            rect: flower,
            flip: false,
            x: m.pos.x,
            y: 0,
            z: m.pos.z,
            mode: 'billboard',
            tint: this.dim,
          },
          { id: m.id, kind: 'memorial' },
        );
      }
    }

    // Items.
    const seenItems = new Set<string>();
    for (const item of world.items.filter((i) =>
      inGrove ? i.kind !== 'notebook' : i.kind === 'notebook',
    )) {
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
        { sheet: props, rect, flip: false, x, y, z, mode: 'billboard', tint: this.dim },
        { id: item.id, kind: 'item' },
      );
    }
    for (const id of this.items.keys()) if (!seenItems.has(id)) this.items.delete(id);

    // Nubbins.
    const seen = new Set<string>();
    for (const n of inGrove ? world.nubbins : []) {
      seen.add(n.id);
      let v = this.nubbins.get(n.id);
      if (!v) {
        v = {
          clip: '',
          clipStartMs: nowMs,
          bubble: null,
          prev: { pos: { x: n.pos.x, z: n.pos.z }, y: n.y },
          lastDustMs: 0,
          lastRippleMs: 0,
          pop: null,
        };
        this.nubbins.set(n.id, v);
      }
      this.drawNubbin(v, n, world, yaw, alpha, nowMs, shadow);
    }
    for (const id of this.nubbins.keys()) if (!seen.has(id)) this.nubbins.delete(id);

    // Visiting Keepers (campaign).
    const npcHere = (t: string) =>
      this.location === 'grove'
        ? true
        : this.location === 'corvin'
          ? t === 'corvin' || t === 'ember'
          : t === 'nova';
    for (const npc of world.npcs.filter((p) => npcHere(p.trainer))) {
      const nsheet = this.sheets.keeper(npc.trainer);
      const moving = npc.target !== null;
      const nclip: ClipName = moving ? 'walk' : 'idle';
      const nview = viewAngle(npc.facing, yaw);
      const nrect = nsheet.frames.get(
        frameKey(nclip, nview.angle, frameAt(CLIPS[nclip], nowMs + npc.pos.x * 97)),
      );
      shadow(npc.pos.x, 0, npc.pos.z, 0.45);
      if (nrect) {
        batch.draw(
          {
            sheet: nsheet,
            rect: nrect,
            flip: nview.flip,
            x: npc.pos.x,
            y: 0,
            z: npc.pos.z,
            mode: 'billboard',
            tint: this.dim,
          },
          { id: npc.id, kind: 'npc' },
        );
      }
    }

    // Ambient creatures of the other places: the Hollow's strays, Corvin's rows.
    if (!inGrove) this.drawAmbient(nowMs, yaw, shadow);

    // Keeper.
    const k = world.keeper;
    const ksheet = this.sheets.keeper(world.trainer);
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
        tint: this.dim,
      });
    }
    if (moving && nowMs - this.keeperDustMs > 260) {
      this.keeperDustMs = nowMs;
      this.particles.burst('dust', kx, 0.05, kz, 1, {
        spread: 0.15,
        speed: 0.3,
        rise: 0.4,
        lifeMs: 420,
        size: 0.4,
      });
    }

    // Particles last so they sit over the sprites they decorate.
    this.particles.update(nowMs);
    this.particles.draw(batch, nowMs);

    batch.end();
  }

  /** Grey Nubbins that live in the other places; render-only dressing. */
  private drawAmbient(
    nowMs: number,
    yaw: number,
    shadow: (x: number, y: number, z: number, r: number) => void,
  ): void {
    const sheet = this.sheets.ambientShadow();
    const spots: Array<[number, number, string]> =
      this.location === 'corvin'
        ? Array.from({ length: 30 }, (_, i): [number, number, string] => [
            -9 + (i % 10) * 2,
            -6 + Math.floor(i / 10) * 3,
            'sit',
          ])
        : [
            [-12, -4, 'sit'],
            [-7, -11, 'sit'],
            [4, -12, 'walk'],
            [10, -3, 'sit'],
            [12, 8, 'sit'],
            [-4, 11, 'walk'],
            [-11, 9, 'sit'],
            [7, 12, 'sit'],
          ];
    spots.forEach(([x, z], i) => {
      const clip: ClipName = this.location === 'corvin' ? 'idle' : i % 3 === 2 ? 'walk' : 'sad';
      const facing = this.location === 'corvin' ? Math.PI : (i * 1.3) % (Math.PI * 2);
      const view = viewAngle(facing, yaw);
      const rect = sheet.frames.get(
        frameKey(clip, view.angle, frameAt(CLIPS[clip], nowMs + i * 137)),
      );
      shadow(x, 0, z, 0.55);
      if (rect) {
        this.batch.draw({
          sheet,
          rect,
          flip: view.flip,
          x,
          y: 0,
          z,
          mode: 'billboard',
          tint: this.dim,
        });
      }
    });
  }

  /** Sprite brightness for the time of day. */
  private get dim(): number {
    return 1 - this.darkness * 0.35;
  }

  /** Particle bursts for sim events. Positions come from the last snapshot. */
  private burstFor(e: SimEvent): void {
    const at = (id: string) => this.nubbins.get(id)?.prev;
    const p = this.particles;
    switch (e.kind) {
      case 'landed': {
        const v = at(e.nubbinId);
        if (v)
          p.burst('dust', v.pos.x, 0.05, v.pos.z, 6, {
            spread: 0.25,
            speed: 1.2,
            rise: 0.5,
            lifeMs: 500,
            size: 0.45,
          });
        break;
      }
      case 'reaction': {
        const v = at(e.nubbinId);
        if (!v) break;
        if (e.reaction === 'love') {
          p.burst('heart', v.pos.x, v.y + 1.6, v.pos.z, 3, {
            spread: 0.3,
            speed: 0.1,
            rise: 0.6,
            lifeMs: 1100,
            size: 0.45,
            fadeMs: 250,
          });
        } else if (e.reaction === 'dizzy') {
          p.burst('sparkle', v.pos.x, v.y + 1.9, v.pos.z, 3, {
            spread: 0.4,
            speed: 0.2,
            rise: 0.1,
            lifeMs: 600,
            size: 0.35,
          });
        }
        break;
      }
      case 'hatched':
      case 'reborn':
      case 'speciesGrew': {
        const v = at(e.nubbinId);
        if (v)
          p.burst('sparkle', v.pos.x, v.y + 0.6, v.pos.z, 14, {
            spread: 0.5,
            speed: 1.4,
            rise: 1.2,
            lifeMs: 900,
            size: 0.5,
            fadeMs: 200,
          });
        break;
      }
      case 'evolved':
      case 'secondEvolved': {
        const v = at(e.nubbinId);
        if (v) {
          p.burst('sparkle', v.pos.x, v.y + 0.8, v.pos.z, 24, {
            spread: 0.8,
            speed: 1.8,
            rise: 1.6,
            lifeMs: 1300,
            size: 0.55,
            fadeMs: 250,
          });
          p.burst('petal', v.pos.x, v.y + 1.2, v.pos.z, 8, {
            spread: 0.6,
            speed: 1.0,
            rise: 1.0,
            lifeMs: 1600,
            size: 0.45,
            fadeMs: 300,
          });
        }
        break;
      }
      case 'eternal': {
        const v = at(e.nubbinId);
        if (v)
          p.burst('sparkle', v.pos.x, v.y + 0.5, v.pos.z, 40, {
            spread: 1.2,
            speed: 1.2,
            rise: 2.0,
            lifeMs: 2200,
            size: 0.6,
            fadeMs: 400,
          });
        break;
      }
      case 'cocoonStarted': {
        const v = at(e.nubbinId);
        if (v)
          p.burst('sparkle', v.pos.x, v.y + 0.6, v.pos.z, 8, {
            spread: 0.5,
            speed: 0.6,
            rise: 0.5,
            lifeMs: 1200,
            size: 0.45,
            fadeMs: 300,
          });
        break;
      }
      case 'ate': {
        const v = at(e.nubbinId);
        if (v)
          p.burst('crumb', v.pos.x, v.y + 0.9, v.pos.z, 4, {
            spread: 0.15,
            speed: 0.6,
            rise: 0.3,
            lifeMs: 450,
            size: 0.3,
          });
        break;
      }
      case 'treeShaken': {
        const i = Number(e.treeId.replace('tree-', '')) - 1;
        const t = GROVE.trees[i];
        if (t) {
          p.burst('leaf', t.x, 2.6, t.z, 10, {
            spread: 1.4,
            speed: 0.6,
            rise: -0.2,
            lifeMs: 4000,
            size: 0.45,
            fadeMs: 300,
          });
          p.burst('petal', t.x, 2.8, t.z, 4, {
            spread: 1.2,
            speed: 0.5,
            rise: -0.1,
            lifeMs: 4000,
            size: 0.4,
            fadeMs: 300,
          });
        }
        break;
      }
      case 'collected': {
        const it = this.items.get(e.itemId);
        if (it)
          p.burst('sparkle', it.pos.x, it.y + 0.4, it.pos.z, 5, {
            spread: 0.2,
            speed: 0.6,
            rise: 0.8,
            lifeMs: 500,
            size: 0.4,
          });
        break;
      }
      case 'eggShaken': {
        const v = at(e.nubbinId);
        if (v)
          p.burst('dust', v.pos.x, 0.05, v.pos.z, 2, {
            spread: 0.2,
            speed: 0.5,
            rise: 0.3,
            lifeMs: 400,
            size: 0.35,
          });
        break;
      }
      default:
        break;
    }
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
      // Squash and stretch at draw time: a landing flattens, a hatch or evolution pops.
      let sw = 1;
      let sh = 1;
      if (v.pop) {
        const dur = v.pop.kind === 'squash' ? 260 : 420;
        const t = (nowMs - v.pop.startMs) / dur;
        if (t >= 1) v.pop = null;
        else {
          const s = Math.sin(Math.PI * t);
          if (v.pop.kind === 'squash') {
            sw = 1 + 0.22 * s;
            sh = 1 - 0.22 * s;
          } else {
            sw = 1 - 0.1 * s;
            sh = 1 + 0.28 * s;
          }
        }
      }
      this.batch.draw(
        {
          sheet,
          rect,
          flip,
          x,
          y,
          z,
          mode: 'billboard',
          opacity,
          tint: this.dim,
          w: (rect.w / NATIVE_PPU) * sw,
          h: (rect.h / NATIVE_PPU) * sh,
        },
        { id: n.id, kind: 'nubbin' },
      );
    }

    // Footstep dust and swimming ripples.
    if (v.clip === 'walk' && y < 0.05 && nowMs - v.lastDustMs > 300) {
      v.lastDustMs = nowMs;
      this.particles.burst('dust', x, 0.05, z, 1, {
        spread: 0.12,
        speed: 0.25,
        rise: 0.35,
        lifeMs: 380,
        size: 0.35,
      });
    } else if (v.clip === 'swim' && nowMs - v.lastRippleMs > 650) {
      v.lastRippleMs = nowMs;
      this.particles.ripple(x, z);
    }

    if (v.bubble && nowMs < v.bubble.untilMs) emote = v.bubble.shape;
    else v.bubble = null;
    if (emote !== 'none' && n.stage !== 'egg' && n.stage !== 'cocoon') {
      const emotes = this.sheets.emotes(n.shadow);
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
    this.particles.dispose();
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
    case 'avoid':
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
  if (n.behavior.state === 'lesson') return 'question';
  if (n.behavior.state === 'perform') return 'star';
  if (n.behavior.state === 'court') return 'heart';
  // The floating ball is the Chao line's; other species show bubbles only when something is up.
  if (n.species !== 'chao' && mood === 'content') return 'none';
  // A wary Shadow Nubbin shows nothing it does not have to; a bonded one carries a dark heart.
  if (n.shadow && !n.bond && mood === 'content') return 'none';
  if (n.shadow && n.bond && mood === 'content') return 'heart';
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
