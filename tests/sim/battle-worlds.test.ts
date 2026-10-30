import { describe, expect, it } from 'vitest';
import { battleAct, bestAllyAction } from '../../src/sim/battle';
import { PLACEMENTS, placementOpen } from '../../src/sim/battle/contexts';
import { FRIENDLY_STICKER } from '../../src/sim/battle/friendly';
import { settleWorldBout, startWorldBout, worldBoutAct } from '../../src/sim/battle/world-bout';
import { hatch } from '../../src/sim/lifecycle';
import { encodeNubbin } from '../../src/sim/share';
import { freshLine } from '../../src/sim/side-saves';
import { STAT_KEYS, type SimEvent, type World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

function grove(count = 2): World {
  const w = createWorld(12, 0);
  const base = w.nubbins[0]!;
  while (w.nubbins.length < count)
    w.nubbins.push({ ...structuredClone(base), id: `nub-y${w.nubbins.length}` });
  for (const n of w.nubbins) {
    hatch(n, [], 0);
    for (const k of STAT_KEYS) n.stats[k].points = 2000;
  }
  return w;
}

describe('story-world bouts with copies (recs FIGHT-98, FIGHT-72)', () => {
  it('leaves the Grove deep-equal; the result goes only to the side save', () => {
    const w = grove();
    const before = JSON.stringify(w);
    const line = freshLine();
    const b = startWorldBout(w, {
      kind: 'world',
      world: 'arcade',
      line: 'PA1',
      key: 'invaders',
      tier: 1,
      ids: [w.nubbins[0]!.id],
      reward: 'pa1-badge',
    })!;
    expect(b.battle.sides[1][0]!.species).toBe('dinolet');
    for (let i = 0; i < 300 && !b.battle.result; i++)
      if (!worldBoutAct(b, bestAllyAction(b.battle))) worldBoutAct(b, { k: 'guard' });
    expect(b.battle.result).not.toBeNull();
    expect(settleWorldBout(b, line)).toBe(true);
    expect(settleWorldBout(b, line)).toBe(false);
    expect(JSON.stringify(w)).toBe(before);
    expect(Object.keys(line.flags).some((k) => k.startsWith('invaders:'))).toBe(true);
  });

  it('refuses a world bout through the Grove command', () => {
    const w = grove();
    applyCommand(
      w,
      {
        kind: 'battleStart',
        context: {
          kind: 'world',
          world: 'atlas',
          line: 'A1',
          key: 'k',
          tier: 1,
          ids: [w.nubbins[0]!.id],
        },
      },
      [],
    );
    expect(w.battle ?? null).toBeNull();
  });

  it('the placement map covers each place, and story bouts stay out of chapters 9–11', () => {
    const kinds = new Set(Object.values(PLACEMENTS).map((p) => p.kind));
    for (const k of ['dojo', 'circuit', 'encounter', 'story', 'world', 'friendly', 'tactics'])
      expect(kinds.has(k as never)).toBe(true);
    const w = grove();
    w.campaign = { chapter: 10 } as World['campaign'];
    expect(placementOpen(w, 'storyCampaign')).toBe(false);
    expect(placementOpen(w, 'dojo')).toBe(true);
    w.campaign!.chapter = 12;
    expect(placementOpen(w, 'storyCampaign')).toBe(true);
  });
});

describe('pass-and-play friendly bouts (recs FIGHT-96)', () => {
  it('a share-code team never writes the receiving world', () => {
    const friend = grove(3);
    const codes = friend.nubbins.map((n) => encodeNubbin(n));
    const w = grove(1);
    const nubbins = JSON.stringify(w.nubbins);
    const inventory = JSON.stringify(w.inventory);
    const events: SimEvent[] = [];
    applyCommand(
      w,
      {
        kind: 'battleStart',
        context: { kind: 'friendly', tier: 1, ids: [w.nubbins[0]!.id], guests: codes },
      },
      events,
    );
    const s = w.battle!;
    expect(s.passPlay?.choosing).toBe(0);
    expect(s.sides[1].every((c) => c.nubbinId === null)).toBe(true);
    // Keeper one picks, then Keeper two, then the turn resolves.
    for (let i = 0; i < 400 && !s.result; i++) {
      const before = s.turn;
      const ok = battleAct(structuredClone(s), { k: 'strike' });
      const action = ok ? ({ k: 'strike' } as const) : ({ k: 'guard' } as const);
      applyCommand(w, { kind: 'battleAct', action }, events);
      if (s.passPlay?.choosing === 1) expect(s.turn).toBe(before);
    }
    expect(s.result).not.toBeNull();
    expect(JSON.stringify(w.nubbins)).toBe(nubbins);
    expect(JSON.stringify(w.inventory)).toBe(inventory);
    expect(w.battleOnce?.keepsakes).toContain(FRIENDLY_STICKER);
  });
});
