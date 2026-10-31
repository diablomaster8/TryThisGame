import { describe, expect, it } from 'vitest';
import { CHAT, SIM } from '../../src/config/tuning';
import { chatEmote } from '../../src/render/chat-look';
import { MORPH_SPLIT, EmoteSprings, morphScale } from '../../src/render/emote-spring';
import { emoteMotion, familySign } from '../../src/render/emote-mood';
import { emoteFor } from '../../src/render/world-view';
import { setAnticsLive } from '../../src/sim/antics';
import { chatBeat, parseChat, startChat } from '../../src/sim/chat';
import { hatch } from '../../src/sim/lifecycle';
import { speciesByFamily } from '../../src/sim/species';
import type { BehaviorState, Nubbin, SimEvent, World } from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

function pair(): { world: World; a: Nubbin; b: Nubbin } {
  const world = createWorld(3, 0);
  for (const n of world.nubbins) {
    hatch(n, [], 0);
    n.stage = 'adult';
    n.needs.hunger = 1;
    n.needs.energy = 1;
    n.needs.happiness = 20;
  }
  const [a, b] = world.nubbins as [Nubbin, Nubbin];
  world.nubbins = [a, b];
  a.pos = { x: 0, z: 0 };
  b.pos = { x: 3, z: 0 };
  a.friends = { [b.id]: 80 };
  b.friends = { [a.id]: 80 };
  b.behavior.state = 'sit';
  b.behavior.untilMs = 1e9;
  world.timeMs = 10_000;
  return { world, a, b };
}

describe('friend chat (R0540)', () => {
  it('meets face to face and trades picture bubbles, turn about, ending in a hug', () => {
    setAnticsLive(true);
    const { world, a, b } = pair();
    expect(startChat(world, a, b, world.timeMs)).toBe(true);
    const events: SimEvent[] = [];
    let talking = false;
    const shown: string[] = [];
    for (let i = 0; i < 120 && !(talking && a.behavior.state !== 'greet'); i++) {
      a.needs.hunger = b.needs.hunger = 1;
      events.push(...stepWorld(world, SIM.stepMs));
      if (parseChat(a.behavior.itemId)?.phase === 't') {
        if (!talking) {
          talking = true;
          const d = Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z);
          expect(d).toBeLessThan(CHAT.gap + 0.3);
        }
        const sa = chatEmote(a, world.timeMs);
        const sb = chatEmote(b, world.timeMs);
        shown.push(`${sa ?? '-'}/${sb ?? '-'}`);
      }
    }
    expect(talking).toBe(true);
    const turns = events.filter((e) => e.kind === 'chatTurn');
    expect(turns.map((e) => (e as { nubbinId: string }).nubbinId)).toEqual([
      a.id,
      b.id,
      a.id,
      b.id,
    ]);
    // A speaks while B listens, then the other way round; both hug at the end.
    expect(shown.some((s) => s.endsWith('/-') && !s.startsWith('-'))).toBe(true);
    expect(shown.some((s) => s.startsWith('-/'))).toBe(true);
    expect(shown).toContain('heart/heart');
  });

  it('never starts while catching up on time away', () => {
    const { world, a, b } = pair();
    setAnticsLive(false);
    expect(startChat(world, a, b, world.timeMs)).toBe(false);
    setAnticsLive(true);
  });

  it('calls the talk off when the friend is picked up', () => {
    setAnticsLive(true);
    const { world, a, b } = pair();
    startChat(world, a, b, world.timeMs);
    b.behavior.state = 'held';
    stepWorld(world, SIM.stepMs);
    expect(chatBeat(a, world.timeMs)).toBeNull();
  });
});

describe('emote ball (R0548)', () => {
  it('shows a shape for every behaviour state of a content Chao', () => {
    const { world, a } = pair();
    a.species = 'chao';
    const states: BehaviorState[] = [
      'wander',
      'findFood',
      'eat',
      'nap',
      'sit',
      'play',
      'greet',
      'cry',
      'swim',
      'react',
      'pet',
      'avoid',
      'lesson',
      'perform',
      'shelter',
      'court',
      'fetch',
    ];
    for (const s of states) {
      a.behavior.state = s;
      a.behavior.itemId = null;
      expect(emoteFor(a, world), s).not.toBe('none');
    }
  });

  it('gives the pocket and digital families their own little content sign', () => {
    const { world, a } = pair();
    a.species = speciesByFamily('pocket')[0]!.id;
    const seen = new Set<string>();
    for (let t = 0; t < 10_000; t += 100) seen.add(String(familySign(a, t)));
    expect([...seen].some((x) => x === 'pspark' || x === 'dblink')).toBe(true);
    expect(seen.has('null')).toBe(true);
    void world;
  });

  it('morphs: the old shape squashes flat, then the new one pops past full size', () => {
    expect(morphScale(MORPH_SPLIT * 0.9).sy).toBeLessThan(0.5);
    expect(morphScale(0.8).sy).toBeGreaterThan(1);
    const s = new EmoteSprings();
    s.step('a', 0, 0, 0, 'ball', 0, 0.25, 0, null, true);
    expect(s.step('a', 0, 0, 0, 'heart', 1000, 0.25, 0, null, true).shape).toBe('ball');
    expect(s.step('a', 0, 0, 0, 'heart', 1100, 0.25, 0, null, true).shape).toBe('heart');
    // Reduced motion (no morph): the new shape at once.
    const r = new EmoteSprings();
    r.step('a', 0, 0, 0, 'ball', 0, 0.25, 0, null, false);
    expect(r.step('a', 0, 0, 0, 'heart', 1000, 0.25, 0, null, false).shape).toBe('heart');
  });

  it('bobs fast when happy and droops when sad', () => {
    const { a } = pair();
    a.needs.happiness = 80;
    const happy = { ...emoteMotion(a, 100, false) };
    a.needs.happiness = -60;
    const sad = { ...emoteMotion(a, 100, false) };
    expect(happy.flipMs).toBeLessThan(sad.flipMs);
    expect(sad.dy).toBeLessThan(0);
  });
});
