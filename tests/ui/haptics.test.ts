import { afterEach, describe, expect, it, vi } from 'vitest';
import { HAPTICS } from '../../src/config/tuning-tech';
import { buzz, hapticFor } from '../../src/platform/haptics';

describe('TECH-15: haptics', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('a hatch buzzes the hatch pattern; the toggle off means no calls', () => {
    const vibrate = vi.fn(() => true);
    vi.stubGlobal('navigator', { vibrate });
    const h = hapticFor({ kind: 'hatched', nubbinId: 'n1' });
    expect(h).toBe('hatch');
    buzz(h!, { haptics: true });
    expect(vibrate).toHaveBeenCalledWith([...HAPTICS.hatch]);
    vibrate.mockClear();
    buzz('hatch', { haptics: false });
    expect(vibrate).not.toHaveBeenCalled();
  });

  it('halves the pulses under reduced motion and does nothing without the API', () => {
    const vibrate = vi.fn(() => true);
    vi.stubGlobal('navigator', { vibrate });
    buzz('evolve', { haptics: true }, true);
    expect(vibrate).toHaveBeenCalledWith([15, 60, 15, 60, 45]);
    vi.stubGlobal('navigator', {});
    expect(buzz('pet', { haptics: true })).toBe(false);
  });
});
