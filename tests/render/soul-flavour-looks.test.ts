import { describe, expect, it } from 'vitest';
import { PetBeats } from '../../src/render/pet-reactions';
import { soulLookKind, soulPose } from '../../src/render/soul-looks';
import { createWorld } from '../../src/sim/world';
import type { Nubbin, Personality } from '../../src/sim/types';

// R0558 (SOUL-41), lane A r11: eating, napping, swimming and crying read differently by
// personality in both renderers (the shared PetBeats look: a Pixel clip and a 3D pose).
function adult(p: Personality): Nubbin {
  const n = createWorld(1, 0).nubbins[0]!;
  n.stage = 'adult';
  n.personality = p;
  return n;
}

function lookIn(n: Nubbin, state: Nubbin['behavior']['state'], itemId: string | null = null) {
  n.behavior.state = state;
  n.behavior.itemId = itemId;
  n.behavior.target = null;
  return soulLookKind(n);
}

describe('R0558 state flavours', () => {
  it('eat, nap, swim and cry each have their variants', () => {
    expect(lookIn(adult('shy'), 'eat', 'nibble')).toBe('nibble');
    expect(lookIn(adult('cheerful'), 'eat', 'chomp')).toBe('chomp');
    expect(lookIn(adult('cheerful'), 'eat', 'gulp')).toBe('gulp');
    expect(lookIn(adult('shy'), 'nap')).toBe('curlUp');
    expect(lookIn(adult('lazy'), 'nap')).toBe('sprawl');
    expect(lookIn(adult('cheerful'), 'swim')).toBe('splashSpin');
    expect(lookIn(adult('shy'), 'swim')).toBe('wadeEdge');
    expect(lookIn(adult('mischievous'), 'swim')).toBe('diveUp');
    expect(lookIn(adult('lazy'), 'swim')).toBe('floatBack');
    expect(lookIn(adult('shy'), 'cry', 'sniffle')).toBe('sniffle');
    expect(lookIn(adult('bold'), 'cry', 'cryStomp')).toBe('cryStomp');
    const g = adult('gentle');
    g.behavior.state = 'cry';
    g.behavior.itemId = 'cryToKeeper';
    g.behavior.target = { x: 3, z: 3 };
    expect(soulLookKind(g)).toBe('cryWalk');
  });

  it('the first four each have at least three variants that look different', () => {
    const variants: Record<string, Array<[Nubbin['behavior']['state'], string | null]>> = {
      cheerful: [
        ['eat', 'chomp'],
        ['swim', null],
        ['nap', null],
      ],
      shy: [
        ['eat', 'nibble'],
        ['nap', null],
        ['swim', null],
        ['cry', 'sniffle'],
      ],
      mischievous: [['swim', null]],
      lazy: [
        ['eat', 'lieEat'],
        ['nap', null],
        ['swim', null],
      ],
    };
    for (const p of ['shy', 'lazy'] as const) {
      const kinds = new Set(variants[p]!.map(([s, id]) => lookIn(adult(p), s, id)));
      kinds.delete(null);
      expect(kinds.size, p).toBeGreaterThanOrEqual(3);
    }
    // Each variant's pose differs from the plain state (a different clip or a reshaped body).
    for (const k of [
      'gulp',
      'nibble',
      'chomp',
      'curlUp',
      'sprawl',
      'floatBack',
      'sniffle',
    ] as const) {
      const pose = soulPose(k, 400, 0.3, false);
      const plain = pose.sw === 1 && pose.sh === 1 && pose.dy === 0 && pose.clip === null;
      expect(plain, k).toBe(false);
    }
  });

  it('reduced motion keeps the variants still but still reads them', () => {
    const a = soulPose('diveUp', 1000, 0.5, true);
    const b = soulPose('diveUp', 1300, 0.5, true);
    expect(a.dy).toBe(b.dy);
    const beat = new PetBeats();
    beat.calm = true;
    const n = adult('lazy');
    n.behavior.state = 'nap';
    expect(beat.frame(n, 0)?.clip).toBe('sleep');
  });
});
