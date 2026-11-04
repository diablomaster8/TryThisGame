import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { FEEDBACK, feedbackFor, runFeedback } from '../../src/ui/event-feedback';
import { DECISION } from '../../src/ui/event-decisions';
import { createWorld } from '../../src/sim/world';

/** The kinds of the SimEvent union, read from the source (so a new one fails this test). */
function simEventKinds(): string[] {
  const src = readFileSync('src/sim/types.ts', 'utf8');
  const start = src.indexOf('export type SimEvent =');
  const rest = src.slice(start + 'export type SimEvent ='.length);
  const end = rest.search(/\n(?=\S)/);
  const kinds = new Set<string>();
  for (const m of rest
    .slice(0, end)
    .matchAll(/\n\s+\| \{\s*kind: '(\w+)'|\n\s+\| \{\n\s+kind: '(\w+)'/g))
    kinds.add(m[1] ?? m[2]!);
  return [...kinds];
}

describe('event feedback table (TECH-24)', () => {
  it('has a decision for every SimEvent kind, and no stale ones', () => {
    const kinds = simEventKinds();
    expect(kinds.length).toBeGreaterThan(200);
    const missing = kinds.filter((k) => !(k in DECISION));
    expect(missing, `decide where these are handled: ${missing.join(', ')}`).toEqual([]);
    const stale = Object.keys(DECISION).filter((k) => !kinds.includes(k));
    expect(stale).toEqual([]);
  });

  it('every table kind is marked table, and vice versa', () => {
    for (const k of Object.keys(FEEDBACK))
      expect(DECISION[k as keyof typeof DECISION]).toBe('table');
    for (const [k, v] of Object.entries(DECISION))
      if (v === 'table') expect(k in FEEDBACK).toBe(true);
  });

  it('turns events into a toast and a sound, and runs them', () => {
    const world = createWorld(3, 0);
    const fb = feedbackFor({ kind: 'questDone', id: 'x' }, { world });
    expect(fb?.sfx).toBe('cheer');
    expect(feedbackFor({ kind: 'reaction', nubbinId: 'a', reaction: 'love' }, { world })?.sfx).toBe(
      'pet',
    );
    expect(feedbackFor({ kind: 'cantReach', targetId: 'a' }, { world })).toBeNull();
    const said: string[] = [];
    expect(
      runFeedback(
        fb,
        (t) => said.push(t),
        (s) => said.push(`sfx:${s}`),
      ),
    ).toBe(true);
    expect(said[0]).toBe('sfx:cheer');
    expect(
      runFeedback(
        null,
        () => undefined,
        () => undefined,
      ),
    ).toBe(false);
  });
});
