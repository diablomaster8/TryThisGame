import { describe, expect, it } from 'vitest';
import { REGION_ORDER } from '../../src/config/regions';
import { OVERVIEW_NODES } from '../../src/config/tuning-r11d6';
import { overviewLinks } from '../../src/ui/world-overview';

describe('world overview (R0130)', () => {
  it('places every overland region and joins them all into one graph', () => {
    const ids = REGION_ORDER.filter((r) => r !== 'little-grove');
    for (const id of ids)
      expect(OVERVIEW_NODES[id as keyof typeof OVERVIEW_NODES], id).toBeDefined();
    const adj = new Map<string, string[]>();
    for (const [a, b] of overviewLinks()) {
      adj.set(a, [...(adj.get(a) ?? []), b]);
      adj.set(b, [...(adj.get(b) ?? []), a]);
    }
    const seen = new Set<string>(['grove']);
    const todo = ['grove'];
    while (todo.length)
      for (const n of adj.get(todo.pop()!) ?? []) if (!seen.has(n)) (seen.add(n), todo.push(n));
    const lonely = ids.filter((i) => !seen.has(i));
    // The Hollow is a stair below the Grove, not an overland link; it may stand apart.
    expect(lonely.filter((i) => i !== 'hollow')).toEqual([]);
  });
});
