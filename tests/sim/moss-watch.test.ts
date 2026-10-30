import { describe, expect, it } from 'vitest';
import { createWorld } from '../../src/sim/world';
import { mossReaction } from '../../src/ui/moss-watch';
import type { World } from '../../src/sim/types';

// R0353 (FUN-64): Moss's dry reactions to slapstick near him, from chapter 4.
function withMoss(chapter: number): { w: World; kid: string } {
  const w = createWorld(9, 0);
  const [moss, kid] = w.nubbins;
  moss!.stage = 'adult';
  kid!.stage = 'child';
  kid!.pos = { x: moss!.pos.x + 2, z: moss!.pos.z };
  w.campaign = { ...(w.campaign ?? {}), chapter, mossId: moss!.id } as World['campaign'];
  return { w, kid: kid!.id };
}

describe('R0353 Moss watches', () => {
  it('three bonks near Moss in chapter 4 get at least one reaction', () => {
    const { w, kid } = withMoss(4);
    const said: string[] = [];
    for (let i = 0; i < 3; i++) {
      w.timeMs += 4000;
      const r = mossReaction(w, { kind: 'bonked', nubbinId: kid, by: 'fruit' });
      if (r) said.push(r.line);
    }
    expect(said.length).toBeGreaterThanOrEqual(1);
  });

  it('a throw only ever gets a stern look; nothing before chapter 4', () => {
    const { w, kid } = withMoss(4);
    for (let i = 0; i < 6; i++) {
      w.timeMs += 4000;
      const r = mossReaction(w, { kind: 'thrown', nubbinId: kid });
      if (r) expect(r.line).toMatch(/stern/);
    }
    const early = withMoss(3);
    for (let i = 0; i < 6; i++) {
      early.w.timeMs += 4000;
      expect(
        mossReaction(early.w, { kind: 'bonked', nubbinId: early.kid, by: 'obstacle' }),
      ).toBeNull();
    }
  });
});
