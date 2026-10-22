import { CanvasTexture, Sprite, SpriteMaterial, type Vector3 } from 'three';
import { lanternCarriers } from '../config/npc-looks';
import { markAt } from '../config/stage-marks';
import type { SceneStage } from '../config/story';
import { LANTERN_POSTS } from '../config/tuning';
import { HAND_LANTERN, HUSH, LANTERN_E, LANTERN_IDS } from '../config/tuning-e';
import type { World } from '../sim/types';
import type { Daylight } from './daylight';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { npcHere, stageFlags, type StageFlags } from './scene-stage';
import { frameKey } from './sprites/animations';
import { buildHandLanternSheet } from './sprites/keeper';

/**
 * Campaign-graphics package e, pixel renderer ("people and lanterns"): the four lantern
 * posts lit, out or flickering by name (H3, and the Hush's ring, M11), the vigil's waves,
 * hand lanterns for the cast who carry one (H4) and the Hush colossus. NPC silhouettes (H12)
 * live in the Keeper sheet (sprites/keeper.ts) and Moss's sit (M6) in `nubbinSits`. The
 * contract is at the top of render/dressings.ts; the lamp-state rule below is shared with
 * the 3D dressing (render3d/dress-e.ts).
 */

export type LampState = 'lit' | 'out' | 'flicker' | 'low';

/**
 * The state of each lantern post, by id: what the vigil's waves, the Hush's ring and the
 * scene's own `stage.lights` say (the stage wins). Posts it names nothing for are left to
 * the scene (dusk, or lit by the Keeper). `sceneT` is seconds since the scene began.
 */
export function lanternLights(
  flags: StageFlags,
  stage: SceneStage,
  sceneT: number,
  reduce: boolean,
): Partial<Record<string, LampState>> {
  const out: Partial<Record<string, LampState>> = {};
  if (flags.location !== 'grove') return out;
  // Chapter 10: the first wave puts the stream lantern out, the second shrinks the
  // long-grass one to a blue bead (the sim keeps it lit; nothing else reads it).
  if (flags.vigilWave !== null && !flags.vigilDone) {
    for (const id of LANTERN_IDS) out[id] = 'lit';
    if (flags.vigilWave >= 1) out['lantern-2'] = 'out';
    if (flags.vigilWave >= 2) out['lantern-4'] = 'low';
  }
  // M11: the ring runs outward from the Hush, nearest post first.
  const sid = flags.sceneId;
  const goes = sid !== null && HUSH.out.includes(sid);
  const comes = sid !== null && HUSH.back.includes(sid);
  if (goes || comes) {
    for (const p of LANTERN_POSTS) {
      const d = Math.hypot(p.x - HUSH.origin.x, p.z - HUSH.origin.z);
      const gone = reduce || sceneT >= HUSH.delay + d / HUSH.speed;
      out[p.id] = goes ? (gone ? 'out' : 'lit') : gone ? 'lit' : 'out';
    }
  }
  if (sid === 'c10-vigil') out['lantern-4'] = 'low';
  for (const [id, st] of Object.entries(stage.lights ?? {})) {
    if (id.startsWith('lantern-')) out[id] = st;
  }
  return out;
}

/** The flicker's value 0..1 at time `t`: two incommensurate waves, never the same twice. */
export function flickerAt(t: number, hz: number): number {
  const a = Math.sin(t * hz * 1.0 + 0.3) * 0.6 + Math.sin(t * hz * 1.63 + 1.7) * 0.4;
  return 0.5 + 0.5 * a;
}

/** Whether the Hush's colossus shows for this scene, and how far in (0..1). */
export function hushPresence(sid: string | null, sceneT: number, reduce: boolean): number {
  if (sid === null) return 0;
  const k = reduce ? 1 : Math.min(1, sceneT / HUSH.colossus.fadeIn);
  if (HUSH.out.includes(sid)) return k;
  if (HUSH.back.includes(sid)) return 1 - k;
  return 0;
}

/** A soft round glow, white at the middle, clear at the edge (tinted by the sprite). */
export function glowTexture(): CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.45)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

/** The Hush: a tall, soft grey mass with shoulders and a round head, fog-shaped, no face. */
export function colossusTexture(): CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 192;
  const g = c.getContext('2d')!;
  const blob = (x: number, y: number, rx: number, ry: number, a: number) => {
    g.save();
    g.translate(x, y);
    g.scale(rx / ry, 1);
    const grad = g.createRadialGradient(0, 0, 0, 0, 0, ry);
    grad.addColorStop(0, `rgba(150,156,172,${a})`);
    grad.addColorStop(0.6, `rgba(150,156,172,${a * 0.55})`);
    grad.addColorStop(1, 'rgba(150,156,172,0)');
    g.fillStyle = grad;
    g.beginPath();
    g.arc(0, 0, ry, 0, Math.PI * 2);
    g.fill();
    g.restore();
  };
  blob(64, 120, 54, 54, 0.8);
  blob(64, 88, 40, 46, 0.7);
  blob(64, 46, 24, 24, 0.75);
  // Fade the foot into fog and keep every edge clear of the card's border.
  g.globalCompositeOperation = 'destination-in';
  const fade = g.createLinearGradient(0, 0, 0, 192);
  fade.addColorStop(0, 'rgba(0,0,0,1)');
  fade.addColorStop(0.55, 'rgba(0,0,0,1)');
  fade.addColorStop(0.95, 'rgba(0,0,0,0)');
  g.fillStyle = fade;
  g.fillRect(0, 0, 128, 192);
  return new CanvasTexture(c);
}

