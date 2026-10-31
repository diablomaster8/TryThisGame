import { describe, expect, it } from 'vitest';
import {
  isKeysHintKey,
  keysHintDone,
  showKeysHintAgain,
  watchKeysHint,
} from '../../src/ui/keys-hint';

/** A window stand-in: events, and timers that never fire on their own. */
function fakeWindow(): Window {
  const t = new EventTarget();
  return Object.assign(t, {
    setTimeout: () => 1,
    clearTimeout: () => undefined,
  }) as unknown as Window;
}

const key = (k: string) => Object.assign(new Event('keydown'), { key: k });

/** TECH-60: the hint goes once the keys are used, and "?" brings it back. */
describe('keys hint', () => {
  it('goes after move, turn and zoom, and comes back on request', () => {
    const w = fakeWindow();
    watchKeysHint(w);
    expect(keysHintDone()).toBe(false);
    w.dispatchEvent(key('w'));
    w.dispatchEvent(key('q'));
    expect(keysHintDone()).toBe(false);
    w.dispatchEvent(new Event('wheel'));
    expect(keysHintDone()).toBe(true);

    showKeysHintAgain(w);
    expect(keysHintDone()).toBe(false);
    // And it goes the same way again.
    w.dispatchEvent(key('ArrowLeft'));
    w.dispatchEvent(key('e'));
    w.dispatchEvent(new Event('wheel'));
    expect(keysHintDone()).toBe(true);
  });

  it('answers "?" only without a modifier', () => {
    const base = { ctrlKey: false, metaKey: false, altKey: false };
    expect(isKeysHintKey({ ...base, key: '?' })).toBe(true);
    expect(isKeysHintKey({ ...base, key: '/' })).toBe(false);
    expect(isKeysHintKey({ ...base, key: '?', ctrlKey: true })).toBe(false);
  });
});
