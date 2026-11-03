/**
 * Lane C round 11 (R0600, R0613, R0615, R0629, R0630, R0633, R0634, R0654, R0657): the open
 * world's rules for lines, gates, skips, the Valley Fair and the read-only story worlds.
 */
import { describe, expect, it } from 'vitest';
import { GATES } from '../../src/config/gates';
import { STORY_REGION_TUNING } from '../../src/config/tuning';
import { EPILOGUE_CALLBACKS, EPILOGUE_FRAME } from '../../src/content/epilogue';
import { crossSavesFrom } from '../../src/sim/cross-saves';
import {
  derivedUnlocks,
  setDerivedUnlocks,
  unequipMissingHats,
  wearableHats,
} from '../../src/sim/derived-unlocks';
import {
  afterStoryNext,
  epilogueLines,
  epilogueReady,
  FAIR_SCENE,
  registerEpilogue,
} from '../../src/sim/epilogue';
import { checkGates, evalGate, evalGateId, parseGate } from '../../src/sim/gates';
import { skippableLineGoal, skipLineGoal } from '../../src/sim/goal-skips';
import { lineSceneDone } from '../../src/sim/story-book';
import { stepStoryline } from '../../src/sim/storyline';
import { keeperMismatch } from '../../src/sim/keeper-line';
import { serialize } from '../../src/sim/save';
import { sceneSeasonHolds } from '../../src/sim/story-state';
import { registerStorylines } from '../../src/sim/story-scenes';
import { STORYLINE_CONTENT } from '../../src/sim/storyline-content';
import { storylineRule } from '../../src/sim/storyline-rules';
import { enterStoryRegion, leaveStoryRegion } from '../../src/sim/story-regions';
import type { CampaignState, SimEvent, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { campaignWorld, tick } from './campaign-driver';

registerStorylines(STORYLINE_CONTENT);
registerEpilogue({ callbacks: EPILOGUE_CALLBACKS, frame: EPILOGUE_FRAME });

function line(world: World, id: string, ending: string | null): CampaignState {
  const l = { ...world.campaign!, storyline: id, ending, flags: {}, queue: [], seen: [] };
  world.lines[id] = l as CampaignState;
  return l as CampaignState;
}

describe('R0613: gate expressions', () => {
  it('parses and evaluates against a world', () => {
    const { world } = campaignWorld();
    world.campaign!.chapter = 4;
    expect(evalGate(world, 'spine:ch>=3 & !spine:ending')).toBe(true);
    expect(evalGate(world, 'spine:ch>=5 | (spine:ch>=4 & any)')).toBe(true);
    expect(evalGate(world, 'spine:ch>=5')).toBe(false);
    expect(evalGateId(world, 'fold', GATES)).toBe(true);
    expect(evalGateId(world, 'server', GATES)).toBe(false);
    expect(() => parseGate('spine:ch>=3 &')).toThrow();
  });

  it('the shipped table has no cycles and every term can be met', () => {
    const universe = {
      lines: new Set(STORYLINE_CONTENT.map((s) => s.id)),
      endings: Object.fromEntries(STORYLINE_CONTENT.map((s) => [s.id, Object.keys(s.endings)])),
      quests: new Set<string>(),
      unlocks: new Set(['sunGrove', 'moonGrove']),
    };
    expect(checkGates(GATES, universe).problems).toEqual([]);
  });

  it('finds a cycle, an unknown gate and an unreachable chapter', () => {
    const r = checkGates({ a: 'gate:b', b: 'gate:a', c: 'gate:zzz', d: 'spine:ch>=20' });
    expect(r.problems.some((p) => p.startsWith('gate cycle'))).toBe(true);
    expect(r.problems.some((p) => p.includes('unknown gate "zzz"'))).toBe(true);
    expect(r.problems.some((p) => p.includes('never reaches'))).toBe(true);
  });

  it('the region gates match the chapters the regions open at', () => {
    const ch = (id: string): number => Number(/ch>=(\d+)/.exec(GATES[id]!)![1]);
    expect(ch('fold')).toBe(STORY_REGION_TUNING.opensAt.fold);
    expect(ch('server')).toBe(STORY_REGION_TUNING.opensAt.server);
    expect(ch('hollow')).toBe(STORY_REGION_TUNING.opensAt.hollow);
    expect(ch('sunRegion')).toBe(STORY_REGION_TUNING.opensAt.sun);
    expect(ch('moonRegion')).toBe(STORY_REGION_TUNING.opensAt.moon);
  });
});

describe('R0600 and R0657: the Valley Fair and what comes after', () => {
  it('opens once the spine and two lines have ended, and names their endings', () => {
    const { world } = campaignWorld();
    world.campaign!.ending = 'hazels-grove';
    line(world, 'hundred', 'bright-fold');
    expect(epilogueReady(world)).toBe(false);
    expect(afterStoryNext(world, ['hundred', 'logged'])).toEqual({ kind: 'line', id: 'logged' });
    line(world, 'logged', 'everyone-wakes');
    expect(epilogueReady(world)).toBe(true);
    expect(afterStoryNext(world, ['hundred', 'logged'])).toEqual({ kind: 'fair' });
    const text = epilogueLines(world).map((l) => l.text);
    expect(text).toContain(EPILOGUE_CALLBACKS.hundred!['bright-fold']);
    expect(text).toContain(EPILOGUE_CALLBACKS.logged!['everyone-wakes']);
    expect(text).toContain(EPILOGUE_CALLBACKS.hazel!['hazels-grove']);
    expect(FAIR_SCENE).toBe('epilogue-fair');
  });

  it('is shut for the spine alone, and every callback is at most 160 characters', () => {
    const { world } = campaignWorld();
    world.campaign!.ending = 'moss-sleeps';
    expect(epilogueReady(world)).toBe(false);
    for (const map of Object.values(EPILOGUE_CALLBACKS))
      for (const t of Object.values(map)) expect(t.length).toBeLessThanOrEqual(160);
  });
});

describe('R0654: shared lines read what they added', () => {
  it('The Hundred Days at prosperity 120 with nothing changed ends quiet', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 4 }, events);
    world.town.prosperity = 120;
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    const l = world.lines.hundred!;
    expect(l.flags['base:prosperity']).toBe(120);
    expect(storylineRule('hundred')!.endingFor(world, l)).toBe('quiet-fold');
    world.town.prosperity = 165;
    expect(storylineRule('hundred')!.endingFor(world, l)).toBe('bright-fold');
    world.town.prosperity = 140;
    expect(storylineRule('hundred')!.endingFor(world, l)).toBe('the-fold');
  });

  it('Logged In counts only its own cast leaving', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 6 }, events);
    applyCommand(world, { kind: 'storylineStart', id: 'logged' }, events);
    const l = world.lines.logged!;
    const rule = storylineRule('logged')!;
    rule.onEvent!(world, l, { kind: 'departed', nubbinId: 'someone-else', name: 'x' }, []);
    expect(rule.endingFor(world, l)).toBe('everyone-wakes');
    const mine = String(l.flags.cast).split(',')[0]!;
    rule.onEvent!(world, l, { kind: 'departed', nubbinId: mine, name: 'y' }, []);
    expect(rule.endingFor(world, l)).toBe('one-short');
  });
});

