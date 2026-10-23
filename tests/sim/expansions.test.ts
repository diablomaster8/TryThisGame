import { describe, expect, it } from 'vitest';
import { EXPANSION_E1, EXPANSION_E1_VARIANTS } from '../../src/content/expansion-e1';
import { EXPANSION_E2, EXPANSION_E2_VARIANTS } from '../../src/content/expansion-e2';
import { EXPANSION_E3, EXPANSION_E3_VARIANTS } from '../../src/content/expansion-e3';
import { SPEAKERS } from '../../src/config/story';
import { EXPANSIONS, STORY, TOWN } from '../../src/config/tuning';
import { lifespanMs } from '../../src/sim/slips';
import { debugE2Day, EXPANSION_RULES } from '../../src/sim/side-rules-expansions';
import { sideActable } from '../../src/sim/side-stories';
import { addRecruit } from '../../src/sim/town';
import type { CampaignState, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';
import { c, moss, playScenes, runCampaign, sable, tick } from './campaign-driver';

/** A Grove just past the Hazel's Grove ending with Corvin reconciled. */
function postGame(): { world: World; events: SimEvent[] } {
  const { world, events } = runCampaign(
    { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'confront', 'c12-open': 'free' },
    {
      7: (w) => {
        sable(w)!.trust = 80;
        sable(w)!.bond = true;
      },
      9: (w) => (moss(w)!.needs.affection = 80),
    },
  );
  expect(c(world).ending).toBe('hazels-grove');
  // The first post-game morning.
  tick(world, events, STORY.dayMs / 1000 + 2);
  return { world, events };
}

/** Tick and answer scenes until `done` holds or the guard runs out. */
function settle(world: World, events: SimEvent[], done: () => boolean, passes = 30): void {
  for (let i = 0; i < passes && !done(); i++) {
    tick(world, events, 1.1);
    playScenes(world, events);
  }
}

describe('expansion scripts', () => {
  it('have unique scene ids, declared speakers and phone-length lines', () => {
    const ids = new Set<string>();
    for (const [quests, variants] of [
      [EXPANSION_E1, EXPANSION_E1_VARIANTS],
      [EXPANSION_E2, EXPANSION_E2_VARIANTS],
      [EXPANSION_E3, EXPANSION_E3_VARIANTS],
    ] as const) {
      for (const q of quests) {
        const declared = new Set([...Object.keys(SPEAKERS), ...q.speakers.map((s) => s.id)]);
        const scenes = [
          ...q.steps.flatMap((s) => [s.scene, ...(s.done ? [s.done] : [])]),
          q.complete,
          ...variants,
        ];
        for (const s of scenes) {
          expect(ids.has(s.id), s.id).toBe(false);
          ids.add(s.id);
          for (const l of [...s.lines, ...(s.choices ?? []).flatMap((ch) => ch.then ?? [])]) {
            expect(l.text.length, `${s.id}: ${l.text}`).toBeLessThanOrEqual(160);
            expect(declared.has(l.who), `${s.id}: ${l.who}`).toBe(true);
          }
        }
      }
    }
  });
});

describe('E1 The Square', () => {
  it('opens after the ending and follows prosperity to the festival, with Corvin on the step', () => {
    const { world, events } = postGame();
    settle(world, events, () => c(world).side.e1 !== undefined);
    expect(c(world).side.e1?.status).toBe('open');
    settle(world, events, () => c(world).seen.includes('e1-letter'));
    // The first step is the player's walk; the rest belong to the town.
    expect(sideActable(world, c(world), 'e1')).toBe(true);
    applyCommand(world, { kind: 'sideAct', story: 'e1' }, events);
    settle(world, events, () => c(world).seen.includes('e1-first'));
    expect(sideActable(world, c(world), 'e1')).toBe(false);
    addRecruit(world, 'Bramble', 'puffbud', events);
    settle(world, events, () => c(world).seen.includes('e1-stall'));
    for (let i = 0; i < 8; i++) addRecruit(world, `R${i}`, 'puffbud', events);
    expect(world.town.prosperity).toBeGreaterThanOrEqual(TOWN.unlocks.festival);
    settle(world, events, () => c(world).side.e1?.status === 'done', 80);
    const seen = c(world).seen;
    expect(seen).toContain('e1-attendant-corvin');
    expect(seen).not.toContain('e1-attendant-done');
    expect(world.npcs.some((n) => n.trainer === 'corvin')).toBe(true);
    expect(world.town.recruits.some((r) => r.name === 'Corvin')).toBe(true);
    expect(seen).toContain('e1-complete');
    expect(c(world).flags.e1Done).toBe(true);
    expect(world.inventory.keepsakes).toContain('square-warden');
  });
});

describe('E2 Nova’s Season', () => {
  function toDayEleven(world: World, events: SimEvent[]): void {
    settle(world, events, () => c(world).side.e2 !== undefined, 60);
    settle(world, events, () => c(world).seen.includes('e2-egg'), 60);
    const id = c(world).flags['e2-nubbin'];
    expect(typeof id).toBe('string');
    const dandy = world.nubbins.find((n) => n.id === id)!;
    expect(dandy.spanScale).toBe(EXPANSIONS.novaSpanScale);
    expect(lifespanMs(dandy)).toBeGreaterThan(lifespanMs(world.nubbins[0]!) * 2);
    applyCommand(world, { kind: 'debugHatchNow', nubbinId: dandy.id }, events);
    settle(world, events, () => c(world).seen.includes('e2-egg-done'), 60);
    expect(c(world).side.e2?.step).toBe(1);
    // Day four waits for the clock.
    settle(world, events, () => c(world).seen.includes('e2-day4'), 5);
    expect(c(world).seen).not.toContain('e2-day4');
    debugE2Day(world, c(world), EXPANSIONS.novaDays[0], events);
    settle(world, events, () => c(world).seen.includes('e2-day4'), 10);
    applyCommand(world, { kind: 'pet', nubbinId: dandy.id }, events);
    debugE2Day(world, c(world), EXPANSIONS.novaDays[1], events);
    settle(world, events, () => c(world).seen.includes('e2-day8'), 10);
    applyCommand(world, { kind: 'feed', nubbinId: dandy.id }, events);
    debugE2Day(world, c(world), EXPANSIONS.novaDays[2], events);
    settle(world, events, () => c(world).seen.includes('e2-day11'), 10);
    tick(world, events, STORY.dayMs / 1000);
    settle(world, events, () => c(world).side.e2?.step === 4, 10);
    expect(c(world).side.e2?.step).toBe(4);
  }

  it('runs twelve days to a departure and the flower', () => {
    const { world, events } = postGame();
    toDayEleven(world, events);
    const id = c(world).flags['e2-nubbin'] as string;
    const dandy = world.nubbins.find((n) => n.id === id)!;
    world.nubbins = world.nubbins.filter((n) => n.id !== id);
    world.memorials.push({ id: 'm-dandy', name: dandy.name, pos: { x: 0, z: 0 } });
    settle(world, events, () => c(world).side.e2?.status === 'done', 20);
    expect(c(world).flags['e2-outcome']).toBe('departed');
    expect(c(world).seen).toContain('e2-complete-departed');
    expect(c(world).seen).not.toContain('e2-complete-reborn');
    expect(c(world).flags.e2Done).toBe(true);
  });

  it('runs twelve days to a rebirth', () => {
    const { world, events } = postGame();
    toDayEleven(world, events);
    const id = c(world).flags['e2-nubbin'] as string;
    const dandy = world.nubbins.find((n) => n.id === id)!;
    dandy.stage = 'egg';
    dandy.rebirths = 1;
    settle(world, events, () => c(world).side.e2?.status === 'done', 20);
    expect(c(world).flags['e2-outcome']).toBe('reborn');
    expect(c(world).seen).toContain('e2-complete-reborn');
  });
});

describe('E3 The Twine', () => {
  it('teaches the merge through a stray and ends with the bracket', () => {
    const { world, events } = postGame();
    settle(world, events, () => c(world).side.e3 !== undefined, 60);
    settle(world, events, () => c(world).seen.includes('e3-strays'), 60);
    expect(sideActable(world, c(world), 'e3')).toBe(false);
    c(world).flags['n:strayFed'] = 1;
    settle(world, events, () => c(world).seen.includes('e3-pair'), 20);
    const grown = world.nubbins.filter((n) => n.stage !== 'egg').slice(0, 2);
    expect(grown.length).toBe(2);
    for (const n of grown) {
      n.stage = 'adult';
      n.needs.affection = 90;
    }
    applyCommand(world, { kind: 'setPartner', slot: 0, nubbinId: grown[0]!.id }, events);
    applyCommand(world, { kind: 'setPartner', slot: 1, nubbinId: grown[1]!.id }, events);
    settle(world, events, () => c(world).seen.includes('e3-twine'), 20);
    world.inventory.twine = 1;
    settle(world, events, () => c(world).seen.includes('e3-merge'), 20);
    applyCommand(world, { kind: 'merge' }, events);
    expect(world.merge).not.toBeNull();
    settle(world, events, () => c(world).seen.includes('e3-tournament'), 20);
    expect(typeof c(world).flags['e3-wins-at']).toBe('number');
    // The first merge has run out by now: tie the twine again for the final rounds.
    world.inventory.twine = 1;
    applyCommand(world, { kind: 'merge' }, events);
    expect(world.merge).not.toBeNull();
    for (let i = 0; i < EXPANSIONS.tournamentWins; i++) {
      applyCommand(
        world,
        { kind: 'karateResult', nubbinId: grown[0]!.id, won: true, tier: 1, shells: 0 },
        events,
      );
      tick(world, events, 0.2);
    }
    settle(world, events, () => c(world).side.e3?.status === 'done', 30);
    expect(c(world).seen).toContain('e3-tournament-done-merged');
    expect(c(world).flags.e3Done).toBe(true);
  });
});

describe('expansion answer variants', () => {
  it('play the slow E1 ending and the short E2 endings only for those answers', () => {
    const [e1, e2] = EXPANSION_RULES;
    const world = createWorld(11, 0);
    const camp = { flags: {} } as unknown as CampaignState;
    camp.flags['e1-hazel'] = 'slow';
    expect(e1!.variant!(world, camp, 'e1-complete')).toBe('e1-complete-slow');
    camp.flags['e1-hazel'] = 'held';
    expect(e1!.variant!(world, camp, 'e1-complete')).toBe('e1-complete');
    camp.flags['e2-answer'] = 'short';
    camp.flags['e2-outcome'] = 'departed';
    expect(e2!.variant!(world, camp, 'e2-complete-reborn')).toBe('e2-complete-departed-short');
    camp.flags['e2-answer'] = 'enough';
    expect(e2!.variant!(world, camp, 'e2-complete-reborn')).toBe('e2-complete-departed');
  });

  it('play the wobbling E3 merge only when you picked the two strongest', () => {
    const e3 = EXPANSION_RULES[2]!;
    const world = createWorld(11, 0);
    const camp = { flags: {} } as unknown as CampaignState;
    expect(EXPANSION_E3_VARIANTS.map((s) => s.id)).toContain('e3-merge-done-strong');
    camp.flags['e3-pick'] = 'strong';
    expect(e3.variant!(world, camp, 'e3-merge-done')).toBe('e3-merge-done-strong');
    camp.flags['e3-pick'] = 'wait';
    expect(e3.variant!(world, camp, 'e3-merge-done')).toBe('e3-merge-done');
    camp.flags['e3-merged-win'] = true;
    expect(e3.variant!(world, camp, 'e3-tournament-done')).toBe('e3-tournament-done-merged');
  });
});
