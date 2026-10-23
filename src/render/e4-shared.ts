import { seasonFor } from '../config/campaign-look';
import { CG4_E4 } from '../config/tuning-e4';
import type { SceneStage } from '../config/story';
import { GROVE, LANTERN_POSTS } from '../config/tuning';
import { groveHeight, WATER_LEVEL } from '../render3d/terrain-shape';
import type { Daylight } from './daylight';
import { pondIceWanted } from './dress-w';
import { lanternLights, type LampState } from './dress-e';
import type { StageFlags } from './scene-stage';

/**
 * Package e4's rules, shared by the pixel and the Full 3D dressing so both draw the same
 * things in the same scenes: which scene wants which effect, which lamps are lit, where a
 * streak of lamplight lands on the water, and the small hashes that pick a figure or a
 * bird's course. Pure: nothing here touches the world or the DOM.
 */

/** A stable hash in [0, 1). */
export function hash01(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/** A string's hash in [0, 1), for picking per scene. */
export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 100000) / 100000;
}

const propOf = (stage: SceneStage, key: string) => stage.props?.[key];
const shows = (v: string | undefined) => v === 'show' || v === 'lit' || v === 'final';

/** K18: the scene wants figures in the lit windows. */
export function wantsFigures(stage: SceneStage): boolean {
  return shows(propOf(stage, 'windowFigures'));
}

/** K42: the scene wants paper lanterns rising. */
export function wantsRising(stage: SceneStage, flags: StageFlags): boolean {
  if (propOf(stage, 'risingLanterns') === 'hide') return false;
  if (shows(propOf(stage, 'risingLanterns'))) return true;
  return flags.sceneId !== null && CG4_E4.scenes.rising.includes(flags.sceneId);
}

/** K45: the scene is Corvin at the gate, and the frost should bloom on it. */
export function wantsGateFrost(stage: SceneStage, flags: StageFlags): boolean {
  if (propOf(stage, 'gateFrost') === 'hide') return false;
  if (shows(propOf(stage, 'gateFrost'))) return true;
  return flags.sceneId !== null && CG4_E4.scenes.frost.includes(flags.sceneId);
}

/** K46: the scene is Logged In's boot-up. */
export function wantsBoot(stage: SceneStage, flags: StageFlags): boolean {
  if (propOf(stage, 'bootUp') === 'hide') return false;
  if (shows(propOf(stage, 'bootUp'))) return true;
  return (
    flags.campaign === 'logged' &&
    flags.sceneId !== null &&
    CG4_E4.scenes.boot.includes(flags.sceneId)
  );
}

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * K27, K43: Hazel's season at home: the staged one, else the chapter's own (the same call
 * the ground's season uses), so the plot and the ground always agree. Null elsewhere.
 */
export function hazelSeason(stage: SceneStage, flags: StageFlags): Season | null {
  if (flags.campaign !== 'hazel' || flags.location !== 'grove' || stage.exclusive) return null;
  return seasonFor(stage, flags.campaign, flags.chapter)?.season ?? null;
}

/** K43: whether the cottage wears its season (the `wreath` prop: show, or hide to turn it off). */
export function wantsWreath(stage: SceneStage): boolean {
  return shows(propOf(stage, 'wreath'));
}

/** Whether the lamps are on in this frame's light (the pixel view's rule, 3D's `lampsOn`). */
export function lampsOnFor(daylight: Daylight): boolean {
  return daylight.lanterns || daylight.darkness > 0.5;
}

/** A lit lamp's state, or null when it is out or the lamps are off. */
export function litState(
  states: Partial<Record<string, LampState>>,
  id: string,
  lampsOn: boolean,
  darkness: number,
): LampState | null {
  const st = states[id];
  if (st === 'out') return null;
  if (st) return darkness > 0.3 || lampsOn ? st : null;
  return lampsOn ? 'lit' : null;
}

export { lanternLights, pondIceWanted };

/** One streak of lamplight on the water: where it starts, and the lamp it belongs to. */
export interface Streak {
  id: string;
  x: number;
  z: number;
}

let anchors: Streak[] | null = null;

/** The post's reflection point on the water: under it, else the nearest water within reach. */
export function streakAnchors(): readonly Streak[] {
  if (anchors) return anchors;
  const wet = (x: number, z: number) => groveHeight(x, z) < WATER_LEVEL - 0.05;
  const out: Streak[] = [];
  for (const p of LANTERN_POSTS) {
    if (wet(p.x, p.z)) {
      out.push({ id: p.id, x: p.x, z: p.z });
      continue;
    }
    let best: Streak | null = null;
    let bestD: number = CG4_E4.streak.reach;
    for (let a = 0; a < 24; a++) {
      const ang = (a / 24) * Math.PI * 2;
      for (let d = 0.3; d <= bestD; d += 0.3) {
        const x = p.x + Math.cos(ang) * d;
        const z = p.z + Math.sin(ang) * d;
        if (wet(x, z)) {
          best = {
            id: p.id,
            x: p.x + Math.cos(ang) * (d + 0.5),
            z: p.z + Math.sin(ang) * (d + 0.5),
          };
          bestD = d;
          break;
        }
      }
    }
    if (best) out.push(best);
  }
  anchors = out;
  return out;
}

/** The pond's centre, for scenes that want the streaks drawn nowhere else. */
export const POND = GROVE.pond;

/** K18: which figure (0..variants-1) a window shows, by house and scene beat. */
export function figureFor(houseKey: number, sceneId: string | null): number {
  const beat = sceneId ? hashStr(sceneId) : 0;
  return Math.floor(
    hash01(houseKey * 3.7 + beat * 91 + CG4_E4.figures.salt) * CG4_E4.figures.variants,
  );
}
