import {
  DoubleSide,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Quaternion,
  Vector3,
} from 'three';
import { markAt } from '../config/stage-marks';
import type { SceneStage } from '../config/story';
import { GROVE, LANTERN_POSTS } from '../config/tuning';
import { CG4_E4 } from '../config/tuning-e4';
import { litLanterns } from '../sim/campaign';
import type { World } from '../sim/types';
import type { Daylight } from './daylight';
import { SceneClock } from './dress-e';
import { windowsState } from './dress-y-shared';
import { BootOverlay } from './e4-boot';
import {
  paintBird,
  paintBlossoms,
  paintCrop,
  paintGateFrost,
  paintGlow,
  paintGourds,
  paintHead,
  paintMoth,
  paintPaperLantern,
  paintPlotSoil,
  paintWindowFigure,
  paintWreath,
  streakTexture,
  type HeadShape,
} from './e4-art';
import {
  figureFor,
  hash01,
  hazelSeason,
  lanternLights,
  lampsOnFor,
  pondIceWanted,
  streakAnchors,
  wantsBoot,
  wantsFigures,
  wantsGateFrost,
  wantsRising,
  wantsWreath,
  type Season,
} from './e4-shared';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { RasterAtlas } from './paint/atlas';
import { GATE_PPU, gateSize, paintGate } from './paint/story-b';
import { stageFlags } from './scene-stage';
import { isSceneryHidden } from './scenery-hide';
import type { SpriteSheet } from './sprites/atlas';
import { ddLayout } from './story-b-layout';
import { storyBState } from './story-b-state';

/**
 * Campaign graphics 4, package e4, pixel ("world detail"): figures in lit windows (K18),
 * dithered lamp streaks on the pond (K19), the crop plot's four seasons (K27), the four
 * lantern heads and their hung tags (K28), rising paper lanterns (K42), the cottage's
 * wreath, blossoms and gourds (K43), day birds and night moths (K44), frost spreading over
 * the gate (K45) and Logged In's boot-up grid (K46). Everything is a sprite in the batch or
 * a flat card in the Grove group; under reduced motion each has a still form. The rules
 * shared with the 3D dressing are in `e4-shared.ts`.
 */

const UP = new Vector3(0, 1, 0);
const SEASONS: readonly Season[] = ['spring', 'summer', 'autumn', 'winter'];
const SHAPES: readonly HeadShape[] = ['round', 'square', 'hex', 'tall'];
const LOOKS = ['lit', 'out', 'low'] as const;
const LANTERN_COLORS = CG4_E4.rising.colors;

/** The small sheet: everything above except the gate's frost, which depends on the gate. */
function buildSheet(): SpriteSheet {
  const a = new RasterAtlas(1024);
  const F = CG4_E4.figures;
  for (const v of [0, 1, 2]) {
    a.add(`fig:cottage:${v}`, paintWindowFigure(F.cottage.wins[0]!.w, F.cottage.wins[0]!.h, v));
    a.add(`fig:crest:${v}`, paintWindowFigure(F.crest.wins[0]!.w, F.crest.wins[0]!.h, v));
    a.add(`fig:corvin:${v}`, paintWindowFigure(F.corvin.win.w, F.corvin.win.h, v));
  }
  for (const s of SEASONS) {
    a.add(`soil:${s}`, paintPlotSoil(s));
    for (let v = 0; v < 3; v++) a.add(`crop:${s}:${v}`, paintCrop(s, v + 1));
  }
  for (const shape of SHAPES)
    for (const look of LOOKS)
      a.add(
        `head:${shape}:${look}`,
        paintHead(shape, look, CG4_E4.heads.shapes[headOwner(shape)].tag),
      );
  a.add('wreath', paintWreath());
  a.add('gourds', paintGourds());
  a.add('blossoms', paintBlossoms());
  LANTERN_COLORS.forEach((c, i) => a.add(`lan:${i}`, paintPaperLantern(c)));
  a.add('glow', paintGlow());
  for (const f of [0, 1]) {
    a.add(`bird:${f}`, paintBird(f));
    a.add(`moth:${f}`, paintMoth(f));
  }
  return a.build();
}

