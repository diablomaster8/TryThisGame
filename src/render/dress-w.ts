import {
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  Shape,
  Sprite,
  ShapeGeometry,
  type CanvasTexture,
  type MeshLambertMaterial,
  type Texture,
} from 'three';
import { seasonFor } from '../config/campaign-look';
import type { SceneStage } from '../config/story';
import { GROVE, LANTERN_POSTS } from '../config/tuning';
import { HUSH } from '../config/tuning-e';
import { CG2_W } from '../config/tuning-w';
import type { TileKind, World } from '../sim/types';
import type { Daylight } from './daylight';
import { lanternLights, SceneClock } from './dress-e';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { groundTexture } from './ground';
import type { GroundJob, GroundResult } from './ground.worker';
import { CG4_D4 } from '../config/tuning-d4';
import { hushFog, hushWalk, levelOf, pathWear, snowCover } from './d4-state';
import { HUSH_PX } from './hush-art';
import { HushTrail } from './hush-trail';
import { LineClock } from './line-clock';
import { RasterAtlas } from './paint/atlas';
import { FOG_PX, paintFogPuff } from './paint/d4';
import { FROST_PX, paintFrostDecal } from './paint/frost-w';
import { paintSnowCrown } from './paint/scenery';
import { pondOutline } from './paint/shore';
import { ICE_MARGIN, paintPondIce, paintStreamIce } from './paint/terrain';
import { iceRibbon } from './ice-ribbon';
import { stageFlags } from './scene-stage';
import { SCENERY } from './scenery';
import { isSceneryHidden } from './scenery-hide';
import { frameKey } from './sprites/animations';
import type { SpriteSheet } from './sprites/atlas';

/**
 * Campaign graphics 2, package w, pixel (winter, water, the Hush): the pond's ice (C7), snow
 * crowns on the trees and a frosted ground in winter (H8), and the grey frost the Hush leaves
 * under each lantern it puts out (M14). Everything here is still, so reduced motion draws the
 * same picture; the colossus (C8) and the mill wheel (M7) live in dress-e and dress-b. The
 * crowns are cut from the painted trees themselves, so they follow each canopy's real edge.
 */

/** How thick the snow lies on a kind of plant, in painted pixels; 0 for kinds that go bare. */
function crownDepth(kind: string): number {
  const d = CG2_W.winter.crownDepth;
  if (kind.startsWith('tree-')) return d.tree;
  if (kind.startsWith('wild-')) return d.wild;
  if (kind.startsWith('bush-')) return d.bush;
  return 0;
}

