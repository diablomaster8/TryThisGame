import { describe, expect, it } from 'vitest';
import { extract, uiUnits } from './l10n-extract';

describe('l10n extraction (R0345)', () => {
  it('groups lines by audience, keyed by id, carrying notes', () => {
    const out = extract([
      { id: 'a-0', speaker: 'hazel', mood: 'soft', text: 'Hi.', note: '', audience: 'main' },
      {
        id: 'a-1',
        speaker: 'byte',
        mood: 'neutral',
        text: 'Pun.',
        note: 'wordplay',
        audience: 'sprout',
      },
    ]);
    expect(out.main!['a-0']).toEqual({ source: 'Hi.', speaker: 'hazel', mood: 'soft' });
    expect(out.sprout!['a-1']!.tn).toBe('wordplay');
  });

  it('lists the ICU catalogue as ui.* units', () => {
    expect(Object.keys(uiUnits())).toContain('ui.rebirths');
    expect(uiUnits()['ui.ago']!.tn).toBeTruthy();
  });
});
