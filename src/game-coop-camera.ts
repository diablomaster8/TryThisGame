import { CAMERA, GROVE3D, WORLD_SURVEY } from './config/tuning';
import { COOP_CAMERA } from './config/tuning-r18d2';
import { regionOf } from './sim/regions';
import { regionCameraFor } from './config/region-camera';
import {
  coopFrame,
  lastMover,
  type Mover,
  type Spot,
  type ViewSize,
} from './render/camera-subject';
import type { Game } from './game';

interface CoopCam {
  mover: Mover;
  was: { k1: boolean; k2: boolean };
  framed: boolean;
  /** The mode the camera was in last frame: 'k1' (unchanged), 'k2', or 'mid'. */
  mode: string;
  /** Time the mode last changed, ms. */
  changedMs: number;
}

const state = new WeakMap<Game, CoopCam>();

/** The view size in world units at zoom step `index`, in whichever renderer is drawing. */
function viewAt(g: Game, index: number): ViewSize {
  if (!g.scene3d) return g.camera.extentAt(index);
  const base =
    index < 0 ? WORLD_SURVEY.distance3d : (GROVE3D.distance[index] ?? GROVE3D.distance[0]);
  const k = regionCameraFor(regionOf(g.world.location)).distanceK3d ?? 1;
  const h = 2 * base * k * Math.tan((GROVE3D.fovDeg * Math.PI) / 360);
  return { w: h * (g.camera.visibleWidth / g.camera.visibleHeight), h };
}

export interface CoopAim {
  /** Where to aim, or null to keep Keeper 1 (still gliding back from the midpoint). */
  at: Spot | null;
  /** The glide rate to use now, or null for the usual one. */
  rate: number | null;
  /** Reduced motion: cut to the new subject this frame. */
  cut: boolean;
}

/**
 * R18 d2 (R0140): the two-Keeper camera. Returns where to aim when co-op wants something other
 * than Keeper 1 (the midpoint of both, or Keeper 2 when it moved last), or null to leave the
 * usual Keeper-1 follow untouched. `blocked`: a scene, an end-of-life focus or a speaker owns
 * the camera, so dialogue still wins. Also holds the view one zoom notch out when that fits both.
 */
export function coopAim(g: Game, nowMs: number, blocked: boolean): CoopAim | null {
  const w = g.world;
  const k1 = w.keeper;
  const k2 = w.keeper2;
  let st = state.get(g);
  if (!w.coop.active || !k2 || blocked) {
    g.camera.coopNotch(false, nowMs);
    if (st) state.delete(g);
    return null;
  }
  st ??= { mover: 1, was: { k1: false, k2: false }, framed: false, mode: 'k1', changedMs: nowMs };
  state.set(g, st);
  const now = {
    k1: k1.input.x !== 0 || k1.input.z !== 0 || k1.moveTarget !== null,
    k2: k2.input.x !== 0 || k2.input.z !== 0,
  };
  st.mover = lastMover(st.mover, st.was, now);
  st.was = now;
  const base = g.camera.baseZoomIndex;
  const pitch = g.scene3d ? (GROVE3D.pitchDeg * Math.PI) / 180 : CAMERA.pitchRad;
  const frame = coopFrame(
    k1.pos,
    k2.pos,
    st.mover,
    g.camera.currentYaw,
    pitch,
    viewAt(g, base),
    base >= 0 ? viewAt(g, base - 1) : null,
    st.framed,
    COOP_CAMERA.enterFit,
    COOP_CAMERA.exitFit,
  );
  st.framed = frame.framed;
  g.camera.coopNotch(frame.notch, nowMs);
  const mode = frame.framed ? 'mid' : st.mover === 2 ? 'k2' : 'k1';
  let cut = false;
  if (mode !== st.mode) {
    st.mode = mode;
    st.changedMs = nowMs;
    cut = g.reduceMotion;
  }
  const gliding = nowMs - st.changedMs < COOP_CAMERA.switchMs;
  return {
    at: mode === 'k1' ? null : frame.at,
    rate: gliding ? COOP_CAMERA.switchRate : null,
    cut,
  };
}
