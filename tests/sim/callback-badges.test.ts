import { describe, expect, it } from 'vitest';
import { callbackBadges } from '../../src/sim/callback-badges';
import { freshLine, freshMultiverse } from '../../src/sim/side-saves';
import { createWorld } from '../../src/sim/world';

// R0361 (FUN-72): cross-world callback badges, adults only, read-only of the Grove.

function mvWith(): ReturnType<typeof freshMultiverse> {
  const mv = freshMultiverse();
  mv.lines.CA = { ...freshLine(), done: true };
  mv.lines.DB = { ...freshLine(), quests: { 'mv-db20': { step: 3, stage: 'finished' } } };
  mv.lines.UL = { ...freshLine(), quests: { 'mv-ul03': { step: 2, stage: 'finished' } } };
  return mv;
}

describe('cross-world callback badges', () => {
  it('finishing Cap and DB20 shows the badges for an adult save, without writing the Grove', () => {
    const w = createWorld(2, 0);
    w.settings.matureContent = 'adult';
    const before = JSON.stringify(w);
    expect(callbackBadges(mvWith(), w)).toEqual(['notRodent', 'notFish']);
    expect(JSON.stringify(w)).toBe(before);
  });

  it('Gerald needs UL03 finished and a Nubbin named Gerald', () => {
    const w = createWorld(2, 0);
    w.settings.matureContent = 'adult';
    w.nubbins[0]!.name = ' gerald ';
    expect(callbackBadges(mvWith(), w)).toContain('gerald');
    const mv = mvWith();
    mv.lines.UL = freshLine();
    expect(callbackBadges(mv, w)).not.toContain('gerald');
  });

  it('nothing below 18+, in the Learning Grove, or with no Multiverse save', () => {
    const w = createWorld(2, 0);
    w.settings.matureContent = 'teen';
    expect(callbackBadges(mvWith(), w)).toEqual([]);
    w.settings.matureContent = 'adult';
    expect(callbackBadges(null, w)).toEqual([]);
    expect(callbackBadges(freshMultiverse(), w)).toEqual([]);
  });
});
