// PERF: the HUD and the stylesheets its panels import stay in the entry's CSS, in their old order,
// now that `Game` and the HUD load as their own chunk (loadBoot below).
import './kids-r10.css';
import './access-r10.css';
import './fun.css';
import './battle.css';
import './battle-r5.css';
import './world-hud.css';
import './move-joy.css';
import './move.css';
import './look.css';
import './world.css';
import './dungeon.css';
import './world-r11d2.css';
import type { Game } from './game';
import type { EduAge } from './config/edu';
import { isAudioUnlocked, resumeAudio, suspendAudio, unlockAudio } from './platform/audio';
import type { EduBand } from './content/types';
import {
  beginVisit,
  clearSlot,
  currentSlot,
  endVisit,
  hasSave,
  profileModes,
  readGraphicsPref,
  restoreFromMirror,
  setSaveSlot,
  slotsFor,
  storylineFinished,
  takeResumeSlot,
  writeSave,
  type SaveSlot,
} from './platform/storage';
import { serialize } from './sim/save';
import { loadStoryScripts } from './sim/story-scenes';
import { storyChunksBeforePlay } from './story-chunks';
import type { Grove3dScene } from './render3d/grove-3d-scene';
import { showTitle } from './ui/title';
/* Lane E r9, R0696 */
import { showKidsPicker, type EduTag } from './ui/kids-launch';
import { readKidsLock } from './platform/kids-lock';
import { showUpdateNotice } from './ui/update-notice';
import { showBootError } from './ui/boot-error';
import { refreshOfflinePacks } from './ui/offline-packs';
import { continueSlot, listenForInstall, offerInstallLater } from './ui/install-hint';
import { mountVisitBanner } from './ui/visit-banner';
import { reloadOnceForUpdate } from './platform/boot-reload';
import { watchForUpdate } from './ui/update-ready';
import {
  hasWebGL2,
  isGraphicsError,
  showCrashCard,
  showErrorNotice,
  showGlFailure,
} from './ui/gl-failure';
import { watchErrors } from './platform/error-watch';
import { mountCameraButtons } from './ui/camera-buttons';
import { FpsCounter } from './ui/fps';
import { LoadingBar } from './ui/loading-bar';
import { nextTip } from './ui/tips';
import { HOLLOW_TEXT } from './config/strings';
import { mountSpriteGallery } from './ui/sprite-gallery';
import { installHiddenGuard } from './platform/dom-guards';
import { readCrossSaves } from './ui/atlas';
import { unequipMissingHats } from './sim/derived-unlocks';

