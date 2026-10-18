import { INPUT } from '../config/tuning';
import type { OrbitCamera } from '../render/camera';
import { isGameKey } from './keys';

interface PointerPoint {
  x: number;
  y: number;
}

/**
 * Desktop: Q/E (or [ ]) rotate, mouse wheel zooms.
 * Touch: two-finger horizontal swipe rotates, pinch zooms. One gesture per touch
 * session, latched until a finger lifts, so a pinch never also rotates.
 */
export class CameraControls {
  private readonly pointers = new Map<number, PointerPoint>();
  private gestureStart: { dx: number; dist: number } | null = null;
  private gestureUsed = false;
  private wheelAccum = 0;
  private readonly abort = new AbortController();

  constructor(
    private readonly camera: OrbitCamera,
    private readonly surface: HTMLElement,
  ) {
    const { signal } = this.abort;
    window.addEventListener('keydown', this.onKeyDown, { signal });
    surface.addEventListener('wheel', this.onWheel, { passive: false, signal });
    surface.addEventListener('pointerdown', this.onPointerDown, { signal });
    surface.addEventListener('pointermove', this.onPointerMove, { signal });
    surface.addEventListener('pointerup', this.onPointerUp, { signal });
    surface.addEventListener('pointercancel', this.onPointerUp, { signal });
    surface.addEventListener('pointerleave', this.onPointerUp, { signal });
    // iOS Safari still fires its own pinch-zoom gesture events; swallow them.
    surface.addEventListener('gesturestart', (e) => e.preventDefault(), { signal });
    surface.addEventListener('contextmenu', (e) => e.preventDefault(), { signal });
  }

  dispose(): void {
    this.abort.abort();
  }

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    // Typing in a field ("Steve" has an e) or a browser shortcut never turns the camera.
    if (e.repeat || !isGameKey(e)) return;
    switch (e.key) {
      case 'q':
      case 'Q':
      case '[':
        this.camera.rotate(-1);
        break;
      case 'e':
      case 'E':
      case ']':
        this.camera.rotate(1);
        break;
      case '+':
      case '=':
        this.camera.zoomIn();
        break;
      case '-':
      case '_':
        this.camera.zoomOut();
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  private readonly onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    this.wheelAccum += e.deltaY;
    if (this.wheelAccum <= -INPUT.wheelThreshold) {
      this.camera.zoomIn();
      this.wheelAccum = 0;
    } else if (this.wheelAccum >= INPUT.wheelThreshold) {
      this.camera.zoomOut();
      this.wheelAccum = 0;
    }
  };

  private readonly onPointerDown = (e: PointerEvent): void => {
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    this.surface.setPointerCapture?.(e.pointerId);
    if (this.pointers.size === 2) {
      this.gestureStart = this.measure();
      this.gestureUsed = false;
    }
  };

  private readonly onPointerMove = (e: PointerEvent): void => {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    p.x = e.clientX;
    p.y = e.clientY;
    if (this.pointers.size !== 2 || !this.gestureStart || this.gestureUsed) return;

    const now = this.measure();
    const travel = now.dx - this.gestureStart.dx;
    const ratio = now.dist / Math.max(1, this.gestureStart.dist);

    if (ratio <= INPUT.pinchOutRatio) {
      this.camera.zoomOut();
      this.gestureUsed = true;
    } else if (ratio >= INPUT.pinchInRatio) {
      this.camera.zoomIn();
      this.gestureUsed = true;
    } else if (Math.abs(travel) >= INPUT.swipeThresholdPx) {
      // Dragging the scene to the right turns the camera to the left.
      this.camera.rotate(travel > 0 ? -1 : 1);
      this.gestureUsed = true;
    }
  };

  private readonly onPointerUp = (e: PointerEvent): void => {
    this.pointers.delete(e.pointerId);
    if (this.pointers.size < 2) {
      this.gestureStart = null;
      this.gestureUsed = false;
    }
  };

  /** Centroid x and finger distance of the current two pointers. */
  private measure(): { dx: number; dist: number } {
    const [a, b] = [...this.pointers.values()];
    if (!a || !b) return { dx: 0, dist: 0 };
    return {
      dx: (a.x + b.x) / 2,
      dist: Math.hypot(a.x - b.x, a.y - b.y),
    };
  }
}
