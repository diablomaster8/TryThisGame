import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The brief's rule: sound starts muted and only turns on after the first tap or click. The
// audio engine keeps that for music and effects (tests/platform/audio-unlock.test.ts); this
// is the same rule for the read-aloud voices. Both voice switches are ON here, as they are in
// a sprout Learning Grove, and still nothing may be said until the first gesture unlocks audio.
let unlocked = false;
vi.mock('../../src/platform/audio', () => ({
  isAudioUnlocked: () => unlocked,
  playSound: () => {},
  holdMusicDuck: () => {},
}));

import { resetVoicesForTest, setVoices } from '../../src/platform/voices';

function stubSpeech(): string[] {
  const said: string[] = [];
  class U {
    pitch = 1;
    rate = 1;
    lang = '';
    onend: (() => void) | null = null;
    constructor(public text: string) {}
  }
  vi.stubGlobal('SpeechSynthesisUtterance', U);
  vi.stubGlobal('window', {
    speechSynthesis: {
      cancel: () => {},
      getVoices: () => [],
      speak: (u: { text: string }) => said.push(u.text),
    },
    setTimeout: (f: () => void) => f(),
  });
  return said;
}

beforeEach(() => {
  unlocked = false;
  resetVoicesForTest({ story: true, ui: true });
});
afterEach(() => vi.unstubAllGlobals());

describe('voices stay silent until the first gesture', () => {
  it('says nothing, on either channel, while audio is still locked', async () => {
    const said = stubSpeech();
    const { speakLine } = await import('../../src/ui/lesson');
    expect(speakLine('Hello.')).toBe(false);
    expect(speakLine('Once upon a time.', { channel: 'story' })).toBe(false);
    expect(said).toEqual([]);
  });

  it('speaks as soon as the first gesture has unlocked audio, honouring the switches', async () => {
    const said = stubSpeech();
    const { speakLine } = await import('../../src/ui/lesson');
    unlocked = true;
    expect(speakLine('Hello.')).toBe(true);
    setVoices({ story: false, ui: true });
    expect(speakLine('Once upon a time.', { channel: 'story' })).toBe(false);
    expect(said).toEqual(['Hello.']);
  });
});
