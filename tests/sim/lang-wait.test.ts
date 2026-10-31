import { describe, expect, it } from 'vitest';
import { STORY } from '../../src/config/tuning';
import { langNextVisit } from '../../src/sim/lang-wait';
import type { World } from '../../src/sim/types';

/** Lane E r9, R0737 (KIDS-69): which picture of the time Ori's postcard shows. */
const QUESTS = ['LH1', 'LH2', 'LH3'];

function world(
  fun: Record<string, { status: string; sinceMs: number }>,
  timeMs: number,
  langSkipAt?: number,
): World {
  return {
    timeMs,
    campaign: { fun },
    edu: {
      courses: { hebrew: true, japanese: false },
      ...(langSkipAt !== undefined ? { langSkipAt } : {}),
    },
  } as unknown as World;
}

const night = STORY.dayMs * 0.75;
const morning = STORY.dayMs * 1.1;

describe('langNextVisit', () => {
  it('waits on nothing before the first visit, during one, or after the last', () => {
    expect(langNextVisit(world({}, night), 'hebrew', QUESTS)).toBeNull();
    expect(
      langNextVisit(world({ lh1: { status: 'open', sinceMs: 0 } }, night), 'hebrew', QUESTS),
    ).toBeNull();
    const all = Object.fromEntries(
      QUESTS.map((q) => [q.toLowerCase(), { status: 'done', sinceMs: 0 }]),
    );
    expect(langNextVisit(world(all, night), 'hebrew', QUESTS)).toBeNull();
    const started = { lh1: { status: 'done', sinceMs: 0 }, lh2: { status: 'open', sinceMs: 1 } };
    expect(langNextVisit(world(started, night), 'hebrew', QUESTS)).toBeNull();
  });

  it('shows the morning at night and "soon" in the morning between visits', () => {
    const between = { lh1: { status: 'done', sinceMs: 1000 } };
    expect(langNextVisit(world(between, night), 'hebrew', QUESTS)).toBe('morning');
    expect(langNextVisit(world(between, morning), 'hebrew', QUESTS)).toBe('soon');
  });

  it('says "soon" once a grown-up skipped to morning after the last visit ended', () => {
    const between = { lh1: { status: 'done', sinceMs: 1000 } };
    expect(langNextVisit(world(between, night, 2000), 'hebrew', QUESTS)).toBe('soon');
    // A skip pressed before this visit ended does not carry over.
    expect(langNextVisit(world(between, night, 500), 'hebrew', QUESTS)).toBe('morning');
  });

  it('is null for a course not started', () => {
    expect(
      langNextVisit(world({ lh1: { status: 'done', sinceMs: 0 } }, night), 'japanese', QUESTS),
    ).toBeNull();
  });
});