/** The pond's outline as flat ice, UVs over the same box the painter covers. */
function iceGeometry(): ShapeGeometry {
  const pts = pondOutline(72, 0.12);
  const shape = new Shape();
  pts.forEach((p, i) => {
    const x = p.x - GROVE.pond.x;
    const y = -(p.z - GROVE.pond.z);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  const geo = new ShapeGeometry(shape, 1);
  const pos = geo.getAttribute('position');
  const uv = geo.getAttribute('uv');
  const span = (GROVE.pond.r + ICE_MARGIN) * 2;
  for (let i = 0; i < pos.count; i++)
    uv.setXY(i, pos.getX(i) / span + 0.5, pos.getY(i) / span + 0.5);
  uv.needsUpdate = true;
  return geo;
}

/**
 * Whether this scene wants the pond (and the stream) frozen: its own `pondIce` prop, else
 * Hazel's chapters 10 to 12 (the frost line, the winter, and chapter 12's "cold and very
 * bright" morning). Both renderers ask this, so they agree.
 */
export function pondIceWanted(stage: SceneStage, campaign: string, chapter: number): boolean {
  const own = stage.props?.pondIce;
  if (own === 'show') return true;
  if (own === 'hide') return false;
  return campaign === 'hazel' && chapter >= 10 && chapter <= 12;
}

/**
 * H8: the winter ground. The Grove's own painter runs once for the base ground; this asks
 * the same worker for a copy painted for winter and lays it over the ground material while
 * winter shows, putting the base back after. If the Grove swaps its ground meanwhile
 * (terraforming, or its full painting arriving), the winter one is painted again.
 */
class WinterGround {
  private worker: Worker | null = null;
  private job = 0;
  private mat: MeshLambertMaterial | null = null;
  private tex: CanvasTexture | null = null;
  private base: Texture | null = null;
  private asked: Record<string, TileKind> | null = null;
  /** K25, K26: the variant (winter, snow level, wear level) the current texture was asked for. */
  private askedKey = '';

  constructor(private readonly ctx: PixelDressCtx) {}

  private find(): MeshLambertMaterial | null {
    if (this.mat) return this.mat;
    for (const o of this.ctx.scene.children) {
      const m = o as Mesh;
      const g = m.geometry as { parameters?: { width?: number; height?: number } } | undefined;
      if (
        m.isMesh &&
        g?.parameters?.width === GROVE.size &&
        g?.parameters?.height === GROVE.size &&
        (m.material as MeshLambertMaterial).isMeshLambertMaterial
      ) {
        this.mat = m.material as MeshLambertMaterial;
        break;
      }
    }
    return this.mat;
  }

  update(winter: boolean, tiles: Record<string, TileKind>, snow = 0, wear = 0): void {
    const mat = this.find();
    if (!mat) return;
    // The Grove swapped its ground over ours (terraforming): ours is stale.
    if (this.tex && mat.map !== this.tex && mat.map !== this.base) {
      this.tex.dispose();
      this.tex = null;
      this.asked = null;
    }
    // The base ground is the cheapest case: no winter, no snow, no wear to paint.
    const key = `${winter ? 'w' : '-'}|${snow}|${wear}`;
    if (!winter && snow === 0 && wear === 0) {
      // Whatever was being painted is no longer wanted.
      this.job++;
      this.asked = null;
      this.askedKey = '';
      if (this.tex && mat.map === this.tex) {
        mat.map = this.base;
        mat.needsUpdate = true;
      }
      return;
    }
    if (this.tex && mat.map === this.tex && this.askedKey === key) return;
    if (this.asked === tiles && this.askedKey === key) return;
    this.request(tiles, key, winter, snow, wear);
  }

  private request(
    tiles: Record<string, TileKind>,
    key: string,
    winter: boolean,
    snow: number,
    wear: number,
  ): void {
    if (typeof Worker === 'undefined') return;
    this.asked = tiles;
    this.askedKey = key;
    try {
      if (!this.worker) {
        this.worker = new Worker(new URL('./ground.worker.ts', import.meta.url), {
          type: 'module',
        });
        this.worker.onmessage = (e: MessageEvent<GroundResult>) => {
          if (e.data.id !== this.job) return;
          this.land(groundTexture(e.data));
        };
        this.worker.onerror = () => {
          this.worker?.terminate();
          this.worker = null;
        };
      }
      const job: GroundJob = {
        id: ++this.job,
        seed: 7,
        tiles,
        season: winter ? 'winter' : null,
        snow,
        wear,
      };
      this.worker.postMessage(job);
    } catch {
      this.worker = null;
    }
  }

  private land(next: CanvasTexture): void {
    const mat = this.mat;
    if (!mat) {
      next.dispose();
      return;
    }
    // Remember what the Grove has on, unless that is our own earlier painting.
    if (mat.map !== this.tex) this.base = mat.map;
    mat.map = next;
    mat.needsUpdate = true;
    this.tex?.dispose();
    this.tex = next;
  }

  dispose(): void {
    const mat = this.mat;
    if (mat && this.tex && mat.map === this.tex) {
      mat.map = this.base;
      mat.needsUpdate = true;
    }
    this.worker?.terminate();
    this.worker = null;
    this.tex?.dispose();
    this.tex = null;
    this.mat = null;
  }
}

class PixelW implements PixelDressing {
  readonly id = 'w';
  private ctx: PixelDressCtx | null = null;
  private ice: Mesh<ShapeGeometry, MeshBasicMaterial> | null = null;
  private ground: WinterGround | null = null;
  private stream: Mesh | null = null;
  private crowns: SpriteSheet | null = null;
  private crownsTried = false;
  private decal: SpriteSheet | null = null;
  private clock = new SceneClock();
  private line = new LineClock();
  private trail = new HushTrail();
  /** K17: the colossus sprite dress-e draws, found by its size, and moved along the walk. */
  private colossus: Sprite | null = null;
  private colossusTried = 0;

  build(ctx: PixelDressCtx): void {
    this.ctx = ctx;
    this.crowns = null;
    this.crownsTried = false;
    this.decal = null;
    this.clock = new SceneClock();
    this.line = new LineClock();
    this.trail = new HushTrail();
    this.colossus = null;
    this.colossusTried = 0;
    this.ice = null;
    this.ground = null;
    if (typeof document === 'undefined') return;
    try {
      const tex = paintPondIce();
      const geo = iceGeometry();
      const mat = new MeshBasicMaterial({ map: tex, side: DoubleSide, depthWrite: false });
      const ice = new Mesh(geo, mat);
      ice.rotation.x = -Math.PI / 2;
      ice.position.set(GROVE.pond.x, CG2_W.ice.pixelY, GROVE.pond.z);
      ice.visible = false;
      ctx.groups.grove.add(ice);
      ctx.track(tex);
      ctx.track(geo);
      ctx.track(mat);
      this.ice = ice;
      // The stream freezes with it: two strips of ice along the river.
      const st = paintStreamIce();
      const sm = new MeshBasicMaterial({ map: st, depthWrite: false, side: DoubleSide });
      const group = new Mesh();
      for (const line of [GROVE.river.inflow, GROVE.river.outflow]) {
        const g = iceRibbon(line, GROVE.river.width + 0.1, CG2_W.ice.pixelY + 0.001);
        ctx.track(g);
        group.add(new Mesh(g, sm));
      }
      group.visible = false;
      ctx.groups.grove.add(group);
      ctx.track(st);
      ctx.track(sm);
      this.stream = group;
      this.ground = new WinterGround(ctx);
      if (ctx.sprites) {
        const atlas = new RasterAtlas(256);
        atlas.add('frost', paintFrostDecal());
        atlas.add('fog', paintFogPuff());
        this.decal = atlas.build();
        ctx.track(this.decal);
      }
    } catch {
      this.ice = null;
    }
  }

  /** The colossus dress-e builds, found among the grove's sprites by its painted size. */
  private findColossus(ctx: PixelDressCtx): void {
    if (this.colossus || this.colossusTried > 3) return;
    this.colossusTried++;
    for (const o of ctx.groups.grove.children) {
      const s = o as Sprite;
      const img = s.isSprite
        ? (s.material.map?.image as { width?: number } | undefined)
        : undefined;
      if (
        img?.width === HUSH_PX.w &&
        (s.material.map?.image as { height?: number }).height === HUSH_PX.h
      ) {
        this.colossus = s;
        return;
      }
    }
  }

  /**
   * K17: the Hush walks from its mark toward the Fold, a stretch each scene, with a low band of
   * fog behind it that reaches each lantern as the lantern's frost grows. Reduced motion: it
   * stands at the stretch's end. dress-e owns the sprite's fade; this moves it and draws the fog.
   */
  private hushWalk(
    ctx: PixelDressCtx,
    sid: string | null,
    sceneT: number,
    grown: ReadonlyMap<string, number>,
    reduce: boolean,
    dim: number,
  ): void {
    this.findColossus(ctx);
    const card = this.colossus;
    const place = hushWalk(sid, sceneT, reduce);
    if (!card || !place) return;
    card.position.x = place.x;
    card.position.z = place.z;
    const batch = ctx.sprites?.batch;
    const rect = this.decal?.frames.get('fog');
    if (!batch || !this.decal || !rect || !card.visible) return;
    const c = CG4_D4.hush;
    const presence = Math.min(1, card.material.opacity / CG2_W.hush.pixelOpacity);
    for (const p of hushFog(place, grown, LANTERN_POSTS)) {
      const w = c.puffW * (0.7 + 0.3 * p.k);
      batch.draw({
        sheet: this.decal,
        rect,
        flip: false,
        x: p.x,
        y: 0.05,
        z: p.z,
        mode: 'billboard',
        w,
        h: (w * FOG_PX.h) / FOG_PX.w,
        tint: dim,
        opacity: c.opacity * presence * (0.6 + 0.4 * p.k),
      });
    }
  }

  /** Cut the snow crowns from the painted trees and bushes, once, on the first winter frame. */
  private buildCrowns(ctx: PixelDressCtx): void {
    this.crownsTried = true;
    const stock = ctx.sprites?.sheets.scenery();
    const img = stock?.texture.image as HTMLCanvasElement | undefined;
    const g = img?.getContext?.('2d');
    if (!stock || !g) return;
    const atlas = new RasterAtlas(2048);
    const seen = new Set<string>();
    for (const sc of SCENERY) {
      const depth = crownDepth(sc.kind);
      if (!depth || seen.has(sc.kind)) continue;
      seen.add(sc.kind);
      const rect = stock.frames.get(frameKey(sc.kind, 'front', 0));
      if (!rect) continue;
      const data = g.getImageData(rect.x, rect.y, rect.w, rect.h);
      atlas.add(`snow:${sc.kind}`, paintSnowCrown(data, depth, seen.size * 3));
    }
    this.crowns = atlas.build();
    ctx.track(this.crowns);
  }

  update(world: World, stage: SceneStage, daylight: Daylight, dt: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const reduce = ctx.reduceMotion();
    const staged = Object.keys(stage).length ? stage : null;
    const flags = stageFlags(world, staged);
    const home = flags.location === 'grove';
    const dim = 1 - 0.55 * daylight.darkness;

    // C7: the pond's ice.
    if (this.ice) {
      const on = home && pondIceWanted(stage, flags.campaign, flags.chapter);
      this.ice.visible = on;
      if (this.stream) this.stream.visible = on;
      if (on) this.ice.material.color.setScalar(0.5 + 0.5 * (1 - daylight.darkness));
    }

    // H8: winter on the ground and the crowns.
    const season = seasonFor(staged, flags.campaign, flags.chapter);
    const winter = home && season?.season === 'winter' && season.strength >= 0.9;
    // K25, K26: snow and path wear are two more levels of the same repainted ground.
    const snow = home ? levelOf(snowCover(flags), CG4_D4.snow.levels) : 0;
    const wear = home ? levelOf(pathWear(flags), CG4_D4.wear.levels) : 0;
    this.ground?.update(winter, world.tiles, snow, wear);
    const sp = ctx.sprites;
    if (!sp) return;
    const batch = sp.batch;
    if (winter) {
      if (!this.crownsTried) this.buildCrowns(ctx);
      const sheet = this.crowns;
      const scenery = sp.sheets.scenery();
      if (sheet) {
        const now = typeof performance !== 'undefined' ? performance.now() : 0;
        for (const sc of SCENERY) {
          if (isSceneryHidden(sc.kind)) continue;
          const rect = sheet.frames.get(`snow:${sc.kind}`);
          const base = scenery.frames.get(frameKey(sc.kind, 'front', 0));
          if (!rect || !base) continue;
          // The stock sprite sways a hair; the crown sways with it.
          const sway = sc.sway ? Math.sin(now / 1400 + sc.x) * sc.sway : 0;
          batch.draw({
            sheet,
            rect,
            flip: false,
            x: sc.x + sway,
            y: 0,
            z: sc.z + 0.02,
            mode: 'billboard',
            w: sc.size,
            h: (sc.size * base.h) / base.w,
            tint: dim,
          });
        }
      }
    }

    // M14: the Hush's frost under each lantern it put out.
    if (!home) {
      this.trail.reset();
      return;
    }
    if (!this.decal) return;
    const sceneT = this.line.tick(flags.sceneId, this.clock.tick(flags.sceneId, dt), dt);
    const states = lanternLights(flags, stage, sceneT, reduce);
    const sid = flags.sceneId;
    const grown = this.trail.update(
      flags,
      states,
      LANTERN_POSTS,
      sid !== null && HUSH.out.includes(sid),
      sid !== null && HUSH.back.includes(sid),
      dt,
      reduce,
    );
    this.hushWalk(ctx, sid, sceneT, grown, reduce, dim);
    const rect = this.decal.frames.get('frost');
    if (!rect) return;
    for (const p of LANTERN_POSTS) {
      const k = grown.get(p.id);
      if (k === undefined || k <= 0.01) continue;
      const e = 1 - (1 - k) * (1 - k);
      const w = CG2_W.hush.frostRadius * 2 * e;
      batch.draw({
        sheet: this.decal,
        rect,
        flip: false,
        x: p.x,
        y: 0.04,
        z: p.z,
        mode: 'flat',
        w,
        h: (w * FROST_PX.h) / FROST_PX.w,
        tint: dim,
        opacity: CG2_W.hush.frostOpacity,
      });
    }
  }

  dispose(): void {
    this.ice?.removeFromParent();
    this.ice = null;
    this.stream?.removeFromParent();
    this.stream = null;
    this.ground?.dispose();
    this.ground = null;
    this.ctx = null;
  }
}

export const dressW: PixelDressing = new PixelW();
