import { describe, expect, it } from 'vitest';
import { PERFORM } from '../../src/config/tuning';
import { performClip, performLook } from '../../src/render/perform-look';
import { setAnticsLive } from '../../src/sim/antics';
import { hatch } from '../../src/sim/lifecycle';
import { doodleAlpha, notePerformStart } from '../../src/sim/perform';
import type { LessonId, Nubbin, SimEvent, World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/** R0525 (lane A r10): the four lessons perform differently, and drawings leave doodles. */
function performer(lesson: LessonId, level = 1): { world: World; n: Nubbin } {
  const world = createWorld(11, 0);
  const n = world.nubbins[0]!;
  hatch(n, [], 0);
  n.stage = 'child';
  n.lessons = { [lesson]: level };
  world.timeMs = 5000;
  n.behavior.state = 'perform';
  n.behavior.sinceMs = world.timeMs;
  n.behavior.untilMs = world.timeMs + 4000;
  n.behavior.itemId = lesson;
  return { world, n };
}

describe('lesson performances (R0525)', () => {
  it('tells the four apart by clip, prop and notes', () => {
    const sig = (['drawing', 'singing', 'dance', 'instrument'] as const).map((l) => {
      const { n } = performer(l);
      const look = performLook(n, 5600, false)!;
      return `${look.clip}|${look.prop ?? '-'}|${look.notes}|${performClip(n)}`;
    });
    expect(new Set(sig).size).toBe(4);
  });

  it('dances a different style at each level', () => {
    const styles = [1, 2, 3].map((lv) => {
      const { n } = performer('dance', lv);
      const samples = [100, 250, 400, 650].map((t) => ({ ...performLook(n, 5000 + t, false)! }));
      return {
        turns: samples.some((s) => Math.abs(s.turn) > 0.3),
        squashes: samples.some((s) => s.sh < 0.9),
        spins: samples.some((s) => s.turn > Math.PI),
      };
    });
    expect(styles[0]).toMatchObject({ turns: true, squashes: false, spins: false });
    expect(styles[1]).toMatchObject({ turns: false, squashes: true });
    expect(styles[2]).toMatchObject({ spins: true });
  });

  it('keeps reduced motion still: no spin, no hop', () => {
    const { n } = performer('dance', 3);
    for (const t of [100, 300, 500]) {
      const look = performLook(n, 5000 + t, true)!;
      expect(look.turn).toBe(0);
      expect(look.dy).toBe(0);
    }
  });

  it('leaves a doodle that draws in and fades after ten minutes', () => {
    setAnticsLive(true);
    const { world, n } = performer('drawing');
    world.location = 'grove';
    const events: SimEvent[] = [];
    notePerformStart(world, n, events);
    expect(events.some((e) => e.kind === 'performStart' && e.lesson === 'drawing')).toBe(true);
    const d = world.doodles![0]!;
    expect(d.kind).toBeGreaterThanOrEqual(0);
    expect(d.kind).toBeLessThan(PERFORM.doodleKinds);
    expect(doodleAlpha(d, d.atMs + 1000)).toBeGreaterThan(0);
    expect(doodleAlpha(d, d.atMs + 5 * 60_000)).toBe(1);
    expect(doodleAlpha(d, d.atMs + 9.5 * 60_000)).toBeLessThan(0.5);
    expect(doodleAlpha(d, d.atMs + PERFORM.doodleMs)).toBe(0);
    for (let i = 0; i < 12; i++) {
      world.timeMs += 1000;
      notePerformStart(world, n, events);
    }
    expect(world.doodles!.length).toBe(PERFORM.doodleMax);
  });

  it('draws nothing and stays quiet while catching up', () => {
    const { world, n } = performer('drawing');
    world.location = 'grove';
    const events: SimEvent[] = [];
    setAnticsLive(false);
    notePerformStart(world, n, events);
    setAnticsLive(true);
    expect(events).toHaveLength(0);
    expect(world.doodles ?? []).toHaveLength(0);
  });
});
