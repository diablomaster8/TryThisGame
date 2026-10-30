/**
 * TECH-52/53: where a renderer's frame governor settled on this device, so the next boot
 * starts there instead of at the top and stuttering down. One small localStorage entry per
 * renderer (`GOV_MEMORY.key3d`, `keyPx`), every access in try/catch: blocked storage only
 * means each boot starts from the tier's settings.
 */
import { GOV_MEMORY } from '../config/tuning-r8d-perf';

export type GovMemoryValue = Record<string, number>;

export function readGovMemory(key: string): GovMemoryValue | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const v = JSON.parse(raw) as unknown;
    if (!v || typeof v !== 'object') return null;
    const out: GovMemoryValue = {};
    for (const [k, n] of Object.entries(v))
      if (typeof n === 'number' && Number.isFinite(n)) out[k] = n;
    return out;
  } catch {
    return null;
  }
}

/** Writes a level when it changed, at most every `GOV_MEMORY.everyMs`. */
export class GovMemory {
  private last = '';
  private lastMs = -Infinity;

  constructor(readonly key: string) {}

  read(): GovMemoryValue | null {
    return readGovMemory(this.key);
  }

  note(value: GovMemoryValue, nowMs: number): void {
    const s = JSON.stringify(value);
    if (s === this.last || nowMs - this.lastMs < GOV_MEMORY.everyMs) return;
    this.last = s;
    this.lastMs = nowMs;
    try {
      localStorage.setItem(this.key, s);
    } catch {
      // Storage blocked or full: start from the tier next time.
    }
  }
}
