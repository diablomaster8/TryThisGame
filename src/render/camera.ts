import { MathUtils, OrthographicCamera, Vector3 } from 'three';
import { CAMERA, RENDER } from '../config/tuning';

// ---------- pure helpers (unit tested) ----------

export function wrapYawIndex(index: number, steps: number = CAMERA.yawSteps): number {
  return ((index % steps) + steps) % steps;
}

export function yawIndexToRadians(index: number, stepDeg: number = CAMERA.yawStepDeg): number {
  return MathUtils.degToRad(index * stepDeg);
}

/** Signed shortest rotation from `from` to `to`, in radians, within (-PI, PI]. */
export function shortestAngleDelta(from: number, to: number): number {
  const twoPi = Math.PI * 2;
  let d = (to - from) % twoPi;
  if (d > Math.PI) d -= twoPi;
  if (d <= -Math.PI) d += twoPi;
  return d;
}

/** Visible world height for an orthographic camera at a given pixels-per-unit zoom. */
export function computeViewHeight(
  targetHeight: number = RENDER.targetHeight,
  pixelsPerUnit: number,
): number {
  return targetHeight / pixelsPerUnit;
}

/** Camera position on the orbit sphere around `target`. */
export function orbitPosition(
  yaw: number,
  pitch: number,
  distance: number,
  target: Vector3,
  out: Vector3 = new Vector3(),
): Vector3 {
  const cp = Math.cos(pitch);
  return out.set(
    target.x + distance * Math.sin(yaw) * cp,
    target.y + distance * Math.sin(pitch),
    target.z + distance * Math.cos(yaw) * cp,
  );
}

function easeOutCubic(t: number): number {
  const u = 1 - t;
  return 1 - u * u * u;
}

// ---------- the orbit camera ----------

interface Tween {
  from: number;
  to: number;
  startMs: number;
}

/**
 * Orbits a target at a fixed pitch, snapping yaw in 45° steps with a short eased
 * transition. Two zoom levels, expressed as pixels per world unit so pixel art stays
 * on integer ratios. Reduced-motion users get instant snaps.
 */
export class OrbitCamera {
  readonly camera: OrthographicCamera;
  readonly target = new Vector3(0, 0, 0);
  readonly pitch = MathUtils.degToRad(CAMERA.pitchDeg);

  private yawIndex: number = CAMERA.initialYawIndex;
  private zoomIndex: number = CAMERA.initialZoomIndex;
  private yaw: number = yawIndexToRadians(CAMERA.initialYawIndex);
  private viewHeight: number;
  private aspect = 1;
  /** The low-res frame height in pixels; zoom is pixels per unit of this frame. */
  private frameHeight: number = RENDER.targetHeight;
  private yawTween: Tween | null = null;
  private zoomTween: Tween | null = null;
  readonly reduceMotion: boolean;
  private readonly tmp = new Vector3();

  constructor() {
    this.viewHeight = computeViewHeight(RENDER.targetHeight, this.pixelsPerUnit);
    this.camera = new OrthographicCamera(-1, 1, 1, -1, CAMERA.near, CAMERA.far);
    this.camera.up.set(0, 1, 0);
    this.reduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.applyProjection();
    this.applyPose();
  }

  /** Current (possibly mid-tween) yaw in radians. Sprites use this to face the camera. */
  get currentYaw(): number {
    return this.yaw;
  }

  get currentYawIndex(): number {
    return this.yawIndex;
  }

  get currentZoomIndex(): number {
    return this.zoomIndex;
  }

  private get pixelsPerUnit(): number {
    return CAMERA.pixelsPerUnit[this.zoomIndex] ?? CAMERA.pixelsPerUnit[0];
  }

  setAspect(aspect: number): void {
    this.aspect = aspect;
    this.applyProjection();
  }

  /** The frame changed size: keep pixels-per-unit, so the view shows more or less world. */
  setFrame(width: number, height: number): void {
    this.frameHeight = height;
    this.aspect = width / height;
    if (!this.zoomTween) this.viewHeight = computeViewHeight(height, this.pixelsPerUnit);
    this.applyProjection();
  }

