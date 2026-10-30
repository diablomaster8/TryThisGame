import { describe, expect, it } from 'vitest';
import { TOAST_VARIANTS, toastVariant } from '../../src/config/strings-fun-r6';

// R0349 (FUN-60): flat toasts rotate, three or more each, never the same twice running.

describe('toast variants', () => {
  it('each has three or more, and a soak never repeats one back to back', () => {
    for (const [key, list] of Object.entries(TOAST_VARIANTS)) {
      expect(list.length).toBeGreaterThanOrEqual(3);
      let last = '';
      for (let i = 0; i < 20; i++) {
        const t = toastVariant(key);
        expect(t).not.toBe(last);
        last = t;
      }
    }
    expect(toastVariant('Placed.')).toBe('Placed.');
  });
});
