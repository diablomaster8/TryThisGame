import { CircleGeometry, Color, Mesh, MeshBasicMaterial, RingGeometry, type Vector3 } from 'three';
import { markAt } from '../config/stage-marks';
import { GROVE } from '../config/tuning';
import { STORY_B } from '../config/tuning-b';
import type { SceneStage } from '../config/story';
import type { World } from '../sim/types';
import type { Daylight } from './daylight';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { RasterAtlas } from './paint/atlas';
import {
  GATE_PPU,
  GATE_HALF_PX,
  JETTY_PX,
  RUIN_SPECS,
  WHEEL_PX,
  gateSize,
  paintCrestHouse,
  paintGate,
  paintJetty,
  paintMillrace,
  paintSandRing,
  paintShadow,
  paintTally,
  paintWheel,
  ruinFrame,
  tallySpot,
  type Crest,
} from './paint/story-b';
import { SCENERY } from './scenery';
import { setHiddenScenery } from './scenery-hide';
import { stateFrom } from './story-b-state';
import { ddLayout, foldExtras } from './story-b-layout';
import { stageFlags } from './scene-stage';
import { frameKey } from './sprites/animations';
import type { FrameRect, SpriteSheet } from './sprites/atlas';

/**
 * Campaign-graphics package b, pixel renderer (C4, C6, C7, M9, M10, N7). Billboards go into
 * the sprite pass: the gate in shut and open frames (with an ivy variant, and the day board
 * in The Hundred Days), the Fold's ruined cottage, school and dojo (cut from the stock
 * painted frames, which are then hidden through `scenery-hide.ts`), Dawn & Dusk's four crest
 * houses, the mill wheel, and flat sprites for the jetty and the shore's sand band. The
 * green and its kerb are two flat meshes in the Grove group. The sheet is painted once, on
 * the first frame that has a sprite batch. Reads the world, writes nothing.
 */
const KINDS = ['cottage', 'school', 'dojo'] as const;
const HUNDRED_HIDE = new Set([
  'cottage',
  'cottage-lit',
  'school',
  'school-lit',
  'dojo',
  'dojo-lit',
]);
const DD_HIDE = new Set(['cottage', 'cottage-lit', 'school', 'school-lit']);
const NONE = new Set<string>();

interface Built {
  sheet: SpriteSheet;
  rect(key: string): FrameRect | undefined;
}

