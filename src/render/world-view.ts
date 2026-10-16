import { Vector3 } from 'three';
import { DUNGEON, EGG, LIFECYCLE, UI } from '../config/tuning';
import { childHint } from '../sim/alignment';
import { moodOf } from '../sim/needs';
import type { DungeonRun, Location, Nubbin, SimEvent, Vec2, World } from '../sim/types';
import { cellCentre, type Cell, type Floor } from '../sim/dungeon';
import type { OrbitCamera } from './camera';
import type { Daylight } from './daylight';
import { GROVE } from '../config/tuning';
import { placeDecorations } from './decor';
import { fenceSpots, SCENERY } from './scenery';
import { neighbourGarden } from '../sim/neighbourhood';
import { isMerged } from '../sim/partners';
import { townUnlocks } from '../sim/town';
import { Particles } from './particles';
import { NATIVE_PPU, SpriteBatch } from './sprite-batch';
import { CLIPS, frameAt, frameKey, type ClipName } from './sprites/animations';
import { viewAngle } from './sprites/angles';
import type { FrameRect, SpriteSheet } from './sprites/atlas';
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
  kind:
    | 'nubbin'
    | 'item'
    | 'npc'
    | 'memorial'
    | 'decor'
    | 'tree'
    | 'building'
    | 'plant'
    | 'wild'
    | 'lantern'
    | 'stairs'
    | 'chest'
    | 'stray'
    | 'loot';
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
  private readonly fences = fenceSpots();
  private darkness = 0;
  /** The Hollow floor being shown, and its torch and crystal glow for sprites. */
  private cave: Floor | null = null;
  private caveLights: Array<{ x: number; z: number; r: number }> = [];
  private readonly strayPrev = new Map<string, Vec2>();
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
  location: Location = 'grove';
  /** Which neighbour is being visited, if any (their Nubbins are render-only). */
  get visiting(): string | null {
    return this.location.startsWith('visit:') ? this.location.slice('visit:'.length) : null;
  }

  /** The Keeper's position as drawn this frame (between sim steps). */
  keeperDrawPos(world: World, alpha: number): Vec2 {
    return {
      x: lerp(this.keeperPrev.pos.x, world.keeper.pos.x, alpha),
      z: lerp(this.keeperPrev.pos.z, world.keeper.pos.z, alpha),
    };
  }

  /** Lamps that are on: windows and lanterns, with a reach in world units. */
  lights: Array<{ x: number; z: number; r: number }> = [];
  /** The lantern posts and whether each is lit (set by the game from the scene). */
  lanterns: () => Array<{ id: string; x: number; z: number; lit: boolean }> = () => [];

  /** The Hollow floor to draw (null above ground). */
  setDungeon(f: Floor | null): void {
    this.cave = f;
    this.strayPrev.clear();
    this.caveLights = f
      ? [
          ...f.torches.map((t) => {
            const p = cellCentre(f, t);
            return { x: p.x, z: p.z - DUNGEON.cell * 0.4, r: DUNGEON.torchReach };
          }),
          ...f.crystals.map((c) => ({ ...cellCentre(f, c), r: DUNGEON.crystalReach })),
        ]
      : [];
  }

  /** The thing under the mouse or just tapped: drawn with a bright halo. */
  setHighlight(hit: { kind: string; id: string } | null): void {
    this.batch.highlight = hit;
  }

  /** A burst of sparkles where something was tapped. */
  sparkle(x: number, z: number, y = 0.4): void {
    this.particles.burst('note', x, y, z, 6, {
      spread: 0.35,
      speed: 0.9,
      rise: 1.2,
      lifeMs: 650,
      size: 0.3,
    });
  }

  /** Brightness for a sprite at a spot: the day/night dim, lifted by nearby lamps. */
  lightAt(x: number, z: number): number {
    let b = this.dim;
    if (this.darkness < 0.15) return b;
    for (const l of this.lights) {
      const d = Math.hypot(x - l.x, z - l.z) / l.r;
      if (d < 1) b += (1 - d) * (1 - d) * 0.9 * this.darkness;
    }
    return Math.min(1.15, b);
  }

  setDaylight(d: Daylight, reduceMotion: boolean): void {
    this.daylight = d;
    const hollow = this.location === 'hollow';
    const underground = this.location === 'dungeon';
    this.darkness = hollow
      ? Math.max(0.6, d.darkness)
      : underground
        ? Math.max(0.7, d.darkness)
        : d.darkness;
    this.particles.env = {
      fireflies: (d.fireflies || hollow) && !underground,
      leaves: (d.phase === 'day' || d.phase === 'dawn') && this.weather === 'clear' && !underground,
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
  /** Alpha of each sheet's canvas, read once, for taps that test the texel under them. */
  private readonly alphaMaps = new WeakMap<SpriteSheet, { data: Uint8ClampedArray; w: number }>();

  private opaqueAt(sheet: SpriteSheet, rect: FrameRect, s: number, t: number): boolean {
    let map = this.alphaMaps.get(sheet);
    if (!map) {
      const image = sheet.texture.image as HTMLCanvasElement | undefined;
      const ctx = image && typeof image.getContext === 'function' ? image.getContext('2d') : null;
      if (!ctx || !image) return true; // no canvas to read (tests, or an image-backed sheet): the box wins
      const w = image.width;
      map = { data: ctx.getImageData(0, 0, w, image.height).data, w };
      this.alphaMaps.set(sheet, map);
    }
    const cx = rect.x + Math.min(rect.w - 1, Math.floor(s * rect.w));
    const cy = rect.y + Math.min(rect.h - 1, Math.floor(t * rect.h));
    // A small window, so thin things (a lantern post) are still easy to tap.
    for (let y = cy - 1; y <= cy + 1; y++) {
      for (let x = cx - 1; x <= cx + 1; x++) {
        if (x < rect.x || y < rect.y || x >= rect.x + rect.w || y >= rect.y + rect.h) continue;
        if ((map.data[(y * map.w + x) * 4 + 3] ?? 0) > 40) return true;
      }
    }
    return false;
  }

  pick(ndcX: number, ndcY: number, camera: OrbitCamera): SpritePick | null {
    const cam = camera.camera;
    let best: SpritePick | null = null;
    let bestDepth = Infinity;
    const p: Array<[number, number]> = [];
    for (const q of this.batch.quads) {
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      let depth = 0;
      p.length = 0;
      for (const c of q.corners) {
        this.tmp.copy(c).project(cam);
        p.push([this.tmp.x, this.tmp.y]);
        minX = Math.min(minX, this.tmp.x);
        maxX = Math.max(maxX, this.tmp.x);
        minY = Math.min(minY, this.tmp.y);
        maxY = Math.max(maxY, this.tmp.y);
        depth += this.tmp.z / 4;
      }
      // Sprites are axis-aligned on screen, so the bounding box is the quad.
      if (ndcX < minX || ndcX > maxX || ndcY < minY || ndcY > maxY) continue;
      // Where in the frame the tap lands (corners: top-left, top-right, bottom-left,
      // bottom-right), so a tree's empty corner does not steal a tap meant for what
      // stands behind it.
      const [p0, p1, p2] = p as [[number, number], [number, number], [number, number]];
      const ex = p1[0] - p0[0];
      const ey = p1[1] - p0[1];
      const fx = p2[0] - p0[0];
      const fy = p2[1] - p0[1];
      const det = ex * fy - ey * fx;
      if (Math.abs(det) < 1e-9) continue;
      const dx = ndcX - p0[0];
      const dy = ndcY - p0[1];
      const s = (dx * fy - dy * fx) / det;
      const t = (ex * dy - ey * dx) / det;
      if (s < 0 || s > 1 || t < 0 || t > 1) continue;
      if (!this.opaqueAt(q.sheet, q.rect, q.flip ? 1 - s : s, t)) continue;
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

    const home = this.location === 'grove';
    const inGrove = home || this.visiting !== null;
    const run = this.location === 'dungeon' ? world.dungeon : null;
    const cave = run ? this.cave : null;
    const underground = cave !== null;
    if (cave) {
      // Underground the only lights are the torches, the crystals and the Keeper's lamp.
      const kp = this.keeperDrawPos(world, alpha);
      this.lights = [...this.caveLights, { x: kp.x, z: kp.z, r: DUNGEON.lampReach }];
    }
    const props = this.sheets.props();
    // Scenery: trees, bushes, buildings, the well, and fence posts along the main path.
    if (inGrove) {
      const scenery = this.sheets.scenery();
      const lampsOn = this.lights.length > 0;
      for (const s of SCENERY) {
        const litKey = lampsOn
          ? scenery.frames.get(frameKey(`${s.kind}-lit`, 'front', 0))
          : undefined;
        const rect = litKey ?? scenery.frames.get(frameKey(s.kind, 'front', 0));
        if (!rect) continue;
        const sway = s.sway ? Math.sin(nowMs / 1400 + s.x) * s.sway : 0;
        if (!s.kind.startsWith('rock') && !s.kind.startsWith('log')) {
          shadow(
            s.x + s.size * 0.08,
            0,
            s.z + 0.1,
            s.size * (s.kind.startsWith('tree') ? 0.3 : 0.42),
          );
        }
        batch.draw(
          {
            sheet: scenery,
            rect,
            flip: false,
            x: s.x + sway,
            y: 0,
            z: s.z,
            mode: 'billboard',
            w: s.size,
            h: (s.size * rect.h) / rect.w,
            tint: this.lightAt(s.x, s.z),
          },
          s.pick,
        );
      }
      // The village square fills in as prosperity grows.
      const unlocks = townUnlocks(world);
      const stall = scenery.frames.get(frameKey('stall', 'front', 0));
      if (stall) {
        const spots: Array<[number, number, boolean]> = [
          [-12, 17.5, unlocks.stall],
          [-9.5, 18.5, unlocks.attendant],
          [-14.5, 18.8, unlocks.festival],
        ];
        for (const [sx, sz, on] of spots) {
          if (!on) continue;
          shadow(sx, 0, sz, 0.9);
          batch.draw({
            sheet: scenery,
            rect: stall,
            flip: false,
            x: sx,
            y: 0,
            z: sz,
            mode: 'billboard',
            w: 2.4,
            h: (2.4 * stall.h) / stall.w,
            tint: this.lightAt(sx, sz),
          });
        }
      }
      // Lantern posts: painted, lit at dusk or when the Keeper lights them, tappable.
      for (const l of this.lanterns()) {
        const lrect = scenery.frames.get(
          frameKey(l.lit ? 'lanternPost-lit' : 'lanternPost', 'front', 0),
        );
        if (!lrect) continue;
        shadow(l.x, 0, l.z, 0.3);
        batch.draw(
          {
            sheet: scenery,
            rect: lrect,
            flip: false,
            x: l.x,
            y: 0,
            z: l.z,
            mode: 'billboard',
            w: 0.9,
            h: (0.9 * lrect.h) / lrect.w,
            tint: l.lit ? 1.1 : this.lightAt(l.x, l.z),
          },
          { id: l.id, kind: 'lantern' },
        );
      }
      const fence = scenery.frames.get(frameKey('fencePost', 'front', 0));
      if (fence) {
        for (const f of this.fences) {
          batch.draw({
            sheet: scenery,
            rect: fence,
            flip: false,
            x: f.x,
            y: 0,
            z: f.z,
            mode: 'billboard',
            w: 0.75,
            h: (0.75 * fence.h) / fence.w,
            tint: this.lightAt(f.x, f.z),
          });
        }
      }
    }
    // Ground dressing, then memorial flowers.
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
    const scenerySheet = this.sheets.scenery();
    for (const d of home ? world.placed : []) {
      if (d.kind === 'nursery' || d.kind === 'bathhouse' || d.kind === 'workshop') {
        const brect =
          (this.lights.length > 0
            ? scenerySheet.frames.get(frameKey(`${d.kind}-lit`, 'front', 0))
            : undefined) ?? scenerySheet.frames.get(frameKey(d.kind, 'front', 0));
        if (!brect) continue;
        batch.draw(
          {
            sheet: scenerySheet,
            rect: brect,
            flip: false,
            x: d.pos.x,
            y: 0,
            z: d.pos.z,
            mode: 'billboard',
            w: d.kind === 'workshop' ? 5.8 : d.kind === 'bathhouse' ? 5.6 : 4.4,
            h:
              ((d.kind === 'workshop' ? 5.8 : d.kind === 'bathhouse' ? 5.6 : 4.4) * brect.h) /
              brect.w,
            tint: this.lightAt(d.pos.x, d.pos.z),
          },
          { id: d.kind, kind: 'building' },
        );
        continue;
      }
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
    for (const m of home ? world.memorials : []) {
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

    // Orchard trees and crop rows, tappable to water or harvest.
    for (const p of home ? world.plants : []) {
      const rect = props.frames.get(frameKey(`${p.kind}Stage${p.stage}`, 'front', 0));
      if (!rect) continue;
      const size = p.kind === 'tree' ? 1 + p.stage * 0.45 : 1.1;
      const sway = p.kind === 'tree' && p.stage >= 2 ? Math.sin(nowMs / 1500 + p.pos.x) * 0.02 : 0;
      const dry = p.water < 0.25 ? 0.8 : 1;
      batch.draw(
        {
          sheet: props,
          rect,
          flip: false,
          x: p.pos.x + sway,
          y: 0,
          z: p.pos.z,
          mode: 'billboard',
          w: size,
          h: size,
          tint: this.dim * dry,
        },
        { id: p.id, kind: 'plant' },
      );
    }
    // Wild visitors looking around their patch.
    for (const w of home ? world.wild : []) {
      const wsheet = this.sheets.species(w.species);
      const facing = Math.sin(nowMs / 2300 + w.pos.z) * 1.2;
      const wview = viewAngle(facing, yaw);
      const wrect = wsheet.frames.get(
        frameKey('idle', wview.angle, frameAt(CLIPS.idle, nowMs + w.pos.x * 131)),
      );
      if (!wrect) continue;
      const hop = w.fed ? Math.abs(Math.sin(nowMs / 180)) * 0.25 : 0;
      shadow(w.pos.x, hop, w.pos.z, 0.4);
      batch.draw(
        {
          sheet: wsheet,
          rect: wrect,
          flip: wview.flip,
          x: w.pos.x,
          y: hop,
          z: w.pos.z,
          mode: 'billboard',
          tint: this.dim,
        },
        { id: w.id, kind: 'wild' },
      );
      const emotes = this.sheets.emotes(false);
      const q = emotes.frames.get(frameKey('question', 'front', 0));
      if (q && !w.fed) {
        batch.draw({
          sheet: emotes,
          rect: q,
          flip: false,
          x: w.pos.x,
          y: 1.25 + Math.sin(nowMs / 400) * 0.04,
          z: w.pos.z,
          mode: 'billboard',
          w: 0.5,
          h: 0.5,
        });
      }
    }
    // A neighbour's Grove: their pets and the host, read-only.
    if (this.visiting) {
      for (const nb of neighbourGarden(this.visiting)) {
        const sheet =
          nb.species === 'chao'
            ? this.sheets.rival(nb.band, nb.type)
            : this.sheets.species(nb.species);
        const facing = Math.sin(nowMs / 3100 + nb.x) * 1.4;
        const view = viewAngle(facing, yaw);
        const rect = sheet.frames.get(
          frameKey('idle', view.angle, frameAt(CLIPS.idle, nowMs + nb.x * 71)),
        );
        if (!rect) continue;
        shadow(nb.x, 0, nb.z, 0.4);
        batch.draw({
          sheet,
          rect,
          flip: view.flip,
          x: nb.x,
          y: 0,
          z: nb.z,
          mode: 'billboard',
          tint: this.dim,
        });
      }
      const hsheet = this.sheets.keeper(this.visiting);
      const hview = viewAngle(Math.PI, yaw);
      const hrect = hsheet.frames.get(frameKey('idle', hview.angle, frameAt(CLIPS.idle, nowMs)));
      if (hrect) {
        shadow(0, 0, -1.5, 0.45);
        batch.draw(
          {
            sheet: hsheet,
            rect: hrect,
            flip: hview.flip,
            x: 0,
            y: 0,
            z: -1.5,
            mode: 'billboard',
            tint: this.dim,
          },
          { id: 'host', kind: 'building' },
        );
      }
    }

    if (cave && run) this.drawCave(cave, run, world, nowMs, yaw, alpha, shadow);

    // Items.
    const seenItems = new Set<string>();
    for (const item of world.items.filter((i) =>
      home ? i.kind !== 'notebook' : !this.visiting && !underground && i.kind === 'notebook',
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
      const frame =
        item.kind === 'toy' && item.toy && item.toy !== 'ball'
          ? item.toy
          : item.kind === 'fruit' && item.flavor
            ? `fruit-${item.flavor}`
            : item.kind;
      const rect =
        props.frames.get(frameKey(frame, 'front', 0)) ??
        props.frames.get(frameKey(item.kind, 'front', 0));
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
    const shown = home
      ? world.nubbins
      : run
        ? world.nubbins.filter((x) => run.party.includes(x.id))
        : [];
    for (const n of shown) {
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
        : underground
          ? false
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
    if (!inGrove && !underground) this.drawAmbient(nowMs, yaw, shadow);

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
      frameKey(
        kclip,
        kview.angle,
        frameAt(CLIPS[kclip], (nowMs - this.keeperClipStart) * (k.running ? 1.7 : 1)),
      ),
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
    const k2 = world.coop.active ? world.keeper2 : null;
    if (k2) {
      const sheet2 = this.sheets.keeper(world.coop.trainer);
      const moving2 = k2.input.x !== 0 || k2.input.z !== 0;
      const clip2: ClipName = moving2 ? 'walk' : 'idle';
      const view2 = viewAngle(k2.facing, yaw);
      const rect2 = sheet2.frames.get(frameKey(clip2, view2.angle, frameAt(CLIPS[clip2], nowMs)));
      shadow(k2.pos.x, 0, k2.pos.z, 0.45);
      if (rect2) {
        batch.draw({
          sheet: sheet2,
          rect: rect2,
          flip: view2.flip,
          x: k2.pos.x,
          y: 0,
          z: k2.pos.z,
          mode: 'billboard',
          tint: this.dim,
        });
      }
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

  /** The Hollow floor's dressing: stairs, torches, crystals, the chest, loot, strays, the wild one. */
  private drawCave(
    f: Floor,
    run: DungeonRun,
    world: World,
    nowMs: number,
    yaw: number,
    alpha: number,
    shadow: (x: number, y: number, z: number, r: number) => void,
  ): void {
    const batch = this.batch;
    const sheet = this.sheets.dungeon();
    const frame = (k: string) => sheet.frames.get(frameKey(k, 'front', 0));
    const cell = DUNGEON.cell;
    // Stair markers lie flat and are tappable.
    const marks: Array<[Cell, 'up' | 'down']> = [[f.stairsUp, 'up']];
    if (f.stairsDown) marks.push([f.stairsDown, 'down']);
    for (const [c, dir] of marks) {
      const rect = frame(dir === 'up' ? 'stairsUp' : 'stairsDown');
      if (!rect) continue;
      const p = cellCentre(f, c);
      batch.draw(
        {
          sheet,
          rect,
          flip: false,
          x: p.x,
          y: 0.01,
          z: p.z,
          mode: 'flat',
          w: cell,
          h: cell,
          tint: 1.1,
        },
        { id: dir, kind: 'stairs' },
      );
    }
    // Torches hang on the north wall of their cell and flicker.
    const torch = frame('torch');
    if (torch) {
      f.torches.forEach((t, i) => {
        const p = cellCentre(f, t);
        batch.draw({
          sheet,
          rect: torch,
          flip: false,
          x: p.x,
          y: 0.55,
          z: p.z - cell * 0.42,
          mode: 'billboard',
          tint: 1.02 + 0.1 * Math.sin(nowMs / 90 + i * 1.7),
        });
      });
    }
    const crystal = frame('crystal');
    if (crystal) {
      for (const c of f.crystals) {
        const p = cellCentre(f, c);
        shadow(p.x, 0, p.z, 0.3);
        batch.draw({
          sheet,
          rect: crystal,
          flip: false,
          x: p.x,
          y: 0,
          z: p.z,
          mode: 'billboard',
          tint: 1.05 + 0.08 * Math.sin(nowMs / 420 + p.x),
        });
      }
    }
    const chest = frame(run.chestOpen ? 'chestOpen' : 'chest');
    if (chest) {
      const p = cellCentre(f, f.chest);
      shadow(p.x, 0, p.z, 0.4);
      batch.draw(
        {
          sheet,
          rect: chest,
          flip: false,
          x: p.x,
          y: 0,
          z: p.z,
          mode: 'billboard',
          tint: this.lightAt(p.x, p.z),
        },
        { id: 'chest', kind: 'chest' },
      );
    }
    // Loot bobs gently until someone walks over it.
    for (const l of f.loot) {
      if (run.taken.includes(l.id)) continue;
      const rect = frame(`loot-${l.kind}`);
      if (!rect) continue;
      const p = cellCentre(f, l.cell);
      const bob = 0.08 + 0.05 * Math.sin(nowMs / 350 + l.cell.x * 0.7);
      shadow(p.x, bob, p.z, 0.2);
      batch.draw(
        {
          sheet,
          rect,
          flip: false,
          x: p.x,
          y: bob,
          z: p.z,
          mode: 'billboard',
          tint: this.lightAt(p.x, p.z),
        },
        { id: l.id, kind: 'loot' },
      );
    }
    // Shadow strays: grey, sad when they stand, walking otherwise.
    const grey = this.sheets.ambientShadow();
    const liveIds = new Set<string>();
    run.strays.forEach((s, i) => {
      liveIds.add(s.id);
      let prev = this.strayPrev.get(s.id);
      if (!prev) {
        prev = { x: s.pos.x, z: s.pos.z };
        this.strayPrev.set(s.id, prev);
      }
      const x = lerp(prev.x, s.pos.x, alpha);
      const z = lerp(prev.z, s.pos.z, alpha);
      const moving =
        s.target !== null && Math.hypot(s.target.x - s.pos.x, s.target.z - s.pos.z) > 0.1;
      const clip: ClipName = moving ? 'walk' : 'sad';
      const facing = s.target ? Math.atan2(s.target.x - s.pos.x, s.target.z - s.pos.z) : 0;
      const view = viewAngle(facing, yaw);
      const rect = grey.frames.get(
        frameKey(clip, view.angle, frameAt(CLIPS[clip], nowMs + i * 137)),
      );
      shadow(x, 0, z, 0.5);
      if (rect) {
        batch.draw(
          {
            sheet: grey,
            rect,
            flip: view.flip,
            x,
            y: 0,
            z,
            mode: 'billboard',
            tint: this.lightAt(x, z) * 0.9,
          },
          { id: s.id, kind: 'stray' },
        );
      }
    });
    for (const id of this.strayPrev.keys()) if (!liveIds.has(id)) this.strayPrev.delete(id);
    // The wild creature keeps to its nook until the Keeper creeps up on it.
    for (const w of run.wild) {
      if (w.scanned) continue;
      const wsheet = this.sheets.species(w.species);
      const facing = Math.sin(nowMs / 2300 + w.pos.z) * 1.2;
      const wview = viewAngle(facing, yaw);
      const wrect = wsheet.frames.get(
        frameKey('idle', wview.angle, frameAt(CLIPS.idle, nowMs + w.pos.x * 131)),
      );
      if (!wrect) continue;
      shadow(w.pos.x, 0, w.pos.z, 0.4);
      batch.draw({
        sheet: wsheet,
        rect: wrect,
        flip: wview.flip,
        x: w.pos.x,
        y: 0,
        z: w.pos.z,
        mode: 'billboard',
        tint: this.lightAt(w.pos.x, w.pos.z),
      });
      const emotes = this.sheets.emotes(false);
      const q = emotes.frames.get(frameKey('question', 'front', 0));
      if (q) {
        batch.draw({
          sheet: emotes,
          rect: q,
          flip: false,
          x: w.pos.x,
          y: 1.15 + Math.sin(nowMs / 400) * 0.05,
          z: w.pos.z,
          mode: 'billboard',
          tint: this.lightAt(w.pos.x, w.pos.z),
        });
      }
    }
    void world;
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
    if (e.kind === 'dungeonFound' || e.kind === 'chestOpened') {
      const p =
        e.kind === 'dungeonFound' && e.by ? this.nubbins.get(e.by)?.prev.pos : this.keeperPrev.pos;
      if (p) this.sparkle(p.x, p.z);
      return;
    }
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
    const merged = isMerged(world, n.id);
    const x = lerp(v.prev.pos.x, n.pos.x, alpha);
    const z = lerp(v.prev.pos.z, n.pos.z, alpha);
    const y = lerp(v.prev.y, n.y, alpha);

    let key: string;
    let flip = false;
    let emote: EmoteShape = 'none';
    let opacity = 1;
    const glowTint = merged ? 1.35 + 0.15 * Math.sin(nowMs / 120) : 1;

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
          tint: this.dim * glowTint,
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
    } else if (
      n.behavior.state === 'perform' &&
      (n.behavior.itemId === 'sled' || n.behavior.itemId === 'bath') &&
      nowMs - v.lastDustMs > 140
    ) {
      v.lastDustMs = nowMs;
      this.particles.burst(n.behavior.itemId === 'bath' ? 'splash' : 'snow', x, 0.1, z, 2, {
        spread: 0.25,
        speed: 0.5,
        rise: 0.6,
        lifeMs: 450,
        size: 0.3,
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
    case 'pet':
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
