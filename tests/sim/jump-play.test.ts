/**
 * What a jump does in the Grove (R0026, MOVE-26): a leapfrog over a sitting Nubbin makes it
 * giggle once per cooldown; a jump into a fruit tree's trunk shakes it.
 */
import { describe, expect, it } from 'vitest';
import { GROVE } from '../../src/config/tuning';
import { JUMP_PLAY } from '../../src/config/tuning-move';
import { keeperFooting, updateKeeper } from '../../src/sim/keeper';
import { applyCommand, createWorld } from '../../src/sim/world';
import type { SimEvent, Vec2, World } from '../../src/sim/types';

const SUB = 1000 / 60;

function standAt(w: World, p: Vec2): void {
  w.keeper.pos = { ...p };
  w.keeper.y = keeperFooting(w, p.x, p.z).y;
  w.keeper.vy = 0;
  w.keeper.grounded = true;
}

/** Jump in place at `p` and land; the events on the way. */
function hopAt(w: World, p: Vec2, advanceMs: number): SimEvent[] {
  w.timeMs += advanceMs;
  standAt(w, p);
  const ev: SimEvent[] = [];
  applyCommand(w, { kind: 'jump', down: true }, ev);
  for (let i = 0; i < 120 && (i === 0 || !w.keeper.grounded); i++) updateKeeper(w, SUB, ev);
  return ev;
}

describe('jump play (MOVE-26)', () => {
  it('a leapfrog over a sitting Nubbin giggles once per cooldown', () => {
    const w = createWorld(1, 0);
    const n = w.nubbins[0]!;
    w.nubbins = [n];
    n.stage = 'child';
    const spot = { ...GROVE.keeperStart };
    n.pos = { ...spot };
    const giggles = (ev: SimEvent[]) =>
      ev.filter((e) => e.kind === 'reaction' && e.nubbinId === n.id && e.reaction === 'love')
        .length;
    n.behavior.state = 'sit';
    const h0 = n.needs.happiness;
    expect(giggles(hopAt(w, spot, 0))).toBe(1);
    expect(n.needs.happiness).toBeGreaterThan(h0);
    n.behavior.state = 'sit';
    expect(giggles(hopAt(w, spot, 1000))).toBe(0);
    n.behavior.state = 'sit';
    expect(giggles(hopAt(w, spot, JUMP_PLAY.leapCooldownMs))).toBe(1);
  });

  it('a jump into a fruit tree trunk shakes it', () => {
    const w = createWorld(1, 0);
    w.nubbins = [];
    const t = w.trees[0]!;
    const ev = hopAt(w, { x: t.pos.x + 0.8, z: t.pos.z }, 0);
    expect(ev.filter((e) => e.kind === 'treeShaken' && e.treeId === t.id)).toHaveLength(1);
  });
});
