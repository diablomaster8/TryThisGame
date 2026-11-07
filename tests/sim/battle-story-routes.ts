/**
 * Lane C round 8 (recs FIGHT-82): the eight ending routes of the bouts-on-Skip replay, shared by
 * `battle-story-replay.test.ts` and `-b.test.ts`. Split in two files (efficiency, 2026-11-07):
 * one test of all eight full campaigns ran 76 s and set the floor of a CI shard.
 */
import { expect } from 'vitest';
import { STORY_BOUTS, type StoryBoutId } from '../../src/sim/battle/story-bouts';
import { FINAL_CHAPTER } from '../../src/sim/campaign';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { c, campaignWorld, drive, moss, sable } from './campaign-driver';

type Hooks = Partial<Record<number, (w: World, e: SimEvent[]) => void>>;

const BASE = {
  'c2-corvin': 'refuse',
  'c3-open': 'slow',
  'c9-open': 'confront',
  'c12-open': 'keep',
};
const bonded = (w: World): void => {
  sable(w)!.trust = 80;
  sable(w)!.bond = true;
};

export const ROUTES: {
  ending: string;
  choices: Record<string, string>;
  hooks: Hooks;
  skip?: string[];
}[] = [
  {
    ending: 'hazels-grove',
    choices: BASE,
    hooks: { 7: bonded, 9: (w) => void (moss(w)!.needs.affection = 80) },
  },
  {
    ending: 'shadow-keeper',
    choices: { ...BASE, 'c9-open': 'force' },
    hooks: { 7: bonded, 9: (w) => void (moss(w)!.needs.affection = 80) },
  },
  {
    ending: 'moss-sleeps',
    choices: BASE,
    hooks: { 7: bonded, 9: (w) => void (moss(w)!.needs.affection = 10) },
  },
  {
    ending: 'wild-grove',
    choices: { ...BASE, 'c9-open': 'force', 'c12-open': 'free' },
    hooks: { 7: (w) => void (sable(w)!.trust = 50) },
  },
  {
    ending: 'empty-lantern',
    choices: BASE,
    hooks: { 11: (w) => void (w.nubbins = w.nubbins.filter((n) => n.id !== c(w).sableId)) },
  },
  {
    ending: 'collector',
    choices: { ...BASE, 'c2-corvin': 'sell' },
    hooks: { 1: (w, e) => w.nubbins.forEach((n) => n.stage === 'egg' && hatch(n, e, 0)) },
    skip: ['s27'],
  },
  {
    ending: 'eternal-dawn',
    choices: BASE,
    hooks: {
      7: (w) => {
        bonded(w);
        c(w).flags.eternalRaised = true;
      },
    },
  },
  { ending: 'long-road', choices: BASE, hooks: {} },
];

/** Take each story bout once it opens; leave a tactics board as soon as it is up. */
function takeBouts(w: World, events: SimEvent[], fought: Set<string>): void {
  if (w.tactics && !w.tactics.result) applyCommand(w, { kind: 'tacticsForfeit' }, events);
  if (w.tactics?.result) applyCommand(w, { kind: 'tacticsClose' }, events);
  // A finished bout stays in world.battle until the screen closes it: only a live one waits.
  if ((w.battle && !w.battle.result) || w.tactics) return;
  for (const id of Object.keys(STORY_BOUTS) as StoryBoutId[]) {
    if (fought.has(id) || !STORY_BOUTS[id].open(w)) continue;
    fought.add(id);
    applyCommand(w, { kind: 'storyBout', id, fight: true }, events);
    if (w.tactics) {
      applyCommand(w, { kind: 'tacticsForfeit' }, events);
      applyCommand(w, { kind: 'tacticsClose' }, events);
    }
    return;
  }
}

/**
 * Replays `routes` with every story bout taken as it opens, checks each ending, and checks the
 * bouts inside the campaign came up and were taken (the post-game one comes after).
 */
export function replayRoutes(routes: typeof ROUTES): void {
  const fought = new Set<string>();
  for (const r of routes) {
    const { world, events } = campaignWorld();
    world.settings.bouts = 'skip';
    const mine = new Set<string>();
    drive(world, events, r.choices, r.hooks, {
      ...(r.skip ? { skip: r.skip } : {}),
      until: (w) => {
        takeBouts(w, events, mine);
        // As runCampaign stops: past the last chapter with the ending's scenes played.
        return c(w).chapter > FINAL_CHAPTER && c(w).queue.length === 0;
      },
    });
    expect(c(world).ending, r.ending).toBe(r.ending);
    // A skipped bout is left finished in world.battle, as a played one would be.
    expect(!world.battle || world.battle.result !== null, r.ending).toBe(true);
    expect(world.tactics ?? null, r.ending).toBeNull();
    // Turn bouts resolve on Skip and count as won (lane C r8: they used to wait on screen).
    expect(world.storyBouts?.exhibition, r.ending).toBe('won');
    for (const id of mine) fought.add(id);
  }
  for (const id of ['exhibition', 'rumble', 'corvin']) expect(fought, id).toContain(id);
}
