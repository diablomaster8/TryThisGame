/**
 * The last line of defence for errors nothing else caught: a thrown handler, a rejected
 * promise nobody awaited. Each is logged once (up to a small budget, so a loop cannot
 * flood the console) and the player gets a gentle, passing notice at most every so often
 * (review D, bug 46). Errors the browser raises about itself, or from scripts that are
 * not ours (extensions), are logged but never shown.
 */
import { ERRORS } from '../config/tuning';

/** Messages browsers raise that are not the game's fault and need no notice. */
const BENIGN = [/ResizeObserver loop/i, /^Script error\.?$/i];
/** Rejections that mean "the browser said no", not "the game broke". */
const BENIGN_NAMES = new Set(['AbortError', 'NotAllowedError']);

export interface ErrorWatch {
  /** For tests and teardown: stop listening. */
  dispose(): void;
}

/** Listen on `target` (the window) and call `notify` for errors worth a notice. */
export function watchErrors(
  notify: () => void,
  target: Pick<Window, 'addEventListener' | 'removeEventListener'> = window,
  now: () => number = () => Date.now(),
): ErrorWatch {
  let logged = 0;
  let lastNotice = -Infinity;
  let notices = 0;

  const report = (what: string, err: unknown, quiet: boolean): void => {
    if (logged < ERRORS.maxLogged) {
      logged += 1;
      console.error(`Grove: ${what}`, err);
    }
    if (quiet || notices >= ERRORS.maxNotices) return;
    const t = now();
    if (t - lastNotice < ERRORS.noticeGapMs) return;
    lastNotice = t;
    notices += 1;
    try {
      notify();
    } catch {
      // The notice itself must never become a new error.
    }
  };

  const onError = (e: Event): void => {
    const ev = e as ErrorEvent;
    const message = typeof ev.message === 'string' ? ev.message : '';
    const foreign =
      typeof ev.filename === 'string' &&
      ev.filename !== '' &&
      typeof location !== 'undefined' &&
      !ev.filename.startsWith(location.origin);
    const benign = BENIGN.some((r) => r.test(message));
    if (benign) return;
    report('an uncaught error.', ev.error ?? message, foreign);
  };

  const onRejection = (e: Event): void => {
    const reason = (e as PromiseRejectionEvent).reason as unknown;
    const name = reason instanceof Error || isNamed(reason) ? reason.name : '';
    report('a promise was rejected and nothing caught it.', reason, BENIGN_NAMES.has(name));
  };

  target.addEventListener('error', onError);
  target.addEventListener('unhandledrejection', onRejection);
  return {
    dispose() {
      target.removeEventListener('error', onError);
      target.removeEventListener('unhandledrejection', onRejection);
    },
  };
}

function isNamed(x: unknown): x is { name: string } {
  return typeof x === 'object' && x !== null && typeof (x as { name?: unknown }).name === 'string';
}
