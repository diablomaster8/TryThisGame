import { Game } from './game';
import { unlockAudio } from './platform/audio';
import { mountCameraButtons } from './ui/camera-buttons';
import { FpsCounter } from './ui/fps';
import { mountHud } from './ui/hud';
import { mountSpriteGallery } from './ui/sprite-gallery';

function mustGet<T extends Element>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Missing element: ${selector}`);
  return el;
}

const app = mustGet<HTMLDivElement>('#app');
const canvas = mustGet<HTMLCanvasElement>('#game');
const hudRoot = mustGet<HTMLDivElement>('#hud');

if (new URLSearchParams(location.search).has('sprites')) {
  mountSpriteGallery(app);
} else {
  startGame();
}

function startGame(): void {
  const fps = new FpsCounter(hudRoot);
  let game: Game | null = null;
  const hud = mountHud(hudRoot, () => game);
  game = new Game(canvas, hud.hooks);
  hud.bind(game);
  if (import.meta.env.DEV) {
    // Console access during development: `grove.world`, `grove.send({...})`.
    (window as unknown as { grove: Game }).grove = game;
  }
  mountCameraButtons(hudRoot, game.camera);

  // ---------- resize / rotation ----------

  function applySize(): void {
    const rect = app.getBoundingClientRect();
    game?.resize(rect.width, rect.height);
  }
  new ResizeObserver(() => applySize()).observe(app);
  window.addEventListener('orientationchange', () => setTimeout(applySize, 50));
  window.visualViewport?.addEventListener('resize', applySize);
  applySize();

  // ---------- fps + lifecycle ----------

  function fpsLoop(now: number): void {
    if (!document.hidden) fps.tick(now);
    requestAnimationFrame(fpsLoop);
  }
  requestAnimationFrame(fpsLoop);

  document.addEventListener('visibilitychange', () => {
    if (!game) return;
    if (document.hidden) {
      game.save();
      game.stop();
    } else {
      fps.reset();
      game.resume();
    }
  });
  window.addEventListener('pagehide', () => game?.save());

  // Sound starts muted and unlocks on the first tap or click.
  const unlock = () => {
    unlockAudio();
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);

  // Install-to-home-screen: the service worker only runs on the built site.
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => undefined);
    });
  }

  game.start();
}