function mustGet<T extends Element>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Missing element: ${selector}`);
  return el;
}

// Anything nothing else caught is logged (within a budget) and gets a passing notice.
installHiddenGuard();
watchErrors(showErrorNotice);
listenForInstall(); // R0463 (TECH-21)

const app = mustGet<HTMLDivElement>('#app');
const canvas = mustGet<HTMLCanvasElement>('#game');
const hudRoot = mustGet<HTMLDivElement>('#hud');

/**
 * PERF: `Game` and the HUD (with the renderers and every panel) are their own chunk, about
 * 450 kB gzip off the first download: the title needs neither. It is fetched while the title is
 * up and awaited in `startGame`, which already waits for the story chunks. A failed fetch is
 * forgotten so "Try again" fetches afresh.
 */
type BootMods = [typeof import('./game'), typeof import('./ui/hud')];
let bootMods: Promise<BootMods> | undefined;
function loadBoot(): Promise<BootMods> {
  return (bootMods ??= Promise.all([import('./game'), import('./ui/hud')]).catch((err) => {
    bootMods = undefined;
    throw err;
  }));
}

// Sound starts muted and unlocks on a tap, click or key, the title screen's included.
// The listeners stay: each gesture resumes a context an interruption suspended (iOS
// counts pointerup and touchend as activations, not pointerdown).
for (const type of ['pointerup', 'touchend', 'click', 'keydown'] as const) {
  window.addEventListener(type, unlockAudio, { passive: true });
}
// A hidden tab is silent; showing it again resumes a context that was unlocked before.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) suspendAudio();
  else if (isAudioUnlocked()) resumeAudio();
});

const params = new URLSearchParams(location.search);
if (import.meta.env.DEV && params.has('audiolab')) {
  // R0507: the sound-effect level table (dev only; its code never ships).
  void import('./dev/audiolab').then((m) => {
    const box = document.createElement('div');
    box.style.cssText =
      'position:fixed;inset:0;overflow:auto;background:#fff;color:#000;z-index:999;padding:16px;font:13px sans-serif';
    document.body.appendChild(box);
    return m.runAudioLab(box);
  });
}
let resumeSlot: ReturnType<typeof takeResumeSlot>;
let kidsLock: number | null;
/** Lane C r11 (R0627): the new Hazel's Grove slot is a Sandbox: a Keeper, no story yet. */
let sandboxStart = false;
// A browser may have cleared localStorage: put back any newer IndexedDB copy before a slot is read.
void restoreFromMirror()
  .then(route)
  .finally(() => requestAnimationFrame(dropSplash));
/**
 * R0492 (TECH-51): index.html's inline splash covers the cold start; it goes on the first
 * frame of whatever the route mounted (the title, or the loading veil), and the title's
 * first paint is marked for the perf budget.
 */
function dropSplash(): void {
  document.getElementById('splash')?.remove();
  if (document.querySelector('.title')) performance.mark?.('title-visible');
}
/** R0669: begin a visit to profile `id` and answer the first slot it has a save in, or null. */
function visitSlotOf(id: string): SaveSlot | null {
  if (!beginVisit(id)) return null;
  for (const mode of profileModes(id))
    for (let index = 1; index <= slotsFor(mode); index++)
      if (hasSave({ mode, index })) return { mode, index };
  endVisit();
  return null;
}

function route(): void {
  // TECH-38: the art-direction sample galleries open in dev builds and under `?debug` only.
  const sampleRoutes = import.meta.env.DEV || params.has('debug');
  if (params.has('sprites')) {
    mountSpriteGallery(app);
  } else if (params.has('style3d') && sampleRoutes) {
    // Art-direction samples for a full-3D Grove (`?style3d=1..5`).
    const i = Math.max(1, Math.min(5, Number(params.get('style3d')) || 1));
    void import('./samples/three-styles').then(
      (m) => m.mountStyleSample(canvas, m.STYLES[i - 1]!),
      showUpdateNotice,
    );
  } else if (params.has('retro3d') && sampleRoutes) {
    // Console-era 3D samples (`?retro3d=1..5`).
    const i = Math.max(1, Math.min(5, Number(params.get('retro3d')) || 1));
    void import('./samples/retro-styles').then(
      (m) => m.mountRetroSample(canvas, m.RETRO_STYLES[i - 1]!),
      showUpdateNotice,
    );
  } else if (params.has('aaa') && sampleRoutes) {
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
  } else if (params.has('visit') && (resumeSlot = visitSlotOf(params.get('visit') ?? ''))) {
    // R0669: `?visit=p2` looks round another Keeper's first Grove, read-only.
    setSaveSlot(resumeSlot);
    startGame(null);
  } else if (params.has('continue') && (resumeSlot = continueSlot())) {
    // R0463 (TECH-21): the home-screen "Continue" shortcut opens the slot played last.
    setSaveSlot(resumeSlot);
    startGame(null);
  } else if (params.has('scenario') && (import.meta.env.DEV || params.has('debug'))) {
    // TECH-46: `?debug&scenario=<name>` opens a dev scenario in Free Grove slot 3 (erased).
    void loadScenario(params.get('scenario') ?? '');
  } else if (params.has('free')) {
    // Straight into the Free Grove (dev and old links). `?slot=2` picks a slot.
    setSaveSlot({ mode: 'free', index: Number(params.get('slot')) || 1 });
    startGame(null);
  } else if ((resumeSlot = takeResumeSlot())) {
    // Graphics changed in Settings: the reload comes straight back to the slot in play.
    setSaveSlot(resumeSlot);
    startGame(null);
  } else if (!params.has('title') && (kidsLock = readKidsLock())) {
    // Lane E r8, R0695: a grown-up locked this device to a Learning Grove; `?title` skips it.
    setSaveSlot({ mode: 'edu', index: kidsLock });
    startGame(null);
  } else if (params.has('kids')) {
    /* Lane E r9, R0696: the "Learning Grove" home-screen shortcut: the children's Groves only. */
    loadStoryScripts().catch(() => undefined);
    loadBoot().catch(() => undefined);
    showKidsPicker(
      hudRoot,
      (slot) => {
        setSaveSlot(slot);
        startGame(null);
      },
      () => location.assign(location.pathname),
    );
  } else {
    // Fetch the campaign and side-story chunks while the title is up.
    // A failure here is retried, and reported, when the game starts.
    loadStoryScripts().catch(() => undefined);
    loadBoot().catch(() => undefined);
    // An old or shared `?edu` link lands on the Learning Grove slots and erases nothing.
    const focus = params.has('edu') ? ('edu' as const) : undefined;
    showTitle(
      hudRoot,
      (choice) => {
        if (choice.fresh) clearSlot(choice.slot);
        sandboxStart = choice.fresh && choice.sandbox === true;
        setSaveSlot(choice.slot);
        startGame(
          (choice.slot.mode === 'campaign' || choice.storyline) && choice.fresh
            ? choice.trainer
            : null,
          choice.slot.mode === 'edu' && choice.fresh && choice.age
            ? {
                age: choice.age,
                band: choice.band ?? 'sprout',
                ...(choice.tag ? { tag: choice.tag } : {}),
              }
            : undefined,
          choice.fresh ? (choice.storyline ?? null) : null,
        );
      },
      focus,
    );
  }
}

/** A fresh Learning Grove: the minigames' age and the story's band. */
interface NewEdu {
  age: EduAge;
  band: EduBand;
  /** Lane E r9, R0696: the name, colour and animal from the title's step. */
  tag?: EduTag;
}

/** TECH-46: build a dev scenario, store it as Free Grove slot 3 and start on it. */
async function loadScenario(name: string): Promise<void> {
  const { buildScenario } = await import('./dev/scenarios');
  const seed = Number(params.get('seed')) || 1;
  const world = buildScenario(name, seed, Date.now());
  if (world) {
    setSaveSlot({ mode: 'free', index: 3 });
    clearSlot({ mode: 'free', index: 3 });
    writeSave(serialize(world, Date.now()));
  } else console.warn(`Unknown scenario "${name}"`);
  startGame(null);
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
  const mode = readGraphicsPref();
  if (!hasWebGL2()) {
    showGlFailure('unsupported', mode);
    return;
  }
  // The veil goes up the moment a slot is picked and stays until the Grove is interactive,
  // so a cold start on a slow phone never sits on a blank screen while chunks download.
  const loading = new LoadingBar(hudRoot);
  loading.step(0.05);
  // A chunk that will not load ends on a card with "Try again" and "Reload", never a blank
  // screen; online, a missing chunk (a deploy replaced the build) reloads once by itself.
  const failed = (err: unknown): void => {
    loading.remove();
    if (isChunkLoadError(err) && reloadOnceForUpdate()) return;
    showBootError(err, () => startGame(newCampaignTrainer, eduAge, storyline));
  };
  // The campaign and side-story scripts are their own chunks; a save with a story in it
  // cannot load until they are registered, or it would drop a queued story scene. A
  // Learning Grove save also needs its own band's educational scenes (CV2) before the
  // first scene plays. A Free Grove with no story boots without them (story-chunks.ts).
  // The loaders forget a failed fetch, so "Try again" fetches afresh.
  const sideStories = storyChunksBeforePlay(currentSlot(), eduAge?.band ?? null, sandboxStart);
  const ready = Promise.all([sideStories, loadBoot()]);
  ready.then(
    () => loading.step(mode === '3d' ? 0.15 : 0.8),
    () => undefined,
  );
  // The 3D scene is a separate chunk, loaded only when the title picked it.
  if (mode === '3d') {
    import('./render3d/grove-3d-scene')
      .then(async (m) => {
        loading.step(0.1);
        // The saved creatures start sculpting in workers while the scene builds.
        m.prewarmCreatures();
        const [, mods] = await ready;
        return [m, mods] as const;
      })
      .then(([m, mods]) => {
        let scene: Grove3dScene;
        try {
          scene = new m.Grove3dScene(canvas);
        } catch (err) {
          loading.remove();
          showGlFailure('failed', '3d', err);
          return;
        }
        bootOrReport(mods, newCampaignTrainer, eduAge, scene, storyline, loading);
      }, failed);
  } else {
    ready.then(
      ([, mods]) => bootOrReport(mods, newCampaignTrainer, eduAge, null, storyline, loading),
      failed,
    );
  }
}

/**
 * Did a lazy chunk fail to download? Chrome, Firefox and Safari word it differently, but
 * each throws a TypeError naming the module fetch.
 */
function isChunkLoadError(err: unknown): boolean {
  const text = err instanceof Error ? err.message : String(err);
  return /dynamically imported module|module script failed|importing a module script|failed to fetch/i.test(
    text,
  );
}

/** Boot, or show a card with a way back if it cannot start (never a blank screen). */
function bootOrReport(
  mods: BootMods,
  newCampaignTrainer: string | null,
  eduAge: NewEdu | undefined,
  scene3d: Grove3dScene | null,
  storyline: string | null,
  loading: LoadingBar,
): void {
  try {
    boot(mods, newCampaignTrainer, eduAge, scene3d, storyline, loading);
  } catch (err) {
    loading.remove();
    // Only a renderer failure gets the graphics card and its "Switch to Pixel"; a bug
    // anywhere else gets the plain reload card (review D, bug 46).
    if (isGraphicsError(err)) showGlFailure('failed', scene3d ? '3d' : 'pixel', err);
    else {
      console.error('Grove: the game could not start.', err);
      showCrashCard();
    }
  }
}

function boot(
  [{ Game }, { mountHud }]: BootMods,
  newCampaignTrainer: string | null,
  eduAge: NewEdu | undefined,
  scene3d: Grove3dScene | null,
  storyline: string | null,
  loading: LoadingBar,
): void {
  const fps = new FpsCounter(hudRoot);
  let game: Game | null = null;
  const hud = mountHud(hudRoot, () => game);
  offerInstallLater(hudRoot); // R0463 (TECH-21)
  mountVisitBanner(hudRoot); // R0669: the way out of a read-only visit
  game = new Game(canvas, hud.hooks, scene3d ? '3d' : 'pixel', scene3d);
  // R0630: a hat a cleared side save used to give comes off (readCrossSaves sets the derived set).
  readCrossSaves();
  unequipMissingHats(game.world);
  // A save that opens underground holds the floor still behind the veil (R0142).
  if (!loading.done) {
    game.send({ kind: 'setLoading', on: true });
    if (game.world.location === 'dungeon') loading.setLabel(HOLLOW_TEXT.loading);
    // R0318: a tip that suits this save.
    loading.showTip(nextTip(game.world));
  }
  if (newCampaignTrainer) {
    game.send({ kind: 'setTrainer', id: newCampaignTrainer });
    if (sandboxStart) {
      // R0627: no campaignStart; Settings → Story starts Hazel's story later.
    } else if (storyline) {
      // Dawn & Dusk: a half started after the other reached an ending sees the whole day.
      const other = storyline === 'dawn' ? 'dusk' : storyline === 'dusk' ? 'dawn' : null;
      const flags = other && storylineFinished('dawndusk', other) ? { 'dd-other-done': true } : {};
      game.send({ kind: 'storylineStart', id: storyline, flags });
    } else {
      // Lane C r8 (R0602): a new Hazel's Grove plays the Open quest flow; older saves keep Guided.
      game.send({ kind: 'campaignStart', flow: 'open' });
    }
  }
  if (eduAge) game.send({ kind: 'eduStart', age: eduAge.age, band: eduAge.band });
  /* Lane E r9, R0696 */
  if (eduAge?.tag) {
    if (eduAge.tag.name) game.send({ kind: 'eduSetName', name: eduAge.tag.name });
    game.send({ kind: 'eduSetTag', icon: eduAge.tag.icon, colour: eduAge.tag.colour });
  }
  // The time away is made up now, in slices the indicator can paint between; story scenes
  // and the away screen wait for it (review C, items 12 and 16).
  void game.catchUpOnLoad();
  hud.bind(game);
  if (import.meta.env.DEV || params.has('e2e')) {
    // Console access during development: `grove.world`, `grove.send({...})`.
    (window as unknown as { grove: Game & { test?: unknown } }).grove = game;
  }
  if (params.has('e2e')) {
    // TECH-11: the browser specs' hooks (`grove.test`), only on a `?e2e` load.
    void import('./dev/e2e-api').then((m) => {
      (window as unknown as { grove: { test?: unknown } }).grove.test = m.installE2eApi(game);
    });
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

  // The 3D Grove stays behind the veil until its creatures are sculpted (the safety window
  // counts from here, not from the downloads); the Pixel Grove lifts it on its first frame.
  if (scene3d) loading.restartClock();
  let veilLifted = false;

  function fpsLoop(now: number): void {
    if (!document.hidden) fps.tick(now);
    if (scene3d && !loading.done) {
      const s = scene3d.loadState();
      loading.update(0.2 + 0.8 * s.progress, s.done);
    }
    if (loading.done && !veilLifted) {
      veilLifted = true;
      performance.mark?.('grove-playable'); // R0492 (TECH-51)
      game?.send({ kind: 'setLoading', on: false });
    }
    requestAnimationFrame(fpsLoop);
  }
  requestAnimationFrame(fpsLoop);

  document.addEventListener('visibilitychange', () => {
    if (!game) return;
    if (document.hidden) {
      game.save();
      game.stop();
      game.view.regions.trim(); // R11 lane D (WORLD-15): a hidden phone tab keeps little
    } else {
      fps.reset();
      void game.resume();
    }
  });
  window.addEventListener('pagehide', () => game?.save());

  // Install-to-home-screen: the service worker only runs on the built site. boot() runs
  // after a slot is picked, long after `load` has fired, so register straight away.
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then(applyWaitingWorker, () => undefined);
    // R0496 (TECH-55): offer a waiting update in a long-lived session, saving first.
    void navigator.serviceWorker.ready.then((reg) => {
      const hud = document.getElementById('hud');
      if (hud) watchForUpdate(reg, hud, () => game);
    });
    // The chunks this visit already loaded came before the worker existed, so it never saw
    // them; hand it the list, so a first visit is enough to play offline next time.
    void navigator.serviceWorker.ready.then((reg) => {
      const urls = performance
        .getEntriesByType('resource')
        .map((e) => e.name)
        .filter((u) => u.startsWith(location.origin) && u.includes('/assets/'));
      reg.active?.postMessage({ type: 'cache-urls', urls });
    });
    // R0461 (TECH-20): keep the ticked offline packs, and the one this slot needs.
    void navigator.serviceWorker.ready.then((reg) => {
      const m = currentSlot().mode;
      refreshOfflinePacks(reg.active, m === 'edu' ? 'edu' : m === 'free' ? null : 'story');
    });
  }

  game.start();
  if (!scene3d) requestAnimationFrame(() => requestAnimationFrame(() => loading.update(1, true)));
}

/**
 * Updates apply on the next load, never mid-play. A deploy installs a new worker, which
 * waits while open pages run on the old one and its cache. The next load fetches the page
 * and its chunks network-first, so it already runs the new build; only then is the waiting
 * worker told to take over (it carries the hashed chunks over and drops the old cache).
 * Offline, the page may be the cached old shell, so the old worker and cache are kept.
 */
function applyWaitingWorker(reg: ServiceWorkerRegistration | undefined): void {
  // Some hosts and test drivers answer the registration with nothing at all.
  if (!reg) return;
  const bootedAt = performance.now();
  const take = (w: ServiceWorker | null): void => {
    if (w && navigator.serviceWorker.controller && navigator.onLine !== false) {
      w.postMessage({ type: 'skip-waiting' });
    }
  };
  take(reg.waiting);
  // The browser checks for a new worker on this very load, so one may still be installing.
  // It belongs to the build this page fetched only if it lands soon after boot; one found
  // later (a deploy during a long session) waits for the next load.
  reg.addEventListener('updatefound', () => {
    const w = reg.installing;
    w?.addEventListener('statechange', () => {
      if (w.state === 'installed' && performance.now() - bootedAt < 60_000) take(w);
    });
  });
}
