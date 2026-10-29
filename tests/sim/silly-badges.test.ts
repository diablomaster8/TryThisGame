import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { ACHIEVEMENT_LIST, stepAchievements } from '../../src/sim/achievements';
import { ACHIEVEMENT_TEXT } from '../../src/config/strings-badges';
import type { SimEvent, World } from '../../src/sim/types';
import { c, campaignWorld } from './campaign-driver';

// R0315 (FUN-26): 45 badges, titles out of the sim, and a trigger for every joke badge.

type Setup = (w: World) => SimEvent[];
const times = (n: number, e: SimEvent): SimEvent[] => Array.from({ length: n }, () => e);
const nid = (w: World): string => w.nubbins[0]!.id;

const TRIGGERS: Record<string, Setup> = {
  gravity: (w) => [{ kind: 'bonked', nubbinId: nid(w), by: 'fruit' }],
  patter: (w) => ((c(w).stats.pets = 100), []),
  ruleFour: (w) => ((c(w).stats.feeds = 10), []),
  bonkAppetit: (w) => {
    w.nubbins[0]!.behavior.state = 'findFood';
    return [{ kind: 'bonked', nubbinId: nid(w), by: 'fruit' }];
  },
  neverEver: (w) => [{ kind: 'evolved', nubbinId: nid(w) } as SimEvent],
  stopwatchSix: (w) => {
    c(w).chapter = 5;
    c(w).flags['byte-watch-races'] = 6;
    return [];
  },
  goodStone: (w) => {
    for (const ch of [1, 2, 3, 4, 5]) c(w).flags[`fern-stone-tap:${ch}`] = true;
    return [];
  },
  liftAndPush: (w) => ((c(w).flags['c1-gate-pushed'] = true), []),
  snackDiplomacy: () => times(3, { kind: 'strayFed', ok: true, name: 'Pip' }),
  whoopsADaisy: (w) => times(2, { kind: 'bonked', nubbinId: nid(w), by: 'obstacle' }),
  legDay: (w) => ((c(w).stats.expeditions = 10), []),
  springStep: () => times(10, { kind: 'springBounced', id: 'm1' }),
  shakeItOff: () => times(25, { kind: 'treeShaken', treeId: 't1' }),
  eggWhisperer: (w) => times(10, { kind: 'eggShaken', nubbinId: nid(w) }),
  puddlePerson: () => [{ kind: 'keeperDipped', shells: 0 }],
  skidMark: () => times(5, { kind: 'keeperSkid' }),
  lookAThing: () => [{ kind: 'lookoutFind', id: 'l1', shells: 1, critter: null }],
  tickleMonster: (w) =>
    times(20, { kind: 'interacted', nubbinId: nid(w), action: 'tickle', ok: true }),
  highFiveClub: (w) =>
    times(10, { kind: 'interacted', nubbinId: nid(w), action: 'highFive', ok: true }),
  hugMileage: (w) => times(50, { kind: 'interacted', nubbinId: nid(w), action: 'hug', ok: true }),
  smallTalk: () => times(30, { kind: 'talked', npcId: 'n1' }),
  heardItBefore: (w) => ((c(w).flags['fern-stone-taps'] = 10), []),
  openHouse: () => times(5, { kind: 'visitor', trainer: 'byte', gift: null }),
  hatTrick: (w) => times(3, { kind: 'dyed', nubbinId: nid(w), slot: 'hat' }),
  downTheHole: () => [{ kind: 'descended', depth: 1, daily: false }],
};

describe('silly badges', () => {
  it('has 45 badges, 25 of them silly, every one with text', () => {
    expect(ACHIEVEMENT_LIST).toHaveLength(45);
    expect(ACHIEVEMENT_LIST.filter((a) => a.silly)).toHaveLength(25);
    for (const a of ACHIEVEMENT_LIST) {
      expect(ACHIEVEMENT_TEXT[a.id]?.title, a.id).toBeTruthy();
      expect(ACHIEVEMENT_TEXT[a.id]?.blurb, a.id).toBeTruthy();
    }
  });

  it('keeps no badge titles in the sim', () => {
    const src = readFileSync('src/sim/achievements.ts', 'utf8');
    for (const t of Object.values(ACHIEVEMENT_TEXT)) expect(src).not.toContain(`'${t.title}'`);
  });

  for (const a of ACHIEVEMENT_LIST.filter((x) => x.silly)) {
    it(`${a.id} triggers`, () => {
      const { world } = campaignWorld('fern');
      world.nubbins[0]!.stage = 'child';
      const setup = TRIGGERS[a.id];
      expect(setup, `no trigger for ${a.id}`).toBeDefined();
      const ev = setup!(world);
      stepAchievements(world, [...ev]);
      expect(world.achievements[a.id], a.id).toBeDefined();
    });
  }

  it('one less than the count earns nothing', () => {
    const { world } = campaignWorld('fern');
    stepAchievements(
      world,
      times(19, { kind: 'interacted', nubbinId: nid(world), action: 'tickle', ok: true }),
    );
    expect(world.achievements.tickleMonster).toBeUndefined();
  });
});
