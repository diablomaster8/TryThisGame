import { CG4_D4 } from '../config/tuning-d4';
import type { SceneStage } from '../config/story';
import { HUSH } from '../config/tuning-e';
import type { StageFlags } from './scene-stage';

/**
 * Campaign graphics 4, package d4: the render-only bookkeeping both renderers share for the
 * Hush's walk (K17), the moon (K24), snow cover (K25), path wear (K26), puddles (K34) and the
 * wind (K35). Pure: no DOM, no Three.js, nothing written to the world. Each renderer asks
 * these questions and draws the answers its own way.
 */

export type MoonPhase = 'new' | 'crescent' | 'half' | 'full';

/** K24: the stage's moon, else the chapter's own phase. */
export function moonPhaseFor(flags: StageFlags): MoonPhase {
  if (flags.moon) return flags.moon;
  const m = CG4_D4.moon;
  if (flags.campaign === 'hazel') {
    return m.hazel[Math.min(11, Math.max(0, flags.chapter - 1))] ?? 'half';
  }
  if (flags.campaign === 'hundred' && flags.chapter === 9) return m.hundred9;
  const i = flags.storyChapter ?? 0;
  return m.cycle[i % m.cycle.length] ?? 'half';
}

/** K25: the snow cover 0..1 the vigil has laid so far (Hazel's chapter 10 and the morning after). */
export function snowCover(flags: StageFlags): number {
  if (flags.campaign !== 'hazel') return 0;
  const s = CG4_D4.snow;
  if (flags.chapter === 11) return s.afterChapter;
  if (flags.chapter !== 10) return 0;
  if (flags.vigilWave === null) return 0;
  if (flags.vigilDone) return s.byWave[s.byWave.length - 1]!;
  return s.byWave[Math.min(s.byWave.length - 1, flags.vigilWave)]!;
}

/** The pixel repaint level (0..3) a cover or wear amount falls in, by the given thresholds. */
export function levelOf(amount: number, thresholds: readonly number[]): number {
  let level = 0;
  for (const t of thresholds) if (amount >= t) level++;
  return level;
}

/** K26: path wear 0..1 by chapter (Hazel's twelve, or a separate campaign's chapters). */
export function pathWear(flags: StageFlags): number {
  const w = CG4_D4.wear;
  if (flags.campaign === 'hazel') {
    if (flags.chapter < 1) return 0;
    return ((Math.min(12, flags.chapter) - 1) / 11) * w.max;
  }
  if (flags.storyChapter === null) return 0;
  return Math.min(1, flags.storyChapter / 8) * w.campaignMax;
}

/** K34: whether it is raining on the Grove for this frame (the sim's weather, or the scene's). */
export function rainingNow(weatherKind: string, stage: SceneStage): boolean {
  return weatherKind === 'rain' || stage.weather === 'rain';
}

/**
 * K34: how wet the ground is, 0..1. It rises over a scene's worth of rain and dries over the
 * next scene; a reload starts dry and grows again. Under reduced motion the change is the
 * same (it is slow, not a flicker).
 */
export class WetTracker {
  wet = 0;

  update(raining: boolean, dt: number): number {
    const w = CG4_D4.wet;
    if (raining) this.wet = Math.min(1, this.wet + dt / w.riseS);
    else this.wet = Math.max(0, this.wet - dt / w.dryS);
    return this.wet;
  }

  reset(): void {
    this.wet = 0;
  }
}

/** K35: the wind's strength for a scene, 0 calm .. 1 windy, with its direction vector. */
export function windTarget(stage: SceneStage): { windy: boolean; dirX: number; dirZ: number } {
  return {
    windy: stage.weather === 'wind',
    dirX: Math.cos(CG4_D4.wind.dir),
    dirZ: Math.sin(CG4_D4.wind.dir),
  };
}

/** The wind both renderers read: eased toward the scene's wish. */
export class WindState {
  windy = 0;
  readonly dirX = Math.cos(CG4_D4.wind.dir);
  readonly dirZ = Math.sin(CG4_D4.wind.dir);