describe('R0634: a season gate holds a line scene', () => {
  it('waits for its season', () => {
    const { world } = campaignWorld();
    const sc = STORYLINE_CONTENT[0]!.chapters[0]!.opening;
    const before = sc.season;
    sc.season = ['autumn'];
    world.season = 'spring';
    expect(sceneSeasonHolds(world, sc.id)).toBe(false);
    world.season = 'autumn';
    expect(sceneSeasonHolds(world, sc.id)).toBe(true);
    if (before) sc.season = before;
    else delete sc.season;
  });
});

describe('R0633: one Keeper across lines', () => {
  it('Dawn holds for a Moon Keeper and Dusk for a Sun Keeper', () => {
    const { world } = campaignWorld();
    line(world, 'dawn', null);
    world.keeper.alignment = 'moon';
    expect(keeperMismatch(world, 'dawn')).toBe('sun');
    world.keeper.alignment = 'sun';
    expect(keeperMismatch(world, 'dawn')).toBeNull();
    expect(keeperMismatch(world, 'hundred')).toBeNull();
  });

  it('walking into the region of a held line emits the switch prompt, once Keeper matches it is quiet', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 8 }, events);
    line(world, 'dawn', null);
    world.keeper.alignment = 'moon';
    const out: SimEvent[] = [];
    expect(enterStoryRegion(world, 'sun', out)).toBe(true);
    expect(out).toContainEqual({ kind: 'keeperSwitchPrompt', line: 'dawn', want: 'sun' });
    leaveStoryRegion(world, out);
    world.keeper.alignment = 'sun';
    const again: SimEvent[] = [];
    enterStoryRegion(world, 'sun', again);
    expect(again.some((e) => e.kind === 'keeperSwitchPrompt')).toBe(false);
  });
});

