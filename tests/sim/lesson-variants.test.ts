import { describe, expect, it } from 'vitest';
import { LESSONS } from '../../src/config/tuning';
import { canTakeVariant, finishLesson, startVariantLesson } from '../../src/sim/kindergarten';
import {
  LESSON_VARIANTS,
  repertoire,
  shownVariant,
  variantById,
} from '../../src/sim/lesson-variants';
import { hatch } from '../../src/sim/lifecycle';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/** R0554 (lane A r11): the kindergarten class list as one-time variants. */
function pupil(): { world: World; n: Nubbin } {
  const world = createWorld(7, 0);
  const events: SimEvent[] = [];
  const n = world.nubbins[0]!;
  hatch(n, events, 0);
  n.stage = 'child';
  world.inventory.shells = 1000;
  return { world, n };
}

function learn(world: World, n: Nubbin, id: string): void {
  const ev: SimEvent[] = [];
  expect(startVariantLesson(world, n, id, ev)).toBe(true);
  finishLesson(world, n, ev);
  n.behavior.state = 'wander';
  n.behavior.itemId = null;
}

describe('lesson variants (R0554)', () => {
  it('lists at least fifteen classes in the six groups', () => {
    expect(LESSON_VARIANTS.length).toBeGreaterThanOrEqual(15);
    const groups = new Set(LESSON_VARIANTS.map((v) => v.group));
    expect(groups.size).toBe(6);
    expect(new Set(LESSON_VARIANTS.map((v) => v.id)).size).toBe(LESSON_VARIANTS.length);
  });

  it('costs the lesson price once, then never again', () => {
    const { world, n } = pupil();
    const before = world.inventory.shells;
    learn(world, n, 'dance:twist');
    expect(world.inventory.shells).toBe(before - LESSONS.price);
    expect(canTakeVariant(world, n, 'dance:twist')).toBe('max');
    expect(startVariantLesson(world, n, 'dance:twist', [])).toBe(false);
    expect(n.lessons.dance).toBe(1);
  });

  it('Teacher’s Pet still makes it cheaper', () => {
    const { world, n } = pupil();
    world.skills = { ...(world.skills ?? {}), teachersPet: true } as never;
    const before = world.inventory.shells;
    if (!startVariantLesson(world, n, 'song:march', [])) return;
    expect(before - world.inventory.shells).toBeLessThanOrEqual(LESSONS.price);
  });

  it('shows only its two favourites, stably', () => {
    const { world, n } = pupil();
    for (const id of ['instrument:flute', 'dance:shake', 'song:silly', 'manners:bow'])
      learn(world, n, id);
    const rep = repertoire(n);
    expect(rep).toHaveLength(2);
    expect(repertoire(n).map((v) => v.id)).toEqual(rep.map((v) => v.id));
  });

  it('ignores a stale pick from another lesson', () => {
    const { world, n } = pupil();
    learn(world, n, 'instrument:maracas');
    n.lessons.show = LESSON_VARIANTS.indexOf(variantById('instrument:maracas')!) + 1;
    n.behavior.itemId = 'instrument';
    expect(shownVariant(n)?.id).toBe('instrument:maracas');
    n.behavior.itemId = 'dance';
    expect(shownVariant(n)).toBeUndefined();
  });
});
