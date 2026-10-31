import { describe, expect, it } from 'vitest';
import { noticeFace } from '../../src/render/notice';
import { PetBeats } from '../../src/render/pet-reactions';
import { soulLookKind, soulPose } from '../../src/render/soul-looks';
import { createWorld } from '../../src/sim/world';
import type { Nubbin, Personality } from '../../src/sim/types';

function nub(id: string, p: Personality | null, x: number): Nubbin {
  const n: Nubbin = structuredClone(createWorld(1, 0).nubbins[0]!);
  n.id = id;
  n.stage = p ? 'adult' : 'child';
  n.personality = p;
  n.pos = { x, z: 0 };
  n.behavior.state = 'sit';
  return n;
}

describe('lane A r9 looks', () => {
  it('walking the Keeper past four Nubbins: at least three acknowledge it within 1 s (R0533)', () => {
    const ns = [
      nub('a', 'cheerful', 0),
      nub('b', 'shy', 4),
      nub('c', 'mischievous', 8),
      nub('d', 'lazy', 12),
    ];
    ns[1]!.behavior.state = 'wander';
    ns[2]!.behavior.state = 'swim';
    const beats = new PetBeats();
    const firstNear = new Map<string, number>();
    const acked = new Map<string, number>();
    // The Keeper strolls along z = 2 at 4 units a second.
    for (let ms = 0; ms <= 5000; ms += 50) {
      const k = { x: -4 + (ms / 1000) * 4, z: 2 };
      beats.keeper = k;
      for (const n of ns) {
        if (Math.hypot(k.x - n.pos.x, k.z - n.pos.z) < 3 && !firstNear.has(n.id))
          firstNear.set(n.id, ms);
        const b = beats.frame(n, ms);
        if (b && ['wave', 'shyGlance', 'grin', 'handLift'].includes(b.kind) && !acked.has(n.id))
          acked.set(n.id, ms);
      }
    }
    const inTime = ns.filter((n) => {
      const a = acked.get(n.id);
      const f = firstNear.get(n.id);
      return a !== undefined && f !== undefined && a - f <= 1000;
    });
    expect(inTime.length).toBeGreaterThanOrEqual(3);
    // Each personality its own way.
    const kinds = new Set<string>();
    const again = new PetBeats();
    for (const n of ns) {
      again.keeper = { x: n.pos.x + 1, z: 0 };
      kinds.add(again.frame(n, 0)?.kind ?? '');
    }
    expect([...kinds].sort()).toEqual(['grin', 'handLift', 'shyGlance', 'wave']);
  });

  it('only once per approach: not again until 30 s apart (R0533)', () => {
    const n = nub('a', 'cheerful', 0);
    const beats = new PetBeats();
    beats.keeper = { x: 1, z: 0 };
    expect(beats.frame(n, 0)?.kind).toBe('wave');
    expect(beats.frame(n, 2000)).toBeNull();
    beats.keeper = { x: 20, z: 0 };
    beats.frame(n, 5000);
    beats.keeper = { x: 1, z: 0 };
    expect(beats.frame(n, 10_000)).toBeNull();
    beats.keeper = { x: 20, z: 0 };
    beats.frame(n, 20_000);
    beats.keeper = { x: 1, z: 0 };
    expect(beats.frame(n, 45_000)?.kind).toBe('wave');
  });

  it('a resting Nubbin is drawn facing the Keeper near it; a walking one is not', () => {
    const n = nub('a', 'cheerful', 0);
    n.facing = 0;
    expect(noticeFace(n, { x: 2, z: 0 })).toBeCloseTo(Math.PI / 2);
    expect(noticeFace(n, { x: 9, z: 0 })).toBeNull();
    n.behavior.state = 'wander';
    expect(noticeFace(n, { x: 2, z: 0 })).toBeNull();
    expect(n.facing).toBe(0);
  });

  it('trait quirks, the burp, the full belly and the peek have looks (R0528, R0546, R0543)', () => {
    const n = nub('a', 'cheerful', 0);
    const look = (state: Nubbin['behavior']['state'], itemId: string | null) => {
      n.behavior.state = state;
      n.behavior.itemId = itemId;
      n.behavior.target = null;
      return soulLookKind(n);
    };
    expect(look('sit', 'groomSelf')).toBe('groomSelf');
    expect(look('wander', 'hum')).toBe('hum');
    expect(look('perform', 'giggle')).toBe('giggleFit');
    expect(look('perform', 'burp')).toBe('burp');
    expect(look('perform', 'peekTree')).toBe('peek');
    n.behavior.sinceMs = 1000;
    n.fullUntilMs = 5000;
    expect(look('wander', null)).toBe('full');
    expect(soulPose('full', 0, 0, false).sw).toBeGreaterThan(1.1);
    // The peek hides first, then leans out.
    expect(soulPose('peek', 0, 0.1, false).clip).toBe('sit');
    expect(soulPose('peek', 650, 0.6, false).dx).toBeGreaterThan(0);
  });
});

describe('R0549 selected bubble', () => {
  it('the Nubbin with its sheet open has the big bubble', async () => {
    const { emoteFocused, setEmoteFocus } = await import('../../src/render/emote-size');
    setEmoteFocus('a');
    expect(emoteFocused('a')).toBe(true);
    expect(emoteFocused('b')).toBe(false);
    setEmoteFocus(null);
    expect(emoteFocused('a')).toBe(false);
  });
});

describe('R0551 picked up by personality', () => {
  it('a hug kicks, goes stiff, goes limp or just hugs; a shy one shows no heart', async () => {
    const { heldEmote, heldStyle } = await import('../../src/render/held-mood');
    const ps = ['cheerful', 'shy', 'lazy', 'mischievous'] as const;
    expect(ps.map((p) => heldStyle({ personality: p }, 'hug'))).toEqual([
      'kick',
      'stiff',
      'noodle',
      null,
    ]);
    expect(heldStyle({ personality: 'cheerful' }, 'flail')).toBeNull();
    const n = nub('a', 'shy', 0);
    n.behavior.state = 'held';
    n.needs.affection = 90;
    expect(heldEmote(n)).toBeNull();
    n.personality = 'cheerful';
    expect(heldEmote(n)).toBe('heart');
  });
});

describe('R0552 snores and chirps', () => {
  it('a nap near the Keeper snores now and then; nothing far off', async () => {
    const { SoulAmbient } = await import('../../src/ui/soul-ambient');
    const w = createWorld(1, 0);
    const n = w.nubbins[0]!;
    w.nubbins = [n];
    n.behavior.state = 'nap';
    w.keeper.pos = { x: n.pos.x + 2, z: n.pos.z };
    const amb = new SoulAmbient();
    expect(amb.tick(w, 0)).toBe('snore');
    expect(amb.tick(w, 1000)).toBeNull();
    expect(amb.tick(w, 4000)).toBe('snore');
    w.keeper.pos = { x: n.pos.x + 30, z: n.pos.z };
    expect(amb.tick(w, 9000)).toBeNull();
  });
});
