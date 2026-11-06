import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/platform/audio', () => ({
  isAudioUnlocked: () => true,
  isSoundEnabled: () => true,
  sfxOut: () => null,
}));

import { EDU_CLIP_IDS } from '../../src/config/edu-clips';
import { playUiText } from '../../src/platform/edu-audio';

/** R0699: with speech synthesis gone, a sprout prompt still plays, clip by clip, from files. */
describe('R0699 playing fixed lines from clips', () => {
  it('plays a templated prompt from its three recordings and then finishes', async () => {
    const played: string[] = [];
    (globalThis as unknown as { window: unknown }).window = { speechSynthesis: undefined };
    const make = (url: string): HTMLAudioElement => {
      const a = {
        onended: null as null | (() => void),
        onerror: null as null | (() => void),
        pause() {},
        play() {
          played.push(url);
          setTimeout(() => a.onended?.(), 0);
          return Promise.resolve();
        },
      };
      return a as unknown as HTMLAudioElement;
    };
    let done = false;
    const ok = playUiText('Tap the red one.', () => (done = true), new Set(EDU_CLIP_IDS), make);
    expect(ok).toBe(true);
    await vi.waitFor(() => expect(done).toBe(true));
    expect(played.map((u) => u.replace(/^.*audio\//, 'audio/'))).toEqual([
      'audio/edu/ui/part-tap-the.mp3',
      'audio/edu/ui/colour-red.mp3',
      'audio/edu/ui/part-one.mp3',
    ]);
  });
});
