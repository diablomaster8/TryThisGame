import { afterEach, describe, expect, it, vi } from 'vitest';

// R0342 (FUN-53): read-aloud with a stubbed speech engine. The audio module is mocked so
// sound counts as on, and window, the utterance class and the synth are plain stand-ins.
vi.mock('../../src/platform/audio', () => ({
  isAudioUnlocked: () => true,
  isSoundEnabled: () => true,
  playSound: () => {},
  holdMusicDuck: () => {},
}));

interface FakeUtterance {
  text: string;
  pitch: number;
  rate: number;
  lang: string;
  onend: (() => void) | null;
  onboundary: ((e: { charIndex: number; name?: string }) => void) | null;
}

function stubSpeech(): FakeUtterance[] {
  const said: FakeUtterance[] = [];
  class U {
    pitch = 1;
    rate = 1;
    lang = '';
    onend: (() => void) | null = null;
    onboundary: FakeUtterance['onboundary'] = null;
    constructor(public text: string) {}
  }
  const synth = {
    cancel: () => {},
    getVoices: () => [],
    speak: (u: FakeUtterance) => said.push(u),
  };
  vi.stubGlobal('SpeechSynthesisUtterance', U);
  vi.stubGlobal('window', { speechSynthesis: synth, setTimeout: (f: () => void) => f() });
  return said;
}

afterEach(() => vi.unstubAllGlobals());

describe('R0342 read-aloud voices', () => {
  it('Sparks and Moss are said at different pitches', async () => {
    const said = stubSpeech();
    const { speakLine } = await import('../../src/ui/lesson');
    speakLine('Look at that.', { speaker: 'sparks' });
    speakLine('Look at that.', { speaker: 'moss' });
    expect(said).toHaveLength(2);
    expect(said[0]!.pitch).toBeGreaterThan(said[1]!.pitch);
    expect(said[0]!.rate).toBeGreaterThan(said[1]!.rate);
  });

  it('a shouted word arrives lowercased, in its own chunk, a little higher', async () => {
    const said = stubSpeech();
    const { speakLine } = await import('../../src/ui/lesson');
    speakLine('Oh. HEY! Over here.', { speaker: 'narrator' });
    // The chunks follow one another on each end.
    for (let i = 0; i < 5 && said[i]; i++) said[i]!.onend?.();
    const texts = said.map((u) => u.text);
    expect(texts).toContain('hey');
    expect(texts.join('')).not.toMatch(/HEY/);
    const hey = said.find((u) => u.text === 'hey')!;
    expect(hey.pitch).toBeGreaterThan(said[0]!.pitch);
  });

  it('word boundaries move the highlight along the line', async () => {
    const said = stubSpeech();
    const { speakLine } = await import('../../src/ui/lesson');
    const words: Array<[string, number]> = [];
    speakLine('Slow hands win.', { onWord: (w, at) => words.push([w, at]) });
    said[0]!.onboundary?.({ charIndex: 0, name: 'word' });
    said[0]!.onboundary?.({ charIndex: 5, name: 'word' });
    said[0]!.onboundary?.({ charIndex: 11, name: 'word' });
    expect(words).toEqual([
      ['Slow', 0],
      ['hands', 5],
      ['win', 11],
    ]);
  });

  it('waits a beat after a line ending in "!", none after a full stop', async () => {
    const { pauseAfterLine } = await import('../../src/ui/read-aloud');
    expect(pauseAfterLine('Rule four: do not be Sparks!')).toBeGreaterThan(0);
    expect(pauseAfterLine('You lift the latch.')).toBe(0);
  });

  it('keeps OK and short words as they are', async () => {
    const { shoutChunks } = await import('../../src/ui/read-aloud');
    expect(shoutChunks('OK, I see.')).toEqual([{ text: 'OK, I see.', shout: false, at: 0 }]);
  });

  it('prefers a British "Natural" voice when the device has one', async () => {
    const { bestVoice, resetVoiceChoice } = await import('../../src/ui/read-aloud');
    resetVoiceChoice();
    const v = (name: string, lang: string) => ({ name, lang }) as SpeechSynthesisVoice;
    const pick = bestVoice([v('Basic', 'en-US'), v('Plain', 'en-GB'), v('Sonia Natural', 'en-GB')]);
    expect(pick?.name).toBe('Sonia Natural');
    resetVoiceChoice();
  });
});
