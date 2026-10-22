import { afterEach, describe, expect, it, vi } from 'vitest';
import { readGraphicsPref, writeGraphicsPref } from '../../src/platform/storage';

/**
 * The Graphics pick survives blocked storage for the rest of the page's life, so choosing
 * Full 3D on the title still starts Full 3D (review D, bug 13).
 */

afterEach(() => vi.unstubAllGlobals());

describe('the Graphics pick', () => {
  it('is honoured for this session when storage throws', () => {
    const blocked = (): never => {
      throw new DOMException('blocked', 'SecurityError');
    };
    vi.stubGlobal('localStorage', { getItem: blocked, setItem: blocked, removeItem: blocked });
    expect(writeGraphicsPref('3d')).toBe(false);
    expect(readGraphicsPref()).toBe('3d');
    writeGraphicsPref('pixel');
    expect(readGraphicsPref()).toBe('pixel');
  });
});
