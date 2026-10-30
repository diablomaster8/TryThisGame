import { OrthographicCamera, WebGLRenderer, type Camera, type Scene } from 'three';
import { RENDER } from '../config/tuning';
import { PostPass } from './post';

export interface TargetSize {
  /** Low-res frame width in pixels. */
  width: number;
  /** Low-res frame height in pixels. */
  height: number;
  /** CSS pixels per low-res pixel; always a whole number. */
  scale: number;
}

/**
 * Pure size math. The frame is about `targetHeight` pixels tall, but its exact size is
 * chosen so that the CSS upscale is a whole number: every low-res pixel becomes a k×k
 * block, so columns stay even on PC monitors and phones alike. Width follows the
 * viewport. Neither dimension drops below 1.
 */
export function computeTargetSize(
  viewportWidth: number,
  viewportHeight: number,
  targetHeight: number = RENDER.targetHeight,
): TargetSize {
  const safeW = Math.max(1, viewportWidth);
  const safeH = Math.max(1, viewportHeight);
  const scale = Math.max(1, Math.round(safeH / targetHeight));
  const height = Math.max(1, Math.ceil(safeH / scale));
  const width = Math.max(1, Math.ceil(safeW / scale));
  return { width, height, scale };
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
/** What the debug panel reads from either renderer: draw-call info and the frame size. */
export interface FrameStats {
  readonly renderer: WebGLRenderer;
  readonly currentSize: TargetSize;
}

export class LowResPipeline implements FrameStats {
  readonly renderer: WebGLRenderer;
  private size: TargetSize = { width: 1, height: 1, scale: 1 };
  /** TECH-53: the frame height the Pixel governor asks for, and the last viewport. */
  private targetHeight: number = RENDER.targetHeight;
  private viewport = { width: 1, height: 1 };

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
    // Count every pass of a frame (scene, bloom, post), not only the last one: the counters
    // are reset once per frame in `render` (review C, item 19).
    this.renderer.info.autoReset = false;
    // The clear color comes from scene.background (set by the scene from the palette).
  }

  get currentSize(): TargetSize {
    return this.size;
  }

  /** Call whenever the viewport changes (resize, rotation). Returns the new frame size. */
  resize(viewportWidth: number, viewportHeight: number): TargetSize {
    this.viewport = { width: viewportWidth, height: viewportHeight };
    const next = computeTargetSize(viewportWidth, viewportHeight, this.targetHeight);
    if (next.width !== this.size.width || next.height !== this.size.height) {
      // updateStyle=false: CSS owns the element size, we only size the backing store.
      this.renderer.setSize(next.width, next.height, false);
      this.post?.resize(next.width, next.height);
    }
    this.size = next;
    return next;
  }

  /** TECH-53: draw at another frame height; returns the new size, re-fitted to the viewport. */
  setTargetHeight(height: number): TargetSize {
    this.targetHeight = height;
    return this.resize(this.viewport.width, this.viewport.height);
  }

  render(scene: Scene, camera: Camera): void {
    this.renderer.info.reset();
    if (this.post && camera instanceof OrthographicCamera) {
      this.post.render(this.renderer, scene, camera);
      return;
    }
    this.renderer.render(scene, camera);
  }

  /** Attach the HD-2D pass; it follows the frame size. */
  private post: PostPass | null = null;

  enablePost(): PostPass {
    this.post ??= new PostPass(this.size.width, this.size.height);
    return this.post;
  }

  get postPass(): PostPass | null {
    return this.post;
  }

  dispose(): void {
    this.renderer.dispose();
  }
}
