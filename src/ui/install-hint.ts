/**
 * R0463 (TECH-21): install guidance. From the second session on, a while into play, the
 * Grove offers once to install itself: on Android and desktop Chromium with the stored
 * `beforeinstallprompt` ("Install Grove"), on iOS Safari (not already on the home screen)
 * with a card showing Share → Add to Home Screen. A dismissal or an install is remembered in
 * `grove.installHint`, and the offer never shows again. Installing also keeps iOS saves
 * safer (TECH-03). The manifest's "Continue" shortcut lands on `?continue`
 * (`continueSlot`).
 */
import { INSTALL_TEXT } from '../config/strings-r10d4';
import { INSTALL_HINT } from '../config/tuning-r10d4';
import { hasSave, readSlotIndex, type SaveMode, type SaveSlot } from '../platform/storage';
import { button, el } from './dom';

const KEY = 'grove.installHint';
const SESSIONS = 'grove.sessions';

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
}

let deferred: InstallPromptEvent | null = null;

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Blocked storage: the offer may come again next session, which is harmless.
  }
}

function standalone(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true || matchMedia('(display-mode: standalone)').matches;
}

function isIos(): boolean {
  const ua = navigator.userAgent;
  // iPadOS reports itself as a Mac with touch.
  return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

/** The slot the player wrote last, for the "Continue" shortcut; null when there is none. */
export function continueSlot(): SaveSlot | null {
  try {
    const id = readSlotIndex().lastPlayed;
    if (!id) return null;
    const [mode, idx] = id.split(':');
    const slot = { mode: mode as SaveMode, index: Number(idx) };
    return Number.isInteger(slot.index) && hasSave(slot) ? slot : null;
  } catch {
    return null;
  }
}

/**
 * At page start (main.ts): keep the browser's install prompt, which may fire on the title,
 * and remember an install.
 */
export function listenForInstall(): void {
  try {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Our own offer asks at a calm moment, instead of the browser's mini bar at once.
      e.preventDefault();
      deferred = e as InstallPromptEvent;
    });
    window.addEventListener('appinstalled', () => write(KEY, 'installed'));
  } catch {
    // No window events: no offer.
  }
}

/**
 * Once the Grove is up (main.ts): count the session and, from the second one on, offer the
 * install once after `INSTALL_HINT.delayMs` of play.
 */
export function offerInstallLater(root: HTMLElement): void {
  const sessions = (Number(read(SESSIONS)) || 0) + 1;
  write(SESSIONS, String(sessions));
  if (read(KEY) || standalone() || sessions < INSTALL_HINT.minSessions) return;
  window.setTimeout(() => offer(root), INSTALL_HINT.delayMs);
}

function offer(root: HTMLElement): void {
  if (read(KEY) || !root.isConnected || document.querySelector('.install-hint')) return;
  const ios = isIos() && !standalone();
  if (!ios && !deferred) return;
  const box = el('div', 'install-hint');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', INSTALL_TEXT.title);
  const done = (why: string): void => {
    write(KEY, why);
    box.remove();
  };
  const row = el('div', 'settings-actions');
  if (ios) {
    box.append(
      el('strong', undefined, INSTALL_TEXT.title),
      el('p', undefined, INSTALL_TEXT.iosBody),
      el('p', 'install-hint-share', INSTALL_TEXT.iosShare),
    );
  } else {
    box.append(el('strong', undefined, INSTALL_TEXT.title), el('p', undefined, INSTALL_TEXT.body));
    row.appendChild(
      button(
        INSTALL_TEXT.install,
        () => {
          const p = deferred;
          deferred = null;
          done('asked');
          void p?.prompt().catch(() => undefined);
        },
        'btn btn-primary',
      ),
    );
  }
  row.appendChild(button(INSTALL_TEXT.later, () => done('dismissed')));
  box.appendChild(row);
  root.appendChild(box);
}
