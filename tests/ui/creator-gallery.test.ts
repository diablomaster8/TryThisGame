import { describe, expect, it } from 'vitest';
import { creatorCatalogue } from '../../src/sim/creator';
import type { Command } from '../../src/sim/types';
import { filterCatalogue, GalleryModel, groupEntries } from '../../src/ui/creator-gallery';

/** The gallery's state and commands, without a DOM (the test environment is node). */
describe('creator gallery model', () => {
  const sent: Command[] = [];
  const m = new GalleryModel(creatorCatalogue(), (c) => sent.push(c));

  it('builds grouped tiles for each family', () => {
    for (const f of ['chao', 'pocket', 'digi'] as const) {
      m.family = f;
      const groups = groupEntries(m.visible());
      expect(groups.length).toBeGreaterThan(0);
      expect(m.visible().every((e) => e.family === f)).toBe(true);
    }
  });

  it('filters by words in the label or group', () => {
    const all = creatorCatalogue();
    const some = filterCatalogue(all, 'chao', 'chaos moon');
    // Every Chaos-tier Moon form at least (15), each matching both words.
    expect(some.length).toBeGreaterThanOrEqual(15);
    for (const e of some) {
      const hay = `${e.label} ${e.group}`.toLowerCase();
      expect(hay.includes('chaos') && hay.includes('moon')).toBe(true);
    }
    expect(filterCatalogue(all, 'chao', 'zzzz-nothing')).toEqual([]);
  });

  it('sends creatorGrant with the tile pick, and transform only with a target', () => {
    m.family = 'chao';
    m.text = 'eternal sun';
    const tile = m.visible()[0]!;
    expect(m.grant()).toBe(false);
    m.select(tile.id);
    expect(m.grant()).toBe(true);
    expect(sent.at(-1)).toEqual({ kind: 'creatorGrant', pick: tile.pick });
    expect(m.transform(null)).toBe(false);
    expect(m.transform('nub-1')).toBe(true);
    expect(sent.at(-1)).toEqual({ kind: 'creatorTransform', nubbinId: 'nub-1', pick: tile.pick });
  });
});
