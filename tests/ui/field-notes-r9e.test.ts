import { describe, expect, it } from 'vitest';
import { DIGITAL_NOTES, POCKET_NOTES } from '../../src/config/field-notes-r9e';
import { fieldNote } from '../../src/config/strings-look';
import { SPECIES } from '../../src/sim/species';

/** FUN-69 (lane E r9): every pocket and digital species has a field note, in our own words. */
describe('field notes for the pocket and digital lines', () => {
  it('covers every species, stays short and never names the inspiration', () => {
    const others = SPECIES.filter((s) => s.family !== 'chao');
    expect(others.length).toBeGreaterThan(200);
    const all = Object.values({ ...POCKET_NOTES, ...DIGITAL_NOTES })
      .join('\n')
      .toLowerCase();
    for (const s of others) {
      const note = fieldNote(s.id);
      expect(note, s.id).toBeTruthy();
      expect(note.length, s.id).toBeLessThanOrEqual(160);
      // The inspiration's name never shows (short refs could be ordinary words, so 5+ letters).
      const ref = s.ref.toLowerCase();
      if (ref.length >= 5) expect(all.includes(ref), s.id).toBe(false);
    }
    const ids = new Set(others.map((s) => s.id));
    for (const k of Object.keys({ ...POCKET_NOTES, ...DIGITAL_NOTES }))
      expect(ids.has(k), k).toBe(true);
  });
});
