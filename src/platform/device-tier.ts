/**
 * TECH-09: which performance tier this device is in (`TIER_BUDGET` in config/tuning-r8d-perf).
 * `detectTier` is pure so tests can feed it made-up devices; `readDeviceTier` gathers the real
 * signals: `navigator.deviceMemory` (Chrome and Edge only), the WebGL renderer string, the
 * first-run sculpt benchmark's tier when Full 3D ran it, and whether the screen is a phone's.
 * A Quality override in Settings (`settings.qualityTier`) wins over all of them.
 */
import { TIER_DETECT, type PerfTier } from '../config/tuning-r8d-perf';
import type { DeviceTier } from '../config/tuning-world';

export interface TierInputs {
  /** `navigator.deviceMemory`, GB; undefined where the browser does not say. */
  memoryGB?: number | undefined;
  /** The unmasked WebGL renderer string, if any. */
  gpu?: string | undefined;
  /** The sculpt benchmark's tier (`tierForRes(settings.sculptRes)`), Full 3D only. */
  sculpt?: DeviceTier | undefined;
  /** A coarse pointer or a phone-sized screen. */
  phone: boolean;
}

export interface TierReading {
  tier: PerfTier;
  /** The signal that decided it, for the debug panel. */
  why: string;
}

export function detectTier(i: TierInputs): TierReading {
  const d = TIER_DETECT;
  if (i.memoryGB !== undefined && i.memoryGB <= d.lowMemGB)
    return { tier: 'low', why: `${i.memoryGB} GB` };
  if (i.gpu && new RegExp(d.lowGpu, 'i').test(i.gpu)) return { tier: 'low', why: 'gpu' };
  if (i.sculpt === 'slow') return { tier: 'low', why: 'benchmark' };
  if (!i.phone) {
    const memOk = i.memoryGB === undefined || i.memoryGB >= d.highMemGB;
    if (i.gpu && new RegExp(d.desktopGpu, 'i').test(i.gpu) && memOk)
      return { tier: 'high', why: 'desktop gpu' };
    // No GPU name to go on: the benchmark's desktop grid stands in for it.
    if (!i.gpu && i.sculpt === 'desktop' && memOk) return { tier: 'high', why: 'benchmark' };
  }
  return { tier: 'mid', why: 'default' };
}

/** The WebGL renderer's name, unmasked only where the browser masks it (no Firefox warning). */
export function gpuName(
  gl: WebGLRenderingContext | WebGL2RenderingContext | null,
): string | undefined {
  if (!gl) return undefined;
  try {
    const plain = gl.getParameter(gl.RENDERER) as unknown;
    if (typeof plain === 'string' && plain && !/^webkit webgl$/i.test(plain)) return plain;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const un = ext ? (gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as unknown) : undefined;
    return typeof un === 'string' && un ? un : undefined;
  } catch {
    return undefined;
  }
}

/** Read the tier in the browser; `override` is the Settings choice ('auto' or absent: detect). */
export function readDeviceTier(
  gl: WebGLRenderingContext | WebGL2RenderingContext | null,
  sculpt?: DeviceTier,
  override?: PerfTier | 'auto',
): TierReading {
  if (override && override !== 'auto') return { tier: override, why: 'setting' };
  const nav = typeof navigator === 'undefined' ? undefined : navigator;
  const mem = (nav as { deviceMemory?: unknown } | undefined)?.deviceMemory;
  const phone =
    typeof window !== 'undefined' &&
    (window.matchMedia?.('(pointer: coarse)').matches === true ||
      Math.min(window.innerWidth, window.innerHeight) < 600);
  return detectTier({
    memoryGB: typeof mem === 'number' ? mem : undefined,
    gpu: gpuName(gl),
    sculpt,
    phone,
  });
}

/** TECH-52: the Quality override is a device choice, kept beside the save, not in it. */
const QUALITY_KEY = 'grove.quality';

export function readQualityOverride(): PerfTier | 'auto' {
  try {
    const v = localStorage.getItem(QUALITY_KEY);
    return v === 'low' || v === 'mid' || v === 'high' ? v : 'auto';
  } catch {
    return 'auto';
  }
}

export function writeQualityOverride(v: PerfTier | 'auto'): void {
  try {
    if (v === 'auto') localStorage.removeItem(QUALITY_KEY);
    else localStorage.setItem(QUALITY_KEY, v);
  } catch {
    // Storage blocked: the choice lasts this page only.
  }
}
