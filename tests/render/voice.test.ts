import { describe, expect, it } from 'vitest';
import { englishVoices, pickVoice } from '../../src/platform/voice';

const v = (name: string, lang: string, localService: boolean) => ({ name, lang, localService });

/** R0698: the read-aloud voice pick. */
describe('read-aloud voice pick (R0698)', () => {
  const voices = [
    v('Google UK English Female', 'en-GB', false),
    v('Plain US', 'en-US', true),
    v('Daniel', 'en-GB', true),
    v('Serena Premium', 'en-GB', true),
    v('Amelie', 'fr-FR', true),
  ];

  it('prefers a local British voice with a better-engine name', () => {
    expect(pickVoice(voices, null)?.name).toBe('Serena Premium');
  });

  it('falls back to a network voice, then to any English, never another language', () => {
    expect(pickVoice([v('Net', 'en-GB', false), v('Local', 'en-US', true)], null)?.name).toBe(
      'Local',
    );
    expect(pickVoice([v('Amelie', 'fr-FR', true)], null)).toBeNull();
    expect(englishVoices(voices).map((x) => x.name)).not.toContain('Amelie');
  });

  it('honours the saved voice when the device still has it', () => {
    expect(pickVoice(voices, 'Plain US')?.name).toBe('Plain US');
    expect(pickVoice(voices, 'Gone')?.name).toBe('Serena Premium');
  });
});