  update(stage: SceneStage, dt: number, reduce: boolean): void {
    const goal = stage.weather === 'wind' ? 1 : 0;
    const step = reduce ? 1 : Math.min(1, dt / CG4_D4.wind.easeS);
    this.windy += (goal - this.windy) * step;
    if (Math.abs(goal - this.windy) < 0.002) this.windy = goal;
  }

  /** The steady lean of a blade tip, in blade-height units. */
  get lean(): number {
    const w = CG4_D4.wind;
    return w.lean + (w.leanWindy - w.lean) * this.windy;
  }

  /** The gust's amplitude. */
  get gust(): number {
    const w = CG4_D4.wind;
    return w.gust + (w.gustWindy - w.gust) * this.windy;
  }
}

export interface HushPlace {
  x: number;
  z: number;
  /** How far along the whole path, 0..1. */
  u: number;
}

/** A point along the Hush's path of marks at `u` (0 the `hush` mark, 1 the last mark). */
export function hushPathAt(u: number): { x: number; z: number } {
  const p = CG4_D4.hush.path;
  const k = Math.max(0, Math.min(1, u)) * (p.length - 1);
  const i = Math.min(p.length - 2, Math.floor(k));
  const f = k - i;
  const a = p[i]!;
  const b = p[i + 1]!;
  return { x: a.x + (b.x - a.x) * f, z: a.z + (b.z - a.z) * f };
}

/**
 * K17: where the Hush stands in a scene of its walk, or null when it is not on stage. Each of
 * the walk's scenes takes a stretch of the path, a smooth step from its first line; under
 * reduced motion it stands at the stretch's end for the whole scene.
 */
export function hushWalk(
  sceneId: string | null,
  sceneT: number,
  reduce: boolean,
): HushPlace | null {
  if (sceneId === null) return null;
  const n = HUSH.out.length;
  const outAt = HUSH.out.indexOf(sceneId);
  let u: number;
  if (outAt >= 0) {
    const k = reduce ? 1 : Math.max(0, Math.min(1, sceneT / CG4_D4.hush.stretchS));
    const eased = k * k * (3 - 2 * k);
    u = (outAt + eased) / n;
  } else if (HUSH.back.includes(sceneId)) u = 1;
  else return null;
  const at = hushPathAt(u);
  return { ...at, u };
}

/** A fog puff: where it stands and how strong it is, 0..1. */
export interface FogPuff {
  x: number;
  z: number;
  k: number;
}

const FOG_POSTS: ReadonlyArray<{ id: string; x: number; z: number }> = [];

/**
 * K17: the ground-fog band behind the Hush: puffs laid along the path it has walked, then a
 * short tendril from the nearest point of that path to each lantern it put out, growing with
 * the lantern's frost (so the band reaches a lantern as that lantern goes out).
 */
export function hushFog(
  place: HushPlace,
  grown: ReadonlyMap<string, number>,
  posts: ReadonlyArray<{ id: string; x: number; z: number }> = FOG_POSTS,
  /** The renderer's own offset of the figure's footing (the 3D card stands toward the camera). */
  dz = 0,
): FogPuff[] {
  const c = CG4_D4.hush;
  const out: FogPuff[] = [];
  for (let i = 0; i < c.pathPuffs; i++) {
    const t = i / (c.pathPuffs - 1);
    const at = hushPathAt(place.u * t);
    // The band thins toward its tail, the head is the strongest.
    out.push({ x: at.x, z: at.z + dz, k: 0.35 + 0.65 * t });
  }
  for (const p of posts) {
    const k = grown.get(p.id);
    if (k === undefined || k <= 0.01) continue;
    // The nearest of the walked path's points to the lantern.
    let best = hushPathAt(0);
    let bd = Infinity;
    for (let i = 0; i <= 12; i++) {
      const at = hushPathAt((place.u * i) / 12);
      const d = Math.hypot(at.x - p.x, at.z + dz - p.z);
      if (d < bd) {
        bd = d;
        best = { x: at.x, z: at.z + dz };
      }
    }
    for (let j = 1; j <= c.tendrilPuffs; j++) {
      const f = j / c.tendrilPuffs;
      if (f > k + 0.001) break;
      out.push({ x: best.x + (p.x - best.x) * f, z: best.z + (p.z - best.z) * f, k: 0.55 });
    }
  }
  return out;
}
