import { afterEach, describe, expect, it, vi } from 'vitest';
import { setMotionPref } from '../../src/platform/motion';
import { DYE_COLORS_ALL } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';
import { SheetCache } from '../../src/render/sprites/sheets';
import { DYE_COLORS } from '../../src/render/sprites/chao';
import {
  RAINBOW_HZ,
  RAINBOW_RING,
  dyePair,
  dyeToken,
  rainbowStep,
} from '../../src/render/sprites/rainbow-dye';
import { nubbinLook } from '../../src/render3d/creature-pool';
import { specForKey } from '../../src/render3d/looks';

afterEach(() => {
  setMotionPref('system');
  vi.useRealTimers();
});

const adult = () => {
  const w = createWorld(3, Date.UTC(2026, 6, 1));
  return { ...w.nubbins[0]!, species: 'chao', stage: 'adult' as const };
};

describe('rainbow dye (R0427)', () => {
  it('is a thirteenth dye beside the twelve flat ones', () => {
    expect(DYE_COLORS_ALL).toContain('rainbow');
    expect(DYE_COLORS_ALL.filter((d) => d !== 'rainbow')).toHaveLength(12);
  });

  it('cycles at 0.05 Hz: a lap every twenty seconds, visiting the whole ring', () => {
    expect(RAINBOW_HZ).toBe(0.05);
    expect(rainbowStep(0, false)).toBe(rainbowStep(20000, false));
    const seen = new Set<number>();
    for (let t = 0; t < 20000; t += 500) seen.add(rainbowStep(t, false));
    expect(seen.size).toBe(RAINBOW_RING.length);
    expect(rainbowStep(0, false)).not.toBe(rainbowStep(3000, false));
  });

  it('holds still under reduced motion and shows two colours', () => {
    expect(rainbowStep(0, true)).toBe(rainbowStep(12345, true));
    const [a, b] = dyePair('rainbow', (d) => DYE_COLORS[d as keyof typeof DYE_COLORS], 0);
    expect(a).not.toBe(b);
  });

  it('keys carry the step; flat dyes are unchanged', () => {
    expect(dyeToken('rainbow', 3)).toBe('rainbow.3');
    expect(dyeToken('teal', 3)).toBe('teal');
    expect(dyeToken(null, 3)).toBeNull();
  });

  it('re-bakes the pixel sheet as it drifts, and not under reduced motion', () => {
    const n = { ...adult(), wingDye: 'rainbow' as const, hatDye: 'rainbow' as const };
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const a = SheetCache.nubbinKey(n);
    vi.setSystemTime(3000);
    expect(SheetCache.nubbinKey(n)).not.toBe(a);
    setMotionPref('on');
    vi.setSystemTime(0);
    const s0 = SheetCache.nubbinKey(n);
    vi.setSystemTime(9000);
    expect(SheetCache.nubbinKey(n)).toBe(s0);
  });

  it('changes the 3D look key and spec as it drifts, and is still under reduced motion', () => {
    const n = { ...adult(), wingDye: 'rainbow' as const, crownDye: 'rainbow' as const };
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const k0 = nubbinLook(n).key;
    vi.setSystemTime(3000);
    const k1 = nubbinLook(n).key;
    expect(k1).not.toBe(k0);
    expect(specForKey(k1)).not.toBe(specForKey(k0));
    setMotionPref('on');
    vi.setSystemTime(0);
    const s0 = nubbinLook(n).key;
    vi.setSystemTime(9000);
    expect(nubbinLook(n).key).toBe(s0);
  });
});
