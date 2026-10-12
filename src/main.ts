import { CameraControls } from './input/camera-controls';
import { OrbitCamera } from './render/camera';
import { LowResPipeline } from './render/pipeline';
import { TestScene } from './render/test-scene';
import { mountCameraButtons } from './ui/camera-buttons';
import { FpsCounter } from './ui/fps';
import { mountSpriteGallery } from './ui/sprite-gallery';

function mustGet<T extends Element>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Missing element: ${selector}`);
  return el;
}

const app = mustGet<HTMLDivElement>('#app');
const canvas = mustGet<HTMLCanvasElement>('#game');
const hud = mustGet<HTMLDivElement>('#hud');

if (new URLSearchParams(location.search).has('sprites')) {
  mountSpriteGallery(app);
} else {
  startGame();
}

function startGame(): void {
  const pipeline = new LowResPipeline(canvas);
  const camera = new OrbitCamera();
  const scene = new TestScene();
  const fps = new FpsCounter(hud);
  new CameraControls(camera, canvas);
  mountCameraButtons(hud, camera);

  // ---------- resize / rotation ----------

  function applySize(): void {
    const rect = app.getBoundingClientRect();
    const size = pipeline.resize(rect.width, rect.height);
    camera.setAspect(size.width / size.height);
  }

  const resizeObserver = new ResizeObserver(() => applySize());
  resizeObserver.observe(app);
  window.addEventListener('orientationchange', () => {
    // Some browsers report stale sizes immediately after rotation.
    setTimeout(applySize, 50);
  });
  window.visualViewport?.addEventListener('resize', applySize);
  applySize();

  // ---------- frame loop ----------

  let rafId = 0;
  let running = false;

  function frame(nowMs: number): void {
    if (!running) return;
    camera.update(nowMs);
    scene.update(camera);
    pipeline.render(scene.scene, camera.camera);
    fps.tick(nowMs);
    rafId = requestAnimationFrame(frame);
  }

  function start(): void {
    if (running) return;
    running = true;
    fps.reset();
    rafId = requestAnimationFrame(frame);
  }

  function stop(): void {
    running = false;
    cancelAnimationFrame(rafId);
  }

  // Pause rendering when the tab is hidden.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  start();
}
