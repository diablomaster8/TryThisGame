import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INPUT } from '../../src/config/tuning';
import { SHAKE_GESTURE } from '../../src/config/tuning-tech';
import { CameraControls } from '../../src/input/camera-controls';
import { ShakeDetector } from '../../src/input/shake';
import type { OrbitCamera } from '../../src/render/camera';

/**
 * TECH-43: the pinch, the two-finger turn and the wheel (CameraControls) and the shake
 * gesture (ShakeDetector), driven by fake pointers on a fake surface. No DOM in Node.
 */

class FakeSurface extends EventTarget {
  setPointerCapture(): void {}
}

function pointer(type: string, id: number, x: number, y: number): Event {
  const e = new Event(type);
  Object.assign(e, { pointerId: id, clientX: x, clientY: y });
  return e;
}

interface CameraCalls {
  rotate: number[];
  zoomIn: number;
  zoomOut: number;
}

let surface: FakeSurface;
let calls: CameraCalls;
let controls: CameraControls;

beforeEach(() => {
  vi.stubGlobal('window', new EventTarget());
  // keys.ts asks `instanceof` of the DOM element classes; none of these events has a target.
  for (const name of [
    'HTMLElement',
    'HTMLInputElement',
    'HTMLTextAreaElement',
    'HTMLSelectElement',
    'HTMLButtonElement',
    'HTMLAnchorElement',
  ])
    vi.stubGlobal(name, class {});
  surface = new FakeSurface();
  calls = { rotate: [], zoomIn: 0, zoomOut: 0 };
  const camera = {
    rotate: (d: number) => calls.rotate.push(d),
    zoomIn: () => (calls.zoomIn += 1),
    zoomOut: () => (calls.zoomOut += 1),
  } as unknown as OrbitCamera;
  controls = new CameraControls(camera, surface as unknown as HTMLElement);
});

afterEach(() => {
  controls.dispose();
  vi.unstubAllGlobals();
});

/** Two fingers down 100 px apart, centred on x = 200. */
function twoFingers(): void {
  surface.dispatchEvent(pointer('pointerdown', 1, 150, 100));
  surface.dispatchEvent(pointer('pointerdown', 2, 250, 100));
}

describe('camera controls: touch (TECH-43)', () => {
  it('zooms out when two fingers pinch together, once per gesture', () => {
    twoFingers();
    surface.dispatchEvent(pointer('pointermove', 1, 150 + 25, 100));
    surface.dispatchEvent(pointer('pointermove', 2, 250 - 25, 100));
    expect(calls.zoomOut).toBe(1);
    // Further movement in the same gesture does nothing.
    surface.dispatchEvent(pointer('pointermove', 1, 190, 100));
    surface.dispatchEvent(pointer('pointermove', 2, 210, 100));
    expect(calls).toEqual({ rotate: [], zoomIn: 0, zoomOut: 1 });
  });

  it('zooms in when two fingers spread apart', () => {
    twoFingers();
    surface.dispatchEvent(pointer('pointermove', 1, 150 - 30, 100));
    surface.dispatchEvent(pointer('pointermove', 2, 250 + 30, 100));
    expect(calls.zoomIn).toBe(1);
    expect(calls.zoomOut).toBe(0);
  });

  it('turns the camera on a two-finger swipe, and a pinch never also turns it', () => {
    twoFingers();
    const swipe = INPUT.swipeThresholdPx + 10;
    // Both fingers travel together in small steps, so the gap between them never changes.
    for (let s = 5; s <= swipe; s += 5) {
      surface.dispatchEvent(pointer('pointermove', 1, 150 + s, 100));
      surface.dispatchEvent(pointer('pointermove', 2, 250 + s, 100));
    }
    // Dragging the scene to the right turns the camera to the left.
    expect(calls.rotate).toEqual([-1]);
    expect(calls.zoomIn + calls.zoomOut).toBe(0);
  });

  it('starts a fresh gesture once a finger lifts and lands again', () => {
    twoFingers();
    surface.dispatchEvent(pointer('pointermove', 1, 175, 100));
    surface.dispatchEvent(pointer('pointermove', 2, 225, 100));
    expect(calls.zoomOut).toBe(1);
    surface.dispatchEvent(pointer('pointerup', 2, 225, 100));
    surface.dispatchEvent(pointer('pointerdown', 2, 275, 100));
    surface.dispatchEvent(pointer('pointermove', 2, 400, 100));
    expect(calls.zoomIn).toBe(1);
  });

  it('ignores a single finger', () => {
    surface.dispatchEvent(pointer('pointerdown', 1, 100, 100));
    surface.dispatchEvent(pointer('pointermove', 1, 300, 100));
    expect(calls).toEqual({ rotate: [], zoomIn: 0, zoomOut: 0 });
  });

  it('stops listening once disposed', () => {
    controls.dispose();
    twoFingers();
    surface.dispatchEvent(pointer('pointermove', 1, 175, 100));
    surface.dispatchEvent(pointer('pointermove', 2, 225, 100));
    expect(calls.zoomOut).toBe(0);
  });
});

describe('camera controls: wheel (TECH-43)', () => {
  const wheel = (deltaY: number): void => {
    const e = new Event('wheel');
    Object.assign(e, { deltaY });
    surface.dispatchEvent(e);
  };

  it('zooms only after the wheel has travelled past the threshold', () => {
    wheel(INPUT.wheelThreshold - 1);
    expect(calls.zoomOut).toBe(0);
    wheel(2);
    expect(calls.zoomOut).toBe(1);
    wheel(-INPUT.wheelThreshold);
    expect(calls.zoomIn).toBe(1);
  });
});

describe('shake gesture (TECH-43)', () => {
  const swing = INPUT.shakeReversalsPerSecond;
  const min = SHAKE_GESTURE.minSwingPx;

  /** Sweep right then left by `2 * min` px every `stepMs`, `swings` times; true if one fired. */
  function sweep(d: ShakeDetector, swings: number, stepMs: number): boolean {
    let now = 0;
    let x = 100;
    d.reset(x);
    let fired = false;
    for (let i = 0; i < swings; i++) {
      for (const dir of [1, -1]) {
        for (let k = 0; k < 3; k++) {
          x += dir * min;
          now += stepMs;
          if (d.feed(x, now)) fired = true;
        }
      }
    }
    return fired;
  }

  it('fires after enough quick reversals inside the window', () => {
    const d = new ShakeDetector();
    expect(sweep(d, swing + 2, 20)).toBe(true);
  });

  it('does not fire for a slow drag whose reversals fall outside the window', () => {
    const d = new ShakeDetector();
    expect(sweep(d, swing + 2, SHAKE_GESTURE.windowMs)).toBe(false);
  });

  it('does not count a wobble smaller than the minimum swing', () => {
    const d = new ShakeDetector();
    d.reset(100);
    let fired = false;
    for (let i = 0; i < 40; i++) fired ||= d.feed(100 + (i % 2 === 0 ? 3 : -3), i * 10);
    expect(fired).toBe(false);
    expect(d.progress(400)).toBe(0);
  });

  it('starts counting again after a shake', () => {
    const d = new ShakeDetector();
    expect(sweep(d, swing + 2, 20)).toBe(true);
    expect(d.progress(10_000)).toBe(0);
  });
});