/** One scene's clock: seconds since the head of the queue changed. */
export class SceneClock {
  private id: string | null = null;
  t = 0;
  tick(id: string | null, dt: number): number {
    if (id !== this.id) {
      this.id = id;
      this.t = 0;
    }
    this.t += dt;
    return this.t;
  }
}

class PixelE implements PixelDressing {
  readonly id = 'e';
  private ctx: PixelDressCtx | null = null;
  private clock = new SceneClock();
  private time = 0;
  private colossus: Sprite | null = null;
  private lights: ReturnType<typeof buildHandLanternSheet> | null = null;

  build(ctx: PixelDressCtx): void {
    this.ctx = ctx;
    this.clock = new SceneClock();
    this.time = 0;
    this.lights = null;
    this.colossus = null;
    if (typeof document === 'undefined') return;
    try {
      const tex = colossusTexture();
      const mat = new SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        fog: false,
        opacity: 0,
      });
      const s = new Sprite(mat);
      const c = HUSH.colossus;
      s.scale.set(c.width, c.height, 1);
      s.position.set(HUSH.origin.x, c.y, HUSH.origin.z);
      s.visible = false;
      ctx.groups.grove.add(s);
      ctx.track(tex);
      ctx.track(mat);
      this.colossus = s;
    } catch {
      this.colossus = null;
    }
  }

  update(world: World, stage: SceneStage, daylight: Daylight, dt: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const reduce = ctx.reduceMotion();
    const flags = stageFlags(world, stage);
    this.time += dt;
    const sceneT = this.clock.tick(flags.sceneId, dt);

    if (this.colossus) {
      const p = flags.location === 'grove' ? hushPresence(flags.sceneId, sceneT, reduce) : 0;
      this.colossus.visible = p > 0.001;
      this.colossus.material.opacity = p * HUSH.colossus.opacity;
    }
    const sp = ctx.sprites;
    if (!sp || flags.location !== 'grove') return;
    const batch = sp.batch;
    // The camera's toward-the-viewer direction on the ground, from the batch's right vector.
    const right = (batch as unknown as { right: Vector3 }).right;
    const tx = -right.z;
    const tz = right.x;
    this.lights ??= sp.sheets.get('e:lights', buildHandLanternSheet);
    const sheet = this.lights;
    const scenery = sp.sheets.scenery();

    // H3: posts by name.
    const states = lanternLights(flags, stage, sceneT, reduce);
    const lift = LANTERN_E.overlayLift;
    for (const post of LANTERN_POSTS) {
      const st = states[post.id];
      if (!st) continue;
      const lit = st === 'lit' || st === 'flicker';
      const rect = scenery.frames.get(
        frameKey(lit ? 'lanternPost-lit' : 'lanternPost', 'front', 0),
      );
      if (!rect) continue;
      let k = 1;
      if (st === 'flicker') {
        const f = LANTERN_E.pixelFlicker;
        k = reduce
          ? LANTERN_E.pixelSteadyDim
          : f.min + (f.max - f.min) * flickerAt(this.time, f.hz);
      }
      const w = 0.9;
      const h = (w * rect.h) / rect.w;
      const x = post.x + tx * lift;
      const z = post.z + tz * lift;
      batch.draw({
        sheet: scenery,
        rect,
        flip: false,
        x,
        y: 0,
        z,
        mode: 'billboard',
        w,
        h,
        tint: lit ? 1.1 * Math.min(1, k) : 1 - 0.55 * daylight.darkness,
      });
      if (st === 'out') continue;
      // The halo over the lamp head: warm for a lit post, a small cold bead for `low`.
      const head = h * (35 / 48);
      const size = st === 'low' ? LANTERN_E.haloLowSize : LANTERN_E.haloSize;
      const halo = sheet.frames.get(st === 'low' ? 'post-halo-small' : 'post-halo');
      if (!halo) continue;
      // A stepped glow: three faint discs, so the edge reads as a falloff, not a plate.
      for (const grow of [0.45, 0.7, 1]) {
        batch.draw({
          sheet,
          rect: halo,
          flip: false,
          x: x + tx * lift,
          y: head - (size * grow) / 2,
          z: z + tz * lift,
          mode: 'billboard',
          w: size * grow,
          h: size * grow,
          opacity: LANTERN_E.haloOpacity * (st === 'low' ? 0.8 : 1) * Math.min(1, k),
          tint: st === 'low' ? 0.8 : 1.2,
        });
      }
    }

    // H4: hand lanterns for the cast who carry one, on their marks.
    const frame = reduce ? 0 : Math.floor((this.time * 1000) / HAND_LANTERN.frameMs) % 2;
    for (const c of lanternCarriers(stage)) {
      const here = world.npcs.some(
        (n) => n.trainer === c.who && npcHere(world.location, n.trainer),
      );
      const m = markAt(world.location, c.mark);
      if (!here || !m) continue;
      const lamp = sheet.frames.get(`hand-${frame}`);
      const glow = sheet.frames.get('hand-halo');
      if (!lamp || !glow) continue;
      const base = { sheet, flip: false, y: 0, mode: 'billboard' as const };
      batch.draw({
        ...base,
        rect: glow,
        x: m.x + tx * 0.01,
        z: m.z + tz * 0.01,
        opacity: HAND_LANTERN.glowOpacity * 0.5,
        tint: 1.2,
      });
      batch.draw({ ...base, rect: lamp, x: m.x + tx * 0.02, z: m.z + tz * 0.02, tint: 1.15 });
    }
  }

  dispose(): void {
    this.colossus?.removeFromParent();
    this.colossus = null;
    this.ctx = null;
  }
}

export const dressE: PixelDressing = new PixelE();
