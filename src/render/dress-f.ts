import {
  buntingShape,
  DRESSING_FLAGS,
  dungeonTorchesLit,
  RACE_LOOK,
  holoClear,
} from '../config/campaign-look';
import { markAt } from '../config/stage-marks';
import { LANTERN_POSTS } from '../config/tuning';
import { LOOK_F } from '../config/tuning-f';
import { townUnlocks } from '../sim/town';
import type { World } from '../sim/types';
import { disposeLook, driveCampaign } from '../ui/title-card';
import { BUNTING_INK, buildFArt, SHAPES, U, type FArt } from './dress-f-art';
import type { PixelDressCtx, PixelDressing } from './dressings';
import type { SpriteBatch } from './sprite-batch';
import { frameKey } from './sprites/animations';

/**
 * Campaign-graphics package f, pixel renderer: its story dressing (see the registry
 * contract at the top of render/dressings.ts). Each frame it hands the story moment to
 * `driveCampaign` (the screen layers and the title card, shared with Full 3D), then draws the
 * sets that moment calls for as painted billboards in the sprite pass: Hazel's ch12 festival
 * (stalls, bunting by the ending, cloth, cake, buns), the Hundred Days' picnic, the Beetle
 * Road's guard house, banners, cart and weather machine, Logged In's scoreboard, holo fence
 * and white room, and ch5's plums and wasps, with c8's fireflies. Reads the world only.
 */

let ctx: PixelDressCtx | null = null;
let art: FArt | null = null;
let clock = 0;

export const dressF: PixelDressing = {
  id: 'f',
  build(c) {
    ctx = c;
    clock = 0;
    art = c.sprites ? buildFArt() : null;
    if (art) c.track(art.sheet);
  },

  update(world: World, stage, daylight, dt) {
    if (!ctx) return;
    const reduce = ctx.reduceMotion();
    clock += dt;
    const m = driveCampaign(world, stage, reduce);
    DRESSING_FLAGS.dungeon.torches =
      dungeonTorchesLit(m.flags.campaign, m.flags.storyChapter) || m.below;
    RACE_LOOK.story = m.flags.campaign === 'hazel' && m.flags.chapter === 5;
    const sp = ctx.sprites;
    if (!art || !sp) return;
    const s = m.sets;
    const dim = 1 - 0.55 * daylight.darkness;
    const d = new Draw(sp.batch, art, dim);

    if (s.festival) {
      // The square's stalls, where it has not unlocked its own.
      const own = townUnlocks(world);
      const stall = sp.sheets.scenery().frames.get(frameKey('stall', 'front', 0));
      if (stall) {
        const spots: Array<[number, number, boolean]> = [
          [-12, 17.5, own.stall],
          [-9.5, 18.5, own.attendant],
          [-14.5, 18.8, own.festival],
        ];
        for (const [x, z, has] of spots)
          if (!has)
            sp.batch.draw({
              sheet: sp.sheets.scenery(),
              rect: stall,
              flip: false,
              x,
              y: 0,
              z,
              mode: 'billboard',
              w: 2.4,
              h: (2.4 * stall.h) / stall.w,
              tint: dim,
            });
      }
      d.flat('cloth', 0.5, 2.5);
      d.up('cake', 0.1, 0, 2.7);
      d.up('tray', 1.4, 0, 2.3);
      bunting(d, buntingShape(m.ending, m.finalChoice));
    }

    // The Beetle Road's below grade: four torches round the Keeper, the flame still if reduced.
    if (m.below) {
      const k = world.keeper.pos;
      for (let i = 0; i < 4; i++) {
        const a = Math.PI / 4 + (i * Math.PI) / 2;
        const flick = reduce ? 0 : Math.floor(clock * 6 + i) % 2;
        d.up(`torch-${flick}`, k.x + Math.cos(a) * 3.4, 0, k.z + Math.sin(a) * 3.4, 1);
      }
    }

    if (s.picnic) {
      const fm = markAt('grove', 'fold-square') ?? { x: 0, z: 2, yaw: 0 };
      d.flat('cloth', fm.x + 1.5, fm.z + 1.2);
      d.up('basket', fm.x + 2.2, 0, fm.z + 1.2);
    }

    if (s.beetle) {
      const gh = markAt('grove', 'guardhouse') ?? { x: -3, z: 20, yaw: 0 };
      d.up('cabin', gh.x, 0, gh.z);
      d.up('cart', LOOK_F.beetle.cart.x, 0, LOOK_F.beetle.cart.z);
      const mc = LOOK_F.beetle.machine;
      d.up('machine', mc.x, 0, mc.z);
      // The vane turns a quarter-step at a time; still under reduced motion.
      d.up(`vane-${reduce ? 1 : Math.floor(clock * 5) % 4}`, mc.x, 2.85, mc.z + 0.02, 1);
    }

    if (s.logged) {
      const bm = markAt('grove', 'board') ?? { x: 3, z: -2, yaw: 0 };
      d.up('board', bm.x, 0, bm.z, 1);
      holoFence(d, reduce);
    }

    if (s.rootRoom) {
      const rm = markAt('grove', 'root-chair') ?? { x: -3, z: -2.5, yaw: 0 };
      d.flat('root-floor', rm.x, rm.z, LOOK_F.root.radius * 2, 1);
      d.up('chair', rm.x, 0, rm.z, 1);
    }

    // Chapter 5: plums on the tree by the gate, wasps round it when motion is allowed.
    const tree = s.plums ? nearestTree(world) : null;
    if (tree) {
      for (let i = 0; i < 21; i++) {
        const a = i * 2.399;
        if (i < 14) {
          const r = 0.7 + ((i * 37) % 10) * 0.07;
          d.up(
            'plum',
            tree.x + Math.cos(a) * r,
            1.9 + ((i * 53) % 10) * 0.07,
            tree.z + Math.sin(a) * r,
            1,
            0.3,
          );
        } else {
          const r = 0.5 + ((i * 29) % 10) * 0.11;
          d.up('plum', tree.x + Math.cos(a) * r, 0, tree.z + Math.sin(a) * r, 1, 0.3);
        }
      }
      if (!reduce) {
        const w = LOOK_F.wasps;
        for (let i = 0; i < w.count; i++) {
          const a = clock * w.speed * (0.8 + i * 0.13) + i * 1.9;
          const r = w.radius * (0.7 + 0.3 * Math.sin(clock * 2.1 + i));
          d.up(
            'wasp',
            tree.x + Math.cos(a) * r,
            w.height + Math.sin(clock * 5 + i * 2) * 0.3,
            tree.z + Math.sin(a) * r,
            1,
            0.26,
          );
        }
      }
    }

    // The fireflies of the walk back.
    if (m.fx.fireflies && !reduce) {
      const f = LOOK_F.fireflies;
      const k = world.keeper.pos;
      for (let i = 0; i < f.count; i++) {
        const a = i * 2.399 + clock * 0.08 * (1 + (i % 3) * 0.3);
        const r = 1.5 + (((i * 37) % 100) / 100) * f.radius + Math.sin(clock * 0.5 + i) * 0.6;
        const y = 0.4 + (0.5 + 0.5 * Math.sin(clock * 0.8 + i * 1.3)) * f.height;
        d.up('glow', k.x + Math.cos(a) * r, y, k.z + Math.sin(a) * r, 1, 0.55);
      }
    }
  },

  dispose() {
    art = null;
    ctx = null;
    disposeLook();
  },
};

