import { describe, expect, it } from 'vitest';
import { TYPE_TIMING } from '../../src/config/tuning-fun';
import { pauseAfter, voiceOf } from '../../src/ui/type-timing';

// R0302 (FUN-13): punctuation pauses and per-speaker blips.

/** Total hold time while typing `text` one character at a time. */
const held = (text: string): number => {
  let t = 0;
  for (let n = 1; n <= text.length; n++) t += pauseAfter(text, n);
  return t;
};

describe('typewriter timing', () => {
  it('holds longest on a trailing ellipsis, a beat on a full stop, a breath on a comma', () => {
    const p = TYPE_TIMING.pauses;
    expect(held('Well… no.')).toBe(p.trail);
    expect(held('FLAT. I said FLAT.')).toBe(p.stop);
    expect(held('Yes, fine')).toBe(p.comma);
    expect(held('Wait... what')).toBe(p.trail);
    expect(held('It is 3.5 metres')).toBe(0);
  });

  it('gives Sparks and Moss different voices, and keeps the narrator silent', () => {
    expect(voiceOf('sparks')!.hz).not.toBe(voiceOf('moss')!.hz);
    expect(voiceOf('narrator')).toBeNull();
    expect(voiceOf('hazel')).toBeNull();
    expect(voiceOf('someone-new')).not.toBeNull();
  });
});
