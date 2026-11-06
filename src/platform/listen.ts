/**
 * R0744 (KIDS-76): optional listening for "say it" turns. Only a grown-up's opt-in turns it on
 * (off by default; the flag lives in localStorage on this device). It listens for a few seconds,
 * reports that there was voice energy and nothing else: no transcript is read, nothing is
 * recorded or stored, and a failure is silent. With the opt-in off the browser API is never
 * touched.
 */
import { LISTEN_TUNING } from '../config/strings-listen';

interface Recogniser {
  continuous: boolean;
  interimResults: boolean;
  processLocally?: boolean;
  onspeechstart: (() => void) | null;
  onsoundstart: (() => void) | null;
  onresult: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start(): void;
  abort(): void;
}
type RecogniserCtor = new () => Recogniser;

/** Test hook: a stub recogniser used instead of the browser's. */
let stub: RecogniserCtor | null = null;
export function setListenStub(ctor: RecogniserCtor | null): void {
  stub = ctor;
}

export function listenOptIn(): boolean {
  try {
    return window.localStorage.getItem(LISTEN_TUNING.storeKey) === '1';
  } catch {
    return false;
  }
}

export function setListenOptIn(on: boolean): void {
  try {
    if (on) window.localStorage.setItem(LISTEN_TUNING.storeKey, '1');
    else window.localStorage.removeItem(LISTEN_TUNING.storeKey);
  } catch {
    // Storage blocked: the opt-in just does not stick.
  }
}

function ctor(): RecogniserCtor | null {
  if (stub) return stub;
  const w = window as unknown as {
    SpeechRecognition?: RecogniserCtor;
    webkitSpeechRecognition?: RecogniserCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** True when the grown-up opted in and the browser can listen. */
export function listenAvailable(): boolean {
  return listenOptIn() && ctor() !== null;
}

/**
 * Listen once, for `listenMs`. `onVoice` fires at most once, for any voice energy;
 * `onEnd` fires when listening is over either way. Returns false (and touches no API) when it
 * is off or unsupported.
 */
export function listenOnce(onVoice: () => void, onEnd?: () => void): boolean {
  if (!listenOptIn()) return false;
  const C = ctor();
  if (!C) return false;
  let heard = false;
  let over = false;
  let rec: Recogniser | null = null;
  const end = (): void => {
    if (over) return;
    over = true;
    window.clearTimeout(timer);
    try {
      rec?.abort();
    } catch {
      // Already stopped.
    }
    onEnd?.();
  };
  const voice = (): void => {
    if (heard || over) return;
    heard = true;
    onVoice();
  };
  const timer = window.setTimeout(end, LISTEN_TUNING.listenMs);
  try {
    rec = new C();
    rec.continuous = false;
    rec.interimResults = true;
    // Keep audio on the device where the browser offers it.
    rec.processLocally = true;
    rec.onspeechstart = voice;
    rec.onsoundstart = voice;
    rec.onresult = voice;
    rec.onerror = end;
    rec.onend = end;
    rec.start();
  } catch {
    window.clearTimeout(timer);
    over = true;
    onEnd?.();
    return false;
  }
  return true;
}