export const dressB: PixelDressing = (() => {
  let ctx: PixelDressCtx | null = null;
  let built: Built | null = null;
  let green: { disc: Mesh; kerb: Mesh } | null = null;
  let wheelAngle = 0;

  function buildSheet(c: PixelDressCtx): Built | null {
    if (!c.sprites) return null;
    const atlas = new RasterAtlas(2048);
    for (const bare of [false, true])
      for (const open of [false, true])
        for (const ivy of [false, true])
          atlas.add(
            `gate:${bare ? 'b' : 'f'}${open ? 'o' : 's'}${ivy ? 'i' : 'n'}`,
            paintGate({ bare, open, ivy }),
          );
    for (let n = 1; n <= 5; n++) atlas.add(`tally:${n}`, paintTally(n));
    STORY_B.dawnDusk.houses.forEach((h, i) =>
      atlas.add(`crest:${h.crest}`, paintCrestHouse(h.crest as Crest, h.roof, i * 7)),
    );
    for (let k = 0; k < 4; k++)
      for (const flow of [false, true])
        atlas.add(`wheel:${k}${flow ? 'f' : ''}`, paintWheel(k, flow));
    atlas.add('jetty:broken', paintJetty(STORY_B.shore.missing));
    atlas.add('jetty:whole', paintJetty([]));
    atlas.add('millrace', paintMillrace());
    atlas.add('sand', paintSandRing().raster);
    atlas.add('shadow', paintShadow(64, 22));
    // The Fold: three ruin levels of each stock building, cut from its painted frame.
    const stock = c.sprites.sheets.scenery();
    const img = stock.texture.image as HTMLCanvasElement | undefined;
    const g = img?.getContext?.('2d');
    if (g) {
      for (const kind of KINDS) {
        const rect = stock.frames.get(frameKey(kind, 'front', 0));
        if (!rect) continue;
        const data = g.getImageData(rect.x, rect.y, rect.w, rect.h);
        for (let level = 1; level <= 3; level++)
          atlas.add(
            `ruin:${kind}:${level}`,
            ruinFrame(data, RUIN_SPECS[kind], level, level * 5 + kind.length),
          );
      }
    }
    const sheet = atlas.build();
    c.track(sheet);
    return { sheet, rect: (key) => sheet.frames.get(key) };
  }

  return {
    id: 'b',
    build(c) {
      ctx = c;
      built = null;
      wheelAngle = 0;
      // The green (Dawn & Dusk): a mown disc and a stone kerb, flat on the Grove's ground.
      const D = { ...ddLayout().centre, r: ddLayout().radius };
      const disc = new Mesh(
        new CircleGeometry(D.r, 40),
        new MeshBasicMaterial({ color: '#8fcb5e', depthWrite: false }),
      );
      disc.rotation.x = -Math.PI / 2;
      disc.position.set(D.x, 0.03, D.z);
      const kerb = new Mesh(
        new RingGeometry(D.r - 0.1, D.r + 0.28, 48),
        new MeshBasicMaterial({ color: '#a39e96', depthWrite: false }),
      );
      kerb.rotation.x = -Math.PI / 2;
      kerb.position.set(D.x, 0.04, D.z);
      disc.visible = kerb.visible = false;
      c.groups.grove.add(disc, kerb);
      c.track(disc.geometry);
      c.track(kerb.geometry);
      green = { disc, kerb };
    },
    update(world: World, stage: SceneStage, daylight: Daylight, dt: number) {
      if (!ctx?.sprites) return;
      const f = stageFlags(world, Object.keys(stage).length ? stage : null);
      const home = f.location === 'grove';
      const st = stateFrom(world, Object.keys(stage).length ? stage : null, f);
      setHiddenScenery(
        home ? (st.hundred && st.ruin > 0 ? HUNDRED_HIDE : st.dawnDusk ? DD_HIDE : NONE) : NONE,
      );
      if (green) green.disc.visible = green.kerb.visible = home && st.dawnDusk;
      const mill = f.location === 'corvin' && st.hundred;
      if (!home && !mill) return;
      built ??= buildSheet(ctx);
      if (!built) return;
      const { batch } = ctx.sprites;
      const sheet = built.sheet;
      const tint = 1 - daylight.darkness * 0.35;
      if (green && st.dawnDusk) {
        const col = new Color('#8fcb5e').multiplyScalar(tint);
        (green.disc.material as MeshBasicMaterial).color.copy(col);
        (green.kerb.material as MeshBasicMaterial).color.copy(
          new Color('#a39e96').multiplyScalar(tint),
        );
      }
      const draw = (
        key: string,
        x: number,
        z: number,
        w: number,
        opts: {
          opacity?: number;
          y?: number;
          mode?: 'billboard' | 'flat';
          h?: number;
          pick?: { kind: 'building'; id: string };
        } = {},
      ) => {
        const rect = built!.rect(key);
        if (!rect) return;
        batch.draw(
          {
            sheet,
            rect,
            flip: false,
            x,
            y: opts.y ?? 0,
            z,
            mode: opts.mode ?? 'billboard',
            w,
            h: opts.h ?? (w * rect.h) / rect.w,
            tint,
            ...(opts.opacity !== undefined ? { opacity: opts.opacity } : {}),
          },
          opts.pick,
        );
      };
      const shadow = (x: number, z: number, w: number) =>
        draw('shadow', x + w * 0.04, z + 0.1, w, {
          mode: 'flat',
          y: 0.02,
          h: w * 0.7,
          opacity: 0.3,
        });

      if (!home) {
        // The mill chapter's set (M10): the wheel on its millrace, beside Corvin's garden.
        const M = STORY_B.mill;
        const k = st.wheelTurns && !ctx.reduceMotion() ? Math.floor(wheelAngle) % 4 : 0;
        if (st.wheelTurns && !ctx.reduceMotion())
          wheelAngle = (wheelAngle + dt * M.speed * 2.2) % 4;
        draw('millrace', M.corvinAt.x, M.corvinAt.z + 3.2, 1.8, { mode: 'flat', y: 0.03, h: 5.4 });
        shadow(M.corvinAt.x, M.corvinAt.z, 2.0);
        draw(
          `wheel:${k}${st.wheelTurns ? 'f' : ''}`,
          M.corvinAt.x,
          M.corvinAt.z,
          (WHEEL_PX / GATE_PPU) * 1.35,
          {
            h: (WHEEL_PX / GATE_PPU) * 1.35,
          },
        );
        return;
      }
      // The gate (C4) and its day board (N7).
      const mark = markAt('grove', 'gate') ?? { x: 0, z: 23, yaw: Math.PI };
      const look = st.gate;
      const gs = gateSize(look.bare);
      const key = `gate:${look.bare ? 'b' : 'f'}${look.openness >= 0.5 ? 'o' : 's'}${look.overgrown ? 'i' : 'n'}`;
      draw(key, mark.x, mark.z, gs.w / GATE_PPU, { h: gs.h / GATE_PPU });
      if (look.bare && look.tally > 0) {
        const right = (batch as unknown as { right?: Vector3 }).right;
        if (right) {
          // Strokes sit on the board, offset along the camera's right so they stay on it
          // from every turn of the view, and a hair toward the camera so they never z-fight.
          const bx = gs.cx - GATE_HALF_PX - 9 - 31;
          const groups = Math.ceil(look.tally / STORY_B.tally.perGroup);
          for (let i = 0; i < groups; i++) {
            const n = Math.min(5, look.tally - i * STORY_B.tally.perGroup);
            const sp = tallySpot(i);
            const dx = (bx + sp.dx + 3.5 - gs.cx) / GATE_PPU;
            draw(
              `tally:${n}`,
              mark.x + right.x * dx - right.z * 0.3,
              mark.z + right.z * dx + right.x * 0.3,
              7 / GATE_PPU,
              {
                y: sp.up / GATE_PPU,
              },
            );
          }
        }
      }

      // The Fold (C6): the ruined buildings stand where the stock ones were hidden.
      if (st.hundred && st.ruin > 0) {
        for (const s of SCENERY) {
          if (!(KINDS as readonly string[]).includes(s.kind)) continue;
          shadow(s.x, s.z, s.size * 0.8);
          draw(
            `ruin:${s.kind}:${st.ruin}`,
            s.x,
            s.z,
            s.size,
            s.pick ? { pick: { kind: 'building', id: s.pick.id } } : {},
          );
        }
      }
      if (st.hundred && st.ruin > 0)
        for (const e of foldExtras()) {
          const sc = SCENERY.find((q) => q.kind === e.kind);
          const size = sc?.size ?? 7;
          shadow(e.x, e.z, size * 0.8);
          draw(`ruin:${e.kind}:${st.ruin}`, e.x, e.z, size);
        }
      // The shore (M9): sand band and the jetty; the mill wheel (M10).
      if (st.hundred) {
        const ring = paintSandSize();
        draw('sand', GROVE.pond.x, GROVE.pond.z, ring, { mode: 'flat', y: 0.025, h: ring });
        const J = STORY_B.shore;
        const jx = GROVE.pond.x - GROVE.pond.r + 3.0 - J.length / 2;
        draw(st.jettyMended ? 'jetty:whole' : 'jetty:broken', jx, GROVE.pond.z + 0.9, J.length, {
          mode: 'flat',
          y: 0.05,
          h: (J.length * JETTY_PX.h) / JETTY_PX.w,
        });
        const M = STORY_B.mill;
        if (st.wheelTurns && !ctx.reduceMotion())
          wheelAngle = (wheelAngle + dt * M.speed * 2.2) % 4;
        const k = st.wheelTurns && !ctx.reduceMotion() ? Math.floor(wheelAngle) % 4 : 0;
        shadow(M.at.x, M.at.z, 2.0);
        draw(`wheel:${k}${st.wheelTurns ? 'f' : ''}`, M.at.x, M.at.z, (WHEEL_PX / GATE_PPU) * 1.7, {
          h: (WHEEL_PX / GATE_PPU) * 1.7,
        });
      }
      // Dawn & Dusk (C7): four crest houses round the green.
      if (st.dawnDusk) {
        const D = STORY_B.dawnDusk;
        const L = ddLayout();
        D.houses.forEach((h, i) => {
          const { x, z } = L.houses[i]!;
          shadow(x, z, 4.2);
          const stock = D.swapped[i];
          draw(
            `crest:${h.crest}`,
            x,
            z,
            5.2,
            stock ? { pick: { kind: 'building', id: stock } } : {},
          );
        });
      }
    },
    dispose() {
      setHiddenScenery(NONE);
      ctx = null;
      built = null;
      green = null;
    },
  };
})();

/** The sand ring's world size (its raster is square, painted from the pond's shoreline). */
function paintSandSize(): number {
  return (GROVE.pond.r + 2.6) * 2 + 2;
}
