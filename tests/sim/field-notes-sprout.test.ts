import { describe, expect, it } from 'vitest';
import { allKeys } from '../../src/sim/collection';
import { keyFlavour } from '../../src/ui/collection';
import { SPROUT_OWN_KEYS, sproutNote } from '../../src/config/field-notes-sprout';
import { DIGITAL_NOTES, POCKET_NOTES } from '../../src/config/field-notes-r9e';
import { FIELD_NOTES, fieldNote } from '../../src/config/strings-look';

const KEYS = [
  ...Object.keys(FIELD_NOTES),
  ...Object.keys(POCKET_NOTES),
  ...Object.keys(DIGITAL_NOTES),
];

describe('sprout field notes (R0358)', () => {
  it('gives every entry with a note one short line of eight words or fewer', () => {
    expect(KEYS.length).toBeGreaterThan(250);
    for (const k of KEYS) {
      const line = sproutNote(k, fieldNote(k));
      expect(line, k).not.toBe('');
      expect(line.split(/\s+/).length, k).toBeLessThanOrEqual(8);
    }
  });

  it('only overrides entries that exist', () => {
    for (const k of SPROUT_OWN_KEYS) expect(KEYS, k).toContain(k);
  });

  it('has nothing for an entry without a note', () => {
    expect(sproutNote('no:such:key', '')).toBe('');
  });
});

describe('sprout lines for every other entry kind (R0358)', () => {
  it('gives every book key a sprout line of eight words or fewer', () => {
    for (const k of allKeys()) {
      const line = sproutNote(k, fieldNote(k));
      expect(line, k).not.toBe('');
      expect(line.split(/\s+/).length, k).toBeLessThanOrEqual(8);
    }
  });

  it('shows a sprout the short line through the book page', () => {
    for (const k of ['hat:beanie', 'part:koala:ears', 'colour:sky', 'colour:sky:shiny', 'jewel:ruby']) {
      expect(keyFlavour(k, true), k).toBe(sproutNote(k, fieldNote(k)));
      expect(keyFlavour(k, true).split(/\s+/).length).toBeLessThanOrEqual(8);
    }
  });
});