function headOwner(shape: HeadShape): keyof typeof CG4_E4.heads.shapes {
  const e = Object.entries(CG4_E4.heads.shapes).find(([, v]) => v.shape === shape);
  return (e?.[0] ?? 'lantern-1') as keyof typeof CG4_E4.heads.shapes;
}

class PixelE4 implements PixelDressing {
  readonly id = 'e4';
  private ctx: PixelDressCtx | null = null;
  private clock = new SceneClock();
  private time = 0;
  private sheet: SpriteSheet | null = null;
  private boot: BootOverlay | null = null;
  private streaks: Mesh[] = [];
  private streakMat: MeshBasicMaterial | null = null;
  private frost = new Map<string, SpriteSheet>();
  private readonly basis = new Matrix4();
  private readonly quat = new Quaternion();
  private readonly xAxis = new Vector3();
  private readonly yAxis = new Vector3();
  private readonly toCam = new Vector3();
  private readonly right = new Vector3();

  build(ctx: PixelDressCtx): void {
    this.ctx = ctx;
    this.clock = new SceneClock();
    this.time = 0;
    this.sheet = null;
    this.frost.clear();
    this.streaks = [];
    this.streakMat = null;
    this.boot = new BootOverlay(ctx.scene);
    const tex = streakTexture();
    if (tex) {
      ctx.track(tex);
      const mat = new MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        opacity: CG4_E4.streak.opacity,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4,
      });
      ctx.track(mat);
      this.streakMat = mat;
      const geo = new PlaneGeometry(CG4_E4.streak.width, CG4_E4.streak.length);
      ctx.track(geo);
      for (let i = 0; i < LANTERN_POSTS.length; i++) {
        const m = new Mesh(geo, mat);
        m.visible = false;
        m.frustumCulled = false;
        ctx.groups.grove.add(m);
        this.streaks.push(m);
      }
    }
  }

  update(world: World, stage: SceneStage, daylight: Daylight, dt: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const reduce = ctx.reduceMotion();
    const flags = stageFlags(world, stage);
    this.time += dt;
    const t = this.clock.tick(flags.sceneId, dt);
    const home = flags.location === 'grove';

    // K46: the boot-up grid runs over the scene, home or not (it is the whole screen).
    this.boot?.set(wantsBoot(stage, flags) ? t : -1, reduce);

    const sp = ctx.sprites;
    for (const m of this.streaks) m.visible = false;
    if (!sp) return;
    const batch = sp.batch;
    this.right.copy((batch as unknown as { right: Vector3 }).right);
    const tx = -this.right.z;
    const tz = this.right.x;
    this.toCam.set(tx, 0, tz);
    const sheet = (this.sheet ??= sp.sheets.get('e4:sheet', buildSheet));
    const exclusive = stage.exclusive === true;
    const lampsOn = lampsOnFor(daylight);
    const dark = daylight.darkness;

    const put = (
      key: string,
      x: number,
      y: number,
      z: number,
      w: number,
      opts: {
        flat?: boolean;
        opacity?: number;
        tint?: number;
        h?: number;
        sheet?: SpriteSheet;
      } = {},
    ) => {
      const sh = opts.sheet ?? sheet;
      const rect = sh.frames.get(key);
      if (!rect) return;
      batch.draw({
        sheet: sh,
        rect,
        flip: false,
        x,
        y,
        z,
        mode: opts.flat ? 'flat' : 'billboard',
        w,
        h: opts.h ?? (w * rect.h) / rect.w,
        ...(opts.opacity !== undefined ? { opacity: opts.opacity } : {}),
        tint: opts.tint ?? 1,
      });
    };
    /** A point on a billboard sprite's raster (px from its left and top) in the world. */
    const at = (
      bx: number,
      bz: number,
      unit: number,
      rw: number,
      rh: number,
      px: number,
      py: number,
    ) => ({
      x: bx + this.right.x * (px - rw / 2) * unit,
      y: (rh - py) * unit,
      z: bz + this.right.z * (px - rw / 2) * unit,
    });

    // K44: birds across the day sky, moths at lit lamps at night; none in an exclusive set.
    if (!exclusive && home) this.fauna(world, put, daylight, reduce, lampsOn, dark, flags, stage);

    // Everything below belongs to the Grove's own ground.
    const states = home ? lanternLights(flags, stage, t, reduce) : {};
    if (home && !exclusive) {
      const kept = litLanterns(world);
      const lit = (id: string) => {
        const st = states[id];
        if (st) return st;
        return lampsOn || kept.has(id) ? 'lit' : 'out';
      };

      // K28: heads and tags, once the lanterns are named (Hazel chapter 3 on).
      const heads =
        stage.props?.lanternHeads === 'show' ||
        (stage.props?.lanternHeads !== 'hide' && flags.campaign === 'hazel' && flags.chapter >= 3);
      if (heads)
        for (const p of LANTERN_POSTS) {
          const spec = CG4_E4.heads.shapes[p.id];
          const st = lit(p.id);
          const look = st === 'out' ? 'out' : st === 'low' ? 'low' : 'lit';
          const u = CG4_E4.heads.pixelUnit;
          put(
            `head:${spec.shape}:${look}`,
            p.x + tx * 0.07 - this.right.x * u,
            1.26 - 6 * u,
            p.z + tz * 0.07 - this.right.z * u,
            32 * u,
            { h: 40 * u, tint: look === 'out' ? 1 - 0.45 * dark : 1.1 },
          );
        }

      // K19: streaks of lamplight on the water, none on ice, none for a lamp that is out.
      if (this.streakMat && !pondIceWanted(stage, flags.campaign, flags.chapter)) {
        const S = CG4_E4.streak;
        const anchors = streakAnchors();
        let n = 0;
        for (const a of anchors) {
          const st = lit(a.id);
          if (st === 'out') continue;
          const mesh = this.streaks[n++];
          if (!mesh) break;
          const shimmer = reduce ? 1 : 0.85 + 0.15 * Math.sin(this.time * S.hz * 6.28 + a.x);
          const len = S.length * (st === 'low' ? 0.5 : 1);
          this.yAxis.set(tx, 0, tz).normalize();
          this.xAxis.crossVectors(this.yAxis, UP);
          this.basis.makeBasis(this.xAxis, this.yAxis, UP);
          this.quat.setFromRotationMatrix(this.basis);
          mesh.position.set(a.x + tx * (len / 2), S.lift2d, a.z + tz * (len / 2));
          mesh.quaternion.copy(this.quat);
          mesh.scale.set(1, len / S.length, 1);
          mesh.visible = true;
          (mesh.material as MeshBasicMaterial).opacity =
            S.opacity * shimmer * (st === 'low' ? 0.6 : 1);
        }
      }

      // K18: figures in the lit windows.
      const wins = windowsState(flags, stage);
      if (wantsFigures(stage) && lampsOn && wins !== 'out') {
        const F = CG4_E4.figures;
        const lift = F.lift2d;
        const sid = flags.sceneId;
        if (flags.half === null && !isSceneryHidden('cottage')) {
          const c = GROVE.buildings.cottage;
          const unit = F.cottage.size / F.cottage.w;
          F.cottage.wins.forEach((w, i) => {
            const p = at(c.x, c.z, unit, F.cottage.w, F.cottage.h, w.x + w.w / 2, w.y + w.h);
            put(
              `fig:cottage:${figureFor(i, sid)}`,
              p.x + tx * lift,
              p.y,
              p.z + tz * lift,
              w.w * unit,
              { h: w.h * unit },
            );
          });
        }
        if (flags.half !== null) {
          const L = ddLayout();
          const unit = F.crest.size / F.crest.w;
          L.houses.forEach((h, hi) =>
            F.crest.wins.forEach((w, i) => {
              const p = at(h.x, h.z, unit, F.crest.w, F.crest.h, w.x + w.w / 2, w.y + w.h);
              put(
                `fig:crest:${figureFor(hi * 2 + i, sid)}`,
                p.x + tx * lift,
                p.y,
                p.z + tz * lift,
                w.w * unit,
                { h: w.h * unit },
              );
            }),
          );
        }
      }
    }

    // K27, K43: Hazel's plot and cottage by the staged season.
    const season = home ? hazelSeason(stage, flags) : null;
    if (season) {
      const P = CG4_E4.plot;
      const soilH = P.d;
      put(`soil:${season}`, P.x, 0, P.z, P.w, { flat: true, h: soilH });
      const mx = P.w * 0.12;
      const mz = P.d * 0.2;
      for (let r = 0; r < P.rows; r++)
        for (let c = 0; c < P.perRow; c++) {
          const jx = (hash01(r * 7 + c) - 0.5) * 0.12;
          const jz = (hash01(r * 5 + c * 3) - 0.5) * 0.1;
          const x = P.x - P.w / 2 + mx + ((P.w - mx * 2) * (c + 0.5)) / P.perRow + jx;
          const z = P.z - P.d / 2 + mz + ((P.d - mz * 2) * (r + 0.7)) / P.rows + jz;
          put(`crop:${season}:${(r + c) % 3}`, x + tx * 0.02, 0.02, z + tz * 0.02, 0.42);
        }
    }
    if (season && wantsWreath(stage)) {
      const c = GROVE.buildings.cottage;
      const W = CG4_E4.wreath.px;
      const unit = CG4_E4.figures.cottage.size / CG4_E4.figures.cottage.w;
      const rw = CG4_E4.figures.cottage.w;
      const rh = CG4_E4.figures.cottage.h;
      const lift = 0.07;
      if (season === 'winter') {
        const p = at(c.x, c.z, unit, rw, rh, W.doorX, W.doorY + 8);
        put('wreath', p.x + tx * lift, p.y, p.z + tz * lift, 16 * unit);
      } else if (season === 'autumn') {
        const p = at(c.x, c.z, unit, rw, rh, 60, 140);
        put('gourds', p.x + tx * lift, p.y, p.z + tz * lift, 40 * unit);
      } else if (season === 'spring') {
        for (const bx of W.boxXs) {
          const p = at(c.x, c.z, unit, rw, rh, bx, 106);
          put('blossoms', p.x + tx * lift, p.y, p.z + tz * lift, 30 * unit);
        }
      }
    }

    // K42: paper lanterns rising.
    if (home && wantsRising(stage, flags)) this.rising(put, t, reduce);

    // K45: frost over the gate while Corvin stands outside it.
    if (home && wantsGateFrost(stage, flags))
      this.gateFrost(world, stage, ctx, put, t, reduce, tx, tz);
  }

  private fauna(
    world: World,
    put: (
      key: string,
      x: number,
      y: number,
      z: number,
      w: number,
      o?: { opacity?: number; tint?: number },
    ) => void,
    daylight: Daylight,
    reduce: boolean,
    lampsOn: boolean,
    dark: number,
    flags: ReturnType<typeof stageFlags>,
    stage: SceneStage,
  ): void {
    const F = CG4_E4.fauna;
    if (dark < F.dayBelow && daylight.phase !== 'dusk') {
      for (let i = 0; i < F.birds; i++) {
        const sp = F.birdSpeed[0] + hash01(i + 3) * (F.birdSpeed[1] - F.birdSpeed[0]);
        const y = F.pixelY[0] + hash01(i + 9) * (F.pixelY[1] - F.pixelY[0]);
        const z0 = (hash01(i + 21) - 0.5) * 40;
        const ph = hash01(i + 40) * F.loop * 2;
        const x = reduce
          ? (hash01(i + 5) - 0.5) * 30
          : ((this.time * sp + ph) % (F.loop * 2)) - F.loop;
        const flap = reduce ? 1 : Math.floor(this.time * 3 + i) % 2;
        put(
          `bird:${flap}`,
          x,
          y,
          z0 + Math.sin(i + (reduce ? 0 : this.time * 0.2)) * 3,
          F.pixelBird,
        );
      }
    }
    if (lampsOn && dark >= F.nightFrom) {
      const states = lanternLights(flags, stage, 0, reduce);
      const kept = litLanterns(world);
      for (const p of LANTERN_POSTS) {
        const st = states[p.id];
        if (st === 'out' || (!st && !(lampsOn || kept.has(p.id)))) continue;
        for (let m = 0; m < F.moths; m++) {
          const r = F.mothRadius[0] + hash01(p.x + m * 3) * (F.mothRadius[1] - F.mothRadius[0]);
          const a = hash01(m * 7 + p.z) * 6.28 + (reduce ? 0 : this.time * (0.9 + m * 0.3));
          const bob = reduce ? 0 : Math.sin(this.time * 3 + m) * 0.1;
          const wing = reduce ? 0 : Math.floor(this.time * F.mothHz + m) % 2;
          put(
            `moth:${wing}`,
            p.x + Math.cos(a) * r,
            1.5 + bob + m * 0.1,
            p.z + Math.sin(a) * r,
            F.pixelMoth,
          );
        }
      }
    }
  }

  private rising(
    put: (
      key: string,
      x: number,
      y: number,
      z: number,
      w: number,
      o?: { opacity?: number; tint?: number },
    ) => void,
    t: number,
    reduce: boolean,
  ): void {
    const R = CG4_E4.rising;
    const centre = markAt('grove', 'festival-1') ?? { x: 0.5, z: 2.5, yaw: 0 };
    const shown = reduce ? R.count : Math.ceil(R.count * Math.min(1, t / R.fadeIn));
    for (let i = 0; i < shown; i++) {
      const a = hash01(i * 2.3) * 6.28;
      const d = Math.sqrt(hash01(i * 4.1 + 1)) * R.radius;
      const phase = hash01(i * 9.7 + 2);
      const life = reduce ? R.stillAt : ((t * R.speed) / R.climb + phase) % 1;
      const y = 1.5 + life * R.climb * 0.6;
      const sway = reduce ? 0 : Math.sin(t * 0.7 + i) * R.sway;
      const fade = reduce ? 1 : Math.min(1, life * 6) * Math.min(1, (1 - life) * 4);
      const x = centre.x + Math.cos(a) * d + sway;
      const z = centre.z + Math.sin(a) * d;
      put('glow', x, y - 0.5, z, 1.6, { opacity: 0.3 * fade, tint: 1.2 });
      put(`lan:${i % LANTERN_COLORS.length}`, x, y, z, R.pixelSize, { opacity: fade, tint: 1.2 });
    }
  }

  private gateFrost(
    world: World,
    stage: SceneStage,
    ctx: PixelDressCtx,
    put: (
      key: string,
      x: number,
      y: number,
      z: number,
      w: number,
      o?: { opacity?: number; tint?: number; h?: number; sheet?: SpriteSheet },
    ) => void,
    t: number,
    reduce: boolean,
    tx: number,
    tz: number,
  ): void {
    const sp = ctx.sprites;
    if (!sp) return;
    const look = storyBState(world, Object.keys(stage).length ? stage : null).gate;
    const key = `${look.bare ? 'b' : 'f'}${look.openness >= 0.5 ? 'o' : 's'}${look.overgrown ? 'i' : 'n'}`;
    const N = CG4_E4.frost.stages;
    let sheet = this.frost.get(key);
    if (!sheet) {
      const base = paintGate({ bare: look.bare, open: look.openness >= 0.5, ivy: look.overgrown });
      const atlas = new RasterAtlas(2048);
      for (let s = 1; s <= N; s++) atlas.add(`frost:${s}`, paintGateFrost(base, s, N));
      sheet = atlas.build();
      ctx.track(sheet);
      this.frost.set(key, sheet);
    }
    const k = reduce ? 1 : Math.min(1, t / CG4_E4.frost.seconds);
    const stageNo = Math.max(1, Math.ceil(k * N));
    const mark = markAt('grove', 'gate') ?? { x: 0, z: 23, yaw: Math.PI };
    const gs = gateSize(look.bare);
    put(`frost:${stageNo}`, mark.x + tx * 0.05, 0, mark.z + tz * 0.05, gs.w / GATE_PPU, {
      h: gs.h / GATE_PPU,
      sheet,
      opacity: CG4_E4.frost.opacity,
    });
  }

  dispose(): void {
    this.boot?.dispose();
    this.boot = null;
    for (const m of this.streaks) m.removeFromParent();
    this.streaks = [];
    this.ctx = null;
  }
}

export const dressE4: PixelDressing = new PixelE4();
