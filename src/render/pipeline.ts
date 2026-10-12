import { WebGLRenderer, type Camera, type Scene } from 'three';
import { RENDER } from '../config/tuning';

export interface TargetSize {
  /** Low-res frame width in pixels. */
  width: number;
  /** Low-res frame height in pixels. */
  height: number;
  /** CSS pixels per low-res pixel (non-integer is allowed). */
  scale: number;
}

/**
 * Pure size math: the frame is `targetHeight` pixels tall and its width follows the
 * viewport aspect ratio. Width never drops below 1.
 */
export function computeTargetSize(
  viewportWidth: number,
  viewportHeight: number,
  targetHeight: number = RENDER.targetHeight,
): TargetSize {
  const safeW = Math.max(1, viewportWidth);
  const safeH = Math.max(1, viewportHeight);
  const height = Math.max(1, Math.round(targetHeight));
  const width = Math.max(1, Math.round(height * (safeW / safeH)));
  return { width, height, scale: safeH / height };
}

/**
 * Low-res render pipeline.
 *
 * The WebGL canvas backing store is sized to the low-res frame; CSS stretches the
 * canvas element to fill the viewport with nearest-neighbor filtering (see style.css).
 * One render pass, no extra textures, which is the cheapest option on phones.
 *
 * If non-integer CSS scaling ever looks uneven, the swap is contained here: render to a
 * WebGLRenderTarget and blit it through a full-screen quad instead.
 */
export class LowResPipeline {
  readonly renderer: WebGLRenderer;
  private size: TargetSize = { width: 1, height: 1, scale: 1 };

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, RENDER.maxPixelRatio));
    this.renderer.setClearColor(0x0d0a1a, 1);
  }

  get currentSize(): TargetSize {
    return this.size;
  }

  /** Call whenever the viewport changes (resize, rotation). Returns the new frame size. */
  resize(viewportWidth: number, viewportHeight: number): TargetSize {
    const next = computeTargetSize(viewportWidth, viewportHeight);
    if (next.width !== this.size.width || next.height !== this.size.height) {
      // updateStyle=false: CSS owns the element size, we only size the backing store.
      this.renderer.setSize(next.width, next.height, false);
    }
    this.size = next;
    return next;
  }

  render(scene: Scene, camera: Camera): void {
    this.renderer.render(scene, camera);
  }

  dispose(): void {
    this.renderer.dispose();
  }
}
