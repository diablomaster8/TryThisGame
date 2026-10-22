import { CanvasTexture } from 'three';
import { markAt } from '../config/stage-marks';
import type { SceneStage } from '../config/story';
import { HUSH } from '../config/tuning-e';
import { CG2_Y } from '../config/tuning-y';
import { flickerAt, type LampState } from './dress-e';
import type { StageFlags } from './scene-stage';

/**
 * Campaign graphics 2, package y: the pure rules both renderers share (render/dress-y.ts
 * for pixel, render3d/dress-y.ts for Full 3D): which lights are out, how a flickering
 * post steps, Dawn & Dusk's shutters, the lantern string's points, and the first-light
 * board. Nothing here touches the sim or a renderer.
 */

/** C5: the windows' state for this scene, or null to leave them to the clock. */
export function windowsState(flags: StageFlags, stage: SceneStage): 'lit' | 'out' | null {
  const named = stage.lights?.windows;
  if (named) return named;
  // Logged In's Night Grove (ch4, ch5): "the lights off", until content names it.
  if (flags.storyline === 'logged' && (flags.chapter === 4 || flags.chapter === 5)) return 'out';
  // The Hundred Days ch9: "where it walks, lamps go out", the Fold's windows with the posts.
  if (flags.sceneId !== null && HUSH.out.includes(flags.sceneId)) return 'out';
  return null;
}

/** H13: a post's share of full light, 0..1, for its state (`flicker` steps between two levels). */
export function lampLevel(state: LampState | undefined, time: number, reduce: boolean): number {
  if (state === undefined || state === 'lit') return 1;
  if (state === 'out') return 0;
  if (state === 'low') return CG2_Y.lamp.flickerLow;
  // Flicker: two levels only, held on the low one when motion is reduced.
  if (reduce) return CG2_Y.lamp.flickerLow;
  return flickerAt(time, CG2_Y.lamp.flickerHz) > 0.5 ? 1 : CG2_Y.lamp.flickerLow;
}

/** M6: the crest houses' shutters: the stage's, else open at dawn and shut at dusk. */
export function shuttersFor(flags: StageFlags, stage: SceneStage): 'open' | 'shut' | null {
  if (flags.half === null) return null;
  const p = stage.props?.shutters;
  if (p === 'open' || p === 'shut') return p;
  return flags.half === 'dawn' ? 'open' : 'shut';
}

/** M15: whether the board shows its final message. */
export function boardFinal(stage: SceneStage): boolean {
  return stage.props?.board === 'final';
}

/** M15: the first-light band's strength (0..1) for this scene. */
export function firstLightFor(stage: SceneStage): number {
  const F = CG2_Y.firstLight;
  if (!boardFinal(stage)) return 0;
  const h = stage.hour;
  return h !== undefined && h >= F.from && h <= F.to ? F.strength : 0;
}

/** H11, M10: how far the pixel post pass splits its tone (0 plain, 1 fully split). */
export function postSplitFor(flags: StageFlags, stage: SceneStage): number {
  if (stage.grade === 'crisp') return 0.85;
  if (flags.half === 'dawn') return 1;
  return 0;
}

export interface Pt {
  x: number;
  y: number;
  z: number;
}

/**
 * M11: where the lantern string hangs, when the stage asks for it and the story has a
 * place for it: the festival ring in Hazel's last chapter, the Fold's doors in the Hundred
 * Days. `poles` stand at the anchors; `lamps` are the paper lanterns on the swags between
 * them (closing the loop); `cords` are points along each swag between lanterns.
 */
export interface LanternString {
  key: string;
  poles: Pt[];
  lamps: Pt[];
  cords: Pt[];
}

export function lanternString(
  flags: StageFlags,
  stage: SceneStage,
  ground: (x: number, z: number) => number = () => 0,
): LanternString | null {
  if (stage.props?.lanternString !== 'lit') return null;
  const S = CG2_Y.string;
  const names =
    flags.storyline === 'hundred' || stage.place === 'fold'
      ? S.fold
      : flags.campaign === 'hazel' || stage.place === 'festival'
        ? S.festival
        : null;
  if (!names) return null;
  const poles: Pt[] = [];
  for (const n of names) {
    const m = markAt('grove', n);
    if (m) poles.push({ x: m.x, y: ground(m.x, m.z), z: m.z });
  }
  if (poles.length < 3) return null;
  const lamps: Pt[] = [];
  const cords: Pt[] = [];
  const per = S.perSwag * 3 + 3;
  for (let i = 0; i < poles.length; i++) {
    const a = poles[i]!;
    const b = poles[(i + 1) % poles.length]!;
    // Two cord points between neighbouring lanterns, so the line reads as one cord.
    for (let k = 1; k < per; k++) {
      const p = swagAt(a, b, k / per);
      if (k % 3 === 0) lamps.push({ ...p, y: p.y - 0.12 });
      else cords.push(p);
    }
  }
  return { key: names.join(','), poles, lamps, cords };
}

/** A point on the cord from pole `a` to pole `b` (both on the ground), `t` 0..1 along it. */
export function swagAt(a: Pt, b: Pt, t: number): Pt {
  const S = CG2_Y.string;
  const sag = S.sag * Math.min(1.6, Math.hypot(b.x - a.x, b.z - a.z) / 6 + 0.4);
  const x = a.x + (b.x - a.x) * t;
  const z = a.z + (b.z - a.z) * t;
  const g = a.y + (b.y - a.y) * t;
  // A catenary is near enough a parabola over a short span.
  return { x, y: g + S.poleHeight - sag * 4 * t * (1 - t), z };
}

/** The cord as segment end points (pairs), pole top to pole top round the loop. */
export function stringSegments(str: LanternString, steps = 16): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < str.poles.length; i++) {
    const a = str.poles[i]!;
    const b = str.poles[(i + 1) % str.poles.length]!;
    for (let k = 0; k < steps; k++)
      out.push(swagAt(a, b, k / steps), swagAt(a, b, (k + 1) / steps));
  }
  return out;
}

/** A deterministic pseudo-random 0..1 for a seed (render-side scatter; the sim is not involved). */
export function hash01(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/** The board's final message on a card, painted once (white-cyan on dark, as the board). */
export function boardFinalTexture(): CanvasTexture {
  const B = CG2_Y.firstLight.board;
  const c = document.createElement('canvas');
  c.width = 320;
  c.height = Math.round((320 * B.h) / B.w);
  const g = c.getContext('2d')!;
  g.fillStyle = '#04141f';
  g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = '#52e6ff';
  g.lineWidth = 8;
  g.strokeRect(6, 6, c.width - 12, c.height - 12);
  g.textAlign = 'center';
  g.fillStyle = '#ffe27a';
  g.font = 'bold 44px monospace';
  g.fillText(B.title, c.width / 2, c.height * 0.42);
  g.fillStyle = '#9fe9ff';
  g.font = 'bold 22px monospace';
  B.rows.forEach((r, i) => g.fillText(r, c.width / 2, c.height * 0.62 + i * 28));
  return new CanvasTexture(c);
}
