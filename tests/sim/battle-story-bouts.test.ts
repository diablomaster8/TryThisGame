import { describe, expect, it } from 'vitest';
import { STORY_BOUTS, startGuardian } from '../../src/sim/battle/story-bouts';
import { onceOf } from '../../src/sim/battle/rewards';
import { hatch } from '../../src/sim/lifecycle';
import { freshCampaignState } from '../../src/sim/campaign';
import { STAT_KEYS, type SimEvent, type World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

function grove(chapter: number): World {
  const w = createWorld(17, 0);
  const base = w.nubbins[0]!;
  while (w.nubbins.length < 4)
    w.nubbins.push({ ...structuredClone(base), id: `nub-s${w.nubbins.length}` });
  for (const n of w.nubbins) {
    hatch(n, [], 0);
    for (const k of STAT_KEYS) n.stats[k].points = 2500;
  }
  w.campaign = freshCampaignState(0);
  w.campaign.chapter = chapter;
  return w;
}

describe('story battles (recs FIGHT-82)', () => {
  it('are offered only where they belong, never in chapters 9–11 but Corvin’s', () => {
    for (const ch of [9, 10, 11]) {
      const w = grove(ch);
      for (const id of ['exhibition', 'rumble', 'fort', 'logged', 'remembering'] as const)
        expect(STORY_BOUTS[id].open(w)).toBe(false);
    }
    expect(STORY_BOUTS.corvin.open(grove(9))).toBe(true);
    expect(STORY_BOUTS.corvin.open(grove(10))).toBe(false);
    expect(STORY_BOUTS.exhibition.open(grove(5))).toBe(true);
    expect(STORY_BOUTS.exhibition.open(grove(4))).toBe(false);
  });

  it('fight starts the bout, a win is remembered, skip starts nothing', () => {
    const w = grove(5);
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'storyBout', id: 'exhibition', fight: false }, events);
    expect(w.storyBouts?.exhibition).toBe('skip');
    expect(w.battle ?? null).toBeNull();
    applyCommand(w, { kind: 'storyBout', id: 'exhibition', fight: true }, events);
    expect(w.battle?.sides[1].length).toBe(3);
    applyCommand(w, { kind: 'battleAct', action: { k: 'debug', set: { op: 'win' } } }, events);
    expect(w.storyBouts?.exhibition).toBe('won');
  });

  it('every tactics story bout starts on its map; Corvin records the choice', () => {
    const w = grove(9);
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'storyBout', id: 'corvin', fight: true }, events);
    expect(w.tactics?.objective.kind).toBe('protectPlot');
    expect(w.storyBouts?.['corvin-choice']).toBe('fight');
    const w8 = grove(8);
    applyCommand(w8, { kind: 'storyBout', id: 'rumble', fight: true }, events);
    expect(w8.tactics?.objective.kind).toBe('reach');
    expect(w8.tactics?.units.filter((u) => u.c.side === 0 && !u.keeper).length).toBe(4);
    applyCommand(w8, { kind: 'tacticsForfeit' }, events);
    expect(events.some((e) => e.kind === 'tacticsEnd' && e.key === 'bs-rumble')).toBe(true);
  });
});

describe('the Hollow floor-5 guardian (recs FIGHT-72)', () => {
  it('starts only at depth 5, as a calmBoss, and pays its keepsake once on a win', () => {
    const w = grove(12);
    const events: SimEvent[] = [];
    expect(startGuardian(w, events, { depth: 4, key: 'g' })).toBe(false);
    expect(startGuardian(w, events, { depth: 5, key: 'g' })).toBe(true);
    const s = w.tactics!;
    expect(s.objective.kind).toBe('calmBoss');
    expect(s.context.kind === 'encounter' && s.context.source).toBe('guardian');
    // Settle it as a win: the calmed boss.
    s.units.find((u) => u.c.id === 'foe-0')!.c.calm = 100;
    applyCommand(w, { kind: 'tacticsAct', action: { k: 'wait', face: 'e' } }, events);
    expect(w.tactics?.result?.winner).toBe(0);
    expect(onceOf(w).keepsakes).toContain('guardian-lantern');
  });
});
