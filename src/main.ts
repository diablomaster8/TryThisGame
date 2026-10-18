import { Game } from './game';
import type { EduAge } from './config/edu';
import { resumeAudio, unlockAudio } from './platform/audio';
import type { EduBand } from './content/types';
import {
  clearSlot,
  currentSlot,
  readGraphicsPref,
  setSaveSlot,
  storylineFinished,
  takeResumeSlot,
} from './platform/storage';
import { loadEduScripts, loadStoryScripts } from './sim/story-scenes';
import type { Grove3dScene } from './render3d/grove-3d-scene';
import { showTitle } from './ui/title';
import { showUpdateNotice } from './ui/update-notice';
import { hasWebGL2, showGlFailure } from './ui/gl-failure';
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

// Sound starts muted and unlocks on a tap, click or key, the title screen's included.
// The listeners stay: each gesture resumes a context an interruption suspended (iOS
// counts pointerup and touchend as activations, not pointerdown).
for (const type of ['pointerup', 'touchend', 'click', 'keydown'] as const) {
  window.addEventListener(type, unlockAudio, { passive: true });
}
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) resumeAudio();
});

const params = new URLSearchParams(location.search);
let resumeSlot: ReturnType<typeof takeResumeSlot>;
if (params.has('sprites')) {
  mountSpriteGallery(app);
} else if (params.has('style3d')) {
  // Art-direction samples for a full-3D Grove (`?style3d=1..5`).
  const i = Math.max(1, Math.min(5, Number(params.get('style3d')) || 1));
  void import('./samples/three-styles').then(
    (m) => m.mountStyleSample(canvas, m.STYLES[i - 1]!),
    showUpdateNotice,
  );
} else if (params.has('retro3d')) {
  // Console-era 3D samples (`?retro3d=1..5`).
  const i = Math.max(1, Math.min(5, Number(params.get('retro3d')) || 1));
  void import('./samples/retro-styles').then(
    (m) => m.mountRetroSample(canvas, m.RETRO_STYLES[i - 1]!),
    showUpdateNotice,
  );
} else if (params.has('aaa')) {
  // The HD-port direction at a AAA finish (`?aaa=1..3`: noon, golden hour, after rain).
  const i = Math.max(1, Math.min(3, Number(params.get('aaa')) || 1));
  void import('./samples/aaa-styles').then(
    (m) => m.mountAaaSample(canvas, m.MOODS[i - 1]!),
    showUpdateNotice,
  );
} else if (params.has('edu') && import.meta.env.DEV) {
  // Straight into a fresh Learning Grove at the given age, erasing the slot: dev builds only.
  // `?slot=2` picks a slot. On the built site an `?edu` link opens the title (below).
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
} else if ((resumeSlot = takeResumeSlot())) {
  // Graphics changed in Settings: the reload comes straight back to the slot in play.
  setSaveSlot(resumeSlot);
  startGame(null);
} else {
  // Fetch the campaign and side-story chunks while the title is up.
  // A failure here is retried, and reported, when the game starts.
  loadStoryScripts().catch(() => undefined);
  // An old or shared `?edu` link lands on the Learning Grove slots and erases nothing.
  const focus = params.has('edu') ? ('edu' as const) : undefined;
  showTitle(
    hudRoot,
    (choice) => {
      if (choice.fresh) clearSlot(choice.slot);
      setSaveSlot(choice.slot);
      startGame(
        (choice.slot.mode === 'campaign' || choice.storyline) && choice.fresh
          ? choice.trainer
          : null,
        choice.slot.mode === 'edu' && choice.fresh && choice.age
          ? { age: choice.age, band: choice.band ?? 'sprout' }
          : undefined,
        choice.fresh ? (choice.storyline ?? null) : null,
      );
    },
    focus,
  );
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
  // The 3D scene is a separate chunk, loaded only when the title picked it. A chunk that
  // fails to load (usually a deploy replaced it) shows the reload notice, not a blank screen.
  const mode = readGraphicsPref();
  if (!hasWebGL2()) {
    showGlFailure('unsupported', mode);
    return;
  }
  if (mode === '3d') {
    void import('./render3d/grove-3d-scene')
      .then(async (m) => {
        // The saved creatures start sculpting in workers while the scene builds.
        m.prewarmCreatures();
        await sideStories;
        return m;
      })
      .then((m) => {
        let scene: Grove3dScene;
        try {
          scene = new m.Grove3dScene(canvas);
        } catch (err) {
          showGlFailure('failed', '3d', err);
          return;
        }
        bootOrReport(newCampaignTrainer, eduAge, scene, storyline);
      }, showUpdateNotice);
  } else {
    void sideStories.then(
      () => bootOrReport(newCampaignTrainer, eduAge, null, storyline),
      showUpdateNotice,
    );
  }
}

/** Boot, or show the graphics card if the renderer cannot start (no blank screen). */
function bootOrReport(
  newCampaignTrainer: string | null,
  eduAge: NewEdu | undefined,
  scene3d: Grove3dScene | null,
  storyline: string | null,
): void {
  try {
    boot(newCampaignTrainer, eduAge, scene3d, storyline);
  } catch (err) {
    showGlFailure('failed', scene3d ? '3d' : 'pixel', err);
  }
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

  // A context the browser takes away (GPU reset, memory pressure) leaves a frozen canvas:
  // save, and say so with a way back, rather than keep drawing nothing.
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    game?.save();
    showGlFailure('lost', scene3d ? '3d' : 'pixel');
  });

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

  // Install-to-home-screen: the service worker only runs on the built site. boot() runs
  // after a slot is picked, long after `load` has fired, so register straight away.
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => undefined);
  }

  game.start();
}
