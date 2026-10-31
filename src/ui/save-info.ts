/**
 * R0659 (CAMP-67): how Settings → Saves words a save's age and size. Pure (no DOM), so the
 * wording is tested; the Settings panel reads the stored copies and passes them in.
 */
import { SAVE_INFO_TEXT } from '../config/strings';
import { SAVE_INFO } from '../config/tuning';

/** A size as the panel says it: bytes under a KB, else KB (one decimal under 10 KB). */
export function formatBytes(n: number): string {
  if (n < SAVE_INFO.kbFrom) return SAVE_INFO_TEXT.bytes(n);
  const kb = n / 1024;
  return SAVE_INFO_TEXT.kb(kb < 10 ? kb.toFixed(1) : String(Math.round(kb)));
}

/** How long ago a save was written, from wall times in ms; 0 means never. */
export function formatSavedAgo(nowMs: number, savedAtMs: number): string {
  if (!(savedAtMs > 0)) return SAVE_INFO_TEXT.never;
  const s = Math.max(0, Math.floor((nowMs - savedAtMs) / 1000));
  if (s < SAVE_INFO.justNowS) return SAVE_INFO_TEXT.justNow;
  const u = SAVE_INFO_TEXT.units;
  if (s < 60) return SAVE_INFO_TEXT.ago(s, u.s!);
  if (s < 3600) return SAVE_INFO_TEXT.ago(Math.floor(s / 60), u.m!);
  if (s < 86_400) return SAVE_INFO_TEXT.ago(Math.floor(s / 3600), u.h!);
  return SAVE_INFO_TEXT.ago(Math.floor(s / 86_400), u.d!);
}

/** The save's own stamp, or 0 when it has none or does not parse. */
export function savedAtOfJson(json: string | null): number {
  if (json === null) return 0;
  try {
    const at = (JSON.parse(json) as { savedAtWallMs?: unknown }).savedAtWallMs;
    return typeof at === 'number' && Number.isFinite(at) ? at : 0;
  } catch {
    return 0;
  }
}

/** Bytes a string takes in localStorage terms (UTF-16 code units, two bytes each). */
export function storedBytes(json: string): number {
  return json.length * 2;
}

/** The panel's lines for the current slot, its IndexedDB copy and the unreadable copies. */
export function saveInfoLines(input: {
  nowMs: number;
  current: string | null;
  mirror: string | null | undefined;
  unreadable: number;
}): string[] {
  const line = (json: string): [string, string] => [
    formatSavedAgo(input.nowMs, savedAtOfJson(json)),
    formatBytes(storedBytes(json)),
  ];
  const out: string[] = [];
  out.push(
    input.current === null ? SAVE_INFO_TEXT.never : SAVE_INFO_TEXT.line(...line(input.current)),
  );
  // undefined: the mirror has not answered yet (it is read asynchronously).
  if (input.mirror !== undefined)
    out.push(
      input.mirror === null
        ? SAVE_INFO_TEXT.noMirror
        : SAVE_INFO_TEXT.mirror(...line(input.mirror)),
    );
  if (input.unreadable > 0) out.push(SAVE_INFO_TEXT.unreadable(input.unreadable));
  return out;
}
