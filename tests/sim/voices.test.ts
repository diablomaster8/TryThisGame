import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Hot fix: separate switches for the story voices, the "everything else" voices, the music
// and the sound effects. Each gates only its own bus. The audio module is mocked just enough
// for `speakLine`; the switches under test are the real ones in platform/voices.ts.
vi.mock('../../src/platform/audio', () => ({
  isAudioUnlocked: () => true,
  playSound: () => {},
  holdMusicDuck: () => {},
}));

import {
  applyVoices,
  isVoiceOn,
  masterMuteSettings,
  readsAloudByDefault,
  resetVoicesForTest,
  resolveVoices,
  setVoices,
} from '../../src/platform/voices';

interface FakeSynth {
  said: string[];
  cancels: number;
}

function stubSpeech(): FakeSynth {
  const rec: FakeSynth = { said: [], cancels: 0 };
  class U {
    pitch = 1;
    rate = 1;
    lang = '';
    onend: (() => void) | null = null;
    onstart: (() => void) | null = null;
    onerror: (() => void) | null = null;
    onboundary: (() => void) | null = null;
    constructor(public text: string) {}
  }
  const synth = {
    cancel: () => {
      rec.cancels++;
    },
    getVoices: () => [],
    speak: (u: { text: string }) => rec.said.push(u.text),
  };
  vi.stubGlobal('SpeechSynthesisUtterance', U);
  vi.stubGlobal('window', { speechSynthesis: synth, setTimeout: (f: () => void) => f() });
  return rec;
}

beforeEach(() => resetVoicesForTest({ story: false, ui: false }));
afterEach(() => vi.unstubAllGlobals());

describe('voices: defaults', () => {
  it('are off in the main game, whatever the story band', () => {
    expect(resolveVoices({}, null)).toEqual({ story: false, ui: false });
    expect(readsAloudByDefault(null)).toBe(false);
  });

  it('are on for the sprout band, and for readers only with read-to-me', () => {
    expect(resolveVoices({}, { band: 'sprout' })).toEqual({ story: true, ui: true });
    expect(resolveVoices({}, { band: 'reader' })).toEqual({ story: false, ui: false });
    expect(resolveVoices({}, { band: 'reader', readToMe: true })).toEqual({
      story: true,
      ui: true,
    });
  });

  it('an explicit choice always wins, each switch on its own', () => {
    expect(resolveVoices({ voicesStory: false }, { band: 'sprout' })).toEqual({
      story: false,
      ui: true,
    });
    expect(resolveVoices({ voicesUi: true }, null)).toEqual({ story: false, ui: true });
    expect(resolveVoices({ voicesStory: true, voicesUi: false }, { band: 'sprout' })).toEqual({
      story: true,
      ui: false,
    });
  });
});

describe('voices: each switch gates only its own channel', () => {
  it('with both off, no speech call is made', async () => {
    const synth = stubSpeech();
    const { speakLine } = await import('../../src/ui/lesson');
    expect(speakLine('Hello there.')).toBe(false);
    expect(speakLine('Hello there.', { channel: 'story' })).toBe(false);
    expect(synth.said).toEqual([]);
  });

  it('story on, everything else off: only story lines are said', async () => {
    const synth = stubSpeech();
    const { speakLine } = await import('../../src/ui/lesson');
    setVoices({ story: true, ui: false });
    expect(speakLine('A prompt.')).toBe(false);
    expect(speakLine('A story line.', { channel: 'story' })).toBe(true);
    expect(synth.said).toEqual(['A story line.']);
  });

  it('everything else on, story off: only the other lines are said', async () => {
    const synth = stubSpeech();
    const { speakLine } = await import('../../src/ui/lesson');
    setVoices({ story: false, ui: true });
    expect(speakLine('A story line.', { channel: 'story' })).toBe(false);
    expect(speakLine('A prompt.')).toBe(true);
    expect(synth.said).toEqual(['A prompt.']);
  });

  it('turning a channel off cuts its speech in progress at once', async () => {
    const synth = stubSpeech();
    const { speakLine } = await import('../../src/ui/lesson');
    setVoices({ story: true, ui: true });
    speakLine('A long story line.', { channel: 'story' });
    const before = synth.cancels;
    setVoices({ story: true, ui: false });
    expect(synth.cancels).toBe(before); // the story line was not the one switched off
    setVoices({ story: false, ui: false });
    expect(synth.cancels).toBeGreaterThan(before);
  });

  it('applyVoices follows the world: a sprout world speaks, then a main world is silent', () => {
    applyVoices({}, { band: 'sprout' });
    expect(isVoiceOn('story') && isVoiceOn('ui')).toBe(true);
    applyVoices({}, null);
    expect(isVoiceOn('story') || isVoiceOn('ui')).toBe(false);
  });
});

describe('voices: the other buses are separate', () => {
  it('the effects and music switches do not touch the voices, and the voices do not touch them', async () => {
    const real = await vi.importActual<typeof import('../../src/platform/audio')>(
      '../../src/platform/audio',
    );
    real.setSoundEnabled(false);
    real.setMusicEnabled(true);
    expect(real.isSoundEnabled()).toBe(false);
    expect(real.isMusicEnabled()).toBe(true);
    setVoices({ story: true, ui: true });
    expect(real.isSoundEnabled()).toBe(false);
    expect(real.isMusicEnabled()).toBe(true);
    real.setMusicEnabled(false);
    real.setSoundEnabled(true);
    expect(isVoiceOn('story') && isVoiceOn('ui')).toBe(true);
    expect(real.isSoundEnabled()).toBe(true);
    expect(real.isMusicEnabled()).toBe(false);
  });

  it('recorded and spoken lines do not depend on the effects switch', async () => {
    const synth = stubSpeech();
    const { speakLine } = await import('../../src/ui/lesson');
    setVoices({ story: true, ui: true });
    // The mocked audio module has no isSoundEnabled at all: speakLine must not need it.
    expect(speakLine('Still spoken.', { channel: 'story' })).toBe(true);
    expect(synth.said).toHaveLength(1);
  });
});

describe('voices: master mute', () => {
  it('off silences both with explicit values; on clears them to the default', () => {
    const muted = masterMuteSettings({ voicesStory: true }, false);
    expect(muted).toMatchObject({ voicesStory: false, voicesUi: false });
    const back = masterMuteSettings(muted, true);
    expect('voicesStory' in back).toBe(false);
    expect('voicesUi' in back).toBe(false);
    expect(resolveVoices(back, { band: 'sprout' })).toEqual({ story: true, ui: true });
  });
});