  /** direction: +1 = clockwise (E), -1 = counter-clockwise (Q). */
  rotate(direction: 1 | -1, nowMs: number = performance.now()): void {
    this.yawIndex = wrapYawIndex(this.yawIndex + direction);
    const targetYaw = yawIndexToRadians(this.yawIndex);
    const delta = shortestAngleDelta(this.yaw, targetYaw);
    this.yawTween = { from: this.yaw, to: this.yaw + delta, startMs: nowMs };
    if (this.reduceMotion) this.finishYawTween();
  }

  setZoom(index: number, nowMs: number = performance.now()): void {
    const clamped = MathUtils.clamp(Math.round(index), 0, CAMERA.pixelsPerUnit.length - 1);
    if (clamped === this.zoomIndex) return;
    this.zoomIndex = clamped;
    const to = computeViewHeight(this.frameHeight, this.pixelsPerUnit);
    this.zoomTween = { from: this.viewHeight, to, startMs: nowMs };
    if (this.reduceMotion) this.finishZoomTween();
  }

  zoomIn(nowMs?: number): void {
    this.setZoom(this.zoomIndex + 1, nowMs);
  }

  zoomOut(nowMs?: number): void {
    this.setZoom(this.zoomIndex - 1, nowMs);
  }

  toggleZoom(nowMs?: number): void {
    this.setZoom((this.zoomIndex + 1) % CAMERA.pixelsPerUnit.length, nowMs);
  }

  /** Advance tweens and re-apply the pose (the target may have moved). Call once per frame. */
  update(nowMs: number): void {
    if (this.yawTween) {
      const t = MathUtils.clamp((nowMs - this.yawTween.startMs) / CAMERA.snapMs, 0, 1);
      this.yaw = MathUtils.lerp(this.yawTween.from, this.yawTween.to, easeOutCubic(t));
      if (t >= 1) this.finishYawTween();
    }
    this.applyPose();
    if (this.zoomTween) {
      const t = MathUtils.clamp((nowMs - this.zoomTween.startMs) / CAMERA.snapMs, 0, 1);
      this.viewHeight = MathUtils.lerp(this.zoomTween.from, this.zoomTween.to, easeOutCubic(t));
      if (t >= 1) this.finishZoomTween();
      this.applyProjection();
    }
  }

  private finishYawTween(): void {
    if (!this.yawTween) return;
    // Normalise so the stored yaw never grows unbounded.
    this.yaw = yawIndexToRadians(this.yawIndex);
    this.yawTween = null;
    this.applyPose();
  }

  private finishZoomTween(): void {
    this.viewHeight = computeViewHeight(this.frameHeight, this.pixelsPerUnit);
    this.zoomTween = null;
    this.applyProjection();
  }

  private applyProjection(): void {
    const halfH = this.viewHeight / 2;
    const halfW = halfH * this.aspect;
    this.camera.left = -halfW;
    this.camera.right = halfW;
    this.camera.top = halfH;
    this.camera.bottom = -halfH;
    this.camera.updateProjectionMatrix();
  }

  private shakeAmount = 0;
  private shakeSeed = 0;

  /** A brief shake, in world units, that decays over a few frames. */
  shake(amount: number): void {
    this.shakeAmount = Math.max(this.shakeAmount, amount);
  }

  private applyPose(): void {
    orbitPosition(this.yaw, this.pitch, CAMERA.distance, this.target, this.tmp);
    if (this.shakeAmount > 0.001) {
      this.shakeSeed += 1;
      const s = this.shakeAmount;
      this.tmp.x += Math.sin(this.shakeSeed * 12.9898) * s;
      this.tmp.y += Math.cos(this.shakeSeed * 78.233) * s * 0.6;
      this.shakeAmount *= 0.8;
    } else {
      this.shakeAmount = 0;
    }
    this.camera.position.copy(this.tmp);
    this.camera.lookAt(this.target);
  }
}
