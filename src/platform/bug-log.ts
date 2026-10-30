/**
 * TECH-33: a private, local bug log. The last 30 errors (message, the first 6 stack frames,
 * when) live in `sessionStorage`, and the last 50 sim event kinds in memory. "Copy bug
 * report" in Settings puts them on the clipboard as JSON with the build, browser, settings
 * and the save, kept under 100 kB; nothing is ever sent anywhere. Every storage touch is
 * wrapped.
 */
const KEY = 'grove.errors';
const MAX_ERRORS = 30;
const MAX_EVENTS = 50;
const MAX_REPORT = 100_000;

export interface LoggedError {
  what: string;
  message: string;
  stack: string;
  at: number;
}

const events: string[] = [];

function readErrors(): LoggedError[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LoggedError[]) : [];
  } catch {
    return [];
  }
}

/** Called by the error watch for every error it logs. */
export function noteError(what: string, err: unknown, at = Date.now()): void {
  const e = err instanceof Error ? err : null;
  const entry: LoggedError = {
    what,
    message: e ? `${e.name}: ${e.message}` : String(err).slice(0, 300),
    stack: (e?.stack ?? '').split('\n').slice(0, 7).join('\n'),
    at,
  };
  try {
    const list = [...readErrors(), entry].slice(-MAX_ERRORS);
    sessionStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // No session storage: the console still has it.
  }
}

/** Called with each batch of sim events. */
export function noteEventKinds(batch: ReadonlyArray<{ kind: string }>): void {
  for (const e of batch) events.push(e.kind);
  if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
}

/** This build's id: the hashed name of the entry script. */
export function buildId(): string {
  try {
    const s = document.querySelector<HTMLScriptElement>('script[type="module"][src]');
    return s?.src.split('/').pop() ?? 'dev';
  } catch {
    return 'unknown';
  }
}

/** The report as JSON, under 100 kB: the save is dropped first if it would not fit. */
export function bugReport(extra: { renderer: string; settings: unknown; save: string }): string {
  const base = {
    build: buildId(),
    ua: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    renderer: extra.renderer,
    settings: extra.settings,
    errors: readErrors(),
    events: [...events],
  };
  const full = JSON.stringify({ ...base, save: extra.save });
  if (full.length <= MAX_REPORT) return full;
  return JSON.stringify({ ...base, save: `(left out: ${extra.save.length} characters)` });
}