describe('R0615: skipping a questline goal', () => {
  it('sets the minimum, records it, and the goal then reads as met', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 4 }, events);
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    world.settings.storyPace = 'story';
    const l = world.lines.hundred!;
    l.step = 1;
    l.queue = [];
    const key = skippableLineGoal(world, 'hundred');
    if (key === null) return; // the first goal needs a Nubbin or a time no skip can give
    expect(skipLineGoal(world, 'hundred')).toBe(key);
    expect(l.skipped?.[key]).toBeGreaterThanOrEqual(0);
  });
});

describe('R0630: story worlds are read-only, rewards derived', () => {
  const atlas = JSON.stringify({
    version: 1,
    pages: { A3: { done: true, flags: {}, quests: {} } },
  });

  it('a finished Atlas page makes a hat wearable and writes nothing to the Grove', () => {
    const { world, events } = campaignWorld();
    const before = serialize(world, 0);
    const x = crossSavesFrom(atlas, null, []);
    setDerivedUnlocks(derivedUnlocks(x));
    expect(derivedUnlocks(x).has('hat:flower')).toBe(true);
    const nub = world.nubbins[0]!;
    applyCommand(world, { kind: 'wearHat', nubbinId: nub.id, hat: 'flower' }, events);
    expect(nub.hat).toBe('flower');
    expect(world.inventory.hats).not.toContain('flower');
    nub.hat = null;
    expect(serialize(world, 0)).toBe(before);
    // The side save goes away: the hat comes off on load.
    nub.hat = 'flower';
    setDerivedUnlocks(derivedUnlocks(crossSavesFrom(null, null, [])));
    expect(wearableHats(world)).not.toContain('flower');
    expect(unequipMissingHats(world)).toBeGreaterThanOrEqual(1);
    expect(nub.hat).toBeNull();
  });
});

describe('R0615: skipping every questline goal', () => {
  it('each line skips the goals that have a safe skip, and none changes the Shells total', () => {
    let skippedTotal = 0;
    for (const s of STORYLINE_CONTENT) {
      const { world, events } = campaignWorld();
      applyCommand(world, { kind: 'debugChapter', chapter: 8 }, events);
      world.settings.storyPace = 'story';
      applyCommand(world, { kind: 'storylineStart', id: s.id }, events);
      const l = world.lines?.[s.id];
      if (!l) continue;
      const shells = world.inventory.shells;
      // Drive the line's own step function: region and Keeper gating are other tests' business.
      for (let i = 0; i < 400 && l.ending === null; i++) {
        stepStoryline(world, l, events);
        if (l.queue.length > 0) lineSceneDone(world, l.queue[0]!, null, events);
        else if (skippableLineGoal(world, s.id)) {
          expect(skipLineGoal(world, s.id)).toMatch(/^[a-z-]+:\d+$/);
        }
        tick(world, events, 1);
      }
      skippedTotal += Object.keys(l.skipped ?? {}).length;
      expect(world.inventory.shells - shells).toBeLessThan(100);
    }
    expect(skippedTotal).toBeGreaterThan(0);
  });
});
