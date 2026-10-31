import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { catchUp } from '../../src/sim/offline';
import { deserialize, SaveError, serialize } from '../../src/sim/save';
import type { World } from '../../src/sim/types';
import { stepWorld } from '../../src/sim/world';

/**
 * TECH-44: the save format, locked in. Every file in tests/fixtures/saves/ (written by
 * `tests/fixtures/make-saves.ts`, one set per version, never rewritten) must load, play
 * ten minutes, catch up a week away and round-trip unchanged. The schema check then takes
 * a played world apart one field at a time: each missing field must load with a default
 * or be refused with a SaveError, never load and crash a later step.
 */

const DIR = join(__dirname, '..', 'fixtures', 'saves');
const FIXTURES = readdirSync(DIR).filter((f) => f.endsWith('.json'));
const DAY = 24 * 3_600_000;

/**
 * Fields whose absence loads but crashes a later step, found by this check and left to the
 * save's owner (lane C) to default in `validateWorld`. Each runs as an expected failure, so
 * the fix turns it red here as a reminder to take it off the list.
 */
const KNOWN_GAPS = new Set(['nubbin.lessons']);

function play(world: World, ms: number, wallMs: number): void {
  for (let t = 0; t < ms; t += 100) stepWorld(world, 100, wallMs + t);
}

describe('fixture saves (TECH-44)', () => {
  it('has a fixture for the oldest and the current version', () => {
    const versions = FIXTURES.map((f) => Number(/^v(\d+)/.exec(f)?.[1]));
    expect(Math.min(...versions)).toBe(1);
    expect(versions.length).toBeGreaterThanOrEqual(3);
  });

  it.each(FIXTURES)(
    '%s loads, plays, catches up a week and round-trips',
    (file) => {
      const save = deserialize(readFileSync(join(DIR, file), 'utf8'));
      const wall = save.savedAtWallMs;
      play(save.world, 10 * 60_000, wall);
      catchUp(save.world, 7 * DAY, wall + 7 * DAY);
      // A load clears what belongs to the session that saved (walk targets, a held away
      // screen), so the first reload may differ; from then on a load must change nothing.
      const saved = serialize(save.world, wall + 7 * DAY);
      const once = serialize(deserialize(saved).world, wall + 7 * DAY);
      const again = serialize(deserialize(once).world, wall + 7 * DAY);
      expect(again).toBe(once);
    },
    30_000,
  ); // ten minutes of steps and a week of catch-up per fixture
});

/** Loads `edit`ed save JSON: 'refused' for a SaveError, else plays a minute and re-saves. */
function survives(json: string, edit: (raw: { world: Record<string, unknown> }) => void) {
  const raw = JSON.parse(json) as { savedAtWallMs: number; world: Record<string, unknown> };
  edit(raw);
  let world: World;
  try {
    world = deserialize(JSON.stringify(raw)).world;
  } catch (e) {
    if (e instanceof SaveError) return 'refused';
    throw e;
  }
  play(world, 60_000, raw.savedAtWallMs);
  deserialize(serialize(world, raw.savedAtWallMs + 60_000));
  return 'loaded';
}

describe('save schema: every field defaults or is refused (TECH-44)', () => {
  const played = readFileSync(
    join(DIR, FIXTURES.filter((f) => f.includes('played')).at(-1)!),
    'utf8',
  );
  const world = (JSON.parse(played) as { world: Record<string, unknown> }).world;

  const check = (name: string) => (KNOWN_GAPS.has(name) ? it.fails : it);

  for (const key of Object.keys(world)) {
    check(`world.${key}`)(`world.${key}`, () => {
      expect(() => survives(played, (raw) => delete raw.world[key])).not.toThrow();
    });
  }

  const nubbin = (world.nubbins as Record<string, unknown>[])[0]!;
  for (const key of Object.keys(nubbin)) {
    check(`nubbin.${key}`)(`nubbin.${key}`, () => {
      expect(() =>
        survives(played, (raw) => {
          delete (raw.world.nubbins as Record<string, unknown>[])[0]![key];
        }),
      ).not.toThrow();
    });
  }

  it('refuses a save without its core fields', () => {
    for (const key of ['nubbins', 'trees', 'keeper', 'timeMs']) {
      expect(survives(played, (raw) => delete raw.world[key])).toBe('refused');
    }
  });
});
