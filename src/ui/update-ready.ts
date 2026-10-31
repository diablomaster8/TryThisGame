import { UPDATE_NOTICE_TEXT } from '../config/strings-r8d-plat';
import { UPDATE_NOTICE } from '../config/tuning-r8d-plat';
import type { Game } from '../game';

/**
 * R0496 (TECH-55): an installed Grove that is never fully closed (common on iOS) would run
 * an old build for weeks, because a new service worker only takes over on a fresh load
 * (main.ts `applyWaitingWorker`). When a worker has waited `UPDATE_NOTICE.waitMs` in this
 * session, or the app comes back from hidden with one waiting, a small chip offers the
 * refresh. A tap saves first, tells the worker to take over, then reloads. The chip never
 * shows over a dialogue scene, a minigame or the Hollow, and never offline (the new build's
 * chunks may not be on the device yet).
 */
export interface UpdateState {
  /** When this session first saw a waiting worker; null if none. */
  waitingSince: number | null;
  /** The app came back from hidden while a worker was waiting. */
  resumed: boolean;
  busy: boolean;
  online: boolean;
}

/** Whether the chip should be on screen now. */
export function updateChipDue(s: UpdateState, now: number): boolean {
  if (s.waitingSince === null || s.busy || !s.online) return false;
  return s.resumed || now - s.waitingSince >= UPDATE_NOTICE.waitMs;
}

/** A scene, a minigame (they pause the Grove's drawing) or a Hollow run is on screen. */
function busyNow(g: Game | null): boolean {
  if (!g) return true;
  return (
    g.renderPaused ||
    g.world.dungeon !== null ||
    document.documentElement.classList.contains('dialogue-open')
  );
}

export function watchForUpdate(
  reg: ServiceWorkerRegistration,
  root: HTMLElement,
  game: () => Game | null,
): void {
  const state: UpdateState = { waitingSince: null, resumed: false, busy: false, online: true };
  let dismissed = false;
  let lastCheck = Date.now();

  const chip = document.createElement('div');
  chip.className = 'update-ready';
  chip.setAttribute('role', 'status');
  chip.hidden = true;
  const go = document.createElement('button');
  go.type = 'button';
  go.className = 'update-ready-go';
  go.textContent = UPDATE_NOTICE_TEXT.chip;
  const later = document.createElement('button');
  later.type = 'button';
  later.className = 'update-ready-later';
  later.textContent = UPDATE_NOTICE_TEXT.later;
  chip.append(go, later);
  root.appendChild(chip);

  const refresh = (): void => {
    const waiting = reg.waiting !== null && navigator.serviceWorker.controller !== null;
    if (!waiting) state.waitingSince = null;
    else state.waitingSince ??= Date.now();
    state.busy = busyNow(game());
    state.online = navigator.onLine !== false;
    const show = !dismissed && updateChipDue(state, Date.now());
    if (chip.hidden === show) chip.hidden = !show;
  };

  go.addEventListener('click', () => {
    const g = game();
    if (!g || !g.save()) {
      go.textContent = UPDATE_NOTICE_TEXT.unsaved;
      window.setTimeout(() => (go.textContent = UPDATE_NOTICE_TEXT.chip), 4000);
      return;
    }
    go.textContent = UPDATE_NOTICE_TEXT.saving;
    go.disabled = true;
    let done = false;
    const reload = (): void => {
      if (done) return;
      done = true;
      location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', reload, { once: true });
    window.setTimeout(reload, UPDATE_NOTICE.reloadFallbackMs);
    if (reg.waiting) reg.waiting.postMessage({ type: 'skip-waiting' });
    else reload();
  });
  // "Later" hides it until the app is next hidden and resumed.
  later.addEventListener('click', () => {
    dismissed = true;
    chip.hidden = true;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    dismissed = false;
    state.resumed = reg.waiting !== null;
    // An app left open never navigates, so the browser never looks for a new build: ask.
    if (Date.now() - lastCheck >= UPDATE_NOTICE.checkEveryMs && navigator.onLine !== false) {
      lastCheck = Date.now();
      reg.update().catch(() => undefined);
    }
    refresh();
  });
  reg.addEventListener('updatefound', () => {
    const w = reg.installing;
    w?.addEventListener('statechange', refresh);
  });
  window.addEventListener('online', refresh);
  window.addEventListener('offline', refresh);
  window.setInterval(refresh, UPDATE_NOTICE.pollMs);
  refresh();
}
