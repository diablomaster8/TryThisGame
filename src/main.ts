import { Game } from './game';
import type { EduAge } from './config/edu';
import { unlockAudio } from './platform/audio';
import type { EduBand } from './content/types';
import {
  clearSlot,
  currentSlot,
  readGraphicsPref,
  setSaveSlot,
  storylineFinished,
} from './platform/storage';
import { loadEduScripts, loadStoryScripts } from './sim/story-scenes';
import type { Grove3dScene } from './render3d/grove-3d-scene';
import { showTitle } from './ui/title';
import { mountCameraButtons } from './ui/camera-buttons';
import { FpsCounter } from './ui/fps';
import { LoadingBar } from './ui/loading-bar';
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

const params = new URLSearchParams(location.search);
if (params.has('sprites')) {
  mountSpriteGallery(app);
} else if (params.has('style3d')) {
  // Art-direction samples for a full-3D Grove (`?style3d=1..5`).
  const i = Math.max(1, Math.min(5, Number(params.get('style3d')) || 1));
  void import('./samples/three-styles').then((m) => m.mountStyleSample(canvas, m.STYLES[i - 1]!));
} else if (params.has('retro3d')) {
  // Console-era 3D samples (`?retro3d=1..5`).
  const i = Math.max(1, Math.min(5, Number(params.get('retro3d')) || 1));
  void import('./samples/retro-styles').then((m) =>
    m.mountRetroSample(canvas, m.RETRO_STYLES[i - 1]!),
  );
} else if (params.has('aaa')) {
  // The HD-port direction at a AAA finish (`?aaa=1..3`: noon, golden hour, after rain).
  const i = Math.max(1, Math.min(3, Number(params.get('aaa')) || 1));
  void import('./samples/aaa-styles').then((m) => m.mountAaaSample(canvas, m.MOODS[i - 1]!));
} else if (params.has('edu')) {
  // Straight into a fresh Learning Grove at the given age (dev). `?slot=2` picks a slot.
  const slot = { mode: 'edu' as const, index: Number(params.get('slot')) || 1 };
  clearSlot(slot);
  setSaveSlot(slot);
  // `?edu=7` and up is a Grove Readers save (the minigames stay at age 6).
  const age = Number(params.get('edu')) || 4;
  startGame(null, {
    age: Math.max(3, Math.min(6, age)) as EduAge,
    band: age >= 7 ? 'reader' : 'sprout',
  });
} else if (params.has('free')) {
  // Straight into the Free Grove (dev and old links). `?slot=2` picks a slot.
  setSaveSlot({ mode: 'free', index: Number(params.get('slot')) || 1 });
  startGame(null);
} else {
  // Fetch the campaign and side-story chunks while the title is up.
  void loadStoryScripts();
  showTitle(hudRoot, (choice) => {
    if (choice.fresh) clearSlot(choice.slot);
    setSaveSlot(choice.slot);
    startGame(
      (choice.slot.mode === 'campaign' || choice.storyline) && choice.fresh ? choice.trainer : null,
      choice.slot.mode === 'edu' && choice.fresh && choice.age
        ? { age: choice.age, band: choice.band ?? 'sprout' }
        : undefined,
      choice.fresh ? (choice.storyline ?? null) : null,
    );
  });
}

/** A fresh Learning Grove: the minigames' age and the story's band. */
interface NewEdu {
  age: EduAge;
  band: EduBand;
}

/**
 * `newCampaignTrainer` starts the story in a fresh world as that Keeper; with `storyline`
 * it is one of the separate campaigns instead of Hazel's Grove.
 */
function startGame(
  newCampaignTrainer: string | null,
  eduAge?: NewEdu,
  storyline: string | null = null,
): void {
  // The campaign and side-story scripts are their own chunks; the save cannot load until
  // they are registered, or it would drop a queued story scene. A Learning Grove save
  // also needs its educational scenes (CV2) before the first scene plays.
  const sideStories =
    currentSlot().mode === 'edu'
      ? Promise.all([loadStoryScripts(), loadEduScripts()]).then(() => undefined)
      : loadStoryScripts();
  // The 3D scene is a separate chunk, loaded only when the title picked it.
  if (readGraphicsPref() === '3d') {
    void import('./render3d/grove-3d-scene').then(async (m) => {
      // The saved creatures start sculpting in workers while the scene builds.
      m.prewarmCreatures();
      await sideStories;
      boot(newCampaignTrainer, eduAge, new m.Grove3dScene(canvas), storyline);
    });
  } else void sideStories.then(() => boot(newCampaignTrainer, eduAge, null, storyline));
}

function boot(
  newCampaignTrainer: string | null,
  eduAge: NewEdu | undefined,
  scene3d: Grove3dScene | null,
  storyline: string | null,
): void {
  const fps = new FpsCounter(hudRoot);
  let game: Game | null = null;
  const hud = mountHud(hudRoot, () => game);
  game = new Game(canvas, hud.hooks, scene3d ? '3d' : 'pixel', scene3d);
  if (newCampaignTrainer) {
    game.send({ kind: 'setTrainer', id: newCampaignTrainer });
    if (storyline) {
      // Dawn & Dusk: a half started after the other reached an ending sees the whole day.
      const other = storyline === 'dawn' ? 'dusk' : storyline === 'dusk' ? 'dawn' : null;
      const flags = other && storylineFinished('dawndusk', other) ? { 'dd-other-done': true } : {};
      game.send({ kind: 'storylineStart', id: storyline, flags });
    } else game.send({ kind: 'campaignStart' });
  }
  if (eduAge) game.send({ kind: 'eduStart', age: eduAge.age, band: eduAge.band });
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

  // The 3D Grove opens behind a loading bar until its creatures are sculpted.
  const loading = scene3d ? new LoadingBar(hudRoot) : null;

  function fpsLoop(now: number): void {
    if (!document.hidden) fps.tick(now);
    if (loading && scene3d && !loading.done) {
      const s = scene3d.loadState();
      loading.update(s.progress, s.done);
    }
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