/** Small helper over the batch: world-size sprites from the f sheet, lit or glowing. */
class Draw {
  constructor(
    private readonly batch: SpriteBatch,
    private readonly art: FArt,
    private readonly dim: number,
  ) {}

  /** A billboard standing at (x, y, z); `glow` 1 keeps it unlit. */
  up(key: string, x: number, y: number, z: number, glow = 0, scale = 0): void {
    const r = this.art.frame(key);
    const w = scale || r.w / U;
    this.batch.draw({
      sheet: this.art.sheet,
      rect: r,
      flip: false,
      x,
      y,
      z,
      mode: 'billboard',
      w,
      h: (w * r.h) / r.w,
      tint: glow ? 1 : this.dim,
    });
  }

  /** A sprite lying on the ground, `size` wide (default its own size). */
  flat(key: string, x: number, z: number, size = 0, glow = 0): void {
    const r = this.art.frame(key);
    const w = size || r.w / U;
    this.batch.draw({
      sheet: this.art.sheet,
      rect: r,
      flip: false,
      x,
      y: 0,
      z,
      mode: 'flat',
      w,
      h: size ? size : r.h / U,
      tint: glow ? 1 : this.dim,
    });
  }

  /** A translucent, unlit billboard. */
  ghost(key: string, x: number, z: number, w: number, h: number, opacity: number): void {
    this.batch.draw({
      sheet: this.art.sheet,
      rect: this.art.frame(key),
      flip: false,
      x,
      y: 0,
      z,
      mode: 'billboard',
      w,
      h,
      opacity,
      tint: 1,
    });
  }

  /** A pennant hanging with its top at height `y`. */
  pennant(key: string, x: number, y: number, z: number): void {
    const r = this.art.frame(key);
    this.batch.draw({
      sheet: this.art.sheet,
      rect: r,
      flip: false,
      x,
      y: y - r.h / U,
      z,
      mode: 'billboard',
      w: r.w / U,
      h: r.h / U,
      tint: 1,
    });
  }
}

/** Pennants round the four lantern posts: the ending's shape, in four colours. */
function bunting(d: Draw, shape: (typeof SHAPES)[number]): void {
  const posts = LANTERN_POSTS;
  const b = LOOK_F.bunting;
  const n = 26;
  for (let r = 0; r < posts.length; r++) {
    const a = posts[r]!;
    const c = posts[(r + 1) % posts.length]!;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      d.pennant(
        `pennant-${shape}-${(i + r) % BUNTING_INK.length}`,
        a.x + (c.x - a.x) * t,
        b.postHeight - b.sag * 4 * t * (1 - t),
        a.z + (c.z - a.z) * t,
      );
    }
  }
}

/** A ring of translucent holographic panels round the lobby, a gap left at the way in. */
function holoFence(d: Draw, reduce: boolean): void {
  const h = LOOK_F.holo;
  const n = 72;
  const pulse = reduce ? 0.5 : 0.42 + 0.1 * Math.sin(clock * 2.2);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    if (Math.abs(Math.atan2(Math.sin(a), Math.cos(a)) - Math.PI / 2) < 0.2) continue;
    if (!holoClear(h.cx + Math.cos(a) * h.radius, h.cz + Math.sin(a) * h.radius)) continue;
    d.ghost(
      'holo',
      h.cx + Math.cos(a) * h.radius,
      h.cz + Math.sin(a) * h.radius,
      1.05,
      h.height,
      pulse,
    );
  }
}

function nearestTree(world: World): { x: number; z: number } | null {
  let best: { x: number; z: number } | null = null;
  let bd = Infinity;
  for (const t of world.trees) {
    const dd = Math.hypot(t.pos.x - LOOK_F.plumNear.x, t.pos.z - LOOK_F.plumNear.z);
    if (dd < bd) {
      bd = dd;
      best = t.pos;
    }
  }
  return best;
}
