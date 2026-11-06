import { describe, expect, it } from 'vitest';
import * as C from '../../src/content/index';
import type { Line } from '../../src/config/story';
import { frozenVoId } from '../../src/content/vo-hash';
import { assignIds } from './vo-freeze';

const L = (...t: string[]): Line[] => t.map((text) => ({ who: 'narrator', text }));

describe('frozen voice-over ids (R0344)', () => {
  it('keeps ids when lines are inserted, moved or lightly edited', () => {
    const first = assignIds('s', L('a', 'b', 'c'), undefined);
    expect(first.ids).toEqual(['s-0', 's-1', 's-2']);
    const inserted = assignIds('s', L('a', 'new', 'b', 'c'), first.entry);
    expect(inserted.ids).toEqual(['s-0', 's-3', 's-1', 's-2']);
    const moved = assignIds('s', L('c', 'a', 'new', 'b'), inserted.entry);
    expect(moved.ids).toEqual(['s-2', 's-0', 's-3', 's-1']);
    const edited = assignIds('s', L('c', 'a!', 'new', 'b'), moved.entry);
    expect(edited.ids).toEqual(['s-2', 's-0', 's-3', 's-1']);
  });

  it('never reuses a number after a line is deleted', () => {
    const first = assignIds('s', L('a', 'b'), undefined);
    const cut = assignIds('s', L('a'), first.entry);
    const later = assignIds('s', L('a', 'z'), cut.entry);
    expect(later.ids).toEqual(['s-0', 's-2']);
  });

  it('finds Hazel’s sprout letter lines by their text', () => {
    expect(frozenVoId('no such line anywhere')).toBeUndefined();
    const letter = C.EDU_CAMPAIGN.sprout
      .flatMap((c) => c.scenes)
      .find((s) => s.of === 'c1-letter')!;
    const hazel = letter.lines.filter((l) => l.who === 'hazel');
    expect(hazel.length).toBeGreaterThan(0);
    for (const l of hazel) expect(frozenVoId(l.text), l.text).toMatch(/^sprout:c1-letter-\d+$/);
  });
});
