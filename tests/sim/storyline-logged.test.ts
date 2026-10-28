import { describe, expect, it } from 'vitest';
import { BATTLE } from '../../src/config/tuning-battle';
import { STORYLINE_LOGGED } from '../../src/content/storyline-logged';
import { goalMet } from '../../src/sim/campaign';
import { boutTier, loggedPartyIds } from '../../src/sim/storyline-rules-logged';
import { journalView } from '../../src/sim/storyline';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { c, settle, storylineWorld, toChapter } from './storyline-driver';

function winBouts(world: World, events: SimEvent[], n: number): void {
  for (let i = 0; i < n; i++)
    applyCommand(world, { kind: 'partyBoutResult', won: true, tier: 1, shells: 5 }, events);
}

function toTheBoard(world: World, events: SimEvent[]): void {
  expect(toChapter(world, events, 1)).toBe(true);
  for (const id of loggedPartyIds(c(world)))
    applyCommand(world, { kind: 'debugHatchNow', nubbinId: id }, events);
  expect(toChapter(world, events, 2)).toBe(true);
  expect(journalView(world, c(world), false)?.actions[0]).toMatchObject({
    id: 'bout',
    ui: 'partyBout',
    enabled: true,
  });
  expect(boutTier(c(world))).toBe(1);
  // A lost bout counts for nothing; a won one does.
  applyCommand(world, { kind: 'partyBoutResult', won: false, tier: 1, shells: 5 }, events);
  expect(goalMet(world, c(world))).toBe(false);
  const shells = world.inventory.shells;
  winBouts(world, events, 1);
  // The sim pays the tier prize, whatever the screen claims (recs FIGHT-02).
  expect(world.inventory.shells).toBe(shells + BATTLE.prizes.party[0]);
  expect(toChapter(world, events, 3)).toBe(true);
  // The Night Grove is shut until rank two.
  applyCommand(world, { kind: 'storyArea', area: 'night' }, events);
  expect(world.grove).toBe('sun');
  winBouts(world, events, 2);
  expect(toChapter(world, events, 4)).toBe(true);
  expect(boutTier(c(world))).toBe(2);
  winBouts(world, events, 2);
  expect(goalMet(world, c(world))).toBe(false);
  applyCommand(world, { kind: 'storyArea', area: 'night' }, events);
  expect(world.grove).toBe('moon');
  expect(toChapter(world, events, 5)).toBe(true);
  expect(c(world).seen).toContain('l-c4-night');
}

function toTheEnd(
  world: World,
  events: SimEvent[],
  root: 'expose' | 'spare',
  juno: 'stayed' | 'left' = 'stayed',
): string {
  applyCommand(world, { kind: 'storyAct', label: 'read-the-board' }, events);
  expect(toChapter(world, events, 6)).toBe(true);
  expect(c(world).flags['l-sister']).toBe(true);
  winBouts(world, events, 3);
  // Chapter 7's opening carries the choice, so its goal is met the moment it plays.
  expect(
    settle(world, events, () => c(world).chapter === 8 && c(world).step === 1, 40, {
      'l-c7-open': root,
    }),
  ).toBe(true);
  expect(c(world).flags['l-root']).toBe(root);
  winBouts(world, events, 2);
  settle(
    world,
    events,
    () => c(world).ending !== null && c(world).seen.includes(`end-logged-${c(world).ending}`),
    20,
    { 'l-c8-close': juno },
  );
  const ending = c(world).ending ?? '';
  // The last choice is answered in the ending's body, which plays before the title card.
  const body = c(world).seen.indexOf(`l-end-${ending}-${juno}`);
  expect(body, `l-end-${ending}-${juno}`).toBeGreaterThanOrEqual(0);
  expect(body).toBeLessThan(c(world).seen.indexOf(`end-logged-${ending}`));
  expect(c(world).seen.filter((s) => s.startsWith('l-end-')).length).toBe(1);
  return ending;
}

describe('S2 Logged In', () => {
  it('is registered with eight chapters and three endings whose scenes exist', () => {
    expect(STORYLINE_LOGGED.chapters.length).toBe(8);
    for (const id of Object.keys(STORYLINE_LOGGED.endings))
      expect(
        STORYLINE_LOGGED.extra.some((s) => s.id === `end-logged-${id}`),
        id,
      ).toBe(true);
  });

  it('starts with three starter eggs as the party on the Day server', () => {
    const { world } = storylineWorld('logged', 'byte');
    expect(world.nubbins.length).toBe(5); // the two starter eggs stay, plus the party
    const party = world.nubbins.slice(2);
    expect(loggedPartyIds(c(world))).toEqual(party.map((n) => n.id));
    expect(world.partners[0]).toBe(party[0]!.id);
    expect(world.unlocks.moonGrove).toBe(true);
    expect(world.grove).toBe('sun');
    expect(journalView(world, c(world), false)?.areas).toEqual(['day', 'night']);
  });

  it('keeps the sibling thread behind the Mature content setting', () => {
    const off = storylineWorld('logged', 'byte');
    toTheBoard(off.world, off.events);
    applyCommand(off.world, { kind: 'storyAct', label: 'read-the-board' }, off.events);
    expect(toChapter(off.world, off.events, 6)).toBe(true);
    expect(c(off.world).seen).not.toContain('l-c5-thread');
    const teen = storylineWorld('logged', 'byte');
    teen.world.settings.matureContent = 'teen';
    toTheBoard(teen.world, teen.events);
    applyCommand(teen.world, { kind: 'storyAct', label: 'read-the-board' }, teen.events);
    expect(toChapter(teen.world, teen.events, 6)).toBe(true);
    expect(c(teen.world).seen).toContain('l-c5-thread');
    expect(c(teen.world).flags['l-paid']).toBe(true);
  });

  it('ends with everyone waking when Root’s word is said and the party came through', () => {
    const { world, events } = storylineWorld('logged', 'byte');
    toTheBoard(world, events);
    expect(toTheEnd(world, events, 'expose')).toBe('everyone-wakes');
    expect(c(world).seen).toContain('end-logged-everyone-wakes');
  });

  it('ends with the quiet exit when the company’s word is taken', () => {
    const { world, events } = storylineWorld('logged', 'byte');
    toTheBoard(world, events);
    expect(toTheEnd(world, events, 'spare', 'left')).toBe('quiet-exit');
  });

  it('answers the last choice in every ending, both ways', () => {
    for (const juno of ['stayed', 'left'] as const)
      for (const id of Object.keys(STORYLINE_LOGGED.endings))
        expect(
          STORYLINE_LOGGED.extra.some((s) => s.id === `l-end-${id}-${juno}`),
          `${id}-${juno}`,
        ).toBe(true);
    const { world, events } = storylineWorld('logged', 'byte');
    toTheBoard(world, events);
    expect(toTheEnd(world, events, 'expose', 'left')).toBe('everyone-wakes');
    expect(c(world).flags['l-juno']).toBe('left');
  });

  it('ends one short when a partner departed on the way', () => {
    const { world, events } = storylineWorld('logged', 'byte');
    toTheBoard(world, events);
    c(world).flags['n:departed'] = 1;
    expect(toTheEnd(world, events, 'expose')).toBe('one-short');
  });
});
