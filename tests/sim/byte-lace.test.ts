import { describe, expect, it } from 'vitest';
import { BYTE_LACE_BARKS } from '../../src/content/barks';
import { STORY } from '../../src/config/tuning';
import { byteLace, laceBark, laceVisitArrived, laceVisitSpot } from '../../src/sim/byte-lace';
import type { Npc, SimEvent } from '../../src/sim/types';
import { Rng } from '../../src/sim/rng';
import { c, campaignWorld } from './campaign-driver';

// R0366 (FUN-77): Byte's lace comes undone from Lantern Night, is tied every few days, and
// stays tied from chapter 12.

describe('Byte’s shoelace', () => {
  it('is tied before Lantern Night', () => {
    const { world } = campaignWorld();
    c(world).chapter = 3;
    expect(byteLace(world)).toBe('tied');
    c(world).chapter = 4;
    expect(byteLace(world)).toBe('tied');
  });

  it('toggles over a week of Grove days from chapter 4, and is kept tied in chapter 12', () => {
    const { world } = campaignWorld();
    const st = c(world);
    st.chapter = 4;
    st.seen.push('c4-close');
    const states: string[] = [];
    for (let day = 0; day < 7; day++) {
      world.timeMs = day * STORY.dayMs + 1000;
      states.push(byteLace(world));
    }
    expect(states).toContain('tied');
    expect(states).toContain('untied');
    // Tied one day, undone the next.
    const i = states.indexOf('tied');
    expect(states[i + 1]).toBe('untied');
    st.chapter = 12;
    for (let day = 0; day < 7; day++) {
      world.timeMs = day * STORY.dayMs + 1000;
      expect(byteLace(world)).toBe('kept');
    }
  });

  it('a tap on Byte talks about the lace sometimes, never before Lantern Night or in 9–11', () => {
    const { world } = campaignWorld();
    const st = c(world);
    const rng = new Rng(7);
    st.chapter = 3;
    for (let i = 0; i < 50; i++) expect(laceBark(world, rng)).toBeNull();
    st.chapter = 10;
    for (let i = 0; i < 50; i++) expect(laceBark(world, rng)).toBeNull();
    st.chapter = 12;
    const said = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const l = laceBark(world, rng);
      if (l) said.add(l);
    }
    expect(said.size).toBeGreaterThan(0);
    for (const l of said) expect(BYTE_LACE_BARKS.kept).toContain(l);
  });

  it('on a tie day Byte spends the morning beside Moss and says one lace line there', () => {
    const { world } = campaignWorld();
    const st = c(world);
    st.chapter = 5;
    st.seen.push('c4-close');
    const moss = world.nubbins[0]!;
    st.mossId = moss.id;
    const byte = { id: 'npc-byte', trainer: 'byte' } as Npc;
    let tieDay = 0;
    while (byteLace({ ...world, timeMs: tieDay * STORY.dayMs + 1 } as typeof world) !== 'tied')
      tieDay++;
    world.timeMs = tieDay * STORY.dayMs + 1000;
    expect(laceVisitSpot(world, byte)).not.toBeNull();
    const ev: SimEvent[] = [];
    expect(laceVisitArrived(world, byte, ev)).toBe(true);
    expect(laceVisitArrived(world, byte, ev)).toBe(true);
    expect(ev.filter((e) => e.kind === 'npcBark')).toHaveLength(1);
    // Late in the day, or on an undone day, he keeps to his own routine.
    world.timeMs = tieDay * STORY.dayMs + STORY.dayMs * 0.9;
    expect(laceVisitSpot(world, byte)).toBeNull();
    world.timeMs = (tieDay + 1) * STORY.dayMs + 1000;
    expect(laceVisitSpot(world, byte)).toBeNull();
    expect(laceVisitSpot(world, { ...byte, trainer: 'fern' })).toBeNull();
  });

  it('the first tap on an undone day always finds the lace', () => {
    const { world } = campaignWorld();
    const st = c(world);
    st.chapter = 6;
    st.seen.push('c4-close');
    let day = 0;
    while (byteLace({ ...world, timeMs: day * STORY.dayMs + 1 } as typeof world) !== 'untied')
      day++;
    world.timeMs = day * STORY.dayMs + 1000;
    const l = laceBark(world, new Rng(1));
    expect(BYTE_LACE_BARKS.untied).toContain(l);
  });
});
