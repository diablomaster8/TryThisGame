import { describe, expect, it } from 'vitest';
import { phaseAt } from '../../src/render/daylight';
import { landBeatFor, PetBeats, petBeatFor } from '../../src/render/pet-reactions';
import { soulLookKind } from '../../src/render/soul-looks';
import { clipFor, emoteFor } from '../../src/render/world-view';
import { poseFor } from '../../src/render3d/actors';
import { createWorld } from '../../src/sim/world';
import { dayPhase } from '../../src/sim/soul-idle';

describe('lane A r8 soul looks', () => {
  it('the sim phase and the daylight phase agree at every quarter hour (R0535)', () => {
    for (let h = 0; h < 24; h += 0.25) expect(dayPhase(h), String(h)).toBe(phaseAt(h).phase);
  });

  it('a sheltering Nubbin walks to its tree, then huddles: never the sleep pose (R0534)', () => {
    const n = createWorld(1, 0).nubbins[0]!;
    n.stage = 'child';
    n.behavior.state = 'shelter';
    n.behavior.target = { x: 1, z: 1 };
    expect(clipFor(n)).toBe('walk');
    expect(soulLookKind(n)).toBeNull();
    n.behavior.target = null;
    expect(clipFor(n)).toBe('sit');
    expect(poseFor(n, false, false)).toBe('sit');
    expect(soulLookKind(n)).toBe('huddle');
    const beat = new PetBeats().frame(n, 0);
    expect(beat?.pose3d).toBe('sit');
    expect(beat?.clip).toBe('sit');
  });

  it('a favourite and a disliked fruit play different beats (R0536)', () => {
    const n = createWorld(1, 0).nubbins[0]!;
    n.stage = 'child';
    const beats = new PetBeats();
    beats.queueKind(n.id, 'yum', 0);
    const yum = beats.frame(n, 700);
    beats.queueKind(n.id, 'bleh', 1000);
    const bleh = beats.frame(n, 1300);
    expect(yum?.kind).toBe('yum');
    expect(bleh?.kind).toBe('bleh');
    expect(yum?.pose3d).not.toBe(bleh?.pose3d);
    expect(yum?.clip).not.toBe(bleh?.clip);
  });

  it('a harrumph huffs; puddle stomps throw up their bursts, but not under reduced motion', () => {
    const n = createWorld(1, 0).nubbins[0]!;
    n.stage = 'adult';
    n.behavior.state = 'sit';
    n.behavior.itemId = 'harrumph';
    expect(emoteFor(n)).toBe('puff');
    n.behavior.state = 'perform';
    n.behavior.itemId = 'stomp';
    n.behavior.target = null;
    const beats = new PetBeats();
    expect(beats.frame(n, 0)?.fresh).toBe(true);
    expect(beats.frame(n, 100)?.fresh).toBe(false);
    expect(beats.frame(n, 700)?.fresh).toBe(true);
    beats.calm = true;
    expect(beats.frame(n, 1400)?.fresh).toBe(false);
  });
});

describe('R0551 handling by personality', () => {
  it('a pet plays four visibly different bodies for the four personalities', () => {
    const n = createWorld(1, 0).nubbins[0]!;
    n.stage = 'adult';
    const looks = new Set<string>();
    for (const p of ['cheerful', 'shy', 'mischievous', 'lazy'] as const) {
      n.personality = p;
      const beats = new PetBeats();
      beats.queueKind(n.id, petBeatFor, 0);
      const b = beats.frame(n, 400)!;
      looks.add(`${b.kind}:${b.clip}:${b.pose3d}:${b.sh.toFixed(2)}`);
    }
    expect(looks.size).toBe(4);
    n.personality = 'lazy';
    expect(landBeatFor(n)).toBe('flop');
  });
});
